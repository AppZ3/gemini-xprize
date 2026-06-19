import { notFound } from "next/navigation";
import { AdvisorOutput } from "@/lib/gemini";
import SharedPlanClient from "./SharedPlanClient";

async function getPlan(id: string): Promise<{ businessType: string; planData: AdvisorOutput } | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const res = await fetch(
    `${url}/rest/v1/plans?id=eq.${encodeURIComponent(id)}&select=business_type,plan_data`,
    {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    }
  );
  const data = await res.json();
  if (!data[0]) return null;
  return { businessType: data[0].business_type, planData: data[0].plan_data };
}

export default async function SharedPlanPage({ params }: { params: { id: string } }) {
  const plan = await getPlan(params.id);
  if (!plan) notFound();
  return <SharedPlanClient businessType={plan.businessType} result={plan.planData} />;
}
