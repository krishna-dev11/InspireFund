const PlatformSetting = require('../Models/PlatformSetting');

const getSettings = async () => {
  const settings = await PlatformSetting.findOne();
  if (settings) return settings;
  return PlatformSetting.create({ isPaused: false });
};

const setPaused = async (isPaused) => {
  const settings = await PlatformSetting.findOneAndUpdate(
    {},
    { isPaused: Boolean(isPaused) },
    { new: true, upsert: true }
  );
  return settings;
};

module.exports = {
  getSettings,
  setPaused
};
