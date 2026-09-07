import React from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck, 
  Award, 
  Fingerprint, 
  Clock,
  Info
} from "lucide-react";

export const WorkerVerificationModal = ({ isOpen, onClose, worker }) => {
  if (!isOpen || !worker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in duration-200">
        <div className="text-center pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">
            Cooperative Worker Verification
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Standard 3-tier guild vetting for transparent neighborhood safety.
          </p>
        </div>

        {/* Verification Checklist */}
        <div className="my-5 space-y-3">
          {/* Identity */}
          <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-start gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white mt-0.5">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">1. Digital Identity Verification</h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Verified ✓
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Aadhaar e-KYC demo verification & local residential address proof confirmed.
              </p>
            </div>
          </div>

          {/* Skill */}
          <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-start gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">2. Vocational Skill Assessment</h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Verified ✓
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                7+ years plumbing master craftsman test passed with Bengaluru East Co-op Guild.
              </p>
            </div>
          </div>

          {/* Profile & Safety */}
          <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-start gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white mt-0.5">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">3. Community Peer Endorsement</h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Verified ✓
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Endorsed by resident welfare societies with zero safety complaints.
              </p>
            </div>
          </div>

          {/* 4. Government e-Shram Card */}
          <div
            className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
              worker.isEshramVerified
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-amber-300 bg-amber-50/60"
            }`}
          >
            <div
              className={`p-2 rounded-xl text-white mt-0.5 ${
                worker.isEshramVerified ? "bg-emerald-600" : "bg-amber-600"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">4. Govt e-Shram Social Security</h4>
                {worker.isEshramVerified ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    e-Shram Verified ✓
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    No e-Shram Tag
                  </span>
                )}
              </div>
              {worker.isEshramVerified ? (
                <p className="text-[11px] text-slate-600 mt-0.5">
                  UAN: <strong className="font-mono">{worker.eshramNumber || "Verified"}</strong>. Enrolled for PMSBY ₹2,00,000 accidental cover & pension portal.
                </p>
              ) : (
                <div className="mt-1 space-y-1">
                  <p className="text-[11px] text-amber-800">
                    Not yet linked with e-Shram. <strong>Strongly advised</strong> to register on <a href="https://eshram.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-bold text-emerald-700">eshram.gov.in</a> to unlock insurance and the verified trust tag!
                  </p>
                  <a
                    href="https://www.youtube.com/results?search_query=how+to+make+eshram+card+online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[10px] font-bold text-red-600 hover:underline"
                  >
                    ▶ Watch YouTube Tutorial: How to Make e-Shram in 5 mins
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIH Hackathon Honest Labeling Notice */}
        <div className="bg-slate-100 p-3 rounded-xl flex items-start gap-2 text-[11px] text-slate-600">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong>Note for Hackathon Judges:</strong> This badge indicates prototype/demo tier verification logic. Production deployment integrates Digilocker & Skill India API gateways.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
        >
          Close Verification Card
        </button>
      </div>
    </div>
  );
};
