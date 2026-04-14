import React from "react";
import { Link } from "react-router-dom";
import { Globe, Mail, Phone } from "lucide-react";

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-[#6b7280] hover:text-[#F97316] transition-all duration-300 flex items-center gap-1 group font-medium uppercase tracking-tighter"
    >
      <span className="w-0 h-[1px] bg-[#F97316] group-hover:w-3 transition-all"></span>
      {children}
    </Link>
  </li>
);

const ModernFooter = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-black text-white pt-24 pb-12 px-6 overflow-hidden border-t border-white/5 font-sans">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-[#F97316]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter uppercase">
                FundIndia
              </h2>
              <p className="text-[#F97316] text-[10px] font-bold uppercase tracking-[0.4em] mt-1">
                Crowdfunding Platform
              </p>
            </div>

            <p className="text-[#9ca3af] text-base max-w-md font-light leading-relaxed">
              Build, launch, and grow campaigns with transparent funding tools,
              verified payments, and milestone-driven updates for backers.
            </p>

            <div className="flex gap-4 mt-4">
              <a
                href="mailto:support@fundindia.com"
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#F97316] hover:text-black transition-all"
              >
                <Mail size={18} />
              </a>
              <a
                href="tel:+911234567890"
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#F97316] hover:text-black transition-all"
              >
                <Phone size={18} />
              </a>
              <a
                href="https://fundindia.com"
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#F97316] hover:text-black transition-all"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-white font-bold text-xl mb-8 uppercase tracking-tighter">
              Campaign Support
            </h3>

            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-1">
                  Email
                </p>
                <p className="text-sm text-gray-300">support@fundindia.com</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-1">
                  Phone
                </p>
                <p className="text-lg font-bold text-white">+91 12345 67890</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-1">
                  HQ
                </p>
                <p className="text-sm text-gray-300">
                  Bengaluru, India
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/5 pt-12">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F97316] mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4 text-xs">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F97316] mb-6">
              Platform
            </h4>
            <ul className="space-y-4 text-xs text-[#6b7280] font-bold tracking-widest uppercase">
              <li>Launch Campaign</li>
              <li>Secure Payments</li>
              <li>Milestone Updates</li>
              <li>Backer Community</li>
            </ul>
          </div>

          <div className="col-span-2 flex flex-col items-end justify-end">
            <button
              onClick={scrollToTop}
              className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#F97316] hover:text-black transition-all"
            >
              ^
            </button>
            <p className="text-[#4b5563] text-[9px] mt-4 font-bold uppercase tracking-[0.4em]">
              FundIndia
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold tracking-[0.2em] text-[#4b5563]">
          <p>(c) {new Date().getFullYear()} FUNDINDIA. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 uppercase">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
