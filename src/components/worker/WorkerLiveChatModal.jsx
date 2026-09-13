import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Sliders,
  DollarSign,
  User,
  Clock
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const WorkerLiveChatModal = ({
  isOpen,
  onClose,
  worker,
}) => {
  const {
    activeChatSession,
    startChatSession,
    sendChatMessage,
    respondToBargainOffer,
    bookings,
    acceptBookingOffer,
    declineBookingOffer,
  } = useApp();

  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatSession?.messages]);

  if (!isOpen || !worker) return null;

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;
    if (!activeChatSession || activeChatSession.workerId !== worker.id) {
      startChatSession(worker);
    }
    sendChatMessage("worker", messageInput.trim());
    setMessageInput("");
  };

  const handleSendQuickReply = (text) => {
    if (!activeChatSession || activeChatSession.workerId !== worker.id) {
      startChatSession(worker);
    }
    sendChatMessage("worker", text);
  };

  // Find if there is an active pending booking from customer
  const relatedBooking = bookings.find(
    (b) => b.workerId === worker.id && b.status === "Requested"
  );

  const quickWorkerReplies = [
    "Namaste! I have my tools and diagnostic equipment ready.",
    "Can you share a photo or describe the leak/issue?",
    "I can reach your apartment within 15-20 minutes.",
    "Yes, our cooperative rate is all-inclusive with 30-day warranty.",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh] max-h-[720px]">
        
        {/* Header: Technician Chat Desk */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-white truncate">
                  {worker.name} (Live Chat Desk)
                </h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Worker View
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Chatting with: <strong>{activeChatSession?.customerName || "Customer (Resident)"}</strong>
              </p>
              <p className="text-[11px] text-slate-300">
                Service: {worker.serviceName} • Base Rate: ₹{worker.hourlyRate || 350}/hr
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real-Time Offer / Bargain Banner if Active */}
        {activeChatSession?.bargainStatus === "bargain_requested" && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 shrink-0 animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Incoming Bargain Offer from Customer!</span>
              </span>
              <span className="text-sm font-black text-emerald-700 font-mono">
                Offered: ₹{activeChatSession.proposedPrice}
              </span>
            </div>

            <p className="text-xs text-amber-800 mt-1">
              Customer offered ₹{activeChatSession.proposedPrice} (vs standard ₹{worker.hourlyRate || 350}). You can accept, counter, or decline.
            </p>

            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => respondToBargainOffer("accept")}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer h-10"
              >
                Accept ₹{activeChatSession.proposedPrice}
              </button>

              <button
                type="button"
                onClick={() => {
                  const counter = Math.round(((worker.hourlyRate || 350) + activeChatSession.proposedPrice) / 2 / 10) * 10;
                  respondToBargainOffer("counter", counter);
                }}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer h-10"
              >
                Counter (~₹{Math.round(((worker.hourlyRate || 350) + activeChatSession.proposedPrice) / 2 / 10) * 10})
              </button>

              <button
                type="button"
                onClick={() => respondToBargainOffer("decline")}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer h-10"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* Incoming Booking Offer Alert Banner */}
        {relatedBooking && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 shrink-0 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <div>
                <span className="text-xs font-black text-emerald-950 block">
                  Incoming Job Request #{relatedBooking.id}
                </span>
                <span className="text-[11px] text-emerald-800">
                  {relatedBooking.customerName} • Payout: <strong>₹{relatedBooking.workerPayout || relatedBooking.serviceCharge}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => acceptBookingOffer(relatedBooking.id)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer"
              >
                Accept Offer
              </button>
              <button
                type="button"
                onClick={() => declineBookingOffer(relatedBooking.id)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Decline
              </button>
            </div>
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
                    isWorker ? "justify-end" : "justify-start"
                  }`}
                >
                  {isCustomer && (
                    <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold mb-1 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] sm:max-w-[72%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isWorker
                        ? "bg-slate-900 text-white rounded-br-xs shadow-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold">
                      <span className={isWorker ? "text-emerald-400" : "text-emerald-700"}>
                        {isWorker ? "You (Worker)" : (activeChatSession.customerName || "Customer")}
                      </span>
                    </div>

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    <div
                      className={`text-[9px] mt-1.5 text-right font-mono ${
                        isWorker ? "text-slate-400" : "text-slate-400"
                      }`}
                    >
                      {msg.timestamp || "Just now"}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No active messages with customer yet. Messages sent by customer will appear here in real-time.
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Fast Worker Reply Chips */}
        <div className="px-3 py-1.5 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
          {quickWorkerReplies.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuickReply(chip)}
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
            placeholder="Type message to customer..."
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />

          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="p-2.5 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl transition disabled:opacity-40 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
