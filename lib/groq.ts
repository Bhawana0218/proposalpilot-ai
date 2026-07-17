import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const MODEL = "llama-3.3-70b-versatile";

export async function askGroqForJSON<T>(params: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<T> {
  const response = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: params.maxTokens ?? 4000,
    temperature: 0.4,
    messages: [
      { role: "system", content: params.system },
      { role: "user", content: params.user },
    ],
  });

  const raw = response.choices?.[0]?.message?.content ?? "{}";
  const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(
      `AI did not return valid JSON. Raw response: ${cleaned.slice(0, 500)}`
    );
  }
}

export async function askGroqStream(params: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<ReadableStream<Uint8Array>> {
  const response = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: params.maxTokens ?? 4000,
    temperature: 0.4,
    stream: true,
    messages: [
      { role: "system", content: params.system },
      { role: "user", content: params.user },
    ],
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return stream;
}

export async function askGroq(params: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<string> {
  const response = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: params.maxTokens ?? 800,
    temperature: 0.4,
    messages: [
      { role: "system", content: params.system },
      { role: "user", content: params.user },
    ],
  });

  return response.choices?.[0]?.message?.content ?? "";
}
