import { ArrowUpRight } from "lucide-react";

function StatCard({ icon: Icon, label, value, growth, color = "indigo", loading = false }) {
  const colors = {
    indigo: "bg-[#F97316]/15 text-[#F97316]",
    amber: "bg-[#F97316]/15 text-[#F97316]",
    emerald: "bg-[#F97316]/15 text-[#F97316]",
    rose: "bg-[#F97316]/15 text-[#F97316]",
    violet: "bg-[#F97316]/15 text-[#F97316]",
    cyan: "bg-[#F97316]/15 text-[#F97316]",
  };
  return (
    <div className="app-card p-5 transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={18} />
        </div>
        {growth && (
          <span className="flex items-center gap-1 text-xs font-medium text-[#F97316]">
            <ArrowUpRight size={12} />
            {growth}
          </span>
        )}
      </div>
      {loading ? (
        <div className="h-7 w-24 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-app">{value}</p>
      )}
      <p className="text-xs text-muted mt-0.5">{label}</p>
    </div>
  );
}

export default StatCard;
