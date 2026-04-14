import React from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "../Components/Core/Home/HeroSection";
import WebGeneratedHero from "../Components/Core/Home/FloatCard";
import TestimonialSlider from "../Components/Core/Home/Testimonial/TestimonialSlider";
import ServiceHub from "../Components/Core/Home/ServiceHub";
import SocialStats from "../Components/Core/Home/SocialStats";
import ModernFooter from "../Components/Core/Home/ModernFooter";
import NavBar from "../Components/Common/NavBar";

const HomePage = () => {
  return (
    <div className="w-full  flex flex-col bg-black overflow-x-hidden">
      <NavBar />

      {/* ✅ SEO UPDATED FOR CROWDFUNDING */}
      <Helmet>
        <title>FundIndia | India's Smart Crowdfunding Platform</title>

        <meta
          name="description"
          content="Create campaigns, raise funds, and support impactful ideas across India. FundIndia is a modern crowdfunding platform for startups, social causes, and creators."
        />

        <meta
          name="keywords"
          content="Crowdfunding India, Raise Funds Online, Donation Platform, Startup Funding India, FundIndia"
        />

        <link rel="canonical" href="https://www.fundindia.com/" />

        <meta property="og:title" content="FundIndia | Crowdfunding Platform" />
        <meta property="og:description" content="Raise funds or support campaigns across India." />
      </Helmet>

      {/* HERO */}
      <div className="mx-auto pb-5 w-[98%]">
        <HeroSection />
      </div>

      {/* FLOATING CARDS / VISUAL */}
      <WebGeneratedHero />

      {/* TESTIMONIALS */}
      <TestimonialSlider />

      {/* SERVICES → (Now crowdfunding features) */}
      <ServiceHub />

      {/* STATS */}
      <SocialStats />

      {/* FOOTER */}
      <ModernFooter />
    </div>
  );
};

export default HomePage;
