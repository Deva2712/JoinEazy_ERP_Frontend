// src/pages/Department/DepartmentCourses/DepartmentCoursesView.jsx

import React, { useMemo, useState } from "react";
import { Search, ChevronDown, Archive, ArrowLeft, X } from "lucide-react";
import { useDepartment } from "../../../context/DepartmentContext";
import DepartmentCourseCard from "./components/DepartmentCourseCard";

const DepartmentCoursesView = ({ onCourseClick }) => {
	const { state, actions } = useDepartment();
	const { courses, filters } = state;

	const [selectedAcademicYear, setSelectedAcademicYear] = useState("All");
	const [showArchived, setShowArchived] = useState(false);

	/**
	 * Extract unique academic years (e.g., "2026-2030") from the course data for the dropdown
	 */
	const academicYearsList = useMemo(() => {
		const unique = [...new Set(courses.map((c) => c.academic_year))].filter(
			Boolean,
		);
		return ["All", ...unique.sort().reverse()]; // Sorting reverse to show most recent years first
	}, [courses]);

	const filteredCourses = useMemo(() => {
		const query = filters.searchQuery.toLowerCase();
		return courses.filter((course) => {
			const matchesSearch =
				course.cohort_name.toLowerCase().includes(query) ||
				(course.course_code &&
					course.course_code.toLowerCase().includes(query)) ||
				course.faculty.some((prof) =>
					prof.toLowerCase().includes(query),
				);

			const matchesAcademicYear =
				selectedAcademicYear === "All" ||
				course.academic_year === selectedAcademicYear;

			const matchesArchiveStatus = showArchived
				? course.status === "Archived"
				: course.status !== "Archived";

			return matchesSearch && matchesAcademicYear && matchesArchiveStatus;
		});
	}, [courses, filters.searchQuery, selectedAcademicYear, showArchived]);

	/**
	 * Dynamic title based on selection and current results count
	 */
	const getDisplayTitle = () => {
		const yearPrefix =
			selectedAcademicYear === "All" ? "All" : `${selectedAcademicYear} Batch`;
		const archiveStatus = showArchived ? "Archived" : "";
		return `${yearPrefix} ${archiveStatus} Courses (${filteredCourses.length})`;
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Search and Filter Controls */}
			<div className="flex flex-col md:flex-row items-center gap-3">
				<div className="relative group flex-1 w-full">
					<Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
					<input
						type="text"
						placeholder="Search name, code or professor..."
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

				<div className="flex items-center gap-3 w-full md:w-auto">
					{/* Academic Year Selection Dropdown */}
					<div className="relative group flex-1 md:w-auto">
						<select
							value={selectedAcademicYear}
							onChange={(e) =>
								setSelectedAcademicYear(e.target.value)
							}
							className="w-full pl-4 pr-10 py-3 font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none appearance-none shadow-sm hover:border-violet-500/50 transition-all cursor-pointer"
						>
							{academicYearsList.map((yr) => (
								<option key={yr} value={yr}>
									{yr === "All" ? "All Academic Years" : yr}
								</option>
							))}
						</select>
						<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
					</div>

					{/* Mobile-visible Archive Button */}
					{!showArchived && (
						<button
							onClick={() => setShowArchived(true)}
							className="md:hidden flex items-center justify-center p-3 rounded-xl transition-all border border-violet-200 dark:border-violet-900 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 active:scale-95"
						>
							<Archive className="size-5" />
						</button>
					)}
				</div>
			</div>

			<main className="flex-1 space-y-5">
				{/* Header section with Dynamic Title, Return Button, and Desktop Archive Toggle */}
				<div className="flex items-center justify-between gap-10">
					<div className="flex items-center gap-3">
						{showArchived && (
							<button
								onClick={() => setShowArchived(false)}
								className="flex items-center justify-center size-8 rounded-xl text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-sm transition-all"
							>
								<ArrowLeft className="size-4" />
							</button>
						)}
						<h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
							{getDisplayTitle()}
						</h2>
					</div>

					{!showArchived && (
						<button
							onClick={() => setShowArchived(true)}
							className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-violet-100 dark:border-violet-900/50 bg-violet-50/50 dark:bg-violet-900/10 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/20 hover:border-violet-300"
						>
							<Archive className="size-4" />
							<span>Archived Courses</span>
						</button>
					)}
				</div>

				{/* Courses Grid Rendering */}
				{filteredCourses.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredCourses.map((course) => (
							<DepartmentCourseCard
								key={course.id}
								course={course}
								onClick={() => onCourseClick(course)}
							/>
						))}
					</div>
				) : (
					<div className="bg-white dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-3xl p-12 text-center">
						<p className="text-sm text-gray-400 italic">
							No {showArchived ? "archived" : ""} courses found
							matching your search or academic year filter.
						</p>
					</div>
				)}
			</main>
		</div>
	);
};

export default DepartmentCoursesView;
