// src/pages/Department/DepartmentPlacements/components/CompanyDetailsSidebar.jsx

import React from "react";
import {
	TrendingUp,
	ShieldCheck,
	Globe,
	LayoutGrid,
	Building2,
} from "lucide-react";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";

/**
 * Sidebar component that provides high-level insights for recruiting companies,
 * featuring metric cards and sector distribution tags.
 */
const CompanyDetailsSidebar = ({ companies, tier1Count, sectors }) => {
	return (
		<CollapsibleSection
			title="Partner Insights"
			icon={<TrendingUp className="size-4 text-violet-500" />}
			color="violet"
		>
			<div className="space-y-4">
				{/* High-level Partner Stats */}
				<div className="grid grid-cols-2 gap-2 sm:gap-4">
					<SidebarStat
						label="Tier 1"
						value={tier1Count}
						sub=""
						icon={ShieldCheck}
						color="text-amber-500"
					/>
					<SidebarStat
						label="Sectors"
						value={sectors.length}
						sub=""
						icon={Globe}
						color="text-emerald-500"
					/>
				</div>

				{/* Industries/Sectors Section */}
				<div className="px-2 pb-2">
					<div className="flex items-center gap-2 mb-3">
						<LayoutGrid className="size-3 text-gray-400" />
						<p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">
							Top Hiring Sectors
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						{sectors.slice(0, 8).map((sector, idx) => (
							<span
								key={idx}
								className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 text-[10px] font-bold text-gray-600 dark:text-gray-400"
							>
								{sector}
							</span>
						))}
					</div>
				</div>
			</div>
		</CollapsibleSection>
	);
};

/**
 * Individual stat card within the sidebar summary.
 */
const SidebarStat = ({ label, value, sub, icon: Icon, color }) => (
	<div className="flex flex-col gap-1 p-2 min-w-0">
		<div className="flex items-center gap-2">
			<Icon className={`size-3 shrink-0 ${color}`} />
			<p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">
				{label}
			</p>
		</div>
		<div className="flex flex-wrap items-baseline gap-x-1">
			<span className="text-xl font-black text-gray-900 dark:text-white leading-tight">
				{value}
			</span>
			<span className="text-[9px] font-bold text-gray-400 uppercase whitespace-nowrap">
				{sub}
			</span>
		</div>
	</div>
);

export default CompanyDetailsSidebar;
