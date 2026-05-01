import { formatCurrency, formatNumber, formatPercent } from "../utils/formatters.js";

export function renderKpiCards(payload) {
  document.getElementById("kpi-listings").textContent = formatNumber(payload.listing_count);
  document.getElementById("kpi-hosts").textContent = formatNumber(payload.host_count);
  document.getElementById("kpi-rate").textContent = formatCurrency(payload.avg_daily_rate);
  document.getElementById("kpi-occupancy").textContent = formatPercent(payload.avg_occupancy);
  document.getElementById("kpi-revenue").textContent = formatCurrency(payload.avg_revenue);
  document.getElementById("kpi-revpar").textContent = formatCurrency(payload.avg_revpar);
}
