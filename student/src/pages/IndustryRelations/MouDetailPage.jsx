// src/pages/IndustryRelations/MouDetailPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	ArrowLeft, CalendarDays, Users, Phone, Mail, Linkedin,
	FileCheck, ExternalLink, MapPin, CheckCircle, AlertCircle,
} from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";

const STATUS_COLORS = {
	Active:  { badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",  bar: "bg-green-500" },
	Expired: { badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",          bar: "bg-red-500" },
	Pending: { badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", bar: "bg-yellow-500" },
};

const MOU_DOCS = {
	"MOU-001": [
		{ name: "TCS_MOU_2024_Strategic.pdf",   type: "MOU Agreement", date: "2024-01-01", size: "2.4 MB" },
		{ name: "TCS_Annex_A_ScopeOfWork.pdf",  type: "Annexure",      date: "2024-01-01", size: "0.8 MB" },
		{ name: "TCS_Renewal_Proposal_2027.pdf",type: "Renewal Draft", date: "2026-02-15", size: "1.1 MB" },
	],
	"MOU-002": [
		{ name: "Microsoft_MOU_Premium_2024.pdf",type: "MOU Agreement", date: "2024-06-01", size: "3.1 MB" },
		{ name: "MSFT_Hackathon_Addendum.pdf",   type: "Addendum",      date: "2025-01-10", size: "0.5 MB" },
	],
	"MOU-003": [
		{ name: "DeepMind_Research_MOU_2025.pdf",type: "MOU Agreement", date: "2025-01-01", size: "4.2 MB" },
		{ name: "DM_PhD_Internship_Terms.pdf",   type: "Terms",         date: "2025-01-01", size: "1.0 MB" },
	],
	"MOU-004": [
		{ name: "Wipro_MOU_Standard_2023.pdf",   type: "MOU Agreement", date: "2023-01-01", size: "1.8 MB" },
	],
	"MOU-005": [
		{ name: "JPMC_MOU_Fintech_2025.pdf",     type: "MOU Agreement", date: "2025-03-01", size: "2.7 MB" },
		{ name: "JPMC_CodeForGood_Addendum.pdf", type: "Addendum",      date: "2025-03-01", size: "0.6 MB" },
	],
	"MOU-006": [
		{ name: "Infosys_Strategic_MOU_2024.pdf",type: "MOU Agreement", date: "2024-04-01", size: "2.9 MB" },
		{ name: "InfySpringboard_Terms.pdf",     type: "Terms",         date: "2024-04-01", size: "1.2 MB" },
	],
};

const MouDetailPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const mou      = location.state?.mou;

	if (!mou) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-500 mb-4">MOU data not found.</p>
					<button onClick={() => navigate("/industry-relations/mous")} className="text-teal-600 font-bold flex items-center gap-2 mx-auto">
						<ArrowLeft className="size-4" /> Back to MoUs
					</button>
				</div>
			</div>
		);
	}

	const sc   = STATUS_COLORS[mou.status] || STATUS_COLORS.Active;
	const docs = MOU_DOCS[mou.id] || [];
	const duration = (() => {
		const days = Math.round((new Date(mou.endDate) - new Date(mou.startDate)) / (1000 * 60 * 60 * 24));
		return days > 365 ? `${Math.round(days / 365)} year${Math.round(days / 365) > 1 ? "s" : ""}` : `${Math.round(days / 30)} months`;
	})();

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />

			{/* Hero */}
			<div className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 dark:from-teal-900 dark:via-teal-950 dark:to-emerald-950 text-white">
				<div className="max-w-5xl mx-auto px-4 py-6">
					<div className="flex items-center gap-4">
						<button onClick={() => navigate("/industry-relations/mous")}
							className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
							<ArrowLeft className="size-5" />
						</button>
						<div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-bold text-xl">
							{mou.companyName.charAt(0)}
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-bold">{mou.companyName}</h1>
								<span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${sc.badge}`}>{mou.status}</span>
								{mou.renewalPending && <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">Renewal Pending</span>}
							</div>
							<p className="text-teal-100/80 text-sm mt-0.5">{mou.type} · {duration}</p>
						</div>
					</div>
				</div>
			</div>

			<main className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-12 space-y-6">
				{/* Key Metrics */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{[
						{ label: "Valid From",      value: new Date(mou.startDate).toLocaleDateString() },
						{ label: "Valid Until",     value: new Date(mou.endDate).toLocaleDateString() },
						{ label: "Hires / Year",    value: mou.hiresLastYear != null ? mou.hiresLastYear : "—" },
						{ label: "Avg Package",     value: mou.avgPackageOffered ? `${mou.avgPackageOffered} LPA` : "—" },
					].map(({ label, value }) => (
						<div key={label} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
							<p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
							<p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>
						</div>
					))}
				</div>

				{/* Scope & Description */}
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
					<div>
						<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Scope of Partnership</p>
						<p className="text-sm text-gray-700 dark:text-gray-300">{mou.scope}</p>
					</div>
					{mou.description && (
						<div>
							<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">About Partnership</p>
							<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{mou.description}</p>
						</div>
					)}
				</div>

				{/* Roles Looking For */}
				{mou.rolesLookingFor?.length > 0 && (
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
						<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Roles Looking For</p>
						<div className="flex flex-wrap gap-2">
							{mou.rolesLookingFor.map((r, i) => (
								<span key={i} className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-xl text-sm font-medium border border-teal-200/50 dark:border-teal-800/50">{r}</span>
							))}
						</div>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* HR Contact */}
					{mou.hrContact && (
						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
							<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">HR / Point of Contact</p>
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-sm shrink-0">
									{mou.hrContact.name.split(" ").map(n => n[0]).join("")}
								</div>
								<div className="space-y-1">
									<p className="font-bold text-gray-900 dark:text-white">{mou.hrContact.name}</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">{mou.hrContact.designation}</p>
									<div className="space-y-1 mt-2">
										<span className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
											<Phone className="size-3 shrink-0" />{mou.hrContact.phone}
										</span>
										<span className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
											<Mail className="size-3 shrink-0" />{mou.hrContact.email}
										</span>
										{mou.hrContact.linkedIn && (
											<span className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
												<Linkedin className="size-3 shrink-0" />{mou.hrContact.linkedIn}
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Campus Visits */}
					{mou.visitHistory?.length > 0 && (
						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
							<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Campus Visits ({mou.visitHistory.length})</p>
							<div className="space-y-3">
								{mou.visitHistory.map((v, i) => (
									<div key={i} className="flex items-start gap-3">
										<div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center shrink-0">
											<MapPin className="size-4 text-teal-600 dark:text-teal-400" />
										</div>
										<div>
											<p className="text-sm font-bold text-gray-900 dark:text-white">{v.purpose}</p>
											<p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
												<CalendarDays className="size-3" />{new Date(v.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* MOU Documents */}
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
					<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">MOU Documents ({docs.length})</p>
					{docs.length > 0 ? (
						<div className="space-y-3">
							{docs.map((d, i) => (
								<div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
											<FileCheck className="size-5 text-teal-600 dark:text-teal-400" />
										</div>
										<div>
											<p className="text-sm font-bold text-gray-900 dark:text-white">{d.name}</p>
											<p className="text-[10px] text-gray-500">{d.type} · {d.size} · {new Date(d.date).toLocaleDateString()}</p>
										</div>
									</div>
									<button className="flex items-center gap-1.5 text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20">
										<ExternalLink className="size-3.5" />View
									</button>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8">
							<FileCheck className="size-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
							<p className="text-sm text-gray-400">No documents uploaded yet.</p>
						</div>
					)}
				</div>
			</main>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default MouDetailPage;
