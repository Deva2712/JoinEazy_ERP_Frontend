import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CohortCoursesCreateUI from "./CohortCoursesCreateUI";

const CohortCoursesCreateController = ({
  cohortId,
  cohortData,
  isOpen,
  onClose,
  isEditMode = false,
  editCourseId = null,
  coursesData = [],
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [submissionData, setSubmissionData] = useState({
    title: "",
    description: "",
    deadline: "",
    submissionType: "Individual", // Default to Individual
    attachments: [],
    isGraded: false,
    maxMarks: "",
    weightage: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user_type = cohortData?.user_type || 1;

  // Load edit data when in edit mode
  useEffect(() => {
    if (isEditMode && editCourseId && coursesData.length > 0) {
      const courseToEdit = coursesData.find(
        (course) => course.id === editCourseId,
      );
      if (courseToEdit) {
        setSubmissionData({
          title: courseToEdit.title || "",
          description: courseToEdit.description || "",
          deadline: courseToEdit.deadline || "",
          submissionType: courseToEdit.submissionType || "Individual",
          attachments: courseToEdit.attachments || [],
          isGraded: courseToEdit.isGraded || false,
          maxMarks: courseToEdit.maxMarks || "",
          weightage: courseToEdit.weightage || "",
        });
      }
    } else if (!isEditMode) {
      // Reset form when not in edit mode
      setSubmissionData({
        title: "",
        description: "",
        deadline: "",
        submissionType: "Individual",
        attachments: [],
        isGraded: false,
        maxMarks: "",
        weightage: "",
      });
    }
  }, [isEditMode, editCourseId, coursesData]);

  const handleInputChange = (field, value) => {
    setSubmissionData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(""); // Clear error when user starts typing
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (isEditMode) {
        console.log("Updating submission:", editSubmissionId, submissionData);
        // Here you would make an API call to update the submission
      } else {
        console.log("Creating new submission:", submissionData);
        // Here you would make an API call to create a new submission
      }

      handleClose();
    } catch (error) {
      setError(
        isEditMode
          ? "Failed to update submission"
          : "Failed to create submission",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form data
    setSubmissionData({
      title: "",
      description: "",
      deadline: "",
      submissionType: "Individual", // Reset to default
      attachments: [],
      isGraded: false,
      maxMarks: "",
      weightage: "",
    });
    setError("");
    setIsLoading(false);
    onClose();
  };

  const handleAttachmentUpload = (files) => {
    // Handle file uploads - for now just log
    console.log("Files uploaded:", files);
    setSubmissionData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...Array.from(files)],
    }));
  };

  const handleRemoveAttachment = (index) => {
    setSubmissionData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  return (
    <CohortCoursesCreateUI
      isOpen={isOpen}
      onClose={handleClose}
      submissionData={submissionData}
      onInputChange={handleInputChange}
      onSave={handleSave}
      error={error}
      isLoading={isLoading}
      user_type={user_type}
      cohortId={cohortId}
      onAttachmentUpload={handleAttachmentUpload}
      onRemoveAttachment={handleRemoveAttachment}
      isEditMode={isEditMode}
    />
  );
};

export default CohortCoursesCreateController;
