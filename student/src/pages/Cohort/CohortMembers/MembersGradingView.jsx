import React, { useState, useEffect } from "react";
import { Edit, Save, X } from "lucide-react";

const getRollNumberFromEmail = (email) => {
  if (!email) return "Unknown";
  const emailPrefix = email.split("@")[0];
  // Match patterns like SE23UCSE018, ST21BTECH11001, etc.
  if (/^[A-Za-z]{2}\d{2}[A-Za-z]{3,4}\d{3,4}$/.test(emailPrefix)) {
    return emailPrefix.toUpperCase();
  }
  return emailPrefix.toUpperCase();
};

const getMemberDisplayName = (member) => {
  const displayName = (member?.display_name || member?.username || member?.name || member?.email || "").toString();
  const email = member?.email || "";
  
  // Always prioritize roll number from email for student display
  const rollNumber = getRollNumberFromEmail(email);
  
  // Check if display name looks like a roll number pattern
  if (/^[A-Za-z]{2}\d{2}[A-Za-z]{3,4}\d{3,4}$/.test(displayName)) {
    return displayName.toUpperCase();
  }
  
  // If display name contains "new user" or similar, use roll number
  if (displayName.toLowerCase().includes("new user") || 
      displayName.toLowerCase().includes("newuser") ||
      displayName.toLowerCase().includes("user")) {
    return rollNumber;
  }
  
  // If we have a valid roll number pattern from email, use it
  if (/^[A-Za-z]{2}\d{2}[A-Za-z]{3,4}\d{3,4}$/.test(rollNumber)) {
    return rollNumber;
  }
  
  // Otherwise use display name if available
  if (displayName && displayName.trim() !== "") {
    return displayName;
  }
  
  return rollNumber;
};

