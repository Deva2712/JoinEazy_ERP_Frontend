import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CohortBoardCreateController from "./CohortBoardCreateController";
import CohortBoardUI from "./CohortBoardUI";
import CohortBoardPostController from "./CohortBoardPostController";
import { cohortService } from "../../../api/services/cohort.service";

const CohortBoardController = ({ cohortId, cohortData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [editPostId, setEditPostId] = useState(null);

  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [postsFrom, setPostsFrom] = useState("everyone");

  const user_type = cohortData?.user_type || 0;

  // Function to retry fetching data when there's an error
  const handleRetry = () => {
    fetchBoardData();
  };

  // Fetch board posts from API
  const fetchBoardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to get board posts
      const response = await cohortService.getBoardPosts(cohortId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch board posts');
      }
      
      // Use the response data
      setBoardData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching board posts:', err);
      setError(err.message || 'Failed to load board posts');
      setLoading(false);
      
      // Initialize with empty data instead of mock data
      setBoardData({ posts: [] });
    }
  };

  useEffect(() => {
    if (cohortId) {
      fetchBoardData();
    }
  }, [cohortId]);

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath.includes("/create")) {
      setShowCreateModal(true);
      setEditPostId(null);
    } else if (currentPath.includes("/edit")) {
      // Extract post ID from URL pattern: /cohort/{cohortId}/board/{postId}/edit
      const pathParts = currentPath.split("/");
      const editIndex = pathParts.indexOf("edit");
      if (editIndex > 0) {
        const postId = parseInt(pathParts[editIndex - 1]);
        handleEditPost(postId);
      }
    } else if (currentPath.match(/\/board\/\d+$/)) {
      // Extract post ID from URL pattern: /cohort/{cohortId}/board/{postId}
      const pathParts = currentPath.split("/");
      const boardIndex = pathParts.indexOf("board");
      if (boardIndex > 0 && pathParts[boardIndex + 1]) {
        const postId = parseInt(pathParts[boardIndex + 1]);
        if (!isNaN(postId)) {
          setSelectedPostId(postId);
          setShowPostModal(true);
        }
      }
    } else {
      setShowCreateModal(false);
      setEditPostId(null);
    }
  }, [location.pathname]);

  // Available filter options for post types
  const postTypeFilters = [
    { id: "all", label: "Everything" },
    { id: "announcements", label: "Announcements" },
    { id: "discussions", label: "Discussions" },
    { id: "questions", label: "Questions" },
    { id: "resources", label: "Resources" },
  ];

  // Sort options
  const sortOptions = [
    { id: "latest", label: "Sort by Latest" },
    { id: "oldest", label: "Sort by Oldest" },
  ];

  // Posts from options
  const postsFromOptions = [
    { id: "everyone", label: "Everyone" },
    { id: "admin", label: "Admin" },
    { id: "me", label: "Me" },
  ];

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  const handlePostsFromChange = (postsFromType) => {
    setPostsFrom(postsFromType);
  };

  const handleFilterDropdownToggle = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleFilterChange = (filterId) => {
    setActiveFilters((prev) => {
      if (filterId === "all") {
        return [];
      }
      if (prev.includes(filterId)) {
        return prev.filter((id) => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleCreatePost = () => {
    navigate(`/cohort/${cohortId}/board/create`);
  };

  const handleEditPost = (postId) => {
    setEditPostId(postId);
    setShowCreateModal(true);
    navigate(`/cohort/${cohortId}/board/${postId}/edit`);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setEditPostId(null);
    navigate(`/cohort/${cohortId}/board`);
  };

  const handleLike = (postId) => {
    // TODO: Implement like functionality with API call
    console.log("Like post:", postId);
  };

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setShowPostModal(true);
    navigate(`/cohort/${cohortId}/board/${postId}`);
  };

  const handleClosePostModal = () => {
    setShowPostModal(false);
    setSelectedPostId(null);
    navigate(`/cohort/${cohortId}/board`);
  };

  const handleRefresh = () => {
    fetchBoardData();
  };

  return (
    <>
      <CohortBoardUI
        cohortId={cohortId}
        cohortData={cohortData}
        boardData={boardData}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        searchQuery={searchQuery}
        activeFilters={activeFilters}
        showFilterDropdown={showFilterDropdown}
        sortBy={sortBy}
        postsFrom={postsFrom}
        postTypeFilters={postTypeFilters}
        sortOptions={sortOptions}
        postsFromOptions={postsFromOptions}
        user_type={user_type}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onFilterDropdownToggle={handleFilterDropdownToggle}
        onSortChange={handleSortChange}
        onPostsFromChange={handlePostsFromChange}
        onCreatePost={handleCreatePost}
        onEditPost={handleEditPost}
        onLike={handleLike}
        onPostClick={handlePostClick}
        onRefresh={handleRefresh}
      />

      {/* Create/Edit Post Modal */}
      {showCreateModal && (
        <CohortBoardCreateController
          cohortId={cohortId}
          editPostId={editPostId}
          onClose={handleCloseCreateModal}
          onSuccess={() => {
            handleCloseCreateModal();
            fetchBoardData();
          }}
        />
      )}

      {/* Post Detail Modal */}
      {showPostModal && selectedPostId && (
        <CohortBoardPostController
          cohortId={cohortId}
          postId={selectedPostId}
          onClose={handleClosePostModal}
          onEdit={handleEditPost}
        />
      )}
    </>
  );
};

export default CohortBoardController;
