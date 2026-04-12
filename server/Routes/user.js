const express = require('express');
const UserController = require('../Controllers/UserController');
const { requireAuth } = require('../Middlewares/auth');

const router = express.Router();

router.get('/me', requireAuth, UserController.me);
router.get('/contributions', requireAuth, UserController.getMyContributions);
router.get('/campaigns', requireAuth, UserController.getMyCampaigns);

module.exports = router;
