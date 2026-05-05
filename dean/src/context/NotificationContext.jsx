// src/context/NotificationContext.jsx
import React, {
	createContext,
	useContext,
	useState,
	useRef,
	useEffect,
	useMemo,
} from "react";
import { notificationService } from "../api/services/notification.service";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
	const [rawNotifications, setRawNotifications] = useState([]);
	const [readNotifIds, setReadNotifIds] = useState(() => {
		const saved = localStorage.getItem("readNotifIds");
		return saved ? JSON.parse(saved) : [];
	});
	const [isLoading, setIsLoading] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);
	const isFetching = useRef(false);

	/**
	 * Persist read status to local storage
	 */
	useEffect(() => {
		localStorage.setItem("readNotifIds", JSON.stringify(readNotifIds));
	}, [readNotifIds]);

	/**
	 * Checks if there are any notifications not present in the read list
	 */
	const hasUnreadNotifications = useMemo(() => {
		return rawNotifications.some((n) => !readNotifIds.includes(n.id));
	}, [rawNotifications, readNotifIds]);

	/**
	 * Maps raw data to include a boolean isRead flag for UI rendering
	 */
	const notifications = useMemo(() => {
		return rawNotifications.map((n) => ({
			...n,
			isRead: readNotifIds.includes(n.id),
		}));
	}, [rawNotifications, readNotifIds]);

	const refreshNotifications = async () => {
		if (isFetching.current) return;
		if (!hasFetched) setIsLoading(true);

		isFetching.current = true;
		try {
			const response = await notificationService.getNotifications();
			// Handle the response structure directly here
			setRawNotifications(response.success ? response.data : []);
			setHasFetched(true);
		} catch (error) {
			console.error("Error fetching notifications:", error);
			setRawNotifications([]);
		} finally {
			setIsLoading(false);
			isFetching.current = false;
		}
	};

	const markAsRead = async (id) => {
		if (!readNotifIds.includes(id)) {
			// Update local state immediately for snappy UI
			setReadNotifIds((prev) => [...prev, id]);

			try {
				// Sync with server directly
				await notificationService.markAsRead(id);
			} catch (error) {
				console.error("Error marking notification as read:", error);
			}
		}
	};

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				isLoading,
				refreshNotifications,
				hasFetched,
				hasUnreadNotifications,
				markAsRead,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotifications = () => useContext(NotificationContext);
