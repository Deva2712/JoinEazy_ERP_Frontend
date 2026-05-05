import React, { useState, useEffect } from "react";
import CohortEventsCreateUI from "./CohortEventsCreateUI";

const CohortEventsCreateController = ({
  isOpen,
  onClose,
  cohortId,
  editEventId = null,
  cohortData = null,
  isRequestMode = false,
  user_type = 1, // Add this prop to determine member type
}) => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    eventType: "create",
    selectedParticipant: "Everyone", // Changed from participants
    selectedMemberId: null, // Single member ID instead of array
    selectedGroupId: null, // Single group ID instead of array
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = !!editEventId;

  const [showParticipantsMenu, setShowParticipantsMenu] = useState(false);
  const [showMembersMenu, setShowMembersMenu] = useState(false);
  const [showGroupsMenu, setShowGroupsMenu] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [groupSearchTerm, setGroupSearchTerm] = useState("");

  // Mock data - replace with actual API calls
  const [availableMembers] = useState([
    { id: 1, name: "John Doe", avatar: "" },
    { id: 2, name: "Jane Smith", avatar: "" },
    { id: 3, name: "Mike Johnson", avatar: "" },
    { id: 4, name: "Sarah Wilson", avatar: "" },
  ]);

  const [availableGroups] = useState([
    { id: 1, name: "Developers", memberCount: 5 },
    { id: 2, name: "Designers", memberCount: 3 },
    { id: 3, name: "Project Managers", memberCount: 2 },
  ]);

  // Load existing event data for editing
  useEffect(() => {
    if (isEditMode && editEventId && isOpen) {
      setLoading(true);
      // Simulate API call to fetch event details
      setTimeout(() => {
        const mockEventData = {
          title: "Sample Event",
          description: "This is a sample event description",
          location: "Online",
          date: "2024-01-15",
          startTime: "10:00",
          endTime: "11:00",
          eventType: "edit",
        };
        setEventData(mockEventData);
        setLoading(false);
      }, 500);
    }
  }, [isEditMode, editEventId, isOpen]);

  const handleInputChange = (field, value) => {
    setEventData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleParticipantSelect = (option) => {
    setEventData((prev) => ({
      ...prev,
      selectedParticipant: option,
      selectedMemberId: null,
      selectedGroupId: null,
    }));
    setShowParticipantsMenu(false);

    if (option === "Select Member") {
      setShowMembersMenu(true);
    } else if (option === "Select Group") {
      setShowGroupsMenu(true);
    }
  };

  const handleMemberSelect = (member) => {
    setEventData((prev) => ({
      ...prev,
      selectedMemberId: member.id,
      selectedParticipant: "Select Member",
    }));
    setShowMembersMenu(false);
  };

  const handleGroupSelect = (group) => {
    setEventData((prev) => ({
      ...prev,
      selectedGroupId: group.id,
      selectedParticipant: "Select Group",
    }));
    setShowGroupsMenu(false);
  };

  const filteredMembers = availableMembers.filter((member) =>
    member.name.toLowerCase().includes(memberSearchTerm.toLowerCase()),
  );

  const filteredGroups = availableGroups.filter((group) =>
    group.name.toLowerCase().includes(groupSearchTerm.toLowerCase()),
  );

  const handleSave = async () => {
    setLoading(true);
    setError("This is a dummy error message for testing");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Event data:", eventData);
      // In real app: await createEvent or updateEvent

      // Don't close modal, just show error
    } catch (err) {
      setError("Failed to save event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEventData({
      title: "",
      description: "",
      location: "",
      date: "",
      startTime: "",
      endTime: "",
      eventType: "create",
    });
    setError("");
    onClose();
  };

  return (
    <CohortEventsCreateUI
      isOpen={isOpen}
      onClose={handleClose}
      eventData={eventData}
      onInputChange={handleInputChange}
      onSave={handleSave}
      loading={loading}
      error={error}
      isEditMode={isEditMode}
      cohortData={cohortData}
      isRequestMode={isRequestMode}
      user_type={user_type}
      showParticipantsMenu={showParticipantsMenu}
      setShowParticipantsMenu={setShowParticipantsMenu}
      showMembersMenu={showMembersMenu}
      setShowMembersMenu={setShowMembersMenu}
      showGroupsMenu={showGroupsMenu}
      setShowGroupsMenu={setShowGroupsMenu}
      onParticipantSelect={handleParticipantSelect}
      onMemberSelect={handleMemberSelect}
      onGroupSelect={handleGroupSelect}
      availableMembers={filteredMembers}
      availableGroups={filteredGroups}
      memberSearchTerm={memberSearchTerm}
      setMemberSearchTerm={setMemberSearchTerm}
      groupSearchTerm={groupSearchTerm}
      setGroupSearchTerm={setGroupSearchTerm}
    />
  );
};

export default CohortEventsCreateController;
