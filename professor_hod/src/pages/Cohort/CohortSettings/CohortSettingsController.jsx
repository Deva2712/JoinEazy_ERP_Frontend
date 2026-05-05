import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CohortSettingsUI from "./CohortSettingsUI";
import { courseService } from "../../../api/services/course.service";

// Add validation schema after imports
const cohortSettingsSchema = z.object({
  cohortName: z.string().min(1, "Name cannot be empty"),
  // Allow full URLs for Course URL field
  cohortUrl: z.string().optional().refine((val) => {
    if (!val || val.trim() === "") return true;
    try {
      // Accept http(s) URLs
      const u = new URL(val.trim());
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }, "Please enter a valid URL (http/https)"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const CohortSettingsController = ({ isOpen, onClose, cohortData }) => {
  const [settings, setSettings] = useState({
    cohortName: cohortData?.name || cohortData?.title || "",
    cohortUrl: cohortData?.external_url || "",
    startDate: cohortData?.start_date ? cohortData.start_date.split('T')[0] : "",
    endDate: cohortData?.end_date ? cohortData.end_date.split('T')[0] : "",
  });

  // Import Participants state
  const [importParticipantsFile, setImportParticipantsFile] = useState(null);

  // Projects state removed from UI (keep defaults false)
  const [enableProjects] = useState(false);
  const [importProjectsList] = useState(false);

  // Group Settings state - NEW
  const [maxGroupMembers, setMaxGroupMembers] = useState(
    cohortData?.max_groups_members || 4
  );
  const [minGroupMembers, setMinGroupMembers] = useState(
    cohortData?.min_groups_members || 1
  );
  
  // Course Member Limit state - NEW
  const [maxCourseMembers, setMaxCourseMembers] = useState(
    cohortData?.max_course_members || 1400
  );

  const [saveError, setSaveError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [detailsSectionCards, setDetailsSectionCards] = useState([]);

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(cohortSettingsSchema),
    defaultValues: settings,
    mode: "onBlur",
  });

  // Keep form values in sync when the modal opens with fresh cohort data
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        cohortName: cohortData?.name || cohortData?.title || "",
        cohortUrl: cohortData?.external_url || "",
        startDate: cohortData?.start_date ? cohortData.start_date.split('T')[0] : "",
        endDate: cohortData?.end_date ? cohortData.end_date.split('T')[0] : "",
      });
    }
  }, [isOpen, cohortData]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = async (formData) => {
    try {
      setSaveError(null);
      
      // Prepare the data for the API
      const updateData = {
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        cohort_name: formData.cohortName,
        external_url: formData.cohortUrl || null,
        // projects disabled
        max_groups_members: maxGroupMembers, // Add max group members
        min_groups_members: minGroupMembers,
        max_course_members: maxCourseMembers, // Add max course members
      };
      
      // Temporarily disable saving external URL until DB migration is applied
      
      console.log("Updating cohort with data:", updateData);
      
      // Make the API call to update the cohort
      const response = await courseService.updateCourse(cohortData.id, updateData);
      
      console.log("Cohort update response:", response);
      
      if (response.success) {
        console.log("Cohort updated successfully");
        
        // If there's a participant file to upload, process it now
        if (importParticipantsFile) {
          try {
            console.log("Uploading participants file:", importParticipantsFile.name);
            const participantResponse = await courseService.uploadParticipants(cohortData.id, importParticipantsFile);
            
            if (participantResponse.success) {
              const result = participantResponse.data;
              console.log("Participants imported successfully:", result);
              const msg = result?.data?.message || result?.message || 'Participants imported successfully';
              alert(`Success! Course updated and ${msg}`);
            } else {
              console.error("Failed to import participants:", participantResponse.message);
              alert(`Course updated successfully, but failed to import participants: ${participantResponse.message}`);
            }
          } catch (error) {
            console.error("Error importing participants:", error);
            alert("Course updated successfully, but there was an error importing participants.");
          }
          
          // Clear the file after processing
          setImportParticipantsFile(null);
        } else {
          alert("Course updated successfully!");
        }
        
        setSaveError(null);
        onClose();
      } else {
        console.error("Cohort update failed:", response.error);
        // Soften external_url DB error for now
        if (/external_url/.test(response.error || "")) {
          // Still persist locally for immediate UX
          try {
            const urlVal = formData.cohortUrl?.trim();
            if (urlVal) {
              window.localStorage.setItem(`cohort:${cohortData.id}:external_url`, urlVal);
            } else {
              window.localStorage.removeItem(`cohort:${cohortData.id}:external_url`);
            }
          } catch (_) {}
          setSaveError("");
          onClose();
        } else {
          setSaveError(response.error || "Failed to update cohort settings");
        }
      }
    } catch (error) {
      console.error("Error updating cohort:", error);
      setSaveError("An unexpected error occurred");
    }
  };

  const handleCardReorder = (dragIndex, hoverIndex) => {
    const dragCard = detailsSectionCards[dragIndex];
    const newCards = [...detailsSectionCards];
    newCards.splice(dragIndex, 1);
    newCards.splice(hoverIndex, 0, dragCard);
    setDetailsSectionCards(newCards);
  };

  const handleCardDelete = (cardId) => {
    setDetailsSectionCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, isDeleted: true } : card,
      ),
    );
  };

  const handleDeleteCourse = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      console.log("Deleting course with ID:", cohortData.id);
      
      // Make the API call to delete the course
      const response = await courseService.deleteCourse(cohortData.id);
      
      console.log("Course deletion response:", response);
      
      if (response.success) {
        console.log("Course deleted successfully");
        // Redirect to dashboard after successful deletion
        window.location.href = "/dashboard";
      } else {
        console.error("Course deletion failed:", response.error);
        setDeleteError(response.error || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      setDeleteError("An unexpected error occurred while deleting the course");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setDeleteError(null);
  };

  const handleImportParticipants = () => {
    // Create file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls,.csv";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImportParticipantsFile(file);
        // Show preview message instead of uploading immediately
        alert(`File "${file.name}" selected. Click "Save Changes" to import participants.`);
      }
    };
    input.click();
  };

  // Project handlers removed

  if (!isOpen) return null;

  return (
    <CohortSettingsUI
      isOpen={isOpen}
      onClose={onClose}
      onOverlayClick={handleOverlayClick}
      form={form}
      onSave={handleSave}
      cohortData={cohortData}
      saveError={saveError}
      detailsSectionCards={detailsSectionCards}
      onCardReorder={handleCardReorder}
      onCardDelete={handleCardDelete}
      onImportParticipants={handleImportParticipants}
      importParticipantsFile={importParticipantsFile}
      // Add new props for group settings
      maxGroupMembers={maxGroupMembers}
      onMaxGroupMembersChange={setMaxGroupMembers}
      minGroupMembers={minGroupMembers}
      onMinGroupMembersChange={setMinGroupMembers}
      // Add course member limit props
      maxCourseMembers={maxCourseMembers}
      onMaxCourseMembersChange={setMaxCourseMembers}
      // Add delete props
      deleteError={deleteError}
      isDeleting={isDeleting}
      showDeleteConfirmation={showDeleteConfirmation}
      onDeleteClick={handleDeleteClick}
      onDeleteConfirm={handleDeleteCourse}
      onDeleteCancel={handleDeleteCancel}
    />
  );
};

export default CohortSettingsController;