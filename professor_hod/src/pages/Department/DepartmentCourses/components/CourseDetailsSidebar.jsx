// src/pages/Department/DepartmentCourses/components/CourseDetailsSidebar.jsx

import React from "react";
import {
	TrendingUp,
	Users,
	GraduationCap,
	BookOpen,
	Calendar,
} from "lucide-react";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";

/**
 * Sidebar component providing a high-level summary of the course.
 * Includes class size, credits, and progress metrics for the active section.
 */
const CourseDetailsSidebar = ({ course, activeSection }) => (
	<CollapsibleSection
		title="Course Summary"
		icon={<TrendingUp className="size-4 text-violet-500" />}
		color="violet"
	>
		<div className="space-y-6">
			{/* Primary Statistics Grid */}
			<div className="grid grid-cols-2 gap-2 sm:gap-4">
				<SidebarStat
					label="Class Size"
					value={activeSection.students}
					icon={Users}
				/>
				<SidebarStat
					label="Credits"
					value={course.credits}
					icon={GraduationCap}
				/>
			</div>

			{/* Progress Indicators */}
			<div className="pt-4 space-y-4 border-t border-gray-100 dark:border-gray-800">
				<ProgressIndicator
					label="Syllabus"
					percentage={activeSection.syllabus_completion}
					icon={BookOpen}
					color="bg-violet-600"
				/>
				<ProgressIndicator
					label="Attendance"
					percentage={activeSection.attendance_percentage}
					icon={Calendar}
					color={
						activeSection.attendance_percentage > 70
							? "bg-emerald-500"
							: "bg-rose-500"
					}
				/>
			</div>
		</div>
	</CollapsibleSection>
);

/**
 * Individual stat card within the sidebar summary.
 */
const SidebarStat = ({ label, value, icon: Icon }) => (
	<div className="flex flex-col gap-1 p-2">
		<div className="flex items-center gap-2">
			<Icon className="size-3 text-violet-500" />
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
 * Progress bar for syllabus and attendance metrics.
 */
const ProgressIndicator = ({ label, percentage, icon: Icon, color }) => (
	<div className="space-y-2">
		<div className="flex justify-between items-end">
			<div className="flex items-center gap-1.5">
				<Icon className="size-3 text-gray-400" />
				<span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">
					{label}
				</span>
			</div>
			<span className="text-xs font-bold text-gray-900 dark:text-white">
				{percentage}%
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

export default CourseDetailsSidebar;
