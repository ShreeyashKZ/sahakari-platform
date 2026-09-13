import React, { useState } from "react";
import {
  X,
  QrCode,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Smartphone,
  Check,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { MiddlemanSavingsBubble } from "../common/MiddlemanSavingsBubble";

export const WorkerPaymentCollectionModal = ({
  isOpen,
  onClose,
  booking,
  onPaymentComplete,
}) => {
  const [collectionMethod, setCollectionMethod] = useState("qr"); // 'qr' | 'cash'
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !booking) return null;

  const totalAmount = booking.totalAmount || (booking.serviceCharge + (booking.platformFee || 20)) || 370;
  const workerPayout = booking.workerPayout || booking.serviceCharge || 350;
  const platformFee = booking.platformFee || 20;

  const handleFinishPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete(booking.id, collectionMethod);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Cooperative Doorstep Settlement
            </span>
          </div>

          <h2 className="text-xl font-black text-white">
            Collect Payment & End Service
          </h2>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            Service successfully performed for {booking.customerName}. Collect total settlement below:
          </p>

          <div className="mt-3.5 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-200 block">Total Amount to Collect:</span>
              <span className="text-2xl font-black text-white font-mono">₹{totalAmount}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-200 block">Your Take-Home Payout:</span>
              <span className="text-base font-black text-emerald-300 font-mono">₹{workerPayout} (100%)</span>
            </div>
          </div>
        </div>

        {/* Payment Collection Method Selector */}
        <div className="p-5 sm:p-6 space-y-4 flex-1 overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setCollectionMethod("qr")}
              className={`p-3.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-2 ${
                collectionMethod === "qr"
                  ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs text-emerald-950 font-bold"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <QrCode className="w-6 h-6 text-emerald-700" />
              <span className="text-xs">Show Dynamic UPI QR</span>
            </button>

            <button
              type="button"
              onClick={() => setCollectionMethod("cash")}
              className={`p-3.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-2 ${
                collectionMethod === "cash"
                  ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs text-emerald-950 font-bold"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <Banknote className="w-6 h-6 text-emerald-700" />
              <span className="text-xs">Cash Paid Physically</span>
            </button>
          </div>

          {/* METHOD 1: QR CODE DISPLAY */}
          {collectionMethod === "qr" && (
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 text-center space-y-3 animate-in fade-in">
              <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border border-slate-200 shadow-md flex flex-col items-center justify-center relative">
                {/* SVG Simulated QR Code */}
                <svg viewBox="0 0 100 100" className="w-36 h-36">
                  <rect x="0" y="0" width="30" height="30" fill="#0f172a" rx="4" />
                  <rect x="5" y="5" width="20" height="20" fill="#ffffff" rx="2" />
                  <rect x="10" y="10" width="10" height="10" fill="#059669" />
                  
                  <rect x="70" y="0" width="30" height="30" fill="#0f172a" rx="4" />
                  <rect x="75" y="5" width="20" height="20" fill="#ffffff" rx="2" />
                  <rect x="80" y="10" width="10" height="10" fill="#059669" />
                  
                  <rect x="0" y="70" width="30" height="30" fill="#0f172a" rx="4" />
                  <rect x="5" y="75" width="20" height="20" fill="#ffffff" rx="2" />
                  <rect x="10" y="80" width="10" height="10" fill="#059669" />
                  
                  {/* Random QR pattern blocks */}
                  <rect x="40" y="10" width="8" height="8" fill="#0f172a" />
                  <rect x="52" y="15" width="8" height="8" fill="#0f172a" />
                  <rect x="35" y="35" width="30" height="30" fill="#059669" rx="4" />
                  <circle cx="50" cy="50" r="8" fill="#ffffff" />
                  <rect x="15" y="45" width="8" height="8" fill="#0f172a" />
                  <rect x="75" y="45" width="8" height="8" fill="#0f172a" />
                  <rect x="45" y="75" width="8" height="8" fill="#0f172a" />
                  <rect x="60" y="80" width="8" height="8" fill="#0f172a" />
                  <rect x="80" y="75" width="8" height="8" fill="#0f172a" />
                </svg>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                  ₹{totalAmount} UPI Secured
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  Ask customer to scan using GPay, PhonePe, Paytm, or BHIM
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                  UPI ID: sahakari.{booking.workerId || "worker"}@upi
                </p>
              </div>
            </div>
          )}

          {/* METHOD 2: CASH PHYSICAL HANDOVER */}
          {collectionMethod === "cash" && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 text-center space-y-3 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-2xl">
                💵
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-amber-950">
                  Cash Payment Confirmation
                </h3>
                <p className="text-xs text-amber-800 mt-1">
                  Confirm you have physically received exact cash payment of <strong>₹{totalAmount}</strong> from {booking.customerName}.
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-xs font-bold text-amber-900">
                ✓ Cash Handover Ready to be Closed
              </div>
            </div>
          )}

          {/* Breakdown Summary */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Labour Fee (100% Retained by You):</span>
              <span className="font-bold text-slate-900 font-mono">₹{workerPayout}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Cooperative Maintenance Fee:</span>
              <span className="font-mono text-slate-700">₹{platformFee}</span>
            </div>
            <div className="flex justify-between font-extrabold text-emerald-950 pt-1 border-t border-slate-200">
              <span>Total Settlement:</span>
              <span className="font-mono">₹{totalAmount}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinishPayment}
            disabled={isProcessing}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer h-12"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isProcessing
                ? "Recording Settlement..."
                : `Payment Completed & End of Service (₹${totalAmount})`}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
