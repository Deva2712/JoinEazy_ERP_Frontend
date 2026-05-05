// src/api/services/devkit.service.js

import { apiCall } from "../client";

/**
 * Service for internal development and testing utilities (Devkit).
 * These endpoints should generally be disabled or restricted in production environments.
 */
export const devkitService = {
	// Fetches administrative devkit data and system status
	getDevkitData: () => apiCall("/devkit"),

	// Triggers the creation of mock or test data in the database
	createTestData: (data) =>
		apiCall("/devkit/create-test-data", {
			method: "POST",
			body: JSON.stringify(data),
		}),
};