// src/pages/Department/DepartmentStudents/components/DepartmentStudentCard.jsx

import React from "react";
import {
	GraduationCap,
	TrendingUp,
	AlertCircle,
	ChevronRight,
	Award,
} from "lucide-react";

const DepartmentStudentCard = ({ student, onClick }) => {
	const {
		name,
		studentId,
		semester,
		batch,
		section,
		academicMetrics = { attendance: 0, backlogs: 0, cgpa: 0 },
	} = student;

	return (
		<div
			onClick={onClick}
			className="group relative bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:border-violet-500/50 hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-95 overflow-hidden"
		>
			{/* Left Accent Border */}
			<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-violet-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

			<div className="p-5">
				<div className="flex flex-col lg:flex-row lg:items-center gap-6">
					{/* Student Identity Section */}
					<div className="flex items-center gap-4 lg:w-1/4 min-w-0">
						<div className="relative">
							<div className="size-12 sm:size-14 flex items-center justify-center rounded-2xl transition-colors bg-violet-50 dark:bg-violet-900/30 text-violet-600 font-bold text-xl">
								{name.charAt(0)}
							</div>

							{academicMetrics.backlogs > 0 && (
								<div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white rounded-lg px-1.5 py-0.5 text-[9px] font-black uppercase border-2 border-white dark:border-gray-800 whitespace-nowrap">
									{academicMetrics.backlogs} Backlogs
								</div>
							)}
						</div>

						<div className="flex-1 min-w-0">
							<h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-violet-600 transition-colors truncate">
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
								<span>CGPA</span>
							</span>
							<p className="text-sm sm:text-lg font-black text-gray-900 dark:text-gray-100">
								{academicMetrics.cgpa?.toFixed(1) || "0.0"}
							</p>
						</div>

						<div className="flex flex-col items-center justify-center">
							<span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1">
								<TrendingUp className="size-2.5 sm:size-3" />
								<span className="hidden sm:inline">
									Attendance
								</span>
								<span className="sm:hidden">Attnd</span>
							</span>
							<p className="text-sm sm:text-lg font-black text-gray-900 dark:text-gray-100">
								{academicMetrics.attendance}%
							</p>
						</div>

						<div className="flex flex-col items-center justify-center">
							<span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-1">
								<GraduationCap className="size-2.5 sm:size-3" />
								<span>Section</span>
							</span>
							<p className="text-sm sm:text-lg font-black text-gray-900 dark:text-gray-100">
								{section}
							</p>
						</div>
					</div>

					{/* Metadata Badges */}
					<div className="flex items-center justify-between lg:justify-end lg:w-1/4 gap-4">
						<div className="flex flex-row items-start lg:items-end gap-2">
							<span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50">
								Sem {semester}
							</span>
							<span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50">
								{batch}
							</span>
						</div>

						<div className="flex items-center text-gray-400 group-hover:translate-x-1 transition-transform">
							<ChevronRight className="size-4" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DepartmentStudentCard;
