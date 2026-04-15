// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Rocket, ShieldCheck, Users, Sparkles } from "lucide-react";

// const cards = [
//   {
//     id: 1,
//     title: "Fast Launch",
//     desc: "Create a campaign in minutes with smart templates.",
//     icon: Rocket,
//     tone: "from-[#FF8A00] to-[#E52D27]",
//     shadowColor: "rgba(255, 138, 0, 0.25)",
//   },
//   {
//     id: 2,
//     title: "Secure Funding",
//     desc: "Verified payments and transparent tracking for every rupee.",
//     icon: ShieldCheck,
//     tone: "from-[#FFD700] to-[#E2A700]",
//     shadowColor: "rgba(255, 215, 0, 0.25)",
//   },
//   {
//     id: 3,
//     title: "Community Trust",
//     desc: "Backers follow milestones and stay engaged with your story.",
//     icon: Users,
//     tone: "from-[#FF8A00] to-[#E52D27]",
//     shadowColor: "rgba(255, 138, 0, 0.25)",
//   },
// ];

// const floatAnim = (delay = 0) => ({
//   y: [0, -20, 0],
//   transition: { duration: 6, repeat: Infinity, delay, ease: "easeInOut" },
// });

// const shineAnim = {
//   x: [-200, 400],
//   opacity: [0, 0.3, 0],
//   transition: { duration: 2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" },
// };

// const FloatCard = () => {
//   const [hoveredCard, setHoveredCard] = useState(null);

//   return (
//     <section className="relative w-full py-24 overflow-hidden bg-[#050505] text-white font-sans selection:bg-[#F97316]/30">
//       {/* --- Background Elements --- */}
//       <div className="absolute inset-0 z-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
//       <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[70%] h-[400px] bg-[#F97316]/5 blur-[140px] rounded-full pointer-events-none" />

//       <div className="relative z-10 max-w-7xl mx-auto px-6">
//         {/* --- Header Section --- */}
//         <div className="text-center mb-20">
//           <motion.div 
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6"
//           >
//             <Sparkles size={12} className="text-[#F97316]" />
//             <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400">
//               Why Inspirefund
//             </span>
//           </motion.div>
          
//           <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]">
//             Built for creators. <br />
//             <span className="bg-gradient-to-r from-[#FF8A00] to-[#E52D27] bg-clip-text text-transparent">
//               Loved by backers.
//             </span>
//           </h2>
//           <p className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto mt-6 font-medium italic">
//             "A crowdfunding experience that feels premium, transparent, and easy to trust."
//           </p>
//         </div>

//         {/* --- Cards Grid --- */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//           {cards.map((card, idx) => {
//             const Icon = card.icon;
//             const isHovered = hoveredCard === card.id;

//             return (
//               <motion.div
//                 key={card.id}
//                 animate={floatAnim(idx * 0.7)}
//                 onMouseEnter={() => setHoveredCard(card.id)}
//                 onMouseLeave={() => setHoveredCard(null)}
//                 className="relative group"
//               >
//                 {/* Volumetric Glow Background */}
//                 <AnimatePresence>
//                   {isHovered && (
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.8 }}
//                       className="absolute inset-0 blur-[100px] rounded-full z-0"
//                       style={{ background: card.shadowColor }}
//                     />
//                   )}
//                 </AnimatePresence>

//                 {/* Main Card Body */}
//                 <div className="relative z-10 h-full p-10 rounded-[32px] border border-white/5 bg-gradient-to-br from-[#111] to-[#080808] overflow-hidden transition-all duration-500 group-hover:border-white/20 group-hover:translate-y-[-8px]">
                  
//                   {/* Internal Glow Effect */}
//                   <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${card.tone} opacity-20 blur-[60px] group-hover:opacity-40 transition-opacity`} />
                  
//                   {/* Animated Shine Strip */}
//                   <motion.div 
//                     animate={shineAnim}
//                     className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-[-20deg] pointer-events-none"
//                   />

//                   <div className="relative z-20 flex flex-col gap-8 h-full">
//                     {/* Premium Icon Box */}
//                     <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/10 shadow-2xl relative overflow-hidden group-hover:border-[#F97316]/50 transition-colors">
//                        <div className={`absolute inset-0 bg-gradient-to-br ${card.tone} opacity-0 group-hover:opacity-10 transition-opacity`} />
//                        <Icon size={28} className="text-[#F97316] relative z-10" strokeWidth={1.5} />
//                     </div>

//                     <div className="flex flex-col gap-3">
//                       <h3 className="text-2xl font-black tracking-tight uppercase group-hover:text-[#F97316] transition-colors">
//                         {card.title}
//                       </h3>
//                       <p className="text-neutral-400 text-sm leading-relaxed italic font-light group-hover:text-neutral-200 transition-colors">
//                         {card.desc}
//                       </p>
//                     </div>

//                     {/* Decorative Bottom Line */}
//                     <div className="mt-auto pt-4">
//                         <div className="w-12 h-[2px] bg-white/10 rounded-full group-hover:w-full group-hover:bg-[#F97316]/50 transition-all duration-700" />
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FloatCard;









