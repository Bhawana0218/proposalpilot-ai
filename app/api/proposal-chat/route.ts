import { NextRequest, NextResponse } from "next/server";
import { askGroq } from "@/lib/groq";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompts";
import { GeneratedProposal } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { proposal, question }: { proposal: GeneratedProposal; question: string } =
      await req.json();

    const answer = await askGroq({
      system: CHAT_SYSTEM_PROMPT,
      user: `PROPOSAL JSON CONTEXT:\n${JSON.stringify(proposal)}\n\nQUESTION: ${question}`,
      maxTokens: 500,
    });

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("[Groq] proposal-chat error:", err);
    return NextResponse.json(
      {
        success: false,
        provider: "groq",
        error: err.message ?? "AI model temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}
