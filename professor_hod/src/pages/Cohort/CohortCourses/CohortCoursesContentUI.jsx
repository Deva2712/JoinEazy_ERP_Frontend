import React, { useState } from "react";
import {
  X,
  Calendar,
  FileText,
  User,
  Users,
  Clock,
  Upload,
  MessageCircle,
  Send,
  Share2,
  Tag,
  ArrowLeft,
  Paperclip,
  BookOpen,
  Award,
  Target,
  BarChart3,
  UserCheck,
  CheckCircle,
} from "lucide-react";

const CohortCoursesContentUI = ({
  isOpen,
  onClose,
  courseData,
  loading,
  cohortId,
  cohortData,
}) => {
  const [showSubmissions, setShowSubmissions] = useState(false);

  const [showSubmissionDetail, setShowSubmissionDetail] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(courseData?.comments || []);

  if (!isOpen) return null;

  const getDeadlineInfo = (course) => {
    if (!course) return { text: "", color: "#6b7280" };

    if (course.submitted) {
      return {
        text: "Submitted",
        color: "#10b981",
      };
    }

    if (course.status === "missed") {
      return {
        text: "Missed",
        color: "#ef4444",
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
        color: "#ef4444",
      };
    } else if (diffDays === 0) {
      return {
        text: "Due Today",
        color: "#10b981",
      };
    } else if (diffDays === 1) {
      return {
        text: "Due Tomorrow",
        color: "#f59e0b",
      };
    } else {
      return {
        text: deadlineDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        color: "#6b7280",
      };
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleComment = () => {
    if (comment.trim()) {
      // Use actual user data from cohortData
      const userData = cohortData?.userData || {};
      setComments([
        {
          id: Date.now(),
          authorName: userData.username || "You",
          authorAvatar: userData.profile_image || "",
          description: userData.description || "Current User",
          content: comment,
          isEditable: true,
        },
        ...comments,
      ]);
      setComment("");
    }
  };

  const handleCommentDelete = (commentId) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  const handleViewSubmissions = () => {
    setShowSubmissions(true);
  };

  const handleBackToContent = () => {
    setShowSubmissions(false);
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowSubmissionDetail(true);
  };

  const handleBackToSubmissions = () => {
    setShowSubmissionDetail(false);
    setSelectedSubmission(null);
  };

  const handleGradeSubmission = (submissionId, grade, weightage) => {
    // Update the submissions array to mark as graded
    const updatedSubmissions = submissions.map((sub) =>
      sub.id === submissionId
        ? { ...sub, graded: true, grade: grade, weightage: weightage }
        : sub,
    );
    // In real implementation, this would be an API call
    console.log("Grading submission:", submissionId, grade, weightage);
  };

  const deadlineInfo = getDeadlineInfo(courseData);
  const user_type = cohortData?.is_admin ? 1 : 0; // 1 for professor, 0 for student
  const isDeadlinePassed =
    courseData && new Date(courseData.deadline) < new Date();

  // Use submissions from courseData
  const submissions = courseData?.submissions || [];

  const SubmissionDetailComponent = ({
    submission,
    courseData,
    onGrade,
    user_type,
    formatFileSize,
  }) => {
    const [gradeInput, setGradeInput] = useState("");
    const [isGrading, setIsGrading] = useState(false);
    const [individualGrading, setIndividualGrading] = useState(false);
    const [individualGrades, setIndividualGrades] = useState({});

    const handleSubmitGrade = () => {
      if (gradeInput && !isNaN(gradeInput)) {
        const grade = parseFloat(gradeInput);
        const maxPoints = courseData?.points || 100;
        const weightage = (
          (grade / maxPoints) *
          (courseData?.weightage || 10)
        ).toFixed(1);
        onGrade(submission.id, grade, weightage);
        setIsGrading(false);
        setGradeInput("");
      }
    };

    const handleIndividualGradeChange = (userId, grade) => {
      setIndividualGrades((prev) => ({
        ...prev,
        [userId]: grade,
      }));
    };

    const handleSaveIndividualGrades = () => {
      // Handle saving individual grades
      console.log("Saving individual grades:", individualGrades);
      setIsGrading(false);
      setIndividualGrading(false);
      setIndividualGrades({});
    };

    // Use actual group members from submission data
    const groupMembers = submission.memberType === 1 ? (submission.groupMembers || []) : [];

    return (
      <div className="space-y-6">
        {/* Student Info - Updated Layout */}
        <div className="flex items-center gap-3">
          <img
            src={submission.avatar}
            alt={submission.studentName}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-[15px] text-gray-900">
              {submission.studentName}
            </h3>
            <p className="text-sm text-gray-600">{submission.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1 text-[15px] text-black">
          <Calendar size={17} />
          <span>
            Submitted on{" "}
            {new Date(submission.submittedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Attachments */}
        {submission.attachments && submission.attachments.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Submitted Files
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {submission.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Paperclip size={16} className="text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grading Section */}
        {user_type === 1 && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Grading</h4>
            {submission.graded ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Grade:</span>
                  <span className="font-medium text-green-600">
                    {submission.grade}/{courseData?.points || 100}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Weightage:</span>
                  <span className="font-medium text-green-600">
                    {submission.weightage}%
                  </span>
                </div>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Graded
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {!isGrading ? (
                  <button
                    onClick={() => setIsGrading(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Grade Submission
                  </button>
                ) : (
                  <div className="space-y-4">
                    {/* Group Submission Toggle */}
                    {submission.memberType === 1 && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">
                          Individual Grading
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={individualGrading}
                            onChange={(e) =>
                              setIndividualGrading(e.target.checked)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                              individualGrading ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                                individualGrading
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>
                    )}

                    {/* Individual Grading Section */}
                    {individualGrading && submission.memberType === 1 ? (
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-900">
                          Grade Each Member
                        </h5>
                        {groupMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                          >
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {member.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {member.username}
                              </p>
                            </div>
                            <div className="w-24">
                              <input
                                type="number"
                                value={individualGrades[member.id] || ""}
                                onChange={(e) =>
                                  handleIndividualGradeChange(
                                    member.id,
                                    e.target.value,
                                  )
                                }
                                max={courseData?.points || 100}
                                min="0"
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Grade"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={handleSaveIndividualGrades}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Save Individual Grades
                        </button>
                      </div>
                    ) : (
                      // Regular Grading
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Grade (out of {courseData?.points || 100})
                          </label>
                          <input
                            type="number"
                            value={gradeInput}
                            onChange={(e) => setGradeInput(e.target.value)}
                            max={courseData?.points || 100}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter grade"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSubmitGrade}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                          >
                            Submit Grade
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setIsGrading(false);
                        setGradeInput("");
                        setIndividualGrading(false);
                        setIndividualGrades({});
                      }}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Student View Grading Info */}
        {user_type === 0 && submission.graded && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Your Grade</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Grade:</span>
                <span className="font-medium text-green-600">
                  {submission.grade}/{courseData?.points || 100}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Weightage:</span>
                <span className="font-medium text-green-600">
                  {submission.weightage}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (showSubmissions && user_type === 1) {
    // Show submission detail modal
    if (showSubmissionDetail && selectedSubmission && user_type === 1) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:p-4 overflow-y-auto overflow-x-hidden">
          <div className="bg-white sm:rounded-2xl w-full sm:max-w-[40rem] h-[100vh] sm:h-auto sm:max-h-[90vh] flex flex-col my-auto sm:border border-[#52586633]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#52586633]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToSubmissions}
                  className="transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h2 className="text-lg sm:text-xl font-semibold text-black">
                  {courseData?.title || "Course Details"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Submission Detail Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <SubmissionDetailComponent
                submission={selectedSubmission}
                courseData={courseData}
                onGrade={handleGradeSubmission}
                user_type={user_type}
                formatFileSize={formatFileSize}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:p-4 overflow-y-auto overflow-x-hidden">
        <div className="bg-white sm:rounded-2xl w-full sm:max-w-[40rem] h-[100vh] sm:h-auto sm:max-h-[90vh] flex flex-col my-auto sm:border border-[#52586633]">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#52586633]">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToContent}
                className="transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <h2 className="text-lg sm:text-xl font-semibold text-black">
                {courseData?.title || "Course Details"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Submissions List */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="mb-0">
              <h3 className="text-base font-semibold text-black mb-2">
                All Submissions ({submissions.length})
              </h3>
            </div>

            <div className="space-y-0">
              {submissions.map((submission, index) => (
                <div
                  key={submission.id}
                  className={`flex items-center justify-between p-4 px-0 ${
                    index < submissions.length - 1 ? "border-b" : ""
                  }`}
                  style={{
                    borderColor:
                      index < submissions.length - 1
                        ? "#52586633"
                        : "transparent",
                  }}
                >
                  <div className="flex items-center gap-3">
                    {submission.memberType !== 1 && (
                      <img
                        src={submission.avatar}
                        alt={submission.studentName}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                    )}
                    <div
                      className={`${submission.memberType === 1 ? "ml-0" : ""}`}
                    >
                      <p className="font-medium text-gray-900 text-[15px]">
                        {submission.studentName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {submission.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        submission.graded
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {submission.graded ? "Graded" : "Not Graded"}
                    </span>
                    <button
                      onClick={() => handleViewSubmission(submission)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:p-4 overflow-y-auto overflow-x-hidden">
      <div className="bg-white sm:rounded-2xl w-full sm:max-w-[40rem] h-[100vh] sm:h-auto sm:max-h-[90vh] flex flex-col my-auto sm:border border-[#52586633]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#52586633]">
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            {loading ? "Loading..." : courseData?.title || "Course Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-lg text-gray-600">
                Loading course details...
              </div>
            </div>
          ) : courseData ? (
            <div className="p-5">
              {/* Status Row */}
              <div className="flex items-center justify-between mb-4">
                {user_type === 0 ? (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} style={{ color: deadlineInfo.color }} />
                    <div
                      className={`w-2 h-2 rounded-full`}
                      style={{ backgroundColor: deadlineInfo.color }}
                    ></div>
                    <span
                      className="text-[15px] font-medium"
                      style={{ color: deadlineInfo.color }}
                    >
                      {deadlineInfo.text}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-gray-700">
                    {courseData.submissionCount || 0}/
                    {courseData.totalSubmissions || 0} Submissions
                  </span>
                )}
              </div>

              {/* Course Description */}
              <p className="text-gray-800 font-normal text-base mb-5">
                {courseData.description}
              </p>

              {/* Attachments */}
              {courseData.attachments && courseData.attachments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-[15px] font-semibold text-black mb-2">
                    Attachments
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {courseData.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 px-3 border border-[#52586633] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <Paperclip size={16} className="text-gray-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Details List */}
              <div className="mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700">
                      Deadline:{" "}
                      {courseData.deadline
                        ? `${new Date(courseData.deadline).toLocaleDateString()} at ${new Date(courseData.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen size={17} className="text-gray-600" />
                    <span className="text-[15px] text-gray-700">
                      Graded Type: {courseData.gradedType || "Assignment"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award size={17} className="text-gray-600" />
                    <span className="text-[15px] text-gray-700">
                      Points: {courseData.points || "100"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 size={17} className="text-gray-600" />
                    <span className="text-[15px] text-gray-700">
                      Weightage: {courseData.weightage || "10%"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users size={17} className="text-gray-600" />
                    <span className="text-[15px] text-gray-700">
                      Type: {courseData.type || "Individual"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle size={17} className="text-gray-600" />
                    <span className="text-[15px] text-gray-700">
                      Status: {courseData.status || "Active"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructor Actions or Student Submission */}
              {user_type === 1 ? (
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleViewSubmissions}
                    className="w-auto bg-blue-600 hover:bg-blue-700 text-sm py-2 px-3 text-white rounded-lg font-medium transition-colors"
                  >
                    View All Submissions
                  </button>
                  <button className="w-auto border border-gray-300 hover:bg-gray-50 py-2 px-3 text-sm text-gray-700 rounded-lg font-medium transition-colors">
                    Edit Course
                  </button>
                </div>
              ) : (
                !isDeadlinePassed && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                    <h3 className="text-lg font-semibold text-black mb-3">
                      Your Submission
                    </h3>
                    <div className="space-y-3">
                      <button className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors w-full">
                        <Upload size={16} className="text-gray-600" />
                        <span className="text-sm text-gray-700">
                          Upload Files
                        </span>
                      </button>
                      <div className="flex gap-3">
                        {courseData.submitted ? (
                          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                            Unsubmit
                          </button>
                        ) : (
                          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                            Submit Assignment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 border-t border-b border-gray-200 py-4 mb-6">
                <button className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Share2 size={16} className="text-gray-600" />
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Tag size={16} className="text-gray-600" />
                  <span>Tag to Note</span>
                </button>
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="text-[17px] sm:text-lg font-semibold text-black mb-3.5">
                  {comments.length} Comments
                </h3>

                {/* Add Comment Input */}
                <div className="mb-6 p-4 bg-[#f2f2f2] border border-[#52586633] rounded-[10px] sm:rounded-xl">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full min-h-[60px] text-sm bg-transparent border-none focus:outline-none resize-none placeholder-gray-500"
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleComment}
                      disabled={!comment.trim()}
                      className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "rgb(30, 97, 240)" }}
                    >
                      Submit
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-5">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-white">
                      {/* Comment Header */}
                      <div className="flex items-center gap-3">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-black text-[15px]">
                              {comment.authorName}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600">
                            {comment.description}
                          </p>
                        </div>
                      </div>

                      {/* Comment Content */}
                      <p className="text-base text-black my-2.5 ml-[52px]">
                        {comment.content}
                      </p>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 ml-[52px]">
                        <button
                          onClick={() =>
                            console.log("Share comment:", comment.id)
                          }
                          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <Share2 size={15} />
                          Share
                        </button>
                        {comment.isEditable && (
                          <button
                            onClick={() => handleCommentDelete(comment.id)}
                            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <X size={15} />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2 text-gray-600">
                  Course not found
                </h3>
                <p className="text-sm text-gray-500">
                  The requested course could not be found.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CohortCoursesContentUI;
