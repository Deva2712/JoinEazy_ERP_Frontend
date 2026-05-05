// src/pages/DocumentRequest/components/LetterUploadModal.jsx

import React, { useState, useRef, useEffect } from "react";
import {
	X,
	Upload,
	MessageSquare,
	FileText,
	CheckCircle,
	AlertCircle,
	UserCheck,
	Info,
	Files,
	Trash2,
	ChevronDown,
} from "lucide-react";

/**
 * Modal component for uploading signed documents and supporting materials
 * to initiate the official university processing workflow.
 */
const LetterUploadModal = ({
	isOpen,
	onClose,
	onSubmit,
	activeRequests = [],
}) => {
	const fileInputRef = useRef(null);
	const supportFilesRef = useRef(null);

	const initialState = {
		selectedRequestId: "",
		signedDocument: null,
		supportingDocs: [],
		registrarNote: "",
	};

	const [formData, setFormData] = useState(initialState);
	const [fileName, setFileName] = useState("");
	const [errors, setErrors] = useState({});

	/**
	 * Filters requests to ensure only those currently "Under Review" are eligible
	 * for submission to the official processing queue.
	 */
	const eligibleRequests = activeRequests.filter(
		(req) => req.status === "Under Review",
	);

	useEffect(() => {
		if (isOpen) {
			setFormData(initialState);
			setFileName("");
			setErrors({});
		}
	}, [isOpen]);

	const validate = () => {
		const newErrors = {};
		if (!formData.selectedRequestId)
			newErrors.student = "Please select a student.";
		if (!formData.signedDocument)
			newErrors.file = "LOR document is required.";
		if (formData.registrarNote.trim().length < 5)
			newErrors.note = "Please provide a brief note for the registrar.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData({ ...formData, signedDocument: file });
			setFileName(file.name);
			setErrors((prev) => ({ ...prev, file: null }));
		}
	};

	const handleSupportingFilesChange = (e) => {
		const files = Array.from(e.target.files);
		setFormData((prev) => ({
			...prev,
			supportingDocs: [...prev.supportingDocs, ...files],
		}));
	};

	const removeSupportingDoc = (index) => {
		setFormData((prev) => ({
			...prev,
			supportingDocs: prev.supportingDocs.filter((_, i) => i !== index),
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validate()) return;

		const selectedRequest = activeRequests.find(
			(r) => r.id === formData.selectedRequestId,
		);

		onSubmit({
			signedDocument: formData.signedDocument,
			supportingDocs: formData.supportingDocs,
			registrarNote: formData.registrarNote,
			studentInfo: {
				requestId: selectedRequest.id,
				student: selectedRequest.student,
				applicationPurpose: selectedRequest.application.purpose,
				requestDate: selectedRequest.requestDate,
			},
		});
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">
				{/* Modal Header */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30">
							<FileText className="size-5" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Submit LOR for Processing
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				<div className="px-6 pt-5">
					<div className="flex gap-3.5 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
						<Info className="size-5 text-fuchsia-600 dark:text-fuchsia-400 mt-0.5 shrink-0" />
						<div className="space-y-1">
							<p className="text-sm font-bold text-gray-900 dark:text-white">
								What happens now?
							</p>
							<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
								Upon submission, the request moves to the{" "}
								<span className="font-semibold text-fuchsia-700 dark:text-fuchsia-300">
									Processing Queue
								</span>{" "}
								for registrar verification.
							</p>
						</div>
					</div>
				</div>

				<div className="p-6 overflow-y-auto flex-grow">
					{eligibleRequests.length === 0 ? (
						<div className="py-10 text-center flex flex-col items-center">
							<AlertCircle className="size-12 text-amber-500 mb-4" />
							<p className="text-gray-900 dark:text-white font-bold">
								No Students Under Review
							</p>
						</div>
					) : (
						<form
							id="upload-form"
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							{/* Form Field: Student Selection */}
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
									<UserCheck className="size-3" /> Student
									(Under Review){" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="relative group">
									<select
										value={formData.selectedRequestId}
										onChange={(e) =>
											setFormData({
												...formData,
												selectedRequestId:
													e.target.value,
											})
										}
										className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${errors.student ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all appearance-none`}
									>
										<option value="">
											Select Student...
										</option>
										{eligibleRequests.map((req) => (
											<option key={req.id} value={req.id}>
												{req.student.name} (
												{req.student.rollNumber})
											</option>
										))}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
								</div>
								{errors.student && (
									<p className="text-xs text-red-500 mt-1">
										{errors.student}
									</p>
								)}
							</div>

							{/* Form Field: Primary LOR Upload */}
							<div className="space-y-2">
								<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
									Signed Document{" "}
									<span className="text-red-500">*</span>
								</label>
								<button
									type="button"
									onClick={() => fileInputRef.current.click()}
									className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl transition-all ${formData.signedDocument ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20" : "border-gray-200 dark:border-gray-700 text-gray-500 bg-gray-50 dark:bg-gray-800/50"}`}
								>
									{formData.signedDocument ? (
										<CheckCircle className="size-5" />
									) : (
										<Upload className="size-5" />
									)}
									<span className="font-bold text-sm">
										{fileName || "Select Primary LOR"}
									</span>
								</button>
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleFileChange}
									className="hidden"
									accept=".pdf,.docx"
								/>
								{errors.file && (
									<p className="text-xs text-red-500 mt-1">
										{errors.file}
									</p>
								)}
							</div>

							{/* Form Field: Supporting Documents */}
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
									<Files className="size-3" /> Supporting
									Documents
								</label>
								<button
									type="button"
									onClick={() =>
										supportFilesRef.current.click()
									}
									className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
								>
									<Upload className="size-5" />
									<span className="font-bold text-sm">
										Add Attachments
									</span>
								</button>
								<input
									type="file"
									ref={supportFilesRef}
									onChange={handleSupportingFilesChange}
									className="hidden"
									multiple
									accept=".pdf,.docx,.png,.jpg"
								/>

								{formData.supportingDocs.length > 0 && (
									<div className="mt-3 space-y-2">
										{formData.supportingDocs.map(
											(file, idx) => (
												<div
													key={idx}
													className="flex items-center justify-between p-2 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg"
												>
													<span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[80%]">
														{file.name}
													</span>
													<button
														type="button"
														onClick={() =>
															removeSupportingDoc(
																idx,
															)
														}
														className="text-red-500 hover:text-red-600 p-1"
													>
														<Trash2 className="size-4" />
													</button>
												</div>
											),
										)}
									</div>
								)}
							</div>

							{/* Form Field: Administrative Instructions */}
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
									<MessageSquare className="size-3" /> Note to
									the Registrar{" "}
									<span className="text-red-500">*</span>
								</label>
								<textarea
									required
									value={formData.registrarNote}
									onChange={(e) =>
										setFormData({
											...formData,
											registrarNote: e.target.value,
										})
									}
									rows="3"
									placeholder="Instructions for the registrar..."
									className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all resize-none"
								/>
								{errors.note && (
									<p className="text-xs text-red-500 mt-1">
										{errors.note}
									</p>
								)}
							</div>
						</form>
					)}
				</div>

				{/* Modal Actions */}
				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-[#1a1d26]/50">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 h-12 font-bold bg-white dark:bg-[#1a1d26] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl"
					>
						Cancel
					</button>
					{eligibleRequests.length > 0 && (
						<button
							type="submit"
							form="upload-form"
							className="flex-1 h-12 font-bold text-white rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 transition-all"
						>
							Confirm Submission
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default LetterUploadModal;
