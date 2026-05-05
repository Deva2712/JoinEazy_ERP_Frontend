// src/pages/Department/DepartmentPlacements/PlacementsDetailsView.jsx

import React, { useMemo } from "react";
import { ArrowLeft, Users, PieChart, User, ChevronDown } from "lucide-react";
import { useDepartment } from "../../../context/DepartmentContext";
import PlacementsDetailsSidebar from "./components/PlacementsDetailsSidebar";
import PlacementRecordCard from "./components/PlacementRecordCard";

const PlacementTypeSelector = ({
	activeType,
	onTypeChange,
	className = "",
}) => (
	<div className={className}>
		<label className="hidden md:block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
			Viewing Category
		</label>
		<div className="relative">
			<select
				value={activeType}
				onChange={(e) => onTypeChange(e.target.value)}
				className="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200 appearance-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all cursor-pointer"
			>
				<option value="placements">Full-time Placements</option>
				<option value="internships">Internships</option>
			</select>
			<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none transition-transform" />
		</div>
	</div>
);

/**
 * Detailed view for batch placement data with support for filtering
 * by section and offer status via DepartmentContext.
 */
const PlacementsDetailsView = ({ batchId, onBack }) => {
	const { state, actions, getPlacementDetails } = useDepartment();
	const { activeSectionName, placementStatusFilter } = state.viewFilters;

	const placementData = useMemo(
		() => getPlacementDetails(batchId),
		[getPlacementDetails, batchId],
	);

	/**
	 * Updates the view type and resets the offer filter to 'placed'
	 */
	const handleTypeChange = (type) => {
		actions.setViewFilters({
			viewType: type,
			placementStatusFilter: "is_placed",
		});
	};

	if (!placementData) return null;

	const {
		batchData,
		activeStats,
		filteredRecords,
		availableSections,
		activeType,
	} = placementData;

	return (
		<div className="relative pb-24 lg:pb-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
			{/* Navigation Header */}
			<div className="flex items-center justify-between pb-4">
				<button
					onClick={onBack}
					className="inline-flex items-center gap-2.5 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 font-bold transition-all group rounded-full"
				>
					<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-violet-200 dark:group-hover:border-violet-800 group-hover:shadow-sm transition-all">
						<ArrowLeft className="size-4" />
					</div>
					<span className="text-xs uppercase tracking-widest">
						Return
					</span>
				</button>

				<PlacementTypeSelector
					activeType={activeType}
					onTypeChange={handleTypeChange}
					className="lg:hidden"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<div className="lg:col-span-3 space-y-8">
					{/* Batch Overview Card */}
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 md:p-6 flex flex-col md:flex-row items-center md:justify-between">
						<div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
							<div className="size-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/10 text-violet-600 dark:text-violet-400 shadow-inner">
								<icon className="size-10">
									<Users className="size-10" />
								</icon>
							</div>
							<div className="flex flex-col items-center md:items-start text-center md:text-left">
								<h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
									Batch {batchData.batch}{" "}
									{activeType === "internships"
										? "Internships"
										: "Placements"}
								</h3>
								<div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm font-medium mt-2">
									<User className="size-4" />
									<span>
										{batchData.totalStudents} Students Total
									</span>
								</div>
							</div>
						</div>
						<div className="flex flex-col items-center md:items-end gap-1 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700">
							<span className="text-3xl font-black text-violet-600 dark:text-violet-400">
								{activeStats?.placementPercentage || 0}%
							</span>
							<span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
								{activeType === "internships"
									? "Internship Rate"
									: "Placement Rate"}
							</span>
						</div>
					</div>

					{/* Mobile-only Stats Sidebar */}
					<div className="lg:hidden">
						<PlacementsDetailsSidebar
							batchData={batchData}
							activeType={activeType}
						/>
					</div>

					{/* Records Section */}
					<div className="space-y-4">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 px-1">
							<div className="flex items-center gap-3.5 md:gap-4">
								<span className="text-violet-500 scale-110">
									<PieChart className="size-4 text-violet-500" />
								</span>
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									{activeType === "internships"
										? "Internship"
										: "Placement"}{" "}
									Records
								</h4>
							</div>

							<div className="flex flex-wrap items-center justify-between gap-4">
								{/* Status Offer Filter */}
								<div className="flex items-center gap-2">
									<label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
										Offer:
									</label>
									<select
										value={placementStatusFilter}
										onChange={(e) =>
											actions.setViewFilters({
												placementStatusFilter:
													e.target.value,
											})
										}
										className="text-xs font-bold bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
									>
										<option value="is_placed">
											Placed
										</option>
										{activeType === "internships" && (
											<option value="has_offer">
												PPO Offered
											</option>
										)}
										<option value="not_placed">
											Unplaced
										</option>
									</select>
								</div>

								{/* Section Filter */}
								<div className="flex items-center gap-2">
									<label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
										Section:
									</label>
									<select
										value={activeSectionName}
										onChange={(e) =>
											actions.setActiveSection(
												e.target.value,
											)
										}
										className="text-xs font-bold bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
									>
										{availableSections.map((sec) => (
											<option key={sec} value={sec}>
												{sec === "all"
													? "All Sections"
													: sec}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>

						{/* Record Cards */}
						<div className="grid grid-cols-1 gap-4">
							{filteredRecords.length > 0 ? (
								filteredRecords.map((record) => (
									<PlacementRecordCard
										key={record.studentId}
										record={record}
									/>
								))
							) : (
								<div className="text-center py-16 bg-gray-50/50 dark:bg-gray-800/20 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-500 text-sm italic">
									No records found for the current selection.
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Desktop Sidebar */}
				<aside className="hidden lg:block lg:sticky lg:top-8 space-y-6 h-fit">
					<PlacementTypeSelector
						activeType={activeType}
						onTypeChange={handleTypeChange}
					/>
					<PlacementsDetailsSidebar
						batchData={batchData}
						activeType={activeType}
					/>
				</aside>
			</div>
		</div>
	);
};

export default PlacementsDetailsView;
