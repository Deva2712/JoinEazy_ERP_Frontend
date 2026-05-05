import React, { useMemo, useState } from "react";
import {
	Search,
	Briefcase,
	GraduationCap,
	Building2,
	LayoutGrid,
	ArrowUpRight,
	ArrowRight,
	BriefcaseBusiness,
} from "lucide-react";
import { useDepartment } from "../../../context/DepartmentContext";
import BatchPlacementStatsCard from "./components/BatchPlacementStatsCard";
import PlacementStudentCard from "./components/PlacementRecordCard";
import CompanyStatsCard from "./components/CompanyStatsCard";

const DepartmentPlacementsView = ({ onBatchClick }) => {
	const { state, actions } = useDepartment();
	const { placements, placementStats, placementCompanies, filters } = state;
	const [viewType, setViewType] = useState("placements");

	const isDataEmpty = !placements || placements.length === 0;

	const filteredPlacements = useMemo(() => {
		if (!placements) return [];
		const query = filters.searchQuery.toLowerCase();

		let list = placements.filter((p) => {
			const type = p.placementDetails.type.toLowerCase();
			return viewType === "placements"
				? type.includes("full-time")
				: type.includes("internship");
		});

		return list.filter(
			(record) =>
				record.name.toLowerCase().includes(query) ||
				record.placementDetails.companyName
					.toLowerCase()
					.includes(query) ||
				record.placementDetails.role.toLowerCase().includes(query),
		);
	}, [placements, filters.searchQuery, viewType]);

	if (isDataEmpty) {
		return (
			<div className="bg-white dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-3xl p-12 text-center">
				<p className="text-sm text-gray-400 italic">
					No data available.
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Search Bar */}
			<div className="relative group flex-1 w-full">
				<Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
				<input
					type="text"
					placeholder={`Search ${viewType} by student, company, or role...`}
					value={filters.searchQuery}
					onChange={(e) => actions.setSearchQuery(e.target.value)}
					className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm outline-none focus:border-violet-500 transition-all"
				/>
			</div>

			<main className="flex-1">
				{!filters.searchQuery ? (
					<div className="space-y-12">
						{/* Batch Performance Grid */}
						<section className="space-y-4">
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-1">
								<h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
									Batch-wise Placement Stats
								</h2>

								{/* View Mode Toggle (Placement vs Internship) */}
								<div className="flex w-full md:w-auto p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
									<button
										onClick={() =>
											setViewType("placements")
										}
										className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
											viewType === "placements"
												? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
												: "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
										}`}
									>
										<Briefcase className="size-4" />
										<span>Placements</span>
									</button>
									<button
										onClick={() =>
											setViewType("internships")
										}
										className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
											viewType === "internships"
												? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
												: "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
										}`}
									>
										<GraduationCap className="size-4" />
										<span>Internships</span>
									</button>
								</div>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{placementStats?.map((stat, idx) => (
									<BatchPlacementStatsCard
										key={idx}
										stat={stat}
										type={viewType}
										onClick={() =>
											onBatchClick({
												batchId: stat.batch,
												viewType: viewType,
											})
										}
									/>
								))}
							</div>
						</section>

						{/* Ecosystem Insights & Recruiting Companies */}
						<section className="space-y-4">
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-1">
								<h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
									Placement Ecosystem
								</h2>
								<button
									onClick={() =>
										onBatchClick({
											batchId: "All",
											viewType: "companies",
										})
									}
									className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 shadow-sm transition-all text-sm font-bold w-full sm:w-auto group"
								>
									View Details
									<ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
								</button>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
								{/* Left: Summary Analytics */}
								<div className="lg:col-span-4 xl:col-span-3">
									<CompanyStatsCard
										companies={placementCompanies}
									/>
								</div>

								{/* Right: Partner Ecosystem Grid */}
								<div className="lg:col-span-8 xl:col-span-9">
									<div className="flex items-center justify-between mb-4">
										<h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.15em]">
											Top Recruiting Companies
										</h3>
										{placementCompanies.length > 6 && (
											<div className="flex -space-x-2">
												{[1, 2, 3].map((i) => (
													<div
														key={i}
														className="size-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700"
													/>
												))}
												<div className="flex items-center justify-center size-6 rounded-full border-2 border-white dark:border-gray-800 bg-violet-500 text-[8px] text-white font-bold">
													+
													{placementCompanies.length -
														6}
												</div>
											</div>
										)}
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{placementCompanies
											.slice(0, 6)
											.map((company) => {
												const totalHired =
													company.hiringHistory?.reduce(
														(acc, curr) =>
															acc +
															(curr.studentsPlaced ||
																0),
														0,
													) || 0;

												return (
													<div
														key={company.id}
														className="group bg-white dark:bg-[#1a1d26] p-4 rounded-2xl border border-gray-200 dark:border-gray-700/50 flex items-center gap-4 hover:border-violet-500/50 transition-all"
													>
														{/* Company Visual Identity */}
														<div className="size-14 shrink-0 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600 shadow-sm">
															{/* Placeholder for Logo - Using Initial */}
															<span className="text-xl font-black text-gray-400 dark:text-gray-500 group-hover:text-violet-500">
																{company.name.charAt(
																	0,
																)}
															</span>
														</div>

														<div className="min-w-0 flex-1">
															<div className="flex items-start justify-between">
																<p className="text-base font-bold text-gray-900 dark:text-white truncate pr-2">
																	{
																		company.name
																	}
																</p>
																{totalHired >
																	0 && (
																	<span className="shrink-0 text-[10px] font-black px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full uppercase">
																		{
																			totalHired
																		}{" "}
																		Placed
																	</span>
																)}
															</div>

															<div className="flex items-center gap-3 mt-1">
																<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
																	{
																		company.sector
																	}
																</span>
																{company.tier && (
																	<div className="flex items-center gap-1.5">
																		<div className="size-1 rounded-full bg-gray-300 dark:bg-gray-600" />
																		<span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 italic">
																			{
																				company.tier
																			}
																		</span>
																	</div>
																)}
															</div>
														</div>
													</div>
												);
											})}
									</div>
								</div>
							</div>
						</section>
					</div>
				) : (
					/* Filtered Search Results Feed */
					<div className="space-y-6">
						<div className="flex items-center justify-between px-2">
							<h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight capitalize">
								{viewType} Results
								<span className="ml-3 text-sm font-medium text-gray-400">
									({filteredPlacements.length} records found)
								</span>
							</h2>
						</div>
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
							{filteredPlacements.map((record) => (
								<PlacementStudentCard
									key={record.studentId}
									record={record}
								/>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
};

export default DepartmentPlacementsView;
