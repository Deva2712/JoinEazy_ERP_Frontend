import React from "react";
import { X, Upload, File, Trash2, Calendar, Loader2 } from "lucide-react";

const CohortCoursesCreateUI = ({
  isOpen,
  onClose,
  submissionData,
  onInputChange,
  onSave,
  error,
  isLoading,
  user_type,
  cohortId,
  onAttachmentUpload,
  onRemoveAttachment,
  isEditMode = false,
}) => {
  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAttachmentUpload(files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[35rem] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Submission" : "Create Submission"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={submissionData.title}
              onChange={(e) => onInputChange("title", e.target.value)}
              placeholder="Enter submission title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={isLoading}
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={submissionData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
              placeholder="Enter submission description"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Submission Type - Only for user_type 1 */}
          {user_type === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Type *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="submissionType"
                    value="Individual"
                    checked={submissionData.submissionType === "Individual"}
                    onChange={(e) =>
                      onInputChange("submissionType", e.target.value)
                    }
                    disabled={isLoading}
                    className="mr-2 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">Individual</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="submissionType"
                    value="Group"
                    checked={submissionData.submissionType === "Group"}
                    onChange={(e) =>
                      onInputChange("submissionType", e.target.value)
                    }
                    disabled={isLoading}
                    className="mr-2 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">Group</span>
                </label>
              </div>
            </div>
          )}

          {/* Deadline Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline *
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={submissionData.deadline}
                onChange={(e) => onInputChange("deadline", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                disabled={isLoading}
              />
              <Calendar
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={isLoading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload files or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX, Images up to 10MB
                </span>
              </label>
            </div>

            {/* Uploaded Files List */}
            {submissionData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {submissionData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <File size={16} className="text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveAttachment(index)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      disabled={isLoading}
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grading Toggle and Fields */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Grading
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Make this submission graded
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={submissionData.isGraded}
                    onChange={(e) =>
                      onInputChange("isGraded", e.target.checked)
                    }
                    disabled={isLoading}
                    className="sr-only"
                  />
                  <div
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      submissionData.isGraded ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                        submissionData.isGraded
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Grading Fields - Only show when toggle is on */}
            {submissionData.isGraded && (
              <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                {/* Maximum Marks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Marks *
                  </label>
                  <input
                    type="number"
                    value={submissionData.maxMarks}
                    onChange={(e) => onInputChange("maxMarks", e.target.value)}
                    placeholder="Enter maximum marks (e.g., 100)"
                    min="1"
                    max="1000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    disabled={isLoading}
                  />
                </div>

                {/* Weightage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weightage (%) *
                  </label>
                  <input
                    type="number"
                    value={submissionData.weightage}
                    onChange={(e) => onInputChange("weightage", e.target.value)}
                    placeholder="Enter weightage percentage (e.g., 20)"
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Percentage weightage of this submission in the total course
                    grade
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center p-5 border-t border-gray-200">
          <button
            onClick={onSave}
            disabled={isLoading}
            className="w-full h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Submission"
                : "Create Submission"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CohortCoursesCreateUI;
