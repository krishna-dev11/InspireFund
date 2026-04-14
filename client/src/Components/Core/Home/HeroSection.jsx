import { Sparkles, MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen flex bg-[#000] text-white items-center justify-center overflow-hidden font-sans">

      {/* 🔥 BACKGROUND GLOW (SAME UI) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#F97316]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 text-center flex flex-col items-center gap-8 max-w-4xl px-6">

        {/* TOP BADGE */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Sparkles className="text-[#F97316]" size={16} />
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-gray-300">
            India's Crowdfunding Platform
          </span>
        </div>

        {/* HEADING */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-white tracking-tighter">
          Fund Ideas. <br />
          <span className="bg-gradient-to-r from-[#F97316] to-[#FFD700] bg-clip-text text-transparent font-bold">
            Change Lives.
          </span>
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-400 max-w-2xl text-base md:text-xl leading-relaxed">
          Launch your campaign, raise funds, and turn your vision into reality.
          Support causes, startups, and innovations that matter across India.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-5 mt-4">

          <button
            onClick={() => navigate("/dashboard/create")}
            className="group px-10 py-5 bg-white text-black font-bold rounded-2xl flex items-center gap-2 hover:bg-gray-200 transition-all"
          >
            Start Campaign
            <MoveRight className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate("/dashboard/campaigns")}
            className="px-10 py-5 border border-white/10 text-white font-bold rounded-2xl bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all"
          >
            Explore Campaigns
          </button>
        </div>

        {/* TRUST STATS */}
        <div className="mt-12 pt-8 border-t border-white/5 w-full flex flex-col md:flex-row items-center justify-center gap-8 opacity-50">
          <p className="text-[10px] font-bold tracking-widest uppercase">✓ 500+ Campaigns</p>
          <p className="text-[10px] font-bold tracking-widest uppercase">✓ ₹10L+ Raised</p>
          <p className="text-[10px] font-bold tracking-widest uppercase">✓ Trusted by Creators</p>
        </div>

      </div>
    </div>
  );
}