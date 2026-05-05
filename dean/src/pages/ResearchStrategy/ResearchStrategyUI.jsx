// src/pages/ResearchStrategy/ResearchStrategyUI.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	LayoutDashboard, Layers, GitMerge, Landmark, BookOpen,
	ArrowLeft, RefreshCw, AlertTriangle, FlaskConical, TrendingUp,
	Users, ChevronDown, ChevronUp, Info, Star, BarChart2,
	CheckCircle, Clock, ArrowUpRight,
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
	Active:       "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	Forming:      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
	Awarded:      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
	"Under Review":"bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
	Proposed:     "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
	"On Track":   "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	"Under-Utilized": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const fmt = (n) => n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;

/* ─── MAIN ─── */
const ResearchStrategyUI = ({ data, activeTab, onTabChange, loading, error, onRefresh }) => {
	const navigate = useNavigate();
	const tabs = [
		{ id: "overview",      label: "Overview",           icon: LayoutDashboard },
		{ id: "clusters",      label: "Research Clusters",  icon: Layers },
		{ id: "cross-projects",label: "Cross-Dept Projects",icon: GitMerge },
		{ id: "grants",        label: "Grant Strategy",     icon: Landmark },
		{ id: "publications",  label: "Publication Analytics", icon: BookOpen },
	];

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />
			<div className="bg-gradient-to-br from-teal-600 via-emerald-700 to-green-800 dark:from-teal-900 dark:via-emerald-950 dark:to-green-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-6 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-5">
						<div className="flex items-center gap-4">
							<button onClick={() => navigate("/dashboard")} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm"><ArrowLeft className="size-5" /></button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Research Strategy & Intelligence</h1>
								<p className="text-teal-100/80 text-sm mt-0.5">Clusters · cross-dept projects · grants · publication impact.</p>
							</div>
						</div>
						{data?.summary && (
							<div className="flex items-center gap-3">
								{[
									{ label: "Clusters", value: data.summary.totalClusters },
									{ label: "Publications", value: data.summary.totalPublications },
									{ label: "Avg Citations", value: data.summary.avgCitationScore },
								].map(({ label, value }) => (
									<div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center">
										<p className="text-xs text-teal-200/70 font-medium">{label}</p>
										<p className="text-lg font-bold">{value}</p>
									</div>
								))}
							</div>
						)}
					</div>
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{tabs.map((t) => {
							const Icon = t.icon;
							return (
								<button key={t.id} onClick={() => onTabChange(t.id)}
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${activeTab === t.id ? "bg-gray-50 dark:bg-[#0f1117] text-teal-700 dark:text-teal-400" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
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
						<button onClick={onRefresh} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold"><RefreshCw className="size-4" />Try Again</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-teal-500" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Research Data…</p>
					</div>
				) : data && (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{activeTab === "overview"       && <OverviewTab data={data} />}
						{activeTab === "clusters"       && <ClustersTab items={data.clusters} />}
						{activeTab === "cross-projects" && <CrossProjectsTab items={data.crossProjects} />}
						{activeTab === "grants"         && <GrantsTab items={data.grantStrategy} />}
						{activeTab === "publications"   && <PublicationsTab pub={data.publicationAnalytics} />}
					</div>
				)}
			</main>
			<BottomNavController /><FooterController />
		</div>
	);
};

/* ════ OVERVIEW ════ */
const OverviewTab = ({ data }) => {
	const { summary: s } = data;
	const stats = [
		{ label: "Research Clusters", value: s.totalClusters, icon: Layers, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/20" },
		{ label: "Cross-Dept Projects", value: s.activeCrossProjects, icon: GitMerge, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
		{ label: "Total Funding", value: s.totalFunding, icon: Landmark, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
		{ label: "Publications", value: s.totalPublications, icon: BookOpen, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
		{ label: "Avg Citation Score", value: s.avgCitationScore, icon: Star, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
		{ label: "Grant Utilization", value: `${s.grantUtilization}%`, icon: BarChart2, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
	];
	return (
		<div className="space-y-8">
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">{stats.map((s, i) => <StatCard key={i} {...s} />)}</div>

			{/* Publications trend */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
					<TrendingUp className="size-4 text-teal-500" /> Publication Growth Trend
				</h3>
				<div className="flex items-end gap-4">
					{data.publicationAnalytics.byYear.map((y, i, arr) => {
						const maxCount = Math.max(...arr.map(a => a.count));
						const pct = Math.round((y.count / maxCount) * 100);
						return (
							<div key={y.year} className="flex-1 flex flex-col items-center gap-2">
								<span className="text-xs font-bold text-teal-600 dark:text-teal-400">{y.count}</span>
								<div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden" style={{ height: "80px" }}>
									<div className="w-full bg-gradient-to-t from-teal-600 to-emerald-400 rounded-t-lg transition-all duration-700" style={{ height: `${pct}%` }} />
								</div>
								<span className="text-[10px] text-gray-500">{y.year}</span>
							</div>
						);
					})}
				</div>
			</div>

			{/* Top clusters quick view */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Research Clusters Overview</h3>
				<div className="space-y-3">
					{data.clusters.map((c) => (
						<div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-700 dark:text-teal-400"><FlaskConical className="size-4" /></div>
								<div>
									<p className="text-sm font-bold text-gray-900 dark:text-white">{c.name}</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">{c.members.join(" · ")} · {c.faculty} faculty</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-xs text-gray-500 dark:text-gray-400">{c.publications} pub · {c.citations} cit</span>
								<Badge className={STATUS_BADGE[c.status]}>{c.status}</Badge>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

/* ════ CLUSTERS ════ */
const ClustersTab = ({ items }) => {
	const [expandedId, setExpandedId] = useState(null);
	return (
		<div className="space-y-4">
			{items.map((c) => {
				const expanded = expandedId === c.id;
				const utilPct = Math.round((c.fundsUsed / c.fundsAllocated) * 100);
				return (
					<div key={c.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all">
						<div className="p-5">
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-start gap-3">
									<div className="w-11 h-11 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
										<FlaskConical className="size-5" />
									</div>
									<div>
										<h3 className="font-bold text-gray-900 dark:text-white">{c.name}</h3>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Lead: {c.leadDept} · {c.faculty} faculty · {c.activeProjects} active projects</p>
										<div className="flex flex-wrap gap-1 mt-1.5">
											{c.members.map(m => <span key={m} className="px-1.5 py-0.5 bg-teal-50 dark:bg-teal-900/20 rounded text-[10px] font-bold text-teal-700 dark:text-teal-400">{m}</span>)}
										</div>
									</div>
								</div>
								<Badge className={STATUS_BADGE[c.status]}>{c.status}</Badge>
							</div>

							<div className="grid grid-cols-3 gap-3 mb-3">
								{[
									{ label: "Allocated", value: fmt(c.fundsAllocated), color: "text-blue-600 dark:text-blue-400" },
									{ label: "Used", value: fmt(c.fundsUsed), color: "text-emerald-600 dark:text-emerald-400" },
									{ label: "Utilization", value: `${utilPct}%`, color: utilPct >= 80 ? "text-green-600" : utilPct >= 60 ? "text-amber-600" : "text-red-600" },
								].map(m => (
									<div key={m.label} className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
										<p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
										<p className="text-[10px] text-gray-500 dark:text-gray-400">{m.label}</p>
									</div>
								))}
							</div>

							<div className="flex items-center gap-3 mb-3">
								<div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
									<div className={`h-full rounded-full transition-all duration-700 ${utilPct >= 80 ? "bg-green-500" : utilPct >= 60 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${utilPct}%` }} />
								</div>
								<span className="text-xs font-bold text-gray-500 w-8">{utilPct}%</span>
							</div>

							<div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
								<span className="font-bold">{c.publications} publications</span>
								<span>·</span>
								<span className="text-amber-600 dark:text-amber-400 font-bold">{c.citations} citations</span>
								<button onClick={() => setExpandedId(expanded ? null : c.id)}
									className="ml-auto flex items-center gap-1 font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 transition-colors">
									{expanded ? <><ChevronUp className="size-3.5" />Less</> : <><ChevronDown className="size-3.5" />Journals</>}
								</button>
							</div>
						</div>
						{expanded && (
							<div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50/50 dark:bg-gray-800/20 animate-in fade-in slide-in-from-top-1 duration-200">
								<p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">PUBLISHING IN</p>
								<div className="flex flex-wrap gap-2">
									{c.journals.map(j => (
										<span key={j} className="px-3 py-1.5 bg-white dark:bg-[#1a1d26] border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-medium text-teal-700 dark:text-teal-400">{j}</span>
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

/* ════ CROSS-DEPT PROJECTS ════ */
const CrossProjectsTab = ({ items }) => (
	<div className="space-y-4">
		<div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-4 flex items-start gap-3">
			<Info className="size-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
			<p className="text-sm text-teal-700 dark:text-teal-300">Cross-department projects are governed at Dean level with a Principal Investigator (PI) and Co-PI from different departments.</p>
		</div>
		{items.map((p) => (
			<div key={p.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-start gap-3">
						<div className="w-11 h-11 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
							<GitMerge className="size-5" />
						</div>
						<div>
							<h3 className="font-bold text-gray-900 dark:text-white">{p.title}</h3>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">PI: {p.pi} · Co-PI: {p.coPI}</p>
							<div className="flex flex-wrap gap-1 mt-1.5">
								{p.depts.map(d => <span key={d} className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 rounded text-[10px] font-bold text-emerald-700 dark:text-emerald-400">{d}</span>)}
							</div>
						</div>
					</div>
					<span className="text-sm font-bold text-green-600 dark:text-green-400">{fmt(p.funding)}</span>
				</div>
				<div className="flex items-center justify-between mb-1.5">
					<span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
					<span className="text-xs font-bold text-gray-700 dark:text-gray-300">{p.progress}%</span>
				</div>
				<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
					<div className={`h-full rounded-full transition-all duration-700 ${p.progress >= 60 ? "bg-green-500" : p.progress >= 30 ? "bg-teal-500" : "bg-amber-500"}`} style={{ width: `${p.progress}%` }} />
				</div>
				<div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
					<span className="flex items-center gap-1"><Clock className="size-3" />{new Date(p.startDate).toLocaleDateString()} – {new Date(p.endDate).toLocaleDateString()}</span>
				</div>
			</div>
		))}
	</div>
);

/* ════ GRANTS ════ */
const GrantsTab = ({ items }) => {
	const awarded = items.filter(g => g.status === "Awarded");
	const pipeline = items.filter(g => g.status !== "Awarded");
	const totalAwarded = awarded.reduce((s, g) => s + g.amount, 0);

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
				{[
					{ label: "Total Awarded", value: fmt(totalAwarded), color: "text-green-600 dark:text-green-400" },
					{ label: "Under Review", value: items.filter(g => g.status === "Under Review").length, color: "text-amber-600 dark:text-amber-400" },
					{ label: "Proposed", value: items.filter(g => g.status === "Proposed").length, color: "text-sky-600 dark:text-sky-400" },
				].map(({ label, value, color }) => (
					<div key={label} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
						<p className={`text-xl font-bold ${color}`}>{value}</p>
						<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
					</div>
				))}
			</div>

			{/* Awarded */}
			<div>
				<h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><CheckCircle className="size-4 text-green-500" />Awarded Grants</h3>
				<div className="space-y-3">
					{awarded.map(g => (
						<div key={g.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-green-200 dark:border-green-900/50 p-5 hover:shadow-lg transition-all">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-bold text-gray-900 dark:text-white">{g.type}</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">{g.agency} · {g.cluster}</p>
								</div>
								<div className="text-right">
									<p className="text-lg font-bold text-green-600 dark:text-green-400">{fmt(g.amount)}</p>
									<p className="text-[10px] text-gray-400">Until {g.dueDate ? new Date(g.dueDate).toLocaleDateString() : "—"}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Pipeline */}
			<div>
				<h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><Clock className="size-4 text-amber-500" />Grant Pipeline</h3>
				<div className="space-y-3">
					{pipeline.map(g => (
						<div key={g.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-bold text-gray-900 dark:text-white">{g.type}</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">{g.agency} · {g.cluster}</p>
								</div>
								<div className="flex items-center gap-2">
									<span className="font-bold text-gray-700 dark:text-gray-300">{fmt(g.amount)}</span>
									<Badge className={STATUS_BADGE[g.status]}>{g.status}</Badge>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

/* ════ PUBLICATIONS ════ */
const PublicationsTab = ({ pub }) => (
	<div className="space-y-8">
		{/* By Department */}
		<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
			<div className="p-5 border-b border-gray-100 dark:border-gray-800">
				<h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2"><BarChart2 className="size-4 text-teal-500" />Publication Analytics by Department</h3>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-gray-100 dark:border-gray-800">
							{["Department", "Publications", "Citations", "h-Index", "Citations/Pub"].map(h => (
								<th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{[...pub.byDept].sort((a, b) => b.citations - a.citations).map((d, idx) => (
							<tr key={d.dept} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
								<td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
									<div className="flex items-center gap-2">
										<span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-gray-400" : idx === 2 ? "bg-amber-700" : "bg-gray-300 dark:bg-gray-700"}`}>{idx + 1}</span>
										{d.dept}
									</div>
								</td>
								<td className="py-3 px-4 font-bold text-teal-600 dark:text-teal-400">{d.publications}</td>
								<td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400">{d.citations}</td>
								<td className="py-3 px-4"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded text-xs font-bold text-green-700 dark:text-green-400">{d.hIndex}</span></td>
								<td className="py-3 px-4 text-gray-700 dark:text-gray-300">{(d.citations / d.publications).toFixed(1)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>

		{/* Top journals */}
		<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
			<h3 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
				<Star className="size-4 text-amber-500" /> Top Impact Journals
			</h3>
			<div className="space-y-3">
				{pub.topJournals.map((j, idx) => (
					<div key={j.name} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
						<div className="flex items-center gap-3">
							<div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-gray-400" : "bg-amber-600"}`}>{idx + 1}</div>
							<div>
								<p className="text-sm font-bold text-gray-900 dark:text-white">{j.name}</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">{j.papers} papers published</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-sm font-bold text-amber-600 dark:text-amber-400">IF: {j.impact}</p>
							<p className="text-[10px] text-gray-400">Impact Factor</p>
						</div>
					</div>
				))}
			</div>
		</div>
	</div>
);

export default ResearchStrategyUI;
