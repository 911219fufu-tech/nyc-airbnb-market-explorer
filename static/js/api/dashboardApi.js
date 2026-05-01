function buildQuery(filters = {}) {
  const params = new URLSearchParams();

  if (filters.startMonth) params.set("start_month", filters.startMonth);
  if (filters.endMonth) params.set("end_month", filters.endMonth);
  if (filters.metric) params.set("metric", filters.metric);

  for (const roomType of filters.roomTypes || []) {
    params.append("room_type", roomType);
  }
  for (const propertyType of filters.propertyTypes || []) {
    params.append("property_type", propertyType);
  }
  for (const zipCode of filters.zipCodes || []) {
    params.append("zip_code", zipCode);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export function fetchMetadata() {
  return fetchJson("/api/metadata");
}

export function fetchKpis(filters) {
  return fetchJson(`/api/kpis${buildQuery(filters)}`);
}

export function fetchTimeseries(filters) {
  return fetchJson(`/api/timeseries${buildQuery(filters)}`);
}

export function fetchCategorySummary(filters, dimension) {
  return fetchJson(`/api/categories/${dimension}${buildQuery(filters)}`);
}

export function fetchMapSummary(filters) {
  return fetchJson(`/api/map${buildQuery(filters)}`);
}

export function fetchScatter(filters) {
  return fetchJson(`/api/scatter${buildQuery(filters)}`);
}
