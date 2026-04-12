const asyncHandler = require('../Utils/asyncHandler');
const PaymentService = require('../Services/PaymentService');

const createOrder = asyncHandler(async (req, res) => {
  const { campaignId, amount } = req.body;
  const result = await PaymentService.createOrder({
    userId: req.user.id,
    campaignId,
    amount
  });
  res.status(201).json(result);
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const contribution = await PaymentService.verifyPayment({
    userId: req.user.id,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature
  });
  res.json({ contribution });
});

module.exports = {
  createOrder,
  verifyPayment
};
