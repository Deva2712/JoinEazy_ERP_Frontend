// src/pages/AttendanceMangement/AttendanceManagementController.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAttendance } from "../../context/AttendanceContext";
import AttendanceManagementUI from "./AttendanceManagementUI";

const AttendanceManagementController = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { courseId, tab } = useParams();

	const {
		state,
		actions,
		filteredStudents,
		isCourseScheduledToday,
		isSectionScheduledOnDate,
	} = useAttendance();
	const { selectedCourse, selectedSection, selectedDate } = state;

	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [isSaveSuccessOpen, setIsSaveSuccessOpen] = useState(false);
	const [isSubmitSuccessOpen, setIsSubmitSuccessOpen] = useState(false);

	// Sync date from navigation state or set default
	useEffect(() => {
		const passedDate = location.state?.date;
		const today = new Date().toLocaleDateString("en-CA");

		if (passedDate && passedDate !== state.selectedDate) {
			actions.setSelectedDate(passedDate);
		} else if (!state.selectedDate) {
			actions.setSelectedDate(today);
		}
	}, [location.state?.date, state.selectedDate]);

	// Initial data fetch
	useEffect(() => {
		actions.fetchData();
		document.title = "Attendance Management";
	}, []);

	// Sync UI state with URL parameters
	useEffect(() => {
		if (tab === "logs") {
			actions.setViewMode("prof-attendance");
			actions.setSelectedCourse(null);
		} else if (courseId) {
			const found = state.activeCourses.find(
				(c) => c.id.toString() === courseId,
			);
			if (found && state.selectedCourse?.id !== found.id) {
				actions.setSelectedCourse(found);
				actions.setViewMode(tab === "qr" ? "qr-view" : "management");
			}
		} else {
			if (state.selectedCourse !== null) actions.setSelectedCourse(null);
			if (state.selectedSection !== "") actions.setSection("", "");
			actions.setViewMode("management");
		}
	}, [courseId, tab, state.activeCourses, state.selectedCourse]);

	// Handle QR generation and cleanup
	useEffect(() => {
		const isQrView = tab === "qr";

		if (
			isQrView &&
			!state.qr.token &&
			!state.hasSubmitted &&
			state.selectedSection
		) {
			actions.generateNewQR();
		}

		return () => {
			if (isQrView) {
				actions.resetQrSession();
			}
		};
	}, [
		tab,
		state.selectedSection,
		state.hasSubmitted,
		state.qr.token,
	]);

	// Fetch students when selection changes
	useEffect(() => {
  if (selectedCourse?.id && selectedSection && selectedDate) {
    actions.fetchStudentsForSection(
      selectedCourse.id,
      selectedSection,
      selectedDate
    );
  }
}, [selectedCourse?.id, selectedSection, selectedDate]);

	const handleConfirmSave = async () => {
		setIsConfirmModalOpen(false);
		const result = await actions.handleSaveAttendance();
		if (result?.success) setIsSubmitSuccessOpen(true);
	};

	const handleTabChange = (newTab) => {
		if (newTab === "management") {
			navigate("/attendance-management/overview");
		} else if (newTab === "prof-attendance") {
			navigate("/attendance-management/logs");
		}
	};

	return (
		/**
		 * Main UI component for the Attendance Management page
		 */
		<AttendanceManagementUI
			state={state}
			actions={actions}
			filteredStudents={filteredStudents}
			isCourseScheduledToday={isCourseScheduledToday}
			isSectionScheduledOnDate={isSectionScheduledOnDate}
			isConfirmModalOpen={isConfirmModalOpen}
			setIsConfirmModalOpen={setIsConfirmModalOpen}
			isSaveSuccessOpen={isSaveSuccessOpen}
			setIsSaveSuccessOpen={setIsSaveSuccessOpen}
			handleConfirmSave={handleConfirmSave}
			onTabChange={handleTabChange}
			activeTab={tab || (courseId ? "management" : "overview")}
		/>
	);
};

export default AttendanceManagementController;
