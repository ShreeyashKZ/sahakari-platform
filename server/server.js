import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Worker from "./models/Worker.js";
import Booking from "./models/Booking.js";
import CommunityRequest from "./models/CommunityRequest.js";
import {
  SERVICES,
  INITIAL_WORKERS,
  INITIAL_BOOKINGS,
  INITIAL_COMMUNITY_REQUESTS,
  COOPERATIVE_METRICS,
  COMMUNITY_ANNOUNCEMENTS,
  INITIAL_USERS,
} from "../src/data/mockData.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// In-Memory store fallback
let memUsers = [...INITIAL_USERS];
let memWorkers = [...INITIAL_WORKERS];
let memBookings = [...INITIAL_BOOKINGS];
let memRequests = [...INITIAL_COMMUNITY_REQUESTS];
let memMetrics = { ...COOPERATIVE_METRICS };
let isDbConnected = false;

// 0. AUTHENTICATION & USER MANAGEMENT (MongoDB Atlas + In-Memory Fallback)

// Register endpoint (User, Worker, or Skill Swap)
app.post("/api/auth/register", async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    role = "customer",
    address = "",
    trade = "",
    aadhaar = "",
    hasEshram = false,
    eshramNumber = "",
    hourlyRate = 350,
    experienceYears = 3,
    bio = "",
    avatar,
    offeredSkill = "",
    neededSkill = "",
    rememberMe = false,
  } = req.body;

  if (!name || !password || (!email && !phone)) {
    return res.status(400).json({ error: "Name, password, and at least email or phone are required." });
  }

  const cleanPhone = phone ? phone.replace(/[^\d]/g, "").slice(-10) : "";
  const cleanEmail = email ? email.trim().toLowerCase() : "";

  try {
    // Check if user already exists
    if (isDbConnected) {
      const existing = await User.findOne({
        $or: [
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
        ],
      });
      if (existing) {
        return res.status(400).json({ error: "An account with this email or mobile number already exists." });
      }
    } else {
      const existing = memUsers.find(
        (u) =>
          (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) ||
          (cleanPhone && u.phone && u.phone.slice(-10) === cleanPhone)
      );
      if (existing) {
        return res.status(400).json({ error: "An account with this email or mobile number already exists." });
      }
    }

    const userId = `usr-${Date.now()}`;
    const defaultAvatar =
      avatar ||
      (role === "worker"
        ? "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");

    const isEshramVerified = Boolean(hasEshram && eshramNumber && eshramNumber.trim().length >= 8);

    const newUser = {
      id: userId,
      name,
      email: cleanEmail,
      phone: cleanPhone || phone,
      password,
      role,
      avatar: defaultAvatar,
      address,
      trade,
      aadhaar: aadhaar ? `XXXX-XXXX-${aadhaar.slice(-4)}` : "",
      hasEshram: Boolean(hasEshram),
      eshramNumber: isEshramVerified ? eshramNumber.trim() : "",
      isEshramVerified,
      offeredSkill,
      neededSkill,
      rememberMe: Boolean(rememberMe),
      createdAt: new Date().toISOString(),
    };

    let createdWorker = null;

    // If registering as a worker, also create their public directory profile
    if (role === "worker") {
      const serviceObj = SERVICES.find((s) => s.id === trade) || SERVICES[0];
      const workerId = `w-${Date.now().toString().slice(-4)}`;

      createdWorker = {
        id: workerId,
        name,
        serviceId: serviceObj.id,
        serviceName: serviceObj.name,
        avatar: defaultAvatar,
        phone: cleanPhone || phone,
        rating: 5.0,
        reviewsCount: 0,
        completedJobs: 0,
        distanceKm: 1.5,
        hourlyRate: Number(hourlyRate) || 350,
        priceRange: `₹${Number(hourlyRate) || 350} – ₹${(Number(hourlyRate) || 350) + 250}`,
        experienceYears: Number(experienceYears) || 2,
        availability: "Available Now",
        isAvailable: true,
        verificationStatus: {
          identity: true,
          skill: true,
          profile: true,
          isVerified: true,
          label: isEshramVerified ? "Cooperative & e-Shram Verified" : "Cooperative Registered (Pending e-Shram)",
        },
        skills: [serviceObj.name, "Emergency Callout", "Co-op Certified"],
        languages: ["Hindi", "English", "Local Language"],
        serviceArea: address ? `${address} (Within 5 km)` : "Local Neighborhood",
        bio: bio || `Dedicated ${serviceObj.name} professional. Member of Sahakari Workers Collective.`,
        reviews: [],
        aadhaar: aadhaar ? `XXXX-XXXX-${aadhaar.slice(-4)}` : "Verified",
        address,
        email: cleanEmail,
        password,
        hasEshram: Boolean(hasEshram),
        eshramNumber: isEshramVerified ? eshramNumber.trim() : "",
        isEshramVerified,
        earnings: { today: 0, thisWeek: 0, thisMonth: 0, allTime: 0 },
      };

      if (isDbConnected) {
        await Worker.create(createdWorker);
      } else {
        memWorkers = [createdWorker, ...memWorkers];
      }
    }

    if (isDbConnected) {
      await User.create(newUser);
    } else {
      memUsers = [newUser, ...memUsers];
    }

    // Never return password in client response
    const { password: _, ...safeUser } = newUser;
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: safeUser,
      workerProfile: createdWorker,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: err.message || "Failed to register account" });
  }
});

