// src/pages/Settings/SettingsUI.jsx
import React, { useState, useEffect } from "react";
import { User, Lock, ChevronRight, LogOut, Bug, Settings } from "lucide-react";
import ProfileManagementView from "./views/ProfileManagementView";
import SecurityView from "./views/SecurityView";
import BugReportView from "./views/BugReportView";
import HeaderController from "@/components/layout/Header/HeaderController";
import BottomNavController from "@/components/layout/BottomNav/BottomNavController";
import FooterController from "@/components/layout/Footer/FooterController";
import { useNavigate } from "react-router-dom";

const SettingsUI = ({
	currentView,
	profileData,
	setProfileData,
	handleLogoutClick,
	handleImageUpload,
	handleProfileSave,
	handlePasswordSave,
	handleBugReportSubmit,
	additionalLinks = [],
	loading = false,
}) => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [bugReport, setBugReport] = useState({
		description: "",
		screenshots: [],
		status: "Open",
	});

	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [currentView]);

	const handleFileUpload = (e, type) => {
		const files = Array.from(e.target.files);
		if (type === "documents")
			setProfileData((p) => ({
				...p,
				documents: [...p.documents, ...files],
			}));
		else if (type === "screenshots")
			setBugReport((p) => ({
				...p,
				screenshots: [...p.screenshots, ...files],
			}));
	};

	const inputClass =
		"w-full px-4 py-3 bg-gray-50 dark:bg-[#0f1117] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
	const labelClass =
		"block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2";

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] pb-24 font-sans">
			<HeaderController />

			<main className="max-w-4xl mx-auto px-4 py-4 md:py-8">
				{currentView === "profile-management" ? (
					<ProfileManagementView
						profileData={profileData}
						setProfileData={setProfileData}
						onSaveProfile={handleProfileSave}
						loading={loading}
						handleFileUpload={handleFileUpload}
					/>
				) : currentView === "bug-report" ? (
					<BugReportView
						bugReport={bugReport}
						setBugReport={setBugReport}
						inputClass={inputClass}
						labelClass={labelClass}
						handleFileUpload={handleFileUpload}
						onSaveBugReport={handleBugReportSubmit}
						loading={loading}
					/>
				) : currentView === "password" ? (
					<SecurityView
						password={password}
						setPassword={setPassword}
						confirmPassword={confirmPassword}
						setConfirmPassword={setConfirmPassword}
						errors={errors}
						setErrors={setErrors}
						inputClass={inputClass}
						labelClass={labelClass}
						onSavePassword={handlePasswordSave}
						loading={loading}
					/>
				) : (
					<div className="space-y-6">
						<div className="flex items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
									<Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
								</div>
								<h1 className="text-xl font-bold text-gray-900 dark:text-white">
									Account Settings
								</h1>
							</div>

							<button
								onClick={handleLogoutClick}
								className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs transition-all"
							>
								<LogOut className="size-4" /> Sign Out
							</button>
						</div>

						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 shadow-sm">
							<div className="size-20 rounded-3xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-3xl font-black overflow-hidden border-2 border-white dark:border-gray-700 shadow-xl">
								<img
									src={profileData.profile_pic}
									alt={profileData.fullName}
									className="size-full object-cover"
								/>
							</div>
							<div className="flex-1 min-w-0 text-center sm:text-left">
								<div className="text-lg font-bold text-gray-900 dark:text-white truncate">
									{profileData.fullName || "User"}
								</div>
								<div className="text-sm text-gray-500 dark:text-gray-400 truncate">
									{profileData.officialEmail}
								</div>
							</div>
							<label className="cursor-pointer w-full sm:w-auto px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-center text-gray-900 dark:text-white rounded-xl font-bold text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
								<input
									type="file"
									className="hidden"
									accept="image/*"
									onChange={async (e) =>
										e.target.files[0] &&
										(await handleImageUpload(
											e.target.files[0],
										))
									}
								/>
								Change Photo
							</label>
						</div>

						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
							{[
								{ icon: User, label: "Profile", desc: "Manage personal info", view: "profile-management", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600" },
								{ icon: Lock, label: "Security", desc: "Update your password", view: "password", color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600" },
								{ icon: Bug, label: "Report a Bug", desc: "Submit technical issues", view: "bug-report", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600" },
							].map((item, i) => (
								<button
									key={item.label}
									onClick={() => navigate(`/settings/${item.view}`)}
									className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#252a36] transition-colors text-left ${i !== 2 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}
								>
									<div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
										<item.icon className="size-4" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.label}</div>
										<div className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.desc}</div>
									</div>
									<ChevronRight className="size-4 text-gray-400 shrink-0" />
								</button>
							))}
						</div>

						<div className="flex flex-col gap-3">
							<div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
								Legal Information
							</div>
							<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
								{additionalLinks.map((link) => (
									<a
										key={link.id}
										href={link.path}
										target="_blank"
										rel="noreferrer"
										className="flex items-center justify-between px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252a36] transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
									>
										{link.label}
										<ChevronRight className="size-4 text-gray-400" />
									</a>
								))}
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

export default SettingsUI;