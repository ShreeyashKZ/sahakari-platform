import React from "react";
import { useApp } from "../../context/AppContext";
import { 
  Users, 
  Briefcase, 
  Building2, 
  RefreshCw,
  ShieldCheck, 
  LogOut, 
  LogIn, 
  Zap,
  Info,
  Calendar,
  Layers,
  Vote,
  Compass
} from "lucide-react";

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { 
    role, 
    setRole, 
    resetDemoData, 
    currentUser, 
    logoutUser, 
    setIsAuthOpen,
    setIsMasterConsoleOpen,
  } = useApp();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setActiveTab("dashboard");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        {/* Cooperative Social Mission Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs py-1.5 px-4">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide">
                SAHAKARI COOPERATIVE
              </span>
              <span className="hidden sm:inline">Worker-Owned Gig Services Platform for Households & RWAs</span>
              <span className="sm:hidden text-[11px]">Worker-Owned Platform</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="hidden md:inline-flex items-center gap-1 text-emerald-100 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Labour Retained • Zero Profit Surcharge • Democratic Rates
              </span>
              <button
                onClick={resetDemoData}
                title="Reset sample data back to default presentation state"
                className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-md transition font-semibold text-xs"
              >
                <RefreshCw className="w-3 h-3" /> <span className="hidden sm:inline">Reset</span> Demo
              </button>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <p className="text-[11px] text-slate-500 -mt-0.5 font-medium hidden sm:block">
                  Fair Local Services Collective
                </p>
              </div>
            </div>

            {/* Desktop Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
              {role === "customer" && (
                <>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                      activeTab === "dashboard"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Services & Masters
                  </button>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                      activeTab === "bookings"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    My Bookings
                  </button>
                </>
              )}

              {role === "worker" && (
                <>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                      activeTab === "dashboard"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Worker Hub
                  </button>
                  <button
                    onClick={() => setActiveTab("jobs")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                      activeTab === "jobs"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Job Queue
                  </button>
                  <button
                    onClick={() => setActiveTab("earnings")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                      activeTab === "earnings"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Earnings & Ledger
                  </button>
                  <button
                    onClick={() => setActiveTab("assembly")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      activeTab === "assembly"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-indigo-700 hover:bg-indigo-50"
                    }`}
                  >
                    <Vote className="w-3.5 h-3.5" />
                    <span>Assembly & Voting</span>
                  </button>
                </>
              )}

              {role === "admin" && (
                <>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                      activeTab === "dashboard"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Society Command Center
                  </button>
                  <button
                    onClick={() => setActiveTab("requests")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                      activeTab === "requests"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Bulk Maintenance
                  </button>
                  <button
                    onClick={() => setActiveTab("bulletin")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      activeTab === "bulletin"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-emerald-800 hover:bg-emerald-50"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>Neighborhood Bulletin</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("assembly")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      activeTab === "assembly"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-indigo-700 hover:bg-indigo-50"
                    }`}
                  >
                    <Vote className="w-3.5 h-3.5" />
                    <span>Assembly</span>
                  </button>
                </>
              )}

              {/* Renamed About Sahakari Tab */}
              <button
                onClick={() => setActiveTab("landing")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  activeTab === "landing"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>About</span>
              </button>
            </nav>

            {/* Right Actions: Interactive Role Switcher & User Auth Pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => handleRoleChange("customer")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition h-9 ${
                    role === "customer"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Customer</span>
                </button>

                <button
                  onClick={() => handleRoleChange("worker")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition h-9 ${
                    role === "worker"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Worker Hub</span>
                  <span className="sm:hidden">Worker</span>
                </button>

                <button
                  onClick={() => handleRoleChange("admin")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition h-9 ${
                    role === "admin"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">RWA / Society</span>
                  <span className="sm:hidden">RWA</span>
                </button>
              </div>

              {/* Auth Login / Profile Pill */}
              {currentUser ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    title="Click to switch account"
                    className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 p-1.5 sm:px-2 rounded-xl transition cursor-pointer h-10"
                  >
                    <img
                      src={currentUser.avatar || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="hidden xl:block text-left leading-none">
                      <p className="text-[11px] font-extrabold text-slate-800 truncate max-w-[90px]">
                        {currentUser.name}
                      </p>
                      <span className="text-[9px] font-bold text-emerald-700 block mt-0.5">
                        {currentUser.isMasterAccount || currentUser.role === "master"
                          ? "⚡ Master Admin"
                          : currentUser.role === "worker"
                          ? (currentUser.isShareholder ? "Co-op Owner 🏷️" : "Worker Member")
                          : currentUser.role === "admin"
                          ? "RWA Admin"
                          : "Customer"}
                      </span>
                    </div>
                  </button>

                  {(currentUser.isMasterAccount || currentUser.role === "master") && (
                    <button
                      onClick={() => setIsMasterConsoleOpen(true)}
                      title="Open Master Live Console"
                      className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl shadow-xs hover:scale-105 transition cursor-pointer h-10"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>Console</span>
                    </button>
                  )}

                  <button
                    onClick={logoutUser}
                    title="Sign out"
                    className="p-2 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer h-10 w-10 flex items-center justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-1 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer h-10"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Sticky Mobile Bottom Navigation Bar (< 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 flex items-center justify-around shadow-lg">
        {role === "customer" && (
          <>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition min-h-[44px] min-w-[56px] ${
                activeTab === "dashboard" ? "text-emerald-700 bg-emerald-50 font-bold" : "text-slate-500"
              }`}
            >
              <Compass className="w-5 h-5 mb-0.5" />
              <span>Services</span>
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition min-h-[44px] min-w-[56px] ${
                activeTab === "bookings" ? "text-emerald-700 bg-emerald-50 font-bold" : "text-slate-500"
              }`}
            >
              <Calendar className="w-5 h-5 mb-0.5" />
              <span>Bookings</span>
            </button>
          </>
        )}

        {role === "worker" && (
          <>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition min-h-[44px] min-w-[56px] ${
                activeTab === "dashboard" ? "text-emerald-700 bg-emerald-50 font-bold" : "text-slate-500"
              }`}
            >
              <Briefcase className="w-5 h-5 mb-0.5" />
              <span>Hub</span>
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition min-h-[44px] min-w-[56px] ${
                activeTab === "jobs" ? "text-emerald-700 bg-emerald-50 font-bold" : "text-slate-500"
              }`}
            >
              <Layers className="w-5 h-5 mb-0.5" />
              <span>Queue</span>
            </button>
            <button
              onClick={() => setActiveTab("assembly")}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition min-h-[44px] min-w-[56px] ${
                activeTab === "assembly" ? "text-indigo-700 bg-indigo-50 font-bold" : "text-slate-500"
              }`}
            >
              <Vote className="w-5 h-5 mb-0.5" />
              <span>Voting</span>
            </button>
          </>
        )}

        {role === "admin" && (
          <>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition min-h-[44px] min-w-[56px] ${
                activeTab === "dashboard" ? "text-emerald-700 bg-emerald-50 font-bold" : "text-slate-500"
              }`}
            >
              <Building2 className="w-5 h-5 mb-0.5" />
              <span>Society</span>
            </button>
            <button
              onClick={() => setActiveTab("bulletin")}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition min-h-[44px] min-w-[56px] ${
                activeTab === "bulletin" ? "text-emerald-700 bg-emerald-50 font-bold" : "text-slate-500"
              }`}
            >
              <Zap className="w-5 h-5 mb-0.5 text-amber-500 fill-amber-400" />
              <span>Bulletin</span>
            </button>
            <button
              onClick={() => setActiveTab("assembly")}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition min-h-[44px] min-w-[56px] ${
                activeTab === "assembly" ? "text-indigo-700 bg-indigo-50 font-bold" : "text-slate-500"
              }`}
            >
              <Vote className="w-5 h-5 mb-0.5" />
              <span>Assembly</span>
            </button>
          </>
        )}

        {/* Global About Tab */}
        <button
          onClick={() => setActiveTab("landing")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition min-h-[44px] min-w-[56px] ${
            activeTab === "landing" ? "text-emerald-700 bg-emerald-50 font-bold" : "text-slate-500"
          }`}
        >
          <Info className="w-5 h-5 mb-0.5" />
          <span>About</span>
        </button>
      </div>
    </>
  );
};
