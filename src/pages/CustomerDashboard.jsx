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
  ArrowRight,
  RotateCcw,
  Search,
  Check,
  UserCheck,
  History,
  XCircle,
  Calendar,
  Award,
  Printer,
  ChevronRight
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { MockPaymentModal } from "../components/customer/MockPaymentModal";
import { ReviewModal } from "../components/customer/ReviewModal";
import { WorkerVerificationModal } from "../components/worker/WorkerVerificationModal";
import { PaymentInterfaceModal } from "../components/customer/PaymentInterfaceModal";
import { CancelBookingModal } from "../components/customer/CancelBookingModal";
import { MiddlemanSavingsBubble } from "../components/common/MiddlemanSavingsBubble";

export const CustomerDashboard = ({ activeSubTab, setActiveSubTab }) => {
  const {
    services,
    workers,
    bookings,
    createBooking,
    cancelBooking,
    completePayment,
    submitReview,
    currentUser,
    openReceiptModal,
    upgradeBookingToFullRepair,
  } = useApp();

  // Workflow State:
  // Step 1: Selected Job / Service (Default: null - no job auto-selected)
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  // Service Option: 'diagnostic' (50% base rate) | 'full' (100% standard rate)
  const [serviceOption, setServiceOption] = useState("diagnostic");

  // Step 2: Customer Priority ('proximity' | 'ratings' | 'price') + Emergency Toggle
  const [priority, setPriority] = useState("proximity");
  const [isEmergency, setIsEmergency] = useState(false);

  // Trust / Verification Filter: 'all' | 'police' | 'nsqf'
  const [trustFilter, setTrustFilter] = useState("all");

  // Bookings View Mode: 'active' | 'history'
  const [bookingsViewMode, setBookingsViewMode] = useState("active");
  const [historyFilter, setHistoryFilter] = useState("all"); // 'all' | 'completed' | 'cancelled'
  const [cancellingBooking, setCancellingBooking] = useState(null);

  // Checkout modal
  const [pendingPaymentBooking, setPendingPaymentBooking] = useState(null);

  // Verification modal for worker bio inspection
  const [inspectWorker, setInspectWorker] = useState(null);

  // Payment & Review modals
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  // Toast / upgrade feedback
  const [upgradeNotification, setUpgradeNotification] = useState(null);

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

  // Best Suggested Workers filtered by service, emergency, and trust badge
  const suggestedWorkers = useMemo(() => {
    if (!selectedServiceId) return [];
    return workers
      .filter((w) => {
        // Must match selected trade/service
        if (w.serviceId !== selectedServiceId) return false;

        // Emergency filter
        if (isEmergency) {
          if (!w.isAvailable || w.emergencyAvailable === false) return false;
        }

        // Trust badge filter
        if (trustFilter === "police" && !w.isPoliceVerified) return false;
        if (trustFilter === "nsqf" && !w.isNsqfCertified) return false;

        return true;
      })
      .sort((a, b) => {
        if (isEmergency) {
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
  }, [workers, selectedServiceId, priority, isEmergency, trustFilter]);

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

  // Active in-flight booking
  const activeBooking = bookings.find(
    (b) => b.status !== "Completed" && b.status !== "Cancelled"
  );

  const handleStartBooking = (worker) => {
    const isDiag = serviceOption === "diagnostic";
    const baseStandardRate = worker.hourlyRate || selectedServiceObj?.basePrice || 400;
    const effectiveRate = isDiag ? Math.round(baseStandardRate * 0.5) : baseStandardRate;

    setPendingPaymentBooking({
      workerId: worker.id,
      workerName: worker.name,
      workerAvatar: worker.avatar,
      workerPhone: worker.phone,
      serviceId: worker.serviceId || selectedServiceObj.id,
      serviceName: worker.serviceName || selectedServiceObj.name,
      bookingType: isDiag ? "Diagnostic / Problem Inspection" : "Full Standard Repair / Service",
      isDiagnostic: isDiag,
      canUpgradeToFull: isDiag,
      diagnosticPrice: Math.round(baseStandardRate * 0.5),
      standardPrice: baseStandardRate,
      agreedRate: effectiveRate,
      baseRate: baseStandardRate,
      etaMinutes: worker.etaMinutes || 15,
      address: currentUser?.address || "Flat 402, Shanti Vihar Apartments, Indiranagar, Bengaluru",
    });
  };

  const handleUpgradeBooking = (bookingId) => {
    upgradeBookingToFullRepair(bookingId);
    setUpgradeNotification("Booking successfully upgraded to Full Standard Repair! Technician will complete end-to-end work on-site.");
    setTimeout(() => setUpgradeNotification(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* SubTab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {activeSubTab === "find" ? "Book a Cooperative Master" : "Your Bookings & Invoices"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            100% Direct Labour to Technician • Transparent Diagnostic Inspection & Zero Middleman Surcharge
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("find")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 h-11 ${
              activeSubTab === "find"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Find Services</span>
          </button>

          <button
            onClick={() => setActiveSubTab("bookings")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 h-11 ${
              activeSubTab === "bookings"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Bookings ({bookings.length})</span>
            {activeBooking && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* Upgrade Confirmation Notification */}
      {upgradeNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-900 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{upgradeNotification}</span>
          </div>
          <button
            onClick={() => setUpgradeNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* VIEW 1: FIND SERVICES WORKFLOW */}
      {activeSubTab === "find" && (
        <div className="space-y-6">
          
          {/* STEP 1: SERVICE TRADE SELECTION */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                  Step 1
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Select Required Trade Service
                </h3>
              </div>
              {selectedServiceId && (
                <button
                  type="button"
                  onClick={() => setSelectedServiceId(null)}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Selection</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {services.map((srv) => {
                const Icon = iconMap[srv.icon] || Wrench;
                const isSelected = selectedServiceId === srv.id;

                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => {
                      setSelectedServiceId(srv.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 h-24 ${
                      isSelected
                        ? "bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs scale-[1.02]"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {srv.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
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
                  Choose from Plumbing, Electrician, Carpentry, Deep Cleaning, Appliance Repair, Gardening, Painting, or Moving Helpers to view available verified masters and transparent rate cards.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1.5: 50% DIAGNOSTIC INSPECTION VS FULL REPAIR CHOICES */}
              <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border border-emerald-200/80 rounded-3xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                      Fair Standard Pricing
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Choose Service Tier for {selectedServiceObj.name}
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> 1-Click Upgrade Available On-Site
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option A: 50% Diagnostic / Problem Inspection */}
                  <button
                    type="button"
                    onClick={() => setServiceOption("diagnostic")}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2.5 ${
                      serviceOption === "diagnostic"
                        ? "bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
                        : "bg-white/80 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                          50%
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Option A: Diagnostic / Problem Inspection</p>
                          <p className="text-[11px] text-slate-500">Unsure of exact issue? Fault finding & estimate</p>
                        </div>
                      </div>
                      <span className="text-base font-black text-emerald-700 font-mono">
                        ₹{Math.round((selectedServiceObj.basePrice || 350) * 0.5)}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200/60 font-medium leading-relaxed">
                      💡 <strong>Flexible:</strong> If technician diagnoses & fixes on-site, 1-click upgrades to full service with your doorstep approval.
                    </div>
                  </button>

                  {/* Option B: Full Standard Repair / Service */}
                  <button
                    type="button"
                    onClick={() => setServiceOption("full")}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2.5 ${
                      serviceOption === "full"
                        ? "bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
                        : "bg-white/80 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          100%
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Option B: Full Standard Repair / Service</p>
                          <p className="text-[11px] text-slate-500">Known fault complete restoration & 30-day warranty</p>
                        </div>
                      </div>
                      <span className="text-base font-black text-slate-900 font-mono">
                        ₹{selectedServiceObj.basePrice || 350}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 font-medium leading-relaxed">
                      🔒 <strong>Flat Rate:</strong> 100% labour fee credited directly to worker account. No surge markups or hidden fees.
                    </div>
                  </button>
                </div>
              </div>

              {/* STEP 2: PRIORITY & EMERGENCY */}
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
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs h-11 ${
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
                      <p className={`text-[11px] ${priority === "proximity" && !isEmergency ? "text-emerald-100" : "text-slate-500"}`}>
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
                      <p className={`text-[11px] ${priority === "ratings" && !isEmergency ? "text-emerald-100" : "text-slate-500"}`}>
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
                      <p className={`text-[11px] ${priority === "price" && !isEmergency ? "text-emerald-100" : "text-slate-500"}`}>
                        Lowest base cooperative rates
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* STEP 3: SUGGESTED WORKERS & TRUST FILTER */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                      Step 3
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Verified Masters ({suggestedWorkers.length})
                    </h3>
                  </div>

                  {/* Verification Badges Filter Checklist */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setTrustFilter("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition h-9 ${
                        trustFilter === "all" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      All Workers
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrustFilter("police")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 h-9 ${
                        trustFilter === "police" ? "bg-emerald-600 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>🛡️ Police Cleared</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrustFilter("nsqf")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 h-9 ${
                        trustFilter === "nsqf" ? "bg-indigo-600 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>🎓 Skill India Certified</span>
                    </button>
                  </div>
                </div>

                {suggestedWorkers.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-800">
                      No technicians match this filter criteria.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try selecting "All Workers" or turning off Emergency mode.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestedWorkers.map((worker) => {
                      const etaMins = worker.etaMinutes || Math.round(worker.distanceKm * 6 + 5);
                      const isDiag = serviceOption === "diagnostic";
                      const rateToCharge = isDiag
                        ? Math.round((worker.hourlyRate || 350) * 0.5)
                        : (worker.hourlyRate || 350);

                      return (
                        <div
                          key={worker.id}
                          className="bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between"
                        >
                          <div>
                            {/* Card Header: Avatar, Name, Rate */}
                            <div className="flex items-start gap-3">
                              <img
                                src={worker.avatar}
                                alt={worker.name}
                                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className="font-extrabold text-sm text-slate-900 truncate">
                                    {worker.name}
                                  </h4>
                                  <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg shrink-0 font-mono">
                                    ₹{rateToCharge} {isDiag ? "(50% Insp.)" : "(Full)"}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-500 font-medium">{worker.serviceName}</p>

                                <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap font-medium">
                                  <span className="flex items-center gap-1 font-bold text-amber-700">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                    {worker.rating} ({worker.reviewsCount || 42})
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    {worker.distanceKm} km
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Trust & Certification Badges */}
                            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                              {worker.isPoliceVerified && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                  🛡️ Police Cleared
                                </span>
                              )}

                              {worker.isNsqfCertified && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                                  🎓 Skill India (NSQF)
                                </span>
                              )}

                              {worker.isShareholder && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                  🏷️ Co-op Voting Owner
                                </span>
                              )}

                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                                ⚡ {etaMins}m away
                              </span>

                              <MiddlemanSavingsBubble
                                amount={rateToCharge}
                                workerName={worker.name}
                                size="xs"
                              />
                            </div>
                          </div>

                          {/* Action Buttons: Phone Call & Instant Transparent Booking */}
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setInspectWorker(worker)}
                              className="py-2.5 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer h-11"
                            >
                              Bio
                            </button>

                            <a
                              href={`tel:${worker.phone}`}
                              className="py-2.5 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1 h-11"
                              title="Direct phone call to technician"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Call</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleStartBooking(worker)}
                              className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer h-11"
                            >
                              <span>Book {isDiag ? "Inspection" : "Repair"} (₹{rateToCharge})</span>
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

      {/* VIEW 2: BOOKINGS & HISTORY */}
      {activeSubTab === "bookings" && (
        <div className="space-y-6">
          
          {/* Header Toggle: Active vs History */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBookingsViewMode("active")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 h-11 ${
                  bookingsViewMode === "active"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>Active Booking</span>
                {activeBooking && (
                  <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setBookingsViewMode("history")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 h-11 ${
                  bookingsViewMode === "history"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Job History ({bookings.length})</span>
              </button>
            </div>

            {bookingsViewMode === "history" && (
              <div className="flex items-center gap-1 flex-wrap">
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer h-9 ${
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

          {/* ACTIVE JOB VIEW */}
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
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer h-11"
                    >
                      Book a Master
                    </button>
                    <button
                      onClick={() => setBookingsViewMode("history")}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 h-11"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>View Previous History</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
                  
                  {/* Status Banner */}
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
                          {activeBooking.workerName} is {activeBooking.etaMinutes || 12} Mins Away
                        </h2>
                        <span className="text-xs text-emerald-100 font-semibold block mt-0.5">
                          Tier: {activeBooking.bookingType || (activeBooking.isDiagnostic ? "Diagnostic Inspection" : "Full Standard Repair")}
                        </span>
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

                  {/* On-Site Upgrade Banner for Inspection Bookings */}
                  {(activeBooking.isDiagnostic || activeBooking.bookingType === "Diagnostic Inspection") && (
                    <div className="p-4 bg-amber-50 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-amber-900 block">
                          Current Tier: Diagnostic Inspection (₹{activeBooking.serviceCharge})
                        </span>
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          Technician identified the issue? Upgrade to Full Repair with 1-click doorstep confirmation.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUpgradeBooking(activeBooking.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm h-11 shrink-0 flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Upgrade to Full Repair (₹{activeBooking.standardPrice || 400})</span>
                      </button>
                    </div>
                  )}

                  {/* Worker Profile on Active Booking Card */}
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
                            href={`tel:${activeBooking.workerPhone || "+91 98765 43210"}`}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 h-10"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call Master</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => setCancellingBooking(activeBooking)}
                            className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold transition h-10"
                          >
                            Cancel Job
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Booking Breakdown */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex justify-between font-bold text-slate-800 pb-1 border-b border-slate-200">
                        <span>Labour Charge (100% to Master):</span>
                        <span>₹{activeBooking.serviceCharge}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Co-op At-Cost Fee:</span>
                        <span>₹{activeBooking.platformFee || 20}</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                        <span>Total Payable:</span>
                        <span>₹{activeBooking.totalAmount || (activeBooking.serviceCharge + 20)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </>
          )}

          {/* JOB HISTORY VIEW */}
          {bookingsViewMode === "history" && (
            <div className="space-y-3">
              {filteredHistoryBookings.length === 0 ? (
                <div className="p-10 text-center bg-white rounded-3xl border border-slate-200">
                  <p className="text-sm font-bold text-slate-700">No jobs found for this filter.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHistoryBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={b.workerAvatar || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"}
                          alt={b.workerName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-900 text-sm">{b.workerName}</h4>
                            <span className="text-xs text-slate-400 font-mono">#{b.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              b.status === "Completed" ? "bg-emerald-100 text-emerald-800" : b.status === "Cancelled" ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              {b.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{b.serviceName} • {b.bookingType || "Full Repair"}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{b.date || "Past Service"}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-slate-400 block">Total</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">₹{b.totalAmount || b.serviceCharge}</span>
                        </div>

                        {/* Digital Receipt Trigger */}
                        <button
                          type="button"
                          onClick={() => openReceiptModal({
                            jobId: b.id,
                            customerName: b.customerName || currentUser?.name || "Vikram Malhotra",
                            workerName: b.workerName,
                            trade: b.serviceName,
                            bookingType: b.bookingType || "Full Standard Repair",
                            baseLabour: b.serviceCharge || 350,
                            partsMaterial: b.partsMaterial || 0,
                            coopMaintenanceFee: b.platformFee || 20,
                            completedAt: b.date || "Aug 2026",
                          })}
                          className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition flex items-center gap-1.5 h-10 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-700" />
                          <span>View Invoice</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Step 5: Post-Selection Transparent Payment Interface */}
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
        onConfirmCancel={(bId, reason, note) => {
          cancelBooking(bId, reason, note);
          setCancellingBooking(null);
        }}
      />

    </div>
  );
};
