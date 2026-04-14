import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronRight, IndianRupee, Rocket, Users, Activity, Zap, PlusCircle } from "lucide-react";
import StatCard from "../../../Common/StatCard";
import Spinner from "../../../Common/Spinner";
import CampaignCard from "../../Campaign/CampaignCard";
import formatCurrency, { formatNumber } from "../../../../Utilities/formatCurrency";
import { getDashboardData } from "../../../../Services/Operations/campaignAPI";
import { setSelectedCampaign, setShowCreateModal } from "../../../../Slices/campaignSlice";

function DashboardHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featuredCampaigns, dashboardStats, dashboardLoading } = useSelector((state) => state.campaign);

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  return (
    <div>
      <div className="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-2xl p-8 mb-8 overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Zap size={11} className="text-amber-300" /> India's #1 Crowdfunding Platform
          </span>
          <h1 className="text-3xl font-black text-white mb-2">Fund Ideas That Matter ????</h1>
          <p className="text-indigo-200 text-sm mb-6 max-w-md">
            From villages to startups — power the projects that shape tomorrow's India.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => dispatch(setShowCreateModal(true))}
              className="flex items-center gap-2 bg-amber-400 text-indigo-900 px-5 py-2.5 rounded-xl font-bold hover:bg-amber-300 transition-all shadow-lg"
            >
              <PlusCircle size={16} /> Create Campaign
            </button>
            <button
              onClick={() => navigate("/dashboard/campaigns")}
              className="flex items-center gap-2 bg-white/15 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/25 transition-all border border-white/20"
            >
              Explore <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Rocket} label="Total Campaigns" value={dashboardStats?.totalCampaigns ?? "—"} color="indigo" loading={dashboardLoading} />
        <StatCard
          icon={IndianRupee}
          label="Total Raised"
          value={dashboardStats ? formatCurrency(dashboardStats.totalRaised) : "—"}
          color="amber"
          loading={dashboardLoading}
        />
        <StatCard icon={Activity} label="Active Campaigns" value={dashboardStats?.active ?? "—"} color="emerald" loading={dashboardLoading} />
        <StatCard
          icon={Users}
          label="Total Backers"
          value={dashboardStats ? formatNumber(dashboardStats.backers) : "—"}
          color="violet"
          loading={dashboardLoading}
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Featured Campaigns</h2>
        <button
          onClick={() => navigate("/dashboard/campaigns")}
          className="text-sm text-indigo-600 font-semibold flex items-center gap-1"
        >
          View all <ChevronRight size={15} />
        </button>
      </div>
      {dashboardLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size={32} />
        </div>
      ) : featuredCampaigns.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Rocket size={36} className="mx-auto mb-2 opacity-30" />
          <p>No active campaigns yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {featuredCampaigns.map((c) => (
            <CampaignCard
              key={c._id}
              campaign={c}
              onView={(cam) => {
                dispatch(setSelectedCampaign(cam));
                navigate(`/dashboard/campaigns/${cam._id}`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardHome;
