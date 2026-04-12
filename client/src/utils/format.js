export const fmt = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n || 0);
export const fmtCur = (n) => `₹${fmt(n)}`;
export const progress = (raised, target) => {
  if (!target) return 0;
  return Math.min(100, Math.round((Number(raised) / Number(target)) * 100));
};
export const daysLeft = (deadline) => {
  const diff = Math.ceil((new Date(deadline) - Date.now()) / 86400000);
  return diff > 0 ? diff : 0;
};
