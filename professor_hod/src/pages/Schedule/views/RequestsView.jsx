// src/pages/Schedule/views/RequestsView.jsx

import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Inbox, Send, Search, ArrowLeft, History } from "lucide-react";
import MeetingCard from "../components/MeetingCard";

const RequestsView = ({
	meetingRequests = [],
	outgoingRequests = [],
	handleAccept,
	handleReschedule,
	handleReject,
}) => {
	const location = useLocation();
	const [viewMode, setViewMode] = useState("incoming");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedId, setSelectedId] = useState(null);

	// Handle deep-linking from other views (like StudentDetails)
	useEffect(() => {
		if (location.state?.selectedRequestId) {
			setSelectedId(location.state.selectedRequestId);
			if (location.state.viewMode) {
				setViewMode(location.state.viewMode);
			}
		}
	}, [location.state]);

	const filteredData = useMemo(() => {
		const list =
			viewMode === "incoming" ? meetingRequests : outgoingRequests;

		const pendingList = list.filter(
			(item) =>
				item.status?.toLowerCase() !== "accepted" &&
				item.status?.toLowerCase() !== "scheduled",
		);

		if (!searchQuery) return pendingList;

		const q = searchQuery.toLowerCase();
		return pendingList.filter(
			(item) =>
				item.participantName?.toLowerCase().includes(q) ||
				item.subject?.toLowerCase().includes(q),
		);
	}, [meetingRequests, outgoingRequests, viewMode, searchQuery]);

	const selectedRequest = useMemo(() => {
		const allPotential = [...meetingRequests, ...outgoingRequests];
		return allPotential.find(
			(r) => r.id === selectedId || r.meetingId === selectedId,
		);
	}, [meetingRequests, outgoingRequests, selectedId]);

	return (
		<div className="flex flex-col gap-6">
			{/* UI section for the search and toggle statement */}
			<div
				className={`flex flex-col md:flex-row gap-4 ${selectedId ? "hidden lg:flex" : "flex"}`}
			>
				<div className="relative group flex-1">
					<Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-600 transition-colors" />
					<input
						type="text"
						placeholder={`Search ${viewMode === "incoming" ? "received" : "sent"} requests...`}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-rose-600 transition-all"
					/>
				</div>

				<div className="flex w-full md:w-auto p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
					<button
						onClick={() => {
							setViewMode("incoming");
							setSelectedId(null);
						}}
						className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "incoming" ? "bg-rose-600 text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:text-rose-700 dark:hover:text-rose-500"}`}
					>
						<Inbox className="size-4" /> <span>Received</span>
					</button>
					<button
						onClick={() => {
							setViewMode("outgoing");
							setSelectedId(null);
						}}
						className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "outgoing" ? "bg-rose-600 text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:text-rose-700 dark:hover:text-rose-500"}`}
					>
						<Send className="size-4" /> <span>Sent</span>
					</button>
				</div>
			</div>

			<main
				className={`flex flex-col ${selectedId ? "lg:flex-row gap-8" : "gap-4"}`}
			>
				<div
					className={`${
						selectedId
							? "hidden lg:block lg:w-[380px] shrink-0 max-h-[85vh] overflow-y-auto px-4 -mx-4 custom-scrollbar relative"
							: "w-full"
					}`}
				>
					{/* View Header section */}
					<div
						className={`${selectedId ? "sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 py-3 mb-2" : "flex items-center gap-3 mb-5"}`}
					>
						<div className="flex items-center gap-3">
							{viewMode === "incoming" ? (
								<Inbox className="size-5 text-rose-600" />
							) : (
								<Send className="size-5 text-rose-600" />
							)}
							<h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
								{viewMode === "incoming" ? "Received" : "Sent"}{" "}
								Requests ({filteredData.length})
							</h2>
						</div>
					</div>

					{filteredData.length > 0 ? (
						<div
							className={
								selectedId
									? "flex flex-col gap-4 pb-4"
									: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
							}
						>
							{filteredData.map((req) => (
								<div
									key={req.id || req.meetingId}
									className="p-0.5"
								>
									<MeetingCard
										meeting={req}
										isExpanded={false}
										isSelected={
											selectedId === req.id ||
											selectedId === req.meetingId
										}
										onClick={() =>
											setSelectedId(
												req.id || req.meetingId,
											)
										}
									/>
								</div>
							))}
						</div>
					) : (
						<div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl p-12 text-center">
							<History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
							<p className="text-sm text-gray-400 italic">
								No {viewMode} requests found.
							</p>
						</div>
					)}
				</div>

				{selectedRequest && (
					<div className="flex-1 sticky top-20 self-start animate-in fade-in slide-in-from-bottom-2 duration-300">
						<button
							onClick={() => setSelectedId(null)}
							className="inline-flex items-center gap-2.5 py-2 text-gray-600 dark:text-gray-400 hover:text-rose-700 font-bold transition-all group rounded-full"
						>
							<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-rose-200 group-hover:shadow-sm transition-all">
								<ArrowLeft className="size-4" />
							</div>
							<span className="text-xs uppercase tracking-widest">
								Return
							</span>
						</button>
						<MeetingCard
							meeting={selectedRequest}
							isExpanded={true}
							isIncoming={viewMode === "incoming"}
							onAccept={(r) => handleAccept(r)}
							onReject={(r) => handleReject(r)}
							onReschedule={(r) => handleReschedule(r)}
						/>
					</div>
				)}
			</main>
		</div>
	);
};

export default RequestsView;
