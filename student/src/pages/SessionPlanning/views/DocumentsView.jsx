// src/pages/SessionPlanning/views/DocumentsView.jsx

import React, { useState, useMemo } from "react";
import { CheckCircle, Upload, ChevronDown, AlertCircle } from "lucide-react";
import DocumentUploadRow from "../components/DocumentUploadRow";

/**
 * Configuration for supported document types.
 * Defines the unique key, display label, and accepted file extensions for each row.
 */
const DOC_TYPES = [
	{
		key: "courseOutline",
		label: "Course Outline",
		accept: ".pdf,.doc,.docx",
	},
	{ key: "timeline", label: "Timeline", accept: ".pdf,.xlsx,.xls,.png" },
	{
		key: "assessmentPlan",
		label: "Assessment Plan",
		accept: ".pdf,.doc,.docx",
	},
	{
		key: "previousYearAnalysis",
		label: "Previous Year Analysis",
		accept: ".pdf,.xlsx,.pptx",
	},
];

/**
 * DocumentsView Component
 * Manages the state of file uploads for specific courses.
 */
const DocumentsView = ({
	courses = [],
	uploadedDocsByCourse = {},
	onUpload,
}) => {
	const [selectedCourseId, setSelectedCourseId] = useState(
		courses[0]?.id || "",
	);
	const [pendingFiles, setPendingFiles] = useState({});
	const [uploading, setUploading] = useState(false);
	const [uploadSuccess, setUploadSuccess] = useState(false);

	const activeCourses = courses.filter(
		(course) => course.status !== "Completed",
	);
	const selectedCourse = courses.find(
		(c) => c.id.toString() === selectedCourseId.toString(),
	);

	/**
	 * Transform the flat array of documents from the new data format into a map
	 * that DocumentUploadRow expects, matching by the 'type' field.
	 */
	const uploadedDocsMap = useMemo(() => {
		const docsArray = uploadedDocsByCourse[selectedCourseId] || [];
		return docsArray.reduce((acc, doc) => {
			// Find the matching DOC_TYPES entry by comparing labels/types
			const typeConfig = DOC_TYPES.find(
				(dt) => dt.label.toLowerCase() === doc.type.toLowerCase(),
			);

			if (typeConfig) {
				acc[typeConfig.key] = doc;
			}
			return acc;
		}, {});
	}, [uploadedDocsByCourse, selectedCourseId]);

	/**
	 * Adds a file to the pending state for a specific document category.
	 */
	const handleFileChange = (key, file) => {
		if (!file) return;
		setPendingFiles((prev) => ({ ...prev, [key]: file }));
		setUploadSuccess(false);
	};

	/**
	 * Removes a file from the pending selection.
	 */
	const handleRemove = (key) => {
		setPendingFiles((prev) => {
			const n = { ...prev };
			delete n[key];
			return n;
		});
	};

	/**
	 * Processes the upload by immediately triggering the onUpload callback.
	 */
	const handleUpload = async () => {
		if (Object.keys(pendingFiles).length === 0) return;

		setUploading(true);
		const success = await onUpload(selectedCourseId, pendingFiles);

		if (success) {
			setPendingFiles({});
			setUploadSuccess(true);
			setTimeout(() => setUploadSuccess(false), 3000);
		}
		setUploading(false);
	};

	const pendingCount = Object.keys(pendingFiles).length;

	return (
		<div className="max-w-7xl mx-auto pb-24">
			{/* Course Context & Selection */}
			<div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
				<div className="space-y-1">
					<h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
						Course Documents
					</h3>

					<span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
						{selectedCourse?.courseName || "Select a course"}
					</span>
				</div>

				{activeCourses.length > 1 && (
					<div className="relative group min-w-[300px]">
						<select
							value={selectedCourseId}
							onChange={(e) => {
								setSelectedCourseId(e.target.value);
								setPendingFiles({});
								setUploadSuccess(false);
							}}
							className="w-full pl-4 pr-10 py-3 text-sm font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white outline-none appearance-none shadow-sm hover:border-indigo-500/50 transition-all cursor-pointer"
						>
							{activeCourses.map((c) => (
								<option key={c.id} value={c.id}>
									{c.courseName} ({c.courseCodes?.join(" / ")}
									)
								</option>
							))}
						</select>
						<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-hover:text-indigo-500 transition-all" />
					</div>
				)}
			</div>

			{/* Action Bar */}
			{(pendingCount > 0 || uploadSuccess) && (
				<div className="mb-10 animate-in slide-in-from-top-4 fade-in duration-300">
					<div
						className={`p-4 sm:p-5 rounded-2xl border transition-all ${
							uploadSuccess
								? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-900/30"
								: "bg-indigo-50/50 border-indigo-100 dark:bg-indigo-500/5 dark:border-indigo-900/30 shadow-lg shadow-indigo-500/5"
						}`}
					>
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
							<div className="flex items-center gap-4 w-full sm:w-auto">
								{uploadSuccess ? (
									<div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
										<CheckCircle className="size-5" />
										Documents updated successfully
									</div>
								) : (
									<div className="flex items-center gap-4">
										<div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400">
											<AlertCircle className="size-5" />
										</div>
										<div className="flex flex-col">
											<span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">
												{pendingCount} File
												{pendingCount > 1
													? "s"
													: ""}{" "}
												Ready
											</span>
											<p className="text-xs font-medium text-gray-500 dark:text-gray-400">
												Changes are not yet synced
											</p>
										</div>
									</div>
								)}
							</div>

							<div className="flex items-center gap-3 w-full sm:w-auto">
								{!uploadSuccess && (
									<button
										onClick={handleUpload}
										disabled={uploading}
										className="group w-full sm:w-auto flex items-center justify-center gap-3 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none"
									>
										{uploading ? (
											<>
												<div className="size-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
												Syncing...
											</>
										) : (
											<>
												<Upload className="size-4" />
												Submit Changes
											</>
										)}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Document List */}
			<div className="space-y-8">
				{DOC_TYPES.map((dt) => (
					<DocumentUploadRow
						key={dt.key}
						docType={dt}
						file={pendingFiles[dt.key]}
						uploadedDoc={uploadedDocsMap[dt.key]}
						onFileChange={handleFileChange}
						onRemove={handleRemove}
					/>
				))}
			</div>
		</div>
	);
};

export default DocumentsView;
