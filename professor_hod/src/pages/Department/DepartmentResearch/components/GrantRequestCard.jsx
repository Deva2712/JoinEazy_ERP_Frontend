// src/pages/Department/DepartmentResearch/components/GrantRequestCard.jsx

import React, { useState } from "react";
import {
	Calendar,
	ExternalLink,
	ChevronDown,
	ChevronUp,
	Check,
	X,
	History,
	CheckCircle2,
	Clock,
	AlertCircle,
	XCircle,
	Microscope,
	BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

const getStatusStyles = (status) => {
	switch (status) {
		case "Approved":
			return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
		case "Resubmitted":
			return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
		case "Rejected":
			return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
		default:
			return "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300";
	}
};

const formatDate = (date) =>
	date
		? new Date(date).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: "N/A";

const GrantRequestCard = ({ request, filter, updatingId, onUpdateStatus }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
	const [showActionPanel, setShowActionPanel] = useState(null); // 'Approved' | 'Rejected' | null
	const [adminComment, setAdminComment] = useState("");

	const isPending = filter === "Pending";
	const isApproved = request.status === "Approved";
	const isRejected = request.status === "Rejected";
	const previousAttempt = request.previousVersion || null;

	const handleConfirmAction = () => {
		if (!adminComment.trim()) return;
		onUpdateStatus(request.requestId, showActionPanel, adminComment);
	};

	const resetAction = () => {
		setShowActionPanel(null);
		setAdminComment("");
	};

	const requestId =
		request.targetType === "publication"
			? request.url || request.targetId
			: request.targetId;
	const requestUrl = `/research-publications/explore/${request.targetType.toLowerCase()}/${requestId}`;

	return (
		<div
			onClick={() => setIsExpanded(!isExpanded)}
			className={`group bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 border-l-4 border-l-violet-500 transition-all duration-300 cursor-pointer hover:shadow-md ${
				isExpanded
					? "shadow-lg ring-1 ring-gray-200 dark:ring-gray-800"
					: ""
			}`}
		>
			<div className="p-5 md:p-6">
				{/* Top section: Basic info and Amount */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="flex items-start gap-3 sm:gap-4">
						<div className="min-w-0 flex-1 space-y-2">
							<div className="flex flex-wrap items-center gap-2 mb-1">
								<h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">
									{request.title}
								</h3>
							</div>
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
								<span
									className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${getStatusStyles(request.status)}`}
								>
									{request.status}
								</span>
								<div className="flex items-center gap-1.5">
									<Calendar className="size-3.5" />
									{formatDate(request.date)}
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between md:justify-end gap-6 border-t border-gray-100 dark:border-gray-800 md:border-t-0 pt-3 md:pt-0">
						<div className="flex flex-col text-left md:text-right">
							<p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
								Grant Amount
							</p>
							<p className="text-xl font-black text-gray-900 dark:text-white flex items-center md:justify-end">
								<span className="text-sm mr-0.5">₹</span>
								{request.amount.toLocaleString("en-IN")}
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

				{/* Expanded section: Justification and Documents */}
				{isExpanded && (
					<div
						className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-6">
								{/* Research Link Section */}
								<div className="space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Research Work
									</h4>
									<Link
										to={requestUrl}
										className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-violet-500/50 transition-colors group/link"
									>
										<div className="flex items-center gap-3">
											{request.targetType === "Project" ? (
												<Microscope className="size-4 text-violet-500" />
											) : (
												<BookOpen className="size-4 text-violet-500" />
											)}
											<span className="text-sm font-medium text-gray-600 dark:text-gray-300">
												{request?.targetName ||
													`${request.targetType}: ${req.targetId}`}
											</span>
										</div>
										{request.targetId && (
											<ExternalLink className="size-3 text-gray-400 group-hover/link:text-violet-500" />
										)}
									</Link>
								</div>

								{/* Justification Section */}
								<div className="space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Justification
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
										{request.reason ||
											"No justification provided."}
									</p>
								</div>
							</div>

							<div className="space-y-2">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Supporting Documents
								</h4>
								<div className="flex flex-wrap gap-2">
									{request.supportingDocs?.map((doc, idx) => (
										<a
											key={idx}
											href={doc.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-violet-600 dark:text-violet-400 hover:border-violet-500 transition-all"
										>
											<ExternalLink className="size-3.5" />
											{doc.name}
										</a>
									))}
								</div>
							</div>
						</div>

						{/* Previous Submission History Section */}
						{previousAttempt && (
							<div className="mt-8 relative pl-5 sm:pl-6 py-1 border-l-2 border-gray-200 dark:border-gray-800 ml-2 sm:ml-3">
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
														<span className="text-[10px] mr-0.5">
															₹
														</span>
														{Number(
															previousAttempt.amount,
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
												<div>
													<span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
														Previous Justification
													</span>
													<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">
														{previousAttempt.reason}
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
												{previousAttempt.lastAdminAction && (
													<div>
														<span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
															Decision Date
														</span>
														<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
															{formatDate(
																previousAttempt.lastAdminAction,
															)}
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								)}
							</div>
						)}

						{/* Action Section / Decision Log */}
						<div className="mt-4">
							{isPending ? (
								<div className="p-4 bg-violet-50/30 dark:bg-violet-900/5 border border-violet-100 dark:border-violet-800 rounded-2xl space-y-4">
									{!showActionPanel && (
										<p className="text-sm text-violet-800 dark:text-violet-300 font-medium">
											Approve and pass this grant request
											to the Finance Department?
										</p>
									)}

									{showActionPanel && (
										<div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
											<label
												className={`text-[10px] font-black uppercase tracking-widest ${showActionPanel === "Approved" ? "text-emerald-600" : "text-red-600"}`}
											>
												Reason for {showActionPanel}
											</label>
											<textarea
												autoFocus
												className={`w-full p-3 text-sm bg-white dark:bg-gray-900 border rounded-xl focus:ring-2 outline-none dark:text-white transition-all ${
													showActionPanel ===
													"Approved"
														? "border-emerald-200 dark:border-emerald-900/50 focus:ring-emerald-500"
														: "border-red-200 dark:border-red-900/50 focus:ring-red-500"
												}`}
												placeholder={`Provide comments for ${showActionPanel.toLowerCase()}...`}
												value={adminComment}
												onChange={(e) =>
													setAdminComment(
														e.target.value,
													)
												}
											/>
										</div>
									)}

									<div className="flex gap-3">
										{showActionPanel ? (
											<>
												<button
													onClick={resetAction}
													className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-600 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold uppercase hover:bg-gray-50 transition-all active:scale-95"
												>
													Cancel
												</button>
												<button
													onClick={
														handleConfirmAction
													}
													disabled={
														updatingId ===
															request.requestId ||
														!adminComment.trim()
													}
													className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold uppercase shadow-md transition-all active:scale-95 disabled:opacity-50 ${
														showActionPanel ===
														"Approved"
															? "bg-emerald-600 hover:bg-emerald-700"
															: "bg-red-600 hover:bg-red-700"
													}`}
												>
													{showActionPanel ===
													"Approved" ? (
														<Check className="size-4" />
													) : (
														<X className="size-4" />
													)}
													Confirm {showActionPanel}
												</button>
											</>
										) : (
											<>
												<button
													onClick={() =>
														setShowActionPanel(
															"Rejected",
														)
													}
													className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-red-600 border border-red-200 dark:border-red-900/50 rounded-xl text-xs font-bold uppercase hover:bg-red-50 transition-all active:scale-95"
												>
													<X className="size-4" />{" "}
													Reject
												</button>
												<button
													onClick={() =>
														setShowActionPanel(
															"Approved",
														)
													}
													className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-violet-700 shadow-md transition-all active:scale-95"
												>
													<Check className="size-4" />{" "}
													Approve
												</button>
											</>
										)}
									</div>
								</div>
							) : (
								<div
									className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
										isApproved
											? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/5 dark:border-emerald-800"
											: isRejected
												? "bg-red-50/30 border-red-100 dark:bg-red-900/5 dark:border-red-800"
												: "bg-blue-50/30 border-blue-100 dark:bg-blue-900/5 dark:border-blue-800"
									}`}
								>
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
										<h4
											className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${
												isApproved
													? "text-emerald-600"
													: isRejected
														? "text-red-600"
														: "text-blue-600"
											}`}
										>
											{isApproved ? (
												<CheckCircle2 className="size-5" />
											) : isRejected ? (
												<XCircle className="size-5" />
											) : (
												<Clock className="size-5" />
											)}
											Admin Remarks
										</h4>
										{request.lastAdminAction && (
											<p
												className={`text-xs font-bold px-2 py-0.5 rounded-md ${getStatusStyles(request.status)}`}
											>
												{formatDate(
													request.lastAdminAction,
												)}
											</p>
										)}
									</div>
									<p className="text-sm text-gray-700 dark:text-gray-300 italic">
										"
										{request.adminComments ||
											"No specific feedback provided by the reviewer."}
										"
									</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default GrantRequestCard;
