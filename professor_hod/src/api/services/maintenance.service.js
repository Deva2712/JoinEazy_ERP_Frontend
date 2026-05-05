// src/api/services/maintenance.service.js

import { apiCall } from "../client";

/**
 * Service for campus facility maintenance and infrastructure requests.
 */
export const maintenanceService = {
	/**
	 * Retrieves the history of maintenance requests submitted by the current user.
	 */
	getMyRequests: () => apiCall("/maintenance/my-requests", { method: "GET" }),

	/**
	 * Submits a new ticket for facility repair or maintenance.
	 * @param {Object} requestData - Includes category, description, and location.
	 */
	createRequest: (requestData) =>
		apiCall("/maintenance/requests", {
			method: "POST",
			body: JSON.stringify(requestData),
		}),

	/**
	 * Updates the status (e.g., 'In Progress', 'Resolved') of a specific request.
	 */
	updateStatus: (requestId, statusData) =>
		apiCall(`/maintenance/requests/${requestId}/status`, {
			method: "PATCH",
			body: JSON.stringify(statusData),
		}),
};
