// src/pages/AttendanceMangement/views/AttendanceMarkingView.jsx

import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Lock,
	Bookmark,
	ArrowLeft,
	Archive,
	ChevronDown,
	Users,
	Pencil,
	RefreshCw,
	Calendar,
} from "lucide-react";
import AttendanceMarkingTable from "../components/AttendanceMarkingTable";

const AttendanceMarkingView = ({
	state,
	actions,
	filteredStudents,
	isSectionScheduledOnDate,
	setIsSettingsOpen,
	allMarked,
	setIsSaveSuccessOpen,
	setIsConfirmModalOpen,
}) => {
	const navigate = useNavigate();

	const isDraftActive = useMemo(() => {
		if (
			!state.selectedCourse ||
			!state.selectedSection ||
			state.hasSubmitted
		)
			return false;

		const draftKey = `attendance_draft_${state.selectedCourse.id}_${state.selectedSection}_${state.selectedDate}`;
		const savedDraft = localStorage.getItem(draftKey);

		return !!savedDraft;
	}, [
		state.selectedCourse,
		state.selectedSection,
		state.hasSubmitted,
		state.selectedDate,
	]);

	/**
	 * Logic to filter sections based on the specifically selected date
	 * rather than just "today".
	 */
	const scheduledSections = useMemo(() => {
		return (state.selectedCourse?.sections || []).filter((sec) =>
			isSectionScheduledOnDate(sec.name, state.selectedDate),
		);
	}, [state.selectedCourse, isSectionScheduledOnDate, state.selectedDate]);

	useEffect(() => {
		if (scheduledSections.length === 1 && !state.selectedSection) {
			const singleSection = scheduledSections[0];
			actions.setSection(
				singleSection.name,
				singleSection.code ||
					state.selectedCourse.course_codes?.[0] ||
					"N/A",
			);
		}
	}, [
		scheduledSections,
		state.selectedSection,
		actions,
		state.selectedCourse,
	]);

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20 lg:pb-0">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
					<div className="flex items-start md:items-center gap-4">
						<button
							onClick={() => {
								navigate("/attendance-management/overview");
							}}
							className="flex items-center justify-center size-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
						>
							<ArrowLeft className="size-5 text-gray-600 dark:text-gray-400" />
						</button>
						<div className="flex flex-col items-start gap-2">
							<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
								{state.selectedCourse?.cohort_name ||
									"Course Attendance"}
							</h3>

							<div className="flex flex-wrap gap-2">
								{isDraftActive ? (
									<span className="flex items-center gap-2 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
										<Bookmark className="size-3" />
										Draft: {formatDate(state.selectedDate)}
									</span>
								) : state.hasSubmitted ? (
									<span className="flex items-center gap-2 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
										<Lock className="size-3" />
										Submitted:{" "}
										{formatDate(state.selectedDate)}
									</span>
								) : (
									<span className="flex items-center gap-2 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
										<Calendar className="size-3" />
										Date: {formatDate(state.selectedDate)}
									</span>
								)}
							</div>
						</div>
					</div>

					<div className="hidden md:flex items-center gap-3">
						{!state.hasSubmitted && state.selectedSection && (
							<button
								onClick={() => setIsSaveSuccessOpen(true)}
								disabled={
									state.markingLoading || state.submitLoading
								}
								className="flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-wider bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 shadow-md shadow-emerald-500/10 transition-all disabled:opacity-50"
							>
								<Bookmark className="size-4" />
								Save Draft
							</button>
						)}
						{state.selectedSection && (
							<button
								onClick={() => setIsConfirmModalOpen(true)}
								disabled={
									!allMarked ||
									state.markingLoading ||
									state.submitLoading ||
									state.hasSubmitted
								}
								className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-wider transition-all shadow-md ${
									allMarked && !state.hasSubmitted
										? "bg-purple-600 text-white shadow-purple-500/10 hover:bg-purple-700 hover:-translate-y-0.5"
										: "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-transparent"
								}`}
							>
								{state.submitLoading ? (
									<RefreshCw className="size-4 animate-spin" />
								) : (
									<>
										<Archive className="size-4" />{" "}
										{state.hasSubmitted
											? "Submitted"
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
							value={state.selectedSection || ""}
							onChange={(e) => {
								const section = e.target.value;
								const sectionData =
									state.selectedCourse?.sections?.find(
										(s) => s.name === section,
									);
								actions.setSection(
									section,
									sectionData?.code ||
										state.selectedCourse
											.course_codes?.[0] ||
										"N/A",
								);
							}}
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
								onClick={() => {
									const sectionData =
										state.selectedCourse?.sections?.find(
											(s) => s.name === sec.name,
										);
									actions.setSection(
										sec.name,
										sectionData?.code ||
											state.selectedCourse
												.course_codes?.[0] ||
											"N/A",
									);
								}}
								className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all border ${
									state.selectedSection === sec.name
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

			{!state.selectedSection ? (
				<div className="flex flex-col items-center justify-center py-20 px-4 text-center">
					<div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
						<Users className="size-10 text-gray-400" />
					</div>
					<h3 className="text-lg font-bold text-gray-900 dark:text-white">
						Select a Section
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mt-2">
						View the student list and mark attendance for{" "}
						{state.selectedDate}.
					</p>
				</div>
			) : (
				<>
					<AttendanceMarkingTable
						state={state}
						actions={actions}
						filteredStudents={filteredStudents}
						setIsSettingsOpen={setIsSettingsOpen}
						navigate={navigate}
					/>

					{!state.hasSubmitted && (
						<div className="lg:hidden fixed bottom-[72px] left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 flex gap-3 z-50">
							<button
								onClick={() => setIsSaveSuccessOpen(true)}
								className="flex-1 w-full px-4 py-3.5 rounded-xl font-black text-xs shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
							>
								<Bookmark className="size-4" />
								Save
							</button>
							<button
								onClick={() => setIsConfirmModalOpen(true)}
								disabled={
									!allMarked ||
									state.markingLoading ||
									state.submitLoading
								}
								className={`flex-1 w-full px-4 py-3.5 rounded-xl font-black text-xs shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 ${
									allMarked
										? "bg-purple-600 text-white"
										: "bg-gray-200 dark:bg-gray-800 text-gray-400"
								}`}
							>
								<Archive className="size-4" />
								Submit
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default AttendanceMarkingView;
