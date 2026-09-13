import React from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  HeartHandshake,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";

export const WorkerEarningsSection = ({ worker }) => {
  // Weekly earnings trend data
  const chartData = [
    { day: "Mon", earnings: 700, jobs: 2 },
    { day: "Tue", earnings: 950, jobs: 2 },
    { day: "Wed", earnings: 450, jobs: 1 },
    { day: "Thu", earnings: 1250, jobs: 3 },
    { day: "Fri", earnings: 850, jobs: 2 },
    { day: "Sat", earnings: 1400, jobs: 3 },
    { day: "Sun (Today)", earnings: worker.earnings.today || 850, jobs: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Earnings Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today's Take-Home
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
            ₹{worker.earnings.today.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>✓ 100% Payout Disbursed</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            This Week's Earnings
          </span>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
            ₹{worker.earnings.thisWeek.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            +18% from last week
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Monthly Co-op Earnings
          </span>
          <p className="text-2xl font-black text-emerald-700 mt-2 font-mono">
            ₹{worker.earnings.thisMonth.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Zero deductions or penalties
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Middleman Fees Saved
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">
            ₹{Math.round(worker.earnings.allTime * 0.28).toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Extra earnings vs 28% corporate cuts
          </p>
        </div>
      </div>

      {/* Recharts Graphical Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Daily Earnings Velocity
            </h3>
            <p className="text-xs text-slate-500">
              Live payouts credited directly to worker bank UPI account with 0 delay.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Cooperative Tier 1 Member
          </span>
        </div>

        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(val) => `₹${val}`} />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Worker Earnings"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#earningsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cooperative Solidarity Model Explainer for Workers */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-emerald-300 text-xs font-semibold mb-3">
            <HeartHandshake className="w-4 h-4" /> Cooperative Member Charter
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            "Your Work. Your Reputation. Your Earnings."
          </h2>
          <p className="text-sm text-emerald-100/80 mt-2 leading-relaxed">
            In corporate aggregator apps, you are an algorithmic cog subject to random account blocks and hefty 30% cuts. In Sahakari, you co-own your digital identity, set your honest standard fares, and receive mutual aid.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 p-3.5 rounded-xl backdrop-blur-xs border border-white/10">
              <p className="font-extrabold text-sm text-white">Zero-Profit Model</p>
              <p className="text-xs text-emerald-200 mt-1">
                100% labour earnings are yours. Flat at-cost ₹25 funds your medical tool pool & servers.
              </p>
            </div>
            <div className="bg-white/10 p-3.5 rounded-xl backdrop-blur-xs border border-white/10">
              <p className="font-extrabold text-sm text-white">Portable Identity</p>
              <p className="text-xs text-emerald-200 mt-1">
                Ratings and reviews belong to you, not a private tech giant.
              </p>
            </div>
            <div className="bg-white/10 p-3.5 rounded-xl backdrop-blur-xs border border-white/10">
              <p className="font-extrabold text-sm text-white">Community Contracts</p>
              <p className="text-xs text-emerald-200 mt-1">
                Direct access to recurring society and RWA bulk maintenance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
