import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SERVICES,
  INITIAL_WORKERS,
  INITIAL_BOOKINGS,
  INITIAL_COMMUNITY_REQUESTS,
  COMMUNITY_ANNOUNCEMENTS,
  COOPERATIVE_METRICS,
  INITIAL_USERS,
  INITIAL_SKILL_SWAPS,
  INITIAL_QUICK_JOBS,
  DEMOCRATIC_PROPOSALS,
} from "../data/mockData";
import CooperativeReceiptModal from "../components/common/CooperativeReceiptModal";

const AppContext = createContext();
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const AppProvider = ({ children }) => {
  // Current Authenticated User (saved with Remember Me option)
  const [currentUser, setCurrentUser] = useState(() => {
    const local = localStorage.getItem("sahakari_current_user");
    if (local) {
      try { return JSON.parse(local); } catch (e) { /* ignore */ }
    }
    const session = sessionStorage.getItem("sahakari_current_user");
    if (session) {
      try { return JSON.parse(session); } catch (e) { /* ignore */ }
    }
    return null;
  });

  // Initial interface opens with sign-in/login page if no active user session
  const [isAuthOpen, setIsAuthOpen] = useState(() => {
    const hasSession = localStorage.getItem("sahakari_current_user") || sessionStorage.getItem("sahakari_current_user");
    return !hasSession;
  });

  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem("sahakari_role");
    if (savedRole) return savedRole;
    return "customer";
  });

  const [currentWorkerId, setCurrentWorkerId] = useState(() => {
    const saved = localStorage.getItem("sahakari_worker_id"); return (!saved || saved === "w-imran") ? "w-ramesh" : saved;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("sahakari_users");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed)) {
          // Ensure master user and any missing initial users are merged in
          const merged = [...parsed];
          INITIAL_USERS.forEach((initU) => {
            if (!merged.some((u) => u.email === initU.email || u.phone === initU.phone)) {
              merged.push(initU);
            }
          });
          return merged;
        }
      } catch (e) {}
    }
    return INITIAL_USERS;
  });

  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem("sahakari_workers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length >= INITIAL_WORKERS.length) {
          return parsed;
        }
        // If saved list had fewer workers, merge in new workers
        if (parsed && Array.isArray(parsed)) {
          const merged = [...parsed];
          INITIAL_WORKERS.forEach((initW) => {
            if (!merged.some((w) => w.id === initW.id)) {
              merged.push(initW);
            }
          });
          return merged;
        }
      } catch (e) {}
    }
    return INITIAL_WORKERS;
  });

  // Master Account Controls: Live Console & Masquerade Switcher
  const isMasterMode = Boolean(currentUser?.isMasterAccount || currentUser?.role === "master");
  const [isMasterConsoleOpen, setIsMasterConsoleOpen] = useState(false);
  const [masterActiveWorkerId, setMasterActiveWorkerId] = useState(() => {
    const saved = localStorage.getItem("sahakari_master_worker_id"); return (!saved || saved === "w-imran") ? "w-ramesh" : saved;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("sahakari_bookings");
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [communityRequests, setCommunityRequests] = useState(() => {
    const saved = localStorage.getItem("sahakari_community_requests");
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_REQUESTS;
  });

  const [skillSwaps, setSkillSwaps] = useState(() => {
    const saved = localStorage.getItem("sahakari_skill_swaps");
    return saved ? JSON.parse(saved) : INITIAL_SKILL_SWAPS;
  });

  const [quickJobs, setQuickJobs] = useState(() => {
    const saved = localStorage.getItem("sahakari_quick_jobs");
    return saved ? JSON.parse(saved) : INITIAL_QUICK_JOBS;
  });

  const [metrics, setMetrics] = useState(() => {
    const saved = localStorage.getItem("sahakari_metrics");
    return saved ? JSON.parse(saved) : COOPERATIVE_METRICS;
  });


  // Democratic Assembly Proposals
  const [proposals, setProposals] = useState(() => {
    const saved = localStorage.getItem("sahakari_proposals");
    return saved ? JSON.parse(saved) : DEMOCRATIC_PROPOSALS;
  });

  useEffect(() => {
    localStorage.setItem("sahakari_proposals", JSON.stringify(proposals));
  }, [proposals]);

  const castVote = (proposalId, voteType) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          const prevVote = p.userVoted;
          let yesDiff = 0;
          let noDiff = 0;
          let abstainDiff = 0;

          if (prevVote === "yes") yesDiff -= 1;
          if (prevVote === "no") noDiff -= 1;
          if (prevVote === "abstain") abstainDiff -= 1;

          if (voteType === "yes") yesDiff += 1;
          if (voteType === "no") noDiff += 1;
          if (voteType === "abstain") abstainDiff += 1;

          return {
            ...p,
            votesYes: Math.max(0, p.votesYes + yesDiff),
            votesNo: Math.max(0, p.votesNo + noDiff),
            votesAbstain: Math.max(0, p.votesAbstain + abstainDiff),
            userVoted: voteType,
          };
        }
        return p;
      })
    );
  };

  // Cooperative Member Share Capital Purchase
  const purchaseMemberShare = (workerId, planType = "one_time") => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return {
            ...w,
            isShareholder: true,
            shareCount: (w.shareCount || 0) + 1,
            shareType: "Full Voting Co-owner",
            sharePlan: planType === "one_time" ? "Paid ₹100" : "Micro-retention ₹10/job",
            shareBadge: "🏷️ Co-op Shareholder & Voting Member",
          };
        }
        return w;
      })
    );
    if (currentUser) {
      const updated = {
        ...currentUser,
        isShareholder: true,
        shareBadge: "🏷️ Co-op Shareholder & Voting Member",
      };
      setCurrentUser(updated);
      if (currentUser.rememberMe) {
        localStorage.setItem("sahakari_current_user", JSON.stringify(updated));
      }
    }
    return true;
  };

  // Upgrade Diagnostic Inspection booking to Full Standard Repair
  const upgradeBookingToFullRepair = async (bookingId) => {
    let upgradedRate = 400;

    const nextBookings = bookings.map((b) => {
      if (String(b.id) === String(bookingId)) {
        const targetWorker = workers.find((w) => w.id === b.workerId);
        const fullRate = Number(b.standardPrice || targetWorker?.standardPrice || targetWorker?.hourlyRate || 400);
        upgradedRate = fullRate;
        const fee = Number(b.platformFee || 20);
        return {
          ...b,
          bookingType: "Full Standard Repair",
          isDiagnostic: false,
          canUpgradeToFull: false,
          serviceCharge: fullRate,
          totalAmount: fullRate + fee,
          workerPayout: fullRate,
          upgradedAt: new Date().toISOString(),
        };
      }
      return b;
    });

    setBookings(nextBookings);
    localStorage.setItem("sahakari_bookings", JSON.stringify(nextBookings));
    broadcastSync("BOOKINGS_UPDATE", nextBookings);

    if (apiConnected) {
      try {
        await fetch(`${API_URL}/api/bookings/${bookingId}/upgrade`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullRate: upgradedRate }),
        });
      } catch (e) {
        console.warn("Backend upgrade sync error:", e);
      }
    }
  };

  // Housing Societies & RWA Context
  const [societies, setSocieties] = useState(() => {
    const saved = localStorage.getItem("sahakari_societies");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "soc-1",
            name: "Shanti Vihar Apartments RWA",
            slug: "shanti-vihar",
            registrationNo: "BLR/RWA/2019/4821",
            city: "Bengaluru",
            pincode: "560038",
            totalFlats: 160,
            secretaryName: "Dr. Alok Verma",
            secretaryContact: "+91 98450 77112",
            inviteLink: "https://sahakari.org.in/join/rwa-shanti-vihar",
          },
          {
            id: "soc-2",
            name: "Palm Meadows Residents Association",
            slug: "palm-meadows",
            registrationNo: "BLR/RWA/2021/1190",
            city: "Bengaluru",
            pincode: "560066",
            totalFlats: 240,
            secretaryName: "Col. Suresh Nair",
            secretaryContact: "+91 98220 33441",
            inviteLink: "https://sahakari.org.in/join/rwa-palm-meadows",
          },
        ];
  });

  const [activeSocietyContext, setActiveSocietyContext] = useState(() => {
    return localStorage.getItem("sahakari_active_society") || "shanti-vihar";
  });

  const registerHousingSociety = (socData) => {
    const slug = (socData.name || "housing-society")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const inviteLink = `https://sahakari.org.in/join/rwa-${slug}`;
    const newSociety = {
      id: `soc-${Date.now()}`,
      slug,
      inviteLink,
      ...socData,
    };
    const updated = [newSociety, ...societies];
    setSocieties(updated);
    localStorage.setItem("sahakari_societies", JSON.stringify(updated));
    setActiveSocietyContext(slug);
    localStorage.setItem("sahakari_active_society", slug);
    return newSociety;
  };

  // Cooperative Post-Service Receipt Modal State
  const [receiptModalData, setReceiptModalData] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const openReceiptModal = (receiptData) => {
    setReceiptModalData(receiptData);
    setIsReceiptOpen(true);
  };

  const closeReceiptModal = () => {
    setIsReceiptOpen(false);
    setReceiptModalData(null);
  };

  // Worker verification realignment (PCC, NSQF Level 4, optional e-Shram advisory)
  const updateWorkerVerification = (workerId, { pccCertificate, nsqfCard, uanNumber }) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const isPolice = pccCertificate !== undefined ? Boolean(pccCertificate) : w.isPoliceVerified;
          const isNsqf = nsqfCard !== undefined ? Boolean(nsqfCard) : w.isNsqfCertified;
          const uan = uanNumber !== undefined ? uanNumber : (w.eshramNumber || "");

          return {
            ...w,
            isPoliceVerified: isPolice,
            isNsqfCertified: isNsqf,
            eshramNumber: uan,
            hasEshram: Boolean(uan && uan.length >= 10),
            pccCertificate: pccCertificate || w.pccCertificate,
            nsqfCard: nsqfCard || w.nsqfCard,
            verificationStatus: {
              ...w.verificationStatus,
              label: isPolice && isNsqf
                ? "🛡️ Police Verified • 🎓 NSQF Level 4"
                : isPolice
                  ? "🛡️ Police Cleared"
                  : isNsqf
                    ? "🎓 Skill India Certified"
                    : "Cooperative Member",
            },
          };
        }
        return w;
      })
    );
  };

  const [apiConnected, setApiConnected] = useState(false);

  // Check backend & DB connectivity on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_URL}/api/health`);
        if (res.ok) {
          const data = await res.json();
          console.log("[Sahakari] Connected to Backend API:", data);
          setApiConnected(true);
        }
      } catch (err) {
        setApiConnected(false);
      }
    };
    checkBackend();
  }, []);

  // Sync to localStorage as robust offline cache
  useEffect(() => {
    localStorage.setItem("sahakari_role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("sahakari_workers", JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem("sahakari_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("sahakari_community_requests", JSON.stringify(communityRequests));
  }, [communityRequests]);

  useEffect(() => {
    localStorage.setItem("sahakari_metrics", JSON.stringify(metrics));
  }, [metrics]);

  // Real-time synchronization helper for instant tab-to-tab & window communication
  const broadcastSync = (type, payload) => {
    try {
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel("sahakari_sync_channel");
        bc.postMessage({ type, payload });
        bc.close();
      }
    } catch (e) {
      /* ignore */
    }
  };

  // Real-time listener: BroadcastChannel + storage events
  useEffect(() => {
    let bc = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        bc = new BroadcastChannel("sahakari_sync_channel");
        bc.onmessage = (event) => {
          if (!event.data) return;
          if (event.data.type === "CHAT_UPDATE") {
            setActiveChatSession(event.data.payload);
          } else if (event.data.type === "BOOKINGS_UPDATE") {
            setBookings(event.data.payload);
          } else if (event.data.type === "WORKERS_UPDATE") {
            setWorkers(event.data.payload);
          } else if (event.data.type === "COMMUNITY_REQUESTS_UPDATE") {
            setCommunityRequests(event.data.payload);
          }
        };
      }
    } catch (e) {}

    const handleStorage = (event) => {
      if (event.key === "sahakari_active_chat") {
        try {
          const parsed = event.newValue ? JSON.parse(event.newValue) : null;
          setActiveChatSession(parsed);
        } catch (e) {}
      } else if (event.key === "sahakari_bookings") {
        try {
          const parsed = event.newValue ? JSON.parse(event.newValue) : [];
          setBookings(parsed);
        } catch (e) {}
      } else if (event.key === "sahakari_workers") {
        try {
          const parsed = event.newValue ? JSON.parse(event.newValue) : [];
          setWorkers(parsed);
        } catch (e) {}
      } else if (event.key === "sahakari_community_requests") {
        try {
          const parsed = event.newValue ? JSON.parse(event.newValue) : [];
          setCommunityRequests(parsed);
        } catch (e) {}
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Multi-device backend polling (when API is reachable)
  useEffect(() => {
    if (!apiConnected) return;
    const interval = setInterval(async () => {
      try {
        const bRes = await fetch(`${API_URL}/api/bookings`);
        if (bRes.ok) {
          const remoteBookings = await bRes.json();
          if (Array.isArray(remoteBookings) && remoteBookings.length > 0) {
            setBookings((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(remoteBookings)) {
                return remoteBookings;
              }
              return prev;
            });
          }
        }
        const cRes = await fetch(`${API_URL}/api/chat/session`);
        if (cRes.ok) {
          const data = await cRes.json();
          if (data.session && data.session.messages) {
            setActiveChatSession((prev) => {
              if (!prev || prev.messages?.length !== data.session.messages.length) {
                return data.session;
              }
              return prev;
            });
          }
        }
      } catch (e) {}
    }, 1500);

    return () => clearInterval(interval);
  }, [apiConnected]);

  const currentWorker = workers.find((w) => w.id === currentWorkerId) || workers[0];

  // 1. Create a new Booking
  const createBooking = async (bookingData) => {
    const newId = `SHK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newBooking = {
      id: newId,
      customerId: "cust-1",
      customerName: "Vikram Malhotra",
      customerPhone: "+91 98450 12345",
      serviceOtp: newOtp,
      createdAt: new Date().toISOString(),
      status: "Requested",
      paymentStatus: "Pending",
      rating: null,
      review: null,
      ...bookingData,
    };

    // Optimistic UI update + instant cross-tab broadcast
    const nextBookings = [newBooking, ...bookings];
    setBookings(nextBookings);
    localStorage.setItem("sahakari_bookings", JSON.stringify(nextBookings));
    broadcastSync("BOOKINGS_UPDATE", nextBookings);

    // Async sync with API if online
    if (apiConnected) {
      try {
        await fetch(`${API_URL}/api/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBooking),
        });
      } catch (e) {
        console.warn("Backend sync queued:", e);
      }
    }

    return newBooking;
  };

  // 2. Worker updates booking stage
  const updateBookingStatus = async (bookingId, newStatus) => {
    let completedWorkerId = null;
    const nextBookings = bookings.map((b) => {
      if (b.id === bookingId) {
        if (newStatus === "Completed") {
          completedWorkerId = b.workerId;
        }
        return { ...b, status: newStatus };
      }
      return b;
    });
    setBookings(nextBookings);
    localStorage.setItem("sahakari_bookings", JSON.stringify(nextBookings));
    broadcastSync("BOOKINGS_UPDATE", nextBookings);

    // Delete/clear chat session when job is marked Completed
    if (completedWorkerId) {
      clearChatSession(completedWorkerId);
    }

    if (apiConnected) {
      try {
        await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch (e) {
        console.warn("Backend sync error:", e);
      }
    }
  };

  // 2b. Cancel a booking with customer reason
  const cancelBooking = async (bookingId, reason, note = "") => {
    const fullReason = note && note.trim() ? `${reason} (${note.trim()})` : reason;
    const cancelledTimestamp = new Date().toISOString();

    const nextBookings = bookings.map((b) =>
      b.id === bookingId
        ? {
            ...b,
            status: "Cancelled",
            cancellationReason: fullReason,
            cancelledBy: "Customer",
            cancelledAt: cancelledTimestamp,
            paymentStatus:
              b.paymentStatus === "Paid" || b.paymentStatus === "Escrow Secured"
                ? "Refund Initiated"
                : "Cancelled",
          }
        : b
    );
    setBookings(nextBookings);
    localStorage.setItem("sahakari_bookings", JSON.stringify(nextBookings));
    broadcastSync("BOOKINGS_UPDATE", nextBookings);

    if (apiConnected) {
      try {
        await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Cancelled",
            cancellationReason: fullReason,
            cancelledBy: "Customer",
          }),
        });
      } catch (e) {
        console.warn("Cancellation backend sync error:", e);
      }
    }
  };

  // 3. Complete payment for booking
  const completePayment = async (bookingId) => {
    let updatedBooking = null;

    const nextBookings = bookings.map((b) => {
      if (b.id === bookingId) {
        updatedBooking = { ...b, paymentStatus: "Paid", status: "Completed" };
        return updatedBooking;
      }
      return b;
    });

    setBookings(nextBookings);
    localStorage.setItem("sahakari_bookings", JSON.stringify(nextBookings));
    broadcastSync("BOOKINGS_UPDATE", nextBookings);

    if (updatedBooking) {
      // Once customer's offer is completed and payment is received, delete chat session with this worker
      // so the next time they book the same worker, a brand new chat can be initiated
      clearChatSession(updatedBooking.workerId);

      // Update worker earnings locally
      const nextWorkers = workers.map((w) => {
        if (w.id === updatedBooking.workerId) {
          const payout = updatedBooking.workerPayout || updatedBooking.totalAmount || 350;
          return {
            ...w,
            completedJobs: (w.completedJobs || 0) + 1,
            earnings: {
              today: (w.earnings?.today || 0) + payout,
              thisWeek: (w.earnings?.thisWeek || 0) + payout,
              thisMonth: (w.earnings?.thisMonth || 0) + payout,
              allTime: (w.earnings?.allTime || 0) + payout,
            },
          };
        }
        return w;
      });

      setWorkers(nextWorkers);
      localStorage.setItem("sahakari_workers", JSON.stringify(nextWorkers));
      broadcastSync("WORKERS_UPDATE", nextWorkers);

      // Update Community metrics
      setMetrics((prev) => {
        const currentInt = parseInt(prev.totalPaidToWorkers.replace(/[^\d]/g, ""), 10) || 348200;
        const payout = updatedBooking.workerPayout || updatedBooking.totalAmount || 350;
        const newTotal = currentInt + payout;
        const currentWelfare = parseInt(prev.welfarePoolBalance.replace(/[^\d]/g, ""), 10) || 17100;
        const newWelfare = currentWelfare + 15;

        const updatedMetrics = {
          ...prev,
          jobsCompleted: prev.jobsCompleted + 1,
          totalPaidToWorkers: `₹${newTotal.toLocaleString("en-IN")}`,
          welfarePoolBalance: `₹${newWelfare.toLocaleString("en-IN")}`,
        };
        localStorage.setItem("sahakari_metrics", JSON.stringify(updatedMetrics));
        return updatedMetrics;
      });

      if (apiConnected) {
        try {
          await fetch(`${API_URL}/api/bookings/${bookingId}/pay`, {
            method: "POST",
          });
        } catch (e) {
          console.warn("Payment backend sync error:", e);
        }
      }
    }
  };

  // 4. Rate and Review Booking
  const submitReview = async (bookingId, rating, reviewText, tags = []) => {
    const numRating = Math.min(5, Math.max(1, Number(rating) || 5));
    const cleanTags = Array.isArray(tags) ? tags : [];
    let bookedWorkerId = null;

    const nextBookings = bookings.map((b) => {
      if (b.id === bookingId) {
        bookedWorkerId = b.workerId;
        return {
          ...b,
          rating: numRating,
          review: reviewText,
          reviewTags: cleanTags,
        };
      }
      return b;
    });

    setBookings(nextBookings);
    localStorage.setItem("sahakari_bookings", JSON.stringify(nextBookings));
    broadcastSync("BOOKINGS_UPDATE", nextBookings);

    if (bookedWorkerId) {
      const nextWorkers = workers.map((w) => {
        if (w.id === bookedWorkerId) {
          const currentCount = w.reviewsCount || 0;
          const currentRating = w.rating || 5;
          const newRating = Number(((currentRating * currentCount + numRating) / (currentCount + 1)).toFixed(1));
          return {
            ...w,
            rating: newRating,
            reviewsCount: currentCount + 1,
            reviews: [
              {
                id: `r-${Date.now()}`,
                customerName: currentUser?.name || "Vikram Malhotra",
                rating: numRating,
                date: "Just now",
                comment: reviewText,
                tags: cleanTags,
              },
              ...(w.reviews || []),
            ],
          };
        }
        return w;
      });

      setWorkers(nextWorkers);
      localStorage.setItem("sahakari_workers", JSON.stringify(nextWorkers));
      broadcastSync("WORKERS_UPDATE", nextWorkers);

      if (apiConnected) {
        try {
          await fetch(`${API_URL}/api/bookings/${bookingId}/review`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating: numRating, review: reviewText, tags: cleanTags }),
          });
        } catch (e) {
          console.warn("Review backend sync error:", e);
        }
      }
    }
  };

  // 5. Admin creates Community Request
  const createCommunityRequest = async (requestData) => {
    const newReq = {
      id: `CR-${Math.floor(100 + Math.random() * 900)}`,
      status: "Open for Collective",
      assignedWorkerIds: [],
      cooperativeBonus: "₹300 community welfare contribution included",
      ...requestData,
    };
    setCommunityRequests((prev) => {
      const updated = [newReq, ...prev];
      localStorage.setItem("sahakari_community_requests", JSON.stringify(updated));
      broadcastSync("COMMUNITY_REQUESTS_UPDATE", updated);
      return updated;
    });

    if (apiConnected) {
      try {
        await fetch(`${API_URL}/api/community-requests`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReq),
        });
      } catch (e) {
        console.warn("Community request sync error:", e);
      }
    }
  };

  // 5b. Worker joins/accepts a Community Bulk Maintenance Request
  const joinCommunityRequest = async (requestId, workerId) => {
    let updatedRequests = [];
    setCommunityRequests((prev) => {
      updatedRequests = prev.map((req) => {
        if (req.id === requestId) {
          const currentAssigned = req.assignedWorkerIds || [];
          if (currentAssigned.includes(workerId)) {
            return req;
          }
          const nextAssigned = [...currentAssigned, workerId];
          const isFilled = nextAssigned.length >= (req.workersNeeded || 1);
          return {
            ...req,
            assignedWorkerIds: nextAssigned,
            status: isFilled ? "In Progress" : "Open for Collective",
          };
        }
        return req;
      });
      localStorage.setItem("sahakari_community_requests", JSON.stringify(updatedRequests));
      broadcastSync("COMMUNITY_REQUESTS_UPDATE", updatedRequests);
      return updatedRequests;
    });

    if (apiConnected) {
      try {
        await fetch(`${API_URL}/api/community-requests/${requestId}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workerId }),
        });
      } catch (e) {
        console.warn("Community request join sync error:", e);
      }
    }
  };

  // Sync users and skillSwaps
  useEffect(() => {
    localStorage.setItem("sahakari_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("sahakari_skill_swaps", JSON.stringify(skillSwaps));
  }, [skillSwaps]);

  useEffect(() => {
    localStorage.setItem("sahakari_worker_id", currentWorkerId);
  }, [currentWorkerId]);

  // Authentication Methods
  const loginUser = async ({ identifier, password, role: requestedRole, rememberMe = true }) => {
    let matchedUser = null;
    let workerProfile = null;

    // 1. Try Backend API first
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, role: requestedRole, rememberMe }),
      });
      if (res.ok) {
        const data = await res.json();
        matchedUser = data.user;
        workerProfile = data.workerProfile;
      } else {
        const err = await res.json();
        throw new Error(err.error || "Login failed");
      }
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) {
        throw e;
      }
      console.warn("Backend login fetch failed, checking local database cache:", e);
    }

    // 2. Client-side fallback if offline
    if (!matchedUser) {
      const cleanIdent = identifier.trim().toLowerCase();
      const cleanPhone = identifier.replace(/[^\d]/g, "").slice(-10);
      matchedUser = users.find(
        (u) =>
          (u.email && u.email.toLowerCase() === cleanIdent) ||
          (cleanPhone && u.phone && u.phone.slice(-10) === cleanPhone)
      );

      if (!matchedUser) {
        throw new Error("No account found with this email or mobile number.");
      }
      if (matchedUser.password !== password) {
        throw new Error("Incorrect password. Please try again.");
      }

      if (matchedUser.role === "worker") {
        workerProfile = workers.find(
          (w) =>
            w.phone?.slice(-10) === matchedUser.phone?.slice(-10) ||
            w.name.toLowerCase() === matchedUser.name.toLowerCase()
        );
      }
    }

    const userToSave = { ...matchedUser, rememberMe };
    if (rememberMe) {
      localStorage.setItem("sahakari_current_user", JSON.stringify(userToSave));
      sessionStorage.removeItem("sahakari_current_user");
    } else {
      sessionStorage.setItem("sahakari_current_user", JSON.stringify(userToSave));
      localStorage.removeItem("sahakari_current_user");
    }

    setCurrentUser(userToSave);
    if (userToSave.role) {
      setRole(userToSave.role);
    }
    if (workerProfile && workerProfile.id) {
      setCurrentWorkerId(workerProfile.id);
    }
    setIsAuthOpen(false);
    return { user: userToSave, workerProfile };
  };

  const registerUser = async (formData) => {
    let createdUser = null;
    let createdWorker = null;
    const { rememberMe = true } = formData;

    // 1. Try Backend API
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        createdUser = data.user;
        createdWorker = data.workerProfile;
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Registration failed");
      }
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) {
        throw e;
      }
      console.warn("Backend unreachable, registering locally:", e);
    }

    // 2. Client-side fallback if offline
    if (!createdUser) {
      const cleanPhone = formData.phone ? formData.phone.replace(/[^\d]/g, "").slice(-10) : "";
      const cleanEmail = formData.email ? formData.email.trim().toLowerCase() : "";

      const existing = users.find(
        (u) =>
          (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) ||
          (cleanPhone && u.phone && u.phone.slice(-10) === cleanPhone)
      );
      if (existing) {
        throw new Error("An account with this email or mobile number already exists.");
      }

      const isEshramVerified = Boolean(formData.hasEshram && formData.eshramNumber && formData.eshramNumber.trim().length >= 8);
      const userId = `usr-${Date.now()}`;
      const defaultAvatar =
        formData.avatar ||
        (formData.role === "worker"
          ? "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");

      createdUser = {
        id: userId,
        name: formData.name,
        email: cleanEmail,
        phone: cleanPhone || formData.phone,
        password: formData.password,
        role: formData.role || "customer",
        avatar: defaultAvatar,
        address: formData.address || "",
        trade: formData.trade || "",
        aadhaar: formData.aadhaar ? `XXXX-XXXX-${formData.aadhaar.slice(-4)}` : "",
        hasEshram: Boolean(formData.hasEshram),
        eshramNumber: isEshramVerified ? formData.eshramNumber.trim() : "",
        isEshramVerified,
        offeredSkill: formData.offeredSkill || "",
        neededSkill: formData.neededSkill || "",
        rememberMe,
        createdAt: new Date().toISOString(),
      };

      if (formData.role === "worker") {
        const serviceObj = SERVICES.find((s) => s.id === formData.trade) || SERVICES[0];
        const workerId = `w-${Date.now().toString().slice(-4)}`;
        createdWorker = {
          id: workerId,
          name: formData.name,
          serviceId: serviceObj.id,
          serviceName: serviceObj.name,
          avatar: defaultAvatar,
          phone: cleanPhone || formData.phone,
          rating: 5.0,
          reviewsCount: 0,
          completedJobs: 0,
          distanceKm: 1.5,
          hourlyRate: Number(formData.hourlyRate) || 350,
          priceRange: `₹${Number(formData.hourlyRate) || 350} – ₹${(Number(formData.hourlyRate) || 350) + 250}`,
          experienceYears: Number(formData.experienceYears) || 2,
          availability: "Available Now",
          isAvailable: true,
          verificationStatus: {
            identity: true,
            skill: true,
            profile: true,
            isVerified: true,
            label: isEshramVerified ? "Cooperative & e-Shram Verified" : "Cooperative Registered",
          },
          skills: [serviceObj.name, "Emergency Callout", "Co-op Certified"],
          languages: ["Hindi", "English", "Local Language"],
          serviceArea: formData.address ? `${formData.address} (Within 5 km)` : "Local Neighborhood",
          bio: formData.bio || `Dedicated ${serviceObj.name} professional. Member of Sahakari Workers Collective.`,
          reviews: [],
          aadhaar: formData.aadhaar ? `XXXX-XXXX-${formData.aadhaar.slice(-4)}` : "Verified",
          address: formData.address || "",
          email: cleanEmail,
          password: formData.password,
          hasEshram: Boolean(formData.hasEshram),
          eshramNumber: isEshramVerified ? formData.eshramNumber.trim() : "",
          isEshramVerified,
          earnings: { today: 0, thisWeek: 0, thisMonth: 0, allTime: 0 },
        };
      }
    }

    setUsers((prev) => [createdUser, ...prev]);
    if (createdWorker) {
      setWorkers((prev) => [createdWorker, ...prev]);
      setCurrentWorkerId(createdWorker.id);
    }

    if (rememberMe) {
      localStorage.setItem("sahakari_current_user", JSON.stringify(createdUser));
      sessionStorage.removeItem("sahakari_current_user");
    } else {
      sessionStorage.setItem("sahakari_current_user", JSON.stringify(createdUser));
      localStorage.removeItem("sahakari_current_user");
    }

    setCurrentUser(createdUser);
    setRole(createdUser.role);
    setIsAuthOpen(false);

    return { user: createdUser, workerProfile: createdWorker };
  };

  const logoutUser = () => {
    localStorage.removeItem("sahakari_current_user");
    sessionStorage.removeItem("sahakari_current_user");
    setCurrentUser(null);
    setIsAuthOpen(true);
  };

  const updateWorkerEshram = (workerId, eshramNumber) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return {
            ...w,
            hasEshram: true,
            eshramNumber,
            isEshramVerified: true,
            verificationStatus: {
              ...w.verificationStatus,
              label: "Cooperative & e-Shram Verified",
            },
          };
        }
        return w;
      })
    );
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        hasEshram: true,
        eshramNumber,
        isEshramVerified: true,
      };
      setCurrentUser(updatedUser);
      if (currentUser.rememberMe) {
        localStorage.setItem("sahakari_current_user", JSON.stringify(updatedUser));
      } else {
        sessionStorage.setItem("sahakari_current_user", JSON.stringify(updatedUser));
      }
    }
  };

  const createSkillSwap = (swapData) => {
    const newSwap = {
      id: `swap-${Date.now()}`,
      authorName: currentUser ? currentUser.name : "Community Member",
      authorAvatar:
        currentUser?.avatar ||
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      location: currentUser?.address || "Indiranagar (Nearby)",
      date: "Just now",
      status: "Open",
      ...swapData,
    };
    setSkillSwaps((prev) => [newSwap, ...prev]);
    return newSwap;
  };

  // Active Chat & Bargain Session (shared in real-time between customer and worker views)
  const [activeChatSession, setActiveChatSession] = useState(() => {
    const saved = localStorage.getItem("sahakari_active_chat");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  useEffect(() => {
    if (activeChatSession) {
      localStorage.setItem("sahakari_active_chat", JSON.stringify(activeChatSession));
    } else {
      localStorage.removeItem("sahakari_active_chat");
    }
  }, [activeChatSession]);

  const startChatSession = (worker, serviceObj, customerOverride = null) => {
    const baseRate = worker.hourlyRate || 350;
    const initialSession = {
      workerId: worker.id,
      workerName: worker.name,
      workerAvatar: worker.avatar,
      workerPhone: worker.phone,
      serviceId: worker.serviceId || serviceObj?.id || "plumber",
      serviceName: worker.serviceName || serviceObj?.name || "Plumbing",
      customerId: customerOverride?.id || currentUser?.id || "cust-1",
      customerName: customerOverride?.name || currentUser?.name || "Vikram Malhotra",
      customerPhone: customerOverride?.phone || currentUser?.phone || "+91 98450 12345",
      customerAddress: customerOverride?.address || "Flat 402, Shanti Vihar Apts, Indiranagar, Bengaluru",
      customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      hasUnreadWorker: false,
      lastCustomerMsgAt: null,
      baseRate,
      agreedPrice: baseRate,
      emergencyAvailable: Boolean(worker.emergencyAvailable),
      etaMinutes: worker.etaMinutes || 15,
      isPoliceVerified: Boolean(worker.isPoliceVerified),
      isNsqfCertified: Boolean(worker.isNsqfCertified),
      isShareholder: Boolean(worker.isShareholder),
      canBargain: false,
      attractionTags: worker.attractionTags || ["Cooperative Verified"],
      messages: [
        {
          id: "m-1",
          sender: "worker",
          text: `Namaste! I am available right now for your ${worker.serviceName || "service"} inquiry. I can reach your location in approximately ${worker.etaMinutes || 15} minutes. Feel free to ask any question before booking.`,
          timestamp: "Just now",
        },
      ],
      bargainStatus: "idle", // 'idle' | 'bargain_requested' | 'accepted' | 'declined' | 'countered'
      proposedPrice: null,
      counterPrice: null,
    };

    setActiveChatSession(initialSession);
    localStorage.setItem("sahakari_active_chat", JSON.stringify(initialSession));
    broadcastSync("CHAT_UPDATE", initialSession);

    if (apiConnected) {
      fetch(`${API_URL}/api/chat/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initialSession),
      }).catch((e) => console.warn("Backend chat session error:", e));
    }

    return initialSession;
  };

  const sendChatMessage = (sender, text) => {
    if (!activeChatSession) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      sender, // 'customer' | 'worker' | 'system'
      text,
      timestamp: "Just now",
    };
    const isCustomerMsg = sender === "customer";
    const updated = {
      ...activeChatSession,
      hasUnreadWorker: isCustomerMsg ? true : (sender === "worker" ? false : activeChatSession.hasUnreadWorker),
      lastCustomerMsgAt: isCustomerMsg ? Date.now() : activeChatSession.lastCustomerMsgAt,
      messages: [...(activeChatSession.messages || []), newMsg],
    };
    setActiveChatSession(updated);
    localStorage.setItem("sahakari_active_chat", JSON.stringify(updated));
    broadcastSync("CHAT_UPDATE", updated);

    if (apiConnected) {
      fetch(`${API_URL}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender,
          text,
          workerId: activeChatSession.workerId,
        }),
      }).catch((e) => console.warn("Backend message send error:", e));
    }
  };

  const markChatReadByWorker = () => {
    if (!activeChatSession) return;
    if (activeChatSession.hasUnreadWorker) {
      const updated = { ...activeChatSession, hasUnreadWorker: false };
      setActiveChatSession(updated);
      localStorage.setItem("sahakari_active_chat", JSON.stringify(updated));
      broadcastSync("CHAT_UPDATE", updated);
    }
  };

  // Delete / clear chat session with worker once offer is completed and paid
  const clearChatSession = (workerId = null) => {
    setActiveChatSession((current) => {
      if (workerId && current && current.workerId !== workerId) {
        return current;
      }
      localStorage.removeItem("sahakari_active_chat");
      broadcastSync("CHAT_UPDATE", null);

      if (apiConnected) {
        fetch(`${API_URL}/api/chat/session`, {
          method: "DELETE",
        }).catch((e) => console.warn("Backend chat delete error:", e));
      }
      return null;
    });
  };

  const submitBargainOffer = (proposedPrice) => {
    if (!activeChatSession) return;
    const cleanPrice = Number(proposedPrice);

    // Customer signal message
    const customerMsg = {
      id: `m-${Date.now()}`,
      sender: "customer",
      text: `🤝 Bargain Offer: Can we agree on ₹${cleanPrice} for this job?`,
      timestamp: "Just now",
      isBargainCard: true,
      proposedPrice: cleanPrice,
    };

    const updated = {
      ...activeChatSession,
      bargainStatus: "bargain_requested",
      proposedPrice: cleanPrice,
      messages: [...(activeChatSession.messages || []), customerMsg],
    };

    setActiveChatSession(updated);
    localStorage.setItem("sahakari_active_chat", JSON.stringify(updated));
    broadcastSync("CHAT_UPDATE", updated);

    // Simulated worker reaction if needed
    setTimeout(() => {
      setActiveChatSession((prev) => {
        if (!prev || prev.bargainStatus !== "bargain_requested") return prev;

        if (prev.canBargain) {
          if (cleanPrice >= prev.baseRate * 0.75) {
            const accepted = {
              ...prev,
              bargainStatus: "accepted",
              agreedPrice: cleanPrice,
              messages: [
                ...prev.messages,
                {
                  id: `m-resp-${Date.now()}`,
                  sender: "worker",
                  text: `I accept your bargain rate of ₹${cleanPrice}! Deal confirmed. Please confirm your booking so I can start navigating.`,
                  timestamp: "Just now",
                },
              ],
            };
            localStorage.setItem("sahakari_active_chat", JSON.stringify(accepted));
            broadcastSync("CHAT_UPDATE", accepted);
            return accepted;
          } else {
            const counter = Math.round((prev.baseRate + cleanPrice) / 2 / 10) * 10;
            const countered = {
              ...prev,
              bargainStatus: "countered",
              counterPrice: counter,
              messages: [
                ...prev.messages,
                {
                  id: `m-resp-${Date.now()}`,
                  sender: "worker",
                  text: `₹${cleanPrice} is a bit too low for quality cooperative tooling. How about a fair rate of ₹${counter}?`,
                  timestamp: "Just now",
                },
              ],
            };
            localStorage.setItem("sahakari_active_chat", JSON.stringify(countered));
            broadcastSync("CHAT_UPDATE", countered);
            return countered;
          }
        } else {
          const declined = {
            ...prev,
            bargainStatus: "declined",
            agreedPrice: prev.baseRate,
            messages: [
              ...prev.messages,
              {
                id: `m-resp-${Date.now()}`,
                sender: "worker",
                text: `My pricing is transparently flat at ₹${prev.baseRate} with 100% genuine workmanship guarantee.`,
                timestamp: "Just now",
              },
            ],
          };
          localStorage.setItem("sahakari_active_chat", JSON.stringify(declined));
          broadcastSync("CHAT_UPDATE", declined);
          return declined;
        }
      });
    }, 1200);
  };

  const respondToBargainOffer = (decision, price) => {
    if (!activeChatSession) return;
    let updated = null;
    if (decision === "accept") {
      updated = {
        ...activeChatSession,
        bargainStatus: "accepted",
        agreedPrice: activeChatSession.proposedPrice || price,
        messages: [
          ...activeChatSession.messages,
          {
            id: `m-w-acc-${Date.now()}`,
            sender: "worker",
            text: `Deal agreed at ₹${activeChatSession.proposedPrice || price}! Ready to proceed with booking.`,
            timestamp: "Just now",
          },
        ],
      };
    } else if (decision === "decline") {
      updated = {
        ...activeChatSession,
        bargainStatus: "declined",
        agreedPrice: activeChatSession.baseRate,
        messages: [
          ...activeChatSession.messages,
          {
            id: `m-w-dec-${Date.now()}`,
            sender: "worker",
            text: `Keeping to standard cooperative base price of ₹${activeChatSession.baseRate}.`,
            timestamp: "Just now",
          },
        ],
      };
    } else if (decision === "counter") {
      updated = {
        ...activeChatSession,
        bargainStatus: "countered",
        counterPrice: price,
        messages: [
          ...activeChatSession.messages,
          {
            id: `m-w-cnt-${Date.now()}`,
            sender: "worker",
            text: `Counter-offer: Let's settle at ₹${price}.`,
            timestamp: "Just now",
          },
        ],
      };
    }
    if (updated) {
      setActiveChatSession(updated);
      localStorage.setItem("sahakari_active_chat", JSON.stringify(updated));
      broadcastSync("CHAT_UPDATE", updated);
    }
  };

  // Helper methods to accept or decline incoming offers
  const acceptBookingOffer = async (bookingId) => {
    await updateBookingStatus(bookingId, "Accepted");
  };

  const declineBookingOffer = async (bookingId, reason = "Worker Schedule Conflict") => {
    const nextBookings = bookings.map((b) =>
      b.id === bookingId
        ? {
            ...b,
            status: "Cancelled",
            cancellationReason: `Declined by Worker: ${reason}`,
            cancelledBy: "Worker",
            cancelledAt: new Date().toISOString(),
          }
        : b
    );
    setBookings(nextBookings);
    localStorage.setItem("sahakari_bookings", JSON.stringify(nextBookings));
    broadcastSync("BOOKINGS_UPDATE", nextBookings);

    if (apiConnected) {
      try {
        await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Cancelled",
            cancellationReason: `Declined by Worker: ${reason}`,
          }),
        });
      } catch (e) {}
    }
  };

  const updateWorkerSettings = (workerId, updatedFields) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, ...updatedFields } : w))
    );
  };

  const updateBookingEta = (bookingId, etaMinutes) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, etaMinutes } : b))
    );
  };

  // Master Control: Switch Worker Persona across all categories
  const switchWorkerPersona = (workerId) => {
    setMasterActiveWorkerId(workerId);
    setCurrentWorkerId(workerId);
    localStorage.setItem("sahakari_master_worker_id", workerId);
    localStorage.setItem("sahakari_worker_id", workerId);

    // If a customer chat session is currently active, re-link to this worker
    if (activeChatSession) {
      const targetWorker = workers.find((w) => w.id === workerId);
      if (targetWorker) {
        setActiveChatSession((prev) => ({
          ...prev,
          workerId: targetWorker.id,
          workerName: targetWorker.name,
          workerAvatar: targetWorker.avatar,
          workerPhone: targetWorker.phone,
          serviceName: targetWorker.serviceName,
          baseRate: targetWorker.hourlyRate || prev.baseRate,
        }));
      }
    }
  };

  // Master Control: Send live message as the worker
  const masterSendWorkerMessage = (text) => {
    if (!activeChatSession) return;
    const cleanText = text.trim();
    if (!cleanText) return;

    const workerMsg = {
      id: `m-mstr-${Date.now()}`,
      sender: "worker",
      text: cleanText,
      timestamp: "Just now",
      isLiveFromMaster: true,
    };

    setActiveChatSession((prev) => ({
      ...prev,
      messages: [...prev.messages, workerMsg],
    }));
  };

  // Master Control: Respond live to customer bargain offers
  const masterRespondBargain = (decision, customPrice) => {
    if (!activeChatSession) return;
    if (decision === "accept") {
      const finalRate = customPrice || activeChatSession.proposedPrice || activeChatSession.baseRate;
      setActiveChatSession((prev) => ({
        ...prev,
        bargainStatus: "accepted",
        agreedPrice: finalRate,
        messages: [
          ...prev.messages,
          {
            id: `m-resp-mstr-${Date.now()}`,
            sender: "worker",
            text: `🤝 Offer Accepted! I agree to ₹${finalRate}. You can now proceed to payment & confirm the booking.`,
            timestamp: "Just now",
            isLiveFromMaster: true,
          },
        ],
      }));
    } else if (decision === "counter") {
      const counterRate = customPrice || Math.round(((activeChatSession.baseRate || 350) + (activeChatSession.proposedPrice || 300)) / 2);
      setActiveChatSession((prev) => ({
        ...prev,
        bargainStatus: "countered",
        counterPrice: counterRate,
        messages: [
          ...prev.messages,
          {
            id: `m-resp-mstr-${Date.now()}`,
            sender: "worker",
            text: `Fair cooperative counter: How about ₹${counterRate}? If agreed, please confirm to get started.`,
            timestamp: "Just now",
            isLiveFromMaster: true,
          },
        ],
      }));
    } else if (decision === "decline") {
      setActiveChatSession((prev) => ({
        ...prev,
        bargainStatus: "declined",
        agreedPrice: prev.baseRate,
        messages: [
          ...prev.messages,
          {
            id: `m-resp-mstr-${Date.now()}`,
            sender: "worker",
            text: `My rate is fixed at ₹${prev.baseRate}. This covers guaranteed 100% genuine workmanship and cooperative warranty.`,
            timestamp: "Just now",
            isLiveFromMaster: true,
          },
        ],
      }));
    }
  };

  // Master Control: Instant 1-click presenter master login
  const loginAsMaster = () => {
    const masterUser = users.find((u) => u.email === "master@sahakari.in") || INITIAL_USERS[0];
    setCurrentUser(masterUser);
    localStorage.setItem("sahakari_current_user", JSON.stringify(masterUser));
    sessionStorage.removeItem("sahakari_current_user");
    setRole("master");
    setIsAuthOpen(false);
    setIsMasterConsoleOpen(true);
    return masterUser;
  };

  // Sync quickJobs
  useEffect(() => {
    localStorage.setItem("sahakari_quick_jobs", JSON.stringify(quickJobs));
  }, [quickJobs]);

  const verifyUserAadhaar = (aadhaarNumber) => {
    const cleanNum = aadhaarNumber ? aadhaarNumber.replace(/[^\d]/g, "") : "1234";
    const masked = `XXXX-XXXX-${cleanNum.slice(-4)}`;
    if (currentUser) {
      const updated = { ...currentUser, isAadhaarVerified: true, aadhaar: masked };
      setCurrentUser(updated);
      if (currentUser.rememberMe) {
        localStorage.setItem("sahakari_current_user", JSON.stringify(updated));
      } else {
        sessionStorage.setItem("sahakari_current_user", JSON.stringify(updated));
      }
    }
    return true;
  };

  const createQuickJob = (jobData) => {
    const newJob = {
      id: `qj-${Date.now()}`,
      postedBy: currentUser ? currentUser.name : "Resident Neighbor",
      postedByAvatar:
        currentUser?.avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      phone: currentUser?.phone || "+91 98450 12345",
      location: currentUser?.address || "Indiranagar, Society",
      status: "Open",
      assignedTo: null,
      aadhaarRequired: true,
      videoCallVerified: false,
      paymentReleased: false,
      ...jobData,
    };
    setQuickJobs((prev) => [newJob, ...prev]);
    return newJob;
  };

  const verifyVideoCallAgreement = (jobId, applicantData) => {
    setQuickJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status: "In Progress",
            videoCallVerified: true,
            assignedTo: applicantData || {
              name: currentUser ? currentUser.name : "Verified Neighbor",
              phone: currentUser ? currentUser.phone : "+91 98450 12345",
              avatar:
                currentUser?.avatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
              aadhaarVerified: true,
            },
          };
        }
        return j;
      })
    );
  };

  const completeAndReleaseQuickJobPayment = (jobId) => {
    setQuickJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status: "Completed",
            paymentReleased: true,
          };
        }
        return j;
      })
    );
  };

  // 6. Reset all demo data
  const resetDemoData = () => {
    localStorage.removeItem("sahakari_workers");
    localStorage.removeItem("sahakari_bookings");
    localStorage.removeItem("sahakari_community_requests");
    localStorage.removeItem("sahakari_metrics");
    localStorage.removeItem("sahakari_users");
    localStorage.removeItem("sahakari_skill_swaps");
    localStorage.removeItem("sahakari_quick_jobs");
    localStorage.removeItem("sahakari_current_user");
    sessionStorage.removeItem("sahakari_current_user");
    setWorkers(INITIAL_WORKERS);
    setBookings(INITIAL_BOOKINGS);
    setCommunityRequests(INITIAL_COMMUNITY_REQUESTS);
    setMetrics(COOPERATIVE_METRICS);
    setUsers(INITIAL_USERS);
    setSkillSwaps(INITIAL_SKILL_SWAPS);
    setQuickJobs(INITIAL_QUICK_JOBS);
    setCurrentUser(null);
    setIsAuthOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        setCurrentUser,
        isAuthOpen,
        setIsAuthOpen,
        loginUser,
        registerUser,
        logoutUser,
        updateWorkerEshram,
        createSkillSwap,
        quickJobs,
        createQuickJob,
        verifyUserAadhaar,
        verifyVideoCallAgreement,
        completeAndReleaseQuickJobPayment,
        currentWorkerId,
        setCurrentWorkerId,
        currentWorker,
        services: SERVICES,
        workers,
        bookings,
        communityRequests,
        skillSwaps,
        announcements: COMMUNITY_ANNOUNCEMENTS,
        metrics,
        apiConnected,
        activeChatSession,
        setActiveChatSession,
        startChatSession,
        sendChatMessage,
        clearChatSession,
        markChatReadByWorker,
        submitBargainOffer,
        respondToBargainOffer,
        updateWorkerSettings,
        updateBookingEta,
        isMasterMode,
        isMasterConsoleOpen,
        setIsMasterConsoleOpen,
        masterActiveWorkerId,
        switchWorkerPersona,
        masterSendWorkerMessage,
        masterRespondBargain,
        loginAsMaster,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        completePayment,
        submitReview,
        createCommunityRequest,
        joinCommunityRequest,
        resetDemoData,
        proposals,
        castVote,
        purchaseMemberShare,
        upgradeBookingToFullRepair,
        societies,
        activeSocietyContext,
        setActiveSocietyContext,
        registerHousingSociety,
        openReceiptModal,
        closeReceiptModal,
        updateWorkerVerification,
        acceptBookingOffer,
        declineBookingOffer,
      }}
    >
      {children}
      <CooperativeReceiptModal
        isOpen={isReceiptOpen}
        onClose={closeReceiptModal}
        receiptData={receiptModalData}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

