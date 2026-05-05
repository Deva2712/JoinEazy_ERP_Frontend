// src/pages/Research/components/ResearchCard.jsx

import React from "react";
import {
	Tag,
	ChevronRight,
	Briefcase,
	Microscope,
	BookOpen,
} from "lucide-react";

/**
 * Unified Card for both Research Projects and Publications.
 */
const ResearchCard = ({ item, onClick, matchedRole }) => {
	const memberCount = item.currentMemberCount || 0;
	const totalCapacity =
		(item.currentMemberCount || 0) + (item.openRolesCount || 0) || 1;
	const capacityPercentage = Math.min(
		(memberCount / totalCapacity) * 100,
		100,
	);

	return (
		<div
			onClick={() => onClick(item)}
			className="group bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800 flex flex-col h-full hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-gray-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-emerald-500/10"
		>
			<div className="flex items-center justify-between mb-4">
				<span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-black uppercase tracking-wider">
					<Tag className="size-3" />
					{item.category || "General"}
				</span>

				{matchedRole ? (
					<span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-black text-[10px] uppercase tracking-wider border border-blue-200/50 dark:border-blue-700/50">
						<Briefcase className="size-3" />
						{matchedRole}
					</span>
				) : (
					<span
						className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${
							item.status === "Open"
								? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
								: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
						}`}
					>
						{item.status === "Open"
							? `${item.openRolesCount || 0} Openings`
							: "Closed"}
					</span>
				)}
			</div>

			<div className="flex-1 space-y-3">
				<h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
					{item.title}
				</h4>
				<p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
					{item.abstract}
				</p>
			</div>

			<div className="mt-4 space-y-2">
				<div className="flex items-center gap-4">
					<div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							className="h-full bg-blue-500 transition-all duration-300 ease-out"
							style={{ width: `${capacityPercentage}%` }}
						/>
					</div>
					<div className="text-gray-900 font-semibold text-xs uppercase whitespace-nowrap">
						{memberCount} / {totalCapacity} Members
					</div>
				</div>

				<div className="pt-2 flex justify-end">
					<span className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] group-hover:text-emerald-600 group-hover:gap-2 transition-all">
						View Details <ChevronRight className="size-4" />
					</span>
				</div>
			</div>
		</div>
	);
};

/**
 * List-style version of the ResearchCard for dense Profile views.
 * Focuses on horizontal flow and subtle interactive states.
 */
export const CompactResearchCard = ({ item, onClick, type = "project" }) => {
	return (
		<div
			onClick={() => onClick(item)}
			className="group flex items-center justify-between p-4 md:p-5 bg-white dark:bg-[#1a1d26] transition-all duration-300 cursor-pointer"
		>
			<div className="flex items-center gap-4 flex-1 min-w-0">
				{/* Leading Icon/Indicator */}
				<div className="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 text-gray-400 group-hover:text-emerald-700 transition-colors">
					{type === "project" ? (
						<Microscope className="size-5" />
					) : (
						<BookOpen className="size-5" />
					)}
				</div>

				<div className="flex flex-col flex-1 min-w-0">
					<h4 className="text-md font-semibold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
						{item.title}
					</h4>
					<p className="text-[11px] font-semibold text-gray-400 truncate uppercase tracking-wider">
						{item.category}
					</p>
				</div>
			</div>

			{/* Trailing Action */}
			<div className="flex items-center gap-4 shrink-0 ml-4">
				<div className="hidden md:flex flex-row items-center gap-2">
					<span
						className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider ${
							item.status === "Open"
								? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
								: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
						}`}
					>
						{item.status === "Open"
							? `${item.openRolesCount || 0} Openings`
							: "Closed"}
					</span>
				</div>
				<ChevronRight className="text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white size-5 transition-all group-hover:translate-x-1" />
			</div>
		</div>
	);
};

export default ResearchCard;
