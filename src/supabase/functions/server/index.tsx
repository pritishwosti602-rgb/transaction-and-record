import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Routes
const route = '/make-server-2a72100d';

// Get all transactions
app.get(`${route}/transactions`, async (c) => {
  try {
    const transactions = await kv.get('transactions');
    return c.json({ success: true, data: transactions || [] });
  } catch (error) {
    console.log('Error fetching transactions:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Save transactions
app.post(`${route}/transactions`, async (c) => {
  try {
    const { transactions } = await c.req.json();
    await kv.set('transactions', transactions);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error saving transactions:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all players
app.get(`${route}/players`, async (c) => {
  try {
    const players = await kv.get('players');
    return c.json({ success: true, data: players || [] });
  } catch (error) {
    console.log('Error fetching players:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Save players
app.post(`${route}/players`, async (c) => {
  try {
    const { players } = await c.req.json();
    await kv.set('players', players);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error saving players:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get platform credits
app.get(`${route}/platform-credits`, async (c) => {
  try {
    const credits = await kv.get('platformCredits');
    return c.json({ success: true, data: credits || [] });
  } catch (error) {
    console.log('Error fetching platform credits:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Save platform credits
app.post(`${route}/platform-credits`, async (c) => {
  try {
    const { credits } = await c.req.json();
    await kv.set('platformCredits', credits);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error saving platform credits:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Health check
app.get(`${route}/health`, (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
