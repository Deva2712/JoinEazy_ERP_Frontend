// src/pages/Schedule/components/MeetingCard.jsx

import React from "react";
import {
	Clock,
	MapPin,
	ChevronDown,
	ExternalLink,
	Calendar,
	ChevronRight,
	User,
} from "lucide-react";
import { formatDateTime } from "../utils";

const STATUS_CONFIG = {
	scheduled: {
		color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
		label: "Scheduled",
	},
	rescheduled: {
		color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
		label: "Rescheduled",
	},
	pending: {
		color: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
		label: "Pending",
	},
	rejected: {
		color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
		label: "Rejected",
	},
};

const MeetingCard = ({
	meeting,
	isExpanded = false,
	isSelected = false,
	isIncoming = false,
	onClick,
	onAccept,
	onReject,
	onReschedule,
}) => {
	const status = meeting.status?.toLowerCase() || "pending";
	const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
	const isMentoring = meeting.category?.toLowerCase() === "mentoring";

	const { date, time } = formatDateTime(
		meeting.startTime || meeting.requestedTime,
	);

	return (
		<div
			onClick={!isExpanded ? onClick : undefined}
			className={`group relative bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200/60 dark:border-gray-800 flex flex-col transition-all duration-300
				${isExpanded ? "w-full border-rose-500/30 shadow-xl" : "cursor-pointer hover:border-rose-500/30 hover:shadow-lg hover:-translate-y-0.5"}
				${isSelected && !isExpanded ? "ring-2 ring-rose-500 border-transparent" : ""}
			`}
		>
			<div className="p-5">
				{/* Header Section: Subject, Participant Info, and Status/Category Tags */}
				<div className="flex flex-col gap-2">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1 min-w-0 gap-1">
							<h3
								className={`font-bold text-gray-900 dark:text-white transition-colors group-hover:text-rose-700 line-clamp-1 ${isExpanded ? "text-xl" : "text-lg"}`}
							>
								{meeting.subject}
							</h3>
							{!isExpanded && (
								<p className="text-gray-400 font-bold text-xs whitespace-nowrap">
									{meeting.participantName} (
									{meeting.participantRole})
								</p>
							)}
						</div>
						<div className="flex gap-2">
							{isMentoring && isExpanded && (
								<span className="px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
									<User className="size-3" />
									Mentoring
								</span>
							)}
							<span
								className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${config.color}`}
							>
								{config.label}
							</span>
						</div>
					</div>

					{/* Meta Info: Date, Time, and Meeting Type */}
					<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-400 uppercase tracking-wide mt-1">
						<div className="flex items-center gap-1.5">
							<Calendar className="size-3 text-rose-500" />
							{date}
						</div>
						{isExpanded && (
							<div className="flex items-center gap-1.5">
								<Clock className="size-3 text-rose-500" />
								{time}
							</div>
						)}
						<div className="flex items-center gap-1.5">
							<MapPin className="size-3 text-rose-500" />
							{meeting.type}
						</div>
						{isMentoring && !isExpanded && (
							<div className="flex items-center gap-1.5 text-sky-500">
								<User className="size-3" />
								Mentor Session
							</div>
						)}
					</div>
				</div>

				{!isExpanded && (
					<div className="absolute bottom-4 right-4">
						{isSelected ? (
							<ChevronRight className="size-4 text-gray-400 group-hover:translate-y-0.5 transition-all" />
						) : (
							<ChevronDown className="size-4 text-gray-400 group-hover:translate-y-0.5 transition-all" />
						)}
					</div>
				)}

				{isExpanded && (
					<div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6 animate-in fade-in slide-in-from-top-2">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="md:col-span-2 space-y-5">
								{/* Existing Reason for Meeting */}
								{meeting.reason && (
									<div className="space-y-2">
										<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
											Reason for Meeting
										</h4>
										<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
											{meeting.reason}
										</p>
									</div>
								)}

								{/* Added Display for Reschedule Reason */}
								{status === "rescheduled" &&
									meeting.rescheduleReason && (
										<div className="space-y-2">
											<h4 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
												Your Rescheduling Note
											</h4>
											<p className="text-sm text-gray-700 dark:text-gray-300 italic bg-blue-50/30 border-blue-100 dark:bg-blue-900/5 dark:border-blue-800 p-3 rounded-lg border">
												"{meeting.rescheduleReason}"
											</p>
										</div>
									)}

								{/* Existing Participant Rejection Feedback */}
								{meeting.rejectionReason && (
									<div className="space-y-2">
										<h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest">
											Participant's Feedback
										</h4>
										<p className="text-sm text-gray-700 dark:text-gray-300 italic bg-red-50/30 border-red-100 dark:bg-red-900/5 dark:border-red-800 p-3 rounded-lg border">
											"{meeting.rejectionReason}"
										</p>
									</div>
								)}

								{/* Access Info: Location or Virtual Link */}
								{(status === "scheduled" ||
									status === "rescheduled") &&
									(meeting.type === "Offline" ? (
										<div className="flex items-center gap-3">
											<MapPin className="size-5 text-rose-500" />
											<div>
												<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
													Location
												</p>
												<p className="text-sm font-bold text-gray-700 dark:text-gray-200">
													{meeting.location || "N/A"}
												</p>
											</div>
										</div>
									) : (
										<div className="flex items-center gap-3">
											<ExternalLink className="size-5 text-rose-500" />
											<div>
												<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
													Meeting Link
												</p>
												<a
													href={meeting.meetingLink}
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm font-bold text-blue-600 hover:underline"
												>
													{meeting.meetingLink ||
														"N/A"}
												</a>
											</div>
										</div>
									))}
							</div>

							<div className="space-y-2">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Participant
								</h4>
								<div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/50">
									<div className="flex items-center gap-3">
										<div className="size-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-700 font-bold">
											{meeting.participantName.charAt(0)}
										</div>
										<div>
											<p className="text-sm font-bold text-gray-900 dark:text-white">
												{meeting.participantName}
											</p>
											<p className="text-[10px] text-gray-500 uppercase font-bold">
												{meeting.participantRole}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Action Buttons: Interactions based on status */}
						{((isIncoming && status === "pending") ||
							status === "rescheduled" ||
							status === "scheduled") && (
							<div className="pt-5 border-t border-gray-100 dark:border-gray-800 flex flex-wrap justify-end gap-3">
								{isIncoming && status === "pending" && (
									<>
										<button
											onClick={(e) => {
												e.stopPropagation();
												onReject(meeting);
											}}
											className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-red-500 border-2 border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
										>
											Reject
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												onAccept(meeting);
											}}
											className="px-5 py-2 rounded-xl bg-green-600 text-white text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-md"
										>
											Accept
										</button>
									</>
								)}
								{(status === "rescheduled" ||
									status === "scheduled") && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											onReschedule(meeting);
										}}
										className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 border-2 border-gray-500/20 hover:bg-gray-500 hover:text-white transition-all"
									>
										Reschedule Meeting
									</button>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default MeetingCard;
