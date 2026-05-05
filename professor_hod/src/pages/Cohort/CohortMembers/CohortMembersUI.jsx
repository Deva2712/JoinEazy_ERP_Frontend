import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  Users,
  Plus,
  ChevronRight,
  Trash2,
  Download,
  Search,
  X,
  Check,
  ClipboardList,
  Eye,
  SearchX,
} from "lucide-react";

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
  onOpenCreateGrading,
  onOpenGradeVisibility,
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
  const [assignmentPage, setAssignmentPage] = useState(0);

  // Resets assignment pagination to the first page when switching between Individual and Groups tabs
  useEffect(() => {
    setAssignmentPage(0);
  }, [memberType]);
  
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

  const renderMemberRow = (member) => {
    const isCurrentUser = member.type === 'individual' && member.realUserId === currentUserId;
    const isCurrentUserGroup = member.type === 'group' && member.isCurrentUserGroup;
    const shouldHighlight = isCurrentUser || isCurrentUserGroup;

    // Pagination Logic Constants
    const itemsPerPage = 5;
    const totalPages = Math.ceil(assignments.length / itemsPerPage);

    // For Individuals: We show all assignments
    const individualVisibleBoxes = assignments.length;
    // For Groups: We filter by type and the selected assignment dropdown
    const groupVisibleBoxes = assignments.filter(assignment =>
      assignment.type === 'group' && (selectedAssignmentId === 'all' || assignment.id === selectedAssignmentId)
    ).length;

    return (
      <div
        key={member.id}
        className={`relative flex flex-col sm:flex-row items-start sm:items-center px-4 py-3 sm:py-4 gap-3 transition-all border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
          shouldHighlight
            ? 'bg-blue-50/50 dark:bg-blue-900/10'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        {/* Visual Highlight Bar */}
        {shouldHighlight && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md" />
        )}

        {/* Group Icon and Member Info */}
        <div className="flex items-center justify-between gap-3 w-full sm:w-auto sm:min-w-[240px]">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {memberType === "Groups" && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-sm">
                  <Users size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            )}

            <div className="flex-grow min-w-0">
              <div className="flex items-center flex-wrap gap-1.5">
                <h4 className={`font-semibold text-sm truncate ${
                  shouldHighlight ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {getMemberDisplayName(member)}
                </h4>
                {!isStaff && isCurrentUser && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    You
                  </span>
                )}
                {!isStaff && isCurrentUserGroup && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    Your Group
                  </span>
                )}
                {isStaff && member.type === 'individual' && member.isInGroup && member.groupName && (
                  <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-800 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onGroupNameClick && onGroupNameClick(member.groupId);
                    }}
                  >
                    {member.groupName}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {member.type === "individual"
                  ? (member.email || "No email")
                  : `${member.memberCount || 0}/${member.maxMembers || 4} Members`
                }
              </p>
            </div>
          </div>

          {/* Mobile Action Button */}
          {memberType === "Groups" && member.type === 'group' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMemberDetails(member.id);
              }}
              className="sm:hidden px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-lg shadow-sm active:scale-95 transition-all"
            >
              Details
            </button>
          )}
        </div>

        {/* Assignment Score Boxes for Individuals */}
        {((isStaff && member.type === 'individual') || (!isStaff && member.type === 'individual' && member.realUserId === currentUserId)) && (
          <div className="flex items-center gap-2 justify-center w-full sm:w-auto mx-auto">
            <button
              onClick={() => setAssignmentPage(prev => Math.max(prev - 1, 0))}
              disabled={assignmentPage === 0 || individualVisibleBoxes <= itemsPerPage}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-20 transition-colors text-gray-500"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2.5 items-center">
              {assignments.length > 0 ? (
                [...assignments].sort((a, b) => {
                  if (!a.created_at) return 1;
                  if (!b.created_at) return -1;
                  return new Date(a.created_at) - new Date(b.created_at);
                })
                .slice(assignmentPage * itemsPerPage, (assignmentPage + 1) * itemsPerPage)
                .map((assignment) => {
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
                        className={`flex-shrink-0 w-11 h-11 border-2 rounded-xl text-center font-bold text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${getScoreColorClasses(borderColor)} focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-inner`}
                        min="0"
                        max={assignment.marks}
                        autoFocus
                      />
                    );
                  }

                  if (!isStaff) {
                    const isCurrentUser = member.realUserId === currentUserId;
                    const getStudentBoxColor = () => {
                      if (isSubmitted) return 'bg-emerald-600 border-emerald-600 shadow-sm shadow-emerald-200 dark:shadow-none';
                      if (isLate) return 'bg-rose-700 border-rose-700 shadow-sm shadow-rose-200 dark:shadow-none';
                      return 'bg-amber-500 border-amber-500 shadow-sm shadow-amber-200 dark:shadow-none';
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
                          className={`flex-shrink-0 w-11 h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-transform active:scale-95 ${getStudentBoxColor()}`}
                          onTouchStart={(e) => {
                            const target = e.currentTarget;
                            target.longPressTimer = setTimeout(() => {
                              setAssignmentInfoData({ assignment, grade, isGroupAssignment: false, membersGradedIndividually: false });
                              setShowAssignmentInfoModal(true);
                            }, 500);
                          }}
                          onTouchEnd={(e) => {
                            const target = e.currentTarget;
                            if (target.longPressTimer) clearTimeout(target.longPressTimer);
                          }}
                          onTouchMove={(e) => {
                            const target = e.currentTarget;
                            if (target.longPressTimer) clearTimeout(target.longPressTimer);
                          }}
                          title={getAssignmentHoverMessage(assignment, grade, isGroupAssignment)}
                        >
                          {hasGrade ? <span className="text-white">{score}</span> : getIconForStatus()}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={assignment.id}
                        className={`flex-shrink-0 w-11 h-11 rounded-xl border-2 flex items-center justify-center ${getStudentBoxColor()}`}
                        title={getAssignmentHoverMessage(assignment, grade, isGroupAssignment)}
                      >
                        {getIconForStatus()}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={assignment.id}
                      disabled={!isClickable}
                      onClick={() => {
                        setEditingIndividualGrade({ userId: member.realUserId, assignmentId: assignment.id });
                        setIndividualGradeValue(hasGrade ? score.toString() : '');
                      }}
                      style={{ touchAction: 'manipulation' }}
                      className={`flex-shrink-0 w-11 h-11 border-2 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                        isClickable 
                          ? `hover:scale-110 hover:shadow-md active:scale-95 ${getScoreColorClasses(borderColor)}` 
                          : `opacity-50 cursor-not-allowed ${getScoreColorClasses(borderColor)}`
                      }`}
                      title={isGroupAssignment 
                        ? `${assignment.title || assignment.name}\nMust be graded via Groups tab`
                        : getAssignmentHoverMessage(assignment, grade, isGroupAssignment)
                      }
                    >
                      {hasGrade ? score : '-'}
                    </button>
                  );
                })
              ) : (
                <div className="text-xs text-gray-400 dark:text-gray-500 font-medium italic">
                  No assignments
                </div>
              )}
            </div>

            <button
              onClick={() => setAssignmentPage(prev => Math.min(prev + 1, totalPages - 1))}
              disabled={assignmentPage >= Math.ceil(individualVisibleBoxes / itemsPerPage) - 1 || individualVisibleBoxes <= itemsPerPage}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-20 transition-colors text-gray-500"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Assignment Score Boxes for Groups */}
        {((isStaff && memberType === "Groups" && member.type === 'group') || (!isStaff && memberType === "Groups" && member.type === 'group' && member.groupMembers?.some(gm => gm.user_id === currentUserId))) && assignments.length > 0 && (
          <div className="flex items-center gap-2 justify-center w-full sm:w-auto mx-auto">
            <button
              onClick={() => setAssignmentPage(prev => Math.max(prev - 1, 0))}
              disabled={assignmentPage === 0 || groupVisibleBoxes <= itemsPerPage}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-20 transition-colors text-gray-500"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2.5 items-center">
              {[...assignments].sort((a, b) => {
                if (!a.created_at) return 1;
                if (!b.created_at) return -1;
                return new Date(a.created_at) - new Date(b.created_at);
              })
              .filter(assignment => assignment.type === 'group' && (selectedAssignmentId === 'all' || assignment.id === selectedAssignmentId))
              .slice(assignmentPage * itemsPerPage, (assignmentPage + 1) * itemsPerPage)
              .map((assignment) => {
                const isGroupAssignment = assignment.type === 'group';
                let displayScore = null;
                let hasGrades = false;
                
                if (member.groupMembers && member.groupMembers.length > 0) {
                  const memberGrades = member.groupMembers.map(gm => {
                    const gradeKey = `${gm.user_id}_${assignment.id}`;
                    return grades[gradeKey]?.score;
                  }).filter(s => s !== null && s !== undefined);
                  
                  if (memberGrades.length > 0) {
                    hasGrades = true;
                    const allSame = memberGrades.every(score => score === memberGrades[0]);
                    displayScore = (allSame && memberGrades.length === member.groupMembers.length)
                      ? memberGrades[0]
                      : Math.round(memberGrades.reduce((a, b) => a + b, 0) / memberGrades.length);
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
                      className={`flex-shrink-0 w-11 h-11 border-2 rounded-xl text-center font-bold text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${getScoreColorClasses(borderColor)} focus:ring-2 focus:ring-blue-500 shadow-inner`}
                      autoFocus
                    />
                  );
                }

                if (!isStaff) {
                  const getStudentBoxColor = () => {
                    if (isSubmitted) return 'bg-emerald-600 border-emerald-600';
                    if (isLate) return 'bg-rose-700 border-rose-700';
                    return 'bg-amber-500 border-amber-500';
                  };
                  
                  return (
                    <div
                      key={assignment.id}
                      className={`flex-shrink-0 w-11 h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm ${getStudentBoxColor()}`}
                      title={getAssignmentHoverMessage(assignment, firstMemberGrade, true, membersGradedIndividually)}
                    >
                      {isSubmitted ? <Check size={16} className="text-white" strokeWidth={3} /> : <span className="text-white">-</span>}
                    </div>
                  );
                }

                return (
                  <button
                    key={assignment.id}
                    disabled={!isClickable}
                    onClick={() => {
                      setEditingGroupGrade({ groupId: member.id, assignmentId: assignment.id });
                      setGroupGradeValue(hasGrades ? displayScore.toString() : '');
                    }}
                    className={`flex-shrink-0 w-11 h-11 border-2 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                      isClickable 
                        ? `hover:scale-110 hover:shadow-md active:scale-95 ${getScoreColorClasses(borderColor)}` 
                        : `opacity-50 cursor-not-allowed ${getScoreColorClasses(borderColor)}`
                    }`}
                    title={bulkGradeGroups ? getAssignmentHoverMessage(assignment, firstMemberGrade, true, membersGradedIndividually) : "Enable 'Grade Whole Group' to edit"}
                  >
                    {hasGrades ? displayScore : '-'}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setAssignmentPage(prev => Math.min(prev + 1, totalPages - 1))}
              disabled={assignmentPage >= Math.ceil(groupVisibleBoxes / itemsPerPage) - 1 || groupVisibleBoxes <= itemsPerPage}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-20 transition-colors text-gray-500"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Action Buttons & Totals - Desktop */}
        <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-end">
          {memberType === "Groups" && member.type === 'group' && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                {member.memberCount || 0}/{member.maxMembers || 4}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMemberDetails(member.id);
                }}
                className="px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-all border border-blue-100 dark:border-blue-800/50"
              >
                See More
              </button>
            </div>
          )}

          {isStaff && member.type === 'individual' && assignments.length > 0 && (
            <div 
              className="px-3 py-2 text-xs font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 min-w-[80px] text-center shadow-sm"
            >
              <span className="text-gray-400 dark:text-gray-500 mr-1">Total:</span>
              {(() => {
                let totalScore = 0;
                assignments.forEach(assignment => {
                  const gradeKey = `${member.realUserId}_${assignment.id}`;
                  const grade = grades[gradeKey];
                  if (grade?.score !== null && grade?.score !== undefined) {
                    totalScore += parseInt(grade.score) || 0;
                  }
                });
                return totalScore;
              })()}
            </div>
          )}
          
          {isStaff && member.type === 'individual' && (
            <button
              onClick={() => onRemove && onRemove(member.realUserId)}
              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
              title="Remove Member"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans min-h-screen px-0 md:px-2 pb-20 md:pb-4 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-grow">
          <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
            
            {/* Header Section - Now containing Member Type Toggle */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex gap-2 items-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Course Members
                  </h3>
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wide rounded-full border border-blue-100 dark:border-blue-800">
                    {memberType === "Individual" ? `${currentCourseMembers} ${currentCourseMembers > 1 ? "Students" : "Student"}` : `${totalGroups || 0} ${totalGroups > 1 ? "Groups" : "Group"}`}
                  </span>
                </div>

                {/* Member Type Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl min-w-[200px]" ref={memberTypeRef}>
                  {memberTypeOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => onMemberTypeChange(option)}
                      className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                        memberType === option 
                          ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" 
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search Bar */}
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${memberType.toLowerCase()}...`}
                    value={searchTerm || ""}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    className="pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl text-sm w-full outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium dark:text-white"
                  />
                </div>

                {/* Create Group Button */}
                <div className="w-full sm:w-auto">
                  {isStaff ? (
                    <button 
                      onClick={onCreateGroup} 
                      className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-bold shadow-md transition-all whitespace-nowrap"
                    >
                      <Plus size={16} /> Create Group
                    </button>
                  ) : (
                    <div className="relative group w-full sm:w-48">
                      <button
                        onClick={() => {
                          if (!isInGroup) onCreateGroup();
                        }}
                        disabled={isInGroup}
                        className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all whitespace-nowrap ${
                          isInGroup 
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-700 opacity-60' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <Plus size={16} /> Create Group
                      </button>
                      
                      {isInGroup && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-[10px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-xl">
                          You are already in a group
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* List Content */}
            <div className="flex-grow">
              {members.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {members.map((member) => renderMemberRow(member))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-full mb-4">
                    <SearchX className="size-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    No matches found
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                    Adjust your search or category to find course participants.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
              
        {/* Sidebar Section - Remaining Action Buttons */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-8 space-y-4">
            
            {/* Progress Legend */}
            <div className="bg-white dark:bg-[#1a1d26] p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">
                Grading Progress Key
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-300">
                  <div className="w-3 h-3 border-2 border-green-500 rounded-sm"></div>
                  <span>Submitted</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-300">
                  <div className="w-3 h-3 border-2 border-yellow-500 rounded-sm"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-300">
                  <div className="w-3 h-3 border-2 border-red-500 rounded-sm"></div>
                  <span>Late / Overdue</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Actions
              </label>
              <div className="flex flex-col gap-2">
                {isStaff && (
                  <>
                    <button 
                      onClick={onOpenGradeVisibility} 
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:bg-gray-50 transition-all"
                    >
                      <Eye size={16} className="text-blue-500" /> Show Grades
                    </button>
                    <button 
                      onClick={onOpenCreateGrading} 
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all"
                    >
                      <ClipboardList size={16} /> New Grading
                    </button>
                    <button 
                      onClick={onExport} 
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all"
                    >
                      <Download size={16} /> Export CSV
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
};

export default CohortMembersUI;
