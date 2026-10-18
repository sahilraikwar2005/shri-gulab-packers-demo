const express = require('express');
const router = express.Router();
const { create, list, getOne, update } = require('../controllers/quotationController');
const { protect } = require('../middleware/auth');
router.get('/', protect, list);
router.get('/:id', protect, getOne);
router.post('/', protect, create);
router.put('/:id', protect, update);
module.exports = router;