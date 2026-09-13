import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  User,
  Briefcase,
  Building2,
  Copy,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  PlayCircle,
  Lock,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  HelpCircle,
  Info,
  X,
  FileText,
  Clock,
  Award,
  Key,
  Wrench,
  ChevronRight
} from "lucide-react";

export const AuthGatewayModal = ({ isOpen, onClose, defaultRole = "customer" }) => {
  const {
    loginUser,
    registerUser,
    services,
    setIsAuthOpen,
    currentUser,
    registerHousingSociety,
  } = useApp();

  // Active role selected: 'customer' | 'worker' | 'rwa'
  const [selectedRole, setSelectedRole] = useState(
    defaultRole === "admin" ? "rwa" : (defaultRole === "skill_swap" ? "customer" : defaultRole)
  );

  // 'login' | 'signup'
  const [authMode, setAuthMode] = useState("login");

  // Show / Hide password
  const [showPassword, setShowPassword] = useState(false);

  // General Login State
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Customer Signup State
  const [userFormData, setUserFormData] = useState({
    name: "",
    identifier: "", // Email or Mobile
    password: "",
    address: "",
    rememberMe: true,
  });

  // Worker Signup State
  const [workerStep, setWorkerStep] = useState(1);
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

  // Housing Society / RWA Registration State
  const [rwaFormData, setRwaFormData] = useState({
    societyName: "",
    registrationNo: "",
    cityPincode: "",
    totalFlats: "",
    secretaryName: "",
    secretaryContact: "",
    email: "",
    password: "",
  });
  const [registeredRwaResult, setRegisteredRwaResult] = useState(null);
  const [copiedRwaLink, setCopiedRwaLink] = useState(false);

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

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

  // 1. Submit Login (Customer, Worker, or RWA Admin)
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
      const targetRole = selectedRole === "rwa" ? "admin" : selectedRole;
      const res = await loginUser({
        identifier: loginIdentifier.trim(),
        password: loginPassword.trim(),
        role: targetRole,
        rememberMe,
      });
      setSuccessMessage(res.message || `Login successful! Welcome to Sahakari.`);
      setTimeout(() => {
        setIsAuthOpen(false);
        if (onClose) onClose();
      }, 500);
    } catch (err) {
      setErrorMessage(err.message || "Failed to log in. Please verify your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Submit Customer Sign Up
  const handleUserSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!userFormData.name.trim() || !userFormData.identifier.trim() || !userFormData.password.trim()) {
      setErrorMessage("Please provide your full name, email or mobile number, and password.");
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
      }, 500);
    } catch (err) {
      setErrorMessage(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Submit Worker Sign Up
  const handleWorkerSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!workerFormData.name.trim() || !workerFormData.phone.trim() || !workerFormData.password.trim()) {
      setErrorMessage("Name, Mobile number, and password are required.");
      return;
    }

    if (workerFormData.hasEshram === true && (!workerFormData.eshramNumber || workerFormData.eshramNumber.trim().length < 8)) {
      setErrorMessage("Please enter a valid 12-digit e-Shram UAN number, or select 'No' to proceed.");
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
          ? "🎉 Co-op Worker registered with e-Shram Verified Badge!"
          : "Worker registered! You can add your e-Shram card anytime for the verified tag."
      );
      setTimeout(() => {
        setIsAuthOpen(false);
        if (onClose) onClose();
      }, 600);
    } catch (err) {
      setErrorMessage(err.message || "Worker registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Submit Housing Society / RWA Registration
  const handleRwaSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!rwaFormData.societyName.trim() || !rwaFormData.registrationNo.trim() || !rwaFormData.secretaryContact.trim()) {
      setErrorMessage("Society Name, RWA registration number, and secretary contact are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newSoc = registerHousingSociety({
        name: rwaFormData.societyName.trim(),
        registrationNo: rwaFormData.registrationNo.trim(),
        city: rwaFormData.cityPincode.trim() || "Bengaluru",
        totalFlats: Number(rwaFormData.totalFlats) || 120,
        secretaryName: rwaFormData.secretaryName.trim() || "RWA Manager",
        secretaryContact: rwaFormData.secretaryContact.trim(),
      });

      const payload = {
        name: rwaFormData.secretaryName.trim() || rwaFormData.societyName.trim(),
        email: rwaFormData.email.trim() || `admin@${newSoc.slug}.org`,
        phone: rwaFormData.secretaryContact.trim(),
        password: rwaFormData.password || "admin123",
        role: "admin",
        address: `${rwaFormData.societyName}, ${rwaFormData.cityPincode}`,
      };
      await registerUser(payload);
      setRegisteredRwaResult(newSoc);
      setSuccessMessage("Housing Society Registered Successfully! 🏢");
    } catch (err) {
      setErrorMessage(err.message || "RWA registration failed.");
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
    } else if (type === "rwa") {
      setSelectedRole("rwa");
      setLoginIdentifier("secretary@shantivihar.in");
      setLoginPassword("admin123");
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
              className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer"
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
                Zero-Profit Operating Model • 100% Labour Retained by Worker
              </p>
            </div>
          </div>

          {/* 3 Role Choosers: Customer | Co-op Worker | Housing Society / RWA */}
          <div className="grid grid-cols-3 gap-2 mt-5 bg-black/20 p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => handleRoleChange("customer")}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
              onClick={() => handleRoleChange("rwa")}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === "rwa"
                  ? "bg-white text-emerald-800 shadow-md scale-[1.02]"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Housing Society / RWA</span>
            </button>
          </div>
        </div>

        {/* Sub-Header: Sign In / Create New Account Selector */}
        <div className="border-b border-slate-100 px-6 pt-4 pb-2 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className={`text-xs font-extrabold pb-2 border-b-2 transition cursor-pointer ${
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
              className={`text-xs font-extrabold pb-2 border-b-2 transition cursor-pointer ${
                authMode === "signup"
                  ? "border-emerald-600 text-emerald-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {selectedRole === "worker"
                ? "New Worker Onboarding"
                : selectedRole === "rwa"
                ? "Register Housing Society"
                : "Create New Account"}
            </button>
          </div>

          {/* Quick Demo Pre-fill */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Fast Demo:</span>
            <button
              type="button"
              onClick={() => fillDemoAccount(selectedRole)}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Auto-Fill {selectedRole === "worker" ? "Worker" : selectedRole === "rwa" ? "RWA" : "Customer"}
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
          {/* 1. SIGN IN FORM (FOR ALL 3 ROLES)                        */}
          {/* ======================================================== */}
          {authMode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Logging in as: <strong>{selectedRole === "worker" ? "Co-op Worker (Technician)" : selectedRole === "rwa" ? "Housing Society / RWA Admin" : "Customer (Resident)"}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => fillDemoAccount(selectedRole)}
                  className="text-emerald-700 font-bold text-[11px] underline cursor-pointer"
                >
                  Fill Demo
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address or Mobile Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === "worker"
                        ? "e.g. 9876543210 (Ramesh Kumar)"
                        : selectedRole === "rwa"
                        ? "e.g. secretary@shantivihar.in"
                        : "e.g. vikram@example.com or 9845012345"
                    }
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Password *
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">Demo: password123 / worker123</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Remember me on this browser</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleModeChange("signup")}
                  className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  New user? Register here →
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer h-11"
              >
                <Key className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "Authenticating..."
                    : `Sign In as ${selectedRole === "worker" ? "Co-op Worker" : selectedRole === "rwa" ? "Society Admin" : "Customer"}`}
                </span>
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* 2. CUSTOMER SIGN UP FORM                                 */}
          {/* ======================================================== */}
          {authMode === "signup" && selectedRole === "customer" && (
            <form onSubmit={handleUserSignup} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-950 flex items-start gap-2">
                <User className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold">Create Customer Account</p>
                  <p className="text-[11px] text-emerald-800">
                    Direct access to zero-profit verified local cooperative services with doorstep escrow protection.
                  </p>
                </div>
              </div>

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
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address or Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  value={userFormData.identifier}
                  onChange={(e) => setUserFormData({ ...userFormData, identifier: e.target.value })}
                  placeholder="e.g. vikram@example.com or +91 98450 12345"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Home / Society Address
                </label>
                <input
                  type="text"
                  value={userFormData.address}
                  onChange={(e) => setUserFormData({ ...userFormData, address: e.target.value })}
                  placeholder="e.g. Flat 402, Shanti Vihar Apartments, Bengaluru"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={userFormData.rememberMe}
                    onChange={(e) => setUserFormData({ ...userFormData, rememberMe: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Remember me on this device</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleModeChange("login")}
                  className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Already have an account? Sign in →
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer h-11"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? "Creating Account..." : "Create Free Customer Account"}</span>
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* 3. CO-OP WORKER ONBOARDING                               */}
          {/* ======================================================== */}
          {authMode === "signup" && selectedRole === "worker" && (
            <form onSubmit={handleWorkerSignup} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-xs text-emerald-950 flex items-start gap-2">
                <Briefcase className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold">Cooperative Worker Member Registration</p>
                  <p className="text-[11px] text-emerald-800">
                    Keep 100% of your labor payout. Zero commission deducted. Democratic cooperative ownership.
                  </p>
                </div>
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded-xl text-xs font-bold text-slate-600">
                <span className={workerStep === 1 ? "text-emerald-700" : ""}>1. Personal & Contact</span>
                <span>•</span>
                <span className={workerStep === 2 ? "text-emerald-700" : ""}>2. Trade & Rates</span>
                <span>•</span>
                <span className={workerStep === 3 ? "text-emerald-700" : ""}>3. e-Shram & Verification</span>
              </div>

              {/* Worker Step 1: Personal Info */}
              {workerStep === 1 && (
                <div className="space-y-3">
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
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={workerFormData.phone}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={workerFormData.email}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, email: e.target.value })}
                        placeholder="e.g. ramesh@gmail.com"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Create Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={workerFormData.password}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, password: e.target.value })}
                        placeholder="Create worker account password"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Current Work Area / Locality *
                    </label>
                    <input
                      type="text"
                      value={workerFormData.address}
                      onChange={(e) => setWorkerFormData({ ...workerFormData, address: e.target.value })}
                      placeholder="e.g. Indiranagar, East Bengaluru"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!workerFormData.name || !workerFormData.phone || !workerFormData.password) {
                        setErrorMessage("Please fill in Name, Phone, and Password before proceeding.");
                        return;
                      }
                      setErrorMessage("");
                      setWorkerStep(2);
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer h-11"
                  >
                    <span>Proceed to Trade & Rates</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Worker Step 2: Trade & Rates */}
              {workerStep === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Trade / Craft *
                    </label>
                    <select
                      value={workerFormData.trade}
                      onChange={(e) => setWorkerFormData({ ...workerFormData, trade: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (Guild standard: ₹{s.basePrice}/hr)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Years of Trade Experience *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        value={workerFormData.experienceYears}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, experienceYears: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Hourly Rate (₹) *
                      </label>
                      <input
                        type="number"
                        min="150"
                        max="2000"
                        step="50"
                        value={workerFormData.hourlyRate}
                        onChange={(e) => setWorkerFormData({ ...workerFormData, hourlyRate: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Brief Professional Bio / Specialization
                    </label>
                    <textarea
                      rows="2"
                      value={workerFormData.bio}
                      onChange={(e) => setWorkerFormData({ ...workerFormData, bio: e.target.value })}
                      placeholder="e.g. Master pipe fitter and sanitation specialist with 10+ years experience in apartment complexes."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setWorkerStep(1)}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer h-11"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorkerStep(3)}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer h-11"
                    >
                      <span>Proceed to Verification & e-Shram</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Worker Step 3: Identity & e-Shram Guidance */}
              {workerStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Aadhaar Number (Last 4 digits for masked verification)
                    </label>
                    <input
                      type="text"
                      maxLength="12"
                      value={workerFormData.aadhaar}
                      onChange={(e) => setWorkerFormData({ ...workerFormData, aadhaar: e.target.value })}
                      placeholder="e.g. 5432 or 12-digit Aadhaar"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                    />
                  </div>

                  {/* e-Shram Card Question */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Do you possess an e-Shram Card (Ministry of Labour)?
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Govt of India
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="eshram_check"
                          checked={workerFormData.hasEshram === true}
                          onChange={() => setWorkerFormData({ ...workerFormData, hasEshram: true })}
                          className="text-emerald-600"
                        />
                        <span>Yes, I have an e-Shram Card</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="eshram_check"
                          checked={workerFormData.hasEshram === false}
                          onChange={() => setWorkerFormData({ ...workerFormData, hasEshram: false })}
                          className="text-emerald-600"
                        />
                        <span>No, I do not have one yet</span>
                      </label>
                    </div>

                    {/* If YES: Enter 12-digit UAN */}
                    {workerFormData.hasEshram === true && (
                      <div className="pt-2 animate-in fade-in">
                        <label className="block text-xs font-bold text-emerald-900 mb-1">
                          12-Digit e-Shram Universal Account Number (UAN) *
                        </label>
                        <input
                          type="text"
                          required
                          value={workerFormData.eshramNumber}
                          onChange={(e) => setWorkerFormData({ ...workerFormData, eshramNumber: e.target.value })}
                          placeholder="e.g. 1000 8492 4821"
                          className="w-full px-3 py-2.5 text-xs bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                        />
                        <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Your profile will immediately receive the <strong>e-Shram Verified</strong> badge!</span>
                        </p>
                      </div>
                    )}

                    {/* If NO: Educational Advice Box with Video/Link */}
                    {workerFormData.hasEshram === false && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2 animate-in fade-in">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">We strongly recommend registering for an e-Shram Card!</p>
                            <p className="text-[11px] text-amber-800 mt-0.5">
                              e-Shram provides ₹2,00,000 accidental insurance coverage under PMSBY, official unorganized worker status, and unlocks the Verified badge on Sahakari.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-1 text-[11px] font-bold">
                          <a
                            href="https://eshram.gov.in"
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 underline flex items-center gap-1 hover:text-emerald-900"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Register Free on eshram.gov.in (5 mins)</span>
                          </a>
                          <a
                            href="https://www.youtube.com/results?search_query=how+to+make+eshram+card+online"
                            target="_blank"
                            rel="noreferrer"
                            className="text-rose-700 underline flex items-center gap-1 hover:text-rose-900"
                          >
                            <PlayCircle className="w-3 h-3" />
                            <span>Watch 3-Min Tutorial Video</span>
                          </a>
                        </div>

                        <p className="text-[10px] text-slate-500 italic pt-1 border-t border-amber-200/60">
                          Notice: You can still join right now! Your profile will show "Pending e-Shram", and you can update it at any time from your Worker Dashboard.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setWorkerStep(2)}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer h-11"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer h-11"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isSubmitting ? "Registering..." : "Complete Co-op Worker Registration"}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* ======================================================== */}
          {/* 4. HOUSING SOCIETY / RWA REGISTRATION                    */}
          {/* ======================================================== */}
          {authMode === "signup" && selectedRole === "rwa" && (
            registeredRwaResult ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-3xl space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
                  🏢
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {registeredRwaResult.name} Registered!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your unique resident onboarding invite link is ready. Share it in your society WhatsApp group!
                  </p>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-emerald-200 font-mono text-xs text-emerald-900 break-all select-all font-bold">
                  {registeredRwaResult.inviteLink}
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(registeredRwaResult.inviteLink);
                      setCopiedRwaLink(true);
                      setTimeout(() => setCopiedRwaLink(false), 2500);
                    }}
                    className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-bold border border-slate-300 transition flex items-center gap-1.5 h-11 cursor-pointer"
                  >
                    {copiedRwaLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedRwaLink ? "Link Copied!" : "Copy Invite Link"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const text = encodeURIComponent(
                        `Namaste residents! Join our official ${registeredRwaResult.name} cooperative maintenance & gig services network on Sahakari: ${registeredRwaResult.inviteLink}`
                      );
                      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm h-11 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Share on WhatsApp</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthOpen(false);
                      if (onClose) onClose();
                    }}
                    className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Enter Society Command Center →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRwaSignup} className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-xs text-emerald-950 flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold">Register Housing Society / RWA Hub</p>
                    <p className="text-[11px] text-emerald-800">
                      Connect your apartment society directly to verified local gig guilds. Get bulk maintenance discounts and generate a sharable resident invite link.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Housing Society Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={rwaFormData.societyName}
                      onChange={(e) => setRwaFormData({ ...rwaFormData, societyName: e.target.value })}
                      placeholder="e.g. Shanti Vihar Apartments"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registration / RWA Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={rwaFormData.registrationNo}
                      onChange={(e) => setRwaFormData({ ...rwaFormData, registrationNo: e.target.value })}
                      placeholder="e.g. BLR/RWA/2026/892"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City & Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={rwaFormData.cityPincode}
                      onChange={(e) => setRwaFormData({ ...rwaFormData, cityPincode: e.target.value })}
                      placeholder="e.g. Bengaluru, 560038"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Total Apartment Flats *
                    </label>
                    <input
                      type="number"
                      required
                      value={rwaFormData.totalFlats}
                      onChange={(e) => setRwaFormData({ ...rwaFormData, totalFlats: e.target.value })}
                      placeholder="e.g. 160"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Secretary / Manager Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={rwaFormData.secretaryName}
                      onChange={(e) => setRwaFormData({ ...rwaFormData, secretaryName: e.target.value })}
                      placeholder="e.g. Dr. Alok Verma"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Secretary Mobile Contact *
                    </label>
                    <input
                      type="tel"
                      required
                      value={rwaFormData.secretaryContact}
                      onChange={(e) => setRwaFormData({ ...rwaFormData, secretaryContact: e.target.value })}
                      placeholder="+91 98450 77112"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official RWA Email
                    </label>
                    <input
                      type="email"
                      value={rwaFormData.email}
                      onChange={(e) => setRwaFormData({ ...rwaFormData, email: e.target.value })}
                      placeholder="e.g. secretary@shantivihar.in"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Create Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={rwaFormData.password}
                      onChange={(e) => setRwaFormData({ ...rwaFormData, password: e.target.value })}
                      placeholder="Password for RWA Portal"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer h-11"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Register Society & Generate Resident Invite Link</span>
                </button>
              </form>
            )
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
