import OpenAI from 'openai';

let openai = null;

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

export async function getEmbedding(text) {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await client.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });

  return response.data[0].embedding;
}

export async function searchSimilar(db, query, limit = 3) {
  const queryVector = await getEmbedding(query);
  const table = await db.openTable('faqs');
  const results = await table.vectorSearch(queryVector).limit(limit).toArray();
  return results;
}

export async function generateResponse(query, context) {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const systemPrompt = `You are a helpful customer support agent for CloudSync Pro, a cloud file storage and sync service. Answer the user's question based on the following context from our FAQ. If the context doesn't contain relevant information, let the user know you don't have that information and suggest contacting support at support@cloudsyncpro.com.

Context:
${context}`;

  const completion = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0].message.content;
}

export async function chat(db, message) {
  const results = await searchSimilar(db, message);

  const context = results
    .map((r) => `Q: ${r.question}\nA: ${r.answer}`)
    .join('\n\n');

  const response = await generateResponse(message, context);
  return response;
}
