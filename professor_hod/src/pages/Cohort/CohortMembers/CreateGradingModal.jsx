// src/pages/Cohort/CohortMembers/CreateGradingModal.jsx

import React, { useState } from "react";
import { X, Loader2, ClipboardCheck, AlignLeft, Target, Pen, Clipboard } from "lucide-react";
import { courseService } from "../../../api/services/course.service";

const CreateGradingModal = ({
	isOpen,
	onClose,
	cohortId,
	onSuccess,
	members,
}) => {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		marks: 100,
	});
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await courseService.createAssignment(cohortId, {
				name: formData.name,
				description: formData.description,
				marks: Number(formData.marks),
				type: "individual",
			});

			if (response.success) {
				const newAssignment = response.data;
				if (newAssignment && newAssignment.id) {
					const storageKey = `grades_${cohortId}`;
					const storedGrades = JSON.parse(
						localStorage.getItem(storageKey) || "{}",
					);

					if (Array.isArray(members)) {
						members.forEach((member) => {
							if (
								member.type === "individual" &&
								member.realUserId
							) {
								const gradeKey = `${member.realUserId}_${newAssignment.id}`;
								storedGrades[gradeKey] = {
									...storedGrades[gradeKey],
									isSubmitted: true,
									submittedAt: new Date().toISOString(),
								};
							}
						});
						localStorage.setItem(
							storageKey,
							JSON.stringify(storedGrades),
						);
					}
				}

				onSuccess();
				onClose();
			} else {
				alert(response.message || "Failed to create grading");
			}
		} catch (error) {
			console.error("Error creating grading:", error);
			alert("An error occurred while creating the grading.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				{/* Modal Header */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
							<ClipboardCheck className="size-5" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Create New Grading
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				{/* Modal Body */}
				<div className="p-6 overflow-y-auto">
					<form
						id="create-grading-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						{/* Name Input */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<Clipboard className="size-3" />
								Name
								<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								required
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
								placeholder="e.g., Midterm Project"
								className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							/>
						</div>

						{/* Max Marks Input */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<Pen className="size-3" /> Maximum Marks
								<span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								required
								min="1"
								value={formData.marks}
								onChange={(e) =>
									setFormData({
										...formData,
										marks: e.target.value,
									})
								}
								className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							/>
						</div>

						{/* Description Input */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<AlignLeft className="size-3" /> Description
								(Optional)
							</label>
							<textarea
								rows="4"
								value={formData.description}
								onChange={(e) =>
									setFormData({
										...formData,
										description: e.target.value,
									})
								}
								placeholder="Describe the grading criteria..."
								className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
							/>
						</div>
					</form>
				</div>

				{/* Modal Footer */}
				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-gray-800/50">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 h-12 font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						form="create-grading-form"
						disabled={loading}
						className="flex-1 h-12 font-bold text-white bg-blue-600 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
					>
						{loading ? (
							<Loader2 className="size-5 animate-spin" />
						) : (
							"Create Grading"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateGradingModal;
