import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  KeyRound,
  MapPin,
  Clock
} from "lucide-react";

export const WorkerOtpVerificationModal = ({
  isOpen,
  onClose,
  booking,
  onOtpVerified,
}) => {
  const [enteredOtp, setEnteredOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmitOtp = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanInput = enteredOtp.trim();
    if (cleanInput.length < 4) {
      setErrorMsg("Please enter the complete 4-digit OTP provided by the customer.");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Validate OTP
      const expectedOtp = String(booking.serviceOtp || "4821");
      if (cleanInput === expectedOtp) {
        onOtpVerified(booking.id);
        onClose();
      } else {
        setErrorMsg(`Incorrect OTP. Please ask ${booking.customerName} for the 4-digit Service OTP displayed on their screen.`);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <KeyRound className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Doorstep Arrival Verification
            </span>
          </div>

          <h3 className="text-lg font-black text-white">
            Verify Customer Service OTP
          </h3>
          <p className="text-xs text-blue-100/80 mt-0.5">
            Confirm your physical arrival at customer location to unlock work order.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOtp} className="p-5 space-y-4">
          
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 text-xs text-blue-950 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span>Customer: {booking.customerName}</span>
              <span className="font-mono text-slate-500">#{booking.id}</span>
            </div>
            <p className="text-blue-800 flex items-center gap-1 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{booking.address || "Society Locality"}</span>
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
              Enter 4-Digit Service OTP from Customer's Screen:
            </label>
            <input
              type="text"
              maxLength="4"
              autoFocus
              required
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="• • • •"
              className="w-48 mx-auto block text-center text-2xl font-mono tracking-widest px-4 py-2.5 bg-slate-50 border-2 border-blue-400 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-black"
            />
            <p className="text-[11px] text-slate-400 text-center mt-1.5">
              Service will start immediately upon verification.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer h-11"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying || enteredOtp.length < 4}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer h-11"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isVerifying ? "Verifying..." : "Verify OTP & Start Service"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
