// src/context/DepartmentContext.jsx

import React, {
	createContext,
	useContext,
	useReducer,
	useMemo,
	useCallback,
} from "react";
import { departmentService } from "../api/services/department.service";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const DepartmentContext = createContext();

const initialState = {
	deptData: null,
	courses: [],
	selectedCourse: null,
	viewFilters: {
		viewType: "daily",
		attendanceMonth: "all",
		reflectionMonth: "all",
		activeSectionName: "",
	},
	faculty: [],
	allocations: [],
	feedback: [],
	selectedFaculty: null,
	loading: true,
	error: null,
	activeTab: "overview",
	filters: {
		searchQuery: "",
		category: "all",
	},
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
		case "SET_SELECTED_COURSE":
			return {
				...state,
				selectedCourse: action.payload,
				viewFilters: {
					...state.viewFilters,
					activeSectionName:
						action.payload?.sections[0]?.section_name || "",
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
	 * Fetches faculty data including allocations and feedback
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
     * Centralized logic to filter allocations and format schedule by day for a specific faculty
     */
    const getFacultySchedule = useCallback((facultyId) => {
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
            (a) => a.facultyId === facultyId
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
                    a.startTime.localeCompare(b.startTime)
                ),
            }));

        return {
        	facultyAllocations,
            formattedSchedule
        };
    }, [state.allocations]);

	/**
     * Computes rating metrics for a specific faculty member based on the feedback array
     */
    const getFacultyMetrics = useCallback((facultyId) => {
        const relevantFeedback = state.feedback.filter(f => f.facultyId === facultyId);
        const total = relevantFeedback.length;
        
        if (total === 0) return { average: 0, count: 0, distribution: {} };

        const sum = relevantFeedback.reduce((acc, curr) => acc + curr.rating, 0);
        const distribution = relevantFeedback.reduce((acc, curr) => {
            acc[curr.rating] = (acc[curr.rating] || 0) + 1;
            return acc;
        }, {});

        return {
            average: parseFloat((sum / total).toFixed(1)),
            count: total,
            distribution,
            comments: relevantFeedback.filter(f => f.comment)
        };
    }, [state.feedback]);

	/**
	 * Synchronizes data fetching based on the active UI tab
	 */
	const syncTabContext = useCallback(
		(tabId) => {
			dispatch({ type: "SET_ACTIVE_TAB", payload: tabId });
			switch (tabId) {
				case "overview":
					fetchOverview();
					break;
				case "courses":
					fetchCourses();
					break;
				case "faculty":
					fetchFaculty();
					break;
				default:
					break;
			}
		},
		[fetchOverview, fetchCourses, fetchFaculty],
	);

	/**
	 * Generates and downloads the PDF Audit Report using jsPDF
	 */
	const downloadAuditReport = useCallback(() => {
		const data = state.deptData;
		if (!data) return;

		try {
			const doc = new jsPDF();
			const primaryColor = [76, 29, 149];
			const secondaryColor = [31, 41, 55];

			doc.setFillColor(...primaryColor);
			doc.rect(0, 0, 210, 40, "F");

			doc.setFontSize(22);
			doc.setTextColor(255, 255, 255);
			doc.setFont("helvetica", "bold");
			doc.text("DEPARTMENT AUDIT REPORT", 14, 22);

			doc.setFontSize(10);
			doc.setFont("helvetica", "normal");
			doc.text(
				`${data.deptName || "Academic"} Department | AY ${
					data.academicYear || "Not Available"
				}`,
				14,
				30,
			);

			doc.setTextColor(255, 255, 255);
			doc.text(`Generated: ${new Date().toLocaleString()}`, 140, 30);

			doc.setTextColor(...secondaryColor);
			doc.setFontSize(14);
			doc.text("Executive Summary", 14, 50);

			autoTable(doc, {
				startY: 55,
				head: [["Metric", "Value", "Context"]],
				body: [
					[
						"Total Enrollment",
						data.summaryStats?.totalStudents?.count || 0,
						`${
							data.summaryStats?.totalStudents?.trend || 0
						}% vs last year`,
					],
					[
						"Faculty Strength",
						data.summaryStats?.totalFaculty || 0,
						"Full-time equivalent",
					],
					[
						"Active Courses",
						data.summaryStats?.totalCourses || 0,
						"Current Semester",
					],
				],
				headStyles: { fillColor: primaryColor },
				theme: "striped",
			});

			doc.text("Placement Analytics", 14, doc.lastAutoTable.finalY + 15);

			autoTable(doc, {
				startY: doc.lastAutoTable.finalY + 20,
				head: [["Placement Metric", "Data Point"]],
				body: [
					[
						"Placement Rate",
						`${data.placementStats?.placedPercentage || 0}%`,
					],
					[
						"Total Placed",
						`${data.placementStats?.placedCount || 0} of ${
							data.placementStats?.eligibleStudents || 0
						} eligible`,
					],
					[
						"Average Package",
						`INR ${data.placementStats?.averagePackageLpa || 0} LPA`,
					],
					[
						"Highest Package",
						`INR ${data.placementStats?.highestPackageLpa || 0} LPA`,
					],
				],
				headStyles: { fillColor: [124, 58, 237] },
				columnStyles: { 0: { fontStyle: "bold", width: 60 } },
			});

			doc.text(
				"Research & Innovation",
				14,
				doc.lastAutoTable.finalY + 15,
			);

			autoTable(doc, {
				startY: doc.lastAutoTable.finalY + 20,
				head: [["Research Category", "Metric"]],
				body: [
					[
						"Total Funding",
						`INR ${data.researchOutput?.totalValueRupee || "0"}`,
					],
					[
						"Active Grants",
						data.researchOutput?.totalActiveGrants || 0,
					],
					[
						"Publications (YTD)",
						data.researchOutput?.publicationsThisYear || 0,
					],
					[
						"Total Citations",
						data.researchOutput?.citationsTotal || 0,
					],
					[
						"Pending Proposals",
						data.researchOutput?.pendingProposals || 0,
					],
				],
				headStyles: { fillColor: [5, 150, 105] },
			});

			doc.addPage();
			doc.text("Cohort Distribution", 14, 20);

			const cohortRows =
				data.studentDemographics?.map((d) => [
					`${d.year} Year`,
					d.count,
					`M: ${d.genderRatio.m} / F: ${d.genderRatio.f}`,
				]) || [];

			autoTable(doc, {
				startY: 25,
				head: [
					[
						"Academic Year",
						"Student Count",
						"Gender Distribution (M/F)",
					],
				],
				body: cohortRows,
				headStyles: { fillColor: secondaryColor },
			});

			const pageCount = doc.internal.getNumberOfPages();
			for (let i = 1; i <= pageCount; i++) {
				doc.setPage(i);
				doc.setFontSize(8);
				doc.setTextColor(150);
				doc.text(
					`Confidential - ${data.deptName} Internal Audit - Page ${i} of ${pageCount}`,
					14,
					285,
				);
			}

			doc.save(
				`${data.deptName}_Department_Audit_${new Date().getTime()}.pdf`,
			);
		} catch (err) {
			console.error("PDF Generation failed", err);
		}
	}, [state.deptData]);

	/**
	 * Return statement providing context to the UI tree
	 */
	const value = useMemo(
		() => ({
			state,
			getFacultyMetrics,
			getFacultySchedule,
			actions: {
				fetchOverview,
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
				setActiveSection: (sectionName) =>
					dispatch({
						type: "SET_ACTIVE_SECTION",
						payload: sectionName,
					}),
				setViewFilters: (filters) =>
					dispatch({
						type: "SET_VIEW_FILTERS",
						payload: filters,
					}),
				updateDocumentStatus,
				downloadAuditReport,
			},
		}),
		[
			state,
			fetchOverview,
			syncTabContext,
			downloadAuditReport,
			updateDocumentStatus,
			getFacultyMetrics,
			getFacultySchedule,
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
