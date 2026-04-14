const express = require('express');
const { body } = require('express-validator');
const PaymentController = require('../Controllers/PaymentController');
const validate = require('../Middlewares/validate');
const { requireAuth } = require('../Middlewares/auth');
const { requirePlatformActive } = require('../Middlewares/platform');

const router = express.Router();

router.post(
  '/create-order',
  requireAuth,
  requirePlatformActive,
  [
    body('campaignId').isMongoId(),
    body('amount').isNumeric().toFloat().custom((v) => v > 0)
  ],
  validate,
  PaymentController.createOrder
);

router.post(
  '/verify',
  requireAuth,
  [
    body('razorpay_order_id').notEmpty(),
    body('razorpay_payment_id').notEmpty(),
    body('razorpay_signature').notEmpty()
  ],
  validate,
  PaymentController.verifyPayment
);

module.exports = router;
