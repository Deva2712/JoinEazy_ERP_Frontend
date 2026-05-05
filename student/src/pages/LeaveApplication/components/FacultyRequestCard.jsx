// src/pages/LeaveApplication/components/FacultyRequestCard.jsx

import React, { useState } from "react";
import {
	Calendar,
	ChevronDown,
	ChevronUp,
	Check,
	X,
	MessageSquare,
	User,
	ExternalLink,
	History,
	Info,
	FileText,
	Tag,
	CircleCheck,
} from "lucide-react";

const FacultyRequestCard = ({ app, onRespond }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
	const [remark, setRemark] = useState("");
	const [isArchived, setIsArchived] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showResponseForm, setShowResponseForm] = useState(false);
	const [pendingStatus, setPendingStatus] = useState(null);

	const previousAttempt = app.previousVersion;
	const approvalRoles = ["HoD", "HR"];

	const formattedDate = (dateStr) =>
		dateStr
			? new Date(dateStr).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})
			: "N/A";

	const getStatusStyles = (status) => {
		if (status === "Resubmitted")
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

	const initiateAction = (status) => {
		setPendingStatus(status);
		setShowResponseForm(true);
	};

	const handleCancel = () => {
		setShowResponseForm(false);
		setPendingStatus(null);
		setRemark("");
	};

	const handleAction = async () => {
		if (!remark.trim() && pendingStatus === "Rejected") {
			alert("Please provide a remark for rejection.");
			return;
		}

		setIsSubmitting(true);
		try {
			await onRespond(app.id, {
				status: pendingStatus,
				remark,
				isArchived: pendingStatus === "Rejected" ? isArchived : false,
			});
		} catch (error) {
			console.error("Action failed", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			onClick={() => !isSubmitting && setIsExpanded(!isExpanded)}
			className={`group bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200/60 dark:border-gray-800 transition-all duration-300 ring-1 ring-transparent hover:ring-orange-500/10 hover:border-orange-500/30 ${
				isExpanded
					? "ring-orange-500/10 border-orange-500/30 shadow-lg"
					: "hover:shadow-md"
			} ${isSubmitting ? "opacity-60 pointer-events-none" : ""}`}
		>
			<div className="p-4 sm:p-6">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row md:items-start justify-between gap-4 cursor-pointer">
					<div className="flex flex-col gap-2 flex-1">
						<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-orange-600">
							{app.professorName ||
								app.userName ||
								"Faculty Member"}
						</h3>
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
							<span className="flex items-center gap-1.5">
								<Tag className="size-3.5 text-orange-500" />
								{app.leaveType}
							</span>
							<span className="flex items-center gap-1.5">
								<Calendar className="size-3.5 text-orange-500" />
								{formattedDate(app.fromDate)}
								{app.toDate &&
									app.toDate !== app.fromDate &&
									` - ${formattedDate(app.toDate)}`}
							</span>
						</div>
					</div>

					<div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3">
						<span
							className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${getStatusStyles(app.status)}`}
						>
							{app.status || "Pending"}
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

				{/* Expanded Content */}
				{isExpanded && (
					<div
						className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="space-y-4">
							<div className="space-y-2">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Reason for Leave
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
									{app.reason}
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 flex-grow gap-6">
								<div className="flex-1 space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Replacement Faculty
									</h4>
									<div
										className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${app.replacementFaculty ? "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700" : "bg-gray-50/30 dark:bg-gray-800/20 border-dashed border-gray-200 dark:border-gray-800"}`}
									>
										<div
											className={`p-2 rounded-full flex items-center justify-center ${app.replacementFaculty ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600" : "bg-gray-200 dark:bg-gray-700 text-gray-400"}`}
										>
											<User className="size-4" />
										</div>
										<span
											className={`text-sm font-bold ${app.replacementFaculty ? "text-gray-700 dark:text-gray-300" : "text-gray-400 italic"}`}
										>
											{app.replacementFaculty ||
												"None assigned"}
										</span>
									</div>
								</div>

								<div className="flex-1 space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Supporting Documents
									</h4>
									<div
										className={`p-3 sm:p-4 rounded-xl border ${app.supporting_doc_link || app.supporting_doc_file ? "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 space-y-3" : "bg-gray-50/30 dark:bg-gray-800/20 border-dashed border-gray-200 dark:border-gray-800 flex items-center gap-2"}`}
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
											<span className="text-sm text-gray-400 italic font-medium flex items-center gap-2">
												<Info className="size-4" /> No
												documents attached
											</span>
										)}
									</div>
								</div>
							</div>
						</div>

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
														Original Period
													</span>
													<div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
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
													<div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
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
																		"No feedback."}
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

						{/* Response Form Section */}
						{(app.status === "Pending" ||
							app.status === "Resubmitted") && (
							<div className="mt-8 p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-800 space-y-4">
								{!showResponseForm && (
									<p className="text-sm text-orange-800 dark:text-orange-300 font-medium">
										Approve and pass this leave application
										to HR?
									</p>
								)}

								{showResponseForm && (
									<div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
										<div className="space-y-3">
											<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
												<label
													className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${pendingStatus === "Rejected" ? "text-red-600" : "text-emerald-600"}`}
												>
													<MessageSquare className="size-3" />
													{pendingStatus ===
													"Rejected"
														? "Reason for Rejection"
														: "Approval Remark"}
												</label>

												{pendingStatus ===
													"Rejected" && (
													<div className="flex items-center justify-between sm:justify-end gap-3">
														<span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
															Allow Resubmission
														</span>
														<label className="relative flex items-center cursor-pointer">
															<input
																type="checkbox"
																checked={
																	!isArchived
																}
																onChange={(e) =>
																	setIsArchived(
																		!e
																			.target
																			.checked,
																	)
																}
																className="peer sr-only"
															/>
															<div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-red-500 transition-colors"></div>
															<div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
														</label>
													</div>
												)}
											</div>

											<textarea
												autoFocus
												className={`w-full p-3 text-sm bg-white dark:bg-gray-900 border rounded-xl outline-none focus:ring-2 transition-all h-24 resize-none ${pendingStatus === "Rejected" ? "border-red-200 dark:border-red-900/50 focus:ring-red-500" : "border-emerald-200 dark:border-emerald-900/50 focus:ring-emerald-500"}`}
												placeholder={
													pendingStatus === "Rejected"
														? "Why is this leave being rejected?"
														: "Add a note for the HR team..."
												}
												value={remark}
												onChange={(e) =>
													setRemark(e.target.value)
												}
											/>
										</div>
									</div>
								)}

								<div className="flex flex-col sm:flex-row gap-3">
									{showResponseForm ? (
										<>
											<button
												onClick={handleCancel}
												className="order-2 sm:order-1 flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 rounded-xl text-xs font-bold uppercase hover:bg-gray-50 transition-all active:scale-95"
											>
												Cancel
											</button>
											<button
												disabled={isSubmitting}
												onClick={handleAction}
												className={`order-1 sm:order-2 flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 text-white rounded-xl text-xs font-bold uppercase shadow-md transition-all active:scale-95 ${pendingStatus === "Rejected" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
											>
												{isSubmitting ? (
													"Processing..."
												) : (
													<>
														{pendingStatus ===
														"Rejected" ? (
															<X className="size-4" />
														) : (
															<Check className="size-4" />
														)}{" "}
														Confirm
													</>
												)}
											</button>
										</>
									) : (
										<>
											<button
												onClick={() =>
													initiateAction("Rejected")
												}
												className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-white dark:bg-gray-800 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-600 rounded-xl text-xs font-bold uppercase hover:bg-red-50 transition-all active:scale-95"
											>
												<X className="size-4" /> Reject
											</button>
											<button
												onClick={() =>
													initiateAction("Approved")
												}
												className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-emerald-700 shadow-md transition-all active:scale-95"
											>
												<Check className="size-4" />{" "}
												Approve
											</button>
										</>
									)}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default FacultyRequestCard;
