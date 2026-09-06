import React, { useState } from "react";
import { 
  Building2, 
  X, 
  Wrench, 
  DollarSign, 
  Calendar, 
  Users, 
  CheckCircle2 
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const BulkRequestModal = ({ isOpen, onClose }) => {
  const { createCommunityRequest, services } = useApp();

  const [societyName, setSocietyName] = useState("Shanti Vihar Apartments RWA");
  const [title, setTitle] = useState("Pre-Winter Solar Water Heater Descaling");
  const [category, setCategory] = useState("plumber");
  const [workersNeeded, setWorkersNeeded] = useState(2);
  const [budget, setBudget] = useState(4800);
  const [dateScheduled, setDateScheduled] = useState("Sept 20, 2026");
  const [description, setDescription] = useState(
    "Deep chemical descaling and pipe joint testing across 18 solar heating units on terrace."
  );

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    createCommunityRequest({
      societyName,
      title,
      category,
      workersNeeded: Number(workersNeeded),
      budget: `₹${budget.toLocaleString("en-IN")}`,
      dateScheduled,
      description,
      location: "Indiranagar, Bengaluru",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">
            Post Community Bulk Maintenance
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Employ local worker collectives directly with transparent society funds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Trade / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 bg-slate-50"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Workers Needed
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={workersNeeded}
                onChange={(e) => setWorkersNeeded(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Society Allocated Budget (₹)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Execution Target Date
              </label>
              <input
                type="text"
                value={dateScheduled}
                onChange={(e) => setDateScheduled(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Maintenance Scope / Instructions
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600"
            />
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center gap-2 text-[11px] text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              All local verified workers in this category will receive an immediate collective work beacon.
            </span>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition"
            >
              Publish to Collective →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
