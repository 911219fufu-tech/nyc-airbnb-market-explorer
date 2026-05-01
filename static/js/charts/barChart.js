import { baseLayout, metricAxisTitle, renderEmptyChart } from "./chartUtils.js";

export function renderCategoryBarChart(elementId, payload, metricKey = "avg_revenue") {
  if (!payload.items.length) {
    renderEmptyChart(elementId);
    return;
  }

  const labels = payload.items.map((item) => item.label);
  const values = payload.items.map((item) => item[metricKey]);

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
      yaxis: { title: metricAxisTitle(metricKey.replace("avg_", "")), gridcolor: "rgba(31,41,51,0.08)" },
    }),
    { responsive: true, displayModeBar: false }
  );
}
