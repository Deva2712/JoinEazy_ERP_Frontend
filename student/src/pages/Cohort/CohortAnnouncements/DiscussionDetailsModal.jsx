import React, { useState } from 'react';
import { X, MessageSquare, ThumbsUp, Trash2, Send, Calendar, Edit2 } from 'lucide-react';

export default function DiscussionDetailsModal({ 
  isOpen, 
  onClose, 
  discussion,
  currentUser,
  onAddReply,
  onDeleteReply,
  onEditDiscussion,
  onEditReply,
  onLikeDiscussion,
  onLikeReply,
  onDeleteDiscussion
}) {
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingDiscussion, setEditingDiscussion] = useState(false);
  const [editDiscussionData, setEditDiscussionData] = useState({ title: '', content: '' });
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  if (!isOpen || !discussion) return null;

  const handleAddReply = async () => {
    if (!replyText.trim()) return;
    
    setSubmitting(true);
    try {
      const result = await onAddReply(discussion.id, {
        content: replyText.trim(),
        author_name: currentUser.name,
        author_id: currentUser.id,
        role: currentUser.role,
      });
      
      if (result && result.success) {
        setReplyText('');
      }
    } catch (err) {
      console.error('Error adding reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 172800) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleEditDiscussion = async () => {
    if (!editDiscussionData.title.trim() || !editDiscussionData.content.trim()) return;
    
    setSubmitting(true);
    try {
      const result = await onEditDiscussion(discussion.id, {
        title: editDiscussionData.title.trim(),
        content: editDiscussionData.content.trim(),
      });
      
      if (result && result.success) {
        setEditingDiscussion(false);
      }
    } catch (err) {
      console.error('Error editing discussion:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReply = async (replyId) => {
    if (!editReplyContent.trim()) return;
    
    setSubmitting(true);
    try {
      const result = await onEditReply(discussion.id, replyId, {
        content: editReplyContent.trim(),
      });
      
      if (result && result.success) {
        setEditingReply(null);
        setEditReplyContent('');
      }
    } catch (err) {
      console.error('Error editing reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="text-green-600 dark:text-green-400" size={20} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{discussion.title}</h2>
                <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  Discussion
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {discussion.author_name}
                </span>
                {Number(discussion.author_id) === Number(currentUser.id) ? (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded text-xs font-medium">
                    You
                  </span>
                ) : (
                  <>
                    {discussion.role === 'professor' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded text-xs font-medium">
                        Professor
                      </span>
                    )}
                    {discussion.role === 'student' && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded text-xs font-medium">
                        Student
                      </span>
                    )}
                  </>
                )}
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatTime(discussion.created_at)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentUser.id === discussion.author_id && (
                <button
                  onClick={() => {
                    setEditingDiscussion(true);
                    setEditDiscussionData({ title: discussion.title, content: discussion.content });
                  }}
                  className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  title="Edit discussion"
                >
                  <Edit2 size={18} />
                </button>
              )}
              {(currentUser.role === 'professor' || currentUser.id === discussion.author_id) && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this discussion?')) {
                      onDeleteDiscussion(discussion.id);
                      onClose();
                    }
                  }}
                  className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete discussion"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Original Discussion Content */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4">
            {editingDiscussion ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editDiscussionData.title}
                  onChange={(e) => setEditDiscussionData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Discussion title..."
                />
                <textarea
                  value={editDiscussionData.content}
                  onChange={(e) => setEditDiscussionData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Discussion content..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingDiscussion(false)}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditDiscussion}
                    disabled={submitting || !editDiscussionData.title.trim() || !editDiscussionData.content.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{discussion.content}</p>
                {discussion.edited_at && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">(edited)</p>
                )}
                
                {/* Like Button */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => onLikeDiscussion(discussion.id)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ThumbsUp size={16} className={discussion.liked_by_current_user ? 'fill-current text-blue-600' : ''} />
                    {discussion.likes_count || 0} {discussion.likes_count === 1 ? 'Like' : 'Likes'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Replies Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              {discussion.replies?.length || 0} {(discussion.replies?.length || 0) <= 1 ? 'Reply' : 'Replies'}
            </h3>
            
            {discussion.replies && discussion.replies.length > 0 ? (
              discussion.replies.map((reply) => (
                <div key={reply.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  {editingReply === reply.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editReplyContent}
                        onChange={(e) => setEditReplyContent(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingReply(null);
                            setEditReplyContent('');
                          }}
                          disabled={submitting}
                          className="flex-1 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditReply(reply.id)}
                          disabled={submitting || !editReplyContent.trim()}
                          className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'Saving...' : 'Save'}
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
                          {Number(reply.author_id) === Number(currentUser.id) ? (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded text-xs font-medium">
                              You
                            </span>
                          ) : (
                            <>
                              {reply.role === 'professor' && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded text-xs font-medium">
                                  Professor
                                </span>
                              )}
                              {reply.role === 'student' && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded text-xs font-medium">
                                  Student
                                </span>
                              )}
                            </>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(reply.created_at)}
                          </span>
                          {reply.edited_at && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">(edited)</span>
                          )}
                        </div>
                        {currentUser.id === reply.author_id && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditingReply(reply.id);
                                setEditReplyContent(reply.content);
                              }}
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 p-1"
                              title="Edit reply"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => onDeleteReply(discussion.id, reply.id)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 p-1"
                              title="Delete reply"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                        {currentUser.role === 'professor' && currentUser.id !== reply.author_id && (
                          <button
                            onClick={() => onDeleteReply(discussion.id, reply.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 p-1"
                            title="Delete reply"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 whitespace-pre-wrap">
                        {reply.content}
                      </p>
                      {/* Like count and button */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <ThumbsUp size={12} />
                          {reply.likes_count || 0}
                        </span>
                        <button
                          onClick={() => onLikeReply(discussion.id, reply.id)}
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
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                No replies yet. Be the first to respond!
              </div>
            )}
          </div>
        </div>

        {/* Reply Input */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex gap-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              rows={2}
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              disabled={submitting}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddReply();
                }
              }}
            />
            <button
              onClick={handleAddReply}
              disabled={submitting || !replyText.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={16} />
              {submitting ? 'Sending...' : 'Reply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
