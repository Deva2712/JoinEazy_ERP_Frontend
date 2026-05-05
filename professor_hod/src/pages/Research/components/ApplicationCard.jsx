// src/pages/Research/components/ApplicationCard.jsx

import React, { useState } from "react";
import {
	CheckCircle2,
	Calendar,
	Clock,
	XCircle,
	Briefcase,
	MapPin,
	Presentation,
	ChevronRight,
	Loader2,
	ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ApplicationCard = ({
	applicant,
	onAction,
	onViewUser,
	isSentApplication = false,
	isExpanded = false,
	isSelected = false,
	onClick,
}) => {
	const [feedback, setFeedback] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const details = isSentApplication ? applicant.submissionDetails : applicant;

	const handleStatusUpdate = async (status) => {
		if (!onAction) return;

		const confirmMessage = `Are you sure you want to ${status.toLowerCase()} this application?`;
		if (!window.confirm(confirmMessage)) return;

		setIsSubmitting(true);
		try {
			await onAction(applicant.id, status, feedback);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRequestMeeting = (e) => {
		e.stopPropagation();
		navigate("/schedule/requests", {
			state: {
				openRequestModal: true,
				preFill: {
					recipientName: applicant.name,
					recipientRole: applicant.role || "Student",
					recipientDepartment: applicant.department || "",
					subject: `Discussion: ${applicant.projectTitle || "Research Application"}`,
				},
			},
		});
	};

	const getStatusStyles = (status) => {
		switch (status) {
			case "Accepted":
				return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
			case "Rejected":
				return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
			case "Meeting Scheduled":
				return "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300";
			default:
				return "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300";
		}
	};

	return (
		<div
			onClick={!isExpanded ? onClick : undefined}
			className={`group relative bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200/60 dark:border-gray-800 flex flex-col h-full  transition-all duration-300
				${isExpanded ? "w-full border-emerald-500/30 shadow-xl ring-1 ring-emerald-500/10" : "cursor-pointer hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-gray-500/5 hover:-translate-y-1"}
				${isSelected && !isExpanded ? "ring-2 ring-emerald-500" : "ring-1 ring-transparent hover:ring-emerald-500/10"}
			`}
		>
			<div className="p-5">
				{/* Header - Basic Applicant/Project Information */}
				<div className="flex flex-col gap-2">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1 min-w-0">
							<h3
								className={`font-bold text-gray-900 dark:text-white transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-500 line-clamp-1 ${isExpanded ? "text-xl" : "text-lg"}`}
							>
								{isSentApplication
									? applicant.title
									: applicant.name}
							</h3>

							{/* Research Title for small card view */}
							{!isExpanded && !isSentApplication && (
								<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
									Applied for:{" "}
									{applicant.projectTitle ||
										"Untitled Project"}
								</p>
							)}
						</div>

						<span
							className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${getStatusStyles(applicant.status)}`}
						>
							{!isExpanded &&
							applicant.status === "Meeting Scheduled"
								? "Meeting"
								: applicant.status}
						</span>
					</div>

					<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
						<div className="flex items-center gap-1.5">
							<Briefcase className="size-3 text-emerald-500" />
							{applicant.role}
						</div>
						<div className="flex items-center gap-1.5">
							<Calendar className="size-3 text-emerald-500" />
							{new Date(applicant.appliedDate).toLocaleDateString(
								"en-US",
								{
									month: "short",
									day: "numeric",
									year: "numeric",
								},
							)}
						</div>
					</div>
				</div>

				{/* Expansion Indicator - Bottom Right (Only visible when collapsed) */}
				{!isExpanded && (
					<div className="absolute bottom-4 right-4">
						<ChevronDown className="size-4 text-gray-900 dark:text-white transition-all group-hover:translate-y-0.5" />
					</div>
				)}

				{isExpanded && (
					<div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="md:col-span-2 space-y-6">
								{/* Content Body - Applicant justification and project context */}
								<div className="space-y-4">
									{!isSentApplication && (
										<div className="space-y-1">
											<h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
												Research Title
											</h4>
											<p className="text-md font-bold text-gray-800 dark:text-gray-200 leading-snug">
												{applicant.projectTitle ||
													"N/A"}
											</p>
										</div>
									)}

									<div className="space-y-2">
										<h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
											{isSentApplication
												? "My Statement"
												: "Statement of Interest"}
										</h4>
										<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-4 border-emerald-500/20 pl-4">
											"
											{details?.justification ||
												"No justification provided."}
											"
										</p>
									</div>
								</div>

								{/* Feedback Display - Shows history of remarks for processed applications */}
								{isSentApplication &&
									(applicant.status === "Accepted" ||
										applicant.status === "Rejected") && (
										<div
											className={`p-3 rounded-xl border ${applicant.status === "Accepted" ? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/10" : "bg-red-50/30 border-red-100 dark:bg-red-900/10"}`}
										>
											<h4
												className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-1.5 ${applicant.status === "Accepted" ? "text-emerald-700" : "text-red-600"}`}
											>
												{applicant.status ===
												"Accepted" ? (
													<CheckCircle2 className="size-4" />
												) : (
													<XCircle className="size-4" />
												)}
												Remarks
											</h4>
											<p className="text-sm text-gray-700 dark:text-gray-300 italic">
												{applicant.professorNotes ||
													"No specific feedback provided."}
											</p>
										</div>
									)}

								{applicant.meetingDetails && (
									<div className="p-3 rounded-xl bg-purple-50/40 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/50 space-y-3">
										{/* Header section for meeting information */}
										<div className="flex items-center justify-between">
											<h4 className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase tracking-widest flex items-center gap-2">
												<Presentation className="size-4" />{" "}
												Meeting Details
											</h4>
											{/* Badge showing the meeting mode (Online/Offline) */}
											<span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/40 text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-tight">
												{applicant.meetingDetails
													.mode || "Offline"}
											</span>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="flex items-center gap-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200">
												<Clock className="size-4 text-purple-500" />
												{new Date(
													applicant.meetingDetails
														.date,
												).toLocaleString([], {
													dateStyle: "medium",
													timeStyle: "short",
												})}
											</div>

											{/* Dynamic icon based on mode: Link for Online, MapPin for Offline */}
											<div className="flex items-center gap-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200">
												{applicant.meetingDetails.mode?.toLowerCase() ===
												"online" ? (
													<ExternalLink className="size-4 text-purple-500" />
												) : (
													<MapPin className="size-4 text-purple-500" />
												)}
												<span className="truncate">
													{applicant.meetingDetails
														.location ||
														applicant.meetingDetails
															.venue}
												</span>
											</div>
										</div>

										{/* Meeting Notes Section */}
										{applicant.meetingDetails.notes && (
											<div className="mt-2 pt-2 border-t border-purple-100/50 dark:border-purple-800/30">
												<p className="text-[10px] font-black text-purple-400 uppercase tracking-wider mb-1">
													Notes:
												</p>
												<p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
													{
														applicant.meetingDetails
															.notes
													}
												</p>
											</div>
										)}
									</div>
								)}
							</div>

							{/* Profile Link - Navigation to the applicant or researcher profile */}
							<div className="space-y-2">
								<h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
									{isSentApplication
										? "Lead Researcher"
										: "Applicant's Profile"}
								</h4>
								<button
									onClick={(e) => {
										e.stopPropagation();
										const targetName = isSentApplication
											? applicant.professorName
											: applicant.name;
										onViewUser(targetName);
									}}
									className="group/btn w-full p-2.5 rounded-xl flex items-center justify-between border border-gray-100 dark:border-gray-800 hover:border-emerald-500/30 transition-all duration-300 bg-gray-50 dark:bg-gray-800/50"
								>
									<div className="flex items-center gap-3">
										<div className="size-7 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 text-[10px] font-black border border-emerald-100 dark:border-emerald-800/50">
											{(isSentApplication
												? applicant.professorName
												: applicant.name
											).charAt(0)}
										</div>
										<span className="block text-sm font-bold text-gray-900 dark:text-white group-hover/btn:text-emerald-700 transition-colors">
											{isSentApplication
												? applicant.professorName
												: applicant.name}
										</span>
									</div>
									<ChevronRight className="text-gray-900 dark:text-white size-4 transition-all group-hover/btn:translate-x-0.5" />
								</button>
							</div>
						</div>

						{/* Action Footer - Controls for accepting, rejecting, or scheduling */}
						{!isSentApplication &&
							applicant.status === "Pending" && (
								<div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-5">
									<div className="space-y-2">
										<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
											Internal Feedback
										</h4>
										<textarea
											value={feedback}
											onChange={(e) =>
												setFeedback(e.target.value)
											}
											disabled={isSubmitting}
											placeholder="Add feedback to share with the applicant..."
											className="w-full p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
											rows={2}
										/>
									</div>

									<div className="flex flex-col md:flex-row items-center justify-between gap-3">
										<button
											onClick={handleRequestMeeting}
											disabled={isSubmitting}
											className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
										>
											<Calendar className="size-3.5" />
											{applicant.meetingDetails
												? "Reschedule Meeting"
												: "Schedule Interview"}
										</button>

										<div className="flex w-full md:w-auto gap-3">
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleStatusUpdate(
														"Rejected",
													);
												}}
												disabled={isSubmitting}
												className="flex-1 md:flex-none md:min-w-[120px] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-red-500 border-2 border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
											>
												{isSubmitting ? (
													<Loader2 className="size-3 animate-spin" />
												) : (
													"Reject"
												)}
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleStatusUpdate(
														"Accepted",
													);
												}}
												disabled={isSubmitting}
												className="flex-1 md:flex-none md:min-w-[120px] px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
											>
												{isSubmitting ? (
													<Loader2 className="size-3 animate-spin" />
												) : (
													"Approve"
												)}
											</button>
										</div>
									</div>
								</div>
							)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ApplicationCard;
