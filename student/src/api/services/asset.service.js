// src/api/services/asset.service.js

import { apiCall } from "../client";

/**
 * Service for managing campus asset bookings and resource requests.
 */
export const assetService = {
	/**
	 * Retrieves a comprehensive catalog of all bookable campus assets.
	 */
	getAssets: () => apiCall("/assets/catalog"),

	/**
	 * Fetches all booking requests associated with the authenticated user.
	 */
	getRequests: () => apiCall("/assets/requests"),

	/**
	 * Submits a new reservation request for a specific asset.
	 */
	createRequest: (requestData) =>
		apiCall("/assets/requests", {
			method: "POST",
			body: JSON.stringify(requestData),
		}),

	/**
	 * Modifies a pending or existing asset booking request.
	 */
	updateRequest: (requestId, requestData) =>
		apiCall(`/assets/requests/${requestId}`, {
			method: "PUT",
			body: JSON.stringify(requestData),
		}),
};
