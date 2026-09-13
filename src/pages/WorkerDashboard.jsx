import React, { useState } from "react";
import {
  Briefcase,
  DollarSign,
  CheckCircle2,
  Star,
  Award,
  Clock,
  MapPin,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Sliders,
  AlertTriangle,
  PhoneCall,
  Sparkles,
  Vote,
  Coins,
  ChevronRight,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { JobRequestCard } from "../components/worker/JobRequestCard";
import { WorkerEarningsSection } from "../components/worker/WorkerEarningsSection";
import { WorkerVerificationModal } from "../components/worker/WorkerVerificationModal";
import CooperativeAssemblyTab from "../components/worker/CooperativeAssemblyTab";

export const WorkerDashboard = ({ activeSubTab, setActiveSubTab }) => {
  const {
    currentWorker,
    bookings,
    updateBookingStatus,
    communityRequests,
    updateWorkerSettings,
    purchaseMemberShare,
  } = useApp();

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [emergencyAvailable, setEmergencyAvailable] = useState(
    Boolean(currentWorker?.emergencyAvailable !== false)
  );
  const [shareSuccessMsg, setShareSuccessMsg] = useState(null);

  // Trust score calculation
  const isPolice = Boolean(currentWorker?.isPoliceVerified);
  const isNsqf = Boolean(currentWorker?.isNsqfCertified);
  let trustScore = 40;
  if (isPolice) trustScore += 30;
  if (isNsqf) trustScore += 30;

  const isShareholder = Boolean(currentWorker?.isShareholder);

  const handlePurchaseShare = (planType) => {
    purchaseMemberShare(currentWorker.id, planType);
    setShareSuccessMsg(
      planType === "one_time"
        ? "🎉 1 Co-op Voting Share Purchased! You are now a Full Voting Co-owner."
        : "✅ Micro-retention plan activated! ₹10 will be reserved per completed job toward your voting share."
    );
    setTimeout(() => setShareSuccessMsg(null), 6000);
  };

  // Filter jobs for this worker
  const workerBookings = bookings.filter((b) => b.workerId === currentWorker.id);
  const pendingRequests = workerBookings.filter((b) => b.status === "Requested");
  const activeJobs = workerBookings.filter(
    (b) => b.status !== "Requested" && b.status !== "Completed" && b.status !== "Cancelled"
  );
  const completedJobs = workerBookings.filter((b) => b.status === "Completed");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Worker Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={currentWorker.avatar}
              alt={currentWorker.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black">{currentWorker.name}</h1>
                
                {isShareholder ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1">
                    🏷️ Full Voting Co-owner
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600 text-xs font-medium">
                    Associate Member
                  </span>
                )}

                {isPolice && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    🛡️ Police Verified
                  </span>
                )}

                {isNsqf && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 text-xs font-bold">
                    🎓 NSQF Level 4
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-emerald-200 mt-0.5 font-medium">
                {currentWorker.serviceName} • {currentWorker.experienceYears} Years Experience • Bengaluru East Guild
              </p>

              <div className="flex items-center gap-4 mt-2 text-xs text-slate-300 flex-wrap">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {currentWorker.rating} ({currentWorker.reviewsCount || 84} reviews)
                </span>
                <span>•</span>
                <span>Base Rate: <strong>₹{currentWorker.hourlyRate || 350}/hr</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{currentWorker.availability}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setShowVerificationModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-1.5 cursor-pointer h-11"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Trust & Badges ({trustScore}%)</span>
            </button>
            <button
              onClick={() => setActiveSubTab("earnings")}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer h-11"
            >
              <DollarSign className="w-4 h-4" />
              <span>Earnings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Purchase Success Toast */}
      {shareSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{shareSuccessMsg}</span>
          </div>
          <button onClick={() => setShareSuccessMsg(null)} className="font-bold text-emerald-700 px-2">
            ✕
          </button>
        </div>
      )}

      {/* TWO PILLARS: COOPERATIVE CAPITAL & TRUST SCORE PROGRESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Pillar 1: Cooperative Member Capital & Voting Share */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Cooperative Member Capital</h3>
                  <p className="text-[11px] text-slate-500">Democratically co-own platform assets & vote</p>
                </div>
              </div>
              <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                isShareholder ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}>
                {isShareholder ? "Full Voting Co-owner" : "Associate Member"}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {isShareholder
                ? "You hold 1 active voting share in the Sahakari Guild. You are empowered to cast binding votes in the democratic assembly."
                : "Own 1 voting share (nominal value: ₹100). Co-owners receive democratic voting rights on rate cards and annual welfare dividends."}
            </p>
          </div>

          {!isShareholder ? (
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => handlePurchaseShare("one_time")}
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs h-11 flex items-center justify-center gap-1.5"
              >
                <span>Purchase Share (₹100 One-Time)</span>
              </button>
              <button
                type="button"
                onClick={() => handlePurchaseShare("micro")}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition h-11 flex items-center justify-center gap-1"
                title="Micro-retention: ₹10 per completed job until ₹100 is accumulated"
              >
                <span>Micro-retention (₹10/job)</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>🏷️ Co-op Shareholder & Voting Member Unlocked</span>
              </span>
              <button
                onClick={() => setActiveSubTab("assembly")}
                className="text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>View Assembly Ballots</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Pillar 2: Progressive Trust Score Checklist */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Your Trust Score: {trustScore}%</h3>
                  <p className="text-[11px] text-slate-500">
                    {trustScore === 100
                      ? "Maximum trust level reached! Priority matching active."
                      : `Boost booking rate by completing optional verifications`}
                  </p>
                </div>
              </div>
              <span className="font-mono font-bold text-sm text-indigo-700">{trustScore}/100</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3">
              <div
                style={{ width: `${trustScore}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
              />
            </div>

            {/* Checklist items */}
            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Aadhaar Digital e-KYC
                </span>
                <span className="text-emerald-700 font-bold">+40% (Verified)</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5 font-medium">
                  {isPolice ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  Police Character Certificate (PCC)
                </span>
                <span className={isPolice ? "text-emerald-700 font-bold" : "text-slate-400"}>
                  {isPolice ? "+30% (Verified)" : "+30% Available"}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5 font-medium">
                  {isNsqf ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  Skill India (NSQF Level 4) Card
                </span>
                <span className={isNsqf ? "text-emerald-700 font-bold" : "text-slate-400"}>
                  {isNsqf ? "+30% (Verified)" : "+30% Available"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowVerificationModal(true)}
              className="w-full py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 h-11"
            >
              <span>Upload Credentials & Claim 50% Verification Reimbursement</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* SUB-TABS NAVIGATION BAR */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("jobs")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer h-11 ${
            activeSubTab === "jobs"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Queue</span>
          {pendingRequests.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("earnings")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer h-11 ${
            activeSubTab === "earnings"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Earnings & Ledger</span>
        </button>

        <button
          onClick={() => setActiveSubTab("assembly")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer h-11 ${
            activeSubTab === "assembly"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          }`}
        >
          <Vote className="w-4 h-4" />
          <span>Democratic Assembly & Ballots</span>
        </button>
      </div>

      {/* SUBTAB VIEW 1: JOB QUEUE */}
      {activeSubTab === "jobs" && (
        <div className="space-y-6">
          
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span>Incoming Job Inquiries ({pendingRequests.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((b) => (
                  <JobRequestCard
                    key={b.id}
                    booking={b}
                    onAccept={(id) => updateBookingStatus(id, "Accepted")}
                    onReject={(id) => updateBookingStatus(id, "Cancelled")}
                    onStartService={(id) => updateBookingStatus(id, "Service Started")}
                    onCompleteService={(id) => updateBookingStatus(id, "Completed")}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active Work In-Flight */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              Active In-Flight Work ({activeJobs.length})
            </h3>
            {activeJobs.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
                No active jobs underway. Accept requests from incoming inquiries above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeJobs.map((b) => (
                  <JobRequestCard
                    key={b.id}
                    booking={b}
                    onAccept={(id) => updateBookingStatus(id, "Accepted")}
                    onReject={(id) => updateBookingStatus(id, "Cancelled")}
                    onStartService={(id) => updateBookingStatus(id, "Service Started")}
                    onCompleteService={(id) => updateBookingStatus(id, "Completed")}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Completed Work History */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              Recent Completed Services ({completedJobs.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedJobs.slice(0, 4).map((b) => (
                <JobRequestCard
                  key={b.id}
                  booking={b}
                  onAccept={() => {}}
                  onReject={() => {}}
                  onStartService={() => {}}
                  onCompleteService={() => {}}
                />
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB VIEW 2: EARNINGS & LEDGER */}
      {activeSubTab === "earnings" && (
        <WorkerEarningsSection worker={currentWorker} bookings={workerBookings} />
      )}

      {/* SUBTAB VIEW 3: DEMOCRATIC ASSEMBLY & BALLOTS */}
      {activeSubTab === "assembly" && (
        <CooperativeAssemblyTab />
      )}

      {/* Verification Modal */}
      <WorkerVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        worker={currentWorker}
      />

    </div>
  );
};
