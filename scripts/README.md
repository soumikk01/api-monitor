# APINest — Install Scripts

Two scripts. Works for **Java, Node.js, Python** — no Node.js required on the user's machine.

---

## Linux / macOS

```bash
APINEST_TOKEN=your_token_here bash -c "$(curl -fsSL https://apinest.io/install.sh)"
```

## Windows (PowerShell)

```powershell
$env:APINEST_TOKEN="your_token_here"; iwr https://apinest.io/install.ps1 | iex
```

---

## What it auto-does

| Language | Action |
|---|---|
| **Java** (Spring Boot) | Copies `ApiMonitorFilter.java` into your package, adds token to `application.properties` |
| **Node.js** (Express/NestJS) | Creates `apinest-monitor.js`, adds token to `.env` |
| **Python** (FastAPI/Flask/Django) | Creates `apinest_monitor.py`, adds token to `.env` |

After running → start your app normally → APIs appear in dashboard.

---

## Force a specific language

```bash
LANG=java APINEST_TOKEN=xxx bash -c "$(curl -fsSL https://apinest.io/install.sh)"
```

```powershell
.\install.ps1 -Lang java -Token xxx
```
