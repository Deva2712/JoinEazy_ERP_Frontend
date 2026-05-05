// src/pages/Department/DepartmentOverview/DepartmentOverviewView.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	Briefcase,
	FlaskConical,
	Download,
	ArrowUpRight,
	X,
	Bell,
	CircleAlert,
	Award,
	ChartNoAxesCombined,
	FileBadge,
	Circle,
} from "lucide-react";

import { useDepartment } from "../../../context/DepartmentContext";
import CollapsibleSection from "../../../components/common/CollapsibleSection";
import {
	SidebarStats,
	MetricCard,
} from "./components/OverviewComponents";
import CohortDistributionSection from "./components/CohortDistributionSection";

/**
 * Main dashboard view for department overview.
 * Manages alert states and displays high-level analytics for placements and research.
 */
const DepartmentOverviewView = () => {
	const { state, actions } = useDepartment();
	const { deptData } = state;
	const { downloadAuditReport } = actions;
	const [activeAlertId, setActiveAlertId] = useState(null);

	if (!deptData) return null;

	const activeAlert = deptData.quickAlerts?.find(
		(a) => a.id === activeAlertId,
	);
	const circumference = 502.6;

	const severityTheme = {
		high: {
			icon: "text-rose-500",
			bg: "from-rose-500 to-rose-600 dark:from-rose-600 dark:to-rose-800",
			border: "border-rose-100 dark:border-rose-900/30",
		},
		medium: {
			icon: "text-amber-500",
			bg: "from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-800",
			border: "border-amber-100 dark:border-amber-900/30",
		},
		low: {
			icon: "text-violet-500",
			bg: "from-violet-500 to-indigo-600 dark:from-violet-600 dark:to-indigo-800",
			border: "border-violet-100 dark:border-violet-900/30",
		},
	};

	const formatType = (type) =>
		type
			.toLowerCase()
			.split("_")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ");

	return (
		<div className="relative">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<div className="lg:col-span-3 flex flex-col gap-6">
					{/* Mobile Sidebar Stats (Visible only on small screens) */}
					<div className="lg:hidden pb-2">
						<SidebarStats
							data={deptData.summaryStats}
							onDownloadAudit={downloadAuditReport}
						/>
					</div>

					{/* Dynamic Alerts System */}
					<div className="space-y-4">
						<div className="flex items-center gap-3 mb-2 px-2">
							<Bell className="size-4 text-gray-400" />
							<h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
								Alerts
							</h4>
						</div>

						{/* Alert Selection Buttons */}
						<div className="flex flex-wrap gap-3">
							{deptData.quickAlerts?.map((alert) => (
								<button
									key={alert.id}
									onClick={() =>
										setActiveAlertId(
											activeAlertId === alert.id
												? null
												: alert.id,
										)
									}
									className={`px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5 shadow-sm
										${
											activeAlertId === alert.id
												? "bg-gray-900 border-gray-900 text-white dark:bg-white dark:text-gray-900"
												: `bg-white dark:bg-[#1a1d26] ${severityTheme[alert.severity].border} text-gray-500 hover:border-gray-400`
										}`}
								>
									<Circle
										className={`size-2 fill-current ${severityTheme[alert.severity].icon}`}
									/>
									{formatType(alert.type)}
								</button>
							))}
						</div>

						{/* Expanded Alert Detail Card */}
						{activeAlert && (
							<div className="animate-in slide-in-from-left-4 fade-in duration-300">
								<div className="relative overflow-hidden p-6 bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
									<div className="relative flex items-start justify-between">
										<div className="space-y-2">
											<div
												className={`flex items-center gap-2 ${severityTheme[activeAlert.severity].icon}`}
											>
												<CircleAlert className="size-4" />
												<p className="text-[10px] font-black uppercase tracking-[0.2em]">
													{activeAlert.severity}{" "}
													Priority Alert
												</p>
											</div>
											<h3 className="text-xl font-black tracking-tight uppercase">
												{formatType(activeAlert.type)}
											</h3>
											<p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-relaxed italic">
												{activeAlert.message}
											</p>
										</div>
										<button
											onClick={() =>
												setActiveAlertId(null)
											}
											className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 font-bold transition-all group rounded-full"
										>
											<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-violet-200 dark:group-hover:border-violet-800 group-hover:shadow-sm transition-all">
												<X className="size-4" />
											</div>
										</button>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Mobile Cohort Stats (Visible only on small screens) */}
					<div className="lg:hidden">
						<CohortDistributionSection
							data={deptData.studentDemographics}
						/>
					</div>

					{/* Placement Analytics with Radial Progress */}
					<CollapsibleSection
						title="Placement Analytics"
						icon={<Briefcase className="size-4 text-violet-600" />}
					>
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
							{/* Radial Progress Chart */}
							<div className="lg:col-span-4 flex flex-col items-center justify-center border-r border-gray-100 dark:border-gray-800">
								<div className="relative size-44">
									<svg className="size-full -rotate-90">
										<circle
											cx="88"
											cy="88"
											r="80"
											fill="transparent"
											stroke="currentColor"
											strokeWidth="10"
											className="text-gray-100 dark:text-gray-800"
										/>
										<motion.circle
											cx="88"
											cy="88"
											r="80"
											fill="transparent"
											stroke="currentColor"
											strokeWidth="12"
											strokeDasharray={circumference}
											initial={{
												strokeDashoffset: circumference,
											}}
											animate={{
												strokeDashoffset:
													circumference -
													(circumference *
														deptData.placementStats
															?.placedPercentage) /
														100,
											}}
											transition={{
												duration: 1.5,
												ease: "easeOut",
											}}
											strokeLinecap="round"
											className="text-violet-600 dark:text-violet-500"
										/>
									</svg>
									<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
										<span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
											{
												deptData.placementStats
													?.placedPercentage
											}
											%
										</span>
										<span className="flex items-end gap-1 font-black mt-1">
											<p className="text-gray-900 dark:text-white text-sm">
												{
													deptData.placementStats
														?.placedCount
												}
											</p>
											<p className="text-xs text-gray-400 uppercase tracking-widest ">
												/{" "}
												{
													deptData.placementStats
														?.eligibleStudents
												}
											</p>
										</span>
										<p className="text-[8px] font-black text-violet-500 uppercase tracking-widest">
											Students Placed
										</p>
									</div>
								</div>
							</div>

							{/* Placement Metric Highlights */}
							<div className="lg:col-span-8 flex flex-col gap-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<MetricCard
										Icon={ArrowUpRight}
										label="Highest Package"
										value={`₹${deptData.placementStats?.highestPackageLpa}`}
										unit="LPA"
										color="violet"
										highlight
									/>
									<MetricCard
										Icon={ChartNoAxesCombined}
										label="Average Package"
										value={`₹${deptData.placementStats?.averagePackageLpa}`}
										unit="LPA"
										color="violet"
									/>
								</div>
								<Link
									to="/department/placements"
									className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 dark:bg-[#0f1117] text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-100 dark:border-gray-700/50"
								>
									View Detailed Analytics
									<ArrowUpRight className="size-3" />
								</Link>
							</div>
						</div>
					</CollapsibleSection>

					{/* Research & Grant Funding Overview */}
					<CollapsibleSection
						title="Research & Funding"
						icon={
							<FlaskConical className="size-4 text-emerald-600" />
						}
					>
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
							{/* Funding Totals and Active/Pending Counts */}
							<div className="lg:col-span-4 flex flex-col items-center justify-center py-4 border-r border-gray-100 dark:border-gray-800 text-center">
								<p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
									Total Funding
								</p>
								<h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
									₹{deptData.researchOutput?.totalValueRupee}
								</h3>
								<div className="mt-4 flex gap-6">
									<div>
										<p className="text-[9px] font-black text-emerald-500 uppercase">
											Active
										</p>
										<p className="text-lg font-black text-emerald-600">
											{
												deptData.researchOutput
													?.totalActiveGrants
											}
										</p>
									</div>
									<div>
										<p className="text-[9px] font-black text-gray-400 uppercase">
											Pending
										</p>
										<p className="text-lg font-black text-gray-900 dark:text-white">
											{
												deptData.researchOutput
													?.pendingProposals
											}
										</p>
									</div>
								</div>
							</div>

							{/* Research Publication Metrics */}
							<div className="lg:col-span-8 flex flex-col gap-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<MetricCard
										Icon={Award}
										label="Total Citations"
										value={
											deptData.researchOutput
												?.citationsTotal
										}
										unit=""
										color="emerald"
										highlight
									/>
									<MetricCard
										Icon={FileBadge}
										label="Annual Publications"
										value={
											deptData.researchOutput
												?.publicationsThisYear
										}
										unit=""
										color="emerald"
									/>
								</div>
								<Link
									to="/department/research"
									className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 dark:bg-[#0f1117] text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-100 dark:border-gray-700/50"
								>
									View Research Details
									<ArrowUpRight className="size-3" />
								</Link>
							</div>
						</div>
					</CollapsibleSection>
				</div>

				{/* Desktop Sidebar (Fixed position summary stats) */}
				<aside className="hidden lg:block sticky top-8 space-y-6">
					<SidebarStats
						data={deptData.summaryStats}
						onDownloadAudit={downloadAuditReport}
					/>
					<CohortDistributionSection
						data={deptData.studentDemographics}
					/>
				</aside>
			</div>

			{/* Sticky Mobile Action Bar (Footer action for export) */}
			<div className="lg:hidden fixed bottom-[72px] left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
				<div className="max-w-2xl mx-auto">
					<button
						onClick={downloadAuditReport}
						className="w-full bg-gradient-to-br from-violet-600 to-indigo-700 dark:from-violet-800 dark:to-indigo-900 text-white px-6 py-4 rounded-2xl font-black text-xs shadow-lg shadow-violet-200 dark:shadow-none transition-all uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95"
					>
						<Download className="size-4" /> Export Audit Report
					</button>
				</div>
			</div>
		</div>
	);
};

export default DepartmentOverviewView;
