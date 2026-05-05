// src/pages/AssetRequest/components/AssetRequestCard.jsx

import React, { useState } from "react";
import {
	Calendar,
	Clock,
	ChevronDown,
	ChevronUp,
	CheckCircle2,
	RotateCcw,
	XCircle,
	AlertCircle,
	History,
	ArrowRight,
} from "lucide-react";

const AssetRequestCard = ({ req, onEdit }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

	const isRejected = req.status === "Rejected";
	const isResubmissionRequired = isRejected && !req.isArchived;
	const isResubmitted = req.status === "Resubmitted";
	const isAccommodation = req.type === "Accommodation";

	const previousAttempt =
		req.previousVersion ||
		(req.history && req.history.length > 0
			? req.history[req.history.length - 1]
			: null);

	const getStatusStyles = (status) => {
		if (isResubmissionRequired)
			return "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300";
		if (isResubmitted)
			return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";

		switch (status) {
			case "Approved":
				return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
			case "Rejected":
				return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
			default:
				return "bg-amber-100 dark:bg-amber-100/10 text-amber-700 dark:text-amber-300";
		}
	};

	const formatReadableDuration = (durationStr) => {
		if (!durationStr) return durationStr;

		const totalDays = parseInt(durationStr) || 0;

		const y = Math.floor(totalDays / 365);
		const m = Math.floor((totalDays % 365) / 30);
		const w = Math.floor(((totalDays % 365) % 30) / 7);
		const d = Math.floor(((totalDays % 365) % 30) % 7);

		const parts = [];
		if (y > 0) parts.push(`${y}y`);
		if (m > 0) parts.push(`${m}m`);
		if (w > 0) parts.push(`${w}w`);
		if (d > 0) parts.push(`${d}d`);

		return parts.length > 0 ? parts.join(" ") : "0d";
	};

	const formatDate = (date) =>
		new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	const formatTime = (timeStr) => {
		if (!timeStr) return "--:--";

		const [hours24, minutes] = timeStr.split(":");
		const hours = parseInt(hours24, 10);

		if (isNaN(hours)) return timeStr;

		const period = hours >= 12 ? "PM" : "AM";
		const hours12 = hours % 12 || 12;

		return `${hours12}:${minutes} ${period}`;
	};

	return (
		<div
			className={`group bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200/60 dark:border-gray-800 transition-all duration-300 ring-1 ring-transparent hover:ring-teal-500/10 hover:border-teal-500/30 ${
				isExpanded
					? "ring-teal-500/10 border-teal-500/30 shadow-lg"
					: "hover:shadow-md"
			}`}
		>
			{/* Card Header (Collapsed State) */}
			<div className="p-4 sm:p-6">
				<div
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex flex-col md:flex-row md:items-start justify-between gap-4 cursor-pointer"
				>
					<div className="flex flex-col gap-2 flex-1">
						<div className="flex flex-wrap items-center gap-3">
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-teal-600">
								{req.assetName}
							</h3>
							<span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider border border-gray-200/50 dark:border-gray-700">
								{isAccommodation ? "Accommodation" : req.course}
							</span>
						</div>

						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
							<div className="flex items-center gap-1.5">
								<Calendar className="size-3.5 text-teal-500" />
								{req.date ? formatDate(req.date) : "N/A"}
							</div>
							<div className="flex items-center gap-1.5">
								<Clock className="size-3.5 text-teal-500" />
								{req.type === "Accommodation"
									? formatReadableDuration(req.duration)
									: `${formatTime(req.startTime)} - ${formatTime(req.endTime)}`}
							</div>
						</div>
					</div>

					<div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3">
						<span
							className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${getStatusStyles(req.status)}`}
						>
							{isResubmissionRequired
								? "Action Required"
								: req.status}
						</span>
						<div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] group-hover:text-teal-500 transition-colors">
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

				{/* Detailed View (Expanded State) */}
				{isExpanded && (
					<div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
						<div className="grid grid-cols-1 gap-6">
							<div className="space-y-6">
								<div className="space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										{isResubmitted
											? "Updated Purpose"
											: "Purpose of Request"}
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
										{req.reason || "No reason provided."}
									</p>
								</div>

								{/* Admin Decision/Feedback Section */}
								{(req.adminComments ||
									req.status === "Approved" ||
									isResubmissionRequired) && (
									<div
										className={`p-4 sm:p-5 rounded-xl border transition-colors ${
											req.status === "Approved"
												? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/5 dark:border-emerald-800"
												: isResubmissionRequired
													? "bg-orange-50/30 border-orange-100 dark:bg-orange-900/5 dark:border-orange-800"
													: "bg-red-50/30 border-red-100 dark:bg-red-900/5 dark:border-red-800"
										}`}
									>
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
											<h4
												className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${
													req.status === "Approved"
														? "text-emerald-600"
														: isResubmissionRequired
															? "text-orange-600"
															: "text-red-600"
												}`}
											>
												{req.status === "Approved" ? (
													<CheckCircle2 className="size-5" />
												) : isResubmissionRequired ? (
													<AlertCircle className="size-5" />
												) : (
													<XCircle className="size-5" />
												)}
												{isResubmissionRequired
													? "Action Required"
													: "Admin's Remarks"}
											</h4>

											<div className="flex items-center">
												{req?.approvalTime && (
													<p className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md">
														{formatDate(
															req.approvalTime,
														)}
													</p>
												)}

												{isResubmissionRequired && (
													<button
														onClick={(e) => {
															e.stopPropagation();
															onEdit(req);
														}}
														className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-sm active:scale-95"
													>
														<RotateCcw className="size-3" />
														Resubmit
													</button>
												)}
											</div>
										</div>

										<p className="text-sm text-gray-700 dark:text-gray-300 italic">
											{req.adminComments ||
												"No specific feedback provided."}
										</p>
									</div>
								)}

								{/* Collapsible Previous Submission Details */}
								{previousAttempt && (
									<div className="relative pl-6 py-1 border-l-2 border-gray-200 dark:border-gray-800 ml-2">
										<div
											onClick={(e) => {
												e.stopPropagation();
												setIsHistoryExpanded(
													!isHistoryExpanded,
												);
											}}
											className="flex items-center justify-between group/history cursor-pointer -ml-[38px] mb-2"
										>
											<div className="flex items-center gap-3">
												<div className="size-6 rounded-full bg-white dark:bg-[#1a1d26] border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center z-10">
													<History className="size-3 text-blue-700 dark:text-blue-300" />
												</div>
												<h4 className="text-sm font-black text-blue-600 dark:text-blue-700 uppercase tracking-widest group-hover/history:text-blue-500 transition-colors">
													Previous Submission Details
												</h4>
											</div>
											<div className="text-blue-600 dark:text-blue-700">
												{isHistoryExpanded ? (
													<ChevronUp className="size-5" />
												) : (
													<ChevronDown className="size-5" />
												)}
											</div>
										</div>

										{isHistoryExpanded && (
											<div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
												<div className="bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50">
													<div className="flex flex-wrap gap-x-8 gap-y-3 mb-4">
														<div>
															<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
																Asset
															</span>
															<div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
																{
																	previousAttempt.assetName
																}
															</div>
														</div>
														<div>
															<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
																Booking Date &
																Time
															</span>
															<div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
																{previousAttempt.date
																	? formatDate(
																			previousAttempt.date,
																		)
																	: "N/A"}
																<ArrowRight className="size-3" />
																{formatTime(
																	previousAttempt.startTime,
																)}{" "}
																-{" "}
																{formatTime(
																	previousAttempt.endTime,
																)}
															</div>
														</div>
													</div>

													<div className="space-y-3 pt-3 border-t border-gray-200/50 dark:border-gray-800">
														<div>
															<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
																Previous Purpose
															</span>
															<p className="text-sm text-gray-500 dark:text-gray-400 italic">
																{
																	previousAttempt.reason
																}
															</p>
														</div>
														<div>
															<span className="text-[10px] font-black text-red-600/80 uppercase tracking-widest">
																Admin's Remarks
															</span>
															<p className="text-sm text-gray-500 dark:text-gray-400">
																{previousAttempt.adminComments ||
																	"No reason provided."}
															</p>
														</div>
													</div>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AssetRequestCard;
