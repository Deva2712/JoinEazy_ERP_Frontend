// src/api/utils/discussionStorage.js

const DISCUSSIONS_STORAGE_KEY = "funkey_student_discussions";

const loadDiscussionsFromStorage = () => {
	try {
		const stored = localStorage.getItem(DISCUSSIONS_STORAGE_KEY);
		return stored ? JSON.parse(stored) : null;
	} catch (error) {
		console.error("❌ Error loading discussions from storage:", error);
		return null;
	}
};

export const saveDiscussionsToStorage = (discussions) => {
	try {
		localStorage.setItem(
			DISCUSSIONS_STORAGE_KEY,
			JSON.stringify(discussions),
		);
	} catch (error) {
		console.error("❌ Error saving discussions to storage:", error);
	}
};

export const getDiscussionsFromStorage = () => {
	const stored = loadDiscussionsFromStorage();
	if (stored) return stored;

	const initial = {};
	saveDiscussionsToStorage(initial);
	return initial;
};
