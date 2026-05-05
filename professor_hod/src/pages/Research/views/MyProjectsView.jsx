// src/pages/Research/views/MyProjectsView.jsx
import React from "react";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import ResearchCard from "../components/ResearchCard";

const MyProjectsView = ({
	myProjects = [],
	onSelectItem,
	searchQuery = "",
	onSearchChange,
	onPostNew,
	onOpenFilters,
}) => {
	return (
		<div className="flex flex-col gap-6">
			{/* ── Search & Actions Bar ── */}
			<div className="flex flex-col gap-3">
				<div className="flex flex-col sm:flex-row items-center gap-3">
					{/* Search Input Container */}
					<div className="relative group w-full flex-1">
						<Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
						<input
							type="text"
							placeholder="Search projects, authors, or categories..."
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm outline-none focus:border-emerald-500 transition-all"
						/>
					</div>

					{/* Action Buttons Group */}
					<div className="flex items-center gap-3 w-full sm:w-auto">
						<button
							onClick={onOpenFilters}
							className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-sm transition-all hover:border-emerald-500/50 active:scale-95"
						>
							<SlidersHorizontal className="size-5 text-emerald-700" />
							<span className="text-gray-900 dark:text-white">
								Filters
							</span>
						</button>

						<button
							onClick={() => onPostNew("Project")}
							className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm transition-all active:scale-95 shadow-sm bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white border-none"
						>
							<Plus className="size-5" />
							<span className="whitespace-nowrap">
								New Project
							</span>
						</button>
					</div>
				</div>
			</div>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* ── Content Section ── */}
				<main className="flex-1">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight mb-5">
						Projects & Collaborations
					</h2>

					{myProjects.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{myProjects.map((p) => (
								<ResearchCard
									key={p.id}
									item={p}
									matchedRole={p.currentMatch}
									onClick={() =>
										onSelectItem({
											type: "project",
											data: p,
											viewType: p.isOwner
												? "owner"
												: "member",
										})
									}
								/>
							))}
						</div>
					) : (
						<div className="bg-white dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-3xl p-12 text-center">
							<p className="text-sm text-gray-400 italic">
								No projects found matching current filters.
							</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default MyProjectsView;
