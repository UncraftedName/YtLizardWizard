package main

import (
	"database/sql"
	_ "embed"
	"testing"

	_ "github.com/mattn/go-sqlite3"
)

//go:embed schema.sql
var schemaSQL string

func TestCreateSchema(t *testing.T) {
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		t.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	tx, err := db.Begin()
	if err != nil {
		t.Fatalf("failed to begin transaction %v", err)
	}
	_, err = db.Exec(schemaSQL)
	if err != nil {
		t.Fatalf("failed to execute schema.sql: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		t.Fatalf("failed to commit transaction %v", err)
	}
}
