import React from "react";
import { User, BookOpen, ChevronRight, AlertCircle, Clock } from "lucide-react";

/**
 * DepartmentFacultyCard Component
 * Displays individual faculty member details and allocation count.
 */
const DepartmentFacultyCard = ({ member, allocationCount, onClick }) => {
	const isOverloaded = member.currentLoadHours > member.maxLoadHours;

	return (
		<div
			onClick={() => onClick(member)}
			className="group bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 flex flex-col h-full hover:border-violet-500/30 dark:hover:border-violet-500/30 hover:shadow-2xl hover:shadow-gray-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-violet-500/10"
		>
			<div className="flex flex-col gap-5">
				{/* Header Section */}
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-4">
						<div className="relative">
							<div className="shrink-0 size-10 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 flex items-center justify-center border border-violet-100 dark:border-violet-800">
								<User className="size-5" />
							</div>
							{isOverloaded && (
								<div className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full border-2 border-white dark:border-[#1a1d26] animate-pulse" />
							)}
						</div>
						<div>
							<h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-violet-600 transition-colors leading-tight truncate">
								{member.name}
							</h3>
							<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
								{member.designation}
							</p>
						</div>
					</div>
					<ChevronRight className="size-4 text-gray-300 dark:text-gray-600 group-hover:text-violet-500 transform group-hover:translate-x-1 transition-all" />
				</div>

				{/* Metrics Grid */}
				<div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-800 border border-gray-100 dark:border-gray-800">
					{/* Course Allocation Section */}
					<div className="flex flex-col items-start justify-center pr-4">
						<span className="font-extrabold text-2xl text-violet-600 dark:text-violet-400">
							{allocationCount}
						</span>
						<div className="flex items-center text-[10px] font-bold uppercase tracking-widest mt-1 text-gray-600 dark:text-gray-300">
							<BookOpen className="size-3 mr-1.5" />
							<span>Courses</span>
						</div>
					</div>

					{/* Load Status Section */}
					<div className="flex flex-col items-start justify-center pl-4">
						<span
							className={`font-extrabold text-2xl ${isOverloaded ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}
						>
							{member.currentLoadHours}
						</span>
						<div
							className={`flex items-center text-[10px] font-bold uppercase tracking-widest mt-1 ${isOverloaded ? "text-rose-600/80" : "text-gray-600 dark:text-gray-300"}`}
						>
							{isOverloaded ? (
								<AlertCircle className="size-3 mr-1.5" />
							) : (
								<Clock className="size-3 mr-1.5" />
							)}
							<span>HRS PER WEEK</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DepartmentFacultyCard;
