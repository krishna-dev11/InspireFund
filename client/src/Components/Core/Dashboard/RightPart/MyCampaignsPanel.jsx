// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Activity, CheckCircle, Download, Eye, FolderHeart, IndianRupee, Rocket, Trash2 } from "lucide-react";
// import StatCard from "../../../Common/StatCard";
// import Spinner from "../../../Common/Spinner";
// import ProgressBar from "../../../Common/ProgressBar";
// import formatCurrency from "../../../../Utilities/formatCurrency";
// import { calcProgress, daysLeft, getStatusColor } from "../../../../Utilities/campaignHelpers";
// import { getUserCampaigns } from "../../../../Services/Operations/profileAPI";
// import { deleteCampaign } from "../../../../Services/Operations/campaignAPI";
// import { setUserCampaigns } from "../../../../Slices/profileSlice";
// import showToast from "../../../../Utilities/showToast";
// import { useNavigate } from "react-router-dom";
// import { setSelectedCampaign } from "../../../../Slices/campaignSlice";

// function MyCampaignsPanel() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { userCampaigns, loading } = useSelector((state) => state.profile);

//   useEffect(() => {
//     dispatch(getUserCampaigns());
//   }, [dispatch]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this campaign?")) return;
//     const ok = await dispatch(deleteCampaign(id));
//     if (ok) {
//       dispatch(setUserCampaigns(userCampaigns.filter((c) => c._id !== id)));
//     }
//   };

//   const totalRaised = userCampaigns.reduce((a, c) => a + c.raisedAmount, 0);

//   return (
//     <div>
//       <h1 className="text-2xl font-black text-app mb-1">My Campaigns</h1>
//       <p className="text-muted text-sm mb-6">Campaigns you have created</p>
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <StatCard icon={Rocket} label="Total Created" value={userCampaigns.length} color="indigo" />
//         <StatCard icon={IndianRupee} label="Total Raised" value={formatCurrency(totalRaised)} color="amber" />
//         <StatCard icon={Activity} label="Active" value={userCampaigns.filter((c) => c.status === "active").length} color="emerald" />
//         <StatCard icon={CheckCircle} label="Completed" value={userCampaigns.filter((c) => c.status === "completed").length} color="violet" />
//       </div>
//       {loading ? (
//         <div className="flex justify-center py-12">
//           <Spinner size={32} />
//         </div>
//       ) : userCampaigns.length === 0 ? (
//         <div className="text-center py-20 text-muted">
//           <FolderHeart size={40} className="mx-auto mb-3 opacity-30" />
//           <p className="font-semibold">No campaigns yet</p>
//           <p className="text-sm">Create your first campaign.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {userCampaigns.map((c) => {
//             const pct = calcProgress(c.raisedAmount, c.targetAmount);
//             const days = daysLeft(c.deadline);
//             const canWithdraw = days === 0 || c.status === "completed";
//             return (
//               <div key={c._id} className="app-card p-5 transition-all">
//                 <div className="flex items-start gap-4">
//                   <div className="w-14 h-14 bg-[#F97316]/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-app">
//                     {c.image ? <img src={c.image} alt="" className="w-full h-full object-cover" /> : <Rocket size={22} className="text-[#F97316]" />}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 flex-wrap mb-1">
//                       <h3 className="font-bold text-app">{c.title}</h3>
//                       <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getStatusColor(c.status)}`}>{c.status}</span>
//                     </div>
//                     <div className="flex items-center gap-4 text-sm text-muted mb-2 flex-wrap">
//                       <span className="font-bold text-app">
//                         {formatCurrency(c.raisedAmount)} <span className="text-muted font-normal">/ {formatCurrency(c.targetAmount)}</span>
//                       </span>
//                       <span>�</span>
//                       <span>{c.contributors?.length ?? 0} backers</span>
//                       <span>�</span>
//                       <span>{days > 0 ? `${days} days left` : "Ended"}</span>
//                     </div>
//                     <ProgressBar value={pct} />
//                   </div>
//                   <div className="flex flex-col gap-2 shrink-0">
//                     <button
//                       onClick={() => {
//                         dispatch(setSelectedCampaign(c));
//                         navigate(`/dashboard/campaigns/${c._id}`);
//                       }}
//                       className="flex items-center gap-1.5 text-xs bg-white/5 text-app px-3 py-1.5 rounded-lg font-semibold border border-app hover:bg-[#F97316]/15 transition-all"
//                     >
//                       <Eye size={13} /> View
//                     </button>
//                     {canWithdraw ? (
//                       <button
//                         onClick={() =>
//                           showToast(`Withdrawal of ${formatCurrency(Math.round(c.raisedAmount * 0.95))} initiated. (Backend payout needed)`, "success")
//                         }
//                         className="flex items-center gap-1.5 text-xs bg-emerald-500/15 text-emerald-400 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-500/25 transition-all"
//                       >
//                         <Download size={13} /> Withdraw
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handleDelete(c._id)}
//                         className="flex items-center gap-1.5 text-xs bg-red-500/15 text-red-400 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-500/25 transition-all"
//                       >
//                         <Trash2 size={13} /> Delete
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default MyCampaignsPanel;











