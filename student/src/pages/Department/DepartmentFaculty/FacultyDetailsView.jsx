// src/pages/Department/DepartmentFaculty/FacultyDetailsView.jsx

import React, { useMemo, useState } from "react";
import {
	ArrowLeft,
	BookOpen,
	User,
	FileText,
	Presentation,
	Award,
	Mail,
	MessageSquare,
	Microscope,
} from "lucide-react";
import { useDepartment } from "../../../context/DepartmentContext";
import CollapsibleSection from "../../../components/common/CollapsibleSection";
import {
	AcademicMetricsCard,
	CourseScheduleSection,
	WeeklyScheduleSection,
	StudentFeedbackCard,
} from "./components/FacultyDetailsComponents";
import FacultyDetailsSidebar from "./components/FacultyDetailsSidebar";

const FacultyDetailsView = ({ faculty, onBack }) => {
	const { getFacultyMetrics, getFacultySchedule } = useDepartment();
	const [viewMode, setViewMode] = useState("course");

	if (!faculty) return null;

	const { facultyAllocations, formattedSchedule } = useMemo(
		() => getFacultySchedule(faculty.id),
		[faculty.id, getFacultySchedule],
	);

	const metrics = useMemo(
		() => getFacultyMetrics(faculty.id),
		[faculty.id, getFacultyMetrics],
	);

	/**
	 * Sorts feedback by date descending and takes the top 5.
	 */
	const latestFeedback = useMemo(() => {
		if (!metrics?.comments) return [];
		return [...metrics.comments]
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.slice(0, 5);
	}, [metrics]);

	return (
		<div className="relative pb-20 lg:pb-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
			{/* Back Button */}
			<div className="flex items-start justify-between pb-4">
				<button
					onClick={onBack}
					className="inline-flex items-center gap-2.5 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 font-bold transition-all group rounded-full"
				>
					<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-violet-200 dark:group-hover:border-violet-800 group-hover:shadow-sm transition-all">
						<ArrowLeft className="size-4" />
					</div>
					<span className="text-xs uppercase tracking-widest">
						Return
					</span>
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<div className="lg:col-span-3 space-y-6">
					{/* Faculty Header */}
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 md:p-6 flex flex-col md:flex-row items-center md:justify-between">
						<div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
							<div className="size-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/10 text-violet-600 dark:text-violet-400">
								<User className="size-10" />
							</div>
							<div className="flex flex-col items-center md:items-start text-center md:text-left">
								<h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
									{faculty.name}
								</h3>
								<p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400 mt-1">
									{faculty.designation}
								</p>
							</div>
						</div>
						<div className="flex flex-col items-center md:items-end gap-2.5 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700">
							<div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
								<Mail className="size-4 text-violet-600" />
								<span className="text-sm font-semibold">
									{faculty.email}
								</span>
							</div>
						</div>
					</div>

					{/* Mobile Sidebar (Visible only on small screens) */}
					<div className="lg:hidden">
						<FacultyDetailsSidebar faculty={faculty} />
					</div>

					{/* Academic Metrics Section */}
					<CollapsibleSection
						title="Academic Metrics"
						icon={<Award className="size-4 text-violet-500" />}
					>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<AcademicMetricsCard
								label="Papers Published"
								value={faculty.performance?.researchPapers || 0}
								icon={FileText}
							/>
							<AcademicMetricsCard
								label="Projects Guided"
								value={faculty.performance?.projectsGuided || 0}
								icon={Microscope}
							/>
							<AcademicMetricsCard
								label="Conferences Attended"
								value={
									faculty.performance?.conferencesAttended ||
									0
								}
								icon={Presentation}
							/>
						</div>
					</CollapsibleSection>

					{/* Teaching Load Section */}
					<CollapsibleSection
						title="Teaching Load"
						icon={<BookOpen className="size-4 text-violet-500" />}
					>
						<div className="space-y-6">
							<div className="flex flex-wrap items-center justify-between gap-4">
								<div className="flex items-center gap-2">
									<p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
										Hours Per Week:
									</p>
									<p className="text-sm font-black text-gray-900 dark:text-white">
										{faculty.currentLoadHours}
									</p>
								</div>

								<div className="flex items-center gap-2">
									<label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Sort By:
									</label>
									<select
										value={viewMode}
										onChange={(e) =>
											setViewMode(e.target.value)
										}
										className="text-xs font-bold bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
									>
										<option value="course">Course</option>
										<option value="schedule">
											Schedule
										</option>
									</select>
								</div>
							</div>

							{/* Display courses or schedule */}
							{facultyAllocations.length > 0 ? (
								viewMode === "course" ? (
									<CourseScheduleSection
										courses={facultyAllocations}
									/>
								) : (
									<WeeklyScheduleSection
										schedule={formattedSchedule}
									/>
								)
							) : (
								<div className="text-center py-10 text-gray-500 text-sm italic">
									No active course allocations found.
								</div>
							)}
						</div>
					</CollapsibleSection>

					{/* Student Feedback Section */}
					<CollapsibleSection
						title="Student Feedback"
						icon={
							<MessageSquare className="size-4 text-violet-500" />
						}
					>
						<div className="space-y-4">
							{latestFeedback.length > 0 ? (
								latestFeedback.map((fb) => (
									<StudentFeedbackCard
										key={fb.id}
										feedback={fb}
									/>
								))
							) : (
								<div className="text-center py-6 text-gray-500 text-sm italic">
									No comments available.
								</div>
							)}
						</div>
					</CollapsibleSection>
				</div>

				{/* Desktop Sidebar */}
				<aside className="hidden lg:block lg:sticky lg:top-8 space-y-6">
					<FacultyDetailsSidebar faculty={faculty} />
				</aside>
			</div>
		</div>
	);
};

export default FacultyDetailsView;
