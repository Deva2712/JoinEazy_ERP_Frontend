// src/pages/Bulletins/components/BulletinFilterSidebar.jsx

import React, { useState, useMemo } from "react";
import {
	X,
	SlidersHorizontal,
	Check,
	Megaphone,
	Search,
	ChevronDown,
	Calendar,
	BookOpen,
	AlertCircle,
	Users,
} from "lucide-react";

/**
 * Reusable wrapper for collapsible filter groups in the sidebar.
 */
const FilterSection = ({
	title,
	children,
	defaultOpen = false,
	forceOpen = false,
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen || forceOpen);

	return (
		<div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-3 last:mb-0">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-4 group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
			>
				<span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
					{title}
				</span>
				<ChevronDown
					className={`size-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>
			<div
				className={`px-4 pb-5 space-y-1 ${isOpen ? "block" : "hidden"}`}
			>
				{children}
			</div>
		</div>
	);
};

/**
 * Extracted SidebarContent to prevent re-mounting during parent renders.
 */
const SidebarContent = ({
	filters,
	updateFilter,
	cohorts,
	courseSearch,
	setCourseSearch,
	filteredCohorts,
	hasActiveFilters,
}) => {
	// Extract unique batches from cohorts for the filter options
	const uniqueBatches = useMemo(() => {
		const batches = cohorts
			.map((c) => c.batch)
			.filter((b) => b && b !== "all");

		// Sort descending and remove duplicates
		return [...new Set(batches)].sort((a, b) => b - a);
	}, [cohorts]);

	return (
		<div className="space-y-4">
			{hasActiveFilters && (
				<div className="flex flex-wrap gap-2 mb-4">
					{filters.category !== "all" && (
						<div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
							<span className="text-gray-400 dark:text-gray-500">
								Source:
							</span>
							<span className="text-cyan-600 dark:text-cyan-400 capitalize">
								{filters.category}
							</span>
							<X
								className="size-4 cursor-pointer hover:text-red-500 transition-colors"
								onClick={() => updateFilter("category", "all")}
							/>
						</div>
					)}
					{filters.priority !== "all" && (
						<div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
							<span className="text-gray-400 dark:text-gray-500">
								Priority:
							</span>
							<span className="text-cyan-600 dark:text-cyan-400 capitalize">
								{filters.priority}
							</span>
							<X
								className="size-4 cursor-pointer hover:text-red-500 transition-colors"
								onClick={() => updateFilter("priority", "all")}
							/>
						</div>
					)}
					{filters.dateRange !== "all" && (
						<div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
							<span className="text-gray-400 dark:text-gray-500">
								Time:
							</span>
							<span className="text-cyan-600 dark:text-cyan-400 capitalize">
								{filters.dateRange}
							</span>
							<X
								className="size-4 cursor-pointer hover:text-red-500 transition-colors"
								onClick={() => updateFilter("dateRange", "all")}
							/>
						</div>
					)}
					{filters.course !== "all" && (
						<div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
							<span className="text-gray-400 dark:text-gray-500">
								Course:
							</span>
							<span className="text-cyan-600 dark:text-cyan-400">
								{cohorts.find((c) => c.id === filters.course)
									?.name || "Selected"}
							</span>
							<X
								className="size-4 cursor-pointer hover:text-red-500 transition-colors"
								onClick={() => updateFilter("course", "all")}
							/>
						</div>
					)}
					{filters.batch !== "all" && (
						<div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
							<span className="text-gray-400 dark:text-gray-500">
								Batch:
							</span>
							<span className="text-cyan-600 dark:text-cyan-400">
								{filters.batch}
							</span>
							<X
								className="size-4 cursor-pointer hover:text-red-500 transition-colors"
								onClick={() => updateFilter("batch", "all")}
							/>
						</div>
					)}
				</div>
			)}

			<FilterSection
				title="Source Category"
				defaultOpen={true}
				forceOpen={filters.category !== "all"}
			>
				<div className="grid grid-cols-1 gap-1">
					{[
						{ id: "all", label: "All Sources", icon: Megaphone },
						{
							id: "institution",
							label: "Institution",
							icon: Megaphone,
						},
						{
							id: "department",
							label: "Department",
							icon: Megaphone,
						},
						{ id: "course", label: "Course", icon: Megaphone },
					].map((t) => (
						<button
							key={t.id}
							onClick={() => updateFilter("category", t.id)}
							className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${filters.category === t.id ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 font-bold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
						>
							<span className="flex items-center gap-2.5">
								<t.icon
									className={`size-4 ${filters.category === t.id ? "opacity-100" : "opacity-50"}`}
								/>
								{t.label}
							</span>
							{filters.category === t.id && (
								<Check className="size-4" />
							)}
						</button>
					))}
				</div>
			</FilterSection>

			<FilterSection
				title="Specific Course"
				defaultOpen={false}
				forceOpen={filters.course !== "all"}
			>
				<div className="relative mb-2 group px-1">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
					<input
						type="text"
						placeholder="Search courses..."
						value={courseSearch}
						onChange={(e) => setCourseSearch(e.target.value)}
						className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-transparent focus:border-cyan-500/30 dark:focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 rounded-xl text-sm text-gray-900 dark:text-gray-100 outline-none transition-all"
					/>
				</div>
				<div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto no-scrollbar">
					<button
						onClick={() => updateFilter("course", "all")}
						className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${filters.course === "all" ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 font-bold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
					>
						<span className="flex items-center gap-2.5">
							<BookOpen
								className={`size-4 ${filters.course === "all" ? "opacity-100" : "opacity-50"}`}
							/>
							All Courses
						</span>
						{filters.course === "all" && (
							<Check className="size-4" />
						)}
					</button>
					{filteredCohorts.map((cohort) => (
						<button
							key={cohort.id}
							onClick={() => updateFilter("course", cohort.id)}
							className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${filters.course === cohort.id ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 font-bold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
						>
							<span className="flex items-center gap-2.5">
								<BookOpen
									className={`size-4 ${filters.course === cohort.id ? "opacity-100" : "opacity-50"}`}
								/>
								<span className="truncate w-40 text-left">
									{cohort.name}
								</span>
							</span>
							{filters.course === cohort.id && (
								<Check className="size-4" />
							)}
						</button>
					))}
				</div>
			</FilterSection>

			<FilterSection
				title="Priority Level"
				defaultOpen={false}
				forceOpen={filters.priority !== "all"}
			>
				<div className="grid grid-cols-1 gap-1">
					{[
						{
							id: "all",
							label: "All Priorities",
							icon: AlertCircle,
						},
						{ id: "urgent", label: "Urgent", icon: AlertCircle },
						{ id: "high", label: "High", icon: AlertCircle },
						{ id: "normal", label: "Normal", icon: AlertCircle },
					].map((p) => (
						<button
							key={p.id}
							onClick={() => updateFilter("priority", p.id)}
							className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${filters.priority === p.id ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 font-bold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
						>
							<span className="flex items-center gap-2.5">
								<p.icon
									className={`size-4 ${filters.priority === p.id ? "opacity-100" : "opacity-50"}`}
								/>
								{p.label}
							</span>
							{filters.priority === p.id && (
								<Check className="size-4" />
							)}
						</button>
					))}
				</div>
			</FilterSection>

			<FilterSection
				title="Target Batch"
				defaultOpen={false}
				forceOpen={filters.batch !== "all"}
			>
				<div className="grid grid-cols-1 gap-1">
					<button
						onClick={() => updateFilter("batch", "all")}
						className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${filters.batch === "all" ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 font-bold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
					>
						<span className="flex items-center gap-2.5">
							<Users
								className={`size-4 ${filters.batch === "all" ? "opacity-100" : "opacity-50"}`}
							/>
							All Batches
						</span>
						{filters.batch === "all" && (
							<Check className="size-4" />
						)}
					</button>
					{uniqueBatches.map((batch) => (
						<button
							key={batch}
							onClick={() => updateFilter("batch", batch)}
							className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${filters.batch === batch ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 font-bold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
						>
							<span className="flex items-center gap-2.5">
								<Users
									className={`size-4 ${filters.batch === batch ? "opacity-100" : "opacity-50"}`}
								/>
								Batch {batch}
							</span>
							{filters.batch === batch && (
								<Check className="size-4" />
							)}
						</button>
					))}
				</div>
			</FilterSection>

			<FilterSection
				title="Date Range"
				defaultOpen={false}
				forceOpen={filters.dateRange !== "all"}
			>
				<div className="grid grid-cols-1 gap-1">
					{[
						{ id: "all", label: "All Time", icon: Calendar },
						{ id: "today", label: "Today", icon: Calendar },
						{ id: "week", label: "Last 7 Days", icon: Calendar },
					].map((d) => (
						<button
							key={d.id}
							onClick={() => updateFilter("dateRange", d.id)}
							className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${filters.dateRange === d.id ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 font-bold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
						>
							<span className="flex items-center gap-2.5">
								<d.icon
									className={`size-4 ${filters.dateRange === d.id ? "opacity-100" : "opacity-50"}`}
								/>
								{d.label}
							</span>
							{filters.dateRange === d.id && (
								<Check className="size-4" />
							)}
						</button>
					))}
				</div>
			</FilterSection>
		</div>
	);
};

const BulletinFilterSidebar = ({
	filters,
	setFilters,
	cohorts = [],
	isOpen,
	onClose,
}) => {
	const [courseSearch, setCourseSearch] = useState("");

	const hasActiveFilters =
		filters.category !== "all" ||
		filters.priority !== "all" ||
		filters.dateRange !== "all" ||
		filters.course !== "all";

	const updateFilter = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const resetFilters = () =>
		setFilters({
			search: filters.search,
			category: "all",
			priority: "all",
			dateRange: "all",
			course: "all",
			batch: "all",
		});

	const filteredCohorts = cohorts.filter((cohort) =>
		cohort.name.toLowerCase().includes(courseSearch.toLowerCase()),
	);

	return (
		<>
			<div
				className={`fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
				onClick={onClose}
			/>

			<aside
				className={`fixed bottom-0 right-0 lg:top-0 z-[110] w-full lg:max-w-[320px] bg-white dark:bg-[#0f1117] border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 rounded-t-[2rem] lg:rounded-t-none shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out lg:static lg:transform-none lg:bg-transparent lg:shadow-none lg:border-none ${isOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"}`}
			>
				<div className="p-6 lg:p-0 lg:mb-6 flex items-center justify-between border-b lg:border-none border-gray-200 dark:border-gray-800">
					<div className="flex items-center gap-2.5">
						<SlidersHorizontal className="size-5 text-cyan-600" />
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Filters
						</h2>
					</div>
					<button
						onClick={onClose}
						className="lg:hidden p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400"
					>
						<X className="size-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto max-h-[70vh] lg:max-h-none p-6 lg:p-0 no-scrollbar">
					<SidebarContent
						filters={filters}
						updateFilter={updateFilter}
						cohorts={cohorts}
						courseSearch={courseSearch}
						setCourseSearch={setCourseSearch}
						filteredCohorts={filteredCohorts}
						hasActiveFilters={hasActiveFilters}
					/>
				</div>

				<div className="p-6 bg-white dark:bg-[#0f1117] border-t border-gray-200 dark:border-gray-800 lg:hidden">
					<div className="flex gap-3">
						<button
							onClick={resetFilters}
							className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-red-500 border border-gray-200 dark:border-gray-800 rounded-xl transition-all"
						>
							Reset
						</button>
						<button
							onClick={onClose}
							className="flex-1 py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all"
						>
							Apply Filters
						</button>
					</div>
				</div>
			</aside>
		</>
	);
};

export default BulletinFilterSidebar;
