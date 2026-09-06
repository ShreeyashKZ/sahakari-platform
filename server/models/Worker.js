import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true },
    avatar: String,
    phone: String,
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    distanceKm: { type: Number, default: 2.0 },
    hourlyRate: { type: Number, required: true },
    priceRange: String,
    experienceYears: Number,
    availability: String,
    isAvailable: { type: Boolean, default: true },
    verificationStatus: {
      identity: Boolean,
      skill: Boolean,
      profile: Boolean,
      isVerified: Boolean,
      label: String,
    },
    skills: [String],
    languages: [String],
    serviceArea: String,
    bio: String,
    reviews: [
      {
        id: String,
        customerName: String,
        rating: Number,
        date: String,
        comment: String,
        tags: [String],
      },
    ],
    earnings: {
      today: { type: Number, default: 0 },
      thisWeek: { type: Number, default: 0 },
      thisMonth: { type: Number, default: 0 },
      allTime: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Worker || mongoose.model("Worker", workerSchema);
