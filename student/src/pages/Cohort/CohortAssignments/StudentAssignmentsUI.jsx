import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  Users,
  Search,
  ChevronDown,
} from "lucide-react";
import AssignmentDetailsModal from "./modals/AssignmentDetailsModal";
import AssignmentFilters from "./components/AssignmentFilters";

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// Format time
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

// Check if deadline has passed
const isDeadlinePassed = (deadline) => {
  return new Date() > new Date(deadline);
};

// Truncate description to 1 line
const truncateDescription = (description, maxLength = 50) => {
  if (!description) return { truncated: '', needsTruncation: false };
  const textContent = description.replace(/<[^>]*>/g, '');
  if (textContent.length <= maxLength) {
    return { truncated: textContent, needsTruncation: false };
  }
  return {
    truncated: textContent.substring(0, maxLength) + '...',
    needsTruncation: true
  };
};

// Submission Success Modal
const SubmissionSuccessModal = ({ isOpen, onClose, assignmentName, celebrationImage }) => {
  if (!isOpen) return null;

  const submissionDate = new Date();
  const formattedDate = submissionDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const formattedTime = submissionDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
        {/* Success Image */}
        <div className="mb-6">
          {celebrationImage ? (
            <img 
              src={celebrationImage} 
              alt="Celebration" 
              className="w-48 h-48 mx-auto object-contain"
            />
          ) : (
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-20 h-20 text-white" />
            </div>
          )}
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Submission Confirmed!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-1">
          You've successfully marked the assignment
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4">
          "{assignmentName}"
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          as submitted. Fantastic work!
        </p>

        {/* Submission Date and Time */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Submitted on</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{formattedDate}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{formattedTime}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          Return to Assignments
        </button>
      </div>
    </div>
  );
};

const StudentAssignmentsUI = ({ assignments, loading, error, onMarkSubmitted, onJoinGroup }) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedAssignmentName, setSubmittedAssignmentName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const handleSubmitClick = async (assignment) => {
    const assignmentName = assignment.name || assignment.title || assignment.assignment_name;
    const confirmed = window.confirm(`Are you sure you want to mark "${assignmentName}" as submitted?\n\nThis will notify your professor.`);
    if (confirmed) {
      await onMarkSubmitted(assignment);
      setSubmittedAssignmentName(assignmentName);
      setShowSuccessModal(true);
    }
  };

  const handleSeeMore = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const assignmentName = assignment.name || assignment.title || assignment.assignment_name;
    const matchesSearch = assignmentName?.toLowerCase().includes(searchQuery.toLowerCase()) || assignment.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || assignment.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Add mock groupInfo for testing (add this right after filteredAssignments)
  const assignmentsWithGroupInfo = filteredAssignments.map(assignment => {
    if (assignment.type === 'group' && assignment.id === 105) {
      // Mock data for "Team Database Design Project" - NOT a leader
      return {
        ...assignment,
        groupInfo: {
          groupId: 1,
          groupName: 'Team Alpha',
          isLeader: false,
          isGroupLeader: false,
          leaderName: 'Alice Johnson',
          members: [2, 1, 3] // User 1 is not first (not leader)
        }
      };
    }
    return assignment;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" style={{ fontFamily: '"Roboto", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" style={{ fontFamily: '"Roboto", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 lg:py-6 xl:py-8 pb-24 md:pb-5" style={{ fontFamily: '"Roboto", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6" />
          My Assignments
        </h1>
      </div>

      {/* Search and Filter */}
      <AssignmentFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Assignments Grid - 3 columns */}
      {filteredAssignments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No assignments found</h3>
          <p className="text-gray-600 dark:text-gray-400">{searchQuery || typeFilter !== 'all' ? 'Try adjusting your search or filters' : 'Your assignments will appear here'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {assignmentsWithGroupInfo.map((assignment) => {
            const isSubmitted = assignment.isSubmitted || assignment.is_submitted || (assignment.type === 'group' && assignment.groupSubmitted);
            const deadlinePassed = isDeadlinePassed(assignment.deadline);
            const isGroupAssignment = assignment.type === 'group';
            const isGroupLeader = assignment.groupInfo?.isLeader || assignment.groupInfo?.isGroupLeader;
            const inGroup = !!assignment.groupInfo;
            const canSubmit = !isSubmitted && !deadlinePassed && (!isGroupAssignment || (isGroupAssignment && isGroupLeader));
            const { truncated, needsTruncation } = truncateDescription(assignment.description);
            
            return (
              <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 flex flex-col">
                {/* Card Header */}
                <div className="p-4 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900" style={{ minHeight: "80px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white flex-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4' }} title={assignment.name || assignment.title || assignment.assignment_name}>
                      {assignment.name || assignment.title || assignment.assignment_name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${assignment.type === 'group' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'}`}>
                      {assignment.type === 'group' ? 'Group' : 'Individual'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="px-4 pt-4 pb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {truncated}
                    {needsTruncation && (
                      <button onClick={() => handleSeeMore(assignment)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium ml-1">
                        See more
                      </button>
                    )}
                  </p>
                </div>

                {/* Due Date and Marks */}
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium text-blue-900 dark:text-blue-300">Due Date</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formatDate(assignment.deadline)}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{formatTime(assignment.deadline)}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium text-blue-900 dark:text-blue-300">Total Marks</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{assignment.marks || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Status Notes */}
                {isSubmitted && (
                  <div className="px-4 pb-3">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-2.5 flex items-center justify-center gap-2">
                      <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                      <p className="text-xs text-green-800 dark:text-green-300 font-semibold">
                        Submitted on {formatDate(assignment.submittedAt || assignment.groupSubmittedAt)} at {formatTime(assignment.submittedAt || assignment.groupSubmittedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {!isSubmitted && deadlinePassed && (
                  <div className="px-4 pb-3">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-2.5 flex items-center justify-center gap-2">
                      <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
                      <p className="text-xs text-red-800 dark:text-red-300 font-semibold">Deadline Passed</p>
                    </div>
                  </div>
                )}

                {isGroupAssignment && !isSubmitted && !deadlinePassed && (
                  <div className="px-4 pb-3">
                    {!inGroup ? (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-2.5 flex items-center justify-center gap-2">
                        <AlertCircle size={16} className="text-yellow-700 dark:text-yellow-400" />
                        <p className="text-xs text-yellow-800 dark:text-yellow-300 font-medium">please create or join a group</p>
                      </div>
                    ) : !isGroupLeader ? (
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded-lg p-2.5 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Users size={16} className="text-purple-700 dark:text-purple-400" />
                          <p className="text-xs text-purple-800 dark:text-purple-300 font-semibold">please ask group leader to submit</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}

                <div className="flex-1"></div>

                {/* Action Buttons */}
                {canSubmit && (
                  <div className="px-4 pb-4">
                    <div className="flex gap-3">
                      <a href={assignment.submissionLink} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ExternalLink className="w-4 h-4" />
                        Link
                      </a>
                      <button onClick={() => handleSubmitClick(assignment)} className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600">
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AssignmentDetailsModal 
        isOpen={showDetailsModal} 
        onClose={() => { 
          setShowDetailsModal(false); 
          setSelectedAssignment(null); 
        }} 
        assignment={selectedAssignment} 
      />
      
      <SubmissionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        assignmentName={submittedAssignmentName}
        celebrationImage="/assets/celebration.png"
      />
    </div>
  );
};

export default StudentAssignmentsUI;
