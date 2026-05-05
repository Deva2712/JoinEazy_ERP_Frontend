// src/pages/SessionPlanning/components/DocumentUploadRow.jsx

import React, { useRef } from "react";
import {
	ExternalLink,
	FileCheck2,
	FileX2,
	FileClock,
	Upload,
	X,
	AlertCircle,
} from "lucide-react";

const DocumentUploadRow = ({
	docType,
	file,
	uploadedDoc,
	onFileChange,
	onRemove,
}) => {
	const inputRef = useRef();

	const formatDate = (date) =>
		new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	const isApproved = uploadedDoc?.status === "Approved";
	const isRejected = uploadedDoc?.status === "Rejected";

	return (
		<div className="flex flex-col group gap-3">
			{/* Label for the document type section */}
			<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
				{docType.label}
			</span>

			{uploadedDoc && !file ? (
				<div className="space-y-3">
					<div
						className={`relative flex flex-col gap-4 px-5 py-4 border rounded-2xl transition-all ${
							isApproved
								? "bg-emerald-50/60 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-900/30"
								: isRejected
									? "bg-red-50/60 border-red-100 dark:bg-red-500/5 dark:border-red-900/30"
									: "bg-amber-50/60 border-amber-100 dark:bg-amber-500/5 dark:border-amber-900/30"
						}`}
					>
						{/* Main Content: Icon, Info, Status, and Replace Button */}
						<div className="flex items-start sm:items-center gap-4">
							{/* Icon Branding */}
							<div
								className={`flex shrink-0 items-center justify-center size-12 rounded-xl ${
									isApproved
										? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40"
										: isRejected
											? "bg-red-100 text-red-600 dark:bg-red-900/40"
											: "bg-amber-100 text-amber-600 dark:bg-amber-900/40"
								}`}
							>
								{isApproved ? (
									<FileCheck2 />
								) : isRejected ? (
									<FileX2 />
								) : (
									<FileClock />
								)}
							</div>

							{/* Container for Info + Status/Action alignment */}
							<div className="flex flex-col sm:flex-row sm:items-center justify-between flex-1 gap-3 min-w-0">
								{/* File Metadata */}
								<div className="flex flex-col min-w-0">
									<a
										href={uploadedDoc.fileLink}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white hover:text-indigo-600 truncate"
									>
										{uploadedDoc.fileName}
										<ExternalLink className="size-3 shrink-0" />
									</a>
									<div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-tight">
										<span>v{uploadedDoc.version}</span>
										<span className="text-gray-300 dark:text-gray-700">
											•
										</span>
										<span>
											{formatDate(uploadedDoc.uploadDate)}
										</span>
									</div>
								</div>

								{/* Desktop Action Group: Status Tag + Replace Button on same line */}
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:ml-auto">
									<span
										className={`px-3 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider w-fit ${
											isApproved
												? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
												: isRejected
													? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
													: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
										}`}
									>
										{isApproved
											? "Approved"
											: isRejected
												? "Rejected"
												: "Pending Review"}
									</span>

									{/* Replace button hidden on mobile here, shown at bottom instead for better UX */}
									<button
										onClick={() =>
											inputRef.current?.click()
										}
										className="hidden sm:block px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md dark:shadow-none"
									>
										Replace Document
									</button>
								</div>
							</div>
						</div>

						{/* Mobile Action Area: Only visible on small screens */}
						<div className="sm:hidden pt-3 border-t border-gray-100 dark:border-gray-800">
							<button
								onClick={() => inputRef.current?.click()}
								className="w-full px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md dark:shadow-none"
							>
								Replace Document
							</button>
						</div>

						<input
							ref={inputRef}
							type="file"
							accept={docType.accept}
							className="hidden"
							onChange={(e) =>
								onFileChange(docType.key, e.target.files[0])
							}
						/>
					</div>

					{/* Feedback section - Visual styling from AssetRequestCard remarks */}
					{isRejected && (
						<div className="p-4 sm:p-5 rounded-xl border bg-red-50/30 border-red-100 dark:bg-red-900/5 dark:border-red-800 transition-colors">
							<div className="flex items-center gap-2 mb-3">
								<h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-red-600">
									<AlertCircle className="size-5" />
									HoD's Remarks
								</h4>
							</div>
							<p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
								"{uploadedDoc.hodComments}"
							</p>
						</div>
					)}
				</div>
			) : (
				/* Empty Selection State */
				<div
					className={`flex flex-col sm:flex-row items-center gap-4 px-5 py-4 border-2 border-dashed rounded-2xl transition-all ${
						file
							? "border-indigo-400 bg-indigo-50/30 dark:bg-indigo-500/5"
							: "border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-gray-50/30 dark:bg-gray-900/20"
					}`}
				>
					<div
						className={`flex items-center justify-center size-12 rounded-2xl transition-all ${
							file
								? "bg-indigo-600 text-white"
								: "bg-white dark:bg-gray-800 text-gray-400 shadow-sm"
						}`}
					>
						<Upload className="size-5" />
					</div>

					<div className="flex-1 text-center sm:text-left min-w-0">
						<p
							className={`text-sm font-bold truncate ${file ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"}`}
						>
							{file ? file.name : `No ${docType.label} attached`}
						</p>
						<p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
							Required:{" "}
							{docType.accept.replace(/\./g, " ").toUpperCase()}
						</p>
					</div>

					<div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
						{file && (
							<button
								onClick={() => onRemove(docType.key)}
								className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
							>
								<X className="size-4" />
							</button>
						)}
						<button
							onClick={() => inputRef.current?.click()}
							className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
								file
									? "bg-white dark:bg-gray-700 text-indigo-600 border border-indigo-200 dark:border-indigo-700 shadow-sm"
									: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md  dark:shadow-none"
							}`}
						>
							{file ? "Change" : "Browse Files"}
						</button>
					</div>
					<input
						ref={inputRef}
						type="file"
						accept={docType.accept}
						className="hidden"
						onChange={(e) =>
							onFileChange(docType.key, e.target.files[0])
						}
					/>
				</div>
			)}
		</div>
	);
};

export default DocumentUploadRow;
