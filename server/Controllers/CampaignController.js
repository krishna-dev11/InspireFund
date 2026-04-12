const asyncHandler = require('../Utils/asyncHandler');
const CampaignService = require('../Services/CampaignService');

const createCampaign = asyncHandler(async (req, res) => {
  const { title, description, category, targetAmount, deadline, durationDays, image, tags } = req.body;
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
  getCampaigns,
  getCampaignById,
  getCampaignContributions
};
