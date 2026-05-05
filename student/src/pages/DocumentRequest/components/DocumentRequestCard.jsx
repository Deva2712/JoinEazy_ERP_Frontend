// src/pages/DocumentRequest/components/DocumentRequestCard.jsx

import React, { useState } from "react";
import {
	Clock,
	ChevronDown,
	ChevronUp,
	User,
	FileText,
	Check,
	X,
	ExternalLink,
	GraduationCap,
	Paperclip,
	CheckCircle,
} from "lucide-react";

const DocumentRequestCard = ({ data, onRespond }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [showRejectReason, setShowRejectReason] = useState(false);
	const [rejectReason, setRejectReason] = useState("");

	const currentStatus = data.status || "Pending";

	const formatDate = (date) =>
		new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	const handleAction = (newStatus) => {
		if (newStatus === "Rejected") {
			if (!showRejectReason) {
				setShowRejectReason(true);
				return;
			}

			if (!rejectReason.trim()) {
				alert("Please provide a reason for rejection.");
				return;
			}

			const confirmed = window.confirm(
				"Are you sure you want to reject this request?",
			);
			if (!confirmed) return;
		}

		onRespond(
			data.id,
			newStatus,
			newStatus === "Rejected" ? rejectReason : null,
		);
	};

	const getStatusStyles = (status) => {
		switch (status) {
			case "Dispatched":
				return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
			case "Under Review":
				return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
			case "Rejected":
				return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
			default:
				return "bg-amber-100 dark:bg-amber-100/10 text-amber-700 dark:text-amber-300";
		}
	};

	const isDispatched = currentStatus === "Dispatched";

	return (
		<div
			onClick={() => setIsExpanded(!isExpanded)}
			className={`group bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200/60 dark:border-gray-800 transition-all duration-300 ring-1 ring-transparent hover:ring-fuchsia-500/10 hover:border-fuchsia-500/30 ${
				isExpanded
					? "ring-fuchsia-500/10 border-fuchsia-500/30 shadow-lg"
					: "hover:shadow-md"
			}`}
		>
			<div className="p-4 sm:p-6">
				<div className="flex flex-col md:flex-row md:items-start justify-between gap-4 cursor-pointer">
					<div className="flex gap-4 items-start flex-1">
						<div className="p-3 rounded-xl flex-shrink-0 bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 group-hover:scale-110 transition-transform">
							<User className="size-6" />
						</div>
						<div className="space-y-1">
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-fuchsia-600">
								{data.student.name}
							</h3>
							<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
								<span className="flex items-center gap-1.5">
									<GraduationCap className="size-3.5 text-fuchsia-500" />
									{data.student.rollNumber}
								</span>
								<span className="flex items-center gap-1.5">
									<Clock className="size-3.5 text-fuchsia-500" />
									{formatDate(data.requestDate)}
								</span>
							</div>
						</div>
					</div>

					<div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3">
						<span
							className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider ${getStatusStyles(currentStatus)}`}
						>
							{isDispatched ? "Dispatched" : currentStatus}
						</span>
						<div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] group-hover:text-fuchsia-500 transition-colors">
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
					<div
						className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-300"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-6">
								<div className="space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Purpose of Request
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
										{data.application.purpose}
									</p>
								</div>

								<div className="space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Contact Email
									</h4>
									<div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
										<p className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
											{data.student.email}
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-6">
								{isDispatched && data.approvedDocument ? (
									<div className="space-y-2">
										<h4 className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
											Approved Document
										</h4>
										<a
											href={data.approvedDocument.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-lg group/file transition-all"
										>
											<div className="flex items-center gap-3 min-w-0">
												<CheckCircle className="size-4 text-emerald-500 flex-shrink-0" />
												<span className="text-xs font-semibold truncate">
													{data.approvedDocument.name}
												</span>
											</div>
											<ExternalLink className="size-3" />
										</a>
									</div>
								) : (
									<div className="space-y-2">
										<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
											Draft Letter
										</h4>
										<a
											href={
												data.application.lorDocument.url
											}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-fuchsia-700 dark:hover:text-fuchsia-400 border border-fuchsia-100 dark:border-fuchsia-800/50 rounded-lg group/file hover:border-fuchsia-500/50 transition-all"
										>
											<div className="flex items-center gap-3 min-w-0">
												<FileText className="size-4 text-fuchsia-500 flex-shrink-0" />
												<span className="text-xs font-semibold truncate">
													{
														data.application
															.lorDocument.name
													}
												</span>
											</div>
											<ExternalLink className="size-3" />
										</a>
									</div>
								)}

								<div className="space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Supporting Documents
									</h4>
									<div className="flex flex-wrap gap-2">
										{data.application.supportingDocs
											?.length > 0 ? (
											data.application.supportingDocs.map(
												(doc, index) => (
													<a
														key={index}
														href={doc.url}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-800/50 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-all"
													>
														<Paperclip className="size-3 text-blue-500" />
														<span className="text-xs font-semibold truncate max-w-[150px]">
															{doc.name}
														</span>
														<ExternalLink className="size-3 ml-1" />
													</a>
												),
											)
										) : (
											<span className="text-[10px] font-medium text-gray-400 italic">
												No additional files
											</span>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* Action Section: Allows rejection for Pending and Under Review states */}
						{(currentStatus === "Pending" ||
							currentStatus === "Under Review") && (
							<div className="mt-8 p-4 bg-fuchsia-50/50 dark:bg-fuchsia-900/10 rounded-2xl border border-fuchsia-100 dark:border-fuchsia-800 space-y-4">
								{!showRejectReason && (
									<p className="text-sm text-fuchsia-800 dark:text-fuchsia-300 font-medium">
										{currentStatus === "Pending"
											? "Review this document request?"
											: "This request is currently under review. Reject the request?"}
									</p>
								)}

								{showRejectReason && (
									<div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
										<label className="text-[10px] font-black text-red-600 uppercase tracking-widest">
											Reason for Rejection
										</label>
										<textarea
											autoFocus
											className="w-full p-3 text-sm bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/50 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
											placeholder="Enter reason..."
											value={rejectReason}
											onChange={(e) =>
												setRejectReason(e.target.value)
											}
										/>
									</div>
								)}

								<div className="flex gap-3">
									{showRejectReason ? (
										<>
											<button
												onClick={() =>
													setShowRejectReason(false)
												}
												className="flex-1 flex-shrink-0 min-w-[80px] flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-600 border border-gray-200 rounded-xl text-xs font-bold uppercase hover:bg-gray-50 transition-all active:scale-95"
											>
												Cancel
											</button>
											<button
												onClick={() =>
													handleAction("Rejected")
												}
												className="flex-1 flex-shrink-0 min-w-[80px] flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-red-700 shadow-md transition-all active:scale-95"
											>
												<X className="size-4" /> Confirm
											</button>
										</>
									) : (
										<>
											<button
												onClick={() =>
													handleAction("Rejected")
												}
												className="flex-1 flex-shrink-0 min-w-[80px] flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-red-600 border border-red-200 rounded-xl text-xs font-bold uppercase hover:bg-red-50 transition-all active:scale-95"
											>
												<X className="size-4" /> Reject
											</button>

											{currentStatus === "Pending" && (
												<button
													onClick={() =>
														handleAction(
															"Under Review",
														)
													}
													className="flex-1 flex-shrink-0 min-w-[80px] flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-emerald-700 shadow-md transition-all"
												>
													<Check className="size-4" />{" "}
													Review
												</button>
											)}
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

export default DocumentRequestCard;
