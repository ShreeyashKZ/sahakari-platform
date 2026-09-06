import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  Wrench, 
  Check, 
  KeyRound,
  ShieldCheck,
  Phone,
  AlertCircle
} from "lucide-react";

export const BookingTracker = ({ booking, onMoveToNextStage }) => {
  if (!booking) return null;

  const stages = [
    { key: "Requested", label: "Requested", desc: "Sent to local collective" },
    { key: "Accepted", label: "Accepted", desc: "Worker confirmed job" },
    { key: "On the way", label: "On the Way", desc: "Worker traveling" },
    { key: "Service Started", label: "In Service", desc: "Work in progress" },
    { key: "Completed", label: "Completed", desc: "Ready for review" },
  ];

  const currentIdx = stages.findIndex((s) => s.key === booking.status);

  // Helper for demo control to manually advance stage
  const nextStageMap = {
    "Requested": "Accepted",
    "Accepted": "On the way",
    "On the way": "Service Started",
    "Service Started": "Completed",
  };

  const nextStage = nextStageMap[booking.status];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
              {booking.id}
            </span>
            <span className="font-bold text-slate-900 text-base">{booking.serviceName}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Booked for: <span className="font-semibold text-slate-700">{booking.date}, {booking.timeSlot}</span>
          </p>
        </div>

        {/* Security Service OTP Badge */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-lg text-white">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              Service Verification OTP
            </p>
            <p className="text-lg font-black tracking-widest text-emerald-950 font-mono">
              {booking.serviceOtp}
            </p>
            <p className="text-[9px] text-emerald-600 font-medium">
              Share only when worker arrives
            </p>
          </div>
        </div>
      </div>

      {/* 5-Stage Interactive Progress Bar */}
      <div className="my-8">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 w-full z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 z-0"
            style={{
              width: `${Math.max(0, (currentIdx / (stages.length - 1)) * 100)}%`,
            }}
          />

          {stages.map((stage, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={stage.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isDone
                      ? "bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50"
                      : isCurrent
                      ? "bg-white border-2 border-emerald-600 text-emerald-600 shadow-md ring-4 ring-emerald-100 scale-110"
                      : "bg-white border-2 border-slate-200 text-slate-400"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>
                <div className="text-center mt-2">
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? "text-emerald-700"
                        : isDone
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="hidden sm:block text-[10px] text-slate-400 mt-0.5">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Worker Details Card inside Tracker */}
      <div className="bg-slate-50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src={booking.workerAvatar}
            alt={booking.workerName}
            className="w-12 h-12 rounded-xl object-cover border border-slate-300 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-slate-900 text-sm">{booking.workerName}</h4>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Co-op Verified
              </span>
            </div>
            <p className="text-xs text-slate-500">{booking.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={`tel:${booking.workerPhone}`}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <Phone className="w-3.5 h-3.5 text-slate-500" /> Call Worker
          </a>

          {/* Quick Demo Stage Advancer for Hackathon Judges */}
          {nextStage && onMoveToNextStage && (
            <button
              onClick={() => onMoveToNextStage(booking.id, nextStage)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 shadow-xs transition"
              title="Convenient fast-forward for demo presentation"
            >
              Demo: Move to "{nextStage}" →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
