import React from "react";
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  FileText, 
  ExternalLink,
  PhoneCall,
  Mail
} from "lucide-react";

export const Footer = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Concept */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                सह
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Sahakari<span className="text-emerald-400">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's first democratic, community-owned digital gig cooperative. Eliminating exploitative 25-30% platform commissions while guaranteeing household trust & safety.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-emerald-400 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 2026</span>
            </div>
          </div>

          {/* Quick Pillars */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Cooperative Pillars</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Zero Corporate Commission</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Worker-Owned Digital ID & Ratings</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Community Emergency Welfare Pool</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Transparent Fixed Fare Standard</span>
              </li>
            </ul>
          </div>

          {/* User Journeys */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Explore Roles</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => setActiveTab("dashboard")} 
                  className="hover:text-emerald-400 transition"
                >
                  Household Booking Experience
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("jobs")} 
                  className="hover:text-emerald-400 transition"
                >
                  Gig Worker Job Feed & Ledger
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("requests")} 
                  className="hover:text-emerald-400 transition"
                >
                  RWA / Society Maintenance Pooling
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("landing")} 
                  className="hover:text-emerald-400 transition"
                >
                  Problem vs Solution Pitch
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Support Collective</h4>
            <p className="text-xs text-slate-400 mb-2">
              Cooperative Helpdesk available 24/7 for emergency community assistance.
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>1800-SAHAKARI (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@sahakari.org.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Sahakari Cooperative Network. Developed for Smart India Hackathon.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>Built with React + Vite + Tailwind CSS</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">100% Fair Indian Gig Economy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
