const db = require('../storage/jsonDb');
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/logActivity');

function crudController(collectionName, options = {}) {
  const list = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50, search, ...filters } = req.query;
    const query = {};
    if (options.publicFilter) Object.assign(query, options.publicFilter(req));
    Object.keys(filters).forEach((k) => {
      if (filters[k] !== undefined && filters[k] !== '') query[k] = filters[k];
    });
    if (search && options.searchFields) {
      query.$or = options.searchFields.map((f) => ({ [f]: { $regex: search, $options: 'i' } }));
    }
    const result = await db.list(collectionName, query, { page: Number(page), limit: Number(limit), sort: options.sort || { createdAt: -1 } });
    res.json({ success: true, data: result.data, pagination: { page: Number(page), limit: Number(limit), total: result.total, pages: Math.ceil(result.total / Number(limit)) } });
  });

  const getOne = asyncHandler(async (req, res) => {
    const item = await db.findById(collectionName, req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  });

  const create = asyncHandler(async (req, res) => {
    const item = await db.create(collectionName, req.body);
    await logActivity(req, `create ${collectionName}`, collectionName, item._id);
    res.status(201).json({ success: true, data: item });
  });

  const update = asyncHandler(async (req, res) => {
    const item = await db.update(collectionName, req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    await logActivity(req, `update ${collectionName}`, collectionName, item._id);
    res.json({ success: true, data: item });
  });

  const remove = asyncHandler(async (req, res) => {
    const ok = await db.remove(collectionName, req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Not found' });
    await logActivity(req, `delete ${collectionName}`, collectionName, req.params.id);
    res.json({ success: true });
  });

  return { list, getOne, create, update, remove };
}

module.exports = crudController;