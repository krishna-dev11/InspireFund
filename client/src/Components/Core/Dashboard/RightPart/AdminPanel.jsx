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
import { approveCampaign, getAdminData, rejectCampaign, updateAdminSettings, withdrawPlatformFees } from "../../../../Services/Operations/profileAPI";
import { setPendingCampaigns } from "../../../../Slices/profileSlice";

function AdminPanel() {
  const dispatch = useDispatch();
  const { adminStats, pendingCampaigns, adminLoading, adminSettings } = useSelector((state) => state.profile);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const paused = adminSettings?.isPaused ?? false;

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
          <h1 className="text-2xl font-black text-app">Admin Panel</h1>
          <p className="text-muted text-sm mt-0.5">Full platform control - Live data from MongoDB</p>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
            paused ? "bg-red-500/15 text-red-400" : "bg-emerald-500/15 text-emerald-400"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${paused ? "bg-red-400" : "bg-emerald-400"}`} />
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

          <div className="app-card p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#F97316]/15 text-[#F97316] rounded-xl flex items-center justify-center">
                <FileText size={18} />
              </div>
              <div>
                <h2 className="font-bold text-app">Pending Approvals</h2>
                <p className="text-xs text-muted">
                  {pendingCampaigns.length} campaign{pendingCampaigns.length !== 1 ? "s" : ""} awaiting review
                </p>
              </div>
            </div>
            {pendingCampaigns.length === 0 ? (
              <div className="text-center py-8 text-muted text-sm">
                <CheckCircle size={28} className="mx-auto mb-2 opacity-30" />
                <p>All caught up. No pending campaigns.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCampaigns.map((c) => (
                  <div key={c._id} className="app-card p-4 flex items-start gap-4 transition-all">
                    <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-app">
                      {c.image ? <img src={c.image} alt="" className="w-full h-full object-cover" /> : <Rocket size={18} className="text-[#F97316]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-app truncate">{c.title}</h3>
                      <p className="text-xs text-muted mt-0.5">
                        by {c.creator?.name} - {c.category} - Goal: {formatCurrency(c.targetAmount)}
                      </p>
                      <p className="text-xs text-muted mt-1 line-clamp-1">{c.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(c._id)}
                        disabled={!!actionLoading[c._id]}
                        className="flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-400 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-500/25 disabled:opacity-50 transition-all"
                      >
                        {actionLoading[c._id] === "approve" ? <Spinner size={12} /> : <CheckSquare size={12} />} Approve
                      </button>
                      <button
                        onClick={() => handleReject(c._id)}
                        disabled={!!actionLoading[c._id]}
                        className="flex items-center gap-1 text-xs bg-red-500/15 text-red-400 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-500/25 disabled:opacity-50 transition-all"
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
            <div className="app-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#F97316]/15 text-[#F97316] rounded-xl flex items-center justify-center">
                  <Wallet size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-app">Fee Management</h2>
                  <p className="text-xs text-muted">Withdraw accumulated platform earnings</p>
                </div>
              </div>
              <div className="bg-[#F97316]/10 border border-app rounded-xl p-3 mb-4">
                <p className="text-xs text-muted">Available to withdraw (5% commission)</p>
                <p className="text-2xl font-black text-[#F97316]">{formatCurrency(adminStats?.platformEarnings ?? platformEarnings)}</p>
              </div>
              <div className="relative mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted text-sm">Rs</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter withdraw amount"
                  className="w-full pl-10 pr-4 py-2.5 input-base text-sm"
                />
              </div>
              <button
                onClick={handleWithdraw}
                className="w-full btn-primary py-2.5"
              >
                Withdraw Fees
              </button>
            </div>

            <div className="app-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/5 text-app rounded-xl flex items-center justify-center border border-app">
                  <Settings size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-app">Platform Controls</h2>
                  <p className="text-xs text-muted">System-wide management</p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => dispatch(updateAdminSettings({ isPaused: !paused }))}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    paused ? "bg-emerald-500/15 text-emerald-400" : "bg-[#F97316]/15 text-[#F97316]"
                  }`}
                >
                  <span className="flex items-center gap-2">{paused ? <Play size={16} /> : <Pause size={16} />}{paused ? "Resume Platform" : "Pause Platform"}</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => dispatch(withdrawPlatformFees(adminStats?.platformEarnings ?? platformEarnings))}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm bg-red-500/15 text-red-400 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <AlertCircle size={16} /> Emergency Withdraw
                  </span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => dispatch(getAdminData())}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm bg-white/5 text-app border border-app transition-all"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw size={16} /> Refresh Stats
                  </span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface-2 border border-app rounded-2xl p-6 text-app">
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
                <div key={label} className="bg-white/5 rounded-xl p-3 border border-app">
                  <p className="text-muted text-xs">{label}</p>
                  <p className="text-app font-semibold text-sm mt-0.5">{value}</p>
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

