import React from "react";
import { Clock, CheckCircle, FileText, Edit, Trash2 } from "lucide-react";
import { formatDate, formatTime, truncateDescription } from "../utils/assignmentHelpers";

const AssignmentCard = ({ 
  assignment, 
  onEditClick, 
  onDeleteClick, 
  onSeeMore, 
  onViewSubmissions 
}) => {
  const { truncated, needsTruncation } = truncateDescription(assignment.description);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 flex flex-col">
      {/* Card Header */}
      <div 
        className="p-4 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900" 
        style={{ minHeight: "80px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 
            className="text-lg font-semibold text-white flex-1" 
            style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical', 
              lineHeight: '1.4' 
            }} 
            title={assignment.name || assignment.title || assignment.assignment_name}
          >
            {assignment.name || assignment.title || assignment.assignment_name}
          </h3>
          <span 
            className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
              assignment.type === 'group' 
                ? 'bg-purple-200 text-purple-800' 
                : 'bg-blue-200 text-blue-800'
            }`}
          >
            {assignment.type === 'group' ? 'Group' : 'Individual'}
          </span>
        </div>
      </div>

      {/* Description Section */}
      <div className="px-3 pt-3 pb-2">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {truncated}
          {needsTruncation && (
            <button
              onClick={() => onSeeMore(assignment)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium ml-1"
            >
              See more
            </button>
          )}
        </p>
      </div>

      {/* Due Date and Marks */}
      <div className="px-2.5 pb-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-1.5">
            <div className="flex items-center gap-1 mb-0.5">
              <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-900 dark:text-blue-300">Due Date</span>
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-tight">
              {formatDate(assignment.deadline)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
              {formatTime(assignment.deadline)}
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-1.5">
            <div className="flex items-center gap-1 mb-0.5">
              <FileText className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-900 dark:text-blue-300">Total Marks</span>
            </div>
            <p className="text-base font-bold text-blue-700 dark:text-blue-400 leading-tight">
              {assignment.marks || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Submission Stats - Clickable */}
      <div className="px-3 pb-3">
        <div 
          onClick={() => onViewSubmissions(assignment)}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-2.5 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group relative"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-900 dark:text-green-300">Submissions</span>
            </div>
            <p className="text-xl font-bold text-green-700 dark:text-green-400">
              {assignment.submissions?.length || 0}
            </p>
          </div>
          {/* Hover tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Click to view details
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Action Buttons */}
      <div className="px-3 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEditClick(assignment)}
            className="flex-1 px-3 py-2 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDeleteClick(assignment)}
            className="flex-1 px-3 py-2 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;