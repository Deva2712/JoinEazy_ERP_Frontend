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
	>
		<div className="space-y-6 p-1 sm:p-0">
			{/* Primary Statistics Grid 
			    Optimized: 1 col on tiny screens, 2 cols on mobile, 1 col on desktop sidebar.
			*/}
			<div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 gap-4">
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
			<div className="pt-5 space-y-5 border-t border-gray-100 dark:border-gray-800">
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
	<div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 lg:bg-transparent lg:dark:bg-transparent lg:border-none lg:p-0">
		<div className="flex items-center justify-center size-10 rounded-xl bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 shadow-sm shrink-0">
			<Icon className="size-4 text-violet-500" />
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
 * Progress bar for syllabus and attendance metrics.
 */
const ProgressIndicator = ({ label, percentage, icon: Icon, color }) => (
	<div className="space-y-3">
		<div className="flex justify-between items-center">
			<div className="flex items-center gap-2">
				<Icon className="size-3.5 text-gray-400" />
				<span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
					{label}
				</span>
			</div>
			<span className="text-xs font-black text-gray-900 dark:text-white">
				{percentage}%
			</span>
		</div>
		<div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
			<div
				className={`h-full ${color} rounded-full transition-all duration-500`}
				style={{ width: `${percentage}%` }}
			/>
		</div>
	</div>
);

export default CourseDetailsSidebar;
