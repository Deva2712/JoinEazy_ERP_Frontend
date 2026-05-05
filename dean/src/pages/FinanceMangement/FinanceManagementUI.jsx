// src/pages/FinanceMangement/FinanceManagementUI.jsx

import React, { useState, useMemo, useEffect } from "react";
import {
	Plus,
	Receipt,
	Wallet,
	Clock,
	FileText,
	RefreshCw,
	AlertCircle,
	ArrowLeft,
	History,
	Search,
	SlidersHorizontal,
	User,
	AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import AdminContactSidebar from "../../components/common/AdminContactSidebar";
import FinanceRequestCard from "./components/FinanceRequestCard";
import FinanceRequestModal from "./components/FinanceRequestModal";
import HistoryFilterSidebar from "./components/HistoryFilterSidebar";

const EmptyState = ({ activeTab }) => (
	<div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
		<div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-full mb-6 text-amber-500">
			<FileText className="w-10 h-10" />
		</div>
		<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
			No {activeTab} Records
		</h3>
		<p className="text-sm text-gray-500 max-w-xs">
			Try adjusting your filters or search query to find what you're
			looking for.
		</p>
	</div>
);

const FinanceManagementUI = ({
	expenses = [],
	advances = [],
	allExpenses = [],
	allAdvances = [],
	admins = [],
	loading,
	error,
	activeTab,
	onTabChange,
	onRefresh,
	onSubmit,
	filters,
	setFilters,
}) => {
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
	const [modalType, setModalType] = useState("Expense");
	const [editingItem, setEditingItem] = useState(null);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	const filterMetadata = useMemo(() => {
		const years = new Set();
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		[...allExpenses, ...allAdvances].forEach((item) => {
			const date = new Date(
				item.appliedAt || item.createdAt || item.date,
			);
			if (!isNaN(date.getTime()))
				years.add(date.getFullYear().toString());
		});
		return { years: Array.from(years).sort((a, b) => b - a), months };
	}, [allExpenses, allAdvances]);

	const groupedHistory = useMemo(() => {
		let allHistory =
			filters.type === "all"
				? [...expenses, ...advances]
				: filters.type === "expenses"
					? [...expenses]
					: [...advances];
		if (filters.search) {
			const query = filters.search.toLowerCase().trim();
			allHistory = allHistory.filter(
				(item) =>
					item.title?.toLowerCase().includes(query) ||
					item.category?.toLowerCase().includes(query),
			);
		}
		const groups = {};
		allHistory.forEach((item) => {
			const date = new Date(
				item.appliedAt || item.createdAt || item.date,
			);
			const itemYear = date.getFullYear().toString();
			const itemMonth = date.toLocaleString("default", { month: "long" });
			if (filters.year !== "all" && itemYear !== filters.year) return;
			if (filters.month !== "" && itemMonth !== filters.month) return;
			const monthYear = date.toLocaleString("default", {
				month: "long",
				year: "numeric",
			});
			if (!groups[monthYear]) groups[monthYear] = [];
			groups[monthYear].push(item);
		});
		return groups;
	}, [expenses, advances, filters]);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 font-sans">
			<HeaderController />

			{/* Header / Stats Section */}
			<div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 dark:from-amber-800 dark:via-amber-950 dark:to-amber-950 text-white">
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
									Finance Management
								</h1>
								<p className="text-white/80 text-sm mt-0.5">
									Manage your expenses and advances.
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<StatSummaryCard
								label="Pending Requests"
								value={[...allExpenses, ...allAdvances]
									.filter(
										(e) =>
											e.status === "Pending" ||
											e.status === "Resubmitted",
									)
									.length.toString()}
								icon={Clock}
							/>
							<StatSummaryCard
								label="Action Required"
								value={[...allExpenses, ...allAdvances]
									.filter((e) => e.status === "Rejected")
									.length.toString()}
								icon={AlertCircle}
							/>
						</div>
					</div>

					{/* Tab Navigation */}
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{[
							{
								key: "expenses",
								label: "Expense Claims",
								icon: Receipt,
							},
							{
								key: "advances",
								label: "Advances Requests",
								icon: Wallet,
							},
							{ key: "history", label: "History", icon: History },
							{
								key: "support",
								label: "Support",
								icon: User,
								mobileOnly: true,
							},
						].map((tab) => (
							<button
								key={tab.key}
								onClick={() => onTabChange(tab.key)}
								className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${tab.mobileOnly ? "lg:hidden" : ""} ${activeTab === tab.key ? "bg-gray-50 dark:bg-[#0f1117] text-amber-700 dark:text-amber-500 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.1)]" : "text-white/70 hover:text-white hover:bg-white/10"}`}
							>
								<tab.icon className="w-4 h-4" /> {tab.label}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 py-8 pb-24">
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
							className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" />
							Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-amber-600" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Finances Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your claims and
							requests...
						</p>
					</div>
				) : (
					<div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
						{/* Mobile Support Tab View */}
						<div
							className={`flex-grow ${activeTab === "support" ? "block lg:hidden" : "block"}`}
						>
							{activeTab === "support" ? (
								<AdminContactSidebar
									admins={admins}
									themeColor="amber"
									isTabbedView={true}
								/>
							) : (
								<div className="space-y-6">
									{/* Search & Filter Trigger for History */}
									{activeTab === "history" && (
										<div className="space-y-4">
											<div className="flex gap-3">
												<div className="relative flex-grow group">
													<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
													<input
														type="text"
														placeholder="Search by title or category..."
														value={filters.search}
														onChange={(e) =>
															setFilters({
																...filters,
																search: e.target
																	.value,
															})
														}
														className="w-full pl-12 pr-4 py-3.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all"
													/>
												</div>

												<button
													onClick={() =>
														setIsFilterDrawerOpen(
															true,
														)
													}
													className="lg:hidden px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-sm transition-all hover:border-amber-500/50 active:scale-95"
												>
													<SlidersHorizontal className="size-5 text-amber-600" />
												</button>
											</div>
										</div>
									)}

									{/* Header for Claims/Advances */}
									{activeTab !== "history" && (
										<div className="flex items-center justify-between mb-2">
											<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
												{activeTab === "expenses"
													? "Your Expense Claims"
													: "Your Advance Requests"}
											</h3>
											<div className="flex items-center gap-2">
												<button
													onClick={onRefresh}
													className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
												>
													<RefreshCw
														className={`size-5 ${loading ? "animate-spin" : ""}`}
													/>
												</button>
												<button
													onClick={() => {
														setModalType(
															activeTab ===
																"expenses"
																? "Expense"
																: "Advance",
														);
														setIsModalOpen(true);
													}}
													className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
												>
													<Plus className="size-4" />{" "}
													New{" "}
													{activeTab === "expenses"
														? "Claim"
														: "Request"}
												</button>
											</div>
										</div>
									)}

									{activeTab === "history" ? (
										Object.entries(groupedHistory).length >
										0 ? (
											Object.entries(groupedHistory).map(
												([month, items]) => (
													<div
														key={month}
														className="space-y-4"
													>
														<div className="flex items-center gap-4">
															<h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest">
																{month}
															</h4>
															<div className="h-px flex-grow bg-gray-200 dark:bg-gray-800" />
														</div>
														<div className="grid gap-4">
															{items.map(
																(item) => (
																	<FinanceRequestCard
																		key={
																			item.id
																		}
																		item={
																			item
																		}
																		type={
																			item.amount_requested
																				? "Advance"
																				: "Expense"
																		}
																		onEdit={(
																			data,
																		) => {
																			setEditingItem(
																				data,
																			);
																			setModalType(
																				data.amount_requested
																					? "Advance"
																					: "Expense",
																			);
																			setIsModalOpen(
																				true,
																			);
																		}}
																	/>
																),
															)}
														</div>
													</div>
												),
											)
										) : (
											<EmptyState activeTab="History" />
										)
									) : (
										<div className="grid gap-4">
											{(activeTab === "expenses"
												? expenses
												: advances
											).map((item) => (
												<FinanceRequestCard
													key={item.id}
													item={item}
													type={
														activeTab === "expenses"
															? "Expense"
															: "Advance"
													}
													onEdit={(data) => {
														setEditingItem(data);
														setModalType(
															activeTab ===
																"expenses"
																? "Expense"
																: "Advance",
														);
														setIsModalOpen(true);
													}}
												/>
											))}
										</div>
									)}
								</div>
							)}
						</div>

						{/* Desktop Sidebar Logic */}
						<div className="hidden lg:block w-80 shrink-0">
							{activeTab === "history" ? (
								<HistoryFilterSidebar
									filters={filters}
									setFilters={setFilters}
									filterMetadata={filterMetadata}
									isOpen={isFilterDrawerOpen}
									onClose={() => setIsFilterDrawerOpen(false)}
								/>
							) : (
								<AdminContactSidebar
									admins={admins}
									themeColor="amber"
								/>
							)}
						</div>
					</div>
				)}
			</main>

			{/* Form Modals & Navigation */}
			<FinanceRequestModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setEditingItem(null);
				}}
				type={modalType}
				initialData={editingItem}
				onSubmit={onSubmit}
			/>

			{/* Mobile Filter Overlay */}
			<div className="lg:hidden">
				<HistoryFilterSidebar
					filters={filters}
					setFilters={setFilters}
					filterMetadata={filterMetadata}
					isOpen={isFilterDrawerOpen}
					onClose={() => setIsFilterDrawerOpen(false)}
				/>
			</div>
			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default FinanceManagementUI;
