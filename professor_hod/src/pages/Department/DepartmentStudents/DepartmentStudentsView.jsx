// src/pages/Department/DepartmentStudents/DepartmentStudentsView.jsx

import React, { useMemo, useState } from "react";
import { Search, X, ArrowLeft, ChevronDown } from "lucide-react";
import { useDepartment } from "../../../context/DepartmentContext";
import DepartmentStudentCard from "./components/DepartmentStudentCard";
import DepartmentBatchCard from "./components/DepartmentBatchCard";

const DepartmentStudentsView = ({ onStudentClick }) => {
	const { state, actions } = useDepartment();
	const { students, filters } = state;
	const [selectedBatch, setSelectedBatch] = useState(null);
	const [selectedSection, setSelectedSection] = useState("All");

	/**
	 * Group students by batch and calculate aggregate academic metrics.
	 * Tracks unique sections across the entire batch using a Set.
	 */
	const batchData = useMemo(() => {
		const groups = students.reduce((acc, student) => {
			const b = student.batch;
			if (!acc[b]) {
				acc[b] = {
					count: 0,
					totalCgpa: 0,
					totalAttendance: 0,
					sections: new Set(),
				};
			}

			acc[b].count += 1;
			acc[b].totalCgpa += student.academicMetrics.cgpa;
			acc[b].totalAttendance += student.academicMetrics.attendance;

			if (student.section) {
				acc[b].sections.add(student.section);
			}

			return acc;
		}, {});

		return Object.entries(groups).map(([batch, stats]) => ({
			batch,
			count: stats.count,
			avgCgpa: (stats.totalCgpa / stats.count).toFixed(2),
			avgAttendance: Math.round(stats.totalAttendance / stats.count),
			uniqueSections: stats.sections.size,
			sectionsList: Array.from(stats.sections).sort(),
		}));
	}, [students]);

	/**
	 * Returns the list of unique sections for the currently selected batch
	 */
	const availableSections = useMemo(() => {
		if (!selectedBatch) return ["All"];
		const batch = batchData.find((b) => b.batch === selectedBatch);
		return ["All", ...(batch?.sectionsList || [])];
	}, [selectedBatch, batchData]);

	/**
	 * Filter logic for searching specific students within a batch or globally.
	 * Includes section-specific filtering when a batch is active.
	 */
	const filteredStudents = useMemo(() => {
		const query = filters.searchQuery.toLowerCase();
		let list = students;

		if (selectedBatch) {
			list = list.filter((s) => s.batch === selectedBatch);

			if (selectedSection !== "All") {
				list = list.filter((s) => s.section === selectedSection);
			}
		}

		return list.filter(
			(student) =>
				student.name.toLowerCase().includes(query) ||
				student.studentId.toLowerCase().includes(query),
		);
	}, [students, filters.searchQuery, selectedBatch, selectedSection]);

	const handleBackToBatches = () => {
		setSelectedBatch(null);
		setSelectedSection("All");
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Search and Filter Controls */}
			<div className="flex flex-col md:flex-row items-center gap-3">
				<div className="relative group flex-1 w-full">
					<Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
					<input
						type="text"
						placeholder={
							selectedBatch
								? `Search in ${selectedBatch} batch...`
								: "Search by name or roll number..."
						}
						value={filters.searchQuery}
						onChange={(e) => actions.setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm outline-none focus:border-violet-500 transition-all"
					/>
					{filters.searchQuery && (
						<button
							onClick={() => actions.setSearchQuery("")}
							className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
						>
							<X className="size-4" />
						</button>
					)}
				</div>

				{/* Section Filter Dropdown - Only visible when a batch is selected */}
				{selectedBatch && (
					<div className="relative group w-full md:w-auto">
						<select
							value={selectedSection}
							onChange={(e) => setSelectedSection(e.target.value)}
							className="w-full pl-4 pr-10 py-3 font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none appearance-none shadow-sm hover:border-violet-500/50 transition-all cursor-pointer"
						>
							{availableSections.map((sec) => (
								<option key={sec} value={sec}>
									{sec === "All"
										? "All Sections"
										: `Section ${sec}`}
								</option>
							))}
						</select>
						<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
					</div>
				)}
			</div>

			<main className="flex-1 space-y-5">
				{!selectedBatch && !filters.searchQuery ? (
					/**
					 * Initial View: List of available batches
					 */
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{batchData.map((group) => (
							<DepartmentBatchCard
								key={group.batch}
								{...group}
								onClick={() => setSelectedBatch(group.batch)}
							/>
						))}
					</div>
				) : (
					/**
					 * Drill-down View: List of students in selected batch or search results
					 */
					<div className="space-y-5">
						{selectedBatch && (
							<div className="flex items-center gap-3">
								<button
									onClick={handleBackToBatches}
									className="flex items-center justify-center size-8 rounded-xl text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-sm transition-all"
								>
									<ArrowLeft className="size-4" />
								</button>
								<h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
									{selectedSection !== "All"
										? `Section ${selectedSection}`
										: `Batch ${selectedBatch}`}{" "}
									({filteredStudents.length})
								</h2>
							</div>
						)}

						{filteredStudents.length > 0 ? (
							<div className="grid grid-cols-1 gap-6">
								{filteredStudents.map((student) => (
									<DepartmentStudentCard
										key={student.studentId}
										student={student}
										onClick={() => onStudentClick(student)}
									/>
								))}
							</div>
						) : (
							<div className="bg-white dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-3xl p-12 text-center">
								<p className="text-sm text-gray-400 italic">
									No students found matching your criteria.
								</p>
							</div>
						)}
					</div>
				)}
			</main>
		</div>
	);
};

export default DepartmentStudentsView;
