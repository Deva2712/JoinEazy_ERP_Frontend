// src/api/utils/announcementStorage.js

const ANNOUNCEMENTS_STORAGE_KEY = "funkey_announcements";

/**
 * Internal helper to safely load announcements from localStorage.
 * This ensures the UI doesn't crash if the stored JSON is malformed.
 */
const loadAnnouncementsFromStorage = () => {
	try {
		const stored = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
		return stored ? JSON.parse(stored) : null;
	} catch (error) {
		console.error("❌ Error loading announcements from storage:", error);
		return null;
	}
};

/**
 * Internal helper to persist the announcement state.
 */
const saveAnnouncementsToStorage = (announcements) => {
	try {
		localStorage.setItem(
			ANNOUNCEMENTS_STORAGE_KEY,
			JSON.stringify(announcements),
		);
	} catch (error) {
		console.error("❌ Error saving announcements to storage:", error);
	}
};

/**
 * Generates a localized welcome message for new cohorts.
 * This serves as the initial state for the announcement UI.
 */
export const createDefaultAnnouncement = (
	cohortId,
	courseName = "this course",
) => ({
	id: Date.now() + cohortId,
	title: "Welcome to the Course!",
	content: `Welcome to ${courseName}! This is your course announcement board. Your instructor will post important updates, assignment deadlines, exam schedules, and other course-related information here. Make sure to check regularly for new announcements.`,
	tags: ["General"],
	priority: null,
	is_pinned: true,
	is_archived: false,
	is_locked: false,
	expiry_date: null,
	author_name: "Course Instructor",
	author_id: 1,
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
	view_count: 0,
	replies_count: 0,
	replies: [],
});

/**
 * Main accessor for announcement data.
 * Initializes storage with an empty object if no data exists.
 */
export const getAnnouncementsFromStorage = () => {
	const stored = loadAnnouncementsFromStorage();
	if (stored) return stored;

	const initial = {};
	saveAnnouncementsToStorage(initial);
	return initial;
};

/**
 * Updates storage with a new announcement object.
 */
export const updateAnnouncementsInStorage = (announcements) => {
	saveAnnouncementsToStorage(announcements);
};
