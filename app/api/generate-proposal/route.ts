import { NextRequest, NextResponse } from "next/server";
import { askGeminiForJSON } from "@/lib/gemini";
import { PROPOSAL_SYSTEM_PROMPT, intakeSummary } from "@/lib/prompts";
import { GeneratedProposal, IntakeState } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const intake: IntakeState = await req.json();

    if (!intake.client.companyName || !intake.services.selected.length) {
      return NextResponse.json(
        { error: "Company name and at least one requested service are required." },
        { status: 400 }
      );
    }

    const document = await askGeminiForJSON<GeneratedProposal>({
      system: PROPOSAL_SYSTEM_PROMPT,
      user: intakeSummary(intake),
      maxTokens: 4000,
    });

    const proposal = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      intake,
      document,
    };

    return NextResponse.json(proposal);
  } catch (err: any) {
    console.error("generate-proposal error:", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to generate proposal" },
      { status: 500 }
    );
  }
}
