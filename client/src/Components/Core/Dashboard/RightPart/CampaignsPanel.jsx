import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Grid, List, Rocket, Search } from "lucide-react";
import { CATEGORIES } from "../../../../data/categories";
import Spinner from "../../../Common/Spinner";
import ProgressBar from "../../../Common/ProgressBar";
import CampaignCard from "../../Campaign/CampaignCard";
import useDebounce from "../../../../Utilities/useDebounce";
import { calcProgress, getStatusColor } from "../../../../Utilities/campaignHelpers";
import formatCurrency from "../../../../Utilities/formatCurrency";
import { getCampaigns } from "../../../../Services/Operations/campaignAPI";
import { setSelectedCampaign } from "../../../../Slices/campaignSlice";
import { useNavigate } from "react-router-dom";

function CampaignsPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { campaigns, listLoading, totalPages, total, searchQuery } = useSelector((state) => state.campaign);

  const [view, setView] = useState("grid");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [page, setPageNum] = useState(1);
  const dSearch = useDebounce(localSearch, 400);

  const fetchCampaigns = useCallback(() => {
    const params = { page, limit: 9, sort };
    if (dSearch) params.search = dSearch;
    if (category !== "All") params.category = category;
    dispatch(getCampaigns(params));
  }, [dispatch, page, dSearch, category, sort]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    setPageNum(1);
  }, [dSearch, category, sort]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">All Campaigns</h1>
          <p className="text-gray-500 text-sm mt-0.5">Discover and support amazing projects · {total} campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search campaigns…"
            className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...CATEGORIES.slice(0, 5)].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                category === c
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-xs border border-gray-200 rounded-xl px-3 py-2 outline-none bg-white"
        >
          <option value="newest">Newest first</option>
          <option value="most-funded">Most funded</option>
          <option value="ending-soon">Ending soon</option>
        </select>
      </div>

      {listLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size={36} />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Rocket size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No campaigns found</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map((c) => (
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
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const pct = calcProgress(c.raisedAmount, c.targetAmount);
            return (
              <div
                key={c._id}
                onClick={() => {
                  dispatch(setSelectedCampaign(c));
                  navigate(`/dashboard/campaigns/${c._id}`);
                }}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  {c.image ? <img src={c.image} alt="" className="w-full h-full object-cover" /> : <Rocket size={22} className="text-indigo-300" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{c.category}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(c.status)}`}>{c.status}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{c.title}</h3>
                  <ProgressBar value={pct} size="sm" />
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900">{formatCurrency(c.raisedAmount)}</p>
                  <p className="text-xs text-gray-400">
                    {pct}% of {formatCurrency(c.targetAmount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPageNum((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-600 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default CampaignsPanel;
