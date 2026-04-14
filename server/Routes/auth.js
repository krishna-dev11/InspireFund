const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../Controllers/AuthController');
const validate = require('../Middlewares/validate');

const router = express.Router();

// REGISTER
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['user', 'creator', 'admin']),
    body('adminSecret').optional().isString()
  ],
  validate,
  AuthController.register
);

// LOGIN
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  AuthController.login
);

// 🔥 GOOGLE LOGIN
router.post(
  '/google',
  [
    body('credential').notEmpty(),
    body('role').optional().isIn(['user', 'creator', 'admin'])
  ],
  validate,
  AuthController.googleLogin
);

module.exports = router;