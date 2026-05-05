import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CohortCoursesContentUI from "./CohortCoursesContentUI";

const CohortCoursesContentController = ({
  cohortId,
  cohortData,
  isOpen,
  onClose,
  courseId,
  coursesData = [],
}) => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Find course data based on courseId
  useEffect(() => {
    if (courseId && coursesData.length > 0) {
      setLoading(true);
      const course = coursesData.find((c) => c.id === parseInt(courseId));
      if (course) {
        setCourseData(course);
      }
      setLoading(false);
    }
  }, [courseId, coursesData]);

  const handleClose = () => {
    setCourseData(null);
    setLoading(true);
    onClose();
  };

  return (
    <CohortCoursesContentUI
      isOpen={isOpen}
      onClose={handleClose}
      courseData={courseData}
      loading={loading}
      cohortId={cohortId}
      cohortData={cohortData}
    />
  );
};

export default CohortCoursesContentController;
