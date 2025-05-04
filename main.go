package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// Response represents a simple JSON response
type Response struct {
	Message string    `json:"message"`
	Time    time.Time `json:"time"`
}

// healthHandler responds to health checks
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	response := Response{
		Message: "Server is healthy",
		Time:    time.Now(),
	}
	
	json.NewEncoder(w).Encode(response)
}

// loggingMiddleware logs all requests
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Request: %s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Define the port
	port := "8080"
	
	// Create a new ServeMux (router)
	mux := http.NewServeMux()
	
	// Register routes
	mux.HandleFunc("/health", healthHandler)
	
	// Create a server with some sensible defaults
	server := &http.Server{
		Addr:         ":" + port,
		Handler:      loggingMiddleware(mux),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}
	
	// Start the server
	fmt.Printf("Server starting on port %s...\n", port)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}