// src/pages/FacultyLifecycle/FacultyLifecycleUI.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	LayoutDashboard, Award, Palmtree, ShieldCheck, ArrowLeftRight,
	ArrowLeft, RefreshCw, AlertTriangle, Users, Clock, TrendingUp,
	ChevronDown, ChevronUp, CalendarDays, BookOpen, GraduationCap,
	CheckCircle, XCircle, AlertCircle, MapPin, Star,
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
	Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
	"Under Review": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
	Approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	Active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
	Due: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
	"At Risk": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
	Strong: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

/* ═══════════ MAIN ═══════════ */
const FacultyLifecycleUI = ({ data, activeTab, onTabChange, loading, error, onRefresh }) => {
	const navigate = useNavigate();
	const tabs = [
		{ id: "overview", label: "Overview", icon: LayoutDashboard },
		{ id: "promotions", label: "Promotions", icon: Award },
		{ id: "sabbaticals", label: "Sabbaticals", icon: Palmtree },
		{ id: "tenure", label: "Tenure Reviews", icon: ShieldCheck },
		{ id: "transfers", label: "Transfers", icon: ArrowLeftRight },
	];

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />
			<div className="bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-700 dark:from-orange-900 dark:via-amber-950 dark:to-yellow-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-6 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-5">
						<div className="flex items-center gap-4">
							<button onClick={() => navigate("/dashboard")} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm"><ArrowLeft className="size-5" /></button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Faculty Lifecycle Control</h1>
								<p className="text-amber-100/80 text-sm mt-0.5">Promotions, tenure, sabbaticals & inter-department transfers.</p>
							</div>
						</div>
						{data?.summary && (
							<div className="flex items-center gap-3">
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center"><p className="text-xs text-amber-200/70 font-medium">Faculty</p><p className="text-lg font-bold">{data.summary.totalFaculty}</p></div>
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center"><p className="text-xs text-amber-200/70 font-medium">Pending</p><p className="text-lg font-bold">{data.summary.pendingPromotions}</p></div>
							</div>
						)}
					</div>
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{tabs.map((t) => {
							const Icon = t.icon;
							return (
								<button key={t.id} onClick={() => onTabChange(t.id)} className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${activeTab === t.id ? "bg-gray-50 dark:bg-[#0f1117] text-amber-700 dark:text-amber-400" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
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
						<p className="font-bold text-gray-900 dark:text-white">Loading Faculty Data</p>
					</div>
				) : data && (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						{activeTab === "overview" && <OverviewTab data={data} />}
						{activeTab === "promotions" && <PromotionsTab items={data.promotions} />}
						{activeTab === "sabbaticals" && <SabbaticalsTab items={data.sabbaticals} />}
						{activeTab === "tenure" && <TenureTab items={data.tenureReviews} />}
						{activeTab === "transfers" && <TransfersTab items={data.transfers} />}
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
		{ label: "Total Faculty", value: s.totalFaculty, icon: Users, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
		{ label: "Pending Promotions", value: s.pendingPromotions, icon: Award, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20" },
		{ label: "Active Sabbaticals", value: s.activeSabbaticals, icon: Palmtree, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/20" },
		{ label: "Tenure Reviews", value: s.tenureReviews, icon: ShieldCheck, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
		{ label: "Pending Transfers", value: s.pendingTransfers, icon: ArrowLeftRight, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
		{ label: "Avg Service Years", value: s.avgYearsOfService, icon: Clock, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
		{ label: "Retiring Soon", value: s.retiringSoon, icon: CalendarDays, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
		{ label: "New Hires", value: s.newHiresThisYear, icon: TrendingUp, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
	];

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{stats.map((s, i) => <StatCard key={i} {...s} />)}
			</div>

			{/* Recent Promotions */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Promotion Requests</h3>
				<div className="space-y-3">
					{data.promotions.slice(0, 4).map((p) => (
						<div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-xs">{p.name.split(" ").slice(-1)[0][0]}</div>
								<div>
									<p className="text-sm font-bold text-gray-900 dark:text-white">{p.name}</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">{p.currentDesignation} → {p.proposedDesignation} · {p.department}</p>
								</div>
							</div>
							<Badge className={STATUS[p.status]}>{p.status}</Badge>
						</div>
					))}
				</div>
			</div>

			{/* Tenure Quick View */}
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
				<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tenure Reviews Due</h3>
				<div className="space-y-3">
					{data.tenureReviews.map((t) => (
						<div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
							<div>
								<p className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">{t.department} · {t.yearsCompleted} yrs</p>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-xs text-gray-500">{new Date(t.reviewDate).toLocaleDateString()}</span>
								<Badge className={STATUS[t.status]}>{t.status}</Badge>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

/* ═══════════ PROMOTIONS ═══════════ */
const PromotionsTab = ({ items }) => {
	const [expandedId, setExpandedId] = useState(null);

	return (
		<div className="space-y-4">
			{items.map((p) => {
				const expanded = expandedId === p.id;
				return (
					<div key={p.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-lg">
						<div className="p-5">
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-sm">{p.name.split(" ").slice(-1)[0][0]}</div>
									<div>
										<h3 className="font-bold text-gray-900 dark:text-white">{p.name}</h3>
										<p className="text-xs text-gray-500 dark:text-gray-400">{p.department} · {p.yearsInRole} yrs in role</p>
									</div>
								</div>
								<Badge className={STATUS[p.status]}>{p.status}</Badge>
							</div>

							<div className="flex items-center gap-2 mb-2">
								<span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-xs text-gray-600 dark:text-gray-400">{p.currentDesignation}</span>
								<span className="text-gray-400">→</span>
								<span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 rounded-md text-xs text-amber-700 dark:text-amber-400 font-bold">{p.proposedDesignation}</span>
							</div>

							<div className="flex flex-wrap gap-2 mb-3">
								<span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-[11px] font-bold text-blue-700 dark:text-blue-400">Teaching: {p.teachingScore}/5</span>
								<span className="px-2 py-1 bg-violet-50 dark:bg-violet-900/20 rounded-lg text-[11px] font-bold text-violet-700 dark:text-violet-400">Research: {p.researchScore}</span>
								<span className="px-2 py-1 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-[11px] font-bold text-teal-700 dark:text-teal-400">Pubs: {p.publications}</span>
								<span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-[11px] font-bold text-indigo-700 dark:text-indigo-400">h-Index: {p.hIndex}</span>
							</div>

							<button onClick={() => setExpandedId(expanded ? null : p.id)} className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-800 transition-colors">
								{expanded ? <><ChevronUp className="size-3.5" />Less</> : <><ChevronDown className="size-3.5" />Details</>}
							</button>
						</div>

						{expanded && (
							<div className="border-t border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-b-2xl animate-in fade-in slide-in-from-top-1 duration-200">
								<div className="grid grid-cols-2 gap-3">
									<div className="px-3 py-2 bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800">
										<p className="text-xs text-gray-500 dark:text-gray-400">Recommended By</p>
										<p className="text-sm font-bold text-gray-900 dark:text-white">{p.recommendedBy}</p>
									</div>
									<div className="px-3 py-2 bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800">
										<p className="text-xs text-gray-500 dark:text-gray-400">Review Date</p>
										<p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(p.reviewDate).toLocaleDateString()}</p>
									</div>
									<div className="px-3 py-2 bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800">
										<p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
										<p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(p.submittedDate).toLocaleDateString()}</p>
									</div>
									<div className="px-3 py-2 bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-100 dark:border-gray-800">
										<p className="text-xs text-gray-500 dark:text-gray-400">Faculty ID</p>
										<p className="text-sm font-bold text-gray-900 dark:text-white">{p.facultyId}</p>
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

/* ═══════════ SABBATICALS ═══════════ */
const SabbaticalsTab = ({ items }) => (
	<div className="space-y-4">
		{items.map((s) => (
			<div key={s.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-sm">{s.name.split(" ").slice(-1)[0][0]}</div>
						<div>
							<h3 className="font-bold text-gray-900 dark:text-white">{s.name}</h3>
							<p className="text-xs text-gray-500 dark:text-gray-400">{s.designation} · {s.department}</p>
						</div>
					</div>
					<Badge className={STATUS[s.status]}>{s.status}</Badge>
				</div>
				<p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{s.purpose}</p>
				<div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
					<span className="flex items-center gap-1"><MapPin className="size-3" />{s.institution}</span>
					<span className="flex items-center gap-1"><CalendarDays className="size-3" />{s.duration}</span>
					<span className="flex items-center gap-1"><Clock className="size-3" />{new Date(s.startDate).toLocaleDateString()} – {new Date(s.endDate).toLocaleDateString()}</span>
				</div>
				<div className="mt-3 flex items-center gap-2">
					<span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[11px] text-gray-600 dark:text-gray-400 font-medium">Funding: {s.fundingSource}</span>
				</div>
			</div>
		))}
	</div>
);

/* ═══════════ TENURE ═══════════ */
const TenureTab = ({ items }) => (
	<div className="space-y-4">
		{items.map((t) => (
			<div key={t.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-3">
						<div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${t.status === "At Risk" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : t.status === "Strong" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"}`}>{t.name.split(" ").slice(-1)[0][0]}</div>
						<div>
							<h3 className="font-bold text-gray-900 dark:text-white">{t.name}</h3>
							<p className="text-xs text-gray-500 dark:text-gray-400">{t.department} · Joined {new Date(t.joinDate).toLocaleDateString()}</p>
						</div>
					</div>
					<Badge className={STATUS[t.status]}>{t.status}</Badge>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-5 gap-2">
					{[
						{ label: "Years", value: t.yearsCompleted },
						{ label: "Teaching", value: `${t.teachingAvg}/5` },
						{ label: "Research", value: t.researchOutput },
						{ label: "Feedback", value: `${t.studentFeedback}/5` },
						{ label: "Review Date", value: new Date(t.reviewDate).toLocaleDateString() },
					].map((m) => (
						<div key={m.label} className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
							<p className="text-sm font-bold text-gray-900 dark:text-white">{m.value}</p>
							<p className="text-[10px] text-gray-500 dark:text-gray-400">{m.label}</p>
						</div>
					))}
				</div>
			</div>
		))}
	</div>
);

/* ═══════════ TRANSFERS ═══════════ */
const TransfersTab = ({ items }) => (
	<div className="space-y-4">
		{items.map((t) => (
			<div key={t.id} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-700 dark:text-violet-400 font-bold text-sm">{t.name.split(" ").slice(-1)[0][0]}</div>
						<div>
							<h3 className="font-bold text-gray-900 dark:text-white">{t.name}</h3>
							<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
								<span className="font-bold text-gray-700 dark:text-gray-300">{t.fromDept}</span>
								<ArrowLeftRight className="size-3" />
								<span className="font-bold text-violet-600 dark:text-violet-400">{t.toDept}</span>
							</div>
						</div>
					</div>
					<Badge className={STATUS[t.status]}>{t.status}</Badge>
				</div>
				<p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{t.reason}</p>
				<div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
					<span className="flex items-center gap-1"><CalendarDays className="size-3" />Requested: {new Date(t.requestDate).toLocaleDateString()}</span>
					<span className="flex items-center gap-1"><Clock className="size-3" />Effective: {new Date(t.effectiveDate).toLocaleDateString()}</span>
				</div>
			</div>
		))}
	</div>
);

export default FacultyLifecycleUI;
