import { baseLayout, renderEmptyChart } from "./chartUtils.js";

export function renderScatterChart(elementId, payload) {
  if (!payload.points.length) {
    renderEmptyChart(elementId);
    return;
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
            `Listing ${point.listing_id}<br>${point.room_type}<br>ZIP ${point.zip_code}<br>Revenue: ${point.revenue}`
        ),
        marker: {
          size: payload.points.map((point) => Math.max(8, Math.sqrt(point.revenue || 0) / 8)),
          color: payload.points.map((point) => point.revenue || 0),
          colorscale: "Tealgrn",
          opacity: 0.72,
          line: { width: 1, color: "rgba(255,255,255,0.7)" },
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
