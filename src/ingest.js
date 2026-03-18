import { readFile } from 'fs/promises';
import { getEmbedding } from './rag.js';

export async function ingestFAQs(db) {
  const faqPath = new URL('../data/faqs.json', import.meta.url);
  const raw = await readFile(faqPath, 'utf-8');
  const faqs = JSON.parse(raw);

  console.log(`Ingesting ${faqs.length} FAQ entries...`);

  const records = [];
  for (const faq of faqs) {
    console.log(`  Embedding FAQ #${faq.id}: ${faq.question.substring(0, 50)}...`);
    const vector = await getEmbedding(faq.question + ' ' + faq.answer);
    records.push({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      vector,
    });
  }

  // Try to open existing table, create if it doesn't exist
  try {
    await db.openTable('faqs');
    // Table exists — drop and recreate with fresh data
    await db.dropTable('faqs');
    console.log('Dropped existing faqs table.');
  } catch {
    // Table doesn't exist yet, that's fine
  }

  await db.createTable('faqs', records);
  console.log(`Successfully ingested ${records.length} FAQ entries into LanceDB.`);
}
