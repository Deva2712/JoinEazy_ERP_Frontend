// src/pages/Schedule/components/TimetableCard.jsx

import React from "react";
import { Clock, GraduationCap, MapPin, Presentation } from "lucide-react";

const TimetableCard = ({ slot, variant = "class" }) => {
	const isMeeting = variant === "meeting";
	const isEvent = variant === "event";

	// Theme configuration for Classes, Meetings, and Events
	const themes = {
		class: {
			badge: "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-800",
			hover: "hover:ring-rose-500/10 hover:border-rose-500/30",
			icon: "text-rose-500",
			titleHover: "group-hover:text-rose-600",
		},
		meeting: {
			badge: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800",
			hover: "hover:ring-emerald-500/10 hover:border-emerald-500/30",
			icon: "text-emerald-500",
			titleHover: "group-hover:text-emerald-600",
		},
		event: {
			badge: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800",
			hover: "hover:ring-blue-500/10 hover:border-blue-500/30",
			icon: "text-blue-500",
			titleHover: "group-hover:text-blue-600",
		},
	};

	const theme = themes[variant] || themes.class;

	return (
		<div
			className={`group bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200/60 dark:border-gray-800 p-4 sm:p-5 transition-all duration-300 ring-1 ring-transparent ${theme.hover} hover:shadow-md`}
		>
			<div className="flex flex-col sm:flex-row justify-between items-start gap-4">
				<div className="space-y-2 flex-1 w-full">
					{/* Header Badges */}
					<div className="flex flex-wrap items-center gap-2">
						<span
							className={`px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider border ${theme.badge}`}
						>
							{slot.courseCode}
						</span>
						{slot.courseType && (
							<span className="px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
								{slot.courseType}
							</span>
						)}
					</div>

					{/* Title Section */}
					<div>
						<h3
							className={`text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors ${theme.titleHover}`}
						>
							{slot.courseName}
						</h3>
					</div>

					{/* Metadata (Location and Type specific icons) */}
					<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider">
						{slot.batchSection && (
							<div className="flex items-center gap-1.5">
								{isMeeting ? (
									<Presentation className="size-3.5" />
								) : (
									<GraduationCap className="size-3.5" />
								)}

								<span className="truncate">
									{slot.batchSection || "N/A"}
								</span>
							</div>
						)}
						{slot.roomNumber && (
							<div className="flex items-center gap-1.5">
								<MapPin className="size-3.5" />
								<span>{slot.roomNumber}</span>
							</div>
						)}
					</div>
				</div>

				{/* Time Slot Display */}
				<div className="flex w-full sm:w-auto mt-2 sm:mt-0">
					<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-white w-full sm:w-auto justify-center sm:justify-start">
						<Clock className={`size-3.5 ${theme.icon}`} />
						<span className="tabular-nums">
							{slot.startTime}{" "}
							{slot.endTime ? ` - ${slot.endTime}` : ""}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TimetableCard;
