function formatMonth(monthValue) {
  if (!monthValue) return "-";
  const [year, month] = monthValue.split("-");
  return `${year}-${Number(month)}`;
}

export function renderMapSubtitle(filters) {
  const subtitle = document.getElementById("map-subtitle");
  if (!subtitle) return;

  const startMonth = filters?.startMonth;
  const endMonth = filters?.endMonth;

  if (startMonth && endMonth) {
    subtitle.textContent = `Showing the selected date range: ${formatMonth(startMonth)} to ${formatMonth(endMonth)}.`;
    return;
  }

  subtitle.textContent = "Showing the selected date range.";
}
