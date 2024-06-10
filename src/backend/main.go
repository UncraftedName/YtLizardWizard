package main

import (
	"io"
	"log"
	"os"
)

func main() {
	logPath := "lizard.log"
	logFile, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Panicf("Failed to open log file \"%s\": %v", logPath, err)
	}
	defer logFile.Close()

	log.SetOutput(io.MultiWriter(logFile, os.Stdout))
	log.SetFlags(log.Lshortfile | log.Lmicroseconds | log.Ldate)

	log.Println("AHHHHHH")
}
