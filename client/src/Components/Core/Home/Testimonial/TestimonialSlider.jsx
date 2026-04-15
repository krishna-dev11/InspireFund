// import React from "react";
// import { motion } from "framer-motion";
// import { Quote, Star, ShieldCheck, Zap, Globe } from "lucide-react";

// const testimonials = [
//   {
//     id: 1,
//     name: "Ananya Sharma",
//     role: "Startup Founder",
//     quote: "Inspirefund helped us move from a pitch deck to real customers. The platform feels premium and trustworthy.",
//     color: "from-orange-500 to-red-500"
//   },
//   {
//     id: 2,
//     name: "Rahul Verma",
//     role: "Social Cause Lead",
//     quote: "Transparent updates and easy payments made it simple to build trust with our backers.",
//     color: "from-yellow-400 to-orange-600"
//   },
//   {
//     id: 3,
//     name: "Meera Joshi",
//     role: "Creator",
//     quote: "I launched in one evening and started receiving support the next day. Smooth experience.",
//     color: "from-orange-400 to-rose-500"
//   },
//   {
//     id: 4,
//     name: "Vikram Singh",
//     role: "Community Builder",
//     quote: "The milestone tracking kept everyone engaged. Our campaign exceeded the goal.",
//     color: "from-amber-500 to-orange-700"
//   },
// ];

// // Stats for the unique component addition
// const stats = [
//   { label: "Active Backers", value: "50K+", icon: Globe },
//   { label: "Trust Score", value: "99.9%", icon: ShieldCheck },
//   { label: "Avg. Launch Time", value: "24h", icon: Zap },
// ];

// const TestimonialSlider = () => {
//   // Infinite Scroll Duplicate
//   const duplicatedTestimonials = [...testimonials, ...testimonials];

//   return (
//     <section className="relative py-24 bg-[#050505] overflow-hidden">
//       {/* Background Orbs */}
//       <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full" />
//       <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full" />

//       {/* --- UNIQUE COMPONENT: Trust Stats Bar --- */}
//       <div className="max-w-7xl mx-auto px-6 mb-24">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {stats.map((stat, i) => (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.1 }}
//               key={i}
//               className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-6 group hover:bg-white/[0.04] transition-all"
//             >
//               <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
//                 <stat.icon size={28} />
//               </div>
//               <div>
//                 <h4 className="text-3xl font-black text-white italic">{stat.value}</h4>
//                 <p className="text-neutral-500 text-xs uppercase tracking-widest">{stat.label}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* --- Section Header --- */}
//       <div className="max-w-7xl mx-auto px-6 mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
//         <div>
//           <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
//             BACKER <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">STORIES</span>
//           </h2>
//           <p className="text-neutral-500 mt-4 text-lg max-w-md italic">
//             Real impact, real people. See how creators are changing the world.
//           </p>
//         </div>
//         <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-12 mb-4" />
//       </div>

//       {/* --- INFINITE SLIDER (Marquee) --- */}
//       <div className="relative flex overflow-hidden">
//         <motion.div
//           animate={{ x: ["0%", "-50%"] }}
//           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
//           className="flex gap-8 px-4"
//         >
//           {duplicatedTestimonials.map((t, idx) => (
//             <div
//               key={idx}
//               className="w-[350px] md:w-[450px] flex-shrink-0 group"
//             >
//               <div className="relative h-full p-10 rounded-[40px] bg-neutral-900/40 border border-white/5 backdrop-blur-xl transition-all duration-500 group-hover:border-orange-500/30 group-hover:bg-neutral-900/60">
                
//                 {/* Floating Quote Icon */}
//                 <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20 rotate-[-12deg] group-hover:rotate-0 transition-transform">
//                   <Quote size={20} className="text-white fill-white" />
//                 </div>

//                 <div className="flex flex-col h-full justify-between">
//                   <div>
//                     <div className="flex gap-1 mb-6">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} size={14} className="fill-orange-500 text-orange-500" />
//                       ))}
//                     </div>
//                     <p className="text-neutral-300 text-xl md:text-2xl leading-relaxed font-medium italic tracking-tight">
//                       "{t.quote}"
//                     </p>
//                   </div>

//                   <div className="mt-12 flex items-center gap-4 border-t border-white/5 pt-8">
//                     <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.color} p-[2px]`}>
//                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xl font-black italic">
//                         {t.name.charAt(0)}
//                        </div>
//                     </div>
//                     <div>
//                       <p className="text-white font-black text-lg uppercase tracking-tighter">
//                         {t.name}
//                       </p>
//                       <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em]">
//                         {t.role}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </motion.div>

//         {/* Gradient Overlays for smooth fade */}
//         <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
//         <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
//       </div>

