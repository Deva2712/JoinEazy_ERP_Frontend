// src/context/AttendanceContext.jsx

import React, {
	createContext,
	useContext,
	useReducer,
	useMemo,
	useCallback,
	useEffect,
} from "react";
import { attendanceService } from "../api/services/attendance.service";
import { leaveService } from "../api/services/leave.service";
import { userService } from "../api/services/user.service";
import { sessionService } from "../api/services/session.service";

const AttendanceContext = createContext();

const initialState = {
	loading: true,
	error: null,
	activeCourses: [],
	profLogs: [],
	leaveApplications: [],
	schedules: [],
	students: [],
	selectedCourse: null,
	selectedSection: "",
	selectedDate: new Date().toLocaleDateString("en-CA"),
	currentCourseCode: "",
	presentIds: [],
	absentIds: [],
	searchQuery: "",
	markingLoading: false,
	submitLoading: false,
	hasSubmitted: false,
	submitError: null,
	viewMode: "management",
	qr: {
		token: "",
		timeLeft: 60,
		qrTimeout: 60,
	},
};

function reducer(state, action) {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "SET_MARKING_LOADING":
			return { ...state, markingLoading: action.payload };
		case "SET_SUBMIT_LOADING":
			return { ...state, submitLoading: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload, loading: false };
		case "SET_SUBMIT_ERROR":
			return {
				...state,
				submitError: action.payload,
				submitLoading: false,
			};
		case "INITIALIZE_DATA":
			return {
				...state,
				activeCourses: action.payload.courses,
				profLogs: action.payload.logs,
				leaveApplications: action.payload.leaves,
				schedules: action.payload.schedules,
				loading: false,
			};
		case "SET_SELECTED_COURSE":
			return {
				...state,
				selectedCourse: action.payload,
				hasSubmitted: false,
				presentIds: [],
				absentIds: [],
			};
		case "SET_SECTION":
			return {
				...state,
				selectedSection: action.payload.section,
				currentCourseCode: action.payload.courseCode,
				hasSubmitted: false,
			};
		case "SET_STUDENTS_AND_LOGS":
			return {
				...state,
				students: action.payload.students,
				presentIds: action.payload.presentIds,
				absentIds: action.payload.absentIds,
				markingLoading: false,
			};
		case "SET_SELECTED_DATE":
			return {
				...state,
				selectedDate: action.payload,
				hasSubmitted: false,
			};
		case "MARK_PRESENT":
			if (state.hasSubmitted) return state;
			return {
				...state,
				absentIds: state.absentIds.filter(
					(id) => id !== action.payload,
				),
				presentIds: state.presentIds.includes(action.payload)
					? state.presentIds
					: [...state.presentIds, action.payload],
			};
		case "MARK_ABSENT":
			if (state.hasSubmitted) return state;
			return {
				...state,
				presentIds: state.presentIds.filter(
					(id) => id !== action.payload,
				),
				absentIds: state.absentIds.includes(action.payload)
					? state.absentIds
					: [...state.absentIds, action.payload],
			};
		case "MARK_AUTO_ABSENT":
			return {
				...state,
				absentIds: [
					...new Set([...state.absentIds, ...action.payload]),
				],
			};
		case "MARK_ALL":
			if (state.hasSubmitted) return state;
			return {
				...state,
				presentIds:
					action.payload.status === "present"
						? action.payload.ids
						: [],
				absentIds:
					action.payload.status === "absent"
						? action.payload.ids
						: [],
			};
		case "SET_SEARCH_QUERY":
			return { ...state, searchQuery: action.payload };
		case "SET_VIEW_MODE":
			return { ...state, viewMode: action.payload };
		case "SET_QR_DATA":
			return { ...state, qr: { ...state.qr, ...action.payload } };
		case "RESET_QR_SESSION":
			return {
				...state,
				qr: {
					...state.qr,
					token: "",
					timeLeft: 0,
				},
			};
		case "SUBMIT_SUCCESS":
			return {
				...state,
				hasSubmitted: true,
				submitLoading: false,
				qr: { ...state.qr, token: "", timeLeft: 0 },
			};
		default:
			return state;
	}
}

