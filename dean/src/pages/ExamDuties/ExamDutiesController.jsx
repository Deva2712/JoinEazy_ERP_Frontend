// src/pages/ExamDuties/ExamDutiesController.jsx

import React, { useState, useEffect, useMemo } from "react";
import { examService } from "../../api/services/exam.service";
import { useJobs } from "../../context/JobTrayContext";
import { useNotifications } from "../../context/NotificationContext";
import ExamDutiesUI from "./ExamDutiesUI";

const ExamDutiesController = () => {
	const [exams, setExams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [activeTab, setActiveTab] = useState("current");
	const [selectedYear, setSelectedYear] = useState(
		new Date().getFullYear().toString(),
	);
	const [selectedMonth, setSelectedMonth] = useState("");
	const [selectedDateFilter, setSelectedDateFilter] = useState(null);

	const { refreshJobs } = useJobs();
	const { refreshNotifications } = useNotifications();

	useEffect(() => {
		fetchData();
		document.title = "Exam Duties";
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await examService.getDuties();
			const data = Array.isArray(response?.data)
				? response.data
				: response?.data?.data || [];
			setExams(data);
		} catch (err) {
			setError("Unable to load exam schedule. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	const years = useMemo(() => {
		const currentYear = new Date().getFullYear();
		return [currentYear.toString(), (currentYear - 1).toString()];
	}, []);

	const months = useMemo(
		() => [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		],
		[],
	);

	/**
	 * PERMANENT CURRENT/FUTURE SCOPE
	 * Used for stats so they never show past data.
	 */
	const currentAndFutureExams = useMemo(() => {
		const today = new Date().setHours(0, 0, 0, 0);
		return exams.filter((exam) => new Date(exam.startTime) >= today);
	}, [exams]);

	/**
	 * DISPLAY SCOPE
	 * Determines what is actually shown in the list and calendar markers.
	 */
	const scopedExams = useMemo(() => {
		const today = new Date().setHours(0, 0, 0, 0);
		if (activeTab === "current") return currentAndFutureExams;
		return exams.filter((exam) => new Date(exam.startTime) < today);
	}, [exams, currentAndFutureExams, activeTab]);

	// Stats are now locked to current/future duties only
	const stats = useMemo(
		() => ({
			assigned: currentAndFutureExams.filter(
				(e) =>
					e.status === "ASSIGNED" || e.status === "REJECTION_REVOKED",
			).length,
			review: currentAndFutureExams.filter(
				(e) => e.status === "REJECTION_REVIEW",
			).length,
		}),
		[currentAndFutureExams],
	);

	const dutyMarkers = useMemo(() => {
		return scopedExams
			.filter((exam) => exam.status !== "REJECTION_APPROVED")
			.map((exam) => ({
				date: exam.startTime.split("T")[0],
				className:
					exam.status === "REJECTION_REVIEW"
						? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100"
						: exam.status === "REJECTION_REVOKED"
							? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100"
							: "bg-lime-50 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400 hover:bg-lime-100",
				dotColor:
					exam.status === "REJECTION_REVIEW"
						? "bg-blue-400"
						: exam.status === "REJECTION_REVOKED"
							? "bg-red-400"
							: "bg-lime-400",
			}));
	}, [scopedExams]);

	const filteredAndSortedExams = useMemo(() => {
		let list = [...scopedExams];

		if (activeTab === "history" && selectedMonth) {
			list = list.filter((exam) => {
				const d = new Date(exam.startTime);
				return (
					d.getFullYear().toString() === selectedYear &&
					months[d.getMonth()] === selectedMonth
				);
			});
		}

		if (selectedDateFilter) {
			list = list.filter((exam) =>
				exam.startTime.startsWith(selectedDateFilter),
			);
		}

		const statusPriority = {
			REJECTION_REVOKED: 0,
			REJECTION_APPROVED: 1,
			ASSIGNED: 2,
			CONFIRMED: 3,
			REJECTION_REVIEW: 4,
		};

		return list.sort((a, b) => {
			const priorityA = statusPriority[a.status] ?? 5;
			const priorityB = statusPriority[b.status] ?? 5;
			if (priorityA !== priorityB) return priorityA - priorityB;
			return new Date(a.startTime) - new Date(b.startTime);
		});
	}, [
		scopedExams,
		activeTab,
		selectedYear,
		selectedMonth,
		selectedDateFilter,
		months,
	]);

	const handleUpdateDutyStatus = async (id, status, reason = null) => {
		const previousExams = [...exams];
		const nextStatus = status === "REJECTION_REVOKED" ? "ASSIGNED" : status;

		setExams((prev) =>
			prev.map((exam) =>
				exam.id === id
					? {
							...exam,
							status: nextStatus,
							rejectionReason:
								status === "REJECTION_REVIEW"
									? reason
									: exam.rejectionReason,
							isCheckedIn: nextStatus === "CONFIRMED",
						}
					: exam,
			),
		);

		try {
			await Promise.all([
				examService.updateDutyStatus(id, {
					status: nextStatus,
					isCheckedIn: nextStatus === "CONFIRMED",
					reason,
				}),
				refreshJobs(),
				refreshNotifications(),
			]);
		} catch (err) {
			setExams(previousExams);
			setError("Failed to update status. Please try again.");
		}
	};

	const formatIsoToDate = (isoString) => {
		if (!isoString) return "";
		return new Date(isoString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatIsoToTime = (isoString) => {
		if (!isoString) return "";
		return new Date(isoString).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<ExamDutiesUI
			exams={filteredAndSortedExams}
			stats={stats}
			markers={dutyMarkers}
			loading={loading}
			error={error}
			state={{
				activeTab,
				selectedYear,
				selectedMonth,
				selectedDateFilter,
				years,
				months,
			}}
			actions={{
				onRefresh: fetchData,
				setActiveTab,
				setSelectedYear,
				setSelectedMonth,
				setSelectedDateFilter,
				onUpdateStatus: handleUpdateDutyStatus,
				formatIsoToDate,
				formatIsoToTime,
			}}
		/>
	);
};

export default ExamDutiesController;
