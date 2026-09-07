import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Repeat,
  Sparkles,
  Clock,
  User,
  PlusCircle,
  CheckCircle2,
  Send,
  Search,
  BookOpen,
  HelpCircle,
  Coins
} from "lucide-react";

export const SkillSwapDashboard = () => {
  const { currentUser, skillSwaps, createSkillSwap } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewSwapModalOpen, setIsNewSwapModalOpen] = useState(false);
  const [myTimeCredits, setMyTimeCredits] = useState(currentUser?.timeCredits || 3.5);

  const [formData, setFormData] = useState({
    offering: "",
    seeking: "",
    description: "",
    timeCredits: "1 Hour Barter",
  });

  const filteredSwaps = skillSwaps.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.offering.toLowerCase().includes(q) ||
      s.seeking.toLowerCase().includes(q) ||
      s.authorName.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)
    );
  });

  const handleProposeSwap = (swap) => {
    alert(`Barter proposal sent to ${swap.authorName}! They will receive your notification to coordinate a 1-to-1 session.`);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.offering || !formData.seeking) return;

    createSkillSwap({
      offering: formData.offering,
      seeking: formData.seeking,
      description: formData.description || "Excited to exchange knowledge and community skills!",
      timeCredits: formData.timeCredits,
      location: currentUser?.address || "Indiranagar / Nearby",
    });

    setIsNewSwapModalOpen(false);
    setFormData({ offering: "", seeking: "", description: "", timeCredits: "1 Hour Barter" });
    setMyTimeCredits((prev) => prev + 0.5); // reward for posting
  };

  return (
    <div className="space-y-6">
      {/* Hero Barter Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMUNITY TIMEBANK & BARTER (BETA)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Skill Swap Collective
          </h1>
          <p className="text-amber-100 text-sm mt-2 leading-relaxed">
            Exchange your skills with verified neighborhood residents without any money changing hands. Teach a language, learn gardening, swap power tools, or share computer coding tips!
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-2.5">
              <Coins className="w-5 h-5 text-amber-200" />
              <div>
                <p className="text-[10px] uppercase font-bold text-amber-200">Your Barter Balance</p>
                <p className="text-base font-extrabold">{myTimeCredits} Time Hours</p>
              </div>
            </div>

            <button
              onClick={() => setIsNewSwapModalOpen(true)}
              className="px-5 py-2.5 bg-white hover:bg-amber-50 text-amber-900 text-xs font-black rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-600" />
              <span>Post a Skill Barter Offer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search skill (e.g. English, Guitar, Gardening, Plumbing, Baking)..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 shrink-0">
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl">
            {filteredSwaps.length} Active Barter Offers
          </span>
        </div>
      </div>

      {/* Grid of Skill Swaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSwaps.map((swap) => (
          <div
            key={swap.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between p-5"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={swap.authorAvatar}
                    alt={swap.authorName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-xs">{swap.authorName}</h3>
                    <p className="text-[10px] text-slate-400">{swap.location}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  {swap.timeCredits}
                </span>
              </div>

              {/* Trade Details */}
              <div className="space-y-2.5 my-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                    🎁 Offering (Can Teach/Do):
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{swap.offering}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/70">
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                    🎯 Looking For in Return:
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{swap.seeking}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                {swap.description}
              </p>
            </div>

            <button
              onClick={() => handleProposeSwap(swap)}
              className="mt-4 w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Propose 1-on-1 Skill Barter</span>
            </button>
          </div>
        ))}
      </div>

      {/* New Swap Modal */}
      {isNewSwapModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-900">Post a Skill Barter Opportunity</h3>
            <p className="text-xs text-slate-500 mt-1">
              Offer your expertise to your neighbors in exchange for something you need.
            </p>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  What Skill Can You Offer? *
                </label>
                <input
                  type="text"
                  required
                  value={formData.offering}
                  onChange={(e) => setFormData({ ...formData, offering: e.target.value })}
                  placeholder="e.g. Basic French speaking, Bicycle repair, Sketching"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  What Skill / Task Do You Need in Return? *
                </label>
                <input
                  type="text"
                  required
                  value={formData.seeking}
                  onChange={(e) => setFormData({ ...formData, seeking: e.target.value })}
                  placeholder="e.g. Balcony plant repotting, Guitar lessons, Sourdough baking"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Details
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Share a short note about what you'll teach and your availability."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSwapModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Publish Barter Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
