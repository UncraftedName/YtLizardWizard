package main

import (
	"io"
	"log"
	"os"
	"sync"
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

func main() {
	logPath := "wizard.log"
	logFile, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Panicf("Failed to open log file \"%s\": %v", logPath, err)
	}
	defer logFile.Close()

	sld := SyncedLoggerData(log.Lshortfile|log.Lmicroseconds|log.Ldate, logFile, os.Stdout)
	logger := sld.NewLogger("[main] ")
	logger2 := sld.NewLogger("[main2] ")

	logger.Println("AHHHHHH")
	logger2.Printf("something else: %d", 32)
}
