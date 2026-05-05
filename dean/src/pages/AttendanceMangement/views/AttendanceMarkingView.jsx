// src/pages/AttendanceMangement/views/AttendanceMarkingView.jsx

import React, { useMemo } from "react";
import {
	Search,
	Lock,
	Settings,
	QrCodeIcon,
	RefreshCw,
	Bookmark,
	ArrowLeft,
	User,
	Check,
	X,
	Archive,
	ChevronDown,
	Users,
	FileEdit,
	Pencil,
} from "lucide-react";

const AttendanceMarkingView = ({
	data,
	view,
	actions,
	setIsSettingsOpen,
	allMarked,
}) => {
	const isDraftActive = useMemo(() => {
		if (!view.selectedCourse || !data.selectedSection || view.hasSubmitted)
			return false;
		const savedDraft = localStorage.getItem(
			`attendance_draft_${view.selectedCourse.id}_${data.selectedSection}`,
		);
		return !!savedDraft;
	}, [view.selectedCourse, data.selectedSection, view.hasSubmitted]);

	const scheduledSections = useMemo(() => {
		return data.sections.filter((sec) =>
			actions.isSectionScheduledToday(sec.name),
		);
	}, [data.sections, actions.isSectionScheduledToday]);

	return (
		<div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20 lg:pb-0">
			{/* Top Header Section */}
			<div className="flex flex-col gap-6 px-4 md:px-0">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
					<div className="flex items-start md:items-center gap-4">
						<button
							onClick={actions.switchToManagement}
							className="flex items-center justify-center size-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
						>
							<ArrowLeft className="size-5 text-gray-600 dark:text-gray-400" />
						</button>
						<div className="flex flex-col items-start gap-2">
							<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
								{view.selectedCourse?.cohort_name ||
									"Course Attendance"}
							</h3>

							{isDraftActive ? (
								<span className="flex items-center gap-2 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
									<FileEdit className="size-3" />
									Saved Locally
								</span>
							) : view.hasSubmitted ? (
								<span className="flex items-center gap-2 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
									<Lock className="size-3" />
									Submitted
								</span>
							) : (
								<span className="flex items-center gap-2 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
									<Pencil className="size-3" />
									Mark Attendance
								</span>
							)}
						</div>
					</div>

					<div className="hidden md:flex items-center gap-3">
						{!view.hasSubmitted && data.selectedSection && (
							<button
								onClick={actions.onSaveDraft}
								disabled={
									view.markingLoading || view.submitLoading
								}
								className="flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-xs border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
							>
								<Bookmark className="size-4" />
								Save
							</button>
						)}
						{data.selectedSection && (
							<button
								onClick={actions.onSaveClick}
								disabled={
									!allMarked ||
									view.markingLoading ||
									view.submitLoading ||
									view.hasSubmitted
								}
								className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black uppercase text-xs transition-all shadow-lg shadow-purple-500/10 ${
									allMarked && !view.hasSubmitted
										? "bg-purple-600 text-white hover:bg-purple-700 hover:-translate-y-0.5"
										: "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-transparent"
								}`}
							>
								{view.submitLoading ? (
									<RefreshCw className="size-4 animate-spin" />
								) : (
									<>
										<Archive className="size-4" />{" "}
										{view.hasSubmitted
											? "Already Submitted"
											: "Submit Attendance"}
									</>
								)}
							</button>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
						Select Sections
					</label>

					<div className="md:hidden relative group">
						<select
							className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 appearance-none outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm transition-all"
							value={data.selectedSection || ""}
							onChange={(e) =>
								actions.onSectionChange(e.target.value)
							}
						>
							<option value="" disabled>
								Select a section
							</option>
							{scheduledSections.map((sec) => (
								<option key={sec.name} value={sec.name}>
									{sec.name} ({sec.code})
								</option>
							))}
						</select>
						<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
					</div>

					<div className="hidden md:flex flex-wrap gap-2">
						{scheduledSections.map((sec) => (
							<button
								key={sec.name}
								onClick={() =>
									actions.onSectionChange(sec.name)
								}
								className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all border ${
									data.selectedSection === sec.name
										? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20"
										: "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500/50"
								}`}
							>
								{sec.name} ({sec.code})
							</button>
						))}
					</div>
				</div>
			</div>

			{!data.selectedSection ? (
				<div className="flex flex-col items-center justify-center py-20 px-4 text-center">
					<div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
						<Users className="size-10 text-gray-400" />
					</div>
					<h3 className="text-lg font-bold text-gray-900 dark:text-white">
						Select a Section
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mt-2">
						View the student list and mark attendance.
					</p>
				</div>
			) : (
				<>
					{/* Attendance List and Controls */}
					<div className="bg-white dark:bg-[#0f1117] md:rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden mx-0 md:mx-4 lg:mx-0">
						<div className="p-4 md:p-6 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/20 dark:to-transparent border-b border-gray-100 dark:border-gray-800">
							<div className="flex flex-col lg:flex-row items-center gap-6">
								<div className="relative flex-1 w-full">
									<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										type="text"
										placeholder="Search name or roll number..."
										className="pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl text-sm w-full outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
										value={view.searchQuery}
										onChange={(e) =>
											actions.setSearchQuery(
												e.target.value,
											)
										}
										disabled={view.hasSubmitted}
									/>
								</div>
								<div className="flex items-center gap-3 w-full lg:w-auto">
									<button
										onClick={actions.openQRView}
										className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-purple-700 transition-all shadow-md shadow-purple-500/20 active:scale-95"
									>
										<QrCodeIcon className="size-5" />
										<span>Generate QR</span>
									</button>
									<button
										onClick={() => setIsSettingsOpen(true)}
										className="p-3 text-gray-500 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800"
									>
										<Settings className="size-5" />
									</button>
								</div>
							</div>
						</div>

						{/* Attendance Status Summary */}
						<div className="px-5 py-4 bg-gray-50/30 dark:bg-gray-800/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
							<div className="flex items-center justify-around md:justify-start md:gap-8">
								<div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
									<span className="text-lg md:text-sm font-black text-emerald-600 dark:text-emerald-500">
										{data.presentIds.length}
									</span>
									<span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
										Present
									</span>
								</div>
								<div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
									<span className="text-lg md:text-sm font-black text-rose-600 dark:text-rose-500">
										{data.absentIds.length}
									</span>
									<span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
										Absent
									</span>
								</div>
								<div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
									<span className="text-lg md:text-sm font-black text-gray-500">
										{data.filteredStudents.length -
											(data.presentIds.length +
												data.absentIds.length)}
									</span>
									<span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
										Pending
									</span>
								</div>
							</div>

							{!view.hasSubmitted && (
								<div className="flex items-center justify-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100 dark:border-gray-700">
									<label className="flex items-center gap-2 cursor-pointer group">
										<input
											type="radio"
											name="markAll"
											className="size-4 border-gray-300 accent-green-600 focus:ring-green-500"
											checked={
												data.filteredStudents.length >
													0 &&
												data.presentIds.length ===
													data.filteredStudents.length
											}
											onChange={() =>
												actions.onMarkAll("present")
											}
										/>
										<span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-green-600 transition-colors">
											Mark All Present
										</span>
									</label>

									<label className="flex items-center gap-2 cursor-pointer group">
										<input
											type="radio"
											name="markAll"
											className="size-4 border-gray-300 accent-red-600 focus:ring-red-500"
											checked={
												data.filteredStudents.length >
													0 &&
												data.absentIds.length ===
													data.filteredStudents.length
											}
											onChange={() =>
												actions.onMarkAll("absent")
											}
										/>
										<span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-rose-600 transition-colors">
											Mark All Absent
										</span>
									</label>
								</div>
							)}
						</div>

						{/* Student List Grid */}
						<div className="divide-y divide-gray-50 dark:divide-gray-800">
							{data.filteredStudents.map((student) => {
								const isPresent = data.presentIds.includes(
									student.id,
								);
								const isAbsent = data.absentIds.includes(
									student.id,
								);

								return (
									<div
										key={student.id}
										className={`group grid grid-cols-1 md:grid-cols-12 items-center px-4 md:px-8 py-4 transition-all duration-200 ${
											isPresent
												? "bg-emerald-50/30 dark:bg-emerald-500/5"
												: isAbsent
													? "bg-rose-50/30 dark:bg-rose-500/5"
													: "hover:bg-gray-50 dark:hover:bg-gray-900/40"
										}`}
									>
										<div className="hidden md:block col-span-2 font-mono text-sm font-bold text-gray-400">
											{student.rollNumber}
										</div>

										<div className="col-span-1 md:col-span-6 flex items-center gap-4">
											<div
												className={`md:hidden size-12 rounded-2xl flex items-center justify-center transition-all ${
													isPresent
														? "bg-emerald-100 text-emerald-600"
														: isAbsent
															? "bg-rose-100 text-rose-600"
															: "bg-gray-100 dark:bg-gray-800 text-gray-400"
												}`}
											>
												<User className="size-6" />
											</div>
											<div className="flex flex-col min-w-0">
												<span className="font-bold text-gray-900 dark:text-white truncate">
													{student.name}
												</span>
												<span className="md:hidden font-mono text-xs font-bold text-gray-400">
													{student.rollNumber}
												</span>
											</div>
										</div>

										<div className="col-span-1 md:col-span-4 mt-4 md:mt-0 flex items-center justify-end gap-3">
											<button
												onClick={() =>
													actions.onMarkPresent(
														student.id,
													)
												}
												disabled={
													view.hasSubmitted ||
													view.markingLoading ||
													view.submitLoading
												}
												className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
													isPresent
														? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20"
														: "bg-white dark:bg-gray-900 text-gray-400 border-gray-200 dark:border-gray-800 hover:border-emerald-500 hover:text-emerald-500"
												} disabled:opacity-40`}
											>
												<Check className="size-4" />
												<span
													className={
														isPresent
															? "block"
															: "hidden md:block"
													}
												>
													Present
												</span>
											</button>
											<button
												onClick={() =>
													actions.onMarkAbsent(
														student.id,
													)
												}
												disabled={
													view.hasSubmitted ||
													view.markingLoading ||
													view.submitLoading
												}
												className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
													isAbsent
														? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20"
														: "bg-white dark:bg-gray-900 text-gray-400 border-gray-200 dark:border-gray-800 hover:border-rose-500 hover:text-rose-500"
												} disabled:opacity-40`}
											>
												<X className="size-4" />
												<span
													className={
														isAbsent
															? "block"
															: "hidden md:block"
													}
												>
													Absent
												</span>
											</button>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Mobile Floating Action Bar */}
					{!view.hasSubmitted && (
						<div className="lg:hidden fixed bottom-[72px] left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 flex gap-3 z-50">
							<button
								onClick={actions.onSaveDraft}
								className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase text-xs bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
							>
								<Bookmark className="size-4" />
								Save
							</button>
							<button
								onClick={actions.onSaveClick}
								disabled={
									!allMarked ||
									view.markingLoading ||
									view.submitLoading
								}
								className={`flex-[2] flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase text-xs transition-all ${
									allMarked
										? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
										: "bg-gray-200 dark:bg-gray-800 text-gray-400"
								}`}
							>
								<Archive className="size-4" />
								Submit Attendance
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default AttendanceMarkingView;
