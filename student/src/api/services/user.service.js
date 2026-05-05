// src/api/services/user.service.js

import { apiCall } from "../client";

/**
 * Service for handling user-related data operations and profile management.
 */
export const userService = {
	// Get user dashboard overview
	getDashboardOverview: () => apiCall("/user/dashboard-overview"),

	// Get user details
	getUserDetails: (fields) => apiCall(`/user/details?fields=${fields}`),

	// Update user settings
	updateUserSettings: (settings) =>
		apiCall("/user/settings", {
			method: "PUT",
			body: JSON.stringify(settings),
		}),

	// Check username availability
	checkUsername: (username) =>
		apiCall(`/user/check-username?username=${username}`),

	// Submit a bug report
	submitBugReport: (formData) =>
		apiCall("/user/bug-report", {
			method: "POST",
			body: formData, // FormData is sent without JSON.stringify
		}),
};
