// src/pages/Mentoring/components/StudentDetailComponents.jsx

import React from "react";
import { 
	University, 
	GraduationCap, 
	AlertTriangle, 
	Calendar, 
	FileText, 
} from "lucide-react";

/**
 * Sidebar container that displays quick stats and primary action buttons.
 */
export const SidebarContent = ({
	department,
	semester,
	academicMetrics,
	handleScheduleMeeting,
	onDownloadReport,
}) => (
	<div className="bg-white dark:bg-[#1a1d26] rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden">
		<div className="p-6 space-y-6">
			<QuickStat
				label="Department"
				value={department}
				icon={<University />}
				status="default"
			/>
			<QuickStat
				label="Current"
				value={`Semester ${semester}`}
				icon={<GraduationCap />}
				status="default"
			/>
			{academicMetrics.backlogs > 0 &&
			<QuickStat
				label="Active Backlogs"
				value={academicMetrics.backlogs}
				icon={<AlertTriangle />}
				status="at_risk"
			/>
			}
		</div>
		<div className="hidden md:flex flex-col gap-2.5 p-4 bg-gray-50/50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-700">
			<ActionButtons
				onSchedule={handleScheduleMeeting}
				onDownloadReport={onDownloadReport}
			/>
		</div>
	</div>
);

/**
 * Reusable action buttons for scheduling and viewing history.
 */
export const ActionButtons = ({ onSchedule, onDownloadReport }) => (
	<>
		<button
			onClick={onSchedule}
			className="flex-1 w-full bg-sky-700 hover:bg-sky-800 text-white px-4 py-3.5 rounded-xl font-black text-xs shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
		>
			<Calendar className="size-4" /> Schedule Meet
		</button>
		<button
			onClick={onDownloadReport}
			className="flex-1 w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-4 py-3.5 rounded-xl font-black text-xs shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
		>
			<FileText className="size-4" /> Export Data
		</button>
	</>
);

/**
 * Individual stat card used within the sidebar.
 */
export const QuickStat = ({ label, value, icon, status = "good" }) => {
	const colors = {
		at_risk: "text-rose-500 bg-rose-50 dark:bg-rose-500/10",
		no_risk: "text-green-500 bg-green-50 dark:bg-green-500/10",
		default: "text-gray-400 bg-gray-50 dark:bg-gray-800/50",
	};

	return (
		<div className="group flex items-center gap-4 rounded-2xl">
			<div className={`p-2.5 rounded-xl ${colors[status]}`}>
				{React.cloneElement(icon, { className: "size-5" })}
			</div>
			<div className="min-w-0 space-y-1">
				<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
					{label}
				</p>
				<p className="font-bold text-sm md:text-md text-gray-900 dark:text-white">
					{value}
				</p>
			</div>
		</div>
	);
};