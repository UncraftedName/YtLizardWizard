package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/gorilla/websocket"
)

type syncedLoggerData struct {
	writers []io.Writer
	locks   []sync.Mutex
	flags   int
}

var _ io.Writer = (*syncedLoggerData)(nil)

func SyncedLoggerData(log_flags int, writers ...io.Writer) *syncedLoggerData {
	allWriters := make([]io.Writer, 0, len(writers))
	for _, w := range writers {
		if mw, ok := w.(*syncedLoggerData); ok {
			allWriters = append(allWriters, mw.writers...)
		} else {
			allWriters = append(allWriters, w)
		}
	}
	return &syncedLoggerData{
		writers: allWriters,
		locks:   make([]sync.Mutex, len(writers)),
		flags:   log_flags,
	}
}

func (sld *syncedLoggerData) NewLogger(prefix string) *log.Logger {
	return log.New(sld, prefix, sld.flags)
}

// lock only a single writer at a time instead of using a single lock for all writers
func (sld *syncedLoggerData) Write(p []byte) (n int, err error) {
	if len(sld.locks) != len(sld.writers) {
		log.Panicf("bad mutex count")
	}
	for i, w := range sld.writers {
		if i == 0 {
			sld.locks[i].Lock()
		}
		err := func() error {
			defer sld.locks[i].Unlock()
			if _, err := w.Write(p); err != nil {
				return err
			}
			if i < len(sld.writers)-1 {
				sld.locks[i+1].Lock()
			}
			return nil
		}()
		if err != nil {
			return 0, err
		}
	}
	return len(p), nil
}

type handlerData struct {
	conn *websocket.Conn
	lg   *log.Logger
	wg   *sync.WaitGroup
	// When the server wants to shutdown, the channel will be closed and the context will be cancelled
	quitChan     chan struct{}
	quitCtx      context.Context
	closeTimeout time.Duration
}

func main() {
	logPath := "wizard.log"
	logFile, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Panicf("Failed to open log file \"%s\": %v", logPath, err)
	}
	defer logFile.Close()

	sld := SyncedLoggerData(log.Lshortfile|log.Lmicroseconds|log.Ldate, logFile, os.Stdout)
	lgMain := sld.NewLogger("[main] ")
	lgMain.Println("Initializing...")

	wg := sync.WaitGroup{}

	quitChan := make(chan struct{})
	quitCtx, cancelFunc := context.WithCancelCause(context.Background())
	wg.Add(1)
	go func() {
		defer wg.Done()
		<-quitChan
		cancelFunc(errors.New("server requested shutdown"))
	}()

	shutdownTimeout := 1000 * time.Millisecond

	// for tracking the number of open HTTP connections
	var nCons, nCurCons uint16
	var countMutex sync.Mutex

	mux := http.NewServeMux()
	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {

		lg := sld.NewLogger(fmt.Sprintf("[conn %d] ", nCons))
		countMutex.Lock()
		nCons++
		nCurCons++
		lg.Printf("New HTTP connection (%d active).\n", nCurCons)
		countMutex.Unlock()

		conn, err := (&websocket.Upgrader{
			// TODO - try removing this
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
			HandshakeTimeout:  shutdownTimeout / 2,
			EnableCompression: true,
		}).Upgrade(w, r, nil)

		if err != nil {
			lg.Printf("Failed to upgrade connection to WebSocket: %v.\n", err)
		} else {
			lg.Println("Upgraded to WebSocket.")
			handleWebSocketConnection(handlerData{
				conn:         conn,
				lg:           lg,
				wg:           &wg,
				quitChan:     quitChan,
				quitCtx:      quitCtx,
				closeTimeout: shutdownTimeout / 2,
			})
		}

		countMutex.Lock()
		nCurCons--
		lg.Printf("Connection closed (%d active).\n", nCurCons)
		countMutex.Unlock()
	})

	server := &http.Server{
		Addr:        "127.0.0.1:8080",
		Handler:     mux,
		ReadTimeout: shutdownTimeout / 2,
	}

	chanTerm := make(chan os.Signal, 1)
	signal.Notify(chanTerm, syscall.SIGTERM, syscall.SIGINT)

	serverCloseChan := make(chan struct{}, 1)
	lgMain.Printf("Starting server on %s...\n", server.Addr)
	wg.Add(1)
	go func() {
		defer wg.Done()
		if err := server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			lgMain.Printf("server.ListenAndServer error: %v\n", err)
		}
		serverCloseChan <- struct{}{}
	}()

	select {
	case <-chanTerm:
		lgMain.Println("Interrupt signal received, shutting down...")
	case <-serverCloseChan:
		lgMain.Println("Server closed, cleaning up...")
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		serverCtx, _ := context.WithTimeoutCause(
			context.Background(),
			shutdownTimeout,
			errors.New("server shutdown timeout expired"),
		)
		err = server.Shutdown(serverCtx)
		if err != nil {
			lgMain.Printf("server.Shutdown error: %v\n", err)
		}
	}()

	close(quitChan)
	wg.Wait()

	lgMain.Println("Done.")
}

func handleWebSocketConnection(hData handlerData) {

	// This channel accepts the string that is sent as a close message.
	// There are 3 ways to call it (via the quit channel and via an
	// error on read/write), and it should never block.
	closeWsChan := make(chan string, 3)

	hData.wg.Add(1)
	go func() {
		select {
		case <-hData.quitChan:
			closeWsChan <- "received quit signal from user"
		case <-closeWsChan:
		}
		hData.wg.Done()
	}()

	hData.wg.Add(1)
	go func() {
		errMsg := <-closeWsChan
		if errMsg != "" {
			hData.lg.Printf("--> close message: %s.\n", errMsg)
			err := hData.conn.WriteControl(
				websocket.CloseMessage,
				websocket.FormatCloseMessage(1, errMsg),
				time.Now().Add(hData.closeTimeout),
			)
			if err == nil {
				hData.lg.Printf("Error sending close message: %v.\n", err)
			}
		}
		err := hData.conn.Close()
		if err != nil {
			hData.lg.Printf("Error closing websocket connection: %v.\n", err)
		}
		hData.wg.Done()
	}()

	// read loop
	for {
		messageType, message, err := hData.conn.ReadMessage()
		if err != nil {
			hData.lg.Printf("conn.ReadMessage error: %v.\n", err)
			closeWsChan <- ""
			break
		}
		hData.lg.Printf("<-- received message type %d with %d bytes.\n", messageType, len(message))
		if messageType != websocket.BinaryMessage {
			closeWsChan <- fmt.Sprintf("expected binary message but got type %d", messageType)
			break
		}
	}
	close(closeWsChan)
}
