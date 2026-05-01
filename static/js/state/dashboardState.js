const defaultState = {
  startMonth: "",
  endMonth: "",
  roomTypes: [],
  propertyTypes: [],
  zipCodes: [],
  metric: "revenue",
};

export function createDashboardState() {
  let state = { ...defaultState };

  return {
    getState() {
      return { ...state };
    },
    setState(patch) {
      state = { ...state, ...patch };
      return { ...state };
    },
    reset(basePatch = {}) {
      state = { ...defaultState, ...basePatch };
      return { ...state };
    },
  };
}
