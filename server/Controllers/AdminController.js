const asyncHandler = require('../Utils/asyncHandler');
const AdminService = require('../Services/AdminService');

const getStats = asyncHandler(async (_req, res) => {
  const stats = await AdminService.getStats();
  res.json(stats);
});

const withdraw = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const result = await AdminService.withdraw(Number(amount));
  res.json(result);
});

module.exports = {
  getStats,
  withdraw
};
