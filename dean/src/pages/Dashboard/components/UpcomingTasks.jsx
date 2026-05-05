// src/pages/Dashboard/components/UpcomingTasks.jsx

import React, { useState, useEffect } from "react";
import { Clock, CheckSquare, Square, Calendar } from "lucide-react";

const UpcomingTasks = ({ tasks: tasksProp = [], onToggleTask }) => {
	const [allTasks, setAllTasks] = useState(tasksProp);
	const [visibleIds, setVisibleIds] = useState([]);
	const [removing, setRemoving] = useState(null);

	/**
	 * Converts 12h time string (e.g. "02:30 PM") to total minutes from start of day
	 * to allow for correct chronological sorting.
	 */
	const getMinutesFromTime = (timeStr) => {
		if (!timeStr || typeof timeStr !== "string") return 0;

		const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
		if (!match) return 0;

		let [, hours, minutes, modifier] = match;
		hours = parseInt(hours, 10);
		minutes = parseInt(minutes, 10);

		if (modifier.toUpperCase() === "PM" && hours < 12) hours += 12;
		if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;

		return hours * 60 + minutes;
	};

	useEffect(() => {
		const sortedTasks = [...tasksProp].sort(
			(a, b) => getMinutesFromTime(a.time) - getMinutesFromTime(b.time),
		);

		setAllTasks(sortedTasks);

		setVisibleIds((prevVisible) => {
			const currentValid = prevVisible.filter((id) =>
				sortedTasks.some((t) => t.id === id && !t.completed),
			);

			const additional = sortedTasks
				.filter((t) => !t.completed && !currentValid.includes(t.id))
				.slice(0, 6 - currentValid.length)
				.map((t) => t.id);

			return [...currentValid, ...additional];
		});
	}, [tasksProp]);

	const toggleTaskCompletion = (taskId) => {
		setRemoving(taskId);

		setTimeout(() => {
			if (onToggleTask) {
				onToggleTask(taskId);
			}

			setVisibleIds((vids) => {
				const currentVisible = vids.filter((id) => id !== taskId);
				const nextTask = allTasks.find(
					(t) =>
						!t.completed &&
						!currentVisible.includes(t.id) &&
						t.id !== taskId,
				);
				return nextTask
					? [...currentVisible, nextTask.id]
					: currentVisible;
			});

			setRemoving(null);
		}, 300);
	};

	const visibleTasks = visibleIds
		.map((id) => allTasks.find((t) => t.id === id))
		.filter(Boolean);

	const totalRemaining = allTasks.filter((t) => !t.completed).length;

	return (
		<div className="mb-8 bg-white dark:bg-[#1a1d26] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
			{/* Header Section */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<div className="relative">
						<div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
						<div className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
							<Clock className="w-5 h-5 text-white" />
						</div>
					</div>
					<div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-gray-200 tracking-tight">
							Upcoming Tasks
						</h3>
						<p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
							Your next priorities
						</p>
					</div>
				</div>
				{totalRemaining > 0 && (
					<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
						</span>
						<span className="text-xs font-bold text-blue-700 dark:text-blue-300">
							{totalRemaining} Active
						</span>
					</div>
				)}
			</div>

			{/* Tasks Grid Display */}
			{visibleTasks.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					{visibleTasks.map((task) => (
						<div
							key={task.id}
							style={{
								transition:
									"all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
								opacity: removing === task.id ? 0 : 1,
								transform:
									removing === task.id
										? "translateX(10px) scale(0.98)"
										: "translateX(0) scale(1)",
							}}
							className="group/item flex items-center gap-4 px-4 py-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300"
						>
							<button
								onClick={() => toggleTaskCompletion(task.id)}
								className="relative flex-shrink-0 group-hover/item:scale-110 transition-transform"
							>
								{removing === task.id ? (
									<CheckSquare className="w-5 h-5 text-green-500" />
								) : (
									<div className="text-gray-400 dark:text-gray-600 group-hover/item:text-blue-500 transition-colors">
										<Square className="w-5 h-5" />
									</div>
								)}
							</button>

							<div className="flex-1 min-w-0">
								<p className="text-sm font-semibold truncate text-gray-800 dark:text-gray-200 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
									{task.title}
								</p>
								<div className="flex items-center gap-2 mt-1">
									<Calendar className="w-3 h-3 text-gray-400" />
									<span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
										{task.date} · {task.time}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				/* Empty State View */
				<div className="flex flex-col items-center justify-center py-8 bg-gray-50/50 dark:bg-white/[0.02] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
					<div className="bg-white dark:bg-[#1a1d26] p-4 rounded-full shadow-sm mb-4">
						<CheckSquare className="w-8 h-8 text-gray-300 dark:text-gray-600" />
					</div>
					<p className="text-sm font-bold text-gray-900 dark:text-gray-200">
						All caught up!
					</p>
					<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
						No pending tasks for today.
					</p>
				</div>
			)}
		</div>
	);
};

export default UpcomingTasks;
