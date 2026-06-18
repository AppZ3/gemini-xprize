import { GoogleGenerativeAI } from "@google/generative-ai";
import { ALL_PRODUCTS, Product } from "./products";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type AdvisorInput = {
  businessType: string;
  teamSize: string;
  painPoints: string;
  currentTools: string;
};

export type Recommendation = {
  product: Product;
  reason: string;
  expectedImpact: string;
  priority: "high" | "medium" | "low";
};

export type AdvisorOutput = {
  summary: string;
  recommendations: Recommendation[];
  implementationPlan: string;
  estimatedTimeSaved: string;
  nextStep: string;
};

export async function getAutomationAdvice(input: AdvisorInput): Promise<AdvisorOutput> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const productCatalog = ALL_PRODUCTS.map(p =>
    `ID: ${p.name} | Category: ${p.category} | Price: $${p.price} | Tags: ${p.tags.join(", ")} | Description: ${p.description}`
  ).join("\n");

  const prompt = `You are an expert business automation consultant. A small business owner needs your advice.

BUSINESS PROFILE:
- Business type: ${input.businessType}
- Team size: ${input.teamSize}
- Main pain points: ${input.painPoints}
- Current tools: ${input.currentTools || "Not specified"}

AVAILABLE AUTOMATION PRODUCTS:
${productCatalog}

YOUR TASK:
1. Analyse this business's automation needs
2. Select the 2-3 most relevant products from the catalog above (match by tags and use case)
3. Write a practical implementation plan
4. Estimate hours saved per week

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "summary": "2-3 sentence personalised analysis of their automation opportunity",
  "recommendations": [
    {
      "productName": "exact product name from catalog",
      "reason": "specific reason this fits their business (1 sentence)",
      "expectedImpact": "concrete outcome e.g. '5 hours/week saved on invoicing'",
      "priority": "high"
    }
  ],
  "implementationPlan": "Step-by-step 30-day plan to get these automations running (3-5 steps, practical)",
  "estimatedTimeSaved": "total hours per week estimate e.g. '8-12 hours/week'",
  "nextStep": "single most important first action they should take today"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if present
  const jsonStr = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  const parsed = JSON.parse(jsonStr);

  // Map product names back to full product objects
  const recommendations: Recommendation[] = (parsed.recommendations || []).map((rec: {productName: string; reason: string; expectedImpact: string; priority: string}) => {
    const product = ALL_PRODUCTS.find(p =>
      p.name.toLowerCase() === rec.productName.toLowerCase()
    ) || ALL_PRODUCTS.find(p =>
      p.name.toLowerCase().includes(rec.productName.toLowerCase().split(" ")[0])
    ) || ALL_PRODUCTS[0];

    return {
      product,
      reason: rec.reason,
      expectedImpact: rec.expectedImpact,
      priority: rec.priority as "high" | "medium" | "low",
    };
  });

  return {
    summary: parsed.summary,
    recommendations,
    implementationPlan: parsed.implementationPlan,
    estimatedTimeSaved: parsed.estimatedTimeSaved,
    nextStep: parsed.nextStep,
  };
}
