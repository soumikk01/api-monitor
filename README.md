<div align="center">
  <br />
  <h3>⚡ API NEST</h3>
  <p><strong>The modern, real-time observability platform for your backend services.</strong></p>
  <br />

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" /></a>
    <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
    <a href="https://bun.sh/"><img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" /></a>
  </p>
</div>

<hr />

## 📖 Overview

**Neural Architect API Monitor** is a professional, full-stack SaaS solution designed to provide real-time, deep visibility into your application's API traffic. Whether you are debugging, monitoring performance latency, or ensuring production stability, the API Monitor seamlessly intercepts HTTP requests and streams them to a beautiful Glassmorphic Dashboard.

Forget digging through terminal logs. Plug in the zero-config CLI tool and watch your traffic matrix light up in real-time.

<br />

## ✨ Key Features

- **🔴 Real-Time Observability**: Powered by WebSockets, watch your API traffic (`GET`, `POST`, errors, latencies) flow into the dashboard with zero delay.
- **🔌 Zero-Config Interceptor**: A drop-in `@api-monitor-cli` NPM package auto-patches `fetch` and `axios` natively. No code refactoring required.
- **🎨 Dual-Interface Platform**: 
  - **The Main App**: A beautiful, Spring Blossom themed observability suite with light/dark glassmorphic design.
  - **The Admin Panel**: A clean, scalable enterprise Next.js dashboard for multi-project and user token management.
- **🧱 Microservice Ready**: Built specifically to trace requests across vast Node.js / Nest.js / Express microservice topologies.
- **🔐 Secure SDK Tokens**: Encrypted project-based authentication ensures your log data stays strictly within your isolated tenant vault.

<br />

## 🏗️ Architecture

The project is structured as a tightly-integrated monorepo:

| Package | Tech Stack | Description |
| ------- | ---------- | ----------- |
| **`/app`** | Next.js 16, React, SCSS | The gorgeous main observability dashboard and user portal. |
| **`/api_nest.admin`** | Next.js 16, React, Tailwind | Enterprise management panel for supervising users and active tokens. |
| **`/backend`** | NestJS, Prisma, MongoDB | The core engine processing socket events, auth, and telemetry storage. |
| **`/cli`** | TypeScript | The NPM package that hooks into your target apps and dispatches telemetry. |

<br />

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Bun** (Latest)
- **MongoDB** (Local or Atlas Cluster)

### 2. Environment Setup
Configure your `.env` files in the respective packages. Follow the `.env.example` configurations.
Ensure your backend has a valid MongoDB connection string:
```env
DATABASE_URL="mongodb+srv://<USER>:<PASS>@cluster.mongodb.net/api-monitor?retryWrites=true&w=majority"
JWT_SECRET="your_super_secret_jwt_key"
```

### 3. Install & Start
Install dependencies globally across the workspace:
```bash
bun install
```

Start the platform services:
```bash
# Terminal 1: Backend Server (Port 4000)
cd backend && bun run start:dev

# Terminal 2: Main Application (Port 3000)
cd app && bun run dev

# Terminal 3: Admin Panel (Port 3001)
cd api_nest.admin && bun run dev
```

<br />

## 🛠️ Integrating the CLI (Target Apps)

To monitor a separate backend application (e.g., your production Express server), simply install the CLI interceptor:

**1. Create a Project**
Log into the Main App (`http://localhost:3000`) and navigate to Settings to generate your unique `SDK_TOKEN`.

**2. Initialize the Interceptor**
In your target backend project directory, run:
```bash
npx api-monitor-cli@latest init --token <YOUR_SDK_TOKEN>
```
*Note: If running locally without publishing to NPM, simply use `npm link` inside the `/cli` package to simulate the global install!*

**3. Watch the Magic**
Start your target app. The CLI will automatically intercept global network requests and beam them instantly to your Neural Architect dashboard!

<br />

## 📜 License
Internal SaaS Architecture — All rights reserved.
