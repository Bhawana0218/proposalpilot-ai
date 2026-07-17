const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MODELS = ["gemini-2.5-flash-lite", "gemini-2.0-flash"] as const;
type ModelId = (typeof MODELS)[number];

function buildUrl(model: ModelId) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
}

async function callGemini(model: ModelId, body: Record<string, unknown>) {
  const res = await fetch(buildUrl(model), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`[${model}] ${res.status}: ${errText}`);
  }
  return res.json();
}

/**
 * Core Gemini call with automatic model fallback.
 * Tries gemini-2.5-flash-lite first, falls back to gemini-2.0-flash.
 */
async function geminiRequest(body: Record<string, unknown>) {
  let lastError: Error | null = null;
  for (const model of MODELS) {
    try {
      const data = await callGemini(model, body);
      return data;
    } catch (err: any) {
      console.warn(`[gemini] Model ${model} failed:`, err.message);
      lastError = err;
    }
  }
  throw new Error(
    `All Gemini models failed. Last error: ${lastError?.message}`
  );
}

function extractText(data: any): string {
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
}

/**
 * Calls Gemini and forces a raw-JSON response.
 * Strips markdown fences and parses. Used by discovery + proposal generation.
 */
export async function askGeminiForJSON<T>(params: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<T> {
  const data = await geminiRequest({
    systemInstruction: { parts: [{ text: params.system }] },
    contents: [{ role: "user", parts: [{ text: params.user }] }],
    generationConfig: {
      maxOutputTokens: params.maxTokens ?? 4000,
      temperature: 0.7,
    },
  });

  const raw = extractText(data);
  const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(
      `AI did not return valid JSON. Raw: ${cleaned.slice(0, 500)}`
    );
  }
}

/**
 * Free-form text generation for chat.
 */
export async function askGemini(params: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<string> {
  const data = await geminiRequest({
    systemInstruction: { parts: [{ text: params.system }] },
    contents: [{ role: "user", parts: [{ text: params.user }] }],
    generationConfig: {
      maxOutputTokens: params.maxTokens ?? 800,
      temperature: 0.7,
    },
  });

  return extractText(data);
}
