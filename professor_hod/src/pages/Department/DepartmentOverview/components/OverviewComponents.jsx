// src/pages/Department/DepartmentOverview/components/OverviewComponents.jsx

import React from "react";
import { motion } from "framer-motion";
import {
	Download,
	Activity,
	FileSpreadsheet,
	Timer,
} from "lucide-react";

/**
 * Displays departmental health metrics with animated progress bars.
 * Includes Placement Rate, Student Retention, Research Targets, and Curriculum Completion.
 */
export const DepartmentalHealthCard = ({ metrics }) => {
	const progressItems = [
		{
			label: "Placement Rate",
			value: metrics?.placementRate,
			color: "from-purple-600 to-purple-500",
		},
		{
			label: "Student Retention Rate",
			value: metrics?.studentRetentionRate,
			color: "from-violet-600 to-violet-500",
		},

		{
			label: "Research Target",
			value: metrics?.researchTargetAchievement,
			color: "from-indigo-600 to-indigo-500",
		},

		{
			label: "Curriculum Done",
			value: metrics?.curriculumCompletion,
			color: "from-blue-600 to-blue-500",
		},
	];

	return (
		<div className="relative overflow-hidden bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex flex-col group h-full transition-all duration-300">
			<div className="absolute -top-6 -right-6 text-gray-50 dark:text-gray-800/30 group-hover:text-indigo-50/50 transition-colors duration-500 pointer-events-none">
				<Activity className="size-32 rotate-12" />
			</div>

			<div className="relative z-10">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
							<Activity className="size-4 text-violet-600" />
						</div>
						<h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
							Departmental Health
						</h3>
					</div>
				</div>

				<div className="space-y-4 mb-2">
					{progressItems.map((item, idx) => (
						<div key={idx} className="group/item">
							<p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
								{item.label}
							</p>

							<div className="relative h-6 w-full bg-gray-100/50 dark:bg-gray-800/40 rounded-full p-1 overflow-hidden ring-1 ring-inset ring-gray-200/50 dark:ring-gray-700/30">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${item.value}%` }}
									transition={{
										duration: 1.5,
										ease: [0.22, 1, 0.36, 1],
										delay: idx * 0.1,
									}}
									className={`h-full rounded-full bg-gradient-to-r ${item.color} relative flex items-center justify-end`}
								>
									<div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-lg" />

									<span className="relative z-10 text-[10px] font-black text-white px-2 drop-shadow-md">
										{item.value}%
									</span>
								</motion.div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

/**
 * Actionable card for generating reports.
 */
export const MISReportCard = ({ onDownload, data }) => (
	<div className="bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl flex flex-col shadow-sm group">
		<div className="relative z-10">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
						<FileSpreadsheet className="size-4 text-violet-600" />
					</div>
					<h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
						MIS Report Generator
					</h3>
				</div>
			</div>

			<div className="flex flex-col items-center justify-center gap-1 text-center animate-pulse">
				<Timer className="size-12 md:size-16 text-gray-200 dark:text-gray-700" />
				<h2 className="text-sm font-black text-gray-300 dark:text-gray-600">
					Coming Soon!
				</h2>
			</div>
		</div>

		<div className="relative z-10 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800/50">
			<p className="text-[11px] text-gray-400 dark:text-gray-500 italic mb-4">
				Need data now? Use the legacy export:
			</p>

			<button
				onClick={() => onDownload(data)}
				className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-black text-xs shadow-md transition-all uppercase tracking-wider bg-violet-600 hover:bg-violet-700 text-white hover:scale-105"
			>
				<Download className="size-4" /> Export Audit Report
			</button>
		</div>
	</div>
);

/**
 * Specialized card for displaying numeric metrics with an icon.
 */
export const MetricCard = ({ label, value, Icon }) => (
	<div className="p-5 bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-violet-500/30 transition-all group">
		<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
			{label}
		</p>
		<div className="flex items-center justify-between">
			<h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-violet-600 transition-colors">
				{value}
			</h3>
			<div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-violet-500 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 transition-all">
				<Icon className="size-5" />
			</div>
		</div>
	</div>
);
