import React, { useState } from "react";
import { useApp } from "./context/AppContext";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { LandingPage } from "./pages/LandingPage";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { WorkerDashboard } from "./pages/WorkerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { DemoStoryWalkthrough } from "./components/demo/DemoStoryWalkthrough";
import { BulkRequestModal } from "./components/admin/BulkRequestModal";

export function App() {
  const { role, setRole } = useApp();

  // Active top-level tab: 'dashboard' | 'bookings' | 'jobs' | 'earnings' | 'requests' | 'landing'
  const [activeTab, setActiveTab] = useState("landing");

  // Sub-tabs inside Customer & Worker views
  const [customerSubTab, setCustomerSubTab] = useState("find"); // 'find' | 'bookings'
  const [workerSubTab, setWorkerSubTab] = useState("jobs"); // 'jobs' | 'earnings' | 'community-bids'

  // Admin bulk request modal
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Sync navigation when user clicks role or navbar links
  const handleNavTab = (tab) => {
    setActiveTab(tab);
    if (tab === "bookings") setCustomerSubTab("bookings");
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
            onSelectRole={(newRole) => setRole(newRole)}
            onStartDemo={(targetTab) => handleNavTab(targetTab)}
          />
        ) : (
          <>
            {role === "customer" && (
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

            {role === "admin" && (
              <AdminDashboard
                onOpenNewRequestModal={() => setIsBulkModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Society Bulk Request Creation Modal */}
      <BulkRequestModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />

      {/* 1-Click Interactive Hackathon Demo Assistant Widget */}
      <DemoStoryWalkthrough onNavigateTab={handleNavTab} />

      {/* Footer */}
      <Footer setActiveTab={handleNavTab} />
    </div>
  );
}

export default App;
