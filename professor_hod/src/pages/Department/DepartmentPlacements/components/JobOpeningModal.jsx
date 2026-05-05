// src/pages/Department/DepartmentPlacements/components/JobOpeningModal.jsx

import React from "react";
import { X, User, ExternalLink, Briefcase, Info } from "lucide-react";

const JobOpeningModal = ({ isOpen, onClose, opening, companyName }) => {
	if (!isOpen || !opening) return null;

	const isInternship = opening.type === "Internship";

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
			<div
				className="bg-white dark:bg-[#1a1d26] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Modal Header - Styled to match AssetRequestModal */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30">
							<Briefcase className="size-5" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
								{opening.role}
							</h2>
							<p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
								{companyName} • {opening.type}
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

				{/* Modal Content */}
				<div className="flex-1 overflow-y-auto p-6 space-y-8">
					{/* Stats Grid - Using rounded-xl and gray-50/50 for consistency */}
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
						<div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
							<p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
								{isInternship ? "Stipend" : "Annual CTC"}
							</p>
							<p className="text-lg font-black text-violet-500">
								₹
								{isInternship
									? `${opening.stipend}/mo`
									: `${opening.salaryLPA} LPA`}
							</p>
						</div>
						<div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
							<p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
								Openings
							</p>
							<p className="text-lg font-black text-gray-900 dark:text-white">
								{opening.count}
							</p>
						</div>
						<div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 col-span-2 sm:col-span-1">
							<p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
								Applications
							</p>
							<p className="text-lg font-black text-gray-900 dark:text-white">
								{opening.applicationsCount || 0}
							</p>
						</div>
					</div>

					{/* Applicants List */}
					<div className="space-y-4">
						<h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
							<User className="size-3" />
							Applicant Details
						</h4>

						{opening.applicants?.length > 0 ? (
							<div className="grid grid-cols-1 gap-3">
								{opening.applicants.map((applicant, idx) => (
									<div
										key={idx}
										className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/30 hover:border-violet-500/30 transition-all group"
									>
										<div className="flex items-center gap-4">
											<div className="size-10 rounded-full bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold">
												{applicant.name.charAt(0)}
											</div>
											<div>
												<p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-violet-500 transition-colors">
													{applicant.name}
												</p>
												<div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
													<span>
														{applicant.studentId}
													</span>
													<span className="size-1 rounded-full bg-gray-300 dark:bg-gray-700" />
													<span>
														Batch {applicant.batch}
													</span>
												</div>
											</div>
										</div>
										<div className="mt-3 sm:mt-0 flex items-center justify-between sm:justify-end gap-4">
											<span
												className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
													applicant.status ===
													"Accepted"
														? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
														: applicant.status ===
															  "Interviewing"
															? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
															: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400"
												}`}
											>
												{applicant.status}
											</span>
											{applicant.resumeLink && (
												<a
													href={applicant.resumeLink}
													target="_blank"
													rel="noreferrer"
													className="flex items-center gap-1 text-[10px] font-black text-violet-600 dark:text-violet-400 hover:underline uppercase"
												>
													Resume{" "}
													<ExternalLink className="size-3" />
												</a>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
								<Info className="size-5 mb-2 opacity-20" />
								<p className="text-xs italic">
									No application records found for this
									opening.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default JobOpeningModal;
