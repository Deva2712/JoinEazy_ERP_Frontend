// src/pages/Research/components/GrantRequestModal.jsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
	X,
	Wallet,
	MessageSquare,
	AlertCircle,
	FileText,
	DollarSign,
	ChevronDown,
	Target,
	BookOpen,
	Microscope,
	Upload,
	CheckCircle,
	Link,
	IndianRupee,
} from "lucide-react";

const GrantRequestModal = ({
	isOpen,
	onClose,
	initialData = null,
	onSubmit,
	collections,
}) => {
	const fileInputRef = useRef(null);
	const initialState = {
		id: initialData?.id || null,
		requestId: initialData?.requestId || "",
		targetId: initialData?.targetId || "",
		targetType: initialData?.targetType || "Project",
		title: initialData?.title || "",
		amount: initialData?.amount || "",
		reason: initialData?.reason || "",
		status: initialData?.status || "Pending",
		proof_doc_link: initialData?.proof_doc_link || "",
		supportingDocs: null,
	};

	const [formData, setFormData] = useState(initialState);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (isOpen) {
			setFormData(initialState);
			setErrors({});
		}
	}, [isOpen, initialData]);

	const ownedResearchOptions = useMemo(() => {
		const projects = (collections?.raw?.myProjects || []).filter(
			(p) => p.isOwner === true,
		);
		const publications = (collections?.raw?.myPublications || []).filter(
			(p) => p.isOwner === true,
		);

		return {
			Project: projects,
			Publication: publications,
		};
	}, [collections]);

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

	const validate = () => {
		const newErrors = {};
		if (!formData.title.trim()) newErrors.title = "Grant title is required";
		if (!formData.targetId)
			newErrors.targetId = "Please select a research target";
		if (!formData.amount || formData.amount <= 0)
			newErrors.amount = "Valid amount is required";
		if (!formData.supportingDocs && !formData.proof_doc_link) {
			newErrors.supportingDocs = "Supporting documentation is required";
		}
		if (!formData.reason.trim() || formData.reason.length < 20) {
			newErrors.reason =
				"Please provide a detailed justification (min 20 chars)";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			const submissionData = {
				...formData,
				date: new Date().toISOString().split("T")[0],
			};

			if (initialData?.status === "Rejected") {
				submissionData.status = "Resubmitted";
				submissionData.resubmitted = true;
			}

			onSubmit(submissionData);
		}
	};

	if (!isOpen) return null;

	const targetOptions = ownedResearchOptions[formData.targetType] || [];

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">
				{/* Modal Header */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500">
							<Wallet className="size-5" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							{initialData
								? "Edit Application"
								: "New Grant Application"}
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
						id="grant-form"
						onSubmit={handleFormSubmit}
						className="space-y-6"
					>
						{initialData && (
							<div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl">
								<AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
								<p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
									Please address any previous feedback and
									ensure details are updated before
									resubmitting.
								</p>
							</div>
						)}

						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								<FileText className="inline size-3 mr-1" />{" "}
								Grant Application Title{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="title"
								value={formData.title}
								onChange={handleChange}
								placeholder="e.g., Clinical Trial Phase II Funding"
								className={`w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border ${errors.title ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
							/>
						</div>

						{/* Research Work Level Selection */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<Target className="size-3" /> Research Work Type{" "}
								<span className="text-red-500">*</span>
							</label>
							<div className="grid grid-cols-2 gap-2">
								{["Project", "Publication"].map((type) => (
									<button
										key={type}
										type="button"
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												targetType: type,
												targetId: "",
											}))
										}
										className={`py-2 px-4 rounded-xl border text-sm font-bold capitalize transition-all flex items-center justify-center gap-2 ${
											formData.targetType === type
												? "bg-emerald-600 border-emerald-600 text-white shadow-md"
												: "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500"
										}`}
									>
										{type === "Project" ? (
											<Microscope className="size-3.5" />
										) : (
											<BookOpen className="size-3.5" />
										)}
										{type}
									</button>
								))}
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Select Specific {formData.targetType}{" "}
								<span className="text-red-500">*</span>
							</label>
							<div className="relative group">
								<select
									name="targetId"
									value={formData.targetId}
									onChange={handleChange}
									className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border ${errors.targetId ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm appearance-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
								>
									<option value="">
										Select {formData.targetType}
									</option>
									{targetOptions.map((item) => (
										<option key={item.id} value={item.id}>
											{item.title}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Amount Requested (₹){" "}
								<span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
								<input
									type="number"
									name="amount"
									value={formData.amount}
									onChange={handleChange}
									placeholder="0.00"
									className={`w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-800/50 border ${errors.amount ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
								/>
							</div>
						</div>

						{/* File Upload Section */}
						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Supporting Documents{" "}
								<span className="text-red-500">*</span>
							</label>
							<button
								type="button"
								onClick={() => fileInputRef.current.click()}
								className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl transition-all ${
									errors.supportingDocs
										? "border-red-500 bg-red-50/50"
										: formData.supportingDocs
											? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
											: "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800/50"
								}`}
							>
								{formData.supportingDocs ? (
									<CheckCircle className="size-5" />
								) : (
									<Upload className="size-5" />
								)}
								<span className="font-bold text-sm">
									{formData.supportingDocs
										? formData.supportingDocs.name
										: "Upload PDF/Image"}
								</span>
							</button>
							{errors.supportingDocs && (
								<p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
									{errors.supportingDocs}
								</p>
							)}
							<input
								name="supportingDocs"
								type="file"
								ref={fileInputRef}
								className="hidden"
								accept="image/*,application/pdf"
								onChange={handleChange}
							/>
						</div>

						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<MessageSquare className="size-3" />{" "}
								Justification{" "}
								<span className="text-red-500">*</span>
							</label>
							<textarea
								name="reason"
								value={formData.reason}
								onChange={handleChange}
								placeholder="Explain how the funds will be used..."
								className={`w-full min-h-[100px] p-4 bg-gray-50 dark:bg-gray-800/50 border ${errors.reason ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none`}
							/>
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
						form="grant-form"
						className="flex-1 h-12 font-bold text-white bg-emerald-600 rounded-xl shadow-lg hover:bg-emerald-700 transition-all active:scale-[0.98]"
					>
						{initialData?.status === "Rejected"
							? "Resubmit Request"
							: initialData
								? "Update Application"
								: "Submit Request"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default GrantRequestModal;
