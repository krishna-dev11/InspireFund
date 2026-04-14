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
    active: "bg-amber-100 text-amber-700",
    completed: "bg-emerald-100 text-emerald-700",
    pending: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-600",
    ended: "bg-gray-100 text-gray-600",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};
