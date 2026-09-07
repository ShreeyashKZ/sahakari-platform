import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, sparse: true },
    phone: { type: String, sparse: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "worker", "skill_swap", "admin", "master"],
      default: "customer",
    },
    avatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
    address: { type: String, default: "" },
    // Worker specific fields stored on user profile for quick lookup
    trade: { type: String, default: "" },
    aadhaar: { type: String, default: "" },
    hasEshram: { type: Boolean, default: false },
    eshramNumber: { type: String, default: "" },
    isEshramVerified: { type: Boolean, default: false },
    // Skill Swap specific fields
    offeredSkill: { type: String, default: "" },
    neededSkill: { type: String, default: "" },
    timeCredits: { type: Number, default: 3 },
    rememberMe: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
