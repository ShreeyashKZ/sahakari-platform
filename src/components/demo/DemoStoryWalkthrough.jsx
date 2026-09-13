import React, { useState } from "react";
import { 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  RotateCcw,
  Eye,
  Check
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const DemoStoryWalkthrough = ({ onNavigateTab }) => {
  const { 
    role, 
    setRole, 
    bookings, 
    updateBookingStatus, 
    completePayment, 
    submitReview,
    resetDemoData 
  } = useApp();

  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  // Target booking for demo story (SHK-8921 with Imran Khan)
  const targetBooking = bookings.find((b) => b.workerId === "w-imran") || bookings[0];

  const demoSteps = [
    {
      stepNumber: 1,
      title: "Problem Statement: Customer Leaking Tap",
      roleToSet: "customer",
      tabToSet: "dashboard",
      description: "Customer needs urgent plumbing fix. In traditional apps, customers suffer hidden pricing & delayed dispatch.",
      actionLabel: "Step 1: Explore Recommended Plumbers",
      onExecute: () => {
        setRole("customer");
        onNavigateTab("dashboard");
      },
    },
    {
      stepNumber: 2,
      title: "Intelligent Smart Match Displayed",
      roleToSet: "customer",
      tabToSet: "dashboard",
      description: "Sahakari ranks Imran Khan #1 because: 1.8km away, available right now, 4.8★ rating, and transparent ₹450 flat rate.",
      actionLabel: "Step 2: View Worker Card & Match Reasons",
      onExecute: () => {
        setRole("customer");
        onNavigateTab("dashboard");
      },
    },
    {
      stepNumber: 3,
      title: "Booking Requested by Customer",
      roleToSet: "customer",
      tabToSet: "bookings",
      description: "Customer confirms booking. System generates 4-digit Security OTP (4928) for verified doorstep entry.",
      actionLabel: "Step 3: View Booking Tracker & OTP",
      onExecute: () => {
        setRole("customer");
        onNavigateTab("bookings");
      },
    },
    {
      stepNumber: 4,
      title: "Switch to Worker: Imran Khan receives Job",
      roleToSet: "worker",
      tabToSet: "jobs",
      description: "Imran sees the job card with direct take-home earnings of ₹450 under the Zero-Profit Operating Model (100% labour retained + ₹25 at-cost fee).",
      actionLabel: "Step 4: Switch to Worker & Accept Job",
      onExecute: () => {
        setRole("worker");
        onNavigateTab("jobs");
        if (targetBooking) {
          updateBookingStatus(targetBooking.id, "Accepted");
        }
      },
    },
    {
      stepNumber: 5,
      title: "Worker Starts Service",
      roleToSet: "worker",
      tabToSet: "jobs",
      description: "Worker arrives at Shanti Vihar Apts, verifies OTP with customer, and begins plumbing repair.",
      actionLabel: "Step 5: Worker Marks 'Service Started'",
      onExecute: () => {
        setRole("worker");
        onNavigateTab("jobs");
        if (targetBooking) {
          updateBookingStatus(targetBooking.id, "Service Started");
        }
      },
    },
    {
      stepNumber: 6,
      title: "Worker Completes Repair",
      roleToSet: "worker",
      tabToSet: "jobs",
      description: "Leaking tap valve successfully replaced. Worker marks job completed to trigger settlement.",
      actionLabel: "Step 6: Worker Marks 'Complete'",
      onExecute: () => {
        setRole("worker");
        onNavigateTab("jobs");
        if (targetBooking) {
          updateBookingStatus(targetBooking.id, "Completed");
        }
      },
    },
    {
      stepNumber: 7,
      title: "Customer Mock Payment Settlement",
      roleToSet: "customer",
      tabToSet: "bookings",
      description: "Customer reviews transparent zero-profit receipt: 100% labour to worker + flat ₹25 for member welfare and at-cost servers.",
      actionLabel: "Step 7: Customer Disburses Payout",
      onExecute: () => {
        setRole("customer");
        onNavigateTab("bookings");
        if (targetBooking) {
          completePayment(targetBooking.id);
        }
      },
    },
    {
      stepNumber: 8,
      title: "Customer Submits 5★ Review",
      roleToSet: "customer",
      tabToSet: "bookings",
      description: "Customer rates 5★ with compliments ('Punctual', 'Fair Price'). Reputation permanently attached to worker.",
      actionLabel: "Step 8: Submit Portable 5★ Rating",
      onExecute: () => {
        setRole("customer");
        onNavigateTab("bookings");
        if (targetBooking) {
          submitReview(targetBooking.id, 5, "Fixed the leak quickly, extremely honest pricing!", ["Punctual", "Clean Work"]);
        }
      },
    },
    {
      stepNumber: 9,
      title: "Worker Earnings & Community Fund Updated",
      roleToSet: "worker",
      tabToSet: "earnings",
      description: "Worker ledger reflects instant earnings increase. Community welfare fund balance increases.",
      actionLabel: "Step 9: Inspect Worker Ledger & Graph",
      onExecute: () => {
        setRole("worker");
        onNavigateTab("earnings");
      },
    },
    {
      stepNumber: 10,
      title: "Community Society RWA Hub Updated",
      roleToSet: "admin",
      tabToSet: "dashboard",
      description: "RWA admin command center reflects completed neighborhood task and total funds retained locally.",
      actionLabel: "Step 10: Inspect Society Command Center",
      onExecute: () => {
        setRole("admin");
        onNavigateTab("dashboard");
      },
    },
  ];

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      demoSteps[nextIdx].onExecute();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      demoSteps[prevIdx].onExecute();
    }
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
      {isOpen ? (
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-700/80 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-400">
                SIH Judge Demo Walkthrough
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-slate-400">
                {currentStep + 1}/{demoSteps.length}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-1"
                title="Minimize guide"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Current Step Info */}
          <div className="my-3">
            <p className="font-bold text-white text-sm">
              {currentStepData.title}
            </p>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={() => currentStepData.onExecute()}
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>Trigger Current Step Action</span>
          </button>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="text-slate-400 hover:text-white disabled:opacity-30 transition font-medium"
            >
              ← Previous
            </button>
            <button
              onClick={resetDemoData}
              className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 text-[11px]"
              title="Reset all data back to step 1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === demoSteps.length - 1}
              className="font-bold text-emerald-400 hover:text-emerald-300 disabled:opacity-30 transition flex items-center gap-1"
            >
              Next Step →
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="ml-auto flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-2xl border border-emerald-500/50 hover:bg-slate-800 transition font-bold text-xs"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>SIH Judge Guide ({currentStep + 1}/{demoSteps.length})</span>
        </button>
      )}
    </div>
  );
};
