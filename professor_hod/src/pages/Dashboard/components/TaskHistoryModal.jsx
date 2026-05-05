// src/pages/Dashboard/components/TaskHistoryModal.jsx

import React, { useState, useMemo } from "react";
import {
	History,
	X,
	CheckCircle2,
	XCircle,
	Calendar,
	ChevronDown,
} from "lucide-react";

/**
 * Modal component to display the history of completed or cancelled tasks.
 * Supports paginated viewing in increments of 7 days.
 */
const TaskHistoryModal = ({ isOpen, onClose, groupedHistory }) => {
	const [visibleDays, setVisibleDays] = useState(7);

	// Sort dates descending and get visible set
	const sortedDates = useMemo(() => {
		return Object.keys(groupedHistory).sort(
			(a, b) => new Date(b) - new Date(a),
		);
	}, [groupedHistory]);

	const displayedDates = sortedDates.slice(0, visibleDays);
	const hasMore = sortedDates.length > visibleDays;

	const handleShowMore = () => {
		setVisibleDays((prev) => prev + 7);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] w-full max-w-7xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				{/* Header Section */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
							<History className="size-5" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white">
								Task History
							</h2>
							<p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
								Review your past activities
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				{/* Scrollable Body Content */}
				<div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-transparent">
					{displayedDates.length > 0 ? (
						<>
							{displayedDates.map((date) => (
								<div key={date} className="mb-10 last:mb-0">
									{/* Date Group Header */}
									<div className="flex items-center gap-3 mb-4 px-1">
										<h3 className="text-xs font-bold uppercase tracking-widest text-blue-500/80">
											{date === new Date().toDateString()
												? "Today"
												: new Date(
														date,
													).toLocaleDateString(
														"en-US",
														{
															weekday: "short",
															day: "numeric",
															month: "short",
															year: "numeric",
														},
													)}
										</h3>
										<div className="h-px flex-1 bg-gray-100 dark:bg-white/5"></div>
									</div>

									{/* Grid Display */}
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
										{groupedHistory[date].map(
											(task, idx) => (
												<div
													key={idx}
													className="group/item flex items-center gap-4 px-4 py-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300"
												>
													<div className="flex-shrink-0">
														{task.status ===
														"completed" ? (
															<CheckCircle2 className="w-5 h-5 text-green-500" />
														) : (
															<XCircle className="w-5 h-5 text-red-500" />
														)}
													</div>

													<div className="flex-1 min-w-0">
														<p className="text-sm font-semibold truncate text-gray-800 dark:text-gray-200">
															{task.title}
														</p>
														<div className="flex items-center gap-2 mt-1">
															<Calendar className="w-3 h-3 text-gray-400" />
															<span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
																{task.time}
															</span>
														</div>
													</div>
												</div>
											),
										)}
									</div>
								</div>
							))}

							{/* Show More Button */}
							{hasMore && (
								<div className="mt-8 flex justify-center pb-4">
									<button
										onClick={handleShowMore}
										className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
									>
										<ChevronDown className="w-4 h-4" />
										Show earlier history
									</button>
								</div>
							)}
						</>
					) : (
						/* Empty State View */
						<div className="flex flex-col items-center justify-center py-20">
							<div className="bg-white dark:bg-[#1a1d26] p-4 rounded-full shadow-sm mb-4 border border-gray-100 dark:border-gray-800">
								<History className="w-10 h-10 text-gray-200 dark:text-gray-700" />
							</div>
							<p className="text-sm font-bold text-gray-900 dark:text-gray-200">
								No history recorded
							</p>
							<p className="text-xs text-gray-500 mt-1">
								Tasks you complete or cancel will appear here.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TaskHistoryModal;
