export function formatCurrency(value, maximumFractionDigits = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(value);
}

export function formatPercent(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatNumber(value, digits = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(value);
}

export function metricLabel(metric) {
  return {
    revenue: "Revenue",
    avg_daily_rate: "Average Daily Rate",
    occupancy: "Occupancy",
    revpar: "RevPAR",
    star_rating: "Star Rating",
  }[metric] || metric;
}
