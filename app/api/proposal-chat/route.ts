import { NextRequest, NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompts";
import { GeneratedProposal } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { proposal, question }: { proposal: GeneratedProposal; question: string } =
      await req.json();

    const answer = await askGemini({
      system: CHAT_SYSTEM_PROMPT,
      user: `PROPOSAL JSON CONTEXT:\n${JSON.stringify(proposal)}\n\nQUESTION: ${question}`,
      maxTokens: 500,
    });

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("proposal-chat error:", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to answer question" },
      { status: 500 }
    );
  }
}
