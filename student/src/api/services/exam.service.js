// src/api/services/exam.service.js

import { apiCall } from "../client";

/**
 * Service for managing examination schedules and invigilation duties.
 */
export const examService = {
	/**
	 * Fetches the complete exam duty schedule for the authenticated user.
	 */
	getDuties: () => apiCall("/exams/duties"),

	/**
	 * Updates the status of an assigned exam duty (e.g., 'Checked-in', 'Rejected').
	 * @param {string|number} id - The specific duty assignment ID.
	 * @param {Object} payload - Status and optional remarks.
	 */
	updateDutyStatus: (id, payload) =>
		apiCall("/exams/duty/status", {
			method: "POST",
			body: JSON.stringify({ id, ...payload }),
		}),
};
