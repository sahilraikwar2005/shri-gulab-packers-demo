const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: String,
    rating: { type: Number, min: 1, max: 5, default: 5 },
    text: { type: String, required: true },
    source: { type: String, enum: ['manual', 'google'], default: 'manual' },
    googleReviewId: String,
    isVerified: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', TestimonialSchema);