export const AttendanceProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const encodeBase64 = (str) => {
		const bytes = new TextEncoder().encode(str);
		let binary = "";
		for (let i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	};

	const cleanupOldDrafts = useCallback(async () => {
		const prefix = "attendance_draft_";
		const now = new Date();
		const keys = Object.keys(localStorage);

		for (const key of keys) {
			if (key.startsWith(prefix)) {
				try {
					const draft = JSON.parse(localStorage.getItem(key));
					const saveDate = new Date(draft.saveDate);
					const lastUpdated = new Date(draft.lastUpdated);

					// Logic: Allow 7 days of grace + the gap between today and the class date
					// (if the draft was created for a future class)
					const dayDiffFromUpdate =
						(now - lastUpdated) / (1000 * 60 * 60 * 24);
					const isPastClass = now > saveDate;

					// If it's a past class, clean up if older than 7 days.
					// If it's a future class, we keep it until 7 days after the class actually occurs.
					const expiryThreshold = isPastClass
						? 7
						: 7 + (saveDate - now) / (1000 * 60 * 60 * 24);

					if (dayDiffFromUpdate > expiryThreshold) {
						const parts = key.split("_");
						await attendanceService.markAttendance(parts[2], {
							studentIds: draft.presentIds || [],
							date: draft.saveDate,
							status: "final",
							section: parts[3],
							courseCode: draft.courseCode || "N/A",
						});
						localStorage.removeItem(key);
					}
				} catch (e) {
					localStorage.removeItem(key);
				}
			}
		}
	}, []);

	const fetchData = useCallback(async () => {
		dispatch({ type: "SET_LOADING", payload: true });
		try {
			await cleanupOldDrafts();
			const [courseRes, logsRes, leaveRes, scheduleRes] =
				await Promise.all([
					userService.getDashboardOverview(),
					attendanceService.getProfessorLogs(),
					leaveService.getApplications(),
					sessionService.getSchedules(),
				]);

			const courses = (courseRes.data?.createdCohorts || []).map((c) => ({
				id: c.id,
				cohort_name: c.cohort_name || "Untitled Course",
				course_codes: c.course_codes || ["N/A"],
				member_count: c.member_count || 0,
				sections: (c.sections || []).map((sec) => ({
					name: sec.section_name || sec.name,
					code: sec.course_code || sec.code,
					department: sec.department,
				})),
			}));

			const approvedLeaves = (leaveRes?.data?.applications || []).filter(
				(app) => app.status === "Approved",
			);

			dispatch({
				type: "INITIALIZE_DATA",
				payload: {
					courses,
					logs: logsRes.data || [],
					leaves: approvedLeaves,
					schedules: scheduleRes.data || [],
				},
			});
		} catch (err) {
			dispatch({ type: "SET_ERROR", payload: "Failed to load records." });
		}
	}, [cleanupOldDrafts]);

	/**
	 * Fetches students and checks for existing drafts or logs.
	 * Updated to allow fetching for future dates to support advance marking.
	 */
	const fetchStudentsForSection = useCallback(
		async (courseId, sectionName, targetDate) => {
			if (!targetDate || !courseId || !sectionName) return;
			dispatch({ type: "SET_MARKING_LOADING", payload: true });

			try {
				const response =
					await attendanceService.getAttendanceLogs(courseId);
				if (response.status === "success") {
					const { students: studentList, logs } = response.data;

					const savedDraft = localStorage.getItem(
						`attendance_draft_${courseId}_${sectionName}_${targetDate}`,
					);

					let presentIds = [];
					let absentIds = [];

					if (savedDraft) {
						const parsed = JSON.parse(savedDraft);
						presentIds = (parsed.presentIds || []).map(Number);
						absentIds = (parsed.absentIds || []).map(Number);
					} else {
						// Check if logs exist for this date (relevant for past or currently updated logs)
						presentIds = (
							logs?.[sectionName]?.[targetDate] || []
						).map(Number);
					}

					dispatch({
						type: "SET_STUDENTS_AND_LOGS",
						payload: {
							students: studentList || [],
							presentIds,
							absentIds,
						},
					});
				}
			} catch (err) {
				dispatch({ type: "SET_ERROR", payload: err.message });
			}
		},
		[],
	);

	const recordAcademicExperience = useCallback(async (experienceData) => {
		dispatch({ type: "SET_SUBMIT_LOADING", payload: true });
		try {
			const response =
				await attendanceService.recordAcademicExperience(
					experienceData,
				);
			dispatch({ type: "SET_SUBMIT_LOADING", payload: false });
			return response;
		} catch (err) {
			dispatch({
				type: "SET_SUBMIT_ERROR",
				payload: err.message || "Failed to record experience",
			});
			return { success: false, message: err.message };
		}
	}, []);

	useEffect(() => {
		const {
			selectedCourse,
			selectedSection,
			presentIds,
			absentIds,
			hasSubmitted,
			markingLoading,
			loading,
			currentCourseCode,
			selectedDate,
		} = state;

		if (markingLoading || loading || hasSubmitted) return;
		if (presentIds.length === 0 && absentIds.length === 0) return;

		if (selectedCourse && selectedSection) {
			const draft = {
				presentIds,
				absentIds,
				lastUpdated: new Date().toISOString(),
				saveDate: selectedDate,
				courseCode: currentCourseCode,
				section: selectedSection,
			};
			localStorage.setItem(
				`attendance_draft_${selectedCourse.id}_${selectedSection}_${selectedDate}`,
				JSON.stringify(draft),
			);
		}
	}, [
		state.presentIds,
		state.absentIds,
		state.selectedCourse,
		state.selectedSection,
		state.selectedDate,
		state.hasSubmitted,
	]);

	useEffect(() => {
		let timer;
		if (state.qr.token && state.qr.timeLeft > 0) {
			timer = setInterval(() => {
				dispatch({
					type: "SET_QR_DATA",
					payload: { timeLeft: state.qr.timeLeft - 1 },
				});
			}, 1000);
		} else if (state.qr.timeLeft === 0 && state.qr.token) {
			const currentMarkedIds = [...state.presentIds, ...state.absentIds];
			const remainingIds = state.students
				.filter(
					(s) =>
						s.section === state.selectedSection &&
						!currentMarkedIds.includes(s.id),
				)
				.map((s) => s.id);

			if (remainingIds.length > 0) {
				dispatch({ type: "MARK_AUTO_ABSENT", payload: remainingIds });
			}
			dispatch({ type: "SET_QR_DATA", payload: { token: "" } });
		}
		return () => clearInterval(timer);
	}, [
		state.qr.token,
		state.qr.timeLeft,
		state.students,
		state.selectedSection,
	]);

	const handleSaveAttendance = useCallback(async () => {
		const {
			selectedCourse,
			selectedSection,
			presentIds,
			currentCourseCode,
			selectedDate,
			hasSubmitted,
		} = state;

		if (!selectedCourse || !selectedSection || hasSubmitted) return;

		dispatch({ type: "SET_SUBMIT_LOADING", payload: true });

		try {
			const response = await attendanceService.markAttendance(
				selectedCourse.id,
				{
					studentIds: presentIds,
					date: selectedDate,
					status: "final",
					section: selectedSection,
					courseCode: currentCourseCode,
				},
			);

			if (response.status === "success" || response.success) {
				const draftKey = `attendance_draft_${selectedCourse.id}_${selectedSection}_${selectedDate}`;
				localStorage.removeItem(draftKey);

				dispatch({ type: "SUBMIT_SUCCESS" });
				return { success: true };
			}
			throw new Error("Failed to finalize");
		} catch (err) {
			dispatch({
				type: "SET_SUBMIT_ERROR",
				payload: "Submission failed.",
			});
			return { success: false };
		}
	}, [state]);

	const generateNewQR = useCallback(() => {
		const {
			selectedCourse,
			selectedSection,
			currentCourseCode,
			qr,
			hasSubmitted,
		} = state;
		if (!selectedCourse || !selectedSection || hasSubmitted) return;

		const payload = JSON.stringify({
			cid: selectedCourse.id,
			ts: Date.now(),
			exp: qr.qrTimeout,
			sec: selectedSection,
			code: currentCourseCode,
		});

		dispatch({
			type: "SET_QR_DATA",
			payload: { token: encodeBase64(payload), timeLeft: qr.qrTimeout },
		});
	}, [state]);

	const filteredStudents = useMemo(() => {
		const { students, searchQuery, selectedSection } = state;
		if (!selectedSection) return [];
		return students.filter((student) => {
			const query = searchQuery.toLowerCase();
			return (
				(student.name.toLowerCase().includes(query) ||
					student.rollNumber.toLowerCase().includes(query)) &&
				student.section === selectedSection
			);
		});
	}, [state.students, state.searchQuery, state.selectedSection]);

	const isCourseScheduledToday = useCallback(
		(course) => {
			if (!state.schedules.length) return true;
			const today = new Date().toLocaleDateString("en-US", {
				weekday: "long",
			});
			return state.schedules
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
		[state.schedules],
	);

	const isSectionScheduledOnDate = useCallback(
		(sectionName, dateString) => {
			if (!state.schedules.length) return true;

			const dayName = new Date(dateString).toLocaleDateString("en-US", {
				weekday: "long",
			});

			const targetCode =
				state.selectedCourse?.sections?.find(
					(s) => s.name === sectionName,
				)?.code || state.currentCourseCode;

			const courseSchedule = state.schedules.find((s) =>
				s.courseCodes?.includes(targetCode),
			);

			return (
				courseSchedule?.schedule.some(
					(entry) =>
						entry.day === dayName &&
						entry.batchSection === sectionName,
				) ?? false
			);
		},
		[state.schedules, state.selectedCourse, state.currentCourseCode],
	);

	const actions = useMemo(
		() => ({
			fetchData,
			fetchStudentsForSection,
			generateNewQR,
			handleSaveAttendance,
			recordAcademicExperience,
			setSearchQuery: (q) =>
				dispatch({ type: "SET_SEARCH_QUERY", payload: q }),
			setViewMode: (m) => dispatch({ type: "SET_VIEW_MODE", payload: m }),
			setSelectedCourse: (c) =>
				dispatch({ type: "SET_SELECTED_COURSE", payload: c }),
			setSection: (section, courseCode) =>
				dispatch({
					type: "SET_SECTION",
					payload: { section, courseCode },
				}),
			setSelectedDate: (d) =>
				dispatch({ type: "SET_SELECTED_DATE", payload: d }),
			markPresent: (id) =>
				dispatch({ type: "MARK_PRESENT", payload: id }),
			markAbsent: (id) => dispatch({ type: "MARK_ABSENT", payload: id }),
			markAll: (status, ids) =>
				dispatch({ type: "MARK_ALL", payload: { status, ids } }),
			setQrTimeout: (t) =>
				dispatch({
					type: "SET_QR_DATA",
					payload: { qrTimeout: t },
				}),
			resetQrSession: () => dispatch({ type: "RESET_QR_SESSION" }),
			clearQrToken: () =>
				dispatch({ type: "SET_QR_DATA", payload: { token: "" } }),
			setTimeLeft: (t) =>
				dispatch({ type: "SET_QR_DATA", payload: { timeLeft: t } }),
		}),
		[
			fetchData,
			fetchStudentsForSection,
			generateNewQR,
			handleSaveAttendance,
			recordAcademicExperience,
		],
	);

	const value = useMemo(
		() => ({
			state,
			filteredStudents,
			isCourseScheduledToday,
			isSectionScheduledOnDate,
			actions,
		}),
		[
			state,
			filteredStudents,
			isCourseScheduledToday,
			isSectionScheduledOnDate,
			actions,
		],
	);

	return (
		<AttendanceContext.Provider value={value}>
			{children}
		</AttendanceContext.Provider>
	);
};

export const useAttendance = () => {
	const context = useContext(AttendanceContext);
	if (!context)
		throw new Error(
			"useAttendance must be used within an AttendanceProvider",
		);
	return context;
};
