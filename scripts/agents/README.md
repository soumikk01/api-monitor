# APINest Agent Files
# ===================
# These are the standalone monitor files dropped into user projects
# by install.sh / install.ps1
#
# Files:
#   ApiMonitorFilter.java  — Spring Boot @Component filter
#   apinest_monitor.py     — ASGI/WSGI middleware (FastAPI, Flask, Django)
#   apinest_monitor.go     — net/http middleware (chi, gorilla/mux, gin)
#
# How the install scripts use them:
#   curl https://apinest.io/agents/ApiMonitorFilter.java > src/main/java/.../ApiMonitorFilter.java
#   curl https://apinest.io/agents/apinest_monitor.py   > apinest_monitor.py
#   curl https://apinest.io/agents/apinest_monitor.go   > apinest_monitor.go
#
# Each file:
#   - Has zero external dependencies
#   - Reads APINEST_SDK_TOKEN from environment
#   - Reads APINEST_BACKEND_URL from environment (default: http://localhost:4000)
#   - Batches events every 500ms → POST /api/v1/ingest
#   - Queues up to 1000 events in memory, drops oldest on overflow
#   - Re-queues failed batches for retry
