// src/pages/Library/components/LibraryFilterSidebar.jsx

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, Check, ChevronDown, X, Search } from "lucide-react";

/**
 * Reusable wrapper for individual filter categories with toggle functionality
 */
const FilterSection = ({ title, children, defaultOpen = true }) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	return (
		<div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-3">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-4 group hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
			>
				<span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
					{title}
				</span>
				<ChevronDown
					className={`size-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>
			<div className={`px-4 pb-5 ${isOpen ? "block" : "hidden"}`}>
				{children}
			</div>
		</div>
	);
};

const LibraryFilterSidebar = ({
	filters,
	setFilters,
	availableCategories = [],
	availableAuthors = [],
	isOpen,
	onClose,
}) => {
	const [categorySearch, setCategorySearch] = useState("");
	const [authorSearch, setAuthorSearch] = useState("");

	const filteredCategories = useMemo(
		() =>
			availableCategories.filter((cat) =>
				cat.toLowerCase().includes(categorySearch.toLowerCase()),
			),
		[availableCategories, categorySearch],
	);

	const filteredAuthors = useMemo(
		() =>
			availableAuthors.filter((author) =>
				author.toLowerCase().includes(authorSearch.toLowerCase()),
			),
		[availableAuthors, authorSearch],
	);

	/**
	 * Calculates how many filters are currently active (not set to "all")
	 */
	const activeFiltersCount = useMemo(() => {
		let count = 0;
		if (filters.category !== "all") count++;
		if (filters.author !== "all") count++;
		if (filters.status !== "all") count++;
		if (filters.condition !== "all") count++;
		if (filters.availability !== "all") count++;
		return count;
	}, [filters]);

	const updateFilter = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const resetFilters = () => {
		setFilters({
			category: "all",
			author: "all",
			status: "all",
			condition: "all",
			availability: "all",
		});
	};

	return (
		<>
			{/* Sidebar Backdrop */}
			<div
				className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
				onClick={onClose}
			/>

			{/* Sidebar Container */}
			<aside
				className={`fixed bottom-0 right-0 md:top-0 z-[110] w-full max-w-full md:max-w-[380px] md:h-full max-h-[85vh] md:max-h-full bg-white dark:bg-[#0f1117] border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 rounded-t-[2rem] md:rounded-t-none shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${
					isOpen
						? "translate-y-0 md:translate-x-0"
						: "translate-y-full md:translate-y-0 md:translate-x-full"
				}`}
			>
				{/* Header */}
				<div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
					<div className="flex items-center gap-2.5">
						<SlidersHorizontal className="size-5 text-emerald-600" />
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Library Filters
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-red-500 transition-colors"
					>
						<X className="size-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
					{/* Active Filter Chips */}
					{activeFiltersCount > 0 && (
						<div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-top-1 duration-300">
							{filters.category !== "all" && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
									<span className="text-gray-400 uppercase tracking-tighter">Cat:</span>
									<span className="text-gray-700 dark:text-gray-200">{filters.category}</span>
									<X className="size-3 cursor-pointer hover:text-red-500 transition-colors" onClick={() => updateFilter("category", "all")} />
								</div>
							)}
							{filters.author !== "all" && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
									<span className="text-gray-400 uppercase tracking-tighter">Author:</span>
									<span className="text-gray-700 dark:text-gray-200">{filters.author}</span>
									<X className="size-3 cursor-pointer hover:text-red-500 transition-colors" onClick={() => updateFilter("author", "all")} />
								</div>
							)}
							{filters.status !== "all" && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
									<span className="text-gray-700 dark:text-gray-200 capitalize">{filters.status}</span>
									<X className="size-3 cursor-pointer hover:text-red-500 transition-colors" onClick={() => updateFilter("status", "all")} />
								</div>
							)}
							{filters.availability !== "all" && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-bold rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
									<span className="text-gray-700 dark:text-gray-200">{filters.availability === "available" ? "In Stock" : "Borrowed"}</span>
									<X className="size-3 cursor-pointer hover:text-red-500 transition-colors" onClick={() => updateFilter("availability", "all")} />
								</div>
							)}
						</div>
					)}

					<FilterSection title="Availability">
						<div className="flex flex-wrap gap-2">
							{["all", "available", "borrowed"].map((opt) => (
								<button
									key={opt}
									onClick={() => updateFilter("availability", opt)}
									className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
										filters.availability === opt
											? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
											: "bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50"
									}`}
								>
									{opt}
								</button>
							))}
						</div>
					</FilterSection>

					<FilterSection title="Categories">
						<div className="relative mb-3">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
							<input
								type="text"
								placeholder="Search categories..."
								value={categorySearch}
								onChange={(e) => setCategorySearch(e.target.value)}
								className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm outline-none border border-transparent focus:border-emerald-500/30"
							/>
						</div>
						<div className="max-h-40 overflow-y-auto pr-1 no-scrollbar space-y-1">
							<button
								onClick={() => updateFilter("category", "all")}
								className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm ${filters.category === "all" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold" : "text-gray-500 hover:bg-gray-50"}`}
							>
								<span>All Categories</span>
								{filters.category === "all" && <Check className="size-4" />}
							</button>
							{filteredCategories.map((cat) => (
								<button
									key={cat}
									onClick={() => updateFilter("category", cat)}
									className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm ${filters.category === cat ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold" : "text-gray-500 hover:bg-gray-50"}`}
								>
									<span>{cat}</span>
									{filters.category === cat && <Check className="size-4" />}
								</button>
							))}
						</div>
					</FilterSection>

					<FilterSection title="Authors">
						<div className="relative mb-3">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
							<input
								type="text"
								placeholder="Search authors..."
								value={authorSearch}
								onChange={(e) => setAuthorSearch(e.target.value)}
								className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm outline-none border border-transparent focus:border-emerald-500/30"
							/>
						</div>
						<div className="max-h-40 overflow-y-auto pr-1 no-scrollbar space-y-1">
							<button
								onClick={() => updateFilter("author", "all")}
								className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm ${filters.author === "all" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold" : "text-gray-500 hover:bg-gray-50"}`}
							>
								<span>All Authors</span>
								{filters.author === "all" && <Check className="size-4" />}
							</button>
							{filteredAuthors.map((author) => (
								<button
									key={author}
									onClick={() => updateFilter("author", author)}
									className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm ${filters.author === author ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold" : "text-gray-500 hover:bg-gray-50"}`}
								>
									<span>{author}</span>
									{filters.author === author && <Check className="size-4" />}
								</button>
							))}
						</div>
					</FilterSection>
				</div>

				{/* Footer Actions */}
				<div className="p-6 border-t border-gray-200 dark:border-gray-800 flex gap-3 bg-white dark:bg-[#0f1117]">
					{activeFiltersCount > 0 && (
						<button
							onClick={resetFilters}
							className="flex-1 py-3 text-sm font-bold text-gray-500 border border-gray-200 dark:border-gray-800 rounded-xl hover:text-red-500 transition-colors"
						>
							Clear All
						</button>
					)}
					<button
						onClick={onClose}
						className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
					>
						Apply
					</button>
				</div>
			</aside>
		</>
	);
};

export default LibraryFilterSidebar;