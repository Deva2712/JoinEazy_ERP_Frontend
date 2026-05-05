import React from "react";
import {
	Microscope,
	Award,
	FileBadge,
	ArrowUpRight,
	Wallet,
	TrendingDown,
    TrendingUp,
    BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";

/**
 * Renders an animated circular gauge specifically for Budget Remaining.
 * Section: Research Analytics Visuals
 */
const BudgetRemainingGauge = ({ totalBudget, remainingBalance }) => {
	// Calculate the percentage of the budget that is still available
	const remainingPercentage =
		totalBudget > 0
			? ((remainingBalance / totalBudget) * 100).toFixed(1)
			: 0;

	// Helper for currency formatting (converts to Lakhs for better readability)
	const formatCurrency = (val) => `₹${(val / 100000).toFixed(1)}L`;

	return (
		<div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#1a1d26] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm h-full">
			<div className="relative size-44">
				<svg className="size-full -rotate-90" viewBox="0 0 100 100">
					<circle
						cx="50"
						cy="50"
						r="44"
						fill="transparent"
						stroke="currentColor"
						strokeWidth="6"
						className="text-gray-100 dark:text-gray-800/50"
					/>
					<motion.circle
						cx="50"
						cy="50"
						r="44"
						fill="transparent"
						stroke="currentColor"
						strokeWidth="8"
						strokeDasharray="263.89"
						initial={{ strokeDashoffset: 263.89 }}
						animate={{
							strokeDashoffset:
								263.89 - (263.89 * remainingPercentage) / 100,
						}}
						transition={{ duration: 1.8, ease: "easeOut" }}
						strokeLinecap="round"
						className="text-emerald-600 dark:text-emerald-500"
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
					<span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
						{formatCurrency(remainingBalance)}
					</span>
					<span className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest">
						Remaining
					</span>
				</div>
			</div>

			<div className="mt-4 grid grid-cols-2 gap-4 w-full border-t border-gray-50 dark:border-gray-800/50 pt-4">
				<div className="text-center">
					<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
						Total Pool
					</p>
                    <p className="text-xl font-black text-emerald-600">
						{formatCurrency(totalBudget)}
					</p>
				</div>
				<div className="text-center border-l border-gray-100 dark:border-gray-800">
					<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
						Spent
					</p>
					<p className="text-xl font-black text-gray-900 dark:text-white">
						{formatCurrency(totalBudget - remainingBalance)}
					</p>
				</div>
			</div>
		</div>
	);
};

const ResearchAnalyticsSection = ({ researchData }) => {
	if (!researchData) return null;

	return (
		<CollapsibleSection
			title="Research & Funding Analytics"
			icon={<Microscope className="size-4 text-emerald-600" />}
			defaultOpen={false}
			color="emerald"
		>
			<div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
				{/* UI SECTION: Left Remaining Budget Visualization */}
				<div className="xl:col-span-5">
					<BudgetRemainingGauge
						totalBudget={Number(researchData.totalBudgetPool)}
						remainingBalance={researchData.remainingBalance}
					/>
				</div>

				{/* UI SECTION: Right Performance Metrics */}
				<div className="xl:col-span-7 flex flex-col gap-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{/* High-level Efficiency Metric */}
						<div className="p-6 rounded-3xl bg-emerald-50/40 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10 transition-colors">
							<div className="flex items-center gap-3 mb-2">
								<TrendingUp className="size-4 text-emerald-600" />
								<span className="text-[10px] font-black text-emerald-800/50 dark:text-emerald-400/50 uppercase tracking-widest">
									Utilization Rate
								</span>
							</div>
							<p className="text-2xl font-black text-gray-800 dark:text-white">
								{researchData.overallUtilizationRate}%
							</p>
							{/* <p className="text-xs font-semibold tracking-wide text-gray-500">
								Utilization Rate
							</p> */}
						</div>

						{/* High-level Grant Metric */}
						<div className="p-6 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
							<div className="flex items-center gap-3 mb-2">
								<Wallet className="size-4 text-gray-400" />
								<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Active Grants
								</span>
							</div>
							<p className="text-2xl font-black text-gray-800 dark:text-white">
								{researchData.totalActiveGrants}
							</p>
							{/* <p className="text-xs font-semibold tracking-wide text-gray-500">
								Active Grants
							</p> */}
						</div>
					</div>

					{/* Smaller Impact Metrics Row */}
					<div className="grid grid-cols-2 gap-3">
						<div className="px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
							<Award className="size-4 text-emerald-500" />
							<div>
								<p className="text-lg font-black text-gray-800 dark:text-white leading-none">
									{researchData.citationsTotal}
								</p>
								<p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mt-1">
									Citations
								</p>
							</div>
						</div>

						<div className="px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
							<BookOpen className="size-4 text-gray-400" />
							<div>
								<p className="text-lg font-black text-gray-800 dark:text-white leading-none">
									{researchData.publicationsThisYear}
								</p>
								<p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mt-1">
									Publications
								</p>
							</div>
						</div>
					</div>

					{/* UI SECTION: Right-aligned Link Button */}
					<Link
						to="/department/research"
						className="mt-auto flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-50 dark:bg-[#0f1117] text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all border border-gray-100 dark:border-gray-700/50"
					>
						View Detailed Breakdown
						<ArrowUpRight className="size-3" />
					</Link>
				</div>
			</div>
		</CollapsibleSection>
	);
};

export default ResearchAnalyticsSection;
