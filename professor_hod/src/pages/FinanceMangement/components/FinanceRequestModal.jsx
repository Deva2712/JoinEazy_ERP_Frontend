// src/pages/FinanceManagement/components/FinanceRequestModal.jsx

import React, { useState, useRef, useEffect } from "react";
import {
	Receipt,
	Wallet,
	X,
	IndianRupee,
	Tag,
	FileText,
	Link,
	MessageSquare,
	AlertCircle,
	Upload,
	CheckCircle,
	ChevronDown,
} from "lucide-react";

/**
 * FinanceRequestModal Component
 * Handles creation and editing of finance records.
 * Form overlay for finance claims/requests with dynamic theming and validation.
 */
const FinanceRequestModal = ({
	isOpen,
	type,
	onClose,
	onSubmit,
	initialData,
}) => {
	const fileInputRef = useRef(null);
	const isExpense = type === "Expense";
	const Icon = isExpense ? Receipt : Wallet;

	const initialState = {
		id: initialData?.id || null,
		title: initialData?.title || "",
		amount: initialData
			? isExpense
				? initialData.amount_spent
				: initialData.amount_requested
			: "",
		category:
			initialData?.category || (isExpense ? "Supplies" : "Transport"),
		description: initialData?.description || "",
		proof_doc_link:
			initialData?.proof_doc_link || initialData?.receipt_link || "",
		proof_doc_file: null,
		type: type,
	};

	const [formData, setFormData] = useState(initialState);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (isOpen) {
			setFormData(initialState);
			setErrors({});
		}
	}, [isOpen, initialData, type]);

	/**
	 * Validates form inputs before submission.
	 * Checks for required attachments on expenses and positive amounts.
	 */
	const validate = () => {
		const newErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Title is required.";
		}

		if (!formData.amount || parseFloat(formData.amount) <= 0) {
			newErrors.amount = "Please enter a valid amount.";
		}

		if (isExpense && !formData.proof_doc_link && !formData.proof_doc_file) {
			newErrors.attachment = "Proof of expense is required.";
		}

		if (formData.description.length < 10) {
			newErrors.description =
				"Please provide more detail (min 10 characters).";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: files ? files[0] : value,
		}));

		if (errors[name] || errors.attachment) {
			setErrors((prev) => ({ ...prev, [name]: null, attachment: null }));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validate()) return;

		onSubmit(formData);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">
				{/* Modal Header */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div
							className={`p-2 rounded-lg ${isExpense ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500"}`}
						>
							<Icon className="size-5" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							{formData.id ? "Edit" : "New"} {type}{" "}
							{isExpense ? "Claim" : "Request"}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				{/* Form Body */}
				<div className="p-6 overflow-y-auto">
					<form
						id="finance-request-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						{formData.id && (
							<div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl">
								<AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
								<p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
									Please address the admin's comments before
									resubmitting your application.
								</p>
							</div>
						)}

						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Title / Purpose{" "}
								<span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
								<input
									name="title"
									required
									value={formData.title}
									placeholder={
										isExpense
											? "e.g., Client Lunch"
											: "e.g., Office Supplies Fund"
									}
									className={`w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-800/50 border ${errors.title ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
									Amount (INR){" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										name="amount"
										type="number"
										required
										step="0.01"
										value={formData.amount}
										placeholder="0.00"
										className={`w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-800/50 border ${errors.amount ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
									Category{" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="relative group">
									<Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<select
										name="category"
										value={formData.category}
										className="w-full h-11 pl-11 pr-11 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all truncate appearance-none"
										onChange={handleChange}
									>
										{isExpense ? (
											<>
												<option>Supplies</option>
												<option>Maintenance</option>
												<option>
													Professional Development
												</option>
												<option>Travel</option>
												<option>Other</option>
											</>
										) : (
											<>
												<option>Transport</option>
												<option>Academic</option>
												<option>IT Services</option>
												<option>Event</option>
												<option>Other</option>
											</>
										)}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Receipt / Proof{" "}
								{isExpense && (
									<span className="text-red-500">*</span>
								)}
							</label>
							<div className="space-y-3">
								<div className="relative">
									<Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										name="proof_doc_link"
										type="url"
										placeholder="https://link-to-receipt.com"
										className={`w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-800/50 border ${errors.attachment ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
										value={formData.proof_doc_link}
										onChange={handleChange}
									/>
								</div>
								<button
									type="button"
									onClick={() => fileInputRef.current.click()}
									className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl transition-all ${
										formData.proof_doc_file
											? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
											: errors.attachment
												? "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/10"
												: "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800/50"
									}`}
								>
									{formData.proof_doc_file ? (
										<CheckCircle className="size-5" />
									) : (
										<Upload className="size-5" />
									)}
									<span className="font-bold text-sm">
										{formData.proof_doc_file
											? formData.proof_doc_file.name
											: "Upload PDF/Image"}
									</span>
								</button>
								<input
									name="proof_doc_file"
									type="file"
									ref={fileInputRef}
									className="hidden"
									accept="image/*,application/pdf"
									onChange={handleChange}
								/>
								{errors.attachment && (
									<p className="text-xs text-red-500 mt-1">
										{errors.attachment}
									</p>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<MessageSquare className="size-3" />{" "}
								Justification{" "}
								<span className="text-red-500">*</span>
							</label>
							<textarea
								name="description"
								required
								value={formData.description}
								placeholder="Explain why this fund is required..."
								className={`w-full min-h-[100px] px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${errors.description ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none`}
								onChange={handleChange}
							/>
							{errors.description && (
								<p className="text-xs text-red-500 mt-1">
									{errors.description}
								</p>
							)}
						</div>
					</form>
				</div>

				{/* Action Footer */}
				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-[#1a1d26]/50">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 h-12 font-bold bg-white dark:bg-[#1a1d26] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						form="finance-request-form"
						className="flex-1 h-12 font-bold text-white rounded-xl shadow-lg transition-all active:scale-[0.98] bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
					>
						{formData.id ? "Update Request" : "Submit Request"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default FinanceRequestModal;
