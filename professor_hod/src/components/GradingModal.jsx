import React, { useState, useEffect } from 'react';
import { X, Star, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

const GradingModal = ({ isOpen, onClose, gradeData, onSubmitGrade, assignments = [] }) => {
  const [marksAwarded, setMarksAwarded] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isGroupGrading, setIsGroupGrading] = useState(false);
  
  // Find assignment details
  const assignment = assignments.find(a => a.id === gradeData?.assignmentId);
  const maxMarks = assignment?.marks || 100;
  const isGroupAssignment = assignment?.type === 'group';

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMarksAwarded('');
      setComments('');
      setError('');
      setIsSubmitting(false);
      setIsGroupGrading(false);
    }
  }, [isOpen]);

  // Validate marks
  const validateMarks = (marks) => {
    const numMarks = parseFloat(marks);
    if (isNaN(numMarks)) {
      return 'Marks must be a valid number';
    }
    if (numMarks < 0) {
      return 'Marks cannot be negative';
    }
    if (numMarks > maxMarks) {
      return `Marks cannot exceed maximum (${maxMarks})`;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateMarks(marksAwarded);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const gradeInfo = {
        ...gradeData,
        marksAwarded: parseFloat(marksAwarded),
        comments: comments.trim(),
        isGroupGrading: isGroupAssignment && isGroupGrading,
        maxMarks: maxMarks
      };

      await onSubmitGrade(gradeInfo);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit grade');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'acknowledged':
        return { text: 'Acknowledged', color: 'text-green-600', icon: CheckCircle2 };
      case 'overdue':
        return { text: 'Overdue', color: 'text-red-600', icon: AlertCircle };
      case 'not-acknowledged':
      default:
        return { text: 'Not Acknowledged', color: 'text-gray-600', icon: AlertCircle };
    }
  };

  if (!isOpen || !gradeData) return null;

  const statusInfo = getStatusDisplay(gradeData.currentStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900">Grade Assignment</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Assignment Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">{gradeData.assignmentName}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center justify-between">
                <span>Maximum Marks:</span>
                <span className="font-medium">{maxMarks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Assignment Type:</span>
                <span className="font-medium capitalize">{assignment?.type || 'Individual'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Deadline:</span>
                <span className="font-medium">
                  {new Date(gradeData.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Student Information</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center justify-between">
                <span>Name:</span>
                <span className="font-medium">{gradeData.studentName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Email:</span>
                <span className="font-medium">{gradeData.studentEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                  <span className={`font-medium ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Group Grading Option */}
          {isGroupAssignment && (
            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-yellow-600" />
                <h4 className="font-medium text-gray-900">Group Assignment</h4>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGroupGrading}
                  onChange={(e) => setIsGroupGrading(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Grade entire group</span>
                  <p className="text-gray-600 mt-1">
                    Apply this grade to all members of the student's group
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Grading Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Marks Input */}
            <div>
              <label htmlFor="marksAwarded" className="block text-sm font-medium text-gray-700 mb-2">
                Marks Awarded (out of {maxMarks})
              </label>
              <input
                type="number"
                id="marksAwarded"
                value={marksAwarded}
                onChange={(e) => setMarksAwarded(e.target.value)}
                min="0"
                max={maxMarks}
                step="0.5"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter marks (0-${maxMarks})`}
              />
            </div>

            {/* Comments */}
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add feedback or comments..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Grading...
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4" />
                    {isGroupAssignment && isGroupGrading ? 'Grade Group' : 'Grade Student'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GradingModal;
