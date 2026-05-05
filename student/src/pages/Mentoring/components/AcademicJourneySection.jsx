// src/pages/Mentoring/components/AcademicJourneySection.jsx

import React, { useState } from "react";
import { Percent, Award } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Encapsulates the Academic Journey logic, including the toggle,
 * dynamic summary stats, and the semester bar graph using Framer Motion.
 */
const AcademicJourneySection = ({ academicMetrics, sortedGrades }) => {
	const [viewType, setViewType] = useState("gpa");

	const isGpa = viewType === "gpa";
	const currentStatLabel = isGpa ? "Cumulative GPA" : "Overall Attendance";
	const currentStatValue = isGpa
		? academicMetrics.cgpa
		: `${academicMetrics.attendance}%`;

	const getStatusColor = (type, value) => {
		const thresholds = { gpa: 6.5, attendance: 75 };
		const isAtRisk = value < thresholds[type];

		if (isAtRisk)
			return "bg-rose-500 dark:bg-rose-400 text-rose-600 dark:text-rose-400";

		return type === "attendance"
			? "bg-indigo-500 dark:bg-indigo-400 text-indigo-600 dark:text-indigo-400"
			: "bg-sky-500 dark:bg-sky-400 text-sky-600 dark:text-sky-400";
	};

	const getBarColor = (type, value) => {
		return (
			getStatusColor(type, value).split(" ")[0] +
			" " +
			getStatusColor(type, value).split(" ")[1]
		);
	};

	return (
		<div className="space-y-6 sm:space-y-8 pb-4">
			{/**
			 * Section Header & Summary Card
			 */}
			<div className="bg-gray-50/50 dark:bg-white/5 rounded-xl p-5 sm:p-6 border border-gray-100 dark:border-white/10 backdrop-blur-sm">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
					<div className="flex items-center gap-2">
						<div>
							<p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
								{currentStatLabel}
							</p>
							<div className="flex items-baseline gap-2">
								<span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tabular-nums tracking-tight">
									{currentStatValue}
								</span>
								{isGpa && (
									<span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">
										/ 10.0
									</span>
								)}
							</div>
						</div>
					</div>

					<div className="relative flex p-1 bg-gray-200/50 dark:bg-white/5 rounded-xl w-full sm:w-fit border border-gray-200/50 dark:border-white/5">
						{[
							{ id: "gpa", label: "GPA", icon: Award },
							{
								id: "attendance",
								label: "Attendance",
								icon: Percent,
							},
						].map((type) => {
							const isActive = viewType === type.id;
							return (
								<button
									key={type.id}
									onClick={() => setViewType(type.id)}
									className={`relative flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors duration-200 z-10 ${
										isActive
											? isGpa
												? "text-sky-600 dark:text-sky-400"
												: "text-indigo-600 dark:text-indigo-400"
											: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
									}`}
								>
									<type.icon className="size-3.5" />
									{type.label}
									{isActive && (
										<motion.div
											layoutId="activeTab"
											className="absolute inset-0 bg-white dark:bg-white/10 shadow-sm border border-gray-200 dark:border-white/10 rounded-lg -z-10"
											transition={{
												type: "spring",
												bounce: 0.2,
												duration: 0.6,
											}}
										/>
									)}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/**
			 * Semester Visualizer
			 */}
			<div className="space-y-6 sm:space-y-8 relative">
				<div className="absolute left-[48px] sm:left-[64px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 z-0" />

				{sortedGrades.map((grade) => {
					const semAttendance =
						academicMetrics.semesterAttendance?.find(
							(a) => a.sem === grade.sem,
						);

					const displayValue = isGpa
						? `${grade.gpa} GPA`
						: `${semAttendance?.attendance || 0}%`;
					const barWidth = isGpa
						? (grade.gpa / 10) * 100
						: semAttendance?.attendance || 0;
					const barColor = isGpa
						? getBarColor("gpa", grade.gpa)
						: getBarColor(
								"attendance",
								semAttendance?.attendance || 0,
							);

					return (
						<div
							key={grade.sem}
							className="flex items-center group relative z-10"
						>
							<div className="w-[48px] sm:w-[64px] pr-3 sm:pr-4 text-right">
								<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
									Sem
								</p>
								<p className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
									{grade.sem}
								</p>
							</div>

							<div className="flex-1 flex items-center gap-3">
								<div className="flex-1 h-3 sm:h-5 bg-gray-100 dark:bg-white/5 rounded-r-md overflow-hidden">
									<motion.div
										initial={{ width: 0 }}
										animate={{ width: `${barWidth}%` }}
										transition={{
											type: "spring",
											stiffness: 100,
											damping: 20,
										}}
										className={`h-full rounded-r-md ${barColor}`}
									/>
								</div>

								<span className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap min-w-[45px]">
									{displayValue}
								</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default AcademicJourneySection;
