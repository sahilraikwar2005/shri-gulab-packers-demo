const ActivityLog = require('../models/ActivityLog');

async function logActivity(req, action, entityType, entityId, meta) {
  try {
    await ActivityLog.create({
      actor: req.user?._id,
      actorEmail: req.user?.email,
      action,
      entityType,
      entityId,
      meta,
    });
  } catch (e) {
    // non-blocking
  }
}

module.exports = logActivity;