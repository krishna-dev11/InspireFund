const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 1 },
    paymentId: { type: String, default: '' },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
    razorpayOrderId: { type: String, default: '' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('Contribution', ContributionSchema);
