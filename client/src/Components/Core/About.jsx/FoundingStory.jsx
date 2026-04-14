import React from "react";
import Hieghlightedtext from "../Home/Hieghlightedtext";

const platformStory = [
  {
    id: 1,
    type: "Text",
    heading: "Built for creators, trusted by backers",
    description1:
      "FundIndia started with a simple mission: remove friction between bold ideas and the people willing to support them. Whether you are funding a startup, a social cause, or a community project, we help you launch with clarity and confidence.",
    description2:
      "Our platform focuses on secure payments, transparent milestones, and real-time updates so supporters always know where their money goes. That trust is what turns one-time backers into long-term believers.",
  },
  {
    id: 2,
    type: "Image",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop",
  },
];

const FoundingStory = () => {
  return (
    <div className="relative w-full py-24 overflow-hidden">
      <div className="absolute top-0 right-[-5%] select-none pointer-events-none z-0">
        <h2 className="text-[12rem] md:text-[18rem] font-black tracking-tighter uppercase leading-none text-white/[0.015]">
          JOURNEY
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {platformStory.map((story) =>
            story.type === "Image" ? (
              <div
                key={story.id}
                className="relative flex justify-center group order-last lg:order-none"
              >
                <div className="absolute -inset-4 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-80 transition duration-1000 bg-gradient-to-r from-[#F97316]/20 to-transparent"></div>

                <div className="relative p-3 border border-[#1F2937] rounded-[2.5rem] bg-[#0A0A0A] backdrop-blur-sm shadow-2xl overflow-hidden">
                  <img
                    src={story.imageUrl}
                    alt="FundIndia community"
                    className="w-full max-w-[500px] rounded-[2rem] object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105"
                  />
                </div>
              </div>
            ) : (
              <div
                key={story.id}
                className="flex flex-col gap-8 p-8 md:p-14 border border-[#111111] rounded-[3rem] shadow-inner relative overflow-hidden bg-[#050505]"
              >
                <div className="flex flex-col gap-4">
                  <div className="w-20 h-1.5 rounded-full mb-2 bg-gradient-to-r from-[#F97316] to-[#FFD700]"></div>
                  <Hieghlightedtext
                    color="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent uppercase"
                    data={story.heading}
                  />
                </div>

                <div className="flex flex-col gap-8">
                  <p className="text-gray-400 text-lg leading-relaxed font-light italic">
                    {story.description1}
                  </p>
                  <p className="text-[#F97316] text-base md:text-lg leading-relaxed border-l-4 pl-8 py-6 rounded-r-2xl bg-[#F97316]/[0.03] border-[#F97316]/20">
                    {story.description2}
                  </p>
                </div>

                <div className="pt-6 flex items-center gap-4 opacity-20">
                  <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-white">
                    Serving Creators Nationwide
                  </span>
                  <div className="h-px flex-1 bg-white/20"></div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FoundingStory;
