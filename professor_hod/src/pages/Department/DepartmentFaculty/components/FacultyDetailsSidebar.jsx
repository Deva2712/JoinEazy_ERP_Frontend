// src/pages/Department/DepartmentFaculty/components/FacultyDetailsSidebar.jsx

import React, { useMemo } from "react";
import { Calendar, Star, TrendingUp, BookOpen } from "lucide-react";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";
import { useDepartment } from "@/context/DepartmentContext";

/**
 * Sidebar component for Faculty details.
 * Displays quick metrics and attendance tracking.
 */
const FacultyDetailsSidebar = ({ faculty }) => {
	const { state, getFacultyMetrics } = useDepartment();
	const { allocations } = state;

	const metrics = useMemo(
		() => getFacultyMetrics(faculty.id),
		[faculty.id, getFacultyMetrics],
	);

	const coursesHandledCount = useMemo(() => {
		const facultyAllocations = (allocations || []).filter(
			(a) => a.facultyId === faculty.id,
		);

		// Extract unique course codes to count total distinct courses
		const uniqueCourses = new Set(
			facultyAllocations.map((a) => a.courseCode),
		);
		return uniqueCourses.size;
	}, [allocations, faculty.id]);

	return (
		<CollapsibleSection
			title="Faculty Summary"
			icon={<TrendingUp className="size-4 text-violet-500" />}
			color="violet"
		>
			<div className="space-y-6">
				<div className="grid grid-cols-2 gap-2 sm:gap-4">
					<SidebarStat
						label="Avg. Rating"
						value={
							metrics.average > 0
								? `${metrics.average.toFixed(1)}`
								: "N/A"
						}
						icon={Star}
						color="text-amber-500"
					/>

					<SidebarStat
						label="Courses"
						value={coursesHandledCount}
						icon={BookOpen}
						color="text-violet-500"
					/>
				</div>

				<div className="pt-4 space-y-4 border-t border-gray-100 dark:border-gray-800">
					<ProgressStat
						label="Personal Attendance"
						value={`${faculty?.attendancePercentage || 0}%`}
						percentage={faculty.attendancePercentage || 0}
						icon={Calendar}
						color={
							faculty.attendancePercentage > 70
								? "bg-emerald-500"
								: "bg-rose-500"
						}
					/>
				</div>
			</div>
		</CollapsibleSection>
	);
};

/**
 * Individual stat card within the sidebar summary.
 */
const SidebarStat = ({ label, value, icon: Icon, color }) => (
	<div className="flex flex-col gap-1 p-2">
		<div className="flex items-center gap-2">
			<Icon className={`size-3 ${color}`} />
			<p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">
				{label}
			</p>
		</div>
		<p className="text-lg font-black text-gray-900 dark:text-white leading-none">
			{value}
		</p>
	</div>
);

/**
 * Progress bar for attendance metrics.
 */
const ProgressStat = ({ label, value, percentage, icon: Icon, color }) => (
	<div className="space-y-2">
		<div className="flex justify-between items-end">
			<div className="flex items-center gap-1.5">
				<Icon className="size-3 text-gray-400" />
				<span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">
					{label}
				</span>
			</div>
			<span className="text-xs font-bold text-gray-900 dark:text-white">
				{value}
			</span>
		</div>
		<div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
			<div
				className={`h-full ${color} transition-all duration-700 ease-out`}
				style={{ width: `${percentage}%` }}
			/>
		</div>
	</div>
);

export default FacultyDetailsSidebar;
