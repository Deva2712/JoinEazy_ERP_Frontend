import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CohortCoursesUI from "./CohortCoursesUI";
import CohortCoursesCreateController from "./CohortCoursesCreateController";
import CohortCoursesContentController from "./CohortCoursesContentController";

const CohortCoursesController = ({ cohortId, cohortData }) => {
  const [sortBy, setSortBy] = useState("Latest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [courseShareState, setCourseShareState] = useState({
    text: "Share Page",
    clicked: false,
  });
  const [coursesData, setCoursesData] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [editCourseId, setEditCourseId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Determine user type from cohortData (following existing pattern)
  const user_type = cohortData?.is_admin ? 1 : 0; // 1 for professor, 0 for student

  useEffect(() => {
    // Mock courses data - replace with actual API call
    const mockCourses = [
      {
        id: 1,
        title: "Final Year Project Proposal Submission",
        deadline: "2025-07-15",
        submitted: true,
        status: "closed",
        submissionCount: 78,
        totalSubmissions: 80,
        description:
          "Submit your final year project proposal document outlining objectives, methodology, and expected outcomes.",
        submissionType: "Individual",
        attachments: [{ name: "proposal_template.docx", size: 1024000 }],
      },
      {
        id: 2,
        title: "Course Project Progress Report",
        deadline: "2025-07-20",
        submitted: false,
        status: "open",
        submissionCount: 45,
        totalSubmissions: 80,
        description:
          "Upload the mid-term progress report for your ongoing course project. Include progress made and challenges faced.",
        submissionType: "Group",
        attachments: [],
      },
      {
        id: 3,
        title: "Project Code and Documentation Submission",
        deadline: "2025-07-30",
        submitted: false,
        status: "open",
        submissionCount: 12,
        totalSubmissions: 80,
        description:
          "Submit the final version of your project code along with proper documentation and user manual.",
        submissionType: "Individual",
        attachments: [
          { name: "submission_instructions.pdf", size: 2048576 },
          { name: "code_structure_guidelines.txt", size: 4096 },
        ],
      },
    ];

    setCoursesData(mockCourses);
  }, [cohortId]);

  // Check if URL contains /create or /edit to show modal
  // Check if URL contains /create, /edit, or /courseId to show modals
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const createIndex = pathSegments.indexOf("create");
    const editIndex = pathSegments.findIndex((segment) => segment === "edit");

    // Check for course ID in URL (numeric segment after courses)
    const coursesIndex = pathSegments.indexOf("courses");
    if (
      coursesIndex !== -1 &&
      pathSegments[coursesIndex + 1] &&
      !isNaN(pathSegments[coursesIndex + 1])
    ) {
      const courseId = pathSegments[coursesIndex + 1];
      if (!pathSegments.includes("create") && !pathSegments.includes("edit")) {
        setSelectedCourseId(courseId);
        setIsContentModalOpen(true);
        return;
      }
    }

    if (createIndex !== -1) {
      setIsCreateModalOpen(true);
      setIsEditMode(false);
      setEditCourseId(null);
    } else if (editIndex !== -1 && editIndex > 0) {
      const courseId = pathSegments[editIndex - 1];
      if (courseId && !isNaN(courseId)) {
        setEditCourseId(parseInt(courseId));
        setIsEditMode(true);
        setIsCreateModalOpen(true);
      }
    }
  }, [location.pathname]);

  const handleSortChange = (newSort) => {
    console.log("Sort changed to:", newSort);
    setSortBy(newSort);
    setShowSortDropdown(false);

    // Sort the courses data
    const sorted = [...coursesData].sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return newSort === "Latest" ? dateB - dateA : dateA - dateB;
    });
    setCoursesData(sorted);
  };

  const handleSortDropdownToggle = () => {
    setShowSortDropdown(!showSortDropdown);
  };

  const handleSharePage = async () => {
    try {
      // Generate invitation link from backend
      const response = await cohortAPI.generateInvitationLink(cohortId);
      
      if (response.success) {
        const invitationUrl = response.data.invitationLink;
        
        // Rebuild URL to ensure correct host, using current origin
        let finalUrl = invitationUrl;
        try {
          const parsed = new URL(invitationUrl, window.location.origin);
          let token = parsed.searchParams.get('token');

          if (!token) {
            const match = /[?&]token=([^&]+)/.exec(invitationUrl);
            if (match && match[1]) token = match[1];
          }

          if (token) {
            finalUrl = `${window.location.origin}/c/${cohortId}/join?token=${token}`;
          } else {
            finalUrl = `${window.location.origin}${parsed.pathname}${parsed.search}`;
          }
        } catch (e) {
          if (invitationUrl.startsWith('http')) {
            if (invitationUrl.includes(window.location.hostname)) {
              finalUrl = invitationUrl;
            } else {
              const url = new URL(invitationUrl);
              finalUrl = `${window.location.origin}${url.pathname}${url.search}`;
            }
          } else {
            finalUrl = `${window.location.origin}${invitationUrl}`;
          }
        }
        
        // Copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(finalUrl);
        } else {
          // Fallback method
          const textArea = document.createElement("textarea");
          textArea.value = finalUrl;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand("copy");
          } catch (err) {
            console.error("Failed to copy to clipboard:", err);
          }
          document.body.removeChild(textArea);
        }

        setCourseShareState({
          text: "Copied",
          clicked: true,
        });

        setTimeout(() => {
          setCourseShareState({
            text: "Share Page",
            clicked: false,
          });
        }, 2000);
      } else {
        console.error("Failed to generate invitation link:", response.message);
        alert("Failed to generate share link. Please try again.");
      }
    } catch (error) {
      console.error("Error generating share link:", error);
      alert("Failed to generate share link. Please try again.");
    }
  };

  const handleCreateClick = () => {
    console.log("Create Submission clicked");
    setIsEditMode(false);
    setEditCourseId(null);
    setIsCreateModalOpen(true);
    // Add /create to the current URL
    const currentPath = location.pathname;
    if (!currentPath.includes("/create")) {
      navigate(`${currentPath}/create`, { replace: true });
    }
  };

  const handleCloseCreateModal = () => {
    console.log("Create modal closed");
    setIsCreateModalOpen(false);
    setIsEditMode(false);
    setEditCourseId(null);
    // Remove /create or /edit from URL
    const currentPath = location.pathname;
    if (currentPath.includes("/create")) {
      const newPath = currentPath.replace("/create", "");
      navigate(newPath, { replace: true });
    } else if (currentPath.includes("/edit")) {
      // Remove courseId/edit pattern
      const pathSegments = currentPath.split("/");
      const editIndex = pathSegments.findIndex((segment) => segment === "edit");
      if (editIndex > 0) {
        pathSegments.splice(editIndex - 1, 2); // Remove courseId and edit
        const newPath = pathSegments.join("/");
        navigate(newPath, { replace: true });
      }
    }
  };

  const handleCourseClick = (courseId) => {
    console.log("Course clicked:", courseId);
    console.log("Current path:", location.pathname);

    setSelectedCourseId(courseId);
    setIsContentModalOpen(true);

    const currentPath = location.pathname;
    const courseIdStr = courseId.toString();

    console.log("Checking if path ends with:", `/${courseIdStr}`);
    console.log(
      "Current path ends with courseId:",
      currentPath.endsWith(`/${courseIdStr}`),
    );

    if (!currentPath.endsWith(`/${courseIdStr}`)) {
      const newPath = `${currentPath.replace(/\/$/, "")}/${courseIdStr}`;
      console.log("Navigating to:", newPath);
      navigate(newPath, { replace: true });
    }
  };

  const handleCloseContentModal = () => {
    console.log("Content modal closed");
    setIsContentModalOpen(false);
    setSelectedCourseId(null);
    // Remove courseId from URL
    const currentPath = location.pathname;
    const pathSegments = currentPath.split("/");
    const coursesIndex = pathSegments.indexOf("courses");
    if (
      coursesIndex !== -1 &&
      pathSegments[coursesIndex + 1] &&
      !isNaN(pathSegments[coursesIndex + 1])
    ) {
      pathSegments.splice(coursesIndex + 1, 1);
      const newPath = pathSegments.join("/");
      navigate(newPath, { replace: true });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <CohortCoursesUI
        cohortId={cohortId}
        cohortData={cohortData}
        user_type={user_type}
        sortBy={sortBy}
        showSortDropdown={showSortDropdown}
        courseShareState={courseShareState}
        coursesData={coursesData}
        onSortChange={handleSortChange}
        onSortDropdownToggle={handleSortDropdownToggle}
        onSharePage={handleSharePage}
        onCreateClick={handleCreateClick}
        onCourseClick={handleCourseClick}
      />
      <CohortCoursesCreateController
        cohortId={cohortId}
        cohortData={cohortData}
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        isEditMode={isEditMode}
        editCourseId={editCourseId}
        coursesData={coursesData}
      />
      <CohortCoursesContentController
        cohortId={cohortId}
        cohortData={cohortData}
        isOpen={isContentModalOpen}
        onClose={handleCloseContentModal}
        courseId={selectedCourseId}
        coursesData={coursesData}
      />
    </>
  );
};

export default CohortCoursesController;
