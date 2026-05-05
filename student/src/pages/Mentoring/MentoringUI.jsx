// src/pages/Mentoring/MentoringUI.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
	Users,
	ArrowLeft,
	RefreshCw,
	AlertCircle,
	Search,
	X,
	SlidersHorizontal,
	AlertTriangle,
	CalendarCheck,
	CalendarClock,
} from "lucide-react";

import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import StudentCard from "./components/StudentCard";
import StudentDetailsView from "./views/StudentDetailsView";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import FooterController from "../../components/layout/Footer/FooterController";
import MentoringFilterSidebar from "./components/MentoringFilterSidebar";
import MeetingRecordModal from "./components/MeetingRecordModal";

const MentoringUI = ({
	allMentees = [],
	displayMentees = [],
	filters,
	setFilters,
	loading,
	error,
	selectedMentee,
	searchQuery,
	onSearchChange,
	activeTab,
	onTabChange,
	onViewMentee,
	onBackToList,
	onRefresh,
	onDownloadReport,
	onToggleAttendance,
	onSaveMeetingRecord,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeMeeting, setActiveMeeting] = useState(null);
	const [targetMentee, setTargetMentee] = useState(null);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const navigate = useNavigate();

	const [lastViewedId, setLastViewedId] = useState(null);

	/**
	 * Scroll to top when switching between list and detail views
	 */
	useEffect(() => {
		const currentId = selectedMentee?.studentId;
		if (currentId !== lastViewedId) {
			window.scrollTo({ top: 0, behavior: "instant" });
			setLastViewedId(currentId);
		}
	}, [selectedMentee?.studentId, lastViewedId]);

	const availableDepartments = useMemo(() => {
		const depts = allMentees.map((m) => m.department).filter(Boolean);
		return [...new Set(depts)];
	}, [allMentees]);

	const highRiskCount = allMentees.filter(
		(m) => m.riskLevel === "At Risk",
	).length;

	const requestedCount = allMentees.filter((m) =>
		(m.meetingHistory || []).some((mtg) => mtg.status === "Requested"),
	).length;

	const handleOpenModal = (mentee, meeting) => {
		setTargetMentee(mentee);
		setActiveMeeting(meeting);
		setIsModalOpen(true);
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
			<HeaderController />

			{/* Hero Section: Dynamic header based on View State */}
			<div className="bg-gradient-to-br from-sky-600 via-sky-700 to-sky-800 dark:from-sky-900 dark:via-sky-950 dark:to-sky-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
						<div className="flex items-center gap-4">
							<button
								onClick={() =>
									selectedMentee
										? onBackToList()
										: navigate("/dashboard")
								}
								className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
							>
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">
									Student Mentoring
								</h1>
								<p className="text-sky-50 text-sm mt-0.5">
									Manage student progress and performance.
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<StatSummaryCard
								label="Total Students"
								value={allMentees.length.toString()}
								icon={Users}
							/>
							<StatSummaryCard
								label="Students At Risk"
								value={highRiskCount.toString()}
								icon={AlertTriangle}
								variant={
									highRiskCount > 0 ? "danger" : "default"
								}
							/>
						</div>
					</div>

					{/* Tab Navigation: Visible even on detail view to maintain context */}
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{[
							{
								key: "all-students",
								label: "All Students",
								icon: Users,
							},
							{
								key: "meeting-requests",
								label: "Meeting Requests",
								icon: CalendarClock,
							},
						].map((tab) => {
							const Icon = tab.icon;
							const isActive = activeTab === tab.key;
							const badge =
								tab.key === "meeting-requests" &&
								requestedCount > 0
									? requestedCount
									: null;

							return (
								<button
									key={tab.key}
									onClick={() => onTabChange(tab.key)}
									className={`group relative flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										isActive
											? "bg-gray-50 dark:bg-[#0f1117] text-sky-700 dark:text-sky-500 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.1)]"
											: "text-white/70 hover:text-white hover:bg-white/10"
									}`}
								>
									<Icon className="w-4 h-4" />
									<span>{tab.label}</span>
									{badge && (
										<span
											className={`inline-flex items-center justify-center text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full ml-1.5 ${isActive ? "bg-sky-600 text-white" : "bg-white text-sky-700"}`}
										>
											{badge}
										</span>
									)}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-6 w-full pb-24">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<AlertCircle className="size-10 text-red-600 mb-6" />
						<h2 className="text-xl font-bold dark:text-white mb-2">
							{error}
						</h2>
						<button
							onClick={onRefresh}
							className="bg-sky-600 text-white px-8 py-3 rounded-xl font-bold mt-4"
						>
							Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-sky-600" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Mentoring Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your student details...
						</p>
					</div>
				) : (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{selectedMentee ? (
							<StudentDetailsView
								mentee={selectedMentee}
								onBack={onBackToList}
								onDownloadReport={() =>
									onDownloadReport(selectedMentee)
								}
								onToggleAttendance={onToggleAttendance}
								onOpenMeetingModal={(meeting) =>
									handleOpenModal(selectedMentee, meeting)
								}
							/>
						) : (
							/* List View: Search, Filters, and Cards */
							<>
								<div className="mb-6 flex items-center gap-3">
									<div className="relative group flex-1">
										<Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
										<input
											type="text"
											placeholder="Search by student name, ID, or department..."
											value={searchQuery || ""}
											onChange={(e) =>
												onSearchChange(e.target.value)
											}
											className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm outline-none focus:border-sky-500 transition-all"
										/>
										{searchQuery && (
											<button
												onClick={() =>
													onSearchChange("")
												}
												className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
											>
												<X className="w-5 h-5" />
											</button>
										)}
									</div>

									<button
										onClick={() => setIsFilterOpen(true)}
										className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-sm transition-all hover:border-sky-500 active:scale-95 shadow-sm"
									>
										<SlidersHorizontal className="size-5 text-sky-700" />
										<span className="hidden sm:inline text-gray-900 dark:text-white">
											Filters
										</span>
									</button>
								</div>

								{displayMentees.length === 0 ? (
									<div className="bg-white dark:bg-gray-800/50 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
										<Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
										<h3 className="text-lg font-semibold dark:text-white">
											No students found
										</h3>
										<p className="text-gray-500">
											Try adjusting your filters or search
											terms.
										</p>
									</div>
								) : (
									<div className="flex flex-col gap-4">
										{displayMentees.map((item) => (
											<StudentCard
												key={item.studentId}
												mentee={item}
												activeTab={activeTab}
												onViewDetails={() =>
													onViewMentee(item.studentId)
												}
											/>
										))}
									</div>
								)}
							</>
						)}
					</div>
				)}
			</main>

			<MeetingRecordModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				mentee={targetMentee}
				initialData={activeMeeting}
				onSubmit={async (data) => {
					const success = await onSaveMeetingRecord(
						activeMeeting.meetingId,
						data,
					);
					if (success) setIsModalOpen(false);
				}}
			/>

			<MentoringFilterSidebar
				isOpen={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				filters={filters}
				setFilters={setFilters}
				departments={availableDepartments}
			/>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default MentoringUI;