// src/api/client.js

import { API_BASE_URL, USE_MOCK_API } from "./config";
import * as Mocks from "./mocks";

/**
 * NOTE: Backend must still validate the user's role using a JWT or Session Cookie.
 * Never trust a role string sent from the frontend for actual database permissions.
 * */

// Private module state - not accessible via 'window'
let currentRole = localStorage.getItem("userRole") || "student";
const userName = localStorage.getItem("userName") || "User";

/**
 * Updates the internal state of the API client.
 * Called by AuthContext.jsx when user logs in/out.
 */
export const setClientConfig = (role) => {
	currentRole = role;
	// Sync to localStorage for persistence across refreshes
	if (role) localStorage.setItem("userRole", role);
	else localStorage.removeItem("userRole");
};

/**
 * A generic helper function to handle all backend API communications.
 * * This function abstracts the fetch logic, including authentication credentials,
 * default headers, and centralized error handling. It also supports a mock mode
 * for local development and testing.
 * * @async
 * @param {string} endpoint - The relative API endpoint (e.g., '/user/profile').
 * @param {Object} [options={}] - Standard fetch options (method, body, headers, etc.).
 * @returns {Promise<Object>} A standardized response object:
 * - success: {boolean} True if the request was successful.
 * - data: {any} The parsed response body from the server.
 * - error: {string|null} Error message if the request failed.
 * - statusCode: {number|null} The HTTP status code of the response.
 */
