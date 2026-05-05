// src/pages/Schedule/components/MeetingActionModal.jsx

import React, { useState, useEffect } from "react";
import {
	X,
	Calendar,
	Video,
	MapPin,
	FileText,
	AlertCircle,
	CheckCircle2,
	Clock,
} from "lucide-react";
import { formatDateTime } from "../utils";

const MeetingActionModal = ({
	isOpen,
	onClose,
	request,
	onConfirm,
	initialView = "accept",
}) => {
	const [view, setView] = useState(initialView);
	const [newDateTime, setNewDateTime] = useState("");
	const [meetingMode, setMeetingMode] = useState("offline");
	const [link, setLink] = useState("");
	const [venue, setVenue] = useState("");
	const [note, setNote] = useState("");
	const [reason, setReason] = useState("");
	const [rescheduleReason, setRescheduleReason] = useState("");

	useEffect(() => {
		if (isOpen) setView(initialView);
	}, [isOpen, initialView]);

	if (!isOpen || !request) return null;

	const resetForm = () => {
		setNewDateTime("");
		setMeetingMode("offline");
		setLink("");
		setVenue("");
		setNote("");
		setReason("");
		setRescheduleReason("");
	};

	const handleSubmit = () => {
		if (view === "reject") {
			onConfirm("reject", request.id, reason);
		} else {
			if (view === "reschedule" && !newDateTime) {
				alert("Please select a new date and time");
				return;
			}
			if (meetingMode === "online" && !link.trim()) {
				alert("Please provide a meeting link");
				return;
			}
			if (meetingMode === "offline" && !venue.trim()) {
				alert("Please provide a venue");
				return;
			}

			const payload = {
				mode: meetingMode,
				link: meetingMode === "online" ? link : null,
				venue: meetingMode === "offline" ? venue : null,
				note: note.trim() || null,
				...(view === "reschedule" && {
					newDateTime: new Date(newDateTime).toISOString(),
					rescheduleReason: rescheduleReason.trim() || null,
				}),
			};

			onConfirm(view, request.id, payload);
		}

		resetForm();
		onClose();
	};

	const getHeaderConfig = () => {
		switch (view) {
			case "reject":
				return {
					icon: <AlertCircle className="size-5" />,
					color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30",
				};
			case "reschedule":
				return {
					icon: <Clock className="size-5" />,
					color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30",
				};
			default:
				return {
					icon: <CheckCircle2 className="size-5" />,
					color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30",
				};
		}
	};

	const header = getHeaderConfig();

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				{/* Modal Header */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className={`p-2 rounded-lg ${header.color}`}>
							{header.icon}
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
								{view} Request
							</h2>
							<p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
								With{" "}
								{request?.participantName ||
									request?.studentName}
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				<div className="p-6 overflow-y-auto">
					<div className="space-y-6">
						{/* Reschedule Timing Section */}
						{view === "reschedule" && (
							<div className="space-y-4 animate-in fade-in duration-200">
								<div className="space-y-2">
									<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
										<Calendar className="size-3" /> New Date
										& Time
										<span className="text-rose-500">*</span>
									</label>
									<div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mb-1">
										Original:{" "}
										{request &&
											formatDateTime(
												request.startTime ||
													request.requestedTime ||
													request.dateTime,
											).date}
									</div>
									<input
										type="datetime-local"
										value={newDateTime}
										onChange={(e) =>
											setNewDateTime(e.target.value)
										}
										className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
									/>
								</div>

								{/* Added Reason for Reschedule Field */}
								<div className="space-y-2">
									<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
										<FileText className="size-3" /> Reason
										for Rescheduling
									</label>
									<textarea
										value={rescheduleReason}
										onChange={(e) =>
											setRescheduleReason(e.target.value)
										}
										placeholder="Optional: Explain why you're rescheduling..."
										className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all min-h-[80px] resize-none"
									/>
								</div>
							</div>
						)}

						{/* Meeting Details Section */}
						{(view === "accept" || view === "reschedule") && (
							<div className="space-y-6 animate-in fade-in duration-200">
								<div className="space-y-3">
									<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
										Meeting Type
										<span className="text-rose-500">*</span>
									</label>
									<div className="grid grid-cols-2 gap-3">
										{[
											{
												id: "offline",
												icon: (
													<MapPin className="size-4" />
												),
											},
											{
												id: "online",
												icon: (
													<Video className="size-4" />
												),
											},
										].map((mode) => (
											<button
												key={mode.id}
												onClick={() =>
													setMeetingMode(mode.id)
												}
												className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-bold transition-all  ${
													meetingMode === mode.id
														? "bg-rose-600 text-white border-rose-600 shadow-md dark:shadow-none"
														: "bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:bg-gray-100"
												}`}
											>
												{mode.icon}
												<span className="capitalize">
													{mode.id}
												</span>
											</button>
										))}
									</div>
								</div>

								<div className="space-y-2">
									<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
										{meetingMode === "offline" ? (
											<MapPin className="size-3" />
										) : (
											<Video className="size-3" />
										)}
										{meetingMode === "offline"
											? "Venue"
											: "Meeting Link"}
										<span className="text-rose-500">*</span>
									</label>
									<input
										type={
											meetingMode === "offline"
												? "text"
												: "url"
										}
										placeholder={
											meetingMode === "offline"
												? "E.g., Room 201"
												: "https://zoom.us/..."
										}
										value={
											meetingMode === "offline"
												? venue
												: link
										}
										onChange={(e) =>
											meetingMode === "offline"
												? setVenue(e.target.value)
												: setLink(e.target.value)
										}
										className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
									/>
								</div>
							</div>
						)}

						{/* Rejection Section */}
						{view === "reject" && (
							<div className="space-y-2 animate-in fade-in duration-200">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
									<AlertCircle className="size-3" /> Reason
									for Rejection
								</label>
								<textarea
									value={reason}
									onChange={(e) => setReason(e.target.value)}
									placeholder="E.g., Schedule conflict..."
									className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-all min-h-[120px] resize-none"
								/>
							</div>
						)}
					</div>
				</div>

				{/* Footer Actions */}
				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-[#1a1d26]/50">
					<button
						onClick={onClose}
						className="flex-1 h-12 font-bold bg-white dark:bg-[#1a1d26] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						className="flex-1 h-12 font-bold text-white capitalize bg-rose-600 rounded-xl shadow-lg shadow-rose-100 dark:shadow-none flex items-center justify-center gap-2 hover:bg-rose-700 transition-all active:scale-[0.98]"
					>
						Confirm {view}
					</button>
				</div>
			</div>
		</div>
	);
};

export default MeetingActionModal;
