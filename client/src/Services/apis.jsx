const BASE_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_BASE_URL || "http://localhost:5000";

export const endpoints = {
  // Auth
  SIGNUP_API: BASE_URL + "/api/auth/register",
  LOGIN_API: BASE_URL + "/api/auth/login",
  GOOGLE_LOGIN_API: BASE_URL + "/api/auth/google",
  ME_API: BASE_URL + "/api/user/me",

  // Campaign
  GET_ALL_CAMPAIGNS_API: BASE_URL + "/api/campaign/all",
  GET_CAMPAIGN_DETAIL_API: BASE_URL + "/api/campaign",
  CREATE_CAMPAIGN_API: BASE_URL + "/api/campaign/create",
  DELETE_CAMPAIGN_API: BASE_URL + "/api/campaign/delete",
  GET_CAMPAIGN_CONTRIBUTIONS_API: BASE_URL + "/api/campaign",

  // Payment / Contribution
  INITIATE_PAYMENT_API: BASE_URL + "/api/payment/create-order",
  VERIFY_PAYMENT_API: BASE_URL + "/api/payment/verify",

  // Profile
  GET_USER_CAMPAIGNS_API: BASE_URL + "/api/user/campaigns",
  GET_USER_CONTRIBUTIONS_API: BASE_URL + "/api/user/contributions",

  // Admin
  ADMIN_STATS_API: BASE_URL + "/api/admin/stats",
  ADMIN_WITHDRAW_API: BASE_URL + "/api/admin/withdraw",
  ADMIN_PENDING_API: BASE_URL + "/api/admin/pending-campaigns",
  ADMIN_APPROVE_API: BASE_URL + "/api/admin/approve",
  ADMIN_REJECT_API: BASE_URL + "/api/admin/reject",
};
