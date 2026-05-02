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

function populateCheckboxGroup(containerElement, values, groupName) {
  containerElement.innerHTML = "";

  for (const value of values) {
    const label = document.createElement("label");
    label.className = "checkbox-option";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = value;
    input.name = groupName;

    const text = document.createElement("span");
    text.textContent = value;

    label.append(input, text);
    containerElement.append(label);
  }
}

function getCheckedValues(containerElement) {
  return Array.from(containerElement.querySelectorAll("input:checked")).map((input) => input.value);
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
  populateCheckboxGroup(roomType, metadata.room_types, "room-type");
  populateCheckboxGroup(propertyType, metadata.property_types, "property-type");
  populateCheckboxGroup(zipCode, metadata.zip_codes, "zip-code");

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
      roomTypes: getCheckedValues(roomType),
      propertyTypes: getCheckedValues(propertyType),
      zipCodes: getCheckedValues(zipCode),
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
    for (const group of [roomType, propertyType, zipCode]) {
      Array.from(group.querySelectorAll("input")).forEach((input) => {
        input.checked = false;
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
