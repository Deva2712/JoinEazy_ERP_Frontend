// src/pages/Cohort/CohortAttendance/CohortAttendanceController.jsx

import React, { useState, useEffect, useMemo } from "react";
import { attendanceService } from "../../../api/services/attendance.service";
import { sessionService } from "../../../api/services/session.service";
import { exportAttendanceCSV } from "../../../utils/reportHelpers";
import ProfessorCohortAttendanceUI from "./ProfessorCohortAttendaceUI";

const CohortAttendanceController = ({ cohortId, cohortData }) => {
	const [attendanceData, setAttendanceData] = useState({
		students: [],
		logs: {},
	});
	const [schedule, setSchedule] = useState([]);
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split("T")[0],
	);
	const [loading, setLoading] = useState(true);
	const [showReport, setShowReport] = useState(false);
	const [draftData, setDraftData] = useState(null);

	const [selectedSection, setSelectedSection] = useState(
		cohortData?.sections?.[0]?.section_name || "",
	);
	const [currentCourseCode, setCurrentCourseCode] = useState("");

	const startDate = cohortData?.start_date;

	useEffect(() => {
		if (cohortData?.sections?.length > 0 && !selectedSection) {
			setSelectedSection(cohortData.sections[0].section_name);
		}
	}, [cohortData, selectedSection]);

	useEffect(() => {
		if (cohortData?.sections && selectedSection) {
			const sectionData = cohortData.sections.find(
				(s) => s.section_name === selectedSection,
			);
			setCurrentCourseCode(
				sectionData?.course_code ||
					cohortData.course_codes?.[0] ||
					"N/A",
			);
		}
	}, [selectedSection, cohortData]);

	// 1. Fetch persistent data only when the Cohort changes
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const [attendanceRes, scheduleRes] = await Promise.all([
					attendanceService.getAttendanceLogs(cohortId),
					sessionService.getSchedules(),
				]);

				if (
					attendanceRes.status === "success" ||
					attendanceRes.success
				) {
					setAttendanceData(attendanceRes.data);
				}
				if (scheduleRes.success || scheduleRes.status === "success") {
					setSchedule(scheduleRes.data || []);
				}
			} catch (error) {
				console.error("Failed to sync attendance data:", error);
			} finally {
				setLoading(false);
			}
		};

		if (cohortId) fetchData();
	}, [cohortId]);

	useEffect(() => {
		if (!attendanceData.logs || !selectedSection || !cohortId) return;

		const sectionLogs = attendanceData.logs[selectedSection] || {};
		const draftKey = `attendance_draft_${cohortId}_${selectedSection}_${selectedDate}`;

		if (!sectionLogs[selectedDate]) {
			const savedDraft = localStorage.getItem(draftKey);

			if (savedDraft) {
				try {
					setDraftData(JSON.parse(savedDraft));
				} catch (e) {
					console.error("Failed to parse local draft:", e);
					setDraftData(null);
				}
			} else {
				setDraftData(null);
			}
		} else {
			setDraftData(null);
		}
	}, [selectedSection, attendanceData.logs, cohortId, selectedDate]);

	const getCustomMarkers = () => {
		const markers = [];
		const loggedDates = new Set();

		// 1. Identify Logged Dates (Blue)
		if (selectedSection !== "All") {
			const sectionLog = attendanceData.logs[selectedSection] || {};
			Object.keys(sectionLog).forEach((date) => loggedDates.add(date));
		} else {
			Object.values(attendanceData.logs).forEach((sectionLog) => {
				Object.keys(sectionLog).forEach((date) =>
					loggedDates.add(date),
				);
			});
		}

		loggedDates.forEach((date) => {
			markers.push({
				date,
				className:
					"bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100",
				dotColor: "bg-blue-400",
			});
		});

		// 2. Identify Scheduled Days (Gray) based on Section
		const activeCourseSchedule = schedule.find((item) =>
			item.courseCodes?.includes(currentCourseCode),
		);

		const allPotentialDates = getDateRange();

		if (activeCourseSchedule && startDate) {
			const relevantScheduleEntries =
				activeCourseSchedule.schedule.filter(
					(entry) =>
						selectedSection === "All" ||
						entry.batchSection === selectedSection,
				);

			const scheduledDays = new Set(
				relevantScheduleEntries.map((s) => s.day),
			);

			allPotentialDates.forEach((dateStr) => {
				const dateObj = new Date(dateStr);
				const dayName = dateObj.toLocaleDateString("en-US", {
					weekday: "long",
				});

				// Check for Drafts (Orange) - takes priority over scheduled gray markers
				const draftKey = `attendance_draft_${cohortId}_${selectedSection}_${dateStr}`;
				const hasDraft = localStorage.getItem(draftKey);

				if (
					hasDraft &&
					!loggedDates.has(dateStr) &&
					selectedSection !== "All"
				) {
					markers.push({
						date: dateStr,
						className:
							"bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100",
						dotColor: "bg-orange-500",
					});
				}
				// Regular Scheduled Days (Gray)
				else if (
					scheduledDays.has(dayName) &&
					!loggedDates.has(dateStr)
				) {
					markers.push({
						date: dateStr,
						className: "bg-gray-100 dark:bg-gray-800 text-gray-500",
					});
				}
			});
		}

		return markers;
	};

	const getDateRange = () => {
		if (!startDate) return [];
		const dates = [];
		const current = new Date(startDate);
		const today = new Date();
		today.setHours(23, 59, 59, 999);

		while (current <= today) {
			if (current.getDay() !== 0) {
				// Formats date as YYYY-MM-DD based on local time
				dates.push(current.toLocaleDateString("en-CA"));
			}
			current.setDate(current.getDate() + 1);
		}
		return dates.reverse();
	};

	const reportData = useMemo(() => {
		const { students, logs } = attendanceData;
		const allDates = getDateRange();

		return students.map((student) => {
			const dailyStatus = {};
			let daysPresent = 0;
			let totalLoggedDays = 0;

			const studentSectionLogs = logs[student.section] || {};

			allDates.forEach((date) => {
				let logEntry = studentSectionLogs[date];

				if (
					date === selectedDate &&
					draftData &&
					!logEntry &&
					student.section === selectedSection
				) {
					logEntry = draftData.presentIds;
				}

				if (logEntry) {
					totalLoggedDays++;
					const isPresent = logEntry.includes(student.id);
					dailyStatus[date] = isPresent;
					if (isPresent) daysPresent++;
				} else {
					dailyStatus[date] = null;
				}
			});

			return {
				...student,
				dailyStatus,
				daysPresent,
				totalLoggedDays,
				percentage:
					totalLoggedDays > 0
						? ((daysPresent / totalLoggedDays) * 100).toFixed(1)
						: 0,
			};
		});
	}, [attendanceData, startDate, draftData, selectedSection, selectedDate]);

	const isDayScheduled = (dateStr) => {
		const dateObj = new Date(dateStr);
		const dayName = dateObj.toLocaleDateString("en-US", {
			weekday: "long",
		});

		const activeCourseSchedule = schedule.find((item) =>
			item.courseCodes?.includes(currentCourseCode),
		);

		if (!activeCourseSchedule) return false;

		return activeCourseSchedule.schedule.some(
			(entry) =>
				(selectedSection === "All" ||
					entry.batchSection === selectedSection) &&
				entry.day === dayName,
		);
	};

	const getStatusMessage = () => {
		const dateObj = new Date(selectedDate);
		const isSunday = dateObj.getDay() === 0;
		const today = new Date();
		today.setHours(23, 59, 59, 999);

		const weekAgo = new Date();
		weekAgo.setDate(today.getDate() - 6);
		weekAgo.setHours(0, 0, 0, 0);

		const isWithinMarkingWindow = dateObj >= weekAgo && dateObj <= today;

		let hasLog = false;
		if (selectedSection === "All") {
			hasLog = Object.values(attendanceData.logs).some(
				(sec) => sec[selectedDate]?.length > 0,
			);
		} else {
			hasLog = !!attendanceData.logs[selectedSection]?.[selectedDate];
		}

		if (isSunday) return "Sunday is a weekly leave day.";
		if (!hasLog && !isDayScheduled(selectedDate)) {
			return "No classes are scheduled for this day.";
		}
		if (draftData && selectedSection !== "All")
			return "You have an unsubmitted draft for this date.";

		// Logic to allow marking for the last 7 days
		if (!hasLog && isWithinMarkingWindow)
			return "Attendance has not been marked for this day yet.";

		if (!hasLog) return "No attendance log was found for this date.";
		return null;
	};

	const uiConfig = {
		loading,
		showReport,
		setShowReport,
		statusMessage: getStatusMessage(),
		customMarkers: getCustomMarkers(),
		onExport: () =>
			exportAttendanceCSV(reportData, getDateRange(), selectedSection),
		isDraft: !!(draftData && selectedSection !== "All"),
		selectedSection,
		onSectionChange: setSelectedSection,
		currentCourseCode,
		selectedDate,
	};

	return (
		<ProfessorCohortAttendanceUI
			cohort={cohortData}
			attendanceData={attendanceData}
			selectedDate={selectedDate}
			setSelectedDate={setSelectedDate}
			reportData={reportData}
			dateRange={getDateRange()}
			uiConfig={uiConfig}
			draftData={draftData}
		/>
	);
};

export default CohortAttendanceController;
