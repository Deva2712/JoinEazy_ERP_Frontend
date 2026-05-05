// CohortMembersController.jsx

import React, { useState, useEffect } from "react";
import { RefreshCw, X } from "lucide-react";
import { courseService } from "../../../api/services/course.service";
import { checkLoginStatus } from "../../../services/auth";
import CohortMembersUI from "./CohortMembersUI";
import CohortMembersProfileController from "./CohortMembersProfileController";
import GroupDetailsModal from "./GroupDetailsModal";
import CreateGradingModal from "./CreateGradingModal";
import GradeVisibilityModal from "./GradeVisibilityModal";

// Inline helpers to avoid external util file
const getRollNumberFromEmail = (email) => {
	if (!email) return "Unknown";
	const emailPrefix = email.split("@")[0];
	if (/^[A-Za-z]{2}\d{2}[A-Za-z]{4}\d{3}$/.test(emailPrefix)) {
		return emailPrefix.toUpperCase();
	}
	if (
		emailPrefix.toLowerCase().includes("new") ||
		emailPrefix.toLowerCase().includes("user")
	) {
		return emailPrefix.toUpperCase();
	}
	return emailPrefix.toUpperCase();
};

const getMemberDisplayName = (member) => {
	const displayName = (
		member?.display_name ||
		member?.username ||
		member?.name ||
		member?.email ||
		""
	).toString();
	const email = member?.email || "";
	if (
		displayName.toLowerCase().includes("new user") ||
		displayName.toLowerCase().includes("newuser")
	) {
		return getRollNumberFromEmail(email);
	}
	if (displayName && displayName.trim() !== "") {
		return displayName;
	}
	return getRollNumberFromEmail(email);
};

const getMemberInitial = (member) => {
	return getMemberDisplayName(member).charAt(0).toUpperCase();
};

