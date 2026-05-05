// src/pages/Research/components/ApplicationModal.jsx

import React, { useState } from "react";
import {
	X,
	FileText,
	GraduationCap,
	Microscope,
	Briefcase,
	ChevronDown,
} from "lucide-react";

/**
 * Modal for submitting research applications or publications.
 * Includes a mandatory role selection field.
 */
const ApplicationModal = ({ isOpen, onClose, type, data, onSubmit }) => {
	const [formData, setFormData] = useState({
		roleId: "",
		justification: "",
		appliedDate: new Date().toISOString(),
	});

	const [errors, setErrors] = useState({});

	if (!isOpen) return null;

	const validate = () => {
		const newErrors = {};
		
		// Mandatory role selection for both Projects and Publications
		if (!formData.roleName) {
			newErrors.roleName = "Please select a role to apply for.";
		}
		if (formData.justification.length < 50) {
			newErrors.justification =
				"Please provide a bit more detail (min 50 characters).";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validate()) return;

		onSubmit({ ...formData, appliedDate: new Date().toISOString() });
		setFormData({ roleName: "", justification: "" });
		onClose();
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				{/* Modal Header */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
							{type === "Project" ? (
								<Microscope className="size-5" />
							) : (
								<GraduationCap className="size-5" />
							)}
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Join{" "}
							{type === "Project" ? "Project" : "Publication"}{" "}
							Team
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
						id="research-application-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						{/* Mandatory Role Selection Field */}
						<div>
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
								<Briefcase className="size-3" />
								Select Role <span className="text-red-500">*</span>
							</label>
							
							<div className="relative group">
								<select
									className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border ${errors.roleId ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none`}
									value={formData.roleName}
									onChange={(e) =>
										setFormData({
											...formData,
											roleName: e.target.value,
										})
									}
									required
								>
									<option value="">Choose a role...</option>
									{data?.openRoles?.map((role) => (
										<option key={role.id} value={role.id}>
											{role.roleName}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
							</div>
							{errors.roleName && (
								<p className="mt-1 text-xs text-red-500">
									{errors.roleName}
								</p>
							)}
						</div>

						{/* Application details section */}
						<div>
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
								<FileText className="size-3" />
								Statement of Interest (min 50 characters){" "}
								<span className="text-red-500">*</span>
							</label>
							<textarea
								className={`w-full min-h-[120px] px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${errors.justification ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none`}
								value={formData.justification}
								onChange={(e) =>
									setFormData({
										...formData,
										justification: e.target.value,
									})
								}
								placeholder="Describe your relevant experience and why you're a good fit for this role (min 50 characters)..."
								required
							/>
							{errors.justification && (
								<p className="mt-1 text-xs text-red-500">
									{errors.justification}
								</p>
							)}
						</div>
					</form>
				</div>
                {/* Modal footer actions */}
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
						form="research-application-form"
						className="flex-1 h-12 font-bold text-white bg-emerald-700 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-[0.98]"
					>
						Submit Application
					</button>
				</div>
			</div>
		</div>
	);
};

export default ApplicationModal;