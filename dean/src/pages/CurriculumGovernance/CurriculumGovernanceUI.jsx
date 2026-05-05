// src/pages/CurriculumGovernance/CurriculumGovernanceUI.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	LayoutDashboard, GitPullRequest, Target, BookOpen, ShieldCheck,
	ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, Clock,
	ChevronDown, ChevronUp, Info, ExternalLink, Layers, BarChart2,
} from "lucide-react";

import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";

/* ─── Shared primitives ─── */
const Badge = ({ children, className = "" }) => (
	<span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${className}`}>{children}</span>
);

const StatCard = ({ label, value, icon: Icon, color, bg, sub }) => (
	<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
		<div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
			<Icon className={`size-5 ${color}`} />
		</div>
		<p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
		<p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
		{sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
	</div>
);

const WORKFLOW_STAGES = ["HOD Review", "Dean Review", "Academic Council", "Board Approval", "Approved"];
const STAGE_BADGE = {
	"HOD Review":       "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
	"Dean Review":      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
	"Academic Council": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
	"Board Approval":   "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
	"Approved":         "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

const TYPE_COLORS = {
	"New Elective":       "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800",
	"New Core":           "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
	"Curriculum Revision":"bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
	"Course Removal":     "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
	"New Lab":            "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800",
};

const COMPLIANCE_BADGE = {
	"Met":      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	"Partial":  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
	"At Risk":  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const CONTRIBUTION_DOT = {
	"High":   "bg-green-500",
	"Medium": "bg-amber-500",
	"Low":    "bg-red-400",
};

/* ─── MAIN COMPONENT ─── */
const CurriculumGovernanceUI = ({ data, activeTab, onTabChange, loading, error, onRefresh }) => {
	const navigate = useNavigate();

	const tabs = [
		{ id: "overview",     label: "Overview",          icon: LayoutDashboard },
		{ id: "workflows",    label: "Approval Workflows", icon: GitPullRequest },
		{ id: "po-mapping",   label: "PO Mapping",         icon: Target },
		{ id: "co-alignment", label: "CO Alignment",       icon: BookOpen },
		{ id: "compliance",   label: "Accreditation Sync", icon: ShieldCheck },
	];

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />

			{/* ── Gradient Header ── */}
			<div className="bg-gradient-to-br from-sky-600 via-cyan-700 to-blue-800 dark:from-sky-900 dark:via-cyan-950 dark:to-blue-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-6 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-5">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/dashboard")}
								className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm"
							>
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Curriculum Governance Engine</h1>
								<p className="text-sky-200/80 text-sm mt-0.5">
									Approval workflows, PO/CO mapping &amp; accreditation compliance sync.
								</p>
							</div>
						</div>
						{data?.summary && (
							<div className="flex items-center gap-3">
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center">
									<p className="text-xs text-sky-200/70 font-medium">Pending</p>
									<p className="text-lg font-bold">{data.summary.pendingApprovals}</p>
								</div>
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center">
									<p className="text-xs text-sky-200/70 font-medium">CO Attainment</p>
									<p className="text-lg font-bold">{data.summary.avgCOAttainment}%</p>
								</div>
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center">
									<p className="text-xs text-sky-200/70 font-medium">Compliance</p>
									<p className="text-lg font-bold">{data.summary.compliancePct}%</p>
								</div>
							</div>
						)}
					</div>

					{/* Tab bar */}
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{tabs.map((t) => {
							const Icon = t.icon;
							return (
								<button
									key={t.id}
									onClick={() => onTabChange(t.id)}
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										activeTab === t.id
											? "bg-gray-50 dark:bg-[#0f1117] text-sky-700 dark:text-sky-400"
											: "text-white/70 hover:text-white hover:bg-white/10"
									}`}
								>
									<Icon className="w-4 h-4" />
									{t.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* ── Content ── */}
			<main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
						<p className="text-gray-500 mb-8">{error}</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-xl font-bold"
						>
							<RefreshCw className="size-4" /> Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-sky-500" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Curriculum Data…</p>
					</div>
				) : data && (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{activeTab === "overview"     && <OverviewTab data={data} />}
						{activeTab === "workflows"    && <WorkflowsTab workflows={data.workflows} />}
						{activeTab === "po-mapping"   && <POMappingTab poMapping={data.poMapping} />}
						{activeTab === "co-alignment" && <COAlignmentTab coAlignment={data.coAlignment} />}
						{activeTab === "compliance"   && <ComplianceTab items={data.accreditationSync} />}
					</div>
				)}
			</main>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

