const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    state: String,
    pincodes: [String],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Location', LocationSchema);