// src/pages/AttendanceManagement/components/LeaveDetailsModal.jsx

import React, { useState } from "react";
import {
	X,
	Calendar,
	Info,
	Clock,
	CheckCircle2,
	BookOpen,
	FileText,
	GraduationCap,
	Send,
	Loader2,
	MapPin,
	CalendarDays,
	PlusCircle,
} from "lucide-react";
import { useAttendance } from "../../../context/AttendanceContext";

const LeaveDetailsModal = ({ isOpen, onClose, leave }) => {
	const { actions } = useAttendance();
	const [showAcademicForm, setShowAcademicForm] = useState(false);
	const [experienceData, setExperienceData] = useState({
		conferenceName: "",
		experience: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState(null);

	if (!isOpen || !leave) return null;

	const isAcademicLeave = leave.leaveType === "Academic Leave";

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const handleSubmitExperience = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus(null);

		const payload = {
			leaveId: leave.id,
			conferenceName: experienceData.conferenceName,
			experience: experienceData.experience,
			facultyId: leave.facultyId || "FAC001",
		};

		const result = await actions.recordAcademicExperience(payload);

		setIsSubmitting(false);
		if (result.status === "success") {
			setSubmitStatus("success");
			setExperienceData({ conferenceName: "", experience: "" });
		} else {
			setSubmitStatus("error");
		}
	};

	/**
	 * Helper component for consistent data rows matching the Request Modal style
	 */
	const DetailRow = ({
		icon: Icon,
		label,
		value,
		colorClass = "text-gray-900 dark:text-white",
	}) => (
		<div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
			<div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600">
				<Icon className="size-5" />
			</div>
			<div>
				<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
					{label}
				</p>
				<p className={`text-sm font-semibold mt-0.5 ${colorClass}`}>
					{value}
				</p>
			</div>
		</div>
	);

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="absolute inset-0" onClick={onClose} />

			<div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
				{/* Header Section aligned with Request Modal style */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
							<CalendarDays className="w-5 h-5 text-orange-600" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white">
								Leave Details
							</h2>
							<p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
								{leave.leaveType}
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

				<div className="p-6 overflow-y-auto space-y-6">
					<div className="flex items-start gap-4">
						<div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600">
							<Clock className="size-5" />
						</div>
						<div>
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
								Duration
							</p>
							<p className="text-sm font-semibold mt-0.5 text-gray-900 dark:text-white">
								{formatDate(leave.fromDate)} -{" "}
								{formatDate(leave.toDate)}
							</p>
						</div>
					</div>

					{/* Substitution Information Section */}
					{leave.substitutionDetails && (
						<div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30 space-y-4">
							<h3 className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
								<BookOpen className="size-4" /> Substitution
								Details
							</h3>
							<div className="space-y-3">
								<div className="flex justify-between items-center text-sm">
									<span className="text-gray-500 flex items-center gap-2">
										<BookOpen className="size-3" /> Course
									</span>
									<span className="font-bold dark:text-white">
										{leave.substitutionDetails.courseName}
									</span>
								</div>
								<div className="flex justify-between items-center text-sm">
									<span className="text-gray-500 flex items-center gap-2">
										<MapPin className="size-3" /> Room &
										Schedule
									</span>
									<span className="font-semibold dark:text-white">
										{leave.substitutionDetails.roomNumber} (
										{
											leave.substitutionDetails.timings
												.startTime
										}{" "}
										-{" "}
										{
											leave.substitutionDetails.timings
												.endTime
										}
										)
									</span>
								</div>
								<div className="pt-2 border-t border-blue-100 dark:border-blue-800/50 flex justify-between items-center">
									<span className="text-gray-500">
										Assigned Faculty
									</span>
									<span className="font-bold text-blue-600 dark:text-blue-400">
										{leave.replacementFaculty}
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Reason section */}
					{leave.reason && (
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
								<FileText className="size-3" /> Reason for Leave
							</label>
							<div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
								<p className="text-sm text-gray-600 dark:text-gray-300 italic">
									"{leave.reason}"
								</p>
							</div>
						</div>
					)}

					{/* Academic Experience Section with Toggle */}
					{isAcademicLeave && (
						<div className="space-y-3">
							{!showAcademicForm && submitStatus !== "success" ? (
								<div className="pt-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
									<button
										onClick={() =>
											setShowAcademicForm(true)
										}
										className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-purple-200 dark:border-purple-800/50 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all font-bold text-sm"
									>
										<PlusCircle className="size-4" />
										Record Academic Experience
									</button>
								</div>
							) : (
								<div className="p-5 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30 animate-in fade-in slide-in-from-top-2">
										<h3 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-2 mb-4">
											<GraduationCap className="size-4" />{" "}
											Academic Experience
										</h3>

									{submitStatus === "success" ? (
										<div className="py-2 text-sm text-green-600 font-bold flex items-center gap-2">
											<CheckCircle2 className="size-4" />{" "}
											Experience recorded successfully!
										</div>
									) : (
										<form
											onSubmit={handleSubmitExperience}
											className="space-y-4"
										>
											<div className="space-y-1.5">
												<label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
													Conference Name
												</label>
												<input
													required
													type="text"
													className="w-full px-4 py-2 text-sm rounded-xl border border-purple-100 dark:border-purple-800 bg-white dark:bg-gray-900 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
													placeholder="e.g. IEEE Conference"
													value={
														experienceData.conferenceName
													}
													onChange={(e) =>
														setExperienceData({
															...experienceData,
															conferenceName:
																e.target.value,
														})
													}
												/>
											</div>
											<div className="space-y-1.5">
												<label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
													Key Insights
												</label>
												<textarea
													className="w-full px-4 py-2 text-sm rounded-xl border border-purple-100 dark:border-purple-800 bg-white dark:bg-gray-900 outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
													rows="3"
													placeholder="What did you learn?"
													value={
														experienceData.experience
													}
													onChange={(e) =>
														setExperienceData({
															...experienceData,
															experience:
																e.target.value,
														})
													}
												/>
											</div>
											<div className="border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-gray-800/50">
												{submitStatus !== "success" && (
													<button
														onClick={() =>
															setShowAcademicForm(
																false,
															)
														}
														type="button"
														className="flex-1 h-12 font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
													>
														Cancel
													</button>
												)}
												<button
													disabled={
														isSubmitting ||
														!experienceData.conferenceName
													}
													type="submit"
													className="flex-1 flex items-center justify-center gap-2 h-12 font-bold text-white bg-orange-600 rounded-xl shadow-lg hover:bg-orange-700 transition-all active:scale-[0.98]"
												>
													{isSubmitting ? (
													<Loader2 className="size-4 animate-spin" />
												) : (
													<Send className="size-4" />
												)}
												Submit
												</button>
											</div>
											{submitStatus === "error" && (
												<p className="text-[10px] text-red-500 font-bold text-center mt-1">
													Failed to save. Try again.
												</p>
											)}
										</form>
									)}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default LeaveDetailsModal;
