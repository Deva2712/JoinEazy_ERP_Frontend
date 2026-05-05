import React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  Users,
  Search,
  Check,
} from "lucide-react";

const CohortEventsCreateUI = ({
  isOpen,
  onClose,
  eventData,
  onInputChange,
  onSave,
  loading,
  error,
  isEditMode,
  cohortData,
  isRequestMode = false,
  user_type = 1,
  showParticipantsMenu,
  setShowParticipantsMenu,
  showMembersMenu,
  setShowMembersMenu,
  showGroupsMenu,
  setShowGroupsMenu,
  onParticipantSelect,
  onMemberSelect,
  onGroupSelect,
  availableMembers,
  availableGroups,
  memberSearchTerm,
  setMemberSearchTerm,
  groupSearchTerm,
  setGroupSearchTerm,
}) => {
  if (!isOpen) return null;

  const getParticipantDisplayText = () => {
    if (eventData.selectedParticipant === "Everyone") return "Everyone";
    if (eventData.selectedParticipant === "Select Member") {
      if (!eventData.selectedMemberId) return "Select Member";
      const selectedMember = availableMembers.find(
        (m) => m.id === eventData.selectedMemberId,
      );
      return selectedMember ? selectedMember.name : "Select Member";
    }
    if (eventData.selectedParticipant === "Select Group") {
      if (!eventData.selectedGroupId) return "Select Group";
      const selectedGroup = availableGroups.find(
        (g) => g.id === eventData.selectedGroupId,
      );
      return selectedGroup ? selectedGroup.name : "Select Group";
    }
    return eventData.selectedParticipant;
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Add this new function
  const handleClickOutside = (e) => {
    if (!e.target.closest(".participants-dropdown")) {
      setShowParticipantsMenu(false);
      setShowMembersMenu(false);
      setShowGroupsMenu(false);
    }
  };

  // Add useEffect for click outside
  React.useEffect(() => {
    if (showParticipantsMenu || showMembersMenu || showGroupsMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showParticipantsMenu, showMembersMenu, showGroupsMenu]);

  return (
    <div
      className="fixed inset-0 z-50 flex md:items-center md:justify-center items-end justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white md:rounded-2xl rounded-b-none shadow-lg w-full max-w-[35rem] lg:mx-4 mx-0 relative h-[100vh] md:h-auto md:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {isRequestMode
              ? "Request Event"
              : isEditMode
                ? "Edit Event"
                : "Create New Event"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-2.5">
            {/* Event Title - Direct input without border */}
            <div className="space-y-2">
              <input
                id="title"
                type="text"
                placeholder="Title"
                value={eventData.title}
                onChange={(e) => onInputChange("title", e.target.value)}
                className="w-full text-black placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-xl font-semibold"
                disabled={loading}
              />
            </div>

            {/* Event Description - Direct input without border */}
            <div className="space-y-2">
              <textarea
                id="description"
                placeholder="Description"
                value={eventData.description}
                onChange={(e) => onInputChange("description", e.target.value)}
                className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none"
                disabled={loading}
                rows={2}
                style={{ fontSize: "16px" }}
              />
            </div>

            {/* Location - Show only if user_type is 1 */}
            {user_type === 1 && (
              <div className="flex items-center space-x-2 pb-1">
                <MapPin size={18} className="text-gray-500 flex-shrink-0" />
                <input
                  id="location"
                  type="text"
                  placeholder="Enter Location"
                  value={eventData.location}
                  onChange={(e) => onInputChange("location", e.target.value)}
                  className="flex-1 text-gray-800 placeholder-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                  disabled={loading}
                  style={{ fontSize: "16px" }}
                />
              </div>
            )}

            {/* Date */}
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-gray-500 flex-shrink-0" />
              <input
                id="date"
                type="date"
                value={eventData.date}
                onChange={(e) => onInputChange("date", e.target.value)}
                className="flex-1 text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                disabled={loading}
                style={{ fontSize: "16px" }}
              />
            </div>

            {/* Time Section */}
            <div className="space-y-3 pt-1">
              {/* Start Time */}
              <div className="flex items-center space-x-2">
                <Clock size={18} className="text-gray-500 flex-shrink-0" />
                <input
                  id="startTime"
                  type="time"
                  value={eventData.startTime}
                  onChange={(e) => onInputChange("startTime", e.target.value)}
                  className="flex-1 text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                  disabled={loading}
                  style={{ fontSize: "16px" }}
                />
                <span className="text-gray-500 text-sm">Start Time</span>
              </div>

              {/* End Time */}
              <div className="flex items-center space-x-2">
                <Clock size={18} className="text-gray-500 flex-shrink-0" />
                <input
                  id="endTime"
                  type="time"
                  value={eventData.endTime}
                  onChange={(e) => onInputChange("endTime", e.target.value)}
                  className="flex-1 text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                  disabled={loading}
                  style={{ fontSize: "16px" }}
                />
                <span className="text-gray-500 text-sm">End Time</span>
              </div>
            </div>

            {/* Participants - Show only if user_type is 1 */}
            {user_type === 1 && (
              <div className="relative participants-dropdown pt-1">
                <div className="flex items-center space-x-2">
                  <Users size={18} className="text-gray-500 flex-shrink-0" />
                  <button
                    type="button"
                    onClick={() =>
                      setShowParticipantsMenu(!showParticipantsMenu)
                    }
                    className="flex-1 text-left text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    disabled={loading}
                    style={{ fontSize: "16px" }}
                  >
                    {getParticipantDisplayText()}
                  </button>
                </div>

                {/* Participants Dropdown Menu */}
                {showParticipantsMenu && (
                  <div className="absolute top-full left-6 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => onParticipantSelect("Everyone")}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                      >
                        Everyone
                        {eventData.selectedParticipant === "Everyone" && (
                          <Check size={16} className="text-blue-600" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onParticipantSelect("Select Member")}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                      >
                        Select Member
                        {eventData.selectedParticipant === "Select Member" && (
                          <Check size={16} className="text-blue-600" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onParticipantSelect("Select Group")}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                      >
                        Select Group
                        {eventData.selectedParticipant === "Select Group" && (
                          <Check size={16} className="text-blue-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Members Selection Menu */}
                {showMembersMenu && (
                  <div className="absolute top-full left-6 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Search members..."
                          value={memberSearchTerm}
                          onChange={(e) => setMemberSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {availableMembers.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => onMemberSelect(member)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                              {member.name.charAt(0)}
                            </div>
                            <span>{member.name}</span>
                          </div>
                          {eventData.selectedMemberId === member.id && (
                            <Check size={16} className="text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowMembersMenu(false)}
                        className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                {/* Groups Selection Menu */}
                {showGroupsMenu && (
                  <div className="absolute top-full left-6 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Search groups..."
                          value={groupSearchTerm}
                          onChange={(e) => setGroupSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {availableGroups.map((group) => (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => onGroupSelect(group)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                              <Users size={12} className="text-blue-600" />
                            </div>
                            <div>
                              <div>{group.name}</div>
                              <div className="text-xs text-gray-500">
                                {group.memberCount} members
                              </div>
                            </div>
                          </div>
                          {eventData.selectedGroupId === group.id && (
                            <Check size={16} className="text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowGroupsMenu(false)}
                        className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 p-5 border-t border-gray-200">
          <button
            onClick={isRequestMode ? onSave : isEditMode ? onSave : onSave}
            className={`w-full px-4 py-2 font-medium rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isRequestMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={loading}
            style={{ borderRadius: "9999px" }}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading
              ? isRequestMode
                ? "Requesting..."
                : isEditMode
                  ? "Updating..."
                  : "Creating..."
              : isRequestMode
                ? "Request Event"
                : isEditMode
                  ? "Update Event"
                  : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CohortEventsCreateUI;
