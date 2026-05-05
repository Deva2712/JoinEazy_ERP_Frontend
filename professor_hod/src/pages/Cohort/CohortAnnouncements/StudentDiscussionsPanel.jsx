import React, { useState } from 'react';
import { Plus, ThumbsUp, MessageSquare, Trash2, Send, X, Edit2 } from 'lucide-react';

export default function StudentDiscussionsPanel({ 
  cohortId, 
  discussions, 
  onCreateDiscussion, 
  onDeleteDiscussion,
  onEditDiscussion,
  onAddReply,
  onDeleteReply,
  onEditReply,
  onLikeDiscussion,
  onLikeReply,
  currentUser 
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [creating, setCreating] = useState(false);
  const [editingDiscussion, setEditingDiscussion] = useState(null);
  const [editDiscussionData, setEditDiscussionData] = useState({ title: '', content: '' });
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  const handleCreate = async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) return;

    setCreating(true);
    console.log('Creating discussion with currentUser:', currentUser);
    const result = await onCreateDiscussion({
      title: newDiscussion.title.trim(),
      content: newDiscussion.content.trim(),
      author_name: currentUser.name,
      author_id: currentUser.id,
      role: currentUser.role,
    });

    if (result.success) {
      setNewDiscussion({ title: '', content: '' });
      setShowCreateForm(false);
    }
    setCreating(false);
  };

  const handleAddReply = async (discussionId) => {
    const text = replyText[discussionId]?.trim();
    if (!text) return;

    const result = await onAddReply(discussionId, {
      content: text,
      author_name: currentUser.name,
      author_id: currentUser.id,
      role: currentUser.role,
    });

    if (result.success) {
      setReplyText(prev => ({ ...prev, [discussionId]: '' }));
    }
  };

  const handleEditDiscussion = async (discussionId) => {
    if (!editDiscussionData.title.trim() || !editDiscussionData.content.trim()) return;

    const result = await onEditDiscussion(discussionId, {
      title: editDiscussionData.title.trim(),
      content: editDiscussionData.content.trim(),
    });

    if (result.success) {
      setEditingDiscussion(null);
      setEditDiscussionData({ title: '', content: '' });
    }
  };

  const handleEditReply = async (discussionId, replyId) => {
    if (!editReplyContent.trim()) return;

    const result = await onEditReply(discussionId, replyId, {
      content: editReplyContent.trim(),
    });

    if (result.success) {
      setEditingReply(null);
      setEditReplyContent('');
    }
  };

  const startEditDiscussion = (discussion) => {
    setEditingDiscussion(discussion.id);
    setEditDiscussionData({ title: discussion.title, content: discussion.content });
  };

  const cancelEditDiscussion = () => {
    setEditingDiscussion(null);
    setEditDiscussionData({ title: '', content: '' });
  };

  const startEditReply = (reply) => {
    setEditingReply(reply.id);
    setEditReplyContent(reply.content);
  };

  const cancelEditReply = () => {
    setEditingReply(null);
    setEditReplyContent('');
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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Discussions</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Ask questions and help each other
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700">
          <div className="space-y-2">
            <input
              type="text"
              value={newDiscussion.title}
              onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Question title..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={creating}
            />
            <textarea
              value={newDiscussion.content}
              onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Describe your question..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={creating}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewDiscussion({ title: '', content: '' });
                }}
                disabled={creating}
                className="flex-1 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !newDiscussion.title.trim() || !newDiscussion.content.trim()}
                className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Posting...' : 'Post Question'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discussions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {discussions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <MessageSquare className="mx-auto mb-2" size={40} />
              <p className="text-sm">No discussions yet</p>
              <p className="text-xs mt-1">Be the first to ask a question!</p>
            </div>
          </div>
        ) : (
          discussions.map((discussion) => {
            const isExpanded = expandedDiscussion === discussion.id;
            const isOwner = discussion.author_id === currentUser.id;
            const isEditingThis = editingDiscussion === discussion.id;

            return (
              <div
                key={discussion.id}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Discussion Header */}
                <div className="p-3">
                  {isEditingThis ? (
                    /* Edit Discussion Form */
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editDiscussionData.title}
                        onChange={(e) => setEditDiscussionData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Question title..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <textarea
                        value={editDiscussionData.content}
                        onChange={(e) => setEditDiscussionData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Describe your question..."
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={cancelEditDiscussion}
                          className="flex-1 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditDiscussion(discussion.id)}
                          disabled={!editDiscussionData.title.trim() || !editDiscussionData.content.trim()}
                          className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
                            {discussion.title}
                            {discussion.edited_at && (
                              <span className="ml-2 text-xs text-gray-400 dark:text-gray-500 font-normal">(edited)</span>
                            )}
                          </h4>
                        </div>
                        <div className="flex gap-1">
                          {isOwner && (
                            <>
                              <button
                                onClick={() => startEditDiscussion(discussion)}
                                className="p-1 rounded text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => onDeleteDiscussion(discussion.id)}
                                className="p-1 rounded text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                            <span className={discussion.role === 'professor' ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}>
                              {discussion.author_name}
                            </span>
                            {Number(discussion.author_id) === Number(currentUser?.id) ? (
                              <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-[10px] font-medium">
                                You
                              </span>
                            ) : discussion.role === 'professor' ? (
                              <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px] font-medium">
                                Professor
                              </span>
                            ) : discussion.role === 'student' ? (
                              <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-[10px] font-medium">
                                Student
                              </span>
                            ) : null}
                            <span>•</span>
                            <span>{formatTime(discussion.created_at)}</span>
                          </div>

                      {/* Content Preview/Full */}
                      <p className={`text-sm text-gray-700 dark:text-gray-300 mt-0.5 ${!isExpanded && 'line-clamp-2'}`}>
                        {discussion.content}
                      </p>

                      {/* Footer - Counts and Action Buttons */}
                      <div className="flex items-center justify-between gap-2 mt-1.5">
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={11} />
                            {discussion.likes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={11} />
                            {discussion.replies?.length || 0}
                          </span>
                        </div>

                        {/* Action Buttons - Right Side */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => onLikeDiscussion(discussion.id)}
                            className={`flex items-center gap-0.5 px-2 py-1 rounded text-[11px] font-medium ${
                              discussion.liked_by_current_user
                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            } transition-colors`}
                            title="Like"
                          >
                            <ThumbsUp size={13} className={discussion.liked_by_current_user ? 'fill-current' : ''} />
                            <span>Like</span>
                          </button>
                          <button
                            onClick={() => setExpandedDiscussion(isExpanded ? null : discussion.id)}
                            className="flex items-center gap-0.5 px-2 py-1 rounded text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Reply"
                          >
                            <MessageSquare size={13} />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Replies Section */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {/* Replies List */}
                    {discussion.replies?.length > 0 && (
                      <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                        {discussion.replies.map((reply) => {
                          const isReplyOwner = reply.author_id === currentUser.id;
                          const isEditingThisReply = editingReply === reply.id;
                          
                          return (
                            <div
                              key={reply.id}
                              className="flex gap-2 text-sm"
                            >
                              {isEditingThisReply ? (
                                /* Edit Reply Form */
                                <div className="flex-1 space-y-2">
                                  <textarea
                                    value={editReplyContent}
                                    onChange={(e) => setEditReplyContent(e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={cancelEditReply}
                                      className="flex-1 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleEditReply(discussion.id, reply.id)}
                                      disabled={!editReplyContent.trim()}
                                      className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`text-xs font-medium ${
                                        reply.role === 'professor' 
                                          ? 'text-blue-600 dark:text-blue-400' 
                                          : 'text-gray-600 dark:text-gray-400'
                                      }`}>
                                        {reply.author_name}
                                      </span>
                                      {Number(reply.author_id) === Number(currentUser.id) ? (
                                        <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-[10px]">
                                          You
                                        </span>
                                      ) : (
                                        <>
                                          {reply.role === 'professor' && (
                                            <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px]">
                                              Professor
                                            </span>
                                          )}
                                          {reply.role === 'student' && (
                                            <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-[10px]">
                                              Student
                                            </span>
                                          )}
                                        </>
                                      )}
                                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                        {formatTime(reply.created_at)}
                                      </span>
                                      {reply.edited_at && (
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500">(edited)</span>
                                      )}
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">{reply.content}</p>
                                    <button
                                      onClick={() => onLikeReply(discussion.id, reply.id)}
                                      className={`flex items-center gap-1 mt-1 text-xs ${
                                        reply.liked_by_current_user
                                          ? 'text-blue-600 dark:text-blue-400'
                                          : 'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'
                                      } transition-colors`}
                                    >
                                      <ThumbsUp size={12} className={reply.liked_by_current_user ? 'fill-current' : ''} />
                                      <span>{reply.likes || 0}</span>
                                    </button>
                                  </div>
                                  {isReplyOwner && (
                                    <div className="flex flex-col gap-1">
                                      <button
                                        onClick={() => startEditReply(reply)}
                                        className="p-1 rounded text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                      >
                                        <Edit2 size={12} />
                                      </button>
                                      <button
                                        onClick={() => onDeleteReply(discussion.id, reply.id)}
                                        className="p-1 rounded text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Reply Input */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyText[discussion.id] || ''}
                          onChange={(e) => setReplyText(prev => ({ ...prev, [discussion.id]: e.target.value }))}
                          placeholder="Write a reply..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAddReply(discussion.id);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleAddReply(discussion.id)}
                          disabled={!replyText[discussion.id]?.trim()}
                          className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