import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, ShieldCheck, Users, Sparkles } from "lucide-react";

const cards = [
  {
    id: 1,
    title: "Fast Launch",
    desc: "Create a campaign in minutes with smart templates.",
    icon: Rocket,
    tone: "from-[#FF8A00] to-[#E52D27]",
    shadowColor: "rgba(255, 138, 0, 0.15)", // Light mode ke liye thoda subtle
    darkShadowColor: "rgba(255, 138, 0, 0.25)",
  },
  {
    id: 2,
    title: "Secure Funding",
    desc: "Verified payments and transparent tracking for every rupee.",
    icon: ShieldCheck,
    tone: "from-[#FFD700] to-[#E2A700]",
    shadowColor: "rgba(255, 215, 0, 0.15)",
    darkShadowColor: "rgba(255, 215, 0, 0.25)",
  },
  {
    id: 3,
    title: "Community Trust",
    desc: "Backers follow milestones and stay engaged with your story.",
    icon: Users,
    tone: "from-[#FF8A00] to-[#E52D27]",
    shadowColor: "rgba(255, 138, 0, 0.15)",
    darkShadowColor: "rgba(255, 138, 0, 0.25)",
  },
];

const floatAnim = (delay = 0) => ({
  y: [0, -20, 0],
  transition: { duration: 6, repeat: Infinity, delay, ease: "easeInOut" },
});

const shineAnim = {
  x: [-200, 400],
  opacity: [0, 0.3, 0],
  transition: { duration: 2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" },
};

const FloatCard = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="relative w-full py-24 overflow-hidden bg-slate-50 dark:bg-[#050505] transition-colors duration-500 font-sans selection:bg-[#F97316]/30">
      
      {/* --- Dynamic Background Grid --- */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-40 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:32px_32px]" />
      
      {/* Ambient Glow (Adapts to Theme) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[70%] h-[400px] bg-[#F97316]/10 dark:bg-[#F97316]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md mb-6 shadow-sm"
          >
            <Sparkles size={12} className="text-[#F97316]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 dark:text-neutral-400">
              Why Inspirefund
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] text-slate-900 dark:text-white transition-colors">
            Built for creators. <br />
            <span className="bg-gradient-to-r from-[#FF8A00] to-[#E52D27] bg-clip-text text-transparent">
              Loved by backers.
            </span>
          </h2>
          <p className="text-slate-500 dark:text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto mt-6 font-medium italic">
            "A crowdfunding experience that feels premium, transparent, and easy to trust."
          </p>
        </div>

        {/* --- Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const isHovered = hoveredCard === card.id;

            return (
              <motion.div
                key={card.id}
                animate={floatAnim(idx * 0.7)}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative group"
              >
                {/* Volumetric Glow (Adapts based on theme) */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 blur-[100px] rounded-full z-0 opacity-60"
                      // Dark mode mein zyada glow, light mode mein subtle
                      style={{ background: card.darkShadowColor }}
                    />
                  )}
                </AnimatePresence>

                {/* Main Card Body */}
                <div className="relative z-10 h-full p-10 rounded-[32px] border border-slate-200 dark:border-white/5 bg-white dark:bg-gradient-to-br dark:from-[#111] dark:to-[#080808] overflow-hidden transition-all duration-500 shadow-xl shadow-slate-200/50 dark:shadow-none group-hover:border-[#F97316]/30 dark:group-hover:border-white/20 group-hover:translate-y-[-8px]">
                  
                  {/* Internal Glow Effect */}
                  <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${card.tone} opacity-10 dark:opacity-20 blur-[60px] group-hover:opacity-30 transition-opacity`} />
                  
                  {/* Animated Shine Strip */}
                  <motion.div 
                    animate={shineAnim}
                    className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-slate-400/10 dark:via-white/[0.03] to-transparent skew-x-[-20deg] pointer-events-none"
                  />

                  <div className="relative z-20 flex flex-col gap-8 h-full">
                    {/* Premium Icon Box */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl relative overflow-hidden group-hover:border-[#F97316]/50 transition-colors">
                       <div className={`absolute inset-0 bg-gradient-to-br ${card.tone} opacity-0 group-hover:opacity-10 transition-opacity`} />
                       <Icon size={28} className="text-[#F97316] relative z-10" strokeWidth={1.5} />
                    </div>

                    <div className="flex flex-col gap-3">
                      <h3 className="text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white group-hover:text-[#F97316] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-slate-600 dark:text-neutral-400 text-sm leading-relaxed italic font-light group-hover:text-slate-900 dark:group-hover:text-neutral-200 transition-colors">
                        {card.desc}
                      </p>
                    </div>

                    {/* Decorative Bottom Line */}
                    <div className="mt-auto pt-4">
                        <div className="w-12 h-[2px] bg-slate-200 dark:bg-white/10 rounded-full group-hover:w-full group-hover:bg-[#F97316]/50 transition-all duration-700" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FloatCard;