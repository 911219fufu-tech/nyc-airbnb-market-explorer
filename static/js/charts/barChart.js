import { baseLayout, metricAxisTitle, renderEmptyChart } from "./chartUtils.js";
import { metricLabel } from "../utils/formatters.js";

const CATEGORY_METRIC_KEY = {
  revenue: "avg_revenue",
  avg_daily_rate: "avg_daily_rate",
  occupancy: "avg_occupancy",
  revpar: "avg_revpar",
};

export function renderCategoryBarChart(elementId, payload, metric = "revenue") {
  if (!payload.items.length) {
    renderEmptyChart(elementId);
    return;
  }

  const metricKey = CATEGORY_METRIC_KEY[metric] || "avg_revenue";
  const labels = payload.items.map((item) => item.label);
  const values = payload.items.map((item) => item[metricKey]);
  const subtitle = document.getElementById("room-type-subtitle");

  if (subtitle) {
    subtitle.textContent = `Compare average ${metricLabel(metric).toLowerCase()} across room types.`;
  }

  Plotly.newPlot(
    elementId,
    [
      {
        x: labels,
        y: values,
        type: "bar",
        marker: {
          color: ["#c8553d", "#0f4c5c", "#f0a202", "#5f7c8a", "#7a8b99"],
        },
      },
    ],
    baseLayout({
      xaxis: { tickangle: -20 },
      yaxis: { title: metricAxisTitle(metric), gridcolor: "rgba(31,41,51,0.08)" },
    }),
    { responsive: true, displayModeBar: false }
  );
}
