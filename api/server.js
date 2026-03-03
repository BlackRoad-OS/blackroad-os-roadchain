#!/usr/bin/env node
/**
 * BlackRoad OS — RoadChain API Server
 *
 * Provides real-time mining stats, wallet monitoring, and Pi health data.
 * All external access MUST go through api/gateway.js (the converter API).
 *
 * Copyright © 2026 BlackRoad OS, Inc. All Rights Reserved.
 */

'use strict';

require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.API_PORT || 3000;
const BLOCKCHAIN_API = process.env.BLOCKCHAIN_API_URL || 'https://blockstream.info/api';
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || '1Ak2fc5N2q4imYxqVMqBNEQDFq8J2Zs9TZ';

// ── In-memory state (replace with a real data store for production) ──────────
let miningState = {
  lucidia: { hashrate: 0, status: 'offline', cpu: 0, temp: 0, mem: 0 },
  aria: { hashrate: 0, status: 'offline', cpu: 0, temp: 0, mem: 0 },
  totalHashes: 0,
  blocksAttempted: 0,
  bestHash: '0x0',
  uptime: 0,
  startTime: Date.now(),
};

// ── Routes ───────────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'BlackRoad RoadChain API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/mining/stats
app.get('/api/mining/stats', (req, res) => {
  const totalHashrate =
    miningState.lucidia.hashrate + miningState.aria.hashrate;

  res.json({
    totalHashrate,
    miners: {
      lucidia: {
        hashrate: miningState.lucidia.hashrate,
        status: miningState.lucidia.status,
      },
      aria: {
        hashrate: miningState.aria.hashrate,
        status: miningState.aria.status,
      },
    },
    totalHashes: miningState.totalHashes,
    blocksAttempted: miningState.blocksAttempted,
    bestHash: miningState.bestHash,
    uptime: Math.floor((Date.now() - miningState.startTime) / 1000),
    timestamp: new Date().toISOString(),
  });
});

// POST /api/mining/stats  (called by Pi collectors to push data)
app.post('/api/mining/stats', (req, res) => {
  const { miner, hashrate, status, cpu, temp, mem, totalHashes, bestHash } =
    req.body;

  if (!miner || !['lucidia', 'aria'].includes(miner)) {
    return res.status(400).json({ error: 'Invalid miner name' });
  }

  miningState[miner] = {
    hashrate: Number(hashrate) || 0,
    status: status || 'mining',
    cpu: Number(cpu) || 0,
    temp: Number(temp) || 0,
    mem: Number(mem) || 0,
  };

  if (totalHashes) miningState.totalHashes = Number(totalHashes);
  if (bestHash) miningState.bestHash = bestHash;
  miningState.blocksAttempted = Math.floor(miningState.totalHashes / 10000);

  res.json({ ok: true });
});

// GET /api/miners/health
app.get('/api/miners/health', (req, res) => {
  res.json({
    lucidia: {
      cpu: miningState.lucidia.cpu,
      temp: miningState.lucidia.temp,
      mem: miningState.lucidia.mem,
      healthy: miningState.lucidia.temp < 80 && miningState.lucidia.cpu < 95,
    },
    aria: {
      cpu: miningState.aria.cpu,
      temp: miningState.aria.temp,
      mem: miningState.aria.mem,
      healthy: miningState.aria.temp < 80 && miningState.aria.cpu < 95,
    },
    timestamp: new Date().toISOString(),
  });
});

// GET /api/wallet/:address
app.get('/api/wallet/:address', async (req, res) => {
  const { address } = req.params;

  try {
    const response = await axios.get(`${BLOCKCHAIN_API}/address/${address}`, {
      timeout: 10000,
    });

    const data = response.data;
    const balanceSat =
      (data.chain_stats?.funded_txo_sum || 0) -
      (data.chain_stats?.spent_txo_sum || 0);
    const balanceBtc = balanceSat / 1e8;

    res.json({
      address,
      balance: balanceBtc,
      balanceSat,
      won: balanceBtc > 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(502).json({
      address,
      balance: 0,
      won: false,
      error: 'Blockchain API unavailable',
      message: err.message,
    });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`⛏  BlackRoad RoadChain API running on port ${PORT}`);
  console.log(`   Monitoring wallet: ${WALLET_ADDRESS}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
});

module.exports = app;
