// src/pages/Department/DepartmentPlacements/components/PlacementRecordCard.jsx

import React, { useState } from "react";
import {
	Building2,
	MapPin,
	IndianRupee,
	Clock,
	Briefcase,
	GraduationCap,
	Zap,
	Mail,
	User,
	ChevronDown,
	CircleAlert,
} from "lucide-react";

/**
 * Enhanced card component to display both placed and unplaced student records.
 * Handles the conditional rendering of placement details and contact information.
 */
const PlacementRecordCard = ({ record }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const { placementDetails, companyContact, isPlaced } = record;

	const isInternship = placementDetails?.type
		?.toLowerCase()
		.includes("internship");

	const financialValue = isInternship
		? placementDetails?.stipend
		: placementDetails?.salaryLPA;

	const formatFinancials = () => {
		if (financialValue === null || financialValue === undefined)
			return "Unpaid";
		return isInternship
			? `₹${financialValue / 1000}k / mo`
			: `${financialValue} LPA`;
	};

	return (
		<div
			onClick={() => isPlaced && setIsExpanded(!isExpanded)}
			className={`group relative bg-white dark:bg-[#111318] rounded-2xl border transition-all duration-300 flex flex-col md:flex-row overflow-hidden ${
				isPlaced
					? "border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-violet-300 dark:hover:border-violet-500/30 cursor-pointer"
					: "border-dashed border-gray-300 dark:border-gray-700 opacity-80 cursor-default"
			}`}
		>
			{/* Student Identity Sidebar: Displays core student info regardless of placement status */}
			<div
				className={`p-5 flex flex-row md:flex-col items-center justify-start md:justify-center gap-4 shrink-0 bg-gray-50/50 dark:bg-white/[0.02] border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800/50 transition-all duration-300 ${isExpanded ? "md:w-48 md:items-start" : "md:w-24"}`}
			>
				<div
					className={`rounded-2xl flex items-center justify-center border transition-all ${
						isPlaced
							? "bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-500/10 dark:to-violet-500/5 text-violet-600 dark:text-violet-400 border-violet-100/50 dark:border-violet-500/20"
							: "bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700"
					} ${isExpanded ? "size-14 md:size-16" : "size-12"}`}
				>
					{!isPlaced ? (
						<User
							className={
								isExpanded ? "size-7 md:size-8" : "size-6"
							}
						/>
					) : isInternship ? (
						<GraduationCap
							className={
								isExpanded ? "size-7 md:size-8" : "size-6"
							}
						/>
					) : (
						<Briefcase
							className={
								isExpanded ? "size-7 md:size-8" : "size-6"
							}
						/>
					)}
				</div>

				<div
					className={`space-y-1 transition-all duration-300 ${isExpanded ? "opacity-100" : "md:hidden opacity-100"}`}
				>
					<h4 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
						{record.name}
					</h4>
					<div className="flex justify-center md:justify-start">
						<div className="inline-flex px-2 py-0.5 rounded-md bg-gray-200/50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-mono text-xs font-medium">
							{record.studentId}
						</div>
					</div>
				</div>
			</div>

			{/* Main Content Area: Conditional rendering based on whether an offer exists */}
			<div className="flex-1 p-6 flex flex-col justify-center gap-4 relative">
				<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
					<div className="space-y-2">
						<h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
							{!isExpanded && (
								<span className="hidden lg:block">
									{record.name} {isPlaced && "—"}
								</span>
							)}
							{isPlaced ? placementDetails.role : ""}
						</h3>

						{isPlaced ? (
							<div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400">
								{placementDetails.isPPOOffered && (
									<div className="flex items-center gap-1.5 text-violet-500">
										<Zap className="size-4" />
										PPO Offered
									</div>
								)}
								<div className="flex items-center gap-2.5">
									<Building2 className="size-4" />
									{placementDetails.companyName}
								</div>
								<div className="flex items-center gap-1.5">
									<MapPin className="size-4" />
									{placementDetails.location}
								</div>
							</div>
						) : (
							<div className="flex items-center gap-2 text-gray-400">
								<CircleAlert className="size-4" />
								<p className="text-xs font-medium italic">
									This student has not yet secured{" "}
									{isInternship
										? "an internship"
										: "a full-time offer"}{" "}
									for this batch.
								</p>
							</div>
						)}
					</div>

					{isPlaced && (
						<div className="flex items-center justify-between gap-2">
							<div
								className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
									!isPlaced
										? "bg-gray-100 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700"
										: [
													"Completed",
													"Joined",
													"Accepted",
											  ].includes(
													placementDetails.status,
											  )
											? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
											: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
								}`}
							>
								{placementDetails.status}
							</div>

							<ChevronDown
								className={`size-5 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
							/>
						</div>
					)}
				</div>

				{/* Expanded Details: Financials and Recruiter Info */}
				{isExpanded && isPlaced && (
					<div className="flex flex-wrap items-stretch justify-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
						<div className="flex-1 flex flex-col justify-center gap-1 min-w-[140px] p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800">
							<div className="flex items-center gap-1 text-gray-400">
								<IndianRupee className="size-3.5" />
								<span className="text-[10px] font-bold uppercase tracking-wider">
									{isInternship ? "Stipend" : "Annual CTC"}
								</span>
							</div>
							<p className="text-lg font-black text-violet-500">
								{formatFinancials()}
							</p>
						</div>

						{isInternship && placementDetails.duration && (
							<div className="flex-1 flex flex-col justify-center gap-1 min-w-[140px] p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800">
								<div className="flex items-center gap-1.5 text-gray-400">
									<Clock className="size-3.5" />
									<span className="text-[10px] font-bold uppercase tracking-wider">
										Duration
									</span>
								</div>
								<p className="text-lg font-black text-gray-900 dark:text-white">
									{placementDetails.duration}
								</p>
							</div>
						)}

						{companyContact && (
							<div className="flex-1 min-w-[220px] p-4 bg-white dark:bg-[#1c1f26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
								<div className="flex items-center gap-1.5 mb-3 text-gray-400">
									<Mail className="size-3.5" />
									<span className="text-[10px] font-bold uppercase tracking-widest">
										Recruiter Contact
									</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="size-8 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
										<User className="size-4" />
									</div>
									<div className="overflow-hidden">
										<p className="text-sm font-bold text-gray-900 dark:text-white truncate">
											{companyContact.name}
										</p>
										<p className="text-xs text-gray-500 truncate italic">
											{companyContact.email}
										</p>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default PlacementRecordCard;
