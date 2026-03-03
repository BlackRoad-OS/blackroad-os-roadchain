#!/usr/bin/env node
/**
 * BlackRoad OS — Contributor API Gateway (Converter API)
 *
 * All vendor API traffic and contributor tool calls MUST route through
 * this gateway. External AI providers (OpenAI, Anthropic, Codex, GitHub
 * Copilot, etc.) are blocked. Only @blackboxprogramming and @lucidia
 * tooling is permitted.
 *
 * Contributors require a valid BLACKROAD_GATEWAY_TOKEN to access any
 * endpoint. Tokens are issued by BlackRoad OS, Inc.
 *
 * Stripe integration handles contributor subscription verification.
 *
 * Copyright © 2026 BlackRoad OS, Inc. All Rights Reserved.
 */

'use strict';

require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.GATEWAY_PORT || 4000;
const GATEWAY_TOKEN = process.env.BLACKROAD_GATEWAY_TOKEN;

// ── Blocked vendor domains ───────────────────────────────────────────────────
const BLOCKED_VENDORS = [
  'openai.com',
  'api.openai.com',
  'anthropic.com',
  'api.anthropic.com',
  'copilot.github.com',
  'github.com/features/copilot',
  'codex.openai.com',
];

// ── Allowed internal routes (blackboxprogramming / lucidia) ──────────────────
const ALLOWED_UPSTREAM = {
  blackboxprogramming: process.env.BLACKBOXPROGRAMMING_API_URL || 'https://api.blackboxprogramming.io',
  lucidia: process.env.LUCIDIA_API_URL || 'https://api.lucidia.earth',
  mining: process.env.API_URL || `http://localhost:${process.env.API_PORT || 3000}`,
};

// ────────────────────────────────────────────────────────────────────────────
// Middleware: Contributor token authentication
// ────────────────────────────────────────────────────────────────────────────
function requireToken(req, res, next) {
  const token =
    req.headers['x-blackroad-token'] ||
    req.headers['authorization']?.replace(/^Bearer\s+/i, '');

  if (!GATEWAY_TOKEN) {
    return res.status(503).json({
      error: 'Gateway not configured',
      message: 'BLACKROAD_GATEWAY_TOKEN is not set. See .env.example.',
    });
  }

  if (!token || token !== GATEWAY_TOKEN) {
    return res.status(401).json({
      error: 'Unauthorized',
      message:
        'A valid BlackRoad contributor token is required. ' +
        'Email blackroad.systems@gmail.com to obtain one.',
    });
  }

  next();
}

// ────────────────────────────────────────────────────────────────────────────
// Middleware: Block forbidden vendor domains
// ────────────────────────────────────────────────────────────────────────────
function blockForbiddenVendors(req, res, next) {
  const target = req.query.target || req.body?.url || '';
  const isBlocked = BLOCKED_VENDORS.some((domain) =>
    target.toLowerCase().includes(domain)
  );

  if (isBlocked) {
    return res.status(403).json({
      error: 'Forbidden',
      message:
        'Direct calls to external AI vendors are not permitted. ' +
        'Route through @blackboxprogramming or @lucidia endpoints only.',
    });
  }

  next();
}

