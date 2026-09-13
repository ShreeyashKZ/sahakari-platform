import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  PhoneCall,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  Award
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const PreBookingChatModal = ({
  isOpen,
  onClose,
  worker,
  onProceedToBooking,
  serviceOption = "diagnostic",
}) => {
  const {
    activeChatSession,
    startChatSession,
    sendChatMessage,
    submitBargainOffer,
  } = useApp();

  const [messageInput, setMessageInput] = useState("");
  const [showBargainMeter, setShowBargainMeter] = useState(false);
  const [customBargainPrice, setCustomBargainPrice] = useState(
    worker ? (worker.hourlyRate ? Math.round(worker.hourlyRate * 0.9) : 300) : 300
  );
  const messagesEndRef = useRef(null);

  // Initialize or ensure session exists for this worker
  useEffect(() => {
    if (isOpen && worker) {
      if (!activeChatSession || activeChatSession.workerId !== worker.id) {
        startChatSession(worker, {
          id: worker.serviceId,
          name: worker.serviceName,
        });
      }
      setCustomBargainPrice(Math.round((worker.hourlyRate || 350) * 0.85));
    }
  }, [isOpen, worker]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatSession?.messages]);

  if (!isOpen || !worker) return null;

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;
    sendChatMessage("customer", messageInput.trim());
    setMessageInput("");
  };

  const handleSendPrompt = (text) => {
    sendChatMessage("customer", text);
  };

  const handleSendBargain = () => {
    if (!customBargainPrice || customBargainPrice <= 0) return;
    submitBargainOffer(customBargainPrice);
    setShowBargainMeter(false);
  };

  const isDiag = serviceOption === "diagnostic";
  const baseRate = isDiag
    ? Math.round((worker.hourlyRate || 350) * 0.5)
    : (worker.hourlyRate || 350);

  const finalAgreedRate =
    activeChatSession?.agreedPrice && !isDiag
      ? activeChatSession.agreedPrice
      : baseRate;

  const quickPrompts = [
    "Are you available to arrive within 20 mins?",
    "Can you bring spare tools & diagnostic meters?",
    "Do you provide a 30-day cooperative workmanship warranty?",
    "Can you give an approximate estimate for pipe repair?",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh] max-h-[720px]">
        
        {/* Top Header: Worker Identity, Rating, Call */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-4 sm:p-5 relative flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
              />
              <span
                title="Online & Available Now"
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white truncate">
                  {worker.name}
                </h3>
                {worker.isPoliceVerified && (
                  <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    🛡️ Police Cleared
                  </span>
                )}
                {worker.isNsqfCertified && (
                  <span className="text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 px-2 py-0.5 rounded-full">
                    🎓 NSQF Certified
                  </span>
                )}
              </div>

              <p className="text-xs text-emerald-200 mt-0.5 truncate">
                {worker.serviceName} • {worker.distanceKm || 1.8} km away (ETA ~{worker.etaMinutes || 15}m)
              </p>

              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-300 flex-wrap">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-3 h-3 fill-amber-300" />
                  {worker.rating} ({worker.reviewsCount || 42} reviews)
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">
                  Standard Rate: ₹{worker.hourlyRate || 350}/hr
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={`tel:${worker.phone}`}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex items-center gap-1 text-xs font-bold"
              title="Call technician phone"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Call</span>
            </a>

            <button
              onClick={onClose}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-bar: Real-time status indicator & Bargain toggle */}
        <div className="bg-emerald-50/80 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-xs text-emerald-950 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-bold">Live Pre-Booking Consultation</span>
            <span className="text-slate-500 hidden sm:inline">• Free chat before booking</span>
          </div>

          <button
            type="button"
            onClick={() => setShowBargainMeter(!showBargainMeter)}
            className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-white border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition cursor-pointer shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>{showBargainMeter ? "Close Bargain Meter" : "Bargain / Negotiate Rate"}</span>
          </button>
        </div>

        {/* Collapsible Bargain Meter Widget */}
        {showBargainMeter && (
          <div className="p-4 bg-gradient-to-b from-amber-50/70 to-white border-b border-amber-200 shrink-0 animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Democratic Rate Negotiation</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-900">
                Base: ₹{worker.hourlyRate || 350}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="range"
                  min={Math.round((worker.hourlyRate || 350) * 0.6)}
                  max={worker.hourlyRate || 350}
                  step="10"
                  value={customBargainPrice}
                  onChange={(e) => setCustomBargainPrice(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>₹{Math.round((worker.hourlyRate || 350) * 0.6)} (Min fair rate)</span>
                  <span className="text-emerald-700 font-bold font-mono text-xs">₹{customBargainPrice}</span>
                  <span>₹{worker.hourlyRate || 350} (Standard)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendBargain}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition shadow-xs cursor-pointer h-10 shrink-0"
              >
                Send Offer ₹{customBargainPrice}
              </button>
            </div>

            {activeChatSession?.bargainStatus === "accepted" && (
              <div className="mt-2 p-2 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Worker agreed to ₹{activeChatSession.agreedPrice}! Ready for booking.</span>
              </div>
            )}
          </div>
        )}

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {activeChatSession?.messages && activeChatSession.messages.length > 0 ? (
            activeChatSession.messages.map((msg) => {
              const isWorker = msg.sender === "worker";
              const isCustomer = msg.sender === "customer";

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${
                    isCustomer ? "justify-end" : "justify-start"
                  }`}
                >
                  {isWorker && (
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-7 h-7 rounded-xl object-cover border border-slate-200 shrink-0 mb-1"
                    />
                  )}

                  <div
                    className={`max-w-[80%] sm:max-w-[72%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isCustomer
                        ? "bg-emerald-600 text-white rounded-br-xs shadow-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs"
                    }`}
                  >
                    {isWorker && (
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-emerald-700">
                        <span>{worker.name}</span>
                        <span className="text-slate-400">• Co-op Technician</span>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    <div
                      className={`text-[9px] mt-1.5 text-right font-mono ${
                        isCustomer ? "text-emerald-100" : "text-slate-400"
                      }`}
                    >
                      {msg.timestamp || "Just now"}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              Start chatting with {worker.name} regarding your repair issue.
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Fast Prompt Chips */}
        <div className="px-3 py-1.5 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendPrompt(chip)}
              className="text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 whitespace-nowrap transition cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={`Message ${worker.name}...`}
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />

          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition disabled:opacity-40 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Bottom Booking Action Drawer */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">
              Ready to schedule?
            </span>
            <span className="text-sm font-black text-emerald-400 font-mono">
              ₹{finalAgreedRate} {isDiag ? "(50% Diagnostic)" : "(Full Repair)"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onProceedToBooking) {
                onProceedToBooking(worker, finalAgreedRate);
              }
            }}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer h-11"
          >
            <span>Proceed to Book {isDiag ? "Inspection" : "Repair"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
