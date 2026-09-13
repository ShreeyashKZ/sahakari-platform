import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Send,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  DollarSign,
  User,
  Clock,
  MapPin,
  Phone,
  ChevronRight,
  Check
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
    markChatReadByWorker,
    bookings,
    acceptBookingOffer,
    declineBookingOffer,
    currentUser,
  } = useApp();

  const [messageInput, setMessageInput] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'chat'
  const messagesEndRef = useRef(null);

  // Compile list of customers who have contacted or booked with this worker
  const customersList = useMemo(() => {
    if (!worker) return [];

    const map = new Map();

    // 1. If active chat session exists for this worker
    if (activeChatSession && (activeChatSession.workerId === worker.id || !activeChatSession.workerId)) {
      const cId = activeChatSession.customerId || "cust-1";
      const lastMsg = activeChatSession.messages?.[activeChatSession.messages.length - 1];
      const hasCustomerMsg = activeChatSession.messages?.some((m) => m.sender === "customer");

      map.set(cId, {
        id: cId,
        name: activeChatSession.customerName || "Vikram Malhotra",
        phone: activeChatSession.customerPhone || "+91 98450 12345",
        address: activeChatSession.customerAddress || "Flat 402, Shanti Vihar Apts, Indiranagar, Bengaluru",
        serviceName: activeChatSession.serviceName || worker.serviceName,
        bookingType: "Direct Pre-Booking Inquiry",
        status: hasCustomerMsg ? "Customer Messaged" : "Active Session",
        lastMessage: lastMsg ? lastMsg.text : "Inquiry initiated",
        timestamp: lastMsg ? (lastMsg.timestamp || "Just now") : "Just now",
        hasUnread: Boolean(activeChatSession.hasUnreadWorker || hasCustomerMsg),
        isFromChat: true,
      });
    }

    // 2. Bookings for this worker
    const workerBookings = bookings.filter((b) => b.workerId === worker.id);
    workerBookings.forEach((b) => {
      const cId = b.customerId || `cust-${b.id}`;
      const existing = map.get(cId);

      if (!existing) {
        map.set(cId, {
          id: cId,
          bookingId: b.id,
          name: b.customerName || "Customer",
          phone: b.customerPhone || "+91 98450 12345",
          address: b.address || "Society Locality, Bengaluru",
          serviceName: b.serviceName || worker.serviceName,
          bookingType: b.bookingType || "Full Repair",
          status: b.status,
          lastMessage: b.description || `Job Offer #${b.id} (${b.status})`,
          timestamp: b.date || "Today",
          hasUnread: b.status === "Requested",
          isFromChat: false,
        });
      } else {
        // Merge booking details
        existing.bookingId = b.id;
        existing.status = b.status;
        if (b.address) existing.address = b.address;
        if (b.phone) existing.phone = b.phone;
      }
    });

    return Array.from(map.values());
  }, [worker, activeChatSession, bookings]);

  // Mark as read when worker opens the modal or selects customer
  useEffect(() => {
    if (isOpen && markChatReadByWorker) {
      markChatReadByWorker();
    }
  }, [isOpen]);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (viewMode === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChatSession?.messages, viewMode]);

  // Reset to list view when modal re-opens
  useEffect(() => {
    if (isOpen) {
      setViewMode("list");
      setSelectedCustomer(null);
    }
  }, [isOpen]);

  if (!isOpen || !worker) return null;

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setViewMode("chat");

    if (!activeChatSession || activeChatSession.workerId !== worker.id) {
      startChatSession(worker, null, {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
      });
    }

    if (markChatReadByWorker) {
      markChatReadByWorker();
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;
    if (!activeChatSession || activeChatSession.workerId !== worker.id) {
      startChatSession(worker, null, selectedCustomer);
    }
    sendChatMessage("worker", messageInput.trim());
    setMessageInput("");
  };

  const handleSendQuickReply = (text) => {
    if (!activeChatSession || activeChatSession.workerId !== worker.id) {
      startChatSession(worker, null, selectedCustomer);
    }
    sendChatMessage("worker", text);
  };

  const quickWorkerReplies = [
    "Namaste! I have my tools and diagnostic equipment ready.",
    "Can you share a photo or describe the leak/issue?",
    "I can reach your apartment within 15-20 minutes.",
    "Yes, our cooperative rate is all-inclusive with 30-day warranty.",
  ];

  // Active booking for this worker if any
  const relatedBooking = bookings.find(
    (b) => b.workerId === worker.id && b.status === "Requested"
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh] max-h-[720px]">
        
        {/* ========================================================================= */}
        {/* HEADER                                                                    */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {viewMode === "chat" ? (
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-bold shrink-0"
                title="Back to Customer Inquiries List"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            ) : (
              <div className="relative shrink-0">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-white truncate">
                  {viewMode === "chat"
                    ? `${selectedCustomer?.name || activeChatSession?.customerName || "Customer"} (Live Chat)`
                    : `${worker.name} (Live Customer Inquiries)`}
                </h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Worker Desk
                </span>
              </div>
              
              <p className="text-xs text-emerald-200 mt-0.5 truncate">
                {viewMode === "chat" ? (
                  <span>
                    📞 {selectedCustomer?.phone || activeChatSession?.customerPhone || "+91 98450 12345"} • {selectedCustomer?.address || activeChatSession?.customerAddress || "Bengaluru"}
                  </span>
                ) : (
                  <span>
                    Service: {worker.serviceName} • ₹{worker.hourlyRate || 350}/hr • {customersList.length} Customer Contact{customersList.length === 1 ? "" : "s"}
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE 1: CUSTOMER DIRECTORY / INBOX LIST                              */}
        {/* ========================================================================= */}
        {viewMode === "list" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Customer Contacts & Inquiries
                </h4>
                <p className="text-[11px] text-slate-500">
                  Click on any customer below to inspect their contact details and chat in real-time:
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 shadow-2xs">
                {customersList.length} Active
              </span>
            </div>

            {customersList.length === 0 ? (
              <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">No Customer Inquiries Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    When a resident contacts you or submits a booking request, their contact details and real-time conversation will appear here immediately.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {customersList.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCustomer(c)}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          {c.name.charAt(0)}
                        </div>
                        {c.hasUnread && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-white"></span>
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition truncate">
                            {c.name}
                          </h4>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            c.hasUnread
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}>
                            {c.hasUnread ? "New Message" : (c.status || "Customer")}
                          </span>
                        </div>

                        {/* Customer Details: Phone & Address */}
                        <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 font-medium">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{c.phone}</span>
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1 font-medium truncate max-w-xs">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{c.address}</span>
                          </span>
                        </div>

                        {/* Last message preview */}
                        <p className="text-xs text-slate-500 italic mt-1.5 truncate bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                          "{c.lastMessage}"
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {c.timestamp}
                      </span>
                      <button
                        type="button"
                        className="px-3.5 py-1.5 bg-emerald-50 group-hover:bg-emerald-600 text-emerald-800 group-hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <span>Open Chat</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: REAL-TIME CONVERSATION STREAM WITH SELECTED CUSTOMER         */}
        {/* ========================================================================= */}
        {viewMode === "chat" && (
          <>
            {/* Customer Details Pill Bar */}
            <div className="bg-emerald-50/90 border-b border-emerald-100 px-4 py-2.5 flex items-center justify-between text-xs text-emerald-950 shrink-0">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="font-bold truncate">
                  Chatting with {selectedCustomer?.name || activeChatSession?.customerName || "Customer"}
                </span>
                <span className="text-slate-500 hidden sm:inline truncate">
                  • {selectedCustomer?.address || activeChatSession?.customerAddress || "Indiranagar"}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`tel:${selectedCustomer?.phone || "+919845012345"}`}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-bold text-[11px] transition flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span className="hidden sm:inline">Call</span>
                </a>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold text-[11px] transition"
                >
                  All Customers
                </button>
              </div>
            </div>

            {/* Incoming Booking Offer Alert Banner if Pending */}
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
                            {isWorker ? "You (Worker)" : (selectedCustomer?.name || activeChatSession.customerName || "Customer")}
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
                  No active messages with this customer yet. Send a greeting below or reply to their inquiry in real-time.
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
                placeholder={`Message ${selectedCustomer?.name || "customer"}...`}
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
          </>
        )}

      </div>
    </div>
  );
};
