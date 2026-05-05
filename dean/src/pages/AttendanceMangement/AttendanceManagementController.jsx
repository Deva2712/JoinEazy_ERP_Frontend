// src/pages/AttendanceMangement/AttendanceManagementController.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { attendanceService } from "../../api/services/attendance.service";
import { leaveService } from "../../api/services/leave.service";
import { userService } from "../../api/services/user.service";
import { sessionService } from "../../api/services/session.service";
import AttendanceManagementUI from "./AttendanceManagementUI";

const AttendanceManagementController = () => {
	const navigate = useNavigate();
	const { courseId } = useParams();
	const location = useLocation();

	// Core State
	const [activeCourses, setActiveCourses] = useState([]);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Attendance State
	const [students, setStudents] = useState([]);
	const [presentIds, setPresentIds] = useState([]);
	const [absentIds, setAbsentIds] = useState([]);
	const [markingLoading, setMarkingLoading] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState(null);

	// UI Modals & Navigation
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [isSaveSuccessOpen, setIsSaveSuccessOpen] = useState(false);
	const [isSubmitSuccessOpen, setIsSubmitSuccessOpen] = useState(false);
	const [viewMode, setViewMode] = useState("management");

	// QR & Session State
	const [qrToken, setQrToken] = useState("");
	const [qrTimeout, setQrTimeout] = useState(60);
	const [timeLeft, setTimeLeft] = useState(60);
	const [profLogs, setProfLogs] = useState([]);
	const [leaveApplications, setLeaveApplications] = useState([]);
	const [schedules, setSchedules] = useState([]);
	const [selectedSection, setSelectedSection] = useState("");
	const [currentCourseCode, setCurrentCourseCode] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const encodeBase64 = (str) => {
		const bytes = new TextEncoder().encode(str);
		let binary = "";
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	};

	/**
	 * Fetches initial dashboard and scheduling data
	 */
	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			const [courseRes, logsRes, leaveRes, scheduleRes] =
				await Promise.all([
					userService.getDashboardOverview(),
					attendanceService.getProfessorLogs(),
					leaveService.getApplications(),
					sessionService.getSchedules(),
				]);

			if (courseRes.status === "success" || courseRes.success) {
				const courses = courseRes.data.createdCohorts || [];
				setActiveCourses(
					courses.map((c) => ({
						id: c.id,
						cohort_name: c.cohort_name || "Untitled Course",
						course_codes: c.course_codes || ["N/A"],
						member_count: c.member_count || 0,
						sections: (c.sections || []).map((sec) => ({
							name: sec.section_name || sec.name,
							code: sec.course_code || sec.code,
							department: sec.department,
						})),
					})),
				);
			}

			if (logsRes.status === "success" || logsRes.success)
				setProfLogs(logsRes.data);
			if (leaveRes?.data?.applications)
				setLeaveApplications(leaveRes.data.applications);
			if (scheduleRes.status === "success" || scheduleRes.success)
				setSchedules(scheduleRes.data || []);
		} catch (err) {
			setError("Failed to load attendance records.");
		} finally {
			setLoading(false);
		}
	};

	// Initialize Page
	useEffect(() => {
		fetchData();
		document.title = "Attendance Management";
	}, []);

	// URL-based view routing
	useEffect(() => {
		if (location.pathname.includes("/logs")) {
			setViewMode("prof-attendance");
			setSelectedCourse(null);
		} else if (courseId) {
			const found = activeCourses.find(
				(c) => c.id.toString() === courseId,
			);
			if (found) {
				setSelectedCourse(found);
				setViewMode(
					location.pathname.endsWith("/qr")
						? "qr-view"
						: "management",
				);
			}
		} else {
			setSelectedCourse(null);
			setSelectedSection("");
			setViewMode("management");
		}
	}, [courseId, activeCourses, location.pathname]);

	// Course code synchronization
	useEffect(() => {
		if (selectedCourse && selectedSection) {
			const sectionData = selectedCourse.sections?.find(
				(s) => s.name === selectedSection,
			);
			setCurrentCourseCode(
				sectionData?.code || selectedCourse.course_codes?.[0] || "N/A",
			);
		}
	}, [selectedSection, selectedCourse]);

	/**
	 * Auto-save draft functionality
	 */
	useEffect(() => {
		if (markingLoading || loading || hasSubmitted) return;
		if (presentIds.length === 0 && absentIds.length === 0) return;

		if (selectedCourse && selectedSection) {
			const draft = {
				presentIds,
				absentIds,
				lastUpdated: new Date().toISOString(),
			};
			localStorage.setItem(
				`attendance_draft_${selectedCourse.id}_${selectedSection}`,
				JSON.stringify(draft),
			);
		}
	}, [
		presentIds,
		absentIds,
		markingLoading,
		loading,
		selectedCourse,
		selectedSection,
		hasSubmitted,
	]);

	const isCourseScheduledToday = useCallback(
		(course) => {
			if (!schedules.length) return true;
			const today = new Date().toLocaleDateString("en-US", {
				weekday: "long",
			});
			return schedules
				.filter((s) =>
					s.courseCodes?.some((code) =>
						course.course_codes?.includes(code),
					),
				)
				.some((s) =>
					s.schedule.some(
						(entry) =>
							entry.day === today &&
							course.sections?.some(
								(sec) => sec.name === entry.batchSection,
							),
					),
				);
		},
		[schedules],
	);

	const isSectionScheduledToday = useCallback(
		(sectionName) => {
			if (!schedules.length) return true;
			const today = new Date().toLocaleDateString("en-US", {
				weekday: "long",
			});
			const targetCode =
				selectedCourse?.sections?.find((s) => s.name === sectionName)
					?.code || currentCourseCode;
			const courseSchedule = schedules.find((s) =>
				s.courseCodes?.includes(targetCode),
			);
			return (
				courseSchedule?.schedule.some(
					(entry) =>
						entry.day === today &&
						entry.batchSection === sectionName,
				) ?? false
			);
		},
		[schedules, selectedCourse, currentCourseCode],
	);

	const filteredStudents = useMemo(() => {
		if (!selectedSection) return [];
		return students.filter((student) => {
			const query = searchQuery.toLowerCase();
			return (
				(student.name.toLowerCase().includes(query) ||
					student.rollNumber.toLowerCase().includes(query)) &&
				student.section === selectedSection
			);
		});
	}, [students, searchQuery, selectedSection]);

	/**
	 * Fetch students and apply existing drafts
	 */
	useEffect(() => {
		if (!selectedCourse || !selectedSection) return;

		const fetchStudents = async () => {
			setMarkingLoading(true);
			try {
				const response =
					await attendanceService.getAttendanceLogs(courseId);
				if (response.status === "success") {
					const { students: studentList, logs } = response.data;
					const today = new Date().toLocaleDateString("en-CA");
					setStudents(studentList || []);

					const draftKey = `attendance_draft_${courseId}_${selectedSection}`;
					const savedDraft = localStorage.getItem(draftKey);

					if (savedDraft) {
						const parsed = JSON.parse(savedDraft);
						setPresentIds((parsed.presentIds || []).map(Number));
						setAbsentIds((parsed.absentIds || []).map(Number));
					} else {
						const logsForToday =
							logs?.[selectedSection]?.[today] || [];
						setPresentIds(logsForToday.map(Number));
						setAbsentIds([]);
					}
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setMarkingLoading(false);
			}
		};
		fetchStudents();
	}, [courseId, selectedSection, selectedCourse]);

	const handleSaveAttendance = async () => {
		if (!selectedCourse || !selectedSection || hasSubmitted) return;
		setSubmitLoading(true);
		setSubmitError(null);
		setIsConfirmModalOpen(false);

		try {
			const response = await attendanceService.markAttendance(
				selectedCourse.id,
				{
					studentIds: presentIds,
					date: new Date().toLocaleDateString("en-CA"),
					status: "final",
					section: selectedSection,
					courseCode: currentCourseCode,
				},
			);

			if (response.status === "success" || response.success) {
				setHasSubmitted(true);
				setQrToken("");
				setTimeLeft(0);
				localStorage.removeItem(
					`attendance_draft_${selectedCourse.id}_${selectedSection}`,
				);
				setIsSubmitSuccessOpen(true);
			} else {
				throw new Error(
					response.message || "Failed to finalize attendance",
				);
			}
		} catch (err) {
			setSubmitError("Submission failed. Please try again.");
		} finally {
			setSubmitLoading(false);
		}
	};

	const generateNewQR = useCallback(() => {
		if (!selectedCourse || !selectedSection || hasSubmitted) return;
		const payload = JSON.stringify({
			cid: selectedCourse.id,
			ts: Date.now(),
			exp: qrTimeout,
			sec: selectedSection,
			code: currentCourseCode,
		});
		setQrToken(encodeBase64(payload));
		setTimeLeft(qrTimeout);
	}, [
		selectedCourse,
		hasSubmitted,
		qrTimeout,
		selectedSection,
		currentCourseCode,
	]);

	// QR Timer logic
	useEffect(() => {
		let timer;
		if (qrToken && timeLeft > 0) {
			timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
		} else if (timeLeft === 0 && qrToken) {
			const currentMarkedIds = [...presentIds, ...absentIds];
			const remainingIds = filteredStudents
				.map((s) => s.id)
				.filter((id) => !currentMarkedIds.includes(id));
			if (remainingIds.length > 0)
				setAbsentIds((prev) => [
					...new Set([...prev, ...remainingIds]),
				]);
			setQrToken("");
			if (viewMode === "qr-view")
				navigate(`/attendance-management/${courseId}`);
		}
		return () => clearInterval(timer);
	}, [
		qrToken,
		timeLeft,
		filteredStudents,
		presentIds,
		absentIds,
		viewMode,
		navigate,
		courseId,
	]);

	useEffect(() => {
		if (
			viewMode === "qr-view" &&
			!qrToken &&
			!hasSubmitted &&
			timeLeft > 0 &&
			selectedSection
		) {
			generateNewQR();
		}
	}, [
		viewMode,
		qrToken,
		hasSubmitted,
		generateNewQR,
		timeLeft,
		selectedSection,
	]);

	// View Data Package
	const attendanceData = {
		courses: activeCourses,
		filteredStudents,
		sections: selectedCourse?.sections || [],
		selectedSection,
		currentCourseCode,
		students,
		presentIds,
		absentIds,
		profLogs,
		leaveApplications,
		qr: { token: qrToken, timeLeft, qrTimeout },
	};

	// View State Package
	const viewState = {
		loading,
		error,
		markingLoading,
		submitLoading,
		hasSubmitted,
		submitError,
		viewMode,
		selectedCourse,
		isConfirmModalOpen,
		isSaveSuccessOpen,
		isSubmitSuccessOpen,
		searchQuery,
		isCourseScheduledToday,
	};

	// Actions Package
	const actions = {
		onSelectCourse: (course) =>
			navigate(
				course
					? `/attendance-management/${course.id}`
					: "/attendance-management",
			),
		onRefresh: fetchData,
		onGenerateQR: generateNewQR,
		onMarkPresent: (id) => {
			if (hasSubmitted) return;
			setAbsentIds((prev) => prev.filter((sid) => sid !== id));
			setPresentIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
		},
		onMarkAbsent: (id) => {
			if (hasSubmitted) return;
			setPresentIds((prev) => prev.filter((sid) => sid !== id));
			setAbsentIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
		},
		onMarkAll: (status) => {
			if (hasSubmitted) return;
			const allIds = filteredStudents.map((s) => s.id);
			if (status === "present") {
				setPresentIds(allIds);
				setAbsentIds([]);
			} else if (status === "absent") {
				setAbsentIds(allIds);
				setPresentIds([]);
			}
		},
		setQrTimeout,
		onSaveDraft: () => {
			if (!selectedCourse || !selectedSection || hasSubmitted) return;
			localStorage.setItem(
				`attendance_draft_${selectedCourse.id}_${selectedSection}`,
				JSON.stringify({
					presentIds,
					absentIds,
					expiresAt: new Date(Date.now() + 172800000).toISOString(),
				}),
			);
			setIsSaveSuccessOpen(true);
		},
		onSaveClick: () => setIsConfirmModalOpen(true),
		onConfirmSave: handleSaveAttendance,
		setConfirmModal: setIsConfirmModalOpen,
		setSaveSuccessModal: setIsSaveSuccessOpen,
		setSubmitSuccessModal: setIsSubmitSuccessOpen,
		switchToLogs: () => navigate("/attendance-management/logs"),
		switchToManagement: () => {
			setSelectedCourse(null);
			navigate("/attendance-management");
		},
		openQRView: () =>
			selectedSection &&
			navigate(`/attendance-management/${courseId}/qr`),
		closeQRView: () => navigate(`/attendance-management/${courseId}`),
		onSectionChange: setSelectedSection,
		setSearchQuery,
		isSectionScheduledToday,
	};

	return (
		<AttendanceManagementUI
			data={attendanceData}
			view={viewState}
			actions={actions}
		/>
	);
};

export default AttendanceManagementController;
