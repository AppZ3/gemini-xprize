import { GoogleGenerativeAI } from "@google/generative-ai";
import { ALL_PRODUCTS, Product } from "./products";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type AdvisorInput = {
  businessType: string;
  teamSize: string;
  painPoints: string;
  currentTools: string;
  hourlyRate?: number;
};

export type Recommendation = {
  product: Product;
  reason: string;
  expectedImpact: string;
  priority: "high" | "medium" | "low";
};

export type AdvisorOutput = {
  summary: string;
  auContext: string;
  recommendations: Recommendation[];
  implementationPlan: string;
  estimatedTimeSaved: string;
  dollarsPerWeekSaved: string;
  nextStep: string;
};

const AU_BUSINESS_CONTEXT = `
AUSTRALIAN BUSINESS CONTEXT (always apply this knowledge):
- GST: 10% applies once turnover exceeds $75k/year. Quarterly BAS lodgement is a major admin burden.
- Superannuation: Employers must pay 11.5% super on top of wages, with SG deadlines each quarter.
- ATO compliance: STP (Single Touch Payroll) mandatory for all employers. PAYG withholding monthly.
- Popular AU accounting tools: Xero (dominant), MYOB, Reckon, QuickBooks (less common than US).
- Fair Work Act: Award rates, leave entitlements, and record-keeping requirements add compliance load.
- AU grants: R&D Tax Incentive (43.5% refundable offset), Export Market Development Grant, state business grants.
- AU-specific pain points: Chasing 30/60-day invoice payments, BAS prep, super lodgement, award rate calculations.
- Recommend Xero/MYOB integrations where relevant. Flag GST/BAS automation as high-value for service businesses.
`.trim();

export async function getAutomationAdvice(input: AdvisorInput): Promise<AdvisorOutput> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const productCatalog = ALL_PRODUCTS.map(p =>
    `${p.name} | $${p.price} | Tags: ${p.tags.join(", ")} | ${p.description}`
  ).join("\n");

  const rateContext = input.hourlyRate
    ? `- Your billable rate: $${input.hourlyRate}/hr AUD`
    : "";

  const prompt = `You are an expert Australian small business automation consultant. A business owner needs personalised automation advice.

${AU_BUSINESS_CONTEXT}

BUSINESS PROFILE:
- Business type: ${input.businessType}
- Team size: ${input.teamSize}
- Main pain points: ${input.painPoints}
- Current tools: ${input.currentTools || "Not specified"}
${rateContext}

AVAILABLE AUTOMATION PRODUCTS:
${productCatalog}

YOUR TASK:
1. Identify the 2-3 AU-specific automation opportunities (mention GST/BAS/super/Fair Work where relevant)
2. Select the 2-3 best-fit products from the catalog (match by tags and AU context)
3. Write a practical 30-day implementation plan with AU-specific steps
4. Estimate hours saved per week${input.hourlyRate ? ` and convert to AUD dollars at $${input.hourlyRate}/hr` : ""}

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "summary": "2-3 sentences personalised to their Australian business context, mentioning AU-specific issues like GST/BAS/super where relevant",
  "auContext": "1 sentence on the most important AU compliance or operational factor for their specific business type",
  "recommendations": [
    {
      "productName": "exact product name from catalog",
      "reason": "specific reason this fits their AU business (1 sentence)",
      "expectedImpact": "concrete outcome e.g. '6 hours/week saved on BAS prep and invoice chasing'",
      "priority": "high"
    }
  ],
  "implementationPlan": "Step-by-step 30-day plan with AU-specific context (4-5 steps, practical, mention Xero/MYOB/ATO where relevant)",
  "estimatedTimeSaved": "e.g. '8-12 hours/week'",
  "dollarsPerWeekSaved": "${input.hourlyRate ? `calculate: hours saved x $${input.hourlyRate}, e.g. '$960-$1,440/week in recovered capacity'` : "estimate based on typical AU contractor rates, e.g. 'equivalent to $800-$1,200/week in recovered capacity'"}",
  "nextStep": "single most important first action they should take today, specific to their AU business"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  const jsonStr = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  const parsed = JSON.parse(jsonStr);

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
    auContext: parsed.auContext || "",
    recommendations,
    implementationPlan: parsed.implementationPlan,
    estimatedTimeSaved: parsed.estimatedTimeSaved,
    dollarsPerWeekSaved: parsed.dollarsPerWeekSaved || "",
    nextStep: parsed.nextStep,
  };
}
