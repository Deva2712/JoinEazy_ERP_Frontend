// src/pages/LeaveApplication/LeaveApplicationUI.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Plus,
	RefreshCw,
	Calendar,
	ClipboardList,
	History,
	User,
	UserPlus,
	AlertTriangle,
	Users,
} from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import AdminContactSidebar from "../../components/common/AdminContactSidebar";
import LeaveRequestCard from "./components/LeaveRequestCard";
import SubstitutionRequestCard from "./components/SubstitutionRequestCard";
import FacultyRequestCard from "./components/FacultyRequestCard";
import LeaveRequestModal from "./components/LeaveRequestModal";

const LeaveApplicationUI = ({
	userRole,
	applications = [],
	substitutionRequests = [],
	incomingRequests = [],
	admins = [],
	faculties = [],
	courses = [],
	loading,
	error,
	isModalOpen,
	setIsModalOpen,
	onRefresh,
	onSubmit,
	onRespondToSubstitution,
	onRespondToFaculty,
	activeTab,
	onTabChange,
}) => {
	const navigate = useNavigate();
	const [editingData, setEditingData] = useState(null);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	const isHoD = userRole === "hod";

	const tabs = [
		{ key: "my-leaves", label: "My Leaves", icon: ClipboardList },
		...(isHoD
			? [
					{
						key: "faculty-requests",
						label: "Faculty Requests",
						icon: Users,
					},
				]
			: [
					{
						key: "substitutions",
						label: "Substitutions",
						icon: UserPlus,
					},
				]),
		{ key: "history", label: "History", icon: History },
		{ key: "support", label: "Support", icon: User, mobileOnly: true },
	];

	/**
	 * Categorizes user's personal applications.
	 * Moves all Approved requests and archived Rejected requests to history.
	 */
	const categorizedLeaves = applications.reduce(
		(acc, app) => {
			if (
				app.status === "Approved" ||
				(app.status === "Rejected" && app.isArchived)
			) {
				acc.history.push(app);
			} else {
				acc.active.push(app);
			}
			return acc;
		},
		{ active: [], history: [] },
	);

	const sortedActive = [...categorizedLeaves.active].sort((a, b) => {
		const aNeedsAction = a.status === "Rejected" && !a.isArchived;
		const bNeedsAction = b.status === "Rejected" && !b.isArchived;
		if (aNeedsAction && !bNeedsAction) return -1;
		if (!aNeedsAction && bNeedsAction) return 1;
		return new Date(b.appliedAt) - new Date(a.appliedAt);
	});

	const statsData = [
		{
			label: "Pending Applications",
			value: applications
				.filter((a) => ["Pending", "Resubmitted"].includes(a.status))
				.length.toString(),
			icon: ClipboardList,
		},
		{
			label: isHoD ? "New Faculty Requests" : "Substitution Requests",
			value: isHoD
				? incomingRequests
						.filter(
							(r) => r.leaveApproval?.HoD?.status === "Pending",
						)
						.length.toString()
				: substitutionRequests
						.filter((s) => s.status === "Pending")
						.length.toString(),
			icon: isHoD ? Users : UserPlus,
		},
	];

	/**
	 * Determines which list to display based on the selected tab.
	 */
	const getDisplayContent = () => {
		if (activeTab === "faculty-requests") {
			// Filter out both Approved and Rejected requests to show only Pending/Actionable ones
			return incomingRequests.filter(
				(r) =>
					r.leaveApproval?.HoD?.status !== "Rejected" &&
					r.leaveApproval?.HoD?.status !== "Approved",
			);
		}
		if (activeTab === "substitutions") {
			const today = new Date().setHours(0, 0, 0, 0);
			return substitutionRequests.filter(
				(s) => s.status !== "Rejected" && new Date(s.toDate) >= today,
			);
		}
		if (activeTab === "history") return categorizedLeaves.history;
		return sortedActive;
	};

	const displayRequests = getDisplayContent();

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 font-sans">
			<HeaderController />

			{/* Header Banner Section */}
			<div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 dark:from-orange-900 dark:via-orange-950 dark:to-red-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/dashboard")}
								className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
							>
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">
									Leave Applications
								</h1>
								<p className="text-white/80 text-sm mt-0.5">
									Manage leaves and substitution requests.
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3 pb-2 md:pb-0">
							{statsData.map((stat, index) => (
								<StatSummaryCard key={index} {...stat} />
							))}
						</div>
					</div>

					{/* Navigation Tabs */}
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{tabs.map((tab) => (
							<button
								key={tab.key}
								onClick={() => onTabChange(tab.key)}
								className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
									tab.mobileOnly ? "lg:hidden" : ""
								} ${
									activeTab === tab.key
										? "bg-gray-50 dark:bg-[#0f1117] text-orange-600 dark:text-orange-400"
										: "text-white/70 hover:text-white hover:bg-white/10"
								}`}
							>
								<tab.icon className="w-4 h-4" />
								{tab.label}
							</button>
						))}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{error}
						</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" />
							Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-orange-600" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Leave Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your borrowed leave
							applications...
						</p>
					</div>
				) : (
					<div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div
							className={`flex-grow ${activeTab === "support" ? "block lg:hidden" : "block"}`}
						>
							{activeTab === "support" ? (
								<AdminContactSidebar
									admins={admins}
									themeColor="orange"
									isTabbedView={true}
								/>
							) : (
								<>
									{/* List Header */}
									<div className="flex items-center justify-between mb-6">
										<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
											{activeTab.replace("-", " ")}
										</h3>
										{activeTab === "my-leaves" && (
											<div className="flex gap-2">
												<button
													onClick={onRefresh}
													className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
												>
													<RefreshCw
														className={`size-5 ${loading ? "animate-spin" : ""}`}
													/>
												</button>
												<button
													onClick={() => {
														setEditingData(null);
														setIsModalOpen(true);
													}}
													className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
												>
													<Plus className="size-4" />{" "}
													Apply Leave
												</button>
											</div>
										)}
									</div>

									{/* Requests List */}
									{displayRequests.length > 0 ? (
										<div className="grid grid-cols-1 gap-4">
											{displayRequests.map((item) => {
												if (
													activeTab ===
													"substitutions"
												) {
													return (
														<SubstitutionRequestCard
															key={item.id}
															app={item}
															onRespond={
																onRespondToSubstitution
															}
														/>
													);
												}

												if (
													activeTab ===
													"faculty-requests"
												) {
													return (
														<FacultyRequestCard
															key={item.id}
															app={item}
															onRespond={
																onRespondToFaculty
															}
															userRole={userRole}
														/>
													);
												}

												return (
													<LeaveRequestCard
														key={item.id}
														app={item}
														onEdit={
															activeTab ===
															"my-leaves"
																? () => {
																		setEditingData(
																			item,
																		);
																		setIsModalOpen(
																			true,
																		);
																	}
																: null
														}
														isApprovalMode={false}
														userRole={userRole}
													/>
												);
											})}
										</div>
									) : (
										<div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
											<Calendar className="size-12 md:size-16 text-gray-200 dark:text-gray-700 mb-4" />
											<h2 className="text-lg font-bold text-gray-900 dark:text-white">
												Empty
											</h2>
											<p className="text-gray-500 dark:text-gray-400 text-sm">
												No records found.
											</p>
										</div>
									)}
								</>
							)}
						</div>

						{/* Contact Sidebar for Desktop */}
						<div className="hidden lg:block">
							<AdminContactSidebar
								admins={admins}
								themeColor="orange"
							/>
						</div>
					</div>
				)}
			</main>

			<LeaveRequestModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={editingData}
				faculties={faculties}
				courses={courses}
				onSubmit={onSubmit}
			/>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default LeaveApplicationUI;
