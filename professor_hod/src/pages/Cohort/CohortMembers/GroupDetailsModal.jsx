import React, { useState, useEffect } from "react";
import { X, Edit, Trash2, Plus, User, UserX, Share, Users, Calendar, Crown, Search, RefreshCw, Check, Slash } from "lucide-react";
import { courseService } from "../../../api/services/course.service";

// Inline helpers to avoid external util file
const getRollNumberFromEmail = (email) => {
  if (!email) return "Unknown";
  const emailPrefix = email.split("@")[0];
  if (/^[A-Za-z]{2}\d{2}[A-Za-z]{4}\d{3}$/.test(emailPrefix)) {
    return emailPrefix.toUpperCase();
  }
  if (emailPrefix.toLowerCase().includes("new") || emailPrefix.toLowerCase().includes("user")) {
    return emailPrefix.toUpperCase();
  }
  return emailPrefix.toUpperCase();
};

const getMemberDisplayName = (member) => {
  const displayName = (member?.display_name || member?.username || member?.email || "").toString();
  const email = member?.email || "";
  if (displayName.toLowerCase().includes("new user") || displayName.toLowerCase().includes("newuser")) {
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

// Get border color based on submission status and deadline
const getBorderColor = (assignment, grade) => {
  const hasScore = grade && (grade.score !== null && grade.score !== undefined);
  
  // If already graded, preserve the original color
  if (hasScore) {
    if (grade.wasLate) {
      return 'red'; // Was graded after deadline
    }
    return 'green'; // Was graded on time
  }
  
  // Check if deadline has passed
  const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
  
  if (isLate) {
    return 'red'; // Deadline passed, can grade
  }
  
  // Check if submitted before deadline
  const isSubmitted = grade?.isSubmitted || false;
  
  if (isSubmitted) {
    return 'green'; // Submitted, can grade
  }
  
  return 'yellow'; // Not submitted, before deadline, cannot grade
};

const getScoreColorClasses = (borderColor, userType) => {
  // Professors see bordered boxes, students see solid filled boxes
  if (userType === 1) {
    // Professor view - bordered boxes
    const colors = {
      green: 'border-2 border-green-500 dark:border-green-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
      yellow: 'border-2 border-yellow-500 dark:border-yellow-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
      red: 'border-2 border-red-500 dark:border-red-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
      gray: 'border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400',
    };
    return colors[borderColor] || colors.gray;
  } else {
    // Student view - solid filled boxes with custom colors
    const colors = {
      green: 'bg-[#03ac13] border-[#03ac13] text-white border-0',
      yellow: 'bg-[#FFB100] border-[#FFB100] text-white border-0',
      red: 'bg-red-800 border-red-800 text-white border-0',
      gray: 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-0',
    };
    return colors[borderColor] || colors.gray;
  }
};

// Get icon for status (student view)
const getIconForStatus = (borderColor, hasGrade) => {
  if (hasGrade) return null; // Show score instead of icon
  if (borderColor === 'green') return <Check size={18} className="text-white" strokeWidth={3} />;
  if (borderColor === 'red') return <X size={18} className="text-white" strokeWidth={3} />;
  if (borderColor === 'yellow') return <span className="text-white font-bold text-xl">−</span>;
  return null;
};

const GroupDetailsModal = ({ isOpen, onClose, groupId, cohortId, onGroupUpdated, userType = 0, cohortData, assignments = [], grades = {}, onGradeSubmit }) => {
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [addingMembers, setAddingMembers] = useState(false);
  const [loadingAvailableMembers, setLoadingAvailableMembers] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null); // { userId, assignmentId }
  const [gradeFormData, setGradeFormData] = useState({ score: '', feedback: '' });

  // Grade handling functions - defined inside component to access props
  const handleGradeClick = (member, assignment, grade) => {
    console.log('Grade box clicked!', { 
      userType, 
      memberId: member.user?.user_id, 
      assignmentId: assignment.id,
      borderColor: getBorderColor(assignment, grade)
    });
    
    if (userType !== 1) {
      console.log('Not a professor, returning');
      return;
    }
    
    // Check if grading is allowed based on border color
    const borderColor = getBorderColor(assignment, grade);
    if (borderColor === 'yellow') {
      console.log('Yellow border - disabled, returning');
      return;
    }
    
    console.log('Setting editing grade...');
    setEditingGrade({ userId: member.user?.user_id, assignmentId: assignment.id });
    setGradeFormData({
      score: grade?.score ?? '',
      feedback: grade?.feedback ?? ''
    });
  };

  const handleGradeCancel = () => {
    setEditingGrade(null);
    setGradeFormData({ score: '', feedback: '' });
  };

  const handleGradeSubmitInline = async (member, assignment, e) => {
    if (e?.key && e.key !== 'Enter') return;
    if (!gradeFormData.score) {
      handleGradeCancel();
      return;
    }
    
    const score = parseInt(gradeFormData.score);
    if (isNaN(score) || score < 0 || score > parseInt(assignment.marks)) {
      alert(`Score must be between 0 and ${assignment.marks}`);
      return;
    }
    
    // Transform member object to match expected format
    const memberForGrading = {
      id: member.user?.user_id,
      realUserId: member.user?.user_id,
      display_name: member.user?.display_name,
      email: member.user?.email,
      type: 'individual'
    };
    
    console.log('Submitting grade:', { memberForGrading, assignment, score });
    await onGradeSubmit(memberForGrading, assignment, score, gradeFormData.feedback, false);
    setEditingGrade(null);
    setGradeFormData({ score: '', feedback: '' });
  };

  // Get meaningful hover message for assignment box
  const getAssignmentHoverMessage = (assignment, grade) => {
    const assignmentName = assignment.title || assignment.name;
    const maxMarks = assignment.marks;
    
    // Format deadline
    let deadlineText = '';
    if (assignment.deadline) {
      const deadlineDate = new Date(assignment.deadline);
      const now = new Date();
      const isOverdue = now > deadlineDate;
      deadlineText = `\nDeadline: ${deadlineDate.toLocaleDateString()} ${deadlineDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}${isOverdue ? ' (Overdue)' : ''}`;
    }
    
    // Check if graded
    const hasScore = grade && (grade.score !== null && grade.score !== undefined);
    
    // If not graded yet
    if (!hasScore) {
      const isSubmitted = grade?.isSubmitted || false;
      const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
      
      if (isLate) {
        let submissionText = '';
        if (isSubmitted && grade?.submittedAt) {
          const submittedDate = new Date(grade.submittedAt);
          submissionText = `\nSubmitted: ${submittedDate.toLocaleDateString()} ${submittedDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }
        return `${assignmentName}${deadlineText}${submissionText}\nStatus: ${isSubmitted ? 'Late Submission - Ready to grade' : 'Deadline Passed - Ready to grade'}\nClick to grade`;
      }
      
      if (!isSubmitted) {
        return `${assignmentName}${deadlineText}\nStatus: Not Submitted\n⚠️ Grading disabled until submission`;
      }
      
      // Submitted on time
      let submissionText = 'Submitted on time';
      if (grade?.submittedAt) {
        const submittedDate = new Date(grade.submittedAt);
        submissionText = `Submitted on ${submittedDate.toLocaleDateString()} ${submittedDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      }
      return `${assignmentName}${deadlineText}\nStatus: ${submissionText}\nClick to grade`;
    }
    
    // If graded
    const score = grade.score;
    const lateStatus = grade.wasLate ? ' (Graded after deadline)' : ' (Graded on time)';
    let feedbackText = grade.feedback ? `\nFeedback: ${grade.feedback}` : '';
    return `${assignmentName}${deadlineText}\nScore: ${score}/${maxMarks}${lateStatus}${feedbackText}\nClick to edit grade`;
  };

  const [editForm, setEditForm] = useState({
    name: "",
    projectName: "",
  });
  // Add this state variable to force re-render
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    if (isOpen && groupId) {
      console.log("GroupDetailsModal opened for group ID:", groupId);
      fetchGroupDetails();
    }
  }, [isOpen, groupId, forceUpdate]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.getGroupDetails(groupId, cohortId);
      
      if (response.success) {
        setGroupData(response.data);
        setEditForm({
          name: response.data.group.group_name || "",
          projectName: response.data.group.project_name || "",
        });
        console.log("Group details fetched successfully:", response.data);
        console.log("Group members count:", response.data.members?.length || 0);
        console.log("Group members:", response.data.members);
      } else {
        console.error("API response error:", response);
        setError("Failed to fetch group details");
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
      setError("Error fetching group details");
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh group details
  const refreshGroupDetails = () => {
    setForceUpdate(prev => prev + 1);
  };

  const fetchAvailableMembers = async () => {
    try {
      setLoadingAvailableMembers(true);
      
      const response = await courseService.getAvailableMembers(cohortId, groupId);
      
      if (response && response.success && response.data) {
        let membersArray = [];
        
        if (Array.isArray(response.data)) {
          membersArray = response.data;
        } else if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data.members)) {
            membersArray = response.data.members;
          } else if (Array.isArray(response.data.data)) {
            membersArray = response.data.data;
          } else {
            const keys = Object.keys(response.data);
            if (keys.length > 0 && keys.every(key => !isNaN(key))) {
              membersArray = Object.values(response.data);
            }
          }
        }
        
        if (membersArray.length > 0) {
          setAvailableMembers(membersArray);
          setForceUpdate(prev => prev + 1);
        } else {
          setAvailableMembers([]);
        }
      } else {
        setAvailableMembers([]);
      }
    } catch (error) {
      console.error("Error fetching available members:", error);
      setAvailableMembers([]);
    } finally {
      setLoadingAvailableMembers(false);
    }
  };

  useEffect(() => {
    console.log("Available members state changed:", availableMembers);
  }, [availableMembers]);

  useEffect(() => {
    if (showAddMember) {
      console.log("Modal opened, fetching available members...");
      fetchAvailableMembers();
    }
  }, [showAddMember]);

  // Add this useEffect to monitor state changes
  useEffect(() => {
    console.log("Available members state updated:", availableMembers.length, "members");
  }, [availableMembers]);

  const handleEditSubmit = async () => {
    if (userType !== 1) {
      alert("Only professors can edit groups.");
      return;
    }
    try {
      // Transform the form data to match backend expectations
      const updateData = {
        group_name: editForm.name,
        project_name: editForm.projectName,
      };
      
      const response = await courseService.updateGroup(cohortId, groupId, updateData);
      if (response.success) {
        setIsEditing(false);
        fetchGroupDetails();
        if (onGroupUpdated) onGroupUpdated();
      } else {
        throw new Error(response.error || "Failed to update group");
      }
    } catch (error) {
      console.error("Error updating group:", error);
      alert("Failed to update group");
    }
  };

  const handleDeleteGroup = async () => {
    // Only professors can delete groups
    if (userType !== 1) {
      alert("Only professors can delete groups.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      try {
        const response = await courseService.deleteGroup(cohortId, groupId);
        if (response.success) {
          onClose();
          if (onGroupUpdated) onGroupUpdated();
        } else {
          throw new Error(response.error || "Failed to delete group");
        }
      } catch (error) {
        console.error("Error deleting group:", error);
        alert("Failed to delete group");
      }
    }
  };

  const handleRemoveMember = async (memberId) => {
    // Only professors can remove members from a group
    if (userType !== 1) {
      alert("Only professors can remove members from groups.");
      return;
    }

    // Get member details for confirmation message
    const memberToRemove = groupData.members?.find(member => member.user?.user_id === memberId);
    const memberName = getMemberDisplayName(memberToRemove?.user);
    const isLeader = memberToRemove?.is_admin;
    
    const confirmMessage = isLeader 
      ? `Are you sure you want to remove ${memberName} (Group Leader) from the group?`
      : `Are you sure you want to remove ${memberName} from the group?`;

    if (window.confirm(confirmMessage)) {
      try {
        const response = await courseService.removeGroupMember(groupId, memberId);
        if (response.success) {
          fetchGroupDetails();
          if (onGroupUpdated) onGroupUpdated();
        } else {
          throw new Error(response.error || "Failed to remove member");
        }
      } catch (error) {
        console.error("Error removing member:", error);
        alert("Failed to remove member from group");
      }
    }
  };

  const handleCloseAddMember = () => {
    setShowAddMember(false);
    setSelectedMembers([]);
    setSearchTerm("");
  };

  const handleOpenAddMember = async () => {
    console.log("Opening add member modal");
    setShowAddMember(true);
    setSearchTerm(""); // Clear search term
    
    // Fetch available members immediately
    await fetchAvailableMembers();
    console.log("Available members fetched, count:", availableMembers.length);
  };

  const handleAddMember = async (memberId) => {
    // Only professors can add members
    if (userType !== 1) {
      alert("Only professors can add members to groups.");
      return;
    }

    try {
      // Check if adding this member would exceed the max limit
      const currentMemberCount = groupData.members?.length || 0;
      const maxMembers = cohortData?.max_groups_members || groupData.group?.max_groups_members || 4; // Use cohort settings first
      
      if (currentMemberCount >= maxMembers) {
        alert(`Cannot add more members. Maximum limit is ${maxMembers} members per group.`);
        return;
      }
      
      console.log("Adding member:", memberId, "to group:", groupId);
      const response = await courseService.addMembersToGroup(groupId, [memberId]);
      
      if (response.success) {
        console.log("Member added successfully");
        // Refresh group details to show the new member
        await fetchGroupDetails();
        // Refresh available members list
        await fetchAvailableMembers();
        // Call onGroupUpdated if provided
        if (onGroupUpdated) onGroupUpdated();
        // Clear search term
        setSearchTerm("");
      } else {
        throw new Error(response.error || "Failed to add member");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member to group");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Group Details</h2>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={refreshGroupDetails}
              className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Refresh Group Details"
            >
              <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px] text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={18} className="sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 dark:text-red-400">{error}</div>
          ) : groupData ? (
            <div className="space-y-3">
              
              {/* Group Info Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-900 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                        {groupData.group?.group_name?.charAt(0)?.toUpperCase() || "G"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {groupData.group?.group_name || "Unknown Group"}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Created {new Date(groupData.group?.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {isEditing ? (
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={handleEditSubmit}
                          className="px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-3 py-1.5 text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2 justify-end">
                        {/* Group Actions - Only show for professors */}
                        {userType === 1 && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setIsEditing(true)}
                              className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                              title="Edit Group"
                            >
                              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={handleDeleteGroup}
                              className="p-1.5 sm:p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                              title="Delete Group"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        )}

                        {/* Add Member Button - Only show for professors */}
                        {userType === 1 && (
                          <button 
                            onClick={handleOpenAddMember}
                            className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Add Member</span>
                            <span className="sm:hidden">Add</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="p-3 sm:p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Group Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={editForm.projectName}
                        onChange={(e) => setEditForm({ ...editForm, projectName: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        placeholder="Enter project name"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 sm:p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {groupData.group?.project_name || "No project assigned"}
                    </p>
                  </div>
                )}
              </div>

              {/* Members Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-900 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300" />
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Group Members</h4>
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full">
                        {groupData.members?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  {groupData.members && groupData.members.length > 0 ? (
                    <div className="space-y-2">
                      {console.log("Rendering members:", groupData.members)}
                      {/* Get group assignments sorted by created date */}
                      {(() => {
                        const groupAssignments = (assignments || []).filter(a => a.type === 'group').sort((a, b) => {
                          return new Date(a.created_at || a.createdAt || 0) - new Date(b.created_at || b.createdAt || 0);
                        });
                        
                        return groupData.members.map((member, index) => (
                          <div
                            key={member.user?.user_id || index}
                            className="bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3">
                              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 min-w-0">
                                <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                                  {getMemberInitial(member.user)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-1 sm:space-x-2">
                                    <h5 className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm truncate">
                                      {getMemberDisplayName(member.user)}
                                    </h5>
                                    {member.is_admin && (
                                      <div className="flex items-center space-x-0.5 sm:space-x-1 text-yellow-600 dark:text-yellow-400 flex-shrink-0">
                                        <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        <span className="text-xs font-medium hidden sm:inline">Leader</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {member.user?.email}
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">
                                    Joined {new Date(member.joined_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Grade Columns - Only show if user is professor OR if student is in this group */}
                              {(() => {
                                // For professors, always show
                                if (userType === 1) {
                                  return groupAssignments.length > 0 && (
                                    <div className="flex items-center gap-1.5 sm:gap-2 ml-9 sm:ml-4">
                                      {groupAssignments.map((assignment) => {
                                        const gradeKey = `${member.user?.user_id}_${assignment.id}`;
                                        const grade = grades[gradeKey];
                                        const score = grade?.score;
                                        const borderColor = getBorderColor(assignment, grade);
                                        const hasGrade = score !== null && score !== undefined;
                                        const isEditing = editingGrade?.userId === member.user?.user_id && editingGrade?.assignmentId === assignment.id;
                                        // Can grade if: professor AND (submitted OR deadline passed OR already graded)
                                        const isDisabled = borderColor === 'yellow'; // Yellow = not submitted, before deadline
                                        const canGrade = userType === 1 && !isDisabled;
                                        
                                        console.log('Rendering grade box:', {
                                          memberId: member.user?.user_id,
                                          assignmentId: assignment.id,
                                          isEditing,
                                          editingGrade,
                                          canGrade,
                                          borderColor
                                        });
                                    
                                    if (isEditing) {
                                      console.log('Showing input for:', member.user?.user_id, assignment.id);
                                      return (
                                        <input
                                          key={assignment.id}
                                          type="number"
                                          value={gradeFormData.score}
                                          onChange={(e) => setGradeFormData({ ...gradeFormData, score: e.target.value })}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              handleGradeSubmitInline(member, assignment, e);
                                            } else if (e.key === 'Escape') {
                                              handleGradeCancel();
                                            }
                                          }}
                                          onBlur={() => handleGradeSubmitInline(member, assignment)}
                                          placeholder="0"
                                          className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-center font-semibold text-xs sm:text-sm ${getScoreColorClasses(borderColor, userType)} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                                          min="0"
                                          max={assignment.marks}
                                          autoFocus
                                        />
                                      );
                                    }
                                    
                                    const getStudentTooltip = () => {
                                      const assignmentName = assignment.title || assignment.name;
                                      const isSubmitted = grade?.isSubmitted || false;
                                      const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
                                      if (isSubmitted) return `${assignmentName} - Submitted`;
                                      if (isLate) return `${assignmentName} - Overdue`;
                                      return `${assignmentName} - Pending`;
                                    };
                                    
                                  return (
                                      <div
                                        key={assignment.id}
                                        onClick={() => canGrade && handleGradeClick(member, assignment, grade)}
                                        onTouchStart={(e) => {
                                          const target = e.currentTarget;
                                          target.longPressTimer = setTimeout(() => {
                                            // Navigate to assignment details
                                            const pathParts = window.location.pathname.split('/');
                                            const cohortIdFromPath = pathParts[pathParts.indexOf('c') + 1];
                                            window.location.href = `/c/${cohortIdFromPath}/assignments`;
                                          }, 500);
                                        }}
                                        onTouchEnd={(e) => {
                                          const target = e.currentTarget;
                                          if (target.longPressTimer) {
                                            clearTimeout(target.longPressTimer);
                                            e.preventDefault();
                                            canGrade && handleGradeClick(member, assignment, grade);
                                          }
                                        }}
                                        onTouchMove={(e) => {
                                          const target = e.currentTarget;
                                          if (target.longPressTimer) {
                                            clearTimeout(target.longPressTimer);
                                          }
                                        }}
                                        className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-semibold text-xs sm:text-sm ${getScoreColorClasses(borderColor, userType)} ${
                                          canGrade ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-not-allowed'
                                        }`}
                                        style={{ touchAction: 'manipulation' }}
                                        title={userType === 1 ? getAssignmentHoverMessage(assignment, grade) : getStudentTooltip()}
                                      >
                                        {hasGrade ? score : (userType === 1 ? '-' : getIconForStatus(borderColor, hasGrade))}
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                                }
                                
                                // For students, only show if they are a member of this group
                                const authUserStr = localStorage.getItem('authUser');
                                const authUser = authUserStr ? JSON.parse(authUserStr) : null;
                                const currentUserId = authUser?.id || null;
                                
                                // Check if current user is in this group
                                const isUserInGroup = groupData?.members?.some(m => m.user?.user_id === currentUserId);
                                
                                if (isUserInGroup && groupAssignments.length > 0) {
                                  return (
                                    <div className="flex items-center gap-1.5 sm:gap-2 ml-9 sm:ml-4">
                                      {groupAssignments.map((assignment) => {
                                        const gradeKey = `${member.user?.user_id}_${assignment.id}`;
                                        const grade = grades[gradeKey];
                                        const score = grade?.score;
                                        const borderColor = getBorderColor(assignment, grade);
                                        const hasGrade = score !== null && score !== undefined;
                                        
                                        const getStudentTooltip = () => {
                                          const assignmentName = assignment.title || assignment.name;
                                          const isSubmitted = grade?.isSubmitted || false;
                                          const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
                                          if (isSubmitted) return `${assignmentName} - Submitted`;
                                          if (isLate) return `${assignmentName} - Overdue`;
                                          return `${assignmentName} - Pending`;
                                        };
                                        
                                        return (
                                          <div
                                            key={assignment.id}
                                            className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-semibold text-xs sm:text-sm ${getScoreColorClasses(borderColor, userType)}`}
                                            title={getStudentTooltip()}
                                          >
                                            {hasGrade ? score : getIconForStatus(borderColor, hasGrade)}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                }
                                
                                return null;
                              })()}
                              
                              {/* Member removal button - only show for professors */}
                              {userType === 1 && (
                                <button
                                  onClick={() => handleRemoveMember(member.user?.user_id)}
                                  className="p-1.5 sm:p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors flex-shrink-0 ml-auto sm:ml-2"
                                  title="Remove Member"
                                >
                                  <UserX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500 mx-auto mb-2 sm:mb-3" />
                      <h5 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1">No Members Yet</h5>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Start by adding members to your group</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Add Member Modal */}
        {showAddMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Add Members</h3>
                <button
                  onClick={handleCloseAddMember}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X size={16} className="sm:w-[18px] sm:h-[18px] text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                {/* Search Bar */}
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by roll number"
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Loading State */}
                {loadingAvailableMembers && (
                  <div className="flex items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Loading available members...</span>
                  </div>
                )}

                {/* Available Members List */}
                {!loadingAvailableMembers && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Available Members</h4>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span>{availableMembers.length} members available</span>
                        <span className="mx-2">•</span>
                        <span>{groupData?.members?.length || 0}/{cohortData?.max_groups_members || groupData?.group?.max_groups_members || 4} in group</span>
                      </div>
                    </div>
                    
                    {/* Show warning if at max capacity */}
                    {(groupData?.members?.length || 0) >= (cohortData?.max_groups_members || groupData?.group?.max_groups_members || 4) && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-2.5 mb-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                              Group is at maximum capacity ({cohortData?.max_groups_members || groupData?.group?.max_groups_members || 4} members)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {availableMembers.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {availableMembers
                          .filter(member => {
                            const searchLower = searchTerm.toLowerCase();
                            return (
                              (member.display_name && member.display_name.toLowerCase().includes(searchLower)) ||
                              (member.username && member.username.toLowerCase().includes(searchLower)) ||
                              (member.email && member.email.toLowerCase().includes(searchLower))
                            );
                          })
                          .map((member) => (
                            <div
                              key={member.user_id}
                              className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                  {getMemberInitial(member)}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                                    {getMemberDisplayName(member)}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {member.email}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleAddMember(member.user_id)}
                                disabled={(groupData?.members?.length || 0) >= (cohortData?.max_groups_members || groupData?.group?.max_groups_members || 4)}
                                className={`px-2 sm:px-2.5 py-1 text-xs rounded-md transition-colors flex-shrink-0 ${
                                  (groupData?.members?.length || 0) >= (cohortData?.max_groups_members || groupData?.group?.max_groups_members || 4)
                                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              >
                                Add
                              </button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500 mx-auto mb-2 sm:mb-3" />
                        <h5 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1">No Available Members</h5>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">All participants are already in groups</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCloseAddMember}
                  className="px-3 py-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetailsModal;