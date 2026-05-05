// src/pages/IndustryRelations/IndustryRelationsUI.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
	LayoutDashboard, Building2, FileText, GitBranch, History,
	RefreshCw, ArrowLeft, AlertTriangle, Users, TrendingUp,
	Award, DollarSign, GraduationCap, Filter, ArrowRight, X,
	CalendarDays,
} from "lucide-react";
import { Search } from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";

/* ── shared helpers ── */
const Badge = ({ children, className = "" }) => (
	<span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${className}`}>{children}</span>
);

const STATUS_COLORS = {
	Active:  { badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",  border: "border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10" },
	Expired: { badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",          border: "border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10" },
	Pending: { badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800 bg-yellow-50/30 dark:bg-yellow-900/10" },
};

const REL_COLORS = {
	"Premium Partner":    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
	"Strategic Partner":  "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
	"Active Recruiter":   "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
	"Standard Recruiter": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

/* ═══════════════════════════════════════════════════════
   MAIN LAYOUT
═══════════════════════════════════════════════════════ */
const IndustryRelationsUI = ({ data, activeTab, onTabChange, loading, error, onRefresh }) => {
	const navigate = useNavigate();

	const tabs = [
		{ id: "overview",  label: "Overview",  icon: LayoutDashboard },
		{ id: "companies", label: "Companies", icon: Building2 },
		{ id: "mous",      label: "MoUs",      icon: FileText },
		{ id: "pipelines", label: "Pipelines", icon: GitBranch },
		{ id: "history",   label: "History",   icon: History },
	];

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />

			{/* Hero — no top stat containers, just title + tabs */}
			<div className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 dark:from-teal-900 dark:via-teal-950 dark:to-emerald-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-6 pb-0">
					<div className="flex items-center gap-4 mb-5">
						<button
							onClick={() => navigate("/dashboard")}
							className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm"
						>
							<ArrowLeft className="size-5" />
						</button>
						<div>
							<h1 className="text-2xl font-bold tracking-tight">Industry & External Relations</h1>
							<p className="text-teal-100/80 text-sm mt-0.5">Company partnerships, MoUs, internship pipelines & recruiter history.</p>
						</div>
					</div>

					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{tabs.map(t => {
							const Icon = t.icon;
							return (
								<button
									key={t.id}
									onClick={() => onTabChange(t.id)}
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap
										${activeTab === t.id
											? "bg-gray-50 dark:bg-[#0f1117] text-teal-700 dark:text-teal-400"
											: "text-white/70 hover:text-white hover:bg-white/10"
										}`}
								>
									<Icon className="w-4 h-4" />{t.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
						<p className="text-gray-500 mb-8">{error}</p>
						<button onClick={onRefresh} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold">
							<RefreshCw className="size-4" />Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-teal-500" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Industry Relations…</p>
					</div>
				) : data ? (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{activeTab === "overview"  && <OverviewTab data={data} />}
						{activeTab === "companies" && <CompaniesTab companies={data.companies} />}
						{activeTab === "mous"      && <MousTab mous={data.mous} />}
						{activeTab === "pipelines" && <PipelinesTab pipelines={data.pipelines} />}
						{activeTab === "history"   && <HistoryTab recruiters={data.repeatRecruiters} />}
					</div>
				) : null}
			</main>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

