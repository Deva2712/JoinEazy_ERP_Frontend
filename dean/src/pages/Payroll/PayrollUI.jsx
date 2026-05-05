// src/pages/Payroll/PayrollUI.jsx

import React, { useEffect, useState } from "react";
import {
	ArrowLeft,
	History,
	Wallet,
	Download,
	Search,
	ChevronDown,
	RefreshCw,
	AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import SalaryBreakdownCard from "./components/SalaryBreakdownCard";

const PayrollUI = ({ state, actions }) => {
	const {
		history,
		breakdown,
		years,
		months,
		selectedYear,
		selectedMonth,
		loading,
		error,
	} = state;

	const {
		setSelectedYear,
		onDownload,
		onSelectMonth,
		onReturnToCurrent,
		onRefresh,
	} = actions;

	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState("current");

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	const getNextPaymentDate = () => {
		const now = new Date();
		const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
		return nextMonth.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	const getPaidDate = () => {
		if (activeTab === "current") return getNextPaymentDate();
		const record = history.find((h) => h.month === selectedMonth);
		return record
			? new Date(record.paidAt).toLocaleDateString("en-US", {
					month: "long",
					day: "numeric",
					year: "numeric",
				})
			: "...";
	};

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		if (tab === "current") {
			onReturnToCurrent();
		} else {
			onSelectMonth("");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
			<HeaderController />

			<div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/dashboard")}
								className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
							>
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">
									Payroll & Salary
								</h1>
								<p className="text-white/70 text-sm mt-0.5">
									Access your financial statements and payslip
									history.
								</p>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{[
							{
								key: "current",
								label: "Current Statement",
								icon: Wallet,
							},
							{ key: "history", label: "History", icon: History },
						].map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.key}
									onClick={() => handleTabChange(tab.key)}
									className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										activeTab === tab.key
											? "bg-gray-50 dark:bg-[#0f1117] text-blue-700 dark:text-blue-400"
											: "text-white/70 hover:text-white hover:bg-white/10"
									}`}
								>
									<Icon className="w-4 h-4" />
									{tab.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-6 md:py-8 w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong
						</h2>
						<p className="text-gray-600 dark:text-gray-400 mb-8">
							{error}
						</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" />
							Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-blue-600 dark:text-blue-400" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Payroll Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your details...
						</p>
					</div>
				) : (
					<>
						{activeTab === "history" && (
							<div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 md:p-5 bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-4 w-full lg:w-auto">
									<div className="flex items-center gap-3 col-span-1 sm:col-span-2 lg:mr-4">
										<Search className="size-5 text-blue-600 dark:text-blue-400" />
										<span className="text-lg font-bold text-gray-900 dark:text-white">
											Payslip Archive
										</span>
									</div>

									<div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
										<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
											Year
										</span>
										<div className="relative">
											<select
												value={selectedYear}
												onChange={(e) =>
													setSelectedYear(
														e.target.value,
													)
												}
												className="w-full appearance-none bg-gray-50 dark:bg-[#0f1117] border-none rounded-xl text-sm font-bold py-2.5 pl-4 pr-10 outline-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
											>
												{years.map((y) => (
													<option key={y} value={y}>
														{y}
													</option>
												))}
											</select>
											<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
										</div>
									</div>

									<div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
										<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
											Month
										</span>
										<div className="relative">
											<select
												value={selectedMonth}
												onChange={(e) =>
													onSelectMonth(
														e.target.value,
													)
												}
												className="w-full appearance-none bg-gray-50 dark:bg-[#0f1117] border-none rounded-xl text-sm font-bold py-2.5 pl-4 pr-10 outline-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-blue-500 transition-all min-w-[140px] text-gray-900 dark:text-white"
											>
												<option value="" disabled>
													Select Month...
												</option>
												{months.map((m) => (
													<option
														key={m.id}
														value={m.month}
													>
														{m.month.split(" ")[0]}
													</option>
												))}
											</select>
											<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
										</div>
									</div>
								</div>

								{selectedMonth && (
									<button
										onClick={onDownload}
										className="w-full lg:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 lg:py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 mt-2 lg:mt-0"
									>
										<Download className="size-4" />
										Download PDF
									</button>
								)}
							</div>
						)}

						<div className="w-full">
							{activeTab === "history" && !breakdown ? (
								<div className="flex flex-col items-center justify-center py-16 md:py-24 bg-white dark:bg-[#1a1d26] rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
									<History className="size-12 md:size-16 text-gray-200 dark:text-gray-700 mb-4" />
									<h2 className="text-lg font-bold text-gray-900 dark:text-white">
										View History
									</h2>
									<p className="text-gray-500 dark:text-gray-400 text-sm text-center px-6">
										Select a month from the filters above to
										see your salary breakdown.
									</p>
								</div>
							) : (
								<SalaryBreakdownCard
									breakdown={breakdown}
									isHistorical={activeTab === "history"}
									selectedMonth={selectedMonth}
									getPaidDate={getPaidDate}
									onDownload={onDownload}
									onReturnToCurrent={onReturnToCurrent}
								/>
							)}
						</div>
					</>
				)}
			</main>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default PayrollUI;