import React from "react";
import Hieghlightedtext from "../Home/Hieghlightedtext";

const QuoteSection = () => {
  return (
    <div className="relative z-10 flex flex-col items-center py-24 px-6 max-w-6xl mx-auto text-center">
      {/* Ambient glow to keep the same UI theme */}
      <div className="absolute inset-0 bg-[#F97316]/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <p className="text-3xl md:text-5xl font-bold leading-[1.3] tracking-tighter uppercase text-white relative z-10">
        "Crowdfunding should be about momentum, not complexity. At FundIndia,
        <Hieghlightedtext
          color="bg-gradient-to-r from-[#F97316] to-[#FFD700] bg-clip-text text-transparent px-3"
          data="every creator gets transparent tools and community support"
        />
        so ideas can move from a pitch to real-world impact."
      </p>

      <div className="mt-12 flex items-center gap-4 opacity-30">
        <div className="h-px w-12 bg-white"></div>
        <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-white">
          FundIndia Philosophy
        </span>
        <div className="h-px w-12 bg-white"></div>
      </div>
    </div>
  );
};

export default QuoteSection;
