// src/pages/Department/DepartmentOverview/components/OverviewComponents.jsx

import React from "react";
import { Download, Users, BookOpen } from "lucide-react";

/**
 * Renders high-level enrollment, faculty, and course stats in a styled sidebar container.
 */
export const SidebarStats = ({ data, onDownloadAudit }) => (
	<div className="bg-gradient-to-br from-violet-600 to-indigo-700 dark:from-violet-800 dark:to-indigo-950 rounded-2xl border border-violet-500/20 shadow-xl overflow-hidden text-white">
		<div className="p-6 flex flex-row lg:flex-col items-center lg:items-start gap-6">
			{/* Main Enrollment Metric */}
			<div className="space-y-1">
				<p className="text-[10px] font-black text-violet-200 uppercase tracking-widest">
					Total Enrollment
				</p>
				<div className="flex flex-col lg:flex-row items-start lg:items-end gap-3">
					<p className="text-5xl font-black text-white tracking-tighter">
						{data?.totalStudents.count}
					</p>

					<span className="mb-1.5 px-2 py-0.5 rounded-lg text-[10px] font-black bg-white/20">
						{data?.totalStudents?.trend > 0 ? "↑" : "↓"}{" "}
						{Math.abs(data?.totalStudents?.trend)}%
					</span>
				</div>
			</div>

			{/* Secondary Stats Group */}
			<div className="flex flex-col gap-4">
				<StatRow
					Icon={Users}
					label="Faculty Size"
					value={data?.totalFaculty}
				/>
				<StatRow
					Icon={BookOpen}
					label="Active Courses"
					value={data?.totalCourses}
				/>
			</div>
		</div>

		{/* Sidebar Action Button */}
		<div className="hidden lg:block p-4 bg-black/10 border-t border-white/10">
			<button
				onClick={onDownloadAudit}
				className="flex items-center justify-center gap-2 w-full bg-white text-violet-700 hover:bg-violet-50 px-4 py-3.5 rounded-xl font-black text-xs shadow-md transition-all uppercase tracking-wider"
			>
				<Download className="size-4" /> Export Audit Report
			</button>
		</div>
	</div>
);

/**
 * Small row component for simple Icon + Label + Value layout.
 */
const StatRow = ({ Icon, label, value }) => (
	<div className="flex items-center gap-4">
		<div className="p-2.5 rounded-xl bg-white/10 text-violet-100">
			<Icon className="size-5" />
		</div>
		<div className="min-w-0 space-y-0.5">
			<p className="text-[10px] font-black text-violet-200 uppercase tracking-widest">
				{label}
			</p>
			<p className="font-bold text-sm text-white">{value}</p>
		</div>
	</div>
);

/**
 * Specialized card for displaying numeric metrics with optional themed highlights.
 */
export const MetricCard = ({
	Icon,
	label,
	value,
	unit,
	color = "violet",
	highlight = false,
}) => {
	const themes = {
		violet: {
			bg: "bg-violet-50/40 dark:bg-violet-900/10",
			border: "border-violet-100 dark:border-violet-900/30",
			hover: "hover:border-violet-400 dark:hover:border-violet-400 hover:shadow-md hover:shadow-violet-200/20 dark:hover:shadow-none",
			iconBg: "bg-violet-600 text-white dark:bg-violet-500 dark:text-gray-900",
			text: "text-violet-700 dark:text-violet-300",
			label: "text-violet-600 dark:text-violet-400",
		},
		emerald: {
			bg: "bg-emerald-50/40 dark:bg-emerald-900/10",
			border: "border-emerald-100 dark:border-emerald-900/30",
			hover: "hover:border-emerald-400 dark:hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-200/20 dark:hover:shadow-none",
			iconBg: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-gray-900",
			text: "text-emerald-700 dark:text-emerald-300",
			label: "text-emerald-600 dark:text-emerald-400",
		},
	};
	const theme = themes[color];
	return (
		<div
			className={`p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-sm flex-1 ${highlight ? `${theme.bg} ${theme.border} ${theme.hover}` : "bg-white dark:bg-[#1a1d26] border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600"}`}
		>
			{/* Metric Data Labels */}
			<div>
				<p
					className={`text-[10px] font-black uppercase tracking-widest ${highlight ? theme.label : "text-gray-400"}`}
				>
					{label}
				</p>
				<div className="flex items-baseline gap-1.5">
					<span
						className={`text-3xl font-black tracking-tight ${highlight ? theme.text : "text-gray-900 dark:text-white"}`}
					>
						{value}
					</span>
					<span className="text-[9px] font-black text-gray-400 uppercase">
						{unit}
					</span>
				</div>
			</div>

			{/* Themed Icon Container */}
			<div
				className={`size-12 rounded-xl flex items-center justify-center ${highlight ? theme.iconBg : "bg-gray-50 dark:bg-gray-800 text-gray-400"}`}
			>
				<Icon size={20} strokeWidth={2.5} />
			</div>
		</div>
	);
};
