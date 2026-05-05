// src/api/services/mentoring.service.js

import { apiCall } from "../client";

/**
 * Service for faculty-student mentoring and advisory sessions.
 */
export const mentoringService = {
	/**
	 * Fetches the list of students assigned to the authenticated faculty member.
	 */
	getAssignedMentees: () => apiCall("/mentoring/mentor/students"),

	/**
	 * Logs student attendance for a specific mentoring appointment.
	 * @param {string|number} id - The meeting ID.
	 * @param {Object} attendanceData - Status and timestamp information.
	 */
	updateMeetingAttendance: (id, attendanceData) =>
		apiCall(`/mentoring/meetings/attendance/${id}`, {
			method: "POST",
			body: JSON.stringify(attendanceData),
		}),

	/**
	 * Finalizes a session by submitting discussion summaries and action items.
	 */
	submitMeetingNotes: (id, feedbackData) =>
		apiCall(`/mentoring/meetings/complete/${id}`, {
			method: "POST",
			body: JSON.stringify(feedbackData),
		}),
};
