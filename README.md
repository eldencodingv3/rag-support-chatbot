# RAG Support Chatbot

A Node.js RAG (Retrieval-Augmented Generation) chatbot that answers customer support questions for CloudSync Pro using LanceDB for vector storage and OpenAI for embeddings and chat.

## Features

- Retrieval-Augmented Generation for accurate, context-based answers
- Vector similarity search using LanceDB
- OpenAI embeddings (text-embedding-ada-002) and chat (GPT-3.5-turbo)
- Clean, responsive chat interface
- Automatic FAQ ingestion on startup
- Health check endpoint

## Prerequisites

- Node.js 18 or later
- An OpenAI API key ([get one here](https://platform.openai.com/api-keys))

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/eldencodingv3/rag-support-chatbot.git
   cd rag-support-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   PORT=3000
   ```

5. Start the server:
   ```bash
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required | Default |
|---|---|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes | — |
| `PORT` | Server port | No | `3000` |

## Updating the FAQ Dataset

Edit `data/faqs.json` to add, remove, or modify FAQ entries. Each entry should have:

```json
{
  "id": 1,
  "question": "Your question here",
  "answer": "Your answer here"
}
```

Restart the server after making changes — the FAQs are re-ingested on startup.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check — returns `{ "status": "ok" }` |
| `POST` | `/api/chat` | Send a message — accepts `{ "message": "..." }`, returns `{ "reply": "..." }` |

## Tech Stack

- **Runtime**: Node.js with Express.js
- **Vector DB**: LanceDB (embedded, no separate server needed)
- **AI**: OpenAI API (text-embedding-ada-002 + GPT-3.5-turbo)
- **Frontend**: Vanilla HTML, CSS, and JavaScript
