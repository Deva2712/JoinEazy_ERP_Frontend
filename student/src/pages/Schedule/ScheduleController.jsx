// src/pages/Schedule/ScheduleController.jsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { scheduleService } from "../../api/services/schedule.service";
import { useNotifications } from "../../context/NotificationContext";
import ScheduleUI from "./ScheduleUI";

const ScheduleController = ({ userRole }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [scheduledMeetings, setScheduledMeetings] = useState([]);
	const [meetingRequests, setMeetingRequests] = useState([]);
	const [schedule, setSchedule] = useState(null);
	const [outgoingRequests, setOutgoingRequests] = useState([]);
	const [selectedDateFilter, setSelectedDateFilter] = useState(new Date());

	const { tab } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const { refreshNotifications } = useNotifications();

	const activeTab = tab || "schedule";
	const preFillData = location.state?.preFill;

	/**
	 * Fetches all professor-related schedule data including meetings and requests.
	 */
	const fetchUserData = useCallback(async () => {
		try {
			setLoading(true);
			const response = await scheduleService.getScheduleOverview();
			if (response.success) {
				// SPREAD into new arrays to ensure React detects the change
				setScheduledMeetings([...response.data.scheduledMeetings]);
				setMeetingRequests([...response.data.meetingRequests]);
				setOutgoingRequests([...response.data.outgoingRequests]);
				setSchedule({ ...response.data.schedule });
			}
		} catch (err) {
			setError("Failed to fetch schedule");
		} finally {
			setLoading(false);
		}
	}, [userRole]);

	useEffect(() => {
		fetchUserData();
		document.title = "Schedule & Meetings";
	}, [fetchUserData]);

	// ── Derived Data for UI ──

	const allDisplayMeetings = useMemo(() => {
		return scheduledMeetings || [];
	}, [scheduledMeetings]);

	const dateContext = useMemo(() => {
		if (!selectedDateFilter) return { str: "", day: "" };
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		return {
			toDateString: selectedDateFilter.toDateString(),
			toISOString: selectedDateFilter.toISOString().split("T")[0],
			dayName: days[selectedDateFilter.getDay()],
		};
	}, [selectedDateFilter]);

	const filteredMeetings = useMemo(() => {
		const { toDateString } = dateContext;
		return allDisplayMeetings.filter(
			(m) => new Date(m.startTime).toDateString() === toDateString,
		);
	}, [allDisplayMeetings, dateContext]);

	const filteredTimetable = useMemo(() => {
		if (!schedule?.timetable) return [];
		const { dayName, toISOString } = dateContext;

		return schedule.timetable.filter((slot) => {
			const startDate = slot.startDate || "1970-01-01";
			const endDate = slot.endDate || "9999-12-31";
			return (
				slot.day === dayName &&
				toISOString >= startDate &&
				toISOString <= endDate
			);
		});
	}, [schedule?.timetable, dateContext]);

	const availableCourses = useMemo(() => {
		if (!schedule?.timetable) return [];
		const courseMap = new Map();

		schedule.timetable.forEach((item) => {
			if (!courseMap.has(item.courseName)) {
				courseMap.set(item.courseName, {
					id: `course-${courseMap.size}`,
					courseName: item.courseName,
					courseCodes: new Set(),
				});
			}
			if (item.courseCode) {
				courseMap.get(item.courseName).courseCodes.add(item.courseCode);
			}
		});

		return Array.from(courseMap.values()).map((course) => ({
			...course,
			courseCodes: Array.from(course.courseCodes),
		}));
	}, [schedule?.timetable]);

	// ── Action Handlers ──

	const handleAcceptRequest = async (requestId, details) => {
		try {
			const response = await scheduleService.acceptMeetingRequest(
				requestId,
				details,
			);

			if (response.success) {
				await Promise.all([fetchUserData(), refreshNotifications()]);
			}
		} catch (err) {
			console.error("Error accepting meeting:", err);
		}
	};

	const handleRejectRequest = async (requestId, reason) => {
		const response = await scheduleService.rejectMeetingRequest(
			requestId,
			reason,
		);
		if (response.success)
			await Promise.all([fetchUserData(), refreshNotifications()]);
	};

	const handleRescheduleRequest = async (requestId, payload) => {
		// Pass the payload directly; it already contains newDateTime, mode, venue, etc.
		const response = await scheduleService.rescheduleMeetingRequest(
			requestId,
			payload,
		);

		if (response.success) {
			await Promise.all([fetchUserData(), refreshNotifications()]);
		}
	};

	const handleUpdateSchedule = async (newScheduleData) => {
		const updatedFullSchedule = {
			...schedule,
			...newScheduleData,
			timetable: [
				...(schedule?.timetable || []),
				...(newScheduleData.timetable || []),
			],
		};

		const response =
			await scheduleService.updateSchedule(updatedFullSchedule);
		if (response.success) {
			setSchedule(updatedFullSchedule);
		}
	};

	const handleDeleteOfficeHour = async (courseId) => {
		if (!schedule?.officeHours) return;
		const updatedOfficeHours = schedule.officeHours.filter(
			(oh) => oh.id !== courseId,
		);
		await handleUpdateSchedule({ officeHours: updatedOfficeHours });
	};

	/**
	 * Handles creating a new meeting request initiated by the professor.
	 */
	const handleNewOutgoingRequest = async (requestData) => {
		try {
			const response =
				await scheduleService.createOutgoingRequest(requestData);
			if (response.success) {
				setOutgoingRequests((prev) => [...prev, response.data]);
				await fetchUserData();
				refreshNotifications();
				return true;
			}
		} catch (err) {
			console.error("Error creating outgoing request:", err);
			return false;
		}
	};

	/**
	 * Directly schedules a meeting and adds it to the confirmed meetings list.
	 */
	const handleDirectSchedule = useCallback(
		async (meetingData) => {
			try {
				const response =
					await scheduleService.scheduleMeeting(meetingData);
				if (response.success) {
					// Update local state with the new confirmed meeting
					setScheduledMeetings((prev) => [...prev, response.data]);

					// Refresh global data and notifications
					await Promise.all([
						fetchUserData(),
						refreshNotifications(),
					]);
					return true;
				}
			} catch (err) {
				console.error("Error during direct scheduling:", err);
				return false;
			}
		},
		[fetchUserData, refreshNotifications],
	);

	const handleAddTimetableEvent = useCallback(async (eventData) => {
		try {
			const response = await scheduleService.createEvent(eventData);
			if (response.success) {
				setSchedule((prev) => ({
					...prev,
					timetable: [...(prev.timetable || []), response.data],
				}));
			}
		} catch (err) {
			console.error("Error adding timetable event:", err);
		}
	}, []);

	return (
		<ScheduleUI
			userRole={userRole}
			loading={loading}
			error={error}
			activeTab={activeTab}
			onTabChange={(newTab) => navigate(`/schedule/${newTab}`)}
			onRefresh={fetchUserData}
			meetingRequests={meetingRequests}
			schedule={schedule}
			onAcceptRequest={handleAcceptRequest}
			onRejectRequest={handleRejectRequest}
			onRescheduleRequest={handleRescheduleRequest}
			onUpdateSchedule={handleUpdateSchedule}
			onDeleteOfficeHour={handleDeleteOfficeHour}
			outgoingRequests={outgoingRequests}
			onNewOutgoingRequest={handleNewOutgoingRequest}
			onDirectSchedule={handleDirectSchedule}
			preFillMeeting={preFillData}
			allDisplayMeetings={allDisplayMeetings}
			filteredMeetings={filteredMeetings}
			filteredTimetable={filteredTimetable}
			availableCourses={availableCourses}
			selectedDateFilter={selectedDateFilter}
			setSelectedDateFilter={setSelectedDateFilter}
			onAddEvent={handleAddTimetableEvent}
		/>
	);
};

export default ScheduleController;
