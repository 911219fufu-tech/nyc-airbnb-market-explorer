import { formatCurrency, formatNumber, formatPercent, metricLabel } from "../utils/formatters.js";

function getTopItem(items, key) {
  if (!items || !items.length) return null;
  return [...items]
    .filter((item) => item[key] !== null && item[key] !== undefined)
    .sort((a, b) => (b[key] ?? -Infinity) - (a[key] ?? -Infinity))[0] || null;
}

function metricValueText(metric, value) {
  if (metric === "occupancy") return formatPercent(value);
  if (metric === "star_rating") return formatNumber(value, 2);
  return formatCurrency(value);
}

export function renderInsights(filters, payload) {
  const summary = document.getElementById("insight-summary");
  const highlights = document.getElementById("insight-highlights");

  const topZip = getTopItem(payload.mapSummary.points, "metric_value");
  const topRoomType = getTopItem(payload.roomTypeSummary.items, "avg_revenue");
  const topPropertyType = getTopItem(payload.propertyTypeSummary.items, "avg_revenue");

  const pointCount = payload.timeseries.points.length;
  const firstPoint = pointCount ? payload.timeseries.points[0] : null;
  const lastPoint = pointCount ? payload.timeseries.points[pointCount - 1] : null;

  summary.textContent =
    `The filtered view covers ${formatNumber(payload.kpis.listing_count)} listings and ` +
    `${formatNumber(payload.kpis.host_count)} hosts. The selected focus metric is ` +
    `${metricLabel(filters.metric)}.`;

  const items = [];

  if (topZip) {
    items.push(
      `ZIP ${topZip.zip_code} currently leads the map on ${metricLabel(filters.metric).toLowerCase()} at ${metricValueText(filters.metric, topZip.metric_value)}.`
    );
  }

  if (topRoomType) {
    items.push(
      `${topRoomType.label} has the highest average revenue among room types at ${formatCurrency(topRoomType.avg_revenue)}.`
    );
  }

  if (topPropertyType) {
    items.push(
      `${topPropertyType.label} leads property categories with average revenue of ${formatCurrency(topPropertyType.avg_revenue)}.`
    );
  }

  if (firstPoint && lastPoint) {
    items.push(
      `The time series spans ${firstPoint.month} to ${lastPoint.month}, which helps check whether the current pattern is persistent or short-lived.`
    );
  }

  if (!items.length) {
    items.push("No strong patterns are available for the current filter selection.");
  }

  highlights.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    highlights.append(li);
  }
}
