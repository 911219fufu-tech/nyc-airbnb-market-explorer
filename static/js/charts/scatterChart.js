import { baseLayout, metricAxisTitle, renderEmptyChart } from "./chartUtils.js";
import { formatCurrency, formatNumber, formatPercent, metricLabel } from "../utils/formatters.js";

function formatMetricValue(metric, value) {
  if (value === null || value === undefined) return "-";

  if (metric === "occupancy") return formatPercent(value);
  if (metric === "star_rating") return formatNumber(value, 2);
  return formatCurrency(value);
}

function markerSizes(values) {
  const validValues = values.filter((value) => typeof value === "number" && !Number.isNaN(value));
  const min = Math.min(...validValues, 0);
  const max = Math.max(...validValues, 0);

  if (!validValues.length || max === min) {
    return values.map(() => 14);
  }

  return values.map((value) => {
    const numericValue = typeof value === "number" && !Number.isNaN(value) ? value : min;
    const normalized = (numericValue - min) / (max - min);
    return 10 + normalized * 20;
  });
}

export function renderScatterChart(elementId, payload) {
  if (!payload.points.length) {
    renderEmptyChart(elementId);
    return;
  }

  const metric = payload.metric || "revenue";
  const metricValues = payload.points.map((point) => point.metric_value ?? point.revenue ?? 0);
  const subtitle = document.getElementById("scatter-subtitle");

  if (subtitle) {
    subtitle.textContent = `Latest filtered listing snapshot: price vs occupancy, sized and colored by ${metricLabel(
      metric
    ).toLowerCase()}.`;
  }

  Plotly.newPlot(
    elementId,
    [
      {
        type: "scatter",
        mode: "markers",
        x: payload.points.map((point) => point.avg_daily_rate),
        y: payload.points.map((point) => point.occupancy),
        text: payload.points.map(
          (point) =>
            `Listing ${point.listing_id}<br>${point.room_type}<br>ZIP ${point.zip_code}<br>${metricLabel(
              metric
            )}: ${formatMetricValue(metric, point.metric_value)}<br>Revenue: ${formatCurrency(
              point.revenue
            )}<br>Occupancy: ${formatPercent(point.occupancy)}`
        ),
        marker: {
          size: markerSizes(metricValues),
          color: metricValues,
          colorscale: "Tealgrn",
          opacity: 0.72,
          line: { width: 1, color: "rgba(255,255,255,0.7)" },
          showscale: true,
          colorbar: {
            title: metricAxisTitle(metric),
            thickness: 12,
            outlinewidth: 0,
          },
        },
        hovertemplate: "%{text}<extra></extra>",
      },
    ],
    baseLayout({
      xaxis: { title: "Average Daily Rate", gridcolor: "rgba(31,41,51,0.08)" },
      yaxis: { title: "Occupancy", gridcolor: "rgba(31,41,51,0.08)" },
    }),
    { responsive: true, displayModeBar: false }
  );
}
