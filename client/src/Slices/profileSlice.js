import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  userCampaigns: [],
  userContributions: [],
  profileStats: null,
  adminStats: null,
  adminSettings: { isPaused: false },
  pendingCampaigns: [],
  adminLoading: false,
  adminActionLoading: {},
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUserCampaigns(state, action) {
      state.userCampaigns = action.payload;
    },
    setUserContributions(state, action) {
      state.userContributions = action.payload;
    },
    setProfileStats(state, action) {
      state.profileStats = action.payload;
    },
    setAdminStats(state, action) {
      state.adminStats = action.payload;
    },
    setAdminSettings(state, action) {
      state.adminSettings = action.payload;
    },
    setPendingCampaigns(state, action) {
      state.pendingCampaigns = action.payload;
    },
    setAdminLoading(state, action) {
      state.adminLoading = action.payload;
    },
    setAdminActionLoading(state, action) {
      state.adminActionLoading = action.payload;
    },
    resetProfile(state) {
      state.userCampaigns = [];
      state.userContributions = [];
      state.profileStats = null;
      state.adminStats = null;
      state.adminSettings = { isPaused: false };
      state.pendingCampaigns = [];
      state.adminLoading = false;
      state.adminActionLoading = {};
    },
  },
});

export const {
  setLoading,
  setUserCampaigns,
  setUserContributions,
  setProfileStats,
  setAdminStats,
  setAdminSettings,
  setPendingCampaigns,
  setAdminLoading,
  setAdminActionLoading,
  resetProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
