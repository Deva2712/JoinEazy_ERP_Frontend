// src/api/services/bulletin.service.js

import { apiCall } from "../client";

/**
 * Service for institutional announcements and bulletin board management.
 */
export const bulletinService = {
	/**
	 * Fetches bulletins filtered by level (e.g., departmentId, courseId).
	 * Converts the params object into a valid URL query string.
	 */
	getBulletins: (params = {}) => {
		const query = new URLSearchParams(params).toString();
		return apiCall(`/bulletins${query ? `?${query}` : ""}`);
	},

	/**
	 * Publishes a new announcement with support for attachments and priority levels.
	 */
	createBulletin: (data) =>
		apiCall("/bulletins", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	/**
	 * Removes a specific bulletin from the board.
	 */
	deleteBulletin: (bulletinId) =>
		apiCall(`/bulletins/${bulletinId}`, {
			method: "DELETE",
		}),

	/**
     * Updates an existing bulletin (e.g., pinning, editing content).
     */
    updateBulletin: (bulletinId, data) =>
        apiCall(`/bulletins/${bulletinId}`, {
            method: "PATCH", // Using PATCH for partial updates like pinning
            body: JSON.stringify(data),
        }),
};
