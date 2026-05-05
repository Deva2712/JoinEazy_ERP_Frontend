import React, { useState, useMemo } from "react";
import {
	Bell,
	X,
	AlertCircle,
	Info,
	AlertTriangle,
	Clock,
	Filter,
    RefreshCcw,
    SlidersHorizontal,
    SearchX,
} from "lucide-react";

/**
 * Sidebar component to display urgent department notifications and alerts.
 * Matches the transition logic of the Library Filter Sidebar to prevent layout flashing.
 */
const DepartmentAlertsSidebar = ({ isOpen, onClose, alerts = [] }) => {
	const [priorityFilter, setPriorityFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");

	const categories = useMemo(() => {
		const unique = [...new Set(alerts.map((a) => a.category || "General"))];
		return unique.sort();
	}, [alerts]);

	const filteredAlerts = alerts.filter((alert) => {
		const matchesPriority =
			priorityFilter === "all" ||
			alert.priority?.toLowerCase() === priorityFilter;
		const matchesCategory =
			categoryFilter === "all" ||
			(alert.category || "General") === categoryFilter;
		return matchesPriority && matchesCategory;
	});

	const getAlertIcon = (priority) => {
		switch (priority?.toLowerCase()) {
			case "high":
				return <AlertCircle className="size-5 text-rose-500" />;
			case "medium":
				return <AlertTriangle className="size-5 text-amber-500" />;
			default:
				return <Info className="size-5 text-blue-500" />;
		}
	};

	return (
		<>
			<div
				className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
					isOpen ? "opacity-100 visible" : "opacity-0 invisible"
				}`}
				onClick={onClose}
			/>

			<aside
				className={`fixed bottom-0 right-0 md:top-0 z-[110] w-full max-w-full md:max-w-[420px] md:h-full max-h-[85vh] md:max-h-full bg-white dark:bg-[#0f1117] border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 rounded-t-[2rem] md:rounded-t-none shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${
					isOpen
						? "translate-y-0 md:translate-x-0"
						: "translate-y-full md:translate-y-0 md:translate-x-full"
				}`}
			>
				{/* Header Section */}
				<div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-violet-50 dark:bg-violet-500/10 rounded-xl">
							<Bell className="size-5 text-violet-600" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white">
								Department Alerts
							</h2>
							<p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
								{filteredAlerts.length} active notifications
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-red-500 transition-colors"
					>
						<X className="size-5" />
					</button>
				</div>

				{/* Filter Section (Top Position) */}
				<div className="p-4 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-200 dark:border-gray-800">
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<label className="text-[10px] font-bold uppercase text-gray-400 px-1">
								Priority
							</label>
							<select
								value={priorityFilter}
								onChange={(e) =>
									setPriorityFilter(e.target.value)
								}
								className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500/20 outline-none"
							>
								<option value="all">All Priorities</option>
								<option value="high">High</option>
								<option value="medium">Medium</option>
								<option value="low">Low</option>
							</select>
						</div>
						<div className="space-y-1">
							<label className="text-[10px] font-bold uppercase text-gray-400 px-1">
								Category
							</label>
							<select
								value={categoryFilter}
								onChange={(e) =>
									setCategoryFilter(e.target.value)
								}
								className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500/20 outline-none"
							>
								<option value="all">All Categories</option>
								{categories.map((cat) => (
									<option key={cat} value={cat}>
										{cat}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				{/* Alert List Section */}
				<div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
					{filteredAlerts.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 text-center">
							<div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-full mb-4">
								<SearchX className="size-8 text-gray-300" />
							</div>
							<p className="text-sm font-bold text-gray-400">
								No matches found
							</p>
							<button
								onClick={() => {
									setPriorityFilter("all");
									setCategoryFilter("all");
								}}
								className="mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 shadow-sm transition-all text-sm font-bold w-full sm:w-auto"
							>
								<RefreshCcw className="size-4" />
								Clear Filters
							</button>
							{/* <button
								onClick={() => {
									setPriorityFilter("all");
									setCategoryFilter("all");
								}}
								className="mt-2 text-xs text-violet-500 font-bold hover:underline"
							>
								Clear filters
							</button> */}
						</div>
					) : (
						filteredAlerts.map((alert, index) => (
							<div
								key={alert.id || index}
								className="group p-4 bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-violet-200 dark:hover:border-violet-900/30 transition-all duration-300 shadow-sm"
							>
								<div className="flex gap-4">
									<div className="mt-1">
										{getAlertIcon(alert.priority)}
									</div>
									<div className="flex-1">
										<div className="flex items-center justify-between mb-1">
											<span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
												{alert.category || "General"}
											</span>
											<div className="flex items-center gap-1 text-gray-400">
												<Clock className="size-3" />
												<span className="text-[10px] font-medium">
													{alert.timestamp ||
														"Just now"}
												</span>
											</div>
										</div>
										<h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
											{alert.title}
										</h3>
										<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
											{alert.message}
										</p>

										{alert.actionRequired && (
											<button className="mt-3 text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline">
												Take Action →
											</button>
										)}
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</aside>
		</>
	);
};

export default DepartmentAlertsSidebar;
