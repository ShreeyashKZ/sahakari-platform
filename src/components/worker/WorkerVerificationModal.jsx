import React, { useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck, 
  Award, 
  Fingerprint, 
  Clock,
  Info,
  Upload,
  Sparkles,
  ExternalLink,
  X
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const WorkerVerificationModal = ({ isOpen, onClose, worker }) => {
  const { updateWorkerVerification } = useApp();
  const [pccFile, setPccFile] = useState(worker?.pccCertificate || null);
  const [nsqfFile, setNsqfFile] = useState(worker?.nsqfCard || null);
  const [uanInput, setUanInput] = useState(worker?.eshramNumber || "");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !worker) return null;

  const handleSaveVerifications = (e) => {
    e.preventDefault();
    updateWorkerVerification(worker.id, {
      pccCertificate: pccFile ? true : worker.isPoliceVerified,
      nsqfCard: nsqfFile ? true : worker.isNsqfCertified,
      uanNumber: uanInput,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-slate-100 relative my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
            Cooperative Trust & Verification
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Progressive credentials: Build consumer trust through Police Verification & National Skill India certifications.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveVerifications} className="my-5 space-y-4 text-xs">
          
          {/* 1. Identity */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-start gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white mt-0.5">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">1. Aadhaar Digital e-KYC</h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Verified ✓
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Masked Aadhaar: <strong className="font-mono text-slate-700">{worker.aadhaar || "XXXX-XXXX-4819"}</strong>
              </p>
            </div>
          </div>

          {/* 2. Police Clearance Certificate (PCC) */}
          <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <h4 className="font-bold text-slate-900">2. State Police Character Certificate (PCC)</h4>
              </div>
              {worker.isPoliceVerified || pccFile ? (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                  🛡️ Police Verified ✓
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  Optional
                </span>
              )}
            </div>

            <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-200/60 text-[11px] text-emerald-900 leading-relaxed">
              <span className="font-bold">🛡️ Welfare Subsidy Incentive: </span>
              50% of your verification application fee will be reimbursed from the Cooperative Welfare Fund. Boosts customer booking rate by 3x.
            </div>

            <div className="flex items-center gap-3">
              <label className="flex-1 py-2 px-3 border border-dashed border-emerald-400 hover:border-emerald-600 bg-white rounded-xl text-center cursor-pointer transition">
                <span className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{pccFile ? "PCC_Certificate.pdf (Uploaded)" : "Upload Police Character Certificate"}</span>
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  className="hidden"
                  onChange={() => setPccFile("pcc_uploaded.pdf")}
                />
              </label>
            </div>
          </div>

          {/* 3. Skill India (NSQF) Digital Skill Card */}
          <div className="p-4 rounded-2xl border border-indigo-200/80 bg-indigo-50/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-700" />
                <h4 className="font-bold text-slate-900">3. Skill India (NSQF) Digital Skill Card</h4>
              </div>
              {worker.isNsqfCertified || nsqfFile ? (
                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 border border-indigo-300 px-2 py-0.5 rounded-full">
                  🎓 NSQF Level 4 Certified ✓
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  Optional
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Upload your QR-coded NSQF / PMKVY / ITI digital skill card (e.g. Domestic Electrician Level 4, Master Plumber).
            </p>

            <label className="block py-2 px-3 border border-dashed border-indigo-400 hover:border-indigo-600 bg-white rounded-xl text-center cursor-pointer transition">
              <span className="text-xs font-semibold text-indigo-700 flex items-center justify-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>{nsqfFile ? "NSQF_Level4_Card.pdf (Uploaded)" : "Upload Government QR Skill Card"}</span>
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                className="hidden"
                onChange={() => setNsqfFile("nsqf_uploaded.pdf")}
              />
            </label>
          </div>

          {/* 4. e-Shram Social Security Advisory Input */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800">4. Social Security: e-Shram 12-digit UAN</h4>
              <span className="text-[10px] text-slate-500 font-medium">National Welfare</span>
            </div>

            <div className="p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-relaxed">
              <span className="font-bold">Government Social Security Advisory: </span>
              Add your 12-digit e-Shram UAN to claim free ₹2,00,000 PMSBY accident insurance and national pension benefits.
            </div>

            <div>
              <input
                type="text"
                value={uanInput}
                onChange={(e) => setUanInput(e.target.value)}
                placeholder="e.g. 1298 4402 9183"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                <span>Not registered yet?</span>
                <a
                  href="https://eshram.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <span>eshram.gov.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Save / Update Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 h-11"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Credentials Updated Successfully!</span>
                </>
              ) : (
                <span>Save & Update Cooperative Trust Score</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
