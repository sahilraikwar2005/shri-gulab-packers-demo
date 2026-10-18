const express = require('express');
const router = express.Router();
const { exportInquiriesCsv } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
router.get('/inquiries.csv', protect, exportInquiriesCsv);
module.exports = router;