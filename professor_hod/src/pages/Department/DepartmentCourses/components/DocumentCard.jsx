// src/pages/Department/DepartmentCourses/components/DocumentCard.jsx

import React, { useState } from "react";
import {
	FileText,
	ExternalLink,
	Check,
	Clock,
	X,
} from "lucide-react";

/**
 * Card for displaying downloadable course documents like syllabus or lesson plans.
 * Includes HOD approval workflow for pending documents.
 */
const DocumentCard = ({ document, onUpdateStatus }) => {
	const [isRejecting, setIsRejecting] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");

	const getStatusConfig = (status) => {
		switch (status) {
			case "Approved":
				return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
			case "Rejected":
				return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
			default:
				return "bg-amber-100 dark:bg-amber-100/10 text-amber-700 dark:text-amber-300";
		}
	};

	const statusConfig = getStatusConfig(document.status);

	const handleReject = () => {
		if (rejectionReason.trim()) {
			onUpdateStatus(document, "Rejected", rejectionReason);
			setIsRejecting(false);
			setRejectionReason("");
		}
	};

	return (
		<div className="group bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700 transition-all hover:border-violet-500/30 dark:hover:border-violet-500">
			<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
				<div className="flex gap-4 items-start flex-1">
					<div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
						<FileText className="size-6" />
					</div>
					<div className="space-y-0.5">
						<h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors group-hover:text-violet-600 truncate">
							{document.type}
						</h3>
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
							<span className="flex items-center gap-1.5">
								<span className="text-violet-500">v{document.version}</span>
							</span>
							<span className="flex items-center gap-1.5">
								<Clock className="size-3.5 text-violet-500" />
								{new Date(document.uploadDate).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</span>
						</div>
					</div>
				</div>

				<div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
					<span
						className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 ${statusConfig}`}
					>
						{document.status}
					</span>
					<a
						href={document.fileLink}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] hover:text-violet-500 transition-colors"
					>
						View File <ExternalLink className="size-3" />
					</a>
				</div>
			</div>

			{/* Rejection Reason Display */}
			{document.status === "Rejected" && document.rejectionReason && (
				<div className="mt-4 p-3 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
					<p className="text-[11px] text-red-700 dark:text-red-400 leading-relaxed">
						<span className="font-black uppercase mr-2 text-[9px]">Reason:</span>
						<span className="italic">"{document.rejectionReason}"</span>
					</p>
				</div>
			)}

			{/* Approval Workflow Section */}
			{document.status === "Pending" && (
				<div className="mt-5 space-y-4">
					{!isRejecting ? (
						<div className="flex gap-3">
							<button
								onClick={() => setIsRejecting(true)}
								className="flex-1 flex-shrink-0 min-w-[80px] flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-red-600 border border-red-200 rounded-xl text-xs font-bold uppercase hover:bg-red-50 transition-all active:scale-95"
							>
								<X className="size-4" /> Reject
							</button>
							<button
								onClick={() => onUpdateStatus(document, "Approved")}
								className="flex-1 flex-shrink-0 min-w-[80px] flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-violet-700 shadow-md transition-all active:scale-95"
							>
								<Check className="size-4" /> Approve
							</button>
						</div>
					) : (
						<div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
							<label className="text-[10px] font-black text-red-600 uppercase tracking-widest">
								Reason for Rejection
							</label>
							<textarea
								autoFocus
								value={rejectionReason}
								onChange={(e) => setRejectionReason(e.target.value)}
								placeholder="Provide a reason..."
								className="w-full p-3 text-sm bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/50 rounded-xl focus:ring-2 focus:ring-red-500 outline-none min-h-[80px] resize-none"
							/>
							<div className="flex gap-2">
								<button
									onClick={() => {
										setIsRejecting(false);
										setRejectionReason("");
									}}
									className="flex-1 py-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-600 border border-gray-200 text-xs font-bold uppercase hover:bg-gray-50 transition-all"
								>
									Cancel
								</button>
								<button
									onClick={handleReject}
									disabled={!rejectionReason.trim()}
									className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold uppercase hover:bg-red-700 shadow-md transition-all disabled:opacity-50"
								>
									Confirm
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default DocumentCard;