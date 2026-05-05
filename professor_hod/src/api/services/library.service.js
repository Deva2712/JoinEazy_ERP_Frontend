// src/api/services/library.service.js

import { apiCall } from "../client";

/**
 * Service for campus library management and book circulation.
 */
export const libraryService = {
	/**
	 * Retrieves the library dashboard, including current loans and recommendations.
	 */
	getLibraryDashboard: () => apiCall("/library/dashboard"),

	/**
	 * Submits a request to borrow a specific book from the inventory.
	 */
	requestBook: (bookId, durationDays) =>
		apiCall("/library/request", {
			method: "POST",
			body: JSON.stringify({ bookId, durationDays }),
		}),

	/**
	 * Withdraws a pending book request before it is processed.
	 */
	cancelRequest: (requestId) =>
		apiCall(`/library/requests/${requestId}`, {
			method: "DELETE",
		}),

	/**
	 * Notifies the system that a borrowed book is being returned.
	 */
	returnBook: (bookId) =>
		apiCall("/library/return", {
			method: "POST",
			body: JSON.stringify({ bookId }),
		}),

	/**
	 * Student/Faculty action: Requests more time for a borrowed item.
	 */
	requestExtension: (bookId, additionalDays) =>
		apiCall("/library/extend", {
			method: "POST",
			body: JSON.stringify({ bookId, additionalDays }),
		}),

	/**
	 * Librarian action: Grants a requested due-date extension.
	 */
	approveExtension: (requestId, bookId, additionalDays) =>
		apiCall("/library/approve-extension", {
			method: "POST",
			body: JSON.stringify({ requestId, bookId, additionalDays }),
		}),
};
