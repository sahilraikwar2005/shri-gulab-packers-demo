const express = require('express');
const router = express.Router();
const crud = require('../controllers/crudFactory');

const { protect } = require('../middleware/auth');
const c = crud('galleryImages', { searchFields: ['title', 'category'], sort: { order: 1 } });
router.get('/', c.list);
router.get('/:id', c.getOne);
router.post('/', protect, c.create);
router.put('/:id', protect, c.update);
router.delete('/:id', protect, c.remove);
module.exports = router;
