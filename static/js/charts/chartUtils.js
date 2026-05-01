import { metricLabel } from "../utils/formatters.js";

export function baseLayout(overrides = {}) {
  return {
    margin: { t: 18, r: 16, b: 48, l: 56 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: {
      family: "Manrope, sans-serif",
      color: "#1f2933",
    },
    ...overrides,
  };
}

export function renderEmptyChart(elementId, message = "No data available for the current filters.") {
  Plotly.newPlot(
    elementId,
    [],
    baseLayout({
      xaxis: { visible: false },
      yaxis: { visible: false },
      annotations: [
        {
          text: message,
          x: 0.5,
          y: 0.5,
          xref: "paper",
          yref: "paper",
          showarrow: false,
          font: { size: 15, color: "#5b6b79" },
        },
      ],
    }),
    { responsive: true, displayModeBar: false }
  );
}

export function metricAxisTitle(metric) {
  return metricLabel(metric);
}
