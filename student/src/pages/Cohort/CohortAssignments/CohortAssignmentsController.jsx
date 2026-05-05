import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfessorAssignmentsUI from "./ProfessorAssignmentsUI";
import StudentAssignmentsUI from "./StudentAssignmentsUI";
import { courseService } from "../../../api/services/course.service";

const CohortAssignmentsController = ({ cohortId, cohortData, isStaff }) => {
	const navigate = useNavigate();
	const [assignments, setAssignments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [totalMembers, setTotalMembers] = useState(0);
	const [totalGroups, setTotalGroups] = useState(0);

	// Fetch assignments
	const fetchAssignments = async () => {
		try {
			setLoading(true);
			setError(null);

			console.log("🔄 Fetching assignments for cohort:", cohortId);
			const response = await courseService.getAssignments(cohortId);

			if (response && response.success) {
				let assignments = [];
				let totalMembers = 0;
				let totalGroups = 0;

				if (Array.isArray(response.data)) {
					// Mock API returns array directly
					assignments = response.data;
				} else if (response.data?.assignments) {
					// Backend returns object with assignments
					assignments = response.data.assignments;
					totalMembers = response.data.totalMembers || 0;
					totalGroups = response.data.totalGroups || 0;
				}

				// Normalize field names (handle title, name, assignment_name)
				assignments = assignments.map((assignment) => ({
					...assignment,
					name:
						assignment.name ||
						assignment.title ||
						assignment.assignment_name,
					deadline:
						assignment.deadline ||
						assignment.dueDate ||
						assignment.due_date,
					submissionLink:
						assignment.submissionLink || assignment.submission_link,
					isSubmitted:
						assignment.isSubmitted ||
						assignment.is_submitted ||
						assignment.submitted ||
						assignment.status === "submitted",
					submittedAt:
						assignment.submittedAt ||
						assignment.submitted_at ||
						assignment.submittedDate ||
						assignment.submitted_date,
					groupSubmittedAt:
						assignment.groupSubmittedAt ||
						assignment.group_submitted_at,
				}));

				console.log("✅ Fetched", assignments.length, "assignments");
				setAssignments(assignments);
				setTotalMembers(totalMembers);
				setTotalGroups(totalGroups);
			} else {
				console.error(
					"❌ Failed to fetch assignments:",
					response?.error,
				);
				setError(response?.error || "Failed to load assignments");
				setAssignments([]);
			}
		} catch (error) {
			console.error("❌ Error fetching assignments:", error);
			setError("Failed to load assignments");
			setAssignments([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (cohortId) {
			fetchAssignments();
		}
	}, [cohortId]);

	// Create assignment (Professor only)
	const handleCreateAssignment = async (assignmentData) => {
		try {
			console.log("🔄 Creating assignment:", assignmentData);
			const response = await courseService.createAssignment(
				cohortId,
				assignmentData,
			);

			console.log("📦 API Response:", response);

			if (response && response.success) {
				console.log("✅ Assignment created successfully");

				// Small delay to ensure backend persistence
				await new Promise((resolve) => setTimeout(resolve, 300));

				await fetchAssignments();

				alert("✅ Assignment created successfully!");
				return { success: true };
			} else {
				const errorMsg =
					response?.error ||
					response?.message ||
					"Failed to create assignment";
				console.error("❌ Failed to create assignment:", errorMsg);
				alert(`❌ ${errorMsg}`);
				throw new Error(errorMsg);
			}
		} catch (error) {
			console.error("❌ Error creating assignment:", error);
			alert(
				`❌ Error: ${error.message || "Failed to create assignment"}`,
			);
			throw error;
		}
	};

	// Update assignment (Professor only)
	const handleUpdateAssignment = async (assignmentId, updatedData) => {
		try {
			console.log("🔄 Updating assignment:", assignmentId, updatedData);
			const response = await courseService.updateAssignment(
				cohortId,
				assignmentId,
				updatedData,
			);

			if (response.success) {
				console.log("✅ Assignment updated successfully");
				await fetchAssignments(); // Refresh list
			} else {
				console.error(
					"❌ Failed to update assignment:",
					response.error,
				);
				throw new Error(
					response.error || "Failed to update assignment",
				);
			}
		} catch (error) {
			console.error("Error updating assignment:", error);
			throw error;
		}
	};

	// Delete assignment (Professor only)
	const handleDeleteAssignment = async (assignmentId) => {
		try {
			console.log("🔄 Deleting assignment:", assignmentId);
			const response = await courseService.deleteAssignment(
				cohortId,
				assignmentId,
			);

			if (response.success) {
				console.log("✅ Assignment deleted successfully");
				await fetchAssignments(); // Refresh list
			} else {
				console.error(
					"❌ Failed to delete assignment:",
					response.error,
				);
				throw new Error(
					response.error || "Failed to delete assignment",
				);
			}
		} catch (error) {
			console.error("Error deleting assignment:", error);
			alert(error.message || "Failed to delete assignment");
		}
	};

	// Mark as submitted (Student only)
	const handleMarkSubmitted = async (assignment) => {
		try {
			const assignmentId = assignment.assignment_id || assignment.id;
			console.log("🔄 Marking assignment as submitted:", assignmentId);

			const response = await courseService.markAssignmentSubmitted(
				cohortId,
				assignmentId,
			);

			if (response.success) {
				console.log("✅ Assignment marked as submitted");

				// Update local state immediately
				setAssignments((prevAssignments) =>
					prevAssignments.map((assign) =>
						assign.id === assignmentId ||
						assign.assignment_id === assignmentId
							? {
									...assign,
									isSubmitted: true,
									submittedAt: new Date().toISOString(),
								}
							: assign,
					),
				);

				alert("✅ Assignment marked as submitted successfully!");
			} else {
				console.error(
					"❌ Failed to mark as submitted:",
					response.error,
				);
				alert(`❌ Failed: ${response.message || response.error}`);
			}
		} catch (error) {
			console.error("❌ Error marking as submitted:", error);
			alert(
				`❌ Error: ${error.message || "Failed to mark assignment as submitted"}`,
			);
		}
	};

	// View submissions (Professor only)
	const handleViewSubmissions = (assignment) => {
		console.log("📊 Viewing submissions for:", assignment.name);
		// TODO: Navigate to submissions page or open submissions modal
		// navigate(`/c/${cohortId}/assignments/${assignment.id}/submissions`);
	};

	// Join group (Student only)
	const handleJoinGroup = () => {
		console.log("👥 Navigating to groups page");
		navigate(`/c/${cohortId}/groups`);
	};

	// Render appropriate UI based on user type
	if (isStaff) {
		// Professor View
		return (
			<ProfessorAssignmentsUI
				assignments={assignments}
				loading={loading}
				error={error}
				totalMembers={totalMembers}
				totalGroups={totalGroups}
				onCreateAssignment={handleCreateAssignment}
				onUpdateAssignment={handleUpdateAssignment}
				onDeleteAssignment={handleDeleteAssignment}
				onViewSubmissions={handleViewSubmissions}
			/>
		);
	} else {
		// Student View
		return (
			<StudentAssignmentsUI
				assignments={assignments}
				loading={loading}
				error={error}
				onMarkSubmitted={handleMarkSubmitted}
				onJoinGroup={handleJoinGroup}
			/>
		);
	}
};

export default CohortAssignmentsController;
