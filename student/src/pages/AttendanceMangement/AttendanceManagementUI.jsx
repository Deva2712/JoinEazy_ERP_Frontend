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
} from "./components/AttendanceModals";
import AttendanceCourseCard from "./components/AttendanceCourseCard";

const AttendanceManagementUI = ({ data, view, actions }) => {
	const navigate = useNavigate();
	const [activeMonth, setActiveMonth] = useState(new Date());
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [view.viewMode]);

	const sortedFilteredLogs = useMemo(() => {
		return data.profLogs
			.filter((log) => {
				const logDate = new Date(log.date);
				return (
					logDate.getMonth() === activeMonth.getMonth() &&
					logDate.getFullYear() === activeMonth.getFullYear()
				);
			})
			.sort((a, b) => new Date(b.date) - new Date(a.date));
	}, [data.profLogs, activeMonth]);

	const allMarked = useMemo(() => {
		if (!data.students.length) return false;
		return data.students.every(
			(s) =>
				data.presentIds.includes(s.id) || data.absentIds.includes(s.id),
		);
	}, [data.students, data.presentIds, data.absentIds]);

	if (view.viewMode === "qr-view") {
		return (
			<QRView
				qrToken={data.qr.token}
				timeLeft={data.qr.timeLeft}
				onClose={actions.closeQRView}
			/>
		);
	}

	const formatDate = (dateString) =>
		new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	const getDeadlineString = () => {
		const d = new Date();
		d.setDate(d.getDate() + 1);
		return (
			d.toLocaleDateString("en-US", { month: "long", day: "numeric" }) +
			" at 11:59 PM"
		);
	};

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans transition-colors duration-300">
			<HeaderController />

			{/* Hero Section */}
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

						{/* Stat Cards */}
						<div className="w-full md:w-auto pb-2 md:pb-0">
							<StatSummaryCard
								label="Active Courses"
								value={data.courses.length.toString()}
								icon={BookOpen}
							/>
						</div>
					</div>

					{/* Navigation Tabs */}
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{[
							{
								key: "management",
								label: "Overview",
								icon: LayoutDashboard,
								action: actions.switchToManagement,
							},
							{
								key: "prof-attendance",
								label: "My Attendance",
								icon: History,
								action: actions.switchToLogs,
							},
						].map((tab) => {
							const Icon = tab.icon;
							const isActive = view.viewMode === tab.key;
							return (
								<button
									key={tab.key}
									onClick={tab.action}
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
				{view.error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{view.error}
						</p>
						<button
							onClick={actions.onRefresh}
							className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" /> Try Again
						</button>
					</div>
				) : view.loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-purple-500" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Attendance Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your courses and logs...
						</p>
					</div>
				) : view.viewMode === "prof-attendance" ? (
					<ProfessorLogsView
						logs={sortedFilteredLogs}
						formatDate={formatDate}
						activeMonth={activeMonth}
						onMonthChange={setActiveMonth}
						profLogs={data.profLogs}
						leaveApplications={data.leaveApplications}
					/>
				) : !view.selectedCourse ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
						{data.courses.map((course) => (
							<AttendanceCourseCard
								key={course.id}
								course={course}
								onNavigateToLogs={(id) =>
									navigate(`/c/${id}/attendance`)
								}
								onSelectCourse={actions.onSelectCourse}
								isDisabled={
									!view.isCourseScheduledToday(course)
								}
							/>
						))}
					</div>
				) : (
					<AttendanceMarkingView
						data={data}
						view={view}
						actions={actions}
						setIsSettingsOpen={setIsSettingsOpen}
						allMarked={allMarked}
					/>
				)}
			</main>

			<SaveSuccessModal
				isOpen={view.isSaveSuccessOpen}
				onClose={() => actions.setSaveSuccessModal(false)}
				deadline={getDeadlineString()}
			/>

			<QRSettingsModal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				timeout={data.qr.qrTimeout}
				setTimeout={actions.setQrTimeout}
			/>

			<ConfirmSubmitModal
				isOpen={view.isConfirmModalOpen}
				onClose={() => actions.setConfirmModal(false)}
				studentCount={data.students.length}
				onConfirm={actions.onConfirmSave}
			/>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default AttendanceManagementUI;
