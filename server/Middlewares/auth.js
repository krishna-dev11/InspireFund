const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const ApiError = require('../Utils/ApiError');

const requireAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Missing token');

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new ApiError(500, 'JWT_SECRET is not configured');

    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('name email role');
    if (!user) throw new ApiError(401, 'Invalid token');

    req.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    return next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    return next(new ApiError(401, 'Invalid token'));
  }
};

const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new ApiError(403, 'Admin access required'));
  }
  return next();
};

module.exports = {
  requireAuth,
  requireAdmin
};
