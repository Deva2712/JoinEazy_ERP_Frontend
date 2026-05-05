// src/pages/Schedule/components/AddEventCard.jsx

import React from "react";
import { X, Plus, BookOpen, Clock, MapPin } from "lucide-react";

const AddEventCard = ({
	newEventData,
	setNewEventData,
	onClose,
	onConfirm,
	selectedDateStr,
}) => {
	const isDisabled =
		!newEventData.title || !newEventData.startTime || !newEventData.endTime;

	return (
		<div className="bg-white dark:bg-[#1a1d26] border border-gray-200/60 dark:border-gray-800 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-200">
			{/* Section Header */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<h4 className="font-black text-sm text-rose-600 uppercase tracking-wider">
						New Event
					</h4>
					<p className="text-[10px] text-gray-500 font-medium">
						{new Date(selectedDateStr).toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						})}
					</p>
				</div>
				<div className="flex gap-2">
					<button
						onClick={onClose}
						className="h-10 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
					>
						<X className="w-4 h-4 stroke-[3]" />
					</button>
                    {!isDisabled && (
					<button
						onClick={onConfirm}
						disabled={isDisabled}
						className="h-10 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 text-white rounded-xl transition-all active:scale-95 shadow-lg dark:shadow-none flex items-center justify-center"
					>
						<Plus className="w-4 h-4 stroke-[3]" />
					</button>
                    )}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* Subject/Title Input */}
				<div className="md:col-span-2 space-y-2">
					<label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
						<BookOpen className="size-3" /> Subject
					</label>
					<input
						type="text"
						placeholder="e.g. Research Sync"
						value={newEventData.title}
						onChange={(e) =>
							setNewEventData({
								...newEventData,
								title: e.target.value,
							})
						}
						className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-sm outline-none transition-all focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
					/>
				</div>

				{/* Location Input */}
				<div className="md:col-span-2 space-y-2">
					<label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
						<MapPin className="size-3" /> Location / Room
					</label>
					<input
						type="text"
						placeholder="e.g. Lab 402 or Zoom"
						value={newEventData.location}
						onChange={(e) =>
							setNewEventData({
								...newEventData,
								location: e.target.value,
							})
						}
						className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-sm outline-none transition-all focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
					/>
				</div>

				{/* Time Inputs */}
				<div className="space-y-2">
					<label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
						<Clock className="size-3" /> Start Time
					</label>
					<input
						type="time"
						value={newEventData.startTime}
						onChange={(e) =>
							setNewEventData({
								...newEventData,
								startTime: e.target.value,
							})
						}
						className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-sm outline-none focus:border-rose-500 transition-all"
					/>
				</div>
				<div className="space-y-2">
					<label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
						<Clock className="size-3" /> End Time
					</label>
					<input
						type="time"
						value={newEventData.endTime}
						onChange={(e) =>
							setNewEventData({
								...newEventData,
								endTime: e.target.value,
							})
						}
						className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-sm outline-none focus:border-rose-500 transition-all"
					/>
				</div>
			</div>
		</div>
	);
};

export default AddEventCard;