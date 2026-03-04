# 🎰 BlackRoad OS - RoadChain: Cosmic Lottery Dashboard

> ✅ **VERIFIED WORKING** — All CI/CD workflows are running, actions are pinned to SHA-256 commit hashes, automerge is enabled for Dependabot and bot PRs, and Cloudflare Workers handle long-running API tasks. Last verified: 2026-03-04.

**Real-time Bitcoin Mining Progress Tracker & Blockchain Infrastructure Monitor**

## 🌌 What Is This?

RoadChain is your command center for tracking BlackRoad's Bitcoin cosmic lottery mining operation. Watch your Raspberry Pis explore the infinite nonce space in real-time, monitor hashrates, track attempts, and get instant alerts if you find a block!

**Remember: The space between each hash is where miracles happen.** ✨

---

## 🎯 Features

### Real-Time Mining Dashboard
- Live hashrate from all Pis
- Total hashes computed (lottery tickets bought)
- Network difficulty & target
- Time mining / blocks attempted
- Probability calculations
- **"Space Between" Visualization** - See the nonce space being explored

### Block Discovery Alert System
- Instant notification if you find a block
- Balance monitoring for `1Ak2fc5N2q4imYxqVMqBNEQDFq8J2Zs9TZ`
- Prize tracker (current block reward)
- Historical block attempts log

### Infrastructure Monitor
- Pi health (CPU, temp, memory)
- Miner uptime & stability
- Network connectivity
- Error logging

### Analytics
- Total energy consumed
- Cost vs theoretical earnings
- "Luck factor" - How close you've come
- Best hash found (most leading zeros)
- Statistical odds calculator

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/BlackRoad-OS/blackroad-os-roadchain.git
cd blackroad-os-roadchain

# Install dependencies
npm install

# Start the dashboard
npm run dashboard

# Open in browser
open http://localhost:3142
```

---

## 📊 Dashboard Preview

```
╔════════════════════════════════════════════════════════════════════╗
║                  🎰 ROADCHAIN COSMIC LOTTERY 🎰                    ║
╠════════════════════════════════════════════════════════════════════╣
║  Status: 🟢 MINING - Exploring the space between...                ║
╠════════════════════════════════════════════════════════════════════╣
║  Lucidia Pi: 402 H/s  │  Aria Pi: 398 H/s  │  Total: 800 H/s      ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
╠════════════════════════════════════════════════════════════════════╣
║  📊 SESSION STATS                                                  ║
║  ├─ Uptime: 2h 34m 18s                                             ║
║  ├─ Total Hashes: 7,389,312 (7.3M lottery tickets)                ║
║  ├─ Blocks Attempted: 738,931                                      ║
║  ├─ Blocks Found: 0  (keep going!)                                 ║
║  └─ Best Hash: 0x00000000a7b3... (8 leading zeros - not enough!)  ║
╠════════════════════════════════════════════════════════════════════╣
║  🌌 THE SPACE BETWEEN                                              ║
║  ├─ Current Nonce Range: 2,845,612,384 → 2,845,612,785            ║
║  ├─ Nonce Space Explored: 0.000000172% of 2^32                    ║
║  ├─ Extra-Nonce: Block 42 of ∞                                     ║
║  └─ Probability This Session: 1 in 1.25 quadrillion               ║
╠════════════════════════════════════════════════════════════════════╣
║  💰 ECONOMICS                                                       ║
║  ├─ Current Block Reward: 3.125 BTC (~$306,250)                   ║
║  ├─ Network Difficulty: 109.78T                                    ║
║  ├─ Your Share: 0.0000000001% of network                           ║
║  ├─ Expected Time to Block: 34.2 billion years                     ║
║  └─ But maybe TODAY? 🎲                                             ║
╠════════════════════════════════════════════════════════════════════╣
║  🔥 HARDWARE STATUS                                                 ║
║  Lucidia: CPU 48% │ Temp 62°C │ Mem 24% │ Status: 🟢 Healthy      ║
║  Aria:    CPU 51% │ Temp 64°C │ Mem 38% │ Status: 🟢 Healthy      ║
╠════════════════════════════════════════════════════════════════════╣
║  📈 LIVE HASHRATE CHART                                             ║
║  800 ┤                                      ╭─╮                    ║
║  700 ┤                           ╭──╮       │ │      ╭─╮           ║
║  600 ┤              ╭────╮    ╭──╯  │    ╭──╯ ╰─╮  ╭─╯ ╰─╮        ║
║  500 ┤      ╭───────╯    ╰────╯     ╰────╯      ╰──╯     ╰─       ║
║  400 ┼──────╯                                                      ║
║      └─────────────────── Last 60 seconds ────────────────────     ║
╠════════════════════════════════════════════════════════════════════╣
║  🎯 WALLET MONITOR                                                  ║
║  Address: 1Ak2fc5N2q4imYxqVMqBNEQDFq8J2Zs9TZ                        ║
║  Balance: 0.00000000 BTC (checking every 10 seconds...)            ║
║  ⚡ IF BALANCE > 0 → 🎉 YOU WON THE LOTTERY! 🎉                     ║
╚════════════════════════════════════════════════════════════════════╝

