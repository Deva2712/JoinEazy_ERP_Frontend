import React from "react";
import { TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";

/**
 * Renders a bar graph showing student distribution and gender ratios across different academic years.
 * Uses Recharts for standard visualization and maintains the violet color theme.
 */
const CohortDistributionSection = ({ data, diversityIndex }) => {
	const chartData = data.map(item => ({
		name: `${item.year} Yr`,
		female: item.genderRatio.f,
		male: item.genderRatio.m,
		total: item.count
	}));

	return (
		<CollapsibleSection
			title="Cohort Distribution"
			icon={<TrendingUp className="size-4 text-violet-500" />}
			color="violet"
		>
			<div className="space-y-2">
				{/* Main Chart Container: Renders the vertical stacked bar graph */}
				<div className="h-72 w-full pt-2">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={chartData}
							margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
							barGap={8}
						>
							<CartesianGrid 
								vertical={false} 
								strokeDasharray="3 3" 
								stroke="#e5e7eb" 
								className="dark:stroke-gray-800" 
							/>
							<XAxis 
								dataKey="name" 
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 11, fontWeight: 700, fill: '#6b7280' }}
							/>
							<YAxis 
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 10, fill: '#9ca3af' }}
							/>
							<Tooltip
								cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
								content={({ active, payload }) => {
									if (active && payload && payload.length) {
										return (
											<div className="bg-white dark:bg-gray-900 p-3 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700">
												<p className="text-xs font-bold mb-2 text-gray-800 dark:text-gray-100">
													{payload[0].payload.name}
												</p>
												<div className="space-y-1">
													<div className="flex items-center justify-between gap-4">
														<span className="text-[10px] text-gray-500 uppercase">Female</span>
														<span className="text-xs font-bold text-violet-600">{payload[0].value}</span>
													</div>
													<div className="flex items-center justify-between gap-4">
														<span className="text-[10px] text-gray-500 uppercase">Male</span>
														<span className="text-xs font-bold text-violet-400">{payload[1].value}</span>
													</div>
												</div>
											</div>
										);
									}
									return null;
								}}
							/>
							{/* Bars representing the gender split */}
							<Bar 
								dataKey="female" 
								stackId="a" 
								fill="#7c3aed" 
								radius={[0, 0, 0, 0]} 
								barSize={32}
							/>
							<Bar 
								dataKey="male" 
								stackId="a" 
								fill="#ddd6fe" 
								radius={[4, 4, 0, 0]} 
								barSize={32}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* Chart Legend: Explains the color mapping for the bars */}
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-4 border-t border-gray-100 dark:border-gray-800">
					<div className="flex gap-6">
						<div className="flex items-center gap-2">
							<div className="size-3 rounded-full bg-violet-600" />
							<span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
								Female
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="size-3 rounded-full bg-violet-200 dark:bg-violet-400" />
							<span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
								Male
							</span>
						</div>
					</div>

					{/* Diversity Index Section */}
					<div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
							Gender Diversity
						</p>
						<span className="text-sm font-black text-violet-600 dark:text-violet-400">
							{diversityIndex}%
						</span>
					</div>
				</div>
			</div>
		</CollapsibleSection>
	);
};

export default CohortDistributionSection;