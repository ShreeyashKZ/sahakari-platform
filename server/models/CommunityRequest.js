import mongoose from "mongoose";

const communityRequestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    societyName: { type: String, required: true },
    location: String,
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    workersNeeded: { type: Number, default: 1 },
    assignedWorkerIds: [String],
    budget: { type: String, required: true },
    dateScheduled: String,
    status: {
      type: String,
      enum: ["In Progress", "Open for Collective", "Completed"],
      default: "Open for Collective",
    },
    cooperativeBonus: String,
  },
  { timestamps: true }
);

export default mongoose.models.CommunityRequest ||
  mongoose.model("CommunityRequest", communityRequestSchema);
