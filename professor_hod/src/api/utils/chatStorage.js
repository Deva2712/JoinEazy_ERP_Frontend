// src/api/utils/chatStorage.js

const CHAT_STORAGE_KEY = "funkey_general_chat";

/**
 * Safely retrieves chat messages from localStorage.
 */
const loadChatMessagesFromStorage = () => {
	try {
		const stored = localStorage.getItem(CHAT_STORAGE_KEY);
		return stored ? JSON.parse(stored) : null;
	} catch (error) {
		console.error("❌ Error loading chat messages from storage:", error);
		return null;
	}
};

/**
 * Persists chat messages to localStorage.
 */
export const saveChatMessagesToStorage = (messages) => {
	try {
		localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
	} catch (error) {
		console.error("❌ Error saving chat messages to storage:", error);
	}
};

/**
 * Returns the current state of all chats, initializing if necessary.
 */
export const getChatMessagesFromStorage = () => {
	const stored = loadChatMessagesFromStorage();
	if (stored) return stored;

	const initial = {};
	saveChatMessagesToStorage(initial);
	return initial;
};