/* ═══════════ OVERVIEW ═══════════ */
const OverviewTab = ({ data }) => {
	const { summary: s } = data;
	const stats = [
		{ label: "Pending Approvals", value: s.pendingApprovals, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
		{ label: "Approved This Year", value: s.approvedThisYear, icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
		{ label: "Total POs", value: s.totalPOs, icon: Target, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-900/20" },
		{ label: "Mapped COs", value: s.mappedCOs, icon: BookOpen, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
		{ label: "Avg CO Attainment", value: `${s.avgCOAttainment}%`, icon: BarChart2, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
		{ label: "Accreditation Sync", value: `${s.compliancePct}%`, icon: ShieldCheck, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/20" },
	];

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{stats.map((s, i) => <StatCard key={i} {...s} />)}
			</div>

			{/* Notice Banner */}
			<div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl p-4 flex items-start gap-3">
				<Info className="size-4 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
				<p className="text-sm text-sky-700 dark:text-sky-300">
					<strong>Scope:</strong> This engine governs curriculum design, PO/CO mapping, and accreditation alignment.
					It does not store assignments, attendance, or grades — only outcome-level attainment data is tracked here.
				</p>
			</div>

			{/* Pending Workflows */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Pending Approval Workflows</h3>
				<div className="space-y-3">
					{data.workflows.filter(w => w.stage !== "Approved").map((w) => (
						<div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
							<div className="flex items-center gap-3">
								<div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold border ${TYPE_COLORS[w.type]}`}>
									<GitPullRequest className="size-4" />
								</div>
								<div>
									<p className="text-sm font-bold text-gray-900 dark:text-white">{w.title}</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">{w.submittedBy} · {w.dept}</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{w.daysInStage > 7 && (
									<span className="text-xs text-red-500 font-bold">{w.daysInStage}d</span>
								)}
								<Badge className={STAGE_BADGE[w.stage]}>{w.stage}</Badge>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Compliance quick view */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Accreditation Sync Overview</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					{data.accreditationSync.map((aSync) => (
						<div key={`${aSync.framework}-${aSync.criteria}`} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800">
							<div className="flex items-center justify-between mb-2">
								<span className="px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 rounded text-xs font-bold text-sky-700 dark:text-sky-400">{aSync.framework}</span>
								<Badge className={COMPLIANCE_BADGE[aSync.status]}>{aSync.status}</Badge>
							</div>
							<p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 line-clamp-2">{aSync.criteria}</p>
							<div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
								<div
									className={`h-full rounded-full ${aSync.coveragePct >= 85 ? "bg-green-500" : aSync.coveragePct >= 70 ? "bg-amber-500" : "bg-red-400"}`}
									style={{ width: `${aSync.coveragePct}%` }}
								/>
							</div>
							<p className="text-right text-[10px] text-gray-400 mt-1">{aSync.coveragePct}%</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

/* ═══════════ WORKFLOWS ═══════════ */
const WorkflowsTab = ({ workflows }) => {
	const [expandedId, setExpandedId] = useState(null);

	return (
		<div className="space-y-4">
			{/* Stage pipeline count header */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-2">
				{WORKFLOW_STAGES.map((stage) => {
					const count = workflows.filter(w => w.stage === stage).length;
					return (
						<div key={stage} className="bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-center">
							<p className={`text-xl font-bold ${count > 0 ? "text-sky-600 dark:text-sky-400" : "text-gray-400"}`}>{count}</p>
							<p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 leading-tight">{stage}</p>
						</div>
					);
				})}
			</div>

			{workflows.map((w) => {
				const expanded = expandedId === w.id;
				const stageIdx = WORKFLOW_STAGES.indexOf(w.stage);
				return (
					<div key={w.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all">
						<div className="p-5">
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-start gap-3">
									<div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold border ${TYPE_COLORS[w.type] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
										<GitPullRequest className="size-4" />
									</div>
									<div>
										<h3 className="font-bold text-gray-900 dark:text-white">{w.title}</h3>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
											{w.submittedBy} · <span className="font-medium">{w.dept}</span>
										</p>
										<span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${TYPE_COLORS[w.type]}`}>
											{w.type}
										</span>
									</div>
								</div>
								<div className="flex flex-col items-end gap-1.5">
									<Badge className={STAGE_BADGE[w.stage]}>{w.stage}</Badge>
									{w.daysInStage > 0 && (
										<span className={`text-[10px] font-bold ${w.daysInStage > 7 ? "text-red-500" : "text-gray-400"}`}>
											{w.daysInStage}d in stage
										</span>
									)}
								</div>
							</div>

							{/* Stage progress */}
							<div className="flex items-center gap-1 mb-1">
								{WORKFLOW_STAGES.map((s, i) => (
									<div key={s} className={`flex-1 h-1.5 rounded-full ${i <= stageIdx ? "bg-sky-500 dark:bg-sky-400" : "bg-gray-200 dark:bg-gray-700"}`} />
								))}
							</div>
							<div className="flex justify-between text-[9px] text-gray-400 mb-3">
								{WORKFLOW_STAGES.map(s => <span key={s} className="truncate">{s.split(" ")[0]}</span>)}
							</div>

							<button
								onClick={() => setExpandedId(expanded ? null : w.id)}
								className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-800 transition-colors"
							>
								{expanded ? <><ChevronUp className="size-3.5" />Less</> : <><ChevronDown className="size-3.5" />Details</>}
							</button>
						</div>

						{expanded && (
							<div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-b-2xl animate-in fade-in slide-in-from-top-1 duration-200">
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
									<div className="px-3 py-2 bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800">
										<p className="text-xs text-gray-500 dark:text-gray-400">Submitted Date</p>
										<p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(w.submittedDate).toLocaleDateString()}</p>
									</div>
									<div className="px-3 py-2 bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800">
										<p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
										<p className="text-sm font-bold text-gray-900 dark:text-white">{w.dept}</p>
									</div>
									<div className="px-3 py-2 bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800">
										<p className="text-xs text-gray-500 dark:text-gray-400">Change Type</p>
										<p className="text-sm font-bold text-gray-900 dark:text-white">{w.type}</p>
									</div>
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

/* ═══════════ PO MAPPING ═══════════ */
const POMappingTab = ({ poMapping }) => {
	const [expandedPO, setExpandedPO] = useState(null);

	return (
		<div className="space-y-4">
			<div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl p-4 flex items-start gap-3">
				<Info className="size-4 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
				<p className="text-sm text-sky-700 dark:text-sky-300">
					Each Program Outcome (PO) is mapped to the Course Outcomes (COs) that contribute to achieving it. Contribution levels: <strong>High</strong>, <strong>Medium</strong>, or <strong>Low</strong>.
				</p>
			</div>

			{poMapping.map((po) => {
				const expanded = expandedPO === po.poId;
				return (
					<div key={po.poId} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all">
						<button
							className="w-full p-5 text-left"
							onClick={() => setExpandedPO(expanded ? null : po.poId)}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center font-bold text-sky-700 dark:text-sky-400 text-sm">
										{po.poId}
									</div>
									<div className="text-left">
										<h3 className="font-bold text-gray-900 dark:text-white">{po.description}</h3>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{po.linkedCOs.length} mapped courses</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="flex gap-1">
										{po.linkedCOs.map((co) => (
											<div key={co.courseCode} title={co.courseCode} className={`w-2.5 h-2.5 rounded-full ${CONTRIBUTION_DOT[co.contribution]}`} />
										))}
									</div>
									{expanded ? <ChevronUp className="size-4 text-gray-400" /> : <ChevronDown className="size-4 text-gray-400" />}
								</div>
							</div>
						</button>

						{expanded && (
							<div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50/50 dark:bg-gray-800/20 animate-in fade-in slide-in-from-top-1 duration-200">
								<div className="space-y-2">
									{po.linkedCOs.map((co) => (
										<div key={co.courseCode} className="flex items-center justify-between p-3 bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800">
											<div className="flex items-center gap-2">
												<span className="px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 rounded text-xs font-bold text-sky-700 dark:text-sky-400">{co.courseCode}</span>
												<span className="text-sm text-gray-700 dark:text-gray-300">{co.courseName}</span>
											</div>
											<div className="flex items-center gap-1.5">
												<div className={`w-2.5 h-2.5 rounded-full ${CONTRIBUTION_DOT[co.contribution]}`} />
												<span className={`text-xs font-bold ${
													co.contribution === "High" ? "text-green-600 dark:text-green-400" :
													co.contribution === "Medium" ? "text-amber-600 dark:text-amber-400" :
													"text-red-500"
												}`}>{co.contribution}</span>
											</div>
										</div>
									))}
								</div>

								{/* Contribution legend */}
								<div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
									<p className="text-[10px] text-gray-400 font-bold">CONTRIBUTION:</p>
									{["High", "Medium", "Low"].map(l => (
										<div key={l} className="flex items-center gap-1">
											<div className={`w-2 h-2 rounded-full ${CONTRIBUTION_DOT[l]}`} />
											<span className="text-[10px] text-gray-500 dark:text-gray-400">{l}</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

/* ═══════════ CO ALIGNMENT ═══════════ */
const COAlignmentTab = ({ coAlignment }) => {
	const [expandedCourse, setExpandedCourse] = useState(null);

	const avgAttainment = (cos) =>
		Math.round(cos.reduce((s, c) => s + c.attainmentPct, 0) / cos.length);

	return (
		<div className="space-y-4">
			<div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl p-4 flex items-start gap-3">
				<Info className="size-4 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
				<p className="text-sm text-sky-700 dark:text-sky-300">
					Course Outcome attainment is tracked at the outcome level only — no raw grades or attendance data. Attainment is sourced from aggregated semester results.
				</p>
			</div>

			{coAlignment.map((course) => {
				const expanded = expandedCourse === course.courseCode;
				const avg = avgAttainment(course.cos);
				const allMet = course.cos.every(c => c.attainmentPct >= c.target);

				return (
					<div key={course.courseCode} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all">
						<button
							className="w-full p-5 text-left"
							onClick={() => setExpandedCourse(expanded ? null : course.courseCode)}
						>
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-3 min-w-0">
									<div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[10px] shrink-0 ${
										allMet ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
											    : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
									}`}>
										{course.courseCode}
									</div>
									<div className="min-w-0">
										<h3 className="font-bold text-gray-900 dark:text-white truncate">{course.courseName}</h3>
										<p className="text-xs text-gray-500 dark:text-gray-400">{course.dept} · {course.cos.length} outcomes</p>
									</div>
								</div>
								<div className="flex items-center gap-3 shrink-0">
									<div className="text-right">
										<p className={`text-lg font-bold ${avg >= 75 ? "text-green-600 dark:text-green-400" : avg >= 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>{avg}%</p>
										<p className="text-[10px] text-gray-400">avg attainment</p>
									</div>
									{expanded ? <ChevronUp className="size-4 text-gray-400" /> : <ChevronDown className="size-4 text-gray-400" />}
								</div>
							</div>
						</button>

						{expanded && (
							<div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50/50 dark:bg-gray-800/20 animate-in fade-in slide-in-from-top-1 duration-200 space-y-3">
								{course.cos.map((co) => {
									const met = co.attainmentPct >= co.target;
									const pct = Math.min(co.attainmentPct, 100);
									return (
										<div key={co.id} className="bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800 p-4">
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center gap-2">
													<span className={`px-2 py-0.5 rounded text-xs font-bold ${met ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>{co.id}</span>
													<span className="text-sm text-gray-700 dark:text-gray-300">{co.description}</span>
												</div>
												<div className="flex items-center gap-2 shrink-0">
													<span className="text-xs text-gray-400">Target: {co.target}%</span>
													<span className={`text-sm font-bold ${met ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{co.attainmentPct}%</span>
												</div>
											</div>
											<div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
												<div
													className={`h-full rounded-full transition-all duration-700 ${met ? "bg-green-500" : "bg-red-400"}`}
													style={{ width: `${pct}%` }}
												/>
												{/* Target marker */}
												<div
													className="absolute top-0 h-full w-0.5 bg-gray-600 dark:bg-gray-400 opacity-50"
													style={{ left: `${co.target}%` }}
												/>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

/* ═══════════ ACCREDITATION SYNC ═══════════ */
const ComplianceTab = ({ items }) => {
	const frameworks = [...new Set(items.map(i => i.framework))];

	return (
		<div className="space-y-8">
			<div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl p-4 flex items-start gap-3">
				<Info className="size-4 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
				<p className="text-sm text-sky-700 dark:text-sky-300">
					This tab maps Program Outcomes (POs) to specific accreditation framework criteria. For full accreditation audit management, visit the{" "}
					<span className="font-bold underline cursor-pointer">Accreditation &amp; Compliance</span> module.
				</p>
			</div>

			{frameworks.map((fw) => {
				const fwItems = items.filter(i => i.framework === fw);
				const fwColor = fw === "NBA" ? "sky" : fw === "NAAC" ? "indigo" : "violet";
				return (
					<div key={fw}>
						<div className="flex items-center gap-3 mb-4">
							<div className={`px-3 py-1 bg-${fwColor}-100 dark:bg-${fwColor}-900/30 rounded-lg`}>
								<span className={`font-bold text-sm text-${fwColor}-700 dark:text-${fwColor}-400`}>{fw}</span>
							</div>
							<div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
						</div>

						<div className="space-y-3">
							{fwItems.map((item) => (
								<div key={`${item.framework}-${item.criteria}`} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
									<div className="flex items-start justify-between mb-3">
										<div className="min-w-0 flex-1">
											<h3 className="font-bold text-gray-900 dark:text-white text-sm">{item.criteria}</h3>
											<div className="flex flex-wrap gap-1 mt-2">
												{item.linkedPOs.map(po => (
													<span key={po} className="px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 rounded text-[10px] font-bold text-sky-700 dark:text-sky-400">{po}</span>
												))}
											</div>
										</div>
										<Badge className={COMPLIANCE_BADGE[item.status]}>{item.status}</Badge>
									</div>

									<div className="flex items-center gap-3">
										<div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
											<div
												className={`h-full rounded-full transition-all duration-700 ${
													item.coveragePct >= 85 ? "bg-green-500" :
													item.coveragePct >= 70 ? "bg-amber-500" : "bg-red-400"
												}`}
												style={{ width: `${item.coveragePct}%` }}
											/>
										</div>
										<span className={`text-sm font-bold w-10 text-right ${
											item.coveragePct >= 85 ? "text-green-600 dark:text-green-400" :
											item.coveragePct >= 70 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
										}`}>{item.coveragePct}%</span>
									</div>
									<div className="flex justify-between text-[10px] text-gray-400 mt-1">
										<span>{item.linkedPOs.length} POs linked</span>
										<span>Coverage</span>
									</div>
								</div>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default CurriculumGovernanceUI;
