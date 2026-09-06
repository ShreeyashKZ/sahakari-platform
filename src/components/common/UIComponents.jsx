import React from "react";
import { Star } from "lucide-react";

export const StarRating = ({ rating, count, size = "sm", interactive = false, onSelect }) => {
  const stars = [1, 2, 3, 4, 5];
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {stars.map((star) => {
          const filled = star <= Math.round(rating);
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onSelect && onSelect(star)}
              className={`${interactive ? "cursor-pointer hover:scale-110 transition" : "cursor-default"}`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-100 text-slate-300"
                }`}
              />
            </button>
          );
        })}
      </div>
      {rating !== undefined && (
        <span className="font-bold text-slate-800 text-xs">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-slate-400 text-xs">({count})</span>
      )}
    </div>
  );
};

export const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "emerald" }) => {
  const colorStyles = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorStyles[color] || colorStyles.emerald}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs text-emerald-600 font-medium">
          <span>↑</span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};
