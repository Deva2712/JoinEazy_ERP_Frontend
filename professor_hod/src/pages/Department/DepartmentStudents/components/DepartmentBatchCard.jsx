// src/pages/Department/DepartmentStudents/components/DepartmentBatchCard.jsx

import React from "react";
import {
	ChevronRight,
	Award,
	TrendingUp,
} from "lucide-react";

const DepartmentBatchCard = ({
	batch,
	count,
	avgCgpa,
	avgAttendance,
	uniqueSections,
	onClick,
}) => {
	return (
		<button
			onClick={onClick}
			className="group flex flex-col bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:border-violet-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer active:scale-95 overflow-hidden"
		>
			<div className="relative z-10 flex flex-col h-full w-full">
				{/* Header Section: Batch Tag and Enrolled Count */}
				<div className="flex justify-between items-start mb-4">
					<div className="space-y-1">
						<p className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-[0.2em]">
							Batch {batch}
						</p>
						<div className="flex items-baseline gap-2">
							<h3 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
								{count}
							</h3>
							<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
								Students Enrolled
							</span>
						</div>
					</div>

					<div className="flex flex-col items-end gap-4">
						<span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50">
							{uniqueSections}{" "}
							{uniqueSections === 1 ? "Section" : "Sections"}
						</span>
						<ChevronRight className="size-4 text-gray-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
					</div>
				</div>

				{/* Metrics Grid: CGPA and Attendance Details */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50 transition-colors group-hover:bg-white dark:group-hover:bg-gray-800/40">
						<div className="flex items-center gap-1.5 mb-1">
							<Award className="size-3 text-gray-400" />
							<p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
								Avg. CGPA
							</p>
						</div>
						<p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
							{avgCgpa}
						</p>
					</div>

					<div className="bg-violet-50/30 dark:bg-violet-900/10 p-4 rounded-2xl border border-violet-100/30 dark:border-violet-900/20">
						<div className="flex items-center gap-1.5 mb-1">
							<TrendingUp className="size-3 text-violet-600 dark:text-violet-400" />
							<p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
								Attendance
							</p>
						</div>
						<p className="text-xl font-black text-violet-600 dark:text-violet-400 tracking-tight">
							{avgAttendance}%
						</p>
					</div>
				</div>
			</div>
		</button>
	);
};

export default DepartmentBatchCard;
