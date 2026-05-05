import React, { useState, useEffect } from "react";
import { announcementService } from "../../../api/services/announcement.service";
import { discussionService } from "../../../api/services/discussion.service";
import AnnouncementsProfessorUI from "./AnnouncementsProfessorUI";
import AnnouncementsStudentUI from "./AnnouncementsStudentUI";

export default function CohortAnnouncementsController({
	cohortId,
	cohortData,
	isStaff,
}) {
	const [announcements, setAnnouncements] = useState([]);
	const [discussions, setDiscussions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingAnnouncement, setEditingAnnouncement] = useState(null);

	// Get current user info
	const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
	const currentUser = {
		id: authUser.id || authUser.user_id || 1,
		name:
			authUser.name ||
			authUser.display_name ||
			authUser.email ||
			"Anonymous",
		role: isStaff ? "professor" : "student",
	};

	// Fetch announcements
	const fetchAnnouncements = async () => {
		setLoading(true);
		setError(null);
		try {
			const response =
				await announcementService.getAnnouncements(cohortId);
			if (response.success) {
				setAnnouncements(response.data || []);
			} else {
				setError(response.message || "Failed to load announcements");
			}
		} catch (err) {
			setError("Failed to load announcements");
			console.error("Error fetching announcements:", err);
		} finally {
			setLoading(false);
		}
	};

	// Fetch discussions (for both students and professors)
	const fetchDiscussions = async () => {
		try {
			const response = await discussionService.getDiscussions(
				cohortId,
				currentUser.id,
			);
			if (response.success) {
				setDiscussions(response.data || []);
			}
		} catch (err) {
			console.error("Error fetching discussions:", err);
		}
	};

	useEffect(() => {
		if (cohortId) {
			fetchAnnouncements();
			fetchDiscussions(); // Fetch discussions for both professors and students
		}
	}, [cohortId, isStaff]);

	// Create announcement
	const handleCreateAnnouncement = async (announcementData) => {
		try {
			const response = await announcementService.createAnnouncement(
				cohortId,
				announcementData,
			);
			if (response.success) {
				await fetchAnnouncements();
				setShowCreateModal(false);
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error creating announcement:", err);
			return { success: false, message: "Failed to create announcement" };
		}
	};

	// Update announcement
	const handleUpdateAnnouncement = async (
		announcementId,
		announcementData,
	) => {
		try {
			const response = await announcementService.updateAnnouncement(
				cohortId,
				announcementId,
				announcementData,
			);
			if (response.success) {
				await fetchAnnouncements();
				setShowEditModal(false);
				setEditingAnnouncement(null);
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error updating announcement:", err);
			return { success: false, message: "Failed to update announcement" };
		}
	};

	// Delete announcement
	const handleDeleteAnnouncement = async (announcementId) => {
		try {
			const response = await announcementService.deleteAnnouncement(
				cohortId,
				announcementId,
			);
			if (response.success) {
				await fetchAnnouncements();
				if (selectedAnnouncement?.id === announcementId) {
					setSelectedAnnouncement(null);
				}
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error deleting announcement:", err);
			return { success: false, message: "Failed to delete announcement" };
		}
	};

	// Toggle pin announcement
	const handleTogglePin = async (announcementId, isPinned) => {
		try {
			const response = await announcementService.togglePinAnnouncement(
				cohortId,
				announcementId,
				isPinned,
			);
			if (response.success) {
				await fetchAnnouncements();
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error toggling pin:", err);
			return { success: false, message: "Failed to toggle pin" };
		}
	};

	// Archive announcement
	const handleArchiveAnnouncement = async (announcementId) => {
		try {
			const response = await announcementService.archiveAnnouncement(
				cohortId,
				announcementId,
			);
			if (response.success) {
				await fetchAnnouncements();
				if (selectedAnnouncement?.id === announcementId) {
					setSelectedAnnouncement(null);
				}
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error archiving announcement:", err);
			return {
				success: false,
				message: "Failed to archive announcement",
			};
		}
	};

	// Add reply to announcement
	const handleAddReply = async (announcementId, replyData) => {
		try {
			const response = await announcementService.addReply(
				cohortId,
				announcementId,
				replyData,
			);
			if (response.success) {
				await fetchAnnouncements();
				// Update selected announcement if viewing details - wait for state update
				if (selectedAnnouncement?.id === announcementId) {
					// Refetch to get the latest data with new reply
					setTimeout(async () => {
						const updatedResponse =
							await announcementService.getAnnouncements(
								cohortId,
							);
						if (updatedResponse.success) {
							const updatedAnnouncement =
								updatedResponse.data.find(
									(a) => a.id === announcementId,
								);
							if (updatedAnnouncement) {
								setSelectedAnnouncement(updatedAnnouncement);
							}
						}
					}, 100);
				}
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error adding reply:", err);
			return { success: false, message: "Failed to add reply" };
		}
	};

	// Delete reply
	const handleDeleteReply = async (announcementId, replyId) => {
		try {
			const response = await announcementService.deleteReply(
				cohortId,
				announcementId,
				replyId,
			);
			if (response.success) {
				await fetchAnnouncements();
				// Update selected announcement if viewing details - wait for state update
				if (selectedAnnouncement?.id === announcementId) {
					setTimeout(async () => {
						const updatedResponse =
							await announcementService.getAnnouncements(
								cohortId,
							);
						if (updatedResponse.success) {
							const updatedAnnouncement =
								updatedResponse.data.find(
									(a) => a.id === announcementId,
								);
							if (updatedAnnouncement) {
								setSelectedAnnouncement(updatedAnnouncement);
							}
						}
					}, 100);
				}
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error deleting reply:", err);
			return { success: false, message: "Failed to delete reply" };
		}
	};

	// Upvote reply
	const handleUpvoteReply = async (announcementId, replyId) => {
		try {
			const response = await announcementService.upvoteReply(
				cohortId,
				announcementId,
				replyId,
			);
			if (response.success) {
				await fetchAnnouncements();
				// Update selected announcement if viewing details - wait for state update
				if (selectedAnnouncement?.id === announcementId) {
					setTimeout(async () => {
						const updatedResponse =
							await announcementService.getAnnouncements(
								cohortId,
							);
						if (updatedResponse.success) {
							const updatedAnnouncement =
								updatedResponse.data.find(
									(a) => a.id === announcementId,
								);
							if (updatedAnnouncement) {
								setSelectedAnnouncement(updatedAnnouncement);
							}
						}
					}, 100);
				}
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error upvoting reply:", err);
			return { success: false, message: "Failed to upvote reply" };
		}
	};

	// Lock/unlock thread
	const handleToggleLock = async (announcementId, isLocked) => {
		try {
			const response = await announcementService.toggleLockThread(
				cohortId,
				announcementId,
				isLocked,
			);
			if (response.success) {
				await fetchAnnouncements();
				// Update selected announcement if viewing details - wait for state update
				if (selectedAnnouncement?.id === announcementId) {
					// Refetch to get the latest data with updated lock status
					setTimeout(async () => {
						const updatedResponse =
							await announcementService.getAnnouncements(
								cohortId,
							);
						if (updatedResponse.success) {
							const updatedAnnouncement =
								updatedResponse.data.find(
									(a) => a.id === announcementId,
								);
							if (updatedAnnouncement) {
								setSelectedAnnouncement(updatedAnnouncement);
							}
						}
					}, 100);
				}
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error toggling lock:", err);
			return { success: false, message: "Failed to toggle lock" };
		}
	};

	// Open edit modal
	const handleEditClick = (announcement) => {
		setEditingAnnouncement(announcement);
		setShowEditModal(true);
	};

	// Handle creating discussion
	const handleCreateDiscussion = async (discussionData) => {
		try {
			const response = await discussionService.createDiscussion(
				cohortId,
				discussionData,
			);
			if (response.success) {
				await fetchDiscussions();
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error creating discussion:", err);
			return { success: false, message: "Failed to create discussion" };
		}
	};

	// Handle deleting discussion
	const handleDeleteDiscussion = async (discussionId) => {
		try {
			const response = await discussionService.deleteDiscussion(
				cohortId,
				discussionId,
			);
			if (response.success) {
				await fetchDiscussions();
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error deleting discussion:", err);
			return { success: false, message: "Failed to delete discussion" };
		}
	};

	// Handle editing discussion
	const handleEditDiscussion = async (discussionId, updatedData) => {
		try {
			const response = await discussionService.editDiscussion(
				cohortId,
				discussionId,
				updatedData,
			);
			if (response.success) {
				await fetchDiscussions();
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error editing discussion:", err);
			return { success: false, message: "Failed to edit discussion" };
		}
	};

	// Handle liking discussion
	const handleLikeDiscussion = async (discussionId) => {
		try {
			const response = await discussionService.likeDiscussion(
				cohortId,
				discussionId,
				currentUser.id,
			);
			if (response.success) {
				await fetchDiscussions();
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error liking discussion:", err);
			return { success: false, message: "Failed to like discussion" };
		}
	};

	// Handle adding discussion reply
	const handleAddDiscussionReply = async (discussionId, replyData) => {
		try {
			const response = await discussionService.addReply(
				cohortId,
				discussionId,
				replyData,
			);
			if (response.success) {
				await fetchDiscussions();
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error adding discussion reply:", err);
			return { success: false, message: "Failed to add reply" };
		}
	};

	// Handle deleting discussion reply
	const handleDeleteDiscussionReply = async (discussionId, replyId) => {
		try {
			const response = await discussionService.deleteReply(
				cohortId,
				discussionId,
				replyId,
			);
			if (response.success) {
				await fetchDiscussions();
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error deleting discussion reply:", err);
			return { success: false, message: "Failed to delete reply" };
		}
	};

	// Handle editing discussion reply
	const handleEditDiscussionReply = async (
		discussionId,
		replyId,
		updatedData,
	) => {
		try {
			const response = await discussionService.editReply(
				cohortId,
				discussionId,
				replyId,
				updatedData,
			);
			if (response.success) {
				await fetchDiscussions();
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error editing discussion reply:", err);
			return { success: false, message: "Failed to edit reply" };
		}
	};

	// Handle liking discussion reply
	const handleLikeDiscussionReply = async (discussionId, replyId) => {
		try {
			const response = await discussionService.likeReply(
				cohortId,
				discussionId,
				replyId,
				currentUser.id,
			);
			if (response.success) {
				await fetchDiscussions();
				return { success: true };
			} else {
				return { success: false, message: response.message };
			}
		} catch (err) {
			console.error("Error liking discussion reply:", err);
			return { success: false, message: "Failed to like reply" };
		}
	};

	const commonProps = {
		announcements,
		discussions,
		currentUser,
		loading,
		error,
		selectedAnnouncement,
		setSelectedAnnouncement,
		onRefresh: fetchAnnouncements,
		onAddReply: handleAddReply,
		onDeleteReply: handleDeleteReply,
		onUpvoteReply: handleUpvoteReply,
		onCreateDiscussion: handleCreateDiscussion,
		onDeleteDiscussion: handleDeleteDiscussion,
		onEditDiscussion: handleEditDiscussion,
		onLikeDiscussion: handleLikeDiscussion,
		onAddDiscussionReply: handleAddDiscussionReply,
		onDeleteDiscussionReply: handleDeleteDiscussionReply,
		onEditDiscussionReply: handleEditDiscussionReply,
		onLikeDiscussionReply: handleLikeDiscussionReply,
	};

	if (isStaff) {
		return (
			<AnnouncementsProfessorUI
				{...commonProps}
				showCreateModal={showCreateModal}
				setShowCreateModal={setShowCreateModal}
				showEditModal={showEditModal}
				setShowEditModal={setShowEditModal}
				editingAnnouncement={editingAnnouncement}
				onCreateAnnouncement={handleCreateAnnouncement}
				onUpdateAnnouncement={handleUpdateAnnouncement}
				onDeleteAnnouncement={handleDeleteAnnouncement}
				onTogglePin={handleTogglePin}
				onArchiveAnnouncement={handleArchiveAnnouncement}
				onToggleLock={handleToggleLock}
				onEditClick={handleEditClick}
			/>
		);
	} else {
		return <AnnouncementsStudentUI {...commonProps} />;
	}
}
