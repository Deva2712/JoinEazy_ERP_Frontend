// src/pages/Research/components/EditProfileModal.jsx

import React, { useState, useEffect } from "react";
import {
	X,
	Plus,
	Check,
	Link,
	Tag,
	AlignLeft,
	UserPen,
	Globe,
} from "lucide-react";

/**
 * Modal for editing researcher profile details.
 * Features a single-page design matching the Research Modal's aesthetic.
 */
const EditProfileModal = ({ isOpen, user, onClose, onSubmit }) => {
	const [formData, setFormData] = useState({
		bio: "",
		skills: [],
		linkedinUrl: "",
		resumeUrl: "",
	});
	const [newSkill, setNewSkill] = useState("");

	useEffect(() => {
		if (user && isOpen) {
			setFormData({
				bio: user.bio || "",
				skills: user.skills || [],
				linkedinUrl: user.linkedinUrl || "",
				resumeUrl: user.resumeUrl || "",
			});
		}
	}, [user, isOpen]);

	const handleAddSkill = (e) => {
		if (e) e.preventDefault();
		if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
			setFormData({
				...formData,
				skills: [...formData.skills, newSkill.trim()],
			});
			setNewSkill("");
		}
	};

	const removeSkill = (skillToRemove) => {
		setFormData({
			...formData,
			skills: formData.skills.filter((s) => s !== skillToRemove),
		});
	};

	const handleSubmit = (e) => {
		if (e) e.preventDefault();
		onSubmit({ ...user, ...formData });
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">
				{/* Header Section */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
							<UserPen className="size-5" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Edit Profile
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				{/* Form Body */}
				<div className="p-6 overflow-y-auto space-y-6">
					<form
						id="profile-edit-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						{/* Bio Field */}
						<div>
							<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
								<AlignLeft className="size-3" /> Bio
							</label>
							<textarea
								className="w-full min-h-[120px] px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
								value={formData.bio}
								onChange={(e) =>
									setFormData({
										...formData,
										bio: e.target.value,
									})
								}
								placeholder="Describe your research interests and experience..."
							/>
						</div>

						{/* Skills/Tags Field */}
						<div>
							<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
								<Tag className="size-3" /> Technical Expertise
							</label>
							<div className="flex gap-2 mb-3">
								<input
									type="text"
									placeholder="Add a skill..."
									className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
									value={newSkill}
									onChange={(e) =>
										setNewSkill(e.target.value)
									}
									onKeyDown={(e) =>
										e.key === "Enter" && handleAddSkill(e)
									}
								/>
								<button
									type="button"
									onClick={handleAddSkill}
									className="p-2.5 bg-emerald-700 text-white rounded-full hover:bg-emerald-700 transition-all active:scale-95 shadow-md shadow-emerald-700/10"
								>
									<Plus className="size-5" />
								</button>
							</div>
							<div className="flex flex-wrap gap-2">
								{formData.skills.map((skill) => (
									<span
										key={skill}
										className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider rounded-full border border-emerald-200 dark:border-emerald-800"
									>
										{skill}
										<button
											type="button"
											onClick={() => removeSkill(skill)}
											className="hover:text-emerald-900 dark:hover:text-white transition-colors"
										>
											<X className="size-3" />
										</button>
									</span>
								))}
							</div>
						</div>

						{/* Links Grid */}
						<div className="grid grid-cols-1 pt-2">
							<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
								<Globe className="size-3" /> Portfolio / Website
							</label>
							<input
								type="url"
								className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
								placeholder="https://yoursite.com"
								value={formData.resumeUrl}
								onChange={(e) =>
									setFormData({
										...formData,
										resumeUrl: e.target.value,
									})
								}
							/>
						</div>
					</form>
				</div>

				{/* Action Bar */}
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
						form="profile-edit-form"
						className="flex-1 h-12 font-bold text-white bg-emerald-700 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all active:scale-[0.98]"
					>
						<Check className="size-4" /> Save Changes
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditProfileModal;
