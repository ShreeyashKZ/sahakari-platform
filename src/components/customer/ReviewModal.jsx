import React, { useState } from "react";
import { Star, Check, X, ThumbsUp, Heart } from "lucide-react";

export const ReviewModal = ({ isOpen, onClose, booking, onSubmitReview }) => {
  if (!isOpen || !booking) return null;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState(
    "Imran arrived promptly, diagnosed the dripping tap quickly, and charged fair cooperative rates. Extremely polite and clean work!"
  );
  const [selectedTags, setSelectedTags] = useState([
    "Punctual Arrival",
    "Fair & Transparent",
    "Polite Demeanour",
  ]);

  const availableTags = [
    "Punctual Arrival",
    "Fair & Transparent",
    "Polite Demeanour",
    "High Quality Work",
    "Cleaned Worksite",
    "Safety Compliant",
  ];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReview(booking.id, rating, comment, selectedTags);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2 font-bold text-xl">
            ⭐
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">
            Rate Your Cooperative Service
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your review builds {booking.workerName}'s portable cooperative reputation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Star selector */}
          <div className="flex flex-col items-center justify-center gap-1.5 py-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-100 text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700">
              {rating === 5
                ? "5.0 - Exceptional Service!"
                : rating === 4
                ? "4.0 - Very Good"
                : `${rating}.0 Stars`}
            </span>
          </div>

          {/* Quick Tag Badges */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Compliments for Worker
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition ${
                      active
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text feedback */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Feedback
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-emerald-600"
              placeholder="Tell other households about the workmanship..."
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Skip
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition"
            >
              Submit 5★ Review →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
