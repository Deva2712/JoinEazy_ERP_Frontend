// src/pages/Cohort/CohortAttendance/components/AttendanceReportTable.jsx

import React from "react";
import { Minus } from "lucide-react";

/**
 * Renders the scrollable attendance matrix for the full cohort report.
 * Uses shrink-to-fit sticky columns to prevent overlapping center data.
 */
const AttendanceReportTable = ({ filteredReportData, dateRange }) => {
	return (
		<div className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
			<div className="overflow-x-auto overflow-y-auto max-h-[75vh]">
				<table className="w-full text-left border-separate border-spacing-0">
					<thead>
						<tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs uppercase font-bold sticky top-0 z-20">
							{/* Sticky Left: Shrink to fit content */}
							<th className="w-px whitespace-nowrap px-4 md:px-6 py-5 sticky left-0 bg-gray-50 dark:bg-gray-800 z-30 border-r border-b border-gray-200 dark:border-gray-700 shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
								Student Details
							</th>

							{/* Date Range: These maintain the "gap" in the middle */}
							{dateRange.map((date) => (
								<th
									key={date}
									className="px-3 py-5 text-center min-w-[70px] md:min-w-[90px] border-r border-b border-gray-100 dark:border-gray-700"
								>
									{new Date(date).toLocaleDateString(
										"en-US",
										{
											day: "2-digit",
											month: "2-digit",
										},
									)}
								</th>
							))}

							{/* Sticky Right: Shrink to fit content */}
							<th className="w-px whitespace-nowrap px-4 md:px-6 py-5 text-right sticky right-0 bg-gray-50 dark:bg-gray-800 z-30 border-l border-b border-gray-200 dark:border-gray-700 shadow-[-1px_0_0_0_rgba(0,0,0,0.1)]">
								<span className="md:hidden">%</span>
								<span className="hidden md:inline">
									Percentage
								</span>
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100 dark:divide-gray-700">
						{filteredReportData.map((student) => (
							<tr
								key={student.id}
								className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
							>
								{/* Sticky Left Data */}
								<td className="w-px whitespace-nowrap px-4 md:px-6 py-4 sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-200 dark:border-gray-700 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
									<p className="font-bold text-sm md:text-base text-gray-900 dark:text-white">
										{student.name}
									</p>
									<div className="flex items-center gap-2 mt-1">
										<span className="text-[10px] md:text-xs font-mono text-gray-400">
											{student.rollNumber}
										</span>
										<span className="text-[10px] md:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 rounded">
											{student.daysPresent}/
											{student.totalLoggedDays}
										</span>
									</div>
								</td>

								{/* Center Scrollable Data */}
								{dateRange.map((date) => {
									const status = student.dailyStatus[date];
									return (
										<td
											key={date}
											className="px-3 py-4 text-center border-r border-gray-50 dark:border-gray-700"
										>
											{status === true ? (
												<span className="text-emerald-500 font-black text-sm">
													P
												</span>
											) : status === false ? (
												<span className="text-red-500 font-black text-sm">
													A
												</span>
											) : (
												<Minus className="size-4 mx-auto text-gray-300" />
											)}
										</td>
									);
								})}

								{/* Sticky Right Data */}
								<td className="w-px whitespace-nowrap px-4 md:px-6 py-4 text-right sticky right-0 bg-white dark:bg-gray-800 z-10 border-l border-gray-200 dark:border-gray-700 font-mono text-sm font-black text-blue-600 dark:text-blue-400 shadow-[-1px_0_0_0_rgba(0,0,0,0.05)]">
									{student.percentage}%
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AttendanceReportTable;
