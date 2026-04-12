const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const ApiError = require('../Utils/ApiError');

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  const expiresIn = process.env.JWT_EXPIRES || '7d';
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn });
};

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already in use');
  const user = await User.create({ name, email, password });
  const token = signToken(user);
  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid credentials');
  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');
  const token = signToken(user);
  return { user, token };
};

module.exports = {
  register,
  login
};