// Login endpoint (Email or Mobile + Password)
app.post("/api/auth/login", async (req, res) => {
  const { identifier, password, role, rememberMe } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: "Please enter your email or mobile number and password." });
  }

  const cleanIdent = identifier.trim().toLowerCase();
  const cleanPhoneIdent = identifier.replace(/[^\d]/g, "").slice(-10);

  try {
    let matchedUser = null;

    if (isDbConnected) {
      matchedUser = await User.findOne({
        $or: [
          { email: cleanIdent },
          ...(cleanPhoneIdent ? [{ phone: cleanPhoneIdent }] : []),
        ],
      });
    } else {
      matchedUser = memUsers.find(
        (u) =>
          (u.email && u.email.toLowerCase() === cleanIdent) ||
          (cleanPhoneIdent && u.phone && u.phone.slice(-10) === cleanPhoneIdent)
      );
    }

    if (!matchedUser) {
      return res.status(401).json({ error: "No account found with this email or mobile number." });
    }

    if (matchedUser.password !== password) {
      return res.status(401).json({ error: "Incorrect password. Please try again." });
    }

    // Role check / override if requested
    const effectiveRole = role || matchedUser.role;

    let workerProfile = null;
    if (effectiveRole === "worker" || matchedUser.role === "worker") {
      if (isDbConnected) {
        workerProfile = await Worker.findOne({
          $or: [{ phone: matchedUser.phone }, { email: matchedUser.email }, { name: matchedUser.name }],
        });
      } else {
        workerProfile = memWorkers.find(
          (w) =>
            (w.phone && matchedUser.phone && w.phone.slice(-10) === matchedUser.phone.slice(-10)) ||
            (w.email && matchedUser.email && w.email.toLowerCase() === matchedUser.email.toLowerCase()) ||
            w.name.toLowerCase() === matchedUser.name.toLowerCase()
        );
      }
    }

    const { password: _, ...safeUser } = matchedUser.toObject ? matchedUser.toObject() : matchedUser;
    safeUser.rememberMe = rememberMe !== undefined ? rememberMe : safeUser.rememberMe;

    res.json({
      success: true,
      message: `Welcome back, ${safeUser.name}!`,
      user: safeUser,
      workerProfile,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message || "Failed to log in" });
  }
});

// Get registered users (For platform metrics & admin)
app.get("/api/auth/users", async (req, res) => {
  try {
    const list = isDbConnected ? await User.find({}, "-password") : memUsers.map(({ password, ...u }) => u);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1. System Health & Database Status
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    platform: "Sahakari Digital Cooperative API",
    database: isDbConnected ? "MongoDB Atlas (Connected)" : "In-Memory Autonomous Engine",
    timestamp: new Date().toISOString(),
  });
});

// 2. Services List
app.get("/api/services", (req, res) => {
  res.json(SERVICES);
});

