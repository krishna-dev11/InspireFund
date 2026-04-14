const express = require('express');
const { body, query, param } = require('express-validator');
const CampaignController = require('../Controllers/CampaignController');
const validate = require('../Middlewares/validate');
const { requireAuth } = require('../Middlewares/auth');
const upload = require('../Middlewares/upload');

const router = express.Router();

// CREATE
router.post(
  '/create',
  requireAuth,
  upload.single('image'),
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('targetAmount').isNumeric().toFloat(),
    body('deadline').optional().isISO8601(),
    body('durationDays').optional().isNumeric().toInt(),
    body('tags').optional().isArray()
  ],
  validate,
  CampaignController.createCampaign
);

// UPDATE 🔥
router.put(
  '/update/:id',
  requireAuth,
  upload.single('image'),
  [param('id').isMongoId()],
  validate,
  CampaignController.updateCampaign
);

// DELETE 🔥
router.delete(
  '/delete/:id',
  requireAuth,
  [param('id').isMongoId()],
  validate,
  CampaignController.deleteCampaign
);

// GET ALL
router.get(
  '/all',
  [
    query('page').optional().isNumeric(),
    query('limit').optional().isNumeric(),
    query('search').optional().isString(),
    query('category').optional().isString(),
    query('sort').optional().isString()
  ],
  validate,
  CampaignController.getCampaigns
);

// GET ONE
router.get(
  '/:id',
  [param('id').isMongoId()],
  validate,
  CampaignController.getCampaignById
);

// CONTRIBUTIONS
router.get(
  '/:id/contributions',
  [param('id').isMongoId()],
  validate,
  CampaignController.getCampaignContributions
);

module.exports = router;