// src/pages/Department/DepartmentPlacements/components/PlacementsDetailsSidebar.jsx

import React from "react";
import {
	TrendingUp,
	Calendar,
	ArrowUpRight,
	ChartNoAxesCombined,
	Building2,
	Zap,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";

/**
 * Sidebar component that provides high-level placement/internship insights
 * for a specific batch, featuring metric cards and a monthly hiring bar graph.
 */
const PlacementsDetailsSidebar = ({ batchData, activeType }) => {
	const stats = batchData[activeType];

	const isInternship = activeType === "internships";
	const highest = isInternship
		? `${stats?.highestStipend / 1000}k`
		: stats?.highestSalaryLPA;
	const average = isInternship
		? `${stats?.averageStipend / 1000}k`
		: stats?.averageSalaryLPA;
	const unit = isInternship ? "/mo" : "LPA";
	const growthData = stats?.monthlyGrowth || [];
	const sectors = stats?.topHiringSectors || [];

	const CustomBarShape = (props) => {
		const { x, y, width, height, index } = props;
		const isLast = index === growthData.length - 1;

		return (
			<rect
				x={x}
				y={y}
				width={width}
				height={height}
				className={
					isLast
						? "fill-violet-500"
						: "fill-violet-200 dark:fill-gray-700"
				}
				rx={4}
				ry={4}
			/>
		);
	};

	return (
		<CollapsibleSection
			title="Placement Insights"
			icon={<TrendingUp className="size-4 text-violet-500" />}
			color="violet"
		>
			<div className="space-y-4">
				{/* High-level Package/Stipend Stats */}
				<div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-4">
					<SidebarStat
						label={`Highest`}
						value={`₹${highest?.toLocaleString("en-IN")}`}
						sub={unit}
						icon={ArrowUpRight}
						color="text-violet-500"
					/>
					<SidebarStat
						label={"Average"}
						value={`₹${average?.toLocaleString("en-IN")}`}
						sub={unit}
						icon={ChartNoAxesCombined}
						color="text-emerald-500"
					/>
					{isInternship && (
						<SidebarStat
							label={"PPO Rate"}
							value={`${stats?.conversionRate || 0}`}
							sub="%"
							icon={Zap}
							color="text-amber-500"
						/>
					)}
				</div>

				{/* Top Hiring Sectors Section */}
				<div className="px-2">
					<div className="flex items-center gap-2 mb-3">
						<Building2 className="size-3 text-gray-400" />
						<p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">
							Top Hiring Sectors
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						{sectors.map((sector, idx) => (
							<span
								key={idx}
								className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 text-[10px] font-bold text-gray-600 dark:text-gray-400"
							>
								{sector}
							</span>
						))}
					</div>
				</div>

				{/* Monthly Hiring Distribution Bar Chart */}
				<div className="pt-4 border-t border-gray-100 dark:border-gray-800">
					<div className="flex items-center gap-2 mb-3">
						<Calendar className="size-3 text-gray-400" />
						<p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">
							Monthly Hiring Trend
						</p>
					</div>
					<div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
						<div className="w-full" style={{ minHeight: "176px" }}>
							<ResponsiveContainer width="99%" height={176}>
								<BarChart
									data={growthData}
									margin={{
										top: 10,
										right: 5,
										left: 5,
										bottom: 0,
									}}
								>
									<XAxis
										dataKey="count"
										axisLine={false}
										tickLine={false}
										tick={{
											fontSize: 11,
											fill: "#8b5cf6",
											fontWeight: 800,
										}}
										interval={0}
										height={20}
									/>
									<XAxis
										dataKey="month"
										axisLine={false}
										tickLine={false}
										xAxisId="monthAxis"
										tick={{
											fontSize: 10,
											fill: "#64748b",
											fontWeight: 600,
										}}
										interval={0}
										dy={-5}
										height={20}
									/>
									<YAxis hide />
									<Bar
										dataKey="count"
										shape={<CustomBarShape />}
										barSize={20}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
						<p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-2 font-medium">
							Total offers released per month
						</p>
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
			<span className="text-lg font-black text-gray-900 dark:text-white leading-tight">
				{value}
			</span>
			<span className="text-[9px] font-bold text-gray-400 uppercase whitespace-nowrap">
				{sub}
			</span>
		</div>
	</div>
);

export default PlacementsDetailsSidebar;