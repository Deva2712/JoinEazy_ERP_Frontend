import React from "react";
import { CalendarClock, ChevronRight, AlertCircle, Ban } from "lucide-react";

const AttendanceCourseCard = ({
	course,
	onNavigateToLogs,
	onSelectCourse,
	isDisabled,
}) => {
	return (
		<div
			className={`group bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border flex flex-col h-full transition-all duration-300 ${
				isDisabled
					? "opacity-80 grayscale-[0.5] border-gray-200 dark:border-gray-800 cursor-not-allowed"
					: "border-gray-200 dark:border-gray-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-lg cursor-pointer"
			}`}
		>
			{/* Course Information Header Section */}
			<div className="flex flex-col gap-2 mb-3">
				<div className="flex items-center gap-1">
					{course.course_codes?.slice(0, 1).map((code) => (
						<span
							key={code}
							className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-100 dark:border-purple-800"
						>
							{code}
						</span>
					))}
					<span className="ml-auto px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
						{course.member_count || 0} Students
					</span>
				</div>
				<h3 className="font-bold text-xl text-gray-900 dark:text-white truncate">
					{course.cohort_name}
				</h3>
			</div>

			{/* Action Buttons Footer Section */}
			<div className="space-y-3 mt-auto">
				<button
					onClick={(e) => {
						e.stopPropagation();
						onNavigateToLogs(course.id);
					}}
					className="w-full flex items-center justify-between p-4 text-xs bg-transparent border-2 border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-900/40 hover:bg-purple-50/30 dark:hover:bg-purple-900/10 text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-300 rounded-2xl font-black uppercase tracking-widest transition-all"
				>
					<span>View Logs</span>
					<CalendarClock className="size-4" />
				</button>

				<button
					disabled={isDisabled}
					onClick={(e) => {
						e.stopPropagation();
						if (!isDisabled) onSelectCourse(course);
					}}
					className={`w-full p-4 text-xs rounded-2xl font-black uppercase tracking-widest transition-colors ${
						isDisabled
							? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
							: "bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300"
					}`}
				>
					{isDisabled ? (
						<span className="flex items-center justify-between">
							No Classes Today
							<Ban className="size-4" />
						</span>
					) : (
						<span className="flex items-center justify-between">
							Mark Attendance
							<ChevronRight className="size-4" />
						</span>
					)}
				</button>
			</div>
		</div>
	);
};

export default AttendanceCourseCard;