// 3. Workers - Get all with smart ranking query
app.get("/api/workers", async (req, res) => {
  const { service, distance, minRating } = req.query;
  try {
    let result = isDbConnected ? await Worker.find({}) : [...memWorkers];

    if (service) {
      result = result.filter((w) => w.serviceId === service);
    }
    if (minRating) {
      result = result.filter((w) => w.rating >= Number(minRating));
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Bookings - Get all
app.get("/api/bookings", async (req, res) => {
  try {
    const result = isDbConnected ? await Booking.find({}).sort({ createdAt: -1 }) : memBookings;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Create Booking
app.post("/api/bookings", async (req, res) => {
  try {
    const newBooking = {
      id: `SHK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: "cust-1",
      customerName: "Vikram Malhotra",
      customerPhone: "+91 98450 12345",
      serviceOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      status: "Requested",
      paymentStatus: "Pending",
      createdAt: new Date().toISOString(),
      ...req.body,
    };

    if (isDbConnected) {
      const created = await Booking.create(newBooking);
      return res.status(201).json(created);
    } else {
      memBookings = [newBooking, ...memBookings];
      return res.status(201).json(newBooking);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Update Booking Status (Requested -> Accepted -> Service Started -> Completed)
app.patch("/api/bookings/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (isDbConnected) {
      const updated = await Booking.findOneAndUpdate({ id }, { status }, { new: true });
      return res.json(updated);
    } else {
      memBookings = memBookings.map((b) => (b.id === id ? { ...b, status } : b));
      const target = memBookings.find((b) => b.id === id);
      return res.json(target);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Complete Payment & Disburse Earnings
app.post("/api/bookings/:id/pay", async (req, res) => {
  const { id } = req.params;
  try {
    let booking = isDbConnected ? await Booking.findOne({ id }) : memBookings.find((b) => b.id === id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.paymentStatus = "Paid";
    booking.status = "Completed";

    if (isDbConnected) {
      await booking.save();
      // Update worker earnings in DB
      await Worker.findOneAndUpdate(
        { id: booking.workerId },
        {
          $inc: {
            completedJobs: 1,
            "earnings.today": booking.workerPayout,
            "earnings.thisWeek": booking.workerPayout,
            "earnings.thisMonth": booking.workerPayout,
            "earnings.allTime": booking.workerPayout,
          },
        }
      );
    } else {
      memBookings = memBookings.map((b) => (b.id === id ? { ...b, paymentStatus: "Paid", status: "Completed" } : b));
      memWorkers = memWorkers.map((w) => {
        if (w.id === booking.workerId) {
          return {
            ...w,
            completedJobs: w.completedJobs + 1,
            earnings: {
              today: w.earnings.today + booking.workerPayout,
              thisWeek: w.earnings.thisWeek + booking.workerPayout,
              thisMonth: w.earnings.thisMonth + booking.workerPayout,
              allTime: w.earnings.allTime + booking.workerPayout,
            },
          };
        }
        return w;
      });
    }

    res.json({ message: "Payment processed successfully", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Rate & Review
app.post("/api/bookings/:id/review", async (req, res) => {
  const { id } = req.params;
  const { rating, review, tags } = req.body;

  try {
    if (isDbConnected) {
      const updated = await Booking.findOneAndUpdate(
        { id },
        { rating, review, reviewTags: tags },
        { new: true }
      );
      return res.json(updated);
    } else {
      memBookings = memBookings.map((b) =>
        b.id === id ? { ...b, rating, review, reviewTags: tags } : b
      );
      return res.json(memBookings.find((b) => b.id === id));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Community Maintenance Tasks (RWA)
app.get("/api/community-requests", async (req, res) => {
  try {
    const result = isDbConnected ? await CommunityRequest.find({}) : memRequests;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/community-requests", async (req, res) => {
  try {
    const newReq = {
      id: `CR-${Math.floor(100 + Math.random() * 900)}`,
      status: "Open for Collective",
      assignedWorkerIds: [],
      cooperativeBonus: "₹300 community welfare contribution included",
      ...req.body,
    };

    if (isDbConnected) {
      const created = await CommunityRequest.create(newReq);
      return res.status(201).json(created);
    } else {
      memRequests = [newReq, ...memRequests];
      return res.status(201).json(newReq);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Overall Cooperative Metrics
app.get("/api/metrics", (req, res) => {
  res.json(memMetrics);
});

// Initialize server and connect to MongoDB
const startServer = async () => {
  isDbConnected = await connectDB();
  app.listen(PORT, () => {
    console.log(`[Sahakari API] Server running live on http://localhost:${PORT}`);
  });
};

startServer();
