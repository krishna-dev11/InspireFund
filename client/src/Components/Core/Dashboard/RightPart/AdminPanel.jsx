import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Activity,
  AlertCircle,
  Award,
  CheckCircle,
  CheckSquare,
  FileText,
  IndianRupee,
  Pause,
  Play,
  RefreshCw,
  Rocket,
  Settings,
  Users,
  Wallet,
  XCircle,
  ChevronRight,
} from "lucide-react";
import StatCard from "../../../Common/StatCard";
import Spinner from "../../../Common/Spinner";
import formatCurrency, { formatNumber } from "../../../../Utilities/formatCurrency";
import showToast from "../../../../Utilities/showToast";
import { approveCampaign, getAdminData, rejectCampaign, withdrawPlatformFees } from "../../../../Services/Operations/profileAPI";
import { setPendingCampaigns } from "../../../../Slices/profileSlice";

function AdminPanel() {
  const dispatch = useDispatch();
  const { adminStats, pendingCampaigns, adminLoading } = useSelector((state) => state.profile);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paused, setPaused] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    dispatch(getAdminData());
  }, [dispatch]);

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    const ok = await dispatch(withdrawPlatformFees(Number(withdrawAmount)));
    if (ok) {
      setWithdrawAmount("");
      dispatch(getAdminData());
    }
  };

  const handleApprove = async (id) => {
    setActionLoading((p) => ({ ...p, [id]: "approve" }));
    const ok = await dispatch(approveCampaign(id));
    if (ok) {
      dispatch(setPendingCampaigns(pendingCampaigns.filter((c) => c._id !== id)));
    }
    setActionLoading((p) => {
      const n = { ...p };
      delete n[id];
      return n;
    });
  };

  const handleReject = async (id) => {
    setActionLoading((p) => ({ ...p, [id]: "reject" }));
    const ok = await dispatch(rejectCampaign(id));
    if (ok) {
      dispatch(setPendingCampaigns(pendingCampaigns.filter((c) => c._id !== id)));
    }
    setActionLoading((p) => {
      const n = { ...p };
      delete n[id];
      return n;
    });
  };

  const platformEarnings = adminStats ? Math.round(adminStats.totalRevenue * 0.05) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-0.5">Full platform control · Live data from MongoDB</p>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
            paused ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${paused ? "bg-red-500" : "bg-emerald-500"}`} />
          Platform {paused ? "Paused" : "Active"}
        </div>
      </div>

      {adminLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size={32} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Users" value={formatNumber(adminStats?.totalUsers ?? 0)} color="indigo" />
            <StatCard icon={Rocket} label="Total Campaigns" value={adminStats?.totalCampaigns ?? 0} color="violet" />
            <StatCard icon={IndianRupee} label="Total Revenue" value={formatCurrency(adminStats?.totalRevenue ?? 0)} color="amber" />
            <StatCard
              icon={Award}
              label="Platform Earnings (5%)"
              value={formatCurrency(adminStats?.platformEarnings ?? platformEarnings)}
              color="emerald"
            />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <FileText size={18} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Pending Approvals</h2>
                <p className="text-xs text-gray-400">
                  {pendingCampaigns.length} campaign{pendingCampaigns.length !== 1 ? "s" : ""} awaiting review
                </p>
              </div>
            </div>
            {pendingCampaigns.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                <CheckCircle size={28} className="mx-auto mb-2 opacity-30" />
                <p>All caught up! No pending campaigns.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCampaigns.map((c) => (
                  <div key={c._id} className="border border-gray-100 rounded-xl p-4 flex items-start gap-4 hover:bg-gray-50 transition-all">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {c.image ? <img src={c.image} alt="" className="w-full h-full object-cover" /> : <Rocket size={18} className="text-indigo-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{c.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        by {c.creator?.name} · {c.category} · Goal: {formatCurrency(c.targetAmount)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{c.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(c._id)}
                        disabled={!!actionLoading[c._id]}
                        className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-100 disabled:opacity-50 transition-all"
                      >
                        {actionLoading[c._id] === "approve" ? <Spinner size={12} /> : <CheckSquare size={12} />} Approve
                      </button>
                      <button
                        onClick={() => handleReject(c._id)}
                        disabled={!!actionLoading[c._id]}
                        className="flex items-center gap-1 text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100 disabled:opacity-50 transition-all"
                      >
                        {actionLoading[c._id] === "reject" ? <Spinner size={12} /> : <XCircle size={12} />} Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Wallet size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Fee Management</h2>
                  <p className="text-xs text-gray-400">Withdraw accumulated platform earnings</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <p className="text-xs text-amber-600">Available to withdraw (5% commission)</p>
                <p className="text-2xl font-black text-amber-700">{formatCurrency(adminStats?.platformEarnings ?? platformEarnings)}</p>
              </div>
              <div className="relative mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">?</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter withdraw amount"
                  className="w-full pl-7 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-amber-400 outline-none"
                />
              </div>
              <button
                onClick={handleWithdraw}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl font-bold hover:opacity-90 transition-all"
              >
                Withdraw Fees ?
              </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Settings size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Platform Controls</h2>
                  <p className="text-xs text-gray-400">System-wide management</p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setPaused(!paused);
                    showToast(`Platform ${!paused ? "paused" : "resumed"}`, paused ? "success" : "info");
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    paused ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  <span className="flex items-center gap-2">{paused ? <Play size={16} /> : <Pause size={16} />}{paused ? "Resume Platform" : "Pause Platform"}</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => showToast("Emergency action logged", "error")}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <AlertCircle size={16} /> Emergency Withdraw
                  </span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => dispatch(getAdminData())}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw size={16} /> Refresh Stats
                  </span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-900 to-violet-900 rounded-2xl p-6 text-white">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Activity size={16} /> System Status
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Backend", value: "Node.js + Express" },
                { label: "Database", value: "MongoDB Atlas" },
                { label: "Payments", value: "Razorpay (INR)" },
                { label: "Storage", value: "Cloudinary" },
                { label: "Auth", value: "JWT + bcrypt" },
                { label: "Platform Fee", value: "5% per transaction" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 rounded-xl p-3">
                  <p className="text-indigo-300 text-xs">{label}</p>
                  <p className="text-white font-semibold text-sm mt-0.5">{value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span className="text-emerald-400 text-xs">online</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPanel;
