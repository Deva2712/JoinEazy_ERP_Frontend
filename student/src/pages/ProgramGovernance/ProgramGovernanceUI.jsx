// src/pages/ProgramGovernance/ProgramGovernanceUI.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	LayoutDashboard, GitBranch, Users, Share2, TrendingUp,
	ArrowLeft, RefreshCw, AlertTriangle, GraduationCap, BookOpen,
	CheckCircle, Clock, Rocket, XCircle, BarChart2, ArrowUpRight,
	ArrowDownRight, Minus, Info, ChevronDown, ChevronUp,
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

const STAGE_ORDER = ["Proposal", "Review", "Approval", "Launch"];
const STAGE_COLORS = {
	Proposal: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
	Review: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
	Approval: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
	Launch: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	Active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
	Launching: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
	Discontinued: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

/* ─── MAIN COMPONENT ─── */
const ProgramGovernanceUI = ({ data, activeTab, onTabChange, loading, error, onRefresh }) => {
	const navigate = useNavigate();

	const tabs = [
		{ id: "overview", label: "Overview", icon: LayoutDashboard },
		{ id: "lifecycle", label: "Program Lifecycle", icon: GitBranch },
		{ id: "intake", label: "Intake Control", icon: Users },
		{ id: "interdisciplinary", label: "Interdisciplinary", icon: Share2 },
		{ id: "insights", label: "Insights", icon: TrendingUp },
	];

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />

			{/* ── Gradient Header ── */}
			<div className="bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800 dark:from-indigo-900 dark:via-violet-950 dark:to-purple-950 text-white">
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
								<h1 className="text-2xl font-bold tracking-tight">Academic Program Governance</h1>
								<p className="text-indigo-200/80 text-sm mt-0.5">
									Degree program lifecycle, intake capacity &amp; demand insights.
								</p>
							</div>
						</div>
						{data?.summary && (
							<div className="flex items-center gap-3">
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center">
									<p className="text-xs text-indigo-200/70 font-medium">Programs</p>
									<p className="text-lg font-bold">{data.summary.totalPrograms}</p>
								</div>
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center">
									<p className="text-xs text-indigo-200/70 font-medium">Proposals</p>
									<p className="text-lg font-bold">{data.summary.activeProposals}</p>
								</div>
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center">
									<p className="text-xs text-indigo-200/70 font-medium">Avg Fill</p>
									<p className="text-lg font-bold">{data.summary.avgIntakeFill}%</p>
								</div>
							</div>
						)}
					</div>

					{/* Tab Bar */}
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{tabs.map((t) => {
							const Icon = t.icon;
							return (
								<button
									key={t.id}
									onClick={() => onTabChange(t.id)}
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										activeTab === t.id
											? "bg-gray-50 dark:bg-[#0f1117] text-indigo-700 dark:text-indigo-400"
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
							className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold"
						>
							<RefreshCw className="size-4" /> Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-indigo-500" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Program Data…</p>
					</div>
				) : data && (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{activeTab === "overview"          && <OverviewTab data={data} />}
						{activeTab === "lifecycle"         && <LifecycleTab proposals={data.proposals} programs={data.programs} />}
						{activeTab === "intake"            && <IntakeTab items={data.intakeData} />}
						{activeTab === "interdisciplinary" && <InterdisciplinaryTab items={data.interdisciplinaryPrograms} />}
						{activeTab === "insights"          && <InsightsTab insights={data.insights} />}
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
		{ label: "Total Programs", value: s.totalPrograms, icon: GraduationCap, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
		{ label: "Active Proposals", value: s.activeProposals, icon: GitBranch, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
		{ label: "Approved This Year", value: s.approvedThisYear, icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
		{ label: "Discontinued", value: s.discontinuedPrograms, icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
		{ label: "Avg Intake Fill", value: `${s.avgIntakeFill}%`, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
	];

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
				{stats.map((s, i) => <StatCard key={i} {...s} />)}
			</div>

			{/* Active programs quick view */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
				<div className="p-5 border-b border-gray-100 dark:border-gray-800">
					<h3 className="text-base font-bold text-gray-900 dark:text-white">All Degree Programs</h3>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800">
								{["Program", "Degree", "Dept", "Status", "Intake", "Enrolled", "Placement", "Pass Rate"].map((h) => (
									<th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{data.programs.map((p) => (
								<tr key={p.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
									<td className="py-3 px-4 font-medium text-gray-900 dark:text-white max-w-[220px]">
										<p className="truncate text-sm font-bold">{p.name}</p>
									</td>
									<td className="py-3 px-4">
										<span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-md text-xs font-bold text-indigo-700 dark:text-indigo-400">{p.degree}</span>
									</td>
									<td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-xs">{p.dept}</td>
									<td className="py-3 px-4"><Badge className={STAGE_COLORS[p.status]}>{p.status}</Badge></td>
									<td className="py-3 px-4 text-gray-700 dark:text-gray-300">{p.intakeCapacity}</td>
									<td className="py-3 px-4 text-gray-700 dark:text-gray-300">{p.enrolled}</td>
									<td className="py-3 px-4">
										{p.placementRate != null
											? <span className={`font-bold ${p.placementRate >= 90 ? "text-green-600 dark:text-green-400" : p.placementRate >= 80 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>{p.placementRate}%</span>
											: <span className="text-gray-400 text-xs">—</span>
										}
									</td>
									<td className="py-3 px-4">
										{p.passRate != null
											? <span className={`font-bold ${p.passRate >= 90 ? "text-green-600 dark:text-green-400" : p.passRate >= 80 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>{p.passRate}%</span>
											: <span className="text-gray-400 text-xs">—</span>
										}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Proposal pipeline */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Active Proposal Pipeline</h3>
				<div className="space-y-3">
					{data.proposals.map((pr) => (
						<div key={pr.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xs">
									{pr.interdisciplinary ? "↔" : "↑"}
								</div>
								<div>
									<p className="text-sm font-bold text-gray-900 dark:text-white">{pr.title}</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">{pr.proposedBy} · {pr.dept}</p>
								</div>
							</div>
							<Badge className={STAGE_COLORS[pr.stage]}>{pr.stage}</Badge>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

/* ═══════════ LIFECYCLE ═══════════ */
const LifecycleTab = ({ proposals, programs }) => {
	const [expandedId, setExpandedId] = useState(null);
	const STAGE_ICONS = { Proposal: Clock, Review: BookOpen, Approval: CheckCircle, Launch: Rocket };

	return (
		<div className="space-y-8">
			{/* Visual Pipeline Banner */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">Proposal Pipeline Stages</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					{STAGE_ORDER.map((stage, idx) => {
						const Icon = STAGE_ICONS[stage];
						const count = proposals.filter(p => p.stage === stage).length;
						const colors = [
							{ bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-300", border: "border-gray-200 dark:border-gray-700" },
							{ bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
							{ bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
							{ bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400", border: "border-green-200 dark:border-green-800" },
						][idx];
						return (
							<div key={stage} className={`relative rounded-2xl border-2 ${colors.border} p-5`}>
								<div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center mb-3`}>
									<Icon className={`size-5 ${colors.text}`} />
								</div>
								<p className={`text-2xl font-bold ${colors.text}`}>{count}</p>
								<p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{stage}</p>
								{idx < 3 && (
									<div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-8 items-center justify-center">
										<div className="w-6 h-0.5 bg-gray-300 dark:bg-gray-600" />
										<div className="w-2 h-2 border-t-2 border-r-2 border-gray-300 dark:border-gray-600 rotate-45 -ml-1.5" />
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>

			{/* Proposal Cards */}
			<div className="space-y-4">
				{proposals.map((pr) => {
					const expanded = expandedId === pr.id;
					const stageIdx = STAGE_ORDER.indexOf(pr.stage);
					return (
						<div key={pr.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all">
							<div className="p-5">
								<div className="flex items-start justify-between mb-3">
									<div className="flex items-start gap-3">
										<div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs mt-0.5 ${
											pr.interdisciplinary ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
										}`}>
											{pr.interdisciplinary ? "↔" : "↑"}
										</div>
										<div>
											<h3 className="font-bold text-gray-900 dark:text-white">{pr.title}</h3>
											<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
												Proposed by {pr.proposedBy} · {pr.dept}
											</p>
											{pr.interdisciplinary && (
												<div className="flex flex-wrap gap-1 mt-1.5">
													{pr.depts.map(d => (
														<span key={d} className="px-1.5 py-0.5 bg-violet-50 dark:bg-violet-900/20 rounded text-[10px] font-bold text-violet-700 dark:text-violet-400">{d}</span>
													))}
												</div>
											)}
										</div>
									</div>
									<Badge className={STAGE_COLORS[pr.stage]}>{pr.stage}</Badge>
								</div>

								{/* Stage progress bar */}
								<div className="flex items-center gap-1 mb-3">
									{STAGE_ORDER.map((s, i) => (
										<div key={s} className="flex items-center gap-1 flex-1">
											<div className={`h-2 flex-1 rounded-full ${i <= stageIdx ? "bg-indigo-500 dark:bg-indigo-400" : "bg-gray-200 dark:bg-gray-700"}`} />
											{i < STAGE_ORDER.length - 1 && (
												<div className={`w-1.5 h-1.5 rounded-full ${i < stageIdx ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600"}`} />
											)}
										</div>
									))}
								</div>
								<div className="flex justify-between text-[10px] text-gray-400 mb-3 px-0.5">
									{STAGE_ORDER.map(s => <span key={s}>{s}</span>)}
								</div>

								<button
									onClick={() => setExpandedId(expanded ? null : pr.id)}
									className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors"
								>
									{expanded ? <><ChevronUp className="size-3.5" />Less</> : <><ChevronDown className="size-3.5" />Details</>}
								</button>
							</div>

							{expanded && (
								<div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-b-2xl animate-in fade-in slide-in-from-top-1 duration-200">
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										<div className="px-3 py-2 bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800">
											<p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
											<p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(pr.submittedDate).toLocaleDateString()}</p>
										</div>
										{pr.reviewDate && (
											<div className="px-3 py-2 bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800">
												<p className="text-xs text-gray-500 dark:text-gray-400">Review Date</p>
												<p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(pr.reviewDate).toLocaleDateString()}</p>
											</div>
										)}
										<div className="px-3 py-2 bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800">
											<p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
											<p className="text-sm font-bold text-gray-900 dark:text-white">{pr.interdisciplinary ? "Interdisciplinary" : "Single-Dept"}</p>
										</div>
										<div className="px-3 py-2 bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800">
											<p className="text-xs text-gray-500 dark:text-gray-400">Departments</p>
											<p className="text-sm font-bold text-gray-900 dark:text-white">{pr.depts.join(", ")}</p>
										</div>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

/* ═══════════ INTAKE ═══════════ */
const IntakeTab = ({ items }) => {
	const barColor = (pct) =>
		pct >= 90 ? "bg-green-500" : pct >= 75 ? "bg-blue-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500";
	const trendIcon = (t) =>
		t.startsWith("+") ? <ArrowUpRight className="size-3 text-green-500" /> :
		t.startsWith("-") ? <ArrowDownRight className="size-3 text-red-500" /> :
		<Minus className="size-3 text-gray-400" />;

	return (
		<div className="space-y-4">
			{/* Summary bar */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
				{[
					{ label: "Total Capacity", value: items.reduce((s, i) => s + i.capacity, 0) },
					{ label: "Total Enrolled", value: items.reduce((s, i) => s + i.enrolled, 0) },
					{ label: "Avg Fill Rate", value: `${Math.round(items.reduce((s, i) => s + i.fillPct, 0) / items.length)}%` },
					{ label: "Total Gap", value: items.reduce((s, i) => s + (i.capacity - i.enrolled), 0) },
				].map(({ label, value }) => (
					<div key={label} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
						<p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
						<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
					</div>
				))}
			</div>

			{items.map((item) => (
				<div key={item.program} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
					<div className="flex items-center justify-between mb-3">
						<div>
							<h3 className="font-bold text-gray-900 dark:text-white">{item.program}</h3>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{item.enrolled} / {item.capacity} seats filled
							</p>
						</div>
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-400">
								{trendIcon(item.trend)}{item.trend}
							</div>
							<span className={`text-lg font-bold ${
								item.fillPct >= 90 ? "text-green-600 dark:text-green-400" :
								item.fillPct >= 75 ? "text-blue-600 dark:text-blue-400" :
								item.fillPct >= 60 ? "text-amber-600 dark:text-amber-400" :
								"text-red-600 dark:text-red-400"
							}`}>{item.fillPct}%</span>
						</div>
					</div>

					{/* Capacity vs enrolled bar */}
					<div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							className={`h-full rounded-full transition-all duration-700 ${barColor(item.fillPct)}`}
							style={{ width: `${item.fillPct}%` }}
						/>
						<div className="absolute inset-0 flex items-center justify-end pr-3">
							<span className="text-[10px] font-bold text-white mix-blend-difference">
								{item.capacity - item.enrolled} seats vacant
							</span>
						</div>
					</div>

					<div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
						<span>0</span>
						<span>Capacity: {item.capacity}</span>
					</div>
				</div>
			))}
		</div>
	);
};

/* ═══════════ INTERDISCIPLINARY ═══════════ */
const InterdisciplinaryTab = ({ items }) => (
	<div className="space-y-4">
		<div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 flex items-start gap-3">
			<Info className="size-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
			<p className="text-sm text-indigo-700 dark:text-indigo-300">
				Interdisciplinary programs are jointly governed by the Dean. Each program lists a lead department and partner departments who co-contribute curriculum and faculty.
			</p>
		</div>

		{items.map((prog) => (
			<div key={prog.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-start gap-3">
						<div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-700 dark:text-violet-400">
							<Share2 className="size-5" />
						</div>
						<div>
							<h3 className="font-bold text-gray-900 dark:text-white">{prog.name}</h3>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
								Lead: <span className="font-bold text-gray-700 dark:text-gray-300">{prog.leadDept}</span>
							</p>
						</div>
					</div>
					<Badge className={STAGE_COLORS[prog.status]}>{prog.status}</Badge>
				</div>

				<div className="flex flex-wrap gap-2 mb-4">
					<span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-xs font-bold text-indigo-700 dark:text-indigo-400">
						Lead: {prog.leadDept}
					</span>
					{prog.partnerDepts.map((d) => (
						<span key={d} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400">
							{d}
						</span>
					))}
				</div>

				<div className="flex items-center gap-4 text-sm">
					<div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
						<p className="text-xs text-gray-500 dark:text-gray-400">Students Enrolled</p>
						<p className="font-bold text-gray-900 dark:text-white">{prog.students > 0 ? prog.students : "Not yet launched"}</p>
					</div>
					<div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
						<p className="text-xs text-gray-500 dark:text-gray-400">Partner Depts</p>
						<p className="font-bold text-gray-900 dark:text-white">{prog.partnerDepts.length}</p>
					</div>
				</div>
			</div>
		))}
	</div>
);

/* ═══════════ INSIGHTS ═══════════ */
const InsightsTab = ({ insights }) => {
	const { demandTrends, enrollmentGaps, successRates } = insights;

	return (
		<div className="space-y-8">
			{/* Demand Trends */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
					<TrendingUp className="size-4 text-indigo-500" /> Application Demand Trends
				</h3>
				<div className="space-y-4">
					{demandTrends.map((d) => (
						<div key={d.program} className="flex items-center justify-between gap-4">
							<div className="min-w-0 flex-1">
								<div className="flex items-center justify-between mb-1">
									<p className="text-sm font-bold text-gray-900 dark:text-white truncate pr-2">{d.program}</p>
									<div className="flex items-center gap-1.5 shrink-0">
										<span className={`text-xs font-bold ${d.trend === "↑" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{d.trend}</span>
										<span className="text-xs text-gray-500 dark:text-gray-400">{d.applications} apps · {d.ratio}x ratio</span>
									</div>
								</div>
								<div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
									<div
										className={`h-full rounded-full transition-all duration-700 ${d.trend === "↑" ? "bg-indigo-500" : "bg-red-400"}`}
										style={{ width: `${Math.min((d.ratio / 12) * 100, 100)}%` }}
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Enrollment Gaps */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
					<BarChart2 className="size-4 text-red-500" /> Enrollment vs Capacity Gaps
				</h3>
				<div className="space-y-4">
					{enrollmentGaps.map((g) => (
						<div key={g.program} className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4">
							<div className="flex items-center justify-between mb-2">
								<h4 className="font-bold text-gray-900 dark:text-white text-sm">{g.program}</h4>
								<span className="text-red-600 dark:text-red-400 font-bold text-sm">{g.gapPct}% vacant</span>
							</div>
							<div className="grid grid-cols-3 gap-2 text-center">
								<div>
									<p className="text-sm font-bold text-gray-900 dark:text-white">{g.capacity}</p>
									<p className="text-[10px] text-gray-500">Capacity</p>
								</div>
								<div>
									<p className="text-sm font-bold text-blue-600 dark:text-blue-400">{g.enrolled}</p>
									<p className="text-[10px] text-gray-500">Enrolled</p>
								</div>
								<div>
									<p className="text-sm font-bold text-red-600 dark:text-red-400">{g.gap}</p>
									<p className="text-[10px] text-gray-500">Gap</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Program Success Rates */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
				<div className="p-5 border-b border-gray-100 dark:border-gray-800">
					<h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<CheckCircle className="size-4 text-green-500" /> Program Success Rate (Placement + Results)
					</h3>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800">
								{["Program", "Placement Rate", "Pass Rate", "Combined Score"].map(h => (
									<th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{successRates.sort((a, b) => b.score - a.score).map((r, idx) => (
								<tr key={r.program} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
									<td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
										<div className="flex items-center gap-2">
											<span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-gray-400" : idx === 2 ? "bg-amber-700" : "bg-gray-300 dark:bg-gray-700"}`}>{idx + 1}</span>
											{r.program}
										</div>
									</td>
									<td className="py-3 px-4">
										<span className={`font-bold ${r.placement >= 90 ? "text-green-600 dark:text-green-400" : r.placement >= 80 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>{r.placement}%</span>
									</td>
									<td className="py-3 px-4">
										<span className={`font-bold ${r.passRate >= 90 ? "text-green-600 dark:text-green-400" : r.passRate >= 80 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>{r.passRate}%</span>
									</td>
									<td className="py-3 px-4">
										<div className="flex items-center gap-2">
											<div className="flex-1 max-w-[80px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
												<div className={`h-full rounded-full ${r.score >= 90 ? "bg-green-500" : r.score >= 80 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${r.score}%` }} />
											</div>
											<span className={`text-sm font-bold ${r.score >= 90 ? "text-green-600 dark:text-green-400" : r.score >= 80 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>{r.score}</span>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ProgramGovernanceUI;
