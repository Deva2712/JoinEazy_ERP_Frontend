// src/pages/FinanceManagement/components/FinanceRequestCard.jsx

import React, { useState } from "react";
import {
	Calendar,
	IndianRupee,
	ChevronDown,
	ChevronUp,
	CheckCircle2,
	ExternalLink,
	RotateCcw,
	XCircle,
	AlertCircle,
	Tag,
	Wallet,
	Receipt,
	History,
	FileText,
} from "lucide-react";

const FinanceRequestCard = ({ item, type, onEdit }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

	const isRejected = item.status === "Rejected";
	const isResubmissionRequired =
		isRejected && !item.is_closed && !item.isArchived;
	const isResubmitted = item.status === "Resubmitted";

	const isExpense = type === "Expense";
	const Icon = isExpense ? Receipt : Wallet;

	const typeAccentColor = isExpense
		? "text-emerald-600 dark:text-emerald-400"
		: "text-blue-600 dark:text-blue-400";
	const typeBorderColor = isExpense
		? "border-l-emerald-500 dark:border-l-emerald-400"
		: "border-l-blue-500 dark:border-l-blue-400";

	const previousAttempt = item.previousVersion || null;

	const getStatusStyles = (status) => {
		if (isResubmissionRequired)
			return "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300";
		if (isResubmitted)
			return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";

		switch (status) {
			case "Approved":
			case "Reimbursed":
				return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
			case "Rejected":
				return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
			default:
				return "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300";
		}
	};

	const amount = isExpense ? item.amount_spent : item.amount_requested;

	const formatDate = (date) =>
		date
			? new Date(date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})
			: "N/A";

	const formattedApprovalDate = item.approvalTime
		? formatDate(item.approvalTime)
		: null;

	return (
		<div
			className={`group bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 border-l-4 ${typeBorderColor} transition-all duration-300 hover:shadow-md ${
				isExpanded
					? "shadow-lg ring-1 ring-gray-200 dark:ring-gray-800"
					: ""
			}`}
		>
			{/* Card Header (Collapsed State) */}
			<div className="p-4 sm:p-5 md:p-6">
				<div
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
				>
					<div className="flex items-start gap-3 sm:gap-4">
						<div className="p-2.5 sm:p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
							<Icon
								className={`size-5 sm:size-6 ${typeAccentColor}`}
							/>
						</div>
						<div className="min-w-0 flex-1">
							<div className="flex flex-wrap items-center gap-2 mb-1">
								<h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
									{item.title}
								</h3>
								<span
									className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${getStatusStyles(item.status)}`}
								>
									{isResubmissionRequired
										? "Action Required"
										: item.status}
								</span>
							</div>
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
								<div className="flex items-center gap-1.5">
									<Calendar className="size-3.5" />
									{formatDate(item.date)}
								</div>
								<div className="flex items-center gap-1.5">
									<Tag className="size-3.5" />
									{item.category}
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between md:justify-end gap-4 border-t border-gray-100 dark:border-gray-800 md:border-t-0 pt-3 md:pt-0">
						<div className="flex flex-col text-left md:text-right">
							<p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
								{isExpense ? "Spent" : "Requested"}
							</p>
							<p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white flex items-center md:justify-end">
								<IndianRupee className="size-3.5 sm:size-4 mr-0.5" />
								{parseFloat(amount).toLocaleString("en-IN")}
							</p>
						</div>
						<div className="p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
							{isExpanded ? (
								<ChevronUp className="size-5 text-gray-400" />
							) : (
								<ChevronDown className="size-5 text-gray-400" />
							)}
						</div>
					</div>
				</div>

				{/* Detailed View (Expanded State) */}
				{isExpanded && (
					<div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
						<div className="grid grid-cols-1 gap-6">
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{item.description && (
										<div className="space-y-2">
											<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
												{isResubmitted
													? "Updated Justification"
													: "Justification"}
											</h4>
											<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-700">
												{item.description}
											</p>
										</div>
									)}

									{(item.proof_doc_link ||
										item.proof_doc_file) && (
										<div className="flex-1 space-y-2">
											<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
												Receipt / Proof
											</h4>
											<div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-xl space-y-3 border border-gray-100 dark:border-gray-700">
												{item.proof_doc_link && (
													<a
														href={
															item.proof_doc_link
														}
														target="_blank"
														rel="noopener noreferrer"
														onClick={(e) =>
															e.stopPropagation()
														}
														className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold truncate max-w-full hover:underline"
													>
														<ExternalLink className="size-4 flex-shrink-0" />
														<span className="truncate">
															{
																item.proof_doc_link
															}
														</span>
													</a>
												)}

												{item.proof_doc_file && (
													<div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
														<FileText className="size-4 flex-shrink-0" />
														<span className="truncate">
															{item.proof_doc_file
																.name ||
																"Attached File"}
														</span>
													</div>
												)}
											</div>
										</div>
									)}
								</div>

								{/* Admin Decision/Feedback Section */}
								{(item.adminComments ||
									formattedApprovalDate ||
									isResubmissionRequired) && (
									<div
										className={`p-4 sm:p-5 rounded-xl border transition-colors ${
											item.status === "Approved" ||
											item.status === "Reimbursed"
												? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800"
												: isResubmissionRequired
													? "bg-orange-50/30 border-orange-100 dark:bg-orange-900/10 dark:border-orange-800"
													: "bg-red-50/30 border-red-100 dark:bg-red-900/10 dark:border-red-800"
										}`}
									>
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
											<h4
												className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${
													item.status ===
														"Approved" ||
													item.status === "Reimbursed"
														? "text-emerald-600"
														: isResubmissionRequired
															? "text-orange-600"
															: "text-red-600"
												}`}
											>
												{item.status === "Approved" ||
												item.status === "Reimbursed" ? (
													<CheckCircle2 className="size-4 sm:size-5" />
												) : isResubmissionRequired ? (
													<AlertCircle className="size-4 sm:size-5" />
												) : (
													<XCircle className="size-4 sm:size-5" />
												)}
												{isResubmissionRequired
													? "Action Required"
													: "Admin's Remarks"}
											</h4>

											<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
												{formattedApprovalDate && (
													<p className="text-center text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md">
														{formattedApprovalDate}
													</p>
												)}

												{isResubmissionRequired && (
													<button
														onClick={(e) => {
															e.stopPropagation();
															onEdit(item);
														}}
														className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-sm"
													>
														<RotateCcw className="size-3" />
														Resubmit
													</button>
												)}
											</div>
										</div>

										<p className="text-sm text-gray-700 dark:text-gray-300 italic">
											{item.adminComments ||
												"No specific feedback provided."}
										</p>
									</div>
								)}

								{/* Collapsible History Section */}
								{previousAttempt && (
									<div className="relative pl-5 sm:pl-6 py-1 border-l-2 border-gray-200 dark:border-gray-800 ml-2 sm:ml-3">
										<div
											onClick={(e) => {
												e.stopPropagation();
												setIsHistoryExpanded(
													!isHistoryExpanded,
												);
											}}
											className="flex items-center justify-between group/history cursor-pointer -ml-[33px] sm:-ml-[38px] mb-2"
										>
											<div className="flex items-center gap-3">
												<div className="size-5 sm:size-6 rounded-full bg-white dark:bg-[#1a1d26] border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center z-10">
													<History className="size-2.5 sm:size-3 text-blue-700 dark:text-blue-300" />
												</div>
												<h4 className="text-[11px] sm:text-sm font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest group-hover/history:text-blue-400 transition-colors">
													Previous Submission Details
												</h4>
											</div>
											<div className="text-blue-600 dark:text-blue-500">
												{isHistoryExpanded ? (
													<ChevronUp className="size-5" />
												) : (
													<ChevronDown className="size-5" />
												)}
											</div>
										</div>

										{isHistoryExpanded && (
											<div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
												<div className="bg-gray-50/50 dark:bg-gray-800/20 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-800/50">
													<div className="flex flex-wrap gap-x-6 gap-y-3 mb-4">
														<div>
															<span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
																Original Amount
															</span>
															<div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold flex items-center">
																<IndianRupee className="size-3 mr-0.5" />
																{parseFloat(
																	previousAttempt.amount_spent ||
																		previousAttempt.amount_requested,
																).toLocaleString(
																	"en-IN",
																)}
															</div>
														</div>
														<div>
															<span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
																Submission Date
															</span>
															<div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium">
																{formatDate(
																	previousAttempt.date,
																)}
															</div>
														</div>
													</div>

													<div className="space-y-3 pt-3 border-t border-gray-200/50 dark:border-gray-800">
														{previousAttempt.proof_doc_link && (
															<div>
																<span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
																	Previous
																	Receipt
																</span>
																<div className="mt-1">
																	<a
																		href={
																			previousAttempt.proof_doc_link
																		}
																		target="_blank"
																		rel="noopener noreferrer"
																		onClick={(
																			e,
																		) =>
																			e.stopPropagation()
																		}
																		className="inline-flex items-center gap-2 text-blue-500/80 hover:text-blue-600 text-[11px] font-semibold hover:underline"
																	>
																		<ExternalLink className="size-3" />
																		View Old
																		Attachment
																	</a>
																</div>
															</div>
														)}

														<div>
															<span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
																Previous
																Justification
															</span>
															<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">
																{
																	previousAttempt.description
																}
															</p>
														</div>
														<div>
															<span className="text-[9px] sm:text-[10px] font-black text-red-600/80 uppercase tracking-widest">
																Admin's Remarks
															</span>
															<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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

export default FinanceRequestCard;
