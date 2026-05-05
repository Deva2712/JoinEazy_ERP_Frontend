// src/pages/Mentoring/views/StudentDetailsView.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import {
	User,
	Activity,
	AlertTriangle,
	History,
	Mail,
	Phone,
	ArrowLeft,
	GraduationCap,
	ExternalLink,
	CalendarClock,
} from "lucide-react";
import {
	SidebarContent,
	ActionButtons,
} from "../components/StudentDetailComponents";
import CollapsibleSection from "../../../components/common/CollapsibleSection";
import AcademicJourneySection from "../components/AcademicJourneySection";
import MeetingsLogSection from "../components/MeetingsLogSection";

const StudentDetailsView = ({
	mentee,
	onBack,
	onDownloadReport,
	onOpenMeetingModal,
	onToggleAttendance,
}) => {
	const {
		name,
		studentId,
		department,
		semester,
		academicMetrics,
		meetingHistory,
		emailId,
		phoneNumber,
	} = mentee;

	const navigate = useNavigate();

	const pendingRequest = meetingHistory?.find(
		(m) => m.status === "Requested",
	);

	const sortedGrades = [...(academicMetrics.semesterGrades || [])].sort(
		(a, b) => b.sem - a.sem,
	);

	const handleScheduleMeeting = () => {
		navigate("/schedule/meetings", {
			state: {
				openScheduleModal: true,
				preFill: {
					participantName: name,
					participantId: studentId,
					participantRole: "Student",
					participantDepartment: department || "",
					subject: `Mentoring Session: ${name} (${studentId})`,
					category: "Mentoring",
				},
			},
		});
	};

	const handleViewPendingRequest = () => {
		if (pendingRequest) {
			navigate("/schedule/requests", {
				state: {
					selectedRequestId:
						pendingRequest.meetingId || pendingRequest.id,
					viewMode: "incoming",
				},
			});
		}
	};

	return (
		<div className="relative pb-32 lg:pb-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
			<button
				onClick={onBack}
				className="inline-flex items-center gap-2.5 py-2 text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 font-bold transition-all group rounded-full mb-1"
			>
				<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-sky-200 dark:group-hover:border-sky-800 group-hover:shadow-sm transition-all">
					<ArrowLeft className="size-4" />
				</div>
				<span className="text-xs uppercase tracking-widest">
					Return
				</span>
			</button>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<div className="lg:col-span-3 space-y-6">
					{/* Header Section: Main Student Identity Card */}
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none p-5 md:p-6 flex flex-col md:flex-row items-center md:justify-between">
						{/* Left Section: Avatar and ID Details */}
						<div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
							<div className="size-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/10 text-sky-600 dark:text-sky-400 shadow-inner">
								<User className="size-10" />
							</div>

							<div className="flex flex-col items-center md:items-start text-center md:text-left">
								<h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
									{name}
								</h3>
								<p className="text-gray-400 dark:text-gray-500 font-mono text-sm font-bold mt-1">
									{studentId}
								</p>
							</div>
						</div>

						{/* Right Section: Shared Contact Info */}
						<div className="flex flex-col items-center md:items-end gap-2.5 w-full md:w-auto mt-4 pt-4 md:mt-0 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700">
							<div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
								<Mail className="size-4 text-sky-600" />
								<span className="text-sm font-semibold tracking-tight">
									{emailId}
								</span>
							</div>
							<div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
								<Phone className="size-4 text-sky-600" />
								<span className="text-sm font-semibold tracking-tight">
									{phoneNumber}
								</span>
							</div>
						</div>
					</div>

					{/* Notification Bar: Meeting Request Alert */}
					{pendingRequest && (
						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
							<div className="flex items-center gap-4 z-10">
								<div className="size-8 flex items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
									<CalendarClock className="size-5" />
								</div>
								<div className="space-y-1">
									<h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
										Meeting Requested by Student
									</h4>
									<p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
										{new Date(
											pendingRequest.date,
										).toLocaleDateString("en-US", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
									</p>
								</div>
							</div>
							<button
								onClick={handleViewPendingRequest}
								className="flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 shrink-0"
							>
								View Request
								<ExternalLink className="size-3" />
							</button>
						</div>
					)}

					<div className="lg:hidden">
						<SidebarContent
							department={department}
							semester={semester}
							academicMetrics={academicMetrics}
							handleScheduleMeeting={handleScheduleMeeting}
							onDownloadReport={onDownloadReport}
						/>
					</div>

					<CollapsibleSection
						title="Academic Journey"
						icon={<Activity className="size-4 text-sky-600" />}
					>
						<AcademicJourneySection
							academicMetrics={academicMetrics}
							sortedGrades={sortedGrades}
						/>
					</CollapsibleSection>

					{academicMetrics.backlogs > 0 && (
						<CollapsibleSection
							title="Backlog Subjects"
							icon={
								<AlertTriangle className="size-4 text-rose-500" />
							}
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{academicMetrics.backlogHistory?.map(
									(subject, idx) => (
										<div
											key={idx}
											className="bg-white dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200/60 dark:border-gray-700 flex flex-col justify-center"
										>
											<div className="flex items-start justify-between gap-4">
												<div className="flex flex-col min-w-0">
													<h5 className="text-md font-bold text-gray-900 dark:text-white truncate">
														{subject.name}
													</h5>
													<div className="flex items-center mt-0.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
														<GraduationCap className="size-3.5 mr-1.5 text-gray-400" />
														Sem {subject.semester}
													</div>
												</div>
												<span className="shrink-0 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider border border-rose-100 dark:border-rose-800">
													{subject.code}
												</span>
											</div>
										</div>
									),
								)}
							</div>
						</CollapsibleSection>
					)}

					<CollapsibleSection
						title="Meetings Log"
						icon={<History className="size-4 text-sky-600" />}
						noPadding
					>
						<MeetingsLogSection
							meetingHistory={meetingHistory}
							onOpenMeetingModal={onOpenMeetingModal}
							onToggleAttendance={onToggleAttendance}
						/>
					</CollapsibleSection>
				</div>

				<aside className="hidden lg:block space-y-6">
					<div className="sticky top-8">
						<SidebarContent
							department={department}
							semester={semester}
							academicMetrics={academicMetrics}
							handleScheduleMeeting={handleScheduleMeeting}
							onDownloadReport={onDownloadReport}
						/>
					</div>
				</aside>
			</div>

			{/* Mobile Bottom Action Bar */}
			<div className="lg:hidden fixed bottom-[72px] left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 p-4 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
				<div className="flex gap-3 max-w-2xl mx-auto">
					<ActionButtons onSchedule={handleScheduleMeeting} />
				</div>
			</div>
		</div>
	);
};

export default StudentDetailsView;
