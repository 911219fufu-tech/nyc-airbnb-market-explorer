import {
  fetchKpis,
  fetchMapSummary,
  fetchMetadata,
  fetchScatter,
  fetchTimeseries,
} from "../api/dashboardApi.js";
import { fetchCategorySummary } from "../api/dashboardApi.js";
import { renderCategoryBarChart } from "../charts/barChart.js";
import { renderKpiCards } from "../charts/kpiCards.js";
import { renderMapChart } from "../charts/mapChart.js";
import { renderScatterChart } from "../charts/scatterChart.js";
import { renderTimeSeriesChart } from "../charts/timeSeriesChart.js";
import { createDashboardState } from "../state/dashboardState.js";
import { initializeFilterControls } from "../ui/filterControls.js";
import { renderInsights } from "../ui/insightPanel.js";
import { renderMetadata } from "../ui/metadataPanel.js";
import { clearStatus, showStatus } from "../ui/statusBanner.js";

async function loadDashboardPayload(filters) {
  const [kpis, timeseries, roomTypeSummary, mapSummary, scatter] =
    await Promise.all([
      fetchKpis(filters),
      fetchTimeseries(filters),
      fetchCategorySummary(filters, "room_type"),
      fetchMapSummary(filters),
      fetchScatter(filters),
    ]);

  return {
    kpis,
    timeseries,
    roomTypeSummary,
    mapSummary,
    scatter,
  };
}

function renderDashboard(filters, payload) {
  renderKpiCards(payload.kpis);
  renderTimeSeriesChart("timeseries-chart", payload.timeseries);
  renderCategoryBarChart("room-type-chart", payload.roomTypeSummary);
  renderMapChart("map-chart", payload.mapSummary);
  renderScatterChart("scatter-chart", payload.scatter);
  renderInsights(filters, payload);
}

export async function initializeDashboard() {
  if (!window.Plotly) {
    showStatus("Plotly failed to load in the browser. Refresh once and check your internet connection.", "error");
    return;
  }

  if (!window.L) {
    showStatus("Leaflet failed to load in the browser. Refresh once and check your internet connection.", "error");
    return;
  }

  showStatus("Loading dashboard data...");

  const metadata = await fetchMetadata();
  renderMetadata(metadata);

  const state = createDashboardState();

  const refreshDashboard = async (filters) => {
    try {
      showStatus("Refreshing dashboard...");
      const payload = await loadDashboardPayload(filters);
      renderDashboard(filters, payload);

      if (!payload.kpis.listing_count) {
        showStatus("No records match the current filters.", "warning");
        return;
      }

      clearStatus();
    } catch (error) {
      console.error(error);
      showStatus("Dashboard refresh failed. Check the console for details.", "error");
    }
  };

  initializeFilterControls(metadata, state, refreshDashboard);
  await refreshDashboard(state.getState());
}
