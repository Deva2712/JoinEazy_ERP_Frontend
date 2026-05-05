import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CohortBoardPostUI from "./CohortBoardPostUI";

const CohortBoardPostController = ({
  cohortId,
  cohortData,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams();

  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeState, setLikeState] = useState(false);
  const [shareState, setShareState] = useState({
    text: "Share",
    clicked: false,
  });
  const [commentsData, setCommentsData] = useState([]);

  // Extract postId from URL if useParams doesn't work
  const extractPostIdFromUrl = () => {
    const currentPath = location.pathname;
    const pathParts = currentPath.split("/");
    const boardIndex = pathParts.indexOf("board");
    if (boardIndex > 0 && pathParts[boardIndex + 1]) {
      const extractedPostId = parseInt(pathParts[boardIndex + 1]);
      return !isNaN(extractedPostId) ? extractedPostId : null;
    }
    return null;
  };

  const currentPostId = postId || extractPostIdFromUrl();

  useEffect(() => {
    console.log(
      "useEffect triggered - isOpen:",
      isOpen,
      "postId:",
      currentPostId,
      "location:",
      location.pathname,
    );

    if (isOpen && currentPostId) {
      fetchPostData(currentPostId);
    } else {
      console.log(
        "Conditions not met for fetching post data - isOpen:",
        isOpen,
        "currentPostId:",
        currentPostId,
      );
      // Reset loading state when modal is closed
      if (!isOpen) {
        setLoading(true);
        setPostData(null);
      }
    }
  }, [isOpen, currentPostId, location.pathname]);

  const fetchPostData = async (id) => {
    try {
      console.log("Fetching post data for postId:", id);
      setLoading(true);
      
      // Call the API to get all board posts
      const response = await cohortAPI.getBoardPosts(cohortId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch post data');
      }
      
      // Find the specific post by ID
      const post = response.data.posts.find(post => post.id === parseInt(id));
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      console.log("Post data loaded:", post);
      setPostData(post);
      setLikeState(post.isLiked || false);

      // Use comments from the API response if available, otherwise use empty array
      const comments = post.comments || [];
      setCommentsData(comments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post data:", error);
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLikeState(!likeState);
    // Update post data likes count
    if (postData) {
      setPostData((prev) => ({
        ...prev,
        likes: likeState ? prev.likes - 1 : prev.likes + 1,
        isLiked: !likeState,
      }));
    }
  };

  const handleCommentLike = (commentId) => {
    setCommentsData((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      }),
    );
  };

  const handleCommentShare = async (commentId) => {
    try {
      // Create link that scrolls to the specific comment
      const commentUrl = `${window.location.href}#comment-${commentId}`;
      await navigator.clipboard.writeText(commentUrl);

      // Optional: Show success message
      console.log("Comment link copied:", commentUrl);

      // Optional: Scroll to the comment
      setTimeout(() => {
        const commentElement = document.getElementById(`comment-${commentId}`);
        if (commentElement) {
          commentElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    } catch (error) {
      console.error("Failed to copy comment link:", error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareState({
        text: "Copied",
        clicked: true,
      });

      setTimeout(() => {
        setShareState({
          text: "Share",
          clicked: false,
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleEdit = () => {
    // Navigate to edit URL
    const currentPath = location.pathname;
    navigate(`${currentPath}/edit`);
  };

  const handleDeletePost = () => {
    // Dummy delete handler - replace with actual API call
    console.log("Delete post:", postData?.id);
    // You can add confirmation dialog here before deletion
    // After successful deletion, close modal and refresh the board
  };

  const handleDeleteComment = (commentId) => {
    // Dummy delete handler - replace with actual API call
    console.log("Delete comment:", commentId);
    // You can add confirmation dialog here before deletion
    // After successful deletion, remove from comments array
  };

  const handleTagToNote = () => {
    // Extract cohort ID from current URL
    const currentPath = location.pathname;
    const pathParts = currentPath.split("/");
    const cohortIndex = pathParts.indexOf("c");
    const cohortId = cohortIndex >= 0 ? pathParts[cohortIndex + 1] : "1";

    // Navigate to notes create with current URL as tag
    const currentUrl = window.location.href;
    navigate(
      `/c/${cohortId}/notes/create?tag=${encodeURIComponent(currentUrl)}`,
    );
  };

  const handleCommentSubmit = (commentText) => {
    // Dummy implementation for now
    console.log("New comment submitted:", commentText);

    // Here you would typically:
    // 1. Make API call to save the comment
    // 2. Update the commentsData state with the new comment
    // 3. Show success/error messages
  };

  const handleClose = () => {
    setPostData(null);
    setLoading(true);
    onClose();
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <CohortBoardPostUI
      isOpen={isOpen}
      onClose={handleClose}
      postData={postData}
      loading={loading}
      likeState={likeState}
      shareState={shareState}
      onLike={handleLike}
      onShare={handleShare}
      onTagToNote={handleTagToNote}
      cohortData={cohortData}
      isEditable={postData?.isEditable || false}
      onEdit={handleEdit}
      onDelete={handleDeletePost}
      commentsData={commentsData}
      onCommentLike={handleCommentLike}
      onCommentDelete={handleDeleteComment}
      onCommentShare={handleCommentShare}
      onCommentSubmit={handleCommentSubmit}
    />
  );
};

export default CohortBoardPostController;
