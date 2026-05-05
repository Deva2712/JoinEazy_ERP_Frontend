// src/pages/RiskGovernance/RiskGovernanceUI.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft, RefreshCw, AlertTriangle, ShieldAlert, ShieldCheck,
	Bell, X, Building2, Users, GraduationCap, FileText,
	CheckCircle2, TrendingUp, Download, Loader2,
	Activity, BarChart3, AlertCircle, BookOpen,
} from "lucide-react";

import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";

/* ─── helpers ─── */
const SEVERITY_STYLES = {
	Critical: { badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", dot: "bg-red-500" },
	High:     { badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", dot: "bg-orange-500" },
	Medium:   { badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", dot: "bg-yellow-400" },
	Low:      { badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", dot: "bg-blue-400" },
};
const RISK_BG = {
	Low:    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
	High:   "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};
const healthColor = (v) =>
	v >= 85 ? "bg-green-500" : v >= 75 ? "bg-yellow-400" : "bg-red-500";

/* ─── main component ─── */
const RiskGovernanceUI = ({ data, loading, error, onRefresh, generatingReport, onGenerateReport }) => {
	const navigate = useNavigate();
	const [alertsOpen, setAlertsOpen] = useState(false);

	const openAlerts = data?.alerts?.filter((a) => a.status === "Open").length ?? 0;

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />

			{/* ── Hero Header ── */}
			<div className="bg-gradient-to-br from-rose-600 via-red-700 to-rose-800 dark:from-rose-900 dark:via-red-950 dark:to-rose-950 text-white">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/dashboard")}
								className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm"
							>
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Risk & Governance</h1>
								<p className="text-rose-100/80 text-sm mt-0.5">
									University operational health, compliance tracking & policy oversight.
								</p>
							</div>
						</div>
						{data?.summary && (
							<div className="flex items-center gap-3">
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center hidden sm:block">
									<p className="text-xs text-rose-200/70 font-medium">Op. Health</p>
									<p className="text-lg font-bold">{data.summary.operationalHealth}%</p>
								</div>
								<div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center hidden sm:block">
									<p className="text-xs text-rose-200/70 font-medium">Compliance</p>
									<p className="text-lg font-bold">{data.summary.complianceRate}%</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* ── Alerts Sidebar (slide-in from right) ── */}
			{alertsOpen && (
				<>
					<div
						className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
						onClick={() => setAlertsOpen(false)}
					/>
					<div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-[#1a1d26] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
						<div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
							<div className="flex items-center gap-2">
								<Bell className="size-5 text-rose-600 dark:text-rose-400" />
								<h2 className="font-bold text-gray-900 dark:text-white">Active Alerts</h2>
								<span className="px-2 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 rounded-full text-xs font-bold">
									{openAlerts}
								</span>
							</div>
							<button
								onClick={() => setAlertsOpen(false)}
								className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
							>
								<X className="size-4 text-gray-500" />
							</button>
						</div>
						<div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
							{data?.alerts?.map((alert) => {
								const s = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.Low;
								return (
									<div key={alert.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
										<div className="flex items-start gap-3">
											<div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${s.dot}`} />
											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between gap-2 mb-1">
													<span className={`px-2 py-0.5 rounded-md text-xs font-bold ${s.badge}`}>
														{alert.severity}
													</span>
													<span className="text-[10px] text-gray-400">{alert.date}</span>
												</div>
												<p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-0.5">{alert.type} — {alert.department}</p>
												<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{alert.message}</p>
												<div className="mt-2">
													<span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${alert.status === "Open" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
														{alert.status}
													</span>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</>
			)}

			{/* ── Main Content ── */}
			<main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
						<button onClick={onRefresh} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
							<RefreshCw className="size-4" /> Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20">
						<RefreshCw className="size-12 animate-spin mb-4 text-rose-500" />
						<p className="font-bold text-gray-900 dark:text-white">Loading Governance Data</p>
						<p className="text-sm text-gray-400 mt-1">Scanning compliance records...</p>
					</div>
				) : data && (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">

						{/* ── Row 1: Main Stats | MIS Report Generator ── */}
						<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

							{/* Left: Operational Health Stats */}
							<div className="lg:col-span-3 bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
								<div className="flex items-center justify-between mb-5">
									<div className="flex items-center gap-2">
										<Activity className="size-5 text-rose-600 dark:text-rose-400" />
										<h2 className="text-lg font-bold text-gray-900 dark:text-white">Operational Health</h2>
									</div>
									{/* ── Alerts Button lives here in the overview ── */}
									<button
										onClick={() => setAlertsOpen(true)}
										className="relative flex items-center gap-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 px-3 py-1.5 rounded-xl text-sm font-bold transition-all"
									>
										<Bell className="size-4" />
										Alerts
										{openAlerts > 0 && (
											<span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
												{openAlerts}
											</span>
										)}
									</button>
								</div>

								{/* Big Health Score */}
								<div className="flex items-center gap-6 mb-6">
									<div className="relative w-24 h-24 flex-shrink-0">
										<svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
											<circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" className="dark:stroke-gray-700" />
											<circle
												cx="18" cy="18" r="15.9" fill="none"
												stroke={data.summary.operationalHealth >= 85 ? "#22c55e" : data.summary.operationalHealth >= 75 ? "#eab308" : "#ef4444"}
												strokeWidth="3.5"
												strokeDasharray={`${data.summary.operationalHealth} ${100 - data.summary.operationalHealth}`}
												strokeLinecap="round"
											/>
										</svg>
										<div className="absolute inset-0 flex items-center justify-center">
											<span className="text-lg font-black text-gray-900 dark:text-white">{data.summary.operationalHealth}%</span>
										</div>
									</div>
									<div>
										<p className="text-sm text-gray-500 dark:text-gray-400">Overall Operational Health</p>
										<p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
											{data.summary.operationalHealth >= 85 ? "Healthy" : data.summary.operationalHealth >= 75 ? "Moderate" : "At Risk"}
										</p>
										<p className="text-xs text-gray-400 mt-1">Compliance Rate: <strong className="text-gray-700 dark:text-gray-300">{data.summary.complianceRate}%</strong></p>
									</div>
								</div>

								{/* Compliance Bars */}
								<div className="space-y-3">
									{[
										{ label: "Policy Compliance", value: data.summary.complianceRate },
										{ label: "Active Alerts", value: data.summary.activeAlerts, raw: true, suffix: " open", color: "bg-rose-500" },
										{ label: "Policy Violations", value: data.summary.policyViolations, raw: true, suffix: " this month", color: "bg-orange-500" },
										{ label: "Resolved This Month", value: data.summary.resolvedThisMonth, raw: true, suffix: " cases", color: "bg-green-500" },
									].map((item) => (
										<div key={item.label} className="flex items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
											<span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
											{item.raw ? (
												<div className="flex items-center gap-1.5 flex-shrink-0">
													<div className={`w-2 h-2 rounded-full ${item.color}`} />
													<span className="text-sm font-black text-gray-900 dark:text-white">{item.value}{item.suffix}</span>
												</div>
											) : (
												<div className="flex items-center gap-2 flex-shrink-0">
													<div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
														<div className={`h-full rounded-full ${healthColor(item.value)}`} style={{ width: `${item.value}%` }} />
													</div>
													<span className="text-sm font-black text-gray-900 dark:text-white w-12 text-right">{item.value}%</span>
												</div>
											)}
										</div>
									))}
								</div>
							</div>

							{/* Right: MIS Report Generator */}
							<div className="lg:col-span-2 bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col">
								<div className="flex items-center gap-2 mb-5">
									<FileText className="size-5 text-rose-600 dark:text-rose-400" />
									<h2 className="text-lg font-bold text-gray-900 dark:text-white">MIS Report Generator</h2>
								</div>
								<div className="flex-1 space-y-3 overflow-y-auto">
									{data.misReports?.map((report) => {
										const isGenerating = generatingReport === report.id;
										const catColor = {
											Operations: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
											Faculty: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
											Student: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
											Governance: "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
											Infrastructure: "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400",
											Academic: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
										}[report.category] || "bg-gray-100 text-gray-700";
										return (
											<div key={report.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-all">
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-1.5 mb-0.5">
														<span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${catColor}`}>{report.category}</span>
														<span className="text-[10px] text-gray-400 font-medium">{report.format}</span>
													</div>
													<p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{report.name}</p>
													<p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{report.description}</p>
												</div>
												<button
													onClick={() => onGenerateReport(report.id)}
													disabled={isGenerating}
													className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-lg text-xs font-bold transition-all"
												>
													{isGenerating
														? <><Loader2 className="size-3 animate-spin" /> Generating...</>
														: <><Download className="size-3" /> Generate</>
													}
												</button>
											</div>
										);
									})}
								</div>
							</div>
						</div>

						{/* ── Row 2: Stats Cards ── */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{[
								{ label: "Departments", value: data.summary.totalDepartments, icon: Building2, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
								{ label: "Total Faculty", value: data.summary.totalFaculty, icon: Users, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20" },
								{ label: "Total Students", value: data.summary.totalStudents?.toLocaleString(), icon: GraduationCap, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
								{ label: "Policy Violations", value: data.summary.policyViolations, icon: ShieldAlert, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
								{ label: "Active Alerts", value: data.summary.activeAlerts, icon: AlertCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
								{ label: "Resolved (Month)", value: data.summary.resolvedThisMonth, icon: CheckCircle2, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
								{ label: "Compliance Rate", value: `${data.summary.complianceRate}%`, icon: ShieldCheck, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/20" },
								{ label: "Operational Health", value: `${data.summary.operationalHealth}%`, icon: Activity, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
							].map((s, i) => {
								const Icon = s.icon;
								return (
									<div key={i} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
										<div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
											<Icon className={`size-5 ${s.color}`} />
										</div>
										<p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
										<p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
									</div>
								);
							})}
						</div>

						{/* ── Row 3: Charts ── */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

							{/* Compliance Trend */}
							<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
								<div className="flex items-center gap-2 mb-5">
									<TrendingUp className="size-5 text-rose-600 dark:text-rose-400" />
									<h3 className="font-bold text-gray-900 dark:text-white">Compliance Trends</h3>
								</div>
								<div className="space-y-3">
									{data.complianceTrends?.map((t) => (
										<div key={t.month}>
											<div className="flex items-center justify-between mb-1">
												<span className="text-xs font-bold text-gray-600 dark:text-gray-400 w-8">{t.month}</span>
												<span className="text-[10px] text-gray-400">{t.operationalHealth}%</span>
											</div>
											<div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
												<div
													className={`h-full rounded-full transition-all duration-700 ${healthColor(t.operationalHealth)}`}
													style={{ width: `${t.operationalHealth}%` }}
												/>
											</div>
										</div>
									))}
								</div>
								<div className="mt-4 flex items-center gap-4 text-[11px] text-gray-400">
									<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />≥85%</span>
									<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />75–84%</span>
									<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />&lt;75%</span>
								</div>
							</div>

							{/* Department Risk */}
							<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
								<div className="flex items-center gap-2 mb-5">
									<BarChart3 className="size-5 text-rose-600 dark:text-rose-400" />
									<h3 className="font-bold text-gray-900 dark:text-white">Department Risk</h3>
								</div>
								<div className="space-y-3">
									{data.departmentHealth?.map((d) => (
										<div key={d.department} className="flex items-center gap-3">
											<div className="w-12 text-xs font-bold text-gray-700 dark:text-gray-300">{d.department}</div>
											<div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
												<div
													className={`h-full rounded-full ${d.operationalScore >= 85 ? "bg-green-500" : d.operationalScore >= 75 ? "bg-yellow-400" : "bg-red-500"}`}
													style={{ width: `${d.operationalScore}%` }}
												/>
											</div>
											<div className="flex items-center gap-1.5 w-24 justify-end">
												<span className="text-xs font-bold text-gray-900 dark:text-white">{d.operationalScore}%</span>
												<span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${RISK_BG[d.riskLevel]}`}>{d.riskLevel}</span>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Violation Breakdown */}
							<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
								<div className="flex items-center gap-2 mb-5">
									<BookOpen className="size-5 text-rose-600 dark:text-rose-400" />
									<h3 className="font-bold text-gray-900 dark:text-white">Violation Types</h3>
								</div>
								<div className="space-y-3">
									{(() => {
										const total = data.violationBreakdown?.reduce((s, v) => s + v.count, 0) || 1;
										return data.violationBreakdown?.map((v) => (
											<div key={v.type}>
												<div className="flex items-center justify-between mb-1">
													<div className="flex items-center gap-2">
														<div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: v.color }} />
														<span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{v.type}</span>
													</div>
													<span className="text-xs font-bold text-gray-900 dark:text-white">{v.count}</span>
												</div>
												<div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
													<div
														className="h-full rounded-full transition-all duration-700"
														style={{ width: `${(v.count / total) * 100}%`, background: v.color }}
													/>
												</div>
											</div>
										));
									})()}
								</div>

								{/* Recent violations */}
								<div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
									<p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3">Recent Open Violations</p>
									<div className="space-y-2">
										{data.policyViolations?.filter((v) => v.status !== "Resolved").slice(0, 3).map((v) => {
											const s = SEVERITY_STYLES[v.severity] || SEVERITY_STYLES.Low;
											return (
												<div key={v.id} className="flex items-start gap-2 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/40">
													<div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${s.dot}`} />
													<div className="flex-1 min-w-0">
														<p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 truncate">{v.type} — {v.department}</p>
														<p className="text-[10px] text-gray-400 truncate">{v.description}</p>
													</div>
													<span className={`flex-shrink-0 px-1.5 py-0.5 rounded-md text-[9px] font-bold ${s.badge}`}>{v.severity}</span>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>

					</div>
				)}
			</main>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default RiskGovernanceUI;
