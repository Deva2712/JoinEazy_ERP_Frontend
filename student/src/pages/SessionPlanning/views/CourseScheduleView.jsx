// // src/pages/SessionPlanning/views/CourseScheduleView.jsx

import React, { useState } from "react";
import { Archive, ArrowLeft } from "lucide-react";
import ClassScheduleCard from "../components/ClassScheduleCard";

const DAY_ORDER = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const isActive = (section) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	if (section.startDate && section.endDate) {
		return (
			today >= new Date(section.startDate) &&
			today <= new Date(section.endDate)
		);
	}
	return section.status === "Ongoing";
};

/**
 * Calculates days until the next session, excluding today.
 * If a course is today, it calculates the gap until next week's session.
 */
const getDaysUntilNextSession = (schedule) => {
	if (!schedule || schedule.length === 0) return 999;

	const todayIndex = new Date().getDay();
	const uniqueDayIndices = [
		...new Set(schedule.map((s) => DAY_ORDER.indexOf(s.day))),
	];

	let minDiff = 8;
	uniqueDayIndices.forEach((dayIndex) => {
		let diff = dayIndex - todayIndex;
		// If diff is 0 (today) or negative (past), it means the "next" is in the future
		if (diff <= 0) diff += 7;
		if (diff < minDiff) minDiff = diff;
	});

	return minDiff;
};

const CourseScheduleView = ({ schedules = [] }) => {
	const [viewMode, setViewMode] = useState("active");

	const activeSchedules = schedules.filter((s) => isActive(s));
	const archivedSchedules = schedules.filter((s) => !isActive(s));

	const isArchivedMode = viewMode === "archived";

	// Arrange cards based on the closest upcoming session (tomorrow onwards)
	const displaySchedules = (
		isArchivedMode ? archivedSchedules : activeSchedules
	).sort((a, b) => {
		const daysA = getDaysUntilNextSession(a.schedule);
		const daysB = getDaysUntilNextSession(b.schedule);
		return daysA - daysB;
	});

	return (
		<div className="space-y-6">
			{/* View Header logic */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					{isArchivedMode && (
						<button
							onClick={() => setViewMode("active")}
							className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm transition-all"
						>
							<ArrowLeft className="size-4" />
						</button>
					)}
					<div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
							{isArchivedMode
								? "Archived Courses Schedule"
								: "Active Courses Schedule"}
						</h3>
					</div>
				</div>

				{!isArchivedMode && archivedSchedules.length > 0 && (
					<button
						onClick={() => setViewMode("archived")}
						className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
					>
						<Archive className="size-4" />
						Archived Courses
					</button>
				)}
			</div>

			{/* Grid display for sorted cards */}
			{displaySchedules.length === 0 ? (
				<div className="bg-white dark:bg-gray-800/40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-16 text-center">
					<p className="text-gray-500 font-medium">
						{isArchivedMode
							? "No archived courses found."
							: "No active courses scheduled."}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{displaySchedules.map((row) => (
						<ClassScheduleCard
							key={row.id}
							data={row}
							isArchived={isArchivedMode}
							mode="schedule"
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default CourseScheduleView;