// Grade Entry Modal
const GradeModal = ({ isOpen, onClose, onSubmit, member, assignment, currentGrade }) => {
  const [score, setScore] = useState(currentGrade?.score || "");
  const [feedback, setFeedback] = useState(currentGrade?.feedback || "");

  useEffect(() => {
    if (isOpen) {
      setScore(currentGrade?.score || "");
      setFeedback(currentGrade?.feedback || "");
    }
  }, [isOpen, currentGrade]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      memberId: member.id,
      assignmentId: assignment.id,
      score: parseFloat(score),
      feedback: feedback.trim(),
    });
    onClose();
  };

  const formatSubmissionDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  if (!isOpen) return null;

  const submissionDateTime = currentGrade?.submittedAt ? formatSubmissionDateTime(currentGrade.submittedAt) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Grade Assignment
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {assignment?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                {getMemberDisplayName(member).charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {getMemberDisplayName(member)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {member?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Submission Date/Time Display */}
          {submissionDateTime && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                  Submitted
                </span>
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <div className="font-medium">{submissionDateTime.date}</div>
                <div className="text-blue-600 dark:text-blue-400">{submissionDateTime.time}</div>
              </div>
            </div>
          )}

          {/* Show if not submitted */}
          {!currentGrade?.submittedAt && currentGrade?.isSubmitted === false && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-300">
                  Not submitted yet
                </span>
              </div>
            </div>
          )}

          {/* Show if late submission */}
          {currentGrade?.wasLate && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-medium text-red-700 dark:text-red-300">
                  Late Submission
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Score (out of {assignment?.marks}) *
            </label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              min="0"
              max={assignment?.marks}
              step="0.5"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg font-semibold"
              placeholder={`Enter score (0-${assignment?.marks})`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Feedback (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Provide feedback to the student..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Grade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Score Box Component
const ScoreBox = ({ score, maxScore, onClick, isSubmitted = false, isLate = false, wasLate = false, submittedAt = null }) => {
  const getBoxColor = () => {
    // If already graded
    if (score !== null && score !== undefined && score !== "") {
      // Red border if it was graded late
      if (wasLate) {
        return "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
      }
      // Otherwise show color based on score percentage
      const percentage = (score / maxScore) * 100;
      if (percentage >= 90) return "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      if (percentage >= 75) return "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
      if (percentage >= 60) return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400";
      if (percentage >= 40) return "border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400";
      return "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
    }
    // If not graded yet - use theme-appropriate colors
    // Red border if deadline passed (late - can grade regardless of submission)
    if (isLate) {
      return "border-red-500 dark:border-red-500 bg-red-50 dark:bg-gray-700 text-red-700 dark:text-gray-400";
    }
    // Yellow border if not submitted yet and before deadline (cannot grade)
    if (!isSubmitted) {
      return "border-yellow-500 dark:border-yellow-500 bg-yellow-50 dark:bg-gray-700 text-yellow-700 dark:text-gray-400";
    }
    // Green border if submitted and before deadline (can grade)
    return "border-green-500 dark:border-green-500 bg-green-50 dark:bg-gray-700 text-green-700 dark:text-gray-400";
  };

  const formatSubmissionDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    const formattedTime = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return `${formattedDate} at ${formattedTime}`;
  };

  const getTooltip = () => {
    const submissionInfo = submittedAt ? `\nSubmitted: ${formatSubmissionDateTime(submittedAt)}` : '';
    
    if (score !== null && score !== undefined && score !== "") {
      if (wasLate) {
        return `Score: ${score}/${maxScore} (Graded Late)${submissionInfo}`;
      }
      return `Score: ${score}/${maxScore}${submissionInfo}`;
    }
    if (isLate) {
      return isSubmitted ? `Late submission - Click to grade${submissionInfo}` : "Deadline passed - Click to grade";
    }
    if (!isSubmitted) {
      return "Not submitted - Cannot grade yet";
    }
    return `Submitted - Click to grade${submissionInfo}`;
  };

  const handleClick = () => {
    // Allow grading if: deadline passed (late), submitted, or already graded
    if (isLate || isSubmitted || (score !== null && score !== undefined && score !== "")) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-all hover:shadow-md font-bold ${getBoxColor()} ${
        isLate || isSubmitted || (score !== null && score !== undefined && score !== "") ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-75'
      }`}
      title={getTooltip()}
    >
      {score !== null && score !== undefined && score !== "" ? score : "-"}
    </div>
  );
};

const MembersGradingView = ({
  members,
  assignments,
  grades,
  onGradeSubmit,
  onRemove,
  isStaff,
}) => {
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [currentGrade, setCurrentGrade] = useState(null);

  const handleScoreClick = (member, assignment) => {
    setSelectedMember(member);
    setSelectedAssignment(assignment);
    const gradeKey = `${member.realUserId || member.id}_${assignment.id}`;
    setCurrentGrade(grades[gradeKey] || null);
    setShowGradeModal(true);
  };

  const handleGradeSubmit = (gradeData) => {
    onGradeSubmit(gradeData);
  };

  // Calculate total score for a member
  const calculateTotal = (member) => {
    let total = 0;
    assignments.forEach((assignment) => {
      const gradeKey = `${member.realUserId || member.id}_${assignment.id}`;
      const grade = grades[gradeKey];
      if (grade?.score !== null && grade?.score !== undefined) {
        total += parseFloat(grade.score) || 0;
      }
    });
    return total;
  };

  return (
    <div className="space-y-0">
      {members.map((member, index) => {
        const displayName = getMemberDisplayName(member);
        const groupName = member.groupName;
        const totalScore = calculateTotal(member);

        return (
          <div
            key={member.id}
            className={`flex items-center px-6 py-4 gap-4 border-b border-gray-700 dark:border-gray-700 ${
              index % 2 === 0 ? "bg-gray-800 dark:bg-gray-800" : "bg-gray-750 dark:bg-gray-750"
            } hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors`}
          >
            {/* Student Info - Fixed width */}
            <div className="w-64 flex-shrink-0">
              <div className="text-sm font-bold text-gray-100 dark:text-gray-100">
                {displayName}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-400">
                {member.email}
              </div>
              {groupName && (
                <div className="inline-block mt-1 px-2 py-0.5 text-xs text-green-400 dark:text-green-400 bg-green-900/30 dark:bg-green-900/30 rounded font-medium">
                  {groupName}
                </div>
              )}
            </div>

            {/* Assignment Score Boxes - Flex grow to take available space */}
            <div className="flex-1 flex items-center gap-3 justify-center">
              {assignments.map((assignment) => {
                const gradeKey = `${member.realUserId || member.id}_${assignment.id}`;
                const grade = grades[gradeKey];
                const isLate = assignment.deadline && new Date() > new Date(assignment.deadline);
                return (
                  <ScoreBox
                    key={assignment.id}
                    score={grade?.score}
                    maxScore={assignment.marks}
                    isSubmitted={grade?.isSubmitted || false}
                    isLate={isLate || false}
                    wasLate={grade?.wasLate || false}
                    submittedAt={grade?.submittedAt || null}
                    onClick={() => handleScoreClick(member, assignment)}
                  />
                );
              })}
            </div>

            {/* Total and Remove - Fixed width, aligned right */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="px-3 py-2 text-sm font-semibold rounded-lg border border-gray-600 dark:border-gray-600 text-gray-300 dark:text-gray-300 bg-gray-700 dark:bg-gray-700 min-w-[100px] text-center">
                Total: {totalScore}
              </div>
              {isStaff && (
                <button
                  onClick={() => onRemove && onRemove(member.realUserId || member.id)}
                  className="px-4 py-2 text-sm font-medium text-red-400 dark:text-red-400 bg-red-900/30 dark:bg-red-900/30 hover:bg-red-900/50 dark:hover:bg-red-900/50 rounded-lg transition-colors border border-red-800 dark:border-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        );
      })}

      <GradeModal
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
        onSubmit={handleGradeSubmit}
        member={selectedMember}
        assignment={selectedAssignment}
        currentGrade={currentGrade}
      />
    </div>
  );
};

export default MembersGradingView;
