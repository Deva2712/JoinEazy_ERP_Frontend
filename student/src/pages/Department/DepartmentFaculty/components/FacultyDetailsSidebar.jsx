// src/pages/Department/DepartmentFaculty/components/FacultyDetailsSidebar.jsx

import React, { useMemo } from "react";
import { Calendar, Star, TrendingUp, Users } from "lucide-react";
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

	// Calculate the number of unique sections handled by the faculty
	const sectionsHandled = useMemo(() => {
		const facultyAllocations = (allocations || []).filter(
			(a) => a.facultyId === faculty.id,
		);
		return facultyAllocations.length;
	}, [allocations, faculty.id]);

	return (
		<CollapsibleSection
			title="Faculty Summary"
			icon={<TrendingUp className="size-4 text-violet-500" />}
		>
			<div className="space-y-6 p-1 sm:p-0">
				<div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 gap-4">
					<SidebarStat
						label="Avg. Rating"
						value={
							metrics.average > 0
								? `${metrics.average.toFixed(1)} / 5.0`
								: "N/A"
						}
						icon={Star}
						color="text-amber-500"
					/>

					<SidebarStat
						label="Sections Handled"
						value={sectionsHandled}
						icon={Users}
						color="text-violet-500"
					/>
				</div>

				{/* Progress Indicators */}
				<div className="pt-5 space-y-5 border-t border-gray-100 dark:border-gray-800">
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
	<div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 lg:bg-transparent lg:dark:bg-transparent lg:border-none lg:p-0">
		<div className="flex items-center justify-center size-10 rounded-xl bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 shadow-sm shrink-0">
			<Icon className={`size-4 ${color}`} />
		</div>
		<div className="min-w-0">
			<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
				{label}
			</p>
			<p className="font-black text-gray-900 dark:text-white truncate">
				{value}
			</p>
		</div>
	</div>
);

/**
 * Progress bar for attendance metrics.
 */
const ProgressStat = ({ label, value, percentage, icon: Icon, color }) => (
	<div className="space-y-3">
		<div className="flex justify-between items-center">
			<div className="flex items-center gap-2">
				<Icon className="size-3.5 text-gray-400" />
				<span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
					{label}
				</span>
			</div>
			<span className="text-xs font-black text-gray-900 dark:text-white">
				{value}
			</span>
		</div>
		<div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
			<div
				className={`h-full ${color} transition-all duration-500`}
				style={{ width: `${percentage}%` }}
			/>
		</div>
	</div>
);

export default FacultyDetailsSidebar;
