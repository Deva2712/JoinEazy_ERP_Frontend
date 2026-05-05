// src/components/layout/JobTray/JobTrayUI.jsx

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
	X,
	AlertCircle,
	Loader2,
	MessageSquare,
	ChevronRight,
	Inbox,
	Clock,
	User,
	Building2,
	BookMarked,
	Package,
	Receipt,
	Wallet,
	CalendarDays,
	NotebookPen,
	Wrench,
	ClipboardList,
	ChevronDown,
	BookUser,
	FileText,
} from "lucide-react";

/**
 * JobTrayUI Component
 * Displays a modal-based tray containing user jobs categorized by type.
 * UI Sections:
 * - Header: Title and Mark All as Read action.
 * - Sidebar (Desktop): Category filters.
 * - Main Content: Mobile filters and scrollable job card list.
 */
const JobTrayUI = ({
	isOpen,
	onClose,
	jobs,
	displayJobs,
	isLoading,
	filter,
	setFilter,
	onMarkAsRead,
}) => {
	if (!isOpen) return null;

	const jobTypes = [
		"ALL",
		"SESSION_PLANNING",
		"EXAM_DUTY",
		"LEAVE_APPLICATION",
		"LIBRARY",
		"RESEARCH",
		"DOCUMENT",
		"ASSET_REQUEST",
		"MAINTENANCE",
		"FINANCE",
		"MENTORING",
	];

	const formatDate = (dateStr) =>
		new Date(dateStr).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	const counts = useMemo(() => {
		const countsMap = {};
		jobTypes.forEach((type) => {
			if (type === "ALL") {
				countsMap[type] = jobs.length;
			} else {
				countsMap[type] = jobs.filter((job) =>
					job.type.startsWith(type),
				).length;
			}
		});
		return countsMap;
	}, [jobs]);

	const sortedJobs = [...displayJobs].sort((a, b) => {
		if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
		return new Date(b.createdAt) - new Date(a.createdAt);
	});

	const getJobIcon = (type) => {
		switch (type) {
			case "SESSION_PLANNING":
				return {
					icon: <ClipboardList className="size-5 text-indigo-600" />,
					bg: "bg-indigo-50 dark:bg-indigo-900/20",
				};
			case "EXAM_DUTY":
				return {
					icon: <NotebookPen className="size-5 text-lime-600" />,
					bg: "bg-lime-50 dark:bg-lime-900/20",
				};
			case "LEAVE_APPLICATION":
			case "SUBSTITUTION_REQUEST":
				return {
					icon: <CalendarDays className="size-5 text-orange-600" />,
					bg: "bg-orange-50 dark:bg-orange-900/20",
				};
			case "LIBRARY_OVERDUE":
				return {
					icon: <BookMarked className="size-5 text-green-600" />,
					bg: "bg-green-50 dark:bg-green-900/20",
				};
			case "RESEARCH_GRANT":
				return {
					icon: <Wallet className="size-5 text-green-600" />,
					bg: "bg-emerald-50 dark:bg-emerald-900/20",
				};
			case "DOCUMENT_DISPATCH":
				return {
					icon: <FileText className="size-5 text-fuchsia-600" />,
					bg: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
				};
			case "ASSET_REQUEST":
				return {
					icon: <Package className="size-5 text-teal-600" />,
					bg: "bg-teal-50 dark:bg-teal-900/20",
				};
			case "MAINTENANCE_REQUEST":
				return {
					icon: <Wrench className="size-5 text-yellow-600" />,
					bg: "bg-yellow-50 dark:bg-yellow-900/20",
				};
			case "FINANCE_EXPENSE":
				return {
					icon: <Receipt className="size-5 text-green-600" />,
					bg: "bg-green-50 dark:bg-green-900/20",
				};
			case "FINANCE_ADVANCE":
				return {
					icon: <Wallet className="size-5 text-blue-600" />,
					bg: "bg-blue-50 dark:bg-blue-900/20",
				};
			case "MENTORING_RECORD":
			case "MENTORING_ATTENDANCE":
				return {
					icon: <BookUser className="size-5 text-sky-600" />,
					bg: "bg-sky-50 dark:bg-sky-900/20",
				};
			default:
				return {
					icon: <AlertCircle className="size-5 text-gray-600" />,
					bg: "bg-gray-50 dark:bg-gray-900/20",
				};
		}
	};

	const getNoteIcon = (text, jobType) => {
		const lowerText = text.toLowerCase();
		if (lowerText.includes("hod") || lowerText.includes("hr"))
			return <User className="size-3.5 flex-shrink-0 mt-0.5" />;
		if (lowerText.includes("exam"))
			return <Building2 className="size-3.5 flex-shrink-0 mt-0.5" />;
		if (jobType === "SUBSTITUTION_REQUEST") {
			return text.includes(":") ? (
				<Clock className="size-3.5 flex-shrink-0 mt-0.5" />
			) : (
				<BookMarked className="size-3.5 flex-shrink-0 mt-0.5" />
			);
		}
		if (jobType === "LIBRARY_OVERDUE") {
			return <AlertCircle className="size-3.5 flex-shrink-0 mt-0.5" />;
		}
		return <MessageSquare className="size-3.5 flex-shrink-0 mt-0.5" />;
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#0f1117] w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col h-full max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300">
				{/* Section: Modal Header */}
				<div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#0f1117]">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
							<Inbox className="size-5" />
						</div>
						<h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
							Job Tray
						</h2>
					</div>

					<div className="flex items-center gap-2 sm:gap-4">
						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
						>
							<X className="size-5 text-gray-500" />
						</button>
					</div>
				</div>

				<div className="flex flex-1 min-h-0 overflow-hidden">
					{/* Section: Sidebar Desktop Navigation */}
					<aside className="hidden md:flex w-56 flex-col border-r border-gray-200 dark:border-gray-800 px-4 py-6 bg-gray-50/50 dark:bg-gray-900/20 overflow-y-auto">
						<h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 px-1">
							Categories
						</h3>
						<div className="space-y-1">
							{jobTypes.map((t) => (
								<button
									key={t}
									onClick={() => setFilter(t)}
									className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === t ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"}`}
								>
									<span>{t.replace("_", " ")}</span>
									<span
										className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${filter === t ? "bg-blue-100 dark:bg-blue-800/40" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}
									>
										{counts[t]}
									</span>
								</button>
							))}
						</div>
					</aside>

					<div className="flex-1 flex flex-col min-h-0 overflow-hidden">
						{/* Section: Mobile Navigation Filter */}
						<div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 md:hidden flex items-center gap-3">
							<div className="relative flex-1">
								<select
									value={filter}
									onChange={(e) => setFilter(e.target.value)}
									className="w-full h-11 pl-4 pr-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 outline-none"
								>
									{jobTypes.map((t) => (
										<option key={t} value={t}>
											{t.replace("_", " ")} ({counts[t]})
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
							</div>
						</div>

						{/* Section: Job Card List Container */}
						<div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
							{isLoading ? (
								<div className="flex justify-center py-10">
									<Loader2 className="animate-spin text-blue-600" />
								</div>
							) : (
								sortedJobs.map((job) => {
									const { icon, bg } = getJobIcon(job.type);
									const dateObj = new Date(job.createdAt);
									return (
										<Link
											key={job.id}
											to={job.link}
											onClick={() => onMarkAsRead(job.id)}
											className={`group flex flex-col gap-4 p-4 rounded-2xl transition-all bg-white dark:bg-gray-800/50 ring-1 ring-gray-200 dark:ring-gray-800 hover:ring-blue-300 dark:hover:ring-blue-900/50 shadow-sm sm:shadow-none ${!job.isRead ? "border-l-4 border-blue-500" : ""}`}
										>
											<div className="flex items-start justify-between gap-3 sm:gap-4">
												<div className="flex items-start gap-4 flex-1">
													<div
														className={`relative p-2.5 rounded-xl transition-colors flex-shrink-0 ${bg}`}
													>
														{icon}
														{!job.isRead && (
															<span className="absolute -top-1 -right-1 size-3 bg-blue-600 rounded-full ring-2 ring-white dark:ring-gray-800 animate-pulse" />
														)}
													</div>
													<div className="flex-1 min-w-0">
														<h3 className="font-semibold text-[14px] sm:text-sm text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2">
															{job.title}
														</h3>
														<div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
															<span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
																{job.type.replace(
																	"_",
																	" ",
																)}
															</span>
															{job.createdAt && (
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
															)}
														</div>
													</div>
												</div>
												<ChevronRight className="size-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
											</div>

											{job.statusNote && (
												<div className="mt-1 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 flex flex-col gap-2 bg-gray-50 dark:bg-gray-900/60 p-3 sm:p-3.5 rounded-xl border border-gray-100 dark:border-gray-700">
													{job.statusNote
														.split(" | ")
														.map((note, index) => (
															<div
																key={index}
																className="flex items-start gap-2.5"
															>
																{getNoteIcon(
																	note,
																	job.type,
																)}
																<p className="leading-relaxed break-words">
																	{note}
																</p>
															</div>
														))}
												</div>
											)}
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

export default JobTrayUI;
