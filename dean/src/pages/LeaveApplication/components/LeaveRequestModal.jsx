// src/pages/LeaveApplication/components/LeaveRequestModal.jsx

import React, { useState, useEffect, useRef } from "react";
import {
	X,
	Calendar,
	User,
	MessageSquare,
	AlertCircle,
	ChevronDown,
	Clock,
	BookOpen,
	MapPin,
	Upload,
	CheckCircle,
	Link,
    CalendarDays,
} from "lucide-react";

/**
 * Modal component for submitting a new leave request.
 * Form overlay for leave application with data validation and refined single-page aesthetic.
 */
const LeaveRequestModal = ({
	isOpen,
	onClose,
	onSubmit,
	initialData = null,
	faculties = [],
	courses = [],
}) => {
	const fileInputRef = useRef(null);
	const initialState = {
		leaveType: "Sick Leave",
		fromDate: "",
		toDate: "",
		reason: "",
		replacementFaculty: "",
		courseName: "",
		roomNumber: "",
		startTime: "",
		endTime: "",
		note: "",
		supporting_doc_file: null, 
        supporting_doc_link: "",
	};

	const [formData, setFormData] = useState(initialState);
	const [errors, setErrors] = useState({});

	const today = new Date().toISOString().split("T")[0];

	useEffect(() => {
		if (isOpen) {
			if (initialData) {
				const details = initialData.substitutionDetails || {};
                setFormData({
                    id: initialData.id,
                    leaveType: initialData.leaveType || "Sick Leave",
                    fromDate: initialData.fromDate ? initialData.fromDate.split("T")[0] : "",
                    toDate: initialData.toDate ? initialData.toDate.split("T")[0] : "",
                    reason: initialData.reason || "",
                    replacementFaculty: initialData.replacementFaculty || "",
                    courseName: details.courseName || "",
                    roomNumber: details.roomNumber || "",
                    startTime: details.timings?.startTime || "",
                    endTime: details.timings?.endTime || "",
                    note: details.note || "",
                    supporting_doc_file: null,
                    supporting_doc_link: initialData.supporting_doc_link || "",
				});
			} else {
				setFormData(initialState);
			}
			setErrors({});
		}
	}, [isOpen, initialData]);

	if (!isOpen) return null;

	const handleFormSubmit = (e) => {
		e.preventDefault();
        const newErrors = {};
        const start = new Date(formData.fromDate);
        const end = new Date(formData.toDate);
        if (end < start) {
            newErrors.date = "The 'To' date cannot be earlier than the 'From' date.";
        }

        if (formData.replacementFaculty) {
            if (!formData.courseName) newErrors.courseName = "Course is required";
            if (!formData.startTime) newErrors.startTime = "Start time is required";
            if (!formData.endTime) newErrors.endTime = "End time is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Structure the payload to match controller expectations
        const submissionData = {
            ...formData,
            substitutionDetails: {
                courseName: formData.courseName,
                roomNumber: formData.roomNumber,
                note: formData.note,
                timings: {
                    startTime: formData.startTime,
                    endTime: formData.endTime
                }
            }
        };

		onSubmit(submissionData);
	};

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: files ? files[0] : value,
		}));

        // Clear error when user interacts with field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
							<CalendarDays className="w-5 h-5 text-orange-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							{initialData ? "Edit Leave Request" : "Apply Leave"}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				<div className="p-6 overflow-y-auto">
					<form
						id="leave-form"
						onSubmit={handleFormSubmit}
						className="space-y-6"
					>
                        {initialData?.status === "Rejected" && (
                            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl">
                                <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                                    Please address the HoD and HR's comments before resubmitting your application.
                                </p>
                            </div>
                        )}
                        
                        {/* Leave Type field section */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								Leave Type{" "}
								<span className="text-red-500">*</span>
							</label>
							<div className="relative group">
								<select
									name="leaveType"
									className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all appearance-none"
									value={formData.leaveType}
									onChange={handleChange}
									required
								>
									<option value="Sick Leave">Sick Leave</option>
									<option value="Casual Leave">Casual Leave</option>
									<option value="Academic Leave">Academic Leave</option>
								</select>
								<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
							</div>
						</div>

                        {/* Date selection section */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
									<Calendar className="size-3" /> From{" "}
									<span className="text-red-500">*</span>
								</label>
								<input
									name="fromDate"
									type="date"
									min={today}
									required
									className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
									value={formData.fromDate}
									onChange={handleChange}
								/>
							</div>
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
									<Calendar className="size-3" /> To{" "}
									<span className="text-red-500">*</span>
								</label>
								<input
									name="toDate"
									type="date"
									min={formData.fromDate || today}
									required
									className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
									value={formData.toDate}
									onChange={handleChange}
								/>
							</div>
							{errors.date && (
								<p className="col-span-2 text-xs text-red-500">
									{errors.date}
								</p>
							)}
						</div>

						{/* Supporting Document Field */}
						<div className="space-y-2">
							<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
								Supporting Document
							</label>
							<div className="space-y-3">
								<div className="relative">
									<Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										name="supporting_doc_link"
										type="url"
										placeholder="https://link-to-document.com"
										className="w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all"
										value={formData.supporting_doc_link}
										onChange={handleChange}
									/>
								</div>
								<button
									type="button"
									onClick={() => fileInputRef.current.click()}
									className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl transition-all ${
										formData.supporting_doc_file
											? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
											: "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-900"
									}`}
								>
									{formData.supporting_doc_file ? (
										<CheckCircle className="size-5" />
									) : (
										<Upload className="size-5" />
									)}
									<span className="font-bold text-sm">
										{formData.supporting_doc_file
											? formData.supporting_doc_file.name
											: "Upload PDF/Image"}
									</span>
								</button>
								<input
									name="supporting_doc_file"
									type="file"
									ref={fileInputRef}
									className="hidden"
									accept="image/*,application/pdf"
									onChange={handleChange}
								/>
							</div>
						</div>

                        {/* Reason field section */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								Reason <span className="text-red-500">*</span>
							</label>
							<textarea
								name="reason"
								required
								placeholder="Reason for leave..."
								className="w-full min-h-[100px] px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
								value={formData.reason}
								onChange={handleChange}
							/>
						</div>

                        {/* Replacement Faculty section */}
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<User className="size-3" /> Replacement Faculty
							</label>
							<div className="relative group">
								<select
									name="replacementFaculty"
									className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none appearance-none"
									value={formData.replacementFaculty}
									onChange={handleChange}
								>
									<option value="">Select faculty (optional)</option>
									{faculties.map((f) => (
										<option key={f.id} value={f.name}>
											{f.name}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
							</div>
						</div>

                        {/* Substitution Details section */}
						{formData.replacementFaculty && (
							<div className="space-y-4 animate-in fade-in">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
											<BookOpen className="size-3" /> Course
                                            {errors.courseName && <span className="text-red-500">*</span>}
										</label>
										<div className="relative group">
											<select
												name="courseName"
												className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all appearance-none"
												value={formData.courseName}
												onChange={handleChange}
											>
												<option value="">Select Course</option>
												{courses.map((c) => (
													<option key={c.id} value={c.name}>
														{c.name}
													</option>
												))}
											</select>
											<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
										</div>
									</div>
									<div className="space-y-2">
										<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
											<MapPin className="size-3" /> Room
											{errors.roomNumber && <span className="text-red-500">*</span>}
										</label>
										<input
											name="roomNumber"
											placeholder="Room Number"
											className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
											value={formData.roomNumber}
											onChange={handleChange}
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
											<Clock className="size-3" /> Start Time
                                            {errors.startTime && <span className="text-red-500">*</span>}
										</label>
										<input
											name="startTime"
											type="time"
											className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
											value={formData.startTime}
											onChange={handleChange}
										/>
									</div>
									<div className="space-y-2">
										<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
											<Clock className="size-3" /> End Time
                                            {errors.endTime && <span className="text-red-500">*</span>}
										</label>
										<input
											name="endTime"
											type="time"
											className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
											value={formData.endTime}
											onChange={handleChange}
										/>
									</div>
								</div>
								<div>
									<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
										<MessageSquare className="size-3" /> Note to the Faculty
									</label>
									<textarea
										name="note"
										placeholder="Any additional information..."
										className="w-full min-h-[80px] px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
										value={formData.note}
										onChange={handleChange}
									/>
								</div>
							</div>
						)}
					</form>
				</div>

				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-gray-800/50">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 h-12 font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						form="leave-form"
						type="submit"
						className="flex-1 h-12 font-bold text-white bg-orange-600 rounded-xl shadow-lg hover:bg-orange-700 transition-all active:scale-[0.98]"
					>
						Apply
					</button>
				</div>
			</div>
		</div>
	);
};

export default LeaveRequestModal;