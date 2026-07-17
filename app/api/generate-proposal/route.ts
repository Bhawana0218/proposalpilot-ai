import { NextRequest } from "next/server";
import { askGroqStream } from "@/lib/groq";
import { PROPOSAL_SYSTEM_PROMPT, intakeSummary } from "@/lib/prompts";
import { IntakeState } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const intake: IntakeState = await req.json();

    if (!intake.client.companyName || !intake.services.selected.length) {
      return Response.json(
        { error: "Company name and at least one requested service are required." },
        { status: 400 }
      );
    }

    const stream = await askGroqStream({
      system: PROPOSAL_SYSTEM_PROMPT,
      user: intakeSummary(intake),
      maxTokens: 8000,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err: any) {
    console.error("[Groq] generate-proposal error:", err);
    return Response.json(
      {
        success: false,
        provider: "groq",
        error: err.message ?? "AI model temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}
