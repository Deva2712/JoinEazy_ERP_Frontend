// src/pages/Bulletins/components/BulletinModal.jsx

import React, { useState, useRef, useEffect, memo } from "react";
import {
	X,
	Megaphone,
	Upload,
	CheckCircle,
	FileText,
	ChevronDown,
	Layers,
	AlertCircle,
	Globe,
	Loader2,
	Lock,
	Pin,
	Users,
} from "lucide-react";

const getEmptyForm = (role) => ({
	title: "",
	content: "",
	level: role === "hod" ? "department" : "course",
	priority: "Normal",
	courseId: "",
	batch: "all",
	year: "all",
	attachment: null,
	faculty_only: false,
	is_pinned: false,
});

const BulletinModal = ({
	isOpen,
	onClose,
	onSubmit,
	cohorts = [],
	userRole,
}) => {
	const fileInputRef = useRef(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState(() => getEmptyForm(userRole));

	useEffect(() => {
		if (isOpen) {
			setFormData(getEmptyForm(userRole));
			setIsSubmitting(false);
		}
	}, [isOpen, userRole]);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const res = await onSubmit(formData);
			if (res.success) {
				onClose();
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	/**
	 * Handles cohort selection and auto-fills associated batch/year data
	 */
	const handleCohortChange = (cohortId) => {
		const selectedCohort = cohorts.find(
			(c) => (c.id || c._id).toString() === cohortId.toString(),
		);

		setFormData((prev) => ({
			...prev,
			courseId: cohortId,
			batch: selectedCohort ? selectedCohort.batch : "",
			year: selectedCohort ? selectedCohort.year : "",
		}));
	};

	const canPostFacultyOnly = userRole?.toLowerCase() === "hod";
	const showBatchField = !formData.faculty_only;

	/**
	 * Extract unique batches and years from the cohorts array for the dropdown
	 */
	const uniqueGroups = Array.from(
		new Map(
			cohorts
				.filter((c) => c.batch && c.year)
				.map((c) => [
					`${c.batch}-${c.year}`,
					{ batch: c.batch, year: c.year },
				]),
		).values(),
	);

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				{/* Header Section */}
				<header className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30">
							<Megaphone className="size-5" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							{formData.level === "course"
								? "Course Bulletin"
								: "Dept. Bulletin"}
						</h2>
					</div>

					<div className="flex items-center gap-2">
						<button
							type="button"
							title="Pin Bulletin"
							onClick={() =>
								handleChange("is_pinned", !formData.is_pinned)
							}
							className={`p-2 rounded-lg transition-colors ${
								formData.is_pinned
									? "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20"
									: "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
							}`}
						>
							<Pin className="size-5" />
						</button>

						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
						>
							<X className="size-5 text-gray-500" />
						</button>
					</div>
				</header>

				<div className="p-6 overflow-y-auto">
					<form
						id="announcement-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						{/* Faculty Visibility Toggle */}
						{canPostFacultyOnly && (
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-amber-500 shadow-sm">
										<Lock className="size-4" />
									</div>
									<div>
										<p className="text-sm font-bold text-gray-900 dark:text-white">
											Faculty Only
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											Restrict to staff members
										</p>
									</div>
								</div>
								<button
									type="button"
									onClick={() =>
										handleChange(
											"faculty_only",
											!formData.faculty_only,
										)
									}
									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
										formData.faculty_only
											? "bg-amber-500"
											: "bg-gray-200 dark:bg-gray-700"
									}`}
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
											formData.faculty_only
												? "translate-x-6"
												: "translate-x-1"
										}`}
									/>
								</button>
							</div>
						)}
						{/* Organizational Level Selection */}
						{userRole === "hod" && (
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
									<Globe className="size-3" /> Level
								</label>
								<div className="grid grid-cols-2 gap-2">
									{["department", "course"].map((lvl) => (
										<button
											key={lvl}
											type="button"
											onClick={() => {
												handleChange("level", lvl);
												handleChange("courseId", "");
												handleChange("batch", "");
												handleChange("year", "");
											}}
											className={`py-2 px-4 rounded-xl border text-sm font-bold capitalize transition-all ${
												formData.level === lvl
													? "bg-cyan-600 border-cyan-600 text-white shadow-md"
													: "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500"
											}`}
										>
											{lvl}
										</button>
									))}
								</div>
							</div>
						)}
						{/* Title Field */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<FileText className="size-3" /> Title{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								required
								className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
								placeholder="Headline of the announcement..."
								value={formData.title}
								onChange={(e) =>
									handleChange("title", e.target.value)
								}
							/>
						</div>
						{/* Dynamic Batch Selection */}
						{showBatchField && (
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
									<Users className="size-3" /> Target Batch
								</label>
								<div className="relative group">
									<select
										className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none appearance-none"
										// Check if both are "all" to highlight the default option
										value={
											formData.batch === "all" &&
											formData.year === "all"
												? "all"
												: `${formData.batch}-${formData.year}`
										}
										onChange={(e) => {
											const val = e.target.value;
											if (val === "all") {
												handleChange("batch", "all");
												handleChange("year", "all");
											} else {
												const [batch, year] =
													val.split("-");
												handleChange("batch", batch);
												handleChange("year", year);
											}
										}}
									>
										<option value="all">
											All Batches
										</option>

										{uniqueGroups.map((group) => (
											<option
												key={`${group.batch}-${group.year}`}
												value={`${group.batch}-${group.year}`}
											>
												{group.batch} Batch (
												{group.year} Year)
											</option>
										))}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
								</div>
							</div>
						)}
						{/* Audience and Priority Configuration */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
									<Layers className="size-3" /> Audience{" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="relative group">
									<select
										className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none appearance-none disabled:opacity-50"
										value={
											formData.level === "course"
												? formData.courseId
												: "dept"
										}
										onChange={(e) =>
											handleCohortChange(e.target.value)
										}
										required
										disabled={formData.level !== "course"}
									>
										{formData.level === "course" ? (
											<>
												<option value="">
													Select Course
												</option>
												{cohorts.map((c) => (
													<option
														key={c.id || c._id}
														value={c.id || c._id}
													>
														{c.cohort_name ||
															c.name}
													</option>
												))}
											</>
										) : (
											<option value="dept">
												Entire Department
											</option>
										)}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
								</div>
							</div>

							<div className="space-y-2">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
									<AlertCircle className="size-3" /> Priority{" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="relative group">
									<select
										className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none appearance-none"
										value={formData.priority}
										onChange={(e) =>
											handleChange(
												"priority",
												e.target.value,
											)
										}
										required
									>
										<option value="Normal">Normal</option>
										<option value="High">High</option>
										<option value="Urgent">Urgent</option>
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
								</div>
							</div>
						</div>
						{/* Announcement Body */}
						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Message <span className="text-red-500">*</span>
							</label>
							<textarea
								required
								rows="4"
								className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
								placeholder="What are the details?"
								value={formData.content}
								onChange={(e) =>
									handleChange("content", e.target.value)
								}
							/>
						</div>
						{/* File Upload Section */}
						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Attachments
							</label>
							<button
								type="button"
								onClick={() => fileInputRef.current.click()}
								className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl transition-all ${
									formData.attachment
										? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
										: "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800/50"
								}`}
							>
								{formData.attachment ? (
									<CheckCircle className="w-5 h-5" />
								) : (
									<Upload className="w-5 h-5" />
								)}
								<span className="font-semibold">
									{formData.attachment
										? formData.attachment.name
										: "Upload a file"}
								</span>
							</button>
							<input
								type="file"
								ref={fileInputRef}
								className="hidden"
								onChange={(e) =>
									handleChange(
										"attachment",
										e.target.files[0],
									)
								}
							/>
						</div>
					</form>
				</div>

				{/* Footer Controls */}
				<footer className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-[#1a1d26]/50">
					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="flex-1 h-12 font-bold bg-white dark:bg-[#1a1d26] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						form="announcement-form"
						disabled={isSubmitting}
						className="flex-1 h-12 font-bold text-white bg-cyan-600 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-cyan-700 transition-all active:scale-[0.98] disabled:opacity-70"
					>
						{isSubmitting ? (
							<Loader2 className="animate-spin size-5" />
						) : (
							"Post Now"
						)}
					</button>
				</footer>
			</div>
		</div>
	);
};

export default memo(BulletinModal);
