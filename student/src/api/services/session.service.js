// src/api/services/session.service.js

import { apiCall } from "../client";

/**
 * Service for academic session management and curriculum planning.
 */
export const sessionService = {
	/**
	 * Fetches the comprehensive course schedule for the authenticated user.
	 */
	getSchedules: () => apiCall("/sessions/schedules"),

	/**
	 * Filters the schedule to retrieve only sessions occurring today.
	 */
	getTodaysClasses: () => apiCall("/sessions/today"),

	/**
	 * Saves a teacher's pedagogical reflection or notes after a class session.
	 */
	saveReflection: (data) =>
		apiCall("/sessions/reflections", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	/**
	 * Retrieves previous reflections, optionally filtered by a specific class section.
	 */
	getReflections: (sectionId) =>
		apiCall(
			`/sessions/reflections${sectionId ? `?sectionId=${sectionId}` : ""}`,
		),

	/**
	 * Retrieves uploaded academic assets (Syllabus, Lesson Plans) for a course.
	 */
	getDocuments: (courseId) => apiCall(`/sessions/documents/${courseId}`),

	/**
	 * Uploads multiple academic documents (e.g., PDFs, Word docs) for a course.
	 * Processes a map of files and prepares them for the backend or mock handler.
	 */
	uploadDocuments: (courseId, filesMap) => {
		const fileNames = {};
		Object.keys(filesMap).forEach((key) => {
			fileNames[key] = filesMap[key].name;
		});

		return apiCall(`/sessions/documents/${courseId}/bulk`, {
			method: "POST",
			body: JSON.stringify({
				courseId,
				docs: Object.keys(filesMap),
				fileNames: fileNames,
			}),
		});
	},
};
