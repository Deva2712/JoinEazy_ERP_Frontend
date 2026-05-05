// src/pages/Schedule/views/TodayScheduleView.jsx

import React, { useState, useMemo } from "react";
import { Calendar, Plus, Import } from "lucide-react";
import { formatTo12Hour } from "../utils";
import MiniCalendar from "../../../components/common/MiniCalendar";
import TimetableCard from "../components/TimetableCard";
import AddEventCard from "../components/AddEventCard";

const TodayScheduleView = ({
	schedule,
	handleDateClick,
	allDisplayMeetings,
	selectedDateFilter,
	filteredTimetable,
	filteredMeetings,
	setShowImportModal,
	onAddEvent,
}) => {
	const [isAddingEvent, setIsAddingEvent] = useState(false);
	const [newEventData, setNewEventData] = useState({
		title: "",
		startTime: "10:00",
		endTime: "11:00",
		location: "",
	});

	const todayStr = useMemo(() => new Date().toLocaleDateString("en-US"), []);

	const selectedDateStr = useMemo(() => {
		if (selectedDateFilter instanceof Date) {
			return selectedDateFilter.toLocaleDateString("en-US");
		}
		return selectedDateFilter || todayStr;
	}, [selectedDateFilter, todayStr]);

	/**
	 * Normalizes various time formats (12h string or ISO date) into total minutes
	 * from midnight for numerical sorting.
	 */
	const parseTimeToMinutes = (timeValue) => {
		if (!timeValue) return 0;

		// Handle ISO strings from meetings (e.g., 2026-04-09T09:00:00Z)
		if (timeValue.includes("T")) {
			const date = new Date(timeValue);
			return date.getHours() * 60 + date.getMinutes();
		}

		// Handle 12-hour strings (e.g., "9:00 AM", "12:30 PM")
		const match = timeValue.match(/(\d+):(\d+)\s*(AM|PM)/i);
		if (!match) return 0;

		let [, hours, minutes, modifier] = match;
		hours = parseInt(hours, 10);
		minutes = parseInt(minutes, 10);

		if (modifier.toUpperCase() === "PM" && hours < 12) hours += 12;
		if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;

		return hours * 60 + minutes;
	};

	/**
	 * Merges and sorts both classes and meetings into a single chronological timeline.
	 */
	const sortedUnifiedSchedule = useMemo(() => {
		const classes = (filteredTimetable || []).map((item) => ({
			...item,
			renderType: item.courseCode === "EVENT" ? "event" : "class",
			sortMinutes: parseTimeToMinutes(item.startTime),
		}));

		const meetings = (filteredMeetings || []).map((m) => ({
			renderType: "meeting",
			sortMinutes: parseTimeToMinutes(m.startTime),
			slot: {
				courseCode: "MEETING",
				courseName: m.participantName || "Meeting",
				batchSection: m.subject || "Academic",
				roomNumber: m.location || "Online",
				startTime: new Date(m.startTime).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				endTime: "",
			},
		}));

		return [...classes, ...meetings].sort(
			(a, b) => a.sortMinutes - b.sortMinutes,
		);
	}, [filteredTimetable, filteredMeetings]);

	const totalItemsCount = sortedUnifiedSchedule.length;

	// Generates markers for the MiniCalendar
	const calendarMarkers = useMemo(() => {
		const markersMap = new Map();
		const todayISO = new Date().toLocaleDateString("en-CA");

		allDisplayMeetings?.forEach((m) => {
			const dateValue = m.startTime || m.dateTime || m.requestedTime;
			if (dateValue) {
				const dateStr = dateValue.split("T")[0];
				markersMap.set(dateStr, {
					date: dateStr,
					dotColor: "bg-rose-500",
					className:
						"bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
				});
			}
		});

		schedule?.timetable?.forEach((slot) => {
			if (slot.startDate && slot.endDate && slot.day) {
				const start = new Date(slot.startDate + "T00:00:00");
				const end = new Date(slot.endDate + "T00:00:00");
				
				let current = new Date(start);
				const days = [
					"Sunday",
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
				];

				while (days[current.getDay()] !== slot.day && current <= end) {
					current.setDate(current.getDate() + 1);
				}

				while (current <= end) {
					const dateStr = current.toLocaleDateString("en-CA");
					if (!markersMap.has(dateStr)) {
						markersMap.set(dateStr, {
							date: dateStr,
							className:
								"bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
						});
					}
					current.setDate(current.getDate() + 7);
				}
			}
		});

		const existingToday = markersMap.get(todayISO);
		markersMap.set(todayISO, {
			...(existingToday || { date: todayISO }),
			className:
				"bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 font-bold",
		});

		return Array.from(markersMap.values());
	}, [schedule?.timetable, allDisplayMeetings]);

	const onFormSubmit = () => {
		if (newEventData.title && selectedDateFilter) {
			const days = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];
			const selectedDate = new Date(selectedDateFilter);
			const dateStr = selectedDate.toISOString().split("T")[0];

			onAddEvent({
				courseName: newEventData.title,
				startTime: formatTo12Hour(newEventData.startTime),
				endTime: formatTo12Hour(newEventData.endTime),
				roomNumber: newEventData.location,
				day: days[selectedDate.getDay()],
				startDate: dateStr,
				endDate: dateStr,
				courseCode: "EVENT",
			});

			setNewEventData({
				title: "",
				startTime: "10:00",
				endTime: "11:00",
				location: "",
			});
			setIsAddingEvent(false);
		}
	};

	return (
		<div className="px-4 sm:px-0">
			{/* Header with Import and Add Actions */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
				<div>
					<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
						Today's Schedule
					</h3>
					<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
						Your daily academic commitments.
					</p>
				</div>
				<div className="flex gap-3">
					<button
						onClick={() => setShowImportModal(true)}
						className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 shadow-sm transition-all text-sm font-bold w-full sm:w-auto"
					>
						<Import className="w-4 h-4" />
						Import Schedule
					</button>
					{!isAddingEvent && (
						<button
							onClick={() => setIsAddingEvent(true)}
							className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-sm transition-all text-sm font-bold w-full sm:w-auto"
						>
							<Plus className="w-4 h-4" />
							Add Event
						</button>
					)}
				</div>
			</div>

			<div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
				{/* Main Column: Date header, Add Event form, and the list of Timetable/Meeting cards */}
				<div className="lg:col-span-8 order-1 lg:order-2 space-y-4">
					<div className="flex items-center justify-between mb-2 px-1">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4 text-rose-500" />
							<h4 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">
								{new Date(selectedDateStr).toLocaleDateString(
									"en-US",
									{
										weekday: "long",
										month: "long",
										day: "numeric",
										year: "numeric",
									},
								)}
							</h4>
							<span className="flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-full border border-rose-200 dark:border-rose-800">
								{totalItemsCount}
							</span>
						</div>
					</div>

					{selectedDateFilter && isAddingEvent && (
						<AddEventCard
							newEventData={newEventData}
							setNewEventData={setNewEventData}
							selectedDateStr={selectedDateStr}
							onClose={() => setIsAddingEvent(false)}
							onConfirm={onFormSubmit}
						/>
					)}

					{sortedUnifiedSchedule.length > 0 ? (
						<div className="space-y-4">
							{sortedUnifiedSchedule.map((item, i) => (
								<TimetableCard
									key={item.id || i}
									slot={item.slot || item}
									variant={item.renderType}
								/>
							))}
						</div>
					) : (
						!isAddingEvent && (
							<div className="text-center py-16 md:py-20 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
								<div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
									<Calendar className="w-8 h-8 text-gray-300 dark:text-gray-600" />
								</div>
								<h4 className="text-gray-900 dark:text-white font-bold">
									Free Day!
								</h4>
								<p className="text-gray-500 text-sm mt-1">
									No classes or confirmed meetings on this
									date.
								</p>
							</div>
						)
					)}
				</div>

				<div className="lg:col-span-4 order-2 lg:order-1">
					<MiniCalendar
						onDateClick={(date) => handleDateClick(new Date(date))}
						selectedDate={new Date(
							selectedDateStr,
						).toLocaleDateString("en-CA")}
						customMarkers={calendarMarkers}
						selectedDateColor="bg-rose-600"
					/>
				</div>
			</div>
		</div>
	);
};

export default TodayScheduleView;
