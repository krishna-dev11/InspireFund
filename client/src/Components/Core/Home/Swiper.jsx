import React from "react";
import EliteTextSwiper from "./EliteTextSwiper";
import heroImage from "../../../assets/Images/heroImage.png";

const Swiper = () => {
  return (
    <div className="relative z-10 mx-auto flex flex-col h-[57vh] md:h-[95vh] w-[95%] md:w-[98%] max-w-[1800px] border border-[#ffffff]/10 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden">

      {/* 🔥 BACKGROUND IMAGE FULL */}
      <img
        src={heroImage}
        alt="Crowdfunding Platform"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* 🔥 DARK OVERLAY (important for readability) */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* 🔥 GLASS EFFECT (optional but sexy) */}
      <div className="absolute inset-0 backdrop-blur-[2px] z-10" />

      {/* CONTENT */}
      <div className="relative flex-1 flex flex-col z-20">

        {/* TEXT SWIPER */}
        <div className="absolute top-[12%] left-0 right-0 flex justify-center pointer-events-none">
          <div className="pointer-events-auto w-full">
            <EliteTextSwiper />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Swiper;