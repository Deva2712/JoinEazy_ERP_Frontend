import { ChevronRight } from "lucide-react";
import React from "react";

const BatchPlacementStatsCard = ({ stat, type, onClick }) => {
	const data = type === "placements" ? stat.placements : stat.internships;

	const radius = 28;
	const circumference = 2 * Math.PI * radius;
	const offset =
		circumference - (data.placementPercentage / 100) * circumference;

	return (
		<button
			onClick={onClick}
			className="group relative flex flex-col bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:border-violet-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer active:scale-95"
		>
			<div className="relative z-10 flex flex-col h-full w-full">
				{/* Header Section: Batch Tag and Main Percentage */}
				<div className="flex justify-between items-start mb-4">
					<div className="space-y-1">
						<p className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-[0.2em]">
							Batch {stat.batch}
						</p>
						<div className="flex items-baseline gap-2">
							<h3 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
								{data.placementPercentage}%
							</h3>
							<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
								{type === "placements" ? "Placed" : "Secured"}
							</span>
						</div>
					</div>

					<div className="relative flex items-center justify-center shrink-0 -mt-2 sm:-mt-3">
						<svg className="size-16 sm:size-20 -rotate-90">
							<circle
								cx="50%"
								cy="50%"
								r={radius}
								className="stroke-gray-100 dark:stroke-gray-800 fill-none"
								strokeWidth="5"
							/>
							<circle
								cx="50%"
								cy="50%"
								r={radius}
								className="stroke-violet-500 fill-none transition-all duration-700 ease-in-out"
								strokeWidth="7"
								strokeDasharray={circumference}
								strokeDashoffset={offset}
								strokeLinecap="round"
							/>
						</svg>
						<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
							<span className="text-xs font-black text-gray-900 dark:text-white leading-none">
								{data.placedStudents}
							</span>
							<span className="text-[8px] font-bold text-gray-400 uppercase leading-tight">
								of {stat.totalStudents}
							</span>
						</div>
					</div>
				</div>

				{/* Metrics Grid: Package and Stipend Details */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50 transition-colors group-hover:bg-white dark:group-hover:bg-gray-800/40">
						<p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
							{type === "placements"
								? "Avg. Package"
								: "Avg. Stipend"}
						</p>
						<p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
							₹
							{type === "placements"
								? `${data.averageSalaryLPA.toLocaleString("en-IN")} LPA`
								: `${data.averageStipend.toLocaleString("en-IN")}/mo`}
						</p>
					</div>

					<div className="bg-violet-50/30 dark:bg-violet-900/10 p-4 rounded-2xl border border-violet-100/30 dark:border-violet-900/20">
						<p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">
							Highest
						</p>
						<p className="text-xl font-black text-violet-600 dark:text-violet-400 tracking-tight">
							₹
							{type === "placements"
								? `${data.highestSalaryLPA.toLocaleString("en-IN")} LPA`
								: `${data.highestStipend.toLocaleString("en-IN")}/mo`}
						</p>
					</div>
				</div>

				{/* Footer Section: Top Sectors with clean horizontal layout */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800/50">
					<p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">
						Top Hiring Sectors:
					</p>
					<div className="flex flex-wrap gap-2">
						{data.topHiringSectors
							.slice(0, 3)
							.map((sector, idx) => (
								<span
									key={idx}
									className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 text-[10px] font-bold text-gray-700 dark:text-gray-300 transition-colors group-hover:border-violet-200 dark:group-hover:border-violet-900/50"
								>
									{sector}
								</span>
							))}
					</div>
					<ChevronRight className="ml-auto hidden sm:block size-4 text-gray-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
				</div>
			</div>

			{/* Decorative background glow */}
			<div className="absolute -bottom-2 -right-2 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
		</button>
	);
};

export default BatchPlacementStatsCard;
