// src/pages/ExamDuties/ExamDutiesUI.jsx

import React, { useEffect, useState } from "react";
import {
	RefreshCw,
	ArrowLeft,
	Calendar,
	History,
	Search,
	ChevronDown,
	AlertTriangle,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import MiniCalendar from "../../components/common/MiniCalendar";
import ExamDutyCard from "./components/ExamDutyCard";

const ExamDutiesUI = ({
	exams = [],
	stats,
	markers,
	loading,
	error,
	state,
	actions,
}) => {
	const navigate = useNavigate();
	const {
		activeTab,
		selectedYear,
		selectedMonth,
		selectedDateFilter,
		years,
		months,
	} = state;
	const {
		onRefresh,
		setActiveTab,
		setSelectedYear,
		setSelectedMonth,
		setSelectedDateFilter,
		onUpdateStatus,
		formatIsoToDate,
		formatIsoToTime,
	} = actions;

	const [calendarKey, setCalendarKey] = useState(0);
	const { assigned = 0, review = 0 } = stats || {};

	useEffect(() => {
		window.scrollTo(0, 0);
		setCalendarKey((prev) => prev + 1);
	}, [activeTab]);

	const statsData = [
		{
			label: "Assigned Duties",
			value: assigned.toString(),
			icon: CheckCircle2,
		},
		{
			label: "Review Pending",
			value: review.toString(),
			icon: AlertCircle,
		},
	];

	// Determine calendar constraints
	const calendarRestriction =
		activeTab === "history" && selectedMonth && selectedYear
			? new Date(parseInt(selectedYear), months.indexOf(selectedMonth), 1)
			: null;

	const minDate =
		activeTab === "current"
			? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
			: null;
	const showCalendar =
		activeTab === "current" || (activeTab === "history" && selectedMonth);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 font-sans">
			<HeaderController />

			{/* UI Header Section */}
			<div className="bg-gradient-to-br from-lime-600 via-lime-700 to-lime-800/90 dark:from-lime-900 dark:via-lime-950 dark:to-lime-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/dashboard")}
								className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors border border-white/10"
							>
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">
									Exam Duties
								</h1>
								<p className="text-lime-50 text-sm mt-0.5">
									View your upcoming invigilation timings and
									hall allocations.
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3 pb-2 md:pb-0">
							{statsData.map((stat, index) => (
								<StatSummaryCard key={index} {...stat} />
							))}
						</div>
					</div>

					{/* Tab Navigation */}
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{[
							{
								key: "current",
								label: "Upcoming Duties",
								icon: Calendar,
							},
							{
								key: "history",
								label: "Duty History",
								icon: History,
							},
						].map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.key}
									onClick={() => setActiveTab(tab.key)}
									className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										activeTab === tab.key
											? "bg-gray-50 dark:bg-[#0f1117] text-lime-700 dark:text-lime-400"
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

			<main className="px-4 py-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{error}
						</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" />
							Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-lime-600" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Duties Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your exam duties...
						</p>
					</div>
				) : (
					<>
						{/* Archive Filter Section */}
						{activeTab === "history" && (
							<div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 md:p-5 bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-4 w-full lg:w-auto">
									<div className="flex items-center gap-3 col-span-1 sm:col-span-2 lg:mr-4">
										<Search className="size-5 text-lime-600" />
										<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
											Duty Archive
										</h3>
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
													setSelectedMonth(
														e.target.value,
													)
												}
												className="w-full appearance-none bg-gray-50 dark:bg-[#0f1117] border-none rounded-xl text-sm font-bold py-2.5 pl-4 pr-10 outline-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
											>
												<option value="" disabled>
													Select Month...
												</option>
												{months.map((m) => (
													<option key={m} value={m}>
														{m}
													</option>
												))}
											</select>
											<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
										</div>
									</div>
								</div>
							</div>
						)}

						<div className="flex flex-col lg:flex-row gap-8 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
							{/* Sidebar Calendar */}
							{showCalendar && (
								<aside className="flex-shrink-0 w-full lg:w-80 space-y-6">
									<MiniCalendar
										key={calendarKey}
										customMarkers={markers}
										selectedDateColor="bg-lime-600"
										viewOnly={false}
										onDateClick={(date) =>
											setSelectedDateFilter((prev) =>
												prev === date ? null : date,
											)
										}
										selectedDate={selectedDateFilter}
										restrictToMonth={calendarRestriction}
										minDate={minDate}
									/>
								</aside>
							)}

							{/* Main Content Area */}
							<div className="flex-grow min-w-0 space-y-6">
								{activeTab === "history" && !selectedMonth ? (
									<div className="flex flex-col items-center justify-center py-16 md:py-24 bg-white dark:bg-[#1a1d26] rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
										<History className="size-12 md:size-16 text-gray-200 dark:text-gray-400 mb-4" />
										<h2 className="text-lg font-bold text-gray-900 dark:text-white">
											View Past Duties
										</h2>
										<p className="text-gray-500 dark:text-gray-400 text-sm text-center px-6">
											Select a month to see your duty
											history.
										</p>
									</div>
								) : (
									<div className="space-y-4">
										<div className="flex justify-between items-center px-1">
											<div className="flex items-center gap-4">
												{selectedDateFilter && (
													<button
														onClick={() =>
															setSelectedDateFilter(
																null,
															)
														}
														className="flex items-center justify-center size-9 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all"
													>
														<ArrowLeft className="size-4" />
													</button>
												)}
												<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
													{activeTab === "current"
														? "Invigilation Duties"
														: `${selectedMonth} ${selectedYear}`}
												</h3>
											</div>
											<span className="px-3 py-1 bg-lime-100 dark:bg-lime-900/40 rounded-full text-[10px] font-black text-lime-700 dark:text-lime-400 uppercase">
												{selectedDateFilter
													? formatIsoToDate(
															selectedDateFilter,
														)
													: `${exams.length} Total`}
											</span>
										</div>

										<section className="flex flex-col gap-4">
											{exams.map((exam) => (
												<ExamDutyCard
													key={exam.id}
													exam={exam}
													formatIsoToDate={
														formatIsoToDate
													}
													formatIsoToTime={
														formatIsoToTime
													}
													onUpdateStatus={
														onUpdateStatus
													}
												/>
											))}
										</section>

										{exams.length === 0 && !loading && (
											<div className="p-12 text-center text-gray-400 text-sm italic">
												No duties found for this period.
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</>
				)}
			</main>
			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default ExamDutiesUI;
