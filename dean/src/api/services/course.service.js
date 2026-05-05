// src/api/services/course.service.js

import { apiCall } from "../client";

/**
 * Service for managing courses (cohorts), group assignments, and academic materials.
 */
export const courseService = {
	// Get course metadata by slug
	getCourseMetadata: (slug) => apiCall(`/cohort/slug/${slug}`),

	// Get course details
	getCourseDetails: (courseId) => apiCall(`/cohort/${courseId}/details`),

	// Get archived courses
	getArchivedCourses: () => apiCall("/cohort/archived"),

	// Get course members - update to get all members without pagination set the limit to 2k
	getCourseMembers: (courseId) =>
		apiCall(`/cohort/${courseId}/members?limit=2000&page=1`),

	// Get group details
	getGroupDetails: (groupId, cohortId = null) => {
		const url = cohortId
			? `/cohort/${cohortId}/group/${groupId}/details`
			: `/cohort/group/${groupId}/details`;
		return apiCall(url);
	},

	// Create course
	createCourse: (courseData) =>
		apiCall("/cohort/create", {
			method: "POST",
			body: JSON.stringify(courseData),
		}),

	// Update course
	updateCourse: (courseId, courseData) =>
		apiCall(`/cohort/edit/${courseId}`, {
			method: "PATCH",
			body: JSON.stringify(courseData),
		}),

	// Delete course
	deleteCourse: (courseId) =>
		apiCall(`/cohort/${courseId}`, {
			method: "DELETE",
		}),

	// Add detail section
	addDetailSection: (courseId, sectionData) =>
		apiCall(`/cohort/${courseId}/details/add`, {
			method: "POST",
			body: JSON.stringify(sectionData),
		}),

	// Edit detail section
	editDetailSection: (courseId, detailId, sectionData) =>
		apiCall(`/cohort/${courseId}/details/${detailId}/edit`, {
			method: "PATCH",
			body: JSON.stringify(sectionData),
		}),

	// Delete detail section
	deleteDetailSection: (courseId, detailId) =>
		apiCall(`/cohort/${courseId}/details/${detailId}`, {
			method: "DELETE",
		}),

	// Create group
	createGroup: (courseId, groupData) =>
		apiCall(`/cohort/${courseId}/group/create`, {
			method: "POST",
			body: JSON.stringify(groupData),
		}),

	// Update group
	updateGroup: (cohortId, groupId, groupData) =>
		apiCall(`/cohort/${cohortId}/group/${groupId}/edit`, {
			method: "PUT",
			body: JSON.stringify(groupData),
		}),

	// Delete group
	deleteGroup: (cohortId, groupId) =>
		apiCall(`/cohort/${cohortId}/group/${groupId}/delete`, {
			method: "DELETE",
		}),

	// Invite member to group
	inviteGroupMember: (courseId, groupId, inviteData) =>
		apiCall(`/cohort/${courseId}/group/${groupId}/invite`, {
			method: "POST",
			body: JSON.stringify(inviteData),
		}),

	// Accept group invite
	acceptGroupInvite: (token) =>
		apiCall("/cohort/group/accept-invite", {
			method: "POST",
			body: JSON.stringify({ token }),
		}),

	// Remove member from group
	removeGroupMember: (groupId, memberId) =>
		apiCall(`/cohort/group/${groupId}/remove-member`, {
			method: "DELETE",
			body: JSON.stringify({ targetUserId: memberId }),
		}),

	// Upload course participants (Excel file)
	uploadParticipants: async (courseId, file) => {
		try {
			const formData = new FormData();
			formData.append("file", file);

			const resp = await fetch(
				`${API_BASE_URL}/cohort/${courseId}/invite`,
				{
					method: "POST",
					credentials: "include",
					body: formData,
				},
			);

			const contentType = resp.headers.get("content-type") || "";
			const isJson = contentType.includes("application/json");
			const body = isJson ? await resp.json().catch(() => ({})) : {};

			if (!resp.ok) {
				return {
					success: false,
					message: body.message || `HTTP ${resp.status}`,
				};
			}

			return { success: true, data: body };
		} catch (e) {
			return {
				success: false,
				message: "Network error. Please try again.",
			};
		}
	},

	// Upload course projects (Excel file)
	uploadProjects: async (courseId, file) => {
		try {
			const formData = new FormData();
			formData.append("file", file);

			const resp = await fetch(
				`${API_BASE_URL}/cohort/${courseId}/projects/upload`,
				{
					method: "POST",
					credentials: "include",
					body: formData,
				},
			);

			const contentType = resp.headers.get("content-type") || "";
			const isJson = contentType.includes("application/json");
			const body = isJson ? await resp.json().catch(() => ({})) : {};

			if (!resp.ok) {
				return {
					success: false,
					message: body.message || `HTTP ${resp.status}`,
				};
			}

			return { success: true, data: body };
		} catch (e) {
			return {
				success: false,
				message: "Network error. Please try again.",
			};
		}
	},

	// Submit assignment
	submitAssignment: (courseId, submissionData, files = []) => {
		const formData = new FormData();
		formData.append("submission_title", submissionData.submission_title);
		formData.append(
			"submission_description",
			submissionData.submission_description,
		);
		if (submissionData.submission_url) {
			formData.append("submission_url", submissionData.submission_url);
		}

		files.forEach((file) => {
			formData.append("files", file);
		});

		return fetch(`${API_BASE_URL}/cohort/${courseId}/submission`, {
			method: "POST",
			credentials: "include",
			body: formData,
		});
	},

	// Get student submission
	getSubmission: (courseId) => apiCall(`/cohort/${courseId}/submission`),

	// Update submission
	updateSubmission: (courseId, submissionData, files = []) => {
		const formData = new FormData();
		formData.append("submission_title", submissionData.submission_title);
		formData.append(
			"submission_description",
			submissionData.submission_description,
		);
		if (submissionData.submission_url) {
			formData.append("submission_url", submissionData.submission_url);
		}

		files.forEach((file) => {
			formData.append("files", file);
		});

		return fetch(`${API_BASE_URL}/cohort/${courseId}/submission`, {
			method: "PUT",
			credentials: "include",
			body: formData,
		});
	},

	// Delete/unsubmit assignment
	deleteSubmission: (courseId) =>
		apiCall(`/cohort/${courseId}/submission`, {
			method: "DELETE",
		}),

	// Get available members for group (FIXED)
	getAvailableMembers: (cohortId, groupId) =>
		apiCall(`/cohort/${cohortId}/available-members/${groupId}`),

	// Add members to group (FIXED)
	addMembersToGroup: (groupId, memberUserIds) =>
		apiCall(`/cohort/group/${groupId}/add-members`, {
			method: "POST",
			body: JSON.stringify({ memberUserIds }),
		}),

	joinCourseWithInvitation: async (data) => {
		try {
			const response = await apiCall("/cohort/join-with-invitation", {
				method: "POST",
				body: JSON.stringify(data),
			});
			return response;
		} catch (error) {
			return {
				success: false,
				message: error.error || "Failed to join course",
			};
		}
	},

	getCourseByInvitation: async (token) => {
		try {
			const response = await apiCall(
				`/cohort/invitation-info?token=${token}`,
			);
			return response;
		} catch (error) {
			return {
				success: false,
				message: error.error || "Failed to get course info",
			};
		}
	},

	generateInvitationLink: async (cohortId) => {
		try {
			const response = await apiCall(
				`/cohort/${cohortId}/invitation-link`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			return response;
		} catch (error) {
			return {
				success: false,
				message: error.error || "Failed to generate invitation link",
			};
		}
	},

	// Remove course participant (creator only)
	removeCourseParticipant: (cohortId, targetUserId) =>
		apiCall(`/cohort/${cohortId}/participants/remove`, {
			method: "DELETE",
			body: JSON.stringify({ targetUserId }),
		}),

	// Assignment Management APIs
	// Get all assignments for a cohort
	getAssignments: (cohortId) =>
		apiCall(`/cohort/${cohortId}/assignments`, {
			method: "GET",
		}),

	// Create a new assignment
	createAssignment: (cohortId, assignmentData) =>
		apiCall(`/cohort/${cohortId}/assignments`, {
			method: "POST",
			body: JSON.stringify(assignmentData),
		}),

	// Update an existing assignment
	updateAssignment: (cohortId, assignmentId, assignmentData) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}`, {
			method: "PUT",
			body: JSON.stringify(assignmentData),
		}),

	// Delete an assignment
	deleteAssignment: (cohortId, assignmentId) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}`, {
			method: "DELETE",
		}),

	// Assignment Submission APIs

	// Mark assignment as submitted
	markAssignmentSubmitted: (cohortId, assignmentId) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}/submit`, {
			method: "POST",
		}),

	// Get user's submission status for assignments
	getSubmissionStatus: (cohortId, assignmentIds = null) => {
		const url = `/cohort/${cohortId}/assignments/submissions/status`;
		const queryParams = assignmentIds
			? `?assignmentIds=${assignmentIds.join(",")}`
			: "";
		return apiCall(`${url}${queryParams}`);
	},

	// Get all submissions for a specific assignment (for professors)
	getAssignmentSubmissions: (cohortId, assignmentId) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}/submissions`),

	// Remove assignment submission (unmark as submitted)
	unmarkAssignmentSubmitted: (cohortId, assignmentId) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}/submit`, {
			method: "DELETE",
		}),

	// Grade individual assignment
	gradeAssignment: (
		cohortId,
		assignmentId,
		studentId,
		marksAwarded,
		comments = "",
	) =>
		apiCall(`/cohort/assignments/${assignmentId}/grade`, {
			method: "POST",
			body: JSON.stringify({
				studentId,
				cohortId,
				marksAwarded,
				comments,
			}),
		}),

	// Grade group assignment via leader
	gradeGroupAssignment: (
		cohortId,
		assignmentId,
		leaderId,
		marksAwarded,
		comments = "",
	) =>
		apiCall(`/cohort/assignments/${assignmentId}/grade-group`, {
			method: "POST",
			body: JSON.stringify({
				leaderId,
				cohortId,
				marksAwarded,
				comments,
			}),
		}),

	// Get grades for a cohort
	getGrades: (cohortId, assignmentIds = null) => {
		const url = `/cohort/cohorts/${cohortId}/grades`;
		const queryParams = assignmentIds
			? `?assignmentIds=${assignmentIds.join(",")}`
			: "";
		return apiCall(`${url}${queryParams}`);
	},

	// Get materials for a cohort
	getMaterials: (cohortId) => apiCall(`/cohort/${cohortId}/materials`),

	// Create a new material
	createMaterial: (cohortId, materialData) =>
		apiCall(`/cohort/${cohortId}/materials`, {
			method: "POST",
			body: JSON.stringify(materialData),
		}),

	// Update a material
	updateMaterial: (cohortId, materialId, materialData) =>
		apiCall(`/cohort/${cohortId}/materials/${materialId}`, {
			method: "PUT",
			body: JSON.stringify(materialData),
		}),

	// Delete a material
	deleteMaterial: (cohortId, materialId) =>
		apiCall(`/cohort/${cohortId}/materials/${materialId}`, {
			method: "DELETE",
		}),

	// Resources Management APIs
	// Get all resources for a cohort
	getResources: (cohortId) => apiCall(`/cohort/${cohortId}/resources`),

	// Create a new week
	createWeek: (cohortId, weekData) =>
		apiCall(`/cohort/${cohortId}/resources/week`, {
			method: "POST",
			body: JSON.stringify(weekData),
		}),

	// Update a week
	updateWeek: (cohortId, weekId, weekData) =>
		apiCall(`/cohort/${cohortId}/resources/week/${weekId}`, {
			method: "PUT",
			body: JSON.stringify(weekData),
		}),

	// Delete a week
	deleteWeek: (cohortId, weekId) =>
		apiCall(`/cohort/${cohortId}/resources/week/${weekId}`, {
			method: "DELETE",
		}),

	// Create a new resource
	createResource: (cohortId, weekId, resourceData) =>
		apiCall(`/cohort/${cohortId}/resources/week/${weekId}`, {
			method: "POST",
			body: JSON.stringify(resourceData),
		}),

	// Update a resource
	updateResource: (cohortId, resourceId, resourceData) =>
		apiCall(`/cohort/${cohortId}/resources/${resourceId}`, {
			method: "PUT",
			body: JSON.stringify(resourceData),
		}),

	// Delete a resource
	deleteResource: (cohortId, resourceId) =>
		apiCall(`/cohort/${cohortId}/resources/${resourceId}`, {
			method: "DELETE",
		}),
	// Archive course
	archiveCourse: (courseId) =>
		apiCall(`/cohort/${courseId}/archive`, {
			method: "POST",
		}),

	// Check and auto-archive expired courses
	checkAndArchiveExpiredCourses: () =>
		apiCall("/cohort/check-expired", {
			method: "POST",
		}),
};
