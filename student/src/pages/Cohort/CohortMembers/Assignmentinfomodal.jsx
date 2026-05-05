import React from "react";
import { X } from "lucide-react";

const AssignmentInfoModal = ({ isOpen, onClose, assignment, grade, isGroupAssignment, membersGradedIndividually }) => {
  if (!isOpen || !assignment) return null;

  const assignmentName = assignment.title || assignment.name;
  const assignmentType = isGroupAssignment ? ' (Group Assignment)' : ' (Individual Assignment)';
  const maxMarks = assignment.marks;
  const hasScore = grade && (grade.score !== null && grade.score !== undefined);
  const isSubmitted = grade?.isSubmitted || false;
  const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
  const score = grade?.score;
  const lateStatus = grade?.wasLate ? ' (Graded after deadline)' : ' (Graded on time)';

  const handleGoToAssignments = () => {
    const pathParts = window.location.pathname.split('/');
    const cohortId = pathParts[pathParts.indexOf('c') + 1];
    window.location.href = `/c/${cohortId}/assignments`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">
            {assignmentName}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-gray-100">Type:</span> {assignmentType.replace(/[()]/g, '')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span className="font-medium text-gray-900 dark:text-gray-100">Total Marks:</span> {maxMarks}
            </p>
            
            {assignment.deadline && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className="font-medium text-gray-900 dark:text-gray-100">Deadline:</span>{' '}
                {new Date(assignment.deadline).toLocaleDateString()} {new Date(assignment.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                {isLate && <span className="text-red-600 dark:text-red-400 font-medium ml-1">(Overdue)</span>}
              </p>
            )}

            {grade?.submittedAt && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className="font-medium text-gray-900 dark:text-gray-100">Submitted:</span>{' '}
                {new Date(grade.submittedAt).toLocaleDateString()} {new Date(grade.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            {membersGradedIndividually ? (
              <>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Status: Members graded individually
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Click "See More" to view individual grades
                </p>
              </>
            ) : hasScore ? (
              <>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Score: {score}/{maxMarks}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {lateStatus}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Status: {isSubmitted ? 'Submitted' + (isLate ? ' (Late)' : '') : isLate ? 'Not Submitted (Overdue)' : 'Not Submitted'}
                </p>
                {!isSubmitted && !isLate && (
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    ⚠️ Grading disabled until submission is done
                  </p>
                )}
              </>
            )}
          </div>

          <button
            onClick={handleGoToAssignments}
            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Assignments
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentInfoModal;