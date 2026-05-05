// src/api/services/meeting.service.js

import { apiCall } from "../client";

/**
 * Service for student-facing meeting interactions.
 * Replaces studentMeetingsAPI from api.js
 */
export const meetingService = {
	/**
	 * Retrieves all meeting requests submitted by the student for a cohort.
	 */
	getMeetingRequests: (cohortId) =>
		apiCall(`/cohort/${cohortId}/student/meeting-requests`),

	/**
	 * Retrieves meetings that have been confirmed by the professor.
	 */
	getAcceptedMeetings: (cohortId) =>
		apiCall(`/cohort/${cohortId}/student/meetings`),

	/**
	 * Submits a new request for a meeting or office hour slot.
	 */
	createMeetingRequest: (cohortId, meetingData) =>
		apiCall(`/cohort/${cohortId}/student/meeting-requests`, {
			method: "POST",
			body: JSON.stringify(meetingData),
		}),

	/**
	 * Withdraws a pending meeting request.
	 */
	cancelMeetingRequest: (cohortId, requestId) =>
		apiCall(`/cohort/${cohortId}/student/meeting-requests/${requestId}`, {
			method: "DELETE",
		}),
};
