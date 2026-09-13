import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  User,
  Briefcase,
  Repeat,
  Building2,
  Copy,
  Share2,
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
  Award,
  Key
} from "lucide-react";

export const AuthGatewayModal = ({ isOpen, onClose, defaultRole = "customer" }) => {
  const {
    loginUser,
    registerUser,
    services,
    setIsAuthOpen,
    currentUser,
    loginAsMaster,
    registerHousingSociety,
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
                Zero-Profit Gig Collective • 100% Labour Retained by Worker
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
                    className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-bold border border-slate-300 transition flex items-center gap-1.5 h-11"
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
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm h-11"
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
                    className="text-xs font-bold text-emerald-700 hover:underline"
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
