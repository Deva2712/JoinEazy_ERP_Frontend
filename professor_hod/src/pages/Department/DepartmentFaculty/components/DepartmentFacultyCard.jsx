// src/pages/Department/DepartmentFaculty/components/DepartmentFacultyCard.jsx

import React from "react";
import { User, BookOpen, ChevronRight, AlertCircle, Clock } from "lucide-react";

/**
 * DepartmentFacultyCard Component
 * Displays individual faculty member details and allocation count.
 */
const DepartmentFacultyCard = ({ member, allocationCount, onClick }) => {
	const isOverloaded = member.currentLoadHours > member.maxLoadHours;

	return (
		<button
			onClick={onClick}
			className="group bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:border-violet-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer active:scale-95 overflow-hidden"
		>
			<div className="flex flex-col gap-5">
				{/* Header Section */}
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-4">
						<div className="relative">
							<div className="shrink-0 size-10 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 flex items-center justify-center border border-violet-100 dark:border-violet-800">
								<User className="size-5" />
							</div>
							{isOverloaded && (
								<div className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-white dark:border-[#1a1d26] animate-pulse" />
							)}
						</div>
						<div>
							<h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-violet-600 transition-colors">
								{member.name}
							</h3>
							<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
								{member.designation}
							</p>
						</div>
					</div>
					<ChevronRight className="size-5 text-gray-300 dark:text-gray-600 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
				</div>

				{/* Stats Grid: Courses and Load Metrics */}
				<div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-800 border border-gray-100 dark:border-gray-800">
					{/* Course Allocation Stat */}
					<div className="flex flex-col items-center justify-center pr-2">
						<div className="flex items-center gap-1.5 mb-1 text-gray-400">
							<BookOpen className="size-3" />
							<span className="text-[9px] font-bold uppercase tracking-widest">
								Courses
							</span>
						</div>
						<p className="text-lg font-black text-violet-600 dark:text-violet-400">
							{allocationCount}
						</p>
					</div>

					{/* Load Status Stat */}
					<div className="flex flex-col items-center justify-center pl-2">
						<div
							className={`flex items-center gap-1.5 mb-1 ${isOverloaded ? "text-rose-500/80" : "text-gray-400"}`}
						>
							{isOverloaded ? (
								<AlertCircle className="size-3" />
							) : (
								<Clock className="size-3" />
							)}
							<span className="text-[9px] font-bold uppercase tracking-widest">
								Hrs / Week
							</span>
						</div>
						<p
							className={`text-lg font-black ${isOverloaded ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}
						>
							{member.currentLoadHours}
						</p>
					</div>
				</div>
			</div>
		</button>
	);
};

export default DepartmentFacultyCard;
