// src/pages/Library/LibraryController.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { libraryService } from "../../api/services/library.service";
import { useNotifications } from "../../context/NotificationContext";
import LibraryUI from "./LibraryUI";

export default function LibraryController() {
	const [myRequests, setMyRequests] = useState([]);
	const [borrowedBooks, setBorrowedBooks] = useState([]);
	const [availableBooks, setAvailableBooks] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filters, setFilters] = useState({
		category: "all",
		availability: "all",
		author: "all",
	});
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const { tab } = useParams();
	const navigate = useNavigate();
	const { refreshNotifications } = useNotifications();

	const activeTab = tab || "borrowed";

	useEffect(() => {
		fetchAllData();
		document.title = "Library";
	}, []);

	const availableCategories = [
		...new Set(availableBooks.map((b) => b.category)),
	];

	const availableAuthors = useMemo(() => {
		const authorSet = new Set();

		availableBooks.forEach((book) => {
			if (book.author) {
				const individualAuthors = book.author.split(/[&,]/);
				individualAuthors.forEach((name) => {
					const cleanName = name.trim();
					if (cleanName) authorSet.add(cleanName);
				});
			}
		});

		return Array.from(authorSet).sort();
	}, [availableBooks]);

	const fetchAllData = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await libraryService.getLibraryDashboard();

			if (res.success) {
				const { admins, requests, borrowed, inventory } = res.data;
				setMyRequests(requests);
				setBorrowedBooks(borrowed);
				setAvailableBooks(inventory);
				setAdmins(admins);
			} else {
				throw new Error("Failed to load dashboard data");
			}
		} catch (err) {
			setError("Failed to load library data. Please try again.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleRequestBook = async (bookId, duration) => {
		try {
			const res = await libraryService.requestBook(bookId, duration);

			if (res.success) {
				if (res.data) {
					setMyRequests((prev) => [res.data, ...prev]);
					// Refresh global notifications after a new request is made
					refreshNotifications();
				}
			} else {
				setError(res.message || "Failed to request book");
			}
		} catch (err) {
			console.error("Error requesting book:", err);
			setError("Failed to request book. Please try again.");
		}
	};

	const handleExtendBorrow = async (bookId, additionalDays) => {
		try {
			const res = await libraryService.requestExtension(
				bookId,
				additionalDays,
			);
			if (res.success) {
				setMyRequests((prev) => [res.data, ...prev]);
				// Refresh global notifications for the new extension request
				refreshNotifications();
			}
		} catch (err) {
			console.error("Error creating extension request:", err);
			setError("Failed to request extension.");
		}
	};

	const handleApproveExtension = async (
		requestId,
		bookId,
		additionalDays,
	) => {
		try {
			const res = await libraryService.approveExtension(
				requestId,
				bookId,
				additionalDays,
			);

			if (res.success) {
				setBorrowedBooks((prev) =>
					prev.map((b) =>
						b.id === bookId ? { ...b, dueDate: res.newDueDate } : b,
					),
				);

				setMyRequests((prev) => prev.filter((r) => r.id !== requestId));
				// Refresh global notifications as the status has changed
				refreshNotifications();
			} else {
				setError(res.message || "Failed to approve extension");
			}
		} catch (err) {
			console.error("Error approving extension:", err);
			setError("Failed to process extension approval.");
		}
	};

	const handleCancelRequest = async (requestId) => {
		try {
			const res = await libraryService.cancelRequest(requestId);
			if (res.success) {
				const cancelled = myRequests.find((r) => r.id === requestId);
				if (cancelled) {
					setAvailableBooks((prev) =>
						prev.map((book) =>
							book.isbn === cancelled.isbn
								? {
										...book,
										availableCopies:
											book.availableCopies + 1,
									}
								: book,
						),
					);
				}
				setMyRequests((prev) => prev.filter((r) => r.id !== requestId));
				// Refresh global notifications to remove the cancelled request item
				refreshNotifications();
			} else {
				setError(res.message || "Failed to cancel request");
			}
		} catch (err) {
			console.error("Error cancelling request:", err);
			setError("Failed to cancel request. Please try again.");
		}
	};

	const handleTabChange = (newTab) => {
		navigate(`/library/${newTab}`);
	};

	return (
		<LibraryUI
			myRequests={myRequests}
			borrowedBooks={borrowedBooks}
			availableBooks={availableBooks}
			admins={admins}
			loading={loading}
			error={error}
			onRequestBook={handleRequestBook}
			onCancelRequest={handleCancelRequest}
			onHandleExtendBorrow={handleExtendBorrow}
			handleApproveExtension={handleApproveExtension}
			onRefresh={fetchAllData}
			activeTab={activeTab}
			onTabChange={handleTabChange}
			filters={filters}
			setFilters={setFilters}
			isFilterOpen={isFilterOpen}
			setIsFilterOpen={setIsFilterOpen}
			availableCategories={availableCategories}
			availableAuthors={availableAuthors}
		/>
	);
}
