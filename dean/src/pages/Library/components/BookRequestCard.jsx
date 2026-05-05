// src/pages/Library/components/BookRequestCard.jsx

import React, { useState } from "react";
import {
	Calendar,
	Hash,
	ChevronDown,
	ChevronUp,
	AlertCircle,
	Clock,
} from "lucide-react";

const BookRequestCard = ({ request, onCancelRequest }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const isRejected = request.status === "rejected";

	const formatDate = (dateStr) =>
		new Date(dateStr).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	const getStatusStyles = (status) => {
		switch (status?.toLowerCase()) {
			case "approved":
				return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
			case "rejected":
				return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
			case "pending":
				return "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300";
			case "extension-pending":
				return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
			default:
				return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
		}
	};

	/**
	 * Handles request cancellation with a confirmation prompt.
	 */
	const handleCancel = (e) => {
		e.stopPropagation();
		const confirmed = window.confirm(
			"Are you sure you want to cancel this request? This action cannot be undone.",
		);
		if (confirmed) {
			onCancelRequest(request.id);
		}
	};

	return (
		<div
			onClick={() => setIsExpanded(!isExpanded)}
			className={`group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-emerald-500/10 hover:border-emerald-500/30 ${
				isExpanded
					? "ring-emerald-500/10 border-emerald-500/30 shadow-lg"
					: "hover:shadow-md"
			}`}
		>
			<div className="p-4 sm:p-6">
				<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
					<div className="flex flex-col gap-2 flex-1">
						<div className="flex flex-wrap items-center gap-2">
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-emerald-600">
								{request.bookTitle}
							</h3>
							<span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider border border-gray-200/50 dark:border-gray-700">
								{request.category || "General"}
							</span>
						</div>
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
							<div className="flex items-center gap-1.5">
								<Calendar className="size-3.5 text-emerald-500" />
								{formatDate(request.requestDate)}
							</div>
							<div className="flex items-center gap-1.5">
								<Hash className="size-3.5 text-emerald-500" />
								{request.isbn}
							</div>
						</div>
					</div>

					<div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3">
						<span
							className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${getStatusStyles(request.status)}`}
						>
							{request.status.replace("-", " ")}
						</span>
						<div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] group-hover:text-emerald-500 transition-colors">
							{isExpanded ? (
								<>
									Collapse <ChevronUp className="size-3" />
								</>
							) : (
								<>
									View Details{" "}
									<ChevronDown className="size-3" />
								</>
							)}
						</div>
					</div>
				</div>

				{isExpanded && (
					<div className="mt-4 sm:mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
						<div className="grid grid-cols-2 gap-4 items-end">
							<div>
								<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									{request.status === "extension-pending"
										? "Due Date"
										: "Requested Duration"}
								</span>
								<p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
									{request.status === "extension-pending"
										? formatDate(request.dueDate) || "N/A"
										: request.durationDays
											? `${request.durationDays} Days`
											: "N/A"}
								</p>
							</div>

							{request.status === "pending" ? (
								<button
									onClick={handleCancel}
									className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-900/20 dark:border-gray-600 transition-all shadow-sm active:scale-95"
								>
									Cancel Request
								</button>
							) : (
								request.additionalDays && (
									<div>
										<span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
											Extension
										</span>
										<p className="text-sm text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
											<Clock className="size-3.5" />
											{request.additionalDays} Days
										</p>
									</div>
								)
							)}
						</div>

						{isRejected && (
							<div className="p-4 rounded-xl border bg-red-50/30 border-red-100 dark:bg-red-900/5 dark:border-red-800">
								<h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-red-600 mb-2">
									<AlertCircle className="size-5" />
									Rejection Reason
								</h4>
								<p className="text-sm text-gray-700 dark:text-gray-300 italic">
									{request.rejectionReason ||
										"No reason provided."}
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default BookRequestCard;
