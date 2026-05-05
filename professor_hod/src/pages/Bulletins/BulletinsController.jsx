// src/pages/Bulletins/BulletinsController.jsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bulletinService } from "../../api/services/bulletin.service";
import { announcementService } from "../../api/services/announcement.service";
import { userService } from "../../api/services/user.service";
import BulletinsUI from "./BulletinsUI";

const BulletinsController = ({ userRole }) => {
	const { tab } = useParams();
	const navigate = useNavigate();
	const [bulletins, setBulletins] = useState([]);
	const [cohorts, setCohorts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const activeTab = tab || "general";

	const [filters, setFilters] = useState({
		search: "",
		category: "all",
		priority: "all",
		dateRange: "all",
		course: "all",
		batch: "all",
		// Sub-filter for archive tab
		archiveType: "general",
	});

	useEffect(() => {
		window.scrollTo(0, 0);
		document.title = "Bulletins";
	}, []);

	const stats = useMemo(() => {
		const now = new Date();
		const todayStr = now.toISOString().split("T")[0];
		const startOfWeek = new Date(now);
		startOfWeek.setDate(now.getDate() - now.getDay());
		startOfWeek.setHours(0, 0, 0, 0);

		return bulletins.reduce(
			(acc, b) => {
				const bDate = new Date(b.createdAt || b.created_at || b.date);
				const dateStr = bDate.toISOString().split("T")[0];

				if (dateStr === todayStr) acc.todayCount++;

				const isHighPriority =
					["high", "urgent"].includes(b.priority?.toLowerCase()) ||
					b.is_pinned;
				if (isHighPriority && bDate >= startOfWeek)
					acc.priorityThisWeek++;

				return acc;
			},
			{ todayCount: 0, priorityThisWeek: 0 },
		);
	}, [bulletins]);

	const filteredBulletins = useMemo(() => {
		return bulletins
			.filter((b) => {
				const bDate = new Date(b.createdAt || b.created_at || b.date);
				const now = new Date();
				const diffDays = Math.ceil(
					Math.abs(now - bDate) / (1000 * 60 * 60 * 24),
				);

				/**
				 * Primary Tab Filtering Logic
				 * Archive tab handles items > 30 days.
				 * Other tabs handle current items.
				 */
				if (activeTab === "archive") {
					if (diffDays <= 30) return false;

					// Handle the faculty-only toggle inside archive
					const isFacultyOnly =
						filters.archiveType === "faculty-only";
					if (isFacultyOnly && !b.faculty_only) return false;
					if (!isFacultyOnly && b.faculty_only) return false;
				} else {
					if (diffDays > 30) return false;

					if (activeTab === "faculty-only") {
						if (!b.faculty_only) return false;
					} else {
						if (b.faculty_only) return false;
					}
				}

				if (filters.category !== "all" && b.level !== filters.category)
					return false;
				if (
					filters.priority !== "all" &&
					b.priority?.toLowerCase() !== filters.priority
				)
					return false;

				const bulletinCohortId = b.cohortId || b.cohort_id;
				if (
					filters.course !== "all" &&
					bulletinCohortId !== filters.course
				)
					return false;

				const searchLower = filters.search.toLowerCase();
				if (
					searchLower &&
					!b.title.toLowerCase().includes(searchLower) &&
					!b.content.toLowerCase().includes(searchLower)
				)
					return false;

				if (filters.dateRange !== "all") {
					if (
						filters.dateRange === "today" &&
						bDate.toDateString() !== now.toDateString()
					)
						return false;
					if (filters.dateRange === "week" && diffDays > 7)
						return false;
					if (filters.dateRange === "month" && diffDays > 30)
						return false;
				}

				if (filters.batch !== "all") {
					const bulletinBatch = b.batch?.toString().toLowerCase();
					if (bulletinBatch !== filters.batch.toLowerCase())
						return false;
				}

				return true;
			})
			.sort((a, b) => {
				const aPinned = a.is_pinned || a.pinned;
				const bPinned = b.is_pinned || b.pinned;

				if (aPinned && !bPinned) return -1;
				if (!aPinned && bPinned) return 1;
				return 0;
			});
	}, [bulletins, filters, activeTab]);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			const [bulletinRes, userRes] = await Promise.all([
				bulletinService.getBulletins(),
				userService.getDashboardOverview(),
			]);

			let allUpdates = bulletinRes.success ? [...bulletinRes.data] : [];
			let userCohorts = [];

			if (userRes.success) {
				userCohorts = [
					...(userRes.data.createdCohorts || []),
					...(userRes.data.joinedCohorts || []),
				].map((cohort) => ({
					id: cohort.id || cohort._id,
					name:
						cohort.cohort_name || cohort.name || "Untitled Course",
					course_code: cohort.course_code,
					batch: cohort.batch,
					year: cohort.year,
				}));

				setCohorts(userCohorts);

				const announcementResults = await Promise.all(
					userCohorts.map((c) =>
						announcementService.getAnnouncements(c.id),
					),
				);

				const normalizedAnnouncements = announcementResults.flatMap(
					(res, index) => {
						if (!res.success) return [];
						return res.data.map((ann) => ({
							...ann,
							id: ann.id || ann._id,
							title: ann.title || "Course Update",
							level: "course",
							courseName: userCohorts[index].name,
							cohortId: userCohorts[index].id,
							createdAt: ann.created_at,
							author: ann.author_name,
						}));
					},
				);

				allUpdates = [...allUpdates, ...normalizedAnnouncements];
			}

			allUpdates.sort((a, b) => {
				const pinnedA = a.is_pinned ? 1 : 0;
				const pinnedB = b.is_pinned ? 1 : 0;

				if (pinnedA !== pinnedB) {
					return pinnedB - pinnedA;
				}

				const dateA = new Date(a.createdAt || a.created_at || a.date);
				const dateB = new Date(b.createdAt || b.created_at || b.date);

				return dateB - dateA;
			});

			setBulletins(allUpdates);
		} catch (err) {
			setError("Failed to sync with bulletin service.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleCreateBulletin = useCallback(
		async (formData) => {
			try {
				const res =
					formData.level === "course" && formData.courseId
						? await announcementService.createAnnouncement(
								formData.courseId,
								formData,
							)
						: await bulletinService.createBulletin(formData);

				if (res.success) fetchData();
				return res;
			} catch (err) {
				return { success: false, error: "System error" };
			}
		},
		[fetchData],
	);

	const handleTogglePin = useCallback(
		async (bulletinId) => {
			const target = bulletins.find(
				(b) => (b.id || b._id) === bulletinId,
			);
			if (!target) return;

			const newPinnedStatus = !target.is_pinned;

			try {
				setBulletins((prev) =>
					prev.map((b) =>
						(b.id || b._id) === bulletinId
							? { ...b, is_pinned: newPinnedStatus }
							: b,
					),
				);

				let res;
				if (target.level === "course") {
					res = await announcementService.updateAnnouncement(
						target.cohortId,
						bulletinId,
						{
							is_pinned: newPinnedStatus,
						},
					);
				} else {
					res = await bulletinService.updateBulletin(bulletinId, {
						is_pinned: newPinnedStatus,
					});
				}

				if (!res.success) {
					fetchData();
				}
			} catch (err) {
				fetchData();
			}
		},
		[bulletins, fetchData],
	);

	const handleTabChange = (newTab) => {
		navigate(`/bulletins/${newTab}`);
	};

	return (
		<BulletinsUI
			bulletins={filteredBulletins}
			cohorts={cohorts}
			loading={loading}
			error={error}
			stats={stats}
			filters={filters}
			setFilters={setFilters}
			onRefresh={fetchData}
			onSubmit={handleCreateBulletin}
			onTogglePin={handleTogglePin}
			userRole={userRole}
			activeTab={activeTab}
			onTabChange={handleTabChange}
		/>
	);
};

export default BulletinsController;
