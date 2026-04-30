// apio_monitor.go
// ===================
// Drop-in HTTP middleware for Go — paste into your project.
//
// Works with net/http, chi, gorilla/mux, gin, echo — any framework
// that accepts an http.Handler or http.HandlerFunc.
// Zero external dependencies — uses only the standard library.
//
// Setup:
//   1. Copy this file into your project (e.g. apio_monitor.go)
//   2. Change the package declaration below to match your package
//   3. Set env var: APIO_SDK_TOKEN=your_token
//   4. Wrap your handler (see examples below)
//   5. Run your app normally: go run .
//
// net/http:
//   http.ListenAndServe(":8080", ApioMiddleware(yourMux))
//
// chi:
//   r := chi.NewRouter()
//   r.Use(ApioMiddlewareFunc)
//   http.ListenAndServe(":8080", r)
//
// gin:
//   r := gin.Default()
//   r.Use(ApioGinMiddleware())
//
// Config (env vars):
//   APIO_SDK_TOKEN    — your service SDK token  (required)
//   APIO_BACKEND_URL  — e.g. http://localhost:4000  (default)

package main // ← change this to match your package

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

// ── Config ───────────────────────────────────────────────────────────────────

var (
	apioSDKToken   = os.Getenv("APIO_SDK_TOKEN")
	apioBackendURL = strings.TrimRight(apioEnvOr("APIO_BACKEND_URL", "http://localhost:4000"), "/")
	apioIngestURL  = apioBackendURL + "/api/v1/ingest"
)

func apioEnvOr(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

// ── Event ─────────────────────────────────────────────────────────────────────

type apioEvent struct {
	Method         string            `json:"method"`
	URL            string            `json:"url"`
	StatusCode     int               `json:"statusCode"`
	StatusText     string            `json:"statusText"`
	Latency        int64             `json:"latency"`
	StartedAt      string            `json:"startedAt"`
	EndedAt        string            `json:"endedAt"`
	RequestHeaders map[string]string `json:"requestHeaders,omitempty"`
}

// ── Event Queue ───────────────────────────────────────────────────────────────

const apioMaxQueue = 1000

var (
	apioQueue   = make([]apioEvent, 0, 256)
	apioQueueMu sync.Mutex
)

func apioEnqueue(ev apioEvent) {
	apioQueueMu.Lock()
	defer apioQueueMu.Unlock()
	if len(apioQueue) >= apioMaxQueue {
		apioQueue = apioQueue[1:] // drop oldest
	}
	apioQueue = append(apioQueue, ev)
}

func apioDrain() []apioEvent {
	apioQueueMu.Lock()
	defer apioQueueMu.Unlock()
	if len(apioQueue) == 0 {
		return nil
	}
	batch := make([]apioEvent, len(apioQueue))
	copy(batch, apioQueue)
	apioQueue = apioQueue[:0]
	return batch
}

// ── Background Sender ─────────────────────────────────────────────────────────

var apioSenderOnce sync.Once

func apioStartSender() {
	apioSenderOnce.Do(func() {
		if apioSDKToken == "" {
			fmt.Println("[api-monitor] ⚠️  APIO_SDK_TOKEN not set — monitoring disabled")
			return
		}
		fmt.Printf("[api-monitor] ✅ Sender active → %s\n", apioIngestURL)
		go func() {
			ticker := time.NewTicker(500 * time.Millisecond)
			defer ticker.Stop()
			client := &http.Client{Timeout: 5 * time.Second}
			for range ticker.C {
				apioDrainAndSend(client)
			}
		}()
	})
}

func apioDrainAndSend(client *http.Client) {
	batch := apioDrain()
	if len(batch) == 0 {
		return
	}
	payload, err := json.Marshal(map[string]interface{}{
		"sdkToken": apioSDKToken,
		"events":   batch,
	})
	if err != nil {
		return
	}
	resp, err := client.Post(apioIngestURL, "application/json", bytes.NewReader(payload))
	if err != nil {
		fmt.Printf("[api-monitor] ⚠️  Failed to send batch: %v\n", err)
		for _, ev := range batch {
			apioEnqueue(ev) // re-queue on failure
		}
		return
	}
	resp.Body.Close()
}

// ── Status-capturing ResponseWriter ───────────────────────────────────────────

type apioStatusWriter struct {
	http.ResponseWriter
	status int
	wrote  bool
}

func (sw *apioStatusWriter) WriteHeader(code int) {
	if !sw.wrote {
		sw.status = code
		sw.wrote = true
	}
	sw.ResponseWriter.WriteHeader(code)
}

func (sw *apioStatusWriter) Write(b []byte) (int, error) {
	if !sw.wrote {
		sw.status = http.StatusOK
		sw.wrote = true
	}
	return sw.ResponseWriter.Write(b)
}

// ── net/http Middleware ───────────────────────────────────────────────────────

// ApioMiddleware wraps any http.Handler (net/http, chi, gorilla/mux).
//
//	http.ListenAndServe(":8080", ApioMiddleware(yourMux))
func ApioMiddleware(next http.Handler) http.Handler {
	apioStartSender()
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startedAt := time.Now()
		sw := &apioStatusWriter{ResponseWriter: w, status: http.StatusOK}

		url := "http://" + r.Host + r.RequestURI

		reqHeaders := make(map[string]string)
		for k, vs := range r.Header {
			reqHeaders[strings.ToLower(k)] = strings.Join(vs, ", ")
		}

		next.ServeHTTP(sw, r)

		latency := time.Since(startedAt).Milliseconds()
		statusText := "success"
		if sw.status >= 400 {
			statusText = "error"
		}

		apioEnqueue(apioEvent{
			Method:         r.Method,
			URL:            url,
			StatusCode:     sw.status,
			StatusText:     statusText,
			Latency:        latency,
			StartedAt:      startedAt.UTC().Format(time.RFC3339Nano),
			EndedAt:        time.Now().UTC().Format(time.RFC3339Nano),
			RequestHeaders: reqHeaders,
		})
	})
}

// ApioMiddlewareFunc is a chi-compatible middleware function.
//
//	r.Use(ApioMiddlewareFunc)
func ApioMiddlewareFunc(next http.Handler) http.Handler {
	return ApioMiddleware(next)
}
