// src/api/services/jobTray.service.js

import { apiCall } from "../client";

/**
 * Service for managing the Job Tray and pending background actions.
 */
export const jobTrayService = {
	/**
	 * Fetches the aggregated pending actions from the server
	 */
	getPendingJobs: () => apiCall("/job-tray"),
};