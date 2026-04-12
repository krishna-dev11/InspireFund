const express = require('express');
const { body } = require('express-validator');
const AdminController = require('../Controllers/AdminController');
const validate = require('../Middlewares/validate');
const { requireAuth, requireAdmin } = require('../Middlewares/auth');

const router = express.Router();

router.get('/stats', requireAuth, requireAdmin, AdminController.getStats);

router.post(
  '/withdraw',
  requireAuth,
  requireAdmin,
  [body('amount').isNumeric().toFloat().custom((v) => v > 0)],
  validate,
  AdminController.withdraw
);

module.exports = router;
