const express = require('express');
const router = express.Router();
const { get, update } = require('../controllers/siteSettingController');
const { protect } = require('../middleware/auth');

router.get('/', get);
router.put('/', protect, update);

module.exports = router;