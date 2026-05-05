// src/api/services/leave.service.js

import { apiCall } from "../client";

/**
 * Service for leave management and faculty substitution workflows.
 * Supports both Professor (Requester) and HoD (Approver) roles.
 */
export const leaveService = {
	/**
	 * Retrieves the current user's personal leave applications.
	 * Used by both Professors and HoDs to see their own history.
	 */
	getApplications: () => apiCall("/leaves/applications"),

	/**
	 * Submits a new leave application.
	 */
	createApplication: (data) =>
		apiCall("/leaves/apply", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	/**
	 * Updates an existing application.
	 * Essential for the 'Rejected but not Archived' flow to allow resubmission.
	 */
	updateApplication: (id, data) =>
		apiCall(`/leaves/update/${id}`, {
			method: "POST",
			body: JSON.stringify(data),
		}),

	/**
	 * Admin/HoD Section: Retrieves applications submitted by department faculty.
	 */
	getIncomingRequests: () => apiCall("/leaves/incoming-requests"),

	/**
	 * Administrative action to Approve or Reject a request.
	 * Used by HoD (for faculty) or Dean/HR (for HoD).
	 */
	updateApproval: (id, role, action, remark = null, isArchived = true) =>
		apiCall(`/leaves/approve/${id}`, {
			method: "POST",
			body: JSON.stringify({ role, action, remark, isArchived }),
		}),

	/**
	 * Peer-to-peer Substitution: Allows a colleague to accept/decline a request.
	 */
	respondToSubstitution: (id, action) =>
		apiCall(`/leaves/substitutions/${id}`, {
			method: "POST",
			body: JSON.stringify({ action }),
		}),
};
