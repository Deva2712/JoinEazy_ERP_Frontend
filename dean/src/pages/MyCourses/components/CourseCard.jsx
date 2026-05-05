// src/pages/MyCourses/components/CourseCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import {
	ArrowRight,
	Calendar,
	Users,
	ListChecks,
	Clock,
	ClipboardPen,
	ClipboardList,
} from "lucide-react";

const formatDate = (dateString) => {
	if (!dateString) return "N/A";
	try {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	} catch (e) {
		console.error("Date formatting error:", e);
		return dateString;
	}
};

export default function CourseCard({ cohort, user_type }) {
	const isStudent = user_type === 0;
	const isArchived = cohort.status === "Archived";
	const pendingAssignments =
		cohort.assignment_count - cohort.completed_assignment_count;

	// Metrics section for students
	const StudentAssignmentMetrics = (
		<>
			<div className="flex flex-col items-start justify-center pr-4 border-r border-gray-200 dark:border-gray-800 transition-colors group-hover:border-blue-200 dark:group-hover:border-gray-700">
				<span className="font-extrabold text-2xl text-rose-600 dark:text-rose-400">
					{cohort.due_this_week_assignment_count || 0}
				</span>
				<div className="flex items-center text-[10px] font-bold uppercase tracking-widest mt-1 text-gray-600 dark:text-gray-300">
					<Clock className="size-3 mr-1.5" />
					<span>Due This Week</span>
				</div>
			</div>
			<div className="flex flex-col items-start justify-center pl-4">
				<span className="font-extrabold text-2xl text-blue-600 dark:text-blue-400">
					{pendingAssignments || 0}
				</span>
				<div className="flex items-center text-[10px] font-bold uppercase tracking-widest mt-1 text-gray-600 dark:text-gray-300">
					<ClipboardPen className="size-3 mr-1.5" />
					<span>Pending</span>
				</div>
			</div>
		</>
	);

	// Metrics section for professors
	const ProfessorAssignmentMetrics = (
		<>
			<div className="flex flex-col items-start justify-center pr-4 border-r border-gray-200 dark:border-gray-800 transition-colors group-hover:border-blue-200 dark:group-hover:border-gray-700">
				<span className="font-extrabold text-2xl text-teal-600 dark:text-teal-400">
					{cohort.assignment_count}
				</span>
				<div className="flex items-center text-xs font-bold mt-1 text-gray-600 dark:text-gray-300">
					<ClipboardList className="size-3 mr-1.5" />
					<span>Assignments</span>
				</div>
			</div>
			<div className="flex flex-col items-start justify-center pl-4">
				<span className="font-extrabold text-2xl text-blue-600 dark:text-blue-400">
					{cohort.member_count || 0}
				</span>
				<div className="flex items-center text-xs font-bold mt-1 text-gray-600 dark:text-gray-300">
					<Users className="size-3 mr-1.5" />
					<span>Members</span>
				</div>
			</div>
		</>
	);

	return (
		<div
			className={`group bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 flex flex-col h-full hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-2xl hover:shadow-gray-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-blue-500/10 ${
				isArchived ? "grayscale-[100%] hover:grayscale-0" : ""
			}`}
		>
			<div className="flex flex-col gap-5">
				{/* Header Section */}
				<div className="flex flex-col gap-2">
					<h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
						{cohort.title}
					</h3>

					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">
							<Calendar className="size-3.5 mr-1.5" />
							{formatDate(cohort.startDate)} &rarr;{" "}
							{formatDate(cohort.endDate)}
						</div>

						{/* Course Code Indicator */}
						{cohort.courseCodes?.length > 0 && (
							<div className="flex items-center gap-1">
								<span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-800">
									{cohort.courseCodes[0]}
								</span>
								{cohort.courseCodes.length > 1 && (
									<span className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
										+{cohort.courseCodes.length - 1}
									</span>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Metrics Grid */}
				<div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-800 border border-gray-100 dark:border-gray-800">
					{isStudent
						? StudentAssignmentMetrics
						: ProfessorAssignmentMetrics}
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3 mt-auto">
					<Link
						to={`${cohort.link}/assignments`}
						className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all"
						onClick={(e) => e.stopPropagation()}
					>
						<ListChecks className="size-3.5" />
						Assignments
					</Link>
					<Link
						to={cohort.link}
						className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all"
						onClick={(e) => e.stopPropagation()}
					>
						View Course
						<ArrowRight className="size-3.5" />
					</Link>
				</div>
			</div>
		</div>
	);
}
