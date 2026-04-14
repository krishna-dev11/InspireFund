const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const ApiError = require('../Utils/ApiError');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');

  const expiresIn = process.env.JWT_EXPIRES || '7d';

  return jwt.sign(
    { id: user._id, role: user.role },
    secret,
    { expiresIn }
  );
};

// ✅ REGISTER
const register = async ({ name, email, password, role = 'user', adminSecret }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already in use');

  let finalRole = role || 'user';

  // 🔐 ADMIN SECRET CHECK
  if (finalRole === 'admin') {
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      throw new ApiError(403, 'Invalid admin secret key');
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    role: finalRole
  });

  const token = signToken(user);

  return { user, token };
};

// ✅ LOGIN
const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');

  const token = signToken(user);

  return { user, token };
};

// 🔥 GOOGLE LOGIN
const googleLogin = async ({ credential, role = 'user' }) => {
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();

  const { email, name } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      password: Math.random().toString(36), // dummy password
      role
    });
  }

  const token = signToken(user);

  return { user, token };
};

module.exports = {
  register,
  login,
  googleLogin
};