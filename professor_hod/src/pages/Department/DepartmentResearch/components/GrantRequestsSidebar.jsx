// src/pages/Department/DepartmentResearch/components/GrantRequestsSidebar.jsx

import React from "react";
import {
	TrendingUp,
	Clock,
	XCircle,
	CheckCircle,
} from "lucide-react";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";

/**
 * Sidebar component for the Grant Requests view.
 * Visualizes the grant pipeline status and budget utilization metrics.
 */
const GrantRequestsSidebar = ({ grantData }) => {
	return (
		<CollapsibleSection
			title="Grant Pipeline"
			icon={<TrendingUp className="size-4 text-violet-500" />}
			color="violet"
		>
			<div className="space-y-6">
				{/* Primary Statistics Grid */}
				<div className="grid grid-cols-2 gap-2 sm:gap-4">
					<SidebarStat
						label="Approved"
						value={grantData.approved}
						icon={CheckCircle}
						color="text-violet-500"
					/>
					<SidebarStat
						label="Pending"
						value={grantData.pending}
						icon={Clock}
						color="text-amber-500"
					/>
				</div>

				{/* Progress Indicators for Utilization and Success Rate */}
				<div className="pt-4 border-t border-gray-100 dark:border-gray-800">
					<ProgressIndicator
						label="Rejection Rate"
						percentage={Math.round(
							(grantData.rejected /
								(grantData.approved + grantData.rejected)) *
								100,
						)}
						icon={XCircle}
						color="bg-rose-500"
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
 * Progress bar for budget and pipeline metrics.
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

export default GrantRequestsSidebar;
