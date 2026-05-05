// src/pages/Bulletins/BulletinsUI.jsx

import React, { useState, useEffect } from "react";
import {
	Megaphone,
	Plus,
	RefreshCw,
	ArrowLeft,
	Search,
	Calendar,
	AlertCircle,
	SlidersHorizontal,
	AlertTriangle,
	Globe,
	University,
	Archive,
	Users,
	UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import BulletinModal from "./components/BulletinModal";
import BulletinCard from "./components/BulletinCard";
import BulletinFilterSidebar from "./components/BulletinFilterSidebar";

const BulletinsUI = ({
	bulletins = [],
	cohorts = [],
	loading,
	error,
	stats,
	filters,
	setFilters,
	onRefresh,
	onSubmit,
	onTogglePin,
	userRole,
	activeTab,
	onTabChange,
}) => {
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [showCourseList] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	const isFaculty = ["professor", "hod"].includes(userRole?.toLowerCase());
	const isArchive = activeTab === "archive";

	const tabs = [
		{ key: "general", label: "General", icon: Globe },
		...(isFaculty
			? [{ key: "faculty-only", label: "Faculty Only", icon: University }]
			: []),
		{ key: "archive", label: "Archive", icon: Archive },
	];

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 font-sans">
			<HeaderController />

			<div className="bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-800 dark:from-cyan-900 dark:via-cyan-950 dark:to-cyan-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-6">
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
									Bulletins
								</h1>
								<p className="text-white/70 text-sm mt-0.5">
									Stay updated with institution and course
									announcements.
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<StatSummaryCard
								label="Today"
								value={stats.todayCount.toString()}
								icon={Calendar}
							/>
							<StatSummaryCard
								label="Weekly Priority"
								value={stats.priorityThisWeek.toString()}
								icon={AlertCircle}
							/>
						</div>
					</div>

					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{tabs.map((tab) => (
							<button
								key={tab.key}
								onClick={() => onTabChange(tab.key)}
								className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
									activeTab === tab.key
										? "bg-gray-50 dark:bg-[#0f1117] text-cyan-700 dark:text-cyan-400"
										: "text-white/70 hover:text-white hover:bg-white/10"
								}`}
							>
								<tab.icon className="w-4 h-4" />
								{tab.label}
							</button>
						))}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{error}
						</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" /> Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-cyan-600" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Bulletins Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your announcements...
						</p>
					</div>
				) : (
					<>
						{/* Search bar and filtering controls layout matched to LibraryUI */}
						<div className="mb-8 flex items-center gap-3">
							<div className="relative group flex-1">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
								<input
									type="text"
									placeholder={
										activeTab === "archive"
											? "Search archive..."
											: "Search announcements..."
									}
									className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm outline-none focus:border-cyan-500 transition-all"
									value={filters.search}
									onChange={(e) =>
										setFilters((prev) => ({
											...prev,
											search: e.target.value,
										}))
									}
								/>
							</div>

							<button
								onClick={() => setIsFilterOpen(true)}
								className="lg:hidden flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-sm transition-all hover:border-cyan-500/50 active:scale-95"
							>
								<SlidersHorizontal className="size-5 text-cyan-600" />
								<span className="hidden sm:inline text-gray-900 dark:text-white">
									Filters
								</span>
							</button>
						</div>

						<div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
							<div className="flex-grow space-y-6">
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
									<h3 className="text-xl font-bold text-gray-800 dark:text-white capitalize tracking-tight">
										{activeTab === "archive"
											? `Archived: ${filters.archiveType.replace("-", " ")}`
											: `${activeTab.replace("-", " ")} Announcements`}
									</h3>

									{/* Action button / Toggle placement matched to LibraryUI logic */}
									{activeTab !== "archive" ? (
										<button
											onClick={() => setIsModalOpen(true)}
											className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 w-full sm:w-auto"
										>
											<Plus className="size-4" /> New Post
										</button>
									) : (
										isFaculty && (
											<div className="flex w-full sm:w-auto p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
												<button
													onClick={() =>
														setFilters((prev) => ({
															...prev,
															archiveType:
																"general",
														}))
													}
													className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${
														filters.archiveType ===
														"general"
															? "bg-cyan-600 text-white shadow-md"
															: "text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400"
													}`}
												>
													<Globe className="size-3.5" />
													General
												</button>
												<button
													onClick={() =>
														setFilters((prev) => ({
															...prev,
															archiveType:
																"faculty-only",
														}))
													}
													className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${
														filters.archiveType ===
														"faculty-only"
															? "bg-cyan-600 text-white shadow-md"
															: "text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400"
													}`}
												>
													<University className="size-3.5" />
													Faculty
												</button>
											</div>
										)
									)}
								</div>

								{showCourseList && activeTab !== "archive" && (
									<div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
										{cohorts.map((cohort) => (
											<button
												key={cohort.id}
												onClick={() =>
													navigate(
														`/c/${cohort.id}/announcements`,
													)
												}
												className="flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 rounded-lg hover:bg-cyan-100 transition-all whitespace-nowrap text-xs font-bold shadow-sm"
											>
												<div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
												{cohort.name}
											</button>
										))}
									</div>
								)}

								<div className="space-y-4">
									{bulletins.length > 0 ? (
										<div className="grid grid-cols-1 gap-4">
											{bulletins.map((bullet) => (
												<BulletinCard
													key={bullet.id}
													bullet={bullet}
													onTogglePin={onTogglePin}
													userRole={userRole}
													isArchive={isArchive}
												/>
											))}
										</div>
									) : (
										<div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
											<Megaphone className="size-12 text-gray-200 dark:text-gray-700 mb-4" />
											<h2 className="text-lg font-bold text-gray-900 dark:text-white">
												{activeTab === "archive"
													? "No Archives Found"
													: "Empty Feed"}
											</h2>
											<p className="text-gray-500 text-sm">
												{activeTab === "archive"
													? "No items match your archived filter."
													: "No announcements match these filters."}
											</p>
										</div>
									)}
								</div>
							</div>

							<aside className="hidden lg:block w-80 shrink-0">
								<BulletinFilterSidebar
									filters={filters}
									setFilters={setFilters}
									cohorts={cohorts}
									isOpen={false}
									onClose={() => setIsFilterOpen(false)}
								/>
							</aside>
						</div>
					</>
				)}
			</main>

			<div className="lg:hidden">
				<BulletinFilterSidebar
					filters={filters}
					setFilters={setFilters}
					cohorts={cohorts}
					isOpen={isFilterOpen}
					onClose={() => setIsFilterOpen(false)}
				/>
			</div>

			<BulletinModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={onSubmit}
				cohorts={cohorts}
				userRole={userRole}
			/>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default BulletinsUI;
