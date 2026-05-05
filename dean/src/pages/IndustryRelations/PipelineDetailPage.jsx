// src/pages/IndustryRelations/PipelineDetailPage.jsx
import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	ArrowLeft, Filter, CheckCircle, XCircle, Clock,
	ChevronRight, TrendingDown, Info, X,
} from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";

const PIPELINE_STUDENTS = {
	"CMP-001": [
		{ id: "22CSE0012", name: "Arjun Mehta",   batch: "2022", year: "4th", dept: "CSE", role: "Software Developer", type: "PPO",        status: "Accepted" },
		{ id: "22ECE0031", name: "Ravi Kumar",    batch: "2022", year: "4th", dept: "ECE", role: "Systems Engineer",   type: "Placement",  status: "Declined" },
		{ id: "23CSE0008", name: "Kavya Singh",   batch: "2023", year: "3rd", dept: "CSE", role: "DevOps Engineer",    type: "Internship", status: "Pending" },
		{ id: "22ME00018", name: "Priya Patel",   batch: "2022", year: "4th", dept: "ME",  role: "Business Analyst",   type: "Placement",  status: "Accepted" },
		{ id: "22CSE0045", name: "Sneha Reddy",   batch: "2022", year: "4th", dept: "CSE", role: "Data Analyst",       type: "PPO",        status: "Accepted" },
	],
	"CMP-003": [
		{ id: "22CSE0004", name: "Aditya Sharma", batch: "2022", year: "4th", dept: "CSE", role: "Software Engineer",  type: "Placement",  status: "Accepted" },
		{ id: "22CSE0019", name: "Diya Menon",    batch: "2022", year: "4th", dept: "CSE", role: "AI/ML Engineer",     type: "PPO",        status: "Accepted" },
		{ id: "22ECE0014", name: "Rohan Nair",    batch: "2022", year: "4th", dept: "ECE", role: "Program Manager",    type: "Placement",  status: "Declined" },
	],
	"CMP-011": [
		{ id: "22CSE0023", name: "Tanvi Gupta",   batch: "2022", year: "4th", dept: "CSE", role: "SDE-I",              type: "Placement",  status: "Accepted" },
		{ id: "22CSE0038", name: "Karan Das",     batch: "2022", year: "4th", dept: "CSE", role: "Data Engineer",      type: "PPO",        status: "Accepted" },
		{ id: "23CSE0011", name: "Ananya Iyer",   batch: "2023", year: "3rd", dept: "CSE", role: "SDE Intern",         type: "Internship", status: "Pending" },
		{ id: "22ME00024", name: "Vikram Rao",    batch: "2022", year: "4th", dept: "ME",  role: "Operations Manager", type: "Placement",  status: "Declined" },
	],
	"CMP-004": [
		{ id: "22CSE0051", name: "Rahul Verma",   batch: "2022", year: "4th", dept: "CSE", role: "Technology Analyst", type: "Placement",  status: "Accepted" },
		{ id: "22ECE0022", name: "Pooja Sharma",  batch: "2022", year: "4th", dept: "ECE", role: "Quantitative Analyst",type: "PPO",       status: "Accepted" },
		{ id: "22ME00010", name: "Suresh Raj",    batch: "2022", year: "4th", dept: "ME",  role: "Risk Analyst",       type: "Placement",  status: "Pending" },
	],
	"CMP-002": [
		{ id: "22CSE0060", name: "Meera Joshi",   batch: "2022", year: "4th", dept: "CSE", role: "Power Programmer",   type: "PPO",        status: "Accepted" },
		{ id: "22ECE0041", name: "Dev Pillai",    batch: "2022", year: "4th", dept: "ECE", role: "Data Scientist",     type: "Placement",  status: "Declined" },
		{ id: "23CSE0017", name: "Asha Kumar",    batch: "2023", year: "3rd", dept: "CSE", role: "Systems Engineer",   type: "Internship", status: "Pending" },
	],
	"CMP-007": [
		{ id: "22CSE0002", name: "Ishaan Nair",   batch: "2022", year: "4th", dept: "CSE", role: "Research Intern",    type: "Internship", status: "Accepted" },
		{ id: "22CSE0007", name: "Divya Rao",     batch: "2022", year: "4th", dept: "CSE", role: "ML Engineer Intern", type: "PPO",        status: "Accepted" },
	],
};

