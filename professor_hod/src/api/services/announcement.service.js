// src/api/services/announcement.service.js

import { apiCall } from "../client";
import { USE_MOCK_API } from "../config";
import {
	getAnnouncementsFromStorage,
	updateAnnouncementsInStorage,
	createDefaultAnnouncement,
} from "../utils/announcementStorage";

/**
 * Service for managing course-wide announcements, pinned updates, and discussion threads.
 */
export const announcementService = {
	// Get all announcements for a cohort
	getAnnouncements: async (cohortId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const authUser = JSON.parse(
						localStorage.getItem("authUser") || "{}",
					);
					const userId = authUser.id || authUser.user_id || 1;
					const allData = getAnnouncementsFromStorage();

					if (!allData.hasOwnProperty(cohortId)) {
						allData[cohortId] = [
							createDefaultAnnouncement(cohortId),
						];
						updateAnnouncementsInStorage(allData);
					}

					const announcements = allData[cohortId] || [];
					const now = new Date();
					const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);
					let hasChanges = false;

					announcements.forEach((announcement) => {
						// Auto-archive logic
						const createdDate = new Date(announcement.created_at);
						if (
							createdDate < twoDaysAgo &&
							!announcement.is_archived
						) {
							announcement.is_archived = true;
							announcement.is_pinned = false;
							hasChanges = true;
						}

						// Process reply metadata
						if (announcement.replies) {
							announcement.replies.forEach((reply) => {
								reply.upvoted_by_user_ids =
									reply.upvoted_by_user_ids || [];
								reply.upvoted_by_current_user =
									reply.upvoted_by_user_ids.includes(userId);
								reply.upvotes =
									reply.upvoted_by_user_ids.length;
							});
						}
					});

					if (hasChanges) updateAnnouncementsInStorage(allData);

					resolve({ success: true, data: announcements });
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements`);
	},

	// Create new announcement (Professor only)
	createAnnouncement: async (cohortId, announcementData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					allData[cohortId] = allData[cohortId] || [];

					const newAnnouncement = {
						id: Date.now(),
						...announcementData,
						author_name: "Prof. Jane Smith",
						author_id: 1,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
						is_pinned: true,
						is_archived: false,
						replies: [],
					};

					allData[cohortId] = [newAnnouncement, ...allData[cohortId]];
					updateAnnouncementsInStorage(allData);
					resolve({ success: true, data: newAnnouncement });
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements`, {
			method: "POST",
			body: JSON.stringify(announcementData),
		});
	},

	// Update announcement (Professor only)
	updateAnnouncement: async (cohortId, announcementId, announcementData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const index = announcements.findIndex(
						(a) => a.id === announcementId,
					);

					if (index !== -1) {
						announcements[index] = {
							...announcements[index],
							...announcementData,
							updated_at: new Date().toISOString(),
						};
						updateAnnouncementsInStorage(allData);
						resolve({ success: true, data: announcements[index] });
					} else {
						resolve({
							success: false,
							error: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements/${announcementId}`, {
			method: "PUT",
			body: JSON.stringify(announcementData),
		});
	},

	// Delete announcement (Professor only)
	deleteAnnouncement: async (cohortId, announcementId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const index = announcements.findIndex(
						(a) => a.id === announcementId,
					);

					if (index !== -1) {
						announcements.splice(index, 1);
						updateAnnouncementsInStorage(allData);
						resolve({ success: true });
					} else {
						resolve({
							success: false,
							error: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements/${announcementId}`, {
			method: "DELETE",
		});
	},

	// Pin/Unpin announcement (Professor only)
	togglePinAnnouncement: async (cohortId, announcementId, isPinned) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);

					if (announcement) {
						if (isPinned) {
							announcements.forEach((a) => {
								if (a.id !== announcementId)
									a.is_pinned = false;
							});
						}
						announcement.is_pinned = isPinned;
						updateAnnouncementsInStorage(allData);
						resolve({ success: true, data: announcement });
					} else {
						resolve({
							success: false,
							error: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/pin`,
			{
				method: "PATCH",
				body: JSON.stringify({ is_pinned: isPinned }),
			},
		);
	},

	// Add reply to announcement thread
	addReply: async (cohortId, announcementId, replyData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);

					if (announcement) {
						const newReply = {
							id: Date.now(),
							...replyData,
							created_at: new Date().toISOString(),
							upvotes: 0,
							upvoted_by_user_ids: [],
							upvoted_by_current_user: false,
						};
						announcement.replies = announcement.replies || [];
						announcement.replies.push(newReply);
						announcement.replies_count =
							announcement.replies.length;
						updateAnnouncementsInStorage(allData);
						resolve({ success: true, data: newReply });
					} else {
						resolve({
							success: false,
							error: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies`,
			{
				method: "POST",
				body: JSON.stringify(replyData),
			},
		);
	},

	// Upvote a reply/question
	upvoteReply: async (cohortId, announcementId, replyId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const authUser = JSON.parse(
						localStorage.getItem("authUser") || "{}",
					);
					const userId = authUser.id || authUser.user_id || 1;
					const allData = getAnnouncementsFromStorage();
					const announcement = (allData[cohortId] || []).find(
						(a) => a.id === announcementId,
					);
					const reply = announcement?.replies?.find(
						(r) => r.id === replyId,
					);

					if (reply) {
						reply.upvoted_by_user_ids =
							reply.upvoted_by_user_ids || [];
						const userIndex =
							reply.upvoted_by_user_ids.indexOf(userId);

						if (userIndex > -1)
							reply.upvoted_by_user_ids.splice(userIndex, 1);
						else reply.upvoted_by_user_ids.push(userId);

						reply.upvotes = reply.upvoted_by_user_ids.length;
						reply.upvoted_by_current_user =
							reply.upvoted_by_user_ids.includes(userId);

						updateAnnouncementsInStorage(allData);
						resolve({ success: true, data: reply });
					} else {
						resolve({ success: false, error: "Reply not found" });
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies/${replyId}/upvote`,
			{
				method: "POST",
			},
		);
	},

	// Lock/Unlock thread (Professor only)
	toggleLockThread: async (cohortId, announcementId, isLocked) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcement = (allData[cohortId] || []).find(
						(a) => a.id === announcementId,
					);

					if (announcement) {
						announcement.is_locked = isLocked;
						updateAnnouncementsInStorage(allData);
						resolve({ success: true, data: announcement });
					} else {
						resolve({
							success: false,
							error: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/lock`,
			{
				method: "PATCH",
				body: JSON.stringify({ is_locked: isLocked }),
			},
		);
	},
};
