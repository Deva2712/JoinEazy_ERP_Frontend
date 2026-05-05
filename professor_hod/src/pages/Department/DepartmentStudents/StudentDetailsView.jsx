// src/pages/Department/DepartmentStudents/StudentDetailsView.jsx

import React, { useMemo, useState, useRef } from "react";
import {
	ArrowLeft,
	User,
	Mail,
	Phone,
	Award,
	History,
	ClipboardList,
	Microscope,
	GraduationCap,
	Briefcase,
} from "lucide-react";
import CollapsibleSection from "../../../components/common/CollapsibleSection";
import {
	PlacementCard,
	ResearchItemCard,
	MeetingHistoryCard,
} from "./components/StudentDetailsComponents";
import StudentDetailsSidebar from "./components/StudentDetailsSidebar";
import AcademicJourneySection from "../../Mentoring/components/AcademicJourneySection";
import {
	DesktopQuickNav,
	MobileStickyNav,
} from "../../../components/common/QuickNavigation";

const StudentDetailsView = ({ student, onBack }) => {
	const [sectionTrigger, setSectionTrigger] = useState(null);

	const sectionRefs = {
		academic: useRef(null),
		backlogs: useRef(null),
		placement: useRef(null),
		research: useRef(null),
		mentoring: useRef(null),
	};

	const navItems = [
		{ id: "academic", label: "Academics", icon: Award },
		...(student.academicMetrics?.backlogHistory?.length > 0
			? [{ id: "backlogs", label: "Backlogs", icon: ClipboardList }]
			: []),
		// Dynamic Placement Nav Item
		...(student.placement
			? [{ id: "placement", label: "Placement", icon: Briefcase }]
			: []),
		{ id: "research", label: "Research", icon: Microscope },
		{ id: "mentoring", label: "Mentoring", icon: History },
	];

	const handleQuickNavClick = (id) => {
		setSectionTrigger(id);
		sectionRefs[id].current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
		setTimeout(() => setSectionTrigger(null), 100);
	};

	if (!student) return null;

	const metrics = student.academicMetrics || {};
	const researchData = student.research || { projects: [], publications: [] };

	const sortedGrades = useMemo(() => {
		if (!metrics.semesterGrades) return [];
		return [...metrics.semesterGrades].sort((a, b) => a.sem - b.sem);
	}, [metrics.semesterGrades]);

	const processedMeetingHistory = useMemo(() => {
		if (!student.meetingHistory) return [];

		return student.meetingHistory
			.filter((meeting) => meeting.status !== "Requested")
			.sort((a, b) => new Date(b.date) - new Date(a.date));
	}, [student.meetingHistory]);

	return (
		<div className="relative pb-24 lg:pb-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
			<div className="flex items-start justify-between pb-4">
				<button
					onClick={onBack}
					className="inline-flex items-center gap-2.5 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 font-bold transition-all group rounded-full"
				>
					<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-violet-200 dark:group-hover:border-violet-800 group-hover:shadow-sm transition-all">
						<ArrowLeft className="size-4" />
					</div>
					<span className="text-xs uppercase tracking-widest">
						Return
					</span>
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<div className="lg:col-span-3 space-y-6">
					{/* Main Student Header Card */}
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 md:p-6 flex flex-col md:flex-row items-center md:justify-between">
						<div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
							<div className="size-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/10 text-violet-600 dark:text-violet-400 shadow-inner">
								<User className="size-10" />
							</div>
							<div className="flex flex-col items-center md:items-start text-center md:text-left">
								<div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
									<h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
										{student.name}
									</h3>
									{/* Student Type Badge */}
									{student.studentType && (
										<span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
											{student.studentType}
										</span>
									)}
								</div>
								<p className="text-gray-400 dark:text-gray-500 font-mono text-sm font-bold mt-1">
									{student.studentId}
								</p>
							</div>
						</div>
						<div className="flex flex-col items-center md:items-end gap-2.5 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700">
							<div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
								<Mail className="size-4 text-violet-600" />
								<span className="text-sm font-semibold">
									{student.emailId || student.email}
								</span>
							</div>
							<div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
								<Phone className="size-4 text-violet-600" />
								<span className="text-sm font-semibold">
									{student.phoneNumber ||
										student.phone ||
										"N/A"}
								</span>
							</div>
						</div>
					</div>

					{/* Mobile-only Sidebar Section */}
					<div className="lg:hidden">
						<StudentDetailsSidebar student={student} />
					</div>

					{/* Academic Performance Section */}
					<div ref={sectionRefs.academic} className="scroll-mt-20">
						<CollapsibleSection
							title="Academic Performance"
							icon={<Award className="size-4 text-violet-500" />}
							defaultOpen={true}
							forceOpen={sectionTrigger === "academic"}
							color="violet"
						>
							{sortedGrades.length > 0 && (
								<AcademicJourneySection
									academicMetrics={metrics}
									sortedGrades={sortedGrades}
								/>
							)}
						</CollapsibleSection>
					</div>

					{/* Backlog History Section */}
					{metrics.backlogHistory?.length > 0 && (
						<div
							ref={sectionRefs.backlogs}
							className="scroll-mt-20"
						>
							<CollapsibleSection
								title="Backlog History"
								icon={
									<ClipboardList className="size-4 text-rose-500" />
								}
								defaultOpen={false}
								forceOpen={sectionTrigger === "backlogs"}
								color="rose"
							>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{metrics.backlogHistory?.map(
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
															Sem{" "}
															{subject.semester}
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
						</div>
					)}

					{/* Placement & Internships Section */}
					{student.placement && (
						<div
							ref={sectionRefs.placement}
							className="scroll-mt-20"
						>
							<CollapsibleSection
								title="Placement & Internships"
								icon={
									<Briefcase className="size-4 text-violet-500" />
								}
								defaultOpen={true}
								forceOpen={sectionTrigger === "placement"}
								color="violet"
							>
								<PlacementCard placement={student.placement} />
							</CollapsibleSection>
						</div>
					)}

					{/* Research Work Section */}
					<div ref={sectionRefs.research} className="scroll-mt-20">
						<CollapsibleSection
							title="Research Work"
							icon={
								<Microscope className="size-4 text-violet-500" />
							}
							defaultOpen={false}
							forceOpen={sectionTrigger === "research"}
							color="violet"
						>
							{researchData?.projects?.length > 0 ||
							researchData?.publications?.length > 0 ? (
								<div className="space-y-6">
									{researchData.projects?.length > 0 && (
										<div>
											<h4 className="text-[10px] font-bold uppercase tracking-tight text-gray-400 mb-3">
												Active Projects
											</h4>
											<div className="grid grid-cols-1 gap-3">
												{researchData.projects.map(
													(project, idx) => (
														<ResearchItemCard
															key={idx}
															item={project}
															type="project"
														/>
													),
												)}
											</div>
										</div>
									)}
									{researchData.publications?.length > 0 && (
										<div>
											<h4 className="text-[10px] font-bold uppercase tracking-tight text-gray-400 mb-3">
												Publications
											</h4>
											<div className="grid grid-cols-1 gap-3">
												{researchData.publications.map(
													(publication, idx) => (
														<ResearchItemCard
															key={idx}
															item={publication}
															type="publication"
														/>
													),
												)}
											</div>
										</div>
									)}
								</div>
							) : (
								<div className="text-center py-10 text-gray-500 text-sm italic border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
									No research projects or publications listed.
								</div>
							)}
						</CollapsibleSection>
					</div>

					{/* Mentoring History Section */}
					<div ref={sectionRefs.mentoring} className="scroll-mt-20">
						<CollapsibleSection
							title="Mentoring History"
							icon={
								<History className="size-4 text-violet-500" />
							}
							defaultOpen={false}
							forceOpen={sectionTrigger === "mentoring"}
							color="violet"
						>
							<div className="space-y-3">
								{processedMeetingHistory.length > 0 ? (
									processedMeetingHistory.map((meeting) => (
										<MeetingHistoryCard
											key={meeting.meetingId}
											meeting={meeting}
										/>
									))
								) : (
									<div className="text-center py-10 text-gray-500 text-sm italic border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
										No past mentoring records found.
									</div>
								)}
							</div>
						</CollapsibleSection>
					</div>
				</div>

				{/* Desktop Sidebar */}
				<aside className="hidden lg:block lg:sticky lg:top-8 space-y-6 h-fit">
					<DesktopQuickNav
						navItems={navItems}
						activeId={sectionTrigger}
						onNavClick={handleQuickNavClick}
					/>
					<StudentDetailsSidebar student={student} />
				</aside>
			</div>

			<MobileStickyNav
				navItems={navItems}
				onNavClick={handleQuickNavClick}
			/>
		</div>
	);
};

export default StudentDetailsView;
