// src/components/layout/Notifications/NotificationUI.jsx

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
	X,
	Bell,
	Loader2,
	ChevronRight,
	CheckCheck,
	Info,
	Wallet,
	Wrench,
	ChevronDown,
	Package,
	Receipt,
	CalendarDays,
	NotebookPen,
	Library,
	Presentation,
	Send,
	Inbox,
	FileText,
} from "lucide-react";

/**
 * NotificationUI Component
 * Displays a modal-based tray containing user notifications categorized by type.
 */
const NotificationUI = ({
	isOpen,
	onClose,
	notifications,
	displayNotifications,
	isLoading,
	filter,
	setFilter,
	onMarkAsRead,
	onMarkAllAsRead,
}) => {
	if (!isOpen) return null;

	const categories = [
		"ALL",
		"MEETING",
		"EXAM_DUTY",
		"LEAVE_APPLICATION",
		"LIBRARY",
		"RESEARCH",
		"DOCUMENT_REQUEST",
		"ASSET_REQUEST",
		"MAINTENANCE",
		"FINANCE",
	];

	const formatDate = (dateStr) =>
		new Date(dateStr).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	const counts = useMemo(() => {
		const map = {};
		categories.forEach((cat) => {
			map[cat] =
				cat === "ALL"
					? notifications.filter((n) => !n.isRead).length
					: notifications.filter(
							(n) => n.type.startsWith(cat) && !n.isRead,
						).length;
		});
		return map;
	}, [notifications]);

	const sortedNotifications = useMemo(() => {
		return [...displayNotifications].sort((a, b) => {
			return new Date(b.createdAt) - new Date(a.createdAt);
		});
	}, [displayNotifications]);

	const getVisuals = (type) => {
		const config = {
			MEETING_REQUEST: {
				icon: <Presentation className="size-5" />,
				color: "text-rose-600",
				bg: "bg-rose-50 dark:bg-rose-900/20",
			},
			MEETING_RESCHEDULED: {
				icon: <Presentation className="size-5" />,
				color: "text-rose-600",
				bg: "bg-rose-50 dark:bg-rose-900/20",
			},
			EXAM_DUTY: {
				icon: <NotebookPen className="size-5" />,
				color: "text-lime-600",
				bg: "bg-lime-50 dark:bg-lime-900/20",
			},
			LEAVE_APPLICATION: {
				icon: <CalendarDays className="size-5" />,
				color: "text-orange-600",
				bg: "bg-orange-50 dark:bg-orange-900/20",
			},
			LIBRARY_REQUEST: {
				icon: <Library className="size-5" />,
				color: "text-green-600",
				bg: "bg-green-50 dark:bg-green-900/20",
			},
			RESEARCH_APPLICATION: {
				icon: <Send className="size-5" />,
				color: "text-emerald-600",
				bg: "bg-emerald-50 dark:bg-emerald-900/20",
			},
			RESEARCH_OWNER: {
				icon: <Inbox className="size-5" />,
				color: "text-emerald-600",
				bg: "bg-emerald-50 dark:bg-emerald-900/20",
			},
			RESEARCH_GRANT: {
				icon: <Wallet className="size-5" />,
				color: "text-emerald-600",
				bg: "bg-emerald-50 dark:bg-emerald-900/20",
			},
			DOCUMENT_REQUEST: {
				icon: <FileText className="size-5" />,
				color: "text-fuchsia-600",
				bg: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
			},
			ASSET_REQUEST: {
				icon: <Package className="size-5" />,
				color: "text-teal-600",
				bg: "bg-teal-50 dark:bg-teal-900/20",
			},
			MAINTENANCE_REQUEST: {
				icon: <Wrench className="size-5" />,
				color: "text-yellow-600",
				bg: "bg-yellow-50 dark:bg-yellow-900/20",
			},
			FINANCE_EXPENSE: {
				icon: <Receipt className="size-5" />,
				color: "text-green-600",
				bg: "bg-green-50 dark:bg-green-900/20",
			},
			FINANCE_ADVANCE: {
				icon: <Wallet className="size-5" />,
				color: "text-blue-600",
				bg: "bg-blue-50 dark:bg-blue-900/20",
			},
			default: {
				icon: <Info className="size-5" />,
				color: "text-gray-600",
				bg: "bg-gray-50 dark:bg-gray-900/20",
			},
		};

		return config[type] || config.default;
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#0f1117] w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col h-full max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300">
				{/* Section: Modal Header */}
				<div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#0f1117]">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30">
							<Bell className="size-5" />
						</div>
						<h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
							Notifications
						</h2>
					</div>

					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				<div className="flex flex-1 min-h-0 overflow-hidden">
					{/* Section: Sidebar Desktop Navigation */}
					<aside className="hidden md:flex w-56 flex-col border-r border-gray-200 dark:border-gray-800 px-4 py-6 bg-gray-50/50 dark:bg-gray-900/20 overflow-y-auto">
						<h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 px-1">
							Categories
						</h3>
						<div className="space-y-1">
							{categories.map((cat) => (
								<button
									key={cat}
									onClick={() => setFilter(cat)}
									className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === cat ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"}`}
								>
									<span>{cat.replace("_", " ")}</span>
									<span
										className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${filter === cat ? "bg-blue-100 dark:bg-blue-800/40" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}
									>
										{counts[cat]}
									</span>
								</button>
							))}
						</div>
					</aside>

					<div className="flex-1 flex flex-col min-h-0 overflow-hidden">
						{/* Section: Sub-header within the notification list area */}
						<div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-900/10">
							<div className="md:hidden flex-1">
								<div className="relative">
									<select
										value={filter}
										onChange={(e) =>
											setFilter(e.target.value)
										}
										className="w-full h-10 pl-3 pr-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-900 dark:text-white appearance-none cursor-pointer outline-none"
									>
										{categories.map((cat) => (
											<option key={cat} value={cat}>
												{cat.replace("_", " ")} (
												{counts[cat]})
											</option>
										))}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
								</div>
							</div>

							<div className="hidden md:block">
								<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
									{filter.replace("_", " ")}
								</span>
							</div>

							{counts[filter] > 0 && (
								<button
									onClick={onMarkAllAsRead}
									className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
								>
									<CheckCheck className="size-4" />
									<span className="hidden sm:inline">
										Mark{" "}
										{filter === "ALL" ? "all" : "category"}{" "}
										as read
									</span>
									<span className="sm:hidden text-[10px]">
										Mark Read
									</span>
								</button>
							)}
						</div>

						{/* Section: Notification Card List Container */}
						<div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white dark:bg-[#0f1117]">
							{isLoading ? (
								<div className="flex flex-col items-center justify-center py-20 gap-3">
									<Loader2 className="animate-spin text-blue-600 size-8" />
									<p className="text-sm text-gray-500">
										Loading your updates...
									</p>
								</div>
							) : sortedNotifications.length === 0 ? (
								<div className="text-center py-20">
									<p className="text-gray-400">
										No new notifications in this category.
									</p>
								</div>
							) : (
								sortedNotifications.map((n) => {
									const visuals = getVisuals(n.type);
									const dateObj = new Date(n.createdAt);
									return (
										<Link
											key={n.id}
											to={n.link}
											onClick={() => onMarkAsRead(n.id)}
											className="group flex flex-col gap-3 p-4 rounded-2xl transition-all bg-white dark:bg-gray-800/50 ring-1 ring-gray-200 dark:ring-gray-800 hover:ring-blue-300 dark:hover:ring-blue-900/50 shadow-sm sm:shadow-none border-l-4 border-blue-500"
										>
											<div className="flex items-start justify-between gap-3 sm:gap-4">
												<div className="flex items-start gap-4 flex-1">
													<div
														className={`relative p-2.5 rounded-xl transition-colors flex-shrink-0 ${visuals.bg} ${visuals.color}`}
													>
														{visuals.icon}
														<span className="absolute -top-1 -right-1 size-3 bg-blue-600 rounded-full ring-2 ring-white dark:ring-gray-800 animate-pulse" />
													</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<h3 className="font-semibold text-[14px] sm:text-sm text-gray-900 dark:text-white leading-tight line-clamp-1">
																{n.title}
															</h3>
														</div>
														<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2 line-clamp-2 sm:line-clamp-none">
															{n.message}
														</p>
														<div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
															<span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
																{n.type.replace(
																	"_",
																	" ",
																)}
															</span>
															<span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">
																•{" "}
																{formatDate(
																	dateObj,
																)}{" "}
																•{" "}
																{dateObj.toLocaleTimeString(
																	[],
																	{
																		hour: "2-digit",
																		minute: "2-digit",
																	},
																)}
															</span>
														</div>
													</div>
												</div>
												<ChevronRight className="size-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
											</div>
										</Link>
									);
								})
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotificationUI;
