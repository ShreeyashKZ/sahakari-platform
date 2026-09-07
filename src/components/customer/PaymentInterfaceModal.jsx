import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  CreditCard,
  Banknote,
  Sparkles,
  ArrowRight,
  X,
  Info,
  Smartphone,
  Check,
  HeartHandshake,
  AlertCircle
} from "lucide-react";

export const PaymentInterfaceModal = ({
  isOpen,
  onClose,
  bookingDetails,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("upi"); // 'upi' | 'card' | 'doorstep' | 'escrow'
  const [upiApp, setUpiApp] = useState("gpay"); // 'gpay' | 'phonepe' | 'paytm' | 'bhim'
  const [upiId, setUpiId] = useState("user@okaxis");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8921");
  const [cardExpiry, setCardExpiry] = useState("09/28");
  const [cardCvv, setCardCvv] = useState("•••");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  if (!isOpen || !bookingDetails) return null;

  const {
    workerName = "Verified Worker",
    workerAvatar,
    serviceName = "Service",
    agreedRate = 350,
    baseRate = 400,
    etaMinutes = 15,
  } = bookingDetails;

  const totalAmount = Number(agreedRate) || 350;
  const originalRate = Number(baseRate) || totalAmount;
  const savings = Math.max(0, originalRate - totalAmount);

  // Cooperative Distribution Formula
  const platformFee = 25; // Cooperative Welfare & Tool Cover pool
  const workerPayout = Math.max(100, totalAmount - platformFee);
  const corporateAppCommissionSaved = Math.round(originalRate * 0.25); // typical 25% take-rate

  const handleAuthorizePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessAnim(true);
      setTimeout(() => {
        const finalBookingData = {
          ...bookingDetails,
          totalAmount,
          workerPayout,
          platformFee,
          paymentMethod,
          paymentStatus:
            paymentMethod === "doorstep"
              ? "Pending at Doorstep"
              : paymentMethod === "escrow"
              ? "Escrow Secured"
              : "Paid via " + paymentMethod.toUpperCase(),
        };
        onPaymentSuccess(finalBookingData);
        setShowSuccessAnim(false);
      }, 900);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>SAHAKARI ZERO-COMMISSION ESCROW</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            Authorize & Confirm Booking
          </h2>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            Post-bargain transparent payment. 100% of fair fees go to the worker and community fund.
          </p>

          {/* Agreed Rate Highlight Box */}
          <div className="mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {workerAvatar && (
                <img
                  src={workerAvatar}
                  alt={workerName}
                  className="w-10 h-10 rounded-xl object-cover border border-white/30"
                />
              )}
              <div>
                <p className="text-xs text-emerald-200 font-medium">Bargained Deal with {workerName}</p>
                <p className="text-sm font-extrabold text-white">{serviceName}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                {savings > 0 && (
                  <span className="text-xs text-slate-300 line-through">₹{originalRate}</span>
                )}
                <span className="text-xl font-black text-white">₹{totalAmount}</span>
              </div>
              {savings > 0 ? (
                <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/30 px-2 py-0.5 rounded-full">
                  You saved ₹{savings}
                </span>
              ) : (
                <span className="text-[10px] text-emerald-300 font-bold">Standard Co-op Rate</span>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 flex-1 overflow-y-auto max-h-[60vh]">

          {/* Transparent Cooperative Breakdown */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-700" />
                <span>Fair Cooperative Breakdown</span>
              </span>
              <span className="text-emerald-700 font-extrabold">0% Corporate Cut</span>
            </div>

            <div className="space-y-1.5 text-xs pt-1 border-t border-emerald-200/50">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1">
                  <span>Direct Worker Payout</span>
                  <span className="text-[10px] text-slate-500">(92%)</span>
                </span>
                <span className="font-extrabold text-slate-900">₹{workerPayout}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1">
                  <span>Welfare & Tool Insurance Pool</span>
                  <span className="text-[10px] text-slate-500">(8%)</span>
                </span>
                <span className="font-bold text-slate-800">₹{platformFee}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-800 font-medium text-[11px] pt-1">
                <span>Middleman Commission Saved:</span>
                <span className="font-bold text-emerald-700">~₹{corporateAppCommissionSaved} saved</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Payment Method
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              
              {/* UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                  paymentMethod === "upi"
                    ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  {paymentMethod === "upi" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">UPI Instant / QR</p>
                  <p className="text-[10px] text-slate-500 font-medium">GPay, PhonePe, BHIM</p>
                </div>
              </button>

              {/* Escrow Guarantee */}
              <button
                type="button"
                onClick={() => setPaymentMethod("escrow")}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                  paymentMethod === "escrow"
                    ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  {paymentMethod === "escrow" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Safe Escrow</p>
                  <p className="text-[10px] text-slate-500 font-medium">Held until OTP verified</p>
                </div>
              </button>

              {/* Cards */}
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                  paymentMethod === "card"
                    ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  {paymentMethod === "card" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Debit / Credit Card</p>
                  <p className="text-[10px] text-slate-500 font-medium">RuPay, Visa, MC</p>
                </div>
              </button>

              {/* Cash at Doorstep */}
              <button
                type="button"
                onClick={() => setPaymentMethod("doorstep")}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                  paymentMethod === "doorstep"
                    ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                  {paymentMethod === "doorstep" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Pay at Doorstep</p>
                  <p className="text-[10px] text-slate-500 font-medium">Cash / UPI after job</p>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Detail Form according to Payment Method */}
          {paymentMethod === "upi" && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Scan QR or Pay via App</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Instant Verification
                </span>
              </div>

              {/* QR Mock code */}
              <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                <div className="w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center text-white shrink-0 p-1.5">
                  <div className="w-full h-full border-2 border-dashed border-emerald-400 rounded flex flex-col items-center justify-center text-center">
                    <QrCode className="w-8 h-8 text-emerald-400" />
                    <span className="text-[8px] font-mono mt-0.5 font-bold">UPI QR</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900">Scan using any UPI App</p>
                  <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                    sahakari.escrow@icici
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                      <span
                        key={app}
                        className="text-[9px] font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* UPI ID input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Or enter your UPI VPA handle:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="yourname@okhdfcbank"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Card Details</span>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Valid Thru</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">CVV</label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "escrow" && (
            <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-teal-900">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Protected by Sahakari Escrow Guarantee</span>
              </div>
              <p className="text-teal-800 text-[11px] leading-relaxed">
                Your payment of ₹{totalAmount} will be pre-authorized but strictly held in cooperative escrow.
                It will only be released to {workerName} after you inspect the finished work and provide the 4-digit Service OTP at your doorstep.
              </p>
            </div>
          )}

          {paymentMethod === "doorstep" && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Banknote className="w-4 h-4 text-amber-700" />
                <span>Pay After Service Completion</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                No upfront digital payment needed right now. {workerName} will arrive with tools within {etaMinutes} minutes. Pay in cash or direct UPI QR at your doorstep once fully satisfied.
              </p>
            </div>
          )}

          {/* Safety & Guarantee badges */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 30-Day Guarantee
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> 256-Bit Encryption
            </span>
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Verified Worker
            </span>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            Back to Chat
          </button>

          <button
            type="button"
            onClick={handleAuthorizePayment}
            disabled={isProcessing}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Securing Payment Escrow...</span>
              </>
            ) : showSuccessAnim ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Payment Authorized!</span>
              </>
            ) : (
              <>
                <span>
                  {paymentMethod === "doorstep"
                    ? "Confirm Booking (Pay ₹" + totalAmount + " at Door)"
                    : "Authorize & Confirm (₹" + totalAmount + ")"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
