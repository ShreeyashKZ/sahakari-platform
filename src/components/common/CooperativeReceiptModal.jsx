import React from 'react';
import { CheckCircle2, Download, Printer, ShieldCheck, HeartHandshake, ArrowRight, X, Sparkles } from 'lucide-react';

export default function CooperativeReceiptModal({ isOpen, onClose, receiptData }) {
  if (!isOpen || !receiptData) return null;

  const {
    jobId = 'JOB-8821',
    customerName = 'Priya Sharma',
    workerName = 'Ramesh Kumar',
    trade = 'Master Electrical Repair',
    bookingType = 'Full Standard Repair',
    completedAt = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    baseLabour = 350,
    partsMaterial = 120,
    coopMaintenanceFee = 20, // Flat transparent at-cost maintenance fee
  } = receiptData;

  const directWorkerPayout = baseLabour + partsMaterial;
  const totalPaid = directWorkerPayout + coopMaintenanceFee;
  // Compared to typical commercial platform (25% commission on labour + service tax markup)
  const corporateTakeRateFee = Math.round(baseLabour * 0.28);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            aria-label="Close receipt"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Sahakari Worker-Owned Cooperative</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Digital Service Invoice</h2>
          <p className="text-emerald-100/90 text-sm mt-0.5">Transparent, Fair-Wage & Zero Middleman Cut</p>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <div className="text-xs text-slate-500 font-medium">Job Reference</div>
              <div className="font-mono font-bold text-slate-800">{jobId}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Service Timestamp</div>
              <div className="font-medium text-slate-700 text-xs">{completedAt}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Customer</div>
              <div className="font-semibold text-slate-800">{customerName}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Assigned Co-op Master</div>
              <div className="font-semibold text-slate-800">{workerName}</div>
              <div className="text-[11px] text-emerald-700 font-medium">{trade}</div>
            </div>
          </div>

          {/* Service Classification */}
          <div className="flex items-center justify-between px-3 py-2 bg-emerald-50/70 border border-emerald-200/60 rounded-xl">
            <span className="text-xs font-semibold text-emerald-900">Service Category:</span>
            <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-md shadow-sm border border-emerald-100">
              {bookingType}
            </span>
          </div>

          {/* Itemized Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Itemized Fee Distribution</h3>
            
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center p-3.5 bg-white hover:bg-slate-50/60 transition-colors">
                <div>
                  <div className="font-semibold text-slate-800">Direct Labour Wage</div>
                  <div className="text-xs text-slate-500">100% retained directly by {workerName}</div>
                </div>
                <div className="font-mono font-bold text-slate-800 text-base">₹{baseLabour}</div>
              </div>

              {partsMaterial > 0 && (
                <div className="flex justify-between items-center p-3.5 bg-white hover:bg-slate-50/60 transition-colors">
                  <div>
                    <div className="font-semibold text-slate-800">Parts & Materials (At-Cost)</div>
                    <div className="text-xs text-slate-500">Direct vendor invoice passed without markup</div>
                  </div>
                  <div className="font-mono font-bold text-slate-800 text-base">₹{partsMaterial}</div>
                </div>
              )}

              <div className="flex justify-between items-center p-3.5 bg-emerald-50/40 hover:bg-emerald-50/70 transition-colors">
                <div>
                  <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
                    Co-op Tech & Welfare Fee
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">Democratic</span>
                  </div>
                  <div className="text-xs text-emerald-700/90">₹10 Server/SMS infra + ₹10 Worker Accident & Pension Pool</div>
                </div>
                <div className="font-mono font-bold text-emerald-800 text-base">₹{coopMaintenanceFee}</div>
              </div>
            </div>
          </div>

          {/* Direct Worker Payout Highlight */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-4 rounded-2xl shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-emerald-100 font-medium">Direct Worker Take-Home</div>
                <div className="text-2xl font-black tracking-tight">₹{directWorkerPayout}</div>
                <div className="text-[11px] text-emerald-100/90 mt-0.5">
                  100% Labour + Materials credited with ZERO predatory cuts
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-emerald-200 font-medium">Total Customer Paid</div>
                <div className="text-xl font-bold font-mono">₹{totalPaid}</div>
              </div>
            </div>
          </div>

          {/* Social Cooperative Impact Box */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-2xl flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Cooperative Impact Saved: ₹{corporateTakeRateFee}</span>
              <p className="mt-0.5 text-amber-800/90">
                Corporate gig aggregators would have extracted ₹{corporateTakeRateFee} (25-30%) as commission from this job. On Sahakari, that value is completely preserved between you and the technician.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors shadow-sm h-11"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm shadow-emerald-600/30 h-11"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Done</span>
          </button>
        </div>

      </div>
    </div>
  );
}
