// src/pages/Department/DepartmentFaculty/components/FacultyDetailsComponents.jsx

import React from "react";
import {
	Clock,
	Star,
	Calendar,
	BookOpen,
	Presentation,
	Quote,
	Tag,
	Microscope,
} from "lucide-react";

const formatDate = (dateStr) => {
	return new Date(dateStr).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

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
 * Card for displaying research projects or publications.
 */
export const ResearchItemCard = ({ item, type }) => (
	<div className="group p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-900/50 shadow-sm hover:shadow-md hover:border-violet-200 dark:hover:border-violet-900/50 transition-all duration-300">
		<div className="flex items-start gap-4">
			<div className="hidden sm:flex p-2 rounded-lg bg-violet-100 dark:bg-violet-800/50 text-violet-500 transition-colors">
				{type === "project" ? (
					<Microscope className="size-5" />
				) : (
					<BookOpen className="size-5" />
				)}
			</div>
			<div className="flex flex-col items-start space-y-1">
					<span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[9px] font-black uppercase tracking-wider">
						<Tag className="size-3" />
						{item.category || "General"}
					</span>
					<h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight pt-2">
						{item.title}
					</h4>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
					{item.abstract}
				</p>
			</div>
		</div>
	</div>
);

/**
 * Card for displaying conference participation records.
 */
export const ConferenceCard = ({ conference }) => (
	<div className="relative overflow-hidden p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-900/50 shadow-sm hover:shadow-md hover:border-violet-200 dark:hover:border-violet-900/50 transition-all">
		<div className="flex items-start gap-4">
			<div className="hidden sm:flex p-2 rounded-lg bg-violet-100 dark:bg-violet-800/50 text-violet-500 transition-colors">
				<Presentation className="size-5" />
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex flex-col md:flex-row md:justify-between items-center gap-1 mb-3">
					<h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">
						{conference.conferenceName}
					</h4>
					<div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
						<Calendar className="size-3" />
						<span className="text-[10px] font-bold uppercase tracking-wide">
							{formatDate(conference.date)}
						</span>
					</div>
				</div>
				<div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
					<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
						"{conference.experience}"
					</p>
				</div>
			</div>
		</div>
	</div>
);

/**
 * Section for course allocations that handles mapping individual courses.
 */
export const CourseScheduleSection = ({ courses }) => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{courses.map((course, idx) => (
				<div
					key={idx}
					className="space-y-6 group p-6 bg-gray-50/20 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:border-violet-500/30 dark:hover:border-violet-500"
				>
					<div className="space-y-3">
						<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
							{course.courseName}
						</h3>

						<div className="flex items-center gap-2">
							<span className="px-3 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-[10px] font-bold uppercase tracking-wider border border-violet-100 dark:border-violet-800">
								{course.courseCode}
							</span>
							<span className="px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
								Section {course.section}
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
							Schedule
						</p>
						<div className="flex flex-wrap gap-2">
							{course.schedule.map((slot, i) => (
								<div
									key={i}
									className="flex flex-col p-3 min-w-[100px] bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
								>
									<span className="text-[9px] font-black text-violet-600 dark:text-violet-400 uppercase">
										{slot.day}
									</span>
									<span className="text-xs font-medium text-gray-600 dark:text-gray-300">
										{slot.startTime} - {slot.endTime}
									</span>
								</div>
							))}
						</div>
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
	<div className="space-y-12">
		{schedule.map((group, idx) => (
			<div key={idx} className="relative">
				<div className="sticky top-0 z-10 flex items-center gap-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md py-2 mb-6">
					<h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
						{group.day}
					</h2>
					<div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-800" />
				</div>

				<div className="ml-5 border-l-2 border-dashed border-gray-200 dark:border-gray-800 pl-8 space-y-6">
					{group.classes.map((cls, clsIdx) => (
						<div
							key={clsIdx}
							className="relative group flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-5 bg-gray-50/20 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all hover:border-violet-500/30 dark:hover:border-violet-500"
						>
							<div className="absolute -left-[41px] top-1/2 -translate-y-1/2 size-4 rounded-full border-4 border-white dark:border-gray-950 bg-gray-300 dark:bg-gray-700 group-hover:bg-violet-500 transition-colors" />

							<div className="space-y-2">
								<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
									{cls.courseName}
								</h3>

								<div className="flex items-center gap-2">
									<span className="px-3 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-[10px] font-bold uppercase tracking-wider border border-violet-100 dark:border-violet-800">
										{cls.courseCode}
									</span>
									<span className="px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
										Section {cls.section}
									</span>
								</div>
							</div>

							<div className="flex items-center gap-2 shrink-0 py-2 px-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-100 dark:border-violet-800/50">
								<Clock className="size-3 text-violet-600 dark:text-violet-400" />
								<span className="text-xs font-bold text-violet-700 dark:text-violet-300">
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
	<div className="relative p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-900/50 shadow-sm hover:shadow-md hover:border-violet-200 dark:hover:border-violet-900/50 transition-all">
		<Quote className="absolute top-4 right-4 size-8 text-gray-100 dark:text-gray-800 -z-0" />

		<div className="relative z-10">
			<div className="flex flex-wrap justify-between items-center gap-3 mb-3">
				<div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
					{[...Array(5)].map((_, i) => (
						<Star
							key={i}
							className={`size-3 ${i < feedback.rating ? "fill-amber-500 text-amber-500" : "text-gray-200 dark:text-gray-700"}`}
						/>
					))}
					<span className="ml-1 text-[10px] font-black text-amber-700 dark:text-amber-500">
						{feedback.rating.toFixed(1)}
					</span>
				</div>
				<div className="flex items-center gap-1.5 text-gray-400">
					<Calendar className="size-3" />
					<span className="text-[10px] font-bold uppercase tracking-tighter">
						{formatDate(feedback.date)}
					</span>
				</div>
			</div>

			<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">
				"{feedback.comment}"
			</p>
		</div>
	</div>
);
