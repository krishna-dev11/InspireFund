import React from "react";
import ModernFooter from "../Components/Core/Home/ModernFooter";
import TestimonialSlider from "../Components/Core/Home/Testimonial/TestimonialSlider";
import GetInTouchSection from "../Components/Core/About.jsx/GetInTouchSection";
import { Helmet } from "react-helmet-async";
import PublicNavBar from "../Components/Common/PublicNavBar";
import PageWrapper from "../Components/Common/PageWrapper";

const ContactUsPage = () => {
  return (
    <PageWrapper className="w-full">
      <PublicNavBar />

      <Helmet>
        <title>Contact Inspirefund | Crowdfunding Support</title>

        <meta
          name="description"
          content="Contact Inspirefund for campaign support, funding help, or technical assistance."
        />

        <meta
          name="keywords"
          content="Contact Inspirefund, crowdfunding help, campaign support India"
        />

        <link rel="canonical" href="https://www.inspirefund.com/contact" />
      </Helmet>

      <div className="w-full pt-20">
        <GetInTouchSection />
      </div>

      <div className="bg-surface-2 py-20 border-t border-app">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-app uppercase tracking-tight">
            User <span className="text-[#F97316]">Experiences</span>
          </h2>
          <p className="text-muted text-sm mt-2">
            What people say about Inspirefund platform
          </p>
        </div>

        <TestimonialSlider />
      </div>

      <ModernFooter />
    </PageWrapper>
  );
};

export default ContactUsPage;
