import { motion } from "framer-motion";
import { Rocket, ShieldCheck, Users } from "lucide-react";

const cards = [
  {
    id: 1,
    title: "Fast Launch",
    desc: "Create a campaign in minutes with smart templates.",
    icon: Rocket,
    tone: "from-[#F97316]/20 to-transparent",
  },
  {
    id: 2,
    title: "Secure Funding",
    desc: "Verified payments and transparent tracking for every rupee.",
    icon: ShieldCheck,
    tone: "from-[#FFD700]/20 to-transparent",
  },
  {
    id: 3,
    title: "Community Trust",
    desc: "Backers follow milestones and stay engaged with your story.",
    icon: Users,
    tone: "from-[#F97316]/20 to-transparent",
  },
];

const floatAnim = (delay = 0) => ({
  y: [0, -10, 0],
  transition: { duration: 5, repeat: Infinity, delay, ease: "easeInOut" },
});

const FloatCard = () => {
  return (
    <section className="relative w-full app-bg py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1F2937_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[300px] bg-[#F97316]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted">
            Why Inspirefund
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-app tracking-tighter mt-3">
            Built for creators. <span className="text-[#F97316]">Loved by backers.</span>
          </h2>
          <p className="text-muted text-base md:text-lg max-w-2xl mx-auto mt-4 italic">
            A crowdfunding experience that feels premium, transparent, and easy to trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                animate={floatAnim(idx * 0.6)}
                className="relative app-card p-8 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.tone} opacity-60`} />
                <div className="relative z-10 flex flex-col gap-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-app text-[#F97316]">
                    <Icon size={26} />
                  </div>
                  <h3 className="text-2xl font-black text-app tracking-tight uppercase">
                    {card.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed italic">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FloatCard;
