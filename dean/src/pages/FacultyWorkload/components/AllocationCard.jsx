// src/pages/FacultyWorkload/components/AllocationCard.jsx

import React, { useState } from "react";
import {
	ChevronDown,
	ChevronUp,
	Clock,
	BookOpen,
	UserMinus,
} from "lucide-react";

const AllocationCard = ({ faculty, allocations, onEditSubstitute }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const facultyAllocations = allocations.filter(
		(a) => a.facultyId === faculty.id,
	);
	const isOverloaded = faculty.currentLoadHours > faculty.maxLoadHours;

	return (
		<div className="bg-white dark:bg-[#1a1d26] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all hover:shadow-md">
			<div className="p-6">
				{/* Faculty Profile Header */}
				<div className="flex justify-between items-start mb-4">
					<div className="flex items-center gap-3">
						<div className="size-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
							{faculty.name.charAt(0)}
						</div>
						<div>
							<h4 className="font-bold text-gray-900 dark:text-white leading-tight">
								{faculty.name}
							</h4>
							<p className="text-xs text-gray-500">
								{faculty.designation}
							</p>
						</div>
					</div>
					<span
						className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
							isOverloaded
								? "bg-red-100 text-red-600"
								: "bg-emerald-100 text-emerald-600"
						}`}
					>
						{isOverloaded ? "Overload" : "Optimal"}
					</span>
				</div>

				{/* Workload Progress */}
				<div className="space-y-2 mb-6">
					<div className="flex justify-between text-xs font-bold">
						<span className="text-gray-400">
							Weekly Utilization
						</span>
						<span
							className={
								isOverloaded
									? "text-red-500"
									: "text-indigo-500"
							}
						>
							{faculty.currentLoadHours} / {faculty.maxLoadHours}{" "}
							Hrs
						</span>
					</div>
					<div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
						<div
							className={`h-full transition-all duration-700 ease-out ${isOverloaded ? "bg-red-500" : "bg-indigo-500"}`}
							style={{
								width: `${Math.min((faculty.currentLoadHours / faculty.maxLoadHours) * 100, 100)}%`,
							}}
						/>
					</div>
				</div>

				{/* Expandable Assignments Section */}
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="w-full flex items-center justify-between py-2 text-sm font-bold text-gray-600 dark:text-gray-400 border-t border-gray-50 dark:border-gray-800 mt-2"
				>
					<span>{facultyAllocations.length} Assignments</span>
					{isExpanded ? (
						<ChevronUp className="size-4" />
					) : (
						<ChevronDown className="size-4" />
					)}
				</button>

				{isExpanded && (
					<div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-1">
						{facultyAllocations.map((alc) => (
							<div
								key={alc.id}
								className="p-3 bg-gray-50 dark:bg-[#242833] rounded-2xl border border-gray-100 dark:border-gray-700/50"
							>
								<div className="flex justify-between items-start mb-1">
									<p className="text-xs font-bold text-gray-900 dark:text-white">
										{alc.courseCode}: {alc.courseName}
									</p>
									{alc.isSubstitute && (
										<span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md font-bold uppercase">
											Sub
										</span>
									)}
								</div>
								<div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
									<span className="flex items-center gap-1">
										<BookOpen className="size-3" />{" "}
										{alc.type}
									</span>
									<span className="flex items-center gap-1">
										<Clock className="size-3" />{" "}
										{alc.hoursPerWeek} Hrs/Week
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default AllocationCard;
