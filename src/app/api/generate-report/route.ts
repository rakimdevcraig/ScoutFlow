import { NextResponse } from "next/server";
import { generateScoutingReport } from "@/lib/ai/generate-scouting-report";
import { scoutingInputSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = scoutingInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid scouting input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await generateScoutingReport(parsed.data);
    return NextResponse.json(result);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Report generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
