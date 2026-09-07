import React, { useState } from "react";
import {
  Zap,
  PlusCircle,
  ShieldCheck,
  Video,
  CheckCircle2,
  Lock,
  Clock,
  MapPin,
  Phone,
  PhoneCall,
  User,
  AlertTriangle,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Check,
  X,
  Sparkles,
  Coins,
  Search,
  ExternalLink
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const QuickJobsSection = () => {
  const {
    quickJobs,
    createQuickJob,
    verifyUserAadhaar,
    verifyVideoCallAgreement,
    completeAndReleaseQuickJobPayment,
    currentUser,
  } = useApp();

  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [targetJobForAction, setTargetJobForAction] = useState(null);
  const [isAadhaarModalOpen, setIsAadhaarModalOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  // New Quick Job form
  const [newJobForm, setNewJobForm] = useState({
    title: "",
    category: "Pet Care",
    payout: 250,
    duration: "45 mins",
    timeSlot: "Today, Evening",
    location: currentUser?.address || "Indiranagar Society Compound",
    description: "",
  });

  // Aadhaar input
  const [aadhaarInput, setAadhaarInput] = useState("");
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [aadhaarVerifiedLocally, setAadhaarVerifiedLocally] = useState(
    Boolean(currentUser?.isAadhaarVerified || currentUser?.aadhaar)
  );

  // Video call simulation controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [videoConnectedTimer, setVideoConnectedTimer] = useState(0);

  const categories = ["All", "Pet Care", "Companionship & Sports", "Plant Care", "Light Help"];

  const filteredJobs = quickJobs.filter((job) => {
    if (filterCategory !== "All" && job.category !== filterCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Step 1: User clicks to take quick job
  const handleStartApplication = (job) => {
    setTargetJobForAction(job);
    if (!aadhaarVerifiedLocally && !currentUser?.isAadhaarVerified) {
      setIsAadhaarModalOpen(true);
    } else {
      setIsVideoCallOpen(true);
    }
  };

  // Step 2: Complete Aadhaar Verification
  const handleAadhaarVerify = (e) => {
    e.preventDefault();
    if (!aadhaarInput.trim() || aadhaarInput.length < 12) {
      alert("Please enter a valid 12-digit Aadhaar number");
      return;
    }
    verifyUserAadhaar(aadhaarInput);
    setAadhaarVerifiedLocally(true);
    setIsAadhaarModalOpen(false);
    // Proceed directly to mandatory Video Call verification
    setIsVideoCallOpen(true);
  };

  // Step 3: Complete Mandatory Video Call check
  const handleCompleteVideoCall = () => {
    if (!targetJobForAction) return;
    verifyVideoCallAgreement(targetJobForAction.id, {
      name: currentUser?.name || "Verified Community Member",
      phone: currentUser?.phone || "+91 98450 12345",
      avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      aadhaarVerified: true,
    });
    setIsVideoCallOpen(false);
    alert(
      `Video Call check completed! Both parties are on board. The task is now officially in progress. Note: Payment of ₹${targetJobForAction.payout} will only be released after the task is marked completed!`
    );
  };

  // Step 4: Poster releases money ONLY after completion
  const handleReleasePayment = (jobId, payout) => {
    completeAndReleaseQuickJobPayment(jobId);
    alert(
      `Task confirmed complete! Payout of ₹${payout} released directly to the helper. Thank you for building neighborhood trust.`
    );
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!newJobForm.title.trim() || !newJobForm.payout) return;

    createQuickJob(newJobForm);
    setIsPostModalOpen(false);
    setNewJobForm({
      title: "",
      category: "Pet Care",
      payout: 250,
      duration: "45 mins",
      timeSlot: "Today, Evening",
      location: currentUser?.address || "Indiranagar Society Compound",
      description: "",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner: Clean, Sleek, Explaining Quick Micro-Jobs */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 sm:p-7 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold mb-2.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>NEIGHBORHOOD MICRO-TASKS</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Quick Everyday Gigs & Small Tasks
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            Need someone to walk your pet, join you for a game of badminton, or water your plants? Anyone in your society can help and make quick pocket money—no professional skills or labour required.
          </p>

          {/* 3 Mandatory Safety Rules Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-[11px]">1. Mandatory Aadhaar e-KYC</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl">
              <Video className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="font-semibold text-[11px]">2. 1-on-1 Video Call Check</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-[11px]">3. Payment AFTER Completion</span>
            </div>
          </div>
        </div>

        {/* Post Quick Job Button */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Quick Micro-Job</span>
          </button>
        </div>
      </div>

      {/* Categories & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                filterCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dog walk, companion..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* Grid of Quick Micro-Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => {
          const isOpen = job.status === "Open";
          const isInProgress = job.status === "In Progress";
          const isCompleted = job.status === "Completed";

          return (
            <div
              key={job.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header: Category & Payout */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {job.category}
                  </span>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Pay Upon Finish</span>
                    <span className="font-mono font-black text-slate-900 text-base text-emerald-700">
                      ₹{job.payout}
                    </span>
                  </div>
                </div>

                {/* Job Title */}
                <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {job.title}
                </h3>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {job.description}
                </p>

                {/* Metadata details */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {job.duration} • {job.timeSlot}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                </div>

                {/* Poster Info */}
                <div className="mt-3 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <img
                      src={job.postedByAvatar}
                      alt={job.postedBy}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 leading-tight">{job.postedBy}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{job.phone}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      isOpen
                        ? "bg-emerald-100 text-emerald-800"
                        : isInProgress
                        ? "bg-blue-100 text-blue-800 animate-pulse"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    ● {job.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-2 border-t border-slate-100">
                {isOpen && (
                  <button
                    onClick={() => handleStartApplication(job)}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>I Can Do This (Verify Aadhaar & Video Call)</span>
                  </button>
                )}

                {isInProgress && (
                  <div className="space-y-2">
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Video className="w-4 h-4 text-blue-600" />
                        Video Call Verified ✓ Task In Progress
                      </span>
                      <span className="text-[10px] text-blue-800 font-mono">Payment Locked in Escrow</span>
                    </div>

                    <button
                      onClick={() => handleReleasePayment(job.id, job.payout)}
                      className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Job Complete: Release ₹{job.payout} Payout</span>
                    </button>
                  </div>
                )}

                {isCompleted && (
                  <div className="py-2 text-center text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Task Complete & ₹{job.payout} Paid Directly ✓</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: MANDATORY AADHAAR VERIFICATION                                   */}
      {/* ========================================================================= */}
      {isAadhaarModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Mandatory Aadhaar Verification</h3>
                  <p className="text-[10px] text-slate-500">Government UIDAI e-KYC for neighborhood safety</p>
                </div>
              </div>
              <button
                onClick={() => setIsAadhaarModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Why is Aadhaar required?</strong> Quick jobs involve entering someone's home, walking pets, or companion tasks. For community safety, all helpers must verify their identity before connecting.
            </div>

            <form onSubmit={handleAadhaarVerify} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  12-Digit Aadhaar Number *
                </label>
                <input
                  type="text"
                  required
                  maxLength={14}
                  value={aadhaarInput}
                  onChange={(e) => setAadhaarInput(e.target.value)}
                  placeholder="e.g. 5482 9102 3841"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono font-bold"
                />
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={() => setOtpSent(true)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Send OTP to Registered Mobile
                </button>
              ) : (
                <div className="space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Enter 4-digit Demo OTP</span>
                    <span className="font-mono font-bold text-emerald-700">Code: 1234</span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={aadhaarOtp}
                    onChange={(e) => setAadhaarOtp(e.target.value)}
                    placeholder="1234"
                    className="w-full px-3 py-2 text-center text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono font-black tracking-widest"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer"
                  >
                    Confirm Aadhaar e-KYC & Proceed to Video Call
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MANDATORY 1-ON-1 VIDEO CALL CHECK BEFORE STARTING                 */}
      {/* ========================================================================= */}
      {isVideoCallOpen && targetJobForAction && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-[520px]">
            
            {/* Top Bar */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <div>
                  <h4 className="text-xs font-extrabold text-white">
                    Mandatory Mutual Video Check
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Connecting with {targetJobForAction.postedBy}
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded-lg text-emerald-300">
                Encrypted Peer-to-Peer
              </span>
            </div>

            {/* Video Screens View */}
            <div className="flex-1 bg-black p-3 relative flex flex-col justify-between">
              
              {/* Remote party simulated video stream */}
              <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-800 relative flex items-center justify-center">
                <img
                  src={targetJobForAction.postedByAvatar}
                  alt={targetJobForAction.postedBy}
                  className="w-full h-full object-cover opacity-85"
                />
                
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{targetJobForAction.postedBy} (Poster)</span>
                </div>

                {/* Local user self preview (Picture-in-Picture) */}
                <div className="absolute bottom-3 right-3 w-28 h-36 rounded-xl overflow-hidden border-2 border-emerald-400 shadow-xl bg-slate-900 flex items-center justify-center">
                  {!isVideoOff ? (
                    <img
                      src={
                        currentUser?.avatar ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                      }
                      alt="You"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2 text-slate-400 text-[10px]">
                      <CameraOff className="w-4 h-4 mx-auto mb-1" />
                      Camera Off
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-black/60 px-1 rounded text-white">
                    You (Aadhaar ✓)
                  </span>
                </div>
              </div>

              {/* Floating mutual agreement trust badge */}
              <div className="absolute bottom-6 left-6 right-36 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-white/10 text-[11px] text-slate-300">
                <p className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Identity & Safety Confirmed
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Task: {targetJobForAction.title} (₹{targetJobForAction.payout} pay upon finish)
                </p>
              </div>
            </div>

            {/* Video Call Controls Bar */}
            <div className="p-3 bg-slate-950 flex items-center justify-between border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isMuted ? "bg-red-600 text-white" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isVideoOff ? "bg-red-600 text-white" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {isVideoOff ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsVideoCallOpen(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCompleteVideoCall}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Both Parties on Board (Start Task)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: POST A QUICK MICRO-JOB                                           */}
      {/* ========================================================================= */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Post a Quick Micro-Job</h3>
                <p className="text-xs text-slate-500">Ask your verified neighbors for simple tasks</p>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  What task do you need done? *
                </label>
                <input
                  type="text"
                  required
                  value={newJobForm.title}
                  onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                  placeholder="e.g. Walk my friendly Labrador, Play Chess for 1 hr"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newJobForm.category}
                    onChange={(e) => setNewJobForm({ ...newJobForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                  >
                    <option value="Pet Care">Pet Care</option>
                    <option value="Companionship & Sports">Companionship & Sports</option>
                    <option value="Plant Care">Plant Care</option>
                    <option value="Light Help">Light Help</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reward (₹ upon finish) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={newJobForm.payout}
                    onChange={(e) => setNewJobForm({ ...newJobForm, payout: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newJobForm.duration}
                    onChange={(e) => setNewJobForm({ ...newJobForm, duration: e.target.value })}
                    placeholder="e.g. 45 mins"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newJobForm.timeSlot}
                    onChange={(e) => setNewJobForm({ ...newJobForm, timeSlot: e.target.value })}
                    placeholder="e.g. Today, 6:30 PM"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Apartment
                </label>
                <input
                  type="text"
                  value={newJobForm.location}
                  onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                  placeholder="e.g. Indiranagar, Shanti Vihar Tower 3"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Task Details & Instructions
                </label>
                <textarea
                  rows={2}
                  value={newJobForm.description}
                  onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
                  placeholder="Provide simple instructions (e.g. Friendly dog, leash provided at gate)."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              {/* Note on Post-Completion Payment Rule */}
              <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>
                  <strong>Safety Rule:</strong> Helper will undergo Aadhaar & Video Call verification. Payment is released only after you mark the task complete.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer"
                >
                  Publish Quick Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
