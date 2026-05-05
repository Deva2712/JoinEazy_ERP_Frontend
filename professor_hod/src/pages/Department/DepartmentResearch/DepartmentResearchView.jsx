// src/pages/Department/DepartmentResearch/DepartmentResearchView.jsx

import React, { useEffect, useState } from "react";
import { useDepartment } from "../../../context/DepartmentContext";
import {
	Microscope,
	Wallet,
	Activity,
	HandCoins,
	ArrowRight,
} from "lucide-react";
import GrantRequestsView from "./GrantRequestsView";
import AllocationBreakdownSection from "./components/AllocationBreakdownSection";
import MonthlyExpenseSection from "./components/MonthlyExpenseSection";
import PopularResearchSection from "./components/PopularResearchSection";

/**
 * Specialized card for displaying numeric metrics with an icon.
 */
const MetricCard = ({ label, value, icon }) => (
	<div className="p-5 bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-violet-500/30 transition-all group">
		<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
			{label}
		</p>
		<div className="flex items-center justify-between">
			<h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-violet-600 transition-colors">
				{value}
			</h3>
			<div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-violet-500 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 transition-all">
				{icon}
			</div>
		</div>
	</div>
);

const DepartmentResearchView = () => {
	const { state, actions } = useDepartment();
	const { research } = state;
	const [view, setView] = useState("overview");

	const projects = research?.projects || [];
	const publications = research?.publications || [];
	const grantRequests = research?.grantRequests || [];
	const funding = research?.funding;

	const COLORS = ["#7c3aed", "#a78bfa", "#c4b5fd", "#ddd6fe", "#8b5cf6"];

	useEffect(() => {
			window.scrollTo(0, 0);
		}, [view]);

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
			{view === "overview" ? (
				<>
					{/* Main dashboard header with title and fiscal year context */}
					<div className="flex flex-col md:flex-row justify-between items-start gap-4">
						<div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
								Research & Funding
							</h2>
							<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Fiscal Year {funding?.fiscalYear}
							</p>
						</div>

						<button
							onClick={() => setView("grants")}
							className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 shadow-sm transition-all text-[13px] font-bold w-full sm:w-auto group"
						>
							Grant Requests
							<ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
						</button>
					</div>

					{/* High-level financial and activity metrics */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<MetricCard
							label="Total Budget"
							value={`₹${funding?.summary?.totalBudgetPool?.toLocaleString("en-IN")}`}
							icon={<HandCoins className="size-4" />}
						/>
						<MetricCard
							label="Remaining Balance"
							value={`₹${funding?.summary?.remainingBalance?.toLocaleString("en-IN")}`}
							icon={<Wallet className="size-4" />}
						/>
						<MetricCard
							label="Utilization Rate"
							value={`${funding?.summary?.overallUtilizationRate}%`}
							icon={<Activity className="size-4" />}
						/>
						<MetricCard
							label="Research Works"
							value={projects.length + publications.length}
							icon={<Microscope className="size-4" />}
						/>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
						{/* Budget analytics and categorical breakdown charts */}
						<div className="lg:col-span-2 space-y-6">
							<MonthlyExpenseSection
								data={funding?.monthlyExpenseTrends}
							/>

							<AllocationBreakdownSection
								data={funding?.allocationBreakdown}
								colors={COLORS}
								totalBudget={
									funding?.summary?.totalBudgetPool || ""
								}
							/>
						</div>

						{/* Sidebar section */}
						<PopularResearchSection
							projects={projects}
							publications={publications}
						/>
					</div>
				</>
			) : (
				<GrantRequestsView
					grantRequests={grantRequests}
					funding={funding}
					actions={actions}
					onBack={() => setView("overview")}
				/>
			)}
		</div>
	);
};

export default DepartmentResearchView;
