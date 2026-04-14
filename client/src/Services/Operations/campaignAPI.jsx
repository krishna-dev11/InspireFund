import showToast from "../../Utilities/showToast";
import {
  setDashboardLoading,
  setFeaturedCampaigns,
  setDashboardStats,
  setListLoading,
  setCampaigns,
  setTotalPages,
  setTotal,
  setContributors,
  setDetailLoading,
} from "../../Slices/campaignSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const {
  GET_ALL_CAMPAIGNS_API,
  GET_CAMPAIGN_DETAIL_API,
  CREATE_CAMPAIGN_API,
  DELETE_CAMPAIGN_API,
  GET_CAMPAIGN_CONTRIBUTIONS_API,
} = endpoints;

export function getDashboardData() {
  return async (dispatch) => {
    dispatch(setDashboardLoading(true));
    try {
      const camRes = await apiConnector("GET", GET_ALL_CAMPAIGNS_API, null, null, { limit: 3, sort: "newest" });
      const campaigns = camRes.data.campaigns || [];
      const total = campaigns.reduce((a, c) => a + c.raisedAmount, 0);

      dispatch(setFeaturedCampaigns(campaigns));
      dispatch(
        setDashboardStats({
          totalCampaigns: camRes.data.total || campaigns.length,
          totalRaised: total,
          active: campaigns.filter((c) => c.status === "active").length,
          backers: campaigns.reduce((a, c) => a + (c.contributors?.length || 0), 0),
        })
      );
    } catch {
      showToast("Failed to load dashboard data", "error");
    } finally {
      dispatch(setDashboardLoading(false));
    }
  };
}

export function getCampaigns(params) {
  return async (dispatch) => {
    dispatch(setListLoading(true));
    try {
      const { data } = await apiConnector("GET", GET_ALL_CAMPAIGNS_API, null, null, params);
      dispatch(setCampaigns(data.campaigns || []));
      dispatch(setTotalPages(data.totalPages || 1));
      dispatch(setTotal(data.total || 0));
    } catch {
      dispatch(setCampaigns([]));
      dispatch(setTotalPages(1));
      dispatch(setTotal(0));
    } finally {
      dispatch(setListLoading(false));
    }
  };
}

export function getCampaignById(id) {
  return async (dispatch) => {
    dispatch(setDetailLoading(true));
    try {
      const { data } = await apiConnector("GET", `${GET_CAMPAIGN_DETAIL_API}/${id}`);
      return data.campaign;
    } catch {
      return null;
    } finally {
      dispatch(setDetailLoading(false));
    }
  };
}

export function getCampaignContributions(id) {
  return async (dispatch) => {
    dispatch(setDetailLoading(true));
    try {
      const { data } = await apiConnector("GET", `${GET_CAMPAIGN_CONTRIBUTIONS_API}/${id}/contributions`);
      dispatch(setContributors(data.contributions || []));
    } catch {
      dispatch(setContributors([]));
    } finally {
      dispatch(setDetailLoading(false));
    }
  };
}

export function createCampaign(formData, onSuccess) {
  return async (dispatch) => {
    dispatch(setDetailLoading(true));
    try {
      await apiConnector("POST", CREATE_CAMPAIGN_API, formData, {
        "Content-Type": "multipart/form-data",
      });
      showToast("Campaign submitted for admin review!", "success");
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create campaign", "error");
      return false;
    } finally {
      dispatch(setDetailLoading(false));
    }
  };
}

export function deleteCampaign(id) {
  return async () => {
    try {
      await apiConnector("DELETE", `${DELETE_CAMPAIGN_API}/${id}`);
      showToast("Campaign deleted", "success");
      return true;
    } catch (error) {
      showToast(error.response?.data?.message || "Cannot delete campaign", "error");
      return false;
    }
  };
}
