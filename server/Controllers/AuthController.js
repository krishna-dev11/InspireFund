const asyncHandler = require('../Utils/asyncHandler');
const AuthService = require('../Services/AuthService');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, adminSecret } = req.body;

  const { user, token } = await AuthService.register({
    name,
    email,
    password,
    role,
    adminSecret
  });

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await AuthService.login({ email, password });

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  });
});

// 🔥 GOOGLE LOGIN
const googleLogin = asyncHandler(async (req, res) => {
  const { credential, role } = req.body;

  const { user, token } = await AuthService.googleLogin({
    credential,
    role
  });

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  });
});

module.exports = {
  register,
  login,
  googleLogin
};