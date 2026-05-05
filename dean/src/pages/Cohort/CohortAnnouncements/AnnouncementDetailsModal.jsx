import React, { useState, useEffect } from 'react';
import { 
  X, Pin, Calendar, MessageSquare, ThumbsUp, Send, 
  Trash2, Lock, Unlock, CheckCircle, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function AnnouncementDetailsModal({
  isOpen,
  onClose,
  announcement,
  isProfessor,
  onAddReply,
  onDeleteReply,
  onUpvoteReply,
  onToggleLock,
}) {
  const { user } = useAuth();
  const [replyText, setReplyText] = useState('');
  const [isOfficial, setIsOfficial] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Sort replies by upvotes (highest first) and official responses at top
  const sortedReplies = [...(announcement.replies || [])].sort((a, b) => {
    if (a.is_official && !b.is_official) return -1;
    if (!a.is_official && b.is_official) return 1;
    return (b.upvotes || 0) - (a.upvotes || 0);
  });

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const replyData = {
        content: replyText,
        is_official: isProfessor && isOfficial,
        author_name: user?.name || user?.email || 'Anonymous',
        author_id: user?.id || user?.user_id || 0,
        author_type: isProfessor ? "professor" : "student",
      };

      const result = await onAddReply(announcement.id, replyData);
      if (result.success) {
        setReplyText('');
        setIsOfficial(false);
      } else {
        setError(result.message || 'Failed to post reply');
      }
    } catch (err) {
      setError('An error occurred while posting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (replyId) => {
    try {
      await onUpvoteReply(announcement.id, replyId);
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      const result = await onDeleteReply(announcement.id, replyId);
      if (result.success) {
        setDeleteConfirm(null);
      } else {
        alert(result.message || 'Failed to delete reply');
      }
    } catch (err) {
      alert('An error occurred while deleting');
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {announcement.is_pinned && (
                <Pin size={18} className="text-blue-600 dark:text-blue-400 fill-current" />
              )}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {announcement.title}
              </h2>
              {announcement.is_locked && (
                <Lock size={18} className="text-gray-500 dark:text-gray-400" />
              )}
              {getPriorityBadge(announcement.priority)}
              {announcement.tags?.map((tag, index) => (
                <span
                  key={index}
                  className={`text-xs font-medium px-2 py-0.5 rounded ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span>By {announcement.author_name}</span>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(announcement.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  {announcement.replies_count || 0} {(announcement.replies_count || 0) <= 1 ? 'reply' : 'replies'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {/* Announcement Content */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {announcement.content}
            </p>
          </div>

          {/* Expiry Warning */}
          {announcement.expiry_date && new Date(announcement.expiry_date) > new Date() && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg text-sm text-orange-700 dark:text-orange-300">
              <AlertCircle size={16} />
              <span>
                This announcement will expire on{' '}
                {new Date(announcement.expiry_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}

          {/* Professor Controls */}
          {isProfessor && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <button
                onClick={() => onToggleLock(announcement.id, !announcement.is_locked)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  announcement.is_locked
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {announcement.is_locked ? (
                  <>
                    <Unlock size={16} />
                    Unlock Thread
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Lock Thread
                  </>
                )}
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {announcement.is_locked
                  ? 'Thread is locked. Students cannot reply.'
                  : 'Thread is open for discussion.'}
              </span>
            </div>
          )}

          {/* Replies Section */}
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
              Discussion ({sortedReplies.length})
            </h3>

            {/* Reply Form */}
            {!announcement.is_locked && (
              <form onSubmit={handleSubmitReply} className="mb-3">
                {error && (
                  <div className="flex items-center gap-2 p-3 mb-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={isProfessor ? "Post a reply or answer student questions..." : "Ask a question or post a comment..."}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none text-sm"
                  disabled={submitting}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3">
                    {isProfessor && (
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isOfficial}
                          onChange={(e) => setIsOfficial(e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          disabled={submitting}
                        />
                        <CheckCircle size={16} className={isOfficial ? 'text-blue-600' : 'text-gray-400'} />
                        Mark as Official Response
                      </label>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !replyText.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    {submitting ? 'Posting...' : 'Post Reply'}
                  </button>
                </div>
              </form>
            )}

            {announcement.is_locked && (
              <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-center">
                <Lock className="mx-auto mb-2 text-gray-400" size={20} />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This discussion thread has been locked by the professor
                </p>
              </div>
            )}

            {/* Replies List */}
            {sortedReplies.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="mx-auto mb-2" size={32} />
                <p>No replies yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedReplies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-3 rounded-lg border ${
                      reply.is_official
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {reply.author_name}
                        </span>
                        {Number(reply.author_id) === Number(user?.id || user?.user_id) ? (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            You
                          </span>
                        ) : (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            reply.author_type === 'professor'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          }`}>
                            {reply.author_type === 'professor' ? '👨‍🏫 Professor' : '👨‍🎓 Student'}
                          </span>
                        )}
                        {reply.is_official && (
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-blue-600 text-white font-medium">
                            <CheckCircle size={12} />
                            Official Response
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(reply.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {(isProfessor || Number(reply.author_id) === Number(user?.id || user?.user_id)) && (
                          <button
                            onClick={() => setDeleteConfirm(reply.id)}
                            className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap text-sm">
                      {reply.content}
                    </p>
                    <button
                      onClick={() => handleUpvote(reply.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        reply.upvoted_by_current_user
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <ThumbsUp size={14} className={reply.upvoted_by_current_user ? 'fill-current' : ''} />
                      <span>{reply.upvotes || 0} upvotes</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Reply</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete this reply?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteReply(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
