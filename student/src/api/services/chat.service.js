// src/api/services/chat.service.js

import { apiCall } from "../client";
import { USE_MOCK_API } from "../config";
import {
	getChatMessagesFromStorage,
	saveChatMessagesToStorage,
} from "../utils/chatStorage";

/**
 * Service for handling real-time communications within cohorts.
 * Replaces generalChatAPI from api.js
 */
export const chatService = {
	getMessages: async (cohortId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getChatMessagesFromStorage();

					if (!allData.hasOwnProperty(cohortId)) {
						allData[cohortId] = [];
						saveChatMessagesToStorage(allData);
					}

					resolve({
						success: true,
						data: allData[cohortId] || [],
					});
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/chat`);
	},

	sendMessage: async (cohortId, messageData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getChatMessagesFromStorage();

					const newMessage = {
						id: Date.now(),
						...messageData,
						created_at: new Date().toISOString(),
					};

					if (!allData[cohortId]) {
						allData[cohortId] = [];
					}

					allData[cohortId].push(newMessage);
					saveChatMessagesToStorage(allData);

					resolve({
						success: true,
						data: newMessage,
					});
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/chat`, {
			method: "POST",
			body: JSON.stringify(messageData),
		});
	},

	deleteMessage: async (cohortId, messageId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getChatMessagesFromStorage();
					const messages = allData[cohortId] || [];
					const index = messages.findIndex((m) => m.id === messageId);

					if (index !== -1) {
						messages.splice(index, 1);
						saveChatMessagesToStorage(allData);
						resolve({
							success: true,
							message: "Message deleted successfully",
						});
					} else {
						resolve({
							success: false,
							message: "Message not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/chat/${messageId}`, {
			method: "DELETE",
		});
	},
};