//       {/* --- DECORATIVE ELEMENT: Background Text --- */}
//       <div className="absolute -bottom-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.02] select-none">
//         <h3 className="text-[200px] font-black leading-none whitespace-nowrap">
//           INSPIREFUND TRUSTED BY MILLIONS
//         </h3>
//       </div>
//     </section>
//   );
// };

// export default TestimonialSlider;









import React from "react";
import { motion } from "framer-motion";
import { Quote, Star, ShieldCheck, Zap, Globe } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ananya Sharma",
    role: "Startup Founder",
    quote: "Inspirefund helped us move from a pitch deck to real customers. The platform feels premium and trustworthy.",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Social Cause Lead",
    quote: "Transparent updates and easy payments made it simple to build trust with our backers.",
    color: "from-yellow-400 to-orange-600"
  },
  {
    id: 3,
    name: "Meera Joshi",
    role: "Creator",
    quote: "I launched in one evening and started receiving support the next day. Smooth experience.",
    color: "from-orange-400 to-rose-500"
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Community Builder",
    quote: "The milestone tracking kept everyone engaged. Our campaign exceeded the goal.",
    color: "from-amber-500 to-orange-700"
  },
];

const stats = [
  { label: "Active Backers", value: "50K+", icon: Globe },
  { label: "Trust Score", value: "99.9%", icon: ShieldCheck },
  { label: "Avg. Launch Time", value: "24h", icon: Zap },
];

const TestimonialSlider = () => {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="relative py-24 bg-zinc-50 dark:bg-[#050505] transition-colors duration-500 overflow-hidden">
      {/* Background Orbs - Opacity adjusted for Light Mode */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/[0.08] dark:bg-orange-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/[0.04] dark:bg-red-600/5 blur-[120px] rounded-full" />

      {/* --- UNIQUE COMPONENT: Trust Stats Bar --- */}
      <div className="max-w-7xl mx-auto px-6 mb-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="relative p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 flex items-center gap-6 group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500"
            >
              <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-500 group-hover:scale-110 transition-transform duration-500">
                <stat.icon size={32} />
              </div>
              <div>
                <h4 className="text-4xl font-black text-zinc-900 dark:text-white italic tracking-tighter">{stat.value}</h4>
                <p className="text-zinc-500 dark:text-neutral-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- Section Header --- */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-20">
        <div className="space-y-2">
          <h2 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
            BACKER <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">STORIES</span>
          </h2>
          <p className="text-zinc-500 dark:text-neutral-500 text-lg max-w-md italic font-medium">
            Real impact, real people. See how creators are changing the world.
          </p>
        </div>
        <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300 dark:via-white/10 to-transparent mx-12 mb-4" />
      </div>

      {/* --- INFINITE SLIDER (Marquee) --- */}
      <div className="relative flex overflow-hidden group/marquee">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 px-4"
        >
          {duplicatedTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="w-[320px] md:w-[450px] flex-shrink-0 group/card"
            >
              <div className="relative h-full p-8 md:p-10 rounded-[40px] bg-white dark:bg-neutral-900/40 border border-zinc-200 dark:border-white/5 backdrop-blur-xl transition-all duration-500 group-hover/card:border-orange-500/30 group-hover/card:shadow-3xl">
                
                {/* Floating Quote Icon */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-600/30 rotate-[-12deg] group-hover/card:rotate-0 transition-transform duration-500">
                  <Quote size={22} className="text-white fill-white" />
                </div>

                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-orange-500 text-orange-500" />
                      ))}
                    </div>
                    <p className="text-zinc-800 dark:text-neutral-200 text-lg md:text-2xl leading-relaxed font-semibold italic tracking-tight">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="mt-12 flex items-center gap-4 border-t border-zinc-100 dark:border-white/5 pt-8">
                    {/* Adaptive Avatar */}
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.color} p-[2px] shadow-lg`}>
                       <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center text-xl font-black italic text-zinc-900 dark:text-white">
                        {t.name.charAt(0)}
                       </div>
                    </div>
                    <div>
                      <p className="text-zinc-900 dark:text-white font-black text-lg uppercase tracking-tighter">
                        {t.name}
                      </p>
                      <p className="text-orange-600 dark:text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Adaptive Gradient Overlays for smooth fade */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-48 bg-gradient-to-r from-zinc-50 dark:from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 md:w-48 bg-gradient-to-l from-zinc-50 dark:from-[#050505] to-transparent z-10 pointer-events-none" />
      </div>

      {/* --- DECORATIVE ELEMENT: Background Text --- */}
      <div className="absolute -bottom-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.02] select-none">
        <h3 className="text-[120px] md:text-[200px] font-black leading-none whitespace-nowrap text-zinc-900 dark:text-white">
          INSPIREFUND TRUSTED BY MILLIONS
        </h3>
      </div>
    </section>
  );
};

export default TestimonialSlider;