// src/pages/Department/DepartmentFaculty/DepartmentFacultyView.jsx

import React, { useMemo } from "react";
import { useDepartment } from "../../../context/DepartmentContext";
import { Search, X } from "lucide-react";
import DepartmentFacultyCard from "./components/DepartmentFacultyCard";

const DepartmentFacultyView = ({ onFacultyClick }) => {
	const { state, actions } = useDepartment();
	const { faculty, allocations, filters } = state;

	const isDataEmpty = !faculty || faculty.length === 0;

	/**
	 * Filter logic matching the Courses view pattern
	 */
	const filteredFaculty = useMemo(() => {
		const query = filters.searchQuery.toLowerCase();
		if (!faculty) return [];

		return faculty.filter((member) => {
			return (
				member.name.toLowerCase().includes(query) ||
				member.designation.toLowerCase().includes(query)
			);
		});
	}, [faculty, filters.searchQuery]);

	if (isDataEmpty) {
		return (
			<div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
				<p className="text-gray-500">
					No faculty data available.
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Search Controls */}
			<div className="flex flex-col gap-3">
				<div className="flex flex-col sm:flex-row items-center gap-3">
					<div className="relative group w-full flex-1">
						<Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
						<input
							type="text"
							placeholder="Search faculty name or designation..."
							value={filters.searchQuery}
							onChange={(e) =>
								actions.setSearchQuery(e.target.value)
							}
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
				</div>
			</div>

			<main className="flex-1 space-y-5">
				{filteredFaculty.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredFaculty.map((member) => (
							<DepartmentFacultyCard
								key={member.id}
								member={member}
								onClick={onFacultyClick}
								allocationCount={
									allocations.filter(
										(a) => a.facultyId === member.id,
									).length
								}
							/>
						))}
					</div>
				) : (
					<div className="bg-white dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-3xl p-12 text-center">
						<p className="text-sm text-gray-400 italic">
							No faculty members found matching your search.
						</p>
					</div>
				)}
			</main>
		</div>
	);
};

export default DepartmentFacultyView;
