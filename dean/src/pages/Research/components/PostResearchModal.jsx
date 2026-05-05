// src/pages/Research/components/AddResearchModal.jsx

import React, { useState, useEffect } from "react";
import {
	X,
	Microscope,
	BookOpen,
	Tag,
	Users,
	Database,
	ChevronRight,
	ChevronLeft,
	Check,
	MessageSquare,
	AlignLeft,
	File,
	ExternalLink,
	AlertCircle,
	Hash,
	Search,
	UserPen,
	ChevronDown,
} from "lucide-react";

/**
 * Multi-step modal for creating Research Projects or Publications.
 * Step-1: Identity (Title, category, abstract)
 * Step-2: Technical (Funding/Journal, DOI, Link, Keywords)
 * Step-3: Team & Status (Collaborators/Authors, Status)
 * Step-4: Logistics (Type and Instructions - visible only if status is "Open")
 */
const PostResearchModal = ({
	isOpen,
	type,
	onClose,
	onSubmit,
	initialData,
	allUsers,
}) => {
	const [step, setStep] = useState(1);
	const [userSearch, setUserSearch] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		professorName: "Dr. Jane Smith",
		status: "Open",
		category: "",
		collaborators: [],
		abstract: "",
		fundingDetails: "",
		collaborationType: "In-person / Hybrid",
		collaborationInstructions: "",
		coAuthors: [],
		journalDetails: "",
		doi: "",
		link: "",
		type: type,
		keywords: "",
	});

	const steps = [
		{ id: 1, label: "Identity" },
		{ id: 2, label: "Technical" },
		{ id: 3, label: "Team & Status" },
		{ id: 4, label: "Logistics" },
	];

	useEffect(() => {
		if (initialData) {
			setFormData({
				...initialData,
				type: type,
				collaborators: Array.isArray(initialData.collaborators)
					? initialData.collaborators
					: [],
				coAuthors: Array.isArray(initialData.coAuthors)
					? initialData.coAuthors
					: [],
				keywords: Array.isArray(initialData.keywords)
					? initialData.keywords.join(", ")
					: initialData.keywords || "",
			});
		} else {
			setFormData({
				title: "",
				professorName: "Dr. Jane Smith",
				status: "Open",
				category: "",
				collaborators: [],
				abstract: "",
				fundingDetails: "",
				collaborationType: "In-person / Hybrid",
				collaborationInstructions: "",
				coAuthors: [],
				journalDetails: "",
				doi: "",
				link: "",
				type: type,
				keywords: "",
			});
		}
		if (isOpen) setStep(1);
	}, [initialData, isOpen, type]);

	/**
	 * Data validation logic per step to guide the user toward correct inputs.
	 */
	const isStepValid = () => {
		const urlPattern =
			/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
		const doiPattern = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;

		switch (step) {
			case 1:
				return (
					formData.title.trim().length >= 5 &&
					formData.category &&
					formData.abstract.trim().length >= 20
				);
			case 2:
				const isLinkValid =
					!formData.link || urlPattern.test(formData.link);
				if (type === "Project") return isLinkValid;
				return (
					isLinkValid &&
					formData.journalDetails.trim().length > 2 &&
					doiPattern.test(formData.doi)
				);
			case 3:
				return !!formData.status;
			case 4:
				return !!formData.collaborationType;
			default:
				return true;
		}
	};

	if (!isOpen) return null;

	const toggleUserSelection = (userName) => {
		const field = type === "Project" ? "collaborators" : "coAuthors";
		const currentList = formData[field];

		if (currentList.includes(userName)) {
			setFormData({
				...formData,
				[field]: currentList.filter((name) => name !== userName),
			});
		} else {
			setFormData({ ...formData, [field]: [...currentList, userName] });
			setUserSearch("");
			setShowDropdown(false);
		}
	};

	const filteredUsers = allUsers.filter(
		(user) =>
			(user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
				user.department
					.toLowerCase()
					.includes(userSearch.toLowerCase())) &&
			!(
				type === "Project" ? formData.collaborators : formData.coAuthors
			).includes(user.name),
	);

	const handleNext = (e) => {
		if (e) e.preventDefault();
		if (step === 3) {
			formData.status === "Open" ? setStep(4) : handleFinalSubmit();
		} else {
			setStep((s) => Math.min(s + 1, 4));
		}
	};

	const handleBack = () => setStep((s) => Math.max(s - 1, 1));

	const handleFinalSubmit = (e) => {
		if (e) e.preventDefault();

		const processedData = {
			...formData,
			type: type,
			id: initialData?.id,
			// Keep original creation date if editing
			createdAt: initialData?.createdAt || new Date().toISOString(),
			applicants: initialData?.applicants || [],
			// Cleanly separate collaborators/authors based on type
			collaborators: type === "Project" ? formData.collaborators : [],
			coAuthors: type === "Publication" ? formData.coAuthors : [],
			// Ensure keywords are an array of non-empty strings
			keywords:
				typeof formData.keywords === "string"
					? formData.keywords
							.split(",")
							.map((s) => s.trim())
							.filter(Boolean)
					: formData.keywords,
		};

		onSubmit(processedData);
		onClose();
	};

	const renderStepIndicator = () => (
		<div className="flex items-center justify-between mb-10 px-2">
			{steps.map((s, idx) => (
				<React.Fragment key={s.id}>
					<div className="flex flex-col items-center gap-2 relative">
						<div
							className={`size-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 ${step >= s.id ? "bg-emerald-700 text-white ring-4 ring-emerald-100 dark:ring-emerald-900/30" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}
						>
							{step > s.id ? <Check className="size-5" /> : s.id}
						</div>
						<span
							className={`absolute -bottom-6 whitespace-nowrap text-[10px] font-bold uppercase ${step >= s.id ? "text-emerald-700" : "text-gray-400"}`}
						>
							{s.label}
						</span>
					</div>
					{idx < steps.length - 1 && (
						<div
							className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${step > s.id ? "bg-emerald-700" : "bg-gray-200 dark:bg-gray-700"}`}
						/>
					)}
				</React.Fragment>
			))}
		</div>
	);

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 overflow-hidden">
				{/* Header */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
							{type === "Project" ? (
								<Microscope className="size-5" />
							) : (
								<BookOpen className="size-5" />
							)}
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							{initialData ? "Edit" : "Post New"} {type}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				<div className="p-5 overflow-y-auto">
					{renderStepIndicator()}

					<form
						id="research-step-form"
						onSubmit={handleFinalSubmit}
						className="space-y-5 mt-4"
					>
						{/* Step 1: Identity */}
						{step === 1 && (
							<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
								<div>
									<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
										<File className="size-3" /> Title{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										required
										value={formData.title}
										onChange={(e) =>
											setFormData({
												...formData,
												title: e.target.value,
											})
										}
										className="text-sm w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
										placeholder="Minimum 5 characters required (e.g., Impact of Neural Architectures)"
									/>
								</div>
								<div>
									<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
										<Tag className="size-3" /> Category{" "}
										<span className="text-red-500">*</span>
									</label>
									<div className="relative group">
										<select
											required
											value={formData.category}
											onChange={(e) =>
												setFormData({
													...formData,
													category: e.target.value,
												})
											}
											className="text-sm w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
										>
											<option value="">
												Select a category
											</option>
											<option value="Computer Science">
												Computer Science
											</option>
											<option value="Artificial Intelligence">
												Artificial Intelligence
											</option>
											<option value="Cybersecurity">
												Cybersecurity
											</option>
											<option value="Robotics">
												Robotics
											</option>
											<option value="Data Science">
												Data Science
											</option>
											<option value="Ethics">
												Ethics
											</option>
										</select>
										<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
									</div>
								</div>
								<div>
									<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
										<AlignLeft className="size-3" />{" "}
										Abstract{" "}
										<span className="text-red-500">*</span>
									</label>
									<textarea
										required
										value={formData.abstract}
										onChange={(e) =>
											setFormData({
												...formData,
												abstract: e.target.value,
											})
										}
										className="text-sm w-full min-h-[120px] px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
										placeholder="Minimum 20 characters required. Summarize goals, methodology, and outcomes..."
									/>
								</div>
							</div>
						)}

						{/* Step 2: Technical Details */}
						{step === 2 && (
							<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
								<div>
									<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
										<ExternalLink className="size-3" />{" "}
										{type} URL
									</label>
									<input
										type="url"
										value={formData.link}
										onChange={(e) =>
											setFormData({
												...formData,
												link: e.target.value,
											})
										}
										className="text-sm w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
										placeholder="Enter a valid URL (e.g., https://github.com/project)"
									/>
								</div>

								<div>
									<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
										<Database className="size-3" /> Funding
										Details{" "}
									</label>
									<input
										value={formData.fundingDetails}
										onChange={(e) =>
											setFormData({
												...formData,
												fundingDetails: e.target.value,
											})
										}
										className="text-sm w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
										placeholder="e.g., NSF Grant #4452 or Department Funded"
									/>
								</div>

								{type === "Publication" && (
									<>
										<div>
											<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
												<BookOpen className="size-3" />{" "}
												Journal/Conference Details{" "}
												<span className="text-red-500">
													*
												</span>
											</label>
											<input
												required
												value={formData.journalDetails}
												onChange={(e) =>
													setFormData({
														...formData,
														journalDetails:
															e.target.value,
													})
												}
												className="text-sm w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
												placeholder="Minimum 3 characters required (e.g., ICML 2025)"
											/>
										</div>

										<div>
											<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
												<Hash className="size-3" /> DOI{" "}
												<span className="text-red-500">
													*
												</span>
											</label>
											<input
												required
												value={formData.doi}
												onChange={(e) =>
													setFormData({
														...formData,
														doi: e.target.value,
													})
												}
												className="text-sm w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
												placeholder="Enter a valid DOI (e.g., 10.1109/ICSE.2024.0001)"
											/>
										</div>
									</>
								)}

								<div>
									<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
										<AlertCircle className="size-3" />{" "}
										Keywords
									</label>
									<input
										value={formData.keywords}
										onChange={(e) =>
											setFormData({
												...formData,
												keywords: e.target.value,
											})
										}
										className="text-sm w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
										placeholder="Deep Learning, Computer Vision (comma separated)"
									/>
								</div>
							</div>
						)}

						{/* Step 3: Team & Status */}
						{step === 3 && (
							<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
								<div>
									<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
										<Users className="size-3" /> Select{" "}
										{type === "Project"
											? "Collaborators"
											: "Co-Authors"}
									</label>
									<div className="relative">
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
										<input
											type="text"
											placeholder="Type name or department to find team members..."
											value={userSearch}
											onFocus={() =>
												setShowDropdown(true)
											}
											onChange={(e) => {
												setUserSearch(e.target.value);
												setShowDropdown(true);
											}}
											className="text-sm w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
										/>

										{showDropdown &&
											userSearch.trim() !== "" && (
												<div className="absolute z-20 top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl divide-y divide-gray-100 dark:divide-gray-700">
													{filteredUsers.length >
													0 ? (
														filteredUsers.map(
															(user) => (
																<button
																	key={
																		user.id
																	}
																	type="button"
																	onClick={() =>
																		toggleUserSelection(
																			user.name,
																		)
																	}
																	className="text-sm w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
																>
																	<div className="size-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
																		{user.name.charAt(
																			0,
																		)}
																	</div>
																	<div>
																		<p className="text-sm font-semibold text-gray-900 dark:text-white">
																			{
																				user.name
																			}
																		</p>
																		<p className="text-[10px] text-gray-500 uppercase tracking-wider">
																			{
																				user.department
																			}
																		</p>
																	</div>
																</button>
															),
														)
													) : (
														<div className="p-4 text-center text-xs text-gray-500">
															No matching users
															found
														</div>
													)}
												</div>
											)}
									</div>

									<div className="flex flex-wrap gap-2 mt-2">
										{(type === "Project"
											? formData.collaborators
											: formData.coAuthors
										).map((name) => (
											<span
												key={name}
												className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800"
											>
												{name}
												<button
													type="button"
													onClick={() =>
														toggleUserSelection(
															name,
														)
													}
													className="hover:text-emerald-900 dark:hover:text-white transition-colors"
												>
													<X className="size-3" />
												</button>
											</span>
										))}
									</div>
								</div>

								<div>
									<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
										<UserPen className="size-3" />{" "}
										Collaboration Status{" "}
										<span className="text-red-500">*</span>
									</label>
									<div className="relative group">
										<select
											required
											className="text-sm w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
											value={formData.status}
											onChange={(e) =>
												setFormData({
													...formData,
													status: e.target.value,
												})
											}
										>
											<option value="Open">
												Open (Accepting Applications)
											</option>
											<option value="Closed">
												Closed (Team Full / Completed)
											</option>
										</select>
										<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
									</div>
								</div>
							</div>
						)}

						{/* Step 4: Logistics */}
						{step === 4 && (
							<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
								<div>
									<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
										<Users className="size-3" />{" "}
										Collaboration Mode{" "}
										<span className="text-red-500">*</span>
									</label>
									<div className="relative group">
										<select
											required
											className="text-sm w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
											value={formData.collaborationType}
											onChange={(e) =>
												setFormData({
													...formData,
													collaborationType:
														e.target.value,
												})
											}
										>
											<option>In-person / Hybrid</option>
											<option>Remote Friendly</option>
											<option>On-site (Lab)</option>
											<option>Fully Remote</option>
										</select>
										<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
									</div>
								</div>
								<div>
									<label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
										<MessageSquare className="size-3" />{" "}
										Collaboration Instructions
									</label>
									<textarea
										value={
											formData.collaborationInstructions
										}
										onChange={(e) =>
											setFormData({
												...formData,
												collaborationInstructions:
													e.target.value,
											})
										}
										className="text-sm w-full min-h-[120px] px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
										placeholder="Specify meeting schedules or communication tools (e.g., Slack/Zoom)..."
									/>
								</div>
							</div>
						)}
					</form>
				</div>

				{/* Navigation Footer */}
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

					{step < 3 || (step === 3 && formData.status === "Open") ? (
						<button
							type="button"
							disabled={!isStepValid()}
							onClick={handleNext}
							className="flex-1 h-12 font-bold text-white bg-emerald-700 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
						>
							Next <ChevronRight className="size-4" />
						</button>
					) : (
						<button
							type="submit"
							form="research-step-form"
							disabled={!isStepValid()}
							className="flex-1 h-12 font-bold text-white bg-emerald-600 rounded-xl shadow-lg hover:bg-emerald-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
						>
							{initialData ? "Save Changes" : `Post ${type}`}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default PostResearchModal;
