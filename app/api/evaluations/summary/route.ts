import { NextResponse } from "next/server";
import { getEvaluationSummary } from "@/lib/getEvaluationSummary";

export async function GET() {
  const summary = await getEvaluationSummary();

  if (summary === null) {
    return NextResponse.json(
      { error: "Failed to fetch evaluation data." },
      { status: 500 }
    );
  }

  return NextResponse.json({ summary });
}
