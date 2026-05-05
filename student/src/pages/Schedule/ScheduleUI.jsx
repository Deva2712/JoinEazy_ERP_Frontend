// src/pages/Schedule/ScheduleUI.jsx

import React, { useState, useEffect, useMemo, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	ArrowLeft,
	Calendar,
	Clock,
	Presentation,
	RefreshCw,
	AlertTriangle,
	Send,
	History,
} from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import TodayScheduleView from "./views/TodayScheduleView";
import OfficeHoursView from "./views/OfficeHoursView";
import MyMeetingsView from "./views/MyMeetingsView";
import RequestsView from "./views/RequestsView";
import OfficeHoursModal from "./components/OfficeHoursModal";
import ImportScheduleModal from "./components/ImportScheduleModal";
import RequestMeetingModal from "./components/RequestMeetingModal";
import MeetingActionModal from "./components/MeetingActionModal";
import ScheduleMeetingModal from "./components/ScheduleMeetingModal";
import MeetingsHistoryView from "./views/MeetingsHistoryView";

const TABS = [
	{ key: "schedule", label: "Schedule", icon: Calendar },
	{ key: "office-hours", label: "Office Hours", icon: Clock },
	{ key: "meetings", label: "My Meetings", icon: Presentation },
	{ key: "history", label: "History", icon: History },
	{ key: "requests", label: "Requests", icon: Send },
];

