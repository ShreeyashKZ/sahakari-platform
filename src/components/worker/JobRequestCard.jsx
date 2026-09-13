import React from "react";
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Play, 
  CheckCheck,
  AlertCircle
} from "lucide-react";
import { MiddlemanSavingsBubble } from "../common/MiddlemanSavingsBubble";

export const JobRequestCard = ({ booking, onAccept, onReject, onStartService, onCompleteService }) => {
  const isPending = booking.status === "Requested";
  const isAccepted = booking.status === "Accepted";
  const isOnWay = booking.status === "On the way";
  const isInService = booking.status === "Service Started";
  const isDone = booking.status === "Completed";
  const isCancelled = booking.status === "Cancelled";

  return (
    <div className={`rounded-2xl p-4 border transition ${
      isDone 
        ? "bg-slate-50/80 border-slate-200" 
        : isCancelled
        ? "bg-rose-50/40 border-rose-200"
        : "bg-white border-slate-200 shadow-sm"
    }`}>
      {/* Header Info */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <span className="text-xs font-mono font-bold text-slate-500">
          Order #{booking.id}
        </span>
        
        {/* Status Badge */}
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
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

      <div className="py-3 space-y-2">
        <p className="text-xs font-medium text-slate-700">
          <strong className="font-semibold text-slate-900">Task:</strong> {booking.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {booking.date}, {booking.timeSlot}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Indiranagar (1.8 km)
          </span>
        </div>

        <p className="text-xs text-slate-500 truncate">
          <strong>Customer:</strong> {booking.customerName} ({booking.customerPhone})
        </p>
      </div>

      {/* Financial payout highlight for worker */}
      <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 flex items-center justify-between text-xs my-2">
        <div>
          <span className="font-semibold text-emerald-800 block">Zero-Profit Take-Home:</span>
          <span className="text-[10px] text-slate-500">
            100% Labour Retained (₹25 flat democratic fee)
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
              ₹{booking.workerPayout || booking.totalAmount}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold block">
              {booking.etaMinutes || 12} mins away
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons based on status */}
      <div className="pt-2 flex flex-col gap-2">
        {isPending && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReject(booking.id)}
              className="flex-1 py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" /> Decline
            </button>
            <button
              onClick={() => onAccept(booking.id)}
              className="flex-2 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Accept Job Request
            </button>
          </div>
        )}

        {isAccepted && (
          <div className="space-y-2">
            <button
              onClick={() => onStartService(booking.id)}
              className="w-full py-2.5 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Arrived at Home & Start Service
            </button>
          </div>
        )}

        {isInService && (
          <button
            onClick={() => onCompleteService(booking.id)}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" /> Service Finished & Request Settlement
          </button>
        )}

        {isDone && (
          <div className="w-full py-2 text-center text-xs font-bold text-emerald-800 bg-emerald-100 rounded-xl">
            Job Completed & Payout Credited ✓
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
