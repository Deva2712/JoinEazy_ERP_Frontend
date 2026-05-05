// src/pages/SessionPlanning/SessionPlanningUI.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Calendar,
	FileText,
	History,
	RefreshCw,
	AlertTriangle,
	BookOpen,
	BookMarked,
} from "lucide-react";

import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import CourseScheduleView from "./views/CourseScheduleView";
import DocumentsView from "./views/DocumentsView";
import ReflectionHistoryView from "./views/ReflectionHistoryView";
import TodayClassView from "./views/TodayClassView";
import UpdateReflectionModal from "./components/UpdateReflectionModal";

/**
 * Tab definitions for the sub-views.
 */
const TABS = [
	{ key: "today", label: "Today", icon: BookMarked },
	{ key: "schedule", label: "Schedule", icon: Calendar },
	{ key: "documents", label: "Documents", icon: FileText },
	{ key: "history", label: "History", icon: History },
];

/**
 * SessionPlanningUI Component
 * The primary container for the Session Planning module.
 * Orchestrates navigation between sub-views (Today, Schedule, Documents, History)
 * and manages the global reflection modal state.
 */
const SessionPlanningUI = ({
	schedules = [],
	todaysClasses = [],
	courses = [],
	reflections = [],
	uploadedDocsByCourse = {},
	loading = false,
	error = null,
	onRefresh,
	onSaveReflection,
	onUploadDocuments,
	activeTab,
	onTabChange,
}) => {
	const navigate = useNavigate();
	const [activeReflection, setActiveReflection] = useState(null);

	/**
	 * Ensures the page scrolls to the top whenever the user switches tabs.
	 */
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	const handleOpenReflection = (cls) => {
		setActiveReflection(cls);
	};

	const handleCloseReflection = () => {
		setActiveReflection(null);
	};

	/**
	 * Wraps the save callback to ensure the modal closes only on success.
	 */
	const handleSave = async (data) => {
		const success = await onSaveReflection(data);
		if (success) {
			handleCloseReflection();
		}
	};

	/**
	 * Filters for courses that are still in progress to display in the header stats.
	 */
	const activeCoursesCount = courses.filter(
		(course) => course.id && course.status !== "Completed",
	).length;

	const statsData = [
		{
			label: "Active Courses",
			value: activeCoursesCount.toString(),
			icon: BookOpen,
		},
		{
			label: "Today's Classes",
			value: todaysClasses.length.toString(),
			icon: BookMarked,
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
			<HeaderController />

			{/* Header */}
			<div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 dark:from-indigo-900 dark:via-indigo-950 dark:to-violet-950 text-white">
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
									Session Planning
								</h1>
								<p className="text-white/70 text-sm mt-0.5">
									Organize your teaching schedule and track
									session reflections.
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3 pb-2 md:pb-0">
							{statsData.map((stat, index) => (
								<StatSummaryCard key={index} {...stat} />
							))}
						</div>
					</div>

					{/* Tabs */}
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{TABS.map((tab) => {
							const Icon = tab.icon;
							const active = activeTab === tab.key;
							return (
								<button
									key={tab.key}
									onClick={() => onTabChange(tab.key)}
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										active
											? "bg-gray-50 dark:bg-[#0f1117] text-indigo-700 dark:text-indigo-400"
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

			<main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
				{/* Loading & Error States */}
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Failed to load sessions
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{error}
						</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" />
							Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-indigo-500" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Session Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your schedules...
						</p>
					</div>
				) : (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{activeTab === "schedule" && (
							<CourseScheduleView schedules={schedules} />
						)}

						{activeTab === "documents" && (
							<DocumentsView
								courses={courses}
								uploadedDocsByCourse={uploadedDocsByCourse}
								onUpload={onUploadDocuments}
							/>
						)}

						{activeTab === "history" && (
							<ReflectionHistoryView
								courses={courses}
								uploadedDocsByCourse={uploadedDocsByCourse}
								reflections={reflections}
							/>
						)}

						{activeTab === "today" && (
							<TodayClassView
								todaysClasses={todaysClasses}
								onReflection={handleOpenReflection}
							/>
						)}
					</div>
				)}
			</main>

			{activeReflection && (
				<UpdateReflectionModal
					cls={activeReflection}
					onBack={handleCloseReflection}
					onSave={handleSave}
				/>
			)}

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default SessionPlanningUI;
