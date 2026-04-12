const User = require('../Models/User');
const Campaign = require('../Models/Campaign');
const Contribution = require('../Models/Contribution');
const ApiError = require('../Utils/ApiError');

const getStats = async () => {
  const [totalUsers, totalCampaigns, totalRevenueAgg] = await Promise.all([
    User.countDocuments(),
    Campaign.countDocuments(),
    Contribution.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
  ]);

  const totalRevenue = totalRevenueAgg[0]?.total || 0;
  const platformEarnings = Math.round(totalRevenue * 0.05);

  return { totalUsers, totalCampaigns, totalRevenue, platformEarnings };
};

const withdraw = async (amount) => {
  const stats = await getStats();
  if (amount > stats.platformEarnings) {
    throw new ApiError(400, 'Withdrawal amount exceeds available platform earnings');
  }
  return { withdrawn: amount, availableAfter: stats.platformEarnings - amount };
};

module.exports = {
  getStats,
  withdraw
};
