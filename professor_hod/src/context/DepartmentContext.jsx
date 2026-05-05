// src/context/DepartmentContext.jsx

import React, {
	createContext,
	useContext,
	useReducer,
	useMemo,
	useCallback,
} from "react";
import { departmentService } from "../api/services/department.service";

const DepartmentContext = createContext();

const initialState = {
	deptData: null,
	alerts: [],
	courses: [],
	faculty: [],
	allocations: [],
	feedback: [],
	students: [],
	research: {
		projects: [],
		publications: [],
		grantRequests: [],
		funding: null,
	},
	placements: [],
	placementStats: [],
	placementCompanies: [],
	selectedBatch: null,
	selectedCourse: null,
	selectedFaculty: null,
	selectedStudent: null,
	viewFilters: {
		viewType: "daily",
		attendanceMonth: "all",
		reflectionMonth: "all",
		activeSectionName: "all",
		feedbackFilter: "all",
		placementStatusFilter: "is_placed",
	},
	filters: {
		searchQuery: "",
		category: "all",
	},
	activeTab: "overview",
	loading: true,
	error: null,
};

/**
 * Reducer handling state transitions for department-wide data management
 */
function reducer(state, action) {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload, loading: false };
		case "SET_STATS":
			return { ...state, deptData: action.payload, loading: false };
		case "SET_ALERTS":
			return { ...state, alerts: action.payload, loading: false };
		case "SET_COURSES":
			return { ...state, courses: action.payload, loading: false };
		case "UPDATE_DOCUMENT_STATUS":
			const { courseId, type, status, hodComments } = action.payload;
			return {
				...state,
				courses: state.courses.map((course) =>
					course.id === courseId
						? {
								...course,
								course_documents: course.course_documents.map(
									(doc) =>
										doc.type === type
											? { ...doc, status, hodComments }
											: doc,
								),
							}
						: course,
				),
			};
		case "SET_FACULTY_DATA":
			return {
				...state,
				faculty: action.payload.faculty,
				allocations: action.payload.allocations,
				feedback: action.payload.feedback || [],
				loading: false,
			};
		case "SET_STUDENTS_DATA":
			return {
				...state,
				students: action.payload,
				loading: false,
			};
		case "SET_PLACEMENTS_DATA":
			return {
				...state,
				placements: action.payload.placements,
				placementStats: action.payload.stats,
				placementCompanies: action.payload.companies || [],
				loading: false,
			};
		case "SET_RESEARCH_DATA":
			return {
				...state,
				research: {
					projects: action.payload.projects,
					publications: action.payload.publications,
					grantRequests: action.payload.grantRequests,
					funding: action.payload.funding,
				},
				loading: false,
			};
		case "UPDATE_GRANT_STATUS":
			return {
				...state,
				research: {
					...state.research,
					grantRequests: state.research.grantRequests.map((grant) =>
						grant.requestId === action.payload.requestId
							? {
									...grant,
									status: action.payload.status,
									adminComments: action.payload.adminComments,
									lastAdminAction: new Date()
										.toISOString()
										.split("T")[0],
								}
							: grant,
					),
				},
			};
		case "SET_SELECTED_COURSE":
			return {
				...state,
				selectedCourse: action.payload,
				viewFilters: {
					...state.viewFilters,
					activeSectionName: "all",
					attendanceMonth: "all",
					reflectionMonth: "all",
				},
			};
		case "SET_SELECTED_FACULTY":
			return {
				...state,
				selectedFaculty: action.payload,
				selectedCourse: null,
			};
		case "SET_SELECTED_STUDENT":
			return {
				...state,
				selectedStudent: action.payload,
			};
		case "SET_SELECTED_BATCH":
			return {
				...state,
				selectedBatch: action.payload.batchId,
				viewFilters: {
					...state.viewFilters,
					viewType:
						action.payload.viewType || state.viewFilters.viewType,
				},
			};
		case "SET_ACTIVE_SECTION":
			return {
				...state,
				viewFilters: {
					...state.viewFilters,
					activeSectionName: action.payload,
				},
			};
		case "SET_VIEW_FILTERS":
			return {
				...state,
				viewFilters: {
					...state.viewFilters,
					...action.payload,
				},
			};
		case "SET_ACTIVE_TAB":
			return { ...state, activeTab: action.payload };
		case "SET_FILTERS":
			return {
				...state,
				filters: { ...state.filters, ...action.payload },
			};
		default:
			return state;
	}
}

