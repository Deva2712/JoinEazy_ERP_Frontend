// src/pages/Department/DepartmentResearch/components/MonthlyExpenseSection.jsx

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";

const MonthlyExpenseSection = ({ data }) => {
	if (!data || data.length === 0) return null;

	const rawMax = Math.max(...data.map((d) => d.expenses), 1);

	/**
	 * Calculates a "nice" interval for Y-axis ticks.
	 * Rounds the maximum value up to a clean multiple of 10, 100, 1000, etc.
	 */
	const getNiceMaxAndTicks = (max) => {
		const tickCount = 4;
		const rawStep = max / tickCount;
		const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
		const residual = rawStep / magnitude;

		let niceStep;
		if (residual < 1.5) niceStep = 1 * magnitude;
		else if (residual < 3) niceStep = 2 * magnitude;
		else if (residual < 7) niceStep = 5 * magnitude;
		else niceStep = 10 * magnitude;

		const niceMax = niceStep * tickCount;
		const niceTicks = [...Array(tickCount + 1)].map(
			(_, i) => niceStep * (tickCount - i),
		);

		return { niceMax, niceTicks };
	};

	const { niceMax, niceTicks } = getNiceMaxAndTicks(rawMax);

	return (
		<CollapsibleSection
			title="Monthly Expense Trends"
			icon={<TrendingUp className="size-4 text-violet-500" />}
			color="violet"
		>
			<div className="flex flex-col gap-2">
				<div className="flex gap-4 mt-2">
					{/* Y-Axis Labels and Bar */}
					<div className="flex flex-col justify-between pb-8 pt-4">
						{niceTicks.map((tick, i) => (
							<span
								key={i}
								className="text-[9px] font-bold text-gray-400 text-right w-12"
							>
								{tick.toLocaleString("en-IN")}
							</span>
						))}
					</div>

					<div className="flex-1">
						{/* Chart Area with X and Y Axis borders */}
						<div className="h-48 w-full flex items-end justify-between gap-1 sm:gap-2 border-l border-b border-gray-200 dark:border-gray-700 pb-0 relative">
							{/* Background Grid Lines */}
							<div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
								{niceTicks.map((_, i) => (
									<div
										key={i}
										className="w-full border-t border-gray-50 dark:border-gray-800/40"
									/>
								))}
							</div>

							{data.map((item, index) => {
								const heightPercentage =
									(item.expenses / niceMax) * 100;
								const isLast = index === data.length - 1;

								return (
									<div
										key={index}
										className="relative flex-1 h-full flex flex-col justify-end items-center px-1"
									>
										<span className="mb-2 text-[8px] md:text-[9px] font-black text-gray-500 dark:text-gray-400">
											{item.expenses.toLocaleString(
												"en-IN",
											)}
										</span>

										<motion.div
											initial={{ height: 0 }}
											animate={{
												height: `${Math.max(heightPercentage, 4)}%`,
											}}
											transition={{
												duration: 0.8,
												delay: index * 0.04,
												ease: "circOut",
											}}
											className={`w-full max-w-[28px] min-w-[10px] rounded-t-sm md:rounded-t-md relative z-10 ${
												isLast
													? "bg-violet-600 shadow-[0_-4px_12px_-3px_rgba(124,58,237,0.4)]"
													: "bg-violet-200 dark:bg-violet-500/20"
											}`}
										/>
									</div>
								);
							})}
						</div>

						{/* X-Axis Labels */}
						<div className="flex justify-between gap-1 sm:gap-2 mt-2">
							{data.map((item, index) => (
								<div key={index} className="flex-1 text-center">
									<span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
										{item.month}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="flex justify-center">
					<p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
						Fiscal Months
					</p>
				</div>
			</div>
		</CollapsibleSection>
	);
};

export default MonthlyExpenseSection;
