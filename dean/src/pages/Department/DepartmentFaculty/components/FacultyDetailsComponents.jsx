// src/pages/Department/DepartmentFaculty/components/FacultyDetailsComponents.jsx

import React from "react";
import { Clock, Star, Calendar } from "lucide-react";

/**
 * Visual card displaying faculty performance metrics.
 */
export const AcademicMetricsCard = ({ label, value, icon: Icon }) => (
	<div className="group flex items-center gap-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 transition-all hover:border-violet-500/30 dark:hover:border-violet-500">
		<div className="flex items-start justify-between">
			<div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 shrink-0">
				<Icon className="size-5 sm:size-6" />
			</div>
		</div>

		<div>
			<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
				{label}
			</p>
			<span className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-50">
				{value}
			</span>
		</div>
	</div>
);

/**
 * Section for course allocations that handles mapping individual courses.
 */
export const CourseScheduleSection = ({ courses }) => {
	return (
		<div className="flex flex-col gap-6">
			{courses.map((course, idx) => (
				<div
					key={idx}
					className="group p-5 sm:p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md"
				>
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
						<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
							{course.courseName}
						</h3>
						<div className="flex items-center sm:flex-row-reverse gap-2">
							<span className="px-3 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-100 dark:border-violet-800 whitespace-nowrap">
								{course.courseCode}
							</span>
							<span className="px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
								Section {course.section}
							</span>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{course.schedule.map((slot, i) => (
							<div
								key={i}
								className="flex items-start gap-3 pl-4 border-l-2 border-gray-100 dark:border-gray-700"
							>
								<div className="flex flex-col">
									<span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-400">
										{slot.day}
									</span>
									<span className="text-xs sm:text-sm font-medium tracking-wide text-gray-600 dark:text-gray-300">
										{slot.startTime} - {slot.endTime}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

/**
 * Section for course allocations that handles mapping weekly schedules.
 */
export const WeeklyScheduleSection = ({ schedule }) => (
	<div className="space-y-8">
		{schedule.map((group, idx) => (
			<div key={idx} className="space-y-4">
				<div className="flex items-center gap-4">
					<h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
						{group.day}
					</h2>
					<div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
				</div>

				<div className="grid grid-cols-1 gap-4">
					{group.classes.map((cls, clsIdx) => (
						<div
							key={clsIdx}
							className="group flex flex-col md:flex-row md:items-center justify-between p-5 sm:p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md"
						>
							<div className="flex flex-col gap-3">
								<span className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-violet-600 transition-colors">
									{cls.courseName}
								</span>

								<div className="flex items-center gap-2">
									<span className="px-3 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-100 dark:border-violet-800">
										{cls.courseCode}
									</span>
									<span className="px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
										Section {cls.section}
									</span>
								</div>
							</div>

							<div className="flex items-center gap-2 mt-4 md:mt-0 pl-0 md:pl-4 md:border-l-2 border-gray-100 dark:border-gray-700">
								<div className="p-2 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-500 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 group-hover:text-violet-600 transition-colors">
									<Clock className="size-4" />
								</div>
								<span className="text-sm font-medium tracking-wide text-gray-600 dark:text-gray-300">
									{cls.startTime} - {cls.endTime}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		))}
	</div>
);

/**
 * Component for individual student feedback items.
 */
export const StudentFeedbackCard = ({ feedback }) => (
	<div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
		<div className="flex justify-between items-start mb-2">
			<div className="flex gap-1">
				{[...Array(5)].map((_, i) => (
					<Star
						key={i}
						className={`size-3 ${i < feedback.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"}`}
					/>
				))}
			</div>
			<span className="text-[10px] font-semibold text-gray-400 flex items-center gap-2">
				<Calendar className="size-3" />
				{new Date(feedback.date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})}
			</span>
		</div>
		<p className="text-sm text-gray-600 dark:text-gray-300 italic">
			"{feedback.comment}"
		</p>
	</div>
);
