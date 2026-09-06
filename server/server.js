import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
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
} from "../src/data/mockData.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// In-Memory store fallback
let memWorkers = [...INITIAL_WORKERS];
let memBookings = [...INITIAL_BOOKINGS];
let memRequests = [...INITIAL_COMMUNITY_REQUESTS];
let memMetrics = { ...COOPERATIVE_METRICS };
let isDbConnected = false;

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
