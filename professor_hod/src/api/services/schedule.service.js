// src/api/services/schedule.service.js

import { apiCall } from "../client";

/**
 * Service for professor scheduling and availability management.
 */
export const scheduleService = {
	/**
	 * Gets the professor's full schedule, including confirmed events and pending tasks.
	 */
	getScheduleOverview: () => apiCall("/professor/schedule"),

	/**
	 * Updates the master availability/office hours for the professor.
	 */
	updateSchedule: (scheduleData) =>
		apiCall("/professor/schedule", {
			method: "PUT",
			body: JSON.stringify(scheduleData),
		}),

	/**
	 * Manually creates an event on the professor's calendar.
	 */
	createEvent: (meetingData) =>
		apiCall("/professor/schedule/meetings", {
			method: "POST",
			body: JSON.stringify(meetingData),
		}),

	/**
	 * Directly schedules a meeting and adds it to the confirmed meetings list.
	 */
	scheduleMeeting: (meetingData) =>
		apiCall("/professor/schedule/meetings/direct", {
			method: "POST",
			body: JSON.stringify(meetingData),
		}),

	/**
	 * Sends a new meeting request to another user.
	 */
	createOutgoingRequest: (requestData) =>
		apiCall("/professor/schedule/requests/outgoing", {
			method: "POST",
			body: JSON.stringify(requestData),
		}),

	/**
	 * Approves a student request and provides logistics (venue or meeting link).
	 */
	acceptMeetingRequest: (requestId, details) =>
		apiCall(`/professor/schedule/meetings/${requestId}/accept`, {
			method: "POST",
			body: JSON.stringify(details),
		}),

	/**
	 * Denies a meeting request with a provided explanation.
	 */
	rejectMeetingRequest: (requestId, reason) =>
		apiCall(`/professor/schedule/meetings/${requestId}/reject`, {
			method: "POST",
			body: JSON.stringify({ reason }),
		}),

	/**
	 * Suggests an alternative time for a requested meeting.
	 */
	rescheduleMeetingRequest: (requestId, payload) =>
		apiCall(`/professor/schedule/meetings/${requestId}/reschedule`, {
			method: "POST",
			body: JSON.stringify(payload),
		}),
};
