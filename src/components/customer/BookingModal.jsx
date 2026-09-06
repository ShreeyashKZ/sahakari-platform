import React, { useState } from "react";
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Info,
  CheckCircle2
} from "lucide-react";

export const BookingModal = ({ isOpen, onClose, worker, onConfirmBooking }) => {
  if (!isOpen || !worker) return null;

  const [date, setDate] = useState("Today");
  const [timeSlot, setTimeSlot] = useState("04:30 PM - 05:30 PM");
  const [address, setAddress] = useState(
    "Flat 402, Shanti Vihar Apts, 12th Main, Indiranagar, Bengaluru"
  );
  const [description, setDescription] = useState(
    "Kitchen sink tap leaking continuously from base valve. Need urgent replacement."
  );

  const serviceCharge = worker.hourlyRate || 450;
  const platformFee = 25; // Transparent cooperative fee
  const total = serviceCharge + platformFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmBooking({
      workerId: worker.id,
      workerName: worker.name,
      workerAvatar: worker.avatar,
      workerPhone: worker.phone,
      serviceId: worker.serviceId,
      serviceName: worker.serviceName,
      date,
      timeSlot,
      address,
      description,
      serviceCharge,
      platformFee,
      totalAmount: total,
      workerPayout: serviceCharge,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <img
            src={worker.avatar}
            alt={worker.name}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
          />
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Book {worker.name}
            </h3>
            <p className="text-xs text-slate-500">{worker.serviceName} • {worker.distanceKm} km away</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Service Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Date
              </label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 bg-slate-50"
              >
                <option value="Today">Today (Fast Dispatch)</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="In 2 Days">In 2 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600 bg-slate-50"
              >
                <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM (Immediate)</option>
                <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              </select>
            </div>
          </div>

          {/* Service Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Service Address
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600"
              placeholder="House/Flat number, Society name, Area..."
            />
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-emerald-600" /> Problem Description
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600"
              placeholder="Describe the leak, electrical issue, or task in brief..."
            />
          </div>

          {/* Transparent Cooperative Pricing Breakdown */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between font-medium text-slate-600">
              <span>Standard Service Fare:</span>
              <span className="font-semibold text-slate-900">₹{serviceCharge}</span>
            </div>
            <div className="flex items-center justify-between font-medium text-slate-600">
              <span className="flex items-center gap-1">
                Cooperative Platform & Welfare Pool:
                <Info className="w-3 h-3 text-slate-400" />
              </span>
              <span className="font-semibold text-slate-900">₹{platformFee}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-extrabold text-slate-900">
              <span>Total Payable Amount:</span>
              <span className="text-emerald-700 font-mono text-base">₹{total}</span>
            </div>

            <div className="mt-2 bg-emerald-100/60 p-2.5 rounded-xl text-[11px] text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>100% Transparent:</strong> Worker receives the full ₹{serviceCharge} directly. Zero middleman cuts!
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition"
            >
              Confirm Booking (Demo) →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
