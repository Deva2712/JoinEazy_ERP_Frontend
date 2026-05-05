// src/pages/FinancialGovernance/FinancialGovernanceUI.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	LayoutDashboard, PieChart, FlaskConical, Building, GraduationCap,
	ArrowLeft, RefreshCw, AlertTriangle, Landmark, TrendingUp,
	ArrowUpRight, ArrowDownRight, Minus, Info, ChevronDown, ChevronUp,
	BadgeCheck, Clock,
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

const STATUS = {
	Approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	Pending:  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
	"Under Review": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
	Active:  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
	"Pending Approval": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
	"On Track": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	"Under-Utilized": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const fmt = (n) => n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;
const barColor = (pct) => pct >= 85 ? "bg-green-500" : pct >= 70 ? "bg-blue-500" : pct >= 55 ? "bg-amber-500" : "bg-red-400";
const trendIcon = (t) => t.startsWith("+") ? <ArrowUpRight className="size-3 text-green-500" /> : t.startsWith("-") ? <ArrowDownRight className="size-3 text-red-500" /> : <Minus className="size-3 text-gray-400" />;

/* ─── MAIN ─── */
const FinancialGovernanceUI = ({ data, activeTab, onTabChange, loading, error, onRefresh }) => {
	const navigate = useNavigate();
	const tabs = [
		{ id: "overview",       label: "Overview",           icon: LayoutDashboard },
		{ id: "budgets",        label: "Dept Budgets",       icon: PieChart },
		{ id: "research-funds", label: "Research Funds",     icon: FlaskConical },
		{ id: "infrastructure", label: "Infrastructure",     icon: Building },
		{ id: "scholarships",   label: "Scholarships",       icon: GraduationCap },
	];

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />
			<div className="bg-gradient-to-br from-amber-600 via-orange-700 to-yellow-700 dark:from-amber-900 dark:via-orange-950 dark:to-yellow-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-6 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-5">
						<div className="flex items-center gap-4">
							<button onClick={() => navigate("/dashboard")} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm"><ArrowLeft className="size-5" /></button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">School Financial Governance</h1>
								<p className="text-amber-100/80 text-sm mt-0.5">Budget allocation · research funds · infrastructure · scholarships.</p>
							</div>
						</div>
						{data?.summary && (
							<div className="flex items-center gap-3">
								{[
									{ label: "Total Budget", value: data.summary.totalBudget },
									{ label: "Utilized", value: `${data.summary.utilizationPct}%` },
									{ label: "Pending", value: data.summary.pendingApprovals },
								].map(({ label, value }) => (
									<div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center">
										<p className="text-xs text-amber-200/70 font-medium">{label}</p>
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
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${activeTab === t.id ? "bg-gray-50 dark:bg-[#0f1117] text-amber-700 dark:text-amber-400" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
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
						<button onClick={onRefresh} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-bold"><RefreshCw className="size-4" />Try Again</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-amber-500" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Financial Data…</p>
					</div>
				) : data && (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{activeTab === "overview"       && <OverviewTab data={data} />}
						{activeTab === "budgets"        && <BudgetsTab items={data.budgets} />}
						{activeTab === "research-funds" && <ResearchFundsTab items={data.researchFunds} />}
						{activeTab === "infrastructure" && <InfrastructureTab items={data.infrastructure} />}
						{activeTab === "scholarships"   && <ScholarshipsTab items={data.scholarships} />}
					</div>
				)}
			</main>
			<BottomNavController /><FooterController />
		</div>
	);
};

/* ════ OVERVIEW ════ */
const OverviewTab = ({ data }) => {
	const { summary: s, insights } = data;
	const stats = [
		{ label: "Total Budget", value: s.totalBudget, icon: Landmark, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
		{ label: "Allocated", value: s.allocated, icon: PieChart, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20" },
		{ label: "Utilized", value: s.utilized, icon: TrendingUp, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
		{ label: "Research Funds", value: s.researchFunds, icon: FlaskConical, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
		{ label: "Scholarships", value: s.scholarshipsDisbursed, icon: GraduationCap, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
		{ label: "Pending Approvals", value: s.pendingApprovals, icon: Clock, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
	];

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">{stats.map((s, i) => <StatCard key={i} {...s} />)}</div>

			{/* Budget vs Outcome efficiency */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
					<TrendingUp className="size-4 text-amber-500" /> Budget vs Outcome Efficiency (Year-on-Year)
				</h3>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800">
								{["Year", "Budget", "Revenue Generated", "Efficiency Ratio"].map(h => (
									<th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{insights.budgetVsOutcome.map((row) => (
								<tr key={row.year} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
									<td className="py-3 px-4 font-bold text-gray-900 dark:text-white">{row.year}</td>
									<td className="py-3 px-4 text-gray-700 dark:text-gray-300">{fmt(row.budget)}</td>
									<td className="py-3 px-4 text-green-600 dark:text-green-400 font-bold">{fmt(row.revenue)}</td>
									<td className="py-3 px-4">
										<div className="flex items-center gap-2">
											<div className="flex-1 max-w-[60px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
												<div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(row.efficiency - 100, 100)}%` }} />
											</div>
											<span className="text-sm font-bold text-amber-600 dark:text-amber-400">{row.efficiency}%</span>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* ROI per dept quick view */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
					<PieChart className="size-4 text-orange-500" /> ROI by Department
				</h3>
				<div className="space-y-3">
					{insights.roiByDept.sort((a, b) => b.roi - a.roi).map((d) => (
						<div key={d.dept} className="flex items-center gap-3">
							<span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-28">{d.dept}</span>
							<div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
								<div className={`h-full rounded-full transition-all duration-700 ${d.roi >= 85 ? "bg-green-500" : d.roi >= 75 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${d.roi}%` }} />
							</div>
							<span className={`text-sm font-bold w-10 text-right ${d.roi >= 85 ? "text-green-600 dark:text-green-400" : d.roi >= 75 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>{d.roi}</span>
							<span className="text-xs text-gray-400 w-28 text-right">₹{(d.costPerStudent / 1000).toFixed(0)}K/student</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

/* ════ BUDGETS ════ */
const BudgetsTab = ({ items }) => {
	const totalAllocated = items.reduce((s, i) => s + i.allocated, 0);

	return (
		<div className="space-y-4">
			{/* Summary bar */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
				{[
					{ label: "Total Allocated", value: fmt(totalAllocated) },
					{ label: "Total Utilized", value: fmt(items.reduce((s, i) => s + i.utilized, 0)) },
					{ label: "Total Remaining", value: fmt(items.reduce((s, i) => s + i.remaining, 0)) },
					{ label: "Avg Utilization", value: `${Math.round(items.reduce((s, i) => s + i.utilizationPct, 0) / items.length)}%` },
				].map(({ label, value }) => (
					<div key={label} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
						<p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
						<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
					</div>
				))}
			</div>

			{items.map(item => (
				<div key={item.dept} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
					<div className="flex items-center justify-between mb-3">
						<div>
							<div className="flex items-center gap-2">
								<h3 className="font-bold text-gray-900 dark:text-white">{item.dept}</h3>
								<div className="flex items-center gap-0.5 text-xs font-bold text-gray-500">{trendIcon(item.trend)}{item.trend}</div>
							</div>
							<p className="text-xs text-gray-500 dark:text-gray-400">{fmt(item.utilized)} of {fmt(item.allocated)} utilized · ₹{(item.costPerStudent / 1000).toFixed(0)}K/student</p>
						</div>
						<div className="text-right">
							<p className={`text-lg font-bold ${item.utilizationPct >= 85 ? "text-green-600 dark:text-green-400" : item.utilizationPct >= 70 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>{item.utilizationPct}%</p>
							<p className="text-[10px] text-gray-400">of budget used</p>
						</div>
					</div>
					<div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
						<div className={`h-full rounded-full transition-all duration-700 ${barColor(item.utilizationPct)}`} style={{ width: `${item.utilizationPct}%` }} />
						<div className="absolute inset-0 flex items-center px-3">
							<span className="text-[10px] font-bold text-white mix-blend-difference">{fmt(item.remaining)} remaining</span>
						</div>
					</div>
					<div className="flex justify-between text-[10px] text-gray-400">
						<span>ROI Score: <strong className={item.roi >= 85 ? "text-green-600 dark:text-green-400" : item.roi >= 75 ? "text-amber-600 dark:text-amber-400" : "text-red-500"}>{item.roi}</strong></span>
						<span>Allocated: {fmt(item.allocated)}</span>
					</div>
				</div>
			))}
		</div>
	);
};

/* ════ RESEARCH FUNDS ════ */
const ResearchFundsTab = ({ items }) => (
	<div className="space-y-4">
		{items.map(f => (
			<div key={f.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
				<div className="flex items-start justify-between mb-3">
					<div className="flex items-start gap-3">
						<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-700 dark:text-blue-400 shrink-0">
							<FlaskConical className="size-5" />
						</div>
						<div>
							<h3 className="font-bold text-gray-900 dark:text-white">{f.cluster}</h3>
							<div className="flex flex-wrap gap-1 mt-1">
								{f.grants.map(g => <span key={g} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-medium text-gray-600 dark:text-gray-400">{g}</span>)}
							</div>
						</div>
					</div>
					<Badge className={STATUS[f.status]}>{f.status}</Badge>
				</div>
				<div className="flex items-center justify-between mb-1.5">
					<span className="text-xs text-gray-500">{fmt(f.utilized)} of {fmt(f.totalAllocated)}</span>
					<span className="text-xs font-bold text-gray-700 dark:text-gray-300">{f.utilizationPct}%</span>
				</div>
				<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
					<div className={`h-full rounded-full transition-all duration-700 ${barColor(f.utilizationPct)}`} style={{ width: `${f.utilizationPct}%` }} />
				</div>
			</div>
		))}
	</div>
);

/* ════ INFRASTRUCTURE ════ */
const InfrastructureTab = ({ items }) => {
	const CATEGORY_COLORS = {
		Computing: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
		Lab:       "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400",
		Infrastructure: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
		Green:     "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
	};
	const totals = { cost: items.reduce((s, i) => s + i.cost, 0), approved: items.reduce((s, i) => s + i.approved, 0) };

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-3 gap-4 mb-2">
				{[
					{ label: "Total Investment", value: fmt(totals.cost) },
					{ label: "Approved", value: fmt(totals.approved) },
					{ label: "Pending", value: fmt(totals.cost - totals.approved) },
				].map(({ label, value }) => (
					<div key={label} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
						<p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
						<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
					</div>
				))}
			</div>

			{items.map(item => (
				<div key={item.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
					<div className="flex items-start justify-between mb-3">
						<div className="min-w-0">
							<div className="flex items-center gap-2 mb-1">
								<span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${CATEGORY_COLORS[item.category]}`}>{item.category}</span>
								<span className="text-xs text-gray-500 dark:text-gray-400">{item.dept}</span>
							</div>
							<h3 className="font-bold text-gray-900 dark:text-white text-sm">{item.project}</h3>
						</div>
						<div className="flex flex-col items-end gap-1 shrink-0 ml-3">
							<Badge className={STATUS[item.status]}>{item.status}</Badge>
							<span className="text-sm font-bold text-amber-600 dark:text-amber-400">{fmt(item.cost)}</span>
						</div>
					</div>
					{item.completion > 0 && (
						<>
							<div className="flex items-center justify-between mb-1">
								<span className="text-xs text-gray-500">Completion</span>
								<span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.completion}%</span>
							</div>
							<div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
								<div className={`h-full rounded-full transition-all duration-700 ${item.completion >= 75 ? "bg-green-500" : item.completion >= 40 ? "bg-amber-500" : "bg-blue-500"}`} style={{ width: `${item.completion}%` }} />
							</div>
						</>
					)}
				</div>
			))}
		</div>
	);
};

/* ════ SCHOLARSHIPS ════ */
const ScholarshipsTab = ({ items }) => {
	const CATEGORY_COLORS = {
		Merit:      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
		Need:       "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
		Research:   "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400",
		Government: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400",
		Achievement:"bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
		Industry:   "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
	};

	const totalDisbursed = items.filter(i => i.status === "Active").reduce((s, i) => s + i.disbursed, 0);
	const totalStudents  = items.filter(i => i.status === "Active").reduce((s, i) => s + i.students, 0);

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-3 gap-4 mb-2">
				{[
					{ label: "Total Disbursed", value: fmt(totalDisbursed) },
					{ label: "Students Aided", value: totalStudents },
					{ label: "Pending Approval", value: items.filter(i => i.status === "Pending Approval").length },
				].map(({ label, value }) => (
					<div key={label} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center">
						<p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
						<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
					</div>
				))}
			</div>

			{items.map(item => (
				<div key={item.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
					<div className="flex items-start justify-between mb-3">
						<div className="flex items-start gap-3">
							<div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${CATEGORY_COLORS[item.category]}`}>
								<GraduationCap className="size-5" />
							</div>
							<div>
								<h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
								<p className="text-xs text-gray-500 dark:text-gray-400">{item.criteria} · {item.cycle}</p>
								<span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${CATEGORY_COLORS[item.category]}`}>{item.category}</span>
							</div>
						</div>
						<div className="flex flex-col items-end gap-1">
							<Badge className={STATUS[item.status]}>{item.status}</Badge>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
							<p className="text-sm font-bold text-amber-600 dark:text-amber-400">{fmt(item.disbursed)}</p>
							<p className="text-[10px] text-gray-500">Disbursed</p>
						</div>
						<div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
							<p className="text-sm font-bold text-blue-600 dark:text-blue-400">{item.students}</p>
							<p className="text-[10px] text-gray-500">Students</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default FinancialGovernanceUI;
