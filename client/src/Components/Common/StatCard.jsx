import { ArrowUpRight } from "lucide-react";

function StatCard({ icon: Icon, label, value, growth, color = "indigo", loading = false }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
    cyan: "bg-cyan-50 text-cyan-600",
  };
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={18} />
        </div>
        {growth && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <ArrowUpRight size={12} />
            {growth}
          </span>
        )}
      </div>
      {loading ? (
        <div className="h-7 w-24 bg-gray-100 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      )}
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

export default StatCard;
