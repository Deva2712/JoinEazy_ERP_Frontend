// src/pages/MyCourses/MyCoursesUI.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	BookMarked,
	Archive,
	RefreshCw,
	AlertTriangle,
	ArrowLeft,
	Plus,
} from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import CourseCard from "./components/CourseCard";

/**
 * MyCoursesUI Component
 * Displays course listings with specialized layouts for mobile and desktop views.
 */
export default function MyCoursesUI({
	cohorts,
	archivedCohorts,
	statsData,
	loading,
	error,
	onRefresh,
	userRole,
}) {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("my-courses");

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	const normaliseCohort = (c) => ({
		...c,
		id: c.id,
		title: c.cohort_name || c.title || "Untitled Course",
		cohort_code: c.cohort_code || c.courseCode || "N/A",
		member_count: c.member_count ?? c.memberCount ?? c.students ?? 0,
		assignment_count: c.total_assignments ?? c.totalAssignments ?? 0,
		startDate: c.start_date || c.startDate || null,
		endDate: c.end_date || c.endDate || null,
		link: c.link || `/c/${c.id}`,
		active: !["Archived", "archived", "inactive"].includes(
			c.status || c.visibility,
		),
	});

	const activeList = cohorts.map(normaliseCohort).filter((c) => c.active);
	const archivedList = archivedCohorts.map(normaliseCohort);
	const displayData = activeTab === "my-courses" ? activeList : archivedList;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans relative">
			<HeaderController />

			{/* Hero / Header Section */}
			<div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 text-white">
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
									My Courses
								</h1>
								<p className="text-white/70 text-sm mt-0.5">
									Manage your assigned learning courses.
								</p>
							</div>
						</div>

						<div className="w-full md:w-auto">
							<StatSummaryCard
								label="Active Courses"
								value={statsData.activeCourses.toString()}
								icon={BookMarked}
							/>
						</div>
					</div>

					{/* Tab Navigation */}
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
							{[
								{
									key: "my-courses",
									label: "My Courses",
									icon: BookMarked,
								},
								{
									key: "archived",
									label: "Archived",
									icon: Archive,
								},
							].map((tab) => {
								const Icon = tab.icon;
								return (
									<button
										key={tab.key}
										onClick={() => setActiveTab(tab.key)}
										className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
											activeTab === tab.key
												? "bg-gray-50 dark:bg-[#0f1117] text-blue-700 dark:text-blue-400"
												: "text-white/70 hover:bg-white/10"
										}`}
									>
										<Icon className="w-4 h-4" /> {tab.label}
									</button>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-8 w-full pb-32 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<AlertTriangle className="size-10 text-red-600 mb-4" />
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Failed to load
						</h2>
						<button
							onClick={onRefresh}
							className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold"
						>
							Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-blue-600 dark:text-blue-400" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Courses Data
						</p>
						<p className="text-sm">
							Please wait while we sync your courses data...
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
						{displayData.map((cohort) => (
							<CourseCard
								key={cohort.id}
								cohort={cohort}
								user_type={userRole}
							/>
						))}
					</div>
				)}
			</main>

			<BottomNavController />
			<FooterController />
		</div>
	);
}
