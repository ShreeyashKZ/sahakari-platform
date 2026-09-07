import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  User,
  Briefcase,
  Repeat,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  PlayCircle,
  Lock,
  Mail,
  Phone,
  MapPin,
  Camera,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  HelpCircle,
  Info,
  X,
  FileText,
  Clock,
  ThumbsUp,
  Award
} from "lucide-react";

export const AuthGatewayModal = ({ isOpen, onClose, defaultRole = "customer" }) => {
  const {
    loginUser,
    registerUser,
    services,
    setIsAuthOpen,
    currentUser,
  } = useApp();

  // Active role selected in Auth portal: 'customer' | 'worker' | 'skill_swap'
  const [selectedRole, setSelectedRole] = useState(defaultRole);

  // 'login' | 'signup'
  const [authMode, setAuthMode] = useState("login");

  // Show / Hide password
  const [showPassword, setShowPassword] = useState(false);

  // General Form States
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // User Signup State
  const [userFormData, setUserFormData] = useState({
    name: "",
    identifier: "", // Email or Mobile
    password: "",
    address: "",
    rememberMe: true,
  });

  // Worker Long Signup State
  const [workerStep, setWorkerStep] = useState(1); // Step 1: Personal & Contact | Step 2: Trade & Craft | Step 3: Identity, Photo & e-Shram
  const [workerFormData, setWorkerFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    trade: "plumber",
    experienceYears: 4,
    hourlyRate: 350,
    bio: "",
    aadhaar: "",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80",
    hasEshram: null, // null | true | false
    eshramNumber: "",
    acknowledgedNoEshram: false,
    rememberMe: true,
  });

  // Skill Swap Participant State
  const [skillSwapFormData, setSkillSwapFormData] = useState({
    name: "",
    identifier: "",
    password: "",
    offeredSkill: "",
    neededSkill: "",
    address: "",
    rememberMe: true,
  });

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  // Clear messages when changing tabs
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleModeChange = (mode) => {
    setAuthMode(mode);
    setErrorMessage("");
    setSuccessMessage("");
  };

  // 1. Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage("Please enter your email or mobile number and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginUser({
        identifier: loginIdentifier.trim(),
        password: loginPassword.trim(),
        role: selectedRole,
        rememberMe,
      });
      setSuccessMessage(res.message || "Login successful! Welcome back.");
      setTimeout(() => {
        setIsAuthOpen(false);
        if (onClose) onClose();
      }, 600);
    } catch (err) {
      setErrorMessage(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Submit User (Customer) Sign Up
  const handleUserSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!userFormData.name.trim() || !userFormData.identifier.trim() || !userFormData.password.trim()) {
      setErrorMessage("Please provide your full name, email or phone, and password.");
      return;
    }

    const isEmail = userFormData.identifier.includes("@");
    const payload = {
      name: userFormData.name.trim(),
      email: isEmail ? userFormData.identifier.trim() : "",
      phone: !isEmail ? userFormData.identifier.trim() : "",
      password: userFormData.password,
      address: userFormData.address.trim(),
      role: "customer",
      rememberMe: userFormData.rememberMe,
    };

    setIsSubmitting(true);
    try {
      await registerUser(payload);
      setSuccessMessage("Account created successfully! Welcome to Sahakari.");
      setTimeout(() => {
        setIsAuthOpen(false);
        if (onClose) onClose();
      }, 600);
    } catch (err) {
      setErrorMessage(err.message || "Registration failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Submit Worker Sign Up
  const handleWorkerSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!workerFormData.name.trim() || !workerFormData.phone.trim() || !workerFormData.password.trim()) {
      setErrorMessage("Name, Mobile phone, and password are required.");
      return;
    }

    if (workerFormData.hasEshram === true && (!workerFormData.eshramNumber || workerFormData.eshramNumber.trim().length < 8)) {
      setErrorMessage("Please enter a valid 12-digit e-Shram UAN number, or choose 'No' to proceed with advice.");
      return;
    }

    const payload = {
      name: workerFormData.name.trim(),
      phone: workerFormData.phone.trim(),
      email: workerFormData.email.trim(),
      password: workerFormData.password,
      address: workerFormData.address.trim(),
      trade: workerFormData.trade,
      experienceYears: Number(workerFormData.experienceYears) || 2,
      hourlyRate: Number(workerFormData.hourlyRate) || 350,
      bio: workerFormData.bio.trim(),
      aadhaar: workerFormData.aadhaar.trim(),
      avatar: workerFormData.avatar,
      hasEshram: workerFormData.hasEshram === true,
      eshramNumber: workerFormData.hasEshram === true ? workerFormData.eshramNumber.trim() : "",
      role: "worker",
      rememberMe: workerFormData.rememberMe,
    };

    setIsSubmitting(true);
    try {
      await registerUser(payload);
      setSuccessMessage(
        workerFormData.hasEshram === true
          ? "Co-op Worker registered with e-Shram Verified Badge! 🎉"
          : "Worker registered! You can add your e-Shram card anytime for the verified tag."
      );
      setTimeout(() => {
        setIsAuthOpen(false);
        if (onClose) onClose();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || "Worker registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Submit Skill Swap Participant Sign Up
  const handleSkillSwapSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!skillSwapFormData.name.trim() || !skillSwapFormData.identifier.trim() || !skillSwapFormData.password.trim()) {
      setErrorMessage("Name, contact info, and password are required.");
      return;
    }

    if (!skillSwapFormData.offeredSkill.trim() || !skillSwapFormData.neededSkill.trim()) {
      setErrorMessage("Please list at least one skill you can offer and one you need.");
      return;
    }

    const isEmail = skillSwapFormData.identifier.includes("@");
    const payload = {
      name: skillSwapFormData.name.trim(),
      email: isEmail ? skillSwapFormData.identifier.trim() : "",
      phone: !isEmail ? skillSwapFormData.identifier.trim() : "",
      password: skillSwapFormData.password,
      offeredSkill: skillSwapFormData.offeredSkill.trim(),
      neededSkill: skillSwapFormData.neededSkill.trim(),
      address: skillSwapFormData.address.trim(),
      role: "skill_swap",
      rememberMe: skillSwapFormData.rememberMe,
    };

    setIsSubmitting(true);
    try {
      await registerUser(payload);
      setSuccessMessage("Welcome to the Sahakari Skill Swap Beta! 🔄");
      setTimeout(() => {
        setIsAuthOpen(false);
        if (onClose) onClose();
      }, 600);
    } catch (err) {
      setErrorMessage(err.message || "Skill Swap registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-fill demo accounts for 1-click evaluation
  const fillDemoAccount = (type) => {
    setAuthMode("login");
    if (type === "customer") {
      setSelectedRole("customer");
      setLoginIdentifier("vikram@example.com");
      setLoginPassword("password123");
    } else if (type === "worker") {
      setSelectedRole("worker");
      setLoginIdentifier("9876543210");
      setLoginPassword("worker123");
    } else if (type === "skill_swap") {
      setSelectedRole("skill_swap");
      setLoginIdentifier("ananya@example.com");
      setLoginPassword("swap123");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header & Branding */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white p-6 relative">
          {currentUser && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner">
              सह
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight">Sahakari Gateway</h2>
                <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-full tracking-wider">
                  Co-op Network
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                0% Commission Gig Collective & Community Skill Barter
              </p>
            </div>
          </div>

          {/* 3 Role Choosers */}
          <div className="grid grid-cols-3 gap-2 mt-5 bg-black/20 p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => handleRoleChange("customer")}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                selectedRole === "customer"
                  ? "bg-white text-emerald-800 shadow-md scale-[1.02]"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("worker")}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                selectedRole === "worker"
                  ? "bg-white text-emerald-800 shadow-md scale-[1.02]"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Co-op Worker</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("skill_swap")}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                selectedRole === "skill_swap"
                  ? "bg-white text-emerald-800 shadow-md scale-[1.02]"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Skill Swap <span className="hidden sm:inline text-[10px] text-amber-500 font-extrabold">(Beta)</span></span>
            </button>
          </div>
        </div>

        {/* Sub-Header: Sign In / Sign Up Selector */}
        <div className="border-b border-slate-100 px-6 pt-4 pb-2 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className={`text-xs font-extrabold pb-2 border-b-2 transition ${
                authMode === "login"
                  ? "border-emerald-600 text-emerald-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In to Existing Account
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("signup")}
              className={`text-xs font-extrabold pb-2 border-b-2 transition ${
                authMode === "signup"
                  ? "border-emerald-600 text-emerald-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {selectedRole === "worker" ? "New Worker Onboarding" : "Create New Account"}
            </button>
          </div>

          {/* Quick Demo Pre-fill for hackathon evaluators */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Fast Demo:</span>
            <button
              type="button"
              onClick={() => fillDemoAccount(selectedRole)}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Notifications */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* 1. LOGIN MODE (Common for User, Worker, Skill Swap)      */}
          {/* ======================================================== */}
          {authMode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gmail / Email ID or 10-digit Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === "worker"
                        ? "e.g. 9876543210 or imran@example.com"
                        : "e.g. vikram@example.com or 9845012345"
                    }
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Demo Pass: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">password123</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">worker123</code>
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-600">
                    Remember me on this device
                  </span>
                </label>
                <span className="text-[11px] text-emerald-700 hover:underline cursor-pointer font-medium">
                  Instant login next time
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In as {selectedRole === "customer" ? "Customer" : selectedRole === "worker" ? "Worker" : "Skill Swapper"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Instant 1-Click Demo Profiles Bar */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2 text-center">
                  Quick Hackathon 1-Click Sign In:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount("customer")}
                    className="p-2 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/50 text-left transition flex items-center gap-2"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      V
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900">Vikram M.</p>
                      <p className="text-[10px] text-slate-500">Household User</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoAccount("worker")}
                    className="p-2 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/50 text-left transition flex items-center gap-2"
                  >
                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                      I
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                        Imran K. <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      </p>
                      <p className="text-[10px] text-slate-500">e-Shram Plumber</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoAccount("skill_swap")}
                    className="p-2 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/50 text-left transition flex items-center gap-2"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      A
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900">Ananya S.</p>
                      <p className="text-[10px] text-slate-500">Skill Swap Beta</p>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* 2. USER SIGN UP (Customer)                               */}
          {/* ======================================================== */}
          {authMode === "signup" && selectedRole === "customer" && (
            <form onSubmit={handleUserSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gmail / Email ID or 10-Digit Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  value={userFormData.identifier}
                  onChange={(e) => setUserFormData({ ...userFormData, identifier: e.target.value })}
                  placeholder="e.g. vikram@example.com or 9845012345"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Set Password *
                </label>
                <input
                  type="password"
                  required
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  placeholder="Create a secure password"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Apartment / Society / Address (Optional)
                </label>
                <input
                  type="text"
                  value={userFormData.address}
                  onChange={(e) => setUserFormData({ ...userFormData, address: e.target.value })}
                  placeholder="e.g. Flat 402, Shanti Vihar Society, Indiranagar"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="userRemember"
                  checked={userFormData.rememberMe}
                  onChange={(e) => setUserFormData({ ...userFormData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="userRemember" className="text-xs font-semibold text-slate-600 cursor-pointer">
                  Remember me (stores login in database & local device)
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                <span>Complete Customer Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* 3. WORKER ONBOARDING (Detailed Long Sign-Up Page)         */}
          {/* ======================================================== */}
          {authMode === "signup" && selectedRole === "worker" && (
            <form onSubmit={handleWorkerSignup} className="space-y-4">
              
              {/* Step indicator */}
              <div className="flex items-center justify-between bg-slate-100/80 p-2 rounded-xl text-xs font-bold text-slate-600 mb-3">
                <button
                  type="button"
                  onClick={() => setWorkerStep(1)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                    workerStep === 1 ? "bg-white text-emerald-800 shadow-xs" : "opacity-70"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Contact</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkerStep(2)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                    workerStep === 2 ? "bg-white text-emerald-800 shadow-xs" : "opacity-70"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Trade & Skills</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkerStep(3)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                    workerStep === 3 ? "bg-white text-emerald-800 shadow-xs" : "opacity-70"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Aadhaar & e-Shram</span>
                </button>
              </div>

              {/* STEP 1: Basic & Contact Details */}
              {workerStep === 1 && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={workerFormData.name}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, name: e.target.value })}
                        placeholder="e.g. Imran Khan"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Number (+91) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={workerFormData.phone}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email ID (Optional, if any)
                      </label>
                      <input
                        type="email"
                        value={workerFormData.email}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, email: e.target.value })}
                        placeholder="e.g. worker@example.com"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password (for logging in later) *
                      </label>
                      <input
                        type="password"
                        required
                        value={workerFormData.password}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, password: e.target.value })}
                        placeholder="Create your login password"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Residential Address / Operating Neighborhood *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={workerFormData.address}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, address: e.target.value })}
                        placeholder="e.g. 14/B, CMH Road, Indiranagar, Bengaluru"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setWorkerStep(2)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Next: Trade & Skills</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Trade & Craft */}
              {workerStep === 2 && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Trade / Service Category *
                    </label>
                    <select
                      value={workerFormData.trade}
                      onChange={(e) => setWorkerFormData({ ...workerFormData, trade: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (Starting ₹{s.basePrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        value={workerFormData.experienceYears}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, experienceYears: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Expected Base Rate (₹ / hr)
                      </label>
                      <input
                        type="number"
                        step="50"
                        value={workerFormData.hourlyRate}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, hourlyRate: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Brief Bio / Specializations
                    </label>
                    <textarea
                      rows={2}
                      value={workerFormData.bio}
                      onChange={(e) => setWorkerFormData({ ...workerFormData, bio: e.target.value })}
                      placeholder="e.g. Expert in domestic tap fitting, drainage unclogging, geyser servicing."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setWorkerStep(1)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorkerStep(3)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Next: Aadhaar & e-Shram Check</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Aadhaar, Photo & e-Shram Government Verification */}
              {workerStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  {/* Photo & Aadhaar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Aadhaar Number (e-KYC verification) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={14}
                        value={workerFormData.aadhaar}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, aadhaar: e.target.value })}
                        placeholder="XXXX-XXXX-1234"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Masked & encrypted for cooperative privacy.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Profile Photo / Picture *
                      </label>
                      <div className="flex items-center gap-2">
                        <img
                          src={workerFormData.avatar}
                          alt="Profile"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const avatars = [
                              "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80",
                              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
                            ];
                            const next = avatars[(avatars.indexOf(workerFormData.avatar) + 1) % avatars.length];
                            setWorkerFormData({ ...workerFormData, avatar: next });
                          }}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-50 flex items-center gap-1"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Change / Cycle Photo</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ==================================================== */}
                  {/* CRITICAL FEATURE: e-SHRAM ID CHECK & ADVICE SECTION  */}
                  {/* ==================================================== */}
                  <div className="border-2 border-emerald-200 bg-emerald-50/40 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">
                          Government e-Shram Registration Status
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Ministry of Labour & Employment Unorganised Workers Registry
                        </p>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-slate-800 mt-2 mb-2">
                      Do you have a registered Government e-Shram Card / 12-digit UAN?
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setWorkerFormData({ ...workerFormData, hasEshram: true, acknowledgedNoEshram: false })}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                          workerFormData.hasEshram === true
                            ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <div>
                          <span className="text-xs font-extrabold block">Yes, I have it</span>
                          <span className="text-[10px] opacity-85">Get Verified Tag</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWorkerFormData({ ...workerFormData, hasEshram: false, eshramNumber: "" })}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                          workerFormData.hasEshram === false
                            ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:border-amber-300"
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <div>
                          <span className="text-xs font-extrabold block">No, I don't have it</span>
                          <span className="text-[10px] opacity-85">View Help & Steps</span>
                        </div>
                      </button>
                    </div>

                    {/* IF YES: ENTER 12-DIGIT UAN */}
                    {workerFormData.hasEshram === true && (
                      <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-2 animate-in fade-in">
                        <label className="block text-xs font-bold text-slate-800">
                          Enter your 12-Digit e-Shram UAN (Universal Account Number) *
                        </label>
                        <input
                          type="text"
                          required
                          value={workerFormData.eshramNumber}
                          onChange={(e) => setWorkerFormData({ ...workerFormData, eshramNumber: e.target.value })}
                          placeholder="e.g. 1298 4402 9183"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono font-bold"
                        />
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>Verified Tag Preview:</strong> Your profile will proudly display the <strong>"🛡️ e-Shram Verified"</strong> badge beside your name!
                          </span>
                        </div>
                      </div>
                    )}

                    {/* IF NO: STRONGLY ADVISE TO MAKE ONE WITH TIPS, STEPS & VIDEO LINK */}
                    {workerFormData.hasEshram === false && (
                      <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-2xl space-y-3 animate-in fade-in text-slate-800">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <h5 className="text-xs font-extrabold text-amber-900">
                              ⚠️ We Strongly Advise You to Make an e-Shram Card!
                            </h5>
                            <p className="text-[11px] text-amber-800 mt-0.5">
                              The Government of India provides crucial life-changing benefits to registered gig & unorganised workers:
                            </p>
                          </div>
                        </div>

                        {/* e-Shram Benefits Checklist */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-semibold text-slate-700 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                          <div className="flex items-center gap-1.5 text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>₹2,00,000 Accidental Insurance (PMSBY)</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>100% Free & takes only 5 mins</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Government Pension & Welfare Access</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Higher Booking Trust from Residents</span>
                          </div>
                        </div>

                        {/* 3 Quick Steps */}
                        <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-[11px] space-y-1">
                          <p className="font-bold text-slate-900">3 Easy Steps to Make Your e-Shram Card Online:</p>
                          <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
                            <li>Keep your <strong>Aadhaar Card</strong> & <strong>Aadhaar-linked Mobile Number</strong> ready.</li>
                            <li>Go to the official portal <strong>eshram.gov.in</strong> and click <em>"Register on e-Shram"</em>.</li>
                            <li>Enter Aadhaar OTP, select your trade ({workerFormData.trade}), and instantly download your UAN card.</li>
                          </ol>
                        </div>

                        {/* Helpful External Links */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <a
                            href="https://eshram.gov.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                          >
                            <span>Open Official Portal (eshram.gov.in)</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href="https://www.youtube.com/results?search_query=how+to+register+eshram+card+online+step+by+step"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Watch 3-Min YouTube Video Guide</span>
                          </a>
                        </div>

                        {/* Proceed without e-Shram acknowledgement */}
                        <div className="mt-2 pt-2 border-t border-amber-200 flex items-start gap-2">
                          <input
                            type="checkbox"
                            id="ackNoEshram"
                            checked={workerFormData.acknowledgedNoEshram}
                            onChange={(e) => setWorkerFormData({ ...workerFormData, acknowledgedNoEshram: e.target.checked })}
                            className="w-4 h-4 rounded text-amber-600 border-amber-300 focus:ring-amber-500 mt-0.5"
                          />
                          <label htmlFor="ackNoEshram" className="text-[11px] text-slate-700 cursor-pointer font-medium leading-snug">
                            I understand that I can register and work now, but my profile will <strong>NOT have the "e-Shram Verified" tag</strong> until I register and enter my UAN card number.
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit buttons */}
                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setWorkerStep(2)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || (workerFormData.hasEshram === false && !workerFormData.acknowledgedNoEshram)}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Registering Worker...</span>
                      ) : (
                        <>
                          <span>Complete Worker Onboarding</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* ======================================================== */}
          {/* 4. SKILL SWAP PARTICIPANT SIGN UP (Beta)                  */}
          {/* ======================================================== */}
          {authMode === "signup" && selectedRole === "skill_swap" && (
            <form onSubmit={handleSkillSwapSignup} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold">Skill Swap & Community TimeBank (Beta)</p>
                  <p className="text-[11px] text-amber-800">
                    Barter and exchange neighborhood skills 1-for-1 without cash. Teach what you know, learn what you need!
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={skillSwapFormData.name}
                  onChange={(e) => setSkillSwapFormData({ ...skillSwapFormData, name: e.target.value })}
                  placeholder="e.g. Ananya Sen"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email / Gmail ID or Mobile *
                  </label>
                  <input
                    type="text"
                    required
                    value={skillSwapFormData.identifier}
                    onChange={(e) => setSkillSwapFormData({ ...skillSwapFormData, identifier: e.target.value })}
                    placeholder="e.g. ananya@example.com"
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={skillSwapFormData.password}
                    onChange={(e) => setSkillSwapFormData({ ...skillSwapFormData, password: e.target.value })}
                    placeholder="Create password"
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    What Skill(s) Can You Offer to the Community? *
                  </label>
                  <input
                    type="text"
                    required
                    value={skillSwapFormData.offeredSkill}
                    onChange={(e) => setSkillSwapFormData({ ...skillSwapFormData, offeredSkill: e.target.value })}
                    placeholder="e.g. Spoken English, Acoustic Guitar, Python Coding, Organic Baking"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    What Skill(s) or Help Do You Need in Return? *
                  </label>
                  <input
                    type="text"
                    required
                    value={skillSwapFormData.neededSkill}
                    onChange={(e) => setSkillSwapFormData({ ...skillSwapFormData, neededSkill: e.target.value })}
                    placeholder="e.g. Balcony Gardening, Bicycle Repairs, Carpentry Basics"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Neighborhood / Society Location
                </label>
                <input
                  type="text"
                  value={skillSwapFormData.address}
                  onChange={(e) => setSkillSwapFormData({ ...skillSwapFormData, address: e.target.value })}
                  placeholder="e.g. Green Glen Layout, Bellandur, Bengaluru"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                <span>Join Skill Swap Collective (Free 3 Hours Barter Credit)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Footer info & Guest bypass option */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>MongoDB Encrypted • 100% Cooperative Privacy</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsAuthOpen(false);
              if (onClose) onClose();
            }}
            className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 hover:underline cursor-pointer"
          >
            Skip / Explore Platform as Guest →
          </button>
        </div>
      </div>
    </div>
  );
};
