import { initializeDashboard } from "./dashboard/dashboardController.js";

initializeDashboard().catch((error) => {
  console.error(error);
});
