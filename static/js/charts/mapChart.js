import { baseLayout, metricAxisTitle, renderEmptyChart } from "./chartUtils.js";

export function renderMapChart(elementId, payload) {
  const points = payload.points.filter((point) => point.latitude && point.longitude);

  if (!points.length) {
    renderEmptyChart(elementId);
    return;
  }

  Plotly.newPlot(
    elementId,
    [
      {
        type: "scatter",
        x: points.map((point) => point.longitude),
        y: points.map((point) => point.latitude),
        mode: "markers",
        text: points.map(
          (point) =>
            `ZIP ${point.zip_code}<br>Listings: ${point.listing_count}<br>Metric: ${point.metric_value ?? "-"}`
        ),
        marker: {
          size: points.map((point) => Math.max(10, Math.sqrt(point.listing_count) * 2.5)),
          color: points.map((point) => point.metric_value ?? 0),
          colorscale: "YlOrRd",
          opacity: 0.78,
          showscale: true,
          colorbar: {
            title: metricAxisTitle(payload.metric),
          },
          line: {
            width: 1,
            color: "rgba(255,255,255,0.7)",
          },
        },
        hovertemplate: "%{text}<extra></extra>",
      },
    ],
    baseLayout({
      margin: { t: 12, r: 16, b: 52, l: 56 },
      xaxis: {
        title: "Longitude",
        gridcolor: "rgba(31,41,51,0.08)",
        zeroline: false,
      },
      yaxis: {
        title: "Latitude",
        gridcolor: "rgba(31,41,51,0.08)",
        zeroline: false,
        scaleanchor: "x",
        scaleratio: 1.25,
      },
    }),
    { responsive: true, displayModeBar: false }
  );
}
