import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { FaHandHoldingHeart, FaRocket, FaUsers, FaChartLine } from "react-icons/fa";

const ServiceCard = ({ icon: Icon, title, desc, tag, colSpan, bgGlow }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className={`${colSpan} group relative app-card p-8 overflow-hidden flex flex-col justify-between min-h-[280px] transition-all duration-500 hover:border-[#F97316]/40`}
  >
    <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full opacity-20 group-hover:opacity-40 ${bgGlow}`} />

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-app bg-white/5 group-hover:bg-[#F97316] group-hover:text-black transition-all">
          <Icon size={26} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted bg-white/5 px-3 py-1 rounded-full border border-app">
          {tag}
        </span>
      </div>

      <h3 className="text-2xl md:text-3xl font-black text-app uppercase tracking-tighter mb-3 group-hover:text-[#F97316] transition">
        {title}
      </h3>

      <p className="text-muted text-sm leading-relaxed max-w-[260px] italic">
        {desc}
      </p>
    </div>

    <div className="flex justify-end mt-6">
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-app group-hover:bg-[#F97316] group-hover:text-black transition">
        <FiArrowUpRight size={18} />
      </div>
    </div>
  </motion.div>
);

const ServiceHub = () => {
  return (
    <section className="w-full app-bg py-24 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 px-4">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black text-app uppercase tracking-tighter">
              Platform <span className="text-[#F97316]">Features</span>
            </h2>
            <p className="text-muted mt-6 text-lg italic">
              Everything you need to launch, fund, and grow impactful campaigns.
            </p>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[#F97316] text-4xl font-black">All-in-One</span>
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest">
              Crowdfunding Suite
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <ServiceCard
            icon={FaRocket}
            title="Launch Campaign"
            desc="Create and publish your campaign in minutes with powerful tools."
            tag="Create"
            colSpan="md:col-span-3"
            bgGlow="bg-[#F97316]"
          />

          <ServiceCard
            icon={FaHandHoldingHeart}
            title="Secure Funding"
            desc="Accept contributions securely with Razorpay integration."
            tag="Payments"
            colSpan="md:col-span-3"
            bgGlow="bg-[#FFD700]"
          />

          <ServiceCard
            icon={FaUsers}
            title="Community Support"
            desc="Build trust and grow your supporters with real engagement."
            tag="Backers"
            colSpan="md:col-span-2"
            bgGlow="bg-[#F97316]"
          />

          <ServiceCard
            icon={FaChartLine}
            title="Analytics Dashboard"
            desc="Track performance, growth, and funding insights in real-time."
            tag="Insights"
            colSpan="md:col-span-4"
            bgGlow="bg-white"
          />
        </div>
      </div>
    </section>
  );
};

export default ServiceHub;
