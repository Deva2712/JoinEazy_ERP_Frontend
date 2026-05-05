// src/api/services/department.service.js

import { apiCall } from "../client";

/**
 * Service for departmental management and dashboard metrics.
 */
export const departmentService = {
	/**
	 * Fetches overview data for the initial dashboard load.
	 */
	getOverview: () => apiCall("/department/overview", { method: "GET" }),

	/**
	 * Fetches urgent notifications and action items for the department.
	 */
	getDepartmentAlerts: () => apiCall("/department/alerts", { method: "GET" }),

	/**
	 * Fetches the list of processed courses for the department.
	 */
	getCourses: () => apiCall("/department/courses", { method: "GET" }),

	/**
	 * Updates the approval status of a specific course document.
	 * @param {Object} payload - The update data (courseId, documentType, status, comments).
	 */
	updateDocumentStatus: (payload) =>
		apiCall("/department/courses/document-status", {
			method: "POST",
			body: JSON.stringify(payload),
		}),

	/**
	 * Fetches the list of faculty members in the department.
	 */
	getFaculty: () => apiCall("/department/faculty", { method: "GET" }),

	/**
	 * Fetches the list of students in the department.
	 */
	getStudents: () => apiCall("/department/students", { method: "GET" }),

	/**
	 * Fetches the placement and internships data of the department.
	 */
	getPlacements: () => apiCall("/department/placements", { method: "GET" }),

	/**
	 * Fetches research work, grant requests and budget utilization in the department.
	 */
	getResearch: () => apiCall("/department/research", { method: "GET" }),

	/**
	 * Updates the status of a specific research grant request.
	 * @param {Object} payload - The update data (requestId, status, adminComments).
	 */
	updateGrantStatus: (payload) =>
		apiCall("/department/research/grant-status", {
			method: "POST",
			body: JSON.stringify(payload),
		}),
};
