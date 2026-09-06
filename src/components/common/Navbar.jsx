import React from "react";
import { useApp } from "../../context/AppContext";
import { 
  Users, 
  Briefcase, 
  Building2, 
  Sparkles, 
  RefreshCw,
  Award,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { role, setRole, resetDemoData } = useApp();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    // Reset tab to dashboard of that role
    setActiveTab("dashboard");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* SIH Hackathon Ribbon */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide">
              SIH 2026 PROTOTYPE
            </span>
            <span>Cooperative Gig Services Platform for Households & Societies</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" /> 0% Predatory Commission • 100% Worker Owned
            </span>
            <button
              onClick={resetDemoData}
              title="Reset sample data back to default SIH presentation state"
              className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded transition font-semibold"
            >
              <RefreshCw className="w-3 h-3" /> Reset Demo
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab("landing")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition">
              सह
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Sahakari<span className="text-emerald-600">.</span>
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                  Co-op
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 font-medium">
                Fair Local Services Collective
              </p>
            </div>
          </div>

          {/* Center Navigation Links based on role */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            {role === "customer" && (
              <>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "dashboard"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Explore Services
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "bookings"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  My Bookings
                </button>
                <button
                  onClick={() => setActiveTab("cooperative")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "cooperative"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  How Co-op Works
                </button>
              </>
            )}

            {role === "worker" && (
              <>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "dashboard"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Worker Hub
                </button>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "jobs"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Job Queue
                </button>
                <button
                  onClick={() => setActiveTab("earnings")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "earnings"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Earnings & Ledger
                </button>
                <button
                  onClick={() => setActiveTab("coop-member")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "coop-member"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Member Benefits
                </button>
              </>
            )}

            {role === "admin" && (
              <>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "dashboard"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Society Command Center
                </button>
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "requests"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Bulk Society Tasks
                </button>
                <button
                  onClick={() => setActiveTab("workers-pool")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "workers-pool"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Local Verified Workers
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab("landing")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "landing"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              SIH Pitch & Model
            </button>
          </nav>

          {/* Interactive Role Switcher for Hackathon Judges */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider hidden sm:inline">
                View As:
              </span>
              
              <button
                onClick={() => handleRoleChange("customer")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  role === "customer"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>

              <button
                onClick={() => handleRoleChange("worker")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  role === "worker"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Worker</span>
                <span className="hidden md:inline text-[10px] opacity-80">(Imran)</span>
              </button>

              <button
                onClick={() => handleRoleChange("admin")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  role === "admin"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Society RWA</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
