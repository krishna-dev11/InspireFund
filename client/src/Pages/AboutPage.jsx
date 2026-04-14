import React from "react";
import Hieghlightedtext from "../Components/Core/Home/Hieghlightedtext";
import QuoteSection from "../Components/Core/About.jsx/QuoteSection";
import FoundingStory from "../Components/Core/About.jsx/FoundingStory";
import SocialStats from "../Components/Core/Home/SocialStats";
import ModernFooter from "../Components/Core/Home/ModernFooter";
import PublicNavBar from "../Components/Common/PublicNavBar";
import PageWrapper from "../Components/Common/PageWrapper";

const AboutPage = () => {
  return (
    <PageWrapper className="relative w-full overflow-x-hidden font-sans">
      <PublicNavBar />

      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 select-none pointer-events-none z-0">
        <h1 className="text-[18rem] md:text-[22rem] font-bold text-black/5 dark:text-white/[0.02] uppercase">
          Inspirefund
        </h1>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#F97316]/10 blur-[150px] rounded-full" />

      <section className="relative z-10 pt-44 pb-16 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 px-3 py-1.5 w-fit mx-auto rounded-full bg-white/5 border border-app mb-8">
            <span className="text-[11px] font-bold tracking-widest uppercase text-muted">
              Our Mission
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] text-app">
            Empowering Ideas with <br />
            <Hieghlightedtext
              color="bg-gradient-to-r from-[#F97316] to-[#FFD700] bg-clip-text text-transparent"
              data="Community Funding"
            />
          </h2>

          <p className="text-muted text-lg max-w-3xl mx-auto leading-relaxed">
            Inspirefund is built to empower creators, startups, and changemakers
            across India. We believe that every idea deserves a chance and the
            right community can make it possible.
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-white/5 backdrop-blur-md py-16">
        <QuoteSection />
        <div className="max-w-5xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto my-20"></div>
        <FoundingStory />
      </section>

      <section className="relative z-10 py-20">
        <SocialStats />
      </section>

      <section className="relative z-10 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-6 text-app">
          Start Your Campaign Today
        </h2>
        <p className="text-muted mb-8">
          Join thousands of creators raising funds across India.
        </p>

        <a
          href="/dashboard/create"
          className="px-8 py-4 btn-primary rounded-2xl"
        >
          Create Campaign
        </a>
      </section>

      <ModernFooter />
    </PageWrapper>
  );
};

export default AboutPage;
