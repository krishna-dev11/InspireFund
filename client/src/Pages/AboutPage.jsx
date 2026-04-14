import React from "react";
import Hieghlightedtext from "../Components/Core/Home/Hieghlightedtext";
import QuoteSection from "../Components/Core/About.jsx/QuoteSection";
import FoundingStory from "../Components/Core/About.jsx/FoundingStory";
import SocialStats from "../Components/Core/Home/SocialStats";
import ModernFooter from "../Components/Core/Home/ModernFooter";
import NavBar from "../Components/Common/NavBar";

const AboutPage = () => {
  return (
    <div className="relative w-full bg-black text-white overflow-x-hidden font-sans">
      <NavBar />

      {/* BACKGROUND WATERMARK */}
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 select-none pointer-events-none z-0">
        <h1 className="text-[18rem] md:text-[22rem] font-bold text-white/[0.02] uppercase">
          FundIndia
        </h1>
      </div>

      {/* GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#F97316]/10 blur-[150px] rounded-full" />

      {/* HERO */}
      <section className="relative z-10 pt-44 pb-16 px-6 text-center">
        <div className="max-w-6xl mx-auto">

          <div className="flex items-center justify-center gap-2 px-3 py-1.5 w-fit mx-auto rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">
              Our Mission
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1]">
            Empowering Ideas with <br />
            <Hieghlightedtext
              color="bg-gradient-to-r from-[#F97316] to-[#FFD700] bg-clip-text text-transparent"
              data="Community Funding"
            />
          </h2>

          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            FundIndia is built to empower creators, startups, and changemakers
            across India. We believe that every idea deserves a chance — and
            the right community can make it possible.
          </p>

        </div>
      </section>

      {/* QUOTE + STORY */}
      <section className="relative z-10 bg-black/40 backdrop-blur-md py-16">
        <QuoteSection />

        <div className="max-w-5xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto my-20"></div>

        <FoundingStory />
      </section>

      {/* STATS */}
      <section className="relative z-10 py-20">
        <SocialStats />
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-6">
          Start Your Campaign Today 🚀
        </h2>
        <p className="text-gray-400 mb-8">
          Join thousands of creators raising funds across India.
        </p>

        <a
          href="/dashboard/create"
          className="px-8 py-4 bg-[#F97316] text-black font-bold rounded-2xl hover:opacity-90 transition"
        >
          Create Campaign
        </a>
      </section>

      <ModernFooter />
    </div>
  );
};

export default AboutPage;
