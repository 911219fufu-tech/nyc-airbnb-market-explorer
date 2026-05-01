import { baseLayout, metricAxisTitle, renderEmptyChart } from "./chartUtils.js";

export function renderTimeSeriesChart(elementId, payload) {
  if (!payload.points.length) {
    renderEmptyChart(elementId);
    return;
  }

  const trace = {
    x: payload.points.map((point) => point.month),
    y: payload.points.map((point) => point.value),
    type: "scatter",
    mode: "lines+markers",
    line: { color: "#c8553d", width: 3 },
    marker: { size: 7, color: "#0f4c5c" },
    fill: "tozeroy",
    fillcolor: "rgba(200, 85, 61, 0.08)",
  };

  Plotly.newPlot(
    elementId,
    [trace],
    baseLayout({
      xaxis: { title: "Month", gridcolor: "rgba(31,41,51,0.08)" },
      yaxis: { title: metricAxisTitle(payload.metric), gridcolor: "rgba(31,41,51,0.08)" },
    }),
    { responsive: true, displayModeBar: false }
  );
}