// ────────────────────────────────────────────────────────────────────────────
// Health check (no auth required)
// ────────────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  const token =
    req.headers['x-blackroad-token'] ||
    req.headers['authorization']?.replace(/^Bearer\s+/i, '');

  res.json({
    status: 'ok',
    service: 'BlackRoad OS Contributor Gateway',
    version: '1.0.0',
    authorized: !!(GATEWAY_TOKEN && token === GATEWAY_TOKEN),
    timestamp: new Date().toISOString(),
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Stripe: Verify contributor subscription
// POST /stripe/verify  { customerId }
// ────────────────────────────────────────────────────────────────────────────
app.post('/stripe/verify', requireToken, async (req, res) => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return res.status(503).json({
      error: 'Stripe not configured',
      message: 'Set STRIPE_SECRET_KEY in your .env file.',
    });
  }

  const { customerId } = req.body;
  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const response = await axios.get(
      `https://api.stripe.com/v1/subscriptions?customer=${customerId}&status=active&limit=1`,
      {
        auth: { username: stripeSecret, password: '' },
      }
    );

    const subscriptions = response.data.data;
    const active = subscriptions.length > 0;

    res.json({
      customerId,
      active,
      subscriptions: subscriptions.map((s) => ({
        id: s.id,
        status: s.status,
        plan: s.items?.data?.[0]?.price?.id,
        currentPeriodEnd: new Date(s.current_period_end * 1000).toISOString(),
      })),
    });
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({
      error: 'Stripe error',
      message: err.response?.data?.error?.message || err.message,
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// Stripe: Create checkout session for contributor access
// POST /stripe/checkout  { email, priceId? }
// ────────────────────────────────────────────────────────────────────────────
app.post('/stripe/checkout', requireToken, async (req, res) => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const priceId = req.body?.priceId || process.env.STRIPE_PRICE_ID;
  const successUrl = req.body?.successUrl || 'https://gateway.blackroad.io/success';
  const cancelUrl = req.body?.cancelUrl || 'https://gateway.blackroad.io/cancel';

  if (!stripeSecret || !priceId) {
    return res.status(503).json({
      error: 'Stripe not configured',
      message: 'Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in your .env file.',
    });
  }

  try {
    const response = await axios.post(
      'https://api.stripe.com/v1/checkout/sessions',
      new URLSearchParams({
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        ...(req.body?.email ? { customer_email: req.body.email } : {}),
      }).toString(),
      {
        auth: { username: stripeSecret, password: '' },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    res.json({ url: response.data.url, sessionId: response.data.id });
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({
      error: 'Stripe error',
      message: err.response?.data?.error?.message || err.message,
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// Proxy: Route requests to allowed upstreams
// POST /proxy  { upstream: "blackboxprogramming"|"lucidia"|"mining", path, method, body, headers }
// ────────────────────────────────────────────────────────────────────────────
app.post('/proxy', requireToken, blockForbiddenVendors, async (req, res) => {
  const { upstream, path: upstreamPath, method = 'GET', body, headers = {} } = req.body;

  if (!upstream || !ALLOWED_UPSTREAM[upstream]) {
    return res.status(400).json({
      error: 'Invalid upstream',
      message: `upstream must be one of: ${Object.keys(ALLOWED_UPSTREAM).join(', ')}`,
    });
  }

  const url = `${ALLOWED_UPSTREAM[upstream]}${upstreamPath || '/'}`;

  // Strip any Authorization headers that might leak tokens to upstreams
  const safeHeaders = { ...headers };
  delete safeHeaders['authorization'];
  delete safeHeaders['x-blackroad-token'];

  try {
    const response = await axios({
      method: method.toLowerCase(),
      url,
      data: body,
      headers: safeHeaders,
      timeout: 30000,
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 502;
    res.status(status).json({
      error: 'Upstream error',
      upstream,
      message: err.response?.data || err.message,
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// Mining stats passthrough (authenticated)
// GET /mining/stats
// ────────────────────────────────────────────────────────────────────────────
app.get('/mining/stats', requireToken, async (req, res) => {
  try {
    const response = await axios.get(
      `${ALLOWED_UPSTREAM.mining}/api/mining/stats`,
      { timeout: 5000 }
    );
    res.json(response.data);
  } catch {
    res.status(502).json({ error: 'Mining API unavailable' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// Wallet balance passthrough (authenticated)
// GET /wallet/:address
// ────────────────────────────────────────────────────────────────────────────
app.get('/wallet/:address', requireToken, async (req, res) => {
  const { address } = req.params;
  const blockchainApi = process.env.BLOCKCHAIN_API_URL || 'https://blockstream.info/api';

  try {
    const response = await axios.get(`${blockchainApi}/address/${address}`, {
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
    });
  } catch (err) {
    res.status(502).json({
      error: 'Blockchain API unavailable',
      message: err.message,
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// Catch-all: reject unknown routes
// ────────────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'See docs/GATEWAY.md for available endpoints.',
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Start
// ────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🔐 BlackRoad OS Contributor Gateway running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(
    `   Token configured: ${GATEWAY_TOKEN ? '✅ yes' : '❌ NO — set BLACKROAD_GATEWAY_TOKEN in .env'}`
  );
});

module.exports = app;
