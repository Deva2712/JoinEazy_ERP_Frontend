import React from "react";
import {
	Briefcase,
	TrendingUp,
	DollarSign,
	Award,
	ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";
import { Link } from "react-router-dom";

/**
 * Renders a large animated circular progress bar showing placement percentages.
 */
const StatCircle = ({ percentage, colorClass }) => (
	<div className="relative size-32 shrink-0">
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
				strokeDasharray="276.46"
				initial={{ strokeDashoffset: 276.46 }}
				animate={{
					strokeDashoffset: 276.46 - (276.46 * percentage) / 100,
				}}
				transition={{ duration: 1.8, ease: "easeOut" }}
				strokeLinecap="round"
				className={colorClass}
			/>
		</svg>
		<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
			<span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
				{percentage}%
			</span>
			<span
				className={`text-[10px] uppercase font-bold ${colorClass} tracking-widest`}
			>
				Placed
			</span>
		</div>
	</div>
);

/**
 * Reusable card for displaying salary or stipend metrics.
 */
const SalaryInfo = ({ label, value }) => (
	<div className="flex flex-col gap-1 p-3.5 rounded-xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100/50 dark:border-gray-700/30 transition-all hover:bg-white dark:hover:bg-gray-800/40">

				<p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
					{label}
				</p>
				<p className="text-sm font-black text-gray-800 dark:text-gray-100 leading-none">
					{value}
				</p>
	</div>
);

const PlacementAnalyticsSection = ({ placementStats }) => {
	if (!placementStats) return null;

	const { fullTime, internships } = placementStats;

	return (
		<CollapsibleSection
			title="Placement & Internship Analytics"
			icon={<Briefcase className="size-4 text-violet-600" />}
			defaultOpen={false}
			color="violet"
		>
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				{/* UI SECTION: Full-Time Placement Card */}
				<div className="relative overflow-hidden flex flex-col sm:flex-row items-center gap-8 p-6 rounded-3xl bg-white dark:bg-[#1a1d26] border border-gray-100 dark:border-gray-800 shadow-sm">
					<StatCircle
						percentage={fullTime?.placedPercentage}
						colorClass="text-violet-600 dark:text-violet-500"
					/>

					<div className="flex-1 w-full space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
								<h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
									Full-Time Offers
								</h4>
							</div>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-1 gap-2.5">
							<SalaryInfo
								label="Average"
								value={`₹${fullTime?.averagePackageLpa} LPA`}
							/>
							<SalaryInfo
								label="Highest"
								value={`₹${fullTime?.highestPackageLpa} LPA`}
							/>
						</div>
					</div>
				</div>

				{/* UI SECTION: Internship Placement Card */}
				<div className="relative overflow-hidden flex flex-col sm:flex-row items-center gap-8 p-6 rounded-3xl bg-white dark:bg-[#1a1d26] border border-gray-100 dark:border-gray-800 shadow-sm">
					<StatCircle
						percentage={internships?.placedPercentage}
						colorClass="text-blue-600 dark:text-blue-500"
					/>

					<div className="flex-1 w-full space-y-4">
						<div className="flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-blue-600" />
							<h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
								Internships
							</h4>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-1 gap-2.5">
							<SalaryInfo
								label="Average"
								value={`₹${(internships?.averageStipend / 1000).toFixed(0)}k /mo`}
							/>
							<SalaryInfo
								label="Highest"
								value={`₹${(internships?.highestStipend / 1000).toFixed(0)}k /mo`}
							/>
						</div>
					</div>
				</div>
			</div>
			<Link
				to="/department/placements"
				className="mt-6 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-50 dark:bg-[#0f1117] text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all border border-gray-100 dark:border-gray-700/50"
			>
				View Detailed Analytics
				<ArrowUpRight className="size-3" />
			</Link>
		</CollapsibleSection>
	);
};

export default PlacementAnalyticsSection;
