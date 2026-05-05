// src/api/services/attendance.service.js

import { apiCall } from "../client";

/**
 * Service for tracking and managing student attendance logs.
 */
export const attendanceService = {
	/**
	 * Fetches historical attendance logs specifically for the logged-in professor.
	 */
	getProfessorLogs: () => apiCall("/professor/logs"),

	/**
	 * Records experience for academic leaves for the logged-in professor.
	 * @param {Object} data - The academic experience data to be recorded.
	 */
	recordAcademicExperience: (data) =>
		apiCall("/professor/experience", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	/**
	 * Retrieves the attendance history for all students within a specific cohort.
	 */
	getAttendanceLogs: (cohortId) => apiCall(`/attendance/logs/${cohortId}`),

	/**
	 * Records a new attendance entry for a course session.
	 * @param {string|number} courseId - The ID of the course being marked.
	 * @param {Object} data - Contains student IDs and their respective status (Present/Absent).
	 */
	markAttendance: (courseId, data) =>
		apiCall(`/courses/${courseId}/attendance`, {
			method: "POST",
			body: JSON.stringify(data),
		}),

	/**
	 * Re-opens the attendance marking window for a specific date.
	 * @param {string|number} courseId - The ID of the course.
	 * @param {Object} data - Contains the specific date or session to re-open.
	 */
	reopenAttendance: (courseId, data) =>
		apiCall(`/courses/${courseId}/attendance/reopen`, {
			method: "POST",
			body: JSON.stringify(data),
		}),
};
