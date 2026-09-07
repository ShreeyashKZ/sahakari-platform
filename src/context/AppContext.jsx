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
} from "../data/mockData";

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
    return localStorage.getItem("sahakari_worker_id") || "w-imran";
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("sahakari_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem("sahakari_workers");
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
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

  const [metrics, setMetrics] = useState(() => {
    const saved = localStorage.getItem("sahakari_metrics");
    return saved ? JSON.parse(saved) : COOPERATIVE_METRICS;
  });

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

    // Optimistic UI update
    setBookings((prev) => [newBooking, ...prev]);

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
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );

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

  // 3. Complete payment for booking
  const completePayment = async (bookingId) => {
    let updatedBooking = null;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          updatedBooking = { ...b, paymentStatus: "Paid", status: "Completed" };
          return updatedBooking;
        }
        return b;
      })
    );

    if (updatedBooking) {
      // Update worker earnings locally
      setWorkers((prev) =>
        prev.map((w) => {
          if (w.id === updatedBooking.workerId) {
            return {
              ...w,
              completedJobs: w.completedJobs + 1,
              earnings: {
                today: w.earnings.today + updatedBooking.workerPayout,
                thisWeek: w.earnings.thisWeek + updatedBooking.workerPayout,
                thisMonth: w.earnings.thisMonth + updatedBooking.workerPayout,
                allTime: w.earnings.allTime + updatedBooking.workerPayout,
              },
            };
          }
          return w;
        })
      );

      // Update Community metrics
      setMetrics((prev) => {
        const currentInt = parseInt(prev.totalPaidToWorkers.replace(/[^\d]/g, ""), 10) || 348200;
        const newTotal = currentInt + updatedBooking.workerPayout;
        const currentWelfare = parseInt(prev.welfarePoolBalance.replace(/[^\d]/g, ""), 10) || 17100;
        const newWelfare = currentWelfare + 15;

        return {
          ...prev,
          jobsCompleted: prev.jobsCompleted + 1,
          totalPaidToWorkers: `₹${newTotal.toLocaleString("en-IN")}`,
          welfarePoolBalance: `₹${newWelfare.toLocaleString("en-IN")}`,
        };
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
    let bookedWorkerId = null;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          bookedWorkerId = b.workerId;
          return { ...b, rating, review: reviewText, reviewTags: tags };
        }
        return b;
      })
    );

    if (bookedWorkerId) {
      setWorkers((prev) =>
        prev.map((w) => {
          if (w.id === bookedWorkerId) {
            const newCount = w.reviewsCount + 1;
            const newRating = Number(((w.rating * w.reviewsCount + rating) / newCount).toFixed(1));
            return {
              ...w,
              rating: newRating,
              reviewsCount: newCount,
              reviews: [
                {
                  id: `r-${Date.now()}`,
                  customerName: "Vikram Malhotra",
                  rating,
                  date: "Just now",
                  comment: reviewText,
                  tags,
                },
                ...w.reviews,
              ],
            };
          }
          return w;
        })
      );

      if (apiConnected) {
        try {
          await fetch(`${API_URL}/api/bookings/${bookingId}/review`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating, review: reviewText, tags }),
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
    setCommunityRequests((prev) => [newReq, ...prev]);

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

  // 6. Reset all demo data
  const resetDemoData = () => {
    localStorage.removeItem("sahakari_workers");
    localStorage.removeItem("sahakari_bookings");
    localStorage.removeItem("sahakari_community_requests");
    localStorage.removeItem("sahakari_metrics");
    localStorage.removeItem("sahakari_users");
    localStorage.removeItem("sahakari_skill_swaps");
    localStorage.removeItem("sahakari_current_user");
    sessionStorage.removeItem("sahakari_current_user");
    setWorkers(INITIAL_WORKERS);
    setBookings(INITIAL_BOOKINGS);
    setCommunityRequests(INITIAL_COMMUNITY_REQUESTS);
    setMetrics(COOPERATIVE_METRICS);
    setUsers(INITIAL_USERS);
    setSkillSwaps(INITIAL_SKILL_SWAPS);
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
        createBooking,
        updateBookingStatus,
        completePayment,
        submitReview,
        createCommunityRequest,
        resetDemoData,
      }}
    >
      {children}
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

