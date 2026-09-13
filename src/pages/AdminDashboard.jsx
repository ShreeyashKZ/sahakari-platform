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
  ArrowUpRight,
  Share2,
  Copy,
  Check,
  Zap,
  Vote,
  ExternalLink,
  MessageCircle
} from "lucide-react";
import { StatCard } from "../components/common/UIComponents";
import { useApp } from "../context/AppContext";
import { QuickJobsSection } from "../components/customer/QuickJobsSection";
import CooperativeAssemblyTab from "../components/worker/CooperativeAssemblyTab";

export const AdminDashboard = ({ 
  activeSubTab = "overview", 
  setActiveSubTab,
  onOpenNewRequestModal 
}) => {
  const { communityRequests, activeSocietyContext, societies } = useApp();
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedLink, setCopiedLink] = useState(false);

  // Active Society
  const currentSociety = societies?.find((s) => s.slug === activeSocietyContext) || societies?.[0] || {
    name: "Shanti Vihar Apartments RWA",
    slug: "shanti-vihar",
    registrationNo: "BLR/RWA/2019/4821",
    totalFlats: 160,
    inviteLink: "https://sahakari.org.in/join/rwa-shanti-vihar",
  };

  const inviteUrl = currentSociety.inviteLink || `https://sahakari.org.in/join/rwa-${currentSociety.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Namaste neighbors! Join our official ${currentSociety.name} cooperative gig services & maintenance hub on Sahakari: ${inviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const filteredRequests = communityRequests.filter((req) => {
    if (activeFilter === "all") return true;
    return req.status === activeFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Community Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Resident Welfare Association (RWA) Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {currentSociety.name} Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Reg: <strong className="font-mono text-emerald-300">{currentSociety.registrationNo}</strong> • Direct worker hiring, zero middleman margins, and shared community welfare pool.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onOpenNewRequestModal}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 h-11"
            >
              <Plus className="w-4 h-4" /> Post Society Maintenance Task
            </button>
          </div>
        </div>
      </div>

      {/* RWA Sharable Resident Invite Banner */}
      <div className="bg-gradient-to-r from-teal-900/90 to-emerald-900 text-white p-5 sm:p-6 rounded-3xl shadow-md border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>Sharable Resident Onboarding Link</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold">Invite Society Residents to Sahakari</h3>
          <p className="text-xs text-emerald-100/80 mt-0.5 max-w-lg">
            Share this link in your society WhatsApp group. When neighbors click, it connects them directly to your society's verified worker pool and active community bulletin.
          </p>
          <div className="mt-2.5 font-mono text-xs bg-black/30 border border-white/10 px-3 py-1.5 rounded-xl inline-block text-emerald-200">
            {inviteUrl}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyLink}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm h-11"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Invite Link</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-sm h-11"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* RWA Command Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 h-11 ${
            activeSubTab === "overview"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Society Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab("requests")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 h-11 ${
            activeSubTab === "requests"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Bulk Maintenance Tasks ({communityRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("bulletin")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 h-11 ${
            activeSubTab === "bulletin"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>Neighborhood Bulletin & Quick Gigs</span>
        </button>

        <button
          onClick={() => setActiveSubTab("assembly")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 h-11 ${
            activeSubTab === "assembly"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          }`}
        >
          <Vote className="w-4 h-4" />
          <span>Democratic Assembly</span>
        </button>
      </div>

      {/* SUBTAB 1: OVERVIEW */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          {/* Society Level Impact Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Covered Households"
              value={`${currentSociety.totalFlats || 160} Flats`}
              subtitle="All Wings & Blocks Registered"
              color="blue"
            />
            <StatCard
              title="Local Verified Workers"
              value="42 Workers"
              subtitle="PCC & NSQF Verified Guild"
              color="emerald"
            />
            <StatCard
              title="Total Maintenance Paid"
              value="₹42,500"
              subtitle="100% directly to local hands"
              trend="Saved ₹10,600 vs corporate apps"
              color="amber"
            />
            <StatCard
              title="Co-op Welfare Pool"
              value="₹3,400"
              subtitle="Community emergency tool fund"
              color="violet"
            />
          </div>

          {/* Active Community Bulk Work Orders Summary */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Active Community Service Orders
                </h3>
                <p className="text-xs text-slate-500">
                  Bulk society tasks dispatched to the local cooperative collective.
                </p>
              </div>
              <button
                onClick={() => setActiveSubTab("requests")}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                View All ({communityRequests.length}) →
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                    <span>Workers Assigned: <strong>Ramesh Kumar + 2 Plumbers</strong></span>
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
            </div>
          </div>

          {/* Notice Board */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">
              Society Notice Board & Safety Protocols
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Security Protocol
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2">
                  Mandatory 4-Digit OTP Gate Entry
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Main security gate guards verify the Sahakari Service OTP before permitting gig workers into resident apartments.
                </p>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">Posted by RWA Secretary • Sept 2, 2026</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Welfare Initiative
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2">
                  Quarterly Collective Health Camp
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Funded by the cooperative society welfare pool, free health checkups are scheduled for all 42 verified community gig workers.
                </p>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">Posted by Health Committee • Aug 29, 2026</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2: BULK MAINTENANCE TASKS */}
      {activeSubTab === "requests" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Community Bulk Maintenance Tasks
              </h3>
              <p className="text-xs text-slate-500">
                Pooled society jobs with collective bargaining savings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Filter:</span>
              {["all", "In Progress", "Open for Collective"].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition h-9 ${
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

          <div className="space-y-3">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {req.id}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{req.title}</h4>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      req.status === "In Progress" ? "bg-emerald-600 text-white" : "bg-blue-100 text-blue-800"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{req.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>Category: <strong className="capitalize">{req.category}</strong></span>
                    <span>•</span>
                    <span>Workers Needed: <strong>{req.workersNeeded}</strong></span>
                    <span>•</span>
                    <span>Date: <strong>{req.dateScheduled}</strong></span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-slate-400 uppercase block">Budget</span>
                  <span className="text-lg font-extrabold text-slate-900 font-mono">{req.budget}</span>
                  <p className="text-[10px] text-emerald-600 font-bold">{req.cooperativeBonus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: NEIGHBORHOOD BULLETIN & QUICK GIGS */}
      {activeSubTab === "bulletin" && (
        <div className="space-y-4">
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-400 flex-shrink-0" />
              <span>
                <strong>Neighborhood Bulletin:</strong> Casual micro-tasks (pet walking, plant care, badminton partners) posted by residents of {currentSociety.name}. Mandatory Aadhaar e-KYC and video call verification applied for safety.
              </span>
            </div>
          </div>
          <QuickJobsSection />
        </div>
      )}

      {/* SUBTAB 4: DEMOCRATIC ASSEMBLY */}
      {activeSubTab === "assembly" && (
        <CooperativeAssemblyTab isRwaView={true} />
      )}

    </div>
  );
};
