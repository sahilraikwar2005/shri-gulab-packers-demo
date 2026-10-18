const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../storage/jsonDb');

function setCookie(res, token) {
  res.cookie('me_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
  const users = await db.list('adminUsers', { email: (email || '').toLowerCase() });
  const user = users.data[0];
  if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  setCookie(res, token);
  res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, permissions: user.permissions } });
};

const logout = async (req, res) => {
  res.clearCookie('me_token');
  res.json({ success: true });
};

const me = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { login, logout, me };