function populateSelect(selectElement, values, { includeAll = false } = {}) {
  selectElement.innerHTML = "";

  if (includeAll) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "All";
    selectElement.append(option);
  }

  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.append(option);
  }
}

function getMultiSelectValues(selectElement) {
  return Array.from(selectElement.selectedOptions).map((option) => option.value);
}

export function initializeFilterControls(metadata, state, onChange) {
  const startMonth = document.getElementById("start-month");
  const endMonth = document.getElementById("end-month");
  const roomType = document.getElementById("room-type");
  const propertyType = document.getElementById("property-type");
  const zipCode = document.getElementById("zip-code");
  const metric = document.getElementById("metric");
  const resetButton = document.getElementById("reset-filters");

  populateSelect(startMonth, metadata.months, { includeAll: true });
  populateSelect(endMonth, metadata.months, { includeAll: true });
  populateSelect(roomType, metadata.room_types);
  populateSelect(propertyType, metadata.property_types);
  populateSelect(zipCode, metadata.zip_codes);

  startMonth.value = metadata.date_min.slice(0, 7);
  endMonth.value = metadata.date_max.slice(0, 7);

  state.setState({
    startMonth: startMonth.value,
    endMonth: endMonth.value,
  });

  function syncState() {
    state.setState({
      startMonth: startMonth.value,
      endMonth: endMonth.value,
      roomTypes: getMultiSelectValues(roomType),
      propertyTypes: getMultiSelectValues(propertyType),
      zipCodes: getMultiSelectValues(zipCode),
      metric: metric.value,
    });
    onChange(state.getState());
  }

  startMonth.addEventListener("change", syncState);
  endMonth.addEventListener("change", syncState);
  roomType.addEventListener("change", syncState);
  propertyType.addEventListener("change", syncState);
  zipCode.addEventListener("change", syncState);
  metric.addEventListener("change", syncState);

  resetButton.addEventListener("click", () => {
    startMonth.value = metadata.date_min.slice(0, 7);
    endMonth.value = metadata.date_max.slice(0, 7);
    metric.value = "revenue";
    for (const select of [roomType, propertyType, zipCode]) {
      Array.from(select.options).forEach((option) => {
        option.selected = false;
      });
    }

    state.reset({
      startMonth: startMonth.value,
      endMonth: endMonth.value,
      metric: metric.value,
    });
    onChange(state.getState());
  });
}
