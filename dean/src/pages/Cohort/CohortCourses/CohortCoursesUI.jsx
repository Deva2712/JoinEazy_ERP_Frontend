import React from "react";
import { ArrowUpDown, Share2, Calendar, FileText } from "lucide-react";

const CohortCoursesUI = ({
  cohortId,
  cohortData,
  user_type,
  sortBy,
  showSortDropdown,
  courseShareState,
  coursesData,
  onSortChange,
  onSortDropdownToggle,
  onSharePage,
  onCreateClick,
  onCourseClick,
}) => {
  const getDeadlineInfo = (course) => {
    // If already submitted, show "Submitted" in green
    if (course.submitted) {
      return {
        text: "Submitted",
        color: "#10b981", // green
      };
    }

    // If status is "Missed" (from mock data), show "Missed"
    if (course.status === "missed") {
      return {
        text: "Missed",
        color: "#ef4444", // red
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(course.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: "Missed",
        color: "#ef4444", // red
      };
    } else if (diffDays === 0) {
      return {
        text: "Due Today",
        color: "#10b981", // green
      };
    } else if (diffDays === 1) {
      return {
        text: "Due Tomorrow",
        color: "#f59e0b", // yellow/amber
      };
    } else {
      return {
        text: deadlineDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        color: "#6b7280", // gray
      };
    }
  };

  return (
    <div className="pb-[92px] py-5 sm:px-4 sm:py-6">
      {/* Header Row */}
      <div className="w-full px-4 sm:px-0 flex flex-row items-center justify-between mb-5 sm:mb-6">
        {/* Left Side - Sort and Share Buttons */}
        <div className="flex items-center gap-x-3">
          {/* Sort Button */}
          <div className="relative dropdown-container">
            <button
              onClick={onSortDropdownToggle}
              className="flex items-center justify-center px-4 gap-2 bg-white font-medium transition-all duration-200"
              style={{
                height: "38px",
                borderRadius: "9999px",
                border: "1px solid #D3D6DA",
              }}
            >
              <ArrowUpDown
                size={15}
                style={{
                  color: "#374151",
                  strokeWidth: "2.1",
                }}
              />
              <span className="text-sm" style={{ color: "#374151" }}>
                Sort
              </span>
            </button>

            {/* Sort Dropdown */}
            {showSortDropdown && (
              <div
                className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-10"
                style={{
                  border: "1px solid #D3D6DA",
                  minWidth: "120px",
                }}
              >
                <div className="py-1">
                  {["Latest", "Oldest"].map((option) => (
                    <button
                      key={option}
                      onClick={() => onSortChange(option)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                      style={{
                        color: sortBy === option ? "#1e61f0" : "#374151",
                        fontWeight: sortBy === option ? "500" : "400",
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Share Page Button */}
          <button
            onClick={onSharePage}
            className="flex items-center justify-center px-4 gap-2 bg-white font-medium transition-all duration-200"
            style={{
              height: "38px",
              borderRadius: "9999px",
              border: "1px solid #D3D6DA",
              backgroundColor: courseShareState.clicked ? "#16a34a" : "white",
              color: courseShareState.clicked ? "white" : "#374151",
            }}
          >
            <Share2
              size={15}
              style={{
                color: courseShareState.clicked ? "white" : "#374151",
                strokeWidth: "2.1",
              }}
            />
            <span
              className="text-sm"
              style={{
                color: courseShareState.clicked ? "white" : "#374151",
              }}
            >
              {courseShareState.text}
            </span>
          </button>
        </div>

        {/* Right Side - Create Submission Button (only for user_type 1) */}
        {user_type === 1 && (
          <button
            onClick={onCreateClick}
            className="flex items-center justify-center px-4 text-white font-medium transition-all duration-200"
            style={{
              height: "38px",
              borderRadius: "9999px",
              backgroundColor: "rgb(30, 97, 240)",
            }}
          >
            <span className="text-sm">Create Submission</span>
          </button>
        )}
      </div>

      {/* Courses List */}
      <div className="space-y-5 sm:space-y-6">
        {coursesData.map((course) => {
          const deadlineInfo = getDeadlineInfo(course);

          return (
            <div
              key={course.id}
              className="bg-white p-5 rounded-xl hover:cursor-pointer"
              style={{
                border: "1px solid #D3D6DA",
              }}
              onClick={() => onCourseClick(course.id)}
            >
              <div className="flex items-center justify-between">
                {/* Left Side - Icon and Title */}
                <div className="flex items-center gap-2.5">
                  <FileText
                    size={20}
                    style={{
                      color: "#6b7280",
                      strokeWidth: "2",
                    }}
                  />
                  <span className="font-medium text-black line-clamp-1">
                    {course.title}
                  </span>
                </div>

                {/* Right Side - Submission Count for user_type 1, or Deadline Info for others */}
                <div className="flex items-center gap-2">
                  {user_type === 1 ? (
                    <span className="text-sm font-medium flex items-center gap-1.5 text-gray-700">
                      {course.submissionCount}/{course.totalSubmissions}
                      <span className="hidden sm:inline">Submitted</span>
                    </span>
                  ) : (
                    <>
                      <Calendar
                        size={16}
                        style={{
                          color: deadlineInfo.color,
                          strokeWidth: "2",
                        }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: deadlineInfo.color,
                        }}
                      >
                        {deadlineInfo.text}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {coursesData.length === 0 && (
        <div className="text-center py-12">
          <FileText
            size={48}
            className="mx-auto mb-4"
            style={{ color: "#9ca3af" }}
          />
          <h3 className="text-lg font-medium mb-2" style={{ color: "#6b7280" }}>
            No courses yet
          </h3>
          <p className="text-sm" style={{ color: "#9ca3af" }}>
            Courses and submissions will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default CohortCoursesUI;
