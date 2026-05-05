// src/components/common/MiniCalendar.jsx

import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MiniCalendar = ({
	onDateClick,
	onMonthChange,
	selectedDate,
	viewOnly = false,
	disbaleFuture = false,
	minDate = null,
	customMarkers = [],
	selectedDateColor = "bg-blue-600",
	restrictToMonth = null,
}) => {
	
	const [currentDate, setCurrentDate] = useState(restrictToMonth || new Date());
	const todayStr = new Date().toLocaleDateString("en-CA");

	useEffect(() => {
		if (restrictToMonth) setCurrentDate(restrictToMonth);
	}, [restrictToMonth]);

	useEffect(() => {
		if (onMonthChange) onMonthChange(currentDate);
	}, [currentDate, onMonthChange]);

	const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

	const daysInMonth = getDaysInMonth(currentDate);
	const firstDay = getFirstDayOfMonth(currentDate);
	const days = [];

	for (let i = 0; i < firstDay; i++) days.push(null);
	for (let i = 1; i <= daysInMonth; i++) days.push(i);

	const monthYear = currentDate.toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});

	const isPrevDisabled = useMemo(() => {
		if (!minDate) return false;
		const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
		const limitMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
		return prevMonth < limitMonth;
	}, [currentDate, minDate]);

	const goToPreviousMonth = () => {
		if (isPrevDisabled) return;
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
	};
		
	const goToNextMonth = () =>
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

	return (
		<div className="bg-white dark:bg-[#1a1d26] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm h-fit">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
					{monthYear}
				</h3>
				{!restrictToMonth && (
					<div className="flex gap-2">
						<button
							onClick={goToPreviousMonth}
							disabled={isPrevDisabled}
							className={`p-2 rounded-lg transition-colors border border-gray-100 dark:border-gray-700 ${
								isPrevDisabled 
								? "opacity-30 cursor-not-allowed" 
								: "hover:bg-gray-100 dark:hover:bg-gray-700"
							}`}
						>
							<ChevronLeft className="size-4 text-gray-600 dark:text-gray-400" />
						</button>
						<button
							onClick={goToNextMonth}
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-100 dark:border-gray-700"
						>
							<ChevronRight className="size-4 text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				)}
			</div>

			<div className="grid grid-cols-7 gap-1 mb-2 text-center">
				{["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
					<div key={idx} className="text-xs font-bold text-gray-400 py-1">{day}</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-1">
				{days.map((day, index) => {
					if (!day) return <div key={index} />;
					const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
					const dateStr = dateObj.toLocaleDateString("en-CA");

					const isFuture = dateStr > todayStr;
					const isSelected = selectedDate === dateStr;
					const marker = customMarkers.find((m) => m.date === dateStr);
					let colorClasses = "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400";
					
                    if (disbaleFuture && isFuture) {
						colorClasses = "text-gray-300 dark:text-gray-700 cursor-default";
					} else if (isSelected) {
						colorClasses = `${selectedDateColor} text-white shadow-md scale-105 z-10`;
					} else if (marker?.className) {
						colorClasses = marker.className;
					}
					const isDisabled = disbaleFuture && isFuture;
					return (
						<div
							key={index}
							className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-bold transition-all relative ${colorClasses} ${!viewOnly && !isDisabled ? "cursor-pointer" : "cursor-default"}`}
							onClick={() => !viewOnly && !isDisabled && onDateClick?.(dateStr)}
						>
							{day}
							{marker?.dotColor && (!isSelected || viewOnly) && (
								<span className={`absolute bottom-1.5 size-1 rounded-full ${marker.dotColor}`} />
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default MiniCalendar;