export const DepartmentProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const fetchOverview = useCallback(async () => {
		if (!state.deptData) dispatch({ type: "SET_LOADING", payload: true });
		try {
			const response = await departmentService.getOverview();
			if (response.success) {
				dispatch({ type: "SET_STATS", payload: response.data });
			}
		} catch (err) {
			dispatch({ type: "SET_ERROR", payload: err.message });
		}
	}, [state.deptData]);

	/**
	 * Fetches urgent department notifications
	 */
	const fetchAlerts = useCallback(async () => {
		try {
			const response = await departmentService.getDepartmentAlerts();
			if (response.success) {
				dispatch({ type: "SET_ALERTS", payload: response.data });
			}
		} catch (err) {
			console.error("Failed to fetch alerts:", err.message);
		}
	}, []);

	/**
	 * Fetches and processes courses, filtering by department prefix
	 * and removing rejected documents.
	 */
	const fetchCourses = useCallback(async () => {
		if (state.courses.length > 0) return;
		dispatch({ type: "SET_LOADING", payload: true });

		try {
			const response = await departmentService.getCourses();

			if (response.success) {
				const {
					courses: rawCohorts,
					attendance: attendanceData,
					schedules,
					mapping,
					reflections = [],
					documents = {},
				} = response.data;

				const deptName = state.deptData?.deptName || "Computer Science";
				const deptPrefix = mapping[deptName] || "";

				const processedCourses = rawCohorts
					.filter((cohort) =>
						cohort.course_codes.some((code) =>
							code
								.toUpperCase()
								.startsWith(deptPrefix.toUpperCase()),
						),
					)
					.map((cohort) => {
						const deptCourseCode = cohort.course_codes.find(
							(code) =>
								code
									.toUpperCase()
									.startsWith(deptPrefix.toUpperCase()),
						);

						const courseAttendance = attendanceData[cohort.id] || {
							students: [],
							logs: {},
						};

						// Filter out rejected documents from the document list
						const filteredDocuments = (
							documents[cohort.id] || []
						).filter((doc) => doc.status !== "Rejected");

						return {
							...cohort,
							course_code: deptCourseCode,
							course_documents: filteredDocuments,
							sections: cohort.sections
								.filter(
									(section) =>
										section.department === deptName,
								)
								.map((section) => {
									const sectionLogs =
										courseAttendance.logs[
											section.section_name
										] || {};
									const allDates =
										Object.keys(sectionLogs).sort();

									const sectionStudents =
										courseAttendance.students.filter(
											(s) =>
												s.section ===
												section.section_name,
										);
									const totalSectionStudents =
										sectionStudents.length;

									const sectionAttendanceHistory =
										allDates.map((date) => {
											const presentIds =
												sectionLogs[date] || [];
											const sectionPresentCount =
												presentIds.length;

											return {
												date,
												present_count:
													sectionPresentCount,
												total_students:
													totalSectionStudents,
												attendance_percentage:
													totalSectionStudents > 0
														? parseFloat(
																(
																	(sectionPresentCount /
																		totalSectionStudents) *
																	100
																).toFixed(2),
															)
														: 0,
											};
										});

									const validHistory =
										sectionAttendanceHistory.filter(
											(h) => h.total_students > 0,
										);
									const calculatedOverallPercent =
										validHistory.length > 0
											? Math.round(
													validHistory.reduce(
														(acc, curr) =>
															acc +
															curr.attendance_percentage,
														0,
													) / validHistory.length,
												)
											: 0;

									return {
										...section,
										attendance_percentage:
											calculatedOverallPercent,
										attendance_history:
											sectionAttendanceHistory,
										reflections: reflections.filter(
											(ref) =>
												ref.batchSection ===
													section.section_name &&
												ref.visibleToHOD === true,
										),
										schedule:
											schedules
												.find((s) =>
													s.courseCodes.includes(
														section.course_code,
													),
												)
												?.schedule.filter(
													(sch) =>
														sch.batchSection ===
														section.section_name,
												) || [],
									};
								}),
						};
					})
					.filter((cohort) => cohort.sections.length > 0);

				dispatch({ type: "SET_COURSES", payload: processedCourses });
			}
		} catch (err) {
			dispatch({ type: "SET_ERROR", payload: err.message });
		} finally {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	}, [state.courses, state.deptData]);

	/**
	 * Logic for processing selected course metrics and section-wise filtering
	 */
	const getSelectedCourseDetails = useCallback(() => {
		const course = state.selectedCourse;
		if (!course) return null;

		const {
			activeSectionName,
			viewType,
			attendanceMonth,
			reflectionMonth,
		} = state.viewFilters;

		let activeSection;
		if (activeSectionName !== "all") {
			activeSection =
				course.sections.find(
					(s) => s.section_name === activeSectionName,
				) || course.sections[0];
		} else {
			const allAttendance = course.sections.flatMap(
				(s) => s.attendance_history || [],
			);
			const allReflections = course.sections.flatMap(
				(s) => s.reflections || [],
			);
			const allSchedules = course.sections.flatMap(
				(s) => s.schedule || [],
			);

			const dateMap = allAttendance.reduce((acc, curr) => {
				if (!acc[curr.date])
					acc[curr.date] = { totalPerc: 0, count: 0 };
				acc[curr.date].totalPerc += curr.attendance_percentage;
				acc[curr.date].count += 1;
				return acc;
			}, {});

			const combinedHistory = Object.keys(dateMap)
				.map((date) => ({
					date,
					attendance_percentage:
						dateMap[date].totalPerc / dateMap[date].count,
					total_students: "N/A (Combined)",
				}))
				.sort((a, b) => new Date(b.date) - new Date(a.date));

			const aggregateGrading = (key) => {
				const totals = course.sections.reduce(
					(acc, s) => {
						const data = s[key] || {
							total_count: 0,
							ongoing: 0,
							completed: 0,
						};
						acc.total_count += data.total_count;
						acc.ongoing += data.ongoing;
						acc.completed += data.completed;
						return acc;
					},
					{ total_count: 0, ongoing: 0, completed: 0 },
				);
				return {
					...totals,
					grading_status:
						totals.total_count > 0 &&
						totals.completed === totals.total_count
							? "Completed"
							: "Pending",
				};
			};

			activeSection = {
				section_name: "all",
				professor: "Multiple Instructors",
				students: course.sections.reduce(
					(acc, s) => acc + (s.students || 0),
					0,
				),
				syllabus_completion:
					course.sections.length > 0
						? Math.round(
								course.sections.reduce(
									(acc, s) =>
										acc + (s.syllabus_completion || 0),
									0,
								) / course.sections.length,
							)
						: 0,
				attendance_percentage:
					course.sections.length > 0
						? Math.round(
								course.sections.reduce(
									(acc, s) =>
										acc + (s.attendance_percentage || 0),
									0,
								) / course.sections.length,
							)
						: 0,
				attendance_history: combinedHistory,
				reflections: allReflections,
				schedule: allSchedules,
				assignments: aggregateGrading("assignments"),
				projects: aggregateGrading("projects"),
			};
		}

		const history = activeSection.attendance_history || [];
		let filteredAttendance = history;

		if (viewType === "monthly") {
			const monthlyData = history.reduce((acc, record) => {
				const date = new Date(record.date);
				const monthKey = date.toLocaleString("en-US", {
					month: "long",
					year: "numeric",
				});
				if (!acc[monthKey])
					acc[monthKey] = {
						month: monthKey,
						totalPerc: 0,
						count: 0,
						rawDate: date,
					};
				acc[monthKey].totalPerc += record.attendance_percentage;
				acc[monthKey].count += 1;
				return acc;
			}, {});

			filteredAttendance = Object.values(monthlyData)
				.map((m) => ({
					date: m.month,
					attendance_percentage: m.totalPerc / m.count,
					isMonthly: true,
					rawDate: m.rawDate,
				}))
				.sort((a, b) => b.rawDate - a.rawDate);
		} else if (attendanceMonth !== "all") {
			filteredAttendance = history.filter(
				(record) =>
					new Date(record.date).toLocaleString("en-US", {
						month: "long",
					}) === attendanceMonth,
			);
		}

		const reflections = activeSection.reflections || [];
		const filteredReflections =
			reflectionMonth === "all"
				? reflections
				: reflections.filter(
						(ref) =>
							new Date(ref.date).toLocaleString("en-US", {
								month: "long",
							}) === reflectionMonth,
					);

		const availableMonths = [
			...new Set(
				(activeSection.attendance_history || []).map((r) =>
					new Date(r.date).toLocaleString("en-US", { month: "long" }),
				),
			),
		];
		const reflectionMonths = [
			...new Set(
				(activeSection.reflections || []).map((ref) =>
					new Date(ref.date).toLocaleString("en-US", {
						month: "long",
					}),
				),
			),
		];

		return {
			activeSection,
			filteredAttendance,
			filteredReflections,
			availableMonths,
			reflectionMonths,
		};
	}, [state.selectedCourse, state.viewFilters]);

	/**
	 * Updates the document status through the API and syncs local state
	 */
	const updateDocumentStatus = useCallback(async (payload) => {
		try {
			const response =
				await departmentService.updateDocumentStatus(payload);
			if (response.success) {
				dispatch({
					type: "UPDATE_DOCUMENT_STATUS",
					payload: {
						courseId: payload.courseId,
						type: payload.type,
						status: payload.status,
						hodComments: payload.comments,
					},
				});
				return { success: true };
			}
			return response;
		} catch (err) {
			return { success: false, message: err.message };
		}
	}, []);

	/**
	 * Fetches faculty data including allocations, research work and feedback
	 */
	const fetchFaculty = useCallback(async () => {
		if (state.faculty.length > 0) return;
		dispatch({ type: "SET_LOADING", payload: true });
		try {
			const response = await departmentService.getFaculty();

			if (response.success) {
				dispatch({
					type: "SET_FACULTY_DATA",
					payload: {
						faculty: response.data.faculty,
						allocations: response.data.allocations,
						feedback: response.data.feedback,
						research: response.data.research,
					},
				});
			}
		} catch (err) {
			dispatch({ type: "SET_ERROR", payload: err.message });
		} finally {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	}, [state.faculty]);

	/**
	 * Formats and retrieves the schedule for a specific faculty member
	 */
	const getFacultySchedule = useCallback(
		(facultyId) => {
			const daysOrder = [
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday",
			];

			const facultyAllocations = (state.allocations || []).filter(
				(a) => a.facultyId === facultyId,
			);

			const scheduleMap = {};

			facultyAllocations.forEach((course) => {
				course.schedule.forEach((slot) => {
					if (!scheduleMap[slot.day]) {
						scheduleMap[slot.day] = [];
					}
					scheduleMap[slot.day].push({
						...slot,
						courseName: course.courseName,
						courseCode: course.courseCode,
						section: course.section,
					});
				});
			});

			const formattedSchedule = daysOrder
				.filter((day) => scheduleMap[day])
				.map((day) => ({
					day,
					classes: scheduleMap[day].sort((a, b) =>
						a.startTime.localeCompare(b.startTime),
					),
				}));

			return {
				facultyAllocations,
				formattedSchedule,
			};
		},
		[state.allocations],
	);

	/**
	 * Calculates feedback and research metrics for a specific faculty member
	 */
	const getFacultyMetrics = useCallback(
		(facultyId) => {
			const faculty = state.faculty.find((f) => f.id === facultyId);

			let relevantFeedback = state.feedback.filter(
				(f) => f.facultyId === facultyId,
			);

			const currentFilter = state.viewFilters.feedbackFilter;

			if (currentFilter === "positive") {
				relevantFeedback = relevantFeedback.filter(
					(f) => f.rating >= 4,
				);
			} else if (currentFilter === "negative") {
				relevantFeedback = relevantFeedback.filter(
					(f) => f.rating <= 2,
				);
			}

			const total = relevantFeedback.length;

			const metrics = {
				average: 0,
				count: 0,
				distribution: {},
				comments: [],
				research: faculty?.research || {
					projects: [],
					publications: [],
				},
			};

			if (total > 0) {
				const sum = relevantFeedback.reduce(
					(acc, curr) => acc + curr.rating,
					0,
				);
				metrics.average = parseFloat((sum / total).toFixed(1));
				metrics.count = total;
				metrics.distribution = relevantFeedback.reduce((acc, curr) => {
					acc[curr.rating] = (acc[curr.rating] || 0) + 1;
					return acc;
				}, {});
				metrics.comments = relevantFeedback.filter((f) => f.comment);
			}

			return metrics;
		},
		[state.feedback, state.viewFilters.feedbackFilter, state.faculty],
	);

	/**
	 * Fetches student data including mentoring meetings and research work
	 */
	const fetchStudents = useCallback(async () => {
		if (state.students.length > 0) return;
		dispatch({ type: "SET_LOADING", payload: true });
		try {
			const response = await departmentService.getStudents();
			if (response.success) {
				dispatch({
					type: "SET_STUDENTS_DATA",
					payload: response.data.students,
				});
			}
		} catch (err) {
			dispatch({ type: "SET_ERROR", payload: err.message });
		} finally {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	}, [state.students]);

	/**
	 * Fetches placement data and ensures student data is available
	 * for comprehensive reporting.
	 */
	const fetchPlacements = useCallback(async () => {
		dispatch({ type: "SET_LOADING", payload: true });
		try {
			// Fetch students first to ensure cross-referencing is possible
			if (state.students.length === 0) {
				const studentRes = await departmentService.getStudents();
				if (studentRes.success) {
					dispatch({
						type: "SET_STUDENTS_DATA",
						payload: studentRes.data.students,
					});
				}
			}

			const response = await departmentService.getPlacements();
			if (response.success) {
				dispatch({
					type: "SET_PLACEMENTS_DATA",
					payload: {
						placements: response.data.placements,
						stats: response.data.stats,
						companies: response.data.companies,
					},
				});
			}
		} catch (err) {
			dispatch({ type: "SET_ERROR", payload: err.message });
		} finally {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	}, [state.students]);

	/**
	 * Logic for processing placement details by merging the full student
	 * list with active placement records and applying filters.
	 */
	const getPlacementDetails = useCallback(
		(batchId) => {
			const { placementStats, placements, students, viewFilters, placementCompanies } = state;
			const {
				viewType,
				activeSectionName: selectedSection,
				placementStatusFilter: statusFilter,
			} = viewFilters;

			const activeType =
				viewType === "internships" ? "internships" : "placements";

			const batchData = placementStats?.find((s) => s.batch === batchId);
			if (!batchData) return null;

			const batchStudents = students.filter((s) => s.batch === batchId);

			const studentRecords = batchStudents.map((student) => {
				const placementRecord = placements.find(
					(p) =>
						p.studentId === (student.id || student.studentId) &&
						p.batch === batchId &&
						(activeType === "placements"
							? p.placementDetails.type
									.toLowerCase()
									.includes("placement")
							: p.placementDetails.type
									.toLowerCase()
									.includes("internship")),
				);

				return {
					studentId: student.id || student.studentId,
					name: student.name,
					section: student.section,
					isPlaced: !!placementRecord,
					placementDetails: placementRecord?.placementDetails || null,
					companyContact: placementRecord?.companyContact || null,
				};
			});

			const availableSections = [
				"all",
				...new Set(batchStudents.map((r) => r.section).filter(Boolean)),
			].sort();

			const activeStats =
				activeType === "internships"
					? batchData.internships
					: batchData.placements;

			// Apply Filters logic
			let filteredRecords = studentRecords.filter((p) => {
				const matchesSection =
					selectedSection === "all" || p.section === selectedSection;
				return matchesSection;
			});

			if (statusFilter === "is_placed") {
				filteredRecords = filteredRecords.filter((r) => r.isPlaced);
			} else if (statusFilter === "not_placed") {
				filteredRecords = filteredRecords.filter((r) => !r.isPlaced);
			} else if (statusFilter === "has_offer") {
				filteredRecords = filteredRecords.filter(
					(r) => r.placementDetails?.isPPOOffered,
				);
			}

			return {
				batchData: {
					...batchData,
					studentRecords,
				},
				activeStats,
				filteredRecords,
				availableSections,
				activeType,
				companies: placementCompanies,
			};
		},
		[
			state.placementStats,
			state.placements,
			state.students,
			state.viewFilters,
			state.placementCompanies,
		],
	);

	/**
	 * Fetches research projects, publications, grant requests and funding data
	 */
	const fetchResearch = useCallback(async () => {
		dispatch({ type: "SET_LOADING", payload: true });
		try {
			const response = await departmentService.getResearch();
			if (response.success) {
				dispatch({
					type: "SET_RESEARCH_DATA",
					payload: response.data,
				});
			}
		} catch (err) {
			dispatch({ type: "SET_ERROR", payload: err.message });
		} finally {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	}, []);

	/**
	 * Updates the status of a specific research grant request
	 */
	const updateGrantStatus = useCallback(async (payload) => {
		try {
			const response = await departmentService.updateGrantStatus(payload);
			if (response.success) {
				dispatch({
					type: "UPDATE_GRANT_STATUS",
					payload: {
						requestId: payload.requestId,
						status: payload.status,
						adminComments: payload.adminComments,
					},
				});
				return { success: true };
			}
			return response;
		} catch (err) {
			return { success: false, message: err.message };
		}
	}, []);

	/**
	 * Synchronizes data fetching when the active tab changes
	 */
	const syncTabContext = useCallback(
		(tabId) => {
			dispatch({ type: "SET_ACTIVE_TAB", payload: tabId });
			fetchOverview();
			fetchAlerts();
			switch (tabId) {
				case "courses":
					fetchCourses();
					break;
				case "faculty":
					fetchFaculty();
					break;
				case "students":
					fetchStudents();
					break;
				case "placements":
					fetchPlacements();
					break;
				case "research":
					fetchResearch();
					break;
				default:
					break;
			}
		},
		[
			fetchOverview,
			fetchAlerts,
			fetchCourses,
			fetchFaculty,
			fetchStudents,
			fetchPlacements,
			fetchResearch,
		],
	);

	const value = useMemo(
		() => ({
			state,
			getSelectedCourseDetails,
			getFacultyMetrics,
			getFacultySchedule,
			getPlacementDetails,
			actions: {
				fetchOverview,
				fetchAlerts,
				syncTabContext,
				setSearchQuery: (query) =>
					dispatch({
						type: "SET_FILTERS",
						payload: { searchQuery: query },
					}),
				setSelectedCourse: (course) =>
					dispatch({ type: "SET_SELECTED_COURSE", payload: course }),
				setSelectedFaculty: (faculty) =>
					dispatch({
						type: "SET_SELECTED_FACULTY",
						payload: faculty,
					}),
				setSelectedStudent: (student) =>
					dispatch({
						type: "SET_SELECTED_STUDENT",
						payload: student,
					}),
				setActiveSection: (sectionName) =>
					dispatch({
						type: "SET_ACTIVE_SECTION",
						payload: sectionName,
					}),
				setSelectedBatch: (batch) =>
					dispatch({ type: "SET_SELECTED_BATCH", payload: batch }),
				setViewFilters: (filters) =>
					dispatch({
						type: "SET_VIEW_FILTERS",
						payload: filters,
					}),
				updateDocumentStatus,
				updateGrantStatus,
			},
		}),
		[
			state,
			fetchOverview,
			fetchAlerts,
			syncTabContext,
			getSelectedCourseDetails,
			updateDocumentStatus,
			getFacultyMetrics,
			getFacultySchedule,
			updateGrantStatus,
			getPlacementDetails,
		],
	);

	return (
		<DepartmentContext.Provider value={value}>
			{children}
		</DepartmentContext.Provider>
	);
};

export const useDepartment = () => {
	const context = useContext(DepartmentContext);
	if (!context)
		throw new Error(
			"useDepartment must be used within a DepartmentProvider",
		);
	return context;
};
