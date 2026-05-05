// src/pages/SessionPlanning/components/ClassScheduleCard.jsx

import React, { useState } from "react";
import { GraduationCap, MapPin, Pen } from "lucide-react";

const DAY_ORDER = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const DAY_SHORT = {
	Monday: "Mon",
	Tuesday: "Tue",
	Wednesday: "Wed",
	Thursday: "Thu",
	Friday: "Fri",
	Saturday: "Sat",
	Sunday: "Sun",
};

/**
 * Helper to find the closest upcoming day, excluding today.
 * Starts checking from tomorrow (offset 1) through the next 7 days.
 */
const getSmartDefaultDay = (uniqueDays) => {
	const todayIndex = new Date().getDay();

	for (let offset = 1; offset <= 7; offset++) {
		const nextDayName = DAY_ORDER[(todayIndex + offset) % 7];
		if (uniqueDays.includes(nextDayName)) return nextDayName;
	}
	return uniqueDays[0];
};

const ClassScheduleCard = ({
	data,
	isArchived = false,
	onAction = null,
	mode = "schedule", // "schedule" or "today"
}) => {
	const isTodayMode = mode === "today";
	const slots = isTodayMode ? [data] : data.schedule || [];

	const uniqueDays = [...new Set(slots.map((s) => s.day))].sort(
		(a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b),
	);

	const [activeDay, setActiveDay] = useState(() =>
		isTodayMode ? uniqueDays[0] : getSmartDefaultDay(uniqueDays),
	);

	const displaySlots = isTodayMode
		? slots
		: slots.filter((s) => s.day === activeDay);

	return (
		<div
			className={`group bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:shadow-gray-500/5 hover:-translate-y-1 ring-1 ring-transparent hover:ring-indigo-500/10 ${
				isArchived
					? "grayscale-[100%] hover:grayscale-0"
					: "border-gray-200/60 dark:border-gray-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/30"
			}`}
		>
			<div className="flex flex-col gap-5 h-full">
				{/* Course Identity Header */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">
							{data.courseCode ||
								displaySlots[0]?.courseCode ||
								data.id}
						</span>
						<span className="px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
							{data.courseType}
						</span>
					</div>

					<h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight truncate">
						{data.courseName}
					</h3>
				</div>

				{/* Day selection tabs (Only shown in Schedule mode) */}
				{!isTodayMode && uniqueDays.length > 1 && (
					<div className="flex flex-wrap gap-2">
						{uniqueDays.map((day) => (
							<button
								key={day}
								onClick={() => setActiveDay(day)}
								className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all border ${
									activeDay === day
										? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
										: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
								}`}
							>
								{DAY_SHORT[day]}
							</button>
						))}
					</div>
				)}

				{/* List of class slots / timing info */}
				<div
					className={`flex flex-col gap-2 ${!isTodayMode ? "overflow-y-auto max-h-[240px] pr-1 custom-scrollbar" : ""}`}
				>
					{displaySlots.map((slot, index) => (
						<div
							key={index}
							className="bg-gray-50/50 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50"
						>
							<div className="flex flex-col gap-1.5">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
										{slot.startTime} - {slot.endTime}
									</div>
									<span className="flex items-center gap-1 text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg border border-amber-100 dark:border-amber-800/50">
										<MapPin className="size-3" />
										{slot.roomNumber}
									</span>
								</div>

								<div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase">
									<div className="flex items-center gap-1">
										<GraduationCap className="size-3" />
										<span>
											{slot.batchSection} (Sem{" "}
											{slot.semester})
										</span>
									</div>
									<span className="ml-auto text-gray-400">
										{slot.buildingName}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Footer Actions (Updates reflection in Today mode) */}
				{isTodayMode && onAction && (
					<button
						onClick={() => onAction(data)}
						className="mt-auto w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all active:scale-95"
					>
						<Pen className="size-3.5" />
						Update Reflection
					</button>
				)}
			</div>
		</div>
	);
};

export default ClassScheduleCard;
