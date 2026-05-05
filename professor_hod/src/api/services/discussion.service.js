// src/api/services/discussion.service.js

import { apiCall } from "../client";
import { USE_MOCK_API } from "../config";
import {
	getDiscussionsFromStorage,
	saveDiscussionsToStorage,
} from "../utils/discussionStorage";

/**
 * Service for managing student forum discussions and peer-to-peer interactions.
 */
export const discussionService = {
	getDiscussions: async (cohortId, userId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();

					if (!allData.hasOwnProperty(cohortId)) {
						allData[cohortId] = [];
						saveDiscussionsToStorage(allData);
					}

					const discussions = allData[cohortId] || [];
					let needsSave = false;

					const twoDaysAgo = new Date();
					twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

					discussions.forEach((discussion) => {
						// 1. Auto-archive check
						const createdDate = new Date(discussion.created_at);
						if (
							createdDate < twoDaysAgo &&
							!discussion.is_archived
						) {
							discussion.is_archived = true;
							needsSave = true;
						}

						// 2. Data Migration & Like State
						if (!discussion.liked_by_user_ids) {
							discussion.liked_by_user_ids = [];
							discussion.likes_count = 0;
							needsSave = true;
						}

						discussion.likes_count =
							discussion.liked_by_user_ids.length;
						discussion.liked_by_current_user =
							discussion.liked_by_user_ids.includes(userId);

						// 3. Handle Replies State
						if (discussion.replies) {
							discussion.replies.forEach((reply) => {
								if (!reply.liked_by_user_ids) {
									reply.liked_by_user_ids = [];
									reply.likes_count = 0;
									needsSave = true;
								}
								reply.likes_count =
									reply.liked_by_user_ids.length;
								reply.liked_by_current_user =
									reply.liked_by_user_ids.includes(userId);
							});
						}
					});

					if (needsSave) saveDiscussionsToStorage(allData);

					resolve({ success: true, data: discussions });
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions`);
	},

	createDiscussion: async (cohortId, discussionData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const newDiscussion = {
						id: Date.now(),
						...discussionData,
						created_at: new Date().toISOString(),
						likes_count: 0,
						liked_by_user_ids: [],
						liked_by_current_user: false,
						replies: [],
					};

					if (!allData[cohortId]) allData[cohortId] = [];
					allData[cohortId].unshift(newDiscussion);
					saveDiscussionsToStorage(allData);

					resolve({ success: true, data: newDiscussion });
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions`, {
			method: "POST",
			body: JSON.stringify(discussionData),
		});
	},

	editDiscussion: async (cohortId, discussionId, updatedData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussion = (allData[cohortId] || []).find(
						(d) => d.id === discussionId,
					);

					if (discussion) {
						discussion.title =
							updatedData.title || discussion.title;
						discussion.content =
							updatedData.content || discussion.content;
						discussion.edited_at = new Date().toISOString();
						saveDiscussionsToStorage(allData);
						resolve({ success: true, data: discussion });
					} else {
						resolve({
							success: false,
							error: "Discussion not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions/${discussionId}`, {
			method: "PUT",
			body: JSON.stringify(updatedData),
		});
	},

	likeDiscussion: async (cohortId, discussionId, userId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussion = (allData[cohortId] || []).find(
						(d) => d.id === discussionId,
					);

					if (discussion) {
						if (!discussion.liked_by_user_ids)
							discussion.liked_by_user_ids = [];

						const userIndex =
							discussion.liked_by_user_ids.indexOf(userId);
						if (userIndex > -1) {
							discussion.liked_by_user_ids.splice(userIndex, 1);
						} else {
							discussion.liked_by_user_ids.push(userId);
						}

						discussion.likes_count =
							discussion.liked_by_user_ids.length;
						discussion.liked_by_current_user =
							discussion.liked_by_user_ids.includes(userId);

						saveDiscussionsToStorage(allData);
						resolve({ success: true, data: discussion });
					} else {
						resolve({
							success: false,
							error: "Discussion not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions/${discussionId}/like`, {
			method: "POST",
		});
	},

	addReply: async (cohortId, discussionId, replyData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussion = (allData[cohortId] || []).find(
						(d) => d.id === discussionId,
					);

					if (discussion) {
						const newReply = {
							id: Date.now(),
							...replyData,
							created_at: new Date().toISOString(),
							likes_count: 0,
							liked_by_user_ids: [],
							liked_by_current_user: false,
						};

						if (!discussion.replies) discussion.replies = [];
						discussion.replies.push(newReply);
						saveDiscussionsToStorage(allData);
						resolve({ success: true, data: newReply });
					} else {
						resolve({
							success: false,
							error: "Discussion not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/discussions/${discussionId}/replies`,
			{
				method: "POST",
				body: JSON.stringify(replyData),
			},
		);
	},

	deleteDiscussion: async (cohortId, discussionId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const index = (allData[cohortId] || []).findIndex(
						(d) => d.id === discussionId,
					);

					if (index !== -1) {
						allData[cohortId].splice(index, 1);
						saveDiscussionsToStorage(allData);
						resolve({ success: true });
					} else {
						resolve({ success: false, error: "Not found" });
					}
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions/${discussionId}`, {
			method: "DELETE",
		});
	},
};
