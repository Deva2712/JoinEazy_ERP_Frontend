// src/pages/AttendanceMangement/AttendanceManagementUI.jsx

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	History,
	ArrowLeft,
	RefreshCw,
	LayoutDashboard,
	BookOpen,
	AlertTriangle,
} from "lucide-react";

import QRView from "./views/QRView";
import ProfessorLogsView from "./views/ProfessorLogsView";
import AttendanceMarkingView from "./views/AttendanceMarkingView";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import {
	SaveSuccessModal,
	QRSettingsModal,
	ConfirmSubmitModal,
} from "./components/AttendanceMarkingModals";
import AttendanceCourseCard from "./components/AttendanceCourseCard";
import LeaveDetailsModal from "./components/LeaveDetailsModal";

const AttendanceManagementUI = ({
	state,
	actions,
	filteredStudents,
	isCourseScheduledToday,
	isSectionScheduledOnDate,
	isConfirmModalOpen,
	setIsConfirmModalOpen,
	isSaveSuccessOpen,
	setIsSaveSuccessOpen,
	handleConfirmSave,
	onTabChange,
	activeTab,
}) => {
	const navigate = useNavigate();
	const [activeMonth, setActiveMonth] = useState(new Date());
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [selectedLeave, setSelectedLeave] = useState(null);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [state.viewMode]);

	const sortedFilteredLogs = useMemo(() => {
		return state.profLogs
			.filter((log) => {
				const logDate = new Date(log.date);
				return (
					logDate.getMonth() === activeMonth.getMonth() &&
					logDate.getFullYear() === activeMonth.getFullYear()
				);
			})
			.sort((a, b) => new Date(b.date) - new Date(a.date));
	}, [state.profLogs, activeMonth]);

	const allMarked = useMemo(() => {
		if (!filteredStudents.length) return false;
		return filteredStudents.every(
			(s) =>
				state.presentIds.includes(s.id) ||
				state.absentIds.includes(s.id),
		);
	}, [filteredStudents, state.presentIds, state.absentIds]);

	const getDeadlineString = () => {
		const d = new Date(state.selectedDate);
		d.setDate(d.getDate() + 6);
		return (
			d.toLocaleDateString("en-US", { month: "long", day: "numeric" }) +
			" at 11:59 PM"
		);
	};

	if (state.viewMode === "qr-view") {
		return (
			<QRView
				qrToken={state.qr.token}
				timeLeft={state.qr.timeLeft}
				onClose={() => {
					actions.resetQrSession();
					navigate(
						`/attendance-management/mark/${state.selectedCourse.id}`,
					);
				}}
			/>
		);
	}

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans transition-colors duration-300">
			<HeaderController />

			{/* Hero Section containing breadcrumbs and summary stats */}
			<div className="bg-gradient-to-br from-purple-700 via-purple-800 to-violet-900 dark:from-purple-900 dark:via-purple-950 dark:to-violet-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/dashboard")}
								className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
							>
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">
									Attendance Management
								</h1>
								<p className="text-purple-100 text-sm mt-0.5">
									Manage your personal and course attendance
									logs.
								</p>
							</div>
						</div>

						<div className="w-full md:w-auto pb-2 md:pb-0">
							<StatSummaryCard
								label="Active Courses"
								value={state.activeCourses.length.toString()}
								icon={BookOpen}
							/>
						</div>
					</div>

					{/* Navigation Tabs for switching between course overview and personal logs */}
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{[
							{
								key: "management",
								label: "Overview",
								icon: LayoutDashboard,
							},
							{
								key: "prof-attendance",
								label: "My Attendance",
								icon: History,
							},
						].map((tab) => {
							const Icon = tab.icon;
							const isActive =
								state.viewMode === tab.key ||
								activeTab === tab.key ||
								(tab.key === "management" &&
									activeTab === "overview");
							return (
								<button
									key={tab.key}
									onClick={() => onTabChange(tab.key)}
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										isActive
											? "bg-gray-50 dark:bg-[#0f1117] text-purple-700 dark:text-purple-400"
											: "text-white/70 hover:text-white hover:bg-white/10"
									}`}
								>
									<Icon className="w-4 h-4" />
									{tab.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<main className="px-4 py-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
				{state.error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{state.error}
						</p>
						<button
							onClick={actions.fetchData}
							className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" /> Try Again
						</button>
					</div>
				) : state.loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-purple-500" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Attendance Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your courses and logs...
						</p>
					</div>
				) : state.viewMode === "prof-attendance" ? (
					<ProfessorLogsView
						logs={sortedFilteredLogs}
						formatDate={(d) =>
							new Date(d).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
								timeZone: "UTC",
							})
						}
						activeMonth={activeMonth}
						onMonthChange={setActiveMonth}
						profLogs={state.profLogs}
						leaveApplications={state.leaveApplications}
						onSelectLeave={setSelectedLeave}
					/>
				) : state.selectedCourse ? (
					<AttendanceMarkingView
						state={state}
						actions={actions}
						filteredStudents={filteredStudents}
						isSectionScheduledOnDate={isSectionScheduledOnDate}
						setIsSettingsOpen={setIsSettingsOpen}
						allMarked={allMarked}
						setIsSaveSuccessOpen={setIsSaveSuccessOpen}
						setIsConfirmModalOpen={setIsConfirmModalOpen}
					/>
				) : (
					/* Main Course Selection Grid */
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
						{state.activeCourses.map((course) => (
							<AttendanceCourseCard
								key={course.id}
								course={course}
								scheduleData={state.schedules}
								onNavigateToLogs={(id) =>
									navigate(`/c/${id}/attendance`)
								}
								onSelectCourse={(c, advanceDate) => {
									if (c) {
										// Set the date first if we are marking in advance
										if (advanceDate) {
											actions.setSelectedDate(
												advanceDate,
											);
										} else {
											// Default back to today if a standard selection occurs
											actions.setSelectedDate(
												new Date().toLocaleDateString(
													"en-CA",
												),
											);
										}
										actions.setSelectedCourse(c);
										navigate(
											`/attendance-management/mark/${c.id}`,
										);
									} else {
										navigate(
											"/attendance-management/overview",
										);
									}
								}}
								isDisabled={!isCourseScheduledToday(course)}
							/>
						))}
					</div>
				)}
			</main>

			<SaveSuccessModal
				isOpen={isSaveSuccessOpen}
				onClose={() => setIsSaveSuccessOpen(false)}
				deadline={getDeadlineString()}
			/>

			<QRSettingsModal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				timeout={state.qr.qrTimeout}
				setTimeout={actions.setQrTimeout}
			/>

			<ConfirmSubmitModal
				isOpen={isConfirmModalOpen}
				onClose={() => setIsConfirmModalOpen(false)}
				studentCount={state.students.length}
				onConfirm={handleConfirmSave}
			/>

			<LeaveDetailsModal
				isOpen={!!selectedLeave}
				onClose={() => setSelectedLeave(null)}
				leave={selectedLeave}
			/>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default AttendanceManagementUI;
