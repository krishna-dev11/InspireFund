import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  dashboardLoading: false,
  listLoading: false,
  detailLoading: false,
  featuredCampaigns: [],
  dashboardStats: null,
  campaigns: [],
  totalPages: 1,
  total: 0,
  selectedCampaign: null,
  contributors: [],
  searchQuery: "",
  showCreateModal: false,
  sidebarCollapsed: false,
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setDashboardLoading(state, action) {
      state.dashboardLoading = action.payload;
    },
    setListLoading(state, action) {
      state.listLoading = action.payload;
    },
    setDetailLoading(state, action) {
      state.detailLoading = action.payload;
    },
    setFeaturedCampaigns(state, action) {
      state.featuredCampaigns = action.payload;
    },
    setDashboardStats(state, action) {
      state.dashboardStats = action.payload;
    },
    setCampaigns(state, action) {
      state.campaigns = action.payload;
    },
    setTotalPages(state, action) {
      state.totalPages = action.payload;
    },
    setTotal(state, action) {
      state.total = action.payload;
    },
    setSelectedCampaign(state, action) {
      state.selectedCampaign = action.payload;
    },
    setContributors(state, action) {
      state.contributors = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setShowCreateModal(state, action) {
      state.showCreateModal = action.payload;
    },
    setSidebarCollapsed(state, action) {
      state.sidebarCollapsed = action.payload;
    },
    resetCampaign(state) {
      state.featuredCampaigns = [];
      state.dashboardStats = null;
      state.campaigns = [];
      state.totalPages = 1;
      state.total = 0;
      state.selectedCampaign = null;
      state.contributors = [];
      state.searchQuery = "";
      state.showCreateModal = false;
      state.sidebarCollapsed = false;
    },
  },
});

export const {
  setLoading,
  setDashboardLoading,
  setListLoading,
  setDetailLoading,
  setFeaturedCampaigns,
  setDashboardStats,
  setCampaigns,
  setTotalPages,
  setTotal,
  setSelectedCampaign,
  setContributors,
  setSearchQuery,
  setShowCreateModal,
  setSidebarCollapsed,
  resetCampaign,
} = campaignSlice.actions;

export default campaignSlice.reducer;
