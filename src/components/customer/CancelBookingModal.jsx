import React, { useState } from "react";
import {
  AlertTriangle,
  X,
  Check,
  ShieldCheck,
  RotateCcw,
  ArrowRight
} from "lucide-react";

export const CancelBookingModal = ({ isOpen, onClose, booking, onConfirmCancel }) => {
  const [selectedReason, setSelectedReason] = useState("Worker is delayed / taking too long");
  const [additionalNote, setAdditionalNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const reasons = [
    "Worker is delayed / taking too long",
    "Emergency or problem resolved by self",
    "Change of plans / Not available at home",
    "Found an alternative solution",
    "Price or scope misunderstanding",
    "Booked by mistake",
    "Other reason",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmCancel(booking.id, selectedReason, additionalNote);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-200 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>CANCEL WORK ORDER</span>
          </div>

          <h3 className="text-lg font-black tracking-tight">
            Cancel Booking #{booking.id}?
          </h3>
          <p className="text-xs text-rose-100 mt-0.5">
            Worker: <span className="font-bold text-white">{booking.workerName}</span> ({booking.serviceCategory || booking.serviceName})
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Why are you cancelling? (Shown to Worker)
            </label>

            <div className="space-y-1.5">
              {reasons.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "border-rose-500 bg-rose-50/70 text-rose-950 ring-1 ring-rose-500/30"
                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                    }`}
                  >
                    <span>{reason}</span>
                    {isSelected && <Check className="w-4 h-4 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional additional notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Additional Details / Comments (Optional):
            </label>
            <textarea
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              placeholder="e.g. Found tap washer in drawer and fixed it myself..."
              rows={2}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Cooperative Guarantee Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">100% Full Escrow Refund</p>
              <p className="text-[11px] text-slate-500">
                Zero cancellation penalty. Your selected reason will be sent to {booking.workerName} so they can take other neighborhood tasks.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Keep Booking
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Cancelling..." : "Confirm Cancel"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
