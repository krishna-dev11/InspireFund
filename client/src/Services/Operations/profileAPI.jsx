import showToast from "../../Utilities/showToast";
import { formatNumber } from "../../Utilities/formatCurrency";
import {
  setLoading,
  setUserCampaigns,
  setUserContributions,
  setProfileStats,
  setAdminStats,
  setPendingCampaigns,
  setAdminLoading,
} from "../../Slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const {
  GET_USER_CAMPAIGNS_API,
  GET_USER_CONTRIBUTIONS_API,
  ADMIN_STATS_API,
  ADMIN_PENDING_API,
  ADMIN_WITHDRAW_API,
  ADMIN_APPROVE_API,
  ADMIN_REJECT_API,
} = endpoints;

export function getUserCampaigns() {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const { data } = await apiConnector("GET", GET_USER_CAMPAIGNS_API);
      dispatch(setUserCampaigns(data.campaigns || []));
      return data.campaigns || [];
    } catch (error) {
      showToast("Failed to load your campaigns", "error");
      dispatch(setUserCampaigns([]));
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getUserContributions() {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const { data } = await apiConnector("GET", GET_USER_CONTRIBUTIONS_API);
      dispatch(setUserContributions(data.contributions || []));
      return data.contributions || [];
    } catch (error) {
      showToast("Failed to load contributions", "error");
      dispatch(setUserContributions([]));
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getProfileStats() {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const [camps, contribs] = await Promise.all([
        apiConnector("GET", GET_USER_CAMPAIGNS_API),
        apiConnector("GET", GET_USER_CONTRIBUTIONS_API),
      ]);
      const cList = camps.data.campaigns || [];
      const conList = contribs.data.contributions || [];
      const stats = {
        campaigns: cList.length,
        backed: conList.length,
        raised: cList.reduce((a, c) => a + c.raisedAmount, 0),
        contributed: conList.reduce((a, c) => a + c.amount, 0),
      };
      dispatch(setProfileStats(stats));
      return stats;
    } catch {
      dispatch(setProfileStats(null));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getAdminData() {
  return async (dispatch) => {
    dispatch(setAdminLoading(true));
    try {
      const [sRes, pRes] = await Promise.all([
        apiConnector("GET", ADMIN_STATS_API),
        apiConnector("GET", ADMIN_PENDING_API),
      ]);
      dispatch(setAdminStats(sRes.data));
      dispatch(setPendingCampaigns(pRes.data.campaigns || []));
      return { stats: sRes.data, pending: pRes.data.campaigns || [] };
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to load admin data", "error");
      dispatch(setAdminStats(null));
      dispatch(setPendingCampaigns([]));
      return null;
    } finally {
      dispatch(setAdminLoading(false));
    }
  };
}

export function withdrawPlatformFees(amount) {
  return async () => {
    try {
      await apiConnector("POST", ADMIN_WITHDRAW_API, { amount: Number(amount) });
      showToast(`\u20B9${formatNumber(Number(amount))} platform earnings withdrawn!`, "success");
      return true;
    } catch (error) {
      showToast(error.response?.data?.message || "Withdrawal failed", "error");
      return false;
    }
  };
}

export function approveCampaign(id) {
  return async () => {
    try {
      await apiConnector("PATCH", `${ADMIN_APPROVE_API}/${id}`);
      showToast("Campaign approved and now live!", "success");
      return true;
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to approve", "error");
      return false;
    }
  };
}

export function rejectCampaign(id) {
  return async () => {
    try {
      await apiConnector("PATCH", `${ADMIN_REJECT_API}/${id}`);
      showToast("Campaign rejected", "info");
      return true;
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to reject", "error");
      return false;
    }
  };
}
