// src/components/layout/Notifications/NotificationController.jsx

import React, { useState, useEffect } from "react";
import NotificationsUI from "./NotificationsUI";
import { useNotifications } from "../../../context/NotificationContext";

/**
 * Controller for the Notifications modal.
 * Coordinates data fetching and filtering logic.
 */
const NotificationsController = ({ isOpen, onClose }) => {
	const {
		notifications,
		isLoading,
		refreshNotifications,
		hasFetched,
		hasUnreadNotifications,
		markAsRead,
	} = useNotifications();

	const [filter, setFilter] = useState("ALL");

	useEffect(() => {
		if (isOpen) {
			refreshNotifications();
		}
	}, [isOpen]);

	/**
	 * Marks only the notifications currently visible in the
	 * filtered list as read.
	 */
	const markFilteredAsRead = () => {
		filteredNotifications.forEach((n) => {
			if (!n.isRead) markAsRead(n.id);
		});
	};

	// Derived state: Filtered list based on category and unread status
	const filteredNotifications = notifications.filter((n) => {
		const matchesCategory = filter === "ALL" || n.type.startsWith(filter);
		return matchesCategory && !n.isRead; // Only show unread notifications
	});

	return (
		<NotificationsUI
			isOpen={isOpen}
			onClose={onClose}
			notifications={notifications}
			displayNotifications={filteredNotifications}
			filter={filter}
			setFilter={setFilter}
			hasUnreadNotifications={hasUnreadNotifications}
			isLoading={isLoading && !hasFetched}
			onRefresh={refreshNotifications}
			onMarkAsRead={markAsRead}
			onMarkAllAsRead={markFilteredAsRead}
		/>
	);
};

export default NotificationsController;
