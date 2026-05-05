// src/pages/Department/DepartmentOverview/DepartmentOverviewView.jsx

import React, { useState } from "react";
import { Bell, GraduationCap, ChartLine, Users, BookOpen } from "lucide-react";
import { useDepartment } from "../../../context/DepartmentContext";
import { downloadAuditReport } from "../../../utils/reportHelpers";
import {
	MetricCard,
	DepartmentalHealthCard,
	MISReportCard,
} from "./components/OverviewComponents";
import CohortDistributionSection from "./components/CohortDistributionSection";
import DepartmentAlertsSidebar from "./components/DepartmentAlertsSidebar";
import FacultyAttendanceSection from "./components/FacultyAttendanceSection"  ;
import PlacementAnalyticsSection from "./components/PlacementAnalyticsSection";
import ResearchAnalyticsSection from "./components/ResearchAnalyticsSection";

const DepartmentOverviewView = () => {
	const { state } = useDepartment();
	const { deptData, alerts } = state;
	const [isAlertsOpen, setIsAlertsOpen] = useState(false);

	if (!deptData) return null;
	

	return (
		<div className="flex flex-col gap-8 pb-20 lg:pb-0">
			{/* SECTION: Header & Alerts Button */}
			<header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
						Department Overview
					</h2>
					<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
						Real-time operational overview and compliance tracking.
					</p>
				</div>

				<button
					onClick={() => setIsAlertsOpen(true)}
					className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm self-end md:self-auto hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
				>
					<Bell className="size-4 text-violet-600" />
					<span className="text-xs font-bold">Alerts</span>
				</button>
			</header>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
				<div className="lg:col-span-2">
					<DepartmentalHealthCard metrics={deptData.summaryStats} />
				</div>
				<div>
					<MISReportCard
						onDownload={downloadAuditReport}
						data={deptData}
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
				<MetricCard
					label="Total Students"
					value={deptData.summaryStats?.totalStudents?.count}
					Icon={GraduationCap}
				/>
				<MetricCard
					label="Enrollment Trend"
					value={`${deptData.summaryStats?.totalStudents?.trend}%`}
					Icon={ChartLine}
				/>
				<MetricCard
					label="Faculty Size"
					value={deptData.summaryStats?.totalFaculty}
					Icon={Users}
				/>
				<MetricCard
					label="Active Courses"
					value={deptData.summaryStats?.totalCourses}
					Icon={BookOpen}
				/>
			</div>

			{/* Main Content and Sidebar Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column: Analytics, Attendance and Research */}
				<div className="lg:col-span-2 space-y-6">
					<FacultyAttendanceSection
						attendanceData={deptData.facultyAttendanceDetails}
					/>

					<PlacementAnalyticsSection
						placementStats={deptData.placementStats}
					/>

					<ResearchAnalyticsSection
						researchData={deptData.researchOutput}
					/>
				</div>

				{/* Right Column: Sidebar (Cohort Distribution) */}
				<div className="flex flex-col gap-4">
					<CohortDistributionSection
						data={deptData.studentDemographics}
						diversityIndex={
							deptData.summaryStats.genderDiversityIndex
						}
					/>
				</div>
			</div>

			<DepartmentAlertsSidebar
				isOpen={isAlertsOpen}
				onClose={() => setIsAlertsOpen(false)}
				alerts={alerts || []}
			/>
		</div>
	);
};

export default DepartmentOverviewView;
