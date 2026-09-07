import React, { useState, useRef, useEffect } from "react";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Send,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Sparkles,
  DollarSign,
  CheckCircle2,
  X,
  Sliders,
  AlertCircle,
  ArrowRight,
  User
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const ChatBargainModal = ({
  isOpen,
  onClose,
  worker,
  onConfirmBooking,
  isEmergency = false,
}) => {
  const {
    activeChatSession,
    sendChatMessage,
    submitBargainOffer,
    currentUser,
  } = useApp();

  const [inputMessage, setInputMessage] = useState("");
  const [showPriceMeter, setShowPriceMeter] = useState(false);
  const [bargainValue, setBargainValue] = useState(
    worker ? Math.max(250, worker.hourlyRate - 50) : 350
  );
  const [isInPhoneCall, setIsInPhoneCall] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (worker) {
      setBargainValue(Math.max(200, (worker.hourlyRate || 350) - 50));
    }
  }, [worker]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatSession?.messages]);

  // Call timer simulation
  useEffect(() => {
    let interval = null;
    if (isInPhoneCall) {
      interval = setInterval(() => {
        setCallSeconds((s) => s + 1);
      }, 1000);
    } else {
      setCallSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isInPhoneCall]);

  if (!isOpen || !worker || !activeChatSession) return null;

  const baseRate = activeChatSession.baseRate || worker.hourlyRate || 350;
  const agreedPrice = activeChatSession.agreedPrice || baseRate;
  const etaMins = worker.etaMinutes || (isEmergency ? 10 : 18);
  const canBargain = worker.canBargain !== false;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendChatMessage("customer", inputMessage.trim());
    setInputMessage("");
  };

  const handleSendBargain = () => {
    submitBargainOffer(bargainValue);
    setShowPriceMeter(false);
  };

  const handleConfirm = () => {
    const bookingPayload = {
      workerId: worker.id,
      workerName: worker.name,
      workerAvatar: worker.avatar,
      workerPhone: worker.phone,
      serviceId: worker.serviceId,
      serviceName: worker.serviceName,
      serviceCategory: worker.serviceName,
      totalAmount: agreedPrice,
      workerPayout: Math.max(100, agreedPrice - 25),
      platformFee: 25,
      etaMinutes: etaMins,
      initialEtaMinutes: etaMins,
      isEmergency,
      agreedRate: agreedPrice,
      serviceOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      scheduledTime: isEmergency ? "Immediate Emergency (Arriving Now)" : "Today, Next Available Slot",
      address: currentUser?.address || "Indiranagar, Bengaluru (Your Location)",
    };
    onConfirmBooking(bookingPayload);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[90vh] max-h-[720px]">
        
        {/* Top Header: Worker info, call button, close */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-emerald-400"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-extrabold text-sm text-white truncate">{worker.name}</h3>
                {worker.isEshramVerified && (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded-md font-bold flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> e-Shram
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-0.5">
                <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                  <Clock className="w-3 h-3" /> {etaMins} mins away
                </span>
                <span>•</span>
                <span>⭐ {worker.rating}</span>
                <span>•</span>
                <span className="font-semibold text-slate-200">Base: ₹{baseRate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Call Button */}
            <a
              href={`tel:${worker.phone}`}
              onClick={(e) => {
                // Keep simulated visual call active on desktop/mobile
                setIsInPhoneCall(!isInPhoneCall);
              }}
              title="Call Worker Directly"
              className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                isInPhoneCall
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span className="hidden sm:inline">{isInPhoneCall ? "End Call" : "Call"}</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Audio Call Banner if activated */}
        {isInPhoneCall && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-2 text-xs flex items-center justify-between animate-in slide-in-from-top duration-200 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span className="font-bold">Connected on Call with {worker.name} ({worker.phone})</span>
            </div>
            <span className="font-mono font-extrabold bg-black/20 px-2 py-0.5 rounded-lg">
              {formatTimer(callSeconds)}
            </span>
          </div>
        )}

        {/* Tags bar */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[10px] font-bold text-slate-600 shrink-0">
          <span className="text-slate-400 uppercase text-[9px] tracking-wider">Worker Tags:</span>
          {canBargain ? (
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
              🤝 Can be bargained with
            </span>
          ) : (
            <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md border border-slate-300">
              🔒 Flat fixed price
            </span>
          )}
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
            ⚡ Quickest in the job ({etaMins}m)
          </span>
          {isEmergency && (
            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md border border-rose-200">
              🚨 Emergency Ready
            </span>
          )}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {activeChatSession.messages.map((msg) => {
            const isMe = msg.sender === "customer";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} animate-in fade-in duration-150`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    isMe
                      ? "bg-emerald-600 text-white rounded-br-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Interactive Price Meter / Bargaining Drawer */}
        {showPriceMeter && (
          <div className="p-4 bg-amber-50/90 border-t-2 border-amber-300 animate-in slide-in-from-bottom duration-200 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-700" />
                <h4 className="text-xs font-black text-amber-950">
                  Interactive Price Bargain Meter
                </h4>
              </div>
              <button
                onClick={() => setShowPriceMeter(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Standard Base: ₹{baseRate}</span>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-extrabold text-amber-700 block">Your Offer</span>
                  <span className="text-xl font-black text-slate-900 font-mono">₹{bargainValue}</span>
                </div>
              </div>

              {/* Slider Meter */}
              <input
                type="range"
                min={Math.round(baseRate * 0.65)}
                max={Math.round(baseRate * 1.15)}
                step={10}
                value={bargainValue}
                onChange={(e) => setBargainValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />

              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-amber-700">₹{Math.round(baseRate * 0.65)} (Max Discount)</span>
                <span className="text-emerald-700">
                  {bargainValue < baseRate
                    ? `Save ₹${baseRate - bargainValue} (${Math.round(((baseRate - bargainValue) / baseRate) * 100)}% off)`
                    : "Standard Rate"}
                </span>
                <span className="text-slate-500">₹{Math.round(baseRate * 1.15)} (Generous)</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSendBargain}
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Offer (₹{bargainValue}) to Worker</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Control Bar: Bargain Toggle, Input, Confirm Booking */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0 space-y-2.5">
          {/* Quick Bargain & Status Banner */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowPriceMeter(!showPriceMeter)}
              disabled={!canBargain}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                canBargain
                  ? showPriceMeter
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span>{canBargain ? "🤝 Bargain Price" : "🔒 Flat Fixed Price"}</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Agreed Rate:</span>
              <span className="font-extrabold text-slate-900 text-sm font-mono">₹{agreedPrice}</span>
              {agreedPrice < baseRate && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  -₹{baseRate - agreedPrice} Deal!
                </span>
              )}
            </div>
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask questions, give gate directions..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Confirm Booking Main CTA */}
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Confirm Booking for ₹{agreedPrice}</span>
            <span className="opacity-80 font-normal text-[11px]">• Arrives in ~{etaMins} mins</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
