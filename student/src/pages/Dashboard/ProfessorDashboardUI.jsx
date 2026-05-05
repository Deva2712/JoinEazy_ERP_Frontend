// src/pages/Dashboard/DashboardUI.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Building2,
	AlertCircle,
	Search,
	X,
	Calendar,
	BookOpen,
	ClipboardList,
	Wrench,
	UserCheck,
	Package,
	Banknote,
	Megaphone,
	Microscope,
	CalendarDays,
	NotebookPen,
	Wallet,
	Library,
	CalendarClock,
	BookUser,
	FileText,
	LayoutDashboard,
	ChartLine,
	Handshake,
	ShieldAlert,
	BarChart3,
	Award,
	ClipboardCheck,
	GraduationCap,
	GitBranch,
	FlaskConical,
	Coins,
} from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";

import UpcomingTasks from "./components/UpcomingTasks";
import ModuleCard from "./components/ModuleCard";

export default function ProfessorDashboardUI({
	loading = false,
	error = null,
	onRetry = () => {},
	userProfile = {
		fullName: "John Doe",
		employeeId: "PROF-001",
		organization: "Mahindra University",
	},
	userRole = "professor",
	tasks,
	onToggleTask = null,
}) {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");

	const clearSearch = () => setSearchQuery("");

	const ModuleCards = [
		/* HOD Exclusive Modules */
		{
			label: "Department Management",
			sublabel: "Overview & Admin",
			route: "/department",
			gradient: "from-violet-600 to-violet-700",
			textColor: "text-violet-600 dark:text-violet-400",
			icon: ChartLine,
			requiredRoles: ["hod", "dean"],
		},
		/* Dean Exclusive Modules */
		{
			label: "Industry & Relations",
			sublabel: "Company Partnerships",
			route: "/industry-relations",
			gradient: "from-teal-600 to-emerald-700",
			textColor: "text-teal-600 dark:text-teal-400",
			icon: Handshake,
			requiredRoles: ["dean"],
		},
		{
			label: "Risk & Governance",
			sublabel: "Compliance & Quality",
			route: "/risk-governance",
			gradient: "from-rose-600 to-red-700",
			textColor: "text-rose-600 dark:text-rose-400",
			icon: ShieldAlert,
			requiredRoles: ["dean"],
		},
		{
			label: "Advanced Analytics",
			sublabel: "Heatmaps & Funnels",
			route: "/advanced-analytics",
			gradient: "from-indigo-600 to-blue-700",
			textColor: "text-indigo-600 dark:text-indigo-400",
			icon: BarChart3,
			requiredRoles: ["dean"],
		},
		{
			label: "Faculty Lifecycle",
			sublabel: "Promotions & Tenure",
			route: "/faculty-lifecycle",
			gradient: "from-orange-500 to-amber-600",
			textColor: "text-orange-600 dark:text-orange-400",
			icon: Award,
			requiredRoles: ["dean"],
		},
		{
			label: "Accreditation",
			sublabel: "NBA, NAAC & Audits",
			route: "/accreditation",
			gradient: "from-emerald-600 to-teal-700",
			textColor: "text-emerald-600 dark:text-emerald-400",
			icon: ClipboardCheck,
			requiredRoles: ["dean"],
		},
		{
			label: "Program Governance",
			sublabel: "Degree Lifecycles & Intake",
			route: "/program-governance",
			gradient: "from-indigo-600 to-violet-700",
			textColor: "text-indigo-600 dark:text-indigo-400",
			icon: GraduationCap,
			requiredRoles: ["dean"],
		},
		{
			label: "Curriculum Governance",
			sublabel: "Workflows & PO/CO Mapping",
			route: "/curriculum-governance",
			gradient: "from-sky-600 to-cyan-700",
			textColor: "text-sky-600 dark:text-sky-400",
			icon: GitBranch,
			requiredRoles: ["dean"],
		},
		{
			label: "Research Strategy",
			sublabel: "Clusters & Impact",
			route: "/research-strategy",
			gradient: "from-teal-600 to-emerald-700",
			textColor: "text-teal-600 dark:text-teal-400",
			icon: FlaskConical,
			requiredRoles: ["dean"],
		},
		{
			label: "Financial Governance",
			sublabel: "Budgets & ROI",
			route: "/financial-governance",
			gradient: "from-amber-600 to-orange-700",
			textColor: "text-amber-600 dark:text-amber-400",
			icon: Coins,
			requiredRoles: ["dean"],
		},
		/* Standard Staff Modules (Professor & HOD) */
		{
			label: "My Courses",
			sublabel: "Explore Courses",
			route: "/my-courses",
			gradient: "from-blue-500 to-indigo-600",
			textColor: "text-blue-600 dark:text-blue-400",
			icon: BookOpen,
			requiredRoles: ["professor", "hod", "student", "dean"],
		},
		{
			label: "Schedule & Meetings",
			sublabel: "Check Schedule",
			route: "/schedule",
			gradient: "from-rose-500 to-rose-600",
			textColor: "text-rose-600 dark:text-rose-400",
			icon: CalendarClock,
			requiredRoles: ["professor", "hod", "student", "dean"],
		},
		{
			label: "Attendance Management",
			sublabel: "Manage Attendance",
			route: "/attendance-management",
			gradient: "from-purple-500 to-purple-600",
			textColor: "text-purple-600 dark:text-purple-400",
			icon: UserCheck,
			requiredRoles: ["professor", "hod", "student", "dean"],
		},
		{
			label: "Session Planning",
			sublabel: "Plan & Reflect",
			route: "/session-planning",
			gradient: "from-indigo-500 to-indigo-600",
			textColor: "text-indigo-600 dark:text-indigo-400",
			icon: ClipboardList,
			requiredRoles: ["professor", "hod", "dean"],
		},
		{
			label: "Bulletins",
			sublabel: "Latest News",
			route: "/bulletins",
			gradient: "from-cyan-500 to-cyan-600",
			textColor: "text-cyan-600 dark:text-cyan-400",
			icon: Megaphone,
			requiredRoles: ["professor", "hod", "student", "dean"],
		},
		{
			label: "Exam Duties",
			sublabel: "View Assignments",
			route: "/exam-duties",
			gradient: "from-lime-500 to-lime-600",
			textColor: "text-lime-600 dark:text-lime-400",
			icon: NotebookPen,
			requiredRoles: ["professor", "hod", "dean"],
		},
		{
			label: "Leave Application",
			sublabel: "Apply for Leave",
			route: "/leave-applications",
			gradient: "from-orange-500 to-orange-600",
			textColor: "text-orange-600 dark:text-orange-400",
			icon: CalendarDays,
			requiredRoles: ["professor", "hod", "dean"],
		},
		{
			label: "Library",
			sublabel: "Browse Books",
			route: "/library",
			gradient: "from-green-500 to-green-600",
			textColor: "text-green-600 dark:text-green-400",
			icon: Library,
			requiredRoles: ["professor", "hod", "student", "dean"],
		},
		{
			label: "Research & Publications",
			sublabel: "View Research",
			route: "/research-publications",
			gradient: "from-emerald-500 to-emerald-600",
			textColor: "text-emerald-600 dark:text-emerald-400",
			icon: Microscope,
			requiredRoles: ["professor", "hod", "student", "dean"],
		},
		{
			label: "Student Mentoring",
			sublabel: "Manage Students",
			route: "/mentoring",
			gradient: "from-sky-600 to-sky-700",
			textColor: "text-sky-600 dark:text-sky-400",
			icon: BookUser,
			requiredRoles: ["professor", "hod", "student", "dean"],
		},
		{
			label: "Document Requests",
			sublabel: "Manage Letters",
			route: "/document-requests",
			gradient: "from-fuchsia-600 to-fuchsia-700",
			textColor: "text-fuchsia-600 dark:text-fuchsia-400",
			icon: FileText,
			requiredRoles: ["professor", "hod", "student", "dean"],
		},
		{
			label: "Asset Requests",
			sublabel: "Request Items",
			route: "/asset-requests",
			gradient: "from-teal-500 to-teal-600",
			textColor: "text-teal-600 dark:text-teal-400",
			icon: Package,
			requiredRoles: ["professor", "hod", "dean"],
		},
		{
			label: "Maintenance",
			sublabel: "Submit Request",
			route: "/maintenance",
			gradient: "from-yellow-500 to-yellow-600",
			textColor: "text-yellow-600 dark:text-yellow-400",
			icon: Wrench,
			requiredRoles: ["professor", "hod", "dean"],
		},
		{
			label: "Finance Management",
			sublabel: "Claims & Advances",
			route: "/finance-management",
			gradient: "from-amber-500 to-amber-600",
			textColor: "text-amber-600 dark:text-amber-400",
			icon: Wallet,
			requiredRoles: ["professor", "hod", "dean"],
		},
		{
			label: "Payroll & Salary",
			sublabel: "Review Breakdown",
			route: "/payroll",
			gradient: "from-blue-500 to-blue-600",
			textColor: "text-blue-600 dark:text-blue-400",
			icon: Banknote,
			requiredRoles: ["professor", "hod", "dean"],
		},
	];

	const filteredModuleCards = ModuleCards.filter((card) => {
		const hasPermission = card.requiredRoles.includes(userRole);
		const matchesSearch =
			card.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
			card.sublabel.toLowerCase().includes(searchQuery.toLowerCase());
		return hasPermission && matchesSearch;
	});

	/**
	 * Skeleton Loading State
	 * Replaces the spinner with a UI that matches the page structure.
	 */
	if (loading) {
		return (
			<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
				<HeaderController />
				{/* Hero Skeleton */}
				<div className="bg-blue-800 dark:bg-blue-950/50 text-white animate-pulse">
					<div className="max-w-7xl mx-auto px-4 py-8">
						<div className="grid lg:grid-cols-2 gap-8 items-center">
							<div>
								<div className="h-10 w-64 bg-white/20 rounded-lg mb-4" />
								<div className="h-6 w-96 bg-white/10 rounded-lg" />
							</div>
							<div className="flex flex-wrap gap-4 lg:justify-end">
								<div className="h-24 w-full lg:w-72 bg-white/10 rounded-2xl" />
								<div className="h-24 w-full lg:w-72 bg-white/10 rounded-2xl" />
							</div>
						</div>
					</div>
				</div>

				<main className="mx-auto px-4 py-8 pb-24 md:pb-5 max-w-7xl animate-pulse">
					{/* Tasks Skeleton */}
					<div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl mb-8" />
					{/* Search Bar Skeleton */}
					<div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-xl mb-8" />
					{/* Module Grid Skeleton */}
					<div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, i) => (
							<div
								key={i}
								className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl shadow-sm"
							/>
						))}
					</div>
				</main>
				<BottomNavController />
				<FooterController />
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
				<HeaderController />
				<main className="mx-auto px-4 py-5 lg:py-6 xl:py-8 pb-24 md:pb-5 max-w-7xl">
					<div className="flex items-center justify-center min-h-[400px]">
						<div className="text-center">
							<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">
								Failed to load dashboard
							</h3>
							<p className="text-gray-600 dark:text-gray-400 mb-4">
								{error}
							</p>
							<button
								onClick={onRetry}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								Try Again
							</button>
						</div>
					</div>
				</main>
				<BottomNavController />
				<FooterController />
			</div>
		);
	}

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />

			<div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 text-white">
				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="grid lg:grid-cols-2 gap-8 items-center">
						<div className="gap-3">
							<h1 className="text-3xl font-bold">
								👋 Welcome back,{" "}
								{userProfile.fullName
									.split(" ")
									.slice(
										0,
										[
											"Dr.",
											"Prof.",
											"Mr.",
											"Mrs.",
											"Ms.",
										].includes(
											userProfile.fullName.split(" ")[0],
										)
											? 2
											: 1,
									)
									.join(" ")}
								!
							</h1>
							<p className="text-blue-100 dark:text-blue-200 text-lg">
								Here's an overview of your courses, schedules,
								and administrative tasks.
							</p>
						</div>

						<div className="flex flex-wrap gap-4 lg:justify-end w-full text-white">
							<div className="bg-white/10 dark:bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md flex-1 min-w-[280px] shadow-sm">
								<div className="flex items-center gap-3 mb-2 text-blue-200 dark:text-blue-300">
									<Building2 className="size-5" />
									<h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">
										Institution
									</h3>
								</div>
								<p className="text-lg font-semibold truncate leading-tight">
									{userProfile.organization}
								</p>
							</div>

							<div className="bg-white/10 dark:bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md flex-1 min-w-[280px] shadow-sm">
								<div className="flex items-center gap-3 mb-2 text-blue-200 dark:text-blue-300">
									<Calendar className="size-5" />
									<h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">
										Today's Date
									</h3>
								</div>
								<p className="text-lg font-semibold truncate leading-tight">
									{new Date().toLocaleDateString("en-US", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<main className="px-4 py-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
				<UpcomingTasks tasks={tasks} onToggleTask={onToggleTask} />

				<div className="mb-8">
					<div className="relative w-full">
						<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
						<input
							type="text"
							placeholder="Search modules..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600 transition-all"
						/>
						{searchQuery && (
							<button
								onClick={clearSearch}
								className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								<X className="w-5 h-5" />
							</button>
						)}
					</div>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
					{filteredModuleCards.map((card) => (
						<ModuleCard
							key={card.route}
							{...card}
							onClick={() => navigate(card.route)}
						/>
					))}
				</div>
			</main>

			<BottomNavController />
			<FooterController />
		</div>
	);
}
