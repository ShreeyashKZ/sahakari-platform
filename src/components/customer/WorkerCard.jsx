import React from "react";
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Sparkles,
  Award,
  Calendar
} from "lucide-react";
import { StarRating } from "../common/UIComponents";

export const WorkerCard = ({ worker, onBookNow, onSelectProfile, isSmartRecommended }) => {
  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        isSmartRecommended
          ? "border-emerald-400 ring-2 ring-emerald-500/20 shadow-md"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {/* Smart Match recommendation badge */}
      {isSmartRecommended && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold px-3.5 py-1 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Best Cooperative Match for You
          </span>
          <span className="opacity-90 font-mono text-[10px]">98% Match Score</span>
        </div>
      )}

      <div className="p-5">
        {/* Worker Header Info */}
        <div className="flex items-start gap-3.5">
          <div className="relative">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
            />
            {worker.isAvailable && (
              <span 
                title="Available right now"
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base truncate">
                {worker.name}
              </h3>
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                {worker.priceRange}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">{worker.serviceName}</p>

            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <StarRating rating={worker.rating} count={worker.reviewsCount} size="xs" />
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {worker.distanceKm} km away
              </span>
            </div>
          </div>
        </div>

        {/* Verification & Experience Pill */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Co-op Certified (Demo)</span>
          </div>
          <span className="text-slate-500 font-medium">
            {worker.completedJobs}+ jobs completed
          </span>
        </div>

        {/* Smart Match Reasoning Box */}
        {isSmartRecommended && (
          <div className="mt-3.5 bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs">
            <p className="font-bold text-slate-800 text-[11px] mb-1.5 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Recommended because:
            </p>
            <ul className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 font-medium">
              <li className="flex items-center gap-1">
                <span className="text-emerald-500">✓</span> {worker.distanceKm} km nearby
              </li>
              <li className="flex items-center gap-1">
                <span className="text-emerald-500">✓</span> {worker.availability}
              </li>
              <li className="flex items-center gap-1">
                <span className="text-emerald-500">✓</span> {worker.rating}★ rating ({worker.reviewsCount} reviews)
              </li>
              <li className="flex items-center gap-1">
                <span className="text-emerald-500">✓</span> Transparent ₹450 flat rate
              </li>
            </ul>
          </div>
        )}

        {/* Worker Skills preview */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {worker.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
            >
              {skill}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 font-medium">
              +{worker.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => onSelectProfile(worker)}
          className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition"
        >
          View Bio & Reviews
        </button>
        <button
          onClick={() => onBookNow(worker)}
          className="flex-1 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
        >
          Book Now →
        </button>
      </div>
    </div>
  );
};
