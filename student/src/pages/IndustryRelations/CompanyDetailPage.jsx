// src/pages/IndustryRelations/CompanyDetailPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	ArrowLeft, Building2, CalendarDays, Users, Award, CheckCircle,
	XCircle, Clock, Filter,
} from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";

const HIRING_STUDENTS = {
	"CMP-001": [
		{ id: "22CSE0012", name: "Arjun Mehta",   batch: "2022", year: "4th", dept: "CSE", role: "Software Developer", pkg: 7.5,  accepted: true },
		{ id: "22CSE0045", name: "Sneha Reddy",   batch: "2022", year: "4th", dept: "CSE", role: "Data Analyst",       pkg: 6.8,  accepted: true },
		{ id: "22ECE0031", name: "Ravi Kumar",    batch: "2022", year: "4th", dept: "ECE", role: "Systems Engineer",   pkg: 7.0,  accepted: false },
		{ id: "22ME00018", name: "Priya Patel",   batch: "2022", year: "4th", dept: "ME",  role: "Business Analyst",   pkg: 7.2,  accepted: true },
		{ id: "23CSE0008", name: "Kavya Singh",   batch: "2023", year: "3rd", dept: "CSE", role: "DevOps Engineer",    pkg: 6.5,  accepted: null },
	],
	"CMP-003": [
		{ id: "22CSE0004", name: "Aditya Sharma", batch: "2022", year: "4th", dept: "CSE", role: "Software Engineer",  pkg: 42.0, accepted: true },
		{ id: "22CSE0019", name: "Diya Menon",    batch: "2022", year: "4th", dept: "CSE", role: "AI/ML Engineer",     pkg: 44.0, accepted: true },
		{ id: "22ECE0014", name: "Rohan Nair",    batch: "2022", year: "4th", dept: "ECE", role: "Program Manager",    pkg: 38.0, accepted: false },
	],
	"CMP-011": [
		{ id: "22CSE0023", name: "Tanvi Gupta",   batch: "2022", year: "4th", dept: "CSE", role: "SDE-I",              pkg: 32.0, accepted: true },
		{ id: "22CSE0038", name: "Karan Das",     batch: "2022", year: "4th", dept: "CSE", role: "Data Engineer",      pkg: 34.0, accepted: true },
		{ id: "23CSE0011", name: "Ananya Iyer",   batch: "2023", year: "3rd", dept: "CSE", role: "SDE Intern",         pkg: 12.0, accepted: null },
		{ id: "22ME00024", name: "Vikram Rao",    batch: "2022", year: "4th", dept: "ME",  role: "Operations Manager", pkg: 28.0, accepted: false },
	],
};

