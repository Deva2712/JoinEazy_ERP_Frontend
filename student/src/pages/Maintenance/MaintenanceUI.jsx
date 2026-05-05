// src/pages/Maintenance/MaintenanceUI

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Plus,
	RefreshCw,
	ArrowLeft,
	History,
	AlertCircle,
	School,
	Home,
	User,
	ClipboardList,
} from "lucide-react";

import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import AdminContactSidebar from "../../components/common/AdminContactSidebar";
import MaintenanceRequestModal from "./components/MainenanceRequestModal";
import MaintenanceRequestCard from "./components/MaintenanceRequestCard";

/**
 * MaintenanceUI
 * * The presentational layer for the Maintenance module.
 * - Renders the dashboard header, tab navigation, and request lists.
 * - Filters requests based on the active tab and history sub-categories.
 * - Manages the visibility and state of the New Request modal.
 */
const MaintenanceUI = ({
	requests = [],
	technicians = [],
	admins = [],
	issueTypes = [],
	loading = false,
	error = null,
	activeTab,
	onTabChange,
	onSubmitRequest,
	onRefresh,
}) => {
	const navigate = useNavigate();
	const [historyCategory, setHistoryCategory] = useState("university");
	const [showRequestForm, setShowRequestForm] = useState(false);

	/**
	 * Defines the structure for a new maintenance request.
	 * Default values are set based on the currently active tab.
	 */
	const defaultForm = {
		issueType: "structural",
		component: "",
		location: "",
		description: "",
		priority: "medium",
		category:
			activeTab === "history" || activeTab === "support"
				? "university"
				: activeTab,
	};
	const [formData, setFormData] = useState(defaultForm);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	/**
	 * Matches a technician ID from a request to the full technician object
	 * to display contact or profile information in the request card.
	 */
	const getTechnicianInfo = (techId) => {
		return technicians.find((t) => t.id === techId) || null;
	};

	/**
	 * Filters the global requests array based on the user's current view.
	 * - 'history' tab shows only resolved/closed requests.
	 * - Other tabs show active (pending/in-progress) requests for that specific category.
	 */
	const displayRequests = requests.filter((req) => {
		const isResolved = ["solved", "closed", "rejected"].includes(
			req.status,
		);

		if (activeTab === "history") {
			if (!isResolved) return false;
			if (historyCategory === "all") return true;
			return req.category === historyCategory;
		}

		return !isResolved && req.category === activeTab;
	});

	/**
	 * Aggregates counts for the summary cards in the header.
	 */
	const statsData = [
		{
			label: "Pending Requests",
			value: requests
				.filter((r) =>
					["pending", "viewed", "inProgress"].includes(r.status),
				)
				.length.toString(),
			icon: ClipboardList,
		},
		{
			label: "Action Required",
			value: requests.filter((r) => r.requiresAction).length.toString(),
			icon: AlertCircle,
		},
	];

	/**
	 * Proxies the form submission to the controller and resets local UI state on success.
	 */
	const handleFormSubmit = async (e) => {
		e.preventDefault();
		const success = await onSubmitRequest(formData);
		if (success) {
			setShowRequestForm(false);
			setFormData(defaultForm);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
			<HeaderController />

			{/* Hero & Tab Navigation Section */}
			<div className="bg-gradient-to-br from-yellow-500 via-yellow-600 to-amber-600 dark:from-yellow-900 dark:via-amber-900 dark:to-orange-950 text-white">
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
									Maintenance
								</h1>
								<p className="text-yellow-50 text-sm mt-0.5">
									Submit and track repair requests for university facilities and accommodation.
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3 pb-2 md:pb-0">
							{statsData.map((stat, i) => (
								<StatSummaryCard key={i} {...stat} />
							))}
						</div>
					</div>

					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{[
							{
								key: "university",
								label: "University",
								icon: School,
							},
							{
								key: "accommodation",
								label: "Accommodation",
								icon: Home,
							},
							{ key: "history", label: "History", icon: History },
							{
								key: "support",
								label: "Support",
								icon: User,
								mobileOnly: true,
							},
						].map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.key}
									onClick={() => onTabChange(tab.key)}
									className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										tab.mobileOnly ? "lg:hidden" : ""
									} ${
										activeTab === tab.key
											? "bg-gray-50 dark:bg-[#0f1117] text-yellow-600 dark:text-yellow-400"
											: "text-white/70 hover:text-white hover:bg-white/10"
									}`}
								>
									<Icon className="w-4 h-4" /> {tab.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-8 pb-24">
				{/* Error State View */}
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertCircle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{error}
						</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" />
							Try Again
						</button>
					</div>
				) : loading ? (
					/* Loading State View */
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-yellow-500" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Maintenance Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your requests...
						</p>
					</div>
				) : (
					/* Main Content View */
					<div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div
							className={`flex-grow ${activeTab === "support" ? "block lg:hidden" : "block"}`}
						>
							{activeTab === "support" ? (
								<AdminContactSidebar
									admins={admins}
									themeColor="yellow"
									isTabbedView={true}
								/>
							) : (
								<>
									{/* List Header & Action Controls */}
									<div className="flex flex-col gap-4 mb-6">
										<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
											<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
												{activeTab === "history"
													? "Requests History"
													: `${activeTab} Requests`}
											</h3>

											<div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
												{/* History Filter Toggle */}
												{activeTab === "history" && (
													<div className="flex w-full md:w-auto p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
														<button
															onClick={() =>
																setHistoryCategory(
																	"university",
																)
															}
															className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
																historyCategory ===
																"university"
																	? "bg-yellow-500 dark:bg-yellow-600 text-white shadow-md"
																	: "text-gray-500 dark:text-gray-400 hover:text-yellow-500 hover:dark:text-yellow-600"
															}`}
														>
															<School className="size-4" />{" "}
															<span>
																University
															</span>
														</button>
														<button
															onClick={() =>
																setHistoryCategory(
																	"accommodation",
																)
															}
															className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
																historyCategory ===
																"accommodation"
																	? "bg-yellow-500 dark:bg-yellow-600 text-white shadow-md"
																	: "text-gray-500 dark:text-gray-400 hover:text-yellow-500 hover:dark:text-yellow-600"
															}`}
														>
															<Home className="size-4" />{" "}
															<span>
																Accommodation
															</span>
														</button>
													</div>
												)}

												{/* New Request CTA */}
												{activeTab !== "history" && (
													<button
														onClick={() => {
															setFormData({
																...defaultForm,
																category:
																	activeTab,
															});
															setShowRequestForm(
																true,
															);
														}}
														className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95"
													>
														<Plus className="size-4" />{" "}
														New Request
													</button>
												)}
											</div>
										</div>
									</div>

									{/* Request Cards Feed */}
									<div className="space-y-4">
										{displayRequests.length > 0 ? (
											displayRequests.map((req) => (
												<MaintenanceRequestCard
													key={req.id}
													request={req}
													technician={getTechnicianInfo(
														req.assignedTechnicianId,
													)}
												/>
											))
										) : (
											<div className="text-center py-12 text-gray-500 dark:text-gray-400 italic">
												No{" "}
												{activeTab === "history"
													? "history"
													: "active"}{" "}
												requests found for this
												category.
											</div>
										)}
									</div>
								</>
							)}
						</div>

						{/* Desktop Sidebar */}
						<div className="hidden lg:block w-80">
							<AdminContactSidebar
								themeColor="yellow"
								admins={admins}
							/>
						</div>
					</div>
				)}
			</main>

			<MaintenanceRequestModal
				isOpen={showRequestForm}
				onClose={() => setShowRequestForm(false)}
				formData={formData}
				setFormData={setFormData}
				defaultForm={defaultForm}
				onSubmit={handleFormSubmit}
				issueTypes={issueTypes}
			/>
			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default MaintenanceUI;
