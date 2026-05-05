// src/pages/Maintenance/components/MaintenanceRequestModal.jsx

import React, { useState, useEffect } from "react";
import {
	X,
	ChevronDown,
	Wrench,
	MessageSquare,
} from "lucide-react";

export default function MaintenanceRequestModal({
	isOpen,
	onClose,
	formData,
	setFormData,
	defaultForm,
	onSubmit,
	issueTypes = [],
}) {
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (!isOpen) {
			setErrors({});
		}
	}, [isOpen]);

	if (!isOpen) return null;

	/**
	 * Derives component options based on the currently selected issue type.
	 */
	const currentIssueType = issueTypes?.find(
		(t) => t.key === formData.issueType,
	);
	const componentOptions = currentIssueType?.components ?? [];

	/**
	 * Checks if all required fields have non-empty values.
	 */
	const isFormIncomplete =
		!formData.category ||
		!formData.issueType ||
		!formData.component ||
		!formData.location?.trim() ||
		!formData.description?.trim();

	const validate = () => {
		const newErrors = {};
		if (!formData.category) newErrors.category = "Required";
		if (!formData.issueType) newErrors.issueType = "Required";
		if (!formData.component) newErrors.component = "Required";
		if (!formData.location?.trim()) newErrors.location = "Required";
		if (!formData.description?.trim()) newErrors.description = "Required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			onSubmit(e);
		}
	};

	const handleClose = () => {
		onClose();
		setFormData(defaultForm);
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				{/* Header Section */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30">
							<Wrench className="size-5" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							New Maintenance Request
						</h2>
					</div>
					<button
						onClick={handleClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				<div className="p-6 overflow-y-auto">
					<form
						id="maintenance-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						{/* <div
						className={`w-full text-center px-4 py-3 flex items-center justify-center gap-3 rounded-xl text-xs font-bold uppercase tracking-wider border bg-yellow-50 text-yellow-600 border-yellow-200`}
					>
						{formData.category === "university" ? (
										<School className="size-4" />
									) : (
										<Home className="size-4" />
									)}
						{formData?.category}
					</div> */}

						{/* Category Selection */}
						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Category <span className="text-red-500">*</span>
							</label>
							<div className="relative group">
								<select
									value={formData.category}
									onChange={(e) => {
										setFormData({
											...formData,
											category: e.target.value,
										});
										setErrors((prev) => ({
											...prev,
											category: null,
										}));
									}}
									className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border ${errors.category ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition-all appearance-none`}
								>
									<option value="" disabled>
										Select category...
									</option>
									<option value="university">
										University
									</option>
									<option value="accommodation">
										Accommodation
									</option>
								</select>
								<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Issue Type Selection */}
							<div className="space-y-2">
								<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
									Issue Type{" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="relative group">
									<select
										value={formData.issueType}
										onChange={(e) => {
											setFormData((prev) => ({
												...prev,
												issueType: e.target.value,
												component: "",
											}));
											setErrors((prev) => ({
												...prev,
												issueType: null,
											}));
										}}
										className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border ${errors.issueType ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition-all appearance-none`}
									>
										<option value="" disabled>
											Select issue type...
										</option>
										{issueTypes?.map((opt) => (
											<option
												key={opt.key}
												value={opt.key}
											>
												{opt.label}
											</option>
										))}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
								</div>
							</div>

							{/* Component Selection */}
							<div className="space-y-2">
								<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
									Specific Component{" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="relative group">
									<select
										value={formData.component}
										onChange={(e) => {
											setFormData({
												...formData,
												component: e.target.value,
											});
											setErrors((prev) => ({
												...prev,
												component: null,
											}));
										}}
										className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border ${errors.component ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition-all appearance-none`}
									>
										<option value="" disabled>
											Select component...
										</option>
										{componentOptions.map((opt) => (
											<option key={opt} value={opt}>
												{opt}
											</option>
										))}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
								</div>
							</div>
						</div>

						{/* Location Input */}
						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Location / Room{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={formData.location}
								onChange={(e) => {
									setFormData({
										...formData,
										location: e.target.value,
									});
									setErrors((prev) => ({
										...prev,
										location: null,
									}));
								}}
								placeholder="e.g. Room 301"
								className={`w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border ${errors.location ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition-all`}
							/>
						</div>

						{/* Description Textarea */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<MessageSquare className="size-3" /> Description{" "}
								<span className="text-red-500">*</span>
							</label>
							<textarea
								value={formData.description}
								onChange={(e) => {
									setFormData({
										...formData,
										description: e.target.value,
									});
									setErrors((prev) => ({
										...prev,
										description: null,
									}));
								}}
								rows={4}
								placeholder="Describe the issue in detail..."
								className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${errors.description ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-yellow-500 outline-none transition-all`}
							/>
						</div>
					</form>
				</div>

				{/* Footer Actions */}
				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-[#1a1d26]/50">
					<button
						type="button"
						onClick={handleClose}
						className="flex-1 h-12 font-bold bg-white dark:bg-[#1a1d26] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						form="maintenance-form"
						disabled={isFormIncomplete}
						className="flex-1 h-12 font-bold text-white bg-yellow-500 rounded-xl shadow-lg hover:bg-yellow-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-500"
					>
						Submit Request
					</button>
				</div>
			</div>
		</div>
	);
}
