import { NextRequest, NextResponse } from "next/server";
import { generateWorkflow } from "@/lib/workflow-generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessType, painPoints, currentTools, recommendations } = body;

    if (!businessType) {
      return NextResponse.json({ error: "businessType required" }, { status: 400 });
    }

    const workflow = generateWorkflow({
      businessType,
      painPoints: painPoints || "",
      currentTools: currentTools || "",
      recommendations: recommendations || [],
    });

    return NextResponse.json(workflow);
  } catch {
    return NextResponse.json({ error: "Failed to generate workflow" }, { status: 500 });
  }
}
