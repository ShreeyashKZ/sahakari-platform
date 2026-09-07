import React, { useState } from "react";
import { useApp } from "./context/AppContext";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { LandingPage } from "./pages/LandingPage";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { WorkerDashboard } from "./pages/WorkerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { SkillSwapDashboard } from "./pages/SkillSwapDashboard";
import { DemoStoryWalkthrough } from "./components/demo/DemoStoryWalkthrough";
import { BulkRequestModal } from "./components/admin/BulkRequestModal";
import { AuthGatewayModal } from "./components/auth/AuthGatewayModal";
import { MasterLiveConsoleModal } from "./components/admin/MasterLiveConsoleModal";

export function App() {
  const {
    role,
    setRole,
    isAuthOpen,
    setIsAuthOpen,
    isMasterMode,
    isMasterConsoleOpen,
    setIsMasterConsoleOpen,
  } = useApp();

  // Active top-level tab: 'dashboard' | 'bookings' | 'jobs' | 'earnings' | 'requests' | 'landing'
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sub-tabs inside Customer & Worker views
  const [customerSubTab, setCustomerSubTab] = useState("find"); // 'find' | 'bookings'
  const [workerSubTab, setWorkerSubTab] = useState("jobs"); // 'jobs' | 'earnings' | 'community-bids'

  // Admin bulk request modal
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Sync navigation when user clicks role or navbar links
  const handleNavTab = (tab) => {
    setActiveTab(tab);
    if (tab === "bookings") setCustomerSubTab("bookings");
    if (tab === "quick-jobs") {
      setRole("customer");
      setCustomerSubTab("quick-jobs");
    }
    if (tab === "jobs") setWorkerSubTab("jobs");
    if (tab === "earnings") setWorkerSubTab("earnings");
    if (tab === "dashboard") {
      setCustomerSubTab("find");
      setWorkerSubTab("jobs");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={handleNavTab} />

      {/* Main Role Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "landing" ? (
          <LandingPage
            onSelectRole={(newRole) => {
              setRole(newRole);
              setActiveTab("dashboard");
            }}
            onStartDemo={(targetTab) => handleNavTab(targetTab)}
          />
        ) : (
          <>
            {(role === "customer" || role === "master") && (
              <CustomerDashboard
                activeSubTab={customerSubTab}
                setActiveSubTab={setCustomerSubTab}
              />
            )}

            {role === "worker" && (
              <WorkerDashboard
                activeSubTab={workerSubTab}
                setActiveSubTab={setWorkerSubTab}
              />
            )}

            {role === "skill_swap" && <SkillSwapDashboard />}

            {role === "admin" && (
              <AdminDashboard
                onOpenNewRequestModal={() => setIsBulkModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Initial / On-Demand Sign In & Registration Gateway Portal */}
      <AuthGatewayModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultRole={role === "admin" ? "customer" : role === "master" ? "customer" : role}
      />

      {/* Society Bulk Request Creation Modal */}
      <BulkRequestModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />

      {/* Master Live Console Modal (Masquerade & Control Any Worker Live) */}
      <MasterLiveConsoleModal
        isOpen={isMasterConsoleOpen}
        onClose={() => setIsMasterConsoleOpen(false)}
      />

      {/* Floating Master Console Trigger Button */}
      <button
        type="button"
        onClick={() => setIsMasterConsoleOpen(true)}
        title="Open Master Live Console (Control any worker in real-time)"
        className="fixed bottom-20 left-4 z-40 bg-gradient-to-r from-slate-900 to-emerald-950 text-white border border-emerald-500/60 hover:border-emerald-400 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-black transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>⚡ Master Console</span>
        <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
          ALL WORKERS
        </span>
      </button>

      {/* 1-Click Interactive Hackathon Demo Assistant Widget */}
      <DemoStoryWalkthrough onNavigateTab={handleNavTab} />

      {/* Footer */}
      <Footer setActiveTab={handleNavTab} />
    </div>
  );
}

export default App;
