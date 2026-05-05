// src/pages/Mentoring/components/MeetingRecordModal.jsx

import React, { useEffect, useState } from "react";
import { X, Save, Star, ClipboardList, Layout, Award, MessageSquare } from "lucide-react";

const MeetingRecordModal = ({
	isOpen,
	onClose,
	mentee,
	onSubmit,
	initialData,
}) => {
	const initialState = {
		discussionSummary: "",
		actionPlan: { studentTasks: [], skillImprovement: [] },
		performanceRatings: { academic: 0, professional: 0, personal: 0 },
		overallRemarks: "",
	};

	const [formData, setFormData] = useState(initialState);

	useEffect(() => {
		if (initialData) {
			setFormData({
				discussionSummary: initialData.discussionSummary || "",
				actionPlan: initialData.actionPlan || {
					studentTasks: [],
					skillImprovement: [],
				},
				performanceRatings: initialData.performanceRatings || {
					academic: 0,
					professional: 0,
					personal: 0,
				},
				overallRemarks: initialData.overallRemarks || "",
			});
		} else {
			setFormData(initialState);
		}
	}, [initialData, isOpen]);

	if (!isOpen) return null;

	const handleRating = (key, val) => {
		setFormData((prev) => ({
			...prev,
			performanceRatings: { ...prev.performanceRatings, [key]: val },
		}));
	};

	const handleActionPlanChange = (val) => {
		const tasks = val.split("\n").filter((line) => line.trim() !== "");
		setFormData((prev) => ({
			...prev,
			actionPlan: { ...prev.actionPlan, studentTasks: tasks },
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				{/* Header Section */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/30">
							<ClipboardList className="size-5" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white">
								Meeting Record
							</h2>
							<p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
								{mentee?.name}
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				{/* Scrollable Form Body */}
				<div className="p-6 overflow-y-auto custom-scrollbar">
					<form id="meeting-record-form" onSubmit={handleSubmit} className="space-y-6">
						
						{/* Discussion Summary */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<MessageSquare className="size-3" /> Discussion Summary
							</label>
							<textarea
								className="w-full min-h-[100px] px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all resize-none"
								rows="3"
								placeholder="What was discussed today?"
								value={formData.discussionSummary}
								onChange={(e) =>
									setFormData({
										...formData,
										discussionSummary: e.target.value,
									})
								}
							/>
						</div>

						{/* Action Plan */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<Layout className="size-3" /> Action Plan (One task per line)
							</label>
							<textarea
								className="w-full min-h-[100px] px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all resize-none"
								rows="3"
								placeholder="Assign specific tasks..."
								value={formData.actionPlan.studentTasks.join("\n")}
								onChange={(e) => handleActionPlanChange(e.target.value)}
							/>
						</div>

						{/* Performance Evaluation Grid */}
						<div className="space-y-4">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<Award className="size-3" /> Performance Evaluation
							</label>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{["academic", "professional", "personal"].map((category) => (
									<div
										key={category}
										className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl flex flex-col items-center"
									>
										<p className="text-[10px] font-bold uppercase text-gray-400 mb-3 tracking-wider">
											{category}
										</p>
										<div className="flex justify-center gap-1">
											{[1, 2, 3, 4, 5].map((star) => (
												<button
													type="button"
													key={star}
													onClick={() => handleRating(category, star)}
													className="transition-transform active:scale-110"
												>
													<Star
														className={`size-5 ${
															formData.performanceRatings[category] >= star
																? "fill-yellow-500 text-yellow-500"
																: "text-gray-300 dark:text-gray-600"
														}`}
													/>
												</button>
											))}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Overall Remarks */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								Overall Remarks
							</label>
							<textarea
								className="w-full min-h-[80px] px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all resize-none"
								rows="3"
								placeholder="Any additional notes..."
								value={formData.overallRemarks}
								onChange={(e) =>
									setFormData({
										...formData,
										overallRemarks: e.target.value,
									})
								}
							/>
						</div>
					</form>
				</div>

				{/* Footer Section */}
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
						form="meeting-record-form"
						className="flex-1 h-12 font-bold text-white bg-sky-600 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all active:scale-[0.98]"
					>
						<Save className="size-4" /> Save Record
					</button>
				</div>
			</div>
		</div>
	);
};

export default MeetingRecordModal;