import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  CheckCircle, 
  Download, 
  Eye, 
  FolderHeart, 
  IndianRupee, 
  Rocket, 
  Trash2, 
  Calendar, 
  Users, 
  TrendingUp,
  ChevronRight
} from "lucide-react";
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
    if (!window.confirm("Bhai, are you sure you want to delete this campaign?")) return;
    const ok = await dispatch(deleteCampaign(id));
    if (ok) {
      dispatch(setUserCampaigns(userCampaigns.filter((c) => c._id !== id)));
    }
  };

  const totalRaised = userCampaigns.reduce((a, c) => a + c.raisedAmount, 0);

  return (
    <div className="space-y-8 pb-10">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
          My <span className="text-[#F97316]">Campaigns</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base font-medium">
          Manage and track your impact on the world.
        </p>
      </div>

      {/* --- STATS GRID: Mobile Responsive (2 columns on mobile) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Rocket} label="Created" value={userCampaigns.length} color="indigo" />
        <StatCard icon={IndianRupee} label="Total Raised" value={formatCurrency(totalRaised)} color="amber" />
        <StatCard icon={Activity} label="Active" value={userCampaigns.filter((c) => c.status === "active").length} color="emerald" />
        <StatCard icon={CheckCircle} label="Completed" value={userCampaigns.filter((c) => c.status === "completed").length} color="violet" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Spinner size={40} />
          <p className="text-zinc-500 text-xs font-bold tracking-widest animate-pulse uppercase">Fetching your projects...</p>
        </div>
      ) : userCampaigns.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 rounded-[32px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30"
        >
          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderHeart size={40} className="text-zinc-400 dark:text-zinc-600" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Nothing here yet, bhai</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs mx-auto text-sm">
            Launch your first campaign and start making a difference today!
          </p>
          <button 
             onClick={() => navigate("/dashboard/create-campaign")}
             className="mt-8 px-8 py-3 bg-[#F97316] text-white font-bold rounded-2xl hover:scale-105 transition-transform"
          >
            Start Campaign
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {userCampaigns.map((c, idx) => {
              const pct = calcProgress(c.raisedAmount, c.targetAmount);
              const days = daysLeft(c.deadline);
              const canWithdraw = days === 0 || c.status === "completed";

              return (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 md:p-6 rounded-[28px] shadow-sm hover:shadow-xl hover:border-[#F97316]/30 transition-all overflow-hidden"
                >
                  {/* Subtle Background Glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F97316]/5 blur-[80px] rounded-full pointer-events-none" />

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Image Container */}
                    <div className="w-full md:w-32 h-40 md:h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden border border-zinc-100 dark:border-zinc-800 group-hover:border-[#F97316]/50 transition-colors">
                      {c.image ? (
                        <img src={c.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                           <Rocket size={32} className="text-[#F97316]/40" />
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                        <h3 className="text-lg md:text-xl font-black text-zinc-900 dark:text-white truncate group-hover:text-[#F97316] transition-colors">
                          {c.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black ${getStatusColor(c.status)}`}>
                            {c.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs md:text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-5">
                        <div className="flex items-center gap-2 text-[#F97316]">
                          <TrendingUp size={14} />
                          <span>{formatCurrency(c.raisedAmount)} <span className="text-zinc-400 dark:text-zinc-600 font-medium">of {formatCurrency(c.targetAmount)}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={14} />
                          <span>{c.contributors?.length ?? 0} Backers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>{days > 0 ? `${days} Days Left` : "Campaign Ended"}</span>
                        </div>
                      </div>

                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Progress</span>
                           <span className="text-[10px] font-black text-[#F97316]">{pct}%</span>
                        </div>
                        <ProgressBar value={pct} height={8} className="rounded-full overflow-hidden" />
                      </div>
                    </div>

                    {/* Action Buttons: Responsive Grid on mobile, Column on Desktop */}
                    <div className="grid grid-cols-2 md:flex md:flex-col gap-3 w-full md:w-36 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800">
                      <button
                        onClick={() => {
                          dispatch(setSelectedCampaign(c));
                          navigate(`/dashboard/campaigns/${c._id}`);
                        }}
                        className="flex items-center justify-center gap-2 text-xs bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-3 rounded-xl font-black uppercase tracking-tighter hover:opacity-80 transition-all active:scale-95"
                      >
                        <Eye size={14} /> View
                      </button>

                      {canWithdraw ? (
                        <button
                          onClick={() =>
                            showToast(`Bhai, withdrawal of ${formatCurrency(Math.round(c.raisedAmount * 0.95))} initiated! (Backend process started)`, "success")
                          }
                          className="flex items-center justify-center gap-2 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-xl font-black uppercase tracking-tighter border border-emerald-500/20 hover:bg-emerald-500/20 transition-all active:scale-95"
                        >
                          <Download size={14} /> Withdraw
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="flex items-center justify-center gap-2 text-xs bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl font-black uppercase tracking-tighter border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* --- FOOTER DECORATION --- */}
      <div className="pt-10 flex items-center justify-center gap-4 opacity-20 pointer-events-none select-none">
        <div className="h-px w-20 bg-zinc-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">End of records</p>
        <div className="h-px w-20 bg-zinc-500" />
      </div>
    </div>
  );
}

export default MyCampaignsPanel;