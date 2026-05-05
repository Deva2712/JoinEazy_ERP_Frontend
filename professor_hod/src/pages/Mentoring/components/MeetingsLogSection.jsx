// src/pages/Mentoring/components/MeetingsLogSection.jsx

import React, { useState } from "react";
import { 
	Clock, 
	XCircle, 
	Pencil, 
	Loader2, 
    UserPen,
    Check,
    X,
    CheckCircle
} from "lucide-react";

/**
 * Renders a list of past meetings with status indicators and attendance management.
 * Provides distinct visual states for completed, pending, and unmarked sessions.
 */
const MeetingsLogSection = ({ meetingHistory, onOpenMeetingModal, onToggleAttendance }) => {
	const [updatingId, setUpdatingId] = useState(null);

	const sortedMeetings = [...(meetingHistory || [])]
		.filter((m) => m.status !== "Requested")
		.sort((a, b) => new Date(b.date) - new Date(a.date));

	const handleAttendance = async (meetingId, attended) => {
		const statusText = attended ? "Present" : "Absent";
		const confirmed = window.confirm(`Are you sure you want to mark this student as ${statusText}?`);
		
		if (!confirmed) return;

		setUpdatingId(meetingId);
		try {
			await onToggleAttendance(meetingId, attended);
		} finally {
			setUpdatingId(null);
		}
	};

	return (
		<div className="divide-y divide-gray-100 dark:divide-gray-700 border-t border-gray-100 dark:border-gray-700">
			{sortedMeetings.map((meeting, idx) => {
				const isInteractable =
					meeting.hasAttended &&
					(meeting.status === "Completed" ||
						meeting.status === "Pending Documentation");

				const isPending = meeting.status === "Pending Documentation";
				const isUnmarked = meeting.hasAttended === null;
				const isUpdating = updatingId === meeting.meetingId;
				const showAttendanceToggle = isUnmarked && !meeting.discussionSummary;

				return (
					<div
						key={meeting.meetingId || idx}
						className="p-5 flex flex-col sm:flex-row items-start gap-4 transition-all group hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
					>
						{/* Header Row: Status Icon and Enhanced Mobile Actions */}
						<div className="flex w-full sm:w-auto justify-between items-start gap-4">
							<div
								className={`p-2.5 rounded-xl shrink-0 transition-colors ${
									isUnmarked 
										? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" 
										: !meeting.hasAttended
											? "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
											: meeting.status === "Completed"
												? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
												: "bg-sky-50 text-sky-600 dark:bg-sky-900/20"
								}`}
							>
								{isUpdating ? (
									<Loader2 className="size-5 animate-spin" />
								) : isUnmarked ? (
									<UserPen className="size-5" />
								) : !meeting.hasAttended ? (
									<XCircle className="size-5" />
								) : meeting.status === "Completed" ? (
									<CheckCircle className="size-5" />
								) : (
									<Clock className="size-5" />
								)}
							</div>

							{/* Mobile Actions: Larger touch targets (min 44px) */}
							<div className="flex sm:hidden items-center gap-3">
								{showAttendanceToggle && (
									<div className="flex items-center gap-3">
										<button
											disabled={isUpdating}
											onClick={() => handleAttendance(meeting.meetingId, true)}
											className="flex items-center justify-center p-2.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 active:scale-95 transition-transform disabled:opacity-50"
											aria-label="Mark Present"
										>
											<Check className="size-5" />
										</button>
										<button
											disabled={isUpdating}
											onClick={() => handleAttendance(meeting.meetingId, false)}
											className="flex items-center justify-center p-2.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 active:scale-95 transition-transform disabled:opacity-50"
											aria-label="Mark Absent"
										>
											<X className="size-5" />
										</button>
									</div>
								)}

								{isInteractable && !isUpdating && (
									<button
										onClick={() => onOpenMeetingModal(meeting)}
										className="flex items-center justify-center p-2.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400 active:scale-95 transition-transform"
										aria-label="Edit Meeting"
									>
										<Pencil className="size-5" />
									</button>
								)}
							</div>
						</div>

						{/* Main Content Area */}
						<div className="flex-1 min-w-0 w-full">
							<div className="flex flex-col sm:flex-row justify-between items-start gap-4">
								<div className="space-y-1">
									<p className={`text-sm leading-snug ${
										isUnmarked 
											? "font-bold text-amber-900 dark:text-amber-200" 
											: "font-semibold text-gray-900 dark:text-white"
									}`}>
										{isUnmarked 
											? "Mark student's attendance for this meeting."
											: !meeting.hasAttended
												? "Student was marked as absent for this session."
												: meeting.discussionSummary || "Record update pending for this session."}
									</p>
									<p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
										{new Date(meeting.date).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</p>
								</div>

								{/* Desktop Actions (sm and up) */}
								<div className="hidden sm:flex items-center gap-2">
									{showAttendanceToggle && (
										<div className="flex items-center gap-2">
											<button
												disabled={isUpdating}
												onClick={() => handleAttendance(meeting.meetingId, true)}
												className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 disabled:opacity-50"
											>
												<Check className="size-3.5" />
												<span>Present</span>
											</button>
											
											<button
												disabled={isUpdating}
												onClick={() => handleAttendance(meeting.meetingId, false)}
												className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-800/50 disabled:opacity-50"
											>
												<X className="size-3.5" />
												<span>Absent</span>
											</button>
										</div>
									)}

									{isInteractable && !isUpdating && (
										<button
											onClick={() => onOpenMeetingModal(meeting)}
											aria-label={isPending ? "Document meeting" : "Edit meeting"}
											className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-800/50"
										>
											<Pencil className="size-3.5" />
											<span>{isPending ? "Update" : "Edit"}</span>
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default MeetingsLogSection;