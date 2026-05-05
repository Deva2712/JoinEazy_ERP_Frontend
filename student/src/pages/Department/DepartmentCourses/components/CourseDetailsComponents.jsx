// src/pages/Department/DepartmentCourses/components/CourseDetailsComponents.jsx

import React from "react";
import {
	ArrowRight,
	ChevronDown,
} from "lucide-react";

/**
 * Dropdown selector for switching between different course sections.
 */
export const SectionSelector = ({
	course,
	activeSectionName,
	onSectionChange,
	className = "",
}) => (
	<div className={className}>
		<label className="hidden md:block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
			Viewing Section
		</label>
		<div className="relative">
			<select
				value={activeSectionName}
				onChange={(e) => onSectionChange(e.target.value)}
				className="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200 appearance-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all cursor-pointer"
			>
				{course.sections.map((sec) => (
					<option key={sec.section_name} value={sec.section_name}>
						Section {sec.section_name}
					</option>
				))}
			</select>
			<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
		</div>
	</div>
);

/**
 * Visual card displaying the day, time, and room for a scheduled class.
 */
export const ScheduleCard = ({ item }) => (
	<div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 transition-all hover:border-violet-500/30 dark:hover:border-violet-500">
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<span className="px-3 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-[10px] font-black uppercase tracking-widest border border-violet-100 dark:border-violet-800">
					{item.day}
				</span>
				<div className="flex flex-col items-end text-gray-900 dark:text-gray-100">
					<span className="text-sm font-bold">
						{item.startTime} - {item.endTime}
					</span>
					<span className="text-[11px] font-base tracking-wide text-gray-500">
						Room {item.roomNumber}, {item.buildingName}
					</span>
				</div>
			</div>
		</div>
	</div>
);

/**
 * Row item for the attendance history timeline.
 */
export const AttendanceTimelineCard = ({ record }) => (
	<div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700 hover:border-violet-500/30 dark:hover:border-violet-500 transition-all">
		<div className="flex items-center gap-3">
			<time className="text-sm font-bold text-gray-700 dark:text-gray-300">
				{record.isMonthly
					? record.date
					: new Date(record.date).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
			</time>
			{!record.isMonthly && (
				<span className="px-3 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-[10px] font-black uppercase tracking-widest border border-violet-100 dark:border-violet-800">
					{new Date(record.date).toLocaleDateString("en-US", {
						weekday: "long",
					})}
				</span>
			)}
		</div>
		<div className="flex items-center gap-4">
			<div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden hidden sm:block">
				<div
					className="h-full bg-violet-500 transition-all duration-500"
					style={{ width: `${record.attendance_percentage}%` }}
				/>
			</div>
			<span className="w-10 text-sm font-black text-violet-600 dark:text-violet-400">
				{Math.round(record.attendance_percentage)}%
			</span>
		</div>
	</div>
);

/**
 * Card displaying grading status and completion rates for assignments or projects.
 */
export const GradingStatsCard = ({ title, data, icon: Icon }) => {
	const ongoingRate = Math.min((data.ongoing / data.total_count) * 100, 100);
	const completedRate = Math.min(
		(data.completed / data.total_count) * 100,
		100,
	);

	const getStatusStyles = (status) => {
		switch (status) {
			case "Completed":
				return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
			case "Pending":
				return "bg-amber-100 dark:bg-amber-100/10 text-amber-700 dark:text-amber-300";
			case "Overdue":
				return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
			default:
				return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
		}
	};

	return (
		<div className="group bg-gray-50/50 dark:bg-gray-800/50 p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col h-full hover:border-violet-500/30 dark:hover:border-violet-500 transition-all ring-1 ring-transparent hover:ring-violet-500/10">
			<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
				<div className="flex items-center gap-3">
					<div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 shrink-0">
						<Icon className="size-5 sm:size-6" />
					</div>
					<div className="flex flex-col gap-2">
						<h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors line-clamp-1">
							{data.total_count} {title}
						</h4>
						<span
							className={`sm:hidden text-center px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-wider whitespace-nowrap opacity-80 ${getStatusStyles(data.grading_status)}`}
						>
							Grading {data.grading_status}
						</span>
					</div>
				</div>
				<span
					className={`hidden sm:block text-center px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-wider whitespace-nowrap opacity-80 ${getStatusStyles(data.grading_status)}`}
				>
					Grading {data.grading_status}
				</span>
			</div>

			<div className="mt-auto space-y-3">
				<div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
					<div
						className="h-full bg-violet-500 transition-all duration-700 ease-out"
						style={{ width: `${completedRate}%` }}
					/>
					<div
						className="h-full bg-amber-500 transition-all duration-700 ease-out"
						style={{ width: `${ongoingRate}%` }}
					/>
				</div>

				<div className="flex gap-2 flex-row items-center justify-between">
					<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
						Status
					</span>
					<div className="flex flex-wrap gap-x-4 gap-y-2">
						<div className="flex items-center gap-1.5">
							<div className="size-2 rounded-full bg-violet-500" />
							<span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase">
								{data.completed}{" "}
								<span className="ml-0.5 font-normal">
									Completed
								</span>
							</span>
						</div>
						<div className="flex items-center gap-1.5">
							<div className="size-2 rounded-full bg-amber-500" />
							<span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase">
								{data.ongoing}{" "}
								<span className="ml-0.5 font-normal">
									Ongoing
								</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * Card displaying faculty reflections for a specific class session.
 */
export const ReflectionCard = ({ reflection }) => (
	<div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:border-violet-500/30 dark:hover:border-violet-500 transition-all space-y-4">
		<div className="flex items-center justify-between gap-3 border-b border-gray-200/50 dark:border-gray-700/50 pb-3">
			<time className="text-sm font-bold text-gray-900 dark:text-white">
				{new Date(reflection.date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})}
			</time>

			<span className="px-3 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-[10px] font-black uppercase tracking-widest border border-violet-100 dark:border-violet-800">
				{new Date(reflection.date).toLocaleDateString("en-US", {
					weekday: "long",
				})}
			</span>
		</div>

		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-1.5">
				<h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
					What was taught
				</h5>
				<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
					{reflection.whatWasTaught}
				</p>
			</div>

			{reflection.needsImprovement && (
				<div className="space-y-1.5">
					<h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
						Needs Improvement
					</h5>
					<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
						{reflection.needsImprovement}
					</p>
				</div>
			)}
		</div>

		{(reflection.topicsCarriedForward || reflection.personalNotes) && (
			<div className="flex flex-col gap-3">
				{reflection.topicsCarriedForward && (
					<div className="flex items-start gap-2 text-[11px] font-bold text-violet-500 bg-violet-50/50 dark:bg-violet-500/10 w-fit px-2 py-1 rounded-md">
						<ArrowRight className="size-3 mt-0.5" />
						<span>Next: {reflection.topicsCarriedForward}</span>
					</div>
				)}
			</div>
		)}
	</div>
);
