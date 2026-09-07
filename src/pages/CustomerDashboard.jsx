import React, { useState, useMemo } from "react";
import {
  Wrench,
  Zap,
  Hammer,
  Sparkles,
  Cpu,
  Trees,
  Paintbrush,
  Package,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  Search,
  Check,
  UserCheck,
  History,
  XCircle,
  Calendar
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ChatBargainModal } from "../components/customer/ChatBargainModal";
import { MockPaymentModal } from "../components/customer/MockPaymentModal";
import { ReviewModal } from "../components/customer/ReviewModal";
import { WorkerVerificationModal } from "../components/worker/WorkerVerificationModal";
import { QuickJobsSection } from "../components/customer/QuickJobsSection";
import { PaymentInterfaceModal } from "../components/customer/PaymentInterfaceModal";
import { CancelBookingModal } from "../components/customer/CancelBookingModal";

export const CustomerDashboard = ({ activeSubTab, setActiveSubTab }) => {
  const {
    services,
    workers,
    bookings,
    createBooking,
    cancelBooking,
    startChatSession,
    completePayment,
    submitReview,
    currentUser,
  } = useApp();

  // Workflow State:
  // Step 1: Selected Job / Service (Default: null - no job auto-selected)
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  // Bookings View Mode: 'active' | 'history'
  const [bookingsViewMode, setBookingsViewMode] = useState("active");
  const [historyFilter, setHistoryFilter] = useState("all"); // 'all' | 'completed' | 'cancelled'
  const [cancellingBooking, setCancellingBooking] = useState(null);

  // Step 2: Customer Priority ('proximity' | 'ratings' | 'price') + Emergency Toggle
  const [priority, setPriority] = useState("proximity"); // 'proximity' | 'ratings' | 'price'
  const [isEmergency, setIsEmergency] = useState(false);

  // Step 3 & 4: Selected Worker for Chat / Bargaining
  const [chattingWorker, setChattingWorker] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Workflow Step 5: Post-Bargain Payment Interface State
  const [pendingPaymentBooking, setPendingPaymentBooking] = useState(null);

  // Verification modal for worker bio inspection
  const [inspectWorker, setInspectWorker] = useState(null);

  // Payment & Review modals
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  const iconMap = {
    Wrench,
    Zap,
    Hammer,
    Sparkles,
    Cpu,
    Trees,
    Paintbrush,
    Package,
  };

  const selectedServiceObj = selectedServiceId
    ? services.find((s) => s.id === selectedServiceId) || null
    : null;

  // Step 3: Best Suggested Workers filtered & sorted by user priority + emergency
  const suggestedWorkers = useMemo(() => {
    if (!selectedServiceId) return [];
    return workers
      .filter((w) => {
        // Must match selected trade/service
        if (w.serviceId !== selectedServiceId) return false;

        // Emergency filter: only show workers near and available for emergency
        if (isEmergency) {
          return w.isAvailable && w.emergencyAvailable !== false;
        }

        return true;
      })
      .sort((a, b) => {
        if (isEmergency) {
          // Emergency strictly sorts by shortest ETA / distance
          const etaA = a.etaMinutes || a.distanceKm * 6;
          const etaB = b.etaMinutes || b.distanceKm * 6;
          return etaA - etaB;
        }

        if (priority === "proximity") {
          return a.distanceKm - b.distanceKm;
        }
        if (priority === "ratings") {
          return b.rating - a.rating;
        }
        if (priority === "price") {
          return (a.hourlyRate || 350) - (b.hourlyRate || 350);
        }
        return 0;
      });
  }, [workers, selectedServiceId, priority, isEmergency]);

  // Filtered bookings for Job History view
  const filteredHistoryBookings = useMemo(() => {
    if (historyFilter === "completed") {
      return bookings.filter((b) => b.status === "Completed");
    }
    if (historyFilter === "cancelled") {
      return bookings.filter((b) => b.status === "Cancelled");
    }
    return bookings;
  }, [bookings, historyFilter]);

  // Active / In-progress booking for profile tracker
  const activeBooking =
    bookings.find(
      (b) =>
        b.status === "Requested" ||
        b.status === "Accepted" ||
        b.status === "On the way" ||
        b.status === "Service Started" ||
        b.status === "In Progress"
    ) ||
    bookings.find((b) => b.status !== "Completed" && b.status !== "Cancelled") ||
    null;

  const handleOpenChat = (worker) => {
    startChatSession(worker, selectedServiceObj);
    setChattingWorker(worker);
    setIsChatOpen(true);
  };

  const handleBookingConfirmed = (newBookingData) => {
    setIsChatOpen(false);
    setChattingWorker(null);
    setPendingPaymentBooking(newBookingData);
  };

  return (
    <div className="space-y-6">
      
      {/* Sleek Sub-Tab Nav (Book a Job vs My Profile / Active Booking) */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveSubTab("find")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubTab === "find"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            1. Book a Trade Job
          </button>
          
          <button
            onClick={() => setActiveSubTab("bookings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === "bookings"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span>2. My Active Booking & Live ETA</span>
            {activeBooking && activeBooking.status !== "Completed" && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("quick-jobs")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
              activeSubTab === "quick-jobs"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>3. Quick Neighborhood Gigs</span>
            <span className="text-[10px] bg-emerald-900/40 text-emerald-900 font-black px-1.5 py-0.5 rounded-full">
              ₹ Earn / Casual Help
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Indiranagar, Bengaluru</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WORKFLOW VIEW: STEP 1 (JOB) -> STEP 2 (PRIORITY) -> STEP 3 (WORKERS)     */}
      {/* ========================================================================= */}
      {activeSubTab === "find" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* STEP 1: SELECT JOB NEEDED */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                  Step 1
                </span>
                <h2 className="text-base font-extrabold text-slate-900">
                  What job do you need?
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">8 Services</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {services.map((srv) => {
                const Icon = iconMap[srv.icon] || Wrench;
                const isSelected = selectedServiceId === srv.id;

                return (
                  <button
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs scale-[1.02]"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {srv.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        ₹{srv.basePrice} base
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* If No Service Selected Yet */}
          {!selectedServiceId ? (
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-3 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
                👆
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-extrabold text-slate-900">
                  Select a Service Above to Get Started
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose from Plumbing, Electrician, Carpentry, Deep Cleaning, Appliance Repair, Gardening, Painting, or Moving Helpers to view available verified workers and negotiate live rates.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 2: WHAT DO YOU PRIORITIZE? + EMERGENCY OPTION */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                      Step 2
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      What do you prioritize for this job?
                    </h3>
                  </div>

              {/* Emergency Switch Chip */}
              <button
                type="button"
                onClick={() => setIsEmergency(!isEmergency)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isEmergency
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Emergency Service {isEmergency ? "(Active)" : "(Need Fast Help)"}</span>
              </button>
            </div>

            {/* 3 Priority Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setPriority("proximity")}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
                  priority === "proximity" && !isEmergency
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    priority === "proximity" && !isEmergency
                      ? "bg-white/20 text-white"
                      : "bg-white text-emerald-600 shadow-2xs"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Proximity</p>
                  <p
                    className={`text-[11px] ${
                      priority === "proximity" && !isEmergency ? "text-emerald-100" : "text-slate-500"
                    }`}
                  >
                    Nearest workers within 2 km
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPriority("ratings")}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
                  priority === "ratings" && !isEmergency
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    priority === "ratings" && !isEmergency
                      ? "bg-white/20 text-white"
                      : "bg-white text-amber-500 shadow-2xs"
                  }`}
                >
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Ratings</p>
                  <p
                    className={`text-[11px] ${
                      priority === "ratings" && !isEmergency ? "text-emerald-100" : "text-slate-500"
                    }`}
                  >
                    Highest customer ratings (4.8★+)
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPriority("price")}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
                  priority === "price" && !isEmergency
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    priority === "price" && !isEmergency
                      ? "bg-white/20 text-white"
                      : "bg-white text-teal-600 shadow-2xs"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Price Point</p>
                  <p
                    className={`text-[11px] ${
                      priority === "price" && !isEmergency ? "text-emerald-100" : "text-slate-500"
                    }`}
                  >
                    Lowest base cooperative rates
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* STEP 3: SYSTEM SUGGESTS BEST MATCHED WORKERS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                  Step 3
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Best Suggested Workers ({suggestedWorkers.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Sorted by:{" "}
                <strong className="text-slate-800 capitalize">
                  {isEmergency ? "Emergency ETA" : priority}
                </strong>
              </span>
            </div>

            {suggestedWorkers.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">
                  No workers currently marked available for this filter.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Try turning off Emergency mode or selecting another service.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestedWorkers.map((worker) => {
                  const etaMins = worker.etaMinutes || Math.round(worker.distanceKm * 6 + 5);
                  const canBargain = worker.canBargain !== false;

                  return (
                    <div
                      key={worker.id}
                      className="bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Photo, Name, Rate */}
                        <div className="flex items-start gap-3">
                          <img
                            src={worker.avatar}
                            alt={worker.name}
                            className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="font-extrabold text-sm text-slate-900 truncate">
                                {worker.name}
                              </h4>
                              <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg shrink-0">
                                ₹{worker.hourlyRate || 350}/hr
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 font-medium">{worker.serviceName}</p>

                            <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap font-medium">
                              <span className="flex items-center gap-1 font-bold text-amber-700">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                {worker.rating} ({worker.reviewsCount})
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {worker.distanceKm} km
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ATTRACTION TAGS (Can be bargained with, Flat fixed price, Quickest in job, e-Shram) */}
                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                          {/* e-Shram Tag */}
                          {worker.isEshramVerified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-md">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              e-Shram Verified
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              Self-Declared
                            </span>
                          )}

                          {/* Bargain Tag */}
                          {canBargain ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                              🤝 Can be bargained with
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                              🔒 Flat fixed price
                            </span>
                          )}

                          {/* Quickest in the job ETA tag */}
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                            ⚡ {etaMins} mins away
                          </span>
                        </div>
                      </div>

                      {/* Action Button: Connect & Chat (Step 4) */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setInspectWorker(worker)}
                          className="py-2 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                        >
                          Bio
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenChat(worker)}
                          className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Select & Chat / Bargain</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )}

      {/* ========================================================================= */}
      {/* VIEW 2: ACTIVE BOOKING & LIVE MINUTES AWAY ON PROFILE / JOB HISTORY       */}
      {/* ========================================================================= */}
      {activeSubTab === "bookings" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Toggle: Active Job Tracker vs Previous History */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setBookingsViewMode("active")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  bookingsViewMode === "active"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active Job & Live ETA</span>
                {activeBooking && activeBooking.status !== "Cancelled" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setBookingsViewMode("history")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  bookingsViewMode === "history"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <History className="w-3.5 h-3.5 text-teal-600" />
                <span>Previous Job History</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-extrabold">
                  {bookings.length}
                </span>
              </button>
            </div>

            {bookingsViewMode === "history" && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Filter:</span>
                {[
                  { key: "all", label: `All (${bookings.length})` },
                  { key: "completed", label: `Completed (${bookings.filter((b) => b.status === "Completed").length})` },
                  { key: "cancelled", label: `Cancelled (${bookings.filter((b) => b.status === "Cancelled").length})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setHistoryFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      historyFilter === tab.key
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* VIEW MODE A: ACTIVE JOB */}
          {bookingsViewMode === "active" && (
            <>
              {!activeBooking ? (
                <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                    ⏱️
                  </div>
                  <div className="max-w-sm mx-auto">
                    <h3 className="text-base font-extrabold text-slate-800">No active bookings right now</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      All your requested work is either completed or you haven't booked any job yet.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveSubTab("find")}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Book a Worker
                    </button>
                    <button
                      onClick={() => setBookingsViewMode("history")}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>View Previous History ({bookings.length})</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
                  {/* Top ETA / Cancellation Status Banner */}
                  {activeBooking.status === "Cancelled" ? (
                    <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl">
                          ✕
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                              Cancelled by Customer
                            </span>
                            <span className="text-xs text-rose-100 font-mono">ID: {activeBooking.id}</span>
                          </div>
                          <h2 className="text-lg sm:text-xl font-black mt-0.5">
                            This booking was cancelled
                          </h2>
                          <p className="text-xs text-rose-100 mt-1">
                            Reason: {activeBooking.cancellationReason || "No reason given"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-right">
                        <span className="text-[10px] uppercase font-bold text-rose-200 block">Escrow Refund</span>
                        <span className="text-xs font-black text-white">100% Refund Initiated</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl">
                          ⏱️
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                              {activeBooking.status}
                            </span>
                            <span className="text-xs text-emerald-100 font-mono">ID: {activeBooking.id}</span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-black mt-0.5">
                            Worker is {activeBooking.etaMinutes || 12} Minutes Away
                          </h2>
                        </div>
                      </div>

                      {/* Service OTP */}
                      <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-emerald-200 block">Service OTP</span>
                          <span className="font-mono text-lg font-black tracking-widest text-white">
                            {activeBooking.serviceOtp || "4821"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Progress Milestones */}
                  {activeBooking.status !== "Cancelled" && (
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Booked
                        </span>
                        <span className="text-emerald-700 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          On the Way (~{activeBooking.etaMinutes || 12}m)
                        </span>
                        <span className={activeBooking.status === "In Progress" || activeBooking.status === "Completed" ? "text-emerald-700" : ""}>
                          Service Started
                        </span>
                        <span className={activeBooking.status === "Completed" ? "text-emerald-700" : ""}>
                          Completed
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Worker Profile on Customer Dashboard */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={activeBooking.workerAvatar || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"}
                        alt={activeBooking.workerName}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
                      />
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">{activeBooking.workerName}</h3>
                        <p className="text-xs text-slate-500 font-medium">{activeBooking.serviceCategory || activeBooking.serviceName}</p>
                        <p className="text-xs text-slate-600 font-bold mt-1">Phone: {activeBooking.workerPhone || "+91 98765 43210"}</p>
                        
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <a
                            href={`tel:${activeBooking.workerPhone || "9876543210"}`}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call Worker</span>
                          </a>

                          {/* Cancel Booking Button */}
                          {activeBooking.status !== "Completed" && activeBooking.status !== "Cancelled" && (
                            <button
                              type="button"
                              onClick={() => setCancellingBooking(activeBooking)}
                              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Cancel Booking</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Agreed Price</span>
                        <span className="font-extrabold text-slate-900 text-sm font-mono">
                          ₹{activeBooking.totalAmount || 380}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Payment Status</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            activeBooking.paymentStatus === "Paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : activeBooking.paymentStatus === "Refund Initiated"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {activeBooking.paymentStatus || "Pending at door"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Location</span>
                        <span className="font-medium text-slate-700">{activeBooking.address || "Your Address"}</span>
                      </div>

                      {/* Payment Button if not paid and not cancelled */}
                      {activeBooking.status !== "Cancelled" && activeBooking.paymentStatus !== "Paid" && (
                        <button
                          onClick={() => setPaymentBooking(activeBooking)}
                          className="w-full mt-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          Pay ₹{activeBooking.totalAmount || 380} via UPI / Cash
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* VIEW MODE B: PREVIOUS JOB HISTORY */}
          {bookingsViewMode === "history" && (
            <div className="space-y-4">
              {filteredHistoryBookings.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-base font-extrabold text-slate-800">No jobs in this category</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try changing your filter above to view all previous bookings.
                  </p>
                </div>
              ) : (
                filteredHistoryBookings.map((b) => {
                  const isCanc = b.status === "Cancelled";
                  const isComp = b.status === "Completed";

                  return (
                    <div
                      key={b.id}
                      className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                            💼
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-extrabold text-slate-900">
                                {b.serviceCategory || b.serviceName || "Service Job"}
                              </h4>
                              <span className="text-[11px] font-mono text-slate-400">ID: {b.id}</span>
                            </div>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>
                                {b.createdAt
                                  ? new Date(b.createdAt).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "Recent Booking"}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 ${
                              isCanc
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : isComp
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {isCanc ? "✕ Cancelled" : isComp ? "✓ Completed" : b.status}
                          </span>
                          <span className="font-extrabold text-slate-900 text-sm font-mono bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                            ₹{b.totalAmount || 350}
                          </span>
                        </div>
                      </div>

                      {/* Worker Assigned & Details */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              b.workerAvatar ||
                              "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&auto=format&fit=crop&q=80"
                            }
                            alt={b.workerName}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{b.workerName}</p>
                            <p className="text-[11px] text-slate-500">
                              Payment:{" "}
                              <span className="font-semibold">{b.paymentStatus || "Completed"}</span>
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {/* Cancel button if active in history */}
                          {!isCanc && !isComp && (
                            <button
                              type="button"
                              onClick={() => setCancellingBooking(b)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Cancel Job</span>
                            </button>
                          )}

                          {/* Book Again Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedServiceId(b.serviceId || "srv-1");
                              setActiveSubTab("find");
                            }}
                            className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3 text-emerald-700" />
                            <span>Book Again</span>
                          </button>
                        </div>
                      </div>

                      {/* If Cancelled: Show Reason in prominent callout */}
                      {isCanc && (
                        <div className="bg-rose-50/80 border border-rose-200/80 p-3 rounded-2xl text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-rose-900 font-bold">
                            <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>Reason for Cancellation:</span>
                          </div>
                          <p className="text-rose-700 font-medium pl-5">
                            "{b.cancellationReason || "Customer cancelled this job request."}"
                          </p>
                          <p className="text-[11px] text-emerald-700 font-bold pl-5">
                            ✓ 100% Escrow Refund initiated to original payment source.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Quick Jobs Discovery Banner right on Bookings Page */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Looking for Quick Casual Help or Want to Make Quick Money?
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Micro-tasks like pet walking, companionship, plant watering & box lifting with mandatory Aadhaar & Video call verification.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveSubTab("quick-jobs")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap shadow-xs"
            >
              Open Quick Gigs Hub →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: QUICK MICRO-JOBS & CASUAL TASKS                                    */}
      {/* ========================================================================= */}
      {activeSubTab === "quick-jobs" && (
        <QuickJobsSection />
      )}

      {/* Step 4: Interactive Chat & Bargain Window Modal */}
      <ChatBargainModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        worker={chattingWorker}
        onConfirmBooking={handleBookingConfirmed}
        isEmergency={isEmergency}
      />

      {/* Step 5: Post-Bargain Transparent Payment Interface */}
      <PaymentInterfaceModal
        isOpen={Boolean(pendingPaymentBooking)}
        onClose={() => setPendingPaymentBooking(null)}
        bookingDetails={pendingPaymentBooking}
        onPaymentSuccess={(finalBookingData) => {
          createBooking(finalBookingData);
          setPendingPaymentBooking(null);
          setActiveSubTab("bookings");
        }}
      />

      {/* Worker Bio / Verification inspection modal */}
      <WorkerVerificationModal
        isOpen={Boolean(inspectWorker)}
        onClose={() => setInspectWorker(null)}
        worker={inspectWorker}
      />

      {/* Payment Modal */}
      {paymentBooking && (
        <MockPaymentModal
          isOpen={Boolean(paymentBooking)}
          onClose={() => setPaymentBooking(null)}
          booking={paymentBooking}
          onSuccess={() => {
            completePayment(paymentBooking.id);
            setPaymentBooking(null);
            setReviewBooking(paymentBooking);
          }}
        />
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          isOpen={Boolean(reviewBooking)}
          onClose={() => setReviewBooking(null)}
          booking={reviewBooking}
          onSubmit={(bId, rating, text, tags) => {
            submitReview(bId, rating, text, tags);
            setReviewBooking(null);
          }}
        />
      )}

      {/* Cancel Booking Reason Modal */}
      <CancelBookingModal
        isOpen={Boolean(cancellingBooking)}
        onClose={() => setCancellingBooking(null)}
        booking={cancellingBooking}
        onConfirmCancel={(bookingId, reason, note) => {
          cancelBooking(bookingId, reason, note);
          setCancellingBooking(null);
        }}
      />
    </div>
  );
};
