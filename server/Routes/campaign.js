const express = require('express');
const { body, query, param } = require('express-validator');
const CampaignController = require('../Controllers/CampaignController');
const validate = require('../Middlewares/validate');
const { requireAuth } = require('../Middlewares/auth');

const router = express.Router();

router.post(
  '/create',
  requireAuth,
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('targetAmount').isNumeric().toFloat(),
    body('deadline').optional().isISO8601(),
    body('durationDays').optional().isNumeric().toInt(),
    body('image').optional().isString(),
    body('tags').optional().isArray()
  ],
  validate,
  CampaignController.createCampaign
);

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

router.get(
  '/:id',
  [param('id').isMongoId()],
  validate,
  CampaignController.getCampaignById
);

router.get(
  '/:id/contributions',
  [param('id').isMongoId()],
  validate,
  CampaignController.getCampaignContributions
);

module.exports = router;