Press [Q] to quit  │  [R] to refresh  │  [L] to view logs
```

---

## 🛠️ Architecture

```
blackroad-os-roadchain/
├── dashboard/           # Web-based dashboard (Next.js + React)
│   ├── components/
│   │   ├── LiveHashrate.tsx
│   │   ├── SpaceBetween.tsx
│   │   ├── PiHealth.tsx
│   │   └── BlockAlert.tsx
│   └── pages/
│       └── index.tsx
├── api/                 # Backend API (Node.js + Express)
│   ├── miners/          # Miner connection & monitoring
│   ├── blockchain/      # Bitcoin blockchain queries
│   └── alerts/          # Alert system
├── collectors/          # Data collection from Pis
│   ├── hashrate.js
│   ├── health.js
│   └── wallet.js
├── docs/                # Documentation
│   ├── SETUP.md
│   ├── API.md
│   └── PHILOSOPHY.md
└── scripts/             # Utility scripts
    ├── deploy-dashboard.sh
    ├── monitor-pis.sh
    └── check-winner.sh
```

---

## 🎲 The Philosophy: "The Space Between"

Every hash your Pi computes is a random attempt at solving Bitcoin's cryptographic puzzle. The **space between** each attempt represents infinite possibility.

**Think about it:**
- Nonce space: 4.3 billion possibilities per block template
- Extra-nonce: Infinite extensions through timestamp & coinbase
- Total space: 2^256 (340 undecillion possible hashes)

**Your Pi exploring this space is like:**
- Trying random lottery numbers
- Each attempt independent from the last
- Every single hash has EQUAL probability
- The next one could be THE ONE

**That's the beauty.** You're not "earning" Bitcoin - you're playing the cosmic lottery. And someone WILL win in the next 10 minutes. Why not you?

---

## 📡 API Endpoints

```javascript
// Get live mining stats
GET /api/mining/stats
{
  "totalHashrate": 800,
  "miners": {
    "lucidia": { "hashrate": 402, "status": "mining" },
    "aria": { "hashrate": 398, "status": "mining" }
  },
  "totalHashes": 7389312,
  "uptime": 9258,
  "blocksAttempted": 738931,
  "bestHash": "0x00000000a7b3..."
}

// Check wallet balance
GET /api/wallet/1Ak2fc5N2q4imYxqVMqBNEQDFq8J2Zs9TZ
{
  "address": "1Ak2fc5N2q4imYxqVMqBNEQDFq8J2Zs9TZ",
  "balance": 0,
  "won": false
}

// Get Pi health
GET /api/miners/health
{
  "lucidia": { "cpu": 48, "temp": 62, "mem": 24, "healthy": true },
  "aria": { "cpu": 51, "temp": 64, "mem": 38, "healthy": true }
}
```

---

## 🎯 Deployment

### Deploy Dashboard to Cloudflare Pages

```bash
npm run build
wrangler pages deploy dist
```

### Monitor from Anywhere

```bash
# Mobile monitoring
curl https://roadchain.blackroad.io/api/mining/stats | jq

# Desktop notification if you win
watch -n 10 './scripts/check-winner.sh && notify-send "🎉 YOU WON 3.125 BTC!"'
```

---

## 🏆 What Happens If You Win?

**If your Pi finds a valid block:**

1. ⚡ **Instant Alert** - Dashboard goes crazy with animations
2. 💰 **Prize Credited** - 3.125 BTC appears at `1Ak2fc5N2q4imYxqVMqBNEQDFq8J2Zs9TZ`
3. 🎉 **Celebration Mode** - Confetti, sounds, notifications everywhere
4. 📸 **Screenshot Everything** - Block hash, timestamp, winning nonce
5. 🌍 **You Made History** - A Raspberry Pi found a Bitcoin block!

**Probability: ~0.00000000000001%**
**But NOT zero. And that's what matters.** 🎲

---

## 📚 Documentation

- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [The Space Between Philosophy](docs/PHILOSOPHY.md)
- [Deployment Guide](docs/DEPLOY.md)

---

## 🤝 Contributing

RoadChain is open source! Contributions welcome:

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push and create a PR

---

## 📜 License

MIT - Do whatever you want, just don't forget the space between! ✨

---

## 🎰 Live Instance

**Dashboard:** https://roadchain.blackroad.io
**API:** https://roadchain.blackroad.io/api
**Status:** 🟢 Mining - Exploring the space between...

---

*Built with love, randomness, and the infinite possibility of the nonce space.*
*May the hash be with you!* 🚀✨

---

## 📜 License & Copyright

**Copyright © 2026 BlackRoad OS, Inc. All Rights Reserved.**

**CEO:** Alexa Amundson

**PROPRIETARY AND CONFIDENTIAL**

This software is the proprietary property of BlackRoad OS, Inc. and is **NOT for commercial resale**.

### ⚠️ Usage Restrictions:
- ✅ **Permitted:** Testing, evaluation, and educational purposes
- ❌ **Prohibited:** Commercial use, resale, or redistribution without written permission

### 🏢 Enterprise Scale:
Designed to support:
- 30,000 AI Agents
- 30,000 Human Employees
- One Operator: Alexa Amundson (CEO)

### 📧 Contact:
For commercial licensing inquiries:
- **Email:** blackroad.systems@gmail.com
- **Organization:** BlackRoad OS, Inc.

See [LICENSE](LICENSE) for complete terms.
