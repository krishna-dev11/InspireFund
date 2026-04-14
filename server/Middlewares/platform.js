const ApiError = require('../Utils/ApiError');
const PlatformSetting = require('../Models/PlatformSetting');

const requirePlatformActive = async (_req, _res, next) => {
  try {
    const settings = await PlatformSetting.findOne();
    if (settings?.isPaused) {
      return next(new ApiError(503, 'Platform is paused. Please try again later.'));
    }
    return next();
  } catch {
    return next(new ApiError(500, 'Unable to verify platform status'));
  }
};

module.exports = {
  requirePlatformActive
};