const REL_COLORS = {
	"Premium Partner":   "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
	"Strategic Partner": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
	"Active Recruiter":  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
	"Standard Recruiter":"bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};
const MOU_COLORS = {
	Active:  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	Expired: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
	Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const CompanyDetailPage = () => {
	const navigate  = useNavigate();
	const location  = useLocation();
	const company   = location.state?.company;
	const [roleFilter, setRole]   = useState("All");
	const [yearFilter, setYear]   = useState("All");
	const [statusFilter, setStatus] = useState("All");

	if (!company) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-500 mb-4">Company data not found.</p>
					<button onClick={() => navigate("/industry-relations/companies")}
						className="text-teal-600 font-bold flex items-center gap-2 mx-auto">
						<ArrowLeft className="size-4" /> Back to Companies
					</button>
				</div>
			</div>
		);
	}

	const students = HIRING_STUDENTS[company.id] || [];
	const roles    = ["All", ...new Set(students.map(s => s.role))];
	const years    = ["All", ...new Set(students.map(s => s.year + " Year"))];

	const filtered = students.filter(s => {
		const rOk = roleFilter === "All" || s.role === roleFilter;
		const yOk = yearFilter === "All" || (s.year + " Year") === yearFilter;
		const sOk = statusFilter === "All"
			|| (statusFilter === "Accepted" && s.accepted === true)
			|| (statusFilter === "Declined" && s.accepted === false)
			|| (statusFilter === "Pending"  && s.accepted === null);
		return rOk && yOk && sOk;
	});

	const acceptedCount = students.filter(s => s.accepted === true).length;
	const declinedCount = students.filter(s => s.accepted === false).length;
	const pendingCount  = students.filter(s => s.accepted === null).length;

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />

			{/* Hero */}
			<div className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 dark:from-teal-900 dark:via-teal-950 dark:to-emerald-950 text-white">
				<div className="max-w-5xl mx-auto px-4 py-6">
					<div className="flex items-center gap-4 mb-2">
						<button onClick={() => navigate("/industry-relations/companies")}
							className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
							<ArrowLeft className="size-5" />
						</button>
						<div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-bold text-xl">
							{company.name.charAt(0)}
						</div>
						<div>
							<h1 className="text-2xl font-bold">{company.name}</h1>
							<p className="text-teal-100/80 text-sm">{company.domain} · Partner since {company.since}</p>
						</div>
					</div>
				</div>
			</div>

			<main className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-12 space-y-6">
				{/* Company Info */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{[
						{ label: "Domain", value: company.domain },
						{ label: "Relationship", value: <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${REL_COLORS[company.relationship] || ""}`}>{company.relationship}</span> },
						{ label: "MoU Status", value: <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${MOU_COLORS[company.mouStatus] || MOU_COLORS.Active}`}>{company.mouStatus}</span> },
						{ label: "Engagement Score", value: <span className={`text-xl font-bold ${company.engagementScore >= 85 ? "text-green-600 dark:text-green-400" : company.engagementScore >= 70 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>{company.engagementScore}</span> },
						{ label: "Internships Offered", value: company.internshipsOffered },
						{ label: "PPOs Given", value: company.pposGiven },
						{ label: "Contact Person", value: company.contactPerson || "—" },
						{ label: "Last Engagement", value: company.lastEngagement ? new Date(company.lastEngagement).toLocaleDateString() : "—" },
					].map(({ label, value }) => (
						<div key={label} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
							<p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</p>
							<div className="text-sm font-bold text-gray-900 dark:text-white">{value}</div>
						</div>
					))}
				</div>

				{/* Current Hiring */}
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
						<div>
							<h2 className="text-base font-bold text-gray-900 dark:text-white">Current Hiring</h2>
							<p className="text-xs text-gray-500">{students.length} students · {acceptedCount} accepted · {declinedCount} declined · {pendingCount} pending</p>
						</div>
						{/* Summary pills */}
						<div className="flex gap-2">
							{[
								{ label: `${acceptedCount} Accepted`, cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
								{ label: `${declinedCount} Declined`, cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
								{ label: `${pendingCount} Pending`,  cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
							].map(({ label, cls }) => (
								<span key={label} className={`px-2.5 py-1 rounded-lg text-xs font-bold ${cls}`}>{label}</span>
							))}
						</div>
					</div>

					{/* Filters */}
					<div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex flex-wrap gap-3 bg-gray-50/50 dark:bg-gray-800/20">
						<Filter className="size-4 text-gray-400 self-center" />
						<select value={roleFilter} onChange={e => setRole(e.target.value)}
							className="px-3 py-1.5 text-xs bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 outline-none">
							{roles.map(r => <option key={r}>{r === "All" ? "All Roles" : r}</option>)}
						</select>
						<select value={yearFilter} onChange={e => setYear(e.target.value)}
							className="px-3 py-1.5 text-xs bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 outline-none">
							{years.map(y => <option key={y}>{y === "All" ? "All Years" : y}</option>)}
						</select>
						<select value={statusFilter} onChange={e => setStatus(e.target.value)}
							className="px-3 py-1.5 text-xs bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 outline-none">
							{["All","Accepted","Declined","Pending"].map(s => <option key={s}>{s === "All" ? "All Statuses" : s}</option>)}
						</select>
						<span className="ml-auto text-xs text-gray-500 self-center">{filtered.length} students</span>
					</div>

					{/* Table */}
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-gray-100 dark:border-gray-800">
									{["Student", "ID", "Dept", "Year", "Batch", "Role", "Package", "Status"].map(h => (
										<th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{filtered.length > 0 ? filtered.map(s => (
									<tr key={s.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
										<td className="py-3 px-4">
											<div className="flex items-center gap-2">
												<div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] text-white ${s.accepted === true ? "bg-green-500" : s.accepted === false ? "bg-red-500" : "bg-amber-500"}`}>
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
										<td className="py-3 px-4 font-bold text-teal-600 dark:text-teal-400">{s.pkg} LPA</td>
										<td className="py-3 px-4">
											{s.accepted === true  && <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400"><CheckCircle className="size-3.5" />Accepted</span>}
											{s.accepted === false && <span className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400"><XCircle className="size-3.5" />Declined</span>}
											{s.accepted === null  && <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400"><Clock className="size-3.5" />Pending</span>}
										</td>
									</tr>
								)) : (
									<tr>
										<td colSpan={8} className="py-12 text-center text-sm text-gray-400">No students match the selected filters.</td>
									</tr>
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

export default CompanyDetailPage;
