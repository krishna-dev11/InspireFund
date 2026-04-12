const asyncHandler = require('../Utils/asyncHandler');
const UserService = require('../Services/UserService');

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

const getMyContributions = asyncHandler(async (req, res) => {
  const contributions = await UserService.getMyContributions(req.user.id);
  res.json({ contributions });
});

const getMyCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await UserService.getMyCampaigns(req.user.id);
  res.json({ campaigns });
});

module.exports = {
  me,
  getMyContributions,
  getMyCampaigns
};
