// src/pages/Mentoring/components/MentoringFilterSidebar.jsx

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, Check, ChevronDown, X } from "lucide-react";

/**
 * Reusable wrapper for individual filter categories with toggle functionality
 */
const FilterSection = ({ title, children, defaultOpen = true }) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	return (
		<div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-3 last:mb-0">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
			>
				<span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
					{title}
				</span>
				<ChevronDown
					className={`size-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
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

const MentoringFilterSidebar = ({
	filters,
	setFilters,
	isOpen,
	onClose,
	departments = [],
}) => {
	const activeFiltersCount = useMemo(() => {
		let count = 0;
		if (filters.riskLevel !== "all") count++;
		if (filters.attendance !== "all") count++;
		if (filters.department !== "all") count++;
		if (filters.semester !== "all") count++;
		if (filters.hasBacklogs) count++;
		if (filters.cgpaRange !== "all") count++;
		if (filters.missedMeetings) count++;
		if (filters.requestedMeetings) count++;
		return count;
	}, [filters]);

	const updateFilter = (key, value) =>
		setFilters((prev) => ({ ...prev, [key]: value }));

	const resetFilters = () => {
		setFilters({
			riskLevel: "all",
			attendance: "all",
			department: "all",
			semester: "all",
			hasBacklogs: false,
			cgpaRange: "all",
			missedMeetings: false,
			requestedMeetings: false,
		});
	};

	// Helper to get labels for mapped values
	const getCGPALabel = (id) => {
		if (id === "warning") return "Warning (5.0 - 6.5)";
		if (id === "critical") return "Critical (< 5.0)";
		return id;
	};

	const getAttendanceLabel = (id) => {
		if (id === "borderline") return "Warning (75-80%)";
		if (id === "low") return "Critical (< 75%)";
		return id;
	};

	return (
		<>
			<div
				className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
				onClick={onClose}
			/>

			<aside
				className={`fixed bottom-0 right-0 md:top-0 z-[110] w-full max-w-full md:max-w-[380px] md:h-full max-h-[85vh] md:max-h-full bg-white dark:bg-[#0f1117] border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 rounded-t-[2rem] md:rounded-t-none shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${
					isOpen
						? "translate-y-0 md:translate-x-0"
						: "translate-y-full md:translate-y-0 md:translate-x-full"
				}`}
			>
				<div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
					<div className="flex items-center gap-2.5">
						<SlidersHorizontal className="size-5 text-sky-600" />
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Filters
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500"
					>
						<X className="size-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
					{/* Active Filter Chips - Consistent Design */}
					{activeFiltersCount > 0 && (
						<div className="flex flex-wrap gap-2 mb-2">
							{filters.department !== "all" && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 text-[11px] font-bold rounded-xl border border-sky-100 dark:border-sky-800/50">
									<span>{filters.department}</span>
									<X
										className="size-3 cursor-pointer hover:text-red-500"
										onClick={() =>
											updateFilter("department", "all")
										}
									/>
								</div>
							)}
							{filters.semester !== "all" && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 text-[11px] font-bold rounded-xl border border-sky-100 dark:border-sky-800/50">
									<span>Sem {filters.semester}</span>
									<X
										className="size-3 cursor-pointer hover:text-red-500"
										onClick={() =>
											updateFilter("semester", "all")
										}
									/>
								</div>
							)}
							{filters.riskLevel !== "all" && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 text-[11px] font-bold rounded-xl border border-sky-100 dark:border-sky-800/50">
									<span>{filters.riskLevel}</span>
									<X
										className="size-3 cursor-pointer hover:text-red-500"
										onClick={() =>
											updateFilter("riskLevel", "all")
										}
									/>
								</div>
							)}
							{filters.cgpaRange !== "all" && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 text-[11px] font-bold rounded-xl border border-sky-100 dark:border-sky-800/50">
									<span>
										GPA: {getCGPALabel(filters.cgpaRange)}
									</span>
									<X
										className="size-3 cursor-pointer hover:text-red-500"
										onClick={() =>
											updateFilter("cgpaRange", "all")
										}
									/>
								</div>
							)}
							{filters.attendance !== "all" && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 text-[11px] font-bold rounded-xl border border-sky-100 dark:border-sky-800/50">
									<span>
										Attendance:{" "}
										{getAttendanceLabel(filters.attendance)}
									</span>
									<X
										className="size-3 cursor-pointer hover:text-red-500"
										onClick={() =>
											updateFilter("attendance", "all")
										}
									/>
								</div>
							)}
							{filters.hasBacklogs && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 text-[11px] font-bold rounded-xl border border-sky-100 dark:border-sky-800/50">
									<span>Backlogs</span>
									<X
										className="size-3 cursor-pointer hover:text-red-500"
										onClick={() =>
											updateFilter("hasBacklogs", false)
										}
									/>
								</div>
							)}
							{filters.missedMeetings && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 text-[11px] font-bold rounded-xl border border-sky-100 dark:border-sky-800/50">
									<span>Missed Meeting</span>
									<X
										className="size-3 cursor-pointer hover:text-red-500"
										onClick={() =>
											updateFilter(
												"missedMeetings",
												false,
											)
										}
									/>
								</div>
							)}
							{filters.requestedMeetings && (
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 text-[11px] font-bold rounded-xl border border-sky-100 dark:border-sky-800/50">
									<span>Requested Meeting</span>
									<X
										className="size-3 cursor-pointer hover:text-red-500"
										onClick={() =>
											updateFilter(
												"requestedMeetings",
												false,
											)
										}
									/>
								</div>
							)}
						</div>
					)}

					<FilterSection title="Department">
						<div className="grid grid-cols-1 gap-1">
							{["all", ...departments].map((dept) => (
								<button
									key={dept}
									onClick={() =>
										updateFilter("department", dept)
									}
									className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm ${filters.department === dept ? "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 font-bold" : "text-gray-500 hover:bg-gray-50"}`}
								>
									<span className="capitalize">
										{dept === "all"
											? "All Departments"
											: dept}
									</span>
									{filters.department === dept && (
										<Check className="size-4" />
									)}
								</button>
							))}
						</div>
					</FilterSection>

					<FilterSection title="Semester">
						<div className="grid grid-cols-4 gap-2">
							{[
								"all",
								"1",
								"2",
								"3",
								"4",
								"5",
								"6",
								"7",
								"8",
							].map((sem) => (
								<button
									key={sem}
									onClick={() =>
										updateFilter("semester", sem)
									}
									className={`py-2 rounded-lg text-xs font-bold transition-all ${filters.semester === sem ? "bg-sky-600 text-white" : "bg-transparent border border-gray-200 dark:border-gray-700 text-gray-500"}`}
								>
									{sem === "all" ? "All" : `S${sem}`}
								</button>
							))}
						</div>
					</FilterSection>

					<FilterSection title="Risk Status">
						{["all", "At Risk", "No Risk"].map((level) => (
							<button
								key={level}
								onClick={() => updateFilter("riskLevel", level)}
								className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm ${filters.riskLevel === level ? "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 font-bold" : "text-gray-500 hover:bg-gray-50"}`}
							>
								<span className="capitalize">
									{level === "all" ? "All Students" : level}
								</span>
								{filters.riskLevel === level && (
									<Check className="size-4" />
								)}
							</button>
						))}
					</FilterSection>
					
					<FilterSection title="Priority Flags">
						<div className="space-y-2">
							<div
								onClick={() =>
									updateFilter(
										"hasBacklogs",
										!filters.hasBacklogs,
									)
								}
								className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${filters.hasBacklogs ? "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800" : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-transparent"}`}
							>
								<span
									className={`text-sm ${filters.hasBacklogs ? "text-sky-700 dark:text-sky-400 font-bold" : "text-gray-700 dark:text-gray-300"}`}
								>
									Active Backlogs
								</span>
								<div
									className={`size-5 rounded border flex items-center justify-center transition-colors ${filters.hasBacklogs ? "bg-sky-500 border-sky-500" : "border-gray-300 dark:border-gray-600"}`}
								>
									{filters.hasBacklogs && (
										<Check className="size-3.5 text-white stroke-[3px]" />
									)}
								</div>
							</div>

							<div
								onClick={() =>
									updateFilter(
										"missedMeetings",
										!filters.missedMeetings,
									)
								}
								className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${filters.missedMeetings ? "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800" : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-transparent"}`}
							>
								<span
									className={`text-sm ${filters.missedMeetings ? "text-sky-700 dark:text-sky-400 font-bold" : "text-gray-700 dark:text-gray-300"}`}
								>
									Missed Meetings
								</span>
								<div
									className={`size-5 rounded border flex items-center justify-center transition-colors ${filters.missedMeetings ? "bg-sky-500 border-sky-500" : "border-gray-300 dark:border-gray-600"}`}
								>
									{filters.missedMeetings && (
										<Check className="size-3.5 text-white stroke-[3px]" />
									)}
								</div>
							</div>

							<div
								onClick={() =>
									updateFilter(
										"requestedMeetings",
										!filters.requestedMeetings,
									)
								}
								className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${filters.requestedMeetings ? "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800" : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-transparent"}`}
							>
								<span
									className={`text-sm ${filters.requestedMeetings ? "text-sky-700 dark:text-sky-400 font-bold" : "text-gray-700 dark:text-gray-300"}`}
								>
									Requested Meetings
								</span>
								<div
									className={`size-5 rounded border flex items-center justify-center transition-colors ${filters.requestedMeetings ? "bg-sky-500 border-sky-500" : "border-gray-300 dark:border-gray-600"}`}
								>
									{filters.requestedMeetings && (
										<Check className="size-3.5 text-white stroke-[3px]" />
									)}
								</div>
							</div>
						</div>
					</FilterSection>

					<FilterSection title="Academic Performance">
						{[
							{ id: "all", label: "Any CGPA" },
							{ id: "warning", label: "Warning (5.0 - 6.5)" },
							{ id: "critical", label: "Critical (< 5.0)" },
						].map((opt) => (
							<button
								key={opt.id}
								onClick={() =>
									updateFilter("cgpaRange", opt.id)
								}
								className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm ${filters.cgpaRange === opt.id ? "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 font-bold" : "text-gray-500"}`}
							>
								{opt.label}
								{filters.cgpaRange === opt.id && (
									<Check className="size-4" />
								)}
							</button>
						))}
					</FilterSection>

					<FilterSection title="Attendance Range">
						{[
							{ id: "all", label: "Any Attendance" },
							{ id: "borderline", label: "Warning (75-80%)" },
							{ id: "low", label: "Critical (< 75%)" },
						].map((opt) => (
							<button
								key={opt.id}
								onClick={() =>
									updateFilter("attendance", opt.id)
								}
								className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm ${filters.attendance === opt.id ? "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 font-bold" : "text-gray-500"}`}
							>
								{opt.label}
								{filters.attendance === opt.id && (
									<Check className="size-4" />
								)}
							</button>
						))}
					</FilterSection>
				</div>

				<div className="p-6 border-t border-gray-200 dark:border-gray-800 flex gap-3">
					{activeFiltersCount > 0 && (
						<button
							onClick={resetFilters}
							className="flex-1 py-3 text-sm font-bold text-gray-500 border border-gray-200 rounded-xl"
						>
							Clear
						</button>
					)}
					<button
						onClick={onClose}
						className="flex-1 py-3 bg-sky-700 text-white rounded-xl font-bold"
					>
						Apply Filters
					</button>
				</div>
			</aside>
		</>
	);
};

export default MentoringFilterSidebar;
