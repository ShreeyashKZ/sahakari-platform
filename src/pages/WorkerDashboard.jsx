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
  Sliders
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
    communityRequests 
  } = useApp();

  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Filter jobs for this worker
  const workerBookings = bookings.filter((b) => b.workerId === currentWorker.id);
  const pendingRequests = workerBookings.filter((b) => b.status === "Requested");
  const activeJobs = workerBookings.filter(
    (b) => b.status !== "Requested" && b.status !== "Completed"
  );
  const completedJobs = workerBookings.filter((b) => b.status === "Completed");

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Worker Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={currentWorker.avatar}
              alt={currentWorker.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{currentWorker.name}</h1>
                <button
                  onClick={() => setShowVerificationModal(true)}
                  className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 hover:bg-emerald-500/30 transition"
                  title="View Verification Checklist"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </button>
              </div>

              <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
                {currentWorker.serviceName} • {currentWorker.experienceYears} Years Experience
              </p>

              <div className="flex items-center gap-4 mt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {currentWorker.rating} ({currentWorker.reviewsCount} reviews)
                </span>
                <span>•</span>
                <span>{currentWorker.completedJobs} jobs fulfilled</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{currentWorker.availability}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVerificationModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Co-op Badge</span>
            </button>
            <button
              onClick={() => setActiveSubTab("earnings")}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold shadow-md transition flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4" />
              <span>Earnings Hub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab("jobs")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
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
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === "earnings"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Earnings & Ledger
        </button>

        <button
          onClick={() => setActiveSubTab("community-bids")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === "community-bids"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Society Maintenance Tasks ({communityRequests.length})
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

          {/* Past Completed Jobs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base mb-4">
              Recently Completed Jobs & Direct Payouts
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                    <th className="pb-3">Task ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Address</th>
                    <th className="pb-3">Payout Credited</th>
                    <th className="pb-3">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedJobs.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-slate-900">{b.id}</td>
                      <td className="py-3 font-semibold text-slate-800">{b.customerName}</td>
                      <td className="py-3 text-slate-600">{b.address}</td>
                      <td className="py-3 font-mono font-bold text-emerald-700">₹{b.workerPayout}</td>
                      <td className="py-3">
                        {b.rating ? (
                          <span className="text-amber-500 font-bold">★ {b.rating}.0</span>
                        ) : (
                          <span className="text-slate-400">Pending review</span>
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

      {/* VIEW 2: EARNINGS & CO-OP SOLIDARITY */}
      {activeSubTab === "earnings" && (
        <WorkerEarningsSection worker={currentWorker} />
      )}

      {/* VIEW 3: COMMUNITY SOCIETY MAINTENANCE BIDS */}
      {activeSubTab === "community-bids" && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-base">
              Resident Welfare Association Bulk Contracts
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Cooperative exclusive: Neighborhood societies hire local member artisans for bulk apartment maintenance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityRequests.map((cr) => (
              <div key={cr.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {cr.id}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {cr.budget}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{cr.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{cr.description}</p>

                <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span>Society: <strong>{cr.societyName}</strong></span>
                  <span>Date: <strong>{cr.dateScheduled}</strong></span>
                </div>

                <button
                  onClick={() => alert(`Bid registered for ${cr.title} under Bengaluru East Collective!`)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                >
                  Apply as Co-op Member Worker →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Details Modal */}
      <WorkerVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        worker={currentWorker}
      />
    </div>
  );
};
