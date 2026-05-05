// src/api/services/finance.service.js

import { apiCall } from "../client";

/**
 * Service for managing campus financial operations including expenses and advances.
 */
export const financeService = {
	/**
	 * Retrieves financial records based on type ('expenses' or 'advances').
	 */
	getRecords: (type) => apiCall(`/finance/${type}/list`),

	/**
	 * Submits a new financial request.
	 */
	createRecord: (type, data) =>
		apiCall(`/finance/${type}/create`, {
			method: "POST",
			body: JSON.stringify(data),
		}),

	/**
	 * Updates an existing financial record (Expense or Advance).
	 */
	updateRecord: (type, id, data) =>
		apiCall(`/finance/${type}/${id}/update`, {
			method: "PATCH",
			body: JSON.stringify(data),
		}),
};