const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    targetAmount: { type: Number, required: true, min: 1 },
    raisedAmount: { type: Number, default: 0 },
    contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deadline: { type: Date, required: true },
    image: { type: String, default: '' },

    status: { 
      type: String, 
      enum: ['pending', 'active', 'completed', 'rejected', 'ended'], 
      default: 'pending' 
    },

    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campaign', CampaignSchema);