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
  groundedFacts?: string;
};

const AU_BUSINESS_CONTEXT = `
AUSTRALIAN BUSINESS CONTEXT (apply this knowledge to every response):
- GST: 10% on most goods/services once turnover exceeds $75,000/year. BAS lodged quarterly (or monthly for large businesses). GST-registered businesses must reconcile and lodge by 28th day after each quarter.
- Superannuation: Employers must pay 11.5% SG on top of wages (rising to 12% from 1 July 2025). Due quarterly by 28th day after each quarter via SuperStream. Late super = Super Guarantee Charge penalty.
- STP (Single Touch Payroll): Mandatory for ALL employers. Each pay event reported to ATO digitally. Year-end finalisation required by 14 July each year.
- Fair Work Act: Award rates, penalty rates, leave entitlements (annual, sick, long service), and record-keeping obligations. Underpayments trigger back-pay + penalties.
- Popular AU accounting software: Xero (dominant, ~70% market share), MYOB AccountRight/Essentials, Reckon, QuickBooks Online (less common than US).
- Industry-specific AU software: ServiceM8 (trades), Deputy (rostering), Cliniko (healthcare/allied health), Vend/Lightspeed (retail), LEAP (legal), Karbon (accounting firms).
- ATO key dates: BAS Q1 due 28 Oct, Q2 due 28 Feb, Q3 due 28 Apr, Q4 due 28 Jul. PAYG withholding also quarterly for most small businesses.
- AU grants: R&D Tax Incentive (43.5% refundable offset for eligible R&D), Export Market Development Grant, Small Business Digital Adaptation Program (state-level), various state innovation grants.
- AU-specific pain points: Chasing 30/60-day invoice payments (slow payment culture), BAS preparation scramble, super lodgement deadlines, award rate compliance, WorkCover/workers compensation.
- Recommend Xero/MYOB integrations specifically. Flag GST/BAS automation as extremely high-value for any service business.
`.trim();

export async function getAutomationAdvice(input: AdvisorInput): Promise<AdvisorOutput> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    tools: [{ googleSearchRetrieval: {} }],
  });

  const productCatalog = ALL_PRODUCTS.map(p =>
    `${p.name} | $${p.price} | Tags: ${p.tags.join(", ")} | ${p.description}`
  ).join("\n");

  const rateContext = input.hourlyRate
    ? `- Your billable rate: $${input.hourlyRate}/hr AUD`
    : "";

  const prompt = `You are an expert Australian small business automation consultant with deep knowledge of AU tax, compliance, and operations. Use your web search to find the most current ATO deadlines, super rates, and AU grant opportunities relevant to this business.

${AU_BUSINESS_CONTEXT}

BUSINESS PROFILE:
- Business type: ${input.businessType}
- Team size: ${input.teamSize}
- Main pain points: ${input.painPoints}
- Current tools: ${input.currentTools || "Not specified"}
${rateContext}

AVAILABLE AUTOMATION PRODUCTS (match these to the business):
${productCatalog}

YOUR TASK:
1. Search for current AU business automation trends and any relevant ATO updates for this business type
2. Identify the 2-3 most impactful AU-specific automation opportunities (explicitly mention GST/BAS/super/Fair Work where relevant)
3. Select the 2-3 best-fit products from the catalog (match tags to their specific pain points)
4. Write a practical 30-60 day implementation roadmap with AU-specific milestones
5. Estimate time saved per week and dollar value${input.hourlyRate ? ` at $${input.hourlyRate}/hr` : " based on typical AU rates"}

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "summary": "2-3 sentences specifically addressing this Australian business context -- mention their pain points and the AU-specific angle (GST/BAS/super/Fair Work as relevant)",
  "auContext": "The single most important AU compliance or operational factor for THIS specific business type right now",
  "groundedFacts": "1-2 sentences of current, real data you found via search (e.g. current super rate, ATO deadline, relevant grant) -- cite what is current as of today",
  "recommendations": [
    {
      "productName": "exact product name from catalog",
      "reason": "specific reason this fits their AU business and their stated pain points (1-2 sentences)",
      "expectedImpact": "concrete, specific outcome e.g. '5-8 hours/week recovered from BAS prep and invoice chasing'",
      "priority": "high"
    }
  ],
  "implementationPlan": "Practical 30-60 day plan with AU-specific milestones. Mention connecting to Xero/MYOB, ATO lodgement dates, super payment dates where relevant. 4-6 clear steps.",
  "estimatedTimeSaved": "e.g. '8-12 hours/week'",
  "dollarsPerWeekSaved": "${input.hourlyRate ? `Calculate: hours saved x $${input.hourlyRate}/hr. Format: '$X,XXX-$X,XXX/week in recovered billable capacity'` : "Estimate using typical AU contractor/professional rates ($80-200/hr depending on industry). Format: 'equivalent to $X,XXX-$X,XXX/week'"}",
  "nextStep": "The single most important first action they should take TODAY -- specific, actionable, AU-context aware (e.g. 'Connect Xero to n8n before your next BAS quarter ends 28 October')"
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
    groundedFacts: parsed.groundedFacts || "",
    recommendations,
    implementationPlan: parsed.implementationPlan,
    estimatedTimeSaved: parsed.estimatedTimeSaved,
    dollarsPerWeekSaved: parsed.dollarsPerWeekSaved || "",
    nextStep: parsed.nextStep,
  };
}
