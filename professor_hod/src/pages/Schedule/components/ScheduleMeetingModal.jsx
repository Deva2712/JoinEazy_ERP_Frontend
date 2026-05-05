// src/pages/Schedule/components/ScheduleMeetingModal.jsx

import React, { useState, useEffect, useMemo, memo } from "react";
import {
	X,
	User,
	Calendar,
	FileText,
	ChevronDown,
	MapPin,
	Link as LinkIcon,
	MessageSquare,
	Video,
	Hash,
	GraduationCap,
	ChevronRight,
	ChevronLeft,
	Check,
} from "lucide-react";

const ALL_ROLES = ["Student", "Professor", "Supervisor", "HOD"];
const INITIAL_STATE = {
	participantName: "",
	participantId: "",
	participantRole: "Student",
	subject: "",
	startTime: "",
	reason: "",
	type: "offline",
	category: "Academic",
	meetingLink: "",
	location: "",
	note: "",
};

const ScheduleMeetingModal = memo(
	({ userRole, isOpen, onClose, onConfirm, initialData }) => {
		const [step, setStep] = useState(1);
		const [formData, setFormData] = useState(INITIAL_STATE);
		const [errors, setErrors] = useState({});

		const steps = [
			{ id: 1, label: "Identity" },
			{ id: 2, label: "Details" },
			{ id: 3, label: "Details" },
		];

		// Filter roles based on who is logged in
		const availableRoles = useMemo(() => {
			const role = userRole?.toLowerCase();
			if (role === "professor") return ["Student"];
			if (role === "hod") return ["Student", "Professor", "Supervisor"];
			return ALL_ROLES;
		}, [userRole]);

		useEffect(() => {
			if (isOpen) {
				if (initialData) {
					setFormData((prev) => ({
						...prev,
						participantName: initialData.participantName || "",
						participantId: initialData.participantId || "",
						participantRole:
							initialData.participantRole ||
							availableRoles[0] ||
							"Student",
						subject: initialData.subject || "",
						category: initialData.category || "Academic",
					}));
				} else {
					setFormData({
						...INITIAL_STATE,
						participantRole: availableRoles[0] || "Student",
					});
				}
				setErrors({});
				setStep(1);
			}
		}, [isOpen, userRole, initialData]);

		if (!isOpen) return null;

		const handleChange = (e) => {
			const { name, value } = e.target;
			setFormData((prev) => ({ ...prev, [name]: value }));
			if (errors[name]) {
				setErrors((prev) => ({ ...prev, [name]: null }));
			}
		};

		const toggleMentoring = () => {
			setFormData((prev) => {
				const isMentoring = prev.category !== "Mentoring";
				return {
					...prev,
					category: isMentoring ? "Mentoring" : "Academic",
					participantRole: isMentoring
						? "Student"
						: availableRoles[0] || "Student",
				};
			});
		};

		const isStepValid = () => {
			switch (step) {
				case 1:
					return (
						formData.participantName.trim() &&
						formData.participantId.trim()
					);
				case 2:
					const timeValid = !!formData.startTime;
					if (formData.type === "online")
						return timeValid && formData.meetingLink.trim();
					return timeValid && formData.location.trim();
				case 3:
					return formData.subject.trim() && formData.reason.trim();
				default:
					return true;
			}
		};

		const handleNext = () => setStep((s) => Math.min(s + 1, 3));
		const handleBack = () => setStep((s) => Math.max(s - 1, 1));

		const handleSubmit = (e) => {
			e.preventDefault();
			onConfirm({
				...formData,
				startTime: new Date(formData.startTime).toISOString(),
				type: formData.type === "online" ? "Online" : "Offline",
				status: "scheduled",
			});
			onClose();
		};

		const isMentoringMode = formData.category === "Mentoring";

		const renderStepIndicator = () => (
			<div className="flex items-center justify-between mb-10 px-2">
				{steps.map((s, idx) => (
					<React.Fragment key={s.id}>
						<div className="flex flex-col items-center gap-2 relative">
							<div
								className={`size-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 ${
									step >= s.id
										? "bg-rose-600 text-white ring-4 ring-rose-100 dark:ring-rose-900/30"
										: "bg-gray-200 dark:bg-gray-700 text-gray-500"
								}`}
							>
								{step > s.id ? (
									<Check className="size-5" />
								) : (
									s.id
								)}
							</div>
							<span
								className={`absolute -bottom-6 whitespace-nowrap text-[10px] font-bold uppercase ${
									step >= s.id
										? "text-rose-600"
										: "text-gray-400"
								}`}
							>
								{s.label}
							</span>
						</div>
						{idx < steps.length - 1 && (
							<div
								className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
									step > s.id
										? "bg-rose-600"
										: "bg-gray-200 dark:bg-gray-700"
								}`}
							/>
						)}
					</React.Fragment>
				))}
			</div>
		);

		return (
			<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
				<div className="bg-white dark:bg-[#1a1d26] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
					{/* Modal Header */}
					<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/30">
								<Calendar className="size-5" />
							</div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white">
								Schedule Meeting
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
						{renderStepIndicator()}

						<form
							id="direct-schedule-form"
							onSubmit={handleSubmit}
							className="space-y-6 mt-4"
						>
							{/* Step 1: Identity */}
							{step === 1 && (
								<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
									{/* Mentoring Category Toggle */}
									<div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700">
										<div className="flex items-center gap-3">
											<div
												className={`p-2 rounded-lg ${isMentoringMode ? "bg-cyan-100 text-cyan-600" : "bg-gray-200 text-gray-500"}`}
											>
												<GraduationCap className="size-5" />
											</div>
											<div>
												<p className="text-sm font-bold text-gray-900 dark:text-white">
													Mentoring Session
												</p>
												<p className="text-xs text-gray-500">
													Restrict to mentoring
													students only
												</p>
											</div>
										</div>
										<button
											type="button"
											onClick={toggleMentoring}
											className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isMentoringMode ? "bg-cyan-600" : "bg-gray-300 dark:bg-gray-600"}`}
										>
											<span
												className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isMentoringMode ? "translate-x-6" : "translate-x-1"}`}
											/>
										</button>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
												<span className="flex items-center gap-2">
													<User className="size-3" />{" "}
													Name
													<span className="text-rose-500">
														*
													</span>
												</span>
											</label>
											<input
												type="text"
												name="participantName"
												value={formData.participantName}
												onChange={handleChange}
												placeholder="Enter name"
												className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all"
											/>
										</div>
										<div className="space-y-2">
											<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
												<span className="flex items-center gap-2">
													<Hash className="size-3" />{" "}
													ID
													<span className="text-rose-500">
														*
													</span>
												</span>
											</label>
											<input
												type="text"
												name="participantId"
												value={formData.participantId}
												onChange={handleChange}
												placeholder={
													isMentoringMode
														? "STxxBTECHxxxx"
														: "FAC-123"
												}
												className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
											Role
											<span className="text-rose-500">
												*
											</span>
										</label>
										<div className="relative group">
											<select
												name="participantRole"
												value={formData.participantRole}
												onChange={handleChange}
												disabled={isMentoringMode}
												className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none appearance-none disabled:opacity-60"
											>
												{availableRoles.map((role) => (
													<option
														key={role}
														value={role}
													>
														{role}
													</option>
												))}
											</select>
											<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
										</div>
									</div>
								</div>
							)}

							{/* Step 2: Details */}
							{step === 2 && (
								<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
									<div className="space-y-2">
										<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
											<Calendar className="size-3" /> Date
											& Time
											<span className="text-rose-500">
												*
											</span>
										</label>
										<input
											name="startTime"
											type="datetime-local"
											value={formData.startTime}
											onChange={handleChange}
											className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all"
										/>
									</div>

									<div className="grid grid-cols-2 gap-3">
										{[
											{
												id: "offline",
												icon: (
													<MapPin className="size-4" />
												),
											},
											{
												id: "online",
												icon: (
													<Video className="size-4" />
												),
											},
										].map((type) => (
											<button
												key={type.id}
												type="button"
												onClick={() =>
													setFormData((prev) => ({
														...prev,
														type: type.id,
													}))
												}
												className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-bold transition-all ${
													formData.type === type.id
														? "bg-rose-600 text-white shadow-md"
														: "bg-gray-50 dark:bg-gray-800/50 text-gray-400 border border-gray-100 dark:border-gray-700"
												}`}
											>
												{type.icon}
												<span className="capitalize">
													{type.id}
												</span>
											</button>
										))}
									</div>

									<div className="space-y-2">
										<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
											{formData.type === "offline" ? (
												<>
													<MapPin className="size-3" />{" "}
													Venue
													<span className="text-rose-500">
														*
													</span>
												</>
											) : (
												<>
													<LinkIcon className="size-3" />{" "}
													Meeting Link
													<span className="text-rose-500">
														*
													</span>
												</>
											)}
										</label>
										<input
											type="text"
											name={
												formData.type === "offline"
													? "location"
													: "meetingLink"
											}
											value={
												formData.type === "offline"
													? formData.location
													: formData.meetingLink
											}
											onChange={handleChange}
											placeholder={
												formData.type === "offline"
													? "E.g., Room 402"
													: "Meeting Link"
											}
											className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all"
										/>
									</div>
								</div>
							)}

							{/* Step 3: Details */}
							{step === 3 && (
								<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
									<div className="space-y-2">
										<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
											<FileText className="size-3" />{" "}
											Subject
											<span className="text-rose-500">
												*
											</span>
										</label>
										<input
											type="text"
											name="subject"
											value={formData.subject}
											onChange={handleChange}
											placeholder="E.g., Thesis Review"
											className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all"
										/>
									</div>

									<div className="space-y-2">
										<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
											<MessageSquare className="size-3" />{" "}
											Reason / Agenda
											<span className="text-rose-500">
												*
											</span>
										</label>
										<textarea
											name="reason"
											value={formData.reason}
											onChange={handleChange}
											placeholder="Briefly describe the purpose..."
											className="w-full min-h-[120px] px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none"
										/>
									</div>
								</div>
							)}
						</form>
					</div>

					{/* Footer Actions */}
					<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-[#1a1d26]/50">
						{step > 1 ? (
							<button
								type="button"
								onClick={handleBack}
								className="flex-1 h-12 font-bold bg-white dark:bg-[#1a1d26] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
							>
								<ChevronLeft className="size-4" /> Back
							</button>
						) : (
							<button
								type="button"
								onClick={onClose}
								className="flex-1 h-12 font-bold bg-white dark:bg-[#1a1d26] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
							>
								Cancel
							</button>
						)}

						{step < 3 ? (
							<button
								type="button"
								disabled={!isStepValid()}
								onClick={handleNext}
								className="flex-1 h-12 font-bold text-white bg-rose-600 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-rose-700 transition-all active:scale-[0.98] disabled:opacity-50"
							>
								Next <ChevronRight className="size-4" />
							</button>
						) : (
							<button
								type="submit"
								form="direct-schedule-form"
								disabled={!isStepValid()}
								className="flex-1 h-12 font-bold text-white bg-rose-600 rounded-xl shadow-lg hover:bg-rose-700 transition-all active:scale-[0.98] disabled:opacity-50"
							>
								Schedule Now
							</button>
						)}
					</div>
				</div>
			</div>
		);
	},
);

export default ScheduleMeetingModal;
