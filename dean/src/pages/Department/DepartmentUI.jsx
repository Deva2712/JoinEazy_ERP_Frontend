// src/pages/Department/DepartmentUI.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDepartment } from "../../context/DepartmentContext";
import {
	LayoutDashboard,
	Users,
	GraduationCap,
	BookOpen,
	CalendarCheck,
	Microscope,
	ArrowLeft,
	RefreshCw,
	AlertTriangle,
	ClipboardCheck,
	CalendarDays,
} from "lucide-react";

import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";

import DepartmentOverviewView from "./DepartmentOverview/DepartmentOverviewView";
import DepartmentCoursesView from "./DepartmentCourses/DepartmentCoursesView";
import CourseDetailsView from "./DepartmentCourses/CourseDetailsView";
import DepartmentFacultyView from "./DepartmentFaculty/DepartmentFacultyView";
import FacultyDetailsView from "./DepartmentFaculty/FacultyDetailsView";

const DepartmentUI = ({
	deptData,
	activeTab,
	onTabChange,
	loading,
	error,
	onRefresh,
}) => {
	const navigate = useNavigate();
	const { state, actions } = useDepartment();
	const { selectedCourse, selectedFaculty } = state;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab, selectedCourse, selectedFaculty]);

	const tabs = [
		{ id: "overview", label: "Overview", icon: LayoutDashboard },
		{ id: "courses", label: "Courses", icon: BookOpen },
		{ id: "faculty", label: "Faculty", icon: Users },
		{ id: "students", label: "Students", icon: GraduationCap },
		{ id: "placements", label: "Placements", icon: ClipboardCheck },
		{ id: "research", label: "Research", icon: Microscope },
	];

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen transition-colors duration-300 font-sans">
			<HeaderController />

			{/* Hero Section */}
			<div className="bg-gradient-to-br from-violet-700 via-violet-800 to-indigo-800 dark:from-violet-900 dark:via-violet-950 dark:to-indigo-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-6 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-5">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/dashboard")}
								className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm"
							>
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">
									{deptData?.deptName
										? `${deptData.deptName} Department`
										: "Department Management"}
								</h1>
								<p className="text-violet-100/80 text-sm mt-0.5">
									Manage academic curriculum, faculty
									assignments, and student performance.
								</p>
							</div>
						</div>

						<div className="w-full md:w-auto">
							<StatSummaryCard
								label="Academic Year"
								value={deptData?.academicYear || "N/A"}
								icon={CalendarDays}
							/>
						</div>
					</div>

					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							const isActive = activeTab === tab.id;
							return (
								<button
									key={tab.id}
									onClick={() => onTabChange(tab.id)}
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										isActive
											? "bg-gray-50 dark:bg-[#0f1117] text-violet-700 dark:text-violet-400"
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

			<main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12 relative">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{error}
						</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" />
							Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-violet-500" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Department Data
						</p>
						<p className="text-sm">
							Please wait while we sync your dashboard...
						</p>
					</div>
				) : (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{activeTab === "overview" && <DepartmentOverviewView />}

						{/* Courses Tab Logic */}
						{activeTab === "courses" &&
							(selectedCourse ? (
								<CourseDetailsView
									course={selectedCourse}
									onBack={() =>
										actions.setSelectedCourse(null)
									}
								/>
							) : (
								<DepartmentCoursesView
									onCourseClick={(course) =>
										actions.setSelectedCourse(course)
									}
								/>
							))}

						{/* Faculty Tab Logic */}
						{activeTab === "faculty" &&
							(selectedFaculty ? (
								<FacultyDetailsView
									faculty={selectedFaculty}
									onBack={() =>
										actions.setSelectedFaculty(null)
									}
								/>
							) : (
								<DepartmentFacultyView
									onFacultyClick={(faculty) =>
										actions.setSelectedFaculty(faculty)
									}
								/>
							))}
						{!["overview", "courses", "faculty"].includes(
							activeTab,
						) && (
							<div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-[#1a1d26] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
								<CalendarCheck className="size-12 md:size-16 text-gray-200 dark:text-gray-700 mb-4" />
								<h2 className="text-lg font-bold text-gray-900 dark:text-white">
									Module under development
								</h2>
								<p className="text-gray-500 dark:text-gray-400 text-sm">
									The {activeTab} section is currently being
									developed and will be available soon.
								</p>
							</div>
						)}
					</div>
				)}
			</main>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default DepartmentUI;
