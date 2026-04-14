const asyncHandler = require('../Utils/asyncHandler');
const AdminService = require('../Services/AdminService');
const Campaign = require('../Models/Campaign');

const getStats = asyncHandler(async (_req, res) => {
  const stats = await AdminService.getStats();
  res.json(stats);
});

const withdraw = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const result = await AdminService.withdraw(Number(amount));
  res.json(result);
});

const getPendingCampaigns = asyncHandler(async (_req, res) => {
  const campaigns = await Campaign.find({ status: 'pending' })
    .populate('creator', 'name email')
    .sort({ createdAt: -1 });

  res.json({ campaigns });
});

const approveCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const campaign = await Campaign.findById(id);
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found' });
  }

  campaign.status = 'active';
  await campaign.save();

  res.json({ message: 'Campaign approved', campaign });
});

const rejectCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const campaign = await Campaign.findById(id);
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found' });
  }

  campaign.status = 'rejected';
  await campaign.save();

  res.json({ message: 'Campaign rejected', campaign });
});

module.exports = {
  getStats,
  withdraw,
  getPendingCampaigns,
  approveCampaign,
  rejectCampaign
};