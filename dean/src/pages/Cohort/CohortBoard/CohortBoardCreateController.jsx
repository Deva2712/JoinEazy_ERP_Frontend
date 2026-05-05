import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CohortBoardCreateUI from "./CohortBoardCreateUI";
import { cohortService } from "../../../api/services/cohort.service";
import { uploadService } from "../../../api/services/upload.service";

const CohortBoardCreateController = ({
  cohortId,
  cohortData,
  isOpen,
  onClose,
  editMode = false,
  editPostId = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    postFor: "Everyone",
    selectedMember: null,
    selectedGroup: null,
    postType: "",
  });

  const [error, setError] = useState("");

  const user_type = cohortData?.user_type || 0;
  const memberType = cohortData?.memberType || 1; // 0 for individual, 1 for group

  // Populate form data when editing
  useEffect(() => {
    setPostData({
      title: "",
      content: "",
      postFor: "Everyone",
      selectedMember: null,
      selectedGroup: null,
      postType: "",
    });
  }, [editMode]);

  // Use actual data from cohortData
  const membersList = cohortData?.members || [];
  const groupsList = cohortData?.groups || [];

  // Generate post for options based on user_type and memberType
  const getPostForOptions = () => {
    const options = ["Everyone"];

    if (user_type === 0) {
      options.push("Admin");
    } else {
      options.push("Select Member");
      if (memberType === 1) {
        options.push("Select Group");
      }
    }

    return options;
  };

  const postForOptions = getPostForOptions();

  const handleSave = async () => {
    try {
      if (editMode && editPostId) {
        // Call API to update post
        const response = await cohortService.updatePost(cohortId, editPostId, postData);
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to update post');
        }
        
        // Close modal and navigate back
        onClose();
      } else {
        // Call API to create post
        const response = await cohortService.createPost(cohortId, postData);
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to create post');
        }
        
        // Close modal and navigate back
        onClose();
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err.message || 'Failed to save post. Please try again.');
      
      // Clear error after 3 seconds
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleCoverUpload = async (file) => {
    try {
      // Use the uploadService to upload the cover image
      const response = await uploadService.uploadFile(file, 'post_cover');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload cover image');
      }
      
      const data = await response.json();
      
      // Update post data with the image URL
      setPostData(prev => ({
        ...prev,
        coverImage: data.fileUrl
      }));
      
      return [true, "Cover image uploaded successfully"];
    } catch (err) {
      console.error('Error uploading cover image:', err);
      return [false, err.message || "Failed to upload cover image. Please try again."];
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const handleCreatePost = () => {
    setShowCreateModal(true);
    const currentPath = location.pathname;
    if (!currentPath.includes("/create")) {
      navigate(currentPath + "/create");
    }
  };

  const handleFilterDropdownToggle = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  const handlePostsFromChange = (postsFromOption) => {
    setPostsFrom(postsFromOption);
  };

  const handleClose = () => {
    // Clear form data
    setPostData({
      title: "",
      content: "",
      postFor: "Everyone",
      selectedMember: null,
      selectedGroup: null,
      postType: "",
    });
    setError("");
    onClose();
  };

  return (
    <CohortBoardCreateUI
      isOpen={isOpen}
      onClose={handleClose}
      postData={postData}
      setPostData={setPostData}
      handleSave={handleSave}
      error={error}
      postForOptions={postForOptions}
      membersList={membersList}
      groupsList={groupsList}
      memberType={memberType}
      user_type={user_type}
      handleCoverUpload={handleCoverUpload}
      cohortId={cohortId}
      editMode={editMode}
      editPostId={editPostId}
    />
  );
};

export default CohortBoardCreateController;
