// src/pages/LeaveApplication/components/SubstitutionRequestCard.jsx

import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp, Check, X } from "lucide-react";

const SubstitutionRequestCard = ({ app, onRespond }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [status, setStatus] = useState(app.status);

	const formatTime = (timeStr) => {
		const [hours, minutes] = timeStr.split(":");
		const date = new Date();
		date.setHours(hours, minutes);
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		});
	};

	const formattedDate = (dateStr) =>
		new Date(dateStr).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	const dateDisplay =
		app.fromDate === app.toDate
			? formattedDate(app.fromDate)
			: `${formattedDate(app.fromDate)} - ${formattedDate(app.toDate)}`;

	// Handles local status update and calls parent function
	const handleAction = (action) => {
		setStatus(action);
		onRespond(app.id, action);
	};

	return (
		<div
			onClick={() => setIsExpanded(!isExpanded)}
			className={`group bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200/60 dark:border-gray-800 transition-all duration-300 ring-1 ring-transparent hover:ring-orange-500/10 hover:border-orange-500/30 ${
				isExpanded
					? "ring-orange-500/10 border-orange-500/30 shadow-lg"
					: "hover:shadow-md"
			}`}
		>
			<div className="p-4 sm:p-6">
				<div className="flex flex-col md:flex-row md:items-start justify-between gap-4 cursor-pointer">
					<div className="flex flex-col gap-2 flex-1">
						<div className="flex flex-wrap items-center gap-3">
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-orange-600">
								{app.requesterName}
							</h3>
						</div>

						<div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
							<Calendar className="size-3.5 text-orange-500" />
							{dateDisplay}
						</div>
					</div>

					<div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3">
						<span
							className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider ${
								status === "Accepted"
									? "bg-emerald-100 text-emerald-700"
									: status === "Rejected"
										? "bg-red-100 text-red-700"
										: "bg-amber-100 text-amber-700"
							}`}
						>
							{status}
						</span>
						<div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] group-hover:text-orange-500">
							{isExpanded ? (
								<>
									Collapse <ChevronUp className="size-3" />
								</>
							) : (
								<>
									Respond <ChevronDown className="size-3" />
								</>
							)}
						</div>
					</div>
				</div>

				{isExpanded && (
					<div
						className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6 animate-in fade-in slide-in-from-top-2"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Course
								</h4>
								<p className="text-sm font-medium text-gray-700 dark:text-gray-200">
									{app.course}
								</p>
							</div>
							<div className="">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Timings
								</h4>
								<p className="text-sm font-medium text-gray-700 dark:text-gray-200">
									{formatTime(app.timings.startTime)} -{" "}
									{formatTime(app.timings.endTime)}
								</p>
							</div>
							<div className="">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Room
								</h4>
								<p className="text-sm font-medium text-gray-700 dark:text-gray-200">
									{app.roomNumber}
								</p>
							</div>
						</div>

						<div className="space-y-2">
							<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
								Requester's Note
							</h4>
							<p className="text-sm text-gray-600 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
								{app.note || "No additional notes provided."}
							</p>
						</div>

						{status === "Pending" && (
							<div className="p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-800">
								<p className="text-sm text-orange-800 dark:text-orange-300 font-medium mb-4">
									Are you available to cover these classes?
								</p>
								<div className="flex gap-3">
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleAction("Rejected");
										}}
										className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-red-600 dar:text-red-500 border border-red-200 dark:border-red-500 rounded-xl text-xs font-bold uppercase hover:bg-red-50 transition-all"
									>
										<X className="size-4" /> Decline
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleAction("Accepted");
										}}
										className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-emerald-700 shadow-md transition-all"
									>
										<Check className="size-4" /> Accept
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

export default SubstitutionRequestCard;
