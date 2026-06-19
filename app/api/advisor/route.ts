import { NextRequest, NextResponse } from "next/server";
import { getAutomationAdvice, AdvisorInput } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body: AdvisorInput = await req.json();

    if (!body.businessType || !body.painPoints) {
      return NextResponse.json(
        { error: "Business type and pain points are required." },
        { status: 400 }
      );
    }

    const advice = await getAutomationAdvice(body);

    // Fire-and-forget usage counter
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/increment_blueprint_count`, {
        method: "POST",
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: "{}",
      }).catch(() => {});
    }

    return NextResponse.json(advice);
  } catch (err) {
    console.error("Advisor error:", err);
    return NextResponse.json(
      { error: "Failed to generate recommendations. Please try again." },
      { status: 500 }
    );
  }
}
