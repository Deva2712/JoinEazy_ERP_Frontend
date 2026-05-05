// src/pages/Accreditation/AccreditationUI.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	LayoutDashboard, ClipboardCheck, Target, CalendarClock, Building2,
	ArrowLeft, RefreshCw, AlertTriangle, Shield, CheckCircle, AlertCircle,
	FileText, Award, TrendingUp, Clock,
} from "lucide-react";

import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";

const Badge = ({ children, className = "" }) => (
	<span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${className}`}>{children}</span>
);

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
	<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
		<div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}><Icon className={`size-5 ${color}`} /></div>
		<p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
		<p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
	</div>
);

const STATUS_BADGE = {
	Met: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	Partial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
	"Not Met": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
	Achieved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	"At Risk": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
	Accredited: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	"In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
	Preparation: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
	Scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

/* ═══════════ MAIN ═══════════ */
const AccreditationUI = ({ data, activeTab, onTabChange, loading, error, onRefresh }) => {
	const navigate = useNavigate();
	const tabs = [
		{ id: "overview", label: "Overview", icon: LayoutDashboard },
		{ id: "criteria", label: "Criteria", icon: ClipboardCheck },
		{ id: "outcomes", label: "Program Outcomes", icon: Target },
		{ id: "audits", label: "Audits", icon: CalendarClock },
		{ id: "departments", label: "Dept Compliance", icon: Building2 },
	];

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />
			<div className="bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 dark:from-emerald-900 dark:via-green-950 dark:to-teal-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-6 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-5">
						<div className="flex items-center gap-4">
							<button onClick={() => navigate("/dashboard")} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm"><ArrowLeft className="size-5" /></button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Accreditation & Compliance</h1>
								<p className="text-emerald-100/80 text-sm mt-0.5">NBA, NAAC & ABET compliance tracking and audit readiness.</p>
							</div>
						</div>
						{data?.summary && (
							<div className="flex items-center gap-3">
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center"><p className="text-xs text-emerald-200/70 font-medium">Compliance</p><p className="text-lg font-bold">{data.summary.overallCompliance}%</p></div>
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center"><p className="text-xs text-emerald-200/70 font-medium">Criteria Met</p><p className="text-lg font-bold">{data.summary.criteriaMet}/{data.summary.criteriaTotal}</p></div>
							</div>
						)}
					</div>
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{tabs.map((t) => {
							const Icon = t.icon;
							return (
								<button key={t.id} onClick={() => onTabChange(t.id)} className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${activeTab === t.id ? "bg-gray-50 dark:bg-[#0f1117] text-emerald-700 dark:text-emerald-400" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
									<Icon className="w-4 h-4" />{t.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6"><AlertTriangle className="size-10 text-red-600" /></div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
						<p className="text-gray-500 mb-8">{error}</p>
						<button onClick={onRefresh} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold"><RefreshCw className="size-4" />Try Again</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-emerald-500" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Accreditation Data</p>
					</div>
				) : data && (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{activeTab === "overview" && <OverviewTab data={data} />}
						{activeTab === "criteria" && <CriteriaTab items={data.criteria} />}
						{activeTab === "outcomes" && <OutcomesTab items={data.programOutcomes} />}
						{activeTab === "audits" && <AuditsTab data={data} />}
						{activeTab === "departments" && <DeptComplianceTab items={data.complianceByDepartment} />}
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
		{ label: "Overall Compliance", value: `${s.overallCompliance}%`, icon: Shield, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
		{ label: "Active Accreditations", value: s.activeAccreditations, icon: Award, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
		{ label: "Criteria Met", value: `${s.criteriaMet}/${s.criteriaTotal}`, icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
		{ label: "Upcoming Audits", value: s.upcomingAudits, icon: CalendarClock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
		{ label: "Documentation", value: `${s.documentationComplete}%`, icon: FileText, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
		{ label: "Next Audit", value: new Date(s.nextAuditDate).toLocaleDateString(), icon: Clock, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
	];

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{stats.map((s, i) => <StatCard key={i} {...s} />)}
			</div>

			{/* Accreditation Bodies */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Active Accreditations</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{data.accreditations.map((a) => (
						<div key={a.id} className="rounded-2xl border-2 border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
							<div className="flex items-center justify-between mb-3">
								<div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm">{a.body}</div>
								<Badge className={STATUS_BADGE[a.status]}>{a.status}</Badge>
							</div>
							<h4 className="font-bold text-gray-900 dark:text-white text-sm">{a.fullName}</h4>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">{a.programs.join(", ")}</p>
							{a.overallScore != null && (
								<div className="flex items-center justify-between">
									<div>
										<p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{a.overallScore}<span className="text-xs text-gray-400">/{a.maxScore}</span></p>
										<p className="text-[10px] text-gray-400">Score</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{a.tier}</p>
										<p className="text-[10px] text-gray-400">Grade</p>
									</div>
								</div>
							)}
							{a.validFrom && (
								<p className="text-[10px] text-gray-400 mt-2">Valid: {new Date(a.validFrom).toLocaleDateString()} – {new Date(a.validUntil).toLocaleDateString()}</p>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Quick PO attainment */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Program Outcome Attainment</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
					{data.programOutcomes.map((po) => {
						const met = po.attainmentPct >= po.target;
						return (
							<div key={po.id} className={`p-3 rounded-xl border-2 text-center ${met ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10" : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"}`}>
								<p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">{po.id}</p>
								<p className={`text-lg font-bold ${met ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{po.attainmentPct}%</p>
								<p className="text-[9px] text-gray-400 truncate">{po.description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

/* ═══════════ CRITERIA ═══════════ */
const CriteriaTab = ({ items }) => {
	const complianceColor = (v) => v >= 90 ? "bg-green-500" : v >= 80 ? "bg-green-400" : v >= 70 ? "bg-yellow-400" : "bg-red-400";

	return (
		<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-gray-100 dark:border-gray-800">
							{["Criterion", "Framework", "Weight", "Score", "Compliance", "Status"].map((h) => (
								<th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{items.map((c) => (
							<tr key={c.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
								<td className="py-3 px-4 font-bold text-gray-900 dark:text-white">{c.name}</td>
								<td className="py-3 px-4 text-gray-600 dark:text-gray-300">{c.framework}</td>
								<td className="py-3 px-4 text-gray-600 dark:text-gray-300">{c.weight}</td>
								<td className="py-3 px-4 font-bold text-gray-900 dark:text-white">{c.score}/{c.weight}</td>
								<td className="py-3 px-4">
									<div className="flex items-center gap-2">
										<div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
											<div className={`h-full rounded-full ${complianceColor(c.compliance)}`} style={{ width: `${c.compliance}%` }} />
										</div>
										<span className="text-xs font-bold text-gray-900 dark:text-white w-10">{c.compliance}%</span>
									</div>
								</td>
								<td className="py-3 px-4"><Badge className={STATUS_BADGE[c.status]}>{c.status}</Badge></td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

/* ═══════════ PROGRAM OUTCOMES ═══════════ */
const OutcomesTab = ({ items }) => (
	<div className="space-y-4">
		{items.map((po) => {
			const met = po.attainmentPct >= po.target;
			const pct = Math.min(po.attainmentPct, 100);
			return (
				<div key={po.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-3">
							<div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${met ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>{po.id.replace("PO-", "")}</div>
							<div>
								<h3 className="font-bold text-gray-900 dark:text-white">{po.description}</h3>
								<p className="text-xs text-gray-500 dark:text-gray-400">Target: {po.target}%</p>
							</div>
						</div>
						<div className="text-right">
							<p className={`text-xl font-bold ${met ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{po.attainmentPct}%</p>
							<Badge className={STATUS_BADGE[po.status]}>{po.status}</Badge>
						</div>
					</div>
					<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<div className={`h-full rounded-full transition-all duration-700 ${met ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${pct}%` }}>
							<div className="h-full bg-white/20 rounded-full" style={{ width: `${(po.target / pct) * 100}%`, borderRight: "2px dashed rgba(0,0,0,0.3)" }} />
						</div>
					</div>
					<div className="flex justify-between mt-1">
						<span className="text-[10px] text-gray-400">0%</span>
						<span className="text-[10px] text-gray-400">Target: {po.target}%</span>
						<span className="text-[10px] text-gray-400">100%</span>
					</div>
				</div>
			);
		})}
	</div>
);

/* ═══════════ AUDITS ═══════════ */
const AuditsTab = ({ data }) => (
	<div className="space-y-4">
		{data.upcomingAudits.map((a) => (
			<div key={a.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border-2 border-amber-200 dark:border-amber-800 p-6 hover:shadow-lg transition-all">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold">{a.body}</div>
						<div>
							<h3 className="font-bold text-gray-900 dark:text-white">{a.type}</h3>
							<p className="text-xs text-gray-500 dark:text-gray-400">{a.programs.join(", ")}</p>
						</div>
					</div>
					<Badge className={STATUS_BADGE[a.status]}>{a.status}</Badge>
				</div>

				<div className="grid grid-cols-3 gap-4 mb-4">
					<div className="text-center px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
						<p className="text-lg font-bold text-gray-900 dark:text-white">{new Date(a.date).toLocaleDateString()}</p>
						<p className="text-[10px] text-gray-500">Audit Date</p>
					</div>
					<div className="text-center px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
						<p className="text-lg font-bold text-amber-700 dark:text-amber-400">{a.daysRemaining}</p>
						<p className="text-[10px] text-gray-500">Days Left</p>
					</div>
					<div className="text-center px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
						<p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{a.readinessPct}%</p>
						<p className="text-[10px] text-gray-500">Readiness</p>
					</div>
				</div>

				<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
					<div className={`h-full rounded-full transition-all duration-700 ${a.readinessPct >= 80 ? "bg-green-500" : a.readinessPct >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${a.readinessPct}%` }} />
				</div>
				<p className="text-[10px] text-gray-400 mt-1 text-right">Readiness: {a.readinessPct}%</p>
			</div>
		))}

		{/* Last audit info */}
		<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
			<p className="text-xs text-gray-500 dark:text-gray-400">Last audit was on <span className="font-bold text-gray-900 dark:text-white">{new Date(data.summary.lastAuditDate).toLocaleDateString()}</span></p>
		</div>
	</div>
);

/* ═══════════ DEPT COMPLIANCE ═══════════ */
const DeptComplianceTab = ({ items }) => {
	const barColor = (v) => v >= 90 ? "bg-green-500" : v >= 80 ? "bg-green-400" : v >= 70 ? "bg-yellow-400" : "bg-red-400";

	return (
		<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-gray-100 dark:border-gray-800">
							{["Department", "Internship", "Outcome Mapping", "Documentation", "Faculty Qual.", "Overall"].map((h) => (
								<th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{items.map((d) => (
							<tr key={d.department} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
								<td className="py-3 px-4 font-bold text-gray-900 dark:text-white">{d.department}</td>
								{[d.internshipCompliance, d.outcomeMapping, d.documentComplete, d.facultyQualified].map((v, i) => (
									<td key={i} className="py-3 px-4">
										<div className="flex items-center gap-2">
											<div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
												<div className={`h-full rounded-full ${barColor(v)}`} style={{ width: `${v}%` }} />
											</div>
											<span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-10">{v}%</span>
										</div>
									</td>
								))}
								<td className="py-3 px-4">
									<span className={`text-sm font-bold ${d.overallPct >= 90 ? "text-green-600 dark:text-green-400" : d.overallPct >= 80 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>{d.overallPct}%</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AccreditationUI;
