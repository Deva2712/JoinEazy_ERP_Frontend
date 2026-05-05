// src/pages/SessionPlanning/views/TodayClassView.jsx

import React from "react";
import ClassScheduleCard from "../components/ClassScheduleCard";

const TodayClassView = ({ todaysClasses = [], onReflection }) => {
	// Helper to convert "HH:MM AM/PM" to a sortable 24-hour number
	const parseTime = (timeStr) => {
		if (!timeStr) return 0;
		const [time, modifier] = timeStr.split(" ");
		let [hours, minutes] = time.split(":").map(Number);

		if (modifier === "PM" && hours < 12) hours += 12;
		if (modifier === "AM" && hours === 12) hours = 0;

		return hours * 60 + minutes;
	};

	const sortedClasses = [...todaysClasses].sort((a, b) => {
		return parseTime(a.startTime) - parseTime(b.startTime);
	});

	return (
		<div className="space-y-6">
			<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
				Today's Classes
			</h3>

			{sortedClasses.length === 0 ? (
				/* Empty state display for days with no scheduled sessions */
				<div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-16 text-center">
					<p className="text-gray-400 dark:text-gray-500 font-medium">
						No classes scheduled for today.
					</p>
					<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
						Check your schedule for your next class.
					</p>
				</div>
			) : (
				/* Grid of class cards organized chronologically by start time */
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{sortedClasses.map((cls, idx) => (
						<ClassScheduleCard
							key={idx}
							data={cls}
							mode="today"
							onAction={onReflection}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default TodayClassView;
