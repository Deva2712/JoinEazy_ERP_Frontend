// src/pages/Payroll/components/SalaryBreakdownCard.jsx

import React from "react";
import {
	CalendarDays,
	CheckCircle2,
	XCircle,
	TrendingDown,
	TrendingUp,
	Banknote,
} from "lucide-react";

/**
 * Component for the full Salary Breakdown section.
 * Includes header info, attendance overview, and detailed line items.
 */
const SalaryBreakdownCard = ({
	breakdown,
	isHistorical,
	getPaidDate,
	onDownload,
}) => {
	const deductionLabels = {
		tax: "Income Tax (TDS)",
		pf: "Provident Fund (EPF)",
		insurance: "Health Insurance",
		absence: "Absence Salary Cut",
	};

	const earnings = [
		{ label: "Basic Pay", val: breakdown?.basic },
		{ label: "HRA", val: breakdown?.hra },
		{ label: "Bonuses", val: breakdown?.bonuses },
		{ label: "Allowances", val: breakdown?.allowances },
	];

	return (
		<section className="bg-white dark:bg-[#1a1d26] rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
				<div className="flex items-center gap-2">
					<h3 className="text-lg font-bold text-gray-900 dark:text-white">
						Salary Breakdown
					</h3>
					<span
						className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
							isHistorical
								? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
								: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
						}`}
					>
						{isHistorical ? "Archive" : "Active"}
					</span>
				</div>
				<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
					<CalendarDays className="size-4 text-blue-500" />
					<span className="text-xs font-bold uppercase tracking-widest">
						{isHistorical ? "Disbursed On:" : "Expected By:"}
					</span>
					<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
						{getPaidDate()}
					</span>
				</div>
			</div>

			{/* Attendance Overview */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
				<div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
					<div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
						<CheckCircle2
							className="size-6 text-emerald-600 dark:text-emerald-400"
						/>
					</div>
					<div>
						<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
							Days Present
						</p>
						<p className="text-xl font-bold text-gray-900 dark:text-white">
							{breakdown?.attendance?.present || 0} Days
						</p>
					</div>
				</div>
				<div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
					<div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
						<XCircle
							className="size-6 text-rose-600 dark:text-rose-400"
						/>
					</div>
					<div>
						<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
							Unpaid Absences
						</p>
						<p className="text-xl font-bold text-gray-900 dark:text-white">
							{breakdown?.attendance?.absent || 0} Days
						</p>
					</div>
				</div>
			</div>

			{/* Breakdown Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">
				{/* Earnings Section */}
				<div className="space-y-4">
					<div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
						<TrendingUp size={16} className="text-emerald-500" />
						<h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
							Earnings
						</h4>
					</div>
					<div className="space-y-3">
						{earnings.map((i) => (
							<div
								key={i.label}
								className="flex justify-between items-center group"
							>
								<span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 transition-colors">
									{i.label}
								</span>
								<span className="font-bold text-gray-900 dark:text-white">
									₹{i.val?.toLocaleString()}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Deductions Section */}
				<div className="space-y-4">
					<div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
						<TrendingDown size={16} className="text-rose-500" />
						<h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
							Deductions
						</h4>
					</div>
					<div className="space-y-3">
						{breakdown?.deductions &&
							Object.entries(breakdown.deductions).map(
								([k, v]) => (
									<div
										key={k}
										className="flex justify-between items-center group"
									>
										<span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 transition-colors">
											{deductionLabels[k] ||
												k.charAt(0).toUpperCase() +
													k.slice(1)}
										</span>
										<span className="font-bold text-rose-600 dark:text-rose-400">
											-₹{v.toLocaleString()}
										</span>
									</div>
								),
							)}
					</div>
				</div>
			</div>

			{/* Net Take Home Footer */}
			<div className="p-6 bg-gray-900 dark:bg-blue-700 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-white/10 rounded-lg">
						<Banknote className="text-white size-6" />
					</div>
					<span className="text-blue-100 font-bold uppercase text-xs tracking-widest">
						Total Net Take-Home
					</span>
				</div>
				<span className="text-4xl font-black text-white">
					₹{breakdown?.netPay?.toLocaleString()}
				</span>
			</div>
		</section>
	);
};

export default SalaryBreakdownCard;
