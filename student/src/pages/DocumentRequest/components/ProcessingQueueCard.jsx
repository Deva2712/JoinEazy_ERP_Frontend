// src/pages/DocumentRequest/components/ProcessingQueueCard.jsx

import React, { useState } from "react";
import {
	FileText,
	Clock,
	Send,
	GraduationCap,
	ChevronDown,
	ChevronUp,
	ExternalLink,
	CheckCircle,
} from "lucide-react";

const ProcessingQueueCard = ({ data, onAction }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const status = data.status;

	const getStatusStyles = (status) => {
		switch (status) {
			case "Pending":
				return "bg-amber-100 dark:bg-amber-100/10 text-amber-700 dark:text-amber-300";
			case "Approved":
				return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
			default:
				return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
		}
	};

	const formatDate = (date) =>
		date
			? new Date(date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})
			: "Pending";

	const handleDispatch = (e) => {
		e.stopPropagation();
		onAction(data.lorId);
	};

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
				{/* Header Section */}
				<div className="flex flex-col md:flex-row md:items-start justify-between gap-4 cursor-pointer">
					<div className="flex gap-4 items-start flex-1">
						<div className="p-3 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform">
							<FileText className="text-fuchsia-600 dark:text-fuchsia-400 size-6" />
						</div>
						<div className="space-y-1">
							<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-fuchsia-600">
								{data.studentName}
							</h3>

							<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
								<span className="flex items-center gap-1.5">
									<GraduationCap className="size-3.5 text-fuchsia-500" />
									{data.rollNumber}
								</span>
								<span className="flex items-center gap-1.5">
									<Clock className="size-3.5 text-fuchsia-500" />
									{formatDate(data.sentDate)}
								</span>
							</div>
						</div>
					</div>

					<div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3">
						<span
							className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider ${getStatusStyles(status)}`}
						>
							{status}
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
							{/* Left Column: Contextual Notes */}
							<div className="space-y-6">
								<div className="space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Note to Registrar
									</h4>
									<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
										{data.noteToRegistrar ||
											"No notes provided."}
									</p>
								</div>
							</div>

							{/* Right Column: Document Management */}
							<div className="space-y-6">
								{/* Uploaded Document Section */}
								<div className="space-y-2">
									<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Uploaded Document
									</h4>
									<a
										href={data.signedDocument.url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-fuchsia-700 dark:hover:text-fuchsia-400 border border-fuchsia-100 dark:border-fuchsia-800/50 rounded-lg group/file hover:border-fuchsia-500/50 transition-all"
									>
										<div className="flex items-center gap-3 min-w-0">
											<FileText className="size-4 text-fuchsia-500 flex-shrink-0" />
											<span className="text-xs font-semibold truncate">
												{data.signedDocument.name}
											</span>
										</div>
										<ExternalLink className="size-3" />
									</a>
								</div>

								{/* Approved Document Section */}
								{data.approvedDocument && (
									<div className="space-y-2">
										<div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
											<h4 className="text-gray-400">
												Approved Document
											</h4>
											<p className="text-emerald-700 dark:text-emerald-300">
												{formatDate(data.approvedDate)}
											</p>
										</div>
										<a
											href={data.approvedDocument.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 rounded-lg group/file hover:border-emerald-500/50 transition-all"
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
								)}
							</div>
						</div>

						{/* Action Section: Ready for Dispatch */}
						{status === "Approved" && (
							<div className="mt-8 p-4 bg-fuchsia-50/50 dark:bg-fuchsia-900/10 rounded-2xl border border-fuchsia-100 dark:border-fuchsia-800 flex flex-col sm:flex-row items-center justify-between gap-4">
								<div className="space-y-1 text-center sm:text-left">
									<p className="text-sm text-fuchsia-800 dark:text-fuchsia-300 font-bold">
										Ready for Dispatch
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										The letter has been signed and is
										ready for the student.
									</p>
								</div>

								<button
									onClick={handleDispatch}
									className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-fuchsia-700 shadow-md transition-all"
								>
									<Send className="size-3.5" />
									Dispatch to Student
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ProcessingQueueCard;
