import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    customerId: { type: String, default: "cust-1" },
    customerName: { type: String, required: true },
    customerPhone: String,
    address: { type: String, required: true },
    workerId: { type: String, required: true },
    workerName: { type: String, required: true },
    workerAvatar: String,
    workerPhone: String,
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true },
    description: { type: String, required: true },
    date: String,
    timeSlot: String,
    serviceCharge: { type: Number, required: true },
    platformFee: { type: Number, default: 25 },
    totalAmount: { type: Number, required: true },
    workerPayout: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Requested", "Accepted", "On the way", "Service Started", "Completed", "Rejected"],
      default: "Requested",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    serviceOtp: { type: String, required: true },
    rating: { type: Number, default: null },
    review: { type: String, default: null },
    reviewTags: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
