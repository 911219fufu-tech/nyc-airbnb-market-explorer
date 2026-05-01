import { formatNumber } from "../utils/formatters.js";

export function renderMetadata(metadata) {
  document.getElementById("meta-date-range").textContent =
    `Date Range: ${metadata.date_min} to ${metadata.date_max}`;
  document.getElementById("meta-listing-count").textContent =
    `Listings: ${formatNumber(metadata.listing_count)}`;
  document.getElementById("meta-zip-count").textContent =
    `ZIP Codes: ${formatNumber(metadata.zip_code_count)}`;
}
