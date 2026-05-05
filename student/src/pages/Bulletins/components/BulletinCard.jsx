// src/pages/Bulletins/components/BulletinCard.jsx

import React, { useState, useMemo, memo } from "react";
import {
	FileText,
	ChevronDown,
	ChevronUp,
	Calendar,
	Megaphone,
	BookOpen,
	Pin,
	Users,
} from "lucide-react";

/**
 * BulletinCard Component
 * Displays a single announcement/bulletin with expandable details and attachment support.
 * Features specialized styling for priority levels and role-based pinning logic.
 */
const BulletinCard = memo(({ bullet, userRole, onTogglePin, isArchive }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	// Determines color schemes based on the urgency of the bulletin
	const priorityStyles = (priority) => {
		switch (priority.toLowerCase()) {
			case "urgent":
				return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
			case "high":
				return "bg-amber-100 dark:bg-amber-100/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50";
			default:
				return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
		}
		};

	const formattedDate = (date) =>
		new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	// Logic to check if the current user has permission to pin this specific bulletin level
	const canPin = useMemo(() => {
		if (isArchive) return false;
		if (userRole === "hod")
			return ["course", "department"].includes(bullet.level);
		if (userRole === "professor") return bullet.level === "course";
		return false;
	}, [userRole, bullet.level, isArchive]);

	return (
		<div
			onClick={() => setIsExpanded(!isExpanded)}
			className={`group relative bg-white dark:bg-[#1a1d26] rounded-2xl border transition-all duration-300 cursor-pointer active:scale-[0.99] ${
				!isArchive && bullet.is_pinned
					? "border-cyan-500/50 shadow-md shadow-cyan-500/5"
					: "border-gray-200 dark:border-gray-800"
			} ${
				isExpanded
					? "ring-2 ring-cyan-500/20 border-cyan-500/40 shadow-xl"
					: "hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700"
			}`}
		>
			{/* Main Container: Adjusted padding for better mobile density */}
			<div className="p-4 sm:p-6">
				{/* Top Action Row: Labels and Pinning button */}
				<div className="flex justify-between items-center sm:items-start mb-2 gap-2">
					<div className="flex flex-wrap items-center gap-1.5">
						<span
							className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap border ${priorityStyles(bullet.priority || "normal")}`}
						>
							{bullet.priority || "Normal"}
						</span>

						<span className="flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
							<Megaphone className="size-3 text-cyan-500" />
							{bullet.level}
						</span>
					</div>

					{!isArchive && (bullet.is_pinned || canPin) && (
						<button
							disabled={!canPin}
							onClick={(e) => {
								e.stopPropagation();
								onTogglePin?.(bullet.id);
							}}
							className={`p-2 rounded-xl transition-all shrink-0 ${
								bullet.is_pinned
									? "bg-cyan-500 text-white shadow-lg"
									: "bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-cyan-500 border border-gray-200 dark:border-gray-700"
							} ${!canPin && "opacity-80 cursor-default"}`}
						>
							<Pin
								className={`size-3.5 ${bullet.is_pinned ? "fill-current rotate-45" : ""}`}
							/>
						</button>
					)}
				</div>

				{/* Header Section: Title and Metadata */}
				<div className="space-y-4 sm:space-y-2">
					<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight">
						{bullet.title}
					</h3>

					{/* Metadata Row: Stacks vertically on mobile, horizontally on medium screens */}
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
							{bullet.courseName && (
								<div className="flex items-center gap-1.5">
									<BookOpen className="size-3 sm:size-3.5 text-cyan-600 dark:text-cyan-400" />
									{bullet.courseName}
								</div>
							)}

							{bullet.batch && bullet.batch !== "all" && (
								<div className="flex items-center gap-1.5">
									<Users className="size-3 sm:size-3.5 text-cyan-600 dark:text-cyan-400" />
									{bullet.batch} Batch
								</div>
							)}

							<div className="flex items-center gap-1.5">
								<Calendar className="size-3 sm:size-3.5 text-cyan-600 dark:text-cyan-400" />
								{formattedDate(bullet.createdAt)}
							</div>
						</div>

						<div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] group-hover:text-cyan-500 transition-colors shrink-0">
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

				{/* Expandable Content Section: Announcement body and file list */}
				{isExpanded && (
					<div className="mt-4 pt-4 sm:mt-6 sm:pt-6 border-t border-gray-100 dark:border-gray-800 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
						<div className="space-y-2">
							<h4 className="text-[9px] sm:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
								Announcement Details
							</h4>
							<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-slate-50 dark:bg-gray-900/40 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-800 whitespace-pre-wrap">
								{bullet.content}
							</p>
						</div>

						{bullet.attachments?.length > 0 && (
							<div className="space-y-2">
								<h4 className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Attachments ({bullet.attachments.length})
								</h4>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
									{bullet.attachments.map((file, idx) => (
										<a
											key={idx}
											href={file.url}
											target="_blank"
											rel="noopener noreferrer"
											onClick={(e) => e.stopPropagation()}
											className="flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 bg-white dark:bg-gray-800/50 hover:bg-cyan-50 dark:hover:bg-cyan-500/5 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-800 rounded-xl transition-all group/file"
										>
											<div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group-hover/file:bg-white dark:group-hover/file:bg-gray-700 transition-colors shrink-0">
												<FileText className="size-4 text-cyan-500" />
											</div>
											<span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-semibold truncate">
												{file.name}
											</span>
										</a>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
});

export default BulletinCard;
