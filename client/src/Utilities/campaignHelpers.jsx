export const calcProgress = (raised, target) => {
  if (!target) return 0;
  return Math.min(100, Math.round((Number(raised) / Number(target)) * 100));
};

export const daysLeft = (deadline) => {
  const diff = Math.ceil((new Date(deadline) - Date.now()) / 86400000);
  return diff > 0 ? diff : 0;
};

export const getStatusColor = (status) => {
  const map = {
    active: "bg-[#F97316]/15 text-[#F97316]",
    completed: "bg-emerald-500/15 text-emerald-400",
    pending: "bg-blue-500/15 text-blue-400",
    rejected: "bg-red-500/15 text-red-400",
    ended: "bg-white/10 text-muted",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};
