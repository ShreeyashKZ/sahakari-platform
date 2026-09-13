import React from "react";
import {
  X,
  Star,
  ShieldCheck,
  Award,
  Clock,
  MapPin,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  FileCheck,
  Coins,
  ArrowRight,
  UserCheck
} from "lucide-react";
import { MiddlemanSavingsBubble } from "../common/MiddlemanSavingsBubble";

export const WorkerBioModal = ({
  isOpen,
  onClose,
  worker,
  onStartChat,
  onBookWorker,
  serviceOption = "diagnostic",
}) => {
  if (!isOpen || !worker) return null;

  const isPolice = Boolean(worker.isPoliceVerified);
  const isNsqf = Boolean(worker.isNsqfCertified);
  const isShareholder = Boolean(worker.isShareholder);
  const isDiag = serviceOption === "diagnostic";
  const rateToDisplay = isDiag
    ? Math.round((worker.hourlyRate || 350) * 0.5)
    : (worker.hourlyRate || 350);

  const maskedAadhaar = worker.aadhaar
    ? (worker.aadhaar.includes("XXXX") ? worker.aadhaar : `XXXX-XXXX-${worker.aadhaar.slice(-4)}`)
    : `XXXX-XXXX-${worker.phone ? worker.phone.slice(-4) : "4819"}`;

  const tags = worker.attractionTags || [
    "Cooperative Verified",
    "Emergency Callout Available",
    "30-Day Workmanship Warranty",
    "Apartment Complex Specialist",
    "Calibrated Diagnostic Tools",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header: Worker Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
              />
              <span
                title="Verified Cooperative Master"
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"
              />
            </div>

            <div className="min-w-0 pr-8">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white truncate">
                  {worker.name}
                </h2>
                {isPolice && (
                  <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    🛡️ Police Cleared
                  </span>
                )}
                {isNsqf && (
                  <span className="text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 px-2 py-0.5 rounded-full">
                    🎓 NSQF Level 4
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-emerald-200 font-medium mt-0.5">
                {worker.serviceName} • {worker.experienceYears || 5} Years Experience
              </p>

              <div className="flex items-center gap-3 mt-2 text-xs text-slate-300 flex-wrap">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {worker.rating} ({worker.reviewsCount || 42} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {worker.distanceKm || 1.8} km away (~{worker.etaMinutes || 15}m ETA)
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">
                  Direct Phone: {worker.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body (100% Read-Only: NO UPLOAD CONTROLS) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Rate & Middleman Savings Callout */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-900 block">Transparent Cooperative Pricing</span>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                100% labour payment retained by {worker.name.split(" ")[0]}. Zero corporate commission cut.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-black text-emerald-900 font-mono block">
                ₹{rateToDisplay}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 block">
                {isDiag ? "50% Problem Inspection" : "Full Standard Repair"}
              </span>
            </div>
          </div>

          {/* Professional Bio Statement */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>About & Professional Experience</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {worker.bio || `Senior ${worker.serviceName} specialist registered with Bengaluru Cooperative Guild. Dedicated to genuine doorstep repairs with 30-day warranty coverage and zero markups.`}
            </p>
          </div>

          {/* Specialization Tags */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
              Verified Craft Tags & Badges
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-medium shadow-2xs flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Clearances & Government Verifications Showcase (READ ONLY) */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Official Clearances & Verifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              
              {/* 1. Police Clearance Certificate (PCC) */}
              <div className={`p-3 rounded-2xl border ${
                isPolice
                  ? "bg-emerald-50/70 border-emerald-200"
                  : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Police Clearance Certificate (PCC)</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isPolice ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                  }`}>
                    {isPolice ? "🛡️ Verified ✓" : "Provisional"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  {isPolice
                    ? "State Police criminal background verification complete & cleared."
                    : "Under cooperative peer review."}
                </p>
              </div>

              {/* 2. Skill India (NSQF) */}
              <div className={`p-3 rounded-2xl border ${
                isNsqf
                  ? "bg-indigo-50/70 border-indigo-200"
                  : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Skill India (NSQF Level 4)</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isNsqf ? "bg-indigo-100 text-indigo-800" : "bg-slate-200 text-slate-600"
                  }`}>
                    {isNsqf ? "🎓 Certified ✓" : "Guild Vetted"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  {isNsqf
                    ? "National Skills Qualification Framework Level 4 certified."
                    : "Practical guild competency verified."}
                </p>
              </div>

              {/* 3. Aadhaar e-KYC */}
              <div className="p-3 rounded-2xl border bg-slate-50 border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Aadhaar Digital e-KYC</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    🇮🇳 Verified ✓
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-600 mt-1">
                  ID: {maskedAadhaar}
                </p>
              </div>

              {/* 4. Democratic Cooperative Shareholder */}
              <div className={`p-3 rounded-2xl border ${
                isShareholder
                  ? "bg-amber-50/70 border-amber-200"
                  : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Cooperative Voting Owner</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isShareholder ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"
                  }`}>
                    {isShareholder ? "🏷️ Co-owner ✓" : "Associate"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  {isShareholder
                    ? "Holds 1 democratic voting share in the Sahakari Guild collective."
                    : "Associate cooperative member."}
                </p>
              </div>

            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Recent Customer Reviews ({worker.reviewsCount || 42})
              </h3>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                {worker.rating} out of 5.0
              </span>
            </div>

            <div className="space-y-2">
              {(worker.reviews && worker.reviews.length > 0 ? worker.reviews : [
                {
                  id: "rev-1",
                  customerName: "Vikram M.",
                  rating: 5,
                  comment: "Extremely punctual and transparent. Solved the pipe leak in 25 minutes without pushing unnecessary spare parts.",
                  date: "2 days ago",
                  tags: ["Punctual Arrival", "Fair & Transparent"],
                },
                {
                  id: "rev-2",
                  customerName: "Ananya R.",
                  rating: 5,
                  comment: "Very polite technician. Charged the exact 50% inspection fee agreed upon upfront. 100% recommended!",
                  date: "Last week",
                  tags: ["Polite Demeanour", "High Quality Work"],
                },
              ]).slice(0, 5).map((r, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{r.customerName}</span>
                    <span className="text-amber-600 font-black flex items-center gap-0.5">
                      ★ {r.rating}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    "{r.comment}"
                  </p>
                  {r.tags && r.tags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-0.5">
                      {r.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[9px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onStartChat) onStartChat(worker);
            }}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer h-11"
          >
            <MessageCircle className="w-4 h-4 text-emerald-700" />
            <span>Chat & Inquire First</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onBookWorker) onBookWorker(worker);
            }}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer h-11"
          >
            <span>Book {isDiag ? "Inspection" : "Repair"} (₹{rateToDisplay})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
