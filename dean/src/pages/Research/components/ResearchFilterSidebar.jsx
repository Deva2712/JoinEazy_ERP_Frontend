// src/pages/Research/components/ResearchFilterSidebar.jsx

import React, { useState, useMemo, useEffect } from "react";
import {
	SlidersHorizontal,
	Check,
	ChevronDown,
	RotateCcw,
	X,
	Globe,
	Search,
} from "lucide-react";

const FilterSection = ({
	title,
	children,
	defaultOpen = true,
	forceOpen = false,
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	useEffect(() => {
		if (forceOpen) setIsOpen(true);
	}, [forceOpen]);

	return (
		<div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-3 last:mb-0">
			<button
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
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
				className={`px-4 pb-5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-300 ${isOpen ? "block" : "hidden"}`}
			>
				{children}
			</div>
		</div>
	);
};

const ResearchFilterSidebar = ({
	filters,
	setFilters,
	showTypeFilters = false,
	showStatusFilters = true,
	showCollabFilters = true,
	showCategoryFilters = true,
	showTimelineFilters = true,
	counts = { projects: 0, publications: 0 },
	availableCategories = [],
	availableYears = [],
	isOpen = false,
	onClose,
}) => {
	const [categorySearch, setCategorySearch] = useState("");

	const filteredCategories = useMemo(() => {
		if (!categorySearch) return availableCategories;
		return availableCategories.filter((cat) =>
			cat.toLowerCase().includes(categorySearch.toLowerCase()),
		);
	}, [categorySearch, availableCategories]);

	const activeFiltersCount = useMemo(() => {
		let count = 0;
		if (filters.status !== "all") count++;
		if (filters.sortBy !== "newest") count++;
		if (filters.category !== "all") count++;
		if (filters.collaborationType !== "all") count++;
		if (filters.year !== "all") count++;
		if (!filters.showProjects || !filters.showPublications) count++;
		return count;
	}, [filters]);

	const hasVisibleChips = useMemo(() => {
		return (
			filters.status !== "all" ||
			filters.category !== "all" ||
			filters.collaborationType !== "all" ||
			filters.year !== "all" ||
			filters.sortBy !== "newest"
		);
	}, [filters]);

	const updateFilter = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const toggleFilter = (key) => {
		setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const resetFilters = () => {
		setFilters({
			status: "all",
			sortBy: "newest",
			showProjects: true,
			showPublications: true,
			category: "all",
			collaborationType: "all",
			year: "all",
		});
		setCategorySearch("");
	};

	return (
		<>
			<div
				className={`fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
				onClick={onClose}
			/>

			<aside
				className={`
                    fixed bottom-0 right-0 md:top-0 z-[110] w-full max-w-full md:max-w-[380px] md:h-full bg-white dark:bg-[#0f1117] 
                    border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 rounded-t-[2rem] md:rounded-t-none shadow-2xl flex flex-col 
                    transform transition-transform duration-500 ease-in-out
                    ${isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}
                `}
			>
				{/* Header Section */}
				<div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
					<div className="flex items-center gap-2.5">
						<SlidersHorizontal className="size-5 text-emerald-700" />
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
					</div>
					<div className="flex items-center gap-4">
						{/* {activeFiltersCount > 0 && (
							<button
								onClick={resetFilters}
								className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-500 active:scale-95 transition-all"
							>
								<RotateCcw className="size-4" strokeWidth={2} />
								Clear All
							</button>
						)} */}
						<button
							onClick={onClose}
							className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-200 transition-colors"
						>
							<X className="size-5" />
						</button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
					{hasVisibleChips && (
						<div className="flex flex-wrap gap-2 mb-4">
							{filters.status !== "all" && (
								<div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
									<span className="text-gray-400 dark:text-gray-500">
										Status:
									</span>
									<span className="text-emerald-700 dark:text-emerald-400 capitalize">
										{filters.status}
									</span>
									<X
										className="size-4 cursor-pointer text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
										onClick={() =>
											updateFilter("status", "all")
										}
									/>
								</div>
							)}
							{filters.category !== "all" && (
								<div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
									<span className="text-gray-400 dark:text-gray-500">Category:</span>
									<span className="text-emerald-700 dark:text-emerald-400 capitalize">
										{filters.category}
									</span>
									<X
										className="size-4 cursor-pointer text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
										onClick={() =>
											updateFilter("category", "all")
										}
									/>
								</div>
							)}
							{filters.collaborationType !== "all" && (
								<div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
									<span className="text-gray-400 dark:text-gray-500">Mode:</span>
									<span className="text-emerald-700 dark:text-emerald-400 capitalize">
										{filters.collaborationType}
									</span>
									<X
										className="size-4 cursor-pointer text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
										onClick={() =>
											updateFilter(
												"collaborationType",
												"all",
											)
										}
									/>
								</div>
							)}
							{filters.year !== "all" && (
								<div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
									<span className="text-gray-400 dark:text-gray-500">Year:</span>
									<span className="text-emerald-700 dark:text-emerald-400 capitalize">
										{filters.year}
									</span>
									<X
										className="size-4 cursor-pointer text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
										onClick={() =>
											updateFilter("year", "all")
										}
									/>
								</div>
							)}
							{filters.sortBy !== "newest" && (
								<div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
									<span className="text-gray-400 dark:text-gray-500">Sort:</span>
									<span className="text-emerald-700 dark:text-emerald-400 capitalize">
										{filters.sortBy}
									</span>
									<X
										className="size-4 cursor-pointer text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
										onClick={() =>
											updateFilter("sortBy", "newest")
										}
									/>
								</div>
							)}
						</div>
					)}

					<div className="pb-4">
						<FilterSection
							title="Sort Results"
							defaultOpen={true}
							forceOpen={filters.sortBy !== "newest"}
						>
							<div className="grid grid-cols-1 gap-1">
								{[
									{ id: "newest", label: "Newest First" },
									{ id: "stars", label: "Most Popular" },
									{ id: "relevance", label: "Most Relevant" },
								].map((sort) => (
									<button
										key={sort.id}
										onClick={() =>
											updateFilter("sortBy", sort.id)
										}
										className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${filters.sortBy === sort.id ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 font-bold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
									>
										{sort.label}
										{filters.sortBy === sort.id && (
											<Check className="size-4" />
										)}
									</button>
								))}
							</div>
						</FilterSection>

						{showTypeFilters && (
							<FilterSection
								title="Content Type"
								defaultOpen={true}
								forceOpen={
									!filters.showProjects ||
									!filters.showPublications
								}
							>
								{[
									{
										id: "showProjects",
										label: "Projects",
										count: counts.projects,
									},
									{
										id: "showPublications",
										label: "Publications",
										count: counts.publications,
									},
								].map((type) => (
									<label
										key={type.id}
										className="flex items-center justify-between group cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all"
									>
										<div className="flex items-center gap-3">
											<div
												className={`size-5 rounded-md border transition-all flex items-center justify-center ${filters[type.id] ? "bg-emerald-500 border-emerald-500" : "border-gray-300 dark:border-gray-700"}`}
											>
												<input
													type="checkbox"
													className="hidden"
													checked={filters[type.id]}
													onChange={() =>
														toggleFilter(type.id)
													}
												/>
												{filters[type.id] && (
													<Check className="size-3.5 text-white stroke-[3px]" />
												)}
											</div>
											<span
												className={`text-sm ${filters[type.id] ? "text-gray-900 dark:text-gray-100 font-semibold" : "text-gray-500 dark:text-gray-400"}`}
											>
												{type.label}
											</span>
										</div>
										<span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-400 dark:text-gray-500">
											{type.count}
										</span>
									</label>
								))}
							</FilterSection>
						)}

						{showCategoryFilters && (
							<FilterSection
								title="Category"
								defaultOpen={false}
								forceOpen={
									filters.category !== "all" ||
									categorySearch.length > 0
								}
							>
								<div className="relative mb-2 group px-1">
									<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
									<input
										type="text"
										placeholder="Search categories..."
										value={categorySearch}
										onChange={(e) =>
											setCategorySearch(e.target.value)
										}
										className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent focus:border-emerald-500/30 dark:focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-xl text-sm text-gray-900 dark:text-gray-100 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
									/>
								</div>
								<div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto no-scrollbar">
									{categorySearch === "" && (
										<button
											onClick={() =>
												updateFilter("category", "all")
											}
											className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${filters.category === "all" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
										>
											All Categories
											{filters.category === "all" && (
												<Check className="size-4" />
											)}
										</button>
									)}
									{filteredCategories.map((cat) => (
										<button
											key={cat}
											onClick={() =>
												updateFilter("category", cat)
											}
											className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${filters.category === cat ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
										>
											<span className="truncate pr-2">
												{cat}
											</span>
											{filters.category === cat && (
												<Check className="size-4 shrink-0" />
											)}
										</button>
									))}
								</div>
							</FilterSection>
						)}

						{showStatusFilters && (
							<FilterSection
								title="Role Openings"
								defaultOpen={false}
								forceOpen={filters.status !== "all"}
							>
								<div className="grid grid-cols-1 gap-1">
									{[
										{ id: "all", label: "Any Status" },
										{ id: "Open", label: "Open Roles" },
										{ id: "Closed", label: "Closed" },
									].map((status) => (
										<button
											key={status.id}
											onClick={() =>
												updateFilter(
													"status",
													status.id,
												)
											}
											className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${filters.status === status.id ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 font-bold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
										>
											{status.label}
											{filters.status === status.id && (
												<Check className="size-4" />
											)}
										</button>
									))}
								</div>
							</FilterSection>
						)}

						{showTimelineFilters && (
							<FilterSection
								title="Timeline"
								defaultOpen={false}
								forceOpen={filters.year !== "all"}
							>
								<div className="flex gap-2 overflow-x-auto no-scrollbar px-1">
									<button
										onClick={() =>
											updateFilter("year", "all")
										}
										className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
											filters.year === "all"
												? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
													: "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-gray-700"
										}`}
									>
										All Time
									</button>
									{availableYears.map((year) => (
										<button
											key={year}
											onClick={() =>
												updateFilter("year", year)
											}
											className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
												filters.year === year
													? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
													: "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-gray-700"
										}`}
									>
										{year}
									</button>
									))}
								</div>
							</FilterSection>
						)}

						{showCollabFilters && (
							<FilterSection
								title="Collaboration"
								defaultOpen={false}
								forceOpen={filters.collaborationType !== "all"}
							>
								<div className="grid grid-cols-1 gap-1">
									{[
										"Remote",
										"Hybrid",
										"In-person",
										"On-site (Lab)",
									].map((mode) => (
										<button
											key={mode}
											onClick={() =>
												updateFilter(
													"collaborationType",
													mode,
												)
											}
											className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${filters.collaborationType === mode ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 font-bold" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
										>
											<span className="flex items-center gap-2">
												<Globe className="size-3.5 opacity-50" />
												{mode}
											</span>
											{filters.collaborationType ===
												mode && (
												<Check className="size-4" />
											)}
										</button>
									))}
								</div>
							</FilterSection>
						)}
					</div>
				</div>

				{/* Footer Actions */}
				<div className="p-6 bg-white dark:bg-[#0f1117] border-t border-gray-200 dark:border-gray-800">
					<div className="flex gap-3">
						{activeFiltersCount > 0 && (
						<button
							onClick={resetFilters}
							className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-red-500 border border-gray-200 dark:border-gray-800 rounded-xl transition-all active:bg-gray-50 dark:active:bg-gray-800"
						>
							Clear All
						</button>
						)}
						<button
							onClick={onClose}
							className="flex-1 py-3 bg-emerald-700 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all"
						>
							Apply Filters
						</button>
					</div>
				</div>
			</aside>
		</>
	);
};

export default ResearchFilterSidebar;