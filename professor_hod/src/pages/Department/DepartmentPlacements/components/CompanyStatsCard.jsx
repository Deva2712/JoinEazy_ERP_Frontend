// src/pages/Department/DepartmentPlacements/components/CompanyStatsCard.jsx

import React, { useMemo } from "react";
import {
	Globe,
	Briefcase,
	Users,
	ArrowUpRight
} from "lucide-react";

/**
 * Enhanced Company Stats Card
 * This component aggregates recruitment metrics including placements and active openings.
 * It provides a high-level overview of the company directory status.
 */
const CompanyStatsCard = ({ companies = [] }) => {
	const stats = useMemo(() => {
		const total = companies.length;
		const uniqueSectors = new Set(companies.map((c) => c.sector)).size;

		let totalPlacements = 0;
		let totalOpenings = 0;

		companies.forEach((company) => {
			totalPlacements +=
				company.hiringHistory?.reduce(
					(acc, curr) => acc + (curr.studentsPlaced || 0),
					0,
				) || 0;
			totalOpenings +=
				company.currentOpenings?.reduce(
					(acc, curr) => acc + (curr.count || 0),
					0,
				) || 0;
		});

		return {
			total,
			uniqueSectors,
			totalPlacements,
			totalOpenings,
		};
	}, [companies]);

	return (
		<div className="group relative bg-white dark:bg-[#1a1d26] p-7 rounded-3xl border border-gray-200 dark:border-gray-800/60 shadow-sm hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-500 overflow-hidden">
			<div className="absolute -right-4 -top-4 w-40 h-40 bg-violet-500/5 rounded-full blur-3xl group-hover:bg-violet-500/10 transition-colors duration-500" />

			<div className="relative z-10 space-y-6">
				{/* Top Header: Main metric and Sector badge */}
				<div className="flex justify-between items-start">
					<div>
						<div className="flex items-baseline gap-1">
							<span className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter">
								{stats.total}
							</span>
							<ArrowUpRight className="size-6 text-violet-500 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0" />
						</div>
						<p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-[0.15em] mt-1">
							Partner Companies
						</p>
					</div>

					<div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
						<Globe className="size-4 text-violet-500" />
						<span className="text-xs font-bold text-gray-700 dark:text-gray-300">
							{stats.uniqueSectors} <span className="text-gray-400 dark:text-gray-500 font-medium">Sectors</span>
						</span>
					</div>
				</div>

				{/* Metrics Grid: Breakdown of hired students and openings */}
				<div className="grid grid-cols-2 gap-4">
					<div className="group/item relative overflow-hidden bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-700/30 hover:bg-white dark:hover:bg-gray-800/60 hover:scale-[1.02] transition-all duration-300">
						<div className="flex items-center gap-2 mb-2">
							<Users className="size-4 text-gray-400 dark:text-gray-500" />
							<span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
								Hired
							</span>
						</div>
						<p className="text-2xl font-black text-gray-900 dark:text-white">
							{stats.totalPlacements.toLocaleString()}
						</p>
					</div>

					<div className="group/item relative overflow-hidden bg-emerald-50/30 dark:bg-emerald-500/5 p-4 rounded-2xl border border-emerald-100/40 dark:border-emerald-500/10 hover:scale-[1.02] transition-all duration-300">
						<div className="flex items-center gap-2 mb-2">
							<Briefcase className="size-4 text-emerald-500/70" />
							<span className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest">
								Openings
							</span>
						</div>
						<p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
							{stats.totalOpenings.toLocaleString()}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CompanyStatsCard;
