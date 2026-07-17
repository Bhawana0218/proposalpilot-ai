import Anthropic from "@anthropic-ai/sdk";

// Single shared client. Requires ANTHROPIC_API_KEY in the environment
// (.env.local for development, or your host's secret manager in production).
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL = "claude-sonnet-4-5-20250929";

/**
 * Calls Claude and forces a raw-JSON response by instructing it in the
 * system prompt, then strips any accidental markdown fences before parsing.
 * Every AI feature in ProposalPilot (discovery questions, proposal
 * generation, chat) goes through this so JSON parsing is handled once.
 */
export async function askClaudeForJSON<T>(params: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<T> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: params.maxTokens ?? 4000,
    system: params.system,
    messages: [{ role: "user", content: params.user }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const raw = textBlock && "text" in textBlock ? textBlock.text : "{}";
  const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    throw new Error(
      `Claude did not return valid JSON. Raw response: ${cleaned.slice(0, 500)}`
    );
  }
}
