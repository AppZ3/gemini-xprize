"use client";

import { useState } from "react";
import { AdvisorOutput } from "@/lib/gemini";

const TEAM_SIZES = ["Just me", "2-5 people", "6-20 people", "20+ people"];

const BUSINESS_EXAMPLES = [
  "Marketing agency with 3 staff",
  "Freelance web developer",
  "Small accounting firm",
  "E-commerce store",
  "Real estate agency",
  "Healthcare clinic",
  "Restaurant or cafe",
];

export default function Home() {
  const [form, setForm] = useState({
    businessType: "",
    teamSize: "Just me",
    painPoints: "",
    currentTools: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvisorOutput | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }
      const data: AdvisorOutput = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-slate-900">AppZ</span>
            <span className="text-xl font-light text-blue-600 ml-1">Automation Advisor</span>
          </div>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Powered by Gemini AI</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {!result ? (
          <>
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Gemini AI analyses your business in seconds
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Stop doing tasks <br />
                <span className="text-blue-600">AI can handle</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Describe your business. Gemini builds your personalised automation blueprint and recommends the exact tools to save 10+ hours per week.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              {[
                { value: "10+ hrs", label: "saved per week" },
                { value: "33", label: "automation packs" },
                { value: "Free", label: "instant blueprint" },
              ].map(stat => (
                <div key={stat.label} className="text-center p-4 bg-white rounded-xl border border-slate-200">
                  <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Tell us about your business</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    What type of business do you run? *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.businessType}
                    onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))}
                    placeholder="e.g. Marketing agency, freelance designer, accounting firm..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {BUSINESS_EXAMPLES.map(ex => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, businessType: ex }))}
                        className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-full transition-colors"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Team size</label>
                  <div className="flex gap-2 flex-wrap">
                    {TEAM_SIZES.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, teamSize: size }))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          form.teamSize === size
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-300 hover:border-blue-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    What takes up too much of your time? *
                  </label>
                  <textarea
                    required
                    value={form.painPoints}
                    onChange={e => setForm(f => ({ ...f, painPoints: e.target.value }))}
                    placeholder="e.g. Manually sending invoices and chasing payments, copying data between spreadsheets, following up with clients..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tools you currently use (optional)
                  </label>
                  <input
                    type="text"
                    value={form.currentTools}
                    onChange={e => setForm(f => ({ ...f, currentTools: e.target.value }))}
                    placeholder="e.g. Xero, HubSpot, Google Sheets, Slack..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Gemini is analysing your business...
                    </>
                  ) : (
                    "Get my free automation blueprint"
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  Free. No email required. Powered by Google Gemini AI.
                </p>
              </form>
            </div>
          </>
        ) : (
          <Results result={result} onReset={() => setResult(null)} />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-20 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>AppZ AI Studio &mdash; Business automation powered by Google Gemini AI</p>
          <p className="mt-1">Built for the Build with Gemini XPRIZE 2026</p>
        </div>
      </footer>
    </main>
  );
}

function Results({ result, onReset }: { result: AdvisorOutput; onReset: () => void }) {
  const priorityColors = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="bg-blue-600 text-white rounded-2xl p-8">
        <div className="text-sm font-medium text-blue-200 mb-2">Your Automation Blueprint</div>
        <p className="text-lg leading-relaxed">{result.summary}</p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-blue-300">Estimated time saved:</span>
            <span className="font-semibold">{result.estimatedTimeSaved}</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recommended for your business</h2>
        <div className="space-y-4">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{rec.product.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{rec.product.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-slate-900">${rec.product.price}</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full border mt-1 ${priorityColors[rec.priority]}`}>
                    {rec.priority} priority
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm">
                <span className="font-medium text-slate-700">Why this fits you: </span>
                <span className="text-slate-600">{rec.reason}</span>
              </div>
              <div className="bg-green-50 rounded-lg p-3 mb-4 text-sm">
                <span className="font-medium text-green-700">Expected impact: </span>
                <span className="text-green-600">{rec.expectedImpact}</span>
              </div>
              <div className="flex gap-3">
                <a
                  href={rec.product.gumroadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Get on Gumroad
                </a>
                <a
                  href={rec.product.payhipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Get on Payhip
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation plan */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-3">Your 30-day implementation plan</h2>
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{result.implementationPlan}</p>
      </div>

      {/* Next step CTA */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="text-sm font-semibold text-amber-800 mb-1">Your next step today</div>
        <p className="text-amber-700">{result.nextStep}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-colors"
        >
          Analyse another business
        </button>
      </div>
    </div>
  );
}
