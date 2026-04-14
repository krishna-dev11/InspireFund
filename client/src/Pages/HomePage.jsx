import React from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "../Components/Core/Home/HeroSection";
import WebGeneratedHero from "../Components/Core/Home/FloatCard";
import TestimonialSlider from "../Components/Core/Home/Testimonial/TestimonialSlider";
import ServiceHub from "../Components/Core/Home/ServiceHub";
import SocialStats from "../Components/Core/Home/SocialStats";
import ModernFooter from "../Components/Core/Home/ModernFooter";
import PublicNavBar from "../Components/Common/PublicNavBar";
import PageWrapper from "../Components/Common/PageWrapper";

const HomePage = () => {
  return (
    <PageWrapper className="w-full flex flex-col overflow-x-hidden">
      <PublicNavBar />

      <Helmet>
        <title>Inspirefund | India's Smart Crowdfunding Platform</title>

        <meta
          name="description"
          content="Create campaigns, raise funds, and support impactful ideas across India. Inspirefund is a modern crowdfunding platform for startups, social causes, and creators."
        />

        <meta
          name="keywords"
          content="Crowdfunding India, Raise Funds Online, Donation Platform, Startup Funding India, Inspirefund"
        />

        <link rel="canonical" href="https://www.inspirefund.com/" />

        <meta property="og:title" content="Inspirefund | Crowdfunding Platform" />
        <meta property="og:description" content="Raise funds or support campaigns across India." />
      </Helmet>

      <div className="mx-auto pb-5 w-[98%] pt-20">
        <HeroSection />
      </div>

      <WebGeneratedHero />
      <TestimonialSlider />
      <ServiceHub />
      <SocialStats />
      <ModernFooter />
    </PageWrapper>
  );
};

export default HomePage;
