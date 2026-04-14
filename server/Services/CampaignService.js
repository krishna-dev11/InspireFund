const Campaign = require('../Models/Campaign');
const Contribution = require('../Models/Contribution');
const ApiError = require('../Utils/ApiError');

const createCampaign = async ({ title, description, category, targetAmount, deadline, durationDays, image, tags, creatorId }) => {
  let finalDeadline = deadline ? new Date(deadline) : null;

  if (!finalDeadline && durationDays) {
    finalDeadline = new Date(Date.now() + Number(durationDays) * 86400000);
  }

  if (!finalDeadline || Number.isNaN(finalDeadline.getTime())) {
    throw new ApiError(400, 'Valid deadline or durationDays is required');
  }

  const campaign = await Campaign.create({
    title,
    description,
    category,
    targetAmount,
    deadline: finalDeadline,
    image: image || '',
    tags: tags || [],
    creator: creatorId,
    status: 'pending'
  });

  return campaign;
};

// 🔥 UPDATE CAMPAIGN
const updateCampaign = async ({ campaignId, userId, userRole, updates, image }) => {
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new ApiError(404, 'Campaign not found');

  // 🔐 Ownership check
  if (String(campaign.creator) !== String(userId) && userRole !== 'admin') {
    throw new ApiError(403, 'Unauthorized');
  }

  // Apply updates
  Object.assign(campaign, updates);

  if (image) {
    campaign.image = image;
  }

  // 🔥 Re-approval required
  campaign.status = 'pending';

  await campaign.save();

  return campaign;
};

// 🔥 DELETE CAMPAIGN
const deleteCampaign = async ({ campaignId, userId, userRole }) => {
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new ApiError(404, 'Campaign not found');

  // 🔐 Ownership check
  if (String(campaign.creator) !== String(userId) && userRole !== 'admin') {
    throw new ApiError(403, 'Unauthorized');
  }

  // ❌ Optional: prevent deleting active campaigns
  if (campaign.status === 'active') {
    throw new ApiError(400, 'Cannot delete active campaign');
  }

  await campaign.deleteOne();

  return true;
};

const getCampaigns = async ({ page = 1, limit = 9, search = '', category = 'All', sort = 'newest' }) => {
  const query = { status: 'active' };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  const sortMap = {
    newest: { createdAt: -1 },
    'most-funded': { raisedAmount: -1 },
    'ending-soon': { deadline: 1 }
  };

  const sortBy = sortMap[sort] || sortMap.newest;

  const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

  const [campaigns, total] = await Promise.all([
    Campaign.find(query)
      .populate('creator', 'name email')
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Campaign.countDocuments(query)
  ]);

  const totalPages = Math.ceil(total / Number(limit)) || 1;

  return { campaigns, page: Number(page), totalPages, total };
};

const getCampaignById = async (id) => {
  const campaign = await Campaign.findById(id)
    .populate('creator', 'name email')
    .lean();

  if (!campaign) throw new ApiError(404, 'Campaign not found');

  return campaign;
};

const getCampaignContributions = async (campaignId) => {
  const contributions = await Contribution.find({ campaignId, status: 'paid' })
    .populate('userId', 'name')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return contributions;
};

module.exports = {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaigns,
  getCampaignById,
  getCampaignContributions
};