# api-nest-cli

> Official CLI for [API Nest](https://github.com/soumikk01/api-monitor) — intercept and stream HTTP calls from your dev app to your live monitoring dashboard.

## Install

```bash
npx api-nest-cli@latest init --token <your-sdk-token>
```

Or install globally:

```bash
npm install -g api-nest-cli
```

## Usage

### `api-nest init`

Initialize API Nest monitoring in your project. Run this inside your project's root directory:

```bash
api-nest init --token sdk_xxxxxxxxxxxxxxxxxxxx
```

#### Options

| Option | Required | Description |
|---|---|---|
| `--token <token>` | ✅ Yes | Your SDK token (found in Dashboard → Get Command) |
| `--project <projectId>` | No | Project ID to associate calls with |
| `--backend <url>` | No | Custom backend URL (default: `http://localhost:4000`) |

### What it does

Running `api-nest init` will:
1. Save your config to `.api-nest.json` in the current directory
2. Inject a `require('api-nest-cli/register')` line at the top of your app's entry point
3. Activate HTTP interceptors (both `axios` and native `fetch`) automatically

From then on, every HTTP call your dev app makes is captured and streamed in real-time to your API Nest dashboard.

## How it works

```
Your Dev App  ──(axios/fetch)──►  api-nest-cli interceptor  ──(WebSocket)──►  API Nest Dashboard
```

The interceptor patches both `axios` and the global `fetch` function to capture:
- Method, URL, host, path
- Status code & latency
- Timestamp

All captured calls appear instantly in the **Live Feed** and **History** tabs of your dashboard.

## Requirements

- Node.js >= 18
- An API Nest account with a backend running (self-hosted or cloud)

## Get your SDK token

1. Log in at your API Nest dashboard
2. Click **Get Command** on the home screen
3. Copy the `--token` value from the displayed command

## License

MIT
