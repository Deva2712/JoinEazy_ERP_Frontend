// src/pages/Mentoring/components/StudentCard.jsx

import React from "react";
import {
	User,
	ChevronRight,
	Award,
	Percent,
	AlertCircle,
	CalendarClock,
} from "lucide-react";

const StudentCard = ({ mentee, onViewDetails, activeTab }) => {
	const {
		name,
		studentId,
		semester,
		department,
		academicMetrics,
		riskLevel,
		meetingHistory = [],
	} = mentee;

	const arrangedMeetings = meetingHistory.filter(
		(m) => m.status !== "Requested" && m.hasAttended !== null,
	);
	const attendedCount = arrangedMeetings.filter(
		(m) => m.hasAttended === true,
	).length;
	const totalArranged = arrangedMeetings.length;

	// Logic for conditional alerts
	const hasPendingRequest = meetingHistory.some(
		(m) => m.status === "Requested",
	);
	const needsAttendanceMarking = meetingHistory.some(
		(m) => m.hasAttended === null && m.status !== "Requested",
	);

	const isRequestAlert =
		activeTab === "meeting-requests" && hasPendingRequest;
	const isAttendanceAlert =
		activeTab === "all-students" && needsAttendanceMarking;

	return (
		<div
			onClick={onViewDetails}
			className="group relative bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:border-sky-500/50 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
		>
			{/* Left Accent Border */}
			<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

			<div className="p-5">
				<div className="flex flex-col lg:flex-row lg:items-center gap-6">
					{/* Profile Info Section */}
					<div className="flex items-center gap-4 lg:w-1/4 min-w-0">
						<div className="relative">
							<div
								className="size-12 sm:size-14 flex items-center justify-center rounded-2xl transition-colors bg-sky-50 dark:bg-sky-900/30 text-sky-600"
							>
								<User className="size-6 sm:size-7" />
							</div>

							{riskLevel === "At Risk" && (
								<div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-rose-500 text-white rounded-lg px-1.5 py-0.5 text-[9px] font-black uppercase border-2 border-white dark:border-gray-800 whitespace-nowrap">
									At Risk
								</div>
							)}
						</div>

						<div className="flex-1 min-w-0">
							<h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-sky-600 transition-colors truncate">
								{name}
							</h3>
							<p className="text-gray-400 dark:text-gray-500 font-mono text-sm font-semibold">
								{studentId}
							</p>
						</div>
					</div>

					{/* Academic Stats Grid */}
					<div className="flex-1 grid grid-cols-3 gap-2 sm:gap-4 py-4 lg:py-0 lg:px-6 border-y lg:border-y-0 lg:border-x border-gray-100 dark:border-gray-700/50">
						<div className="flex flex-col items-center justify-center">
							<span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1">
								<Award className="size-2.5 sm:size-3" />
								<span className="hidden sm:inline">CGPA</span>
								<span className="sm:hidden">GPA</span>
							</span>
							<p className="text-sm sm:text-lg font-black text-gray-900 dark:text-gray-100">
								{academicMetrics?.cgpa?.toFixed(1) || "0.0"}
							</p>
						</div>

						<div className="flex flex-col items-center justify-center">
							<span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1">
								<Percent className="size-2.5 sm:size-3" />
								<span className="hidden sm:inline">
									Attendance
								</span>
								<span className="sm:hidden">Attnd</span>
							</span>
							<p className="text-sm sm:text-lg font-black text-gray-900 dark:text-gray-100">
								{academicMetrics?.attendance || 0}%
							</p>
						</div>

						<div className="flex flex-col items-center justify-center">
							<span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1">
								<CalendarClock className="size-2.5 sm:size-3" />
								<span className="hidden sm:inline">
									Meetings
								</span>
								<span className="sm:hidden">Meets</span>
							</span>

							<p className="text-sm sm:text-lg font-black text-gray-900 dark:text-gray-100">
								{attendedCount}/{totalArranged}
							</p>
						</div>
					</div>

					{/* Metadata Badges */}
					<div className="flex items-center justify-between lg:justify-end lg:w-1/4 gap-4">
						<div className="flex flex-row items-start lg:items-end gap-2">
							<span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50">
								{department}
							</span>
							<span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50">
								Sem {semester}
							</span>
						</div>

						<div className="flex items-center text-gray-400 group-hover:translate-x-1 transition-transform">
							<ChevronRight className="size-4" />
						</div>
					</div>
				</div>
			</div>

			{/* Integrated Action Bar (The "Footer Alert") */}
			{(isRequestAlert || isAttendanceAlert) && (
				<div
					className={`flex items-center justify-center gap-2 py-1.5 border-t transition-colors ${
						isRequestAlert
							? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
							: "bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400"
					}`}
				>
					<AlertCircle className="size-3 animate-pulse" />
					<span className="text-[10px] font-black uppercase tracking-widest">
						{isRequestAlert
							? "New Meeting Request"
							: "Mark Student's Attendance"}
					</span>
				</div>
			)}
		</div>
	);
};

export default StudentCard;
