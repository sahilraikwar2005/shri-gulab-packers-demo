const bcrypt = require('bcryptjs');
const db = require('../storage/jsonDb');
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/logActivity');

const safe = (u) => { if (!u) return u; const { passwordHash, ...rest } = u; return rest; };

const list = asyncHandler(async (req, res) => {
  const result = await db.list('adminUsers', {}, { limit: 1000, sort: { createdAt: -1 } });
  res.json({ success: true, data: result.data.map(safe) });
});

const create = asyncHandler(async (req, res) => {
  const { name, email, password, role, permissions } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.create('adminUsers', { name, email: (email || '').toLowerCase(), passwordHash, role: role || 'staff', permissions: permissions || [], isActive: true });
  await logActivity(req, 'create admin user', 'AdminUser', user._id);
  res.status(201).json({ success: true, data: safe(user) });
});

const update = asyncHandler(async (req, res) => {
  const { name, role, permissions, isActive, password } = req.body;
  const user = await db.findById('adminUsers', req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'Not found' });
  const patch = {};
  if (name) patch.name = name;
  if (role) patch.role = role;
  if (permissions) patch.permissions = permissions;
  if (isActive !== undefined) patch.isActive = isActive;
  if (password) patch.passwordHash = await bcrypt.hash(password, 10);
  const updated = await db.update('adminUsers', req.params.id, patch);
  await logActivity(req, 'update admin user', 'AdminUser', updated._id);
  res.json({ success: true, data: safe(updated) });
});

const remove = asyncHandler(async (req, res) => {
  const ok = await db.remove('adminUsers', req.params.id);
  if (!ok) return res.status(404).json({ success: false, message: 'Not found' });
  await logActivity(req, 'delete admin user', 'AdminUser', req.params.id);
  res.json({ success: true });
});

module.exports = { list, create, update, remove };