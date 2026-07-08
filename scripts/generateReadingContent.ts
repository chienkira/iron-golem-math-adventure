import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'src/content/reading');

const McqSchema = z.object({
  kind: z.literal('mcq'),
  prompt: z.string().min(5),
  choices: z.array(z.string().min(1)).length(4),
  answerIndex: z.number().int().min(0).max(3),
});

const WordBankSchema = z.object({
  kind: z.literal('wordBank'),
  prompt: z.string().min(5),
  words: z.array(z.string().min(1)).min(3),
  answer: z.array(z.string().min(1)).min(1),
});

const QuestionSchema = z.union([McqSchema, WordBankSchema]);
const PackSchema = z.object({
  tier: z.string(),
  generatedAt: z.string().optional(),
  questions: z.array(QuestionSchema).min(5),
});

type Tier = 'creeper' | 'bee' | 'zombie' | 'enderman' | 'ghast';

const TIER_PROMPTS: Record<Tier, string> = {
  creeper: `Tạo 20 câu hỏi MCQ tiếng Việt cho học sinh lớp 1 về vần điệu (dễ).
Mỗi câu dạng "Từ nào cùng vần với \\"ba\\"?" với 4 lựa chọn, 1 đúng. Dùng từ 2-3 chữ quen thuộc lớp 1.
Schema mỗi phần tử:
{"kind":"mcq","prompt":"...","choices":["...","...","...","..."],"answerIndex":0}
Chỉ trả về JSON array, không markdown, không giải thích.`,

  bee: `Tạo 20 câu hỏi MCQ tiếng Việt cho học sinh lớp 1-2 về vần điệu.
Mỗi câu dạng "Từ nào cùng vần với \\"anh\\"?" với 4 lựa chọn, 1 đúng.
Schema mỗi phần tử:
{"kind":"mcq","prompt":"...","choices":["...","...","...","..."],"answerIndex":0}
Chỉ trả về JSON array, không markdown, không giải thích.`,

  zombie: `Tạo 20 câu hỏi word bank tiếng Việt lớp 2-3: điền 1 từ vào chỗ trống.
Prompt có dấu ___ cho chỗ trống. words gồm đáp án đúng + 3 từ nhiễu. answer là mảng 1 từ.
Schema:
{"kind":"wordBank","prompt":"Con ___ đi ăn cỏ.","words":["trâu","chó","mèo","cá"],"answer":["trâu"]}
Chỉ trả về JSON array, không markdown, không giải thích.`,

  enderman: `Tạo 20 câu hỏi word bank tiếng Việt lớp 3-4: ghép câu 4-6 từ.
prompt luôn là "Ghép thành câu đúng:". words chứa đủ từ cần ghép (có thể thêm 1-2 từ nhiễu). answer là thứ tự đúng.
Schema:
{"kind":"wordBank","prompt":"Ghép thành câu đúng:","words":["Em","đi","học","sáng"],"answer":["Em","đi","học","sáng"]}
Chỉ trả về JSON array, không markdown, không giải thích.`,

  ghast: `Tạo 20 câu hỏi word bank tiếng Việt lớp 4-5: ghép câu 6-8 từ (không phải đọc hiểu đoạn văn).
prompt luôn là "Ghép thành câu đúng:". words chứa đủ từ cần ghép (có thể thêm 1-2 từ nhiễu). answer là thứ tự đúng.
Schema:
{"kind":"wordBank","prompt":"Ghép thành câu đúng:","words":["Mỗi","sáng","em","thức","dậy","sớm","đi","học"],"answer":["Mỗi","sáng","em","thức","dậy","sớm","đi","học"]}
Chỉ trả về JSON array, không markdown, không giải thích.`,
};

async function loadEnvLocal(): Promise<void> {
  try {
    const envPath = path.join(ROOT, '.env.local');
    const raw = await readFile(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

function extractJsonArray(text: string): unknown {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Response does not contain JSON array');
  }
  return JSON.parse(text.slice(start, end + 1));
}

async function generateTier(model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>, tier: Tier) {
  const result = await model.generateContent(TIER_PROMPTS[tier]);
  const text = result.response.text();
  const parsed = extractJsonArray(text);
  const questions = z.array(QuestionSchema).parse(parsed);

  for (const q of questions) {
    if (q.kind === 'wordBank') {
      for (const word of q.answer) {
        if (!q.words.includes(word)) {
          throw new Error(`Tier ${tier}: answer word "${word}" missing from words`);
        }
      }
    }
  }

  return PackSchema.parse({
    tier,
    generatedAt: new Date().toISOString().slice(0, 10),
    questions,
  });
}

async function main() {
  await loadEnvLocal();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY in .env.local');
    process.exit(1);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const tiers: Tier[] = ['creeper', 'bee', 'zombie', 'enderman', 'ghast'];

  for (const tier of tiers) {
    console.log(`Generating ${tier}...`);
    const pack = await generateTier(model, tier);
    const outPath = path.join(OUTPUT_DIR, `${tier}.json`);
    await writeFile(outPath, `${JSON.stringify(pack, null, 2)}\n`, 'utf8');
    console.log(`Wrote ${outPath} (${pack.questions.length} questions)`);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
