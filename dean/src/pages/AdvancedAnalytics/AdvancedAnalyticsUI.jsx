// src/pages/AdvancedAnalytics/AdvancedAnalyticsUI.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
	LayoutDashboard, GraduationCap, Activity, TrendingUp, TrendingDown,
	RefreshCw, ArrowLeft, AlertTriangle, Award, BookOpen, Briefcase,
	Target, AlertCircle, CheckCircle, Library, Microscope,
	Users, Filter, X, ArrowRight, Handshake, Building2,
	BadgeCheck, Clock, Star, BarChart3,
} from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";

/* ── shared ── */
const RiskBadge = ({ level }) => {
	const m = {
		high:   "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
		medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
		low:    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	};
	return <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${m[level] || m.low}`}>{level}</span>;
};

const MiniBar = ({ value, max, color = "bg-indigo-500" }) => (
	<div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
		<div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
	</div>
);

const SectionHeader = ({ title, subtitle }) => (
	<div className="mb-4">
		<h3 className="text-base font-bold text-gray-900 dark:text-white">{title}</h3>
		{subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
	</div>
);

const BATCH_CONFIG = [
	{ label: "1st Year", year: "1st", color: "text-indigo-600 dark:text-indigo-400",  bg: "bg-indigo-50 dark:bg-indigo-900/20",  border: "border-indigo-200 dark:border-indigo-800",  fill: "bg-indigo-500" },
	{ label: "2nd Year", year: "2nd", color: "text-blue-600 dark:text-blue-400",      bg: "bg-blue-50 dark:bg-blue-900/20",       border: "border-blue-200 dark:border-blue-800",      fill: "bg-blue-500" },
	{ label: "3rd Year", year: "3rd", color: "text-violet-600 dark:text-violet-400",  bg: "bg-violet-50 dark:bg-violet-900/20",   border: "border-violet-200 dark:border-violet-800",  fill: "bg-violet-500" },
	{ label: "4th Year", year: "4th", color: "text-teal-600 dark:text-teal-400",      bg: "bg-teal-50 dark:bg-teal-900/20",       border: "border-teal-200 dark:border-teal-800",      fill: "bg-teal-500" },
];

/* ─── PLACEMENT DATA — used across Engagement + Trends ─── */
const PLACEMENT_BY_DEPT = [
	{ dept: "CSE",    eligible: 112, applied: 98,  selected: 72,  interned: 60,  ppo: 28, placed: 88, rate: 78 },
	{ dept: "ECE",    eligible: 54,  applied: 43,  selected: 31,  interned: 24,  ppo: 10, placed: 38, rate: 70 },
	{ dept: "ME",     eligible: 45,  applied: 30,  selected: 18,  interned: 12,  ppo: 4,  placed: 22, rate: 49 },
	{ dept: "Civil",  eligible: 45,  applied: 20,  selected: 10,  interned: 6,   ppo: 2,  placed: 14, rate: 31 },
	{ dept: "MBA",    eligible: 49,  applied: 44,  selected: 36,  interned: 30,  ppo: 12, placed: 42, rate: 86 },
	{ dept: "Ph.D",   eligible: 9,   applied: 9,   selected: 9,   interned: 8,   ppo: 7,  placed: 9,  rate: 100 },
];

/* Placement + Recruiters split by year */
const PLACEMENT_BY_YEAR = {
	"All":  PLACEMENT_BY_DEPT,
	"1st":  [
		{ dept: "CSE",   eligible: 28, applied: 10, selected: 6,  interned: 4,  ppo: 0, placed: 0,  rate: 0,  note: "Research / orientation drives" },
		{ dept: "ECE",   eligible: 14, applied: 4,  selected: 2,  interned: 2,  ppo: 0, placed: 0,  rate: 0,  note: "Lab project exposure" },
		{ dept: "ME",    eligible: 11, applied: 3,  selected: 1,  interned: 1,  ppo: 0, placed: 0,  rate: 0,  note: "Workshops only" },
		{ dept: "MBA",   eligible: 12, applied: 6,  selected: 4,  interned: 3,  ppo: 0, placed: 0,  rate: 0,  note: "Industry immersion" },
	],
	"2nd":  [
		{ dept: "CSE",   eligible: 28, applied: 22, selected: 15, interned: 12, ppo: 2, placed: 0,  rate: 0  },
		{ dept: "ECE",   eligible: 14, applied: 10, selected: 7,  interned: 5,  ppo: 1, placed: 0,  rate: 0  },
		{ dept: "ME",    eligible: 11, applied: 6,  selected: 3,  interned: 2,  ppo: 0, placed: 0,  rate: 0  },
		{ dept: "MBA",   eligible: 12, applied: 10, selected: 8,  interned: 7,  ppo: 2, placed: 0,  rate: 0  },
	],
	"3rd":  [
		{ dept: "CSE",   eligible: 28, applied: 26, selected: 20, interned: 18, ppo: 10, placed: 0, rate: 0  },
		{ dept: "ECE",   eligible: 14, applied: 12, selected: 9,  interned: 7,  ppo: 4,  placed: 0, rate: 0  },
		{ dept: "ME",    eligible: 11, applied: 8,  selected: 5,  interned: 4,  ppo: 2,  placed: 0, rate: 0  },
		{ dept: "MBA",   eligible: 12, applied: 11, selected: 9,  interned: 8,  ppo: 5,  placed: 0, rate: 0  },
	],
	"4th":  [
		{ dept: "CSE",   eligible: 28, applied: 28, selected: 22, interned: 18, ppo: 15, placed: 26, rate: 93 },
		{ dept: "ECE",   eligible: 14, applied: 13, selected: 10, interned: 8,  ppo: 5,  placed: 11, rate: 79 },
		{ dept: "ME",    eligible: 11, applied: 9,  selected: 6,  interned: 4,  ppo: 2,  placed: 7,  rate: 64 },
		{ dept: "Civil", eligible: 11, applied: 7,  selected: 3,  interned: 2,  ppo: 1,  placed: 4,  rate: 36 },
		{ dept: "MBA",   eligible: 12, applied: 12, selected: 11, interned: 9,  ppo: 5,  placed: 11, rate: 92 },
		{ dept: "Ph.D",  eligible: 9,  applied: 9,  selected: 9,  interned: 8,  ppo: 7,  placed: 9,  rate: 100 },
	],
};

const TOP_RECRUITERS_BY_YEAR = {
	"All":  [
		{ company: "Google",        hires: 12, ppos: 8,  avgPkg: 45,  domain: "Tech" },
		{ company: "Microsoft",     hires: 10, ppos: 6,  avgPkg: 42,  domain: "Tech" },
		{ company: "Amazon",        hires: 9,  ppos: 5,  avgPkg: 38,  domain: "Tech" },
		{ company: "TCS",           hires: 18, ppos: 3,  avgPkg: 7,   domain: "IT Services" },
		{ company: "Infosys",       hires: 14, ppos: 2,  avgPkg: 6.5, domain: "IT Services" },
		{ company: "Goldman Sachs", hires: 6,  ppos: 4,  avgPkg: 30,  domain: "Finance" },
	],
	"1st":  [
		{ company: "Google (Research)",  hires: 4,  ppos: 0, avgPkg: 0,  domain: "Research Intern" },
		{ company: "Microsoft Explore",  hires: 3,  ppos: 0, avgPkg: 0,  domain: "Explore Program" },
		{ company: "ISRO / DRDO",        hires: 5,  ppos: 0, avgPkg: 0,  domain: "Govt Research" },
	],
	"2nd":  [
		{ company: "Infosys InStep",     hires: 8,  ppos: 2, avgPkg: 5,  domain: "IT Services" },
		{ company: "Wipro Turbo",        hires: 6,  ppos: 1, avgPkg: 4.5,domain: "IT Services" },
		{ company: "Siemens (Intern)",   hires: 4,  ppos: 1, avgPkg: 8,  domain: "Engineering" },
	],
	"3rd":  [
		{ company: "Google STEP",        hires: 5,  ppos: 3, avgPkg: 20, domain: "Tech" },
		{ company: "Amazon SDE Intern",  hires: 7,  ppos: 4, avgPkg: 18, domain: "Tech" },
		{ company: "Goldman Sachs",      hires: 4,  ppos: 3, avgPkg: 25, domain: "Finance" },
		{ company: "Deloitte USI",       hires: 6,  ppos: 2, avgPkg: 12, domain: "Consulting" },
	],
	"4th":  [
		{ company: "Google",             hires: 12, ppos: 8, avgPkg: 45, domain: "Tech" },
		{ company: "Microsoft",          hires: 10, ppos: 6, avgPkg: 42, domain: "Tech" },
		{ company: "Amazon",             hires: 9,  ppos: 5, avgPkg: 38, domain: "Tech" },
		{ company: "Goldman Sachs",      hires: 6,  ppos: 4, avgPkg: 30, domain: "Finance" },
		{ company: "TCS NQT",            hires: 18, ppos: 3, avgPkg: 7,  domain: "IT Services" },
	],
};

const TOP_RECRUITERS = TOP_RECRUITERS_BY_YEAR["All"];

/* ─── MAIN LAYOUT ─── */
const AdvancedAnalyticsUI = ({ data, activeTab, onTabChange, loading, error, onRefresh }) => {
	const navigate = useNavigate();
	const [studentListBatch, setStudentListBatch] = useState(null);

	const tabs = [
		{ id: "overview",    label: "Overview",          icon: LayoutDashboard },
		{ id: "students",    label: "Student Analytics", icon: GraduationCap },
		{ id: "engagement",  label: "Engagement",        icon: Activity },
		{ id: "trends",      label: "Trends",            icon: TrendingUp },
	];

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />
			<div className="bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-800 dark:from-indigo-900 dark:via-blue-950 dark:to-indigo-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-6 pb-0">
					<div className="flex items-center gap-4 mb-5">
						<button onClick={() => navigate("/dashboard")} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm">
							<ArrowLeft className="size-5" />
						</button>
						<div>
							<h1 className="text-2xl font-bold tracking-tight">Student Analytics</h1>
							<p className="text-indigo-100/80 text-sm mt-0.5">Batch-wise & department-wise student performance, engagement & trends.</p>
						</div>
					</div>
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{tabs.map(t => {
							const Icon = t.icon;
							return (
								<button key={t.id} onClick={() => onTabChange(t.id)}
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${activeTab === t.id ? "bg-gray-50 dark:bg-[#0f1117] text-indigo-700 dark:text-indigo-400" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
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
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6"><AlertTriangle className="size-10 text-red-600" /></div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
						<p className="text-gray-500 mb-8">{error}</p>
						<button onClick={onRefresh} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold">
							<RefreshCw className="size-4" />Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-indigo-500" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Analytics…</p>
					</div>
				) : data ? (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{activeTab === "overview"   && <OverviewTab   data={data} />}
						{activeTab === "students"   && <StudentsTab   data={data} onOpenBatch={setStudentListBatch} />}
						{activeTab === "engagement" && <EngagementTab data={data} />}
						{activeTab === "trends"     && <TrendsTab     data={data} />}
					</div>
				) : null}
			</main>

			{/* Student List Drawer */}
			{studentListBatch && (
				<StudentListDrawer
					batch={studentListBatch}
					students={data?.studentPerformance || []}
					onClose={() => setStudentListBatch(null)}
				/>
			)}

			<BottomNavController />
			<FooterController />
		</div>
	);
};

/* ─── STUDENT LIST DRAWER ─── */
const StudentListDrawer = ({ batch, students, onClose }) => {
	const [deptFilter, setDept] = useState("All");
	const [riskFilter, setRisk] = useState("All");

	const batchStudents = students.filter(s => s.year === batch.year);
	const depts = ["All", ...new Set(batchStudents.map(s => s.department))];
	const filtered = batchStudents.filter(s => {
		const dOk = deptFilter === "All" || s.department === deptFilter;
		const rOk = riskFilter === "All" || s.riskLevel === riskFilter;
		return dOk && rOk;
	});

	return (
		<div className="fixed inset-0 z-50 flex">
			<div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
			<div className="w-full max-w-xl bg-white dark:bg-[#1a1d26] h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
				<div className="sticky top-0 bg-white dark:bg-[#1a1d26] border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
					<div>
						<h2 className="font-bold text-gray-900 dark:text-white">{batch.label} Students</h2>
						<p className="text-xs text-gray-500">{batchStudents.length} total · {filtered.length} shown</p>
					</div>
					<button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
						<X className="size-5 text-gray-500" />
					</button>
				</div>
				<div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
					<select value={deptFilter} onChange={e => setDept(e.target.value)}
						className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none">
						{depts.map(d => <option key={d}>{d}</option>)}
					</select>
					<div className="flex gap-1">
						{["All","high","medium","low"].map(r => (
							<button key={r} onClick={() => setRisk(r)}
								className={`px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${riskFilter === r ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>{r}</button>
						))}
					</div>
				</div>
				<div className="p-4 space-y-2">
					{filtered.map(s => (
						<div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
							<div className="flex items-center gap-3">
								<div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] text-white ${s.riskLevel === "high" ? "bg-red-500" : s.riskLevel === "medium" ? "bg-yellow-500" : "bg-indigo-500"}`}>
									{s.name.split(" ").map(n => n[0]).join("")}
								</div>
								<div>
									<p className="text-sm font-bold text-gray-900 dark:text-white">{s.name}</p>
									<p className="text-[10px] text-gray-500">{s.id} · {s.department}</p>
								</div>
							</div>
							<div className="text-right">
								<p className={`text-sm font-bold ${s.gpa >= 7.5 ? "text-green-600 dark:text-green-400" : s.gpa >= 6 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>GPA {s.gpa}</p>
								<p className="text-[10px] text-gray-500">{s.attendancePct}% attend</p>
								<RiskBadge level={s.riskLevel} />
							</div>
						</div>
					))}
					{filtered.length === 0 && (
						<p className="text-center text-sm text-gray-400 py-12">No students match the selected filters.</p>
					)}
				</div>
			</div>
		</div>
	);
};

