"use client";

import { useState, useEffect } from "react";
import { AdvisorOutput } from "@/lib/gemini";

const TEAM_SIZES = ["Just me", "2-5 people", "6-20 people", "20+ people"];

const BUSINESS_EXAMPLES = [
  "Tradie / plumber / electrician",
  "Mortgage broker",
  "NDIS support provider",
  "Marketing agency",
  "Accounting firm",
  "Real estate agency",
  "E-commerce store",
  "Healthcare clinic",
  "Restaurant or cafe",
  "Freelance consultant",
];

export default function Home() {
  const [form, setForm] = useState({
    businessType: "",
    teamSize: "Just me",
    painPoints: "",
    currentTools: "",
    hourlyRate: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvisorOutput | null>(null);
  const [error, setError] = useState("");
  const [blueprintCount, setBlueprintCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/counter")
      .then(r => r.json())
      .then(d => setBlueprintCount(d.count ?? null))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
        }),
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
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-blue-600">Business Advisor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full font-medium">AU-specific</span>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Powered by Gemini AI</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {!result ? (
          <>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Built for Australian small businesses
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Your free AI automation<br />
                <span className="text-blue-600">blueprint for AU business</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Gemini analyses your business with Australian context built in: GST, BAS, super, Fair Work, and the tools AU businesses actually use. Get your personalised plan in 30 seconds.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-blue-600">
                  {blueprintCount !== null && blueprintCount > 0
                    ? blueprintCount.toLocaleString()
                    : "10+ hrs"}
                </div>
                <div className="text-sm text-slate-500">
                  {blueprintCount !== null && blueprintCount > 0
                    ? "blueprints generated"
                    : "saved per week"}
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-blue-600">AU-first</div>
                <div className="text-sm text-slate-500">GST, BAS, super context</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-blue-600">Free</div>
                <div className="text-sm text-slate-500">instant blueprint</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Tell us about your Australian business</h2>
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
                    placeholder="e.g. Tradie, mortgage broker, marketing agency..."
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
                    placeholder="e.g. Chasing invoices, doing BAS manually, data entry between Xero and spreadsheets, following up clients..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tools you use (optional)
                    </label>
                    <input
                      type="text"
                      value={form.currentTools}
                      onChange={e => setForm(f => ({ ...f, currentTools: e.target.value }))}
                      placeholder="e.g. Xero, MYOB, HubSpot, Slack..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Your hourly rate (optional, AUD)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      value={form.hourlyRate}
                      onChange={e => setForm(f => ({ ...f, hourlyRate: e.target.value }))}
                      placeholder="e.g. 150"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-slate-400 mt-1">Used to calculate dollar value of time saved</p>
                  </div>
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
                      Gemini is searching AU data and analysing your business...
                    </>
                  ) : (
                    "Get my free AU automation blueprint"
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  Free. No email required. Australian business context built in. Powered by Google Gemini AI.
                </p>
              </form>
            </div>

            <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-800 mb-3">What makes this AU-specific?</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-600">
                {[
                  "GST registration and BAS lodgement automation",
                  "Superannuation payment reminders and tracking",
                  "Xero and MYOB workflow integrations",
                  "Fair Work compliance record-keeping",
                  "ATO deadline alerts and STP payroll",
                  "AU government grant opportunity tracking",
                ].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">+</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <Results
            result={result}
            businessType={form.businessType}
            onReset={() => setResult(null)}
          />
        )}
      </div>

      <footer className="border-t border-slate-200 mt-20 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>Australian business automation powered by Google Gemini AI</p>
        </div>
      </footer>
    </main>
  );
}

function Results({
  result,
  businessType,
  onReset,
}: {
  result: AdvisorOutput;
  businessType: string;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [shareLoading, setShareLoading] = useState(false);

  async function downloadWorkflow() {
    setWorkflowLoading(true);
    try {
      const res = await fetch("/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType,
          painPoints: result.summary,
          currentTools: "",
          recommendations: result.recommendations,
        }),
      });
      const workflow = await res.json();
      const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `au-business-automation-${businessType.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setWorkflowLoading(false);
    }
  }

  const priorityColors = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-slate-50 text-slate-700 border-slate-200",
  };

  function copyBlueprint() {
    const text = [
      `Automation Blueprint for: ${businessType}`,
      "",
      result.summary,
      "",
      result.auContext ? `AU Context: ${result.auContext}` : "",
      "",
      `Time saved: ${result.estimatedTimeSaved}`,
      result.dollarsPerWeekSaved ? `Value: ${result.dollarsPerWeekSaved}` : "",
      "",
      "Recommended products:",
      ...result.recommendations.map(r => `- ${r.product.name}: ${r.expectedImpact}`),
      "",
      "30-day plan:",
      result.implementationPlan,
      "",
      `Next step: ${result.nextStep}`,
      "",
      "Generated by Business Advisor (gemini-xprize.vercel.app)",
    ].filter(Boolean).join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function getShareLink() {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      return;
    }
    setShareLoading(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType, planData: result }),
      });
      const data = await res.json();
      if (data.id) {
        const link = `${window.location.origin}/plan/${data.id}`;
        setShareLink(link);
        navigator.clipboard.writeText(link);
      }
    } finally {
      setShareLoading(false);
    }
  }

  function shareOnX() {
    const text = `Just got my free AI automation blueprint for my AU business - saves ${result.estimatedTimeSaved} per week. Try it: https://gemini-xprize.vercel.app #SmallBusiness #Australia #Automation`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  }

  function shareOnLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://gemini-xprize.vercel.app")}`, "_blank");
  }

  async function sendByEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailLoading(true);
    try {
      await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, businessType, summary: result.summary }),
      });
      setEmailSent(true);
    } finally {
      setEmailLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 text-white rounded-2xl p-8">
        <div className="text-sm font-medium text-blue-200 mb-2">Your Australian Business Automation Blueprint</div>
        <p className="text-lg leading-relaxed">{result.summary}</p>
        {result.auContext && (
          <div className="mt-4 p-3 bg-blue-500/50 rounded-xl text-sm text-blue-100">
            <span className="font-semibold text-white">AU note: </span>{result.auContext}
          </div>
        )}
        {result.groundedFacts && (
          <div className="mt-3 p-3 bg-white/10 border border-white/20 rounded-xl text-sm text-blue-50">
            <span className="font-semibold text-white">Live AU data (via Gemini Search): </span>{result.groundedFacts}
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <div>
            <span className="text-blue-300">Time saved: </span>
            <span className="font-semibold">{result.estimatedTimeSaved}</span>
          </div>
          {result.dollarsPerWeekSaved && (
            <div>
              <span className="text-blue-300">Value: </span>
              <span className="font-semibold text-green-300">{result.dollarsPerWeekSaved}</span>
            </div>
          )}
        </div>
      </div>

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

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-3">Your 30-day implementation plan</h2>
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{result.implementationPlan}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="text-sm font-semibold text-amber-800 mb-1">Your next step today</div>
        <p className="text-amber-700">{result.nextStep}</p>
      </div>

      {/* Email capture */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        {!emailSent ? (
          <>
            <h3 className="font-semibold text-slate-800 mb-1">Get this blueprint by email</h3>
            <p className="text-sm text-slate-500 mb-4">We will send your personalised plan so you can refer back to it any time.</p>
            <form onSubmit={sendByEmail} className="flex gap-3">
              <input
                type="email"
                required
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="your@email.com.au"
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                disabled={emailLoading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                {emailLoading ? "Sending..." : "Send blueprint"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-2">
            <div className="text-green-600 font-semibold">Blueprint sent! Check your inbox.</div>
            <p className="text-sm text-slate-500 mt-1">We will also notify you when we add new AU-specific automation tools.</p>
          </div>
        )}
      </div>

      {/* n8n workflow download */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
        <h3 className="font-semibold text-orange-900 mb-1">Download your n8n automation workflow</h3>
        <p className="text-sm text-orange-700 mb-4">Get a ready-to-import n8n JSON file with AU-specific BAS reminders, super guarantee alerts, and business automations tailored to your setup. Import directly into any n8n instance.</p>
        <button
          onClick={downloadWorkflow}
          disabled={workflowLoading}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {workflowLoading ? "Generating..." : "Download n8n workflow (.json)"}
        </button>
      </div>

      {/* Share */}
      <div className="space-y-3">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={copyBlueprint}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors"
          >
            {copied ? "Copied!" : "Copy blueprint"}
          </button>
          <button
            onClick={shareOnX}
            className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Share on X
          </button>
          <button
            onClick={shareOnLinkedIn}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Share on LinkedIn
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={getShareLink}
            disabled={shareLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {shareLoading ? "Saving..." : shareLink ? "Link copied!" : "Get shareable link"}
          </button>
          {shareLink && (
            <div className="flex-1 px-3 py-2.5 bg-slate-100 text-slate-600 text-xs rounded-lg truncate font-mono">
              {shareLink}
            </div>
          )}
          <button
            onClick={onReset}
            className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors"
          >
            Analyse another
          </button>
        </div>
      </div>
    </div>
  );
}
