// src/pages/ExamDuties/components/ExamDutyCard.jsx
import {
	Calendar,
	Clock,
	ChevronDown,
	ChevronUp,
	AlertCircle,
	X,
	Check,
	XCircle,
	CheckCircle2,
} from "lucide-react";
import React, { useState } from "react";

const ExamDutyCard = ({
	exam,
	formatIsoToDate,
	formatIsoToTime,
	onUpdateStatus,
}) => {
	const [isRejecting, setIsRejecting] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [reason, setReason] = useState("");

	const getStatusStyles = (status) => {
		switch (status) {
			case "CONFIRMED":
			case "REJECTION_APPROVED":
				return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
			case "REJECTION_REVIEW":
				return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
			case "REJECTION_REVOKED":
				return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
			default:
				return "bg-amber-100 dark:bg-amber-100/10 text-amber-700 dark:text-amber-300";
		}
	};

	const getStatusLabel = (status) => {
		switch (status) {
			case "CONFIRMED":
				return "Checked In";
			case "REJECTION_REVIEW":
				return "Under Review";
			case "REJECTION_REVOKED":
				return "Rejection Revoked";
			case "REJECTION_APPROVED":
				return "Rejection Approved";
			default:
				return status;
		}
	};

	return (
		<div
			onClick={() => !isRejecting && setIsExpanded(!isExpanded)}
			className={`group bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200/60 dark:border-gray-800 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-lime-500/10 hover:border-lime-500/30 ${
				isExpanded
					? "ring-lime-500/10 border-lime-500/30 shadow-lg"
					: "hover:shadow-md"
			}`}
			id={`exam-${exam.id}`}
		>
			<div className="p-4 sm:p-6">
				<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
					<div className="flex flex-col gap-1 flex-1">
						<div className="flex flex-wrap items-center gap-3 mb-1">
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-lime-600">
								{exam.hall}
							</h3>
							<span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider border border-gray-200/50 dark:border-gray-700">
								{exam.type || "General"}
							</span>
						</div>

						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
							<div className="flex items-center gap-1.5">
								<Calendar className="size-3.5 text-lime-500" />
								{formatIsoToDate(exam.startTime)}
							</div>
							<div className="flex items-center gap-1.5">
								<Clock className="size-3.5 text-lime-500" />
								Report at {formatIsoToTime(exam.reportingTime)}
							</div>
						</div>
					</div>

					<div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3">
						<span
							className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${getStatusStyles(exam.status)}`}
						>
							{getStatusLabel(exam.status)}
						</span>
						<div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] group-hover:text-lime-500 transition-colors">
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
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Schedule
								</h4>
								<p className="text-sm text-gray-700 dark:text-gray-300">
									{formatIsoToTime(exam.startTime)} -{" "}
									{formatIsoToTime(exam.endTime)}
								</p>
							</div>
							<div className="space-y-2">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Course
								</h4>
								<p className="text-sm text-gray-700 dark:text-gray-300">
									{exam.courseName} ({exam.courseCode})
								</p>
							</div>
						</div>

						{(exam.status === "ASSIGNED" ||
							exam.status === "REJECTION_REVOKED") &&
							!isRejecting && (
								<div className="p-4 bg-lime-50/50 dark:bg-lime-900/10 rounded-2xl border border-lime-100 dark:border-lime-800">
									<p className="text-sm text-lime-800 dark:text-lime-300 font-medium mb-4">
										{exam.status === "ASSIGNED"
											? "Would you like to check-in for this duty?"
											: "Your rejection was revoked. Please check-in for this duty."}
									</p>

									<div className="flex gap-3">
										{/* Reject button only shows for ASSIGNED status */}
										{exam.status === "ASSIGNED" && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													setIsRejecting(true);
												}}
												className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500 rounded-xl text-xs font-bold uppercase hover:bg-red-50 transition-all"
											>
												<X className="size-4" /> Reject
											</button>
										)}

										<button
											onClick={() =>
												onUpdateStatus(
													exam.id,
													"CONFIRMED",
												)
											}
											className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-lime-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-lime-700 shadow-md transition-all"
										>
											<Check className="size-4" /> Check
											In
										</button>
									</div>
								</div>
							)}

						{exam.rejectionReason && (
							<div className="space-y-2">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Reason for Rejection
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
									{exam.rejectionReason}
								</p>
							</div>
						)}

						{exam.rejectionApproval && (
							<div
								className={`p-4 sm:p-6 rounded-2xl border transition-colors
							${
								exam?.status === "REJECTION_APPROVED"
									? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/5 dark:border-emerald-800"
									: "bg-red-50/30 border-red-100 dark:bg-red-900/5 dark:border-red-800"
							}
							`}
							>
								<h4
									className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-4
									${exam?.status === "REJECTION_APPROVED" ? "text-emerald-600" : "text-red-600"}
									`}
								>
									{exam?.status === "REJECTION_APPROVED" ? (
										<CheckCircle2 className="size-4 sm:size-5" />
									) : (
										<XCircle className="size-4 sm:size-5" />
									)}
									Approval Decision
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{["exam_department", "admin"].map((key) => {
										const data =
											exam.rejectionApproval[key];
										return (
											<div
												key={key}
												className="bg-white/50 dark:bg-black/10 p-4 rounded-xl border border-black/5 dark:border-white/5"
											>
												<div className="flex items-center justify-between mb-2">
													<span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
														{key.replace("_", " ")}{" "}
														Remarks
													</span>
													<span
														className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
															data?.status ===
															"APPROVED"
																? "bg-emerald-100 text-emerald-700"
																: data?.status ===
																	  "REVOKED"
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

						{isRejecting && (
							<div className="bg-red-50 p-4 rounded-xl border border-red-100 dark:bg-red-900/10 dark:border-red-900/30">
								<h4 className="flex items-center gap-2 text-red-700 text-xs font-black uppercase mb-3">
									<AlertCircle className="size-4" /> Reason
									for Rejection
								</h4>
								<textarea
									className="w-full p-3 border border-red-200 rounded-lg text-sm bg-white dark:bg-gray-900"
									rows="3"
									value={reason}
									minLength={10}
									onChange={(e) => setReason(e.target.value)}
									placeholder="Give a reason for rejecting this exam duty (min. 10 characters)..."
								/>
								<div className="flex gap-3 justify-end mt-3">
									<button
										onClick={(e) => {
											e.stopPropagation();
											setIsRejecting(false);
										}}
										className="text-sm font-bold text-gray-500 dark:text-gray-400"
									>
										Cancel
									</button>
									<button
										disabled={reason.trim().length < 10}
										onClick={(e) => {
											e.stopPropagation();
											onUpdateStatus(
												exam.id,
												"REJECTION_REVIEW",
												reason,
											);
											setIsRejecting(false);
										}}
										className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold disabled:opacity-50"
									>
										Submit
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
export default ExamDutyCard;
