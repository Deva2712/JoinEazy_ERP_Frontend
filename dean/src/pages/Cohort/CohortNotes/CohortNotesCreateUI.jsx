import React from "react";
import { X, Plus, Pencil } from "lucide-react";

const CohortNotesCreateUI = ({
  isOpen,
  onClose,
  noteData,
  onInputChange,
  onCreate,
  onCancel,
  createError,
  isLoading,
  tagStyle,
  isEditMode,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex md:items-center md:justify-center items-end justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white md:rounded-2xl rounded-b-none shadow-lg w-full max-w-[35rem] lg:mx-4 mx-0 relative h-[100vh] md:h-auto md:max-h-[85vh] flex flex-col">
        {/* Header with close button */}
        <div
          className="flex items-center justify-between border-b border-gray-200 flex-shrink-0"
          style={{ padding: "20px" }}
        >
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Note" : "Create New Note"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-0">
            {/* Combined Input Section - Twitter-like */}
            <div className="space-y-2">
              {/* Title Input */}
              <div>
                <input
                  type="text"
                  value={noteData.title}
                  onChange={(e) => onInputChange("title", e.target.value)}
                  placeholder="Title"
                  className="w-full border-none focus:outline-none p-0 text-xl font-medium placeholder-gray-600 bg-transparent resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* Tag Input */}
              <div>
                <input
                  type="text"
                  value={noteData.category}
                  onChange={(e) => onInputChange("category", e.target.value)}
                  onBlur={() =>
                    onInputChange("categoryBlur", noteData.category)
                  }
                  placeholder="Context Tag (optional, link/text)"
                  className="w-full border-none focus:outline-none text-sm placeholder-gray-600 bg-transparent"
                  style={tagStyle}
                  disabled={isLoading}
                />
              </div>

              {/* Content Textarea */}
              <div>
                <textarea
                  value={noteData.content}
                  onChange={(e) => onInputChange("content", e.target.value)}
                  placeholder="Note it down here..."
                  rows={8}
                  className="w-full pt-1.5 border-0 focus:outline-none text-base placeholder-gray-600 bg-transparent resize-none"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Created/Updated Info - Only in edit mode */}
        {isEditMode && (noteData.createdOn || noteData.lastUpdated) && (
          <div className="px-5 py-3">
            <div className="space-y-1">
              {noteData.createdOn && (
                <p className="text-[13px] text-gray-700">
                  Created on {noteData.createdOn}
                </p>
              )}
              {noteData.lastUpdated && (
                <p className="text-[13px] text-gray-700">
                  Last updated {noteData.lastUpdated}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer with save button */}
        <div
          className="border-t border-gray-200 flex-shrink-0"
          style={{ padding: "20px" }}
        >
          {/* Error message */}
          {createError && (
            <div className="mb-4 text-red-600 text-sm">{createError}</div>
          )}

          {/* Save button - full width */}
          <button
            onClick={onCreate}
            disabled={isLoading}
            className="w-full py-3 h-[40px] text-white font-medium transition-colors flex items-center justify-center gap-1.5"
            style={{
              backgroundColor: isLoading ? "#94a3b8" : "rgb(30, 97, 240)",
              borderRadius: "9999px",
            }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {isEditMode ? <Pencil size={16} /> : <Plus size={16} />}
                {isEditMode ? "Update Note" : "Create Note"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CohortNotesCreateUI;
