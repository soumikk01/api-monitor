// monitor/monitor.go
// ====================
// Drop-in HTTP middleware for Go that captures every incoming request
// and forwards batches to the API Monitor dashboard.
//
// Works with net/http, chi, gorilla/mux, gin (any framework that accepts http.Handler).
//
// Usage:
//   mux := http.NewServeMux()
//   // ... register your routes ...
//   http.ListenAndServe(":8080", monitor.Middleware(mux))
//
// Config (env vars — same as Node.js CLI):
//   APINEST_SDK_TOKEN    — your service SDK token (required)
//   APINEST_BACKEND_URL  — e.g. http://localhost:4000 (required)

package monitor

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
	sdkToken   = os.Getenv("APINEST_SDK_TOKEN")
	backendURL = strings.TrimRight(getEnvOrDefault("APINEST_BACKEND_URL", "http://localhost:4000"), "/")
	ingestURL  = backendURL + "/api/v1/ingest"
)

func getEnvOrDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

// ── Event ─────────────────────────────────────────────────────────────────────

type apiEvent struct {
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

const maxQueueSize = 1000

var (
	eventQueue = make([]apiEvent, 0, 256)
	queueMu    sync.Mutex
)

func enqueue(ev apiEvent) {
	queueMu.Lock()
	defer queueMu.Unlock()
	if len(eventQueue) >= maxQueueSize {
		eventQueue = eventQueue[1:] // drop oldest
	}
	eventQueue = append(eventQueue, ev)
}

func drain() []apiEvent {
	queueMu.Lock()
	defer queueMu.Unlock()
	if len(eventQueue) == 0 {
		return nil
	}
	batch := make([]apiEvent, len(eventQueue))
	copy(batch, eventQueue)
	eventQueue = eventQueue[:0]
	return batch
}

// ── Background Sender ─────────────────────────────────────────────────────────

var senderOnce sync.Once

func startSender() {
	senderOnce.Do(func() {
		if sdkToken == "" {
			fmt.Println("[api-monitor] ⚠️  APINEST_SDK_TOKEN not set — monitoring disabled")
			return
		}
		fmt.Printf("[api-monitor] ✅ Sender active → %s\n", ingestURL)
		go func() {
			ticker := time.NewTicker(500 * time.Millisecond)
			defer ticker.Stop()
			client := &http.Client{Timeout: 5 * time.Second}
			for range ticker.C {
				drainAndSend(client)
			}
		}()
	})
}

func drainAndSend(client *http.Client) {
	batch := drain()
	if len(batch) == 0 {
		return
	}
	payload, err := json.Marshal(map[string]interface{}{
		"sdkToken": sdkToken,
		"events":   batch,
	})
	if err != nil {
		return
	}
	resp, err := client.Post(ingestURL, "application/json", bytes.NewReader(payload))
	if err != nil {
		fmt.Printf("[api-monitor] ⚠️  Failed to send batch: %v\n", err)
		// Re-queue on failure
		for _, ev := range batch {
			enqueue(ev)
		}
		return
	}
	resp.Body.Close()
}

// ── Status-capturing ResponseWriter ──────────────────────────────────────────

type statusWriter struct {
	http.ResponseWriter
	status int
	wrote  bool
}

func (sw *statusWriter) WriteHeader(code int) {
	if !sw.wrote {
		sw.status = code
		sw.wrote = true
	}
	sw.ResponseWriter.WriteHeader(code)
}

func (sw *statusWriter) Write(b []byte) (int, error) {
	if !sw.wrote {
		sw.status = http.StatusOK
		sw.wrote = true
	}
	return sw.ResponseWriter.Write(b)
}

// ── Middleware ────────────────────────────────────────────────────────────────

// Middleware wraps any http.Handler and captures every request for monitoring.
//
//	http.ListenAndServe(":8080", monitor.Middleware(yourMux))
func Middleware(next http.Handler) http.Handler {
	startSender()
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startedAt := time.Now()
		sw := &statusWriter{ResponseWriter: w, status: http.StatusOK}

		// Build URL
		scheme := "http"
		url := scheme + "://" + r.Host + r.RequestURI

		// Collect request headers
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

		enqueue(apiEvent{
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
