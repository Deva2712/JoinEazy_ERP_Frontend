// src/pages/Department/DepartmentOverview/components/FacultyAttendanceSection.jsx

import React from "react";
import {
	Activity,
	ArrowUpRight,
	AlertTriangle,
	Award,
	ThumbsUp,
} from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";
import { Link } from "react-router-dom";

/**
 * Custom shape renderer for horizontal bars.
 * Applies a deeper indigo to the most recent month.
 */
const CustomBarShape = (props) => {
	const { x, y, width, height, index, totalBars } = props;
	const isLast = index === totalBars - 1;
	const barFill = isLast ? "#4f46e5" : "#818cf8";

	return (
		<rect
			x={x}
			y={y}
			width={width}
			height={height}
			fill={barFill}
			rx={4}
			ry={4}
		/>
	);
};

const FacultyAttendanceSection = ({ attendanceData }) => {
	if (!attendanceData) return null;

	const { averageAttendance, monthlyTrend, distribution } = attendanceData;

	return (
		<CollapsibleSection
			title="Faculty Attendance Analytics"
			icon={<Activity className="size-4 text-indigo-500" />}
			defaultOpen={false}
			color="indigo"
		>
			<div className="space-y-6">
				{/* Top Summary Section: Featuring average attendance and distribution grid */}
				<div className="grid grid-cols-1 sm:grid-cols-4 gap-3 px-2">
					{/* Primary Attendance Metric */}
					<div className="sm:col-span-1 bg-indigo-50/50 dark:bg-indigo-500/5 p-2.5 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/10 flex flex-col justify-center items-center text-center">
						<span className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase mb-0.5">
							Avg. Attendance
						</span>
						<span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 leading-none">
							{averageAttendance}%
						</span>
					</div>

					{/* Category Distribution Grid */}
					<div className="sm:col-span-3 grid grid-cols-3 gap-2">
						<div className="bg-white dark:bg-gray-800/40 p-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center transition-colors hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5">
							<div className="p-1 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg mb-1">
								<Award className="size-3.5 text-emerald-600 dark:text-emerald-400" />
							</div>
							<span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
								Good
							</span>
							<span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
								{distribution.good}
							</span>
						</div>

						<div className="bg-white dark:bg-gray-800/40 p-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center transition-colors hover:bg-amber-50/30 dark:hover:bg-amber-500/5">
							<div className="p-1 bg-amber-100 dark:bg-amber-500/20 rounded-lg mb-1">
								<ThumbsUp className="size-3.5 text-amber-600 dark:text-amber-400" />
							</div>
							<span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
								Average
							</span>
							<span className="text-base font-bold text-amber-600 dark:text-amber-400">
								{distribution.average}
							</span>
						</div>

						<div className="bg-white dark:bg-gray-800/40 p-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center transition-colors hover:bg-rose-50/30 dark:hover:bg-rose-500/5">
							<div className="p-1 bg-rose-100 dark:bg-rose-500/20 rounded-lg mb-1">
								<AlertTriangle className="size-3.5 text-rose-600 dark:text-rose-400" />
							</div>
							<span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
								Low
							</span>
							<span className="text-base font-bold text-rose-600 dark:text-rose-400">
								{distribution.low || 0}
							</span>
						</div>
					</div>
				</div>

				{/* Horizontal Monthly Trend Chart Section */}
				<div className="h-64 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							layout="vertical"
							data={monthlyTrend}
							margin={{ right: 30 }}
						>
							<CartesianGrid
								horizontal={false}
								strokeDasharray="3 3"
								stroke="#e5e7eb"
								className="dark:stroke-gray-800"
							/>
							<XAxis
								type="number"
								domain={[0, 100]}
								ticks={[0, 20, 40, 60, 80, 100]}
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 10, fill: "#6b7280" }}
							/>
							<YAxis
								dataKey="month"
								type="category"
								axisLine={false}
								tickLine={false}
								tick={{
									fontSize: 11,
									fontWeight: 700,
									fill: "#6b7280",
								}}
								width={50}
							/>
							<Tooltip
								cursor={{ fill: "#f3f4f6", opacity: 0.4 }}
								content={({ active, payload }) => {
									if (active && payload && payload.length) {
										return (
											<div className="bg-white dark:bg-gray-900 p-3 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700">
												<p className="text-xs font-bold text-gray-800 dark:text-gray-100">
													{payload[0].payload.month}
												</p>
												<p className="text-xs font-black text-indigo-600">
													{payload[0].value}%
													Attendance
												</p>
											</div>
										);
									}
									return null;
								}}
							/>
							<Bar
								dataKey="attendance"
								barSize={20}
								radius={[0, 4, 4, 0]}
								shape={
									<CustomBarShape
										totalBars={monthlyTrend.length}
									/>
								}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* Footer Link to detailed view */}
				<Link
					to="/department/faculty"
					className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-50 dark:bg-[#0f1117] text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all border border-gray-100 dark:border-gray-700/50"
				>
					View Faculty Details
					<ArrowUpRight className="size-3" />
				</Link>
			</div>
		</CollapsibleSection>
	);
};

export default FacultyAttendanceSection;
