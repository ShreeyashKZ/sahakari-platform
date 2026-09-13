import React from "react";
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Play, 
  CheckCheck,
  AlertCircle,
  Sparkles,
  Printer
} from "lucide-react";
import { MiddlemanSavingsBubble } from "../common/MiddlemanSavingsBubble";
import { useApp } from "../../context/AppContext";

export const JobRequestCard = ({ 
  booking, 
  onAccept, 
  onReject, 
  onStartService, 
  onCompleteService 
}) => {
  const { upgradeBookingToFullRepair, openReceiptModal } = useApp();

  const isPending = booking.status === "Requested";
  const isAccepted = booking.status === "Accepted";
  const isOnWay = booking.status === "On the way";
  const isInService = booking.status === "Service Started";
  const isDone = booking.status === "Completed";
  const isCancelled = booking.status === "Cancelled";
  const isDiagnostic = booking.isDiagnostic || booking.bookingType === "Diagnostic / Problem Inspection" || booking.bookingType === "Diagnostic Inspection";

  return (
    <div className={`rounded-3xl p-5 border transition ${
      isDone 
        ? "bg-slate-50/80 border-slate-200" 
        : isCancelled
        ? "bg-rose-50/40 border-rose-200"
        : "bg-white border-slate-200 shadow-sm hover:shadow-md"
    }`}>
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500">
            Order #{booking.id}
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
            isDiagnostic ? "bg-teal-50 text-teal-800 border border-teal-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}>
            {isDiagnostic ? "50% Diagnostic Inspection" : "Full Standard Repair"}
          </span>
        </div>
        
        {/* Status Badge */}
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
          isPending ? "bg-amber-100 text-amber-800" :
          isAccepted ? "bg-blue-100 text-blue-800" :
          isOnWay ? "bg-teal-100 text-teal-800 animate-pulse" :
          isInService ? "bg-purple-100 text-purple-800" :
          isCancelled ? "bg-rose-100 text-rose-800 font-black border border-rose-300" :
          "bg-emerald-100 text-emerald-800"
        }`}>
          {isCancelled && <XCircle className="w-3 h-3 text-rose-600" />}
          {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
          {isCancelled ? "✕ Cancelled by Customer" : booking.status}
        </span>
      </div>

      <div className="py-3 space-y-2 text-xs">
        <p className="font-medium text-slate-700">
          <strong className="font-semibold text-slate-900">Task:</strong> {booking.description}
        </p>

        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {booking.date}, {booking.timeSlot}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Indiranagar (1.8 km)
          </span>
        </div>

        <p className="text-slate-500 truncate">
          <strong>Customer:</strong> {booking.customerName} ({booking.customerPhone})
        </p>
      </div>

      {/* Financial payout highlight for worker */}
      <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 flex items-center justify-between text-xs my-2">
        <div>
          <span className="font-semibold text-emerald-900 block">Zero-Profit Take-Home:</span>
          <span className="text-[10px] text-slate-500">
            100% Labour Retained (₹20 flat transparent fee)
          </span>
        </div>
        <div className="text-right flex items-center gap-2">
          <MiddlemanSavingsBubble
            amount={booking.totalAmount || booking.workerPayout || 350}
            workerName="you"
            size="xs"
          />
          <div>
            <span className="font-mono font-black text-emerald-900 text-base block">
              ₹{booking.workerPayout || booking.totalAmount || 350}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold block">
              Direct Bank Payout
            </span>
          </div>
        </div>
      </div>

      {/* On-Site Upgrade Action for Technician */}
      {isDiagnostic && !isDone && !isCancelled && (
        <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2">
          <span className="text-amber-900 font-medium">
            Diagnosed on-site? Customer can approve upgrade to full repair.
          </span>
          <button
            type="button"
            onClick={() => upgradeBookingToFullRepair(booking.id)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shrink-0 h-9"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade to Full (₹{booking.standardPrice || 400})</span>
          </button>
        </div>
      )}

      {/* Action Buttons based on status */}
      <div className="pt-2 flex flex-col gap-2">
        {isPending && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReject(booking.id)}
              className="flex-1 py-2.5 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition flex items-center justify-center gap-1 cursor-pointer h-11"
            >
              <XCircle className="w-3.5 h-3.5" /> Decline
            </button>
            <button
              onClick={() => onAccept(booking.id)}
              className="flex-2 py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer h-11"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Accept Job Request
            </button>
          </div>
        )}

        {isAccepted && (
          <button
            onClick={() => onStartService(booking.id)}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer h-11"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Arrived at Home & Start Service
          </button>
        )}

        {isInService && (
          <button
            onClick={() => {
              onCompleteService(booking.id);
              openReceiptModal({
                jobId: booking.id,
                customerName: booking.customerName || "Resident",
                workerName: booking.workerName || "Technician",
                trade: booking.serviceName || "Service",
                bookingType: booking.bookingType || "Full Standard Repair",
                baseLabour: booking.serviceCharge || 350,
                partsMaterial: 0,
                coopMaintenanceFee: 20,
              });
            }}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer h-11"
          >
            <CheckCheck className="w-4 h-4" /> Service Finished & Generate Receipt
          </button>
        )}

        {isDone && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 py-2 text-center text-xs font-bold text-emerald-800 bg-emerald-100/70 rounded-xl border border-emerald-200">
              Job Completed & Payout Credited ✓
            </div>
            <button
              type="button"
              onClick={() => openReceiptModal({
                jobId: booking.id,
                customerName: booking.customerName || "Resident",
                workerName: booking.workerName || "Technician",
                trade: booking.serviceName || "Service",
                bookingType: booking.bookingType || "Full Standard Repair",
                baseLabour: booking.serviceCharge || 350,
                partsMaterial: 0,
                coopMaintenanceFee: 20,
              })}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition flex items-center gap-1.5 h-10"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Receipt</span>
            </button>
          </div>
        )}

        {isCancelled && (
          <div className="space-y-2">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Customer Reason for Cancelling:</span>
              </div>
              <p className="text-xs text-rose-900 font-bold pl-5">
                "{booking.cancellationReason || "Customer cancelled this work order"}"
              </p>
              {booking.cancelledAt && (
                <p className="text-[10px] text-slate-500 pl-5">
                  Cancelled at {new Date(booking.cancelledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>
            <div className="w-full py-2 text-center text-xs font-bold text-rose-800 bg-rose-100/60 rounded-xl border border-rose-200">
              Work Order Relieved • Schedule Open for New Requests
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
