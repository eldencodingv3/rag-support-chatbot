import 'dotenv/config';
import express from 'express';
import * as lancedb from '@lancedb/lancedb';
import { chat } from './rag.js';
import { ingestFAQs } from './ingest.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let db = null;

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        reply: 'The chatbot is not configured yet. Please set the OPENAI_API_KEY environment variable.',
      });
    }

    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ reply: 'Please provide a valid message.' });
    }

    const reply = await chat(db, message.trim());
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({
      reply: 'Sorry, something went wrong processing your request. Please try again later.',
    });
  }
});

async function start() {
  try {
    db = await lancedb.connect('data/lancedb');
    console.log('Connected to LanceDB.');

    if (!process.env.OPENAI_API_KEY) {
      console.warn('WARNING: OPENAI_API_KEY is not set. The /api/chat endpoint will not work until it is configured.');
    } else {
      await ingestFAQs(db);
    }
  } catch (error) {
    console.error('Startup error:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
