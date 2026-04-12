const crypto = require('crypto');
const getRazorpay = require('../Config/Razorpay');
const Contribution = require('../Models/Contribution');
const Campaign = require('../Models/Campaign');
const User = require('../Models/User');
const ApiError = require('../Utils/ApiError');

const createOrder = async ({ userId, campaignId, amount }) => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, 'Razorpay keys are not configured');
  }

  const razorpay = getRazorpay();
  if (!razorpay) throw new ApiError(500, 'Razorpay instance not available');

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new ApiError(404, 'Campaign not found');
  if (campaign.status !== 'active') throw new ApiError(400, 'Campaign is not accepting funds');

  const receipt = `rcpt_${Date.now().toString(36)}_${String(campaignId).slice(-6)}`;
  const order = await razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: 'INR',
    receipt: receipt.slice(0, 40),
    notes: { campaignId: String(campaignId), userId: String(userId) }
  });

  const contribution = await Contribution.create({
    campaignId,
    userId,
    amount,
    razorpayOrderId: order.id,
    status: 'created'
  });

  return { order, contributionId: contribution._id, keyId: process.env.RAZORPAY_KEY_ID };
};

const verifyPayment = async ({ userId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, 'Razorpay keys are not configured');
  }
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

  if (expected !== razorpaySignature) {
    throw new ApiError(400, 'Invalid payment signature');
  }

  const contribution = await Contribution.findOne({ razorpayOrderId });
  if (!contribution) throw new ApiError(404, 'Contribution not found');
  if (String(contribution.userId) !== String(userId)) throw new ApiError(403, 'Unauthorized payment verification');

  if (contribution.status === 'paid') {
    return contribution;
  }

  contribution.paymentId = razorpayPaymentId;
  contribution.status = 'paid';
  await contribution.save();

  const campaign = await Campaign.findById(contribution.campaignId);
  if (!campaign) throw new ApiError(404, 'Campaign not found');

  campaign.raisedAmount += Number(contribution.amount);
  if (!campaign.contributors.some((id) => String(id) === String(userId))) {
    campaign.contributors.push(userId);
  }
  if (campaign.raisedAmount >= campaign.targetAmount) {
    campaign.status = 'completed';
  }
  await campaign.save();

  await User.findByIdAndUpdate(userId, { $addToSet: { contributions: contribution._id } });

  return contribution;
};

module.exports = {
  createOrder,
  verifyPayment
};
