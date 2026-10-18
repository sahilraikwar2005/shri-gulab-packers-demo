const express = require('express');
const router = express.Router();
const { getStatus, configure, fetchGoogle } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
router.get('/', protect, getStatus);
router.put('/config', protect, configure);
router.post('/fetch', protect, fetchGoogle);
module.exports = router;