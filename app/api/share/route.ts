import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function POST(req: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 500 });
  }
  const { businessType, planData } = await req.json();
  if (!businessType || !planData) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/plans`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ business_type: businessType, plan_data: planData }),
  });
  const data = await res.json();
  const id = data[0]?.id;
  if (!id) return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  return NextResponse.json({ id });
}
