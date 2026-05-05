// src/pages/Maintenance/components/MaintenanceRequestCard

import React, { useState } from "react";
import {
	Calendar,
	XCircle,
	Phone,
	MessageSquare,
	Clock,
	Eye,
	RefreshCw,
	CheckCircle,
	ChevronDown,
	User,
	MapPin,
	AlertCircle,
	CheckCircle2,
} from "lucide-react";

/**
 * Priority color mapping used to provide distinct visual cues for the severity of a request.
 */
const getPriorityStyles = {
	low: {
		label: "Low",
		color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
	},
	medium: {
		label: "Medium",
		color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
	},
	high: {
		label: "High",
		color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
	},
	urgent: {
		label: "Urgent",
		color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
	},
};

/**
 * StatusTimeline
 * * A visual stepper component that tracks the lifecycle of a maintenance request.
 * - Calculates progress based on the current status index to highlight completed and current steps.
 */
const StatusTimeline = ({ status }) => {
	// Rejections and closed statuses are handled outside the stepper view.
	if (status === "rejected" || status === "closed") return null;

	const STATUS_STEPS = [
		{ key: "pending", label: "Submitted", icon: Clock },
		{ key: "viewed", label: "Viewed", icon: Eye },
		{ key: "inProgress", label: "In Progress", icon: RefreshCw },
		{ key: "solved", label: "Solved", icon: CheckCircle },
	];

	const normalizedStatus = status === "wip" ? "inProgress" : status;
	const currentIndex = STATUS_STEPS.findIndex(
		(s) => s.key === normalizedStatus,
	);

	return (
		<div className="flex items-center gap-1 mt-6 px-2">
			{STATUS_STEPS.map((step, index) => {
				const Icon = step.icon;
				const isDone = index < currentIndex;
				const isCurrent = index === currentIndex;
				// Final step color logic: Green if the step is past OR if it is specifically 'solved'.
				const isStepGreen =
					isDone || (step.key === "solved" && status === "solved");
				const isLast = index === STATUS_STEPS.length - 1;

				return (
					<React.Fragment key={step.key}>
						<div
							className="flex flex-col items-center gap-1.5"
							style={{ minWidth: 64 }}
						>
							{/* Step Indicator Circle: Updates color based on progress (Amber for active, Green for done) */}
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 ${
									isCurrent && step.key !== "solved"
										? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800"
										: isStepGreen
											? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-500"
											: "bg-transparent border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700"
								}`}
							>
								<Icon className="w-3.5 h-3.5" />
							</div>
							<span
								className={`text-[9px] font-bold uppercase tracking-[0.1em] text-center leading-tight ${
									isCurrent && step.key !== "solved"
										? "text-amber-600 dark:text-amber-500"
										: isStepGreen
											? "text-emerald-600 dark:text-emerald-500/80"
											: "text-gray-300 dark:text-gray-600"
								}`}
							>
								{step.label}
							</span>
						</div>
						{/* Progress Line between steps */}
						{!isLast && (
							<div
								className={`flex-1 h-[2px] mb-4 transition-all duration-700 ${
									isDone
										? "bg-emerald-200 dark:bg-emerald-900"
										: "bg-gray-100 dark:bg-gray-800"
								}`}
							/>
						)}
					</React.Fragment>
				);
			})}
		</div>
	);
};

/**
 * MaintenanceRequestCard
 * * A summary card representing a single maintenance task.
 * Features:
 * - Click-to-Expand: Toggles detailed view showing the description and technician details.
 * - Action Indicators: Highlights tasks requiring user attention with a pulse animation.
 * - Admin Remarks: Displays feedback or rejection reasons provided by management.
 */
const MaintenanceRequestCard = ({ request, technician }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const formatIssueType = (type) => {
		if (!type) return "General";
		return type.charAt(0).toUpperCase() + type.slice(1);
	};

	const formatDate = (date) =>
		new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	return (
		<div
			onClick={() => setIsExpanded(!isExpanded)}
			className={`group bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200/60 dark:border-gray-800 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-yellow-500/10 hover:border-yellow-500/30 ${
				isExpanded
					? "ring-yellow-500/10 border-yellow-500/30 shadow-lg"
					: "hover:shadow-md"
			}`}
		>
			<div className="p-6">
				{/* Top Info Row: Status badges and issue title */}
				<div className="flex items-start justify-between gap-3 mb-4">
					<div className="flex-1 min-w-0">
						{request.requiresAction && (
							<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest mb-3 border border-orange-200 dark:border-orange-800 animate-pulse">
								<AlertCircle className="size-3" />
								Action Required
							</div>
						)}
						<h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors">
							{formatIssueType(request.issueType)} Issue
						</h3>
						{request.component && (
							<span className="text-sm font-normal text-gray-500 dark:text-gray-400">
								{request.component}
							</span>
						)}
					</div>
					<div className="flex items-center gap-3">
						<span
							className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
								getPriorityStyles[request.priority]?.color ||
								"bg-gray-100"
							}`}
						>
							{getPriorityStyles[request.priority]?.label ||
								request.priority}
						</span>
						<ChevronDown
							className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
						/>
					</div>
				</div>

				{/* Metadata: Created date and building/room location */}
				<div className="flex flex-wrap items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
					<span className="flex items-center gap-1.5">
						<Calendar className="size-3.5" />
						{formatDate(request.createdAt)}
					</span>
					<span className="flex items-center gap-1.5">
						<MapPin className="size-3.5" />
						{request.location}
					</span>
				</div>

				{/* Stepper progress */}
				<StatusTimeline status={request.status} />

				{/* Expanded Details Section: Only rendered if isExpanded is true */}
				{isExpanded && (
					<div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
						{/* Details Grid: Dynamically switches layout based on whether technician info exists */}
						<div
							className={`grid gap-6 ${technician ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}
						>
							<div className="space-y-2">
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Description
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
									"
									{request.description ||
										"No description provided."}
									"
								</p>
							</div>

							{/* Technician Info: Includes contact link for phone calls */}
							{technician && (
								<div className="space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Assigned Technician
									</h4>
									<div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 min-h-[80px]">
										<div className="flex items-center gap-3">
											<div className="size-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
												<User className="size-5 text-yellow-600" />
											</div>
											<div>
												<p className="text-sm font-bold text-gray-900 dark:text-white">
													{technician.name}
												</p>
												<p className="text-xs font-semibold text-yellow-700 dark:text-yellow-500 uppercase tracking-tighter">
													{technician.phone}
												</p>
											</div>
										</div>
										<a
											href={`tel:${technician.phone}`}
											onClick={(e) => e.stopPropagation()}
											className="p-2.5 bg-white dark:bg-gray-800 rounded-xl text-yellow-500 shadow-sm border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50 transition-all"
										>
											<Phone className="size-4" />
										</a>
									</div>
								</div>
							)}
						</div>

						{/* Admin Remarks Section: Provides feedback on completion or required follow-ups */}
						{(request.adminRemarks ||
							request.status === "solved") && (
							<div
								className={`p-4 sm:p-5 rounded-xl border transition-colors ${
									request.status === "solved"
										? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/5 dark:border-emerald-800"
										: request.requiresAction
											? "bg-orange-50/30 border-orange-100 dark:bg-orange-900/5 dark:border-orange-800"
											: "bg-gray-50/50 border-gray-100 dark:bg-gray-800/20 dark:border-gray-800"
								}`}
							>
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
									<h4
										className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${
											request.status === "solved"
												? "text-emerald-600"
												: request.requiresAction
													? "text-orange-600"
													: "text-gray-500 dark:text-gray-400"
										}`}
									>
										{request.status === "solved" ? (
											<CheckCircle2 className="size-5" />
										) : request.status === "rejected" ? (
											<XCircle className="size-5" />
										) : (
											<MessageSquare className="size-5" />
										)}
										Admin's Remarks
									</h4>

									{request.updatedAt && (
										<p className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md">
											{formatDate(request.updatedAt)}
										</p>
									)}
								</div>

								<p className="text-sm text-gray-700 dark:text-gray-300 italic">
									{request.adminRemarks ||
										"No specific feedback provided."}
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default MaintenanceRequestCard;
