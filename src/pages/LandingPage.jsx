import React from "react";
import { 
  ShieldCheck, 
  Users, 
  Coins, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Scale, 
  HeartHandshake,
  TrendingDown,
  Lock
} from "lucide-react";

export const LandingPage = ({ onStartDemo, onSelectRole }) => {
  return (
    <div className="space-y-20 py-8 animate-in fade-in duration-300">
      {/* SIH Judge Pitch Hero */}
      <section className="text-center max-w-4xl mx-auto space-y-6 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Smart India Hackathon 2026 Internal Submission</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Trusted Local Services. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
            Fair Opportunities.
          </span>{" "}
          Stronger Communities.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The next generation digital cooperative connecting households, housing societies, and gig workers for everyday services — eliminating exploitative middleman commissions through community ownership.
        </p>

        {/* Quick Launch Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              onSelectRole("customer");
              onStartDemo("dashboard");
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
          >
            <span>Launch Customer Experience</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onSelectRole("worker");
              onStartDemo("jobs");
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Worker Hub (Imran Khan)</span>
          </button>

          <button
            onClick={() => {
              onSelectRole("admin");
              onStartDemo("dashboard");
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm border border-slate-300 shadow-xs transition flex items-center justify-center gap-2"
          >
            <span>Society RWA Portal</span>
          </button>
        </div>

        {/* Core Stats Bar */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-2xl font-black text-slate-900 font-mono">0%</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Predatory Commission</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-2xl font-black text-emerald-600 font-mono">100%</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Direct Worker Take-Home</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-2xl font-black text-slate-900 font-mono">4-Digit</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Doorstep Security OTP</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-2xl font-black text-slate-900 font-mono">RWA-Pool</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Society Maintenance</p>
          </div>
        </div>
      </section>

      {/* PROBLEM vs SOLUTION MATRIX (Crucial for SIH 30-second judging pitch) */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 max-w-6xl mx-auto shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
            Why Urban Company & Corporate Aggregators Fall Short
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">
            Corporate Monopolies vs. Democratic Cooperative
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Traditional venture apps extract heavy profits from workers while inflating customer costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Corporate Aggregator */}
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>Current Broken Model (Aggregator Giants)</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>25% to 35% Take-Rates:</strong> Worker earns ₹500, but corporation cuts ₹150+ as platform fees.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Zero Reputation Ownership:</strong> Worker is blocked by algorithms without human recourse.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Surge & Hidden Pricing:</strong> Customers face inflated markups and sudden inspection charges.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>No Community Society Integration:</strong> RWAs cannot coordinate neighborhood maintenance.</span>
              </li>
            </ul>
          </div>

          {/* Sahakari Cooperative Solution */}
          <div className="bg-emerald-950/60 p-6 rounded-2xl border border-emerald-500/40 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sahakari Digital Cooperative Solution</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>100% Worker Retained Payout:</strong> Only flat ₹25 co-op fee for insurance & software upkeep.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Portable Digital Reputation:</strong> Workers own their verified rating history and credentials.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Fair Standardized Pricing:</strong> Fixed rates upfront with transparent breakdown.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>RWA Bulk Collective Contracts:</strong> Societies can post 20-apartment maintenance tasks directly.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW THE COOPERATIVE WORKS (Flow Section) */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-10">
        <div>
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider">
            Transparent Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            End-to-End Cooperative Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-1">
            From smart neighbor-matching to secure OTP entry and direct instant UPI payouts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mx-auto">
              1
            </span>
            <p className="font-bold text-xs text-slate-900">Select Service</p>
            <p className="text-[11px] text-slate-500">Pick from transparent plumber, electrician & cleaning trades</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mx-auto">
              2
            </span>
            <p className="font-bold text-xs text-slate-900">Smart Match</p>
            <p className="text-[11px] text-slate-500">Ranked by proximity, verified badge & peer ratings</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mx-auto">
              3
            </span>
            <p className="font-bold text-xs text-slate-900">Doorstep OTP</p>
            <p className="text-[11px] text-slate-500">4-digit security code ensures verified entry at main gate</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mx-auto">
              4
            </span>
            <p className="font-bold text-xs text-slate-900">Execution</p>
            <p className="text-[11px] text-slate-500">Worker arrives promptly with cooperative quality guarantee</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mx-auto">
              5
            </span>
            <p className="font-bold text-xs text-slate-900">Direct Payout</p>
            <p className="text-[11px] text-slate-500">Worker takes home 100% of fair fee; ₹15 to medical pool</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mx-auto">
              6
            </span>
            <p className="font-bold text-xs text-slate-900">Worker Owns Rating</p>
            <p className="text-[11px] text-slate-500">Portable digital reputation attached to worker, not platform</p>
          </div>
        </div>
      </section>

      {/* TRUST & SAFETY COOPERATIVE CHARTER */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Trust & Verification Standard</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Multi-Layered Community Safety Protocol
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every worker on Sahakari is vetted through local residential verification, skill assessments, and RWA gate OTP protocols. Zero anonymous dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSelectRole("customer");
                onStartDemo("dashboard");
              }}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
            >
              Try Interactive Live Demo →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
