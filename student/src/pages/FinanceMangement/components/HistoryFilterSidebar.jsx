// src/pages/FinanceManagement/components/HistoryFilterSidebar.jsx

import React, { useState } from "react";
import {
	X,
	SlidersHorizontal,
	ChevronDown,
	Check,
	Layers,
	Calendar,
	Receipt,
	Wallet,
} from "lucide-react";

const FilterSection = ({
	title,
	children,
	defaultOpen = true,
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

const CustomDropdown = ({
	value,
	options,
	onChange,
	icon: Icon,
	placeholder,
}) => (
	<div className="relative group">
		<div className="absolute left-3 top-1/2 -translate-y-1/2">
			<Icon className="size-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
		</div>
		<select
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm font-medium appearance-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all cursor-pointer"
		>
			<option value={placeholder.value}>{placeholder.label}</option>
			{options.map((opt) => (
				<option key={opt} value={opt}>
					{opt}
				</option>
			))}
		</select>
		<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
	</div>
);

const HistoryFilterSidebar = ({
	filters,
	setFilters,
	filterMetadata,
	isOpen,
	onClose,
}) => {
	const hasActiveFilters =
		filters.year !== "all" ||
		filters.month !== "" ||
		filters.type !== "all";

	const updateFilter = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const resetFilters = () =>
		setFilters({
			search: filters.search,
			year: "all",
			month: "",
			type: "all",
		});

	const SidebarContent = () => (
		<div className="space-y-4">
			{/* Active Filter Chips */}
			{hasActiveFilters && (
				<div className="flex flex-wrap gap-2 mb-4">
					{filters.type !== "all" && (
						<div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
							<span className="text-gray-400 dark:text-gray-500">
								Type:
							</span>
							<span className="text-amber-600 dark:text-amber-400 capitalize">
								{filters.type}
							</span>
							<X
								className="size-4 cursor-pointer hover:text-red-500 transition-colors"
								onClick={() => updateFilter("type", "all")}
							/>
						</div>
					)}
					{filters.year !== "all" && (
						<div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
							<span className="text-gray-400 dark:text-gray-500">
								Year:
							</span>
							<span className="text-amber-600 dark:text-amber-400">
								{filters.year}
							</span>
							<X
								className="size-4 cursor-pointer hover:text-red-500 transition-colors"
								onClick={() => updateFilter("year", "all")}
							/>
						</div>
					)}
					{filters.month !== "" && (
						<div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
							<span className="text-gray-400 dark:text-gray-500">
								Month:
							</span>
							<span className="text-amber-600 dark:text-amber-400">
								{filters.month}
							</span>
							<X
								className="size-4 cursor-pointer hover:text-red-500 transition-colors"
								onClick={() => updateFilter("month", "")}
							/>
						</div>
					)}
				</div>
			)}

			<FilterSection
				title="Record Type"
				forceOpen={filters.type !== "all"}
			>
				<div className="grid grid-cols-1 gap-1">
					{[
						{ id: "all", label: "All Records", icon: Layers },
						{ id: "expenses", label: "Expenses", icon: Receipt },
						{ id: "advances", label: "Advances", icon: Wallet },
					].map((t) => (
						<button
							key={t.id}
							onClick={() => updateFilter("type", t.id)}
							className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
								filters.type === t.id
									? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 font-bold"
									: "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
							}`}
						>
							<span className="flex items-center gap-2.5">
								<t.icon
									className={`size-4 ${filters.type === t.id ? "opacity-100" : "opacity-50"}`}
								/>
								{t.label}
							</span>
							{filters.type === t.id && (
								<Check className="size-4" />
							)}
						</button>
					))}
				</div>
			</FilterSection>

			<div className="space-y-4 pt-2">
				<div className="px-1">
					<h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
						Filter by Year
					</h3>
					<CustomDropdown
						value={filters.year}
						options={filterMetadata.years}
						onChange={(val) => updateFilter("year", val)}
						icon={Calendar}
						placeholder={{ label: "All Years", value: "all" }}
					/>
				</div>

				<div className="px-1">
					<h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
						Filter by Month
					</h3>
					<CustomDropdown
						value={filters.month}
						options={filterMetadata.months}
						onChange={(val) => updateFilter("month", val)}
						icon={Calendar}
						placeholder={{ label: "Any Month", value: "" }}
					/>
				</div>
			</div>
		</div>
	);

	return (
		<>
			<div
				className={`fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
				onClick={onClose}
			/>

			<aside
				className={`
                    fixed bottom-0 right-0 lg:top-0 z-[110] w-full max-w-full lg:max-w-[320px] bg-white dark:bg-[#0f1117]
                    border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 rounded-t-[2rem] lg:rounded-t-none shadow-2xl flex flex-col 
                    transform transition-transform duration-500 ease-in-out lg:static lg:transform-none lg:bg-transparent lg:shadow-none lg:border-none
                    ${isOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"}
                `}
			>
				{/* Header Section */}
				<div className="p-6 lg:p-0 lg:mb-6 flex items-center justify-between border-b lg:border-none border-gray-200 dark:border-gray-800">
					<div className="flex items-center gap-2.5">
						<SlidersHorizontal className="size-5 text-amber-600" />
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

				<div className="flex-1 overflow-y-auto max-h-[70vh] lg:max-h-none p-6 no-scrollbar lg:p-0">
					<SidebarContent />
				</div>

				{/* Mobile Footer */}
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
							className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all"
						>
							Apply Filters
						</button>
					</div>
				</div>
			</aside>
		</>
	);
};

export default HistoryFilterSidebar;
