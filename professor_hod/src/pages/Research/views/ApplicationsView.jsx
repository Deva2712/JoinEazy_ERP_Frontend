// src/pages/Research/views/ApplicationsView.jsx

import React, { useMemo, useState } from "react";
import { Send, Search, Inbox, ArrowLeft } from "lucide-react";
import ApplicationCard from "../components/ApplicationCard";

const ApplicationsView = ({
	applicationLists,
	searchQuery,
	onSearchChange,
	onApplicationAction,
	onViewUser,
}) => {
	const [view, setView] = React.useState("received");
	const [selectedId, setSelectedId] = useState(null);

	// Context now handles filtering/sorting; we just pick the active list
	const processedApplications = applicationLists[view] || [];

	const selectedApp = useMemo(
		() => processedApplications.find((app) => app.id === selectedId),
		[processedApplications, selectedId],
	);

	const handleActionWithAutoNext = async (appId, status, feedback) => {
		const currentIndex = processedApplications.findIndex(
			(a) => a.id === appId,
		);

		await onApplicationAction(appId, status, feedback);

		if (currentIndex !== -1) {
			const nextApp = processedApplications[currentIndex + 1];
			setSelectedId(nextApp ? nextApp.id : null);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			{/* UI section for the search and toggle statement */}
			<div
				className={`flex flex-col md:flex-row gap-4 ${selectedId ? "hidden lg:flex" : "flex"}`}
			>
				<div className="relative group flex-1">
					<Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
					<input
						type="text"
						placeholder={`Search ${view} applications...`}
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 transition-all"
					/>
				</div>

				<div className="flex w-full md:w-auto p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
					<button
						onClick={() => {
							setView("received");
							setSelectedId(null);
						}}
						className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === "received" ? "bg-emerald-600 text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-500"}`}
					>
						<Inbox className="size-4" /> <span>Received</span>
					</button>
					<button
						onClick={() => {
							setView("sent");
							setSelectedId(null);
						}}
						className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === "sent" ? "bg-emerald-600 text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-500"}`}
					>
						<Send className="size-4" /> <span>Sent</span>
					</button>
				</div>
			</div>

			<main
				className={`flex flex-col ${selectedId ? "lg:flex-row gap-8" : "gap-4"}`}
			>
				<div
					className={`
					${selectedId ? "hidden lg:block lg:w-[380px] shrink-0 max-h-[85vh] overflow-y-auto px-4 -mx-4 custom-scrollbar relative" : "w-full"}
				`}
				>
					{/* View Header section */}
					<div
						className={`${selectedId ? "sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 py-3 mb-2" : "flex items-center gap-3 mb-5"}`}
					>
						<div className="flex items-center gap-3">
							{view === "received" ? (
								<Inbox className="size-5 text-emerald-700" />
							) : (
								<Send className="size-5 text-emerald-700" />
							)}
							<h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
								{view} Applications
							</h2>
						</div>
					</div>

					{processedApplications.length > 0 ? (
						<div
							className={
								selectedId
									? "flex flex-col gap-4 pb-4"
									: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
							}
						>
							{processedApplications.map((app) => (
								<div key={app.id} className="p-0.5">
									<ApplicationCard
										applicant={app}
										onAction={handleActionWithAutoNext}
										onViewUser={onViewUser}
										isSentApplication={view === "sent"}
										isExpanded={false}
										isSelected={selectedId === app.id}
										onClick={() => setSelectedId(app.id)}
									/>
								</div>
							))}
						</div>
					) : (
						<div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl p-12 text-center">
							<p className="text-sm text-gray-400 italic">
								No {view} applications found.
							</p>
						</div>
					)}
				</div>

				{selectedApp && (
					<div className="flex-1 sticky top-20 self-start animate-in fade-in slide-in-from-bottom-2 duration-300">
						<button
							onClick={() => setSelectedId(null)}
							className="inline-flex items-center gap-2.5 py-2 text-gray-600 dark:text-gray-400 hover:text-emerald-700 font-bold transition-all group rounded-full"
						>
							<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-emerald-200 group-hover:shadow-sm transition-all">
								<ArrowLeft className="size-4" />
							</div>
							<span className="text-xs uppercase tracking-widest">
								Return
							</span>
						</button>
						<ApplicationCard
							applicant={selectedApp}
							onAction={handleActionWithAutoNext}
							onViewUser={onViewUser}
							isSentApplication={view === "sent"}
							isExpanded={true}
						/>
					</div>
				)}
			</main>
		</div>
	);
};

export default ApplicationsView;
