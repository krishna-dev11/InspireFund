const mongoose = require('mongoose');

const PlatformSettingSchema = new mongoose.Schema(
  {
    isPaused: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PlatformSetting', PlatformSettingSchema);
