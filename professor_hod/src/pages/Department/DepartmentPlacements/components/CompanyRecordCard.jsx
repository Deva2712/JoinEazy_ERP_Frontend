// src/pages/Department/DepartmentPlacements/components/CompanyRecordCard.jsx

import React, { useState } from "react";
import {
	Building2,
	MapPin,
	Briefcase,
	ChevronDown,
	Users,
	Mail,
	Phone,
	User,
	TrendingUp,
	Globe,
	Sparkles,
	Tag,
	Calendar,
	Info,
	ChevronRight,
} from "lucide-react";

/**
 * CompanyRecordCard Component
 * Displays company data with a collapsible section.
 * Features recruitment history and current job openings.
 */
const CompanyRecordCard = ({ company, onOpeningClick }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const totalPlaced =
		company.hiringHistory?.reduce(
			(acc, curr) => acc + curr.studentsPlaced,
			0,
		) || 0;
	const latestPackage =
		company.hiringHistory?.[company.hiringHistory.length - 1]
			?.avgPackageLPA || "N/A";

	return (
		<div className="group relative bg-white dark:bg-[#0f1115] rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-violet-500/5 hover:border-violet-300 dark:hover:border-violet-500/30">
			<div className="flex-1 p-5 md:p-6 flex flex-col gap-6 relative">
				{/* Header Section */}
				<div
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 cursor-pointer"
				>
					<div className="flex items-center gap-5">
						<div
							className={`rounded-2xl flex items-center justify-center border transition-all ${
								company.status === "Active"
									? "bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-500/10 dark:to-violet-500/5 text-violet-600 dark:text-violet-400 border-violet-100/50 dark:border-violet-500/20"
									: "bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700"
							} ${isExpanded ? "size-14 md:size-16" : "size-12"}`}
						>
							<Building2
								className={`${isExpanded ? "size-7 md:size-8" : "size-6"} group-hover:scale-110 transition-transform`}
							/>
						</div>

						<div className="space-y-2.5">
							<h4 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
								{company.name}
							</h4>

							<div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400">
								<div className="flex items-center gap-1.5">
									<Briefcase className="size-4" />
									{company.tier}
								</div>
								<div className="flex items-center gap-1.5">
									<Tag className="size-4" />
									{company.sector}
								</div>
								<div className="flex items-center gap-1.5">
									<MapPin className="size-4" />
									{company.headquarters}
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<span
							className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
								company.status === "Active"
									? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
									: "bg-red-500/10 border-red-500/20 text-red-600"
							}`}
						>
							{company.status}
						</span>
						<ChevronDown
							className={`size-5 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
						/>
					</div>
				</div>

				{/* Expanded Content */}
				{isExpanded && (
					<div className="pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
						{/* Quick Stats Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<CompanyStatCard
								label="Lifetime Hires"
								value={totalPlaced}
								icon={<Users className="size-4" />}
							/>
							<CompanyStatCard
								label="Latest Package"
								value={`${latestPackage} LPA`}
								icon={<TrendingUp className="size-4" />}
								isHighlight
							/>
							<div className="p-5 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-gray-400">
										<Mail className="size-4" />
										<span className="text-[10px] font-black uppercase tracking-widest">
											Recruiter
										</span>
									</div>
									{company.website && (
										<a
											href={company.website}
											target="_blank"
											rel="noreferrer"
											onClick={(e) => e.stopPropagation()}
											className="p-1.5 rounded-md hover:bg-violet-50 dark:hover:bg-violet-500/10 text-violet-500 transition-colors"
										>
											<Globe className="size-4" />
										</a>
									)}
								</div>
								<div className="flex items-center gap-3">
									<div className="size-10 shrink-0 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
										<User className="size-5" />
									</div>
									<div className="overflow-hidden">
										<p className="text-sm font-bold text-gray-900 dark:text-white truncate">
											{company.contactPerson.name}
										</p>
										<div className="flex flex-col">
											<a
												href={`mailto:${company.contactPerson.email}`}
												className="text-[11px] text-gray-500 hover:text-violet-500 truncate transition-colors"
											>
												{company.contactPerson.email}
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="pt-8 border-t border-gray-100 dark:border-gray-800/60 grid grid-cols-1 gap-8">
							{/* Current Openings Section */}
							{company.currentOpenings?.length > 0 && (
								<div className="space-y-3">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
										<Sparkles className="size-3 text-amber-500 fill-amber-500" />
										Active Opportunities
									</h4>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										{company.currentOpenings.map(
											(opening, idx) => (
												<div
													key={idx}
													onClick={(e) => {
														e.stopPropagation(); // Prevents collapsing the parent card[cite: 1]
														onOpeningClick(opening);
													}}
													className="group/item flex items-center justify-between p-5 rounded-xl bg-white dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800 hover:border-violet-500/40 transition-all duration-300 cursor-pointer"
												>
													<div className="space-y-1.5">
														<p className="text-[15px] font-bold text-gray-900 dark:text-white group-hover/item:text-violet-500 transition-colors leading-none">
															{opening.role}
														</p>

														<p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
															{opening.type}
														</p>
													</div>
													<div className="flex flex-col items-end gap-1.5">
														<span className="inline-block px-2 py-0.5 rounded text-[9px] font-black bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 uppercase tracking-widest">
															{opening.count}{" "}
															Positions
														</span>
														<ChevronRight className="size-3.5 text-gray-400 group-hover/item:text-violet-600 transition-colors" />
													</div>
												</div>
											),
										)}
									</div>
								</div>
							)}

							{/* Hiring History Section */}
							<div className="space-y-3">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
									<Calendar className="size-3 text-gray-500" />
									Placement History
								</h4>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{company.hiringHistory.map(
										(history, idx) => (
											<div
												key={idx}
												className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-white/[0.01] border border-gray-100 dark:border-gray-800"
											>
												<div className="space-y-1">
													<span className="text-base font-bold text-gray-900 dark:text-white block leading-none">
														{history.batch}
													</span>
													<p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
														Batch Year
													</p>
												</div>
												<div className="flex items-center gap-4">
													<div className="h-10 w-px bg-gray-200 dark:bg-gray-800" />
													<div className="flex items-center gap-5">
														<div className="flex flex-col">
															<span className="text-base font-black text-emerald-600 dark:text-emerald-400 leading-none">
																{
																	history.studentsPlaced
																}
															</span>
															<p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
																Placed
															</p>
														</div>
														<div className="flex flex-col">
															<span className="text-base font-black text-violet-600 dark:text-violet-400 leading-none">
																{
																	history.avgPackageLPA
																}
															</span>
															<p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
																Avg. CTC
															</p>
														</div>
													</div>
												</div>
											</div>
										),
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

const CompanyStatCard = ({ label, value, icon, isHighlight }) => (
	<div className="flex flex-col justify-center gap-2 p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.04]">
		<div className="flex items-center gap-2 text-gray-400">
			{icon}
			<span className="text-[10px] font-black uppercase tracking-[0.1em]">
				{label}
			</span>
		</div>
		<p
			className={`text-2xl font-black tracking-tight ${isHighlight ? "text-violet-500" : "text-gray-900 dark:text-white"}`}
		>
			{value}
		</p>
	</div>
);

export default CompanyRecordCard;
