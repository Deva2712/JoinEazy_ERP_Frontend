// src/pages/LeaveApplication/components/LeaveRequestCard.jsx

import React, { useState } from "react";
import {
	Calendar,
	ChevronDown,
	ChevronUp,
	RotateCcw,
	History,
	Clock,
	AlertCircle,
	User,
	XCircle,
	CheckCircle2,
	ExternalLink,
	FileText,
	Info,
} from "lucide-react";

const LeaveRequestCard = ({ app, onEdit, userRole }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

	const isHoD = userRole === "hod";
	const approvalRoles = isHoD ? ["Dean", "HR"] : ["HoD", "HR"];

	const isRejected = app.status === "Rejected";
	const isResubmissionRequired = isRejected && !app.isArchived;
	const isResubmitted = app.status === "Resubmitted";
	const previousAttempt = app.previousVersion;

	const areApprovalsPending =
		app.leaveApproval?.[approvalRoles[0]]?.status === "Pending" &&
		app.leaveApproval?.[approvalRoles[1]]?.status === "Pending";

	const formattedDate = (dateStr) =>
		dateStr
			? new Date(dateStr).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})
			: "N/A";

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

	return (
		<div
			className={`group bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200/60 dark:border-gray-800 transition-all duration-300 ring-1 ring-transparent hover:ring-orange-500/10 hover:border-orange-500/30 ${
				isExpanded
					? "ring-orange-500/10 border-orange-500/30 shadow-lg"
					: "hover:shadow-md"
			}`}
		>
			<div className="p-4 sm:p-6">
				{/* Header Section */}
				<div
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex flex-col md:flex-row md:items-start justify-between gap-4 cursor-pointer"
				>
					<div className="flex flex-col gap-2 flex-1">
						<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-orange-600">
							{app.leaveType}
						</h3>
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
							<span className="flex items-center gap-1.5">
								<Calendar className="size-3.5 text-orange-500" />{" "}
								{formattedDate(app.fromDate)}
							</span>
							<span className="flex items-center gap-1.5">
								<Clock className="size-3.5 text-orange-500" />{" "}
								Applied: {formattedDate(app.appliedAt)}
							</span>
						</div>
					</div>

					<div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3">
						<span
							className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${getStatusStyles(
								app.status,
							)}`}
						>
							{isResubmissionRequired
								? "Action Required"
								: app.status}
						</span>
						<div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] group-hover:text-orange-500 transition-colors">
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
					<div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
						{/* Core Details Grid */}
						<div className="space-y-4">
							<div className="space-y-2">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Reason
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
									{app.reason}
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 flex-grow gap-6">
								{/* Replacement Faculty */}
								<div className="flex-1 space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Replacement Faculty
									</h4>
									<div
										className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
											app.replacementFaculty
												? "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700"
												: "bg-gray-50/30 dark:bg-gray-800/20 border-dashed border-gray-200 dark:border-gray-800"
										}`}
									>
										<div
											className={`p-2 rounded-full flex items-center justify-center ${
												app.replacementFaculty
													? "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
													: "bg-gray-200 dark:bg-gray-700 text-gray-400"
											}`}
										>
											<User className="size-4" />
										</div>
										<span
											className={`text-sm font-bold ${
												app.replacementFaculty
													? "text-gray-700 dark:text-gray-300"
													: "text-gray-400 italic"
											}`}
										>
											{app.replacementFaculty ||
												"None assigned"}
										</span>
									</div>
								</div>

								{/* Supporting Documents */}
								<div className="flex-1 space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Supporting Documents
									</h4>
									<div
										className={`p-3 sm:p-4 rounded-xl border ${
											app.supporting_doc_link ||
											app.supporting_doc_file
												? "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 space-y-3"
												: "bg-gray-50/30 dark:bg-gray-800/20 border-dashed border-gray-200 dark:border-gray-800 flex items-center gap-2"
										}`}
									>
										{app.supporting_doc_link && (
											<a
												href={app.supporting_doc_link}
												target="_blank"
												rel="noopener noreferrer"
												onClick={(e) =>
													e.stopPropagation()
												}
												className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold truncate max-w-full hover:underline"
											>
												<ExternalLink className="size-4 flex-shrink-0" />
												<span className="truncate">
													{app.supporting_doc_link}
												</span>
											</a>
										)}

										{app.supporting_doc_file && (
											<div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
												<FileText className="size-4 flex-shrink-0" />
												<span className="truncate">
													{app.supporting_doc_file
														.name ||
														"Attached File"}
												</span>
											</div>
										)}

										{!(
											app.supporting_doc_link ||
											app.supporting_doc_file
										) && (
											<>
												<Info className="size-4 text-gray-400" />
												<span className="text-sm text-gray-400 italic font-medium">
													No documents attached
												</span>
											</>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* Approval Decisions Section */}
						{!areApprovalsPending && (
							<div
								className={`p-4 sm:p-6 rounded-2xl border transition-colors ${
									app.status === "Approved"
										? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/5 dark:border-emerald-800"
										: isResubmissionRequired
											? "bg-orange-50/30 border-orange-100 dark:bg-orange-900/5 dark:border-orange-800"
											: "bg-red-50/30 border-red-100 dark:bg-red-900/5 dark:border-red-800"
								}`}
							>
								<div className="flex items-center justify-between gap-4 mb-4">
									<h4
										className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${
											app.status === "Approved"
												? "text-emerald-600"
												: isResubmissionRequired
													? "text-orange-600"
													: "text-red-600"
										}`}
									>
										{app.status === "Approved" ? (
											<CheckCircle2 className="size-5" />
										) : isResubmissionRequired ? (
											<AlertCircle className="size-5" />
										) : (
											<XCircle className="size-5" />
										)}
										{isResubmissionRequired
											? "Action Required"
											: "Approval Decision"}
									</h4>

									{isResubmissionRequired && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												onEdit(app);
											}}
											className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-sm active:scale-95"
										>
											<RotateCcw className="size-3" />{" "}
											Resubmit
										</button>
									)}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{approvalRoles.map((role) => {
										const data = app.leaveApproval?.[role];
										return (
											<div
												key={role}
												className="bg-white/50 dark:bg-black/10 p-4 rounded-xl border border-black/5 dark:border-white/5"
											>
												<div className="flex items-center justify-between mb-2">
													<span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
														{role} Remarks
													</span>
													<span
														className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
															data?.status ===
															"Approved"
																? "bg-emerald-100 text-emerald-700"
																: data?.status ===
																	  "Rejected"
																	? "bg-red-100 text-red-700"
																	: "bg-amber-100 text-amber-700"
														}`}
													>
														{data?.status ||
															"Pending"}
													</span>
												</div>
												<p className="text-sm text-gray-700 dark:text-gray-300 italic">
													{data?.remark ||
														"No remarks provided."}
												</p>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* History Section */}
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
										<h4 className="text-sm font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest group-hover/history:text-blue-400 transition-colors">
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
										<div className="bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50">
											<div className="grid grid-cols-2 gap-4 mb-4">
												<div>
													<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
														Original Dates
													</span>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														{formattedDate(
															previousAttempt.fromDate,
														)}{" "}
														-{" "}
														{formattedDate(
															previousAttempt.toDate,
														)}
													</div>
												</div>
												<div>
													<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
														Applied On
													</span>
													<div className="text-sm text-gray-500 dark:text-gray-400">
														{formattedDate(
															previousAttempt.appliedAt,
														)}
													</div>
												</div>
											</div>
											<div className="space-y-3 pt-3 border-t border-gray-200/50 dark:border-gray-800">
												<div>
													<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
														Previous Reason
													</span>
													<p className="text-sm text-gray-500 dark:text-gray-400 italic">
														{previousAttempt.reason}
													</p>
												</div>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-200/50 dark:border-gray-800">
													{approvalRoles.map(
														(role) => (
															<div key={role}>
																<span className="text-[10px] font-black text-orange-600/80 uppercase tracking-widest">
																	{role}{" "}
																	Remarks
																</span>
																<p className="text-sm text-gray-500 dark:text-gray-400">
																	{previousAttempt
																		.leaveApproval?.[
																		role
																	]?.remark ||
																		"No specific feedback."}
																</p>
															</div>
														),
													)}
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default LeaveRequestCard;
