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
  MessageSquare,
  PhoneCall,
  Send,
  Tag,
  Check,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { JobRequestCard } from "../components/worker/JobRequestCard";
import { WorkerEarningsSection } from "../components/worker/WorkerEarningsSection";
import { WorkerVerificationModal } from "../components/worker/WorkerVerificationModal";

export const WorkerDashboard = ({ activeSubTab, setActiveSubTab }) => {
  const {
    currentWorker,
    bookings,
    updateBookingStatus,
    communityRequests,
    activeChatSession,
    sendChatMessage,
    respondToBargainOffer,
    updateWorkerSettings,
    updateBookingEta,
  } = useApp();

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [workerReplyText, setWorkerReplyText] = useState("");
  const [counterPriceInput, setCounterPriceInput] = useState(
    currentWorker?.hourlyRate ? currentWorker.hourlyRate - 30 : 380
  );
  const [isCallingCustomer, setIsCallingCustomer] = useState(false);

  // Local state for worker attraction tags & preferences
  const [canBargain, setCanBargain] = useState(currentWorker?.canBargain !== false);
  const [emergencyAvailable, setEmergencyAvailable] = useState(
    Boolean(currentWorker?.emergencyAvailable !== false)
  );
  const [etaMinutes, setEtaMinutes] = useState(currentWorker?.etaMinutes || 12);
  const [activeTags, setActiveTags] = useState(
    currentWorker?.attractionTags || ["Can be bargained with", "Quickest in the job"]
  );

  const toggleTag = (tag) => {
    let updated;
    if (activeTags.includes(tag)) {
      updated = activeTags.filter((t) => t !== tag);
    } else {
      updated = [...activeTags, tag];
    }
    setActiveTags(updated);
    updateWorkerSettings(currentWorker.id, { attractionTags: updated });
  };

  const handleBargainToggle = (val) => {
    setCanBargain(val);
    const updatedTags = val
      ? [...activeTags.filter((t) => t !== "Flat fixed price"), "Can be bargained with"]
      : [...activeTags.filter((t) => t !== "Can be bargained with"), "Flat fixed price"];
    setActiveTags(updatedTags);
    updateWorkerSettings(currentWorker.id, {
      canBargain: val,
      attractionTags: updatedTags,
    });
  };

  const handleEmergencyToggle = (val) => {
    setEmergencyAvailable(val);
    updateWorkerSettings(currentWorker.id, { emergencyAvailable: val });
  };

  const handleEtaChange = (mins) => {
    setEtaMinutes(mins);
    updateWorkerSettings(currentWorker.id, { etaMinutes: mins });
  };

  // Filter jobs for this worker
  const workerBookings = bookings.filter((b) => b.workerId === currentWorker.id);
  const pendingRequests = workerBookings.filter((b) => b.status === "Requested");
  const activeJobs = workerBookings.filter(
    (b) => b.status !== "Requested" && b.status !== "Completed" && b.status !== "Cancelled"
  );
  const completedJobs = workerBookings.filter((b) => b.status === "Completed");
  const cancelledJobs = workerBookings.filter((b) => b.status === "Cancelled");

  const handleSendWorkerReply = (e) => {
    e.preventDefault();
    if (!workerReplyText.trim()) return;
    sendChatMessage("worker", workerReplyText.trim());
    setWorkerReplyText("");
  };

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
                {currentWorker.isEshramVerified ? (
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 hover:bg-emerald-500/30 transition cursor-pointer"
                    title={`e-Shram UAN: ${currentWorker.eshramNumber || "Verified"}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    e-Shram Verified
                  </button>
                ) : (
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 hover:bg-amber-500/30 transition cursor-pointer"
                    title="No e-Shram linked. Click to view guide."
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    Add e-Shram Card
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-emerald-200 mt-0.5 font-medium">
                {currentWorker.serviceName} • {currentWorker.experienceYears} Years Experience
              </p>

              <div className="flex items-center gap-4 mt-2 text-xs text-slate-300 flex-wrap">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {currentWorker.rating} ({currentWorker.reviewsCount} reviews)
                </span>
                <span>•</span>
                <span>Base Rate: <strong>₹{currentWorker.hourlyRate || 350}/hr</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{currentWorker.availability}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowVerificationModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>e-Shram & Badges</span>
            </button>
            <button
              onClick={() => setActiveSubTab("earnings")}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Earnings</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WORKER SIDE: STRATEGY & ATTRACTION TAGS CONTROL PANEL                     */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>Attract Customers: Pricing Strategy & Availability</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize tags that customers see when filtering by proximity, price, or emergency.
            </p>
          </div>

          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Live on Customer Marketplace
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Emergency Service Toggle */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Emergency Jobs
              </span>
              <button
                type="button"
                onClick={() => handleEmergencyToggle(!emergencyAvailable)}
                className={`text-xs font-bold px-2 py-0.5 rounded-lg transition cursor-pointer ${
                  emergencyAvailable
                    ? "bg-rose-600 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {emergencyAvailable ? "Available (ON)" : "Off"}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Shows your profile when customers trigger the Emergency filter for instant dispatch.
            </p>
          </div>

          {/* Bargaining Strategy Toggle */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                Bargaining Policy
              </span>
              <button
                type="button"
                onClick={() => handleBargainToggle(!canBargain)}
                className={`text-xs font-bold px-2 py-0.5 rounded-lg transition cursor-pointer ${
                  canBargain
                    ? "bg-amber-600 text-white"
                    : "bg-slate-700 text-white"
                }`}
              >
                {canBargain ? "Open to Bargain" : "Flat Fixed"}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {canBargain
                ? "Customers can open price meter slider and negotiate."
                : "Profile shows 'Flat fixed price' tag with guaranteed standard rate."}
            </p>
          </div>

          {/* Quick Arrival ETA Setting */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Fastest ETA
              </span>
              <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {etaMinutes} mins
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[8, 12, 18, 25].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleEtaChange(mins)}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    etaMinutes === mins
                      ? "bg-teal-700 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-Attraction Tags Bar */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-700 mb-2">
            Select Tags to Display Beside Your Card:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Can be bargained with",
              "Flat fixed price",
              "Quickest in the job",
              "Emergency Ready",
              "Top Rated Craftsman",
              "Eco Cleaning Specialist",
            ].map((tag) => {
              const isSelected = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WORKER SIDE: ACTIVE CUSTOMER BARGAIN & CHAT INQUIRIES DESK                */}
      {/* ========================================================================= */}
      {activeChatSession && activeChatSession.workerId === currentWorker.id && (
        <div className="bg-amber-50/70 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              <h3 className="text-sm font-extrabold text-amber-950">
                Live Customer Negotiation & Chat Desk
              </h3>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                Active Session
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCallingCustomer(!isCallingCustomer)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{isCallingCustomer ? "End Call with Customer" : "Call Customer (+91 98450 12345)"}</span>
              </button>
            </div>
          </div>

          {/* Bargain Offer Card */}
          {activeChatSession.proposedPrice && (
            <div className="bg-white p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-amber-800 tracking-wider block">
                  Customer's Bargain Offer
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    ₹{activeChatSession.proposedPrice}
                  </span>
                  <span className="text-xs text-slate-400">
                    (Base Rate: ₹{activeChatSession.baseRate})
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Zero-Profit Payout: ₹{Math.max(100, activeChatSession.proposedPrice - 25)} (₹25 at-cost pool)
                  </span>
                </div>
              </div>

              {/* Action Buttons for Worker */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => respondToBargainOffer("accept")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accept ₹{activeChatSession.proposedPrice}</span>
                </button>

                <button
                  type="button"
                  onClick={() => respondToBargainOffer("decline")}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Decline (Keep ₹{activeChatSession.baseRate})
                </button>
              </div>
            </div>
          )}

          {/* Chat Stream in Worker view */}
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 max-h-48 overflow-y-auto space-y-2">
            {activeChatSession.messages.map((m) => {
              const isWorker = m.sender === "worker";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isWorker ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-2.5 text-xs ${
                      isWorker
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p>{m.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.timestamp}</span>
                </div>
              );
            })}
          </div>

          {/* Worker Reply Bar */}
          <form onSubmit={handleSendWorkerReply} className="flex items-center gap-2">
            <input
              type="text"
              value={workerReplyText}
              onChange={(e) => setWorkerReplyText(e.target.value)}
              placeholder="Reply to customer (e.g. 'I am nearby at Indiranagar Metro, I can come now')..."
              className="flex-1 px-3 py-2 text-xs bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Reply
            </button>
          </form>
        </div>
      )}

      {/* Primary Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab("jobs")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === "jobs"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <span>Incoming Requests</span>
          {pendingRequests.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("earnings")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === "earnings"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Earnings & Ledger
        </button>

        <button
          onClick={() => setActiveSubTab("community-bids")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === "community-bids"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Society Tasks ({communityRequests.length})
        </button>
      </div>

      {/* VIEW 1: INCOMING JOBS & ACTIVE WORK ORDERS */}
      {activeSubTab === "jobs" && (
        <div className="space-y-6">
          {/* Pending Requests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span>New Household Booking Requests</span>
                {pendingRequests.length > 0 && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    Action Required
                  </span>
                )}
              </h3>
              <span className="text-xs text-slate-500 font-medium">100% of price goes to you</span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                No new pending requests right now. You are visible to households within 5 km!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((b) => (
                  <JobRequestCard
                    key={b.id}
                    booking={b}
                    onAccept={(id) => updateBookingStatus(id, "Accepted")}
                    onReject={(id) => updateBookingStatus(id, "Rejected")}
                    onStartService={(id) => updateBookingStatus(id, "Service Started")}
                    onCompleteService={(id) => updateBookingStatus(id, "Completed")}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Active Work In Progress */}
          <div>
            <h3 className="font-extrabold text-slate-900 text-base mb-3">
              Jobs In Progress / Accepted
            </h3>

            {activeJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                No jobs currently active. Accept a request above to start service.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeJobs.map((b) => (
                  <JobRequestCard
                    key={b.id}
                    booking={b}
                    onAccept={(id) => updateBookingStatus(id, "Accepted")}
                    onReject={(id) => updateBookingStatus(id, "Rejected")}
                    onStartService={(id) => updateBookingStatus(id, "Service Started")}
                    onCompleteService={(id) => updateBookingStatus(id, "Completed")}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cancelled Work Orders Section with Reasons */}
          {cancelledJobs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span className="text-rose-700">Cancelled Work Orders</span>
                  <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                    {cancelledJobs.length}
                  </span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">Customer reasons communicated transparently</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cancelledJobs.map((b) => (
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
          )}
        </div>
      )}

      {/* VIEW 2: EARNINGS & LEDGER */}
      {activeSubTab === "earnings" && (
        <WorkerEarningsSection worker={currentWorker} completedBookings={completedJobs} />
      )}

      {/* VIEW 3: COMMUNITY SOCIETY TASKS */}
      {activeSubTab === "community-bids" && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              Resident Welfare Society Collective Tasks
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Local apartment complexes post guaranteed recurring maintenance contracts for cooperative workers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communityRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {req.societyName}
                    </span>
                    <span className="font-mono text-sm font-extrabold text-slate-900">
                      {req.budget}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{req.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{req.description}</p>
                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{req.dateScheduled}</span>
                    <button
                      onClick={() => alert(`Bid submitted for ${req.title}! Society RWA will review your verified profile.`)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                    >
                      Express Interest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
