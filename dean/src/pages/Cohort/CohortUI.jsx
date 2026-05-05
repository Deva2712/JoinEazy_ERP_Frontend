// src/pages/Cohort/CohortUI.jsx

import React from "react";
import {
	Settings,
	ClipboardList,
	FileText,
	Users,
	Calendar,
	CalendarCheck,
	ArrowLeft,
	GraduationCap,
	Award,
	LayoutDashboard,
	BookOpen,
	UserCheck,
	Clipboard,
	Megaphone,
	FolderOpen,
} from "lucide-react";

import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";

import DetailsController from "./CohortDetails/CohortDetailsController";
import NotesController from "./CohortNotes/CohortNotesController";
import LeaderboardController from "./CohortLeaderboard/CohortLeaderboardController";
import BoardController from "./CohortBoard/CohortBoardController";
import EventsController from "./CohortEvents/CohortEventsController";
import CoursesController from "./CohortCourses/CohortCoursesController";
import MembersController from "./CohortMembers/CohortMembersController";
import AssignmentsController from "./CohortAssignments/CohortAssignmentsController";
import CohortResourcesController from "./CohortResources/CohortResourcesController";
import AnnouncementsController from "./CohortAnnouncements/CohortAnnouncementsController";
import MyMeetingsController from "./CohortMeetings/MyMeetingsController";
import CohortAttendanceController from "./CohortAttendance/CohortAttendanceController";

/**
 * Main UI component for the Cohort/Course page.
 * Manages tab navigation and renders the appropriate sub-controller.
 */
