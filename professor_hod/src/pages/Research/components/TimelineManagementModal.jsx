// src/pages/Research/components/TimelineManagementModal.jsx

import React, { useState, useEffect } from "react";
import { X, Calendar, FileText, Clock, Search, Users } from "lucide-react";

/**
 * Modal for creating or editing research project timeline milestones.
 */
const TimelineManagementModal = ({
	isOpen,
	onClose,
	initialData,
	onSubmit,
	availableContributors = [],
}) => {
	const [userSearch, setUserSearch] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [formData, setFormData] = useState({
		date: "",
		description: "",
		contributors: [],
	});

	useEffect(() => {
		if (initialData) {
			setFormData({
				date: initialData.date || "",
				description: initialData.description || "",
				contributors: Array.isArray(initialData.contributors)
					? initialData.contributors
					: [],
			});
		} else {
			setFormData({ date: "", description: "", contributors: [] });
		}
		if (isOpen) {
			setUserSearch("");
			setShowDropdown(false);
		}
	}, [initialData, isOpen]);

	if (!isOpen) return null;

	const toggleContributor = (name) => {
		setFormData((prev) => {
			const isSelected = prev.contributors.includes(name);
			if (isSelected) {
				return {
					...prev,
					contributors: prev.contributors.filter((c) => c !== name),
				};
			} else {
				setUserSearch("");
				setShowDropdown(false);
				return {
					...prev,
					contributors: [...prev.contributors, name],
				};
			}
		});
	};

	const filteredNames = availableContributors.filter(
		(name) =>
			name.toLowerCase().includes(userSearch.toLowerCase()) &&
			!formData.contributors.includes(name),
	);

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
							<Clock className="size-5" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							{initialData ? "Edit Timeline" : "Add Timeline"}
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
						id="timeline-management-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						<div>
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
								<Calendar className="size-3" /> Event Date{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="date"
								required
								className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
								value={formData.date}
								onChange={(e) =>
									setFormData({
										...formData,
										date: e.target.value,
									})
								}
							/>
						</div>

						<div>
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
								<FileText className="size-3" /> Description{" "}
								<span className="text-red-500">*</span>
							</label>
							<textarea
								required
								className="w-full min-h-[100px] px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
								value={formData.description}
								onChange={(e) =>
									setFormData({
										...formData,
										description: e.target.value,
									})
								}
								placeholder="Describe the timeline event..."
							/>
						</div>

						<div>
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
								<Users className="size-3" /> Select Contributors
							</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
								<input
									type="text"
									placeholder="Search contributors by name..."
									value={userSearch}
									onFocus={() => setShowDropdown(true)}
									onChange={(e) => {
										setUserSearch(e.target.value);
										setShowDropdown(true);
									}}
									className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
								/>

								{showDropdown && userSearch.trim() !== "" && (
									<div className="absolute z-20 top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl divide-y divide-gray-100 dark:divide-gray-700">
										{filteredNames.length > 0 ? (
											filteredNames.map((name) => (
												<button
													key={name}
													type="button"
													onClick={() =>
														toggleContributor(name)
													}
													className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
												>
													<div className="size-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
														{name.charAt(0)}
													</div>
													<p className="text-sm font-semibold text-gray-900 dark:text-white">
														{name}
													</p>
												</button>
											))
										) : (
											<div className="p-4 text-center text-xs text-gray-500">
												No matching names found
											</div>
										)}
									</div>
								)}
							</div>

							<div className="flex flex-wrap gap-2 mt-3">
								{formData.contributors.map((name) => (
									<span
										key={name}
										className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800"
									>
										{name}
										<button
											type="button"
											onClick={() =>
												toggleContributor(name)
											}
											className="hover:text-emerald-900 dark:hover:text-white transition-colors"
										>
											<X className="size-3" />
										</button>
									</span>
								))}
							</div>
						</div>
					</form>
				</div>

				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-[#1a1d26]/50">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 h-12 font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						form="timeline-management-form"
						className="flex-1 h-12 font-bold text-white bg-emerald-700 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all active:scale-[0.98]"
					>
						{initialData ? "Update Timeline" : "Save Timeline"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default TimelineManagementModal;
