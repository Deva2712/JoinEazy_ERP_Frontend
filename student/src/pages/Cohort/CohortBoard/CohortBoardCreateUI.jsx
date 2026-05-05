import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Search,
  Filter,
  ListFilter,
  Plus,
  Share2,
  Calendar,
  Users,
  Badge,
  Heart,
  MessageCircle,
  RefreshCw,
  Eye,
  ChevronDown,
  X,
  Check,
} from "lucide-react";

const CohortBoardCreateUI = ({
  isOpen,
  onClose,
  postData,
  setPostData,
  handleSave,
  error,
  postForOptions,
  membersList,
  groupsList,
  memberType,
  user_type,
  handleCoverUpload,
  cohortId,
  editMode = false,
  editPostId = null,
}) => {
  const [showPostTypeMenu, setShowPostTypeMenu] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [coverError, setCoverError] = useState("");
  const fileInputRef = useRef(null);

  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [visibilityOption, setVisibilityOption] = useState("Everyone");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [groupSearchQuery, setGroupSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const colors = {
    announcement: "#ef4444",
    question: "#3b82f6",
    discussion: "#8b5cf6",
    resource: "#10b981",
  };

  const postTypeOptions = [
    "Announcement",
    "Discussion",
    "Question",
    "Resource",
  ];

  // Set default postType if not provided
  useEffect(() => {
    if (!postData.postType) {
      setPostData((prev) => ({ ...prev, postType: "Discussion" }));
    }
  }, []);

  // Early return AFTER all hooks are declared
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePostTypeSelect = (type) => {
    setPostData({ ...postData, postType: type });
    setShowPostTypeMenu(false);
  };

  const closeAllMenus = (e) => {
    if (e && e.target && e.target.tagName === "INPUT") {
      return;
    }
    setShowPostTypeMenu(false);
  };

  const handleVisibilityToggle = () => {
    setShowVisibilityMenu(!showVisibilityMenu);
    setShowMemberSelector(false);
    setShowGroupSelector(false);
  };

  const handleVisibilitySelect = (option) => {
    if (option === "Select Member") {
      setShowMemberSelector(true);
      setShowVisibilityMenu(false);
    } else if (option === "Select Group") {
      setShowGroupSelector(true);
      setShowVisibilityMenu(false);
    } else {
      setVisibilityOption(option);
      setShowVisibilityMenu(false);
      setSelectedMember(null);
      setSelectedGroup(null);
    }
  };

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    setVisibilityOption(`Member: ${member.name}`);
    setShowMemberSelector(false);
    setMemberSearchQuery("");
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setVisibilityOption(`Group: ${group.name}`);
    setShowGroupSelector(false);
    setGroupSearchQuery("");
  };

  const getVisibilityOptions = () => {
    const options = ["Everyone"];

    if (user_type === 0) {
      options.push("Admin");
    }

    if (user_type === 1) {
      options.push("Select Member");
      if (memberType === 1) {
        options.push("Select Group");
      }
    }

    return options;
  };

  // Use membersList and groupsList from props
  const filteredMembers = (membersList || []).filter((member) =>
    member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()),
  );

  const filteredGroups = (groupsList || []).filter((group) =>
    group.name.toLowerCase().includes(groupSearchQuery.toLowerCase()),
  );

  const handleCoverImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const [success, message] = await handleCoverUpload(file);
      if (success) {
        setCoverImage(URL.createObjectURL(file));
        setCoverError("");
      } else {
        setCoverError(message);
      }
    }
  };

  // Enhanced Custom Menu Component with better positioning and scroll
  const CustomMenu = ({ isOpen, onClose, children, className = "" }) => {
    if (!isOpen) return null;

    const [menuPosition, setMenuPosition] = useState({
      top: "100%",
      bottom: "auto",
    });
    const menuRef = useRef(null);

    useEffect(() => {
      if (isOpen && menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.top;
        const menuHeight = 400; // Approximate max menu height

        if (spaceBelow < menuHeight && rect.top > menuHeight) {
          setMenuPosition({ top: "auto", bottom: "100%" });
        } else {
          setMenuPosition({ top: "100%", bottom: "auto" });
        }
      }
    }, [isOpen]);

    const handleMenuClick = (e) => {
      // Only stop propagation if it's not an input element
      if (e.target.tagName !== "INPUT") {
        e.stopPropagation();
      }
    };

    return (
      <div
        ref={menuRef}
        className={`absolute left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[280px] overflow-hidden ${className}`}
        style={{
          top: menuPosition.top,
          bottom: menuPosition.bottom,
          boxShadow:
            "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
          maxHeight: "60vh",
        }}
        onClick={handleMenuClick}
      >
        {children}
      </div>
    );
  };

  const MenuButton = ({
    onClick,
    children,
    className = "",
    isSelected = false,
  }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-all duration-150 flex items-center justify-between group ${
        isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700"
      } ${className}`}
    >
      <span>{children}</span>
      {isSelected && <Check size={16} className="text-blue-600" />}
    </button>
  );

  const TagButton = ({ children, isSelected = false, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 hover:scale-105 ${
        isSelected
          ? "bg-blue-500 border-blue-500 text-white shadow-md"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
      }`}
    >
      {children}
    </button>
  );

  const SearchInput = ({
    value,
    onChange,
    placeholder,
    inputRef,
    className = "",
  }) => {
    const handleInputChange = (e) => {
      e.stopPropagation();
      onChange(e.target.value);
    };

    const handleInputClick = (e) => {
      e.stopPropagation();
    };

    const handleKeyDown = (e) => {
      e.stopPropagation();
    };

    const handleFocus = (e) => {
      e.stopPropagation();
    };

    return (
      <div className={`relative ${className}`}>
        <Search
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-3 text-sm border-0 bg-gray-50 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          autoComplete="off"
        />
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-none sm:rounded-2xl shadow-lg w-full sm:max-w-[35rem] h-[100vh] md:h-auto md:max-h-[80vh] mx-0 sm:mx-4 relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">
            {editMode ? "Edit Post" : "Create Post"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 p-5 overflow-y-auto"
          onClick={(e) => closeAllMenus(e)}
        >
          {/* Cover Image Section */}
          <div className="flex-shrink-0 flex-1 h-full flex-grow">
            {!coverImage ? (
              <div>
                <button
                  onClick={handleCoverImageClick}
                  className="flex items-center gap-1.5 h-9 px-3 pr-3.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                  Cover image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {coverError && (
                  <div className="text-red-500 text-xs mt-1">{coverError}</div>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-24 h-16 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}

            {/* Post Title Input */}
            <div className="mt-4 mb-2">
              <input
                type="text"
                placeholder="Post Title"
                value={postData.title}
                onChange={(e) =>
                  setPostData({ ...postData, title: e.target.value })
                }
                className="w-full text-xl font-semibold placeholder-gray-500 focus:outline-none resize-none"
                style={{ border: "none", background: "transparent" }}
              />
            </div>

            {/* Post Content Textarea */}
            <div className="mb-4 flex-1 min-h-0">
              <textarea
                placeholder="Content goes here..."
                value={postData.content}
                onChange={(e) =>
                  setPostData({ ...postData, content: e.target.value })
                }
                className="w-full h-full min-h-[120px] md:min-h-[120px] text-base placeholder-gray-500 focus:outline-none resize-none"
                style={{ border: "none", background: "transparent" }}
              />
            </div>

            {/* Visibility Control */}
            <div className="px-0">
              <div className="relative dropdown-container">
                <button
                  onClick={handleVisibilityToggle}
                  className="flex items-center gap-2 text-sm text-[#275DF5] transition-colors"
                >
                  <Eye size={16} className="sm:mt-[1px]" />
                  <span>{visibilityOption}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${showVisibilityMenu || showMemberSelector || showGroupSelector ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Visibility Menu */}
                {showVisibilityMenu && (
                  <div
                    className="absolute bottom-full left-0 mb-2 bg-white border border-[#52586633] rounded-2xl shadow-lg z-50 min-w-[280px]"
                    style={{
                      borderRadius: "16px",
                      boxShadow:
                        "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-black mb-1">
                        Who can see this?
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Choose who has access to view this content
                      </p>

                      <div className="space-y-1">
                        {getVisibilityOptions().map((option) => (
                          <button
                            key={option}
                            onClick={() => handleVisibilitySelect(option)}
                            className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                            style={{
                              fontWeight:
                                visibilityOption === option ? "600" : "normal",
                              backgroundColor:
                                visibilityOption === option
                                  ? "#f3f4f6"
                                  : "transparent",
                            }}
                          >
                            {option === "Everyone" && (
                              <Users size={16} className="text-gray-500" />
                            )}
                            {option === "Admin" && (
                              <Badge size={16} className="text-gray-500" />
                            )}
                            {option === "Select Member" && (
                              <Users size={16} className="text-gray-500" />
                            )}
                            {option === "Select Group" && (
                              <Users size={16} className="text-gray-500" />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">
                                {option}
                              </div>
                              {option === "Everyone" && (
                                <div className="text-xs text-gray-500">
                                  All cohort members
                                </div>
                              )}
                              {option === "Admin" && (
                                <div className="text-xs text-gray-500">
                                  Only administrators
                                </div>
                              )}
                              {option === "Select Member" && (
                                <div className="text-xs text-gray-500">
                                  Choose specific member
                                </div>
                              )}
                              {option === "Select Group" && (
                                <div className="text-xs text-gray-500">
                                  Choose specific group
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Member Selector Menu */}
                {showMemberSelector && (
                  <div
                    className="absolute bottom-full left-0 mb-2 bg-white border border-[#52586633] rounded-2xl shadow-lg z-50 min-w-[320px]"
                    style={{
                      borderRadius: "16px",
                      boxShadow:
                        "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-black">
                          Select Member
                        </h3>
                        <button
                          onClick={() => setShowMemberSelector(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>

                      {/* Search Bar */}
                      <div className="relative mb-3">
                        <Search
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={memberSearchQuery}
                          onChange={(e) => setMemberSearchQuery(e.target.value)}
                          placeholder="Search members..."
                          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>

                      {/* Members List */}
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {filteredMembers.map((member) => (
                          <button
                            key={member.id}
                            onClick={() => handleMemberSelect(member)}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {member.name}
                            </span>
                          </button>
                        ))}
                        {filteredMembers.length === 0 && (
                          <div className="text-center py-4 text-sm text-gray-500">
                            No members found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Group Selector Menu */}
                {showGroupSelector && (
                  <div
                    className="absolute bottom-full left-0 mb-2 bg-white border border-[#52586633] rounded-2xl shadow-lg z-50 min-w-[320px]"
                    style={{
                      borderRadius: "16px",
                      boxShadow:
                        "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-black">
                          Select Group
                        </h3>
                        <button
                          onClick={() => setShowGroupSelector(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>

                      {/* Search Bar */}
                      <div className="relative mb-3">
                        <Search
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={groupSearchQuery}
                          onChange={(e) => setGroupSearchQuery(e.target.value)}
                          placeholder="Search groups..."
                          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>

                      {/* Groups List */}
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {filteredGroups.map((group) => (
                          <button
                            key={group.id}
                            onClick={() => handleGroupSelect(group)}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users size={16} className="text-gray-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {group.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {group.memberCount} members
                            </span>
                          </button>
                        ))}
                        {filteredGroups.length === 0 && (
                          <div className="text-center py-4 text-sm text-gray-500">
                            No groups found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-[15px] text-left mt-3">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions - Post Type Tags and Create Button */}
        <div className="flex mt-auto items-center justify-between p-5 border-t border-gray-200">
          {/* Left Side - Active Post Type Tag with Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-2">
              {/* Active Post Type Tag */}
              <button
                onClick={() => setShowPostTypeMenu(!showPostTypeMenu)}
                className="px-3 py-1.5 text-sm rounded-full border transition-all duration-200 flex items-center gap-1.5 text-white border-transparent"
                style={{
                  backgroundColor:
                    colors[(postData.postType || "Discussion").toLowerCase()],
                }}
              >
                {postData.postType || "Discussion"}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${showPostTypeMenu ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Dropdown Menu */}
            <CustomMenu
              isOpen={showPostTypeMenu}
              onClose={() => setShowPostTypeMenu(false)}
            >
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">
                  Choose Post Type
                </h3>
                <p className="text-xs text-gray-600">
                  Select the type of content you're sharing
                </p>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2.5">
                  {postTypeOptions.map((type) => (
                    <button
                      key={type}
                      onClick={() => handlePostTypeSelect(type)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                        (postData.postType || "Discussion") === type
                          ? "text-white border-transparent"
                          : "text-white border-transparent hover:opacity-80"
                      }`}
                      style={{
                        backgroundColor: colors[type.toLowerCase()],
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </CustomMenu>
          </div>

          {/* Right Side - Create Button */}
          <button
            onClick={handleSave}
            className="h-10 px-6 text-white font-medium rounded-full transition-all duration-200 hover:cursor-pointer"
            style={{ backgroundColor: "rgb(30, 97, 240)" }}
          >
            {editMode ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CohortBoardCreateUI;