const ScheduleUI = ({
	userRole,
	loading,
	error,
	activeTab,
	onTabChange,
	onRefresh,
	meetingRequests = [],
	schedule,
	onAcceptRequest,
	onRejectRequest,
	onRescheduleRequest,
	onUpdateSchedule,
	onDeleteOfficeHour,
	outgoingRequests = [],
	onNewOutgoingRequest,
	onDirectSchedule,
	allDisplayMeetings = [],
	filteredMeetings = [],
	filteredTimetable = [],
	availableCourses = [],
	selectedDateFilter,
	setSelectedDateFilter,
	onAddEvent,
}) => {
	const [selectedRequestId, setSelectedRequestId] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMeetingId, setSelectedMeetingId] = useState(null);

	const [activeOverlay, setActiveOverlay] = useState(null);
	const [modalInitialView, setModalInitialView] = useState("accept");
	const [editingOfficeHour, setEditingOfficeHour] = useState(null);
	const [preFillData, setPreFillData] = useState(null);
	const [expandedReasons, setExpandedReasons] = useState({});

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	/**
	 * Automatically opens the Schedule modal if navigation state contains pre-fill data.
	 */
	useEffect(() => {
		if (location.state?.openScheduleModal) {
			setPreFillData(location.state.preFill);
			setActiveOverlay("schedule-meeting");
			navigate(location.pathname, { replace: true, state: {} });
		}
	}, [location, navigate]);

	const closeModal = () => {
		setActiveOverlay(null);
		setEditingOfficeHour(null);
		setPreFillData(null);
	};

	const upcomingMeetings = useMemo(() => {
		const now = new Date();
		return allDisplayMeetings
			.filter((m) => new Date(m.startTime || m.dateTime) >= now)
			.filter((m) => {
				const q = searchQuery.toLowerCase();
				return (
					m.subject?.toLowerCase().includes(q) ||
					m.participantName?.toLowerCase().includes(q)
				);
			})
			.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
	}, [allDisplayMeetings, searchQuery]);

	const historyMeetings = useMemo(() => {
		const now = new Date();
		return allDisplayMeetings
			.filter((m) => new Date(m.startTime || m.dateTime) < now)
			.filter((m) => {
				const q = searchQuery.toLowerCase();
				return (
					m.subject?.toLowerCase().includes(q) ||
					m.participantName?.toLowerCase().includes(q)
				);
			})
			.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
	}, [allDisplayMeetings, searchQuery]);

	const handleOfficeHoursSave = (data) => {
		onUpdateSchedule(data);
		closeModal();
	};

	const handleOpenActionModal = (request, view) => {
		setSelectedRequestId(request.id);
		setModalInitialView(view);
		setActiveOverlay("action");
	};

	const handleModalConfirm = (type, requestId, data) => {
		if (type === "accept") onAcceptRequest(requestId, data);
		if (type === "reschedule") onRescheduleRequest(requestId, data);
		if (type === "reject") onRejectRequest(requestId, data);
		closeModal();
	};

	const meetingsThisWeekCount = useMemo(() => {
		const today = new Date();
		const firstDay = today.getDate() - today.getDay();
		const lastDay = firstDay + 6;
		const startOfWeek = new Date(new Date().setDate(firstDay)).setHours(
			0,
			0,
			0,
			0,
		);
		const endOfWeek = new Date(new Date().setDate(lastDay)).setHours(
			23,
			59,
			59,
			999,
		);

		return allDisplayMeetings.filter((m) => {
			const meetingDate = new Date(m.startTime || m.dateTime);
			return meetingDate >= startOfWeek && meetingDate <= endOfWeek;
		}).length;
	}, [allDisplayMeetings]);

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans transition-colors duration-300">
			<HeaderController />

			<div className="bg-gradient-to-br from-rose-600 via-rose-700 to-pink-800 dark:from-rose-900 dark:via-rose-950 dark:to-pink-950 text-white">
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
									Schedule & Meetings
								</h1>
								<p className="text-rose-50 text-sm mt-0.5">
									Manage your timetable, office hours &
									meeting requests.
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3 pb-2 md:pb-0">
							<StatSummaryCard
								label="Meetings Today"
								value={allDisplayMeetings
									.filter(
										(m) =>
											new Date(
												m.startTime || m.dateTime,
											).toDateString() ===
											new Date().toDateString(),
									)
									.length.toString()}
								icon={Presentation}
							/>
							<StatSummaryCard
								label="Meetings This Week"
								value={meetingsThisWeekCount.toString()}
								icon={Calendar}
							/>
						</div>
					</div>

					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{TABS.map((tab) => {
							const Icon = tab.icon;
							const active = activeTab === tab.key;
							let badge =
								tab.key === "meetings"
									? allDisplayMeetings.length
									: 0;

							return (
								<button
									key={tab.key}
									onClick={() => {
										onTabChange(tab.key);
										setSelectedMeetingId(null);
									}}
									className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap ${
										active
											? "bg-gray-50 dark:bg-[#0f1117] text-rose-700 dark:text-rose-400"
											: "text-white/70 hover:text-white hover:bg-white/10"
									}`}
								>
									<Icon className="w-4 h-4" />
									{tab.label}
									{badge > 0 && (
										<span
											className={`inline-flex items-center justify-center text-[10px] font-bold w-[18px] h-[18px] rounded-full ml-1.5 ${active ? "bg-rose-600 text-white" : "bg-white text-rose-700"}`}
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

			<main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Failed to load schedule
						</h2>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" /> Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-rose-500" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Schedule Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your schedules...
						</p>
					</div>
				) : userRole === "professor" || userRole === "hod" ? (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{activeTab === "schedule" && (
							<TodayScheduleView
								schedule={schedule}
								allDisplayMeetings={allDisplayMeetings}
								selectedDateFilter={selectedDateFilter}
								setSelectedDateFilter={setSelectedDateFilter}
								filteredTimetable={filteredTimetable}
								filteredMeetings={filteredMeetings}
								handleOpenAddOfficeHours={() => {
									setEditingOfficeHour(null);
									setActiveOverlay("office-hours");
								}}
								handleOpenEditOfficeHour={(hour) => {
									setEditingOfficeHour(hour);
									setActiveOverlay("office-hours");
								}}
								handleDateClick={setSelectedDateFilter}
								setShowImportModal={() =>
									setActiveOverlay("import")
								}
								onDeleteOfficeHour={onDeleteOfficeHour}
								onAddEvent={onAddEvent}
							/>
						)}

						{activeTab === "office-hours" && (
							<OfficeHoursView
								schedule={schedule}
								handleOpenAddOfficeHours={() => {
									setEditingOfficeHour(null);
									setActiveOverlay("office-hours");
								}}
								handleOpenEditOfficeHour={(hour) => {
									setEditingOfficeHour(hour);
									setActiveOverlay("office-hours");
								}}
								onDeleteOfficeHour={onDeleteOfficeHour}
							/>
						)}

						{activeTab === "meetings" && (
							<MyMeetingsView
								processedMeetings={upcomingMeetings}
								selectedMeetingId={selectedMeetingId}
								setSelectedMeetingId={setSelectedMeetingId}
								searchQuery={searchQuery}
								setSearchQuery={setSearchQuery}
								selectedMeeting={upcomingMeetings.find(
									(m) =>
										(m.id || m.idx) === selectedMeetingId,
								)}
								handleReschedule={(r) =>
									handleOpenActionModal(r, "reschedule")
								}
								onOpenScheduleModal={() =>
									setActiveOverlay("schedule-meeting")
								}
								onOpenRequestModal={() =>
									setActiveOverlay("request")
								}
							/>
						)}

						{activeTab === "history" && (
							<MeetingsHistoryView
								historyMeetings={historyMeetings}
								selectedMeetingId={selectedMeetingId}
								setSelectedMeetingId={setSelectedMeetingId}
								searchQuery={searchQuery}
								setSearchQuery={setSearchQuery}
								selectedMeeting={historyMeetings.find(
									(m) =>
										(m.id || m.idx) === selectedMeetingId,
								)}
							/>
						)}

						{activeTab === "requests" && (
							<RequestsView
								meetingRequests={meetingRequests}
								outgoingRequests={outgoingRequests}
								expandedReasons={expandedReasons}
								setExpandedReasons={setExpandedReasons}
								handleAccept={(r) =>
									handleOpenActionModal(r, "accept")
								}
								handleReject={(r) =>
									handleOpenActionModal(r, "reject")
								}
								setShowRequestModal={() =>
									setActiveOverlay("request")
								}
							/>
						)}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
						<div className="text-6xl">📅</div>
						<h2 className="text-2xl font-semibold dark:text-gray-200">
							Student Schedule View
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Coming soon!
						</p>
					</div>
				)}
			</main>

			{/* Optimized Modal Rendering: Only mount when active */}
			{activeOverlay === "action" && (
				<MeetingActionModal
					isOpen={true}
					request={
						meetingRequests.find(
							(r) => r.id === selectedRequestId,
						) ||
						allDisplayMeetings.find(
							(m) => (m.id || m.idx) === selectedRequestId,
						)
					}
					initialView={modalInitialView}
					onConfirm={handleModalConfirm}
					onClose={closeModal}
				/>
			)}

			{activeOverlay === "office-hours" && (
				<OfficeHoursModal
					isOpen={true}
					editingHour={editingOfficeHour}
					existingHours={schedule?.officeHours || []}
					schedule={schedule}
					courses={availableCourses}
					onSave={handleOfficeHoursSave}
					onClose={closeModal}
				/>
			)}

			{activeOverlay === "import" && (
				<ImportScheduleModal
					isOpen={true}
					onImport={(t) => {
						onUpdateSchedule({ timetable: t });
						closeModal();
					}}
					onClose={closeModal}
				/>
			)}

			{activeOverlay === "request" && (
				<RequestMeetingModal
					isOpen={true}
					onClose={closeModal}
					onConfirm={async (data) => {
						const success = await onNewOutgoingRequest(data);
						if (success) closeModal();
					}}
				/>
			)}

			{activeOverlay === "schedule-meeting" && (
				<ScheduleMeetingModal
					isOpen={true}
					onClose={closeModal}
					onConfirm={(data) => {
						onDirectSchedule(data);
						closeModal();
					}}
					userRole={userRole}
					initialData={preFillData}
				/>
			)}

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default ScheduleUI;