/* ═══════════════════════════════════════════════════════
   OVERVIEW
═══════════════════════════════════════════════════════ */
const OverviewTab = ({ data }) => {
	const { summary, branchStats = [], yearWiseStats = [], alumniHighlights = [], placementFunnel } = data;
	const [selectedBranch, setSelectedBranch] = useState("All");
	const [selectedYear,   setSelectedYear]   = useState("All");

	// Filtered lookups
	const filteredBranch = selectedBranch === "All" ? null : branchStats.find(b => b.branch === selectedBranch);
	const filteredYear   = selectedYear   === "All" ? null : yearWiseStats.find(y => y.year === selectedYear);

	const stats = useMemo(() => [
		{
			label: "Total Companies",
			value: filteredBranch ? filteredBranch.companies : summary.totalCompanies,
			icon: Building2, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/20",
		},
		{
			label: "Active MoUs",
			value: summary.activeMous,
			icon: FileText, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20",
		},
		{
			label: "Highest Package",
			value: `${filteredBranch?.highestPackageLpa ?? filteredYear?.highestPackageLpa ?? summary.highestPackageLpa} LPA`,
			icon: Award, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20",
		},
		{
			label: "Avg Package",
			value: `${filteredBranch?.avgPackageLpa ?? filteredYear?.avgPackageLpa ?? summary.avgPackageLpa} LPA`,
			icon: DollarSign, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20",
		},
		{
			label: "Total Placements",
			value: filteredBranch?.totalPlacements ?? filteredYear?.totalPlacements ?? summary.totalAlumniPlaced,
			icon: Users, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-900/20",
		},
		{
			label: "PPO Rate",
			value: `${summary.ppoConversionRate}%`,
			icon: TrendingUp, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20",
		},
	], [summary, filteredBranch, filteredYear]);

	const hasActiveFilter  = selectedBranch !== "All" || selectedYear !== "All";

	const funnelStages = placementFunnel ? [
		{ label: "Eligible",  value: placementFunnel.eligible,    color: "bg-gray-400" },
		{ label: "Applied",   value: placementFunnel.applied,     color: "bg-blue-400" },
		{ label: "Selected",  value: placementFunnel.selected,    color: "bg-cyan-500" },
		{ label: "Interned",  value: placementFunnel.interned,    color: "bg-teal-500" },
		{ label: "PPO",       value: placementFunnel.ppoReceived, color: "bg-emerald-500" },
		{ label: "Placed",    value: placementFunnel.placed,      color: "bg-green-600" },
	] : [];

	return (
		<div className="space-y-6">
			{/* ── Dropdown Filters ── */}
			<div className="flex items-center gap-3 flex-wrap">
				<Filter className="size-4 text-gray-400" />
				<select
					value={selectedBranch}
					onChange={e => setSelectedBranch(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-teal-400 cursor-pointer"
				>
					<option value="All">All Branches</option>
					{branchStats.map(b => <option key={b.branch}>{b.branch}</option>)}
				</select>

				<select
					value={selectedYear}
					onChange={e => setSelectedYear(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-teal-400 cursor-pointer"
				>
					<option value="All">All Years</option>
					<option value="1st Year">1st Year</option>
					<option value="2nd Year">2nd Year</option>
					<option value="3rd Year">3rd Year</option>
					<option value="4th Year">4th Year</option>
				</select>

				{hasActiveFilter && (
					<button
						onClick={() => { setSelectedBranch("All"); setSelectedYear("All"); }}
						className="flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 transition-colors"
					>
						<X className="size-3" />Clear filters
					</button>
				)}

				{hasActiveFilter && (
					<span className="ml-auto text-xs font-medium text-gray-500 dark:text-gray-400">
						{selectedBranch !== "All" ? `${selectedBranch} branch` : ""}
						{selectedBranch !== "All" && selectedYear !== "All" ? " · " : ""}
						{selectedYear !== "All" ? selectedYear : ""}
					</span>
				)}
			</div>

			{/* ── Compact KPI Grid ── */}
			<div className="grid grid-cols-3 md:grid-cols-6 gap-3">
				{stats.map((s, i) => {
					const Icon = s.icon;
					return (
						<div key={i} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-md transition-all">
							<div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
								<Icon className={`size-4 ${s.color}`} />
							</div>
							<p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{s.label}</p>
							<p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{s.value}</p>
						</div>
					);
				})}
			</div>

			{/* ── Year card if year selected ── */}
			{filteredYear && (
				<div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
					{[
						{ label: "Companies Visited", value: filteredYear.companiesVisited },
						{ label: "Total Offers",      value: filteredYear.totalOffers },
						{ label: "Placements",        value: filteredYear.totalPlacements },
						{ label: "Avg Package",       value: filteredYear.avgPackageLpa > 0 ? `${filteredYear.avgPackageLpa} LPA` : "—" },
					].map(({ label, value }) => (
						<div key={label}>
							<p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">{label}</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
						</div>
					))}
				</div>
			)}

			{/* ── Branch-wise Breakdown (only when All) ── */}
			{selectedBranch === "All" && (
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
					<div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
						<h3 className="text-base font-bold text-gray-900 dark:text-white">Branch-wise Breakdown</h3>
						<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Click any row to filter by branch</p>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-gray-100 dark:border-gray-800">
									{["Branch","Placements","Avg Pkg","Highest","Internships","PPOs","Alumni","Top Recruiter"].map(h => (
										<th key={h} className="text-left py-2.5 px-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{branchStats.map(b => (
									<tr
										key={b.branch}
										className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors cursor-pointer"
										onClick={() => setSelectedBranch(b.branch)}
									>
										<td className="py-2.5 px-3 font-bold text-gray-900 dark:text-white">{b.branch}</td>
										<td className="py-2.5 px-3 text-gray-700 dark:text-gray-300">{b.totalPlacements}</td>
										<td className="py-2.5 px-3 font-bold text-teal-600 dark:text-teal-400">{b.avgPackageLpa} LPA</td>
										<td className="py-2.5 px-3 font-bold text-amber-600 dark:text-amber-400">{b.highestPackageLpa} LPA</td>
										<td className="py-2.5 px-3 text-gray-700 dark:text-gray-300">{b.internships}</td>
										<td className="py-2.5 px-3 text-gray-700 dark:text-gray-300">{b.ppos}</td>
										<td className="py-2.5 px-3 text-gray-700 dark:text-gray-300">{b.alumniCount}</td>
										<td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400 font-medium">{b.topRecruiter}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* ── Placement Funnel ── */}
			{placementFunnel && (
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
					<h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Placement Funnel</h3>
					<div className="flex items-end gap-2">
						{funnelStages.map((st, i) => {
							const pct = (st.value / funnelStages[0].value) * 100;
							return (
								<div key={i} className="flex-1 text-center">
									<p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{st.value}</p>
									<div className="h-28 bg-gray-100 dark:bg-gray-800 rounded-t-lg relative overflow-hidden">
										<div className={`absolute bottom-0 w-full rounded-t-lg ${st.color}`} style={{ height: `${pct}%` }} />
									</div>
									<p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-bold">{st.label}</p>
									<p className="text-[9px] text-gray-400">{pct.toFixed(0)}%</p>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* ── Alumni Highlights ── */}
			{alumniHighlights.length > 0 && (
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
					<h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
						<GraduationCap className="size-4 text-teal-500" />Notable Alumni Placements
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
						{alumniHighlights
							.filter(a => selectedBranch === "All" || a.branch === selectedBranch)
							.map((a, i) => (
								<div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors">
									<div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
										{a.name.split(" ").map(n => n[0]).join("")}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-bold text-gray-900 dark:text-white truncate">{a.name}</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">{a.company} · {a.role}</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-bold text-teal-600 dark:text-teal-400">{a.packageLpa} LPA</p>
										<p className="text-[10px] text-gray-400">{a.branch} '{a.batch.slice(-2)}</p>
									</div>
								</div>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

/* ═══════════════════════════════════════════════════════
   COMPANIES TAB – See More → new page
═══════════════════════════════════════════════════════ */
const CompaniesTab = ({ companies }) => {
	const navigate = useNavigate();
	const [search,       setSearch]  = useState("");
	const [domainFilter, setDomain]  = useState("All");
	const [relFilter,    setRel]     = useState("All");
	const [mouFilter,    setMou]     = useState("All");

	const domains  = useMemo(() => ["All", ...new Set(companies.map(c => c.domain))],       [companies]);
	const rels     = useMemo(() => ["All", ...new Set(companies.map(c => c.relationship))],  [companies]);
	const mStatus  = ["All", "Active", "Expired", "Pending"];

	const filtered = useMemo(() => companies.filter(c => {
		const ms  = c.name.toLowerCase().includes(search.toLowerCase());
		const md  = domainFilter === "All" || c.domain    === domainFilter;
		const mr  = relFilter    === "All" || c.relationship === relFilter;
		const mm  = mouFilter    === "All" || c.mouStatus  === mouFilter;
		return ms && md && mr && mm;
	}), [companies, search, domainFilter, relFilter, mouFilter]);

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search companies…"
						value={search}
						onChange={e => setSearch(e.target.value)}
						className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
					/>
				</div>
				<div className="flex gap-2 flex-wrap">
					<select value={domainFilter} onChange={e => setDomain(e.target.value)}
						className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none cursor-pointer">
						{domains.map(d => <option key={d}>{d === "All" ? "All Domains" : d}</option>)}
					</select>
					<select value={relFilter} onChange={e => setRel(e.target.value)}
						className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none cursor-pointer">
						{rels.map(r => <option key={r}>{r === "All" ? "All Relationships" : r}</option>)}
					</select>
					<select value={mouFilter} onChange={e => setMou(e.target.value)}
						className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none cursor-pointer">
						{mStatus.map(s => <option key={s}>{s === "All" ? "All MoU Status" : s}</option>)}
					</select>
				</div>
			</div>

			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
				<div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
					{filtered.length} companies
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800">
								{["Company","Domain","Relationship","MoU","Internships","PPOs","Score",""].map((h, i) => (
									<th key={i} className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{filtered.map(c => (
								<tr key={c.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
									<td className="py-3 px-4">
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-xs">{c.name.charAt(0)}</div>
											<div>
												<p className="font-bold text-gray-900 dark:text-white">{c.name}</p>
												<p className="text-xs text-gray-400">Since {c.since}</p>
											</div>
										</div>
									</td>
									<td className="py-3 px-4 text-gray-600 dark:text-gray-300">{c.domain}</td>
									<td className="py-3 px-4">
										<Badge className={REL_COLORS[c.relationship] || REL_COLORS["Standard Recruiter"]}>{c.relationship}</Badge>
									</td>
									<td className="py-3 px-4">
										<Badge className={STATUS_COLORS[c.mouStatus]?.badge || STATUS_COLORS.Active.badge}>{c.mouStatus}</Badge>
									</td>
									<td className="py-3 px-4 font-bold text-center text-gray-900 dark:text-white">{c.internshipsOffered}</td>
									<td className="py-3 px-4 font-bold text-center text-teal-600 dark:text-teal-400">{c.pposGiven}</td>
									<td className="py-3 px-4 text-center">
										<span className={`font-bold ${c.engagementScore >= 85 ? "text-green-600 dark:text-green-400" : c.engagementScore >= 70 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>
											{c.engagementScore}
										</span>
									</td>
									<td className="py-3 px-4">
										<button
											onClick={() => navigate("/industry-relations/company-detail", { state: { company: c } })}
											className="flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 transition-colors whitespace-nowrap"
										>
											See More <ArrowRight className="size-3" />
										</button>
									</td>
								</tr>
							))}
							{filtered.length === 0 && (
								<tr>
									<td colSpan={8} className="py-12 text-center text-sm text-gray-400">No companies match the selected filters.</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

/* ═══════════════════════════════════════════════════════
   MoUs TAB – dropdown filter + See More → new page
═══════════════════════════════════════════════════════ */
const MousTab = ({ mous }) => {
	const navigate = useNavigate();
	const [statusFilter, setStatus] = useState("All");
	const [typeFilter,   setType]   = useState("All");

	const types    = useMemo(() => ["All", ...new Set(mous.map(m => m.type))], [mous]);
	const filtered = useMemo(() => mous.filter(m => {
		const ss = statusFilter === "All" || m.status === statusFilter;
		const tt = typeFilter   === "All" || m.type   === typeFilter;
		return ss && tt;
	}), [mous, statusFilter, typeFilter]);

	return (
		<div className="space-y-4">
			{/* Dropdown Filters */}
			<div className="flex items-center gap-3 flex-wrap">
				<Filter className="size-4 text-gray-400" />
				<select
					value={statusFilter}
					onChange={e => setStatus(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-teal-400 cursor-pointer"
				>
					{["All","Active","Expired","Pending"].map(s => (
						<option key={s}>{s === "All" ? "All Statuses" : s}</option>
					))}
				</select>
				<select
					value={typeFilter}
					onChange={e => setType(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-teal-400 cursor-pointer"
				>
					{types.map(t => (
						<option key={t}>{t === "All" ? "All Types" : t}</option>
					))}
				</select>
				<span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{filtered.length} MoUs</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{filtered.map(mou => {
					const sc = STATUS_COLORS[mou.status] || STATUS_COLORS.Active;
					return (
						<div key={mou.id} className={`rounded-2xl border-2 transition-all hover:shadow-lg ${sc.border}`}>
							<div className="p-5">
								<div className="flex items-start justify-between mb-2">
									<div>
										<h3 className="font-bold text-gray-900 dark:text-white">{mou.companyName}</h3>
										<p className="text-xs text-gray-500 dark:text-gray-400">{mou.type}</p>
									</div>
									<div className="flex flex-col items-end gap-1">
										<Badge className={sc.badge}>{mou.status}</Badge>
										{mou.renewalPending && <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Renewal Due</Badge>}
									</div>
								</div>

								<p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{mou.scope}</p>

								<div className="flex flex-wrap gap-1.5 mb-3">
									{mou.rolesLookingFor?.slice(0, 3).map((r, i) => (
										<span key={i} className="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-md text-[11px] font-medium">{r}</span>
									))}
									{mou.rolesLookingFor?.length > 3 && (
										<span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md text-[11px] font-medium">+{mou.rolesLookingFor.length - 3} more</span>
									)}
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
										<span className="flex items-center gap-1">
											<CalendarDays className="size-3" />
											{new Date(mou.startDate).toLocaleDateString()} – {new Date(mou.endDate).toLocaleDateString()}
										</span>
										{mou.hiresLastYear != null && (
											<span className="flex items-center gap-1">
												<Users className="size-3" />{mou.hiresLastYear}/yr
											</span>
										)}
									</div>
								</div>

								<button
									onClick={() => navigate("/industry-relations/mou-detail", { state: { mou } })}
									className="flex items-center gap-1 mt-3 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
								>
									See More <ArrowRight className="size-3" />
								</button>
							</div>
						</div>
					);
				})}
				{filtered.length === 0 && (
					<div className="col-span-2 text-center py-12 text-sm text-gray-400">No MoUs match the selected filters.</div>
				)}
			</div>
		</div>
	);
};

/* ═══════════════════════════════════════════════════════
   MINI FUNNEL – extracted so useState works per-card
═══════════════════════════════════════════════════════ */
const STAGES       = ["eligible","applied","shortlisted","interned","ppoOffered","placed"];
const STAGE_LABELS = ["Eligible","Applied","Shortlisted","Interned","PPO","Placed"];
const BAR_COLORS   = [
	"bg-gray-400 dark:bg-gray-500",
	"bg-blue-400",
	"bg-cyan-400",
	"bg-teal-500",
	"bg-emerald-500",
	"bg-green-600",
];
const STAGE_DESC = [
	"Total eligible students",
	"Students who applied",
	"Shortlisted for interviews",
	"Completed internship",
	"PPO offers extended",
	"Final placements confirmed",
];

const MiniFunnel = ({ pipeline, onBarClick }) => {
	const [hovered, setHovered] = useState(null);

	return (
		<div className="relative mb-4">
			<p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold mb-2 flex items-center gap-1 cursor-default select-none">
				<span>📊</span> Click any bar to view stage details
			</p>
			<div className="flex items-end gap-1">
				{STAGES.map((stage, i) => {
					const val   = pipeline[stage] ?? 0;
					const pct   = pipeline.eligible > 0 ? (val / pipeline.eligible) * 100 : 0;
					const isHov = hovered === i;

					return (
						<div
							key={stage}
							className="flex-1 text-center relative group"
							onMouseEnter={() => setHovered(i)}
							onMouseLeave={() => setHovered(null)}
							onClick={() => onBarClick(stage)}
							style={{ cursor: "pointer" }}
						>
							{/* Tooltip */}
							{isHov && (
								<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-30 pointer-events-none animate-in fade-in duration-150">
									<div className="bg-gray-900 dark:bg-gray-800 text-white rounded-xl px-3 py-2 shadow-2xl whitespace-nowrap text-left border border-gray-700">
										<p className={`text-[10px] font-bold mb-0.5 ${
											i === 5 ? "text-green-400" : i === 4 ? "text-emerald-400" : i === 3 ? "text-teal-400" : i <= 1 ? "text-blue-400" : "text-cyan-400"
										}`}>{STAGE_LABELS[i]}</p>
										<p className="text-sm font-bold text-white">{val} students</p>
										<p className="text-[10px] text-gray-400">{pct.toFixed(1)}% of eligible</p>
										{i > 0 && (
											<p className="text-[10px] text-gray-500 mt-0.5">
												Drop-off: {pipeline[STAGES[i-1]] - val}
											</p>
										)}
										{/* Arrow */}
										<div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800" />
									</div>
								</div>
							)}

							{/* Count */}
							<p className={`text-xs font-bold mb-1 transition-colors ${isHov ? "text-teal-600 dark:text-teal-400" : "text-gray-900 dark:text-white"}`}>
								{val}
							</p>

							{/* Bar */}
							<div className={`h-16 bg-gray-100 dark:bg-gray-800 rounded-t-lg relative overflow-visible transition-all duration-200 ${
								isHov ? "ring-2 ring-teal-400 ring-offset-1 scale-x-[1.08]" : ""
							}`}>
								<div
									className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${BAR_COLORS[i]} ${isHov ? "brightness-125" : ""}`}
									style={{ height: `${pct}%` }}
								/>
							</div>

							{/* Label */}
							<p className={`text-[9px] mt-1 font-semibold transition-colors ${isHov ? "text-teal-600 dark:text-teal-400" : "text-gray-500 dark:text-gray-400"}`}>
								{STAGE_LABELS[i]}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

/* ═══════════════════════════════════════════════════════
   PIPELINES TAB – dropdown filter + clickable bars
═══════════════════════════════════════════════════════ */
const PipelinesTab = ({ pipelines }) => {
	const navigate = useNavigate();
	const [domainFilter, setDomain] = useState("All");
	const [sortBy,       setSort]   = useState("placed");

	const domains  = useMemo(() => ["All", ...new Set(pipelines.map(p => p.domain))], [pipelines]);
	const filtered = useMemo(() =>
		[...pipelines]
			.filter(p => domainFilter === "All" || p.domain === domainFilter)
			.sort((a, b) => b[sortBy] - a[sortBy]),
		[pipelines, domainFilter, sortBy]
	);

	return (
		<div className="space-y-4">
			{/* Dropdown Filters */}
			<div className="flex items-center gap-3 flex-wrap">
				<Filter className="size-4 text-gray-400" />
				<select
					value={domainFilter}
					onChange={e => setDomain(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-teal-400 cursor-pointer"
				>
					{domains.map(d => <option key={d}>{d === "All" ? "All Domains" : d}</option>)}
				</select>
				<select
					value={sortBy}
					onChange={e => setSort(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-teal-400 cursor-pointer"
				>
					<option value="placed">Sort: Most Placed</option>
					<option value="eligible">Sort: Most Eligible</option>
					<option value="avgSalaryLpa">Sort: Avg Salary</option>
					<option value="maxSalaryLpa">Sort: Highest Salary</option>
				</select>
				<span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{filtered.length} pipelines</span>
			</div>

			<div className="space-y-4">
				{filtered.map(p => (
					<div key={p.companyId} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all p-5">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-sm">
									{p.companyName.charAt(0)}
								</div>
								<div>
									<h3 className="font-bold text-gray-900 dark:text-white">{p.companyName}</h3>
									<p className="text-xs text-gray-500 dark:text-gray-400">{p.domain}</p>
								</div>
							</div>
							<span className="text-sm font-bold text-teal-600 dark:text-teal-400">
								{Math.round((p.placed / p.eligible) * 100)}% conversion
							</span>
						</div>

						{/* Quick stats */}
						<div className="flex flex-wrap gap-2 mb-4">
							{p.avgSalaryLpa != null && (
								<div className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
									<p className="text-[10px] text-gray-500">Avg Salary</p>
									<p className="text-sm font-bold text-teal-700 dark:text-teal-400">{p.avgSalaryLpa} LPA</p>
								</div>
							)}
							{p.maxSalaryLpa != null && (
								<div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
									<p className="text-[10px] text-gray-500">Max Salary</p>
									<p className="text-sm font-bold text-amber-700 dark:text-amber-400">{p.maxSalaryLpa} LPA</p>
								</div>
							)}
							{p.rolesOffered?.length > 0 && (
								<div className="px-3 py-1.5 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
									<p className="text-[10px] text-gray-500">Roles</p>
									<p className="text-sm font-bold text-violet-700 dark:text-violet-400">
										{Object.keys(p.rolesFilled || {}).length}/{p.rolesOffered.length} filled
									</p>
								</div>
							)}
						</div>

						<MiniFunnel
							pipeline={p}
							onBarClick={(stage) => navigate("/industry-relations/pipeline-detail", { state: { pipeline: p, activeStage: stage } })}
						/>

						<button
							onClick={() => navigate("/industry-relations/pipeline-detail", { state: { pipeline: p } })}
							className="flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
						>
							See More <ArrowRight className="size-3" />
						</button>
					</div>
				))}
				{filtered.length === 0 && (
					<div className="text-center py-12 text-sm text-gray-400">No pipelines match the selected filters.</div>
				)}
			</div>
		</div>
	);
};

/* ═══════════════════════════════════════════════════════
   HISTORY TAB – dropdown filters
═══════════════════════════════════════════════════════ */
const HistoryTab = ({ recruiters }) => {
	const [trendFilter,  setTrend]   = useState("All");
	const [conFilter,    setCon]     = useState("All");
	const [sortBy,       setSortBy]  = useState("yearsRecruiting");

	const sorted = useMemo(() =>
		[...recruiters]
			.filter(r => {
				const tt = trendFilter === "All" || r.trend        === trendFilter;
				const cc = conFilter   === "All" || r.consistency  === conFilter;
				return tt && cc;
			})
			.sort((a, b) => b[sortBy] - a[sortBy]),
		[recruiters, trendFilter, conFilter, sortBy]
	);

	const trendBg = t => ({
		Growing:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
		Stable:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
		Declining:"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
	})[t] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

	const conColor = c => ({
		High:   "text-green-600 dark:text-green-400",
		Medium: "text-yellow-600 dark:text-yellow-400",
		Low:    "text-red-600 dark:text-red-400",
	})[c] || "text-gray-500";

	return (
		<div className="space-y-4">
			{/* Dropdown Filters */}
			<div className="flex items-center gap-3 flex-wrap">
				<Filter className="size-4 text-gray-400" />
				<select
					value={trendFilter}
					onChange={e => setTrend(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-teal-400 cursor-pointer"
				>
					{["All","Growing","Stable","Declining"].map(t => (
						<option key={t}>{t === "All" ? "All Trends" : t}</option>
					))}
				</select>
				<select
					value={conFilter}
					onChange={e => setCon(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-teal-400 cursor-pointer"
				>
					{["All","High","Medium","Low"].map(c => (
						<option key={c}>{c === "All" ? "All Consistency" : c}</option>
					))}
				</select>
				<select
					value={sortBy}
					onChange={e => setSortBy(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-teal-400 cursor-pointer"
				>
					<option value="yearsRecruiting">Sort: Years</option>
					<option value="totalHires">Sort: Total Hires</option>
					<option value="avgHiresPerYear">Sort: Avg/Year</option>
				</select>
				<span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{sorted.length} recruiters</span>
			</div>

			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800">
								{["Company","Years Recruiting","Total Hires","Avg/Year","Consistency","Trend","Last Visit"].map(h => (
									<th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{sorted.map(r => (
								<tr key={r.companyId} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
									<td className="py-3 px-4">
										<div className="flex items-center gap-2">
											<div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-xs">
												{r.companyName.charAt(0)}
											</div>
											<span className="font-bold text-gray-900 dark:text-white">{r.companyName}</span>
										</div>
									</td>
									<td className="py-3 px-4 font-bold text-gray-900 dark:text-white">{r.yearsRecruiting} yrs</td>
									<td className="py-3 px-4 font-bold text-gray-900 dark:text-white">{r.totalHires}</td>
									<td className="py-3 px-4 text-gray-600 dark:text-gray-300">{r.avgHiresPerYear}</td>
									<td className="py-3 px-4">
										<span className={`font-bold ${conColor(r.consistency)}`}>{r.consistency}</span>
									</td>
									<td className="py-3 px-4">
										<span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${trendBg(r.trend)}`}>{r.trend}</span>
									</td>
									<td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400">
										{new Date(r.lastVisit).toLocaleDateString()}
									</td>
								</tr>
							))}
							{sorted.length === 0 && (
								<tr>
									<td colSpan={7} className="py-12 text-center text-sm text-gray-400">No recruiters match the selected filters.</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default IndustryRelationsUI;
