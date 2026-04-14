const express = require('express');
const { body, param } = require('express-validator');
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

// 🔥 NEW ROUTES

router.get(
  '/pending-campaigns',
  requireAuth,
  requireAdmin,
  AdminController.getPendingCampaigns
);

router.patch(
  '/approve/:id',
  requireAuth,
  requireAdmin,
  [param('id').isMongoId()],
  validate,
  AdminController.approveCampaign
);

router.patch(
  '/reject/:id',
  requireAuth,
  requireAdmin,
  [param('id').isMongoId()],
  validate,
  AdminController.rejectCampaign
);

router.get('/settings', requireAuth, requireAdmin, AdminController.getPlatformSettings);

router.patch(
  '/settings',
  requireAuth,
  requireAdmin,
  [body('isPaused').isBoolean()],
  validate,
  AdminController.updatePlatformSettings
);

module.exports = router;
