// src/api/services/cohort.service.js
import { apiCall } from "../client";
import { courseService } from "../services/course.service";

// Keep the old cohortAPI for backward compatibility
export const cohortService = {
	...courseService,

	// Delete course (alias for courseService.deleteCourse)
	deleteCourse: (courseId) => courseService.deleteCourse(courseId),

	// Leaderboard APIs
	getLeaderboard: (cohortId) => apiCall(`/cohort/${cohortId}/leaderboard`),
	getIndividualLeaderboard: (cohortId) =>
		apiCall(`/cohort/${cohortId}/leaderboard/individuals`),
	getGroupLeaderboard: (cohortId) =>
		apiCall(`/cohort/${cohortId}/leaderboard/groups`),

	// Board/Posts APIs
	getBoardPosts: (cohortId) => apiCall(`/cohort/${cohortId}/posts`),
	createPost: (cohortId, postData) =>
		apiCall(`/cohort/${cohortId}/posts`, {
			method: "POST",
			body: JSON.stringify(postData),
		}),
	updatePost: (cohortId, postId, postData) =>
		apiCall(`/cohort/${cohortId}/posts/${postId}`, {
			method: "PUT",
			body: JSON.stringify(postData),
		}),
	deletePost: (cohortId, postId) =>
		apiCall(`/cohort/${cohortId}/posts/${postId}`, {
			method: "DELETE",
		}),
	likePost: (cohortId, postId) =>
		apiCall(`/cohort/${cohortId}/posts/${postId}/like`, {
			method: "POST",
		}),

	// Events APIs
	getEvents: (cohortId) => apiCall(`/cohort/${cohortId}/events`),
	createEvent: (cohortId, eventData) =>
		apiCall(`/cohort/${cohortId}/events`, {
			method: "POST",
			body: JSON.stringify(eventData),
		}),
	updateEvent: (cohortId, eventId, eventData) =>
		apiCall(`/cohort/${cohortId}/events/${eventId}`, {
			method: "PUT",
			body: JSON.stringify(eventData),
		}),
	deleteEvent: (cohortId, eventId) =>
		apiCall(`/cohort/${cohortId}/events/${eventId}`, {
			method: "DELETE",
		}),

	// Notes APIs
	getNotes: (cohortId) => apiCall(`/cohort/${cohortId}/notes`),
	createNote: (cohortId, noteData) =>
		apiCall(`/cohort/${cohortId}/notes`, {
			method: "POST",
			body: JSON.stringify(noteData),
		}),
	updateNote: (cohortId, noteId, noteData) =>
		apiCall(`/cohort/${cohortId}/notes/${noteId}`, {
			method: "PUT",
			body: JSON.stringify(noteData),
		}),
	deleteNote: (cohortId, noteId) =>
		apiCall(`/cohort/${cohortId}/notes/${noteId}`, {
			method: "DELETE",
		}),

	generateInvitationLink: async (cohortId) => {
		// Delegate to courseService to ensure consistent base URL usage
		return courseService.generateInvitationLink(cohortId);
	},

	joinWithInvitation: async (token, email = null) => {
		try {
			const response = await fetch(
				`/api/v1/cohort/join-with-invitation`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token, email }),
				},
			);

			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ message: "Unknown error" }));
				return {
					success: false,
					message: errorData.message || `HTTP ${response.status}`,
				};
			}

			const data = await response.json();
			return { success: true, data };
		} catch (error) {
			return {
				success: false,
				message: "Failed to join course",
			};
		}
	},

	getInvitationStatus: async (cohortId, email) => {
		try {
			const response = await apiCall(
				`/cohort/${cohortId}/invitation-status?email=${email}`,
			);
			return response;
		} catch (error) {
			return {
				success: false,
				message: error.error || "Failed to get invitation status",
			};
		}
	},
};
