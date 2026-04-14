export const formatNumber = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n || 0);

const formatCurrency = (n) => `\u20B9${formatNumber(n)}`;

export default formatCurrency;