// Enhanced Create Group Modal with Project Name
const CreateGroupModal = ({
	isOpen,
	onClose,
	onSubmit,
	availableMembers,
	maxGroupMembers = 4,
	minGroupMembers = 1,
	isStaff = false,
}) => {
	const [groupName, setGroupName] = useState("");
	const [projectName, setProjectName] = useState("");
	const [groupDescription, setGroupDescription] = useState("");
	const [selectedMembers, setSelectedMembers] = useState([]);
	const [memberSearchTerm, setMemberSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Filter members based on search term
	const filteredMembers = availableMembers.filter(
		(member) =>
			member.name
				.toLowerCase()
				.includes(memberSearchTerm.toLowerCase()) ||
			member.email.toLowerCase().includes(memberSearchTerm.toLowerCase()),
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!groupName.trim()) {
			setError("Group name is required");
			return;
		}

		if (!projectName.trim()) {
			setError("Project name is required");
			return;
		}

		// The creator is auto-added by backend only for students, not professors
		const maxSelectable = isStaff
			? maxGroupMembers
			: Math.max(0, maxGroupMembers - 1);

		if (selectedMembers.length > maxSelectable) {
			setError(
				`Cannot add more than ${maxSelectable} ${isStaff ? "members" : "additional members"} to a group`,
			);
			return;
		}

		// Enforce minimum members per group (including creator for students)
		const currentGroupSize = isStaff
			? selectedMembers.length
			: 1 + selectedMembers.length;
		if (currentGroupSize < minGroupMembers) {
			setError(
				`At least ${minGroupMembers} members are required to create a group`,
			);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			await onSubmit({
				name: groupName,
				projectName: projectName,
				description: groupDescription,
				members: selectedMembers,
				availableMembers: availableMembers,
			});
			setGroupName("");
			setProjectName("");
			setGroupDescription("");
			setSelectedMembers([]);
			setMemberSearchTerm("");
		} catch (err) {
			setError(err.message || "Failed to create group");
		} finally {
			setLoading(false);
		}
	};

	const handleMemberToggle = (memberId) => {
		const maxSelectable = isStaff
			? maxGroupMembers
			: Math.max(0, maxGroupMembers - 1);

		console.log("handleMemberToggle called with memberId:", memberId);
		console.log("Current selectedMembers:", selectedMembers);
		console.log("Available members:", availableMembers);

		if (selectedMembers.includes(memberId)) {
			setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
		} else {
			// Enforce max selectable based on user type
			if (selectedMembers.length >= maxSelectable) {
				setError(
					`Cannot add more than ${maxSelectable} ${isStaff ? "members" : "additional members"} to a group`,
				);
				return;
			}
			setSelectedMembers([...selectedMembers, memberId]);
			setError(null); // Clear any previous errors
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
				<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Create Group
					</h3>
					<button
						onClick={onClose}
						className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X
							size={20}
							className="text-gray-600 dark:text-gray-400"
						/>
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-4">
					<form onSubmit={handleSubmit} className="space-y-3">
						{/* Group Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Group Name *
							</label>
							<input
								type="text"
								value={groupName}
								onChange={(e) => setGroupName(e.target.value)}
								className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter group name"
								required
							/>
						</div>

						{/* Project Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Project Name *
							</label>
							<input
								type="text"
								value={projectName}
								onChange={(e) => setProjectName(e.target.value)}
								className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter project name"
								required
							/>
						</div>

						{/* Capacity Information */}
						<div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5 py-1">
							<div>
								Minimum: {minGroupMembers} • Maximum:{" "}
								{maxGroupMembers}
							</div>
							<div>
								{isStaff ? (
									<>
										Joined: {selectedMembers.length}/
										{maxGroupMembers}
									</>
								) : (
									<>
										You will be added automatically as the
										group leader. Joined:{" "}
										{1 + selectedMembers.length}/
										{maxGroupMembers}
									</>
								)}
							</div>
						</div>

						{/* Member Search */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Search Members
							</label>
							<input
								type="text"
								value={memberSearchTerm}
								onChange={(e) =>
									setMemberSearchTerm(e.target.value)
								}
								className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Search by roll number"
							/>
						</div>

						{/* Members List */}
						<div className="border border-gray-200 dark:border-gray-700 rounded-md max-h-48 overflow-y-auto">
							{filteredMembers.map((member) => (
								<label
									key={member.id}
									className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
								>
									<div className="flex items-center gap-2.5">
										<input
											type="checkbox"
											checked={selectedMembers.includes(
												member.id,
											)}
											onChange={() =>
												handleMemberToggle(member.id)
											}
											className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
										/>
										<div>
											<div className="text-sm font-medium text-gray-900 dark:text-white">
												{getMemberDisplayName(member)}
											</div>
											<div className="text-xs text-gray-500 dark:text-gray-400">
												{member.email}
											</div>
										</div>
									</div>
								</label>
							))}
						</div>

						{error && (
							<div className="text-sm text-red-600 dark:text-red-400">
								{error}
							</div>
						)}

						<div className="flex justify-end gap-2 pt-2">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={loading}
								className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
							>
								{loading ? "Creating..." : "Create Group"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

const CohortMembersController = ({ cohortId, cohortData, isStaff }) => {
	const [members, setMembers] = useState([]);
	const [filteredMembers, setFilteredMembers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [sortBy, setSortBy] = useState("A-Z");
	const [memberType, setMemberType] = useState("Individual");
	const [searchTerm, setSearchTerm] = useState("");
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [showGroupModal, setShowGroupModal] = useState(false);
	const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
	const [selectedProfileId, setSelectedProfileId] = useState(null);
	const [selectedGroupId, setSelectedGroupId] = useState(null);
	const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
	const [member_type, setMember_type] = useState("individual");
	const [isInGroup, setIsInGroup] = useState(false);
	const [currentUserId, setCurrentUserId] = useState(null);
	const [totalGroups, setTotalGroups] = useState(0);
	const [membersInGroups, setMembersInGroups] = useState(0);
	const [showCreateGradingModal, setShowCreateGradingModal] = useState(false);
	const [showVisibilityModal, setShowVisibilityModal] = useState(false);

	// Grading view state
	const [allAssignments, setAllAssignments] = useState([]); // Store all assignments from API
	const [assignments, setAssignments] = useState([]); // Filtered assignments for display
	const [grades, setGrades] = useState({});

	// Fetch members from API
	const fetchMembers = async () => {
		try {
			setLoading(true);
			setError(null);

			console.log("Fetching members for cohortId:", cohortId);

			if (!cohortId) {
				throw new Error("No cohort ID provided");
			}

			const response = await courseService.getCourseMembers(cohortId);
			console.log("Members API response:", response);

			if (response.success) {
				const participantsData = response.data.participants || [];
				const groupsData = response.data.groups || [];

				console.log("Participants data:", participantsData);
				console.log("Groups data:", groupsData);
				console.log("Groups data length:", groupsData.length);

				// Debug each group's members and structure
				groupsData.forEach((group, index) => {
					console.log(`Group ${index + 1} (${group.group_name}):`, {
						id: group.id,
						name: group.group_name,
						members: group.CohortGroupMembers,
						memberCount: group.CohortGroupMembers?.length || 0,
						fullGroupData: group, // Log full structure to see available fields
					});
				});

				// Check if user is in a group
				if (response.data.is_group) {
					setIsInGroup(true);
				} else {
					setIsInGroup(false);
				}

				// Transform participants data
				const transformedParticipants = participantsData.map(
					(participant, index) => {
						// Check if this participant is in a group
						let groupId = null;
						let isInGroup = false;
						let groupName = null;

						const participantUserId =
							participant.user_details?.user_id ||
							participant.user_id;
						console.log(
							`🔍 Transforming participant ${index + 1}:`,
							{
								email: participant.email,
								user_id: participantUserId,
								display_name:
									participant.user_details?.display_name,
							},
						);

						// Look through all groups to see if this participant is a member
						for (const group of groupsData) {
							if (
								group.CohortGroupMembers &&
								Array.isArray(group.CohortGroupMembers)
							) {
								const isMember = group.CohortGroupMembers.some(
									(member) =>
										member.user_id === participantUserId,
								);
								if (isMember) {
									groupId = group.id;
									isInGroup = true;
									groupName = group.group_name; // Store the group name
									console.log(
										`Participant ${participant.email} (ID: ${participantUserId}) is in group ${group.group_name} (ID: ${group.id})`,
									);
									break;
								}
							}
						}

						// Derive consistent roll/name from display_name or email local-part, always uppercase
						const displayNameFromAPI =
							participant.user_details?.display_name ||
							participant.user_details?.username;
						const usernameFromAPI =
							participant.user_details?.username ||
							participant.user_details?.display_name;
						const emailPrefix = participant.email
							.split("@")[0]
							.toUpperCase();

						const transformedMember = {
							id: `participant-${index + 1}`,
							realUserId:
								participant.user_details?.user_id ||
								participant.user_id,
							display_name: displayNameFromAPI, // Store display_name from API
							username: usernameFromAPI, // Store username from API
							name: displayNameFromAPI || emailPrefix, // Fallback to email prefix
							email: participant.email,
							avatar:
								participant.user_details?.profile_pic ||
								`https://randomuser.me/api/portraits/men/${index + 1}.jpg`,
							description: participant.user_details
								? "Registered User"
								: "Invited (Not Registered)",
							type: "individual",
							groupId: groupId,
							groupName: groupName, // Add group name to the member object
							isInGroup: isInGroup,
							isActive:
								participant.user_details?.is_active !== false,
							projectName: "",
							joinedDate:
								participant.user_details?.created_at ||
								new Date().toISOString(),
							submissions: "0/0",
						};

						console.log(`✅ Transformed member ${index + 1}:`, {
							name: transformedMember.name,
							realUserId: transformedMember.realUserId,
							email: transformedMember.email,
						});

						return transformedMember;
					},
				);

				// Transform groups data (without user-specific flags initially)
				const transformedGroups = groupsData.map((group, index) => ({
					id: `group-${group.id}`,
					name: group.group_name,
					email: "",
					avatar: `https://randomuser.me/api/portraits/men/${index + 1}.jpg`,
					description:
						group.group_description ||
						`Group (${group.CohortGroupMembers?.length || 0} members)`,
					type: "group",
					groupId: group.id,
					isActive: true,
					projectName: group.project_name || "",
					joinedDate: group.created_at,
					submissions: "0/0",
					memberCount: group.CohortGroupMembers?.length || 0,
					maxMembers: cohortData?.max_groups_members || 4,
					groupMembers: group.CohortGroupMembers || [], // Store group members for later processing
					isCurrentUserGroup: false, // Will be set in the filter/sort useEffect
				}));

				// Combine participants and groups
				const allMembers = [
					...transformedParticipants,
					...transformedGroups,
				];

				// Calculate group statistics
				const totalGroupsCount = transformedGroups.length;
				const membersInGroupsCount = groupsData.reduce(
					(total, group) => {
						return total + (group.CohortGroupMembers?.length || 0);
					},
					0,
				);

				console.log("Group Statistics:", {
					totalGroups: totalGroupsCount,
					membersInGroups: membersInGroupsCount,
				});

				// Update state with statistics
				setTotalGroups(totalGroupsCount);
				setMembersInGroups(membersInGroupsCount);

				console.log("Transformed members:", allMembers);

				setMembers(allMembers);
				setFilteredMembers(allMembers);
			} else {
				console.error("API returned error:", response.error);
				setError(response.error || "Failed to fetch members");
				setMembers([]);
				setFilteredMembers([]);
			}
		} catch (error) {
			console.error("Error fetching members:", error);
			setError("Failed to load members");
			setMembers([]);
			setFilteredMembers([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (cohortId) {
			fetchMembers();
		}
	}, [cohortId]);

	// Fetch assignments and grades for both professors and students
	useEffect(() => {
		if (cohortId) {
			fetchAssignmentsAndGrades();
		}
	}, [cohortId, members]);

	// Fetch assignments and grades
	const fetchAssignmentsAndGrades = async () => {
		try {
			const assignmentsResponse =
				await courseService.getAssignments(cohortId);
			const fetchedAssignments =
				assignmentsResponse.data?.assignments || [];

			if (assignmentsResponse.success) {
				setAllAssignments(fetchedAssignments); // Store all assignments
				setAssignments(fetchedAssignments); // Initially show all
			}

			// Try to load grades from localStorage first
			const storageKey = `grades_${cohortId}`;
			const storedGrades = localStorage.getItem(storageKey);

			if (storedGrades) {
				// Use stored grades if available
				setGrades(JSON.parse(storedGrades));
			} else {
				// Initialize grades with submission status for submitted assignments
				const initialGrades = {};

				// For each submitted assignment, mark all members as submitted
				fetchedAssignments.forEach((assignment) => {
					if (assignment.status === "submitted") {
						members.forEach((member) => {
							if (member.type === "individual") {
								const gradeKey = `${member.realUserId}_${assignment.id}`;
								initialGrades[gradeKey] = {
									isSubmitted: true,
									submittedAt: assignment.submittedAt || null,
								};
							}
						});
					}
				});

				setGrades(initialGrades);
			}
		} catch (error) {
			console.error("Error fetching assignments:", error);
		}
	};

	// Handle grade submission
	const handleGradeSubmit = async (
		member,
		assignment,
		score,
		feedback,
		isGroupGrading,
	) => {
		try {
			// TODO: Replace with actual API call
			// await courseService.submitGrade(cohortId, memberId, assignmentId, score, feedback);

			const updatedGrades = { ...grades };

			// Check if assignment was late (deadline passed)
			const wasLate =
				assignment.deadline &&
				new Date() > new Date(assignment.deadline);

			if (isGroupGrading) {
				// If grading from Individual tab, find the group members
				if (member.groupMembers) {
					// Already have group members (grading from Groups tab)
					member.groupMembers.forEach((groupMember) => {
						const gradeKey = `${groupMember.user_id}_${assignment.id}`;
						const existingGrade = updatedGrades[gradeKey] || {};
						const submittedAt =
							existingGrade.submittedAt ||
							new Date().toISOString();

						updatedGrades[gradeKey] = {
							...existingGrade,
							score,
							feedback,
							submittedAt,
							isSubmitted: true,
							wasLate,
						};
					});
				} else if (member.groupId) {
					// Grading from Individual tab - find the group and its members
					const group = members.find(
						(m) =>
							m.type === "group" && m.groupId === member.groupId,
					);
					if (group && group.groupMembers) {
						group.groupMembers.forEach((groupMember) => {
							const gradeKey = `${groupMember.user_id}_${assignment.id}`;
							const existingGrade = updatedGrades[gradeKey] || {};
							const submittedAt =
								existingGrade.submittedAt ||
								new Date().toISOString();

							updatedGrades[gradeKey] = {
								...existingGrade,
								score,
								feedback,
								submittedAt,
								isSubmitted: true,
								wasLate,
							};
						});
					} else {
						// Fallback: just update the current member using realUserId
						const gradeKey = `${member.realUserId}_${assignment.id}`;
						const existingGrade = updatedGrades[gradeKey] || {};
						const submittedAt =
							existingGrade.submittedAt ||
							new Date().toISOString();

						updatedGrades[gradeKey] = {
							...existingGrade,
							score,
							feedback,
							submittedAt,
							isSubmitted: true,
							wasLate,
						};
					}
				}
			} else {
				// Apply grade to individual member using realUserId
				const gradeKey = `${member.realUserId}_${assignment.id}`;
				const existingGrade = updatedGrades[gradeKey] || {};
				const submittedAt =
					existingGrade.submittedAt || new Date().toISOString();

				updatedGrades[gradeKey] = {
					...existingGrade,
					score,
					feedback,
					submittedAt,
					isSubmitted: true,
					wasLate,
				};
			}

			setGrades(updatedGrades);

			// Persist to localStorage
			const storageKey = `grades_${cohortId}`;
			localStorage.setItem(storageKey, JSON.stringify(updatedGrades));

			return { success: true };
		} catch (error) {
			console.error("Error submitting grade:", error);
			return { success: false, error };
		}
	};

	// Helper function to mark assignment as submitted (for demo/testing purposes)
	// Usage from console: window.markAssignmentSubmitted(userId, assignmentId)
	useEffect(() => {
		if (typeof window !== "undefined") {
			window.markAssignmentSubmitted = (userId, assignmentId) => {
				const updatedGrades = { ...grades };
				const gradeKey = `${userId}_${assignmentId}`;
				const submittedAt = new Date().toISOString();

				// If grade already exists, just update isSubmitted
				if (updatedGrades[gradeKey]) {
					updatedGrades[gradeKey] = {
						...updatedGrades[gradeKey],
						isSubmitted: true,
						submittedAt: submittedAt,
					};
				} else {
					// Create new entry with isSubmitted flag and timestamp
					updatedGrades[gradeKey] = {
						isSubmitted: true,
						submittedAt: submittedAt,
					};
				}

				setGrades(updatedGrades);

				// Persist to localStorage
				const storageKey = `grades_${cohortId}`;
				localStorage.setItem(storageKey, JSON.stringify(updatedGrades));

				console.log(
					`✅ Marked assignment ${assignmentId} as submitted for user ${userId}`,
				);
				console.log("Updated grade:", updatedGrades[gradeKey]);
			};

			// Helper to mark all assignments as submitted for a user
			window.markAllAssignmentsSubmitted = (userId) => {
				const updatedGrades = { ...grades };
				const submittedAt = new Date().toISOString();

				assignments.forEach((assignment) => {
					const gradeKey = `${userId}_${assignment.id}`;
					if (updatedGrades[gradeKey]) {
						updatedGrades[gradeKey] = {
							...updatedGrades[gradeKey],
							isSubmitted: true,
							submittedAt: submittedAt,
						};
					} else {
						updatedGrades[gradeKey] = {
							isSubmitted: true,
							submittedAt: submittedAt,
						};
					}
				});

				setGrades(updatedGrades);

				const storageKey = `grades_${cohortId}`;
				localStorage.setItem(storageKey, JSON.stringify(updatedGrades));

				console.log(
					`✅ Marked all assignments as submitted for user ${userId}`,
				);
			};

			// Helper to log available users and assignments
			window.listUsersAndAssignments = () => {
				console.log("📋 Available Users:");
				members
					.filter((m) => m.type === "individual")
					.forEach((m) => {
						console.log(
							`- User ID: ${m.realUserId}, Name: ${getMemberDisplayName(m)}, Email: ${m.email}`,
						);
					});
				console.log("\n📝 Available Assignments:");
				assignments.forEach((a) => {
					console.log(
						`- Assignment ID: ${a.id}, Name: ${a.name}, Type: ${a.type}`,
					);
				});
				console.log("\n💡 Usage examples:");
				console.log(
					"  window.markAssignmentSubmitted(userId, assignmentId)",
				);
				console.log("  window.markAllAssignmentsSubmitted(userId)");
			};
		}
	}, [grades, assignments, members, cohortId]);

	// Fetch current user id and user type
	useEffect(() => {
		(async () => {
			const status = await checkLoginStatus();
			if (status?.isLoggedIn && status.user?.user_id) {
				setCurrentUserId(status.user.user_id);
			}
		})();
	}, []);

	// Show all assignments for both professors and students
	useEffect(() => {
		if (allAssignments.length > 0) {
			setAssignments(allAssignments);
		}
	}, [allAssignments]);

	// Filter and sort members
	useEffect(() => {
		let filtered = [...members];

		// Update isCurrentUserGroup flag for groups when currentUserId is available
		filtered = filtered.map((member) => {
			if (
				member.type === "group" &&
				currentUserId &&
				member.groupMembers
			) {
				const isCurrentUserInGroup = member.groupMembers.some(
					(groupMember) => groupMember.user_id === currentUserId,
				);
				console.log(
					`Group ${member.name}: Current user (${currentUserId}) in group:`,
					isCurrentUserInGroup,
					"Group members:",
					member.groupMembers.map((m) => m.user_id),
				);
				return {
					...member,
					isCurrentUserGroup: isCurrentUserInGroup,
				};
			}
			return member;
		});

		// Filter by member type (Groups vs Individual)
		if (memberType === "Groups") {
			filtered = filtered.filter((member) => member.type === "group");
		} else if (memberType === "Individual") {
			filtered = filtered.filter(
				(member) => member.type === "individual",
			);
		}

		// Filter by search term
		if (searchTerm && searchTerm.trim()) {
			const searchLower = searchTerm.toLowerCase().trim();
			filtered = filtered.filter((member) => {
				const name = getMemberDisplayName(member).toLowerCase();
				const email = (member.email || "").toLowerCase();
				const groupName = (member.groupName || "").toLowerCase();
				const projectName = (member.projectName || "").toLowerCase();

				// For groups, also search within group members' roll numbers
				if (
					member.type === "group" &&
					member.groupMembers &&
					Array.isArray(member.groupMembers)
				) {
					const groupMemberMatches = member.groupMembers.some(
						(groupMember) => {
							// Handle different possible structures of group member data
							const memberData =
								groupMember.user_details ||
								groupMember.User ||
								groupMember;
							const memberName =
								getMemberDisplayName(memberData).toLowerCase();
							const memberEmail = (
								memberData.email || ""
							).toLowerCase();
							const rollNumber = getRollNumberFromEmail(
								memberData.email,
							).toLowerCase();

							// Debug log for group member search
							console.log(
								`Searching in group "${member.name}" for "${searchLower}":`,
								{
									memberName,
									memberEmail,
									rollNumber,
									memberData,
									matches:
										memberName.includes(searchLower) ||
										memberEmail.includes(searchLower) ||
										rollNumber.includes(searchLower),
								},
							);

							return (
								memberName.includes(searchLower) ||
								memberEmail.includes(searchLower) ||
								rollNumber.includes(searchLower)
							);
						},
					);
					if (groupMemberMatches) {
						console.log(
							`Group "${member.name}" matches search term "${searchLower}"`,
						);
						return true;
					}
				}

				// For individual members, also search by roll number
				if (member.type === "individual") {
					const rollNumber = getRollNumberFromEmail(
						member.email,
					).toLowerCase();
					if (rollNumber.includes(searchLower)) {
						return true;
					}
				}

				return (
					name.includes(searchLower) ||
					email.includes(searchLower) ||
					groupName.includes(searchLower) ||
					projectName.includes(searchLower)
				);
			});
		}

		// Sort members
		filtered.sort((a, b) => {
			// For Individual members, pin current user at the top
			if (memberType === "Individual" && currentUserId) {
				const aIsCurrentUser = a.realUserId === currentUserId;
				const bIsCurrentUser = b.realUserId === currentUserId;

				if (aIsCurrentUser && !bIsCurrentUser) return -1; // a (current user) comes first
				if (bIsCurrentUser && !aIsCurrentUser) return 1; // b (current user) comes first
			}

			// For Groups, pin current user's group at the top
			if (memberType === "Groups" && currentUserId) {
				const aIsCurrentUserGroup = a.isCurrentUserGroup;
				const bIsCurrentUserGroup = b.isCurrentUserGroup;

				if (aIsCurrentUserGroup && !bIsCurrentUserGroup) return -1; // a (user's group) comes first
				if (bIsCurrentUserGroup && !aIsCurrentUserGroup) return 1; // b (user's group) comes first
			}

			// Regular sorting for everyone else
			if (sortBy === "A-Z") {
				return a.name.localeCompare(b.name);
			} else if (sortBy === "Z-A") {
				return b.name.localeCompare(a.name);
			}
			return 0;
		});

		// Update the main members state if currentUserId became available and groups were updated
		const hasGroupsUpdated = filtered.some(
			(member, index) =>
				member.type === "group" &&
				members[members.findIndex((m) => m.id === member.id)]
					?.isCurrentUserGroup !== member.isCurrentUserGroup,
		);

		if (hasGroupsUpdated && currentUserId) {
			// Update the members state with the new isCurrentUserGroup flags
			const updatedMembers = members.map((member) => {
				const updatedMember = filtered.find((f) => f.id === member.id);
				return updatedMember || member;
			});
			setMembers(updatedMembers);
		}

		setFilteredMembers(filtered);
	}, [members, sortBy, memberType, searchTerm, currentUserId]);

	const handleCreateGroup = () => {
		// Check if student is already in a group
		if (!isStaff && isInGroup) {
			alert("You are already in a group");
			return;
		}
		setShowCreateGroupModal(true);
	};

	const handleCreateGroupSubmit = async (groupData) => {
		try {
			console.log("Creating group:", groupData);

			// Destructure the needed fields
			const {
				name,
				description,
				projectName,
				members: selectedMemberIds,
				availableMembers,
			} = groupData;

			console.log("Available members from modal:", availableMembers);
			console.log("Selected member IDs:", selectedMemberIds);

			// Convert selected member IDs to real user IDs
			const realMemberIds = selectedMemberIds
				.map((selectedId) => {
					// Find the member in availableMembers by ID
					const member = availableMembers.find(
						(m) => m.id === selectedId,
					);
					console.log(
						`Looking for member with ID ${selectedId}:`,
						member,
					);

					if (member && member.realUserId) {
						console.log(
							`Found real user ID: ${member.realUserId} for member: ${member.name} (${member.email})`,
						);
						return member.realUserId;
					}
					console.log(
						`No real user ID found for member ${selectedId}`,
					);
					return null;
				})
				.filter((id) => id !== null); // Remove null values

			console.log(
				"Final real member IDs being sent to backend:",
				realMemberIds,
			);

			const requestData = {
				cohort_id: parseInt(cohortId),
				group_name: name,
				group_description: description || "No description provided",
				project_name: projectName,
				members: realMemberIds,
			};

			console.log("Sending to backend:", requestData);

			const response = await courseService.createGroup(
				cohortId,
				requestData,
			);

			if (response.success) {
				console.log("Group created successfully");
				console.log("Created group response:", response);
				setShowCreateGroupModal(false);

				// Add a delay to ensure backend transaction is committed
				setTimeout(async () => {
					console.log("Refreshing members after group creation...");
					await fetchMembers();

					// Switch to Groups view to show the newly created group
					setMemberType("Groups");
					console.log(
						"Switched to Groups view to show newly created group",
					);

					// Also refresh the specific group details if we have the group ID
					if (response.data && response.data.id) {
						console.log(
							"Refreshing specific group details for group ID:",
							response.data.id,
						);
						// The group details will be refreshed when the user clicks "See More"
					}
				}, 1000);
			} else {
				throw new Error(response.error || "Failed to create group");
			}
		} catch (error) {
			console.error("Error creating group:", error);
			throw error;
		}
	};

	const handleCloseCreateGroupModal = () => {
		setShowCreateGroupModal(false);
	};

	// Other handlers
	const handleSortChange = (value) => {
		setSortBy(value);
	};

	const handleMemberTypeChange = (value) => {
		setMemberType(value);
	};

	const handleExportMembers = () => {
		try {
			if (memberType === "Individual") {
				// Export individual members with all available details including grades
				const individualMembers = members.filter(
					(member) => member.type === "individual",
				);

				if (individualMembers.length === 0) {
					alert("No individual members to export.");
					return;
				}

				// Prepare CSV data with comprehensive information including grades
				const csvHeaders = [
					"Roll Number/Name",
					"Email",
					"Joined Date",
					"In Group",
					"Group Name",
					...assignments.map((a) => `${a.title || a.name}`),
					"Total Score",
				];

				const csvData = individualMembers
					.map((member) => {
						// Find which group this member belongs to
						let groupName = "Not in any group";
						if (member.isInGroup && member.groupId) {
							const group = members.find(
								(m) =>
									m.type === "group" &&
									m.groupId === member.groupId,
							);
							if (group) {
								groupName = group.name;
							}
						}

						// Calculate grades for each assignment
						const assignmentScores = assignments.map(
							(assignment) => {
								const gradeKey = `${member.realUserId}_${assignment.id}`;
								const grade = grades[gradeKey];
								if (
									grade &&
									grade.score !== null &&
									grade.score !== undefined
								) {
									return `${grade.score}`;
								}
								return `-`;
							},
						);

						// Calculate total score
						let totalScore = 0;

						assignments.forEach((assignment) => {
							const gradeKey = `${member.realUserId}_${assignment.id}`;
							const grade = grades[gradeKey];

							if (
								grade &&
								grade.score !== null &&
								grade.score !== undefined
							) {
								totalScore += parseInt(grade.score) || 0;
							}
						});

						return [
							member.name || "Unknown",
							member.email || "No email",
							member.joinedDate
								? new Date(
										member.joinedDate,
									).toLocaleDateString()
								: "Unknown",
							member.isInGroup ? "Yes" : "No",
							groupName,
							...assignmentScores,
							totalScore.toString(),
						];
					})
					.sort((a, b) => {
						// Sort by Roll Number/Name (first column) in ascending order
						const nameA = a[0].toString().toUpperCase();
						const nameB = b[0].toString().toUpperCase();
						return nameA.localeCompare(nameB);
					});

				// Convert to CSV format
				const csvContent = [
					csvHeaders.join(","),
					...csvData.map((row) =>
						row
							.map((field) => {
								// Sanitize special characters and icons for Excel compatibility
								let sanitizedField = String(field)
									.replace(/"/g, '""') // Escape quotes
									.replace(/[\u{1F600}-\u{1F64F}]/gu, "") // Remove emoticons
									.replace(/[\u{1F300}-\u{1F5FF}]/gu, "") // Remove misc symbols
									.replace(/[\u{1F680}-\u{1F6FF}]/gu, "") // Remove transport symbols
									.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "") // Remove flags
									.replace(/[\u{2600}-\u{26FF}]/gu, "") // Remove misc symbols
									.replace(/[\u{2700}-\u{27BF}]/gu, "") // Remove dingbats
									.replace(/[^\x00-\x7F]/g, ""); // Remove non-ASCII characters
								return `"${sanitizedField}"`;
							})
							.join(","),
					),
				].join("\n");

				// Create CSV with UTF-8 BOM for proper Excel encoding
				const BOM = "\uFEFF";
				const csvWithBOM = BOM + csvContent;

				// Create and download file
				const blob = new Blob([csvWithBOM], {
					type: "text/csv;charset=utf-8;",
				});
				const link = document.createElement("a");
				const url = URL.createObjectURL(blob);
				const courseName =
					cohortData?.name || cohortData?.title || "Course";
				const sanitizedCourseName = courseName.replace(
					/[^a-zA-Z0-9_-]/g,
					"_",
				);
				const fileName = `${sanitizedCourseName}_Individual_Complete.csv`;
				link.setAttribute("href", url);
				link.setAttribute("download", fileName);
				link.style.visibility = "hidden";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);

				console.log(
					`Successfully exported ${individualMembers.length} members with grades to ${fileName}`,
				);
			} else if (memberType === "Groups") {
				// Export groups and their members with vertical layout including grades
				const groupMembers = members.filter(
					(member) => member.type === "group",
				);

				if (groupMembers.length === 0) {
					alert("No groups to export.");
					return;
				}

				// Helper function to get roll number from email
				const getRollNumberFromEmail = (email) => {
					if (!email) return "Unknown";
					const emailPrefix = email.split("@")[0];
					if (
						/^[A-Za-z]{2}\d{2}[A-Za-z]{4}\d{3}$/.test(emailPrefix)
					) {
						return emailPrefix.toUpperCase();
					}
					if (
						emailPrefix.toLowerCase().includes("new") ||
						emailPrefix.toLowerCase().includes("user")
					) {
						return emailPrefix.toUpperCase();
					}
					return emailPrefix.toUpperCase();
				};

				// Prepare CSV data for groups with enhanced layout including grades
				// Filter to only include group assignments
				const groupAssignments = assignments.filter(
					(a) => a.type === "group",
				);

				const csvHeaders = [
					"Group Name",
					"Project Name",
					"Roll no.",
					"Date Joined",
					"E-mail",
					...groupAssignments.map((a) => `${a.title || a.name}`),
					"Total Score",
				];

				const csvData = [];

				// Process each group
				groupMembers.forEach((group) => {
					// Get individual members who belong to this group
					const groupMembersList = members.filter(
						(member) =>
							member.type === "individual" &&
							member.isInGroup &&
							member.groupId === group.groupId,
					);

					// Sort members by roll number
					groupMembersList.sort((a, b) => {
						const rollA = getRollNumberFromEmail(
							a.email,
						).toUpperCase();
						const rollB = getRollNumberFromEmail(
							b.email,
						).toUpperCase();
						return rollA.localeCompare(rollB);
					});

					if (groupMembersList.length === 0) {
						// If no members, show group with "No members"
						csvData.push([
							group.name || "Unknown Group",
							group.projectName || "No project",
							"No members",
							"",
							"",
							...Array(groupAssignments.length).fill("-"),
							"-",
						]);
					} else {
						// Add each member as a separate row with their grades
						groupMembersList.forEach((member, index) => {
							const rollNumber = getRollNumberFromEmail(
								member.email,
							);
							const dateJoined = member.joinedDate
								? new Date(
										member.joinedDate,
									).toLocaleDateString()
								: "Unknown";
							const email = member.email || "No email";

							// Calculate grades for each group assignment
							const assignmentScores = groupAssignments.map(
								(assignment) => {
									const gradeKey = `${member.realUserId}_${assignment.id}`;
									const grade = grades[gradeKey];
									if (
										grade &&
										grade.score !== null &&
										grade.score !== undefined
									) {
										return `${grade.score}`;
									}
									return `-`;
								},
							);

							// Calculate total score for group assignments only
							let totalScore = 0;

							groupAssignments.forEach((assignment) => {
								const gradeKey = `${member.realUserId}_${assignment.id}`;
								const grade = grades[gradeKey];

								if (
									grade &&
									grade.score !== null &&
									grade.score !== undefined
								) {
									totalScore += parseInt(grade.score) || 0;
								}
							});

							csvData.push([
								index === 0
									? group.name || "Unknown Group"
									: "", // Only show group name in first row
								index === 0
									? group.projectName || "No project"
									: "",
								rollNumber,
								dateJoined,
								email,
								...assignmentScores,
								totalScore.toString(),
							]);
						});
					}

					// Add empty row between groups for better readability
					csvData.push(Array(csvHeaders.length).fill(""));
				});

				// Remove the last empty row
				if (
					csvData.length > 0 &&
					csvData[csvData.length - 1].every((cell) => cell === "")
				) {
					csvData.pop();
				}

				// Convert to CSV format
				const csvContent = [
					csvHeaders.join(","),
					...csvData.map((row) =>
						row
							.map((field) => {
								// Sanitize special characters and icons for Excel compatibility
								let sanitizedField = String(field)
									.replace(/"/g, '""') // Escape quotes
									.replace(/[\u{1F600}-\u{1F64F}]/gu, "") // Remove emoticons
									.replace(/[\u{1F300}-\u{1F5FF}]/gu, "") // Remove misc symbols
									.replace(/[\u{1F680}-\u{1F6FF}]/gu, "") // Remove transport symbols
									.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "") // Remove flags
									.replace(/[\u{2600}-\u{26FF}]/gu, "") // Remove misc symbols
									.replace(/[\u{2700}-\u{27BF}]/gu, "") // Remove dingbats
									.replace(/[^\x00-\x7F]/g, ""); // Remove non-ASCII characters
								return `"${sanitizedField}"`;
							})
							.join(","),
					),
				].join("\n");

				// Create CSV with UTF-8 BOM for proper Excel encoding
				const BOM = "\uFEFF";
				const csvWithBOM = BOM + csvContent;

				// Create and download file
				const blob = new Blob([csvWithBOM], {
					type: "text/csv;charset=utf-8;",
				});
				const link = document.createElement("a");
				const url = URL.createObjectURL(blob);
				const courseName =
					cohortData?.name || cohortData?.title || "Course";
				const sanitizedCourseName = courseName.replace(
					/[^a-zA-Z0-9_-]/g,
					"_",
				);
				const fileName = `${sanitizedCourseName}_Group_Complete.csv`;
				link.setAttribute("href", url);
				link.setAttribute("download", fileName);
				link.style.visibility = "hidden";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);

				console.log(
					`Successfully exported ${groupMembers.length} groups with grades to ${fileName}`,
				);
			}
		} catch (error) {
			console.error("Error exporting data:", error);
			alert("Failed to export data. Please try again.");
		}
	};

	// Search handler
	const handleSearchChange = (value) => {
		setSearchTerm(value);
	};

	const handleMemberDetails = (memberId) => {
		console.log("handleMemberDetails called with memberId:", memberId);
		console.log("Current members list:", members);
		const member = members.find((m) => m.id === memberId);
		console.log("Found member:", member);
		if (member) {
			if (member.type === "group") {
				console.log(
					"Opening group details modal for groupId:",
					member.groupId,
				);
				console.log(
					"Member object structure:",
					JSON.stringify(member, null, 2),
				);
				if (member.groupId) {
					console.log(
						"✅ Group ID found, opening modal for:",
						member.groupId,
					);
					setSelectedGroupId(member.groupId);
					setShowGroupDetailsModal(true);

					// Add a small delay to ensure the modal is fully opened before refreshing
					setTimeout(() => {
						console.log(
							"Triggering group details refresh for group ID:",
							member.groupId,
						);
					}, 100);
				} else {
					console.error(
						"❌ Group member found but no groupId:",
						member,
					);
					console.error("❌ Member keys:", Object.keys(member));
					alert(
						"Error: Group ID is missing. Cannot open group details.",
					);
				}
			} else {
				setSelectedProfileId(memberId);
				setShowProfileModal(true);
			}
		} else {
			console.error("Member not found with ID:", memberId);
			console.log(
				"Available member IDs:",
				members.map((m) => m.id),
			);
		}
	};

	// New handler for when clicking on group name from individual member view
	const handleGroupNameClick = (groupId) => {
		console.log("Group name clicked for groupId:", groupId);
		setSelectedGroupId(groupId);
		setShowGroupDetailsModal(true);
	};

	const handleCloseProfile = () => {
		setShowProfileModal(false);
		setSelectedProfileId(null);
	};

	const handleCloseGroup = () => {
		setShowGroupModal(false);
		setSelectedGroupId(null);
	};

	const handleGroupDetails = (groupId) => {
		setSelectedGroupId(groupId);
		setShowGroupDetailsModal(true);
	};

	const handleGroupUpdated = () => {
		// Refresh the members list without reloading the page
		fetchMembers();
	};

	const handleRemoveMember = async (targetUserId) => {
		try {
			if (!isStaff) return; // Only staff members
			const confirmRemove = window.confirm(
				"Remove this member from the course?",
			);
			if (!confirmRemove) return;

			const resp = await courseService.removeCourseParticipant(
				cohortId,
				targetUserId,
			);
			if (resp.success) {
				// Remove from local list
				setMembers((prev) =>
					prev.filter((m) => m.realUserId !== targetUserId),
				);
				setFilteredMembers((prev) =>
					prev.filter((m) => m.realUserId !== targetUserId),
				);
			} else {
				alert(
					resp.error ||
						resp.message ||
						"Failed to remove participant",
				);
			}
		} catch (e) {
			alert("Failed to remove participant");
		}
	};

	const handleGradingCreated = () => {
		fetchMembers();
	};

	const handleUpdateVisibility = async ({
		assignmentId,
		isVisible,
		durationDays,
	}) => {
		try {
			const response = await courseService.updateGradeVisibility(
				cohortId,
				assignmentId,
				{ isVisible, durationDays },
			);

			if (response.success) {
				// Update local state only after successful API response
				setAssignments((prev) =>
					prev.map((asm) => {
						if (
							assignmentId === "all" ||
							asm.id === parseInt(assignmentId)
						) {
							return {
								...asm,
								isVisible,
								visibilityDuration: durationDays,
							};
						}
						return asm;
					}),
				);
			}
		} catch (error) {
			console.error("Failed to update visibility:", error);
		}
	};

	// Show loading state
	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-gray-400">
				<RefreshCw className="size-12 animate-spin mb-4 text-blue-500" />
				<p className="font-bold text-gray-900 dark:text-white">
					Loading Cohort Members
				</p>
				<p className="text-sm">
					Please wait while we sync your cohort members...
				</p>
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<p className="text-red-600 mb-4">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			<CohortMembersUI
				members={filteredMembers}
				sortBy={sortBy}
				memberType={memberType}
				isProject={member_type === "group"}
				isStaff={isStaff}
				member_type={member_type}
				loading={loading}
				error={error}
				isInGroup={isInGroup}
				currentUserId={currentUserId}
				onSortChange={handleSortChange}
				onMemberTypeChange={handleMemberTypeChange}
				onCreateGroup={handleCreateGroup}
				onMemberDetails={handleMemberDetails}
				onGroupNameClick={handleGroupNameClick}
				onRemove={handleRemoveMember}
				onExport={handleExportMembers}
				// Add search functionality
				searchTerm={searchTerm}
				onSearchChange={handleSearchChange}
				// Add course member limit data
				maxCourseMembers={cohortData?.max_course_members || 1400}
				currentCourseMembers={
					members.filter((m) => m.type === "individual").length
				}
				// Add group statistics data
				totalGroups={totalGroups}
				membersInGroups={membersInGroups}
				// Add grading data
				assignments={assignments}
				grades={grades}
				onGradeSubmit={handleGradeSubmit}
				onOpenCreateGrading={() => setShowCreateGradingModal(true)}
				onOpenGradeVisibility={() => setShowVisibilityModal(true)}
			/>

			{/* Profile Modal */}
			{showProfileModal && selectedProfileId && (
				<CohortMembersProfileController
					memberId={selectedProfileId}
					onClose={handleCloseProfile}
				/>
			)}

			{/* Create Group Modal */}
			<CreateGroupModal
				isOpen={showCreateGroupModal}
				onClose={handleCloseCreateGroupModal}
				onSubmit={handleCreateGroupSubmit}
				availableMembers={(() => {
					const filtered = members.filter(
						(member) =>
							member.type === "individual" &&
							!member.isInGroup &&
							(currentUserId
								? member.realUserId !== currentUserId
								: true) &&
							!!member.realUserId,
					);
					console.log(
						"Available members for CreateGroupModal:",
						filtered,
					);
					return filtered;
				})()}
				maxGroupMembers={cohortData?.max_groups_members || 4}
				minGroupMembers={cohortData?.min_groups_members || 1}
				isStaff={isStaff}
			/>

			{/* Group Details Modal */}
			{showGroupDetailsModal && selectedGroupId && (
				<GroupDetailsModal
					isOpen={showGroupDetailsModal}
					onClose={() => {
						setShowGroupDetailsModal(false);
						setSelectedGroupId(null);
					}}
					groupId={selectedGroupId}
					cohortId={cohortId}
					isStaff={isStaff}
					cohortData={cohortData}
					onGroupUpdated={handleGroupUpdated}
					assignments={assignments}
					grades={grades}
					onGradeSubmit={handleGradeSubmit}
				/>
			)}

			{/* Create Grading Modal */}
			<CreateGradingModal
				isOpen={showCreateGradingModal}
				onClose={() => setShowCreateGradingModal(false)}
				cohortId={cohortId}
				onSuccess={handleGradingCreated}
				members={members}
			/>

			{/* Grade Visibility Modal */}
			<GradeVisibilityModal
				isOpen={showVisibilityModal}
				onClose={() => setShowVisibilityModal(false)}
				assignments={assignments}
				onUpdateVisibility={handleUpdateVisibility}
			/>
		</>
	);
};

export default CohortMembersController;
