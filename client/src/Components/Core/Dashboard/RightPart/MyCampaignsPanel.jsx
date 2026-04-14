import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Activity, CheckCircle, Download, Eye, FolderHeart, IndianRupee, Rocket, Trash2 } from "lucide-react";
import StatCard from "../../../Common/StatCard";
import Spinner from "../../../Common/Spinner";
import ProgressBar from "../../../Common/ProgressBar";
import formatCurrency from "../../../../Utilities/formatCurrency";
import { calcProgress, daysLeft, getStatusColor } from "../../../../Utilities/campaignHelpers";
import { getUserCampaigns } from "../../../../Services/Operations/profileAPI";
import { deleteCampaign } from "../../../../Services/Operations/campaignAPI";
import { setUserCampaigns } from "../../../../Slices/profileSlice";
import showToast from "../../../../Utilities/showToast";
import { useNavigate } from "react-router-dom";
import { setSelectedCampaign } from "../../../../Slices/campaignSlice";

function MyCampaignsPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userCampaigns, loading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getUserCampaigns());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    const ok = await dispatch(deleteCampaign(id));
    if (ok) {
      dispatch(setUserCampaigns(userCampaigns.filter((c) => c._id !== id)));
    }
  };

  const totalRaised = userCampaigns.reduce((a, c) => a + c.raisedAmount, 0);

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-1">My Campaigns</h1>
      <p className="text-gray-500 text-sm mb-6">Campaigns you've created</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Rocket} label="Total Created" value={userCampaigns.length} color="indigo" />
        <StatCard icon={IndianRupee} label="Total Raised" value={formatCurrency(totalRaised)} color="amber" />
        <StatCard icon={Activity} label="Active" value={userCampaigns.filter((c) => c.status === "active").length} color="emerald" />
        <StatCard icon={CheckCircle} label="Completed" value={userCampaigns.filter((c) => c.status === "completed").length} color="violet" />
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size={32} />
        </div>
      ) : userCampaigns.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FolderHeart size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No campaigns yet</p>
          <p className="text-sm">Create your first campaign!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userCampaigns.map((c) => {
            const pct = calcProgress(c.raisedAmount, c.targetAmount);
            const days = daysLeft(c.deadline);
            const canWithdraw = days === 0 || c.status === "completed";
            return (
              <div key={c._id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {c.image ? <img src={c.image} alt="" className="w-full h-full object-cover" /> : <Rocket size={22} className="text-indigo-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-gray-900">{c.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getStatusColor(c.status)}`}>{c.status}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="font-bold text-gray-800">
                        {formatCurrency(c.raisedAmount)} <span className="text-gray-400 font-normal">/ {formatCurrency(c.targetAmount)}</span>
                      </span>
                      <span>·</span>
                      <span>{c.contributors?.length ?? 0} backers</span>
                      <span>·</span>
                      <span>{days > 0 ? `${days} days left` : "Ended"}</span>
                    </div>
                    <ProgressBar value={pct} />
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => {
                        dispatch(setSelectedCampaign(c));
                        navigate(`/dashboard/campaigns/${c._id}`);
                      }}
                      className="flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-100 transition-all"
                    >
                      <Eye size={13} /> View
                    </button>
                    {canWithdraw ? (
                      <button
                        onClick={() =>
                          showToast(`Withdrawal of ${formatCurrency(Math.round(c.raisedAmount * 0.95))} initiated! (Backend payout needed)`, "success")
                        }
                        className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-100 transition-all"
                      >
                        <Download size={13} /> Withdraw
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="flex items-center gap-1.5 text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100 transition-all"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyCampaignsPanel;
