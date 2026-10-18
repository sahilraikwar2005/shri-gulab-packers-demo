const express = require('express');
const router = express.Router();
const db = require('../storage/jsonDb');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
router.get('/', protect, asyncHandler(async (req, res) => {
  const result = await db.list('activityLogs', {}, { sort: { createdAt: -1 }, limit: 200 });
  res.json({ success: true, data: result.data });
}));
module.exports = router;