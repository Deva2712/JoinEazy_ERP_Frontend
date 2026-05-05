import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Users,
  Plus,
  ChevronRight,
  SquareCheckBig,Download,Search,X,Check,
} from "lucide-react";
import AssignmentInfoModal from "./AssignmentInfoModal";

// Inline helper to avoid external util file
const getRollNumberFromEmail = (email) => {
  if (!email) return "Unknown";
  const emailPrefix = email.split("@")[0];
  if (/^[A-Za-z]{2}\d{2}[A-Za-z]{4}\d{3}$/.test(emailPrefix)) {
    return emailPrefix.toUpperCase();
  }
  if (emailPrefix.toLowerCase().includes("new") || emailPrefix.toLowerCase().includes("user")) {
    return emailPrefix.toUpperCase();
  }
  return emailPrefix.toUpperCase();
};

const getMemberDisplayName = (member) => {
  const displayName = (member?.display_name || member?.username || member?.name || member?.email || "").toString();
  const email = member?.email || "";
  if (displayName.toLowerCase().includes("new user") || displayName.toLowerCase().includes("newuser")) {
    return getRollNumberFromEmail(email);
  }
  if (displayName && displayName.trim() !== "") {
    return displayName;
  }
  return getRollNumberFromEmail(email);
};

const CohortMembersUI = ({
  members,
  sortBy,
  memberType,
  isStaff,
  member_type,
  isInGroup,
  isProject,
  loading,
  error,
  currentUserId,
  onSortChange,
  onMemberTypeChange,
  onCreateGroup,
  onMyGroup,
  onMemberDetails,
  onGroupNameClick,
  onRemove,
  onExport,
  searchTerm,
  onSearchChange,
  maxCourseMembers,
  currentCourseMembers,
  totalGroups,
  membersInGroups,
  assignments = [],
  grades = {},
  onGradeSubmit,
}) => {
  const memberTypeRef = useRef(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [bulkGradeGroups, setBulkGradeGroups] = useState(false);
  const [editingGroupGrade, setEditingGroupGrade] = useState(null);
  const [groupGradeValue, setGroupGradeValue] = useState('');
  const [editingIndividualGrade, setEditingIndividualGrade] = useState(null);
  const [individualGradeValue, setIndividualGradeValue] = useState('');
  const [showAssignmentInfoModal, setShowAssignmentInfoModal] = useState(false);
  const [assignmentInfoData, setAssignmentInfoData] = useState(null);
  const [showDisabledCreatePopup, setShowDisabledCreatePopup] = useState(false);
  

  useEffect(() => {
    if (assignments.length > 0 && !selectedAssignmentId) {
      const hasGroupAssignments = assignments.some(a => a.type === 'group');
      if (hasGroupAssignments) {
        setSelectedAssignmentId('all');
      }
    }
  }, [assignments]);

  const sortOptions = [
    "Name (A-Z)",
    "Name (Z-A)",
    "Submissions (Asc)",
    "Submissions (Desc)",
    "Vacancies",
  ];
  const memberTypeOptions = ["Individual", "Groups"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        memberTypeRef.current &&
        !memberTypeRef.current.contains(event.target)
      ) {
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const GradeModal = ({ isOpen, onClose, member, assignment, currentGrade, onSubmit, isGroupGrading }) => {
    const [score, setScore] = useState(currentGrade?.score?.toString() || '');
    const [feedback, setFeedback] = useState(currentGrade?.feedback || '');

    useEffect(() => {
      if (isOpen) {
        setScore(currentGrade?.score?.toString() || '');
        setFeedback(currentGrade?.feedback || '');
      }
    }, [isOpen, currentGrade]);

    const handleSubmit = async () => {
      const numScore = parseFloat(score);
      if (isNaN(numScore) || numScore < 0 || numScore > assignment.marks) {
        alert(`Score must be between 0 and ${assignment.marks}`);
        return;
      }

      const result = await onSubmit(member, assignment, numScore, feedback, isGroupGrading);
      if (result?.success) {
        onClose();
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Grade Assignment {isGroupGrading && <span className="text-blue-600">(Group)</span>}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isGroupGrading ? 'Group: ' : 'Student: '}
                <span className="font-medium text-gray-900 dark:text-gray-100">{getMemberDisplayName(member)}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Assignment: <span className="font-medium text-gray-900 dark:text-gray-100">{assignment.title}</span></p>
              {isGroupGrading && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  This grade will be applied to all group members
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Score (out of {assignment.marks})
              </label>
              <input
                type="number"
                min="0"
                max={assignment.marks}
                step="0.5"
                value={score}
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue = parseFloat(value);
                  if (value === '' || (numValue >= 0 && numValue <= assignment.marks)) {
                    setScore(value);
                  }
                }}
                onBlur={(e) => {
                  const numValue = parseFloat(e.target.value);
                  if (!isNaN(numValue)) {
                    if (numValue > assignment.marks) {
                      setScore(assignment.marks.toString());
                    } else if (numValue < 0) {
                      setScore('0');
                    }
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter feedback..."
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Submit Grade
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getBorderColor = (assignment, grade) => {
    const hasScore = grade && (grade.score !== null && grade.score !== undefined);
    
    if (hasScore) {
      if (grade.wasLate) {
        return 'red';
      }
      return 'green';
    }
    
    const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
    
    if (isLate) {
      return 'red';
    }
    
    const isSubmitted = grade?.isSubmitted || false;
    
    if (!isSubmitted) {
      return 'yellow';
    }
    
    return 'green';
  };

  const getScoreColorClasses = (borderColor) => {
    const colors = {
      green: 'border-green-500 dark:border-green-500 bg-green-50 dark:bg-gray-700 text-green-700 dark:text-gray-300',
      yellow: 'border-yellow-500 dark:border-yellow-500 bg-yellow-50 dark:bg-gray-700 text-yellow-700 dark:text-gray-400',
      red: 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-gray-700 text-red-700 dark:text-gray-300',
      gray: 'border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400',
    };
    return colors[borderColor] || colors.gray;
  };

  const getAssignmentHoverMessage = (assignment, grade, isGroupAssignment = false, membersGradedIndividually = false) => {
    const assignmentName = assignment.title || assignment.name;
    const assignmentType = isGroupAssignment ? ' (Group Assignment)' : ' (Individual Assignment)';
    const maxMarks = assignment.marks;
    
    if (membersGradedIndividually) {
      let deadlineText = '';
      if (assignment.deadline) {
        const deadlineDate = new Date(assignment.deadline);
        const now = new Date();
        const isOverdue = now > deadlineDate;
        deadlineText = `\nDeadline: ${deadlineDate.toLocaleDateString()} ${deadlineDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}${isOverdue ? ' (Overdue)' : ''}`;
      }
      return `${assignmentName}${assignmentType}\nTotal Marks: ${maxMarks}${deadlineText}\nMembers graded individually\nClick "See More" to view individual grades`;
    }
    
    let deadlineText = '';
    if (assignment.deadline) {
      const deadlineDate = new Date(assignment.deadline);
      const now = new Date();
      const isOverdue = now > deadlineDate;
      deadlineText = `\nDeadline: ${deadlineDate.toLocaleDateString()} ${deadlineDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}${isOverdue ? ' (Overdue)' : ''}`;
    }
    
    const hasScore = grade && (grade.score !== null && grade.score !== undefined);
    
    if (!hasScore) {
      const isSubmitted = grade?.isSubmitted || false;
      const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
      
      if (isLate) {
        if (isSubmitted) {
          let submittedDate = '';
          if (grade?.submittedAt) {
            submittedDate = `\nSubmitted: ${new Date(grade.submittedAt).toLocaleDateString()} ${new Date(grade.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
          }
          return `${assignmentName}${assignmentType}\nTotal Marks: ${maxMarks}${deadlineText}${submittedDate}\nStatus: Submitted (Late)\nClick to grade`;
        } else {
          return `${assignmentName}${assignmentType}\nTotal Marks: ${maxMarks}${deadlineText}\nStatus: Not Submitted (Overdue)\nClick to grade`;
        }
      }
      
      if (!isSubmitted) {
        return `${assignmentName}${assignmentType}\nTotal Marks: ${maxMarks}${deadlineText}\nStatus: Not Submitted\n⚠️ Grading disabled until submission is done`;
      }
      
      let submittedDate = '';
      if (grade?.submittedAt) {
        submittedDate = `\nSubmitted: ${new Date(grade.submittedAt).toLocaleDateString()} ${new Date(grade.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      }
      return `${assignmentName}${assignmentType}\nTotal Marks: ${maxMarks}${deadlineText}${submittedDate}\nStatus: Submitted\nClick to grade`;
    }
    
    const score = grade.score;
    const lateStatus = grade.wasLate ? ' (Graded after deadline)' : ' (Graded on time)';
    let submittedDate = '';
    if (grade?.submittedAt) {
      submittedDate = `\nSubmitted: ${new Date(grade.submittedAt).toLocaleDateString()} ${new Date(grade.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
    return `${assignmentName}${assignmentType}\nScore: ${score}/${maxMarks}${lateStatus}${submittedDate}\nClick to edit grade`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderMemberRow = (member, index) => {
    const isCurrentUser = member.type === 'individual' && member.realUserId === currentUserId;
    const isCurrentUserGroup = member.type === 'group' && member.isCurrentUserGroup;
    const shouldHighlight = isCurrentUser || isCurrentUserGroup;
    
    return (
      <div
        key={member.id}
        className={`flex flex-col sm:flex-row items-start sm:items-center px-3 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-3 transition-all border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
          shouldHighlight 
            ? 'bg-blue-50 dark:bg-blue-900/10 border-l-2 border-l-blue-500' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        {/* Group Icon and Member Info */}
        <div className="flex items-start justify-between gap-3 w-full sm:w-auto sm:min-w-[200px] sm:items-center">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {memberType === "Groups" && (
              <div className="flex-shrink-0">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Users size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            )}

            <div className="flex-grow min-w-0">
              <h4 className={`font-medium text-sm line-clamp-1 ${
                shouldHighlight ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
              }`}>
                {getMemberDisplayName(member)}
                {!isStaff && isCurrentUser && (
                  <span className="ml-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
                    You
                  </span>
                )}
                {!isStaff && isCurrentUserGroup && (
                  <span className="ml-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
                    Your Group
                  </span>
                )}
                {isStaff && member.type === 'individual' && member.isInGroup && member.groupName && (
                  <span className="ml-2 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onGroupNameClick && onGroupNameClick(member.groupId);
                    }}
                  >
                    {member.groupName}
                  </span>
                )}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {member.type === "individual" 
                  ? (member.email || "No email") 
                  : `${member.memberCount || 0}/${member.maxMembers || 4} members`
                }
              </p>
            </div>
          </div>

          {/* See More button - mobile only, on same line as name */}
          {memberType === "Groups" && member.type === 'group' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMemberDetails(member.id);
              }}
              className="sm:hidden px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0"
            >
              See More
            </button>
          )}
        </div>
        {/* Assignment Score Boxes - with horizontal scroll on mobile */}
        {((isStaff && member.type === 'individual') || (!isStaff && member.type === 'individual' && member.realUserId === currentUserId)) && (
          <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap flex-1 justify-start sm:justify-center w-full sm:w-auto overflow-x-auto pb-1">
            {assignments.length > 0 ? (
              [...assignments].sort((a, b) => {
                if (!a.created_at) return 1;
                if (!b.created_at) return -1;
                return new Date(a.created_at) - new Date(b.created_at);
              }).map((assignment) => {
                const gradeKey = `${member.realUserId}_${assignment.id}`;
                const grade = grades[gradeKey];
                const score = grade?.score;
                const borderColor = getBorderColor(assignment, grade);
                const isGroupAssignment = assignment.type === 'group';
                const hasGrade = score !== null && score !== undefined;
                const isSubmitted = grade?.isSubmitted || false;
                const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
              
                const isClickable = (!isGroupAssignment && (isSubmitted || isLate || hasGrade)) || (isGroupAssignment && hasGrade);
                const isEditingThis = editingIndividualGrade?.userId === member.realUserId && editingIndividualGrade?.assignmentId === assignment.id;
              
                if (isEditingThis) {
                  return (
                    <input
                      key={assignment.id}
                      type="number"
                      value={individualGradeValue}
                      onChange={(e) => setIndividualGradeValue(e.target.value)}
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                          if (!individualGradeValue) {
                            setEditingIndividualGrade(null);
                            setIndividualGradeValue('');
                            return;
                          }
                          const score = parseInt(individualGradeValue);
                          if (isNaN(score) || score < 0 || score > parseInt(assignment.marks)) {
                            alert(`Score must be between 0 and ${assignment.marks}`);
                            return;
                          }
                          const isGroupGrading = isGroupAssignment && member.isInGroup;
                          await onGradeSubmit(member, assignment, score, '', isGroupGrading);
                          setEditingIndividualGrade(null);
                          setIndividualGradeValue('');
                        } else if (e.key === 'Escape') {
                          setEditingIndividualGrade(null);
                          setIndividualGradeValue('');
                        }
                      }}
                      onBlur={async () => {
                        if (!individualGradeValue) {
                          setEditingIndividualGrade(null);
                          setIndividualGradeValue('');
                          return;
                        }
                        const score = parseInt(individualGradeValue);
                        if (isNaN(score) || score < 0 || score > parseInt(assignment.marks)) {
                          setEditingIndividualGrade(null);
                          setIndividualGradeValue('');
                          return;
                        }
                        const isGroupGrading = isGroupAssignment && member.isInGroup;
                        await onGradeSubmit(member, assignment, score, '', isGroupGrading);
                        setEditingIndividualGrade(null);
                        setIndividualGradeValue('');
                      }}
                      placeholder="0"
                      className={`flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 border-2 rounded-lg text-center font-semibold text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${getScoreColorClasses(borderColor)} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                      min="0"
                      max={assignment.marks}
                      autoFocus
                    />
                  );
                }
              
                if (!isStaff) {
                  const isCurrentUser = member.realUserId === currentUserId;
                  
                  const getStudentBoxColor = () => {
                    if (isSubmitted) {
                      return 'bg-[#03ac13] border-[#03ac13]';
                    }
                    if (isLate) {
                      return 'bg-red-800 border-red-800';
                    }
                    return 'bg-[#FFB100] border-[#FFB100]';
                  };
                  
                  const getIconForStatus = () => {
                    if (isSubmitted) return <Check size={16} className="text-white" strokeWidth={3} />;
                    if (isLate) return <X size={16} className="text-white" strokeWidth={3} />;
                    return <span className="text-white font-bold text-base">-</span>;
                  };
                  
                  if (isCurrentUser) {
                    return (
                      <div
                        key={assignment.id}
                        className={`flex-shrink-0 w-10 h-10 rounded-lg border-2 flex items-center justify-center font-semibold text-sm ${getStudentBoxColor()}`}
                        onTouchStart={(e) => {
                          const target = e.currentTarget;
                          target.longPressTimer = setTimeout(() => {
                            setAssignmentInfoData({ assignment, grade, isGroupAssignment: false, membersGradedIndividually: false });
                            setShowAssignmentInfoModal(true);
                          }, 500);
                        }}
                        onTouchEnd={(e) => {
                          const target = e.currentTarget;
                          if (target.longPressTimer) {
                            clearTimeout(target.longPressTimer);
                          }
                        }}
                        onTouchMove={(e) => {
                          const target = e.currentTarget;
                          if (target.longPressTimer) {
                            clearTimeout(target.longPressTimer);
                          }
                        }}
                        title={getAssignmentHoverMessage(assignment, grade, isGroupAssignment)}
                      >
                        {hasGrade ? <span className="text-gray-900 dark:text-gray-100">{score}</span> : getIconForStatus()}
                      </div>
                    );
                  }
                  
                  return (
                    <div
                      key={assignment.id}
                      className={`flex-shrink-0 w-10 h-10 rounded-lg border-2 flex items-center justify-center ${getStudentBoxColor()}`}
                      title={getAssignmentHoverMessage(assignment, grade, isGroupAssignment)}
                    >
                      {getIconForStatus()}
                    </div>
                  );
                }
              
               return isClickable ? (
                  <button
                    key={assignment.id}
                    onClick={() => {
                      setEditingIndividualGrade({ userId: member.realUserId, assignmentId: assignment.id });
                      setIndividualGradeValue(hasGrade ? score.toString() : '');
                    }}
                   onTouchStart={(e) => {
                      const target = e.currentTarget;
                      target.longPressTimer = setTimeout(() => {
                        setAssignmentInfoData({ assignment, grade, isGroupAssignment, membersGradedIndividually: false });
                        setShowAssignmentInfoModal(true);
                      }, 500);
                    }}
                    onTouchEnd={(e) => {
                      const target = e.currentTarget;
                      if (target.longPressTimer) {
                        clearTimeout(target.longPressTimer);
                        e.preventDefault();
                        setEditingIndividualGrade({ userId: member.realUserId, assignmentId: assignment.id });
                        setIndividualGradeValue(hasGrade ? score.toString() : '');
                      }
                    }}
                    onTouchMove={(e) => {
                      const target = e.currentTarget;
                      if (target.longPressTimer) {
                        clearTimeout(target.longPressTimer);
                      }
                    }}
                    style={{ touchAction: 'manipulation' }}
                    className={`flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 border-2 rounded-lg flex items-center justify-center font-bold text-sm transition-all hover:scale-105 ${getScoreColorClasses(borderColor)}`}
                    title={getAssignmentHoverMessage(assignment, grade, isGroupAssignment)}
                  >
                    {hasGrade ? score : '-'}
                  </button>
                ) : (
                  <div
                    key={assignment.id}
                    className={`flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 border-2 rounded-lg flex items-center justify-center font-bold text-sm cursor-not-allowed opacity-75 ${getScoreColorClasses(borderColor)}`}
                    title={isGroupAssignment 
                      ? `${assignment.title || assignment.name} (Group Assignment)\nThis assignment must be graded from the Groups tab`
                      : getAssignmentHoverMessage(assignment, grade, isGroupAssignment)
                    }
                  >
                    -
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                No assignments yet
              </div>
            )}
          </div>
        )}

        {/* Spacer to push assignment boxes to middle */}
        {memberType === "Groups" && <div className="flex-1"></div>}

        {/* Assignment Score Boxes for Groups - responsive */}
        {((isStaff && memberType === "Groups" && member.type === 'group') || (!isStaff && memberType === "Groups" && member.type === 'group' && member.groupMembers?.some(gm => gm.user_id === currentUserId))) && assignments.length > 0 && (
          <div className="flex gap-2 flex-wrap sm:flex-nowrap flex-1 justify-start w-full sm:w-auto overflow-x-auto pb-1">
            {[...assignments].sort((a, b) => {
              if (!a.created_at) return 1;
              if (!b.created_at) return -1;
              return new Date(a.created_at) - new Date(b.created_at);
            }).filter(assignment => assignment.type === 'group' && (selectedAssignmentId === 'all' || assignment.id === selectedAssignmentId)).map((assignment) => {
              const isGroupAssignment = assignment.type === 'group';
              let displayScore = null;
              let hasGrades = false;
              
              if (member.groupMembers && member.groupMembers.length > 0) {
                if (isGroupAssignment) {
                  const memberGrades = member.groupMembers.map(gm => {
                    const gradeKey = `${gm.user_id}_${assignment.id}`;
                    return grades[gradeKey]?.score;
                  }).filter(s => s !== null && s !== undefined);
                  
                  if (memberGrades.length > 0) {
                    hasGrades = true;
                    const allSame = memberGrades.every(score => score === memberGrades[0]);
                    if (allSame && memberGrades.length === member.groupMembers.length) {
                      displayScore = memberGrades[0];
                    } else {
                      const avg = memberGrades.reduce((a, b) => a + b, 0) / memberGrades.length;
                      displayScore = Math.round(avg);
                    }
                  }
                } else {
                  const memberScores = member.groupMembers.map(gm => {
                    const gradeKey = `${gm.user_id}_${assignment.id}`;
                    return grades[gradeKey]?.score;
                  }).filter(s => s !== null && s !== undefined);
                  
                  if (memberScores.length > 0) {
                    hasGrades = true;
                    const avg = memberScores.reduce((a, b) => a + b, 0) / memberScores.length;
                    displayScore = Math.round(avg);
                  }
                }
              }
              
              const firstMemberGradeKey = member.groupMembers?.[0] ? `${member.groupMembers[0].user_id}_${assignment.id}` : null;
              const firstMemberGrade = firstMemberGradeKey ? grades[firstMemberGradeKey] : null;
              const borderColor = getBorderColor(assignment, firstMemberGrade);
              
              const membersGradedIndividually = isGroupAssignment && member.groupMembers && member.groupMembers.length > 0 && !hasGrades && member.groupMembers.some(gm => {
                const gradeKey = `${gm.user_id}_${assignment.id}`;
                return grades[gradeKey]?.score !== null && grades[gradeKey]?.score !== undefined;
              });
              
              const isSubmitted = firstMemberGrade?.isSubmitted || false;
              const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
              
              const isClickable = isGroupAssignment && (hasGrades || isSubmitted || isLate) && bulkGradeGroups;
              const isEditingThis = editingGroupGrade?.groupId === member.id && editingGroupGrade?.assignmentId === assignment.id;
              
              if (isEditingThis) {
                return (
                  <input
                    key={assignment.id}
                    type="number"
                    value={groupGradeValue}
                    onChange={(e) => setGroupGradeValue(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        if (!groupGradeValue) {
                          setEditingGroupGrade(null);
                          setGroupGradeValue('');
                          return;
                        }
                        const score = parseInt(groupGradeValue);
                        if (isNaN(score) || score < 0 || score > parseInt(assignment.marks)) {
                          alert(`Score must be between 0 and ${assignment.marks}`);
                          return;
                        }
                        const representativeMember = member.groupMembers?.[0] ? {
                          id: member.groupMembers[0].user_id,
                          display_name: member.groupName,
                          email: member.groupMembers[0].email,
                          groupId: member.id,
                          groupMembers: member.groupMembers
                        } : null;
                        if (representativeMember) {
                          await onGradeSubmit(representativeMember, assignment, score, '', bulkGradeGroups);
                        }
                        setEditingGroupGrade(null);
                        setGroupGradeValue('');
                      } else if (e.key === 'Escape') {
                        setEditingGroupGrade(null);
                        setGroupGradeValue('');
                      }
                    }}
                    onBlur={async () => {
                      if (!groupGradeValue) {
                        setEditingGroupGrade(null);
                        setGroupGradeValue('');
                        return;
                      }
                      const score = parseInt(groupGradeValue);
                      if (isNaN(score) || score < 0 || score > parseInt(assignment.marks)) {
                        setEditingGroupGrade(null);
                        setGroupGradeValue('');
                        return;
                      }
                      const representativeMember = member.groupMembers?.[0] ? {
                        id: member.groupMembers[0].user_id,
                        display_name: member.groupName,
                        email: member.groupMembers[0].email,
                        groupId: member.id,
                        groupMembers: member.groupMembers
                      } : null;
                      if (representativeMember) {
                        await onGradeSubmit(representativeMember, assignment, score, '', bulkGradeGroups);
                      }
                      setEditingGroupGrade(null);
                      setGroupGradeValue('');
                    }}
                    placeholder="0"
                    className={`flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 border-2 rounded-lg text-center font-semibold text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${getScoreColorClasses(borderColor)} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                    min="0"
                    max={assignment.marks}
                    autoFocus
                  />
                );
              }
              
              if (!isStaff) {
                const getStudentBoxColor = () => {
                  if (isSubmitted) {
                    return 'bg-[#03ac13] border-[#03ac13]';
                  }
                  
                  if (isLate) {
                    return 'bg-red-800 border-red-800';
                  }
                  
                  return 'bg-[#FFB100] border-[#FFB100]';
                };
                
                const getIconForStatus = () => {
                  if (isSubmitted) return <Check size={16} className="text-white" strokeWidth={3} />;
                  if (isLate) return <X size={16} className="text-white" strokeWidth={3} />;
                  return <span className="text-white font-bold text-base">-</span>;
                };
                
                return (
                  <div
                    key={assignment.id}
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getStudentBoxColor()}`}
                    onTouchStart={(e) => {
                      const target = e.currentTarget;
                      target.longPressTimer = setTimeout(() => {
                        setAssignmentInfoData({ assignment, grade: firstMemberGrade, isGroupAssignment: true, membersGradedIndividually });
                        setShowAssignmentInfoModal(true);
                      }, 500);
                    }}
                    onTouchEnd={(e) => {
                      const target = e.currentTarget;
                      if (target.longPressTimer) {
                        clearTimeout(target.longPressTimer);
                      }
                    }}
                    onTouchMove={(e) => {
                      const target = e.currentTarget;
                      if (target.longPressTimer) {
                        clearTimeout(target.longPressTimer);
                      }
                    }}
                    title={getAssignmentHoverMessage(assignment, firstMemberGrade, true, membersGradedIndividually)}
                  >
                    {getIconForStatus()}
                  </div>
                );
              }
              
              return isClickable ? (
                <button
                  key={assignment.id}
                  onClick={() => {
                    setEditingGroupGrade({ groupId: member.id, assignmentId: assignment.id });
                    setGroupGradeValue(hasGrades ? displayScore.toString() : '');
                  }}
                  onTouchStart={(e) => {
                    const target = e.currentTarget;
                    target.longPressTimer = setTimeout(() => {
                      setAssignmentInfoData({ assignment, grade: firstMemberGrade, isGroupAssignment: true, membersGradedIndividually });
                      setShowAssignmentInfoModal(true);
                    }, 500);
                  }}
                  onTouchEnd={(e) => {
                    const target = e.currentTarget;
                    if (target.longPressTimer) {
                      clearTimeout(target.longPressTimer);
                      e.preventDefault();
                      setEditingGroupGrade({ groupId: member.id, assignmentId: assignment.id });
                      setGroupGradeValue(hasGrades ? displayScore.toString() : '');
                    }
                  }}
                  onTouchMove={(e) => {
                    const target = e.currentTarget;
                    if (target.longPressTimer) {
                      clearTimeout(target.longPressTimer);
                    }
                  }}
                  style={{ touchAction: 'manipulation' }}
                  className={`flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 border-2 rounded-lg flex items-center justify-center font-semibold text-sm transition-all hover:scale-105 ${getScoreColorClasses(borderColor)}`}
                  title={getAssignmentHoverMessage(assignment, firstMemberGrade, true, membersGradedIndividually)}
                >
                  {hasGrades ? displayScore : '-'}
                </button>
              ) : (
                <div
                  key={assignment.id}
                  className={`flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 border-2 rounded-lg flex items-center justify-center font-semibold text-sm cursor-not-allowed opacity-60 ${getScoreColorClasses(borderColor)}`}
                  title={bulkGradeGroups ? getAssignmentHoverMessage(assignment, firstMemberGrade, true, membersGradedIndividually) : "Enable 'Grade Whole Group' checkbox to grade the group"}
                >
                  {hasGrades ? displayScore : '-'}
                </div>
              );
            })}
          </div>
        )}

       {/* Spacer for alignment when no assignment boxes */}
        {memberType === "Groups" && !(
          (isStaff && member.type === 'group' && assignments.length > 0) ||
          (!isStaff && member.type === 'group' && member.groupMembers?.some(gm => gm.user_id === currentUserId) && assignments.length > 0)
        ) && (
          <div className="flex-1"></div>
        )}

          {/* Action Button for Groups - desktop only */}
        {memberType === "Groups" && member.type === 'group' && (
          <div className="hidden sm:flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-auto">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {member.memberCount || 0}/{member.maxMembers || 4}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMemberDetails(member.id);
              }}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-all duration-200 hover:shadow-md whitespace-nowrap"
            >
              See More
            </button>
          </div>
        )}

        {/* Total Score and Remove button - responsive */}
<div className="flex items-center gap-2 flex-shrink-0 ml-auto">
  {isStaff && member.type === 'individual' && assignments.length > 0 && (
    <>
      {(() => {
        let totalScore = 0;
        let totalMaxScore = 0;
        let gradedCount = 0;
        
        assignments.forEach(assignment => {
          totalMaxScore += parseInt(assignment.marks) || 0;
          const gradeKey = `${member.realUserId}_${assignment.id}`;
          const grade = grades[gradeKey];
          if (grade?.score !== null && grade?.score !== undefined) {
            totalScore += parseInt(grade.score) || 0;
            gradedCount++;
          }
        });
        
        return (
          <div 
            className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg border-2 border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 min-w-[70px] sm:min-w-[100px] text-center"
            title={`Total earned: ${totalScore} out of ${totalMaxScore} (${gradedCount}/${assignments.length} graded)`}
          >
            <span className="sm:hidden">Total: </span><span className="hidden sm:inline">Total: </span>{totalScore}
          </div>
        );
      })()}
    </>
  )}
  
  {/* Remove button - now inline with Total */}
  {isStaff && member.type === 'individual' && (
    <button
      onClick={() => onRemove && onRemove(member.realUserId)}
      className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 hover:shadow-md whitespace-nowrap"
    >
      Remove
    </button>
  )}
</div>
      </div>
    );
  };

  return (
    <div className="px-2 sm:px-3 md:px-4 pb-20 md:pb-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-hidden overflow-y-visible">
        {/* Header Section - RESPONSIVE FIX */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          {/* Title and Stats Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                Course Members
              </h2>
              <span className="px-2 sm:px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-bold rounded-md border border-blue-200 dark:border-blue-800">
                {memberType === "Individual" 
                  ? currentCourseMembers
                  : `${totalGroups || 0} ${totalGroups === 1 ? 'group' : 'groups'}, ${membersInGroups || 0} ${membersInGroups === 1 ? 'member' : 'members'}`
                }
              </span>
            </div>
            
            {/* Assignment Progress Legend - show on all screens */}
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 flex-wrap">
              <span className="text-gray-500 dark:text-gray-500">Assignment Progress:</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-green-500 rounded-sm"></div>
                <span>Submitted</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-yellow-500 rounded-sm"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-red-500 rounded-sm"></div>
                <span>Late/Overdue</span>
              </div>
            </div>
          </div>

          {/* Grade Whole Group Checkbox and Assignment Dropdown - RESPONSIVE FIX */}
          {isStaff && memberType === "Groups" && assignments.filter(a => a.type === 'group').length > 0 && (
            <div className="flex flex-row items-center gap-2 mb-3 flex-wrap">
              <label className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow hover:bg-gray-50 dark:hover:bg-gray-600 transition-all cursor-pointer whitespace-nowrap flex-shrink-0" title="When checked, grading will apply the same score to all members in the group">
                <input
                  type="checkbox"
                  checked={bulkGradeGroups}
                  onChange={(e) => setBulkGradeGroups(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                />
                <span>Grade Whole Group</span>
              </label>
              
              <select
                value={selectedAssignmentId || ''}
                onChange={(e) => setSelectedAssignmentId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-[150px] sm:w-[250px] px-3 py-1.5 text-xs font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow hover:bg-gray-50 dark:hover:bg-gray-600 transition-all flex-shrink-0 appearance-none cursor-pointer relative z-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="all">All Assignments</option>
                {assignments.filter(a => a.type === 'group').map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title || assignment.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Controls Row: Tabs + Search + Actions - RESPONSIVE FIX */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* Compact Tabs */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 flex-shrink-0" ref={memberTypeRef}>
              {memberTypeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => onMemberTypeChange(option)}
                  className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                    memberType === option 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Search Input and Action Buttons - single row on mobile */}
            <div className="flex items-center gap-2 flex-1">
              {/* Search Input - longer on all screens */}
              <div className="relative flex-1">
                <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${memberType.toLowerCase()}...`}
                  value={searchTerm || ""}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white dark:placeholder-gray-400"
                />
              </div>

             {/* Action Buttons - inline with search on mobile */}
              {isStaff ? (
                // Professor buttons
                <>
                  <button
                    onClick={onCreateGroup}
                    className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-all whitespace-nowrap hidden sm:flex items-center justify-center gap-1 flex-shrink-0"
                  >
                    <Plus size={14} className="flex-shrink-0" />
                    <span>Create</span>
                  </button>
                  <button
                    onClick={onExport}
                    className="px-3 py-1.5 text-xs font-semibold bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-all whitespace-nowrap flex items-center justify-center gap-1 flex-shrink-0"
                  >
                    <Download size={14} className="flex-shrink-0" />
                    <span>Export</span>
                  </button>
                </>
             ) : (
                // Student button - hidden on mobile, shown on desktop with tooltip
                <div className="relative group hidden sm:block">
                  <button
                    onClick={() => {
                      if (!isInGroup) {
                        onCreateGroup();
                      }
                    }}
                    disabled={isInGroup}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md shadow transition-all whitespace-nowrap flex items-center justify-center gap-1 flex-shrink-0 ${
                      isInGroup
                        ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed opacity-60'
                        : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                    }`}
                  >
                    <Plus size={14} className="flex-shrink-0" />
                    <span>Create Group</span>
                  </button>
                  
                  {/* Desktop Hover Tooltip - only show when disabled */}
                  {isInGroup && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                      You are already in a group
                      <div className="absolute top-full right-3 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Floating Create Button for Mobile - Above Navbar */}
        {/* Students and Professors both get this on mobile */}
        {(
          <button
            onClick={() => {
              if (!isStaff && isInGroup) {
                setShowDisabledCreatePopup(true);
              } else {
                onCreateGroup();
              }
            }}
            disabled={!isStaff && isInGroup}
            className={`fixed bottom-20 right-4 sm:hidden z-50 px-4 py-2.5 rounded-lg shadow-lg flex items-center justify-center gap-2 font-semibold text-sm transition-all whitespace-nowrap ${
              !isStaff && isInGroup
                ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
          >
            <Plus size={18} className="flex-shrink-0" />
            <span>Create group {isStaff ? '' : 'Group'}</span>
          </button>
        )}
        {/* Members/Groups List */}
        {members.length > 0 ? (
          <>
            {members.map((member, index) => renderMemberRow(member, index))}
          </>
        ) : (
          <div className="p-8 text-center">
            <Users size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              No {memberType.toLowerCase()} found
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search' : 'No members yet'}
            </p>
          </div>
        )}
      </div>
      
      {/* Grade Modal */}
      {showGradeModal && selectedGrade && (
        <GradeModal
          isOpen={showGradeModal}
          onClose={() => {
            setShowGradeModal(false);
            setSelectedGrade(null);
          }}
          member={selectedGrade.member}
          assignment={selectedGrade.assignment}
          currentGrade={selectedGrade.grade}
          onSubmit={onGradeSubmit}
          isGroupGrading={selectedGrade.isGroupGrading}
        />
      )}

      {/* Assignment Info Modal for Mobile Long Press */}
      <AssignmentInfoModal
        isOpen={showAssignmentInfoModal}
        onClose={() => {
          setShowAssignmentInfoModal(false);
          setAssignmentInfoData(null);
        }}
        assignment={assignmentInfoData?.assignment}
        grade={assignmentInfoData?.grade}
        isGroupAssignment={assignmentInfoData?.isGroupAssignment}
        membersGradedIndividually={assignmentInfoData?.membersGradedIndividually}
      />

      {/* Mobile Popup for Disabled Create Button */}
      {showDisabledCreatePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:hidden">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Cannot Create Group
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              You are already in a group. You cannot create a new group while being a member of an existing one.
            </p>
            <button
              onClick={() => setShowDisabledCreatePopup(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CohortMembersUI;