/* ─── OVERVIEW ─── */
const OverviewTab = ({ data }) => {
	const { summary, studentsByDepartment = [], attendanceHeatmap, studentPerformance = [] } = data;
	const [yearFilter, setYearFilter] = useState("All");

	const filteredStudents = useMemo(() =>
		yearFilter === "All" ? studentPerformance : studentPerformance.filter(s => s.year === yearFilter.replace(" Year", "")),
		[studentPerformance, yearFilter]
	);

	const filteredDepts = useMemo(() => {
		if (yearFilter === "All") return studentsByDepartment;
		const byYear = filteredStudents;
		return studentsByDepartment.map(d => {
			const dStudents = byYear.filter(s => s.department === d.department);
			return {
				...d,
				totalStudents: dStudents.length,
				avgGpa: dStudents.length ? +(dStudents.reduce((s, st) => s + st.gpa, 0) / dStudents.length).toFixed(1) : d.avgGpa,
				avgAttendance: dStudents.length ? Math.round(dStudents.reduce((s, st) => s + st.attendancePct, 0) / dStudents.length) : d.avgAttendance,
				atRisk: dStudents.filter(s => s.riskLevel === "high").length,
			};
		}).filter(d => d.totalStudents > 0);
	}, [studentsByDepartment, filteredStudents, yearFilter]);

	const dynSummary = useMemo(() => ({
		totalStudents: filteredStudents.length || summary.totalStudents,
		avgGpa:        filteredStudents.length ? +(filteredStudents.reduce((s, st) => s + st.gpa, 0) / filteredStudents.length).toFixed(1) : summary.avgStudentGpa,
		attendance:    filteredStudents.length ? Math.round(filteredStudents.reduce((s, st) => s + st.attendancePct, 0) / filteredStudents.length) : summary.overallAttendance,
		atRisk:        filteredStudents.filter(s => s.riskLevel === "high").length || summary.atRiskStudents,
	}), [filteredStudents, summary]);

	const stats = [
		{ label: "Total Students",    value: dynSummary.totalStudents,           icon: GraduationCap, color: "text-indigo-600 dark:text-indigo-400",  bg: "bg-indigo-50 dark:bg-indigo-900/20" },
		{ label: "Avg GPA",           value: dynSummary.avgGpa,                  icon: Award,         color: "text-teal-600 dark:text-teal-400",      bg: "bg-teal-50 dark:bg-teal-900/20" },
		{ label: "Avg Attendance",    value: `${dynSummary.attendance}%`,         icon: CheckCircle,   color: "text-green-600 dark:text-green-400",    bg: "bg-green-50 dark:bg-green-900/20" },
		{ label: "At-Risk Students",  value: dynSummary.atRisk,                   icon: AlertCircle,   color: "text-red-600 dark:text-red-400",        bg: "bg-red-50 dark:bg-red-900/20" },
		{ label: "Placement Rate",    value: `${summary.placementRate}%`,          icon: Target,        color: "text-blue-600 dark:text-blue-400",      bg: "bg-blue-50 dark:bg-blue-900/20" },
		{ label: "Active Projects",   value: summary.activeProjects,               icon: Briefcase,     color: "text-violet-600 dark:text-violet-400",  bg: "bg-violet-50 dark:bg-violet-900/20" },
	];

	return (
		<div className="space-y-6">
			{/* Year filter */}
			<div className="flex items-center gap-3 flex-wrap">
				<Filter className="size-4 text-gray-400" />
				<select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-400 cursor-pointer">
					<option>All</option>
					<option>1st Year</option>
					<option>2nd Year</option>
					<option>3rd Year</option>
					<option>4th Year</option>
				</select>
				{yearFilter !== "All" && (
					<button onClick={() => setYearFilter("All")} className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
						<X className="size-3" />Clear
					</button>
				)}
				<span className="ml-auto text-xs text-gray-500">{dynSummary.totalStudents} students</span>
			</div>

			{/* ── Compact KPI row – all 6 in one row ── */}
			<div className="grid grid-cols-3 md:grid-cols-6 gap-3">
				{stats.map((s, i) => {
					const Icon = s.icon;
					return (
						<div key={i} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-3 hover:shadow-md transition-all">
							<div className={`w-7 h-7 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
								<Icon className={`size-3.5 ${s.color}`} />
							</div>
							<p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight font-medium">{s.label}</p>
							<p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{s.value}</p>
						</div>
					);
				})}
			</div>

			{/* Dept Overview */}
			{filteredDepts.length > 0 && (
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
					<div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
						<h3 className="text-base font-bold text-gray-900 dark:text-white">Department-wise Overview</h3>
						{yearFilter !== "All" && <p className="text-xs text-indigo-500 mt-0.5">Filtered: {yearFilter}</p>}
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-gray-100 dark:border-gray-800">
									{["Department","Students","Avg GPA","Attendance","At-Risk","Backlogs","Placement"].map(h => (
										<th key={h} className="text-left py-2.5 px-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{filteredDepts.map(d => (
									<tr key={d.department} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
										<td className="py-2.5 px-3 font-bold text-gray-900 dark:text-white">{d.department}</td>
										<td className="py-2.5 px-3">{d.totalStudents}</td>
										<td className="py-2.5 px-3"><span className={`font-bold ${d.avgGpa >= 7.5 ? "text-green-600 dark:text-green-400" : d.avgGpa >= 7 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>{d.avgGpa}</span></td>
										<td className="py-2.5 px-3"><span className={`font-bold ${d.avgAttendance >= 80 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}>{d.avgAttendance}%</span></td>
										<td className="py-2.5 px-3"><span className="font-bold text-red-600 dark:text-red-400">{d.atRisk}</span></td>
										<td className="py-2.5 px-3">{d.backlogs}</td>
										<td className="py-2.5 px-3"><span className="font-bold text-indigo-600 dark:text-indigo-400">{d.placementRate}%</span></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Attendance Heatmap */}
			{attendanceHeatmap && <AttendanceHeatmap heatmap={attendanceHeatmap} />}
		</div>
	);
};

const AttendanceHeatmap = ({ heatmap }) => {
	const cellColor = (v) => {
		if (v >= 85) return "bg-indigo-600 text-white";
		if (v >= 80) return "bg-indigo-400 text-white";
		if (v >= 75) return "bg-indigo-200 text-indigo-900 dark:bg-indigo-800 dark:text-indigo-100";
		if (v >= 70) return "bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100";
		return "bg-red-300 text-red-900 dark:bg-red-800 dark:text-red-100";
	};
	return (
		<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
			<h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Attendance Heatmap</h3>
			<p className="text-xs text-gray-500 mb-4">Attendance % by department & year level</p>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr>
							<th className="text-left py-2 px-3 text-xs font-bold text-gray-500 dark:text-gray-400">Dept</th>
							{heatmap.years.map(y => <th key={y} className="text-center py-2 px-3 text-xs font-bold text-gray-500 dark:text-gray-400">{y}</th>)}
						</tr>
					</thead>
					<tbody>
						{heatmap.departments.map((dept, di) => (
							<tr key={dept} className="border-t border-gray-100 dark:border-gray-800">
								<td className="py-2 px-3 text-sm font-bold text-gray-900 dark:text-white">{dept}</td>
								{heatmap.data[di].map((val, yi) => (
									<td key={yi} className="py-2 px-3 text-center">
										<span className={`inline-block w-14 py-1.5 rounded-lg text-xs font-bold ${cellColor(val)}`}>{val}%</span>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="flex items-center gap-2 mt-4 justify-end">
				<span className="text-xs text-gray-500">Low</span>
				<div className="flex gap-1">
					{["bg-red-300 dark:bg-red-800","bg-amber-200 dark:bg-amber-800","bg-indigo-200 dark:bg-indigo-800","bg-indigo-400","bg-indigo-600"].map((c, i) => (
						<div key={i} className={`w-6 h-4 rounded ${c}`} />
					))}
				</div>
				<span className="text-xs text-gray-500">High</span>
			</div>
		</div>
	);
};

/* ─── STUDENTS ─── */
const StudentsTab = ({ data, onOpenBatch }) => {
	const { studentPerformance = [], studentsByDepartment = [] } = data;
	const [deptFilter, setDept]   = useState("All");
	const [batchFilter, setBatch] = useState("All");
	const [riskFilter, setRisk]   = useState("All");

	const depts = ["All", ...new Set(studentPerformance.map(s => s.department))];
	const batchOptions = ["All", "1st", "2nd", "3rd", "4th"];

	const filtered = useMemo(() => studentPerformance.filter(s => {
		const dOk = deptFilter === "All" || s.department === deptFilter;
		const bOk = batchFilter === "All" || s.year === batchFilter;
		const rOk = riskFilter === "All" || s.riskLevel === riskFilter;
		return dOk && bOk && rOk;
	}), [studentPerformance, deptFilter, batchFilter, riskFilter]);

	const statusColor = st => ({ "On Track": "text-green-600 dark:text-green-400", "Monitor": "text-yellow-600 dark:text-yellow-400", "At Risk": "text-red-600 dark:text-red-400" })[st] || "";

	return (
		<div className="space-y-6">
			{/* 4 Batch Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{BATCH_CONFIG.map(bc => {
					const bStudents = studentPerformance.filter(s => s.year === bc.year);
					const atRisk    = bStudents.filter(s => s.riskLevel === "high").length;
					const avgGpa    = bStudents.length ? (bStudents.reduce((s, st) => s + st.gpa, 0) / bStudents.length).toFixed(1) : "—";
					return (
						<button key={bc.year} onClick={() => onOpenBatch(bc)}
							className={`rounded-2xl border-2 ${bc.border} ${bc.bg} p-5 text-left hover:shadow-md transition-all group cursor-pointer`}>
							<div className="flex items-center justify-between mb-3">
								<span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${bc.bg} ${bc.color} border ${bc.border}`}>{bc.label}</span>
								<ArrowRight className={`size-4 ${bc.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
							</div>
							<p className={`text-2xl font-bold ${bc.color}`}>{bStudents.length}</p>
							<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">students</p>
							<div className="flex gap-3 mt-3 text-xs">
								<span className="text-gray-500">GPA: <strong className="text-gray-700 dark:text-gray-300">{avgGpa}</strong></span>
								{atRisk > 0 && <span className="text-red-600 dark:text-red-400 font-bold">{atRisk} at risk</span>}
							</div>
						</button>
					);
				})}
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-3 items-center">
				<Filter className="size-4 text-gray-400" />
				<select value={deptFilter} onChange={e => setDept(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-400">
					<option value="All">All Departments</option>
					{depts.filter(d => d !== "All").map(d => <option key={d}>{d}</option>)}
				</select>
				<select value={batchFilter} onChange={e => setBatch(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-400">
					<option value="All">All Years</option>
					{batchOptions.filter(b => b !== "All").map(b => <option key={b}>{b} Year</option>)}
				</select>
				<div className="flex gap-1.5">
					{["All","high","medium","low"].map(r => (
						<button key={r} onClick={() => setRisk(r)}
							className={`px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${riskFilter === r ? "bg-indigo-600 text-white" : "bg-white dark:bg-[#1a1d26] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>{r}</button>
					))}
				</div>
				{(deptFilter !== "All" || batchFilter !== "All" || riskFilter !== "All") && (
					<button onClick={() => { setDept("All"); setBatch("All"); setRisk("All"); }}
						className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
						<X className="size-3" />Clear
					</button>
				)}
				<span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{filtered.length} students</span>
			</div>

			{/* Student Table */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800">
								{["Student","ID","Dept","Year","GPA","Attend.","Backlogs","Research","Status","Risk"].map(h => (
									<th key={h} className="text-left py-3 px-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{filtered.map(s => (
								<tr key={s.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
									<td className="py-3 px-3">
										<div className="flex items-center gap-2">
											<div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] text-white ${s.riskLevel === "high" ? "bg-red-500" : s.riskLevel === "medium" ? "bg-yellow-500" : "bg-indigo-500"}`}>
												{s.name.split(" ").map(n => n[0]).join("")}
											</div>
											<span className="font-bold text-gray-900 dark:text-white text-sm">{s.name}</span>
										</div>
									</td>
									<td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">{s.id}</td>
									<td className="py-3 px-3 text-gray-600 dark:text-gray-300">{s.department}</td>
									<td className="py-3 px-3 text-gray-600 dark:text-gray-300">{s.year}</td>
									<td className="py-3 px-3"><span className={`font-bold ${s.gpa >= 7.5 ? "text-green-600 dark:text-green-400" : s.gpa >= 6 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>{s.gpa}</span></td>
									<td className="py-3 px-3"><span className={`font-bold ${s.attendancePct >= 75 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{s.attendancePct}%</span></td>
									<td className="py-3 px-3"><span className={`font-bold ${s.backlogs > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>{s.backlogs}</span></td>
									<td className="py-3 px-3 text-gray-600 dark:text-gray-300">{s.researchProjects}</td>
									<td className="py-3 px-3"><span className={`text-xs font-bold ${statusColor(s.status)}`}>{s.status}</span></td>
									<td className="py-3 px-3"><RiskBadge level={s.riskLevel} /></td>
								</tr>
							))}
							{filtered.length === 0 && (
								<tr><td colSpan={10} className="text-center text-gray-400 py-12 text-sm">No students match the selected filters.</td></tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Placement Records */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
					<Target className="size-4 text-indigo-500" />Student Placement Records by Dept
				</h3>
				<div className="space-y-3">
					{studentsByDepartment.map(d => (
						<div key={d.department} className="flex items-center gap-3">
							<span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-20">{d.department}</span>
							<div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
								<div className="h-full bg-indigo-500 rounded-full transition-all duration-700 flex items-center pl-2" style={{ width: `${d.placementRate}%` }}>
									<span className="text-[9px] text-white font-bold">{d.placementRate}%</span>
								</div>
							</div>
							<span className="text-xs text-gray-500 w-28 text-right">{d.totalStudents} students</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

/* ─── ENGAGEMENT ─── */
const EngagementTab = ({ data }) => {
	const { engagementMetrics: em, studentsByDepartment = [], studentPerformance = [] } = data;
	const [yearFilter, setYearFilter] = useState("All");

	const YEAR_KEY_MAP = { "All":"All", "1st Year":"1st", "2nd Year":"2nd", "3rd Year":"3rd", "4th Year":"4th" };
	const yearKey   = YEAR_KEY_MAP[yearFilter] || "All";
	const placementRows  = PLACEMENT_BY_YEAR[yearKey]   || PLACEMENT_BY_DEPT;
	const recruiterRows  = TOP_RECRUITERS_BY_YEAR[yearKey] || TOP_RECRUITERS_BY_YEAR["All"];

	const filteredStudents = useMemo(() =>
		yearFilter === "All" ? studentPerformance
			: studentPerformance.filter(s => s.year === yearKey),
		[studentPerformance, yearFilter, yearKey]
	);

	const yearStats = useMemo(() => ({
		total:      filteredStudents.length,
		atRisk:     filteredStudents.filter(s => s.riskLevel === "high").length,
		avgGpa:     filteredStudents.length ? +(filteredStudents.reduce((s,st) => s + st.gpa,0) / filteredStudents.length).toFixed(1) : "—",
		avgAttend:  filteredStudents.length ? Math.round(filteredStudents.reduce((s,st) => s + st.attendancePct,0) / filteredStudents.length) : "—",
	}), [filteredStudents]);

	return (
		<div className="space-y-6">

			{/* ── Year Filter ── */}
			<div className="flex items-center gap-3 flex-wrap">
				<Filter className="size-4 text-gray-400" />
				<select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-400 cursor-pointer">
					<option value="All">All Years</option>
					<option value="1st Year">1st Year</option>
					<option value="2nd Year">2nd Year</option>
					<option value="3rd Year">3rd Year</option>
					<option value="4th Year">4th Year</option>
				</select>
				{yearFilter !== "All" && (
					<button onClick={() => setYearFilter("All")} className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
						<X className="size-3" />Clear
					</button>
				)}
				{yearFilter !== "All" && (
					<div className="ml-auto flex gap-4 text-xs">
						<span className="text-gray-500">Students: <strong className="text-gray-900 dark:text-white">{yearStats.total}</strong></span>
						<span className="text-gray-500">Avg GPA: <strong className="text-indigo-600 dark:text-indigo-400">{yearStats.avgGpa}</strong></span>
						<span className="text-gray-500">Attend: <strong className="text-green-600 dark:text-green-400">{yearStats.avgAttend}%</strong></span>
						{yearStats.atRisk > 0 && <span className="text-red-600 dark:text-red-400 font-bold">{yearStats.atRisk} at risk</span>}
					</div>
				)}
			</div>

			{/* ── Placement Stats ── */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<div className="flex items-start justify-between mb-4">
					<SectionHeader
						title={`Placement Funnel${yearFilter !== "All" ? ` — ${yearFilter}` : " by Department"}`}
						subtitle={yearFilter === "1st Year" ? "Internship / research drive participation" : yearFilter === "2nd Year" ? "Summer internship pipeline" : yearFilter === "3rd Year" ? "Pre-placement internship pipeline" : yearFilter === "4th Year" ? "Final placement season stats" : "Full pipeline from eligible pool to final placements"}
					/>
					{["1st Year","2nd Year","3rd Year"].includes(yearFilter) && (
						<span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-bold px-2 py-1 rounded-lg shrink-0">Internship Phase</span>
					)}
					{yearFilter === "4th Year" && (
						<span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold px-2 py-1 rounded-lg shrink-0">Final Placement</span>
					)}
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800">
								{["Dept","Eligible","Applied","Selected","Interned","PPO","Placed","Rate"].map(h => (
									<th key={h} className="text-left py-2.5 px-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{placementRows.map(d => (
								<tr key={d.dept} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
									<td className="py-2.5 px-3 font-bold text-gray-900 dark:text-white">
										<div>{d.dept}</div>
										{d.note && <div className="text-[9px] text-gray-400 font-normal">{d.note}</div>}
									</td>
									<td className="py-2.5 px-3 text-gray-600 dark:text-gray-300">{d.eligible}</td>
									<td className="py-2.5 px-3 text-blue-600 dark:text-blue-400 font-medium">{d.applied}</td>
									<td className="py-2.5 px-3 text-cyan-600 dark:text-cyan-400 font-medium">{d.selected}</td>
									<td className="py-2.5 px-3 text-teal-600 dark:text-teal-400 font-medium">{d.interned}</td>
									<td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-medium">{d.ppo}</td>
									<td className="py-2.5 px-3 font-bold text-green-600 dark:text-green-400">
										{d.placed > 0 ? d.placed : <span className="text-gray-400 text-xs">—</span>}
									</td>
									<td className="py-2.5 px-3">
										{d.placed > 0 ? (
											<div className="flex items-center gap-2">
												<div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden min-w-[60px]">
													<div className={`h-full rounded-full ${d.rate >= 70 ? "bg-green-500" : d.rate >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${d.rate}%` }} />
												</div>
												<span className={`text-xs font-bold ${d.rate >= 70 ? "text-green-600 dark:text-green-400" : d.rate >= 50 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>{d.rate}%</span>
											</div>
										) : <span className="text-[10px] text-gray-400 italic">In progress</span>}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* ── Top Recruiters (year-filtered) ── */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<SectionHeader
					title={`Top Recruiting Companies${yearFilter !== "All" ? ` — ${yearFilter}` : ""}`}
					subtitle={yearFilter === "All" ? "Companies by hire count, PPO conversion & avg package" : "Active companies for this year's drives"}
				/>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					{recruiterRows.map((c) => (
						<div key={c.company} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-colors">
							<div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
								{c.company.charAt(0)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-bold text-gray-900 dark:text-white truncate">{c.company}</p>
								<p className="text-[10px] text-gray-500">{c.domain}</p>
								<div className="flex gap-3 mt-1 text-[10px]">
									<span className="text-indigo-600 dark:text-indigo-400 font-bold">{c.hires} hires</span>
									<span className="text-emerald-600 dark:text-emerald-400 font-bold">{c.ppos} PPOs</span>
									{c.avgPkg > 0 && <span className="text-amber-600 dark:text-amber-400 font-bold">₹{c.avgPkg}L avg</span>}
								</div>
							</div>
							<Star className="size-3.5 text-amber-400" />
						</div>
					))}
				</div>
				{yearFilter !== "All" && (
					<p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 italic">
						※ Library, Mentoring & Research metrics below are institution-wide across all years.
					</p>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Library */}
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
					<div className="flex items-center gap-2 mb-4">
						<Library className="size-5 text-indigo-500" />
						<h3 className="text-base font-bold text-gray-900 dark:text-white">Library Usage</h3>
					</div>
					<div className="space-y-3">
						{em.libraryUsage.map(m => {
							const maxVisits = Math.max(...em.libraryUsage.map(x => x.visits));
							return (
								<div key={m.month} className="flex items-center gap-3">
									<span className="text-sm font-bold text-gray-900 dark:text-white w-8">{m.month}</span>
									<div className="flex-1 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
										<div className="h-full bg-indigo-500 rounded-lg flex items-center pl-2 transition-all duration-700" style={{ width: `${(m.visits / maxVisits) * 100}%` }}>
											<span className="text-[9px] text-white font-bold">{m.visits}</span>
										</div>
									</div>
									<span className="text-xs text-gray-500 w-20 text-right">{m.booksIssued} books</span>
								</div>
							);
						})}
					</div>
				</div>

				{/* Mentoring */}
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
					<div className="flex items-center gap-2 mb-4">
						<Users className="size-5 text-teal-500" />
						<h3 className="text-base font-bold text-gray-900 dark:text-white">Mentoring</h3>
					</div>
					<div className="grid grid-cols-2 gap-3 mb-4">
						<div className="px-3 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
							<p className="text-lg font-bold text-indigo-700 dark:text-indigo-400">{em.mentoringStats.totalSessions}</p>
							<p className="text-[10px] text-gray-500">Total Sessions</p>
						</div>
						<div className="px-3 py-2.5 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
							<p className="text-lg font-bold text-teal-700 dark:text-teal-400">{em.mentoringStats.avgSessionsPerStudent}</p>
							<p className="text-[10px] text-gray-500">Avg/Student</p>
						</div>
					</div>
					<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Top Concerns</p>
					<div className="space-y-2">
						{em.mentoringStats.topConcerns.map((c, i) => {
							const pct = em.mentoringStats.concernDistribution[i];
							const colors = ["bg-indigo-500","bg-blue-500","bg-teal-500","bg-violet-500"];
							return (
								<div key={c} className="flex items-center gap-2">
									<span className="text-xs text-gray-600 dark:text-gray-300 w-32 truncate">{c}</span>
									<MiniBar value={pct} max={100} color={colors[i]} />
									<span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-8 text-right">{pct}%</span>
								</div>
							);
						})}
					</div>
				</div>

				{/* Research Participation */}
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
					<div className="flex items-center gap-2 mb-4">
						<Microscope className="size-5 text-violet-500" />
						<h3 className="text-base font-bold text-gray-900 dark:text-white">Research Participation</h3>
					</div>
					<div className="grid grid-cols-2 gap-3">
						{[
							{ label: "In Research",     value: em.researchParticipation.studentsInResearch, color: "text-violet-700 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
							{ label: "Active Projects",  value: em.researchParticipation.activeProjects,    color: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
							{ label: "Papers Published", value: em.researchParticipation.papersPublished,   color: "text-teal-700 dark:text-teal-400",     bg: "bg-teal-50 dark:bg-teal-900/20" },
							{ label: "Conferences",      value: em.researchParticipation.conferencesAttended,color: "text-blue-700 dark:text-blue-400",     bg: "bg-blue-50 dark:bg-blue-900/20" },
						].map(m => (
							<div key={m.label} className={`px-3 py-2.5 ${m.bg} rounded-xl`}>
								<p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
								<p className="text-[10px] text-gray-500">{m.label}</p>
							</div>
						))}
					</div>
					{/* Dept research bar */}
					<div className="mt-4 space-y-2">
						<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Research by Dept</p>
						{studentsByDepartment.map(d => (
							<div key={d.department} className="flex items-center gap-2">
								<span className="text-xs font-medium text-gray-600 dark:text-gray-300 w-16">{d.department}</span>
								<MiniBar value={d.placementRate} max={100} color="bg-violet-500" />
								<span className="text-xs text-gray-500 w-10 text-right">{d.totalStudents}</span>
							</div>
						))}
					</div>
				</div>

				{/* Course Completion */}
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
					<div className="flex items-center gap-2 mb-4">
						<BookOpen className="size-5 text-emerald-500" />
						<h3 className="text-base font-bold text-gray-900 dark:text-white">Course Completion</h3>
					</div>
					<div className="flex items-end gap-4 h-40 mb-4">
						{[
							{ label: "On Time", value: em.courseCompletion.onTime,  color: "bg-indigo-500" },
							{ label: "Delayed",  value: em.courseCompletion.delayed, color: "bg-amber-500" },
							{ label: "Dropped",  value: em.courseCompletion.dropped, color: "bg-red-400" },
						].map(item => (
							<div key={item.label} className="flex-1 text-center">
								<p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{item.value}%</p>
								<div className="h-28 bg-gray-100 dark:bg-gray-800 rounded-t-lg relative overflow-hidden">
									<div className={`absolute bottom-0 w-full rounded-t-lg ${item.color}`} style={{ height: `${item.value}%` }} />
								</div>
								<p className="text-[10px] text-gray-500 mt-1 font-bold">{item.label}</p>
							</div>
						))}
					</div>
					{/* Extra context */}
					<div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
						{[
							{ label: "Avg completion speed", value: "94% on schedule" },
							{ label: "Dropout risk alerts",  value: `${em.courseCompletion.dropped} courses flagged` },
							{ label: "Best performing dept", value: "CSE (98% on time)" },
						].map(r => (
							<div key={r.label} className="flex items-center justify-between">
								<span className="text-xs text-gray-500 dark:text-gray-400">{r.label}</span>
								<span className="text-xs font-bold text-gray-900 dark:text-white">{r.value}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

/* ─── TRENDS ─── */
const TrendsTab = ({ data }) => {
	const { semesterTrends = [], studentsByDepartment = [], attendanceHeatmap } = data;
	const [metricFilter, setMetricFilter] = useState("all");
	if (!semesterTrends.length) return <p className="text-gray-500 text-center py-12">No trend data available.</p>;

	const latest = semesterTrends[semesterTrends.length - 1];
	const prev   = semesterTrends[semesterTrends.length - 2];

	const metrics = [
		{ label: "Avg GPA",      key: "avgGpa",        color: "text-indigo-600 dark:text-indigo-400", bar: "bg-indigo-500", max: 10 },
		{ label: "Attendance %", key: "avgAttendance",  color: "text-blue-600 dark:text-blue-400",    bar: "bg-blue-500",   max: 100 },
		{ label: "At-Risk %",    key: "atRiskPct",      color: "text-red-600 dark:text-red-400",      bar: "bg-red-400",    max: 15, inverse: true },
		{ label: "Placement %",  key: "placementPct",   color: "text-green-600 dark:text-green-400",  bar: "bg-green-500",  max: 100 },
	];

	const visibleMetrics = metricFilter === "all" ? metrics : metrics.filter(m => m.key === metricFilter);

	return (
		<div className="space-y-8">
			{/* Delta Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{metrics.map(m => {
					const diff = (latest[m.key] - prev[m.key]).toFixed(1);
					const isPos = m.inverse ? diff < 0 : diff > 0;
					return (
						<div key={m.key} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
							<p className="text-xs text-gray-500 font-medium">{m.label}</p>
							<p className={`text-2xl font-bold mt-1 ${m.color}`}>
								{["avgAttendance","atRiskPct","placementPct"].includes(m.key) ? `${latest[m.key]}%` : latest[m.key]}
							</p>
							<p className={`text-[11px] font-bold mt-0.5 flex items-center gap-0.5 ${isPos ? "text-green-600" : "text-red-500"}`}>
								{isPos ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
								{diff > 0 ? `+${diff}` : diff} vs prev semester
							</p>
						</div>
					);
				})}
			</div>

			{/* Metric selector */}
			<div className="flex items-center gap-3 flex-wrap">
				<BarChart3 className="size-4 text-gray-400" />
				<select value={metricFilter} onChange={e => setMetricFilter(e.target.value)}
					className="px-3 py-2 text-sm bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-400">
					<option value="all">All Metrics</option>
					{metrics.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
				</select>
				<span className="text-xs text-gray-500">{semesterTrends.length} semesters of data</span>
			</div>

			{/* Semester bars */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">Semester-over-Semester Trends</h3>
				<div className="space-y-6">
					{visibleMetrics.map(m => (
						<div key={m.key}>
							<p className={`text-xs font-bold ${m.color} mb-2`}>{m.label}</p>
							<div className="flex items-end gap-2">
								{semesterTrends.map((s, i) => {
									const val = s[m.key];
									const pct = Math.min((val / m.max) * 100, 100);
									const isLatest = i === semesterTrends.length - 1;
									return (
										<div key={s.semester} className="flex-1 text-center">
											<p className="text-[9px] font-bold text-gray-900 dark:text-white mb-1">
												{["avgAttendance","atRiskPct","placementPct"].includes(m.key) ? `${val}%` : val}
											</p>
											<div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-t-lg relative overflow-hidden">
												<div className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${isLatest ? m.bar : m.bar + "/50"}`} style={{ height: `${pct}%` }} />
											</div>
											<p className="text-[8px] text-gray-500 mt-1">{s.semester.replace("Spring ","S'").replace("Fall ","F'")}</p>
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Dept Placement Trend */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<SectionHeader title="Placement Rate by Department" subtitle="Sorted by placement success — current academic year" />
				<div className="space-y-3">
					{[...studentsByDepartment].sort((a, b) => b.placementRate - a.placementRate).map(d => (
						<div key={d.department} className="flex items-center gap-3">
							<span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-20">{d.department}</span>
							<div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
								<div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${d.placementRate}%` }} />
							</div>
							<span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 w-10 text-right">{d.placementRate}%</span>
						</div>
					))}
				</div>
			</div>

			{/* Placement Funnel Pipeline Trend */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<SectionHeader title="Placement Pipeline Trend" subtitle="From eligible pool to final placements across departments" />
				<div className="space-y-4">
					{PLACEMENT_BY_DEPT.map(d => {
						const stages = [
							{ label: "Eligible", val: d.eligible, color: "bg-gray-400" },
							{ label: "Applied",  val: d.applied,  color: "bg-blue-400" },
							{ label: "Selected", val: d.selected, color: "bg-cyan-500" },
							{ label: "Placed",   val: d.placed,   color: "bg-green-600" },
						];
						return (
							<div key={d.dept} className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-4">
								<div className="flex items-center justify-between mb-3">
									<span className="text-sm font-bold text-gray-900 dark:text-white">{d.dept}</span>
									<span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${d.rate >= 70 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : d.rate >= 50 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
										{d.rate}% placed
									</span>
								</div>
								<div className="flex items-end gap-2 h-16">
									{stages.map(st => {
										const pct = d.eligible > 0 ? (st.val / d.eligible) * 100 : 0;
										return (
											<div key={st.label} className="flex-1 flex flex-col items-center">
												<p className="text-[9px] font-bold text-gray-700 dark:text-gray-300 mb-1">{st.val}</p>
												<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-md overflow-hidden" style={{ height: "40px" }}>
													<div className={`${st.color} w-full rounded-t-md`} style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }} />
												</div>
												<p className="text-[8px] text-gray-400 mt-0.5">{st.label}</p>
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* At-Risk Trend */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<SectionHeader title="At-Risk Student Progression" subtitle="Students identified as high-risk across semesters" />
				<div className="flex items-end gap-3">
					{semesterTrends.map((s, i) => {
						const isLatest = i === semesterTrends.length - 1;
						const pct = Math.min((s.atRiskPct / 15) * 100, 100);
						return (
							<div key={s.semester} className="flex-1 text-center">
								<p className={`text-xs font-bold mb-1 ${isLatest ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}>{s.atRiskPct}%</p>
								<div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-t-lg relative overflow-hidden">
									<div className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${isLatest ? "bg-red-500" : "bg-red-300 dark:bg-red-800"}`} style={{ height: `${pct}%` }} />
								</div>
								<p className="text-[9px] text-gray-500 mt-1">{s.semester.replace("Spring ","S'").replace("Fall ","F'")}</p>
							</div>
						);
					})}
				</div>
				<div className="mt-4 flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-800">
					<div>
						<p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Current</p>
						<p className="text-xl font-bold text-red-600 dark:text-red-400">{latest.atRiskPct}%</p>
					</div>
					<div>
						<p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Change</p>
						<p className={`text-xl font-bold ${(latest.atRiskPct - prev.atRiskPct) < 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
							{(latest.atRiskPct - prev.atRiskPct) > 0 ? "+" : ""}{(latest.atRiskPct - prev.atRiskPct).toFixed(1)}%
						</p>
					</div>
					<div>
						<p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Peak</p>
						<p className="text-xl font-bold text-gray-900 dark:text-white">{Math.max(...semesterTrends.map(s => s.atRiskPct))}%</p>
					</div>
					<div>
						<p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Best</p>
						<p className="text-xl font-bold text-green-600 dark:text-green-400">{Math.min(...semesterTrends.map(s => s.atRiskPct))}%</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdvancedAnalyticsUI;
