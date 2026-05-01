const banner = () => document.getElementById("status-banner");

export function showStatus(message, tone = "info") {
  const element = banner();
  element.textContent = message;
  element.dataset.tone = tone;
  element.hidden = false;
}

export function clearStatus() {
  const element = banner();
  element.textContent = "";
  element.hidden = true;
  delete element.dataset.tone;
}
