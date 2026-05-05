// src/pages/AssetRequest/AssetRequestUI.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	RefreshCw,
	Plus,
	ClipboardList,
	ArrowLeft,
	Calendar,
	History,
	AlertCircle,
	User,
	AlertTriangle,
	Package,
} from "lucide-react";

import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import AdminContactSidebar from "../../components/common/AdminContactSidebar";
import AssetRequestCard from "./components/AssetRequestCard";
import AssetRequestModal from "./components/AssetRequestModal";

const AssetRequestUI = ({
	requests = [],
	admins = [],
	assets = [],
	cohorts = [],
	loading,
	error,
	onRefresh,
	onSubmit,
	isModalOpen,
	setIsModalOpen,
}) => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("my-requests");
	const [editingData, setEditingData] = useState(null);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	const categorizedRequests = requests.reduce(
		(acc, req) => {
			const isRejected = req.status === "Rejected";
			const now = new Date();
			let isExpired = false;

			if (req.type === "Accommodation" && req.duration) {
				const days = parseInt(req.duration) || 0;
				const expiryDate = new Date(req.date);
				expiryDate.setDate(expiryDate.getDate() + days);
				isExpired = expiryDate < now;
			} else if (req.date && req.endTime) {
				// Combine date and time: e.g., "2025-12-15" + "12:00" -> "2025-12-15T12:00:00"
				const expiryDateTime = new Date(
					`${req.date}T${req.endTime}:00`,
				);
				isExpired = expiryDateTime < now;
			} else if (req.date) {
				// Fallback for requests without specific end times, just check if the date passed
				isExpired = new Date(req.date) < now;
			}

			if (
				req.status === "Closed" ||
				(isRejected && req.isArchived) ||
				(req.status === "Approved" && isExpired)
			) {
				acc.history.push(req);
			} else {
				acc.active.push(req);
			}
			return acc;
		},
		{ active: [], history: [] },
	);

	const sortedActive = [...categorizedRequests.active].sort((a, b) => {
		const aNeedsAction = a.status === "Rejected" && !a.isArchived;
		const bNeedsAction = b.status === "Rejected" && !b.isArchived;
		if (aNeedsAction && !bNeedsAction) return -1;
		if (!aNeedsAction && bNeedsAction) return 1;
		return new Date(b.postedAt) - new Date(a.postedAt);
	});

	const handleOpenModal = (data = null) => {
		setEditingData(data);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingData(null);
	};

	const progressCount = requests.filter(
		(r) => r.status === "Pending" || r.status === "Resubmitted",
	).length;
	const resubmissionRequiredCount = requests.filter(
		(r) => r.status === "Rejected" && !r.isArchived,
	).length;

	const statsData = [
		{
			label: "Pending Requests",
			value: progressCount.toString(),
			icon: ClipboardList,
		},
		{
			label: "Action Required",
			value: resubmissionRequiredCount.toString(),
			icon: AlertCircle,
		},
	];

	const displayRequests =
		activeTab === "my-requests"
			? sortedActive
			: categorizedRequests.history;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
			<HeaderController />

			<div className="bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-800 dark:from-teal-900 dark:via-teal-950 dark:to-emerald-950 text-white">
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
									Asset Requests
								</h1>
								<p className="text-teal-50 text-sm mt-0.5">
									Manage your resource, equipment and
									accommodation bookings.
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3 pb-2 md:pb-0">
							{statsData.map((stat, index) => (
								<StatSummaryCard key={index} {...stat} />
							))}
						</div>
					</div>

					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{[
							{
								key: "my-requests",
								label: "My Requests",
								icon: Package,
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
									onClick={() => setActiveTab(tab.key)}
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										tab.mobileOnly ? "lg:hidden" : ""
									} ${
										activeTab === tab.key
											? "bg-gray-50 dark:bg-[#0f1117] text-teal-700 dark:text-teal-400"
											: "text-white/70 hover:text-white hover:bg-white/10"
									}`}
								>
									<Icon className="w-4 h-4" />
									{tab.label}
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
							<AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{error}
						</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" />
							Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-teal-500" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Maintenance Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your requests...
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
									themeColor="teal"
									isTabbedView={true}
								/>
							) : (
								<>
									<div className="flex items-center justify-between mb-6">
										<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
											{activeTab === "my-requests"
												? "Active Requests"
												: "Request History"}
										</h3>

										{activeTab === "my-requests" && (
											<button
												onClick={() =>
													handleOpenModal()
												}
												className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-800 dark:hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
											>
												<Plus className="size-4" />
												New Request
											</button>
										)}
									</div>

									{displayRequests.length > 0 ? (
										<div className="grid grid-cols-1 gap-4">
											{displayRequests.map((req) => (
												<AssetRequestCard
													key={req.id}
													req={req}
													onEdit={handleOpenModal}
												/>
											))}
										</div>
									) : (
										<div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-[#1a1d26] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
											<Calendar className="size-12 md:size-16 text-gray-200 dark:text-gray-700 mb-4" />
											<h2 className="text-lg font-bold text-gray-900 dark:text-white">
												No requests
											</h2>
											<p className="text-gray-500 dark:text-gray-400 text-sm">
												Your asset requests will appear
												here.
											</p>
										</div>
									)}
								</>
							)}
						</div>

						<div className="hidden lg:block">
							<AdminContactSidebar
								admins={admins}
								themeColor="teal"
							/>
						</div>
					</div>
				)}
			</main>

			{isModalOpen && (
				<AssetRequestModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					assets={assets}
					cohorts={cohorts}
					initialData={editingData}
					onSubmit={onSubmit}
				/>
			)}

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default AssetRequestUI;
