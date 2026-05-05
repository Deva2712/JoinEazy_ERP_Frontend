// src/pages/Department/DepartmentCourses/CourseDetailsView.jsx

import React, { useMemo } from "react";
import {
	ArrowLeft,
	Calendar,
	History,
	User,
	FileText,
	Layers,
	BookOpen,
	ClipboardEdit,
	Notebook,
} from "lucide-react";
import { useDepartment } from "../../../context/DepartmentContext";

import CollapsibleSection from "../../../components/common/CollapsibleSection";
import CourseDetailsSidebar from "./components/CourseDetailsSidebar";
import {
	SectionSelector,
	ScheduleCard,
	AttendanceTimelineCard,
	GradingStatsCard,
	ReflectionCard,
} from "./components/CourseDetailsComponents";
import DocumentCard from "./components/DocumentCard";

const CourseDetailsView = ({ course, onBack }) => {
	const { state, actions } = useDepartment();
	const { activeSectionName, viewType, attendanceMonth, reflectionMonth } =
		state.viewFilters;
	const { updateDocumentStatus } = actions;

	if (!course) return null;

	/**
	 * Logic to determine which section's data to display based on global state.
	 */
	const activeSection = useMemo(() => {
		return (
			course.sections.find((s) => s.section_name === activeSectionName) ||
			course.sections[0]
		);
	}, [course.sections, activeSectionName]);

	/**
	 * Processes attendance history for either daily timeline or monthly averages.
	 */
	const filteredAttendance = useMemo(() => {
		const history = activeSection.attendance_history || [];

		if (viewType === "monthly") {
			const monthlyData = history.reduce((acc, record) => {
				const date = new Date(record.date);
				const monthKey = date.toLocaleString("en-US", {
					month: "long",
					year: "numeric",
				});

				if (!acc[monthKey]) {
					acc[monthKey] = {
						month: monthKey,
						totalPerc: 0,
						count: 0,
						rawDate: date,
					};
				}
				acc[monthKey].totalPerc += record.attendance_percentage;
				acc[monthKey].count += 1;
				return acc;
			}, {});

			return Object.values(monthlyData)
				.map((m) => ({
					date: m.month,
					attendance_percentage: m.totalPerc / m.count,
					isMonthly: true,
					rawDate: m.rawDate,
				}))
				.sort((a, b) => b.rawDate - a.rawDate);
		}

		if (attendanceMonth !== "all") {
			return history.filter((record) => {
				const month = new Date(record.date).toLocaleString("en-US", {
					month: "long",
				});
				return month === attendanceMonth;
			});
		}

		return history;
	}, [activeSection.attendance_history, viewType, attendanceMonth]);

	/**
	 * Filters reflections based on selected month or shows all if "all" is selected.
	 */
	const filteredReflections = useMemo(() => {
		const reflections = activeSection.reflections || [];
		if (reflectionMonth === "all") return reflections;

		return reflections.filter((ref) => {
			const month = new Date(ref.date).toLocaleString("en-US", {
				month: "long",
			});
			return month === reflectionMonth;
		});
	}, [activeSection.reflections, reflectionMonth]);

	const availableMonths = useMemo(() => {
		const months = (activeSection.attendance_history || []).map((r) =>
			new Date(r.date).toLocaleString("en-US", { month: "long" }),
		);
		return [...new Set(months)];
	}, [activeSection.attendance_history]);

	const reflectionMonths = useMemo(() => {
		const months = (activeSection.reflections || []).map((ref) =>
			new Date(ref.date).toLocaleString("en-US", { month: "long" }),
		);
		return [...new Set(months)];
	}, [activeSection.reflections]);

	return (
		<div className="relative pb-20 lg:pb-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
			{/* Header Navigation Section */}
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

				<SectionSelector
					course={course}
					activeSectionName={activeSectionName}
					onSectionChange={actions.setActiveSection}
					className="lg:hidden"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<div className="lg:col-span-3 space-y-6">
					{/* Course Identity Banner */}
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 md:p-8">
						<div className="flex flex-col md:flex-row-reverse justify-between items-start gap-3">
							<div className="flex flex-wrap flex-row md:flex-row-reverse items-center gap-3">
								<span className="px-3 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-100 dark:border-violet-800">
									{course.course_code}
								</span>
								<span className="px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
									Semester {course.semester}
								</span>
							</div>

							<div className="space-y-2">
								<h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
									{course.cohort_name}
								</h3>
								<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
									<User className="size-4" />
									Handled by:{" "}
									<span className="font-bold text-gray-900 dark:text-white">
										{activeSection.professor}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="lg:hidden">
						<CourseDetailsSidebar
							course={course}
							activeSection={activeSection}
						/>
					</div>

					{/* Course Documents Section */}
					<CollapsibleSection
						title="Documents"
						icon={<FileText className="size-4 text-violet-500" />}
					>
						<div className="flex flex-col gap-4">
							{course.course_documents?.length > 0 ? (
								course.course_documents.map((doc, idx) => (
									<DocumentCard
										key={idx}
										document={doc}
										onUpdateStatus={(
											document,
											status,
											comments,
										) =>
											updateDocumentStatus({
												courseId: course.id,
												type: document.type,
												status: status,
												comments: comments,
											})
										}
									/>
								))
							) : (
								<div className="col-span-full text-center py-10 text-gray-500 text-sm italic">
									No institutional documents uploaded for this
									course.
								</div>
							)}
						</div>
					</CollapsibleSection>

					{/* Weekly Schedule Section */}
					<CollapsibleSection
						title="Weekly Schedule"
						icon={<Calendar className="size-4 text-violet-500" />}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{activeSection.schedule.map((item, idx) => (
								<ScheduleCard key={idx} item={item} />
							))}
						</div>
					</CollapsibleSection>

					{/* Attendance History Section */}
					<CollapsibleSection
						title="Attendance History"
						icon={<History className="size-4 text-violet-500" />}
					>
						<div className="space-y-6">
							{/* Attendance Controls */}
							<div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
								<div className="flex items-center gap-2">
									<label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										View Mode:
									</label>
									<select
										value={viewType}
										onChange={(e) =>
											actions.setViewFilters({
												viewType: e.target.value,
												attendanceMonth: "all",
											})
										}
										className="text-xs font-bold bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
									>
										<option value="daily">Daily</option>
										<option value="monthly">Monthly</option>
									</select>
								</div>

								{viewType === "daily" && (
									<div className="flex items-center gap-2">
										<label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
											Filter Month:
										</label>
										<select
											value={attendanceMonth}
											onChange={(e) =>
												actions.setViewFilters({
													attendanceMonth:
														e.target.value,
												})
											}
											className="text-xs font-bold bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
										>
											<option value="all">
												All Months
											</option>
											{availableMonths.map((m) => (
												<option key={m} value={m}>
													{m}
												</option>
											))}
										</select>
									</div>
								)}
							</div>

							<div className="relative space-y-4">
								{filteredAttendance.length > 0 ? (
									filteredAttendance.map((record, idx) => (
										<AttendanceTimelineCard
											key={idx}
											record={record}
										/>
									))
								) : (
									<div className="text-center py-10 text-gray-500 text-sm italic">
										No records found for the selected
										criteria.
									</div>
								)}
							</div>
						</div>
					</CollapsibleSection>

					{/* Grading Status Section */}
					<CollapsibleSection
						title="Grading Status"
						icon={
							<ClipboardEdit className="size-4 text-violet-500" />
						}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<GradingStatsCard
								title="Assignments"
								data={activeSection.assignments}
								icon={Notebook}
							/>
							<GradingStatsCard
								title="Projects"
								data={activeSection.projects}
								icon={Layers}
							/>
						</div>
					</CollapsibleSection>

					{/* Reflections Section */}
					<CollapsibleSection
						title="Reflections"
						icon={<BookOpen className="size-4 text-violet-500" />}
					>
						<div className="flex items-center gap-2 flex-wrap justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
							<label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
								Filter Month:
							</label>
							<select
								value={reflectionMonth}
								onChange={(e) =>
									actions.setViewFilters({
										reflectionMonth: e.target.value,
									})
								}
								className="text-xs font-bold bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
									>
								<option value="all">All Months</option>
								{reflectionMonths.map((m) => (
									<option key={m} value={m}>
										{m}
									</option>
								))}
							</select>
						</div>
						<div className="space-y-4">
							{filteredReflections.length > 0 ? (
								filteredReflections.map((ref) => (
									<ReflectionCard
										key={ref.id}
										reflection={ref}
									/>
								))
							) : (
								<div className="text-center py-10 text-gray-500 text-sm italic">
									No reflections found for the selected month.
								</div>
							)}
						</div>
					</CollapsibleSection>
				</div>

				{/* Desktop Sticky Sidebar */}
				<aside className="hidden lg:block lg:sticky lg:top-8 space-y-6">
					<SectionSelector
						course={course}
						activeSectionName={activeSectionName}
						onSectionChange={actions.setActiveSection}
					/>
					<CourseDetailsSidebar
						course={course}
						activeSection={activeSection}
					/>
				</aside>
			</div>
		</div>
	);
};

export default CourseDetailsView;
