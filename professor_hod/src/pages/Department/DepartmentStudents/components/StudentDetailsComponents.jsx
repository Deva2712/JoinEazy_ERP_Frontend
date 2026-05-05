// src/pages/Department/DepartmentStudents/components/StudentDetailsComponents.jsx

import React from "react";
import {
	Calendar,
	ClipboardList,
	Star,
	Quote,
	Microscope,
	BookOpen,
	Tag,
	Building2,
	MapPin,
	Clock,
	IndianRupee,
	Zap,
	Mail,
} from "lucide-react";

/**
 * Card for displaying student placement or internship details.
 * Modified to match the design language of PlacementRecordCard.
 */
export const PlacementCard = ({ placement }) => {
	if (!placement) return null;

	const { placementDetails, companyContact } = placement;
	const isInternship = placementDetails.type
		?.toLowerCase()
		.includes("internship");

	const financialValue = isInternship
		? placementDetails.stipend
		: placementDetails.salaryLPA;

	const formatFinancials = () => {
		if (financialValue === null || financialValue === undefined)
			return "Unpaid";
		return isInternship
			? `₹${financialValue.toLocaleString("en-IN")}/mo`
			: `${financialValue} LPA`;
	};

	return (
		<div className="group relative bg-white dark:bg-[#111318] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-500/30 transition-all duration-300 flex flex-col md:flex-row overflow-hidden">
			{/* Core Placement Details (Role & Company) */}
			<div className="flex-1 p-6 flex flex-col justify-center gap-6">
				<div className="space-y-3">
					<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mt-0.5">
						{placementDetails.role}
					</h3>

					<div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400">
						<div className="flex items-center gap-2.5">
							<Building2 className="size-4" />
							{placementDetails.companyName}
						</div>
						<div className="flex items-center gap-1.5">
							<MapPin className="size-4" />
							{placementDetails.location}
						</div>
					</div>
				</div>

				<div className="flex flex-wrap gap-4">
					<div className="flex-1 min-w-[140px] p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800">
						<div className="flex items-center gap-1 mb-1 text-gray-400">
							<IndianRupee className="size-3.5" />
							<span className="text-[10px] font-bold uppercase tracking-wider">
								{isInternship ? "Stipend" : "Annual CTC"}
							</span>
						</div>
						<p className="text-lg font-black text-violet-600">
							{formatFinancials()}
						</p>
					</div>

					<div className="flex-1 min-w-[140px] p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800">
						<div className="flex items-center gap-1.5 mb-1 text-gray-400">
							<Clock className="size-3.5" />
							<span className="text-[10px] font-bold uppercase tracking-wider">
								Duration
							</span>
						</div>
						<p className="text-lg font-black text-gray-900 dark:text-white">
							{placementDetails.duration || "N/A"}
						</p>
					</div>
				</div>
			</div>

			{/* Status, PPO Offer, & Recruiter Contact */}
			<div className="md:w-72 p-6 flex flex-col justify-center gap-4 bg-gray-50/30 dark:bg-black/10 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800/50">
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
							Status
						</span>
						<div
							className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
								["Completed", "Joined", "Accepted"].includes(
									placementDetails.status,
								)
									? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
									: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
							}`}
						>
							{placementDetails.status}
						</div>
					</div>

					{/* PPO Offering Section */}
					{placementDetails.isPPOOffered && (
						<div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-violet-500/5 border border-violet-500/20">
							<Zap className="size-3.5 text-violet-500 fill-violet-500" />
							<span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-tight">
								PPO Offered
							</span>
						</div>
					)}

					{companyContact && (
						<div className="p-4 rounded-2xl bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 space-y-2">
							<div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
								<Mail className="size-3" />
								Recruiter
							</div>
							<div>
								<p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
									{companyContact.name}
								</p>
								<p className="text-xs text-gray-800 dark:text-gray-200 truncate italic">
									{companyContact.email}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

/**
 * Card for displaying research projects or publications.
 */
export const ResearchItemCard = ({ item, type }) => (
	<div className="group p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-900/50 shadow-sm hover:shadow-md hover:border-violet-200 dark:hover:border-violet-900/50 transition-all duration-300">
		<div className="flex items-start gap-4">
			<div className="hidden sm:flex p-2 rounded-lg bg-violet-100 dark:bg-violet-800/50 text-violet-500 transition-colors">
				{type === "project" ? (
					<Microscope className="size-5" />
				) : (
					<BookOpen className="size-5" />
				)}
			</div>
			<div className="flex flex-col items-start space-y-1">
				<span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[9px] font-black uppercase tracking-wider">
					<Tag className="size-3" />
					{item.category || "General"}
				</span>
				<h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight pt-2">
					{item.title}
				</h4>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
					{item.abstract}
				</p>
			</div>
		</div>
	</div>
);

/**
 * Individual card displaying details of a specific mentoring meeting,
 * including date, performance ratings, summary, and action items.
 */
export const MeetingHistoryCard = ({ meeting }) => (
	<div className="group relative overflow-hidden p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-900/50 shadow-sm hover:shadow-md hover:border-violet-200 dark:hover:border-violet-900/50 transition-all duration-300">
		<div className="absolute -right-16 -top-16 size-32 bg-violet-500/5 blur-3xl group-hover:bg-violet-500/10 transition-colors" />

		<div className="flex flex-col gap-6">
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-center gap-4">
					<div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800">
						<Calendar className="size-5" />
					</div>
					<div>
						<h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
							{new Date(meeting.date).toLocaleDateString(
								"en-US",
								{
									month: "long",
									day: "numeric",
									year: "numeric",
								},
							)}
						</h4>
						<div className="flex items-center gap-1.5 mt-1">
							<span
								className={`size-1.5 rounded-full ${meeting.status === "Completed" ? "bg-green-500" : "bg-amber-500"}`}
							/>
							<span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
								{meeting.status}
							</span>
						</div>
					</div>
				</div>

				{meeting.performanceRatings &&
					meeting.status === "Completed" && (
						<div className="flex flex-wrap justify-end gap-2 max-w-[60%]">
							{Object.entries(meeting.performanceRatings).map(
								([key, val]) => (
									<div
										key={key}
										className="flex items-center gap-2 p-1.5 pl-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
									>
										<span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">
											{key}
										</span>
										<div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-md">
											<Star className="size-2.5 fill-amber-500 text-amber-500" />
											<span className="text-[10px] font-black text-amber-700 dark:text-amber-500">
												{val.toFixed(1)}
											</span>
										</div>
									</div>
								),
							)}
						</div>
					)}
			</div>

			{meeting.discussionSummary && (
				<div className="relative p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
					<Quote className="absolute -top-2 -left-2 size-5 text-violet-200 dark:text-violet-900 fill-current" />
					<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic pl-2">
						{meeting.discussionSummary}
					</p>
				</div>
			)}

			{meeting.actionPlan?.studentTasks?.length > 0 && (
				<div>
					<div className="flex items-center gap-2 mb-3">
						<ClipboardList className="size-3.5 text-violet-500" />
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
							Action Plan
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						{meeting.actionPlan.studentTasks.map((task, i) => (
							<span
								key={i}
								className="px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-[10px] font-semibold border border-violet-100 dark:border-violet-800/50 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors cursor-default"
							>
								{task}
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	</div>
);
