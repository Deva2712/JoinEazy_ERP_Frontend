// src/pages/Department/DepartmentResearch/GrantRequestsView.jsx

import React, { useState, useMemo } from "react";
import { ArrowLeft, Search, Inbox, History } from "lucide-react";
import GrantRequestsSidebar from "./components/GrantRequestsSidebar";
import GrantRequestCard from "./components/GrantRequestCard";

const FilterSelector = ({ activeFilter, onFilterChange, className = "" }) => (
	<div className={className}>
		<label className="hidden md:block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
			Request Status
		</label>
		<div className="flex w-full p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
			<button
				onClick={() => onFilterChange("Pending")}
				className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
					activeFilter === "Pending"
						? "bg-violet-600 text-white shadow-md"
						: "text-gray-500 dark:text-gray-400"
				}`}
			>
				<Inbox className="size-4" />
				<span>Pending</span>
			</button>
			<button
				onClick={() => onFilterChange("History")}
				className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
					activeFilter === "History"
						? "bg-violet-600 text-white shadow-md"
						: "text-gray-500 dark:text-gray-400"
				}`}
			>
				<History className="size-4" />
				<span>History</span>
			</button>
		</div>
	</div>
);

const GrantRequestsView = ({ grantRequests, funding, actions, onBack }) => {
	const [updatingId, setUpdatingId] = useState(null);
	const [filter, setFilter] = useState("Pending");

	const filteredRequests = useMemo(() => {
		return grantRequests.filter((r) => {
			if (filter === "Pending") {
				return r.status === "Pending" || r.status === "Resubmitted";
			}
			return r.status === "Approved" || r.status === "Rejected";
		});
	}, [grantRequests, filter]);

	const handleStatusUpdate = async (requestId, status, adminComments) => {
		setUpdatingId(requestId);
		const result = await actions.updateGrantStatus({
			requestId,
			status,
			adminComments,
		});

		if (!result.success) {
			console.error(result.message || "Failed to update grant status.");
		}
		setUpdatingId(null);
	};

	return (
		<div className="relative pb-24 lg:pb-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<div className="lg:col-span-3 space-y-4">
					{/* Navigation Header */}
					<div className="flex items-center gap-3">
						<button
							onClick={onBack}
							className="flex items-center justify-center size-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-violet-200 transition-all"
						>
							<ArrowLeft className="size-4" />
						</button>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
							{filter === "Pending"
								? "Grant Requests"
								: "Request History"}
						</h2>
					</div>
					<FilterSelector
						activeFilter={filter}
						onFilterChange={setFilter}
						className="lg:hidden"
					/>

					<div className="lg:hidden">
						<GrantRequestsSidebar
							grantData={funding.grantPipeline}
						/>
					</div>

					<div className="space-y-4">
						{filteredRequests.length > 0 ? (
							filteredRequests.map((request) => (
								<GrantRequestCard
									key={request.requestId}
									request={request}
									filter={filter}
									updatingId={updatingId}
									onUpdateStatus={handleStatusUpdate}
								/>
							))
						) : (
							<div className="py-20 flex flex-col items-center justify-center bg-white dark:bg-[#1a1d26] border border-gray-100 dark:border-gray-800 rounded-[40px]">
								<Search className="size-10 text-gray-200 mb-4" />
								<h3 className="text-lg font-bold text-gray-900 dark:text-white">
									No requests found
								</h3>
								<p className="text-gray-500 text-sm">
									There are no {filter.toLowerCase()} requests
									at this time.
								</p>
							</div>
						)}
					</div>
				</div>

				<aside className="hidden lg:block lg:sticky lg:top-8 space-y-6 h-fit">
					<FilterSelector
						activeFilter={filter}
						onFilterChange={setFilter}
					/>
					<GrantRequestsSidebar grantData={funding.grantPipeline} />
				</aside>
			</div>
		</div>
	);
};

export default GrantRequestsView;
