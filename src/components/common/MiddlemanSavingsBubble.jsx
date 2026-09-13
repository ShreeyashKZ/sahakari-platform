import React, { useState, useRef, useEffect } from "react";
import { Info, HelpCircle, X, ShieldCheck, HeartHandshake, CheckCircle2, TrendingUp } from "lucide-react";

/**
 * MiddlemanSavingsBubble
 * Displays the amount of money that would have been extracted by a corporate aggregator
 * (typical 25-30% VC cut) that is now retained 100% by the local worker under Sahakari's
 * Zero-Profit Operating Model.
 */
export const MiddlemanSavingsBubble = ({
  amount = 350,
  workerName = "the worker",
  size = "sm",
  className = "",
  badgeText = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Corporate aggregators typically extract 25-30% (benchmark 28%)
  const corporateTakeRate = 0.28;
  const savedAmount = Math.max(50, Math.round((Number(amount) || 350) * corporateTakeRate));
  const labourRetained = Number(amount) || 350;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const sizeClasses = {
    xs: "text-[10px] px-2 py-0.5 gap-1",
    sm: "text-[11px] px-2.5 py-1 gap-1.5",
    md: "text-xs px-3 py-1.5 gap-2",
  };

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title="Click to see how much middleman commission is saved for the worker"
        className={`inline-flex items-center font-bold rounded-xl transition cursor-pointer shadow-2xs border ${
          sizeClasses[size] || sizeClasses.sm
        } ${
          isOpen
            ? "bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-400/40"
            : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100/90 border-emerald-300"
        }`}
      >
        <span className="text-emerald-600 font-black">💰</span>
        <span>
          {badgeText || `₹${savedAmount} Middleman Fees Saved`}
        </span>
        <span
          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition ${
            isOpen ? "bg-white text-emerald-800" : "bg-emerald-200/80 text-emerald-900"
          }`}
        >
          <Info className="w-2.5 h-2.5" />
        </span>
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-emerald-200/90 p-4 text-left animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                🤝
              </div>
              <div>
                <h5 className="text-xs font-black text-slate-900">
                  Middleman Fees Saved: ₹{savedAmount}
                </h5>
                <p className="text-[10px] text-emerald-700 font-extrabold">
                  Direct Extra Income for {workerName}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Comparison Breakdown */}
          <div className="py-2.5 space-y-2 text-[11px]">
            <div className="bg-rose-50 border border-rose-200/70 rounded-xl p-2.5 space-y-1">
              <div className="flex items-center justify-between font-bold text-rose-900">
                <span>Corporate Apps (Urban Co, etc.)</span>
                <span className="text-rose-700 font-mono">25% – 30% Cut</span>
              </div>
              <p className="text-rose-700 text-[10px] leading-tight">
                Corporations cut ~<strong>₹{savedAmount}</strong> from this job as venture capital profit margin & corporate overhead.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/90 rounded-xl p-2.5 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sahakari Zero-Profit Model</span>
                </span>
                <span className="text-emerald-700 font-mono font-extrabold">100% Retained</span>
              </div>
              
              <ul className="text-emerald-900 text-[10px] space-y-1 leading-snug">
                <li className="flex items-start gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>₹{labourRetained} (100% of Labour):</strong> Retained directly by the worker.</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Flat ₹25 At-Cost Fee:</strong> ₹15 to Worker Emergency Medical & Tool Pool + ₹10 for cloud servers, SMS/OTP gateways & UPI switch.</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>₹0 Corporate Extraction:</strong> Zero VC dividends or shareholder margins.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-medium">Audited by Society Members</span>
            <span className="text-emerald-700 font-black flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Democratic Gig Co-op
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
