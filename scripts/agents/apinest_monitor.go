// apinest_monitor.go
// ===================
// Drop-in HTTP middleware for Go — paste into your project.
//
// Works with net/http, chi, gorilla/mux, gin, echo — any framework
// that accepts an http.Handler or http.HandlerFunc.
// Zero external dependencies — uses only the standard library.
//
// Setup:
//   1. Copy this file into your project (e.g. apinest_monitor.go)
//   2. Change the package declaration below to match your package
//   3. Set env var: APINEST_SDK_TOKEN=your_token
//   4. Wrap your handler (see examples below)
//   5. Run your app normally: go run .
//
// net/http:
//   http.ListenAndServe(":8080", ApinestMiddleware(yourMux))
//
// chi:
//   r := chi.NewRouter()
//   r.Use(ApinestMiddlewareFunc)
//   http.ListenAndServe(":8080", r)
//
// gin:
//   r := gin.Default()
//   r.Use(ApinestGinMiddleware())
//
// Config (env vars):
//   APINEST_SDK_TOKEN    — your service SDK token  (required)
//   APINEST_BACKEND_URL  — e.g. http://localhost:4000  (default)

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
	apinestSDKToken   = os.Getenv("APINEST_SDK_TOKEN")
	apinestBackendURL = strings.TrimRight(apinestEnvOr("APINEST_BACKEND_URL", "http://localhost:4000"), "/")
	apinestIngestURL  = apinestBackendURL + "/api/v1/ingest"
)

func apinestEnvOr(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

// ── Event ─────────────────────────────────────────────────────────────────────

type apinestEvent struct {
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

const apinestMaxQueue = 1000

var (
	apinestQueue   = make([]apinestEvent, 0, 256)
	apinestQueueMu sync.Mutex
)

func apinestEnqueue(ev apinestEvent) {
	apinestQueueMu.Lock()
	defer apinestQueueMu.Unlock()
	if len(apinestQueue) >= apinestMaxQueue {
		apinestQueue = apinestQueue[1:] // drop oldest
	}
	apinestQueue = append(apinestQueue, ev)
}

func apinestDrain() []apinestEvent {
	apinestQueueMu.Lock()
	defer apinestQueueMu.Unlock()
	if len(apinestQueue) == 0 {
		return nil
	}
	batch := make([]apinestEvent, len(apinestQueue))
	copy(batch, apinestQueue)
	apinestQueue = apinestQueue[:0]
	return batch
}

// ── Background Sender ─────────────────────────────────────────────────────────

var apinestSenderOnce sync.Once

func apinestStartSender() {
	apinestSenderOnce.Do(func() {
		if apinestSDKToken == "" {
			fmt.Println("[api-monitor] ⚠️  APINEST_SDK_TOKEN not set — monitoring disabled")
			return
		}
		fmt.Printf("[api-monitor] ✅ Sender active → %s\n", apinestIngestURL)
		go func() {
			ticker := time.NewTicker(500 * time.Millisecond)
			defer ticker.Stop()
			client := &http.Client{Timeout: 5 * time.Second}
			for range ticker.C {
				apinestDrainAndSend(client)
			}
		}()
	})
}

func apinestDrainAndSend(client *http.Client) {
	batch := apinestDrain()
	if len(batch) == 0 {
		return
	}
	payload, err := json.Marshal(map[string]interface{}{
		"sdkToken": apinestSDKToken,
		"events":   batch,
	})
	if err != nil {
		return
	}
	resp, err := client.Post(apinestIngestURL, "application/json", bytes.NewReader(payload))
	if err != nil {
		fmt.Printf("[api-monitor] ⚠️  Failed to send batch: %v\n", err)
		for _, ev := range batch {
			apinestEnqueue(ev) // re-queue on failure
		}
		return
	}
	resp.Body.Close()
}

// ── Status-capturing ResponseWriter ───────────────────────────────────────────

type apinestStatusWriter struct {
	http.ResponseWriter
	status int
	wrote  bool
}

func (sw *apinestStatusWriter) WriteHeader(code int) {
	if !sw.wrote {
		sw.status = code
		sw.wrote = true
	}
	sw.ResponseWriter.WriteHeader(code)
}

func (sw *apinestStatusWriter) Write(b []byte) (int, error) {
	if !sw.wrote {
		sw.status = http.StatusOK
		sw.wrote = true
	}
	return sw.ResponseWriter.Write(b)
}

// ── net/http Middleware ───────────────────────────────────────────────────────

// ApinestMiddleware wraps any http.Handler (net/http, chi, gorilla/mux).
//
//	http.ListenAndServe(":8080", ApinestMiddleware(yourMux))
func ApinestMiddleware(next http.Handler) http.Handler {
	apinestStartSender()
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startedAt := time.Now()
		sw := &apinestStatusWriter{ResponseWriter: w, status: http.StatusOK}

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

		apinestEnqueue(apinestEvent{
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

// ApinestMiddlewareFunc is a chi-compatible middleware function.
//
//	r.Use(ApinestMiddlewareFunc)
func ApinestMiddlewareFunc(next http.Handler) http.Handler {
	return ApinestMiddleware(next)
}
