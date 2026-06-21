"use client";

import Link from "next/link";
import { AdvisorOutput } from "@/lib/gemini";

const priorityColors = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function SharedPlanClient({
  businessType,
  result,
}: {
  businessType: string;
  result: AdvisorOutput;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-blue-600">Business Advisor</span>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg"
          >
            Get your free blueprint
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Shared AU automation blueprint
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Automation blueprint for: <span className="text-blue-600">{businessType}</span>
          </h1>
        </div>

        <div className="bg-blue-600 text-white rounded-2xl p-8">
          <div className="text-sm font-medium text-blue-200 mb-2">Australian Business Automation Blueprint</div>
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
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recommended tools</h2>
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
                  <span className="font-medium text-slate-700">Why this fits: </span>
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
          <h2 className="font-semibold text-slate-900 mb-3">30-day implementation plan</h2>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{result.implementationPlan}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="text-sm font-semibold text-amber-800 mb-1">Next step today</div>
          <p className="text-amber-700">{result.nextStep}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
          <h3 className="font-bold text-slate-900 text-xl mb-2">Want your own blueprint?</h3>
          <p className="text-slate-600 mb-6 text-sm">This was generated for a {businessType}. Get a personalised one for your specific AU business in 30 seconds -- free.</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-lg transition-colors"
          >
            Get my free AU automation blueprint
          </Link>
        </div>
      </div>

      <footer className="border-t border-slate-200 mt-20 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>Australian business automation powered by Google Gemini AI</p>
        </div>
      </footer>
    </main>
  );
}
