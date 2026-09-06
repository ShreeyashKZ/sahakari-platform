import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SERVICES,
  INITIAL_WORKERS,
  INITIAL_BOOKINGS,
  INITIAL_COMMUNITY_REQUESTS,
  COMMUNITY_ANNOUNCEMENTS,
  COOPERATIVE_METRICS,
} from "../data/mockData";

const AppContext = createContext();
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    return localStorage.getItem("sahakari_role") || "customer";
  });

  const [currentWorkerId, setCurrentWorkerId] = useState("w-imran");

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
        // Backend offline or running standalone frontend, fallback seamlessly
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

  // 6. Reset all demo data
  const resetDemoData = () => {
    localStorage.removeItem("sahakari_workers");
    localStorage.removeItem("sahakari_bookings");
    localStorage.removeItem("sahakari_community_requests");
    localStorage.removeItem("sahakari_metrics");
    setWorkers(INITIAL_WORKERS);
    setBookings(INITIAL_BOOKINGS);
    setCommunityRequests(INITIAL_COMMUNITY_REQUESTS);
    setMetrics(COOPERATIVE_METRICS);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentWorkerId,
        setCurrentWorkerId,
        currentWorker,
        services: SERVICES,
        workers,
        bookings,
        communityRequests,
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