const TYPE_BADGE = {
	PPO:        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	Internship: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	Placement:  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const STAGES       = ["eligible","applied","shortlisted","interned","ppoOffered","placed"];
const STAGE_LABELS = ["Eligible","Applied","Shortlisted","Interned","PPO","Placed"];
const STAGE_DESCS  = [
	"Total pool of students who met eligibility criteria (CGPA, backlogs, etc.)",
	"Students who submitted applications for this company's drive.",
	"Students shortlisted after resume screening & aptitude tests.",
	"Students who completed the internship (summer/winter program).",
	"Students who received a Pre-Placement Offer after their internship.",
	"Final confirmed placements for this recruitment cycle.",
];
const BAR_COLORS   = ["bg-gray-400","bg-blue-400","bg-cyan-400","bg-teal-500","bg-emerald-500","bg-green-600"];
const LABEL_COLORS = ["text-gray-500","text-blue-500","text-cyan-500","text-teal-500","text-emerald-500","text-green-600"];

const PipelineDetailPage = () => {
	const navigate  = useNavigate();
	const location  = useLocation();
	const pipeline  = location.state?.pipeline;

	// The bar that was clicked from the list page (if any)
	const initialStage = location.state?.activeStage ?? null;
	const initialIdx   = initialStage ? STAGES.indexOf(initialStage) : null;

	const [activeBar,    setActiveBar]  = useState(initialIdx);
	const [hoveredBar,   setHoveredBar] = useState(null);
	const [roleFilter,   setRole]       = useState("All");
	const [typeFilter,   setType]       = useState("All");
	const [yearFilter,   setYear]       = useState("All");
	const [deptFilter,   setDept]       = useState("All");
	const [statusFilter, setStatus]     = useState("All");

	if (!pipeline) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-500 mb-4">Pipeline data not found.</p>
					<button onClick={() => navigate("/industry-relations/pipelines")} className="text-teal-600 font-bold flex items-center gap-2 mx-auto">
						<ArrowLeft className="size-4" /> Back to Pipelines
					</button>
				</div>
			</div>
		);
	}

	const students = PIPELINE_STUDENTS[pipeline.companyId] || [];
	const roles    = ["All", ...new Set(students.map(s => s.role))];
	const depts    = ["All", ...new Set(students.map(s => s.dept))];
	const years    = ["All", ...new Set(students.map(s => s.year + " Year"))];

	const filtered = useMemo(() => students.filter(s => {
		const rOk = roleFilter === "All" || s.role === roleFilter;
		const tOk = typeFilter === "All" || s.type === typeFilter;
		const yOk = yearFilter === "All" || (s.year + " Year") === yearFilter;
		const dOk = deptFilter === "All" || s.dept === deptFilter;
		const sOk = statusFilter === "All" || s.status === statusFilter;
		return rOk && tOk && yOk && dOk && sOk;
	}), [students, roleFilter, typeFilter, yearFilter, deptFilter, statusFilter]);

	const ppoCount       = students.filter(s => s.type === "PPO").length;
	const internCount    = students.filter(s => s.type === "Internship").length;
	const placementCount = students.filter(s => s.type === "Placement").length;
	const acceptedCount  = students.filter(s => s.status === "Accepted").length;

	// Active bar data
	const activeStageInfo = activeBar !== null ? (() => {
		const stage = STAGES[activeBar];
		const val   = pipeline[stage] ?? 0;
		const pct   = pipeline.eligible > 0 ? (val / pipeline.eligible) * 100 : 0;
		const prev  = activeBar > 0 ? (pipeline[STAGES[activeBar - 1]] ?? 0) : null;
		const dropoff = prev !== null ? prev - val : null;
		return { label: STAGE_LABELS[activeBar], desc: STAGE_DESCS[activeBar], val, pct, dropoff, color: LABEL_COLORS[activeBar] };
	})() : null;

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />

			{/* Hero */}
			<div className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 dark:from-teal-900 dark:via-teal-950 dark:to-emerald-950 text-white">
				<div className="max-w-5xl mx-auto px-4 py-6">
					<div className="flex items-center gap-4">
						<button onClick={() => navigate("/industry-relations/pipelines")}
							className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
							<ArrowLeft className="size-5" />
						</button>
						<div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-bold text-xl">
							{pipeline.companyName.charAt(0)}
						</div>
						<div>
							<h1 className="text-2xl font-bold">{pipeline.companyName}</h1>
							<p className="text-teal-100/80 text-sm">{pipeline.domain} Â· Last visit: {pipeline.visitDate ? new Date(pipeline.visitDate).toLocaleDateString() : "â€”"}</p>
						</div>
						<div className="ml-auto text-right">
							<p className="text-3xl font-bold">{Math.round((pipeline.placed / pipeline.eligible) * 100)}%</p>
							<p className="text-teal-100/70 text-xs">Conversion</p>
						</div>
					</div>
				</div>
			</div>

			<main className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-12 space-y-6">
				{/* Funnel Stage Count Cards */}
				<div className="grid grid-cols-3 md:grid-cols-6 gap-3">
					{STAGES.map((stage, i) => (
						<button
							key={stage}
							onClick={() => setActiveBar(activeBar === i ? null : i)}
							className={`rounded-2xl border-2 p-4 text-center transition-all ${
								activeBar === i
									? "border-teal-400 bg-teal-50 dark:bg-teal-900/20 shadow-lg scale-105"
									: "border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1d26] hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-md"
							}`}
						>
							<p className={`text-xl font-bold ${i === STAGES.length - 1 ? "text-green-600 dark:text-green-400" : activeBar === i ? "text-teal-600 dark:text-teal-400" : "text-gray-900 dark:text-white"}`}>
								{pipeline[stage] ?? 0}
							</p>
							<p className={`text-[10px] mt-1 font-semibold ${activeBar === i ? "text-teal-600 dark:text-teal-400" : "text-gray-500"}`}>
								{STAGE_LABELS[i]}
							</p>
						</button>
					))}
				</div>

				{/* Active Stage Info Card */}
				{activeStageInfo && (
					<div className="animate-in slide-in-from-top-2 fade-in duration-200 bg-white dark:bg-[#1a1d26] rounded-2xl border-2 border-teal-200 dark:border-teal-800 p-5">
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
									<Info className={`size-5 ${activeStageInfo.color}`} />
								</div>
								<div>
									<p className={`text-base font-bold ${activeStageInfo.color}`}>{activeStageInfo.label}</p>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-lg">{activeStageInfo.desc}</p>
								</div>
							</div>
							<button onClick={() => setActiveBar(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
								<X className="size-4 text-gray-400" />
							</button>
						</div>
						<div className="flex gap-6 mt-4">
							<div>
								<p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Students</p>
								<p className={`text-2xl font-bold ${activeStageInfo.color}`}>{activeStageInfo.val}</p>
							</div>
							<div>
								<p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">% of Eligible</p>
								<p className="text-2xl font-bold text-gray-900 dark:text-white">{activeStageInfo.pct.toFixed(1)}%</p>
							</div>
							{activeStageInfo.dropoff !== null && (
								<div>
									<p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Drop-off</p>
									<p className="text-2xl font-bold text-red-500 flex items-center gap-1">
										<TrendingDown className="size-5" />âˆ’{activeStageInfo.dropoff}
									</p>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Interactive Funnel Bar Chart */}
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
					<div className="flex items-center justify-between mb-1">
						<h3 className="text-base font-bold text-gray-900 dark:text-white">Recruitment Funnel</h3>
						<p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">Click a bar to inspect</p>
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Hover to preview Â· click to select stage</p>
					<div className="flex items-end gap-2">
						{STAGES.map((stage, i) => {
							const val    = pipeline[stage] ?? 0;
							const pct    = pipeline.eligible > 0 ? (val / pipeline.eligible) * 100 : 0;
							const isAct  = activeBar === i;
							const isHov  = hoveredBar === i;

							return (
								<div
									key={stage}
									className="flex-1 text-center relative cursor-pointer group"
									onMouseEnter={() => setHoveredBar(i)}
									onMouseLeave={() => setHoveredBar(null)}
									onClick={() => setActiveBar(isAct ? null : i)}
								>
									{/* Hover tooltip */}
									{isHov && !isAct && (
										<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none animate-in fade-in duration-100">
											<div className="bg-gray-900 dark:bg-gray-800 text-white rounded-xl px-2.5 py-2 shadow-xl whitespace-nowrap text-left border border-gray-700">
												<p className={`text-[9px] font-bold ${LABEL_COLORS[i]} mb-0.5`}>{STAGE_LABELS[i]}</p>
												<p className="text-xs font-bold text-white">{val} students</p>
												<p className="text-[9px] text-gray-400">{pct.toFixed(0)}% of eligible</p>
												<div className="absolute top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800" />
											</div>
										</div>
									)}

									<p className={`text-sm font-bold mb-1 transition-all ${isAct ? LABEL_COLORS[i] : "text-gray-900 dark:text-white"}`}>{val}</p>

									<div className={`h-24 bg-gray-100 dark:bg-gray-800 relative transition-all duration-200 rounded-t-lg overflow-hidden ${
										isAct ? "ring-2 ring-teal-400 ring-offset-2 scale-x-[1.06]" : isHov ? "ring-1 ring-teal-200 dark:ring-teal-700" : ""
									}`}>
										<div
											className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${BAR_COLORS[i]} ${isAct ? "brightness-125" : isHov ? "brightness-110" : ""}`}
											style={{ height: `${pct}%` }}
										/>
									</div>

									<p className={`text-[9px] mt-1 font-semibold transition-colors ${isAct ? LABEL_COLORS[i] : "text-gray-500 dark:text-gray-400"}`}>
										{STAGE_LABELS[i]}
									</p>
									<p className="text-[8px] text-gray-400">{pct.toFixed(0)}%</p>
								</div>
							);
						})}
					</div>
				</div>

				{/* Roles filled + Branch breakdown */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{pipeline.rolesFilled && (
						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
							<h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Roles Filled</h3>
							<div className="space-y-2">
								{pipeline.rolesOffered?.map(role => {
									const filled = pipeline.rolesFilled[role] || 0;
									return (
										<div key={role} className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
											<span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{role}</span>
											<span className={`text-sm font-bold ${filled > 0 ? "text-teal-600 dark:text-teal-400" : "text-gray-400"}`}>{filled > 0 ? `${filled} hired` : "â€”"}</span>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{pipeline.branchWise && (
						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
							<h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Branch-wise Hires</h3>
							<div className="space-y-2">
								{Object.entries(pipeline.branchWise).sort(([,a],[,b]) => b-a).map(([branch, count]) => {
									const total = Object.values(pipeline.branchWise).reduce((s,v) => s+v, 0);
									const pct   = ((count/total)*100).toFixed(0);
									return (
										<div key={branch} className="flex items-center gap-2">
											<span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-16">{branch}</span>
											<div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
												<div className="h-full bg-teal-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
											</div>
											<span className="text-xs font-bold text-teal-600 dark:text-teal-400 w-14 text-right">{count} ({pct}%)</span>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>

				{/* Selection Process */}
				{pipeline.selectionProcess && (
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-3">
						<div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center shrink-0">
							<ChevronRight className="size-5 text-teal-600 dark:text-teal-400" />
						</div>
						<div>
							<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Selection Process</p>
							<p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{pipeline.selectionProcess}</p>
						</div>
					</div>
				)}

				{/* Student List */}
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
						<div>
							<h3 className="text-base font-bold text-gray-900 dark:text-white">Student List</h3>
							<div className="flex gap-3 mt-1">
								<span className="text-xs text-amber-600 dark:text-amber-400 font-bold">{ppoCount} PPO</span>
								<span className="text-xs text-blue-600 dark:text-blue-400 font-bold">{internCount} Internship</span>
								<span className="text-xs text-gray-500 font-bold">{placementCount} Placement</span>
								<span className="text-xs text-green-600 dark:text-green-400 font-bold">{acceptedCount} Accepted</span>
							</div>
						</div>
						<span className="text-xs text-gray-500">{filtered.length} of {students.length} shown</span>
					</div>

					{/* Filters */}
					<div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex flex-wrap gap-2 items-center">
						<Filter className="size-4 text-gray-400" />
						<select value={typeFilter} onChange={e => setType(e.target.value)}
							className="px-2.5 py-1.5 text-xs bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 outline-none">
							{["All","PPO","Internship","Placement"].map(t => <option key={t}>{t === "All" ? "All Types" : t}</option>)}
						</select>
						<select value={roleFilter} onChange={e => setRole(e.target.value)}
							className="px-2.5 py-1.5 text-xs bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 outline-none">
							{roles.map(r => <option key={r}>{r === "All" ? "All Roles" : r}</option>)}
						</select>
						<select value={yearFilter} onChange={e => setYear(e.target.value)}
							className="px-2.5 py-1.5 text-xs bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 outline-none">
							{years.map(y => <option key={y}>{y === "All" ? "All Years" : y}</option>)}
						</select>
						<select value={deptFilter} onChange={e => setDept(e.target.value)}
							className="px-2.5 py-1.5 text-xs bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 outline-none">
							{depts.map(d => <option key={d}>{d === "All" ? "All Depts" : d}</option>)}
						</select>
						<select value={statusFilter} onChange={e => setStatus(e.target.value)}
							className="px-2.5 py-1.5 text-xs bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 outline-none">
							{["All","Accepted","Declined","Pending"].map(s => <option key={s}>{s === "All" ? "All Statuses" : s}</option>)}
						</select>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-gray-100 dark:border-gray-800">
									{["Student","ID","Dept","Year","Batch","Role","Type","Status"].map(h => (
										<th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{filtered.length > 0 ? filtered.map(s => (
									<tr key={s.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
										<td className="py-3 px-4">
											<div className="flex items-center gap-2">
												<div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] text-white ${s.status === "Accepted" ? "bg-green-500" : s.status === "Declined" ? "bg-red-500" : "bg-amber-500"}`}>
													{s.name.split(" ").map(n => n[0]).join("")}
												</div>
												<span className="font-bold text-gray-900 dark:text-white">{s.name}</span>
											</div>
										</td>
										<td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400 font-mono">{s.id}</td>
										<td className="py-3 px-4 text-gray-600 dark:text-gray-300">{s.dept}</td>
										<td className="py-3 px-4 text-gray-600 dark:text-gray-300">{s.year} Year</td>
										<td className="py-3 px-4 text-gray-600 dark:text-gray-300">{s.batch}</td>
										<td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">{s.role}</td>
										<td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${TYPE_BADGE[s.type]}`}>{s.type}</span></td>
										<td className="py-3 px-4">
											{s.status === "Accepted" && <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400"><CheckCircle className="size-3.5" />Accepted</span>}
											{s.status === "Declined" && <span className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400"><XCircle className="size-3.5" />Declined</span>}
											{s.status === "Pending"  && <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400"><Clock className="size-3.5" />Pending</span>}
										</td>
									</tr>
								)) : (
									<tr><td colSpan={8} className="py-12 text-center text-sm text-gray-400">No students match selected filters.</td></tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</main>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default PipelineDetailPage;
