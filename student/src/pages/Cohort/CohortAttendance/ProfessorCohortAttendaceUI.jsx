// src/pages/Cohort/CohortAttendance/ProfessorCohortAttendaceUI.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Search,
	ArrowLeft,
	Coffee,
	SearchX,
	Clock3,
	FileQuestion,
	FileText,
	Download,
	ChevronRight,
	Edit3,
	AlertCircle,
	RefreshCw,
	CalendarX2,
	ChevronDown,
} from "lucide-react";
import MiniCalendar from "../../../components/common/MiniCalendar";
import AttendanceReportTable from "./components/AttendanceReportTable";
import AttendanceLogTable from "./components/AttendanceLogTable";

const ProfessorCohortAttendanceUI = ({
	cohort,
	attendanceData,
	selectedDate,
	setSelectedDate,
	reportData,
	dateRange,
	uiConfig,
	draftData,
}) => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [matrixSearch, setMatrixSearch] = useState("");

	const { students, logs } = attendanceData;
	const {
		loading,
		showReport,
		setShowReport,
		statusMessage,
		customMarkers,
		onExport,
		isDraft,
		selectedSection,
		onSectionChange,
	} = uiConfig;

	const getPresentIds = () => {
		if (isDraft) return draftData?.presentIds || [];

		if (selectedSection === "All") {
			return Object.values(logs).reduce((acc, sectionLog) => {
				const dateLog = sectionLog[selectedDate] || [];
				return [...acc, ...dateLog];
			}, []);
		}

		return logs[selectedSection]?.[selectedDate] || [];
	};

	const presentStudentIds = getPresentIds();

	const filteredStudents = students.filter((s) => {
		const matchesSearch =
			s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesSearch && s.section === selectedSection;
	});

	const filteredReportData = reportData
		.filter(
			(s) =>
				s.name.toLowerCase().includes(matrixSearch.toLowerCase()) ||
				s.rollNumber.toLowerCase().includes(matrixSearch.toLowerCase()),
		)
		.sort((a, b) => a.name.localeCompare(b.name));

	const stats = {
		total: filteredStudents.length,
		present: filteredStudents.filter((s) =>
			presentStudentIds.includes(s.id),
		).length,
		absent:
			filteredStudents.length -
			filteredStudents.filter((s) => presentStudentIds.includes(s.id))
				.length,
	};

	const getStatusConfig = () => {
		if (statusMessage?.includes("Sunday")) {
			return {
				icon: <Coffee className="w-10 h-10 text-amber-500" />,
				title: "Weekly Leave",
				bgColor: "bg-amber-50 dark:bg-amber-900/20",
				showAction: false,
			};
		}
		if (statusMessage?.includes("No classes are scheduled")) {
			return {
				icon: <CalendarX2 className="w-10 h-10 text-slate-400" />,
				title: "No Class Scheduled",
				bgColor: "bg-slate-50 dark:bg-slate-900/20",
				showAction: false,
			};
		}
		if (statusMessage?.includes("not been marked for today")) {
			return {
				icon: <Clock3 className="w-10 h-10 text-blue-500" />,
				title: "Pending Entry",
				bgColor: "bg-blue-50 dark:bg-blue-900/20",
				showAction: true,
				buttonText: "Mark Attendance",
			};
		}
		if (statusMessage?.includes("No attendance log")) {
			return {
				icon: <SearchX className="w-10 h-10 text-red-400" />,
				title: "No Log Found",
				bgColor: "bg-red-50 dark:bg-red-900/20",
				showAction: false,
			};
		}
		return {
			icon: <FileQuestion className="w-10 h-10 text-blue-500" />,
			title: "Status Update",
			bgColor: "bg-blue-50 dark:bg-blue-900/20",
			showAction: false,
		};
	};

	const statusConfig = getStatusConfig();

	if (loading)
		return (
			<div className="flex flex-col items-center justify-center py-20 text-gray-400">
				<RefreshCw className="size-12 animate-spin mb-4 text-blue-500" />
				<p className="font-bold text-gray-900 dark:text-white">
					Loading Cohort Attendance
				</p>
				<p className="text-sm">
					Please wait while we sync your cohort attendance...
				</p>
			</div>
		);

	return (
		<div className="font-sans min-h-screen">
			<main className="px-4 max-w-7xl mx-auto w-full">
				<div className="flex flex-col lg:flex-row gap-8">
					{!showReport && (
						<aside className="w-full lg:w-80 flex-shrink-0">
							<div className="sticky top-8 space-y-6">
								<div className="space-y-2">
									<label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Viewing Section
									</label>
									<div className="relative">
										<select
											value={selectedSection}
											onChange={(e) =>
												onSectionChange(e.target.value)
											}
											className="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200 appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer"
										>
											{cohort?.sections?.map((sec) => (
												<option
													key={sec.section_name}
													value={sec.section_name}
												>
													Section {sec.section_name} (
													{sec.course_code})
												</option>
											))}
										</select>
										<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
									</div>
								</div>
								<MiniCalendar
									onDateClick={setSelectedDate}
									customMarkers={customMarkers}
									selectedDate={selectedDate}
									startDate={cohort?.start_date}
									endDate={cohort?.end_date}
									disbaleFuture={true}
								/>

								<button
									onClick={() => setShowReport(true)}
									className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-black uppercase shadow-md"
								>
									<FileText className="size-4" /> Attendance
									Report
								</button>
							</div>
						</aside>
					)}

					<div className="flex-grow overflow-hidden">
						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
							{showReport ? (
								<>
									<div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
										<div className="flex items-center gap-4">
											<button
												onClick={() =>
													setShowReport(false)
												}
												className="p-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-full transition-colors border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50"
											>
												<ArrowLeft className="size-5" />
											</button>
											<div>
												<h3 className="text-xl font-bold text-gray-900 dark:text-white">
													Attendance Report
												</h3>
												<p className="text-xs text-gray-500 mt-1">
													P: Present | A: Absent | -:
													No Log
												</p>
											</div>
										</div>
										<div className="flex flex-col sm:flex-row items-center gap-3">
											<div className="relative w-full sm:w-80">
												<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
												<input
													type="text"
													placeholder="Search students..."
													value={matrixSearch}
													onChange={(e) =>
														setMatrixSearch(
															e.target.value,
														)
													}
													className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-full outline-none"
												/>
											</div>
											<button
												onClick={onExport}
												className="flex items-center gap-2 py-2 px-4 bg-emerald-600 text-white rounded-lg font-bold text-sm"
											>
												<Download className="size-4" />{" "}
												Export CSV
											</button>
										</div>
									</div>
									<AttendanceReportTable
										filteredReportData={filteredReportData}
										dateRange={dateRange}
									/>
								</>
							) : statusMessage && !isDraft ? (
								<div className="flex-grow flex flex-col items-center justify-center text-center gap-6 p-12">
									<div
										className={`p-6 ${statusConfig.bgColor} rounded-full`}
									>
										{statusConfig.icon}
									</div>
									<div className="space-y-2">
										<h3 className="text-xl font-black uppercase text-gray-900 dark:text-white mb-2">
											{statusConfig.title}
										</h3>
										<p className="text-base text-gray-500">
											{statusMessage}
										</p>
									</div>
									{statusConfig.showAction && (
										<button
											onClick={() =>
												navigate(
													`/attendance-management/${cohort?.id}`,
												)
											}
											className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold"
										>
											{statusConfig.buttonText}{" "}
											<ChevronRight className="w-4 h-4" />
										</button>
									)}
								</div>
							) : (
								<>
									{isDraft && (
										<div className="bg-orange-50 dark:bg-orange-900/10 border-b border-orange-100 dark:border-orange-800/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
											<div className="flex items-center gap-3">
												<div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
													<AlertCircle className="size-5 text-orange-600" />
												</div>
												<div>
													<p className="text-sm font-bold text-orange-900 dark:text-orange-100">
														Unsubmitted Attendance
														Draft
													</p>
													<p className="text-xs text-orange-700 dark:text-orange-300/80">
														This log is saved
														locally but hasn't been
														submitted.
													</p>
												</div>
											</div>
											<button
												onClick={() =>
													navigate(
														`/attendance-management/${cohort?.id}`,
													)
												}
												className="w-full md:w-auto flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase rounded-lg transition-colors"
											>
												<Edit3 className="size-4" />{" "}
												Continue Marking
											</button>
										</div>
									)}

									<div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
										<div>
											<h3 className="text-lg font-bold text-gray-900 dark:text-white">
												Attendance Log
											</h3>
											<span className="text-sm font-bold text-blue-500 uppercase">
												{new Date(
													selectedDate,
												).toLocaleDateString("en-US", {
													month: "long",
													day: "numeric",
													year: "numeric",
												})}
											</span>
										</div>
										<div className="flex items-center gap-3 w-full sm:w-auto">
											<div className="relative w-full sm:w-60">
												<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
												<input
													type="text"
													placeholder="Search name or roll number..."
													value={searchQuery}
													onChange={(e) =>
														setSearchQuery(
															e.target.value,
														)
													}
													className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-full outline-none"
												/>
											</div>
										</div>
									</div>

									<AttendanceLogTable
										stats={stats}
										filteredStudents={filteredStudents}
										presentStudentIds={presentStudentIds}
									/>
								</>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ProfessorCohortAttendanceUI;
