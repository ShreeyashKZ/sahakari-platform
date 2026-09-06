import React, { useState } from "react";
import { 
  Building2, 
  Users, 
  Wrench, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Layers,
  ArrowUpRight
} from "lucide-react";
import { StatCard } from "../components/common/UIComponents";

export const AdminDashboard = ({ onOpenNewRequestModal }) => {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Community Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Resident Welfare Association (RWA) Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Shanti Vihar Apartments Community Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Organize collective bulk maintenance, eliminate middleman markups, and directly empower your verified neighborhood gig workers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onOpenNewRequestModal}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Post Society Maintenance Task
            </button>
          </div>
        </div>
      </div>

      {/* Society Level Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Covered Households"
          value="120 Flats"
          subtitle="Shanti Vihar Block A, B & C"
          color="blue"
        />
        <StatCard
          title="Local Verified Workers"
          value="34 Workers"
          subtitle="Electricians, Plumbers, Cleaners"
          color="emerald"
        />
        <StatCard
          title="Total Maintenance Paid"
          value="₹42,500"
          subtitle="100% directly to local hands"
          trend="Saved ₹10,600 vs aggregators"
          color="amber"
        />
        <StatCard
          title="Co-op Welfare Pool"
          value="₹3,400"
          subtitle="Community emergency tool fund"
          color="violet"
        />
      </div>

      {/* Active Community Bulk Work Orders */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Active Community Service Requests
            </h3>
            <p className="text-xs text-slate-500">
              Bulk society maintenance jobs dispatched to the local worker collective.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Filter:</span>
            {["all", "In Progress", "Open for Collective"].map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`text-xs px-3 py-1 rounded-lg font-semibold transition ${
                  activeFilter === status
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status === "all" ? "All Tasks" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="mt-4 space-y-3">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  CR-101
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Pre-Monsoon Society Pipeline & Rainwater Sump Inspection
                </h4>
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  In Progress
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Inspect pipeline leaks & clean drainage traps across 24 flats in Block B & C.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <span>Workers Assigned: <strong>Imran Khan + 2 Plumbers</strong></span>
                <span>•</span>
                <span>Date: <strong>Sept 10, 2026</strong></span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase block">Total Budget</span>
              <span className="text-lg font-extrabold text-slate-900 font-mono">₹6,800</span>
              <p className="text-[10px] text-emerald-600 font-bold">Includes ₹350 Welfare Fund</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  CR-102
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Basement Parking & Common Area LED Sensor Lights Retrofitting
                </h4>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Open for Collective
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Replace 60 fluorescent tubes with low-power LEDs in basement car parking.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <span>Workers Needed: <strong>2 Electricians</strong></span>
                <span>•</span>
                <span>Date: <strong>Sept 12, 2026</strong></span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase block">Total Budget</span>
              <span className="text-lg font-extrabold text-slate-900 font-mono">₹5,200</span>
              <p className="text-[10px] text-slate-500 font-medium">Bidding by verified members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Community RWA Announcements Board */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-base mb-4">
          Society Notice Board & Worker Safety Directives
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Security Protocol
            </span>
            <h4 className="font-bold text-slate-900 text-sm mt-2">
              Mandatory 4-Digit OTP Gate Entry
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Main security gate guards are instructed to verify the Sahakari Service OTP before permitting gig workers into resident apartments.
            </p>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">Posted by RWA Secretary • Sept 2, 2026</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              Welfare Initiative
            </span>
            <h4 className="font-bold text-slate-900 text-sm mt-2">
              Quarterly Collective Health Camp
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Funded by the cooperative society welfare pool, free eye and health checkups are scheduled for all 34 verified community gig workers.
            </p>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">Posted by Health Committee • Aug 29, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};
