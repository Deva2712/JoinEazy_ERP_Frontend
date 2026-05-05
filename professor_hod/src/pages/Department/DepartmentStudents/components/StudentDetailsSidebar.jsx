// src/pages/Department/DepartmentStudents/components/StudentDetailsSidebar.jsx

import React from "react";
import { Calendar, Users, GraduationCap, TrendingUp } from "lucide-react";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";

const StudentDetailsSidebar = ({ student }) => {
	const attendance =
		student.academicMetrics?.attendance || student.attendance || 0;

	return (
		<CollapsibleSection
			title="Academic Summary"
			icon={<TrendingUp className="size-4 text-violet-500" />}
            color="violet"
		>
			<div className="space-y-6">
				{/* Primary Statistics Grid */}
			<div className="grid grid-cols-2 gap-2 sm:gap-4">
				<SidebarStat
					label="Section"
					value={student.section}
					icon={Users}
				/>
				<SidebarStat
					label="Semester"
					value={student.semester}
					icon={GraduationCap}
				/>
			</div>

				<div className="pt-5 space-y-5 border-t border-gray-100 dark:border-gray-800">
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-2">
								<Calendar className="size-3.5 text-gray-400" />
								<span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
									Overall Attendance
								</span>
							</div>
							<span className="text-xs font-black text-gray-900 dark:text-white">
								{attendance}%
							</span>
						</div>
						<div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
							<div
								className={`h-full transition-all duration-500 ${attendance > 75 ? "bg-emerald-500" : "bg-rose-500"}`}
								style={{ width: `${attendance}%` }}
							/>
						</div>
					</div>
				</div>
			</div>
		</CollapsibleSection>
	);
};

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

export default StudentDetailsSidebar;