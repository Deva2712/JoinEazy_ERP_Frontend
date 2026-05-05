// src/pages/Cohort/CohortMembers/GradeVisibilityModal.jsx

import React, { useState, useEffect } from "react";
import { X, Calendar, Eye, CheckSquare, Square, Loader2 } from "lucide-react";

const GradeVisibilityModal = ({
	isOpen,
	onClose,
	assignments,
	onUpdateVisibility,
}) => {
	const [selectedIds, setSelectedIds] = useState([]);
	const [expiryDate, setExpiryDate] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Initialize state based on current assignment visibility when modal opens
	useEffect(() => {
		if (isOpen) {
			const visibleIds = assignments
				.filter((asm) => asm.isVisible)
				.map((asm) => asm.id);
			setSelectedIds(visibleIds);

			// Default expiry to 7 days from now
			const defaultDate = new Date();
			defaultDate.setDate(defaultDate.getDate() + 7);
			setExpiryDate(defaultDate.toISOString().split("T")[0]);
		}
	}, [isOpen, assignments]);

	if (!isOpen) return null;

	const toggleAssignment = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		const today = new Date();
		const selectedDate = new Date(expiryDate);
		const diffTime = Math.abs(selectedDate - today);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		const visibilityPayload = assignments.map((asm) => ({
			assignmentId: asm.id,
			isVisible: selectedIds.includes(asm.id),
			durationDays: selectedIds.includes(asm.id) ? diffDays : 0,
		}));

		await onUpdateVisibility(visibilityPayload);

		setIsSubmitting(false);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				{/* Modal Header */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
							<Eye className="size-5" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Grade Visibility
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
						id="grade-visibility-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Visible Assignments
							</label>
							<p className="text-xs text-gray-500 mb-2">
								Checked assignments will be visible to students.
							</p>
							<div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl p-2 space-y-1 bg-gray-50 dark:bg-gray-800/50">
								{assignments.map((asm) => (
									<div
										key={asm.id}
										onClick={() => toggleAssignment(asm.id)}
										className="flex items-center gap-3 p-3 hover:bg-white dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors group"
									>
										{selectedIds.includes(asm.id) ? (
											<CheckSquare
												size={20}
												className="text-blue-600"
											/>
										) : (
											<Square
												size={20}
												className="text-gray-400 group-hover:text-gray-500"
											/>
										)}
										<span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
											{asm.title || asm.name}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Duration applied to all selected visible assignments */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<Calendar className="size-3" /> Visibility
								Expiry Date
								<span className="text-red-500">*</span>
							</label>
							<input
								type="date"
								min={new Date().toISOString().split("T")[0]}
								value={expiryDate}
								onChange={(e) => setExpiryDate(e.target.value)}
								required
								className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							/>
							<p className="mt-1 text-xs text-gray-500 italic">
								Grades hide automatically after this date.
							</p>
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
						form="grade-visibility-form"
						disabled={isSubmitting}
						className="flex-1 h-12 font-bold text-white bg-blue-600 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
					>
						{isSubmitting ? (
							<Loader2 className="size-5 animate-spin" />
						) : (
							"Save Visibility"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default GradeVisibilityModal;
