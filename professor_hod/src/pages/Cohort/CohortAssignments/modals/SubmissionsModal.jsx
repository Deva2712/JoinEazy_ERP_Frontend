import React, { useState } from "react";
import { X, AlertCircle, Users, CheckCircle } from "lucide-react";

const SubmissionsModal = ({ isOpen, onClose, assignment, submissions = [], totalMembers, totalGroups }) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  if (!isOpen || !assignment) return null;

  const isGroupAssignment = assignment.type === 'group';
  const totalCount = isGroupAssignment ? totalGroups : totalMembers;
  const submittedCount = submissions.length;
  const notSubmittedCount = totalCount - submittedCount;

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{assignment.name} - Submissions</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {submittedCount} of {totalCount} {isGroupAssignment ? 'groups' : 'students'} submitted
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                  {isGroupAssignment ? (
                    <>
                      <div 
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => toggleGroup(submission.groupId || index)}
                      >
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{submission.groupName || `Group ${index + 1}`}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {submission.members?.length || 0} members • Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className={`text-gray-400 dark:text-gray-500 transition-transform ${expandedGroups.has(submission.groupId || index) ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </div>
                      </div>
                      
                      {expandedGroups.has(submission.groupId || index) && submission.members && (
                        <div className="border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Group Members:</p>
                          <div className="space-y-2">
                            {submission.members.map((member, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pl-4">
                                <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                                <span>{member.name}</span>
                                {member.isLeader && (
                                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                                    Leader
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            {submission.studentName?.charAt(0).toUpperCase() || 'S'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{submission.studentName || 'Student'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-green-600">{submittedCount} submitted</span>
            <span className="mx-2">•</span>
            <span className="font-semibold text-orange-600">{notSubmittedCount} pending</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsModal;