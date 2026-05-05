// src/api/services/upload.service.js

import { apiCall } from "../client";

/**
 * Service for handling file uploads across the application.
 * This includes general-purpose file storage and user profile picture updates.
 */

export const uploadService = {
	// Upload file (general purpose)
	uploadFile: (file, type) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", type);

		return fetch(`${API_BASE_URL}/upload/file`, {
			method: "POST",
			credentials: "include",
			body: formData,
		});
	},

	uploadProfilePicture: (file) => {
		if (USE_MOCK_API) {
			return Promise.resolve({
				ok: true,
				json: async () => ({ path: `avatars/mock_${file.name}` }),
			});
		}
		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", "0");
		return fetch(`${API_BASE_URL}/upload/file`, {
			method: "POST",
			credentials: "include",
			body: formData,
		});
	},
};
