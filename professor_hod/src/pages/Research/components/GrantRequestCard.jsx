// src/pages/Research/components/GrantRequestCard.jsx

import React, { useState } from "react";
import {
	Calendar,
	ChevronDown,
	ChevronUp,
	RotateCcw,
	AlertCircle,
	CheckCircle2,
	XCircle,
	FileText,
	ExternalLink,
	Clock,
	Microscope,
	BookOpen,
	History,
} from "lucide-react";

const GrantRequestCard = ({ req, onEdit, collections, onViewResearch }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

	// Find the associated research title from collections
	const associatedResearch = React.useMemo(() => {
		const myResearch = [
			...(collections.raw?.myProjects || []),
			...(collections.raw?.myPublications || []),
		];
		return myResearch.find((item) => item.id === req.targetId);
	}, [req.targetId, collections]);

	const isRejected = req.status === "Rejected";
	const isResubmissionRequired = isRejected && !req.isArchived;
	const isApproved = req.status === "Approved";
	const isUnderReview = req.status === "Under Review";
	const previousAttempt = req.previousVersion || null;

	const getStatusStyles = (status) => {
		if (isResubmissionRequired)
			return "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300";

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

	return (
		<div
			onClick={() => setIsExpanded(!isExpanded)}
			className={`group bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 border-l-4 border-l-emerald-500 dark:border-l-emerald-400 transition-all duration-300 cursor-pointer hover:shadow-md ${
				isExpanded
					? "shadow-lg ring-1 ring-gray-200 dark:ring-gray-800"
					: ""
			}`}
		>
			<div className="p-4 sm:p-5 md:p-6">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="flex items-start gap-3 sm:gap-4">
						<div className="min-w-0 flex-1 space-y-2">
							<div className="flex flex-wrap items-center gap-2 mb-1">
								<h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">
									{req.title}
								</h3>
							</div>
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
								<span
									className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${getStatusStyles(req.status)}`}
								>
									{isResubmissionRequired
										? "Action Required"
										: req.status || "Pending"}
								</span>
								<div className="flex items-center gap-1.5">
									<Calendar className="size-3.5" />
									{formatDate(req.date)}
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between md:justify-end gap-4 border-t border-gray-100 dark:border-gray-800 md:border-t-0 pt-3 md:pt-0">
						<div className="flex flex-col text-left md:text-right">
							<p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
								Grant Amount
							</p>
							<p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white flex items-center md:justify-end">
								<span className="text-sm mr-0.5">₹</span>
								{Number(req.amount).toLocaleString("en-IN")}
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

				{/* Expanded Content */}
				{isExpanded && (
					<div
						className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-300"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-6">
								{/* Research Link Section */}
								<div className="space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Research Work
									</h4>
									<button
										onClick={() =>
											associatedResearch &&
											onViewResearch({
												type: req.targetType.toLowerCase(),
												data: associatedResearch,
											})
										}
										disabled={!associatedResearch}
										className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-emerald-500/50 transition-colors group/link"
									>
										<div className="flex items-center gap-3">
											{req.targetType === "Project" ? (
												<Microscope className="size-4 text-emerald-500" />
											) : (
												<BookOpen className="size-4 text-emerald-500" />
											)}
											<span className="text-sm font-medium text-gray-600 dark:text-gray-300">
												{associatedResearch?.title ||
													`${req.targetType}: ${req.targetId}`}
											</span>
										</div>
										{associatedResearch && (
											<ExternalLink className="size-3 text-gray-400 group-hover/link:text-emerald-500" />
										)}
									</button>
								</div>

								{/* Justification Section */}
								<div className="space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Justification
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
										{req.reason ||
											"No justification provided."}
									</p>
								</div>
							</div>

							<div className="space-y-6">
								{/* Supporting Documents Section */}
								<div className="space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Supporting Documents
									</h4>
									<div className="grid grid-cols-1 gap-2">
										{req.supportingDocs &&
										req.supportingDocs.length > 0 ? (
											req.supportingDocs.map((doc, idx) => (
												<a
													key={idx}
													href={doc.url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 border border-gray-200 dark:border-gray-700 rounded-lg group/file transition-all hover:border-emerald-500/50"
												>
													<div className="flex items-center gap-3 min-w-0">
														<FileText className="size-4 text-emerald-500 flex-shrink-0" />
														<span className="text-xs font-semibold truncate">
															{doc.name}
														</span>
													</div>
													<ExternalLink className="size-3" />
												</a>
											))
										) : (
											<span className="text-xs text-gray-400 italic p-2">
												No supportingDocs attached
											</span>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* Admin Feedback Section */}
						{(req.adminComments ||
							isApproved ||
							isUnderReview ||
							isResubmissionRequired) && (
							<div
								className={`mt-8 p-4 sm:p-5 rounded-2xl border transition-colors ${
									isApproved
										? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/5 dark:border-emerald-800"
										: isUnderReview
											? "bg-blue-50/30 border-blue-100 dark:bg-blue-900/5 dark:border-blue-800"
											: isResubmissionRequired
												? "bg-orange-50/30 border-orange-100 dark:bg-orange-900/5 dark:border-orange-800"
												: "bg-red-50/30 border-red-100 dark:bg-red-900/5 dark:border-red-800"
								}`}
							>
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
									<h4
										className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${
											isApproved
												? "text-emerald-600"
												: isUnderReview
													? "text-blue-600"
													: isResubmissionRequired
														? "text-orange-600"
														: "text-red-600"
										}`}
									>
										{isApproved ? (
											<CheckCircle2 className="size-5" />
										) : isUnderReview ? (
											<Clock className="size-5" />
										) : isResubmissionRequired ? (
											<AlertCircle className="size-5" />
										) : (
											<XCircle className="size-5" />
										)}
										{isResubmissionRequired
											? "Action Required"
											: isUnderReview
												? "Review Status"
												: "Reviewer Remarks"}
									</h4>
									<div className="flex flex-col sm:flex-row-reverse items-center gap-3">
										{isResubmissionRequired && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													onEdit(req);
												}}
												className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-sm active:scale-95"
											>
												<RotateCcw className="size-3" />{" "}
												Resubmit
											</button>
										)}
										{req?.lastAdminAction && (
											<p
												className={`text-xs font-bold px-2 py-0.5 rounded-md ${getStatusStyles(req.status)}`}
											>
												{formatDate(
													req.lastAdminAction,
												)}
											</p>
										)}
									</div>
								</div>
								<p className="text-sm text-gray-700 dark:text-gray-300 italic">
									"
									{req.adminComments ||
										(isUnderReview
											? "This request is currently being processed by the review committee."
											: "No specific feedback provided by the reviewer.")}
									"
								</p>
							</div>
						)}

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
					</div>
				)}
			</div>
		</div>
	);
};

export default GrantRequestCard;
