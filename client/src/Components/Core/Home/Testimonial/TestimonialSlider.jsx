import React from "react";

const testimonials = [
  {
    id: 1,
    name: "Ananya Sharma",
    role: "Startup Founder",
    quote:
      "Inspirefund helped us move from a pitch deck to real customers. The platform feels premium and trustworthy.",
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Social Cause Lead",
    quote:
      "Transparent updates and easy payments made it simple to build trust with our backers.",
  },
  {
    id: 3,
    name: "Meera Joshi",
    role: "Creator",
    quote:
      "I launched in one evening and started receiving support the next day. Smooth experience.",
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Community Builder",
    quote:
      "The milestone tracking kept everyone engaged. Our campaign exceeded the goal.",
  },
];

const TestimonialSlider = () => {
  return (
    <section className="px-6 py-20 app-bg">
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-12">
        <h2 className="text-app text-3xl md:text-4xl font-bold tracking-tight uppercase">
          Backer <span className="text-[#F97316]">Stories</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="min-w-[280px] md:min-w-[320px] lg:min-w-[360px] snap-center"
            >
              <div className="group relative app-card p-8 h-full transition-all duration-500">
                <div className="absolute top-[-30%] right-[-20%] w-40 h-40 bg-[#F97316]/10 blur-[80px] rounded-full opacity-50" />

                <p className="text-muted text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>

                <div className="mt-8 pt-6 border-t border-app flex items-center justify-between">
                  <div>
                    <p className="text-app font-bold text-lg uppercase tracking-tight">
                      {t.name}
                    </p>
                    <p className="text-muted text-[10px] uppercase tracking-[0.3em]">
                      {t.role}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-app flex items-center justify-center text-[#F97316] text-sm font-black">
                    *
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
