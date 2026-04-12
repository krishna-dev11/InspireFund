const Contribution = require('../Models/Contribution');
const Campaign = require('../Models/Campaign');

const getMyContributions = async (userId) => {
  const contributions = await Contribution.find({ userId, status: 'paid' })
    .populate('campaignId', 'title image')
    .sort({ createdAt: -1 })
    .lean();
  return contributions;
};

const getMyCampaigns = async (userId) => {
  const campaigns = await Campaign.find({ creator: userId }).sort({ createdAt: -1 }).lean();
  return campaigns;
};

module.exports = {
  getMyContributions,
  getMyCampaigns
};
