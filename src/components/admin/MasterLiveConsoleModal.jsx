import React, { useState } from "react";
import {
  ShieldAlert,
  Send,
  Users,
  CheckCircle2,
  X,
  Sliders,
  DollarSign,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  ChevronDown,
  RefreshCw,
  Eye,
  Key,
  Flame,
  Check,
  Zap,
  Lock
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const MasterLiveConsoleModal = ({ isOpen, onClose }) => {
  const {
    workers,
    activeChatSession,
    masterActiveWorkerId,
    switchWorkerPersona,
    masterSendWorkerMessage,
    masterRespondBargain,
    services,
  } = useApp();

  const [customReply, setCustomReply] = useState("");
  const [selectedTradeFilter, setSelectedTradeFilter] = useState("all");
  const [counterInput, setCounterInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  const currentControlledWorker =
    workers.find((w) => w.id === masterActiveWorkerId) || workers[0];

  const filteredWorkers = workers.filter((w) => {
    if (selectedTradeFilter === "all") return true;
    return w.serviceId === selectedTradeFilter;
  });

  const handleSendCustomMessage = (e) => {
    e.preventDefault();
    if (!customReply.trim()) return;
    masterSendWorkerMessage(customReply.trim());
    setCustomReply("");
  };

  const handleQuickPreset = (presetText) => {
    masterSendWorkerMessage(presetText);
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized
          ? "bottom-4 right-4 w-80 shadow-2xl rounded-2xl"
          : "inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      }`}
    >
      <div
        className={`bg-slate-900 text-white rounded-3xl border border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col ${
          isMinimized ? "h-auto border-2 border-emerald-500" : "w-full max-w-4xl max-h-[90vh] h-[780px]"
        }`}
      >
        
        {/* Top Master Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-4 sm:p-5 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-md ring-2 ring-emerald-400/30">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-tight">
                  Sahakari Master Live Console
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                  MASTER ACCOUNT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Credentials: <code className="text-emerald-300 font-mono">master@sahakari.in</code> | PW: <code className="text-emerald-300 font-mono">Master@2026</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              {isMinimized ? "Expand Console ⤢" : "Minimize 🗕"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* If Minimized View */}
        {isMinimized ? (
          <div className="p-3 bg-slate-900 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Controlling:</span>
              <span className="font-bold text-emerald-400 truncate max-w-[140px]">
                {currentControlledWorker.name} ({currentControlledWorker.serviceName})
              </span>
            </div>
            {activeChatSession?.bargainStatus === "bargain_requested" && (
              <div className="bg-amber-950/80 border border-amber-500/40 p-2 rounded-xl text-center">
                <p className="text-[11px] font-bold text-amber-300">
                  Customer offered ₹{activeChatSession.proposedPrice}!
                </p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <button
                    onClick={() => masterRespondBargain("accept")}
                    className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => masterRespondBargain("decline")}
                    className="px-2 py-0.5 bg-rose-700 text-white rounded text-[10px] font-bold"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}
            <form onSubmit={handleSendCustomMessage} className="flex gap-1">
              <input
                type="text"
                value={customReply}
                onChange={(e) => setCustomReply(e.target.value)}
                placeholder="Quick live reply as worker..."
                className="flex-1 px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
              />
              <button
                type="submit"
                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          /* Full Dashboard Layout: 2 Columns (Worker Switcher & Live Conversation Controller) */
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden bg-slate-950">
            
            {/* Left Column: All Worker Profiles across Every Trade */}
            <div className="md:col-span-5 border-r border-slate-800 p-4 flex flex-col min-h-0 bg-slate-900/60">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block">
                    Masquerade & Control
                  </span>
                  <h4 className="text-xs font-black text-white">
                    Select Worker Profile ({workers.length} Available)
                  </h4>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                  Active: {currentControlledWorker.name}
                </span>
              </div>

              {/* Trade filter pill bar */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedTradeFilter("all")}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedTradeFilter === "all"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  All Trades ({workers.length})
                </button>
                {services.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => setSelectedTradeFilter(srv.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedTradeFilter === srv.id
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {srv.name.split(" ")[0]}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedTradeFilter("quick-gigs")}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedTradeFilter === "quick-gigs"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  ⚡ Quick Gigs
                </button>
              </div>

              {/* Worker List Scrollable */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredWorkers.map((worker) => {
                  const isSelected = worker.id === currentControlledWorker.id;
                  return (
                    <button
                      key={worker.id}
                      type="button"
                      onClick={() => switchWorkerPersona(worker.id)}
                      className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-500/50"
                          : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                      }`}
                    >
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white truncate">{worker.name}</p>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            ₹{worker.hourlyRate}/hr
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{worker.serviceName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {worker.isEshramVerified && (
                            <span className="text-[9px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                              e-Shram ✓
                            </span>
                          )}
                          {worker.canBargain ? (
                            <span className="text-[9px] bg-teal-900/60 text-teal-300 px-1.5 py-0.2 rounded">
                              Bargainable
                            </span>
                          ) : (
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                              Fixed
                            </span>
                          )}
                          <span className="text-[9px] text-slate-500">
                            {worker.distanceKm} km away
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 shrink-0"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live Conversation & Real-Time Bargain Controller */}
            <div className="md:col-span-7 flex flex-col min-h-0 bg-slate-950 p-4">
              
              {/* Active Conversation Header */}
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      Live Customer Conversation with:{" "}
                      <span className="text-emerald-400">{currentControlledWorker.name}</span>
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      You are controlling this worker profile in real time.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400 block">
                    Base: ₹{activeChatSession?.baseRate || currentControlledWorker.hourlyRate}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400">
                    Deal: ₹{activeChatSession?.agreedPrice || currentControlledWorker.hourlyRate}
                  </span>
                </div>
              </div>

              {/* Bargain Status Alert Card (If Customer submitted bargain) */}
              {activeChatSession?.bargainStatus === "bargain_requested" && (
                <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-amber-500/50 p-3.5 rounded-2xl mb-3 shadow-lg animate-in zoom-in-95">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                      Incoming Bargain Offer: ₹{activeChatSession.proposedPrice}
                    </span>
                    <span className="text-[10px] text-amber-200/80 font-mono">
                      (Customer requested ₹{activeChatSession.proposedPrice} vs ₹{activeChatSession.baseRate})
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 mb-3">
                    As Master controlling {currentControlledWorker.name}, how do you want to respond?
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => masterRespondBargain("accept")}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Deal (₹{activeChatSession.proposedPrice})</span>
                    </button>

                    <button
                      onClick={() => masterRespondBargain("counter")}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
                    >
                      <span>Counter (~₹{Math.round(((activeChatSession.baseRate || 350) + (activeChatSession.proposedPrice || 300)) / 2)})</span>
                    </button>

                    <button
                      onClick={() => masterRespondBargain("decline")}
                      className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Decline & Keep Fixed
                    </button>
                  </div>
                </div>
              )}

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto space-y-2.5 p-3 bg-slate-900/70 rounded-2xl border border-slate-800/80 mb-3 font-sans">
                {activeChatSession?.messages && activeChatSession.messages.length > 0 ? (
                  activeChatSession.messages.map((msg) => {
                    const isWorker = msg.sender === "worker";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isWorker ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5">
                          <span>{isWorker ? currentControlledWorker.name + " (You)" : "Customer (Real User)"}</span>
                          {msg.isLiveFromMaster && (
                            <span className="text-[8px] bg-emerald-950 text-emerald-300 px-1 py-0.2 rounded border border-emerald-500/30">
                              Master Live
                            </span>
                          )}
                          <span>• {msg.timestamp}</span>
                        </div>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs ${
                            isWorker
                              ? "bg-emerald-700 text-white rounded-tr-xs"
                              : "bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-xs"
                          }`}
                        >
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                    <p className="text-xs font-bold text-slate-400">No active customer chat yet</p>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                      Open a service on the Customer side and click "Chat & Bargain" with any worker to view live messages here.
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Presets for Live Demonstrations */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
                <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">
                  Quick Presets:
                </span>
                {[
                  "Namaste! I am on my bike and can arrive in 10 minutes.",
                  "Yes, I have all the spare parts and safety tools.",
                  "Deal agreed! Please confirm so I can start navigating.",
                  "I am right outside your apartment block!",
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickPreset(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap transition cursor-pointer"
                  >
                    "{preset.slice(0, 28)}..."
                  </button>
                ))}
              </div>

              {/* Master Live Input Form */}
              <form onSubmit={handleSendCustomMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customReply}
                  onChange={(e) => setCustomReply(e.target.value)}
                  placeholder={`Send live response as ${currentControlledWorker.name}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!customReply.trim()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send as Worker</span>
                </button>
              </form>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
