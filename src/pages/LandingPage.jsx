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
  Lock,
  Server,
  HelpCircle
} from "lucide-react";
import { MiddlemanSavingsBubble } from "../components/common/MiddlemanSavingsBubble";

export const LandingPage = ({ onStartDemo, onSelectRole }) => {
  return (
    <div className="space-y-20 py-8 animate-in fade-in duration-300">
      {/* SIH Judge Pitch Hero */}
      <section className="text-center max-w-4xl mx-auto space-y-6 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero-Profit Operating Model • Smart India Hackathon 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Trusted Local Services. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
            Fair Opportunities.
          </span>{" "}
          Stronger Communities.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The next generation digital gig cooperative connecting households, housing societies, and skilled local workers — replacing 25–30% venture-capital extraction with a <strong>Zero-Profit Operating Model</strong>: 100% labour value retained by workers + a transparent flat at-cost infrastructure fee.
        </p>

        {/* Quick Launch Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              onSelectRole("customer");
              onStartDemo("dashboard");
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Launch Customer Experience</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onSelectRole("worker");
              onStartDemo("jobs");
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Worker Hub (Imran Khan)</span>
          </button>

          <button
            onClick={() => {
              onSelectRole("admin");
              onStartDemo("dashboard");
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm border border-slate-300 shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Society RWA Portal</span>
          </button>
        </div>

        {/* Core Stats Bar: Solves the 0% Commission Paradox */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-2xl font-black text-slate-900 font-mono">0%</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">VC Profit Margin</p>
            <span className="text-[10px] text-emerald-700 font-bold block mt-1">Zero Private Extraction</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-2xl font-black text-emerald-600 font-mono">100%</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Labour Fee to Worker</p>
            <span className="text-[10px] text-emerald-700 font-bold block mt-1">Direct Take-Home</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-2xl font-black text-slate-900 font-mono">₹25</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Flat At-Cost Fee</p>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">₹15 Welfare + ₹10 Servers</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-2xl font-black text-teal-600 font-mono">~28%</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Middleman Saved</p>
            <span className="text-[10px] text-teal-700 font-bold block mt-1">Extra Income in Hand</span>
          </div>
        </div>

        {/* Live Middleman Savings Preview Chips */}
        <div className="pt-4 max-w-2xl mx-auto flex items-center justify-center gap-2 flex-wrap text-xs text-slate-600">
          <span className="font-semibold text-slate-500">Live Corporate Cut Saved Examples:</span>
          <MiddlemanSavingsBubble amount={350} workerName="Imran (Plumber)" badgeText="Plumbing: ₹98 Saved for Worker" />
          <MiddlemanSavingsBubble amount={550} workerName="Anita (Cleaner)" badgeText="Cleaning: ₹154 Saved for Worker" />
        </div>
      </section>

      {/* PROBLEM vs SOLUTION MATRIX (Crucial for SIH 30-second judging pitch) */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 max-w-6xl mx-auto shadow-2xl space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
            Addressing the "0% Commission" Reality • Built for Judicial & Economic Rigor
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">
            Why Urban Company Takes 30% vs. Why Sahakari Charges ₹25
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Software does have operating costs (cloud servers, SMS/OTP gateways, UPI switches). The problem with corporate giants is not operating costs — it's <strong>venture capital extracting 25–30% predatory profit margins</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Corporate Aggregator */}
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>Corporate Aggregator Model (Urban Company, etc.)</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>25% to 35% Predatory Take-Rates:</strong> Worker earns ₹500, but corporation cuts ₹150+ for shareholder dividends and VC marketing burn.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Who Pays for Servers?</strong> Customers & workers pay for servers <em>plus</em> 10x markups in corporate profit margins.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Zero Reputation Ownership:</strong> Worker is an algorithmic cog, blocked without human appeal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Customer Price Surges:</strong> Hidden booking fees, inflated inspection fees, and surge pricing.</span>
              </li>
            </ul>
          </div>

          {/* Sahakari Cooperative Solution */}
          <div className="bg-emerald-950/60 p-6 rounded-2xl border border-emerald-500/40 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sahakari Democratic Zero-Profit Model</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>100% Labour Value Retained by Worker:</strong> If a job is ₹400, the full ₹400 labour fee goes to the worker's bank account.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Transparent ₹25 Democratic At-Cost Fee:</strong>
                  <div className="mt-1 pl-2 text-[11px] text-emerald-300 space-y-0.5 border-l border-emerald-600">
                    <p>• <strong>₹15</strong> → Worker Medical Emergency, Health & Tool Replacement Pool</p>
                    <p>• <strong>₹10</strong> → Actual at-cost AWS cloud, SMS/OTP gateways, and 1.8% UPI switch</p>
                  </div>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>0% Venture Capital Extraction:</strong> Zero shareholder dividends. 100% of middleman fees stay in worker hands.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Democratic Worker Governance:</strong> Platform fee changes and rules are voted upon by cooperative members.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* The Jury Answer Banner */}
        <div className="bg-slate-800/90 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
              ⚖️
            </div>
            <div>
              <p className="font-bold text-white">The Judge & Investor Answer:</p>
              <p className="text-slate-300 text-[11px] mt-0.5">
                "We don't claim software has zero cost. We claim software doesn't need a 30% private monopoly tax. We operate at transparent audited cost."
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Audit Transparency
            </span>
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
            <p className="font-bold text-xs text-slate-900">Zero-Profit Payout</p>
            <p className="text-[11px] text-slate-500">Worker retains 100% labour fee; flat ₹25 covers mutual welfare & at-cost servers</p>
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
