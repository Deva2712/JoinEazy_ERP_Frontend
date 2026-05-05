// src/api/services/facultyLifecycle.service.js

import { apiCall } from "../client";

/**
 * Service for managing faculty promotions, tenure reviews,
 * sabbaticals, and inter-department transfers.
 */
export const facultyLifecycleService = {
	/**
	 * Fetches the full faculty lifecycle dashboard including summary, promotions, sabbaticals, tenure, and transfers.
	 */
	getDashboard: () => apiCall("/faculty-lifecycle/dashboard"),

	/**
	 * Approves a pending promotion request.
	 */
	approvePromotion: (id) =>
		apiCall(`/faculty-lifecycle/promotions/${id}/approve`, {
			method: "POST",
		}),

	/**
	 * Approves a pending sabbatical request.
	 */
	approveSabbatical: (id) =>
		apiCall(`/faculty-lifecycle/sabbaticals/${id}/approve`, {
			method: "POST",
		}),
};
