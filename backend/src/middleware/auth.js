const jwt = require('jsonwebtoken');
const db = require('../storage/jsonDb');

function getToken(req) {
  if (req.cookies && req.cookies.me_token) return req.cookies.me_token;
  const h = req.headers.authorization;
  if (h && h.startsWith('Bearer ')) return h.slice(7);
  return null;
}

async function protect(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.findById('adminUsers', decoded.id);
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'User inactive' });
    delete user.passwordHash;
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
  };
}

function requirePermission(perm) {
  return (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') return next();
    if (req.user && (req.user.permissions || []).includes(perm)) return next();
    return res.status(403).json({ success: false, message: 'Missing permission' });
  };
}

module.exports = { protect, authorize, requirePermission };