# BlackRoad OS — Contributor API Gateway

> **All contributor access to this repository's tooling and vendor APIs routes through this gateway. No direct calls to external AI providers are permitted.**

---

## Overview

The BlackRoad Contributor Gateway (`api/gateway.js`) is the **converter API** that:

1. **Authenticates** contributors via a `BLACKROAD_GATEWAY_TOKEN`
2. **Blocks** all direct traffic to forbidden vendors (OpenAI, Anthropic, Codex, GitHub Copilot, etc.)
3. **Routes** approved requests through `@blackboxprogramming` and `@lucidia` infrastructure
4. **Verifies** Stripe subscriptions for paid contributor tiers
5. **Proxies** mining API and blockchain wallet queries

---

## Quick Start

### 1. Obtain a Contributor Token

Email **blackroad.systems@gmail.com** with subject:
```
Contributor Token Request — <your GitHub username>
```

Your token will be issued after identity verification and agreement to the [LICENSE](../LICENSE).

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and set BLACKROAD_GATEWAY_TOKEN=<your token>
```

### 3. Start the Gateway

```bash
npm run gateway
```

The gateway starts on `http://localhost:4000` (or the port set in `GATEWAY_PORT`).

### 4. Verify Access

```bash
curl -H "X-BlackRoad-Token: $BLACKROAD_GATEWAY_TOKEN" \
     http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "BlackRoad OS Contributor Gateway",
  "authorized": true
}
```

---

## Authentication

All protected endpoints require your contributor token in one of two ways:

**Header (preferred):**
```
X-BlackRoad-Token: <your_token>
```

**Authorization header:**
```
Authorization: Bearer <your_token>
```

Requests without a valid token receive `HTTP 401 Unauthorized`.

---

## Endpoints

### `GET /health`
No authentication required. Returns gateway status and whether the caller is authenticated.

```bash
curl http://localhost:4000/health
```

---

### `POST /proxy`
Route a request through an approved upstream.

**Body:**
```json
{
  "upstream": "blackboxprogramming",
  "path": "/v1/completions",
  "method": "POST",
  "body": { ... },
  "headers": { "Content-Type": "application/json" }
}
```

**Allowed upstreams:**
| Key | Routes to |
|-----|-----------|
| `blackboxprogramming` | `BLACKBOXPROGRAMMING_API_URL` (default: `https://api.blackboxprogramming.io`) |
| `lucidia` | `LUCIDIA_API_URL` (default: `https://api.lucidia.earth`) |
| `mining` | Local mining API (`http://localhost:3000`) |

---

### `GET /mining/stats`
Authenticated passthrough to the mining API.

```bash
curl -H "X-BlackRoad-Token: $BLACKROAD_GATEWAY_TOKEN" \
     http://localhost:4000/mining/stats
```

---

### `GET /wallet/:address`
Check Bitcoin wallet balance via Blockstream API.

```bash
curl -H "X-BlackRoad-Token: $BLACKROAD_GATEWAY_TOKEN" \
     http://localhost:4000/wallet/1Ak2fc5N2q4imYxqVMqBNEQDFq8J2Zs9TZ
```

---

### `POST /stripe/verify`
Verify an active Stripe subscription for a contributor.

**Body:**
```json
{ "customerId": "cus_..." }
```

---

### `POST /stripe/checkout`
Create a Stripe checkout session for contributor access.

**Body:**
```json
{
  "email": "contributor@example.com",
  "priceId": "price_...",
  "successUrl": "https://gateway.blackroad.io/success",
  "cancelUrl": "https://gateway.blackroad.io/cancel"
}
```

---

## Blocked Vendors

The following domains are **blocked** from all proxy requests:

- `openai.com` / `api.openai.com`
- `anthropic.com` / `api.anthropic.com`
- `copilot.github.com`
- `codex.openai.com`

Requests targeting these domains receive `HTTP 403 Forbidden`.

---

## Running in Production

For production deployment behind Cloudflare:

```bash
# Set NODE_ENV=production in .env
# Start gateway as a systemd service or Docker container
npm run gateway

# Or with PM2
pm2 start api/gateway.js --name blackroad-gateway
```

Configure Cloudflare Tunnel to expose the gateway:
```bash
cloudflared tunnel run --url http://localhost:4000 blackroad-gateway
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BLACKROAD_GATEWAY_TOKEN` | ✅ | Contributor authentication token |
| `GATEWAY_PORT` | | Port to listen on (default: `4000`) |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key |
| `STRIPE_PRICE_ID` | For payments | Stripe price ID for contributor tier |
| `BLACKBOXPROGRAMMING_API_URL` | | Override `@blackboxprogramming` upstream |
| `LUCIDIA_API_URL` | | Override `@lucidia` upstream |
| `BLOCKCHAIN_API_URL` | | Blockchain API (default: Blockstream) |

See [`.env.example`](../.env.example) for the full list.

---

**Copyright © 2026 BlackRoad OS, Inc. All Rights Reserved.**
