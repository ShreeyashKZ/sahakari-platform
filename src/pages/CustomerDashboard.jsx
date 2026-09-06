import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  Star, 
  SlidersHorizontal, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Wrench,
  Zap,
  Hammer,
  Sparkle,
  Cpu,
  Trees,
  Paintbrush,
  Package
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { WorkerCard } from "../components/customer/WorkerCard";
import { BookingModal } from "../components/customer/BookingModal";
import { BookingTracker } from "../components/customer/BookingTracker";
import { MockPaymentModal } from "../components/customer/MockPaymentModal";
import { ReviewModal } from "../components/customer/ReviewModal";
import { WorkerVerificationModal } from "../components/worker/WorkerVerificationModal";

export const CustomerDashboard = ({ activeSubTab, setActiveSubTab }) => {
  const { 
    services, 
    workers, 
    bookings, 
    createBooking, 
    updateBookingStatus, 
    completePayment, 
    submitReview 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("plumber");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [emergencyActive, setEmergencyActive] = useState(false);

  // Modals state
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState(null);
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState(null);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  // Icon mapping
  const iconMap = {
    Wrench: Wrench,
    Zap: Zap,
    Hammer: Hammer,
    Sparkles: Sparkle,
    Cpu: Cpu,
    Trees: Trees,
    Paintbrush: Paintbrush,
    Package: Package,
  };

  // Filter and smart rank workers
  const filteredWorkers = workers
    .filter((w) => {
      // Emergency mode prioritizes immediate availability
      if (emergencyActive && !w.isAvailable) return false;

      // Category filter
      if (selectedService && w.serviceId !== selectedService) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = w.name.toLowerCase().includes(q);
        const matchService = w.serviceName.toLowerCase().includes(q);
        const matchSkill = w.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchService && !matchSkill) return false;
      }

      // Distance filter
      if (distanceFilter === "2km" && w.distanceKm > 2.0) return false;
      if (distanceFilter === "5km" && w.distanceKm > 5.0) return false;

      // Rating filter
      if (w.rating < minRatingFilter) return false;

      return true;
    })
    .sort((a, b) => {
      // Smart ranking formula: availability + distance + rating + jobs
      const scoreA = (a.isAvailable ? 20 : 0) + a.rating * 10 - a.distanceKm * 2 + (a.completedJobs / 20);
      const scoreB = (b.isAvailable ? 20 : 0) + b.rating * 10 - b.distanceKm * 2 + (b.completedJobs / 20);
      return scoreB - scoreA;
    });

  // Target active booking for visual tracker
  const activeBooking = bookings.find(
    (b) => b.status !== "Completed" || b.paymentStatus === "Pending"
  ) || bookings[0];

  const handleBookingConfirmed = (newBookingData) => {
    const created = createBooking(newBookingData);
    setSelectedWorkerForBooking(null);
    setActiveSubTab("bookings");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Customer Hero / Emergency Alert Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Direct Community Cooperative Platform
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Fair Rates for You. Full Dignity for Workers.
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
            Zero 25-30% middleman markups. Every ₹450 you pay goes straight to your verified local electrician, plumber, or artisan.
          </p>

          {/* Quick Search Input */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 'tap leakage', 'MCB fix', 'plumber', 'cleaner'..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium shadow-md focus:outline-emerald-500 border-0"
              />
            </div>

            {/* Emergency SOS Toggle */}
            <button
              onClick={() => setEmergencyActive(!emergencyActive)}
              className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs shrink-0 transition flex items-center justify-center gap-2 shadow-lg ${
                emergencyActive
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{emergencyActive ? "Emergency Mode Active" : "Emergency SOS (Urgent)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Sub-Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("find")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === "find"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Find Local Service Providers ({filteredWorkers.length})
          </button>
          <button
            onClick={() => setActiveSubTab("bookings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === "bookings"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span>Live Bookings & Timeline</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">
          Location: <strong>Indiranagar, Bengaluru (Demo Society)</strong>
        </span>
      </div>

      {/* VIEW 1: FIND SERVICES & WORKERS */}
      {activeSubTab === "find" && (
        <div className="space-y-6">
          {/* Service Categories Carousel/Grid */}
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-3 flex items-center justify-between">
              <span>Explore Cooperative Services</span>
              <span className="text-xs text-slate-400 font-normal">Standard transparent rates</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {services.map((srv) => {
                const IconComponent = iconMap[srv.icon] || Wrench;
                const isSelected = selectedService === srv.id;

                return (
                  <button
                    key={srv.id}
                    onClick={() => setSelectedService(srv.id)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-between ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {srv.name}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 font-mono">
                      From ₹{srv.basePrice}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-slate-700">Filters:</span>

              {/* Distance filter */}
              <select
                value={distanceFilter}
                onChange={(e) => setDistanceFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700"
              >
                <option value="all">Any Distance</option>
                <option value="2km">Within 2 km</option>
                <option value="5km">Within 5 km</option>
              </select>

              {/* Rating filter */}
              <select
                value={minRatingFilter}
                onChange={(e) => setMinRatingFilter(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700"
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>4.5★ and above</option>
                <option value={4.8}>4.8★ Top Rated</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>All 42 workers are verified by Bengaluru East Guild</span>
            </div>
          </div>

          {/* Workers Recommendation Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Recommended Verified Workers
                </h3>
                <p className="text-xs text-slate-500">
                  Intelligently ranked by skill, live proximity, and peer ratings.
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Cooperative Fair Price Guarantee
              </span>
            </div>

            {filteredWorkers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-sm font-bold text-slate-700">No workers match this filter criteria</p>
                <p className="text-xs text-slate-400 mt-1">Try resetting distance or rating filters</p>
                <button
                  onClick={() => {
                    setSelectedService("plumber");
                    setDistanceFilter("all");
                    setMinRatingFilter(0);
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkers.map((worker, idx) => (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                    isSmartRecommended={idx === 0} // Top ranked worker gets the smart match banner
                    onBookNow={(w) => setSelectedWorkerForBooking(w)}
                    onSelectProfile={(w) => setSelectedWorkerForProfile(w)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: BOOKINGS, LIVE TRACKER & SETTLEMENT */}
      {activeSubTab === "bookings" && (
        <div className="space-y-6">
          {activeBooking ? (
            <>
              {/* Visual 5-Stage Timeline Tracker */}
              <BookingTracker
                booking={activeBooking}
                onMoveToNextStage={(bId, nextStage) => updateBookingStatus(bId, nextStage)}
              />

              {/* Action trigger for Payment / Rating depending on status */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {activeBooking.status === "Completed" && activeBooking.paymentStatus === "Pending"
                      ? "Service Completed! Settle Payment"
                      : activeBooking.status === "Completed" && activeBooking.paymentStatus === "Paid" && !activeBooking.rating
                      ? "Payment Settled! Leave a 5★ Review"
                      : "Booking is in Progress"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeBooking.status === "Completed"
                      ? "Worker has reported task completion. Review charges and finalize."
                      : "Worker will arrive during your scheduled time slot."}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {activeBooking.status === "Completed" && activeBooking.paymentStatus === "Pending" && (
                    <button
                      onClick={() => setPaymentBooking(activeBooking)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition"
                    >
                      Pay ₹{activeBooking.totalAmount} (Demo Payment) →
                    </button>
                  )}

                  {activeBooking.status === "Completed" && activeBooking.paymentStatus === "Paid" && !activeBooking.rating && (
                    <button
                      onClick={() => setReviewBooking(activeBooking)}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl shadow-md transition"
                    >
                      Rate {activeBooking.workerName} (5★ Review) →
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-sm font-bold text-slate-800">No active bookings right now</p>
              <p className="text-xs text-slate-400 mt-1">Book a verified worker to see live tracking</p>
              <button
                onClick={() => setActiveSubTab("find")}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Services
              </button>
            </div>
          )}

          {/* Historical / Past Bookings Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base mb-4">
              All Household Bookings
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                    <th className="pb-3">Booking ID</th>
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Worker</th>
                    <th className="pb-3">Total Fare</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80">
                      <td className="py-3 font-mono font-bold text-slate-900">{b.id}</td>
                      <td className="py-3 font-semibold text-slate-800">{b.serviceName}</td>
                      <td className="py-3 text-slate-600">{b.workerName}</td>
                      <td className="py-3 font-mono font-bold text-emerald-700">₹{b.totalAmount}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {b.status === "Completed" && b.paymentStatus === "Pending" ? (
                          <button
                            onClick={() => setPaymentBooking(b)}
                            className="text-emerald-700 font-bold hover:underline"
                          >
                            Pay Now
                          </button>
                        ) : b.status === "Completed" && !b.rating ? (
                          <button
                            onClick={() => setReviewBooking(b)}
                            className="text-amber-600 font-bold hover:underline"
                          >
                            Rate Worker
                          </button>
                        ) : (
                          <span className="text-slate-400">View Details</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      <BookingModal
        isOpen={Boolean(selectedWorkerForBooking)}
        onClose={() => setSelectedWorkerForBooking(null)}
        worker={selectedWorkerForBooking}
        onConfirmBooking={handleBookingConfirmed}
      />

      {/* Worker Verification Details Modal */}
      <WorkerVerificationModal
        isOpen={Boolean(selectedWorkerForProfile)}
        onClose={() => setSelectedWorkerForProfile(null)}
        worker={selectedWorkerForProfile}
      />

      {/* Transparent Payment Modal */}
      <MockPaymentModal
        isOpen={Boolean(paymentBooking)}
        onClose={() => setPaymentBooking(null)}
        booking={paymentBooking}
        onPaymentSuccess={(bId) => {
          completePayment(bId);
          setPaymentBooking(null);
        }}
      />

      {/* Rating & Review Modal */}
      <ReviewModal
        isOpen={Boolean(reviewBooking)}
        onClose={() => setReviewBooking(null)}
        booking={reviewBooking}
        onSubmitReview={(bId, rating, comment, tags) => {
          submitReview(bId, rating, comment, tags);
          setReviewBooking(null);
        }}
      />
    </div>
  );
};
