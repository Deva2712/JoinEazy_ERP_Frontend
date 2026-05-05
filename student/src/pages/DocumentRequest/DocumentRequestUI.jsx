// src/pages/DocumentRequest/DocumentRequestUI.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	FileText,
	RefreshCw,
	ArrowLeft,
	Clock,
	History,
	AlertTriangle,
	ClipboardList,
	User,
	Upload,
	CheckCircle,
	Stamp,
} from "lucide-react";

import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import AdminContactSidebar from "../../components/common/AdminContactSidebar";
import LetterUploadModal from "./components/LetterUploadModal";
import DocumentRequestCard from "./components/DocumentRequestCard";
import ProcessingQueueCard from "./components/ProcessingQueueCard";

/**
 * Presentational component for the Document Request management interface.
 * Displays request statistics, tabbed navigation for different stages of the
 * document lifecycle, and handles the rendering of request cards and modals.
 */
const DocumentRequestUI = ({
	activeRequests = [],
	processingQueue = [],
	historyRequests = [],
	admins = [],
	loading,
	error,
	isModalOpen,
	setIsModalOpen,
	onRefresh,
	onSendToStudent,
	activeTab,
	onTabChange,
	onSubmit,
	onRespond,
}) => {
	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	/**
	 * Calculation of dashboard metrics for the top summary cards.
	 */
	const underReviewCount = activeRequests.filter(
		(r) => r.status === "Under Review",
	).length;
	const approvedCount = processingQueue.filter(
		(f) => f.status === "Approved",
	).length;

	const statsData = [
		{
			label: "LORs Under Review",
			value: underReviewCount.toString(),
			icon: Clock,
		},
		{
			label: "Ready for Dispatch",
			value: approvedCount.toString(),
			icon: FileText,
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
			<HeaderController />

			{/* Hero Section: Header and Statistics Summary */}
			<div className="bg-gradient-to-br from-fuchsia-700 via-fuchsia-800 to-fuchsia-900 dark:from-fuchsia-900 dark:via-fuchsia-950 dark:to-fuchsia-950 text-white">
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
									Document Requests
								</h1>
								<p className="text-fuchsia-50 text-sm mt-0.5">
									Track LORs and official university
									certifications.
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3 pb-2 md:pb-0">
							{statsData.map((stat, index) => (
								<StatSummaryCard key={index} {...stat} />
							))}
						</div>
					</div>

					{/* Navigation: Tabbed interface for filtering request status */}
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{[
							{
								key: "active-requests",
								label: "Active Requests",
								icon: ClipboardList,
							},
							{
								key: "processing-queue",
								label: "Processing Queue",
								icon: Stamp,
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
							const isActive = activeTab === tab.key;

							const badge =
								tab.key === "active-requests" &&
								activeRequests.length > 0
									? activeRequests.length
									: null;

							return (
								<button
									key={tab.key}
									onClick={() => onTabChange(tab.key)}
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										tab.mobileOnly ? "lg:hidden" : ""
									} ${
										isActive
											? "bg-gray-50 dark:bg-[#0f1117] text-fuchsia-700 dark:text-fuchsia-400"
											: "text-white/70 hover:text-white hover:bg-white/10"
									}`}
								>
									<Icon className="w-4 h-4" />
									{tab.label}
									{badge && (
										<span
											className={`inline-flex items-center justify-center text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full ml-1.5 transition-colors ${
												isActive
													? "bg-fuchsia-600 text-white shadow-sm"
													: "bg-white text-fuchsia-700 shadow-sm"
											}`}
										>
											{badge}
										</span>
									)}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
				{/* Error State View */}
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong!
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{error}
						</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" />
							Try Again
						</button>
					</div>
				) : loading ? (
					/* Loading State View */
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-fuchsia-600" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Document Request Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your requests...
						</p>
					</div>
				) : (
					/* Main Content Area */
					<div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div
							className={`flex-grow ${activeTab === "support" ? "block lg:hidden" : "block"}`}
						>
							{activeTab === "support" ? (
								<AdminContactSidebar
									admins={admins}
									themeColor="fuchsia"
									isTabbedView={true}
								/>
							) : (
								<>
									<div className="flex items-center justify-between mb-6">
										<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
											{activeTab.replace("-", " ")}
										</h3>

										{activeTab === "active-requests" &&
											underReviewCount >= 1 && (
												<button
													onClick={() =>
														setIsModalOpen(true)
													}
													className="flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 dark:bg-fuchsia-800 dark:hover:bg-fuchsia-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm"
												>
													<Upload className="size-4" />
													Submit for Processing
												</button>
											)}
									</div>

									<div className="grid grid-cols-1 gap-4">
										{/* Active Tab: Displays ongoing student requests */}
										{activeTab === "active-requests" &&
											(activeRequests.length > 0 ? (
												activeRequests.map((req) => (
													<DocumentRequestCard
														key={req.id}
														data={req}
														onRespond={onRespond}
													/>
												))
											) : (
												<EmptyState
													message="Active document requests from students will appear here."
													Icon={ClipboardList}
												/>
											))}

										{/* Processing Queue: Displays documents currently with the Registrar */}
										{activeTab === "processing-queue" &&
											(processingQueue.length > 0 ? (
												processingQueue.map((flow) => (
													<ProcessingQueueCard
														key={flow.lorId}
														data={flow}
														onAction={
															onSendToStudent
														}
													/>
												))
											) : (
												<EmptyState
													message="Track the progress on your uploaded documents here."
													Icon={Stamp}
												/>
											))}

										{/* History Tab: Archive of fully completed and dispatched documents */}
										{activeTab === "history" &&
											(historyRequests.length > 0 ? (
												historyRequests.map((req) => (
													<DocumentRequestCard
														key={req.id}
														data={req}
													/>
												))
											) : (
												<EmptyState
													message="Previously dispatched documents will appear here."
													Icon={History}
												/>
											))}
									</div>
								</>
							)}
						</div>

						{/* Sidebar Section */}
						<div className="hidden lg:block">
							<AdminContactSidebar
								admins={admins}
								themeColor="fuchsia"
							/>
						</div>
					</div>
				)}
			</main>

			{/* Modal for triggering the Registrar workflow */}
			{isModalOpen && (
				<LetterUploadModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onSubmit={onSubmit}
					activeRequests={activeRequests}
				/>
			)}

			<BottomNavController />
			<FooterController />
		</div>
	);
};

/**
 * Reusable placeholder for views with no data records.
 */
const EmptyState = ({ message, Icon }) => (
	<div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-[#1a1d26] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
		<Icon className="size-16 text-gray-200 dark:text-gray-700 mb-4" />
		<h2 className="text-lg font-bold text-gray-900 dark:text-white">
			No records found
		</h2>
		<p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
	</div>
);

export default DocumentRequestUI;
