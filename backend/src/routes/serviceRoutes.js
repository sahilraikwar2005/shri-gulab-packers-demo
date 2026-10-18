const express = require('express');
const router = express.Router();
const crud = require('../controllers/crudFactory');
const Service = 'services';
const { protect } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const c = crud('services', { searchFields: ['title', 'shortDescription'], sort: { order: 1, createdAt: -1 } });

router.get('/slug/:slug', asyncHandler(async (req, res) => {
  const items = await require('../storage/jsonDb').list('services', {}); const item = items.data.find((i) => i.slug === req.params.slug);
  if (!item) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: item });
}));
router.get('/', c.list);
router.get('/:id', c.getOne);
router.post('/', protect, c.create);
router.put('/:id', protect, c.update);
router.delete('/:id', protect, c.remove);

module.exports = router;
