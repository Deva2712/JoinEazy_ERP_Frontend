import React, { useState, useEffect } from "react";
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
} from "lucide-react";

const CohortBoardUI = ({
  cohortId,
  cohortData,
  boardData,
  user_type,
  searchQuery,
  onSearchChange,
  activeFilters,
  postTypeFilters,
  onFilterChange,
  onCreatePost,
  showFilterDropdown,
  onFilterDropdownToggle,
  sortBy,
  postsFrom,
  sortOptions,
  postsFromOptions,
  onSortChange,
  onPostsFromChange,
  onLike,
  onPostClick,
  loading,
  error,
  onRetry,
}) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [boardShareState, setBoardShareState] = useState({
    text: "Share Board",
    clicked: false,
  });

  const [shareStates, setShareStates] = useState({});
  const [likeStates, setLikeStates] = useState({});

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showPostsFromDropdown, setShowPostsFromDropdown] = useState(false);
  const [showPostTypesDropdown, setShowPostTypesDropdown] = useState(false);
  
  const [quickDetailShareState, setQuickDetailShareState] = useState({
    text: "Share Board",
    clicked: false,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any dropdown
      if (!event.target.closest(".dropdown-container")) {
        if (showFilterDropdown) {
          onFilterDropdownToggle();
        }
        setShowSortDropdown(false);
        setShowPostsFromDropdown(false);
        setShowPostTypesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDropdown, onFilterDropdownToggle]);

  const handleSortDropdownToggle = () => {
    setShowSortDropdown(!showSortDropdown);
    setShowPostsFromDropdown(false);
    setShowPostTypesDropdown(false);
  };

  const handlePostsFromDropdownToggle = () => {
    setShowPostsFromDropdown(!showPostsFromDropdown);
    setShowSortDropdown(false);
    setShowPostTypesDropdown(false);
  };

  const handlePostTypesDropdownToggle = () => {
    setShowPostTypesDropdown(!showPostTypesDropdown);
    setShowSortDropdown(false);
    setShowPostsFromDropdown(false);
  };

  const handleBoardShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setBoardShareState({
        text: "Copied",
        clicked: true,
      });

      setTimeout(() => {
        setBoardShareState({
          text: "Share Board",
          clicked: false,
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleSharePost = async (postId) => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStates((prev) => ({
        ...prev,
        [postId]: {
          text: "Copied",
          clicked: true,
        },
      }));

      setTimeout(() => {
        setShareStates((prev) => ({
          ...prev,
          [postId]: {
            text: "Share",
            clicked: false,
          },
        }));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleLikeClick = (postId, currentLikeStatus) => {
    const result = onLike(postId);

    if (result) {
      setLikeStates((prev) => ({
        ...prev,
        [postId]: !currentLikeStatus,
      }));
    }
  };

  const handlePageRefresh = () => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Filter sections configuration
  const filterSections = [
    {
      id: "sort",
      label: "Sort by",
      showDropdown: showSortDropdown,
      toggleDropdown: handleSortDropdownToggle,
      currentValue: sortBy,
      options: sortOptions.map((option) => ({
        id: option.id,
        label: option.label,
        value: option.id,
      })),
      onOptionSelect: onSortChange,
    },
    {
      id: "postType",
      label: "Post Type",
      showDropdown: showPostTypesDropdown,
      toggleDropdown: handlePostTypesDropdownToggle,
      currentValue: activeFilters,
      options: postTypeFilters.map((filter) => ({
        id: filter.id,
        label: filter.label,
        value: filter.id,
      })),
      onOptionSelect: onFilterChange,
      isMultiSelect: true,
    },
    {
      id: "from",
      label: "From",
      showDropdown: showPostsFromDropdown,
      toggleDropdown: handlePostsFromDropdownToggle,
      currentValue: postsFrom,
      options: postsFromOptions.map((option) => ({
        id: option.id,
        label: option.label,
        value: option.id,
      })),
      onOptionSelect: onPostsFromChange,
    },
  ];

  const getTypeColor = (type) => {
    const colors = {
      announcement: "#ef4444",
      question: "#3b82f6",
      discussion: "#8b5cf6",
      resource: "#10b981",
    };
    return colors[type] || "#6b7280";
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      Calendar,
      Users,
      Badge,
      Share2,
    };
    return iconMap[iconName] || Share2;
  };

  const renderFilterSection = (section) => {
    return (
      <div key={section.id} className="">
        <button
          onClick={section.toggleDropdown}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <span>{section.label}</span>
          <svg
            className={`w-4 h-4 transition-transform ${section.showDropdown ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {section.showDropdown && (
          <div className="ml-3">
            {section.options.map((option) => {
              let isSelected;
              if (section.isMultiSelect) {
                isSelected =
                  (option.id === "all" && section.currentValue.length === 0) ||
                  section.currentValue.includes(option.id);
              } else {
                isSelected = section.currentValue === option.value;
              }

              return (
                <button
                  key={option.id}
                  onClick={() => {
                    section.onOptionSelect(option.value);
                  }}
                  className="w-full text-left px-2 py-1.5 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  style={{
                    fontWeight: isSelected ? "bold" : "normal",
                    backgroundColor: "transparent",
                    color: "#374151",
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const handleQuickDetailShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setQuickDetailShareState({
        text: "Copied",
        clicked: true,
      });

      setTimeout(() => {
        setQuickDetailShareState({
          text: "Share Board",
          clicked: false,
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };
  
  const renderQuickDetails = () => {

    return (
      <div
        className="bg-white sm:rounded-[20px] px-5 pt-4 pb-[22px] sm:p-[22px] sm:pt-[20px] sm:pb-[24px] w-full sm:max-w-[320px]"
        style={{
          border: "1px solid #D3D6DA",
          height: "fit-content",
          flexShrink: 0,
        }}
      >
        <h3 className="text-lg font-bold mb-3" style={{ color: "black" }}>
          Board Stats
        </h3>

        <div className="space-y-2 font-arial">
          {boardData?.quickDetails?.map((detail) => {
            const IconComponent = getIconComponent(detail.icon);

            if (detail.isShareable) {
              return (
                <button
                  key={detail.id}
                  onClick={handleQuickDetailShare}
                  className="flex items-center gap-2.5 w-full text-left rounded-lg transition-colors"
                >
                  <IconComponent
                    size={16}
                    style={{
                      color: quickDetailShareState.clicked
                        ? "#16a34a"
                        : "#474747",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="text-[15px] mt-[1px]"
                    style={{
                      color: quickDetailShareState.clicked
                        ? "#16a34a"
                        : "#474747",
                    }}
                  >
                    {quickDetailShareState.clicked
                      ? "Copied to Clipboard"
                      : detail.text}
                  </span>
                </button>
              );
            }

            return (
              <div key={detail.id} className="flex items-center gap-2.5">
                <IconComponent
                  size={16}
                  style={{ color: "rgb(55, 65, 81)", flexShrink: 0 }}
                />
                <span
                  className="text-[15px] mt-[1px]"
                  style={{ color: "rgb(55, 65, 81)" }}
                >
                  {detail.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPost = (post) => {
    const shareState = shareStates[post.id] || {
      text: "Share",
      clicked: false,
    };

    const currentLikeStatus = likeStates.hasOwnProperty(post.id)
      ? likeStates[post.id]
      : post.isLiked || false;

    return (
      <div
        key={post.id}
        className="bg-white border-t border-b sm:border border-[#D3D6DA] sm:rounded-[20px] p-4 pb-0 sm:p-5 sm:pb-0 sm:px-6"
      >
        {/* Post Header */}
        <div className="flex items-center">
          <div className="flex items-start gap-3">
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="w-10 h-10 mt-[1px] rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h4
                className="font-medium text-[15px]"
                style={{ color: "black" }}
              >
                {post.author}
              </h4>
              <p className="text-sm text-gray-600">{post.timeText}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span
              className="px-2 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: getTypeColor(post.type) }}
            >
              {post.type}
            </span>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4 mt-3.5" onClick={() => onPostClick(post.id)}>
          <h3
            className="font-bold text-lg sm:text-[19px]"
            style={{ color: "black" }}
          >
            {post.title}
          </h3>
          <div
            className="mt-2 sm:mt-2.5 text-base leading-normal"
            style={{ color: "black" }}
          >
            {(() => {
              const paragraphs = post.content
                .split("\n")
                .filter((p) => p.trim());
              const maxLength = 250;

              // Calculate total length including paragraph breaks
              let totalLength = 0;
              let displayParagraphs = [];
              let needsEllipsis = false;

              for (let i = 0; i < paragraphs.length; i++) {
                const paragraph = paragraphs[i];
                const paragraphLength = paragraph.length;

                if (totalLength + paragraphLength <= maxLength) {
                  displayParagraphs.push(paragraph);
                  totalLength += paragraphLength;
                } else {
                  // Check if we can fit part of this paragraph
                  const remainingSpace = maxLength - totalLength;
                  if (remainingSpace > 20) {
                    // Only truncate if we have reasonable space
                    const words = paragraph.split(" ");
                    let truncatedParagraph = "";

                    for (const word of words) {
                      if (
                        (truncatedParagraph + word).length <= remainingSpace
                      ) {
                        truncatedParagraph +=
                          (truncatedParagraph ? " " : "") + word;
                      } else {
                        break;
                      }
                    }

                    if (truncatedParagraph) {
                      displayParagraphs.push(truncatedParagraph);
                    }
                  }
                  needsEllipsis = true;
                  break;
                }
              }

              // If we didn't use all paragraphs, we need ellipsis
              if (displayParagraphs.length < paragraphs.length) {
                needsEllipsis = true;
              }

              return (
                <>
                  {displayParagraphs.map((paragraph, index) =>
                    paragraph.trim() ? (
                      <p
                        key={index}
                        className="mb-2 last:mb-0 leading-normal pr-1"
                      >
                        {paragraph}
                        {needsEllipsis && index === displayParagraphs.length - 1
                          ? "..."
                          : ""}
                      </p>
                    ) : null,
                  )}
                </>
              );
            })()}
            <div className="text-base text-gray-600">See more</div>
          </div>
        </div>

        {post.cover && (
          <div className="mb-5 sm:mb-6">
            <img
              src={post.cover}
              alt="Post cover"
              className="w-full h-auto object-cover aspect-[21/9]"
            />
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center font-medium gap-4 py-3.5 sm:py-4 border-t border-[#D3D6DA] -mx-5 sm:-mx-6 px-5 sm:px-6">
          <button
            onClick={() => handleLikeClick(post.id, currentLikeStatus)}
            className="flex items-center gap-1.5 text-gray-600 transition-colors"
          >
            <Heart
              size={18}
              strokeWidth={2.2}
              className="mt-[1px]"
              fill={currentLikeStatus ? "#ef4444" : "none"}
              color={currentLikeStatus ? "#ef4444" : "#4B5563"}
            />
            <span className="text-sm">
              {post.likes} likes • {post.comments} comments
            </span>
          </button>
          <button
            onClick={() => handleSharePost(post.id)}
            className="flex items-center gap-1.5 transition-colors ml-auto"
            style={{
              color: shareState.clicked ? "#16a34a" : "#4B5563",
            }}
          >
            <Share2 size={17} />
            <span className="text-sm">{shareState.text}</span>
          </button>
        </div>
      </div>
    );
  };

  const filteredPosts =
    boardData?.posts?.filter((post) => {
      // Filter by search query
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by active filters
      const matchesFilter =
        activeFilters.length === 0 || activeFilters.includes(post.type);

      // Apply sort and posts from filters

      return matchesSearch && matchesFilter;
    }) || [];

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading board posts...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center py-20">
        <div className="text-red-500 mb-4">Failed to load board posts: {error}</div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pb-[92px] py-5 sm:px-4 sm:py-6 sm:pb-7 mdg:pb-5 w-full max-w-[72rem] mx-auto">
      {/* Two column layout */}
      <div className="flex gap-5 sm:gap-6 mdg:flex-row flex-col">
        {/* Left Section - Posts with filters and search */}
        <div className="flex-1 flex flex-col gap-5 sm:gap-6">
          {/* Top Controls Row - Updated */}
          <div className="w-full px-4 sm:px-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Filters and Search Row */}
            <div className="flex flex-1 items-center gap-3 sm:gap-4">
              {/* Single Filter Button with Menu */}
              <div className="relative dropdown-container">
                <button
                  onClick={onFilterDropdownToggle}
                  className="flex items-center justify-center px-4 pr-[18px] gap-2 bg-white font-medium transition-all duration-200 whitespace-nowrap"
                  style={{
                    height: "38px",
                    borderRadius: "9999px",
                    border: "1px solid #D3D6DA",
                    backgroundColor: "white",
                    color: "#374151",
                  }}
                >
                  <ListFilter size={15} style={{ strokeWidth: "2.1" }} />
                  <span className="text-sm hidden sm:block">Filter</span>
                </button>

                {/* Filter Menu */}
                {showFilterDropdown && (
                  <div
                    className="absolute top-full left-0 mt-2 bg-white border border-[#D3D6DA] rounded-2xl shadow-lg z-50 min-w-[220px]"
                    style={{
                      borderRadius: "16px",
                      boxShadow:
                        "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div className="p-3 space-y-0.5">
                      {filterSections.map((section) =>
                        renderFilterSection(section),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Search */}
              <div
                className="relative flex-1 w-full"
                style={{ maxWidth: "26rem" }}
              >
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full pl-9 pr-4 py-2 border border-[#D3D6DA] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-gray-600"
                  style={{ height: "38px", fontSize: "14px" }}
                />
              </div>
            </div>
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <MessageCircle
                size={64}
                className="text-gray-400 mb-4"
                strokeWidth={1.5}
              />
              <h3 className="text-2xl font-semibold text-black mb-2">
                No Posts Found
              </h3>
              <p className="text-gray-600 text-center max-w-md leading-[1.6]">
                {searchQuery || activeFilters.length > 0
                  ? "Try adjusting your search or filters to find posts."
                  : "Be the first to start a conversation on this board!"}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => renderPost(post))
          )}
        </div>

        {/* Right Section - Quick Details and Actions */}
        <div
          className="flex flex-col gap-5 sm:gap-6 w-full sm:max-w-[320px]"
          style={{
            flexShrink: 0,
            position: "sticky",
            top: "20px",
          }}
        >
          {/* Quick Details */}
          {renderQuickDetails()}

          {/* Create Post Button - Only show if user_type is 1 */}
          <div
            className="bg-white rounded-2xl p-[22px] hidden mdg:block"
            style={{
              border: "1px solid #D3D6DA",
              borderRadius: "20px",
              height: "fit-content",
            }}
          >
            <button
              onClick={onCreatePost}
              className="flex items-center justify-center gap-2 text-white font-medium transition-colors duration-200 w-full"
              style={{
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "rgb(30, 97, 240)",
                fontSize: "14px",
              }}
            >
              <Plus size={16} />
              Create New Post
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Create Post Button */}
      <button
        onClick={onCreatePost}
        className="fixed bottom-[92px] md:bottom-5 right-5 w-14 h-14 bg-[#1E61F0] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 mdg:hidden z-50"
        style={{ backgroundColor: "rgb(30, 97, 240)" }}
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default CohortBoardUI;
