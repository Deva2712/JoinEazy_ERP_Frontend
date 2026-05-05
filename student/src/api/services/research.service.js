// src/api/services/research.service.js

import { apiCall } from "../client";

/**
 * Service for research projects, publications, and investigator profiles.
 * This unified service manages the full lifecycle of academic research,
 * including project timelines, role recruitment, and contributor networking.
 */
export const researchService = {
	// --- Core Research & Dashboard ---

	/**
	 * Aggregates projects, publications, and applications into a dashboard view.
	 */
	getResearchDashboard: () => apiCall("/research/dashboard-sync"),

	/**
	 * Creates a new research project or publication entry.
	 */
	createResearch: (data) =>
		apiCall("/research/create", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	/**
	 * Updates the primary details of an existing research entry.
	 */
	updateResearch: (id, data) =>
		apiCall(`/research/update/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),

	/**
	 * Toggles the "starred" or "bookmarked" status of a project.
	 */
	toggleStar: (id) =>
		apiCall(`/research/star/${id}`, {
			method: "POST",
		}),

	// --- Role & Team Management ---

	/**
	 * Defines a new role/vacancy within a research project.
	 */
	createRole: (researchId, roleData) =>
		apiCall(`/research/${researchId}/roles/create`, {
			method: "POST",
			body: JSON.stringify(roleData),
		}),

	/**
	 * Updates requirements or details for a specific project role.
	 */
	updateRole: (researchId, roleIndex, roleData) =>
		apiCall(`/research/${researchId}/roles/update/${roleIndex}`, {
			method: "PUT",
			body: JSON.stringify(roleData),
		}),

	/**
	 * Removes a role or vacancy from a research project.
	 */
	deleteRole: (researchId, roleId) =>
		apiCall(`/research/${researchId}/roles/delete/${roleId}`, {
			method: "DELETE",
		}),

	// --- Project Timeline & Milestones ---

	/**
	 * Adds a new milestone or achievement to the project timeline.
	 */
	addTimelineEvent: (researchId, eventData) =>
		apiCall(`/research/timeline/${researchId}`, {
			method: "POST",
			body: JSON.stringify(eventData),
		}),

	/**
	 * Updates an existing milestone in the timeline.
	 */
	updateTimelineEvent: (researchId, eventId, eventData) =>
		apiCall(`/research/timeline/${researchId}/${eventId}`, {
			method: "PUT",
			body: JSON.stringify(eventData),
		}),

	/**
	 * Deletes a specific event from the project timeline.
	 */
	deleteTimelineEvent: (researchId, eventId) =>
		apiCall(`/research/timeline/${researchId}/${eventId}`, {
			method: "DELETE",
		}),

	// --- Collaboration & Applications ---

	/**
	 * Submits an application to join a specific research project.
	 */
	newApplication: (id, data) =>
		apiCall(`/research/apply/${id}`, {
			method: "POST",
			body: JSON.stringify(data),
		}),

	/**
	 * Handles application workflow actions (e.g., accepting or rejecting a candidate).
	 */
	updateApplicationStatus: (applicationId, action, details) =>
		apiCall(`/research/applications/${applicationId}/${action}`, {
			method: "POST",
			body: JSON.stringify(details),
		}),

	// --- Grant Management ---

	/**
	 * Submits a new grant request for a specific project or publication.
	 */
	createGrantRequest: (grantData) =>
		apiCall("/research/grants/create", {
			method: "POST",
			body: JSON.stringify(grantData),
		}),

	/**
     * Updates an existing grant request with new information for re-submission.
     * @param {string} grantId - The ID of the grant to update.
     * @param {Object} grantData - The updated grant information.
     */
    updateGrantRequest: (grantId, grantData) =>
        apiCall(`/research/grants/update/${grantId}`, {
            method: "POST",
            body: JSON.stringify(grantData),
        }),

	// --- Researcher Profiles ---

	/**
	 * Fetches the full researcher profile, including bio and skills.
	 */
	getUserProfile: (userId) => apiCall(`/research/users/profile/${userId}`),

	/**
	 * Updates the authenticated user's researcher profile.
	 */
	updateUserProfile: (userId, profileData) =>
		apiCall(`/research/users/profile/update/${userId}`, {
			method: "PUT",
			body: JSON.stringify(profileData),
		}),
};
