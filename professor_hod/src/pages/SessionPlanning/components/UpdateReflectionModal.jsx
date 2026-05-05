// src/pages/SessionPlanning/components/UpdateReflectionModal.jsx

import React, { useState } from "react";
import {
	X,
	Save,
	CheckCircle,
	BookOpen,
	MessageSquare,
	ClipboardCheck,
	Info,
} from "lucide-react";

/**
 * Modal component for updating class reflections.
 */
const UpdateReflectionModal = ({ cls, onBack, onSave }) => {
	const [form, setForm] = useState({
		whatWasTaught: "",
		needsImprovement: "",
		topicsCarriedForward: "",
		personalNotes: "",
		visibleToHOD: false,
	});
	const [saved, setSaved] = useState(false);
	const [touched, setTouched] = useState(false);

	const update = (field, value) =>
		setForm((prev) => ({ ...prev, [field]: value }));

	const handleSave = () => {
		if (!form.whatWasTaught.trim()) {
			setTouched(true);
			return;
		}
		onSave({ ...form, classId: cls?.id, date: new Date().toISOString() });
		setSaved(true);
		setTimeout(() => {
			setSaved(false);
			onBack();
		}, 1500);
	};

	const optionalFields = [
		{ key: "needsImprovement", label: "Needs Improvement", icon: Info },
		{
			key: "topicsCarriedForward",
			label: "Topics Carried Forward",
			icon: BookOpen,
		},
		{ key: "personalNotes", label: "Personal Notes", icon: MessageSquare },
	];

	const showError = touched && !form.whatWasTaught.trim();

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
			<div
				className="bg-white dark:bg-[#1a1d26] w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Modal Header */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
							<ClipboardCheck className="w-5 h-5 text-indigo-600" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white">
								Update Reflection
							</h2>
							{cls && (
								<p className="text-xs font-medium text-gray-500 dark:text-gray-400">
									{cls.courseName} • {cls.batchSection} (Sem{" "}
									{cls.semester})
								</p>
							)}
						</div>
					</div>
					<button
						onClick={onBack}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				{/* Modal Body */}
				<div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
					{/* Mandatory field section */}
					<div className="space-y-2">
						<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
							What was taught{" "}
							<span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={form.whatWasTaught}
							onChange={(e) => {
								update("whatWasTaught", e.target.value);
								setTouched(false);
							}}
							placeholder="e.g. Introduction to recursion"
							className={`w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border rounded-xl text-gray-900 dark:text-white text-sm outline-none transition-all focus:ring-2 ${
								showError
									? "border-red-400 focus:ring-red-400"
									: "border-gray-200 dark:border-gray-700 focus:ring-indigo-500"
							}`}
						/>
					</div>

					{/* Optional fields section */}
					{optionalFields.map(({ key, label, icon: Icon }) => (
						<div key={key} className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<Icon className="size-3" /> {label}
								<span className="text-[10px] font-normal lowercase italic text-gray-400">
									(Optional)
								</span>
							</label>
							<input
								type="text"
								value={form[key]}
								onChange={(e) => update(key, e.target.value)}
								className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
							/>
						</div>
					))}

					<div className="flex items-center gap-3 pt-2">
						<input
							type="checkbox"
							id="visibleToHOD"
							checked={form.visibleToHOD}
							onChange={(e) =>
								update("visibleToHOD", e.target.checked)
							}
							className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label
							htmlFor="visibleToHOD"
							className="text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Visible to HOD
						</label>
					</div>
				</div>

				{/* Modal Footer */}
				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-[#1a1d26]/50">
					<button
						onClick={onBack}
						className="flex-1 h-12 font-bold bg-white dark:bg-[#1a1d26] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={saved}
						className="flex-1 h-12 flex items-center justify-center gap-2 font-bold text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:bg-emerald-500"
					>
						{saved ? (
							<>
								<CheckCircle className="w-5 h-5" />
								Saved!
							</>
						) : (
							<>
								<Save className="w-5 h-5" />
								Save Reflection
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default UpdateReflectionModal;
