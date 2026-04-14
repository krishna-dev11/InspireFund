import React from "react";
import ModernFooter from "../Components/Core/Home/ModernFooter";
import TestimonialSlider from "../Components/Core/Home/Testimonial/TestimonialSlider";
import GetInTouchSection from "../Components/Core/About.jsx/GetInTouchSection";
import { Helmet } from "react-helmet-async";
import NavBar from "../Components/Common/NavBar";

const ContactUsPage = () => {
  return (
    <div className="w-full bg-black">
      <NavBar />

      {/* SEO */}
      <Helmet>
        <title>Contact FundIndia | Crowdfunding Support</title>

        <meta
          name="description"
          content="Contact FundIndia for campaign support, funding help, or technical assistance."
        />

        <meta
          name="keywords"
          content="Contact FundIndia, crowdfunding help, campaign support India"
        />

        <link rel="canonical" href="https://www.fundindia.com/contact" />
      </Helmet>

      {/* CONTACT SECTION */}
      <div className="w-full">
        <GetInTouchSection />
      </div>

      {/* TESTIMONIALS */}
      <div className="bg-[#050505] py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
            User <span className="text-[#F97316]">Experiences</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            What people say about FundIndia platform
          </p>
        </div>

        <TestimonialSlider />
      </div>

      <ModernFooter />
    </div>
  );
};

export default ContactUsPage;
