import React, { useState } from "react";
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  Receipt
} from "lucide-react";

export const MockPaymentModal = ({ isOpen, onClose, booking, onPaymentSuccess }) => {
  if (!isOpen || !booking) return null;

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(booking.id);
        setIsSuccess(false);
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in duration-200">
        {!isSuccess ? (
          <>
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Transparent Co-op Settlement
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Booking ID: <span className="font-mono font-bold text-slate-700">{booking.id}</span>
              </p>
            </div>

            {/* Price Breakdown - Fair & Zero Middleman */}
            <div className="my-5 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Service Charge ({booking.serviceName}):</span>
                <span className="font-bold text-slate-900">₹{booking.serviceCharge}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cooperative Platform Pool (5%):</span>
                <span className="font-bold text-slate-900">₹{booking.platformFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-emerald-700 font-mono">₹{booking.totalAmount}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/80">
                <div className="flex justify-between items-center bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-emerald-800 font-bold text-xs flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Direct Worker Payout:
                  </span>
                  <span className="text-emerald-900 font-extrabold font-mono text-sm">
                    ₹{booking.workerPayout}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                  * Unlike traditional apps that deduct 25-30%, Sahakari workers take home 100% of the service fare!
                </p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-bold text-slate-700">
                Select Demo Payment Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center gap-2 ${
                    paymentMethod === "upi"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <span className="text-base">📱</span>
                  <span>UPI / QR (Demo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center gap-2 ${
                    paymentMethod === "cash"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <span className="text-base">💵</span>
                  <span>Cash on Service</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="w-1/3 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Back
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={handlePay}
                className="w-2/3 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                {processing ? (
                  <span>Processing Settlement...</span>
                ) : (
                  <>
                    <span>Pay ₹{booking.totalAmount} (Demo)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">
              Payment Confirmed!
            </h4>
            <p className="text-xs text-slate-500">
              ₹{booking.workerPayout} transferred directly to {booking.workerName}'s cooperative account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
