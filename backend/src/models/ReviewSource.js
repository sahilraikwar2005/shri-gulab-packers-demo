const mongoose = require('mongoose');

const ReviewSourceSchema = new mongoose.Schema(
  {
    provider: { type: String, default: 'google' },
    placeId: String,
    apiKeyConfigured: { type: Boolean, default: false },
    lastFetchedAt: Date,
    status: { type: String, default: 'not_configured' },
    meta: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReviewSource', ReviewSourceSchema);