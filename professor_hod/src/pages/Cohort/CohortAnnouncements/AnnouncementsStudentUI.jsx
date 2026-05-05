import React, { useState, useMemo } from 'react';
import { MessageSquare, AlertCircle, Calendar, Pin, Lock, ChevronDown, Plus, ThumbsUp, Trash2, Edit2 } from 'lucide-react';
import AnnouncementDetailsModal from './AnnouncementDetailsModal';
import DiscussionFormModal from './DiscussionFormModal';

export default function AnnouncementsStudentUI({
  announcements,
  discussions,
  currentUser,
  loading,
  error,
  selectedAnnouncement,
  setSelectedAnnouncement,
  onRefresh,
  onAddReply,
  onDeleteReply,
  onUpvoteReply,
  onCreateDiscussion,
  onDeleteDiscussion,
  onEditDiscussion,
  onLikeDiscussion,
  onAddDiscussionReply,
  onDeleteDiscussionReply,
  onEditDiscussionReply,
  onLikeDiscussionReply,
}) {
  const [filter, setFilter] = useState('active'); // active, archived
  const [tagFilter, setTagFilter] = useState('all');
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [expandedDiscussionId, setExpandedDiscussionId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'discussion' | 'reply', discussionId, replyId }
  const [editingDiscussion, setEditingDiscussion] = useState(null);
  const [editDiscussionData, setEditDiscussionData] = useState({ title: '', content: '' });
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  // Memoized filter and sort for performance
  const sortedAnnouncements = useMemo(() => {
    // Filter announcements (students don't see archived by default)
    const filtered = announcements.filter(announcement => {
      if (filter === 'active' && announcement.is_archived) return false;
      if (filter === 'archived' && !announcement.is_archived) return false;
      if (tagFilter !== 'all' && !announcement.tags?.includes(tagFilter)) return false;
      return true;
    });

    // Sort: Pinned first, then by date
    return [...filtered].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [announcements, filter, tagFilter]);

  // Memoized filter for discussions
  const filteredDiscussions = useMemo(() => {
    if (!discussions) return [];
    
    // Only show discussions when tagFilter is 'all' or 'Discussion'
    if (tagFilter !== 'all' && tagFilter !== 'Discussion') return [];
    
    // Filter discussions based on main filter state
    return discussions.filter(discussion => {
      if (filter === 'active') {
        // 'active' shows only non-archived discussions
        return !discussion.is_archived;
      } else if (filter === 'archived') {
        // 'archived' shows only archived discussions
        return discussion.is_archived;
      }
      return true;
    });
  }, [discussions, tagFilter, filter]);

  const getTagColor = (tag) => {
    const colors = {
      'Exam': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      'Assignment': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'Urgent': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      'Class': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'General': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[tag] || colors['General'];
  };

  const getPriorityBadge = (priority) => {
    if (!priority) return null;
    const colors = {
      'Critical': 'bg-red-500 text-white',
      'Important': 'bg-orange-500 text-white',
    };
    return (
      <span className={`text-xs font-bold px-2 py-1 rounded ${colors[priority]}`}>
        {priority}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="px-3 sm:px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading announcements...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 sm:px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <div className="flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertCircle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4">
      <div className="flex gap-3 flex-col lg:flex-row items-start">
        {/* Left Side - Announcements List */}
        <div className="flex-1 w-full lg:w-auto space-y-4">
          {/* Announcements Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-3">
            {/* Header with Filters */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Announcements</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0">
                  Stay updated with course information
                </p>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none px-3 py-1.5 pr-9 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-colors"
            >
              <option value="active">Active Announcements</option>
              <option value="archived">Archived</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400" size={16} />
          </div>

          {/* Tag Filter Dropdown */}
          <div className="relative">
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="appearance-none px-3 py-1.5 pr-9 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-colors"
            >
              <option value="all">All Tags</option>
              <option value="Discussion">💬 Discussion</option>
              <option value="Exam">📝 Exam</option>
              <option value="Assignment">📚 Assignment</option>
              <option value="Urgent">🔥 Urgent</option>
              <option value="Class">📚 Class</option>
              <option value="General">💬 General</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400" size={16} />
          </div>
              </div>
            </div>
          </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {sortedAnnouncements.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
            <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No announcements yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'archived' 
                ? 'No archived announcements at the moment.'
                : 'Your professor hasn\'t posted any announcements yet. Check back later!'}
            </p>
          </div>
        ) : (
          <>
          {/* Pinned Announcements First */}
          {sortedAnnouncements.filter(a => a.is_pinned).map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl border ${
                announcement.is_pinned
                  ? 'border-blue-300 dark:border-blue-700 shadow-md'
                  : 'border-gray-200 dark:border-gray-700'
              } shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group`}
              onClick={() => setSelectedAnnouncement(announcement)}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {announcement.is_pinned && (
                        <Pin size={16} className="text-blue-600 dark:text-blue-400 fill-current flex-shrink-0" />
                      )}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {announcement.title}
                      </h3>
                      {announcement.is_locked && (
                        <Lock size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      )}
                      {getPriorityBadge(announcement.priority)}
                      {announcement.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                      {announcement.is_archived && (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Preview */}
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-2">
                  {announcement.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(announcement.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      {announcement.replies_count || 0} {(announcement.replies_count || 0) === 1 ? 'reply' : 'replies'}
                    </span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    View Details →
                  </span>
                </div>

                {/* Expiry Warning */}
                {announcement.expiry_date && new Date(announcement.expiry_date) > new Date() && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                      <AlertCircle size={14} />
                      <span>
                        Expires on {new Date(announcement.expiry_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

        {/* Student Discussions - After Pinned Announcements */}
        {filteredDiscussions && filteredDiscussions.map((discussion) => {
          const isExpanded = expandedDiscussionId === discussion.id;
          return (
          <div
            key={`discussion-${discussion.id}`}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-green-200 dark:border-green-700 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={16} className="text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {discussion.title}
                    </h3>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      Discussion
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>{discussion.author_name}</span>
                    {Number(discussion.author_id) === Number(currentUser?.id) ? (
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded text-xs font-medium">
                        You
                      </span>
                    ) : discussion.role === 'professor' ? (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded text-xs font-medium">
                        Professor
                      </span>
                    ) : discussion.role === 'student' ? (
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded text-xs font-medium">
                        Student
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex gap-1">
                  {currentUser.id === discussion.author_id && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingDiscussion(discussion.id);
                          setEditDiscussionData({ title: discussion.title, content: discussion.content });
                        }}
                        className="p-1 rounded text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({ type: 'discussion', discussionId: discussion.id });
                        }}
                        className="p-1 rounded text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Content - Show edit form if editing */}
              {editingDiscussion === discussion.id ? (
                <div className="mb-1.5 space-y-2">
                  <input
                    type="text"
                    value={editDiscussionData.title}
                    onChange={(e) => setEditDiscussionData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Discussion title..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    value={editDiscussionData.content}
                    onChange={(e) => setEditDiscussionData(prev => ({ ...prev, content: e.target.value }))}
                    rows={3}
                    placeholder="Discussion content..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingDiscussion(null);
                        setEditDiscussionData({ title: '', content: '' });
                      }}
                      className="flex-1 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        if (editDiscussionData.title.trim() && editDiscussionData.content.trim()) {
                          await onEditDiscussion(discussion.id, editDiscussionData);
                          setEditingDiscussion(null);
                          setEditDiscussionData({ title: '', content: '' });
                        }
                      }}
                      disabled={!editDiscussionData.title.trim() || !editDiscussionData.content.trim()}
                      className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Content */}
                  <p className="text-gray-700 dark:text-gray-300 mb-1.5 whitespace-pre-wrap">
                    {discussion.content}
                  </p>
                  {discussion.edited_at && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">(edited)</p>
                  )}
                </>
              )}

              {/* Footer - Counts and Action Buttons */}
              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(discussion.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={12} />
                    {discussion.likes_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={12} />
                    {discussion.replies?.length || 0} {(discussion.replies?.length || 0) <= 1 ? 'reply' : 'replies'}
                  </span>
                </div>

                {/* Action Buttons - Right Side */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLikeDiscussion(discussion.id);
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      discussion.liked_by_current_user
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } transition-colors`}
                    title="Like"
                  >
                    <ThumbsUp size={16} className={discussion.liked_by_current_user ? 'fill-current' : ''} />
                    <span>Like</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedDiscussionId(isExpanded ? null : discussion.id);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Reply"
                  >
                    <MessageSquare size={16} />
                    <span>Reply</span>
                  </button>
                </div>
              </div>

              {/* Replies Section */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {/* Existing Replies */}
                  {discussion.replies && discussion.replies.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {discussion.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                          {editingReply === reply.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editReplyContent}
                                onChange={(e) => setEditReplyContent(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingReply(null);
                                    setEditReplyContent('');
                                  }}
                                  className="flex-1 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={async () => {
                                    if (editReplyContent.trim()) {
                                      await onEditDiscussionReply(discussion.id, reply.id, { content: editReplyContent.trim() });
                                      setEditingReply(null);
                                      setEditReplyContent('');
                                    }
                                  }}
                                  disabled={!editReplyContent.trim()}
                                  className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                                    {reply.author_name}
                                  </span>
                                  {Number(reply.author_id) === Number(currentUser?.id) ? (
                                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded text-xs font-medium">
                                      You
                                    </span>
                                  ) : reply.role === 'professor' ? (
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded text-xs font-medium">
                                      Professor
                                    </span>
                                  ) : reply.role === 'student' ? (
                                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded text-xs font-medium">
                                      Student
                                    </span>
                                  ) : null}
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(reply.created_at).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </span>
                                  {reply.edited_at && (
                                    <span className="text-xs text-gray-400 dark:text-gray-500">(edited)</span>
                                  )}
                                </div>
                                {/* Only show buttons if current user is the author */}
                                {currentUser.id === reply.author_id && (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => {
                                        setEditingReply(reply.id);
                                        setEditReplyContent(reply.content);
                                      }}
                                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirm({ type: 'reply', discussionId: discussion.id, replyId: reply.id })}
                                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap mb-2">
                                {reply.content}
                              </p>
                              {/* Like count and button */}
                              <div className="flex items-center justify-between mt-2">
                                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                  <ThumbsUp size={12} />
                                  {reply.likes_count || 0}
                                </span>
                                <button
                                  onClick={() => onLikeDiscussionReply(discussion.id, reply.id)}
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                    reply.liked_by_current_user
                                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                  } transition-colors`}
                                >
                                  <ThumbsUp size={12} className={reply.liked_by_current_user ? 'fill-current' : ''} />
                                  <span>Like</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  <div className="flex gap-2">
                    <textarea
                      value={replyText[discussion.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [discussion.id]: e.target.value })}
                      placeholder="Write your reply..."
                      rows={2}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          const content = replyText[discussion.id]?.trim();
                          if (content) {
                            onAddDiscussionReply(discussion.id, {
                              content,
                              author_name: currentUser.name,
                              author_id: currentUser.id,
                              role: currentUser.role,
                            });
                            setReplyText({ ...replyText, [discussion.id]: '' });
                          }
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const content = replyText[discussion.id]?.trim();
                        if (content) {
                          onAddDiscussionReply(discussion.id, {
                            content,
                            author_name: currentUser.name,
                            author_id: currentUser.id,
                            role: currentUser.role,
                          });
                          setReplyText({ ...replyText, [discussion.id]: '' });
                        }
                      }}
                      disabled={!replyText[discussion.id]?.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        })}

          {/* Non-Pinned Announcements */}
          {sortedAnnouncements.filter(a => !a.is_pinned).map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group`}
              onClick={() => setSelectedAnnouncement(announcement)}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {announcement.title}
                      </h3>
                      {announcement.is_locked && (
                        <Lock size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      )}
                      {getPriorityBadge(announcement.priority)}
                      {announcement.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                      {announcement.is_archived && (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Preview */}
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-2">
                  {announcement.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 flex-wrap gap-3">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="flex-shrink-0" />
                      {new Date(announcement.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      {announcement.replies_count || 0} {(announcement.replies_count || 0) <= 1 ? 'reply' : 'replies'}
                    </span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    View Details →
                  </span>
                </div>

                {/* Expiry Warning */}
                {announcement.expiry_date && new Date(announcement.expiry_date) > new Date() && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                      <AlertCircle size={14} />
                      <span>
                        Expires on {new Date(announcement.expiry_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          </>
        )}
      </div>
    </div>

       {/* Right Side - Create Discussion Section (Desktop) */}
        <div className="hidden lg:flex flex-col gap-3 w-full lg:w-[280px] xl:w-[300px] flex-shrink-0">
          <div className="lg:sticky lg:top-4 self-start">
            {/* Highlighted Create Section */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 shadow-lg">
              <div className="flex flex-col gap-2.5">
                {/* Header with icon */}
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-white" />
                  <h4 className="text-sm font-semibold text-white">Create New Discussion</h4>
                </div>
                
                {/* Subtitle */}
                <p className="text-xs text-green-100 leading-snug">
                  Have a question? Start a discussion with your peers
                </p>
                
                {/* Button */}
                <button
                  onClick={() => setShowDiscussionModal(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all shadow-sm hover:shadow-md border border-transparent dark:border-gray-700"
                >
                  <Plus size={16} className="text-green-600 dark:text-green-400" />
                  New Discussion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

     {/* Floating Action Button (Mobile) */}
<button
  onClick={() => setShowDiscussionModal(true)}
  className="lg:hidden fixed bottom-20 right-6 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 px-4 py-3 z-40 active:scale-95"
  title="Start Discussion"
>
  <Plus size={20} />
  <span className="text-sm font-semibold whitespace-nowrap">Start Discussion</span>
</button>
     {/* Details Modal */}
      {selectedAnnouncement && (
        <AnnouncementDetailsModal
          isOpen={!!selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          announcement={selectedAnnouncement}
          isProfessor={false}
          onAddReply={onAddReply}
          onDeleteReply={onDeleteReply}
          onUpvoteReply={onUpvoteReply}
        />
      )}

      {/* Discussion Form Modal */}
      <DiscussionFormModal
        isOpen={showDiscussionModal}
        onClose={() => setShowDiscussionModal(false)}
        onSubmit={onCreateDiscussion}
        currentUser={currentUser}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            {/* Header with Icon */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {deleteConfirm.type === 'discussion' ? 'Delete Discussion' : 'Delete Reply'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Message */}
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this {deleteConfirm.type === 'discussion' ? 'discussion' : 'reply'}?
            </p>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'discussion') {
                    onDeleteDiscussion(deleteConfirm.discussionId);
                  } else {
                    onDeleteDiscussionReply(deleteConfirm.discussionId, deleteConfirm.replyId);
                  }
                  setDeleteConfirm(null);
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
