// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { HandCoins, Rocket } from "lucide-react";
// import StatCard from "../../../Common/StatCard";
// import Spinner from "../../../Common/Spinner";
// import formatCurrency from "../../../../Utilities/formatCurrency";
// import { getUserContributions } from "../../../../Services/Operations/profileAPI";

// function ContributionsPanel() {
//   const dispatch = useDispatch();
//   const { userContributions, loading } = useSelector((state) => state.profile);

//   useEffect(() => {
//     dispatch(getUserContributions());
//   }, [dispatch]);

//   const total = userContributions.reduce((a, c) => a + c.amount, 0);

//   return (
//     <div>
//       <h1 className="text-2xl font-black text-app mb-1">My Contributions</h1>
//       <p className="text-muted text-sm mb-6">Projects you have backed with real Razorpay payments</p>
//       <div className="grid grid-cols-2 gap-4 mb-8">
//         <StatCard icon={HandCoins} label="Total Contributed" value={formatCurrency(total)} color="amber" />
//         <StatCard icon={Rocket} label="Campaigns Backed" value={userContributions.length} color="indigo" />
//       </div>
//       {loading ? (
//         <div className="flex justify-center py-12">
//           <Spinner size={32} />
//         </div>
//       ) : userContributions.length === 0 ? (
//         <div className="text-center py-20 text-muted">
//           <HandCoins size={40} className="mx-auto mb-3 opacity-30" />
//           <p className="font-semibold">No contributions yet</p>
//           <p className="text-sm">Back a campaign to see it here</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {userContributions.map((c, i) => (
//             <div key={i} className="app-card p-5 flex items-center gap-4 transition-all">
//               <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-app">
//                 {c.campaignId?.image ? (
//                   <img src={c.campaignId.image} alt="" className="w-full h-full object-cover" />
//                 ) : (
//                   <Rocket size={18} className="text-[#F97316]" />
//                 )}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-bold text-app truncate">{c.campaignId?.title || "Campaign"}</h3>
//                 <p className="text-xs text-muted mt-0.5">
//                   {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
//                 </p>
//                 {c.paymentId && <p className="text-xs font-mono text-muted mt-0.5">ID: {c.paymentId}</p>}
//               </div>
//               <div className="text-right shrink-0">
//                 <p className="font-black text-app">{formatCurrency(c.amount)}</p>
//                 <span
//                   className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
//                     c.status === "paid" ? "text-emerald-400 bg-emerald-500/15" : "text-amber-400 bg-amber-500/15"
//                   }`}
//                 >
//                   {c.status}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ContributionsPanel;






import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HandCoins, 
  Rocket, 
  Calendar, 
  Hash, 
  ArrowUpRight, 
  CreditCard,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import StatCard from "../../../Common/StatCard";
import Spinner from "../../../Common/Spinner";
import formatCurrency from "../../../../Utilities/formatCurrency";
import { getUserContributions } from "../../../../Services/Operations/profileAPI";

function ContributionsPanel() {
  const dispatch = useDispatch();
  const { userContributions, loading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getUserContributions());
  }, [dispatch]);

  const total = userContributions.reduce((a, c) => a + c.amount, 0);

  // Stagger animation variants
  const containerVars = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* --- HEADER: Backer Identity --- */}
      <div className="relative p-6 md:p-8 rounded-[32px] overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {/* Decorative Background Orb */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F97316]/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <ShieldCheck size={16} className="text-[#F97316]" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Verified Backer Portfolio</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
              My <span className="text-[#F97316]">Contributions</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">
              Empowering dreams through transparent Razorpay transactions.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-700/50">
             <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <TrendingUp size={20} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Growth Impact</p>
                <p className="text-lg font-black text-zinc-900 dark:text-white leading-none">Global Backer</p>
             </div>
          </div>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard icon={HandCoins} label="Total Contributed" value={formatCurrency(total)} color="amber" />
        <StatCard icon={Rocket} label="Campaigns Backed" value={userContributions.length} color="indigo" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Spinner size={40} />
          <p className="text-zinc-500 text-xs font-bold tracking-widest animate-pulse uppercase">Authenticating Transactions...</p>
        </div>
      ) : userContributions.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 rounded-[40px] border-2 border-dashed border-zinc-200 dark:border-zinc-800"
        >
          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard size={40} className="text-zinc-400 dark:text-zinc-600" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white italic">No history found, bhai</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">Every great journey starts with a small contribution.</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVars}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] px-2 mb-4">Transaction History</h2>
          
          <AnimatePresence>
            {userContributions.map((c, i) => (
              <motion.div
                key={i}
                variants={itemVars}
                whileHover={{ scale: 1.01 }}
                className="group relative flex flex-col md:flex-row items-center gap-6 p-5 md:p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[28px] shadow-sm hover:shadow-xl hover:border-[#F97316]/30 transition-all overflow-hidden"
              >
                {/* Campaign Image/Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-100 dark:bg-zinc-800 rounded-2xl shrink-0 overflow-hidden border border-zinc-100 dark:border-zinc-800 group-hover:border-[#F97316]/50 transition-colors">
                  {c.campaignId?.image ? (
                    <img src={c.campaignId.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <Rocket size={24} className="text-[#F97316]/40" />
                    </div>
                  )}
                </div>

                {/* Info Area */}
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h3 className="text-lg font-black text-zinc-900 dark:text-white truncate group-hover:text-[#F97316] transition-colors">
                      {c.campaignId?.title || "Anonymous Campaign"}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                       <Calendar size={12} />
                       <span>{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    {c.paymentId && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                         <Hash size={10} />
                         <span>TXN: {c.paymentId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount and Status Area */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800">
                  <div className="text-left md:text-right">
                    <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">
                      {formatCurrency(c.amount)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                       <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${c.status === "paid" ? "bg-emerald-500" : "bg-amber-500"}`} />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${c.status === "paid" ? "text-emerald-500" : "text-amber-500"}`}>
                        {c.status}
                       </span>
                    </div>
                  </div>
                  
                  <button className="p-3 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 hover:text-[#F97316] hover:bg-[#F97316]/10 transition-all active:scale-90">
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* --- TRUST FOOTER --- */}
      <div className="flex flex-col items-center justify-center gap-3 pt-6">
        <div className="flex items-center gap-2 opacity-30 select-none grayscale">
            <HandCoins size={14} />
            <div className="h-px w-12 bg-zinc-500" />
            <Rocket size={14} />
        </div>
        <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.4em] text-center">
          Powered by Secure Razorpay Node & SSL Encryption
        </p>
      </div>
    </div>
  );
}

export default ContributionsPanel;