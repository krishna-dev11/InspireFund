import React from "react";
import { Phone, MapPin, Clock, Sparkles } from "lucide-react";
import ContactForm from "./ContactForm";

const ContactInfoCard = ({ icon: Icon, title, detail }) => (
  <div className="flex items-center justify-between p-5 border border-[#1F2937] rounded-[1.5rem] bg-[#0A0A0A] hover:border-[#F97316]/50 transition-all duration-500 group cursor-pointer w-full backdrop-blur-sm">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-[#F97316]/20 bg-[#F97316]/10 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
        <Icon className="text-[#F97316]" size={20} />
      </div>
      <div>
        <p className="text-white font-bold text-sm mb-1 uppercase tracking-[0.1em]">
          {title}
        </p>
        <p className="text-gray-400 text-[11px] md:text-xs font-medium leading-relaxed">
          {detail}
        </p>
      </div>
    </div>
    <div className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 bg-white/5 group-hover:bg-[#F97316] group-hover:text-black transition-all duration-500 shrink-0 ml-4 shadow-lg">
      →
    </div>
  </div>
);

const GetInTouchSection = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen overflow-hidden font-sans bg-black">
      <div className="relative min-h-[600px] w-full lg:w-1/2 text-white flex flex-col justify-center px-8 md:px-16 lg:pl-24 py-20">
        <div className="absolute top-[10%] right-[-5%] select-none pointer-events-none">
          <h1 className="text-[12rem] md:text-[18rem] lg:text-[22rem] font-black tracking-tighter uppercase leading-none italic text-white/[0.015]">
            FUND
          </h1>
        </div>

        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F97316]/10 blur-[150px] rounded-full pointer-events-none opacity-60" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#F97316]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex items-center gap-2 px-4 py-2 w-fit rounded-full border border-[#333333] bg-[#111111] shadow-inner">
            <Sparkles className="text-[#F97316]" size={14} />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400">
              Support Node
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
              Get in <br />
              <span className="text-[#F97316] drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                touch
              </span>
            </h2>
          </div>

          <p className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-[480px] mb-4 font-medium italic">
            Need help launching or scaling a campaign? Our team supports founders,
            causes, and creators with campaign strategy, payouts, and trust tools.
          </p>

          <div className="flex flex-col gap-5 max-w-lg">
            <ContactInfoCard
              icon={Phone}
              title="Direct Support"
              detail="+91 12345 67890"
            />
            <ContactInfoCard
              icon={MapPin}
              title="HQ Location"
              detail="Bengaluru, India"
            />
            <ContactInfoCard
              icon={Clock}
              title="Working Hours"
              detail="Mon - Sat, 9 AM to 8 PM"
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:pr-24 py-20 relative bg-white/[0.01] border-l border-[#1F2937]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#F97316]/[0.02] blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[600px] relative z-10">
          <ContactForm
            heading="Talk to FundIndia"
            description="Share your campaign idea and we will help you plan the launch."
          />
        </div>
      </div>
    </div>
  );
};

export default GetInTouchSection;
