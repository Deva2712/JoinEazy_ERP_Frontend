import React, { useState, useEffect } from "react";
import {
  X,
  Heart,
  Share2,
  MessageCircle,
  Edit,
  Trash2,
  Tag,
} from "lucide-react";

const CohortBoardPostUI = ({
  isOpen,
  onClose,
  postData,
  loading,
  likeState,
  shareState,
  onLike,
  onShare,
  onTagToNote,
  cohortData,
  isEditable = false,
  onEdit,
  onDelete,
  commentsData,
  onCommentLike,
  onCommentDelete,
  onCommentShare,
  onCommentSubmit,
}) => {
  const [newComment, setNewComment] = useState("");

  if (!isOpen) return null;

  const getTypeColor = (type) => {
    const colors = {
      announcement: "#ef4444",
      question: "#3b82f6",
      discussion: "#8b5cf6",
      resource: "#10b981",
    };
    return colors[type] || "#6b7280";
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:p-4 overflow-y-auto overflow-x-hidden">
      <div className="bg-white sm:rounded-2xl w-full sm:max-w-[80%] lg:max-w-[50%] h-[100vh] sm:h-auto sm:max-h-[90vh] flex flex-col my-auto sm:border border-[#52586633]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#52586633]">
          <h2 className="text-lg sm:text-xl font-bold text-black">
            {loading ? "Loading..." : postData?.title || "Post Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-lg text-gray-600">Loading post...</div>
            </div>
          ) : postData ? (
            <div>
              {/* Post Cover Image - Full Width */}
              {postData.cover && (
                <div className="w-full">
                  <img
                    src={postData.cover}
                    alt="Post cover"
                    className="w-full h-auto object-cover aspect-[21/9]"
                  />
                </div>
              )}

              <div className="p-4 sm:p-5">
                {/* Author Section with Post Type */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={postData.authorAvatar}
                      alt={postData.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h4 className="font-medium text-[15px] text-black">
                        {postData.author}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {postData.timeText}
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-3 py-1.5 text-xs font-medium rounded-full text-white"
                    style={{ backgroundColor: getTypeColor(postData.type) }}
                  >
                    {postData.type}
                  </span>
                </div>

                {/* Post Content */}
                <div className="mb-6">
                  <div className="text-base leading-relaxed text-black">
                    {postData.content.split("\n").map((paragraph, index) =>
                      paragraph.trim() ? (
                        <p key={index} className="mb-4 last:mb-0">
                          {paragraph.trim()}
                        </p>
                      ) : null,
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  className={`flex ${isEditable ? "flex-col sm:flex-row sm:items-center" : "items-center"} justify-between gap-y-3 py-4 border-t border-b border-[#52586633]`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={onLike}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <Heart
                        size={20}
                        fill={likeState ? "#ef4444" : "none"}
                        color={likeState ? "#ef4444" : "#6B7280"}
                      />
                      <span className="text-sm font-medium">
                        {postData.likes} likes
                      </span>
                    </button>
                    {isEditable && (
                      <>
                        <button
                          onClick={onEdit}
                          className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
                        >
                          <Edit size={18} />
                          <span className="text-sm font-medium">Edit</span>
                        </button>

                        <button
                          onClick={onDelete}
                          className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={onShare}
                      className="flex items-center gap-2 transition-colors"
                      style={{
                        color: shareState.clicked ? "#16a34a" : "#4B5563",
                      }}
                    >
                      <Share2 size={18} />
                      <span className="text-sm font-medium">
                        {shareState.text}
                      </span>
                    </button>
                    <button
                      onClick={onTagToNote}
                      className="flex items-center gap-2 text-gray-600 hover:text-purple-500 transition-colors"
                    >
                      <Tag size={18} />
                      <span className="text-sm font-medium">Tag to Note</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="mt-5 sm:mt-6 mb-2">
                  <h3 className="text-[17px] sm:text-lg font-semibold text-black mb-3.5">
                    {commentsData?.length || 0} Comments
                  </h3>

                  {/* Add Comment Input */}
                  <div className="mb-6 p-4 bg-[#f2f2f2] border border-[#52586633] rounded-[10px] sm:rounded-xl">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full min-h-[60px] text-sm bg-transparent border-none focus:outline-none resize-none placeholder-gray-500"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => {
                          onCommentSubmit(newComment);
                          setNewComment("");
                        }}
                        disabled={!newComment.trim()}
                        className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "rgb(30, 97, 240)" }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>

                  {commentsData && commentsData.length > 0 ? (
                    <div className="space-y-6">
                      {commentsData.map((comment) => (
                        <div
                          key={comment.id}
                          id={`comment-${comment.id}`}
                          className=""
                        >
                          {/* Comment Author Info */}
                          <div className="flex items-center gap-4">
                            <img
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                              <h4 className="font-medium text-[15px] text-black">
                                {comment.authorName}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {comment.description}
                              </p>
                            </div>
                          </div>

                          {/* Comment Content */}
                          <div className="my-2.5 sm:ml-14">
                            <p className="text-[15px] sm:text-base text-black leading-normal">
                              {comment.content}
                            </p>
                          </div>

                          {/* Comment Actions */}
                          <div className="flex items-center justify-between mt-[1px] sm:ml-14">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => onCommentLike(comment.id)}
                                className="flex items-center gap-1.5 text-gray-600 transition-colors"
                              >
                                <Heart
                                  size={17}
                                  fill={comment.isLiked ? "#ef4444" : "none"}
                                  color={
                                    comment.isLiked ? "#ef4444" : "#6B7280"
                                  }
                                />
                                <span className="text-sm">
                                  {comment.likes} likes
                                </span>
                              </button>

                              {comment.isEditable && (
                                <button
                                  onClick={() => onCommentDelete(comment.id)}
                                  className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={17} className="mb-[1px]" />
                                  <span className="text-sm">Delete</span>
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() => onCommentShare(comment.id)}
                              className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors"
                            >
                              <Share2 size={17} />
                              <span className="text-sm">Share</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No comments yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12">
              <div className="text-lg text-gray-600">Post not found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CohortBoardPostUI;
