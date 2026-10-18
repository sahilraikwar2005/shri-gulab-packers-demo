const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    actorEmail: String,
    action: { type: String, required: true },
    entityType: String,
    entityId: String,
    meta: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);