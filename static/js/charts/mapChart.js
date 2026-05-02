import { formatCurrency, formatNumber, formatPercent, metricLabel } from "../utils/formatters.js";
import { renderEmptyChart } from "./chartUtils.js";

const mapInstances = new Map();

function destroyMap(elementId) {
  const existing = mapInstances.get(elementId);
  if (existing) {
    existing.remove();
    mapInstances.delete(elementId);
  }
}

function getMetricText(metric, value) {
  if (metric === "occupancy") return formatPercent(value);
  if (metric === "star_rating") return formatNumber(value, 2);
  return formatCurrency(value);
}

function getMarkerColor(value, minValue, maxValue) {
  if (value === null || value === undefined || Number.isNaN(value)) return "#94a3b8";
  if (maxValue <= minValue) return "#c8553d";

  const ratio = (value - minValue) / (maxValue - minValue);
  if (ratio < 0.2) return "#fde8d0";
  if (ratio < 0.4) return "#f7c992";
  if (ratio < 0.6) return "#ef9b5f";
  if (ratio < 0.8) return "#df6c43";
  return "#b93d2f";
}

function buildLegend(metric, minValue, maxValue) {
  const legend = L.control({ position: "bottomright" });

  legend.onAdd = function onAdd() {
    const div = L.DomUtil.create("div", "map-legend");
    const steps = [0, 0.25, 0.5, 0.75, 1];

    div.innerHTML = `<strong>${metricLabel(metric)}</strong>`;

    for (const step of steps) {
      const value = minValue + (maxValue - minValue) * step;
      const color = getMarkerColor(value, minValue, maxValue);
      div.innerHTML += `
        <div class="map-legend-row">
          <span class="map-legend-swatch" style="background:${color}"></span>
          <span>${getMetricText(metric, value)}</span>
        </div>
      `;
    }

    return div;
  };

  return legend;
}

export function renderMapChart(elementId, payload) {
  destroyMap(elementId);

  const points = payload.points.filter((point) => point.latitude && point.longitude);

  if (!points.length) {
    renderEmptyChart(elementId);
    return;
  }

  const map = L.map(elementId, {
    zoomControl: true,
    scrollWheelZoom: true,
    keyboard: true,
  });

  mapInstances.set(elementId, map);

  const mapElement = document.getElementById(elementId);
  if (mapElement) {
    mapElement.setAttribute("tabindex", "0");
    mapElement.setAttribute("aria-label", "Spatial distribution map");
  }

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    subdomains: "abcd",
    maxZoom: 20,
  }).addTo(map);

  const metricValues = points
    .map((point) => point.metric_value)
    .filter((value) => value !== null && value !== undefined && !Number.isNaN(value));

  const minValue = metricValues.length ? Math.min(...metricValues) : 0;
  const maxValue = metricValues.length ? Math.max(...metricValues) : 1;
  const bounds = [];

  for (const point of points) {
    const marker = L.circleMarker([point.latitude, point.longitude], {
      radius: Math.max(6, Math.sqrt(point.listing_count) * 2.2),
      fillColor: getMarkerColor(point.metric_value, minValue, maxValue),
      color: "#ffffff",
      weight: 1.2,
      opacity: 1,
      fillOpacity: 0.8,
    }).addTo(map);

    marker.bindPopup(`
      <div class="map-popup">
        <div class="map-popup-head">
          <strong>ZIP ${point.zip_code}</strong>
          <span>${metricLabel(payload.metric)}</span>
        </div>
        <div class="map-popup-kpi">
          <span class="map-popup-kpi-label">Avg Revenue</span>
          <strong class="map-popup-kpi-value">${formatCurrency(point.avg_revenue)}</strong>
        </div>
        <div class="map-popup-grid">
          <div class="map-popup-item">
            <span>Listings</span>
            <strong>${formatNumber(point.listing_count)}</strong>
          </div>
          <div class="map-popup-item">
            <span>${metricLabel(payload.metric)}</span>
            <strong>${getMetricText(payload.metric, point.metric_value)}</strong>
          </div>
          <div class="map-popup-item">
            <span>Avg Daily Rate</span>
            <strong>${formatCurrency(point.avg_daily_rate)}</strong>
          </div>
          <div class="map-popup-item">
            <span>Avg Occupancy</span>
            <strong>${formatPercent(point.avg_occupancy)}</strong>
          </div>
        </div>
      </div>
    `);

    bounds.push([point.latitude, point.longitude]);
  }

  if (bounds.length) {
    map.fitBounds(bounds, { padding: [10, 10], maxZoom: 11 });
  } else {
    map.setView([40.7128, -74.006], 11);
  }

  buildLegend(payload.metric, minValue, maxValue).addTo(map);
}