export const apiCall = async (endpoint, options = {}) => {
	// Mock API responses
	if (USE_MOCK_API) {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 300));

		// --- USER / SETTINGS ---
		if (endpoint.match(/^\/user\//)) {
			const method = options?.method || "GET";
			// const userRole = localStorage.getItem("userRole") || "professor";
			const targetData =
				currentRole === "dean"
					? Mocks.MOCK_DEAN_DASHBOARD_DATA
					: currentRole === "hod"
						? Mocks.MOCK_HOD_DASHBOARD_DATA
						: currentRole === "professor"
							? Mocks.MOCK_PROFESSOR_DASHBOARD_DATA
							: Mocks.MOCK_STUDENT_DASHBOARD_DATA;

			// GET: Fetch dashboard overview data based on user role
			if (
				endpoint.match(/^\/user\/dashboard-overview$/) &&
				method === "GET"
			) {
				return {
					success: true,
					data: targetData,
				};
			}

			// PUT: Update user profile information
			if (endpoint.match(/^\/user\/check-username/) && method === "PUT") {
				try {
					const body = JSON.parse(options.body);
					// Update the nested user object directly
					Object.assign(targetData.user, body);
					return { success: true, data: targetData.user };
				} catch (err) {
					return { success: false, message: "Update failed" };
				}
			}

			// GET: Check if a username is already taken
			if (endpoint.match(/^\/user\/settings/) && method === "GET") {
				const urlParams = new URLSearchParams(endpoint.split("?")[1]);
				const username = urlParams.get("username") || "";

				const isTaken =
					Mocks.MOCK_PROFESSOR_DASHBOARD_DATA.user.name.toLowerCase() ===
						username.toLowerCase() ||
					Mocks.MOCK_STUDENT_DASHBOARD_DATA.user.name.toLowerCase() ===
						username.toLowerCase();

				return {
					success: true,
					data: { available: !isTaken },
				};
			}

			// POST: Submit a bug report
			if (endpoint.match(/^\/user\/bug-report$/) && method === "POST") {
				return {
					success: true,
					message: "Bug report received successfully.",
				};
			}
		}

		// Handle archived courses endpoint
		if (endpoint === "/cohort/archived") {
			return {
				success: true,
				data: Mocks.MOCK_ARCHIVED_COURSES,
			};
		}
		// Handle CHECK AND ARCHIVE EXPIRED courses
		if (endpoint === "/cohort/check-expired" && options.method === "POST") {
			console.log("🕐 [MOCK API] Checking for expired courses...");

			const now = new Date();
			let archivedCount = 0;

			// Check in SHARED_COHORTS
			Mocks.SHARED_COHORTS.forEach((cohort) => {
				if (cohort.end_date && cohort.status !== "Archived") {
					const endDate = new Date(cohort.end_date);
					if (endDate < now) {
						console.log(
							`📦 [MOCK API] Auto-archiving expired course: ${cohort.cohort_name}`,
						);
						cohort.status = "Archived";
						cohort.visibility = "Archived";

						// Move to archived courses
						Mocks.MOCK_ARCHIVED_COURSES.push({ ...cohort });
						archivedCount++;
					}
				}
			});

			// Check in dashboard data
			// const userRole = localStorage.getItem("userRole");
			const dashboardData =
				currentRole === "professor"
					? Mocks.MOCK_PROFESSOR_DASHBOARD_DATA
					: Mocks.MOCK_STUDENT_DASHBOARD_DATA;

			// Check created cohorts
			const createdToArchive = dashboardData.createdCohorts.filter(
				(cohort) => {
					if (cohort.end_date && cohort.status !== "Archived") {
						const endDate = new Date(cohort.end_date);
						return endDate < now;
					}
					return false;
				},
			);

			createdToArchive.forEach((cohort) => {
				cohort.status = "Archived";
				cohort.visibility = "Archived";
				Mocks.MOCK_ARCHIVED_COURSES.push({ ...cohort });
			});

			dashboardData.createdCohorts = dashboardData.createdCohorts.filter(
				(cohort) => !createdToArchive.includes(cohort),
			);

			// Check joined cohorts
			const joinedToArchive = dashboardData.joinedCohorts.filter(
				(cohort) => {
					if (cohort.end_date && cohort.status !== "Archived") {
						const endDate = new Date(cohort.end_date);
						return endDate < now;
					}
					return false;
				},
			);

			joinedToArchive.forEach((cohort) => {
				cohort.status = "Archived";
				cohort.visibility = "Archived";
				Mocks.MOCK_ARCHIVED_COURSES.push({ ...cohort });
			});

			dashboardData.joinedCohorts = dashboardData.joinedCohorts.filter(
				(cohort) => !joinedToArchive.includes(cohort),
			);

			const totalArchived =
				createdToArchive.length + joinedToArchive.length;

			console.log(
				`✅ [MOCK API] Auto-archived ${totalArchived} expired courses`,
			);

			return {
				success: true,
				data: {
					archivedCount: totalArchived,
					message: `${totalArchived} course(s) auto-archived`,
				},
			};
		}

		// Handle MANUAL ARCHIVE course endpoint
		if (
			endpoint.match(/^\/cohort\/(\d+)\/archive$/) &&
			options.method === "POST"
		) {
			const courseId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/archive$/)[1],
			);

			console.log("📦 [MOCK API] Manually archiving course:", courseId);

			// Update in SHARED_COHORTS
			const courseInShared = Mocks.SHARED_COHORTS.find(
				(c) => c.id === courseId,
			);
			if (courseInShared) {
				courseInShared.status = "Archived";
				courseInShared.visibility = "Archived";
			}

			// Move from active to archived in dashboard data
			// const userRole = localStorage.getItem("userRole");
			const dashboardData =
				currentRole === "professor"
					? Mocks.MOCK_PROFESSOR_DASHBOARD_DATA
					: Mocks.MOCK_STUDENT_DASHBOARD_DATA;

			// Remove from created cohorts
			const createdIndex = dashboardData.createdCohorts.findIndex(
				(c) => c.id === courseId,
			);
			if (createdIndex !== -1) {
				const archivedCourse = dashboardData.createdCohorts.splice(
					createdIndex,
					1,
				)[0];
				archivedCourse.status = "Archived";
				archivedCourse.visibility = "Archived";
				Mocks.MOCK_ARCHIVED_COURSES.push(archivedCourse);

				console.log(
					"✅ [MOCK API] Course archived from created cohorts",
				);
				return {
					success: true,
					message: "Course archived successfully",
				};
			}

			// Remove from joined cohorts
			const joinedIndex = dashboardData.joinedCohorts.findIndex(
				(c) => c.id === courseId,
			);
			if (joinedIndex !== -1) {
				const archivedCourse = dashboardData.joinedCohorts.splice(
					joinedIndex,
					1,
				)[0];
				archivedCourse.status = "Archived";
				archivedCourse.visibility = "Archived";
				Mocks.MOCK_ARCHIVED_COURSES.push(archivedCourse);

				console.log(
					"✅ [MOCK API] Course archived from joined cohorts",
				);
				return {
					success: true,
					message: "Course archived successfully",
				};
			}

			console.error("❌ [MOCK API] Course not found:", courseId);
			return {
				success: false,
				error: "Course not found",
			};
		}

		// Handle course details endpoints
		if (endpoint.match(/^\/cohort\/(\d+)\/details$/)) {
			const courseId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/details$/)[1],
			);

			// Get user role from localStorage to determine is_admin
			// const userRole = localStorage.getItem("userRole");
			const isAdmin = currentRole === "professor";

			// Get current user ID to check group membership
			const authUserStr = localStorage.getItem("authUser");
			const authUser = authUserStr ? JSON.parse(authUserStr) : null;
			const currentUserId = authUser?.id || 1;

			// Search for cohort data in both MOCK_COURSE_DETAILS and SHARED_COHORTS
			const courseDetails = Mocks.MOCK_COURSE_DETAILS.find(
				(c) => c.id === courseId,
			);
			const sharedCohortData = Mocks.SHARED_COHORTS.find((c) => c.id === courseId);

			if (courseDetails || sharedCohortData) {
				// Calculate assignment stats from MOCK_COURSE_ASSIGNMENTS
				const courseAssignments =
					Mocks.MOCK_COURSE_ASSIGNMENTS[courseId] || [];
				const totalAssignments = courseAssignments.length;
				
				// Prioritize data from SHARED_COHORTS, then MOCK_COURSE_DETAILS, then fallbacks
				const memberCount = sharedCohortData?.member_count || courseDetails?.memberCount || 45;
				const groupCount = sharedCohortData?.group_count || courseDetails?.groupCount || 0;

				let completedAssignments, pendingAssignments;

				if (isAdmin) {
					// For professor: completed = ALL students/groups submitted, ongoing = not all submitted
					completedAssignments = courseAssignments.filter((a) => {
						if (a.type === "group") {
							// For group assignments: completed if all groups submitted
							return (
								a.submissions &&
								a.submissions.length === groupCount &&
								groupCount > 0
							);
						} else {
							// For individual assignments: completed if all students submitted
							return (
								a.submissions &&
								a.submissions.length === memberCount
							);
						}
					}).length;
					pendingAssignments = courseAssignments.filter((a) => {
						if (a.type === "group") {
							return (
								!a.submissions ||
								a.submissions.length < groupCount ||
								groupCount === 0
							);
						} else {
							return (
								!a.submissions ||
								a.submissions.length < memberCount
							);
						}
					}).length;
				} else {
					// For student: completed = current student has submitted, ongoing = current student hasn't submitted
					completedAssignments = courseAssignments.filter((a) => {
						return a.status === "submitted" || a.submittedAt;
					}).length;
					pendingAssignments = courseAssignments.filter((a) => {
						return a.status !== "submitted" && !a.submittedAt;
					}).length;
				}

				// Check if current user is in a group and if they're a leader
				let groupName = null;
				let isGroupLeader = false;

				if (!isAdmin) {
					const courseMemberData =
						Mocks.MOCK_COURSE_MEMBERS[courseId];
					if (courseMemberData && courseMemberData.groups) {
						for (const group of courseMemberData.groups) {
							if (group.members.includes(currentUserId)) {
								groupName = group.name;
								isGroupLeader =
									group.members[0] === currentUserId; // First member is leader
								break;
							}
						}
					}
				}

				return {
					success: true,
					data: {
						...(courseDetails || {}),
						...(sharedCohortData || {}),
						id: courseId, // Ensure ID consistency
						is_admin: isAdmin,
						user_type: isAdmin ? 1 : 0,
						pending_assignments: pendingAssignments,
						completed_assignments: completedAssignments,
						total_assignments: totalAssignments,
						group_name: groupName,
						is_group_leader: isGroupLeader,
						// Ensure UI detail sections are present
						detail_sections: courseDetails?.detail_sections || [
							{
								id: 1,
								title: "Course Overview",
								subsec_description: sharedCohortData?.cohort_description || "Welcome to the course."
							},
							{
								id: 2,
								title: "Learning Objectives",
								subsec_description:
									"By the end of this course, you will be able to:\n\n Knowledge & Understanding:\n• Demonstrate comprehensive understanding of core theoretical concepts and principles\n• Explain the historical context and evolution of the field\n• Analyze and compare different methodologies and approaches\n• Identify key trends and future directions in the domain\n\n Practical Skills:\n• Apply learned concepts to solve complex real-world problems\n• Design and implement effective solutions using industry-standard tools\n• Develop proficiency in relevant programming languages and frameworks\n• Create well-documented, maintainable, and scalable code\n\n Critical Thinking:\n• Evaluate different approaches and select optimal solutions\n• Debug and troubleshoot complex issues systematically\n• Conduct independent research and stay current with developments\n• Make data-driven decisions based on thorough analysis\n\n Collaboration & Communication:\n• Work effectively in team environments on group projects\n• Communicate technical concepts clearly to diverse audiences\n• Participate actively in peer reviews and constructive feedback\n• Present findings and solutions professionally",
							},
							{
								id: 3,
								title: "Course Schedule",
								subsec_description:
									"Detailed Weekly Breakdown:\n\nWeek 1-2: Foundations & Introduction\n• Course overview and learning outcomes\n• Introduction to fundamental concepts and terminology\n• Setting up development environment and tools\n• First hands-on exercises and basic implementations\n\nWeek 3-5: Core Concepts\n• Deep dive into essential theoretical frameworks\n• Advanced data structures and algorithms\n• Design patterns and best practices\n• Mid-term project kickoff\n\nWeek 6-8: Advanced Topics\n• Specialized techniques and optimization strategies\n• Integration with external systems and APIs\n• Performance tuning and scalability considerations\n• Security and error handling\n\nWeek 9-11: Real-World Applications\n• Case studies from industry leaders\n• Building complete end-to-end solutions\n• Testing, debugging, and deployment strategies\n• Group project development\n\nWeek 12-14: Integration & Review\n• Advanced integration patterns\n• Code review and refactoring workshops\n• Final project presentations\n• Comprehensive review and exam preparation\n\nWeek 15: Finals\n• Final examination\n• Project submissions and evaluations\n• Course wrap-up and next steps",
							},
							{
								id: 4,
								title: "Prerequisites",
								subsec_description:
									"Required Background:\n\nTechnical Prerequisites:\n• Basic programming knowledge in at least one language (Python, Java, or JavaScript)\n• Understanding of fundamental data structures (arrays, lists, trees)\n• Familiarity with basic algorithms and complexity analysis\n• Comfort with command-line interfaces and version control (Git)\n\nMathematical Prerequisites:\n• High school level algebra and logic\n• Basic understanding of discrete mathematics\n• Elementary statistics and probability (helpful but not required)\n\nRecommended (Not Required):\n• Previous coursework in computer science or related field\n• Experience with web development or software engineering\n• Exposure to database concepts and SQL\n• Familiarity with Agile/Scrum methodologies\n\n Note: If you're unsure about your background, please reach out to the instructor during the first week for guidance.",
							},
							{
								id: 5,
								title: "Grading Criteria",
								subsec_description:
									"Assessment Breakdown:\n\nAssignments (30%)\n• Weekly problem sets and coding exercises\n• Individual submissions with automatic grading\n• Late submissions accepted with 10% penalty per day\n• Best 8 out of 10 assignments counted\n\nQuizzes (15%)\n• Bi-weekly online quizzes covering recent topics\n• Multiple choice and short answer format\n• Open for 48 hours, single attempt\n• Lowest quiz score dropped\n\nMid-term Project (20%)\n• Individual or pair programming project\n• Real-world problem solving\n• Code quality, documentation, and presentation evaluated\n• Due Week 7\n\nFinal Project (25%)\n• Team-based comprehensive project (3-4 members)\n• Incorporates all course concepts\n• Includes written report and presentation\n• Peer evaluation component\n\nParticipation & Engagement (10%)\n• Active participation in discussions and forums\n• Helping peers and collaborative learning\n• Attendance in live sessions\n• Code reviews and constructive feedback\n\nGrading Scale:\nA: 90-100% | B: 80-89% | C: 70-79% | D: 60-69% | F: Below 60%",
							},
							{
								id: 6,
								title: "Required Resources",
								subsec_description:
									"Course Materials:\n\nTextbooks:\n• Primary: 'Fundamentals of Computer Science' (Latest Edition) - Available online\n• Reference: 'Advanced Programming Patterns' - Recommended but optional\n• All required readings will be provided through the course portal\n\nSoftware & Tools:\n• IDE: Visual Studio Code, IntelliJ IDEA, or PyCharm (free versions available)\n• Version Control: Git and GitHub account (free)\n• Development Tools: Node.js, Python 3.x, or Java JDK\n• Communication: Slack workspace for course discussions\n• Project Management: Trello or Jira (student licenses)\n\nOnline Resources:\n• Course website with lecture notes and recordings\n• Interactive coding platform for exercises\n• Discussion forums for Q&A and collaboration\n• Video tutorials and supplementary materials\n• Industry blogs and documentation links\n\nHardware Requirements:\n• Computer with at least 8GB RAM recommended\n• Stable internet connection for live sessions\n• Webcam and microphone for presentations\n\n All software used in this course is free or has free student versions available.",
							},
						]
					},
				};
			}

			// Map course IDs from dashboard mock data
			const currentDashboardData =
				currentRole === "professor"
					? Mocks.MOCK_PROFESSOR_DASHBOARD_DATA
					: Mocks.MOCK_STUDENT_DASHBOARD_DATA;

			const dashboardCourse = [
				...currentDashboardData.createdCohorts,
				...currentDashboardData.joinedCohorts,
			].find((c) => c.id === courseId);

			if (dashboardCourse) {
				// Calculate assignment stats from MOCK_COURSE_ASSIGNMENTS
				const courseAssignments =
					Mocks.MOCK_COURSE_ASSIGNMENTS[courseId] || [];
				const totalAssignments = courseAssignments.length;
				const memberCount = dashboardCourse.member_count || 45;
				const groupCount = dashboardCourse.group_count || 0;

				let completedAssignments, pendingAssignments;

				if (isAdmin) {
					// For professor: completed = ALL students/groups submitted, ongoing = not all submitted
					completedAssignments = courseAssignments.filter((a) => {
						if (a.type === "group") {
							// For group assignments: completed if all groups submitted
							return (
								a.submissions &&
								a.submissions.length === groupCount &&
								groupCount > 0
							);
						} else {
							// For individual assignments: completed if all students submitted
							return (
								a.submissions &&
								a.submissions.length === memberCount
							);
						}
					}).length;
					pendingAssignments = courseAssignments.filter((a) => {
						if (a.type === "group") {
							return (
								!a.submissions ||
								a.submissions.length < groupCount ||
								groupCount === 0
							);
						} else {
							return (
								!a.submissions ||
								a.submissions.length < memberCount
							);
						}
					}).length;
				} else {
					// For student: completed = current student has submitted, ongoing = current student hasn't submitted
					completedAssignments = courseAssignments.filter((a) => {
						return a.status === "submitted" || a.submittedAt;
					}).length;
					pendingAssignments = courseAssignments.filter((a) => {
						return a.status !== "submitted" && !a.submittedAt;
					}).length;
				}

				// Check if current user is in a group and if they're a leader
				let groupName = dashboardCourse.group_name || null;
				let isGroupLeader = dashboardCourse.is_group_leader || false;

				if (!isAdmin) {
					const courseMemberData =
						Mocks.MOCK_COURSE_MEMBERS[courseId];
					if (courseMemberData && courseMemberData.groups) {
						for (const group of courseMemberData.groups) {
							if (group.members.includes(currentUserId)) {
								groupName = group.name;
								isGroupLeader =
									group.members[0] === currentUserId; // First member is leader
								break;
							}
						}
					}
				}

				return {
					success: true,
					data: {
						id: courseId,
						cohort_name: dashboardCourse.cohort_name,
						course_codes:
							dashboardCourse.course_codes ||
							`CS${400 + courseId}`,
						cohort_description: dashboardCourse.cohort_description,
						status: dashboardCourse.status || "Live",
						visibility: dashboardCourse.visibility || "Active",
						organization_name: "Mahindra University",
						instructor: "Professor",
						start_date:
							dashboardCourse.start_date ||
							"2026-01-20T00:00:00Z",
						end_date:
							dashboardCourse.end_date || "2026-05-15T00:00:00Z",
						created_at: dashboardCourse.created_at,
						member_count: memberCount,
						group_count: groupCount,
						is_admin: isAdmin,
						user_type: isAdmin ? 1 : 0, // 1 = professor, 0 = student
						pending_assignments: pendingAssignments,
						completed_assignments: completedAssignments,
						total_assignments: totalAssignments,
						group_name: groupName,
						is_group_leader: isGroupLeader,
						detail_sections: [
							{
								id: 1,
								title: "Course Overview",
								subsec_description:
									dashboardCourse.cohort_description ||
									"Welcome to this comprehensive course! This course is designed to provide you with in-depth knowledge and practical skills in the subject area. Throughout the semester, you will engage with cutting-edge concepts, participate in hands-on projects, and collaborate with peers to solve real-world problems. The course combines theoretical foundations with practical applications, ensuring you gain both conceptual understanding and implementation experience. Our curriculum is carefully structured to build your knowledge progressively, starting from fundamental principles and advancing to complex applications. You'll have access to state-of-the-art resources, industry-standard tools, and expert guidance throughout your learning journey.",
							},
							{
								id: 2,
								title: "Learning Objectives",
								subsec_description:
									"By the end of this course, you will be able to:\n\n Knowledge & Understanding:\n• Demonstrate comprehensive understanding of core theoretical concepts and principles\n• Explain the historical context and evolution of the field\n• Analyze and compare different methodologies and approaches\n• Identify key trends and future directions in the domain\n\n Practical Skills:\n• Apply learned concepts to solve complex real-world problems\n• Design and implement effective solutions using industry-standard tools\n• Develop proficiency in relevant programming languages and frameworks\n• Create well-documented, maintainable, and scalable code\n\n Critical Thinking:\n• Evaluate different approaches and select optimal solutions\n• Debug and troubleshoot complex issues systematically\n• Conduct independent research and stay current with developments\n• Make data-driven decisions based on thorough analysis\n\n Collaboration & Communication:\n• Work effectively in team environments on group projects\n• Communicate technical concepts clearly to diverse audiences\n• Participate actively in peer reviews and constructive feedback\n• Present findings and solutions professionally",
							},
							{
								id: 3,
								title: "Course Schedule",
								subsec_description:
									"Detailed Weekly Breakdown:\n\nWeek 1-2: Foundations & Introduction\n• Course overview and learning outcomes\n• Introduction to fundamental concepts and terminology\n• Setting up development environment and tools\n• First hands-on exercises and basic implementations\n\nWeek 3-5: Core Concepts\n• Deep dive into essential theoretical frameworks\n• Advanced data structures and algorithms\n• Design patterns and best practices\n• Mid-term project kickoff\n\nWeek 6-8: Advanced Topics\n• Specialized techniques and optimization strategies\n• Integration with external systems and APIs\n• Performance tuning and scalability considerations\n• Security and error handling\n\nWeek 9-11: Real-World Applications\n• Case studies from industry leaders\n• Building complete end-to-end solutions\n• Testing, debugging, and deployment strategies\n• Group project development\n\nWeek 12-14: Integration & Review\n• Advanced integration patterns\n• Code review and refactoring workshops\n• Final project presentations\n• Comprehensive review and exam preparation\n\nWeek 15: Finals\n• Final examination\n• Project submissions and evaluations\n• Course wrap-up and next steps",
							},
							{
								id: 4,
								title: "Prerequisites",
								subsec_description:
									"Required Background:\n\nTechnical Prerequisites:\n• Basic programming knowledge in at least one language (Python, Java, or JavaScript)\n• Understanding of fundamental data structures (arrays, lists, trees)\n• Familiarity with basic algorithms and complexity analysis\n• Comfort with command-line interfaces and version control (Git)\n\nMathematical Prerequisites:\n• High school level algebra and logic\n• Basic understanding of discrete mathematics\n• Elementary statistics and probability (helpful but not required)\n\nRecommended (Not Required):\n• Previous coursework in computer science or related field\n• Experience with web development or software engineering\n• Exposure to database concepts and SQL\n• Familiarity with Agile/Scrum methodologies\n\n Note: If you're unsure about your background, please reach out to the instructor during the first week for guidance.",
							},
							{
								id: 5,
								title: "Grading Criteria",
								subsec_description:
									"Assessment Breakdown:\n\nAssignments (30%)\n• Weekly problem sets and coding exercises\n• Individual submissions with automatic grading\n• Late submissions accepted with 10% penalty per day\n• Best 8 out of 10 assignments counted\n\nQuizzes (15%)\n• Bi-weekly online quizzes covering recent topics\n• Multiple choice and short answer format\n• Open for 48 hours, single attempt\n• Lowest quiz score dropped\n\nMid-term Project (20%)\n• Individual or pair programming project\n• Real-world problem solving\n• Code quality, documentation, and presentation evaluated\n• Due Week 7\n\nFinal Project (25%)\n• Team-based comprehensive project (3-4 members)\n• Incorporates all course concepts\n• Includes written report and presentation\n• Peer evaluation component\n\nParticipation & Engagement (10%)\n• Active participation in discussions and forums\n• Helping peers and collaborative learning\n• Attendance in live sessions\n• Code reviews and constructive feedback\n\nGrading Scale:\nA: 90-100% | B: 80-89% | C: 70-79% | D: 60-69% | F: Below 60%",
							},
							{
								id: 6,
								title: "Required Resources",
								subsec_description:
									"Course Materials:\n\nTextbooks:\n• Primary: 'Fundamentals of Computer Science' (Latest Edition) - Available online\n• Reference: 'Advanced Programming Patterns' - Recommended but optional\n• All required readings will be provided through the course portal\n\nSoftware & Tools:\n• IDE: Visual Studio Code, IntelliJ IDEA, or PyCharm (free versions available)\n• Version Control: Git and GitHub account (free)\n• Development Tools: Node.js, Python 3.x, or Java JDK\n• Communication: Slack workspace for course discussions\n• Project Management: Trello or Jira (student licenses)\n\nOnline Resources:\n• Course website with lecture notes and recordings\n• Interactive coding platform for exercises\n• Discussion forums for Q&A and collaboration\n• Video tutorials and supplementary materials\n• Industry blogs and documentation links\n\nHardware Requirements:\n• Computer with at least 8GB RAM recommended\n• Stable internet connection for live sessions\n• Webcam and microphone for presentations\n\n All software used in this course is free or has free student versions available.",
							},
						],
					},
				};
			}

			// Return default details for any other course ID

			// Calculate assignment stats from MOCK_COURSE_ASSIGNMENTS
			const courseAssignments =
				Mocks.MOCK_COURSE_ASSIGNMENTS[courseId] || [];
			const totalAssignments = courseAssignments.length;
			// Get actual counts from MOCK_COURSE_MEMBERS or use defaults
			const courseMembers = Mocks.MOCK_COURSE_MEMBERS[courseId];
			const memberCount = courseMembers?.students?.length || 45;
			const groupCount = courseMembers?.groups?.length || 3;

			let completedAssignments, pendingAssignments;

			if (isAdmin) {
				// For professor: completed = ALL students/groups submitted, ongoing = not all submitted
				completedAssignments = courseAssignments.filter((a) => {
					if (a.type === "group") {
						// For group assignments: completed if all groups submitted
						return (
							a.submissions &&
							a.submissions.length === groupCount &&
							groupCount > 0
						);
					} else {
						// For individual assignments: completed if all students submitted
						return (
							a.submissions &&
							a.submissions.length === memberCount
						);
					}
				}).length;
				pendingAssignments = courseAssignments.filter((a) => {
					if (a.type === "group") {
						return (
							!a.submissions ||
							a.submissions.length < groupCount ||
							groupCount === 0
						);
					} else {
						return (
							!a.submissions || a.submissions.length < memberCount
						);
					}
				}).length;
			} else {
				// For student: completed = current student has submitted, ongoing = current student hasn't submitted
				completedAssignments = courseAssignments.filter((a) => {
					return a.status === "submitted" || a.submittedAt;
				}).length;
				pendingAssignments = courseAssignments.filter((a) => {
					return a.status !== "submitted" && !a.submittedAt;
				}).length;
			}

			// Check if current user is in a group and if they're a leader
			let groupName = null;
			let isGroupLeader = false;

			if (!isAdmin) {
				const courseMemberData = Mocks.MOCK_COURSE_MEMBERS[courseId];
				if (courseMemberData && courseMemberData.groups) {
					for (const group of courseMemberData.groups) {
						if (group.members.includes(currentUserId)) {
							groupName = group.name;
							isGroupLeader = group.members[0] === currentUserId; // First member is leader
							break;
						}
					}
				}
			}

			return {
				success: true,
				data: {
					id: courseId,
					cohort_name: "Course " + courseId,
					course_code: `CS${400 + courseId}`,
					cohort_description: "Course description",
					status: "Live",
					visibility: "Active",
					organization_name: "Mahindra University",
					instructor: "Professor",
					start_date: "2026-01-20T00:00:00Z",
					end_date: "2026-05-15T00:00:00Z",
					created_at: new Date().toISOString(),
					member_count: memberCount,
					group_count: groupCount,
					is_admin: isAdmin,
					user_type: isAdmin ? 1 : 0, // 1 = professor, 0 = student
					pending_assignments: pendingAssignments,
					completed_assignments: completedAssignments,
					total_assignments: totalAssignments,
					group_name: groupName,
					is_group_leader: isGroupLeader,
					detail_sections: [
						{
							id: 1,
							title: "Course Overview",
							subsec_description:
								"Welcome to this comprehensive course! This course is designed to provide you with in-depth knowledge and practical skills in the subject area. Throughout the semester, you will engage with cutting-edge concepts, participate in hands-on projects, and collaborate with peers to solve real-world problems. The course combines theoretical foundations with practical applications, ensuring you gain both conceptual understanding and implementation experience.",
						},
						{
							id: 2,
							title: "Learning Objectives",
							subsec_description:
								"By the end of this course, you will be able to:\n\n📚 Knowledge & Understanding:\n• Demonstrate comprehensive understanding of core theoretical concepts\n• Analyze and compare different methodologies and approaches\n• Identify key trends and future directions in the domain\n\n🛠️ Practical Skills:\n• Apply learned concepts to solve complex real-world problems\n• Design and implement effective solutions using industry tools\n• Develop proficiency in relevant technologies and frameworks\n\n🔍 Critical Thinking:\n• Evaluate different approaches and select optimal solutions\n• Debug and troubleshoot complex issues systematically\n• Make data-driven decisions based on analysis",
						},
						{
							id: 3,
							title: "Course Schedule",
							subsec_description:
								"📅 **Weekly Breakdown:**\n\n**Weeks 1-2: Foundations**\n• Introduction and fundamental concepts\n• Setting up development environment\n• First hands-on exercises\n\n**Weeks 3-5: Core Concepts**\n• Essential theoretical frameworks\n• Advanced techniques\n• Mid-term project\n\n**Weeks 6-8: Advanced Topics**\n• Specialized techniques\n• Integration patterns\n• Performance optimization\n\n**Weeks 9-11: Applications**\n• Real-world case studies\n• End-to-end solutions\n• Group project work\n\n**Weeks 12-15: Review & Finals**\n• Integration and review\n• Final presentations\n• Comprehensive examination",
						},
						{
							id: 4,
							title: "Prerequisites",
							subsec_description:
								"📋 **Required Background:**\n\n• Basic programming knowledge in at least one language\n• Understanding of fundamental data structures\n• Familiarity with version control (Git)\n• Command-line interface experience\n\n**Recommended:**\n• Previous coursework in related field\n• Experience with software development\n• Basic mathematics and logic skills",
						},
						{
							id: 5,
							title: "Grading Criteria",
							subsec_description:
								"📊 **Assessment Breakdown:**\n\n• Assignments: 30%\n• Quizzes: 15%\n• Mid-term Project: 20%\n• Final Project: 25%\n• Participation: 10%\n\n**Grading Scale:**\nA: 90-100% | B: 80-89% | C: 70-79% | D: 60-69%",
						},
					],
				},
			};
		}

		// Handle course members endpoint
		if (endpoint.match(/^\/cohort\/(\d+)\/members/)) {
			const courseId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/members/)[1],
			);

			// Get current user from localStorage
			const authUserStr = localStorage.getItem("authUser");
			const authUser = authUserStr ? JSON.parse(authUserStr) : null;
			const currentUserId = authUser?.id || 1; // Fallback to 1 if not found

			const courseMemberData = Mocks.MOCK_COURSE_MEMBERS[courseId];
			if (courseMemberData) {
				// Transform students to participants format
				const participants = courseMemberData.students.map(
					(student) => ({
						email: `${student.rollNumber.toLowerCase()}@mahindruniversity.edu.in`,
						user_details: {
							user_id: student.id,
							display_name: student.rollNumber,
							username: student.name,
							profile_pic: null,
							is_active: true,
							created_at: "2026-01-15T00:00:00Z",
						},
					}),
				);

				// Transform groups to proper format
				const groups = courseMemberData.groups.map((group) => {
					const cohortGroupMembers = group.members.map((memberId) => {
						const student = courseMemberData.students.find(
							(s) => s.id === memberId,
						);
						return {
							user_id: memberId,
							email: student
								? `${student.rollNumber.toLowerCase()}@mahindruniversity.edu.in`
								: `user${memberId}@example.com`,
							role:
								group.members[0] === memberId
									? "leader"
									: "member",
						};
					});

					return {
						id: group.id,
						group_name: group.name,
						group_description: `Group with ${group.members.length} members`,
						project_name: `${group.name} Project`,
						created_at: "2026-01-20T00:00:00Z",
						CohortGroupMembers: cohortGroupMembers,
					};
				});

				// Check if current user is in a group
				const isInGroup = courseMemberData.groups.some(
					(group) =>
						group.members.includes(currentUserId) ||
						group.isYouInGroup,
				);

				return {
					success: true,
					data: {
						participants: participants,
						groups: groups,
						is_group: isInGroup,
					},
				};
			}

			// Return empty data for unknown course
			return {
				success: true,
				data: {
					participants: [],
					groups: [],
					is_group: false,
				},
			};
		}

		// Handle course assignments endpoint
		if (
			endpoint.match(/^\/cohort\/(\d+)\/assignments$/) &&
			options.method === "GET"
		) {
			const courseId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/assignments$/)[1],
			);

			const courseAssignments = Mocks.MOCK_COURSE_ASSIGNMENTS[courseId];
			if (courseAssignments) {
				// Transform to match API response format
				const transformedAssignments = courseAssignments.map(
					(assignment) => ({
						id: assignment.id,
						name: assignment.title, // ← ADD THIS
						title: assignment.title,
						description: assignment.description,
						deadline: assignment.dueDate,
						marks: assignment.marks || "10",
						type: assignment.type,
						status: assignment.status,
						submittedAt: assignment.submittedAt,
						submissions: assignment.submissions || [],
						created_at: assignment.createdAt,
						cohort_id: courseId,
						submissionLink: assignment.submissionLink, // ← ADD THIS
					}),
				);

				return {
					success: true,
					data: {
						assignments: transformedAssignments,
					},
				};
			}

			// Return empty assignments for unknown course
			return {
				success: true,
				data: {
					assignments: [],
				},
			};
		}
		if (
			endpoint.match(/^\/cohort\/(\d+)\/assignments$/) &&
			options.method === "POST"
		) {
			const courseId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/assignments$/)[1],
			);

			console.log(
				"🔄 [MOCK API] Creating assignment for cohort:",
				courseId,
			);
			console.log("📝 [MOCK API] Assignment data:", options.body);

			const assignmentData = JSON.parse(options.body);

			// Create new assignment with proper structure
			const newAssignment = {
				id: Date.now(), // Generate unique ID
				name: assignmentData.name || assignmentData.title,
				title: assignmentData.name || assignmentData.title,
				description: assignmentData.description,
				deadline: assignmentData.deadline,
				dueDate: assignmentData.deadline,
				marks: assignmentData.marks || "10",
				type: assignmentData.type || "individual",
				status: "pending",
				submittedAt: null,
				submissions: [],
				created_at: new Date().toISOString(),
				createdAt: new Date().toISOString(),
				createdBy: "Prof. Jane Smith",
				cohort_id: courseId,
				cohortId: courseId,
				submissionLink: assignmentData.submissionLink || "",
			};

			// Initialize course assignments array if it doesn't exist
			if (!Mocks.MOCK_COURSE_ASSIGNMENTS[courseId]) {
				Mocks.MOCK_COURSE_ASSIGNMENTS[courseId] = [];
			}

			// Add to mock data
			Mocks.MOCK_COURSE_ASSIGNMENTS[courseId].push(newAssignment);

			console.log(
				"✅ [MOCK API] Assignment created successfully:",
				newAssignment,
			);
			console.log(
				"📦 [MOCK API] Total assignments now:",
				Mocks.MOCK_COURSE_ASSIGNMENTS[courseId].length,
			);

			return {
				success: true,
				data: newAssignment,
			};
		}

		// Handle UPDATE assignment endpoint
		if (
			endpoint.match(/^\/cohort\/(\d+)\/assignments\/(\d+)$/) &&
			options.method === "PUT"
		) {
			const courseId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/assignments\/(\d+)$/)[1],
			);
			const assignmentId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/assignments\/(\d+)$/)[2],
			);

			console.log("🔄 [MOCK API] Updating assignment:", assignmentId);

			const courseAssignments = Mocks.MOCK_COURSE_ASSIGNMENTS[courseId];
			if (courseAssignments) {
				const index = courseAssignments.findIndex(
					(a) => a.id === assignmentId,
				);
				if (index !== -1) {
					const updatedData = JSON.parse(options.body);
					courseAssignments[index] = {
						...courseAssignments[index],
						...updatedData,
						name: updatedData.name || updatedData.title,
						title: updatedData.name || updatedData.title,
						updated_at: new Date().toISOString(),
					};

					console.log("✅ [MOCK API] Assignment updated");

					return {
						success: true,
						data: courseAssignments[index],
					};
				}
			}

			return {
				success: false,
				error: "Assignment not found",
			};
		}

		// Handle DELETE assignment endpoint
		if (
			endpoint.match(/^\/cohort\/(\d+)\/assignments\/(\d+)$/) &&
			options.method === "DELETE"
		) {
			const courseId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/assignments\/(\d+)$/)[1],
			);
			const assignmentId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/assignments\/(\d+)$/)[2],
			);

			console.log("🔄 [MOCK API] Deleting assignment:", assignmentId);

			const courseAssignments = Mocks.MOCK_COURSE_ASSIGNMENTS[courseId];
			if (courseAssignments) {
				const index = courseAssignments.findIndex(
					(a) => a.id === assignmentId,
				);
				if (index !== -1) {
					courseAssignments.splice(index, 1);

					console.log("✅ [MOCK API] Assignment deleted");

					return {
						success: true,
						message: "Assignment deleted successfully",
					};
				}
			}

			return {
				success: false,
				error: "Assignment not found",
			};
		}

		// Handle group details endpoint with cohortId
		if (endpoint.match(/^\/cohort\/(\d+)\/group\/(\d+)\/details$/)) {
			const cohortId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/group\/(\d+)\/details$/)[1],
			);
			const groupId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/group\/(\d+)\/details$/)[2],
			);

			// Find the group in the specific course
			const courseMemberData = Mocks.MOCK_COURSE_MEMBERS[cohortId];
			if (courseMemberData) {
				const group = courseMemberData.groups.find(
					(g) => g.id === groupId,
				);

				if (group) {
					// Get member details
					const members = group.members.map((memberId, index) => {
						const student = courseMemberData.students.find(
							(s) => s.id === memberId,
						);
						const isLeader = group.members[0] === memberId;
						return {
							user: {
								user_id: memberId,
								email: student
									? `${student.rollNumber.toLowerCase()}@mahindruniversity.edu.in`
									: `user${memberId}@example.com`,
								display_name: student
									? student.rollNumber
									: `USER${memberId}`,
								username: student
									? student.name
									: `User ${memberId}`,
								profile_pic: null,
								is_active: true,
							},
							is_admin: isLeader,
							joined_at: "2026-01-15T00:00:00Z",
						};
					});

					return {
						success: true,
						data: {
							group: {
								id: group.id,
								group_name: group.name,
								group_description: `Group with ${group.members.length} members`,
								project_name: `${group.name} Project`,
								created_at: "2026-01-20T00:00:00Z",
								max_members: 4,
								cohort_id: cohortId,
							},
							members: members,
							leader: members.find((m) => m.is_admin)?.user,
						},
					};
				}
			}

			// Return error if course or group not found
			return {
				success: false,
				error: "Group not found",
			};
		}

		// Handle legacy group details endpoint without cohortId (fallback)
		if (endpoint.match(/^\/cohort\/group\/(\d+)\/details$/)) {
			const groupId = parseInt(
				endpoint.match(/^\/cohort\/group\/(\d+)\/details$/)[1],
			);

			// Find the group across all courses (legacy behavior)
			for (const courseId in Mocks.MOCK_COURSE_MEMBERS) {
				const courseMemberData = Mocks.MOCK_COURSE_MEMBERS[courseId];
				const group = courseMemberData.groups.find(
					(g) => g.id === groupId,
				);

				if (group) {
					// Get member details
					const members = group.members.map((memberId, index) => {
						const student = courseMemberData.students.find(
							(s) => s.id === memberId,
						);
						const isLeader = group.members[0] === memberId;
						return {
							user: {
								user_id: memberId,
								email: student
									? `${student.rollNumber.toLowerCase()}@mahindruniversity.edu.in`
									: `user${memberId}@example.com`,
								display_name: student
									? student.rollNumber
									: `USER${memberId}`,
								username: student
									? student.name
									: `User ${memberId}`,
								profile_pic: null,
								is_active: true,
							},
							is_admin: isLeader,
							joined_at: "2026-01-15T00:00:00Z",
						};
					});

					return {
						success: true,
						data: {
							group: {
								id: group.id,
								group_name: group.name,
								group_description: `Group with ${group.members.length} members`,
								project_name: `${group.name} Project`,
								created_at: "2026-01-20T00:00:00Z",
								max_members: 4,
								cohort_id: parseInt(courseId),
							},
							members: members,
							leader: members.find((m) => m.is_admin)?.user,
						},
					};
				}
			}

			// Return error if group not found
			return {
				success: false,
				error: "Group not found",
			};
		}

		// GET Resources - Get all resources for a cohort
		if (endpoint.match(/^\/cohort\/\d+\/resources$/)) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;
			const resourcesData = Mocks.MOCK_RESOURCES[cohortId] || {
				weeks: [],
				stats: { totalWeeks: 0, totalResources: 0 },
			};
			return {
				success: true,
				data: resourcesData,
			};
		}

		// CREATE Resource (Add resource to a week)
		if (
			endpoint.match(/^\/cohort\/\d+\/resources\/week\/\d+$/) &&
			options.method === "POST"
		) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources\/week\/(\d+)$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;
			const weekId = cohortIdMatch ? Number(cohortIdMatch[2]) : null;

			// Create new resource
			const newResource = {
				id: Date.now(),
				...JSON.parse(options.body),
				addedAt: new Date().toISOString(),
				addedBy: "You",
			};

			// Update mock data
			if (Mocks.MOCK_RESOURCES[cohortId]) {
				const week = Mocks.MOCK_RESOURCES[cohortId].weeks.find(
					(w) => w.id === weekId,
				);
				if (week) {
					week.resources.push(newResource);
					week.totalResources = week.resources.length;
					Mocks.MOCK_RESOURCES[cohortId].stats.totalResources++;
				}
			}

			return {
				success: true,
				data: newResource,
			};
		}

		// UPDATE Resource
		if (
			endpoint.match(/^\/cohort\/\d+\/resources\/\d+$/) &&
			options.method === "PUT"
		) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources\/(\d+)$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;
			const resourceId = cohortIdMatch ? Number(cohortIdMatch[2]) : null;

			// Update mock data
			if (Mocks.MOCK_RESOURCES[cohortId]) {
				for (const week of Mocks.MOCK_RESOURCES[cohortId].weeks) {
					const resourceIndex = week.resources.findIndex(
						(r) => r.id === resourceId,
					);
					if (resourceIndex !== -1) {
						week.resources[resourceIndex] = {
							...week.resources[resourceIndex],
							...JSON.parse(options.body),
						};
						break;
					}
				}
			}

			return {
				success: true,
				data: { message: "Resource updated successfully" },
			};
		}

		// DELETE Resource
		if (
			endpoint.match(/^\/cohort\/\d+\/resources\/\d+$/) &&
			options.method === "DELETE"
		) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources\/(\d+)$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;
			const resourceId = cohortIdMatch ? Number(cohortIdMatch[2]) : null;

			// Update mock data
			if (Mocks.MOCK_RESOURCES[cohortId]) {
				for (const week of Mocks.MOCK_RESOURCES[cohortId].weeks) {
					const resourceIndex = week.resources.findIndex(
						(r) => r.id === resourceId,
					);
					if (resourceIndex !== -1) {
						week.resources.splice(resourceIndex, 1);
						week.totalResources = week.resources.length;
						Mocks.MOCK_RESOURCES[cohortId].stats.totalResources--;
						break;
					}
				}
			}

			return {
				success: true,
				data: { message: "Resource deleted successfully" },
			};
		}

		// CREATE Week
		if (
			endpoint.match(/^\/cohort\/\d+\/resources\/week$/) &&
			options.method === "POST"
		) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources\/week$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;

			// Create new week
			const newWeek = {
				id: Date.now(),
				...JSON.parse(options.body),
				totalResources: 0,
				resources: [],
			};

			// Update mock data
			if (Mocks.MOCK_RESOURCES[cohortId]) {
				Mocks.MOCK_RESOURCES[cohortId].weeks.push(newWeek);
				Mocks.MOCK_RESOURCES[cohortId].stats.totalWeeks++;
			} else {
				Mocks.MOCK_RESOURCES[cohortId] = {
					weeks: [newWeek],
					stats: { totalWeeks: 1, totalResources: 0 },
				};
			}

			return {
				success: true,
				data: newWeek,
			};
		}

		// UPDATE Week
		if (
			endpoint.match(/^\/cohort\/\d+\/resources\/week\/\d+$/) &&
			options.method === "PUT"
		) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources\/week\/(\d+)$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;
			const weekId = cohortIdMatch ? Number(cohortIdMatch[2]) : null;

			// Update mock data
			if (Mocks.MOCK_RESOURCES[cohortId]) {
				const weekIndex = Mocks.MOCK_RESOURCES[
					cohortId
				].weeks.findIndex((w) => w.id === weekId);
				if (weekIndex !== -1) {
					Mocks.MOCK_RESOURCES[cohortId].weeks[weekIndex] = {
						...Mocks.MOCK_RESOURCES[cohortId].weeks[weekIndex],
						...JSON.parse(options.body),
					};
				}
			}

			return {
				success: true,
				data: { message: "Week updated successfully" },
			};
		}

		// DELETE Week
		if (
			endpoint.match(/^\/cohort\/\d+\/resources\/week\/\d+$/) &&
			options.method === "DELETE"
		) {
			const cohortIdMatch = endpoint.match(
				/^\/cohort\/(\d+)\/resources\/week\/(\d+)$/,
			);
			const cohortId = cohortIdMatch ? Number(cohortIdMatch[1]) : null;
			const weekId = cohortIdMatch ? Number(cohortIdMatch[2]) : null;

			// Update mock data
			if (Mocks.MOCK_RESOURCES[cohortId]) {
				const weekIndex = Mocks.MOCK_RESOURCES[
					cohortId
				].weeks.findIndex((w) => w.id === weekId);
				if (weekIndex !== -1) {
					const deletedWeek =
						Mocks.MOCK_RESOURCES[cohortId].weeks[weekIndex];
					Mocks.MOCK_RESOURCES[cohortId].weeks.splice(weekIndex, 1);
					Mocks.MOCK_RESOURCES[cohortId].stats.totalWeeks--;
					Mocks.MOCK_RESOURCES[cohortId].stats.totalResources -=
						deletedWeek.totalResources || 0;
				}
			}

			return {
				success: true,
				data: { message: "Week deleted successfully" },
			};
		}

		// --- STUDENT MEETING REQUESTS ---
		if (endpoint.match(/^\/cohort\/\d+\/student\/meeting-requests/)) {
			const authUser = JSON.parse(
				localStorage.getItem("authUser") || "{}",
			);
			const userId = authUser.id || 1;

			if (options.method === "POST") {
				const body = JSON.parse(options.body);
				const newRequest = {
					id: Date.now(),
					...body,
					status: "pending",
					studentId: userId,
					submittedAt: new Date().toISOString(),
				};
				Mocks.MOCK_MEETING_REQUESTS.incoming.unshift(newRequest);
				return { success: true, data: newRequest };
			}

			return {
				success: true,
				data: Mocks.MOCK_MEETING_REQUESTS.incoming.filter(
					(r) => r.studentId === userId,
				),
			};
		}

		// --- JOB TRAY AGGREGATION ---
		// TODO: Timestamps need to be generated by the server in the backend implementation
		if (endpoint.match(/^\/job-tray$/)) {
			const jobs = [];
			const now = new Date();
			const nowISO = now.toISOString();

			const formatDate = (dateStr) =>
				new Date(dateStr).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});

			const formatTime = (timeStr) => {
				const [hours, minutes] = timeStr.split(":");
				const date = new Date();
				date.setHours(hours, minutes);
				return date.toLocaleTimeString("en-US", {
					hour: "numeric",
					minute: "2-digit",
				});
			};

			// 1. ASSETS: Filter Action Required Requests
			const assetRequests = Mocks.MOCK_ASSET_DATA?.requests || [];
			assetRequests.forEach((req) => {
				if (req.status === "Rejected" && !req.isArchived) {
					jobs.push({
						id: `asset-${req.id}`,
						title: `Asset request for ${req.assetName} requires your action.`,
						type: "ASSET_REQUEST",
						status: "Action Required",
						link: "/asset-requests",
						statusNote: req.adminComments,
						createdAt: nowISO,
					});
				}
			});

			// 2. FINANCE MANAGEMENT: Filter Action Required Claims/Requests
			["expenses", "advances"].forEach((type) => {
				const list = Mocks.MOCK_FINANCE_DATA?.[type] || [];
				const isAdvance = type === "advances";

				list.forEach((item) => {
					if (item.status === "Rejected" && !item.isArchived) {
						jobs.push({
							id: `${isAdvance ? "adv" : "exp"}-${item.id}`,
							title: `${isAdvance ? "Advance request" : "Expense claim"} for ${item.title} requires your action.`,
							type: isAdvance
								? "FINANCE_ADVANCE"
								: "FINANCE_EXPENSE",
							status: "Action Required",
							link: `/finance-management/${type}`,
							statusNote: item.adminComments,
							createdAt: nowISO,
						});
					}
				});
			});

			// 3. LEAVE APPLICATIONS: Filter Action Required Apps and Pending Substitutions
			const leaveApps =
				Mocks.MOCK_PROFESSOR_LEAVE_DATA.applications || [];
			const subRequests =
				Mocks.MOCK_PROFESSOR_LEAVE_DATA.substitutionRequests || [];

			leaveApps.forEach((app) => {
				if (app.status === "Rejected" && !app.isArchived) {
					const remarks = [];
					if (app.leaveApproval.HoD.status === "Rejected")
						remarks.push(`HoD: ${app.leaveApproval.HoD.remark}`);
					if (app.leaveApproval.HR.status === "Rejected")
						remarks.push(`HR: ${app.leaveApproval.HR.remark}`);

					jobs.push({
						id: `leave-app-${app.id}`,
						title: `Leave application for ${app.leaveType} requires your action.`,
						type: "LEAVE_APPLICATION",
						status: "Action Required",
						link: "/leave-applications/my-leaves",
						statusNote:
							remarks.join(" | ") || "Application rejected.",
						createdAt: nowISO,
					});
				}
			});

			subRequests.forEach((sub) => {
				if (sub.status === "Pending") {
					const dateDisplay =
						sub.fromDate === sub.toDate
							? `on ${formatDate(sub.fromDate)}`
							: `from ${formatDate(sub.fromDate)} to ${formatDate(sub.toDate)}`;

					jobs.push({
						id: `sub-req-${sub.id}`,
						title: `Substitution request from ${sub.requesterName} ${dateDisplay}.`,
						type: "SUBSTITUTION_REQUEST",
						status: "Action Required",
						link: "/leave-applications/substitutions",
						statusNote: `${sub.course} | ${formatTime(sub.timings.startTime)} - ${formatTime(sub.timings.endTime)}`,
						createdAt: nowISO,
					});
				}
			});

			// 4. EXAM DUTIES: Filter Rejection Revoked Duties
			const exams = Mocks.MOCK_EXAM_DATA || [];
			exams.forEach((exam) => {
				if (exam.status === "REJECTION_REVOKED") {
					const remarks = [];
					if (exam.rejectionApproval?.exam_department?.remark)
						remarks.push(
							`Exam Dept.: ${exam.rejectionApproval.exam_department.remark}`,
						);
					if (exam.rejectionApproval?.hod?.remark)
						remarks.push(
							`HoD: ${exam.rejectionApproval.hod.remark}`,
						);

					jobs.push({
						id: `exam-${exam.id}`,
						title: `Exam duty for ${exam.courseName} (${exam.courseCode}) is reinstated & your rejection was revoked.`,
						type: "EXAM_DUTY",
						status: "Action Required",
						link: "/exam-duties",
						statusNote:
							remarks.join(" | ") ||
							"Please check your schedule.",
						createdAt: nowISO,
					});
				}
			});

			// 5. LIBRARY: Filter Overdue Books
			const borrowedBooks = Mocks.MOCK_LIBRARY_DATA.borrowed || [];
			borrowedBooks.forEach((book) => {
				const isOverdue = now > new Date(book.dueDate);
				if (isOverdue) {
					jobs.push({
						id: `lib-overdue-${book.id}`,
						title: `Return Overdue: ${book.bookTitle} by ${book.author}`,
						type: "LIBRARY_OVERDUE",
						status: "Action Required",
						link: "/library/borrowed",
						statusNote: `Book was due on ${formatDate(book.dueDate)}`,
						createdAt: nowISO,
					});
				}
			});

			// 6. MAINTENANCE: Filter Action Required Requests
			const maintenanceRequests =
				Mocks.MOCK_MAINTENANCE_DATA?.requests || [];
			maintenanceRequests.forEach((req) => {
				const categoryTab = req.category || "university";
				if (req.requiresAction) {
					jobs.push({
						id: `maint-${req.id}`,
						title: `Maintenance request for ${req.issueType} at ${req.location} requires your action.`,
						type: "MAINTENANCE_REQUEST",
						status: "Action Required",
						link: `/maintenance/${categoryTab}`,
						statusNote:
							req.adminRemarks || "Contact the maintenance team.",
						createdAt: req.updatedAt || nowISO,
					});
				}
			});

			// 7. SESSION PLANNING: Filter Rejected Document Uploads
			const courseSchedule = Mocks.MOCK_COURSE_SCHEDULE || [];
			const courseDocs = Mocks.MOCK_COURSE_DOCUMENTS || {};

			const internalDocTypes = [
				{ key: "courseOutline", label: "Course Outline" },
				{ key: "timeline", label: "Timeline" },
				{ key: "assessmentPlan", label: "Assessment Plan" },
				{
					key: "previousYearAnalysis",
					label: "Previous Year Analysis",
				},
			];

			Object.entries(courseDocs).forEach(([courseId, docs]) => {
				const courseInfo = courseSchedule.find(
					(c) => c.id === courseId,
				);
				const courseDisplayName = courseInfo
					? courseInfo.courseName
					: courseId;

				internalDocTypes.forEach((dt) => {
					const doc = docs[dt.key];
					if (doc && doc.status === "Rejected") {
						jobs.push({
							id: `doc-rej-${courseId}-${dt.key}`,
							title: `${dt.label} document for ${courseDisplayName} requires your action.`,
							type: "SESSION_PLANNING",
							status: "Action Required",
							link: "/session-planning/documents",
							statusNote:
								doc.hodComments ||
								"Document rejected. Please review and re-upload.",
							createdAt: nowISO,
						});
					}
				});
			});

			// 8. MENTORING: Filter meetings requiring attendance or documentation
			const mentoringData = Mocks.MOCK_MENTORING_DATA || [];
			mentoringData.forEach((mentee) => {
				const meetings = mentee.meetingHistory || [];
				meetings.forEach((meeting) => {
					if (
						meeting.status === "Pending Documentation" &&
						meeting.hasAttended === true
					) {
						jobs.push({
							id: `ment-doc-${meeting.meetingId}`,
							title: `Meeting records pending for ${mentee.name} (${formatDate(meeting.date)}).`,
							type: "MENTORING_RECORD",
							status: "Action Required",
							link: `/mentoring/${mentee.studentId}`,
							statusNote:
								"Discussion summary and action plan required.",
							createdAt: meeting.date,
						});
					}

					if (meeting.hasAttended === null) {
						jobs.push({
							id: `ment-attn-${meeting.meetingId}`,
							title: `Attendance marking pending for ${mentee.name} (${formatDate(meeting.date)}).`,
							type: "MENTORING_ATTENDANCE",
							status: "Action Required",
							link: `/mentoring/${mentee.studentId}`,
							statusNote: `Mark attendance to enter the meeting record.`,
							createdAt: meeting.date,
						});
					}
				});
			});

			// 9. RESEARCH GRANTS: Filter Rejected Grant Requests
			const grantRequests =
				Mocks.MOCK_RESEARCH_GRANT_DATA?.requests || [];
			grantRequests.forEach((req) => {
				if (req.status === "Rejected" && !req.isArchived) {
					jobs.push({
						id: `grant-${req.id}`,
						title: `Grant request "${req.title}" requires your action.`,
						type: "RESEARCH_GRANT",
						status: "Action Required",
						link: "/research-grants/my-requests",
						statusNote:
							req.adminComments ||
							"Proposal rejected. Please review and resubmit.",
						createdAt: req.lastAdminAction || nowISO,
					});
				}
			});

			// 10. DOCUMENT REQUESTS: Filter Approved Processing Queue items
			const docQueue = Mocks.MOCK_DOC_REQUESTS?.processingQueue || [];
			docQueue.forEach((item) => {
				// Only items approved by registrar/admin that need to be dispatched to the student
				if (item.status === "Approved") {
					jobs.push({
						id: `doc-dispatch-${item.lorId}`,
						title: `LOR for ${item.studentName} is approved and ready for dispatch.`,
						type: "DOCUMENT_DISPATCH",
						status: "Action Required",
						link: "/document-requests/processing-queue",
						statusNote:
							"Please verify and send the final document to the student.",
						createdAt: item.approvedDate || nowISO,
					});
				}
			});

			// Sort by date (descending)
			jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

			return {
				success: true,
				data: jobs,
			};
		}

		// --- NOTIFICATIONS AGGREGATION ---
		// TODO: Timestamps need to be generated by the server in the backend implementation
		if (endpoint.match(/^\/notifications$/)) {
			const notifications = [];

			const formatDate = (dateStr) =>
				new Date(dateStr).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});

			// 1. ASSETS: Notify when a request is Approved or Assigned
			const assetRequests = Mocks.MOCK_ASSET_DATA?.requests || [];
			assetRequests.forEach((req) => {
				if (req.status === "Approved") {
					notifications.push({
						id: `notif-asset-${req.id}`,
						title: `Asset Request Update`,
						message: `Your request for ${req.assetName} has been ${req.status.toLowerCase()}.`,
						type: "ASSET_REQUEST",
						link: "/asset-requests",
						createdAt: req.approvalTime || new Date().toISOString(),
					});
				}
			});

			// 2. FINANCE MANAGEMENT: Notify on Reimbursements or Advance Approvals
			["expenses", "advances"].forEach((type) => {
				const list = Mocks.MOCK_FINANCE_DATA?.[type] || [];
				const isAdvance = type === "advances";

				// Define the success status based on type
				const successStatus = isAdvance ? "Approved" : "Reimbursed";

				list.forEach((item) => {
					if (item.status === successStatus) {
						notifications.push({
							id: `notif-${isAdvance ? "adv" : "exp"}-${item.id}`,
							title: `${isAdvance ? "Advance" : "Expense"} Approved`,
							message: `${isAdvance ? "Advance request" : "Expense claim"} for ${item.title} has been processed.`,
							type: isAdvance
								? "FINANCE_ADVANCE"
								: "FINANCE_EXPENSE",
							link: `/finance-management/${type}`,
							createdAt:
								item.approvalTime || new Date().toISOString(),
						});
					}
				});
			});

			// 3. LEAVE: Notify when Leave is fully Approved
			const leaveApps =
				Mocks.MOCK_PROFESSOR_LEAVE_DATA.applications || [];
			leaveApps.forEach((app) => {
				if (app.status === "Approved") {
					notifications.push({
						id: `notif-leave-${app.id}`,
						title: `Leave Approved`,
						message: `Your ${app.leaveType} application has been approved by HoD & HR.`,
						type: "LEAVE_APPLICATION",
						link: "/leave-applications/my-leaves",
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 4. EXAM DUTIES: Notify when a new duty is assigned
			const exams = Mocks.MOCK_EXAM_DATA || [];
			exams.forEach((exam) => {
				if (exam.status === "ASSIGNED") {
					notifications.push({
						id: `notif-exam-${exam.id}`,
						title: `New Exam Duty`,
						message: `You have been assigned as an invigilator for ${exam.courseName}.`,
						type: "EXAM_DUTY",
						link: "/exam-duties",
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 5. MAINTENANCE: Notify when a request is Resolved
			const maintenanceRequests =
				Mocks.MOCK_MAINTENANCE_DATA?.requests || [];
			maintenanceRequests.forEach((req) => {
				if (req.status === "solved") {
					notifications.push({
						id: `notif-maint-${req.id}`,
						title: `Maintenance Resolved`,
						message: `The ${req.issueType} issue at ${req.location} is now marked as resolved.`,
						type: "MAINTENANCE_REQUEST",
						link: `/maintenance/${req.category || "university"}`,
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 6. LIBRARY: Notify when a book request or extension status changes
			const libraryRequests = Mocks.MOCK_LIBRARY_DATA?.requests || [];
			libraryRequests.forEach((req) => {
				// Check for terminal statuses: approved or rejected
				if (req.status === "approved" || req.status === "rejected") {
					const isApproved = req.status === "approved";

					notifications.push({
						id: `notif-lib-${req.id}`,
						title: isApproved
							? `Library Request Approved`
							: `Library Request Rejected`,
						message: isApproved
							? `Your request for "${req.bookTitle}" has been approved. Due date: ${req.dueDate}.`
							: `Your request for "${req.bookTitle}" was rejected. Reason: ${req.rejectionReason || "No reason provided."}`,
						type: "LIBRARY_REQUEST",
						link: "/library/requests",
						createdAt:
							req.approvedDate ||
							req.requestDate ||
							new Date().toISOString(),
					});
				}
			});

			// 7. SCHEDULE & MEETINGS: Notify on Request Status Changes
			const incomingRequests =
				Mocks.MOCK_MEETING_REQUESTS?.incoming || [];
			const outgoingRequests =
				Mocks.MOCK_MEETING_REQUESTS?.outgoing || [];
			const scheduledMeetings =
				Mocks.MOCK_SCHEDULED_MEETINGS || [];

			// 7a. Check for Accepted/Rejected Meetings
			[...incomingRequests, ...outgoingRequests].forEach((req) => {
				if (req.status === "accepted" || req.status === "rejected") {
					const isAccepted = req.status === "accepted";

					notifications.push({
						id: `notif-meet-${req.id}`,
						title: isAccepted
							? `Meeting Confirmed`
							: `Meeting Declined`,
						message: isAccepted
							? `Your meeting regarding "${req.subject}" with ${req.participantName} is confirmed.`
							: `The meeting request for "${req.subject}" was declined. ${req.rejectionReason ? "Reason: " + req.rejectionReason : ""}`,
						type: "MEETING_REQUEST",
						link: isAccepted
							? "/schedule/schedule"
							: "/schedule/requests",
						createdAt:
							req.createdAt ||
							req.submittedAt ||
							new Date().toISOString(),
					});
				}
			});

			// 7b. Check for Rescheduled Meetings
			scheduledMeetings.forEach((meeting) => {
				if (meeting.status === "rescheduled") { 
					notifications.push({
						id: `notif-meet-resch-${meeting.id}`,
						title: `Meeting Rescheduled`,
						message: `The meeting "${meeting.subject}" has been moved to ${formatDate(meeting.startTime)}.`,
						type: "MEETING_RESCHEDULED",
						link: "/schedule/meetings",
						createdAt: meeting.updatedAt || new Date().toISOString(),
					});
				}
			});

			// 8. RESEARCH & PUBLICATIONS: Application Status Updates
			const researchApps = Mocks.MOCK_USER_RESEARCH_APPLICATIONS || [];
			researchApps.forEach((app) => {
				const status = app.status;
				if (
					["Accepted", "Rejected", "Meeting Scheduled"].includes(
						status,
					)
				) {
					notifications.push({
						id: `notif-res-app-${app.id}`,
						title:
							status === "Meeting Scheduled"
								? "Interview Scheduled"
								: `Application ${status}`,
						message:
							status === "Meeting Scheduled"
								? `A meeting is scheduled for "${app.title}" on ${new Date(app.meetingDetails?.date).toLocaleDateString()}.`
								: `Your application for "${app.title}" was ${status.toLowerCase()}.`,
						type: "RESEARCH_APPLICATION",
						link: "/research-publications/my-applications",
						createdAt: app.approvalDate || app.appliedDate,
					});
				}
			});

			// 9. RESEARCH OWNER: Notify on New Applicants (For Project Owners)
			[...Mocks.MOCK_RESEARCH_PROJECTS, ...Mocks.MOCK_PUBLICATIONS]
				.filter((p) => p.isOwner)
				.forEach((project) => {
					project.applicants
						?.filter((a) => a.status === "Pending")
						.forEach((applicant) => {
							notifications.push({
								id: `notif-res-new-app-${applicant.userId}`,
								title: "New Applicant",
								message: `${applicant.name} applied for the ${applicant.role} role in "${project.title}".`,
								type: "RESEARCH_OWNER",
								link: "/research-publications/my-applications",
								createdAt: applicant.appliedDate,
							});
						});
				});

			// 10. RESEARCH GRANTS: Notify on Approved or Rejected-Archived Requests
			const grantNotifications =
				Mocks.MOCK_RESEARCH_GRANT_DATA?.requests || [];

			grantNotifications.forEach((req) => {
				const isApproved = req.status === "Approved";
				const isRejectedAndArchived =
					req.status === "Rejected" && req.isArchived;

				// Only notify if approved OR if rejected and explicitly archived
				if (isApproved || isRejectedAndArchived) {
					notifications.push({
						id: `notif-grant-status-${req.id}`,
						title: `Grant ${req.status}`,
						message:
							req.status === "Rejected"
								? `Your grant request for "${req.title}" was rejected.`
								: `Your grant request for "${req.title}" has been approved.`,
						type: "RESEARCH_GRANT",
						link: "/research-publications/grants",
						createdAt: req.lastAdminAction || nowISO,
					});
				}
			});

			// 11. DOCUMENT REQUESTS: Notify on Pending Requests
			const docRequests = Mocks.MOCK_DOC_REQUESTS?.studentRequests || [];

			docRequests.forEach((req) => {
				// Only notify if the request is still in 'Pending' status
				if (req.status === "Pending") {
					notifications.push({
						id: `notif-doc-pending-${req.id}`,
						title: "New Document Request",
						message: `${req.student.name} (${req.student.rollNumber}) has requested a Letter of Recommendation.`,
						type: "DOCUMENT_REQUEST",
						link: "/registrar/requests",
						createdAt: req.requestDate || nowISO,
					});
				}
			});

			// Final sorting by date (Most recent first)
			notifications.sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
			);

			return {
				success: true,
				data: notifications,
			};
		}

		// --- SCHEDULE & MEETINGS ---
		if (endpoint.match(/^\/professor\/schedule/)) {
			const method = options?.method || "GET";
			const pathParts = endpoint.split("/");

			// GET: Fetch full schedule, pending requests, and office hours
			if (endpoint.match(/^\/professor\/schedule$/) && method === "GET") {
				const standardTimetable = Mocks.MOCK_COURSE_SCHEDULE.flatMap(
					(course) =>
						course.schedule.map((session) => ({
							...session,
							courseName: course.courseName,
							courseId: course.id,
							courseType: course.courseType,
							startDate: course.startDate,
							endDate: course.endDate,
						})),
				);

				return {
					success: true,
					data: {
						scheduledMeetings: Mocks.MOCK_SCHEDULED_MEETINGS,
						// Filters only for items that need an action from the user
						meetingRequests:
							Mocks.MOCK_MEETING_REQUESTS.incoming.filter(
								(r) => r.status === "pending",
							),
						outgoingRequests: Mocks.MOCK_MEETING_REQUESTS.outgoing,
						schedule: {
							officeHours: Mocks.MOCK_OFFICE_HOURS,
							timetable: [
								...standardTimetable,
								...Mocks.MOCK_CUSTOM_EVENTS,
							],
						},
					},
				};
			}

			// PUT: Update master availability/office hours
			if (endpoint.match(/^\/professor\/schedule$/) && method === "PUT") {
				try {
					const body = options.body ? JSON.parse(options.body) : [];
					// Update the mock store with new office hour slots
					Mocks.MOCK_OFFICE_HOURS = body;

					return {
						success: true,
						data: Mocks.MOCK_OFFICE_HOURS,
						message: "Office hours updated successfully",
					};
				} catch (err) {
					return {
						success: false,
						message: "Failed to update schedule",
					};
				}
			}

			// POST: Create a manual event on the professor's schedule
			if (
				endpoint.match(/^\/professor\/schedule\/meetings$/) &&
				method === "POST"
			) {
				try {
					const body = options.body ? JSON.parse(options.body) : {};
					const newEvent = {
						...body,
						id: `EVT-${Date.now()}`,
						createdAt: new Date().toISOString(),
					};

					Mocks.MOCK_CUSTOM_EVENTS.push(newEvent);

					return {
						success: true,
						data: newEvent,
						message: "Event added to schedule successfully",
					};
				} catch (err) {
					return {
						success: false,
						message: "Failed to create event",
					};
				}
			}

			// POST: Directly schedule a meeting (bypasses request flow)
			if (
				endpoint.match(/^\/professor\/schedule\/meetings\/direct$/) &&
				method === "POST"
			) {
				try {
					const body = options.body ? JSON.parse(options.body) : {};
					const newMeeting = {
						id: `SCH-${Date.now()}`,
						participantName: body.participantName,
						participantId: body.participantId,
						participantRole: body.participantRole || "Student",
						type: body.type || "Offline",
						category: body.category || "Academic",
						startTime: body.startTime,
						subject: body.subject,
						reason: body.reason,
						location: body.location || "TBD",
						meetingLink: body.meetingLink || null,
						status: "scheduled",
					};

					Mocks.MOCK_SCHEDULED_MEETINGS.push(newMeeting);

					return {
						success: true,
						data: newMeeting,
						message: "Meeting scheduled directly",
					};
				} catch (err) {
					return {
						success: false,
						message: "Failed to schedule meeting directly",
					};
				}
			}

			// POST: Create a new outgoing meeting request
			if (
				endpoint.match(/^\/professor\/schedule\/requests\/outgoing$/) &&
				method === "POST"
			) {
				try {
					const body = options.body ? JSON.parse(options.body) : {};
					const newRequest = {
						...body,
						id: `REQ-OUT-${Date.now()}`,
						createdAt: new Date().toISOString(),
						status: "pending",
					};

					Mocks.MOCK_MEETING_REQUESTS.outgoing.push(newRequest);

					return {
						success: true,
						data: newRequest,
						message: "Meeting request sent successfully",
					};
				} catch (err) {
					return {
						success: false,
						message: "Failed to send request",
					};
				}
			}

			// POST: Handle meeting actions (accept|reject|reschedule)
			if (
				endpoint.match(
					/^\/professor\/schedule\/meetings\/[^\/]+\/(accept|reject|reschedule)$/,
				) &&
				method === "POST"
			) {
				try {
					const action = pathParts.pop();
					const requestId = pathParts.pop();
					const body = options.body ? JSON.parse(options.body) : {};

					const scheduledMeeting = Mocks.MOCK_SCHEDULED_MEETINGS.find(
						(m) => m.id === requestId || m.id === String(requestId)
					);
					const incomingRequest = Mocks.MOCK_MEETING_REQUESTS.incoming.find(
						(r) => r.id === requestId || r.id === String(requestId)
					);

					if (scheduledMeeting && action === "reschedule") {
						try {
							scheduledMeeting.startTime = body.newDateTime;
							scheduledMeeting.status = "rescheduled";
							
							scheduledMeeting.rescheduleReason = body.rescheduleReason || null;

							if (body.mode) {
								scheduledMeeting.type = body.mode.charAt(0).toUpperCase() + body.mode.slice(1);
							}

							if (body.mode === "offline") {
								scheduledMeeting.location = body.venue || "TBD";
								scheduledMeeting.meetingLink = null;
							} else if (body.mode === "online") {
								scheduledMeeting.meetingLink = body.link || "";
								scheduledMeeting.location = "Virtual Meeting";
							}

							return {
								success: true,
								data: { message: "Meeting updated and rescheduled successfully" },
							};
						} catch (err) {
							return { success: false, message: "Failed to parse reschedule data" };
						}
					}

					if (incomingRequest) {
						if (action === "accept") {
							incomingRequest.status = "accepted";
							
							const newScheduled = {
								id: incomingRequest.id, // Keeping same ID or generating new one as per your DB logic
								participantName: incomingRequest.participantName,
								participantId: incomingRequest.participantId,
								participantRole: incomingRequest.participantRole,
								type: incomingRequest.type,
								category: incomingRequest.category,
								subject: incomingRequest.subject,
								reason: incomingRequest.reason,
								startTime: incomingRequest.requestedTime,
								location: incomingRequest.type === "Online" ? "Virtual Meeting" : (body.location || "Department Office"),
								meetingLink: incomingRequest.type === "Online" ? (body.meetingLink || "https://meet.google.com/placeholder") : null,
								status: "scheduled",
							};

							Mocks.MOCK_SCHEDULED_MEETINGS.push(newScheduled);
						}

						if (action === "reject") {
							incomingRequest.status = "rejected";
							incomingRequest.rejectionReason = body.reason;
						}

						return {
							success: true,
							data: { message: `Meeting ${action}ed successfully` },
						};
					}

					return {
						success: false,
						message: "Meeting record not found",
					};
				} catch (err) {
					return { success: false, message: "Action failed" };
				}
			}
		}

		// --- ATTENDANCE MANAGEMENT ---
		// GET: Fetch attendance logs for a specific cohort
		if (endpoint.match(/^\/attendance\/logs\/\d+$/)) {
			const cohortId = endpoint.match(/\/attendance\/logs\/(\d+)$/)[1];
			const today = new Date().toISOString().split("T")[0];

			const rawData = Mocks.MOCK_ATTENDANCE_DATA[cohortId] || {
				students: [],
				logs: {},
				sectionMetadata: [],
				finalizedDates: [],
			};

			const isFinalToday = rawData.finalizedDates?.includes(today);

			return {
				status: "success",
				data: { 
					...rawData, 
					isFinal: isFinalToday,
					sections: rawData.sectionMetadata || [] 
				},
				departmentMapping: Mocks.DEPARTMENT_MAPPING,
			};
		}
		// POST: Save attendance for a specific course
		if (
			endpoint.match(/^\/courses\/\d+\/attendance$/) &&
			options.method === "POST"
		) {
			try {
				if (!options.body) throw new Error("Missing request body");
				
				const courseId = endpoint.match(/\/courses\/(\d+)\/attendance/)[1];
				const bodyData = JSON.parse(options.body);
				
				const { date, studentIds, status, section: submittedSection } = bodyData;

				// Initialize course data structure if missing
				if (!Mocks.MOCK_ATTENDANCE_DATA[courseId]) {
					Mocks.MOCK_ATTENDANCE_DATA[courseId] = {
						students: [],
						logs: {},
						drafts: {}, // Added to track non-finalized sessions
						finalizedDates: [],
						finalizedSections: {}, 
					};
				}

				const courseData = Mocks.MOCK_ATTENDANCE_DATA[courseId];
				const targetSection = submittedSection || "All";

				if (status === "final") {
					// 1. Move/Save to permanent logs
					if (!courseData.logs[targetSection]) {
						courseData.logs[targetSection] = {};
					}
					courseData.logs[targetSection][date] = studentIds;

					// 2. Clear any existing draft for this specific section/date
					if (courseData.drafts?.[targetSection]?.[date]) {
						delete courseData.drafts[targetSection][date];
					}

					// 3. Handle finalization metadata
					if (!courseData.finalizedSections) courseData.finalizedSections = {};
					if (!courseData.finalizedSections[date]) courseData.finalizedSections[date] = [];
					
					if (!courseData.finalizedSections[date].includes(targetSection)) {
						courseData.finalizedSections[date].push(targetSection);
					}
					
					if (!courseData.finalizedDates.includes(date)) {
						courseData.finalizedDates.push(date);
					}
				} else {
					// Handle Draft Logic
					if (!courseData.drafts) courseData.drafts = {};
					if (!courseData.drafts[targetSection]) courseData.drafts[targetSection] = {};

					// Update the draft entry
					courseData.drafts[targetSection][date] = {
						studentIds,
						lastUpdated: new Date().toISOString(),
						type: "manual_draft"
					};
				}

				return {
					status: "success",
					data: {
						...courseData,
						isFinal: status === "final",
						message: status === "final" 
							? `Attendance finalized for section ${targetSection}` 
							: "Draft saved to server logs",
					},
				};
			} catch (err) {
				return {
					success: false,
					message: "Invalid JSON or missing body: " + err.message,
				};
			}
		}
		// GET: Fetch professor logs
		if (endpoint.match(/^\/professor\/logs$/)) {
			return { success: true, data: Mocks.MOCK_PROFESSOR_LOGS || [] };
		}

		// --- SESSION PLANNING ---
		if (endpoint.match(/^\/sessions\/.+/)) {
			const method = options?.method || "GET";

			// GET Schedules
			if (endpoint.match(/^\/sessions\/schedules$/) && method === "GET") {
				return { success: true, data: Mocks.MOCK_COURSE_SCHEDULE };
			}

			// GET Today's Classes
			if (endpoint.match(/^\/sessions\/today$/) && method === "GET") {
				const todays = [];
				Mocks.MOCK_COURSE_SCHEDULE.filter(
					(s) => s.status === "Ongoing",
				).forEach((s, slotIdx) => {
					todays.push({ ...s, id: `${s.id}_today_${slotIdx}` });
				});
				return { success: true, data: todays };
			}

			// POST Archive
			if (
				endpoint.match(/^\/sessions\/[^/]+\/archive$/) &&
				method === "POST"
			) {
				const id = endpoint.split("/")[2];
				const section = Mocks.MOCK_COURSE_SCHEDULE.find(
					(s) => s.id === id,
				);
				if (section) section.status = "Completed";
				return { success: true, data: section };
			}

			// GET Reflections
			if (
				endpoint.match(/^\/sessions\/reflections/) &&
				method === "GET"
			) {
				return { success: true, data: Mocks.MOCK_COURSE_REFLECTIONS };
			}

			// POST Reflection
			if (
				endpoint.match(/^\/sessions\/reflections$/) &&
				method === "POST"
			) {
				const data = JSON.parse(options.body);

				const newRef = {
					id: `ref_${Date.now()}`,
					...data,
					// Ensure consistent naming for the history view
					date: data.date || new Date().toISOString(),
					status: "Submitted",
				};

				// Persist to the mock global array
				Mocks.MOCK_COURSE_REFLECTIONS.unshift(newRef);

				return { success: true, data: newRef };
			}

			// GET/POST Documents
			if (endpoint.match(/^\/sessions\/documents\/.+/)) {
				const method = options?.method || "GET";
				const parts = endpoint.split("/");

				// Check if it's a bulk upload or single upload
				const isBulk = parts.includes("bulk");
				const courseId = isBulk
					? parts[parts.length - 2]
					: parts[parts.length - 1];

				if (method === "GET") {
					return {
						success: true,
						data: Mocks.MOCK_COURSE_DOCUMENTS[courseId] || [],
					};
				}

				if (method === "POST") {
					if (!Mocks.MOCK_COURSE_DOCUMENTS[courseId]) {
						Mocks.MOCK_COURSE_DOCUMENTS[courseId] = [];
					}

					const body = JSON.parse(options.body);
					const uploadedKeys = isBulk ? body.docs : [body.docType];

					uploadedKeys.forEach((docType) => {
						const courseDocs = Mocks.MOCK_COURSE_DOCUMENTS[courseId];
						const existingIndex = courseDocs.findIndex(d => d.type === docType);
						
						const newDoc = {
							type: docType,
							fileName: body.fileNames?.[docType] || `updated_${docType}.pdf`,
							fileLink: "#",
							version: existingIndex !== -1 ? courseDocs[existingIndex].version + 1 : 1,
							uploadDate: new Date().toISOString().split('T')[0],
							uploadedBy: userName, 
							status: "Pending",
							hodComments: null,
						};

						if (existingIndex !== -1) {
							courseDocs[existingIndex] = newDoc;
						} else {
							courseDocs.push(newDoc);
						}
					});

					return {
						success: true,
						data: Mocks.MOCK_COURSE_DOCUMENTS[courseId],
					};
				}
			}
		}

		// --- BULLETINS ---
		if (endpoint.match(/^\/bulletins(\?.*)?$/)) {
			// GET: Fetch and filter all bulletins based on level, course, or priority
			if (options.method === "GET" || !options.method) {
				const url = new URL(endpoint, "http://localhost");
				const level = url.searchParams.get("level");
				const courseId = url.searchParams.get("courseId");
				const priority = url.searchParams.get("priority");

				let filtered = [...Mocks.MOCK_BULLETINS];

				if (level) filtered = filtered.filter((b) => b.level === level);
				if (courseId)
					filtered = filtered.filter(
						(b) => b.courseId === parseInt(courseId),
					);
				if (priority) {
					filtered = filtered.filter(
						(b) =>
							b.priority.toLowerCase() === priority.toLowerCase(),
					);
				}
				return { success: true, data: filtered };
			}

			// POST: Create a new bulletin entry
			if (options.method === "POST") {
				try {
					const body = JSON.parse(options.body || "{}");

					const newBulletin = {
						id: Date.now(),
						...body, // Spreads title, content, level, batch, year, etc.
						createdAt: new Date().toISOString(),
						priority: body.priority || "Normal",
						batch: body.batch || "", // Empty string = All Batches
						year: body.year || "", // Empty string = All Years
						attachments: body.attachments || [],
						is_pinned: body.is_pinned || false,
					};

					Mocks.MOCK_BULLETINS.unshift(newBulletin);
					return { success: true, data: newBulletin };
				} catch (err) {
					return {
						success: false,
						message: "Bulletin creation failed",
					};
				}
			}

			// PATCH/PUT: Update an existing bulletin by ID (e.g., pinning or editing content)
			if (options.method === "PATCH" || options.method === "PUT") {
				try {
					const id = parseInt(endpoint.split("/").pop());
					const body = JSON.parse(options.body || "{}");

					const index = Mocks.MOCK_BULLETINS.findIndex(
						(b) => b.id === id,
					);

					if (index !== -1) {
						// Update the existing bulletin with the new data (e.g., is_pinned)
						Mocks.MOCK_BULLETINS[index] = {
							...Mocks.MOCK_BULLETINS[index],
							...body,
						};

						return {
							success: true,
							data: Mocks.MOCK_BULLETINS[index],
						};
					} else {
						return {
							success: false,
							message: "Bulletin not found",
						};
					}
				} catch (err) {
					return {
						success: false,
						message: "Update failed",
					};
				}
			}
		}

		// --- EXAM DUTIES ---
		if (endpoint.match(/^\/exams\//)) {
			const method = options?.method || "GET";

			// GET: Fetch all assigned exam duties
			if (endpoint.match(/^\/exams\/duties$/) && method === "GET") {
				return { success: true, data: Mocks.MOCK_EXAM_DATA || [] };
			}

			// POST: Update duty status (Check-in, Rejection, or Approval)
			if (
				endpoint.match(/^\/exams\/duty\/status$/) &&
				method === "POST"
			) {
				try {
					const {
						id,
						status,
						isCheckedIn,
						reason,
						rejectionApproval,
					} = JSON.parse(options.body);
					const duty = Mocks.MOCK_EXAM_DATA.find((d) => d.id === id);

					if (duty) {
						duty.status = status;
						duty.isCheckedIn = isCheckedIn;

						if (reason) duty.rejectionReason = reason;

						// Handle rejection workflow state
						if (rejectionApproval) {
							duty.rejectionApproval = rejectionApproval;
						} else if (status === "ASSIGNED") {
							duty.rejectionApproval = null;
						}

						return { success: true, message: `Duty ${id} updated` };
					}
					return { success: false, message: "Duty not found" };
				} catch (err) {
					return {
						success: false,
						message: "Update failed: " + err.message,
					};
				}
			}
		}

		// --- LEAVE APPLICATION ---
		if (endpoint.match(/^\/leaves\//)) {
			const method = options?.method || "GET";

			// GET: Fetch personal leave applications and substitution requests
			if (
				endpoint.match(/^\/leaves\/applications$/) &&
				method === "GET"
			) {
				const data =
					currentRole === "hod"
						? Mocks.MOCK_HOD_LEAVE_DATA
						: Mocks.MOCK_PROFESSOR_LEAVE_DATA;
				return { data };
			}

			// GET: Fetch faculty requests for HoD approval
			if (
				endpoint.match(/^\/leaves\/incoming-requests$/) &&
				method === "GET"
			) {
				if (currentRole !== "hod")
					return { success: false, message: "Unauthorized" };
				return {
					data: Mocks.MOCK_HOD_LEAVE_DATA.incomingLeaveRequests,
				};
			}

			// POST: Submit a new leave application
			if (endpoint.match(/^\/leaves\/apply$/) && method === "POST") {
				try {
					if (!options.body) throw new Error("Missing request body");
					const newLeave = JSON.parse(options.body);
					const targetData =
						currentRole === "hod"
							? Mocks.MOCK_HOD_LEAVE_DATA
							: Mocks.MOCK_PROFESSOR_LEAVE_DATA;

					targetData.applications.push({
						...newLeave,
						id: `LV${Date.now()}`,
						status: "Pending",
						leaveApproval:
							currentRole === "hod"
								? {
										Dean: {
											status: "Pending",
											remark: null,
										},
										HR: { status: "Pending", remark: null },
									}
								: {
										HoD: {
											status: "Pending",
											remark: null,
										},
										HR: { status: "Pending", remark: null },
									},
					});
					return { success: true };
				} catch (err) {
					return {
						success: false,
						message: "Application failed: " + err.message,
					};
				}
			}

			// POST: Update an existing leave application (for resubmissions)
			if (
				endpoint.match(/^\/leaves\/update\/[\w-]+$/) &&
				method === "POST"
			) {
				try {
					const leaveId = endpoint.split("/").pop();
					const updatedData = JSON.parse(options.body);
					const targetData =
						currentRole === "hod"
							? Mocks.MOCK_HOD_LEAVE_DATA
							: Mocks.MOCK_PROFESSOR_LEAVE_DATA;

					const index = targetData.applications.findIndex(
						(a) => a.id === leaveId,
					);

					if (index !== -1) {
						targetData.applications[index] = {
							...targetData.applications[index],
							...updatedData,
							status: "Pending", // Reset status on update
						};
						return {
							success: true,
							message: "Application updated successfully.",
						};
					}
					return {
						success: false,
						message: "Application not found.",
					};
				} catch (err) {
					return {
						success: false,
						message: "Update failed: " + err.message,
					};
				}
			}

			// POST: Process leave approval (HoD/Dean/HR action)
			if (
				endpoint.match(/^\/leaves\/approve\/[\w-]+$/) &&
				method === "POST"
			) {
				try {
					const leaveId = endpoint.split("/").pop();
					const { role, action, remark, isArchived } = JSON.parse(
						options.body,
					);

					// Check both incoming requests and general applications
					let appIndex =
						Mocks.MOCK_HOD_LEAVE_DATA.incomingLeaveRequests.findIndex(
							(a) => a.id === leaveId,
						);
					let dataSource = "incomingLeaveRequests";

					if (appIndex === -1) {
						appIndex =
							Mocks.MOCK_HOD_LEAVE_DATA.applications.findIndex(
								(a) => a.id === leaveId,
							);
						dataSource = "applications";
					}

					if (appIndex !== -1) {
						const app =
							Mocks.MOCK_HOD_LEAVE_DATA[dataSource][appIndex];
						const roleKey = role === "HOD" ? "HoD" : role;

						// Update the mock data entry itself
						const updatedApp = {
							...app,
							status: action,
							isArchived:
								action === "Rejected"
									? (isArchived ?? true)
									: false,
							leaveApproval: {
								...app.leaveApproval,
								[roleKey]: {
									status: action,
									remark: remark || null,
								},
							},
						};

						Mocks.MOCK_HOD_LEAVE_DATA[dataSource][appIndex] =
							updatedApp;

						return {
							success: true,
							data: updatedApp,
							message: `${role} status updated to ${action}.`,
						};
					}
					return {
						success: false,
						message: "Application not found.",
					};
				} catch (err) {
					return { success: false, message: "Error: " + err.message };
				}
			}

			// POST: Process substitution requests (Peer action)
			if (
				endpoint.match(/^\/leaves\/substitutions\/[\w-]+$/) &&
				method === "POST"
			) {
				try {
					const subId = endpoint.split("/").pop();
					const { action } = JSON.parse(options.body);

					// Search in both mock sets for the substitution ID
					const subReq =
						Mocks.MOCK_PROFESSOR_LEAVE_DATA.substitutionRequests?.find(
							(s) => s.id === subId,
						) ||
						Mocks.MOCK_HOD_LEAVE_DATA.substitutionRequests?.find(
							(s) => s.id === subId,
						);

					if (subReq) {
						subReq.status = action;
						return {
							success: true,
							message: `Substitution ${action.toLowerCase()} successfully.`,
						};
					}
					return {
						success: false,
						message: "Substitution request not found.",
					};
				} catch (err) {
					return {
						success: false,
						message: "Processing error: " + err.message,
					};
				}
			}
		}

		// --- LIBRARY ---
		if (endpoint.match(/^\/library\/.+/)) {
			const method = options?.method || "GET";

			// GET: Dashboard data
			if (endpoint.match(/^\/library\/dashboard$/) && method === "GET") {
				return {
					success: true,
					data: {
						admins: Mocks.MOCK_LIBRARY_DATA.admins,
						requests: Mocks.MOCK_LIBRARY_DATA.requests.filter(
							(r) => r.status !== "approved",
						),
						// Aggregate borrowed books from both explicit records and approved requests
						borrowed: [
							...Mocks.MOCK_LIBRARY_DATA.borrowed,
							...Mocks.MOCK_LIBRARY_DATA.requests
								.filter((r) => r.status === "approved")
								.map((r) => ({
									id: r.id,
									bookTitle: r.bookTitle,
									author: r.author,
									isbn: r.isbn,
									category: r.category,
									borrowedDate: r.approvedDate,
									dueDate: r.dueDate,
									physicalCopyPickedUp:
										r.physicalCopyPickedUp,
								})),
						],
						inventory: Mocks.MOCK_LIBRARY_DATA.inventory,
					},
				};
			}

			// POST: Request Book
			if (endpoint.match(/^\/library\/request$/) && method === "POST") {
				const { bookId, durationDays } = JSON.parse(options.body);
				const book = Mocks.MOCK_LIBRARY_DATA.inventory.find(
					(b) => b.id === bookId,
				);
				if (book) {
					const newRequest = {
						id: `REQ${Date.now()}`,
						bookTitle: book.title,
						author: book.author,
						isbn: book.isbn,
						category: book.category,
						status: "pending",
						// Captured from user request
						durationDays: durationDays,
						requestDate: new Date().toISOString().split("T")[0],
					};
					Mocks.MOCK_LIBRARY_DATA.requests.unshift(newRequest);
					return { success: true, data: newRequest };
				}
				return { success: false, message: "Book not found" };
			}

			// DELETE: Cancel Request
			if (
				endpoint.match(/^\/library\/requests\/[^/]+$/) &&
				method === "DELETE"
			) {
				const id = endpoint.split("/").pop();
				const index = Mocks.MOCK_LIBRARY_DATA.requests.findIndex(
					(r) => r.id === id,
				);
				if (index !== -1) {
					Mocks.MOCK_LIBRARY_DATA.requests.splice(index, 1);
					return { success: true, message: "Cancelled" };
				}
			}

			// POST: Create Extension Request
			if (endpoint.match(/^\/library\/extend$/) && method === "POST") {
				const { bookId, additionalDays } = JSON.parse(options.body);

				const book =
					Mocks.MOCK_LIBRARY_DATA.borrowed.find(
						(b) => b.id === bookId,
					) ||
					Mocks.MOCK_LIBRARY_DATA.requests.find(
						(r) => r.id === bookId && r.status === "approved",
					);

				if (book) {
					const extensionRequest = {
						id: `EXT${Date.now()}`,
						bookTitle: book.bookTitle,
						author: book.author,
						isbn: book.isbn,
						category: book.category,
						status: "extension-pending",
						originalBorrowedId: book.id,
						additionalDays: additionalDays,
						dueDate: book.dueDate,
						requestDate: new Date().toISOString().split("T")[0],
					};

					Mocks.MOCK_LIBRARY_DATA.requests.unshift(extensionRequest);

					return { success: true, data: extensionRequest };
				}
				return {
					success: false,
					message: "Book not found or cannot be extended",
				};
			}

			// POST: Approve Extension Request
			if (
				endpoint.match(/^\/library\/approve-extension$/) &&
				method === "POST"
			) {
				const { requestId, bookId, additionalDays } = JSON.parse(
					options.body,
				);

				const borrowedBook = Mocks.MOCK_LIBRARY_DATA.borrowed.find(
					(b) => b.id === bookId,
				);

				if (borrowedBook) {
					const currentDueDate = new Date(borrowedBook.dueDate);
					currentDueDate.setDate(
						currentDueDate.getDate() + parseInt(additionalDays),
					);
					const newDate = currentDueDate.toISOString().split("T")[0];
					borrowedBook.dueDate = newDate;

					const requestIndex =
						Mocks.MOCK_LIBRARY_DATA.requests.findIndex(
							(r) => r.id === requestId,
						);
					if (requestIndex !== -1) {
						Mocks.MOCK_LIBRARY_DATA.requests.splice(
							requestIndex,
							1,
						);
					}

					return { success: true, newDueDate: newDate };
				}
				return {
					success: false,
					message: "Could not process extension approval",
				};
			}
		}

		// --- RESEARCH & PUBLICATIONS ---
		if (endpoint.match(/^\/research\//)) {
			const method = options?.method || "GET";
			const parts = endpoint.split("/");

			// GET: Consolidates projects, publications, applications, grant requests and users
			if (
				endpoint.match(/^\/research\/dashboard-sync$/) &&
				method === "GET"
			) {
				return {
					success: true,
					data: {
						availableProjects: Mocks.MOCK_RESEARCH_PROJECTS.filter(
							(p) => !p.isOwner && !p.isMember,
						),
						myProjects: Mocks.MOCK_RESEARCH_PROJECTS.filter(
							(p) => p.isOwner || p.isMember,
						),
						availablePublications: Mocks.MOCK_PUBLICATIONS.filter(
							(p) => !p.isOwner && !p.isMember,
						),
						myPublications: Mocks.MOCK_PUBLICATIONS.filter(
							(p) => p.isOwner || p.isMember,
						),
						myApplications: Mocks.MOCK_USER_RESEARCH_APPLICATIONS,
						grantRequests: Mocks.MOCK_RESEARCH_GRANT_DATA.requests,
						admins: Mocks.MOCK_RESEARCH_GRANT_DATA.admins,
						researchers: Mocks.MOCK_USERS,
					},
				};
			}

			// POST: Create new researh work (project or publication)
			if (endpoint.match(/^\/research\/create$/) && method === "POST") {
				const body = JSON.parse(options.body);
				const prefix = body.type === "Project" ? "RES" : "PUB";

				const newEntry = {
					id: `${prefix}-${Math.floor(100 + Math.random() * 900)}`, // Matches RES-XXX format
					...body,
					isOwner: true,
					isMember: true,
					isStarred: false,
					starsCount: 0,
					status:
						body.status ||
						(body.type === "Project" ? "Open" : "Published"),
					createdAt: new Date().toISOString(), // Use ISO string to match mock format
					currentMemberCount: 1,
					openRolesCount: body.openRoles?.length || 0,
					openRoles: body.openRoles || [],
					timeline: [],
					applicants: [],
				};

				if (body.type === "Project") {
					Mocks.MOCK_RESEARCH_PROJECTS.unshift(newEntry);
				} else {
					Mocks.MOCK_PUBLICATIONS.unshift(newEntry);
				}
				return { success: true, data: newEntry };
			}

			// POST: Update an existing research work (project or publication)
			if (endpoint.includes("/research/update/") && method === "POST") {
				const match = endpoint.match(/\/research\/update\/([^/?#]+)/);
				const id = match ? match[1].toUpperCase() : null;

				if (!id) {
					return { success: false, message: "Missing research ID" };
				}

				const body = JSON.parse(options.body);
				let updatedItem = null;

				[Mocks.MOCK_RESEARCH_PROJECTS, Mocks.MOCK_PUBLICATIONS].forEach(
					(targetArray) => {
						const idx = targetArray.findIndex(
							(item) => String(item.id).toUpperCase() === id,
						);

						if (idx !== -1) {
							let currentItem = { ...targetArray[idx], ...body };

							// Logic for handling Application Status changes (Accepted/Rejected)
							// if the update body contains an applicants array update
							if (body.applicants) {
								const acceptedApp = body.applicants.find(
									(a) => a.status === "Accepted",
								);

								if (acceptedApp) {
									const isPub =
										currentItem.id.startsWith("PUB");

									// 1. Update Participant Lists
									if (isPub) {
										if (
											!currentItem.coAuthors?.includes(
												acceptedApp.name,
											)
										) {
											currentItem.coAuthors = [
												...(currentItem.coAuthors ||
													[]),
												acceptedApp.name,
											];
										}
									} else {
										if (
											!currentItem.collaborators?.includes(
												acceptedApp.name,
											)
										) {
											currentItem.collaborators = [
												...(currentItem.collaborators ||
													[]),
												acceptedApp.name,
											];
										}
									}

									// 2. Increment Member Count
									currentItem.currentMemberCount =
										(currentItem.currentMemberCount || 0) +
										1;

									// 3. Auto-Reject others for the SAME role using userId
									currentItem.applicants =
										currentItem.applicants.map((app) => {
											// If same role but different user, and still pending: reject them
											if (
												app.roleId ===
													acceptedApp.roleId &&
												String(app.userId) !==
													String(
														acceptedApp.userId,
													) &&
												app.status === "Pending"
											) {
												return {
													...app,
													status: "Rejected",
													professorNotes:
														"Position filled.",
												};
											}
											return app;
										});

									// 4. Remove the role from openRoles list
									currentItem.openRoles =
										currentItem.openRoles?.filter(
											(r) =>
												r.id !== acceptedApp.roleId &&
												r.roleName !== acceptedApp.role,
										);
								}
							}

							// Recalculate helper counts
							currentItem.openRolesCount = currentItem.openRoles
								? currentItem.openRoles.length
								: 0;
							currentItem.updatedAt = new Date().toISOString();

							targetArray[idx] = currentItem;
							updatedItem = currentItem;
						}
					},
				);

				if (updatedItem) {
					return {
						success: true,
						data: updatedItem,
						message: "Research work updated successfully",
					};
				}

				return { success: false, message: "Research item not found" };
			}

			// POST: Toggles the "starred" status of a project or publication
			if (
				endpoint.match(/^\/research\/star\/[\w-]+$/) &&
				method === "POST"
			) {
				const id = parts.pop();
				let updatedItem = null;

				// Search through both projects and publications
				[Mocks.MOCK_RESEARCH_PROJECTS, Mocks.MOCK_PUBLICATIONS].forEach(
					(targetArray) => {
						const item = targetArray.find((i) => i.id === id);
						if (item) {
							// Toggle the starred state
							item.isStarred = !item.isStarred;

							// Adjust the stars count based on the new state
							if (item.isStarred) {
								item.starsCount = (item.starsCount || 0) + 1;
							} else {
								item.starsCount = Math.max(
									0,
									(item.starsCount || 0) - 1,
								);
							}

							updatedItem = item;
						}
					},
				);

				if (updatedItem) {
					return {
						success: true,
						data: updatedItem,
						message: updatedItem.isStarred
							? "Item starred"
							: "Item unstarred",
					};
				}

				return {
					success: false,
					message: "Research item not found",
				};
			}

			// ROLES: Manage research roles
			if (endpoint.match(/^\/research\/[\w-]+\/roles/)) {
				const researchId = parts[2];
				const action = parts[4];
				const roleId = parseInt(parts[parts.length - 1]);
				const target = [
					...Mocks.MOCK_RESEARCH_PROJECTS,
					...Mocks.MOCK_PUBLICATIONS,
				].find((item) => item.id === researchId);

				if (!target)
					return {
						success: false,
						message: "Research item not found",
					};
				if (!target.openRoles) target.openRoles = [];

				// DELETE: Remove an open role
				if (method === "DELETE" && action === "delete") {
					target.openRoles = target.openRoles.filter(
						(r) => r.id !== roleId,
					);
					return {
						success: true,
						message: "Role deleted successfully",
					};
				}

				// PUT: Update an existing open role
				if (method === "PUT" && action === "update") {
					const body = JSON.parse(options.body);
					const idx = target.openRoles.findIndex(
						(r) => r.id === roleId,
					);
					if (idx !== -1) {
						target.openRoles[idx] = {
							...target.openRoles[idx],
							...body,
						};
						return { success: true, data: target.openRoles[idx] };
					}
				}

				// POST: Add a new open role
				if (method === "POST" && action === "create") {
					const body = JSON.parse(options.body);
					const newId =
						target.openRoles.length > 0
							? Math.max(
									...target.openRoles.map((r) => r.id || 0),
								) + 1
							: 1;
					const newRole = { id: newId, ...body };
					target.openRoles.push(newRole);
					return { success: true, data: target.openRoles };
				}
			}

			// TIMELINE: Manage research timelines
			if (endpoint.match(/^\/research\/timeline\/[\w-]/)) {
				const researchId = parts[3];
				const eventId = parts[4];
				const targetItem = [
					...Mocks.MOCK_RESEARCH_PROJECTS,
					...Mocks.MOCK_PUBLICATIONS,
				].find((i) => i.id === researchId);

				if (!targetItem)
					return {
						success: false,
						message: "Research item not found",
					};
				if (!targetItem.timeline) targetItem.timeline = [];

				// DELETE: Remove a timeline event
				if (method === "DELETE" && eventId) {
					targetItem.timeline = targetItem.timeline.filter(
						(e) => e.id !== eventId,
					);
					return { success: true, message: "Timeline event deleted" };
				}

				// PUT: Update an existing timeline event
				if (method === "PUT" && eventId) {
					const body = JSON.parse(options.body);
					const idx = targetItem.timeline.findIndex(
						(e) => e.id === eventId,
					);
					if (idx !== -1) {
						targetItem.timeline[idx] = {
							...targetItem.timeline[idx],
							...body,
							updatedAt: new Date().toISOString(),
						};
						return {
							success: true,
							data: targetItem.timeline[idx],
						};
					}
				}

				// POST: Add a new timeline event
				if (method === "POST") {
					const body = JSON.parse(options.body);
					const newEvent = {
						id: `time-${Math.random().toString(36).substr(2, 9)}`,
						...body,
					};
					targetItem.timeline.push(newEvent);
					return { success: true, data: newEvent };
				}

				const events = [...targetItem.timeline].sort(
					(a, b) => new Date(b.date) - new Date(a.date),
				);
				return { success: true, data: events };
			}

			// POST: Handles application submission to a specific research work
			if (
				endpoint.match(/^\/research\/apply\/[\w-]+$/) &&
				method === "POST"
			) {
				const id = parts.pop();
				const body = JSON.parse(options.body);
				const itemType = body.itemType;

				const targetArray =
					itemType === "Project"
						? Mocks.MOCK_RESEARCH_PROJECTS
						: Mocks.MOCK_PUBLICATIONS;
				const item = targetArray.find((i) => i.id === id);

				if (item) {
					if (!item.applicants) item.applicants = [];
					item.applicants.push({
						id: `app-${Math.random().toString(36).slice(2, 11)}`,
						...body,
						status: "Pending",
					});
				}
				return {
					success: true,
					message: "Application submitted successfully",
				};
			}

			// POST: Handles application actions (Accept, Reject, Meeting Scheduled)
			if (
				endpoint.includes("/research/applications/") &&
				method === "POST"
			) {
				const parts = endpoint.split("/");
				const action = parts.pop();
				const appId = parts.pop();

				const normalizedAction = action.toLowerCase();
				const allItems = [
					...Mocks.MOCK_RESEARCH_PROJECTS,
					...Mocks.MOCK_PUBLICATIONS,
				];
				let foundApplicant = null;

				allItems.forEach((item) => {
					const applicantIndex = item.applicants?.findIndex(
						(a) => String(a.id) === String(appId),
					);

					if (applicantIndex !== -1 && item.applicants) {
						const applicant = item.applicants[applicantIndex];
						applicant.status = normalizedAction;
						applicant.updatedAt = new Date().toISOString();
						foundApplicant = { ...applicant };

						if (normalizedAction === "accepted") {
							// 1. Remove the role from open roles
							item.openRoles = item.openRoles.filter(
								(r) => r.id !== applicant.roleId,
							);
							item.openRolesCount = item.openRoles.length;

							// 2. Add to team
							const listKey = item.collaborators
								? "collaborators"
								: "coAuthors";
							if (!item[listKey].includes(applicant.name)) {
								item[listKey].push(applicant.name);
								item.currentMemberCount++;
							}

							// 3. Remove ALL applications for this role
							item.applicants = item.applicants.filter(
								(person) => person.roleId !== applicant.roleId,
							);
						} else if (normalizedAction === "rejected") {
							// NEW: Remove this specific application from the list so it disappears from "Received"
							item.applicants = item.applicants.filter(
								(a) => String(a.id) !== String(appId),
							);
						}
					}
				});

				return {
					success: !!foundApplicant,
					message: foundApplicant
						? `Application ${normalizedAction}.`
						: "Not found",
					data: foundApplicant,
				};
			}

			// POST: Create a new research grant request
			if (
				endpoint.match(/^\/research\/grants\/create$/) &&
				method === "POST"
			) {
				const body = JSON.parse(options.body);

				const newGrant = {
					id: `GRT-${Math.floor(200 + Math.random() * 800)}`,
					requestId: `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
					status: "Pending",
					submissionDate: new Date().toISOString(),
					timeline: [
						{
							id: "gt-1",
							date: new Date().toISOString().split("T")[0],
							event: "Application Submitted",
						},
					],
					documents: body.documents || [],
					...body,
				};

				Mocks.MOCK_GRANT_REQUESTS.unshift(newGrant);

				return {
					success: true,
					data: newGrant,
					message: "Grant request submitted successfully",
				};
			}

			// POST: Update an existing research grant (resubmission logic)
			if (
				endpoint.includes("/research/grants/update/") &&
				method === "POST"
			) {
				const grantId = parts.pop();
				const body = JSON.parse(options.body);

				const grantIdx =
					Mocks.MOCK_RESEARCH_GRANT_DATA.requests.findIndex(
						(g) => g.id === grantId,
					);

				if (grantIdx !== -1) {
					const currentGrant =
						Mocks.MOCK_RESEARCH_GRANT_DATA.requests[grantIdx];

					// Create the log of the state prior to resubmission
					const previousVersion = {
						title: currentGrant.title,
						amount: currentGrant.amount,
						date: currentGrant.date,
						reason: currentGrant.reason,
						supportingDocs: currentGrant.supportingDocs || [],
						adminComments: currentGrant.adminComments,
						lastAdminAction: currentGrant.lastAdminAction,
					};

					// Update the grant with new data and the previous version log
					const updatedGrant = {
						...currentGrant,
						...body,
						status: "Resubmitted",
						date: new Date().toISOString().split("T")[0], // Update to current date
						adminComments: null, // Clear old admin comments for the new review
						lastAdminAction: null, // Reset action timestamp
						previousVersion: previousVersion,
					};

					Mocks.MOCK_RESEARCH_GRANT_DATA.requests[grantIdx] =
						updatedGrant;

					return {
						success: true,
						data: updatedGrant,
						message:
							"Grant resubmitted successfully with version history.",
					};
				}

				return { success: false, message: "Grant request not found" };
			}

			// GET: Fetch user profile with associations (projects and publications)
			if (
				endpoint.match(/^\/research\/users\/profile\/[\w-]+$/) &&
				method === "GET"
			) {
				const userId = parts.pop();
				const user = Mocks.MOCK_USERS.find((u) => u.id === userId);
				if (user) {
					// Hydrate associations with full project/publication objects for the Profile UI
					const hydrated = user.associations.map((assoc) => {
						const source =
							assoc.type === "Project"
								? Mocks.MOCK_RESEARCH_PROJECTS
								: Mocks.MOCK_PUBLICATIONS;
						return {
							...assoc,
							details: source.find(
								(item) => item.id === assoc.id,
							),
						};
					});
					return {
						success: true,
						data: { ...user, associations: hydrated },
					};
				}
				return { success: false, message: "Profile not found" };
			}

			// POST: Update user profile information
			if (
				endpoint.match(
					/^\/research\/users\/profile\/update\/[\w-]+$/,
				) &&
				method === "POST"
			) {
				try {
					const userId = parts.pop();
					const body = JSON.parse(options.body);
					const idx = Mocks.MOCK_USERS.findIndex(
						(u) => u.id === userId,
					);
					if (idx !== -1) {
						Mocks.MOCK_USERS[idx] = {
							...Mocks.MOCK_USERS[idx],
							...body,
							updatedAt: new Date().toISOString(),
						};
						return { success: true, data: Mocks.MOCK_USERS[idx] };
					}
				} catch (err) {
					return {
						success: false,
						message: "Update failed: " + err.message,
					};
				}
			}
		}

		// --- MENTORING ---
		if (endpoint.match(/^\/mentoring\//)) {
			const method = options?.method || "GET";

			// GET: Mentor's view of assigned students
			if (
				endpoint.match(/^\/mentoring\/mentor\/students$/) &&
				method === "GET"
			) {
				return { data: Mocks.MOCK_MENTORING_DATA };
			}

			// POST: Mark the student's attendance for a meeting
			if (
				endpoint.match(/^\/mentoring\/meetings\/attendance\/[\w-]+$/) &&
				method === "POST"
			) {
				try {
					const meetingId = endpoint.split("/").pop();
					const { hasAttended } = JSON.parse(options.body);

					let foundMtg = null;
					Mocks.MOCK_MENTORING_DATA.forEach((s) => {
						const m = s.meetingHistory.find(
							(mtg) => mtg.meetingId === meetingId,
						);
						if (m) foundMtg = m;
					});

					if (foundMtg) {
						foundMtg.hasAttended = hasAttended;
						return {
							success: true,
							message: "Attendance updated.",
						};
					}
					return { success: false, message: "Meeting not found." };
				} catch (err) {
					return { success: false, message: "Update failed." };
				}
			}

			// POST: Mentor completes meeting and fills Notes/Action Plan
			if (
				endpoint.match(/^\/mentoring\/meetings\/complete\/[\w-]+$/) &&
				method === "POST"
			) {
				try {
					const meetingId = endpoint.split("/").pop();
					const {
						summary,
						actionPlan,
						performanceRatings,
						overallRemarks,
					} = JSON.parse(options.body);

					let targetMtg = null;
					let targetStudent = Mocks.MOCK_MENTORING_DATA.find((s) => {
						const m = s.meetingHistory.find(
							(mtg) => mtg.meetingId === meetingId,
						);
						if (m) {
							targetMtg = m;
							return true;
						}
						return false;
					});

					if (targetMtg) {
						// Check the existing status in the mock database
						// This allows the frontend to send only the new notes.
						if (!targetMtg.hasAttended) {
							return {
								success: false,
								message:
									"Cannot submit notes: Student was marked as absent in the logs.",
							};
						}

						// Update the existing record
						targetMtg.status = "Completed";
						targetMtg.discussionSummary = summary;
						targetMtg.actionPlan = actionPlan;
						targetMtg.performanceRatings = performanceRatings;
						targetMtg.overallRemarks = overallRemarks;

						// Update the student's last interaction date
						targetStudent.lastMeetingDate = new Date()
							.toISOString()
							.split("T")[0];

						return {
							success: true,
							message: "Meeting records saved successfully.",
						};
					}
					return {
						success: false,
						message: "Meeting record not found.",
					};
				} catch (err) {
					return {
						success: false,
						message: "Submission failed due to a server error.",
					};
				}
			}
		}

		// --- DOCUMENT REQUEST ---
		if (endpoint.match(/^\/documents\//)) {
			const method = options?.method || "GET";

			// GET: Fetch all document requests and registrar flows
			if (endpoint.match(/^\/documents\/all$/) && method === "GET") {
				return { data: Mocks.MOCK_DOC_REQUESTS };
			}

			// POST: Respond to the student request
			if (
				endpoint.match(/^\/documents\/status\/[\w-]+$/) &&
				method === "POST"
			) {
				try {
					const requestId = endpoint.split("/").pop();
					const { status, reason } = JSON.parse(options.body);

					const request =
						Mocks.MOCK_DOC_REQUESTS.studentRequests.find(
							(r) => r.id === requestId,
						);
					if (request) {
						request.status = status;
						if (reason) request.rejectionReason = reason; // Specifically for rejections
						return {
							success: true,
							message: `Status updated to ${status}`,
						};
					}
					return { success: false, message: "Request not found" };
				} catch (err) {
					return { success: false, message: "Update failed" };
				}
			}

			// POST: Uploads the signed LOR to the Registrar
			if (
				endpoint.match(/^\/documents\/registrar\/process$/) &&
				method === "POST"
			) {
				try {
					const {
						signedDocument,
						registrarNote,
						studentInfo,
						supportingDocs,
					} = JSON.parse(options.body);

					// Server-side lookup using the ID passed from the controller
					const originalReq =
						Mocks.MOCK_DOC_REQUESTS.studentRequests.find(
							(r) => r.id === studentInfo.requestId,
						);

					if (!originalReq)
						throw new Error("Original request not found");

					const newQueueItem = {
						lorId: `LOR-PROC-${Math.floor(1000 + Math.random() * 9000)}`,
						studentName: originalReq.student.name,
						rollNumber: originalReq.student.rollNumber,
						originalRequestId: studentInfo.requestId,
						signedDocument: {
							name: signedDocument.name || "Signed_Document.pdf",
							url:
								signedDocument.url ||
								"/docs/uploads/signed_temp.pdf",
						},
						supportingDocs: {
							name: supportingDocs.name || "Supporting_Doc.pdf",
							url:
								supportingDocs.url ||
								"/docs/uploads/supporting_doc_temp.pdf",
						},
						approvedDocument: null,
						noteToRegistrar: registrarNote,
						sentDate: new Date().toISOString().split("T")[0],
						status: "Pending",
					};

					Mocks.MOCK_DOC_REQUESTS.processingQueue.push(newQueueItem);

					// Keep status as "Under Review" as per requirement
					originalReq.status = "Under Review";

					return { success: true };
				} catch (err) {
					return {
						success: false,
						message: "Processing failed: " + err.message,
					};
				}
			}

			// POST: Registrar-only action to upload the stamped/approved version
			if (
				endpoint.match(/^\/documents\/registrar\/upload\/[\w-]+$/) &&
				method === "POST"
			) {
				const lorId = endpoint.split("/").pop();
				const { approvedDocument } = JSON.parse(options.body);
				const flow = Mocks.MOCK_DOC_REQUESTS.processingQueue.find(
					(f) => f.lorId === lorId,
				);

				if (flow) {
					flow.approvedDocument = approvedDocument;
					flow.status = "Approved"; // Moves it from Pending to Approved in the queue
					return { success: true };
				}
				return { success: false, message: "Flow not found" };
			}

			// POST: Sends the Registrar-approved doc to the student
			if (
				endpoint.match(/^\/documents\/registrar\/send\/[\w-]+$/) &&
				method === "POST"
			) {
				const lorId = endpoint.split("/").pop();
				const flow = Mocks.MOCK_DOC_REQUESTS.processingQueue.find(
					(f) => f.lorId === lorId,
				);

				if (flow) {
					// 1. Update the status in the Processing Queue
					flow.status = "Dispatched";
					flow.sentToStudentDate = new Date()
						.toISOString()
						.split("T")[0];

					// 2. Find the corresponding student request to update its state
					const originalReq =
						Mocks.MOCK_DOC_REQUESTS.studentRequests.find(
							(r) => r.id === flow.originalRequestId,
						);

					if (originalReq) {
						// Update the Request Card to the final state
						originalReq.status = "Dispatched";

						// Attach the final document from the registrar flow
						originalReq.approvedDocument = flow.approvedDocument;
					}

					return { success: true };
				}
				return { success: false, message: "Flow not found" };
			}
		}

		// --- ASSET REQUESTS ---
		if (endpoint.match(/^\/assets\//)) {
			const method = options?.method || "GET";

			// GET: Fetch all assets or user-specific requests
			if (
				endpoint.match(/^\/assets\/(catalog|requests)$/) &&
				method === "GET"
			) {
				const type = endpoint.split("/").pop();
				return {
					success: true,
					data:
						type === "catalog"
							? Mocks.MOCK_ASSET_DATA.catalog
							: Mocks.MOCK_ASSET_DATA,
				};
			}

			// POST: Create a new asset request
			if (endpoint === "/assets/requests" && method === "POST") {
				try {
					const formData = JSON.parse(options.body);
					const newRequest = {
						...formData,
						id: `REQ-${Date.now()}`,
						status: "Pending",
						postedAt: new Date().toISOString(),
						assetName:
							Mocks.MOCK_ASSET_DATA.catalog.find(
								(a) => a.id === formData.assetId,
							)?.name || "Unknown Asset",
					};

					Mocks.MOCK_ASSET_DATA.requests.unshift(newRequest);
					return { success: true, data: newRequest };
				} catch (err) {
					return { success: false, message: "Creation failed" };
				}
			}

			// PUT: Update an existing asset request (Resubmission logic)
			if (
				endpoint.match(/^\/assets\/requests\/[\w-]+$/) &&
				method === "PUT"
			) {
				try {
					const requestId = endpoint.split("/").pop();
					const updateData = JSON.parse(options.body);

					const index = Mocks.MOCK_ASSET_DATA.requests.findIndex(
						(r) => r.id === requestId,
					);

					if (index !== -1) {
						const existingReq =
							Mocks.MOCK_ASSET_DATA.requests[index];

						// Create the history log from the existing data before overwriting
						const previousLog = {
							assetName: existingReq.assetName,
							type: existingReq.type,
							reason: existingReq.reason,
							postedAt: existingReq.postedAt,
							date: existingReq.date,
							startTime: existingReq.startTime,
							endTime: existingReq.endTime,
							duration: existingReq.duration,
							adminComments: existingReq.adminComments,
						};

						// Apply updates, set status to Resubmitted, and attach the log
						Mocks.MOCK_ASSET_DATA.requests[index] = {
							...existingReq,
							...updateData,
							status: "Resubmitted",
							postedAt: new Date().toISOString(), // Update timestamp to current submission
							previousVersion: previousLog,
							adminComments: null, // Clear old comments for the new review cycle
							approvalTime: null, // Reset approval status
						};

						return {
							success: true,
							data: Mocks.MOCK_ASSET_DATA.requests[index],
							message: "Request resubmitted successfully",
						};
					}
					return { success: false, message: "Request not found" };
				} catch (err) {
					return { success: false, message: "Update failed" };
				}
			}
		}

		// --- MAINTENANCE REQUESTS ---
		if (
			endpoint.match(/^\/maintenance\/(my-requests|requests|.*\/status)$/)
		) {
			// GET: Retrieve user requests
			if (
				endpoint.match(/^\/maintenance\/my-requests$/) &&
				(options.method === "GET" || !options.method)
			) {
				return {
					success: true,
					data: {
						requests: Mocks.MOCK_MAINTENANCE_DATA.requests,
						technicians:
							Mocks.MOCK_MAINTENANCE_DATA.technicians || [],
						admins: Mocks.MOCK_MAINTENANCE_DATA.admins || [],
						issueTypes:
							Mocks.MOCK_MAINTENANCE_DATA.issueTypes || [],
					},
				};
			}

			// POST: Create a new request
			if (
				endpoint.match(/^\/maintenance\/requests$/) &&
				options.method === "POST"
			) {
				const newRequest = JSON.parse(options.body);

				// Generate the next ID (e.g., REQ005)
				const nextIdNumber =
					Mocks.MOCK_MAINTENANCE_DATA.requests.length + 1;
				const formattedId = `REQ${String(nextIdNumber).padStart(3, "0")}`;

				const fullRequest = {
					...newRequest,
					id: formattedId,
					status: "pending",
					createdAt: new Date().toISOString(),
					submittedBy: "Professor", // Defaulting to Professor for mock
					submittedByUserId: 1,
					rejectionReason: null,
					adminRemarks: "",
					requiresAction: false,
					assignedTechnicianId: null,
				};

				Mocks.MOCK_MAINTENANCE_DATA.requests.unshift(fullRequest);
				return { success: true, data: fullRequest };
			}

			// PATCH: Update status
			if (
				endpoint.match(
					/^\/maintenance\/requests\/[A-Z0-9-]+\/status$/,
				) &&
				options.method === "PATCH"
			) {
				const urlParts = endpoint.split("/");
				const requestId = urlParts[3]; // Keep as string for comparison
				const { status, adminRemarks } = JSON.parse(options.body);

				const req = Mocks.MOCK_MAINTENANCE_DATA.requests.find(
					(r) => r.id === requestId,
				);

				if (req) {
					req.status = status;
					if (adminRemarks) req.adminRemarks = adminRemarks;
					return { success: true, data: req };
				}
				return { success: false, message: "Request not found" };
			}
		}

		// --- FINANCE MANAGEMENT ---
		if (endpoint.match(/^\/finance\//)) {
			const method = options?.method || "GET";
			const segments = endpoint.split("/");
			const type = segments[2]; // 'expenses' or 'advances'

			// GET: Fetch list of expenses or advances + admins
			if (
				endpoint.match(/^\/finance\/(expenses|advances)\/list$/) &&
				method === "GET"
			) {
				return {
					success: true,
					data: {
						[type]: Mocks.MOCK_FINANCE_DATA[type],
						admins: Mocks.MOCK_FINANCE_DATA.admins,
					},
				};
			}

			// POST: Create a new expense or advance request
			if (
				endpoint.match(/^\/finance\/(expenses|advances)\/create$/) &&
				method === "POST"
			) {
				try {
					const formData = JSON.parse(options.body);
					const list = Mocks.MOCK_FINANCE_DATA[type];

					/**
					 * Generates a new record and adds it to the top of the mock list.
					 */
					const newRequest = {
						...formData,
						id: `FIN-${Date.now()}`,
						status: "Pending",
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						adminComments: null,
					};

					list.unshift(newRequest);
					return { success: true, data: newRequest };
				} catch (err) {
					return { success: false, message: "Creation failed" };
				}
			}

			// PATCH: Update an existing record (Resubmission logic)
			if (
				endpoint.match(
					/^\/finance\/(expenses|advances)\/[\w-]+\/update$/,
				) &&
				method === "PATCH"
			) {
				try {
					const recordId = segments[3];
					const updateData = JSON.parse(options.body);
					const list = Mocks.MOCK_FINANCE_DATA[type];
					const index = list.findIndex(
						(item) => item.id === recordId,
					);

					if (index !== -1) {
						const existing = list[index];

						/**
						 * Archive the current state into previousVersion before updating.
						 */
						const previousLog = {
							title: existing.title,
							category: existing.category,
							description: existing.description,
							[type === "expenses"
								? "amount_spent"
								: "amount_requested"]:
								existing.amount_spent ||
								existing.amount_requested,
							date: existing.date || existing.createdAt,
							adminComments: existing.adminComments,
							...(type === "expenses" && {
								proof_doc_link: existing.proof_doc_link,
							}),
						};

						list[index] = {
							...existing,
							...updateData,
							status: "Resubmitted",
							updatedAt: new Date().toISOString(),
							previousVersion: previousLog,
							adminComments: null,
							approvalTime: null,
						};

						return {
							success: true,
							data: list[index],
							message: `${type.slice(0, -1)} resubmitted successfully`,
						};
					}
					return { success: false, message: "Record not found" };
				} catch (err) {
					return { success: false, message: "Update failed" };
				}
			}
		}

		// --- PAYROLL ---
		if (endpoint.match(/^\/payroll\//)) {
			const method = options?.method || "GET";

			// GET: Fetch payroll transaction history
			if (endpoint.match(/^\/payroll\/history$/) && method === "GET") {
				return { success: true, data: Mocks.MOCK_PAYROLL.history };
			}

			// GET: Fetch current month's salary breakdown
			if (endpoint.match(/^\/payroll\/breakdown$/) && method === "GET") {
				return {
					success: true,
					data: Mocks.MOCK_PAYROLL.currentBreakdown,
				};
			}
		}

		// --- DEPARTMENT: OVERVIEW ---
		if (endpoint.match(/^\/department\/overview\/?$/) && options.method === "GET") {
			if (currentRole !== "hod") return { success: false, message: "Unauthorized to access data" };
			
			return { success: true, data: Mocks.MOCK_DEPARTMENT_OVERVIEW };
		}

		// --- DEPARTMENT: COURSES ---
		// GET: Fetch department courses and associated mock data
		if (endpoint.match(/^\/department\/courses\/?$/)) {
			const method = options?.method || "GET";

			if (method === "GET") {
				return {
					success: true,
					data: {
						courses: [...Mocks.SHARED_COHORTS, ...Mocks.MOCK_ARCHIVED_COURSES],
						attendance: Mocks.MOCK_ATTENDANCE_DATA,
						schedules: Mocks.MOCK_COURSE_SCHEDULE,
						mapping: Mocks.DEPARTMENT_MAPPING,
						reflections: Mocks.MOCK_COURSE_REFLECTIONS,
						documents: Mocks.MOCK_COURSE_DOCUMENTS,
					}
				};
			}
		}
		// POST: Update document approval status (HOD Role required)
		if (endpoint.match(/^\/department\/courses\/document-status\/?$/) && options.method === "POST") {
			if (currentRole !== "hod") return { success: false, message: "Unauthorized to update status" };

			const { courseId, type, status, comments } = JSON.parse(options.body);

			if (Mocks.MOCK_COURSE_DOCUMENTS[courseId]) {
				const docIndex = Mocks.MOCK_COURSE_DOCUMENTS[courseId].findIndex(d => d.type === type);

				if (docIndex !== -1) {
					Mocks.MOCK_COURSE_DOCUMENTS[courseId][docIndex].status = status;
					Mocks.MOCK_COURSE_DOCUMENTS[courseId][docIndex].hodComments = comments || null;

					return {
						success: true,
						message: `Document ${status.toLowerCase()} successfully`,
						data: Mocks.MOCK_COURSE_DOCUMENTS[courseId][docIndex]
					};
				}
			}

			return { success: false, message: "Document or Course not found" };
		}

		//  --- DEPARTMENT: FACULTY ---
		if (endpoint.match(/^\/department\/faculty\/?$/) && options.method === "GET") {
			return {
				success: true,
				data: {
					faculty: Mocks.MOCK_DEPARTMENT_FACULTY_DATA.faculty,
					allocations: Mocks.MOCK_DEPARTMENT_FACULTY_DATA.allocations,
					feedback: Mocks.MOCK_DEPARTMENT_FACULTY_DATA.feedback,
				}
			};
		}

		// --- DEPARTMENT: STUDENTS ---
		if (endpoint.match(/^\/department\/students\/?$/) && options.method === "GET") {
			return {
				success: true,
				data: {
					students: Mocks.MOCK_MENTORING_DATA,
				}
			};
		}

		// ========================================================
		// DEAN MODULE: Industry & External Relations
		// ========================================================
		if (endpoint.match(/^\/industry-relations\/dashboard\/?$/) && (options?.method || "GET") === "GET") {
			return { success: true, data: Mocks.MOCK_INDUSTRY_RELATIONS_DATA };
		}

		if (endpoint.match(/^\/industry-relations\/companies\/?$/) && (options?.method || "GET") === "GET") {
			return { success: true, data: Mocks.MOCK_INDUSTRY_RELATIONS_DATA.companies };
		}

		if (endpoint.match(/^\/industry-relations\/companies\/?$/) && options?.method === "POST") {
			const newCompany = JSON.parse(options.body);
			newCompany.id = `CMP-${Date.now()}`;
			Mocks.MOCK_INDUSTRY_RELATIONS_DATA.companies.push(newCompany);
			return { success: true, data: newCompany, message: "Company added successfully" };
		}

		if (endpoint.match(/^\/industry-relations\/companies\/[^/]+\/?$/) && options?.method === "PUT") {
			const id = endpoint.split("/").pop();
			const updates = JSON.parse(options.body);
			const company = Mocks.MOCK_INDUSTRY_RELATIONS_DATA.companies.find(c => c.id === id);
			if (company) {
				Object.assign(company, updates);
				return { success: true, data: company };
			}
			return { success: false, error: "Company not found" };
		}

		if (endpoint.match(/^\/industry-relations\/mous\/?$/)) {
			return { success: true, data: Mocks.MOCK_INDUSTRY_RELATIONS_DATA.mous };
		}

		if (endpoint.match(/^\/industry-relations\/pipelines\/?$/)) {
			return { success: true, data: Mocks.MOCK_INDUSTRY_RELATIONS_DATA.pipelines };
		}

		if (endpoint.match(/^\/industry-relations\/repeat-recruiters\/?$/)) {
			return { success: true, data: Mocks.MOCK_INDUSTRY_RELATIONS_DATA.repeatRecruiters };
		}

		// ========================================================
		// DEAN MODULE: Risk & Governance
		// ========================================================
		if (endpoint.match(/^\/risk-governance\/dashboard\/?$/)) {
			return { success: true, data: Mocks.MOCK_RISK_GOVERNANCE_DATA };
		}

		if (endpoint.match(/^\/risk-governance\/alerts\/?$/)) {
			return { success: true, data: Mocks.MOCK_RISK_GOVERNANCE_DATA.alerts };
		}

		if (endpoint.match(/^\/risk-governance\/violations\/?$/)) {
			return { success: true, data: Mocks.MOCK_RISK_GOVERNANCE_DATA.policyViolations };
		}

		if (endpoint.match(/^\/risk-governance\/department-health\/?$/)) {
			return { success: true, data: Mocks.MOCK_RISK_GOVERNANCE_DATA.departmentHealth };
		}

		// ========================================================
		// DEAN MODULE: Advanced Analytics Engine
		// ========================================================
		if (endpoint.match(/^\/advanced-analytics\/dashboard\/?$/)) {
			return { success: true, data: Mocks.MOCK_ADVANCED_ANALYTICS_DATA };
		}

		if (endpoint.match(/^\/advanced-analytics\/heatmap\/?$/)) {
			return { success: true, data: Mocks.MOCK_ADVANCED_ANALYTICS_DATA.heatmap };
		}

		if (endpoint.match(/^\/advanced-analytics\/engagement\/?$/)) {
			return { success: true, data: Mocks.MOCK_ADVANCED_ANALYTICS_DATA.companyEngagement };
		}

		if (endpoint.match(/^\/advanced-analytics\/employability\/?$/)) {
			return { success: true, data: Mocks.MOCK_ADVANCED_ANALYTICS_DATA.employability };
		}

		if (endpoint.match(/^\/advanced-analytics\/placement-funnel\/?$/)) {
			return { success: true, data: Mocks.MOCK_ADVANCED_ANALYTICS_DATA.placementFunnel };
		}

		// ========================================================
		// DEAN MODULE: Faculty Lifecycle Control
		// ========================================================
		if (endpoint.match(/^\/faculty-lifecycle\/dashboard\/?$/)) {
			return { success: true, data: Mocks.MOCK_FACULTY_LIFECYCLE_DATA };
		}

		if (endpoint.match(/^\/faculty-lifecycle\/promotions\/?$/)) {
			return { success: true, data: Mocks.MOCK_FACULTY_LIFECYCLE_DATA.promotions };
		}

		if (endpoint.match(/^\/faculty-lifecycle\/promotions\/[^/]+\/approve\/?$/) && options?.method === "POST") {
			const id = endpoint.split("/")[3];
			const promo = Mocks.MOCK_FACULTY_LIFECYCLE_DATA.promotions.find(p => p.id === id);
			if (promo) { promo.status = "Approved"; return { success: true, data: promo, message: "Promotion approved" }; }
			return { success: false, error: "Not found" };
		}

		if (endpoint.match(/^\/faculty-lifecycle\/sabbaticals\/[^/]+\/approve\/?$/) && options?.method === "POST") {
			const id = endpoint.split("/")[3];
			const sab = Mocks.MOCK_FACULTY_LIFECYCLE_DATA.sabbaticals.find(s => s.id === id);
			if (sab) { sab.status = "Approved"; return { success: true, data: sab, message: "Sabbatical approved" }; }
			return { success: false, error: "Not found" };
		}

		// ========================================================
		// DEAN MODULE: Accreditation & Compliance
		// ========================================================
		if (endpoint.match(/^\/accreditation\/dashboard\/?$/)) {
			return { success: true, data: Mocks.MOCK_ACCREDITATION_DATA };
		}

		// ========================================================
		// DEAN MODULE: Academic Program Governance
		// ========================================================
		if (endpoint.match(/^\/program-governance\/dashboard\/?$/)) {
			// Data is managed inline in the controller's MOCK_DATA constant.
			// This handler is a passthrough for when the real service is called.
			return { success: true, data: {} };
		}

		if (endpoint.match(/^\/program-governance\/proposals\/[^/]+\/review\/?$/) && options?.method === "POST") {
			return { success: true, message: "Proposal review submitted." };
		}

		// ========================================================
		// DEAN MODULE: Curriculum Governance Engine
		// ========================================================
		if (endpoint.match(/^\/curriculum-governance\/dashboard\/?$/)) {
			// Data is managed inline in the controller's MOCK_DATA constant.
			return { success: true, data: {} };
		}

		if (endpoint.match(/^\/curriculum-governance\/workflows\/[^/]+\/advance\/?$/) && options?.method === "POST") {
			return { success: true, message: "Workflow stage advanced." };
		}

		// ========================================================
		// DEAN MODULE: Research Strategy & Intelligence
		// ========================================================
		if (endpoint.match(/^\/research-strategy\/dashboard\/?$/)) {
			return { success: true, data: {} };
		}

		if (endpoint.match(/^\/research-strategy\/clusters\/?$/) && options?.method === "POST") {
			return { success: true, message: "Research cluster created." };
		}

		if (endpoint.match(/^\/research-strategy\/clusters\/[^/]+\/grant\/?$/) && options?.method === "POST") {
			return { success: true, message: "Grant allocated." };
		}

		// ========================================================
		// DEAN MODULE: School Financial Governance
		// ========================================================
		if (endpoint.match(/^\/financial-governance\/dashboard\/?$/)) {
			return { success: true, data: {} };
		}

		if (endpoint.match(/^\/financial-governance\/budgets\/[^/]+\/approve\/?$/) && options?.method === "POST") {
			return { success: true, message: "Budget approved." };
		}

		if (endpoint.match(/^\/financial-governance\/scholarships\/[^/]+\/review\/?$/) && options?.method === "POST") {
			return { success: true, message: "Scholarship reviewed." };
		}

		// Default mock response for unknown endpoints
		return { success: true, data: {} };
	}

	// Real API call
	try {
		const fullUrl = `${API_BASE_URL}${endpoint}`;

		const response = await fetch(fullUrl, {
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		});

		if (!response.ok) {
			const errorText = await response.text();

			let errorData;
			try {
				errorData = JSON.parse(errorText);
			} catch (e) {
				errorData = { message: errorText || "Unknown error" };
			}

			// Special handling for authentication errors
			if (response.status === 401) {
				return {
					success: false,
					error: "Authentication required. Please log in again.",
					statusCode: 401,
				};
			}

			return {
				success: false,
				error: errorData.message || `HTTP ${response.status}`,
				statusCode: response.status,
			};
		}

		const data = await response.json();

		// Handle different response formats:
		// Standard format: { status: "success", data: {...} }
		// Message format: { message: "...", data: {...} }
		// Legacy format: { success: true, data: {...} }
		if (data.status === "success") {
			return { success: true, data: data.data || data };
		} else if (data.message && data.data !== undefined) {
			return { success: true, data: data.data };
		} else if (data.success === true) {
			return { success: true, data: data.data || data };
		} else {
			return { success: true, data };
		}
	} catch (error) {
		console.error("API call - Network error:", error);
		return { success: false, error: "Network error. Please try again." };
	}
};
