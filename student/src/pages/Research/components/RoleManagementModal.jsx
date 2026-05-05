// src/pages/Research/components/RoleManagementModal.jsx

import React, { useState, useEffect } from "react";
import { X, Briefcase, AlignLeft, Pencil, Plus } from "lucide-react";

/**
 * Modal for creating and editing research roles.
 * This component is used by ProjectDetailsView and PublicationDetailsView
 * to manage specific openings within a research item.
 */
const RoleManagementModal = ({
	isOpen,
	onClose,
	onSubmit,
	initialData = null,
}) => {
	const [formData, setFormData] = useState({
		roleName: "",
		description: "",
	});

	useEffect(() => {
		if (initialData) {
			setFormData({
				roleName: initialData.roleName || "",
				description: initialData.description || "",
			});
		} else {
			setFormData({ roleName: "", description: "" });
		}
	}, [initialData, isOpen]);

	if (!isOpen) return null;

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
							{initialData ? (
								<Pencil className="size-5" />
							) : (
								<Plus className="size-5" />
							)}
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							{initialData ? "Edit Role" : "Add New Role"}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				<div className="p-6 overflow-y-auto">
					<form
						id="role-management-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						<div>
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
								<Briefcase className="size-3" /> Role Title{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								required
								placeholder="e.g. Lead Frontend Developer"
								className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
								value={formData.roleName}
								onChange={(e) =>
									setFormData({
										...formData,
										roleName: e.target.value,
									})
								}
							/>
						</div>

						<div>
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
								<AlignLeft className="size-3" />{" "}
								Responsibilities & Requirements{" "}
								<span className="text-red-500">*</span>
							</label>
							<textarea
								rows={4}
								required
								placeholder="Describe what the student will be doing and required skills..."
								className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
								value={formData.description}
								onChange={(e) =>
									setFormData({
										...formData,
										description: e.target.value,
									})
								}
							/>
						</div>
					</form>
				</div>

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
						form="role-management-form"
						className="flex-1 h-12 font-bold text-white bg-emerald-700 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-[0.98]"
					>
						{initialData ? "Save Changes" : "Create Role"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default RoleManagementModal;
