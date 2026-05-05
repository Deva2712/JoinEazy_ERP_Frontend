// src/pages/Schedule/views/MeetingsHistoryView.jsx

import React from "react";
import { History, Search, ArrowLeft } from "lucide-react";
import MeetingCard from "../components/MeetingCard";

const MeetingsHistoryView = ({
	historyMeetings,
	selectedMeetingId,
	setSelectedMeetingId,
	searchQuery,
	setSearchQuery,
	selectedMeeting,
}) => {
	return (
		<div className="flex flex-col gap-6">
			{/* Search Bar Section */}
			<div
				className={`flex flex-col md:flex-row gap-4 ${selectedMeetingId ? "hidden lg:flex" : "flex"}`}
			>
				<div className="relative group flex-1">
					<Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
					<input
						type="text"
						placeholder="Search past meetings..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-rose-500 transition-all"
					/>
				</div>
			</div>

			<div
				className={`flex flex-col ${selectedMeetingId ? "lg:flex-row gap-8" : "gap-4"}`}
			>
				{/* History List Sidebar/Grid */}
				<div
					className={`${
						selectedMeetingId
							? "hidden lg:block lg:w-[380px] shrink-0 max-h-[70vh] overflow-y-auto pt-2 px-2 -mx-2 custom-scrollbar"
							: "w-full"
					}`}
				>
					<div className="flex items-center justify-between px-1 mb-6">
						<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
							Past Meetings
						</h3>
					</div>

					{historyMeetings.length > 0 ? (
						<div
							className={
								selectedMeetingId
									? "flex flex-col gap-4"
									: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
							}
						>
							{historyMeetings.map((m, idx) => (
								<MeetingCard
									key={m.id || idx}
									meeting={m}
									isExpanded={false}
									showShadow={!selectedMeetingId}
									isSelected={
										selectedMeetingId === (m.id || idx)
									}
									onClick={() =>
										setSelectedMeetingId(m.id || idx)
									}
								/>
							))}
						</div>
					) : (
						<div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
							<History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500">
								No meeting history found.
							</p>
						</div>
					)}
				</div>

				{/* Expanded History Detail View */}
				{selectedMeeting && (
					<div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<button
							onClick={() => setSelectedMeetingId(null)}
							className="inline-flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400 hover:text-rose-600 font-bold transition-all"
						>
							<div className="size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center">
								<ArrowLeft className="size-4" />
							</div>
							<span className="text-xs uppercase tracking-widest">
								Return
							</span>
						</button>
						<MeetingCard
							meeting={selectedMeeting}
							isExpanded={true}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default MeetingsHistoryView;
