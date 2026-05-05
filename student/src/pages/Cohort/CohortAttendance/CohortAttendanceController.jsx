// src/pages/Cohort/CohortAttendance/CohortAttendanceController.jsx

import React, { useState, useEffect, useMemo } from "react";
import { attendanceService } from "../../../api/services/attendance.service";
import { sessionService } from "../../../api/services/session.service";
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
	const todayStr = new Date().toISOString().split("T")[0];

	// Ensure selectedSection is set once cohortData loads
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

	// 2. Handle Draft data separately when Section changes
	useEffect(() => {
		if (!attendanceData.logs || !selectedSection) return;

		const sectionLogs = attendanceData.logs[selectedSection] || {};
		const todayStr = new Date().toISOString().split("T")[0];

		if (!sectionLogs[todayStr]) {
			const draftKey = `attendance_draft_${cohortId}_${selectedSection}`;
			const savedDraft = localStorage.getItem(draftKey);
			setDraftData(savedDraft ? JSON.parse(savedDraft) : null);
		} else {
			setDraftData(null);
		}
	}, [selectedSection, attendanceData.logs, cohortId]);

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

		if (activeCourseSchedule && startDate) {
			// Filter schedule entries by selected section name
			const relevantScheduleEntries =
				activeCourseSchedule.schedule.filter(
					(entry) =>
						selectedSection === "All" ||
						entry.batchSection === selectedSection,
				);

			const scheduledDays = new Set(
				relevantScheduleEntries.map((s) => s.day),
			);
			const allPotentialDates = getDateRange();

			allPotentialDates.forEach((dateStr) => {
				const dateObj = new Date(dateStr);
				const dayName = dateObj.toLocaleDateString("en-US", {
					weekday: "long",
				});

				if (scheduledDays.has(dayName) && !loggedDates.has(dateStr)) {
					markers.push({
						date: dateStr,
						className: "bg-gray-100 dark:bg-gray-800 text-gray-500",
					});
				}
			});
		}

		// 3. Draft Marker (Orange)
		if (draftData && selectedSection !== "All") {
			const sectionLogs = attendanceData.logs[selectedSection] || {};
			if (!sectionLogs[todayStr]) {
				markers.push({
					date: todayStr,
					className:
						"bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100",
					dotColor: "bg-orange-500",
				});
			}
		}
		return markers;
	};

	const getDateRange = () => {
		if (!startDate) return [];
		const dates = [];
		let current = new Date(startDate);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		while (current <= today) {
			if (current.getDay() !== 0)
				dates.push(current.toISOString().split("T")[0]);
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
					date === todayStr &&
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
	}, [attendanceData, startDate, draftData, todayStr, selectedSection]);

	const handleExportCSV = () => {
		const allDates = getDateRange().reverse();
		const headers = [
			"Roll Number",
			"Name",
			"Section",
			...allDates,
			"Total Present",
			"Percentage",
		].join(",");
		const rows = reportData
			.filter(
				(s) =>
					selectedSection === "All" || s.section === selectedSection,
			)
			.map((s) => {
				const dailyRow = allDates.map((date) => {
					if (s.dailyStatus[date] === true) return "P";
					if (s.dailyStatus[date] === false) return "A";
					return "-";
				});
				return [
					s.rollNumber,
					s.name,
					s.section,
					...dailyRow,
					s.daysPresent,
					`${s.percentage}%`,
				].join(",");
			});
		const csvContent =
			"data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
		const link = document.createElement("a");
		link.setAttribute("href", encodeURI(csvContent));
		link.setAttribute(
			"download",
			`Attendance_Report_${selectedSection}.csv`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Helper to check if a specific date is in the schedule
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
		if (selectedDate === todayStr && draftData && selectedSection !== "All")
			return "You have an unsubmitted draft for today.";
		// Only show pending entry if it IS a scheduled day
		if (selectedDate === todayStr && !hasLog)
			return "Attendance has not been marked for today yet.";
		if (!hasLog) return "No attendance log was found for this date.";
		return null;
	};

	const uiConfig = {
		loading,
		showReport,
		setShowReport,
		statusMessage: getStatusMessage(),
		customMarkers: getCustomMarkers(),
		onExport: handleExportCSV,
		isDraft: !!(
			selectedDate === todayStr &&
			draftData &&
			selectedSection !== "All"
		),
		selectedSection,
		onSectionChange: setSelectedSection,
		currentCourseCode,
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
