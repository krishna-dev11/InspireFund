import React, { useEffect, useRef, useState } from "react";

const stats = [
  { count: 500, label: "Campaigns Created", display: "500+" },
  { count: 1000000, label: "Funds Raised (INR)", display: "INR 10L+" },
  { count: 2000, label: "Active Backers", display: "2000+" },
  { count: 100, label: "Success Rate (%)", display: "100%" },
];

const AnimatedCounter = ({ target, display }) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = target;
          const duration = 1500;
          const increment = end / (duration / 16);

          const counter = setInterval(() => {
            start += increment;
            if (start >= end) {
              setValue(end);
              clearInterval(counter);
            } else {
              setValue(Math.floor(start));
            }
          }, 16);

          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
  }, [target]);

  return (
    <h2 ref={ref} className="text-5xl md:text-6xl font-black text-app tracking-tighter uppercase">
      {display}
    </h2>
  );
};

const SocialStats = () => {
  return (
    <div className="relative py-24 app-bg overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1F2937_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative max-w-7xl mx-auto px-8">
        <div className="flex flex-wrap justify-center gap-12">
          {stats.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center min-w-[200px] group">
              <AnimatedCounter target={item.count} display={item.display} />
              <div className="w-8 h-1 my-4 bg-[#F97316] rounded-full group-hover:scale-x-150 transition" />
              <p className="text-[10px] text-muted font-bold uppercase tracking-[0.3em]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialStats;
