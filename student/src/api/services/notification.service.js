// src/api/services/notification.service.js

import { apiCall } from "../client";

/**
 * Service for handling system notifications and user alerts.
 */
export const notificationService = {
	// Fetches all informational updates and status changes
	getNotifications: () => apiCall("/notifications"),

	// Marks a specific notification as read to clear it from the active list
	markAsRead: (id) =>
		apiCall(`/notifications/${id}/read`, {
			method: "POST",
		}),
};
