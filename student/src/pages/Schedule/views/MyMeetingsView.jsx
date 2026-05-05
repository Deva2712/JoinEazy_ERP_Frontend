// src/pages/Schedule/views/MyMeetingsView.jsx

import React from "react";
import { Search, ArrowLeft, Plus, Send } from "lucide-react";
import MeetingCard from "../components/MeetingCard";

const MyMeetingsView = ({
	processedMeetings,
	selectedMeetingId,
	setSelectedMeetingId,
	searchQuery,
	setSearchQuery,
	selectedMeeting,
	handleReschedule,
	onOpenScheduleModal,
	onOpenRequestModal,
}) => {
	return (
		<div className="flex flex-col gap-6">
			{/* ── Search & Actions Bar ── */}
			<div
				className={`flex flex-col gap-3 ${selectedMeetingId ? "hidden lg:flex" : "flex"}`}
			>
				<div className="flex flex-col sm:flex-row items-center gap-3">
					{/* Search Input Container */}
					<div className="relative group w-full flex-1">
						<Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
						<input
							type="text"
							placeholder="Search meetings..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm outline-none focus:border-rose-500 transition-all"
						/>
					</div>

					{/* Action Buttons Group */}
					<div className="flex items-center gap-3 w-full sm:w-auto">
						<button
							onClick={onOpenRequestModal}
							className="flex flex-1 sm:flex-none items-center justify-center gap-3 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-sm transition-all hover:border-rose-500/50 active:scale-95 shadow-sm"
						>
							<Send className="size-4 text-rose-500" />
							<span className="text-gray-900 dark:text-white">
								Request
							</span>
						</button>

						<button
							onClick={onOpenScheduleModal}
							className="flex flex-1 sm:flex-none items-center justify-center gap-3 px-5 py-3 rounded-xl border font-bold text-sm transition-all active:scale-95 shadow-sm bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white border-none"
						>
							<Plus className="size-5" />
							<span className="whitespace-nowrap">Schedule</span>
						</button>
					</div>
				</div>
			</div>

			<div
				className={`flex flex-col ${selectedMeetingId ? "lg:flex-row gap-8" : "gap-4"}`}
			>
				{/* Meetings List Sidebar/Grid */}
				<div
					className={`${
						selectedMeetingId
							? "hidden lg:block lg:w-[380px] shrink-0 max-h-[70vh] overflow-y-auto pt-2 px-2 -mx-2 custom-scrollbar"
							: "w-full"
					}`}
				>
					<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
						Upcoming Meetings
					</h3>

					{processedMeetings.length > 0 ? (
						<div
							className={
								selectedMeetingId
									? "flex flex-col gap-4"
									: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
							}
						>
							{processedMeetings.map((m, idx) => (
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
							<p className="text-gray-500">
								No upcoming meetings found.
							</p>
						</div>
					)}
				</div>

				{/* Expanded Meeting Detail View */}
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
							onReschedule={handleReschedule}
							isExpanded={true}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default MyMeetingsView;
