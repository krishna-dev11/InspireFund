const asyncHandler = require('../Utils/asyncHandler');
const CampaignService = require('../Services/CampaignService');

const createCampaign = asyncHandler(async (req, res) => {
  const { title, description, category, targetAmount, deadline, durationDays, tags } = req.body;

  const image = req.file?.path || '';

  const campaign = await CampaignService.createCampaign({
    title,
    description,
    category,
    targetAmount,
    deadline,
    durationDays,
    image,
    tags,
    creatorId: req.user.id
  });

  res.status(201).json({ campaign });
});

const updateCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const image = req.file?.path;

  const campaign = await CampaignService.updateCampaign({
    campaignId: id,
    userId: req.user.id,
    userRole: req.user.role,
    updates: req.body,
    image
  });

  res.json({ campaign });
});

const deleteCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await CampaignService.deleteCampaign({
    campaignId: id,
    userId: req.user.id,
    userRole: req.user.role
  });

  res.json({ message: 'Campaign deleted successfully' });
});

const getCampaigns = asyncHandler(async (req, res) => {
  const { page, limit, search, category, sort } = req.query;
  const result = await CampaignService.getCampaigns({ page, limit, search, category, sort });
  res.json(result);
});

const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await CampaignService.getCampaignById(req.params.id);
  res.json({ campaign });
});

const getCampaignContributions = asyncHandler(async (req, res) => {
  const contributions = await CampaignService.getCampaignContributions(req.params.id);
  res.json({ contributions });
});

module.exports = {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaigns,
  getCampaignById,
  getCampaignContributions
};