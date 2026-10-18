const express = require('express');
const router = express.Router();
const { create, list, getOne, update } = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');

router.post('/', create); // public
router.get('/', protect, list);
router.get('/:id', protect, getOne);
router.put('/:id', protect, update);

module.exports = router;