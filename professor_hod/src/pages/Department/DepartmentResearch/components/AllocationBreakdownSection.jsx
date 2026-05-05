// src/pages/Department/DepartmentResearch/components/AllocationBreakdownSection.jsx

import React from "react";
import { PieChart } from "lucide-react";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";

/**
 * Renders a budget breakdown using a donut chart and a legend list.
 * Wrapped in a CollapsibleSection for unified UI.
 */
const AllocationBreakdownSection = ({ data, colors, totalBudget }) => {
	let cumulative = 0;

	return (
		<CollapsibleSection
			title="Budget Allocation Breakdown"
			icon={<PieChart className="size-4 text-violet-500" />}
			color="violet"
		>
			<div className="flex flex-col sm:flex-row items-center gap-8">
				{/* SVG Donut Chart Section */}
				<div className="relative size-40 flex items-center justify-center shrink-0">
					<svg
						viewBox="0 0 32 32"
						className="size-full rotate-[-90deg]"
					>
						{data?.map((item, i) => {
							const start = cumulative;
							cumulative += item.percentage;
							return (
								<circle
									key={i}
									cx="16"
									cy="16"
									r="12"
									fill="transparent"
									stroke={colors[i % colors.length]}
									strokeWidth="4"
									strokeDasharray={`${item.percentage} 100`}
									strokeDashoffset={-start}
									pathLength="100"
									className="transition-all duration-700 hover:stroke-violet-400 cursor-help"
								/>
							);
						})}
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
							Total
						</span>
						<span className="text-xs font-black text-violet-600 dark:text-violet-400">
							₹{totalBudget.toLocaleString("en-IN")}
						</span>
					</div>
				</div>

				{/* Legend and Breakdown List Section */}
				<div className="flex-1 w-full space-y-2">
					{data?.map((item, idx) => (
						<div
							key={idx}
							className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
						>
							<div className="flex items-center gap-3">
								<div
									className="size-2 rounded-full shadow-sm"
									style={{
										backgroundColor:
											colors[idx % colors.length],
									}}
								/>
								<p className="text-[11px] font-black text-gray-500 uppercase tracking-widest group-hover:text-violet-600 transition-colors">
									{item.category}
								</p>
							</div>
							<div className="text-right">
								<p className="text-[11px] font-black text-gray-900 dark:text-white">
									{item.percentage}%
								</p>
								<p className="text-[9px] font-medium text-gray-400">
									₹
									{(
										(item.percentage / 100) *
										(totalBudget || 0)
									).toLocaleString("en-IN")}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</CollapsibleSection>
	);
};

export default AllocationBreakdownSection;