export default function CohortUI({
	cohortId,
	cohortData,
	activeTab,
	setActiveTab,
	requiredTabs,
	onTabChange,
	handleCohortSettingsClick,
	userRole,
}) {
	// Logic to treat Professor and HOD with the same administrative view
	const isStaff = userRole === "professor" || userRole === "hod";

	const iconMap = {
		details: BookOpen,
		members: Users,
		assignments: ClipboardList,
		resources: FolderOpen,
		attendance: UserCheck,
		"my-meetings": CalendarCheck,
		announcements: Megaphone,
		board: LayoutDashboard,
		courses: FileText,
		leaderboard: Award,
		events: Calendar,
		notes: FileText,
	};

	const allTabs = [
		{ id: "details", name: "Details" },
		{ id: "members", name: "Members" },
		{ id: "attendance", name: "Attendance" },
		{ id: "assignments", name: "Assignments" },
		{ id: "resources", name: "Resources" },
		{ id: "my-meetings", name: "My Meetings", studentOnly: true },
		{ id: "announcements", name: "Announcements" },
		{ id: "board", name: "Board" },
		{ id: "courses", name: "Submissions" },
		{ id: "leaderboard", name: "Leaderboard" },
		{ id: "events", name: "Events" },
		{ id: "notes", name: "Notes" },
	];

	const tabs = requiredTabs
		? allTabs.filter((tab) => {
				if (tab.studentOnly)
					return !isStaff && requiredTabs.includes(tab.id);
				return requiredTabs.includes(tab.id);
			})
		: allTabs.filter((tab) => {
				if (tab.studentOnly) return !isStaff;
				return tab.id === "details" || tab.id === "members";
			});

	const handleTabClick = (tabId) => {
		setActiveTab(tabId);
		if (onTabChange) onTabChange(tabId);
	};

	const fmtDate = (d) =>
		d
			? new Date(d).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})
			: null;

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen transition-colors duration-300 font-sans">
			<HeaderController />

			{cohortData && (
				<div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 text-white">
					<div className="max-w-7xl mx-auto px-4 pt-6 pb-0">
						{/* Top Banner Header Section */}
						<div className="flex flex-col gap-4 mb-5">
							<div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
								<div className="flex items-center gap-4">
									<button
										onClick={() =>
											(window.location.href =
												"/my-courses")
										}
										className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
									>
										<ArrowLeft className="size-5" />
									</button>
									<div>
										<h1 className="text-2xl font-bold tracking-tight">
											{cohortData.title}
										</h1>
										<div className="flex items-center gap-2 mt-2">
											{cohortData.course_codes?.map(
												(code, idx) => (
													<span
														key={idx}
														className="px-3 py-1 rounded-lg bg-blue-900/50 text-xs font-bold uppercase tracking-wider text-blue-200 border border-blue-500/30"
													>
														{code}
													</span>
												),
											)}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
									<StatSummaryCard
										label={isStaff ? "Members" : "Group"}
										value={
											isStaff
												? `${cohortData.member_count || 0}`
												: cohortData.group_name ||
													"None"
										}
										icon={Users}
									/>
									<StatSummaryCard
										label="Ongoing Assignments"
										value={(
											cohortData.pending_assignments || 0
										).toString()}
										icon={Clipboard}
									/>
								</div>
							</div>

							{/* Meta Info: Instructor and Dates */}
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
								<div className="flex flex-wrap items-center gap-6 text-sm">
									<div className="flex items-center gap-2 text-blue-100 font-semibold">
										<div className="p-1.5 bg-white/10 rounded-lg">
											<GraduationCap className="size-4" />
										</div>
										{isStaff
											? "Taught by You"
											: `Taught by ${cohortData.instructor || "Professor"}`}
									</div>
									{cohortData.start_date && (
										<div className="flex items-center gap-2 text-blue-100 font-semibold">
											<div className="p-1.5 bg-white/10 rounded-lg">
												<Calendar className="size-4" />
											</div>
											{fmtDate(cohortData.start_date)}{" "}
											&rarr;{" "}
											{fmtDate(cohortData.end_date)}
										</div>
									)}
								</div>

								{isStaff && (
									<button
										onClick={handleCohortSettingsClick}
										className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-800 hover:bg-blue-50 rounded-xl shadow-lg transition-all font-bold text-sm"
									>
										<Settings size={16} />
										Course Settings
									</button>
								)}
							</div>
						</div>

						{/* Scrollable Navigation Tabs */}
						<div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
							{tabs.map((tab) => {
								const Icon = iconMap[tab.id] || FileText;
								return (
									<button
										key={tab.id}
										onClick={() => handleTabClick(tab.id)}
										className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
											activeTab === tab.id
												? "bg-gray-50 dark:bg-[#0f1117] text-blue-700 dark:text-blue-400"
												: "text-white/70 hover:text-white hover:bg-white/10"
										}`}
									>
										<Icon size={16} />
										{tab.name}
									</button>
								);
							})}
						</div>
					</div>
				</div>
			)}

			<main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
				{activeTab === "details" && (
					<DetailsController
						cohortId={cohortId}
						cohortData={cohortData}
						isStaff={isStaff}
					/>
				)}
				{activeTab === "members" && (
					<MembersController
						cohortId={cohortId}
						cohortData={cohortData}
						isStaff={isStaff}
					/>
				)}
				{activeTab === "attendance" && (
					<CohortAttendanceController
						cohortId={cohortId}
						cohortData={cohortData}
						isStaff={isStaff}
					/>
				)}
				{activeTab === "assignments" && (
					<AssignmentsController
						cohortId={cohortId}
						cohortData={cohortData}
						isStaff={isStaff}
					/>
				)}
				{activeTab === "resources" && (
					<CohortResourcesController
						cohortId={cohortId}
						cohortData={cohortData}
						isStaff={isStaff}
					/>
				)}
				{activeTab === "announcements" && (
					<AnnouncementsController
						cohortId={cohortId}
						cohortData={cohortData}
						isStaff={isStaff}
					/>
				)}
				{activeTab === "my-meetings" && !isStaff && (
					<MyMeetingsController
						cohortId={cohortId}
						cohortData={cohortData}
						isStaff={isStaff}
					/>
				)}
				{activeTab === "board" && (
					<BoardController
						cohortId={cohortId}
						cohortData={cohortData}
					/>
				)}
				{activeTab === "courses" && (
					<CoursesController
						cohortId={cohortId}
						cohortData={cohortData}
					/>
				)}
				{activeTab === "leaderboard" && (
					<LeaderboardController
						cohortId={cohortId}
						cohortData={cohortData}
					/>
				)}
				{activeTab === "events" && (
					<EventsController
						cohortId={cohortId}
						cohortData={cohortData}
					/>
				)}
				{activeTab === "notes" && (
					<NotesController
						cohortId={cohortId}
						cohortData={cohortData}
					/>
				)}
			</main>

			<FooterController />
			<BottomNavController />
		</div>
	);
}
