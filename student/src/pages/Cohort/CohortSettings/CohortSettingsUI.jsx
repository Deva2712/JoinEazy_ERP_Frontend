import React from "react";
import { X, GripVertical, Trash2, Upload, Users } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

const CohortSettingsUI = ({
  isOpen,
  onClose,
  onOverlayClick,
  form,
  onSave,
  cohortData,
  saveError,
  detailsSectionCards,
  onCardReorder,
  onCardDelete,
  onImportParticipants,
  importParticipantsFile,
  // Add new props for group settings
  maxGroupMembers,
  onMaxGroupMembersChange,
  minGroupMembers,
  onMinGroupMembersChange,
  // Add course member limit props
  maxCourseMembers,
  onMaxCourseMembersChange,
  // Add delete props
  deleteError,
  isDeleting,
  showDeleteConfirmation,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel,
}) => {
  const handleFormSubmit = (data) => {
    onSave(data);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (dragIndex !== dropIndex) {
      onCardReorder(dragIndex, dropIndex);
    }
  };

  // Project toggles removed

  return (
    <div
      className="fixed inset-0 z-50 flex md:items-center md:justify-center items-end justify-center bg-black bg-opacity-50"
      onClick={onOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 md:rounded-2xl rounded-b-none shadow-lg w-full max-w-[35rem] lg:mx-4 mx-0 relative h-[100vh] md:h-auto md:max-h-[80vh] flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Course Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              {/* Cohort Name */}
              <FormField
                control={form.control}
                name="cohortName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel
                      className="block text-xs font-medium text-gray-900 dark:text-gray-100"
                    >
                      Course Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter course name"
                        className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 mt-0.5"
                      />
                    </FormControl>
                    {fieldState?.error && (
                      <FormMessage className="text-red-500 text-xs mt-0.5">
                        {fieldState.error.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Cohort URL */}
              <FormField
                control={form.control}
                name="cohortUrl"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel
                      className="block text-xs font-medium text-gray-900 dark:text-gray-100"
                    >
                      Course URL (Give Onedrive / Google Drive , etc)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="https://drive.google.com/..."
                        className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 mt-0.5"
                      />
                    </FormControl>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      This will be used in the course URL. Only letters, numbers, hyphens, and underscores are allowed.
                    </p>
                    {fieldState?.error && (
                      <FormMessage className="text-red-500 text-xs mt-0.5">
                        {fieldState.error.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Course Dates Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100">Course Duration</h3>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                          Start Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 mt-0.5"
                          />
                        </FormControl>
                        {fieldState?.error && (
                          <FormMessage className="text-red-500 text-xs mt-0.5">
                            {fieldState.error.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                          End Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 mt-0.5"
                          />
                        </FormControl>
                        {fieldState?.error && (
                          <FormMessage className="text-red-500 text-xs mt-0.5">
                            {fieldState.error.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>


              {/* Group Settings Section */}
              <div className="space-y-2">
                <div>
                  <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-0.5">
                    Group Settings
                  </h3>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-2">
                    Configure group formation and member limits
                  </p>
                </div>
                {/* Min/Max Members per Group - side by side */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-gray-600 dark:text-gray-400" />
                    <label className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      Members per Group
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-700 dark:text-gray-300">Minimum</span>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={minGroupMembers}
                        onChange={(e) => onMinGroupMembersChange(parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          borderColor: "#BABFC5",
                          borderWidth: "1px",
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-700 dark:text-gray-300">Maximum</span>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={maxGroupMembers}
                        onChange={(e) => onMaxGroupMembersChange(parseInt(e.target.value) || 4)}
                        className="w-16 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          borderColor: "#BABFC5",
                          borderWidth: "1px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Member Limit Section */}
              <div className="space-y-2">
                <div>
                  <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-0.5">
                    Course Member Limit
                  </h3>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-2">
                    Set the maximum number of students that can join this course
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-gray-600 dark:text-gray-400" />
                  <label className="text-xs font-medium text-gray-900 dark:text-gray-100">
                    Maximum Course Members
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="10000"
                    value={maxCourseMembers}
                    onChange={(e) => onMaxCourseMembersChange(parseInt(e.target.value) || 1400)}
                    className="w-24 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      borderColor: "#BABFC5",
                      borderWidth: "1px",
                    }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">students</span>
                </div>
              </div>

              {/* Details Section Cards removed as requested */}

              {/* Import Participants Section */}
              <div className="space-y-2">
                <div>
                  <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-0.5">
                    Import Participants
                  </h3>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-2">
                    Import participants via emails from excel
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onImportParticipants}
                  className="flex items-center justify-center px-3 gap-1.5 bg-white font-medium transition-all duration-200 text-white"
                  style={{
                    height: "32px",
                    borderRadius: "9999px",
                    backgroundColor: "rgb(30, 97, 240)",
                  }}
                >
                  <Upload size={14} />
                  <span className="text-xs">Import Participants</span>
                </button>
                
                {/* Show selected file info */}
                {importParticipantsFile && (
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      <strong>File selected:</strong> {importParticipantsFile.name}
                    </p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                      Click "Save Changes" to import participants and update course settings.
                    </p>
                  </div>
                )}
              </div>

              {/* Projects UI removed as requested */}

              {/* Save Error Display */}
              {saveError && (
                <div className="flex justify-center">
                  <p
                    className="text-red-500"
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    {saveError}
                  </p>
                </div>
              )}

              <Button
                type="button"
                onClick={form.handleSubmit(handleFormSubmit)}
                className="w-full py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </Button>

              {/* Delete Course Section - Only show for professors */}
              {cohortData?.user_type === 1 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900 dark:text-gray-100 mb-0.5">
                        Delete Course
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        This action cannot be undone. This will permanently delete the course and remove all students from it.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={onDeleteClick}
                      className="w-full py-3 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors font-medium"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete Course"}
                    </Button>

                    {/* Delete Error Display */}
                    {deleteError && (
                      <div className="flex justify-center">
                        <p
                          className="text-red-500"
                          style={{
                            fontSize: "16px",
                            fontWeight: "400",
                            textAlign: "left",
                            width: "100%",
                          }}
                        >
                          {deleteError}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Delete Course
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{cohortData?.name || cohortData?.title}"? This action cannot be undone and will permanently remove the course for all students.
              </p>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  onClick={onDeleteCancel}
                  className="flex-1 py-2 text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={onDeleteConfirm}
                  className="flex-1 py-2 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors font-medium"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CohortSettingsUI;