import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CohortMembersGroupUI from "./CohortMembersGroupUI";
import { courseService } from "../../../api/services/course.service";

const CohortMembersGroupController = ({
  isOpen,
  onClose,
  groupId,
  cohortId,
}) => {
  const [groupData, setGroupData] = useState(null);
  const [members, setMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAvailableMembers, setFilteredAvailableMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch group data from API
  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) {
        console.error("No groupId provided to fetchGroupData");
        setError("Group ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching group details for cohortId:", cohortId, "groupId:", groupId);
        const response = await courseService.getGroupDetails(groupId, cohortId);
        console.log("Group details API response:", response);
        
        // Check if response exists and has the expected structure
        if (!response) {
          throw new Error("No response received from server");
        }
        
        if (response.success && response.data) {
          const data = response.data;
          console.log("Group data:", data);
          
          // Transform API data to match UI expectations
          const transformedGroupData = {
            id: data.id || groupId,
            name: data.name || data.group_name || "Unknown Group",
            description: data.description || data.group_description || "No description available",
            isProject: data.is_project || false,
            projectChosen: data.project_chosen || false,
            projectName: data.project_name || "No Project",
            isEditable: data.is_editable !== false,
            memberCount: data.member_count || (data.members ? data.members.length : 0),
            createdAt: data.created_at || data.createdAt,
            updatedAt: data.updated_at || data.updatedAt,
          };
          
          setGroupData(transformedGroupData);
          
          // Transform members data with better fallbacks
          const transformedMembers = (data.members || data.CohortGroupMembers || []).map((member, index) => ({
            id: member.id || member.user_id || index + 1,
            name: member.name || member.display_name || member.username || member.User?.username || "Unknown User",
            email: member.email || member.User?.email || "",
            avatar: member.avatar || member.User?.profile_image || `https://randomuser.me/api/portraits/men/${index + 1}.jpg`,
            description: member.description || member.role || "Member",
          }));
          
          setMembers(transformedMembers);
        } else {
          console.error("API call failed:", response);
          const errorMessage = response.error || response.message || "Unknown error occurred";
          setError(`Failed to load group details: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Error fetching group details:", error);
        setError(`Failed to load group details: ${error.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  // Filter available members based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = availableMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAvailableMembers(filtered);
    } else {
      setFilteredAvailableMembers(availableMembers);
    }
  }, [searchTerm, availableMembers]);

  const handleClose = () => {
    setGroupData(null);
    setMembers([]);
    setAvailableMembers([]);
    setShowAddMember(false);
    setSearchTerm("");
    setFilteredAvailableMembers([]);
    setLoading(true);
    setError(null);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleAddMember = () => {
    setShowAddMember(true);
  };

  const handleRemoveMember = (memberId) => {
    setMembers((prev) => prev.filter((member) => member.id !== memberId));
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleAddMemberToGroup = (memberId) => {
    const member = availableMembers.find((m) => m.id === memberId);
    if (member) {
      setMembers((prev) => [...prev, member]);
      setAvailableMembers((prev) => prev.filter((m) => m.id !== memberId));
      setFilteredAvailableMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  const handleRemoveMemberFromGroup = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setAvailableMembers((prev) => [...prev, member]);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  if (!isOpen) return null;

  return (
    <CohortMembersGroupUI
      isOpen={isOpen}
      onClose={handleClose}
      onOverlayClick={handleOverlayClick}
      groupData={groupData}
      members={members}
      availableMembers={filteredAvailableMembers}
      showAddMember={showAddMember}
      searchTerm={searchTerm}
      loading={loading}
      error={error}
      onAddMember={handleAddMember}
      onRemoveMember={handleRemoveMember}
      onSearchChange={handleSearchChange}
      onAddMemberToGroup={handleAddMemberToGroup}
      onRemoveMemberFromGroup={handleRemoveMemberFromGroup}
    />
  );
};

export default CohortMembersGroupController;
