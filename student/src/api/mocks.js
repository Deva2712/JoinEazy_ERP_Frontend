// src/api/mocks.js

/**
 * Centralized store for all mock data used during local development and testing.
 * * This file contains static data structures that mimic the shape of backend
 * database responses. It is primarily consumed by the `apiCall` function in
 * `client.js` when the `USE_MOCK_API` flag is set to true.
 */

// My Courses, Cohort, Department: Courses
export const SHARED_COHORTS = [
	{
		id: 1,
		cohort_name: "Introduction to Computer Science",
		course_codes: ["CS101", "EE101", "ME101"],
		batch: "2026",
		semester: 1,
		year: "1st",
		cohort_description:
			"Comprehensive introduction to computer science fundamentals.",
		status: "Live",
		visibility: "Active",
		member_count: 10,
		group_count: 3,
		start_date: "2026-01-20T00:00:00Z",
		end_date: "2026-06-15T00:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		is_creator: false,
		credits: 4,
		faculty: ["Dr. Alan Turing", "Dr. Jane Smith"],
		/**
		 * Section-specific tracking metrics
		 */
		sections: [
			{
				section_name: "CSE-A",
				course_code: "CS101",
				department: "Computer Science",
				professor: "Dr. Alan Turing",
				syllabus_completion: 65,
				students: 45,
				assignments: {
					total_count: 6,
					completed: 4,
					ongoing: 2,
					grading_status: "Pending",
				},
				projects: {
					total_count: 1,
					completed: 1,
					ongoing: 0,
					grading_status: "Completed",
				},
			},
			{
				section_name: "CSE-B",
				course_code: "CS101",
				department: "Computer Science",
				professor: "Dr. Jane Smith",
				syllabus_completion: 62,
				students: 40,
				assignments: {
					total_count: 5,
					completed: 3,
					ongoing: 2,
					grading_status: "Pending",
				},
				projects: {
					total_count: 1,
					completed: 0,
					ongoing: 1,
					grading_status: "Pending",
				},
			},
			{
                section_name: "EE-A",
                course_code: "EE101",
                department: "Electrical Engineering",
                students: 0,
                syllabus_completion: 0,
            },
			{
                section_name: "EE-B",
                course_code: "EE101",
                department: "Electrical Engineering",
                students: 0,
                syllabus_completion: 0,
            },
            {
                section_name: "ME-A",
                course_code: "ME101",
                department: "Mechanical Engineering",
                students: 0,
                syllabus_completion: 0,
            },
            {
                section_name: "ME-B",
                course_code: "ME101",
                department: "Mechanical Engineering",
                students: 0,
                syllabus_completion: 0,
            },
		],
	},
	{
		id: 2,
		cohort_name: "Data Structures & Algorithms",
		course_codes: ["CS201"],
		batch: "2026",
		semester: 2,
		year: "1st",
		cohort_description: "Master essential data structures and algorithms.",
		status: "Live",
		visibility: "Active",
		member_count: 4,
		group_count: 2,
		start_date: "2026-01-15T00:00:00Z",
		end_date: "2026-05-30T00:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		is_creator: false,
		credits: 3,
		faculty: ["Prof. Ada Lovelace"],
		sections: [
			{
				section_name: "CSE-A",
				course_code: "CS201",
				department: "Computer Science",
				professor: "Prof. Ada Lovelace",
				syllabus_completion: 40,
				students: 15,
				assignments: {
					total_count: 6,
					completed: 6,
					ongoing: 0,
					grading_status: "Completed",
				},
				projects: {
					total_count: 2,
					completed: 2,
					ongoing: 0,
					grading_status: "Completed",
				},
			},
			{
				section_name: "CSE-C",
				course_code: "CS201",
				department: "Computer Science",
				professor: "Prof. Ada Lovelace",
				syllabus_completion: 35,
				students: 14,
				assignments: {
					total_count: 8,
					completed: 8,
					ongoing: 0,
					grading_status: "Completed",
				},
				projects: {
					total_count: 2,
					completed: 2,
					ongoing: 0,
					grading_status: "Completed",
				},
			},
		],
	},
	{
		id: 3,
		cohort_name: "Calculus I",
		course_codes: ["MA101", "MATH101"],
		batch: "2026",
		semester: 1,
		year: "1st",
		cohort_description: "Limits, derivatives, integrals, and applications.",
		status: "Live",
		visibility: "Active",
		member_count: 5,
		group_count: 2,
		start_date: "2026-01-18T00:00:00Z",
		end_date: "2026-05-20T00:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		is_creator: false,
		credits: 4,
		faculty: ["Dr. Isaac Newton"],
		sections: [
			{
				section_name: "CSE-A",
				course_code: "MA101",
				department: "Mathematics",
				professor: "Dr. Isaac Newton",
				syllabus_completion: 75,
				students: 85,
				assignments: {
					total_count: 10,
					completed: 6,
					ongoing: 4,
					grading_status: "Pending",
				},
				projects: {
					total_count: 1,
					completed: 0,
					ongoing: 1,
					grading_status: "Pending",
				},
			},
			{
				section_name: "CSE-B",
				course_code: "MA101",
				department: "Mathematics",
				professor: "Dr. Isaac Newton",
				syllabus_completion: 75,
				students: 85,
				assignments: {
					total_count: 10,
					completed: 8,
					ongoing: 2,
					grading_status: "Pending",
				},
				projects: {
					total_count: 1,
					completed: 0,
					ongoing: 1,
					grading_status: "Pending",
				},
			},
			{
				section_name: "ECE-B",
				course_code: "MATH101",
				department: "Electrical Engineering",
				professor: "Dr. Isaac Newton",
				syllabus_completion: 70,
				students: 35,
				assignments: {
					total_count: 10,
					completed: 10,
					ongoing: 0,
					grading_status: "Completed",
				},
				projects: {
					total_count: 1,
					completed: 30,
					ongoing: 5,
					grading_status: "Completed",
				},
			},
		],
	},
	{
		id: 4,
		cohort_name: "Database Systems",
		course_codes: ["CS301", "IS301"],
		batch: "2025",
		semester: 3,
		year: "2nd",
		cohort_description: "Relational databases, SQL, and database design.",
		status: "Live",
		visibility: "Active",
		member_count: 4,
		group_count: 2,
		start_date: "2026-01-20T00:00:00Z",
		end_date: "2026-06-01T00:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		is_creator: false,
		credits: 3,
		faculty: ["Dr. Edgar F. Codd"],
		sections: [
			{
				section_name: "CSE-B",
				course_code: "CS301",
				department: "Computer Science",
				professor: "Dr. Edgar F. Codd",
				syllabus_completion: 25,
				students: 22,
				assignments: {
					total_count: 4,
					completed: 4,
					ongoing: 0,
					grading_status: "Completed",
				},
				projects: {
					total_count: 1,
					completed: 1,
					ongoing: 0,
					grading_status: "Completed",
				},
			},
			{
				section_name: "IT-A",
				course_code: "IS301",
				department: "Information Technology",
				professor: "Dr. Edgar F. Codd",
				syllabus_completion: 20,
				students: 18,
				assignments: {
					total_count: 4,
					completed: 3,
					ongoing: 1,
					grading_status: "Pending",
				},
				projects: {
					total_count: 1,
					completed: 0,
					ongoing: 1,
					grading_status: "Pending",
				},
			},
		],
	},
];

export const MOCK_ARCHIVED_COURSES = [
    {
        id: 105,
        cohort_name: "Introduction to Python",
        course_codes: ["CS101"],
        batch: "2025",
        semester: 1,
        year: "1st",
        cohort_description:
            "Comprehensive introduction to Python programming covering basics, data structures, OOP, and file handling. Perfect for beginners looking to start their programming journey.",
        status: "Archived",
        visibility: "Archived",
        member_count: 42,
        group_count: 8,
        start_date: "2025-01-15T00:00:00Z",
        end_date: "2025-05-15T00:00:00Z",
        created_at: "2025-01-01T08:00:00Z",
        is_creator: false,
        credits: 4,
        faculty: ["Dr. Alan Turing"],
        /**
         * Section-specific tracking metrics
         */
        sections: [
            {
                section_name: "CSE-A",
                course_code: "CS101",
                department: "Computer Science",
                professor: "Dr. Alan Turing",
                syllabus_completion: 100,
                students: 42,
                assignments: {
                    total_count: 10,
                    completed: 10,
                    ongoing: 0,
                    grading_status: "Completed",
                },
                projects: {
                    total_count: 2,
                    completed: 2,
                    ongoing: 0,
                    grading_status: "Completed",
                },
            },
        ],
    },
    {
        id: 106,
        cohort_name: "Web Development",
        course_codes: ["CS205"],
        batch: "2025",
        semester: 2,
        year: "1st",
        cohort_description:
            "Learn HTML, CSS, and JavaScript basics. Build responsive websites and understand modern web development practices including Git and deployment.",
        status: "Archived",
        visibility: "Archived",
        member_count: 38,
        group_count: 7,
        start_date: "2025-02-01T00:00:00Z",
        end_date: "2025-06-01T00:00:00Z",
        created_at: "2025-01-20T09:30:00Z",
        is_creator: false,
        credits: 3,
        faculty: ["Prof. Ada Lovelace"],
        sections: [
            {
                section_name: "IT-A",
                course_code: "CS205",
                department: "Information Technology",
                professor: "Prof. Ada Lovelace",
                syllabus_completion: 100,
                students: 38,
                assignments: {
                    total_count: 8,
                    completed: 8,
                    ongoing: 0,
                    grading_status: "Completed",
                },
            },
        ],
    },
    {
        id: 107,
        cohort_name: "Computer Networks",
        course_codes: ["CS560"],
        batch: "2024",
        semester: 4,
        year: "2nd",
        cohort_description:
            "Study network protocols, TCP/IP, routing algorithms, network security, and modern networking concepts. Includes hands-on labs and real-world scenarios.",
        status: "Archived",
        visibility: "Archived",
        member_count: 35,
        group_count: 6,
        start_date: "2024-09-01T00:00:00Z",
        end_date: "2024-12-20T00:00:00Z",
        created_at: "2024-08-15T10:00:00Z",
        is_creator: false,
        credits: 4,
        faculty: ["Dr. Vint Cerf"],
        sections: [
            {
                section_name: "CSE-C",
                course_code: "CS560",
                department: "Computer Science",
                professor: "Dr. Vint Cerf",
                syllabus_completion: 100,
                students: 35,
            },
        ],
    },
    {
        id: 108,
        cohort_name: "Machine Learning Basics",
        course_codes: ["CS740"],
        batch: "2024",
        semester: 3,
        year: "2nd",
        cohort_description:
            "Introduction to ML algorithms, supervised and unsupervised learning, neural networks, and practical applications using Python and scikit-learn.",
        status: "Archived",
        visibility: "Archived",
        member_count: 30,
        group_count: 5,
        start_date: "2024-08-15T00:00:00Z",
        end_date: "2024-12-15T00:00:00Z",
        created_at: "2024-08-01T11:00:00Z",
        is_creator: false,
        credits: 4,
        faculty: ["Dr. Andrew Ng"],
        sections: [
            {
                section_name: "AI-A",
                course_code: "CS740",
                department: "Artificial Intelligence",
                professor: "Dr. Andrew Ng",
                syllabus_completion: 100,
                students: 30,
            },
        ],
    },
    {
        id: 109,
        cohort_name: "Operating Systems",
        course_codes: ["CS450"],
        batch: "2024",
        semester: 3,
        year: "2nd",
        cohort_description:
            "Deep dive into OS concepts: process management, memory management, file systems, deadlocks, and synchronization. Includes Linux kernel programming.",
        status: "Archived",
        visibility: "Archived",
        member_count: 45,
        group_count: 9,
        start_date: "2024-06-01T00:00:00Z",
        end_date: "2024-10-01T00:00:00Z",
        created_at: "2024-05-15T09:00:00Z",
        is_creator: false,
        credits: 4,
        faculty: ["Dr. Linus Torvalds"],
        sections: [
            {
                section_name: "CSE-B",
                course_code: "CS450",
                department: "Computer Science",
                professor: "Dr. Linus Torvalds",
                syllabus_completion: 100,
                students: 45,
            },
        ],
    },
];

export const MOCK_TODO_ASSIGNMENTS = [
	{
		id: 1,
		title: "Python Programming Assignment",
		courseName: "Introduction to Computer Science",
		cohortId: 1,
		dueDate: "2026-01-15",
		status: "pending",
	},
	{
		id: 2,
		title: "Binary Search Tree Implementation",
		courseName: "Data Structures & Algorithms",
		cohortId: 2,
		dueDate: "2026-01-12",
		status: "pending",
	},
	{
		id: 3,
		title: "Integration Problems",
		courseName: "Calculus I",
		cohortId: 3,
		dueDate: "2026-01-18",
		status: "pending",
	},
	{
		id: 4,
		title: "SQL Query Optimization",
		courseName: "Database Systems",
		cohortId: 4,
		dueDate: "2026-01-20",
		status: "pending",
	},
];

export const DEPARTMENT_MAPPING = {
	"Computer Science": "CS",
	"Electrical Engineering": "EE",
	"Mechanical Engineering": "ME",
	"Information Systems": "IS",
};

// Mock dashboard data for professor
export const MOCK_PROFESSOR_DASHBOARD_DATA = {
	isAllowedCreateCohort: true,
	is_allowed_create_cohort: true,
	posts: 12,
	cohortCount: 5,
	cohort_count: 5,
	total_students: 50,
	user: {
		// name: "Dr. Jane Smith",
		// rollNumber: "PROF001",
		// email: "jane.smith@mahindrauniversity.edu.in",

		// Comprehensive Profile Data
		fullName: "Dr. Jane Smith",
		dateOfBirth: "1985-05-15",
		organization: "Mahindra University",
		profile_pic: "https://example.com/profiles/jane-smith.jpg",
		gender: "female",
		employeeId: "PROF-001",
		department: "Computer Science",
		designation: "Associate Professor",
		officeLocation: "Block A, Room 302",
		permanentAddress: "123 Academic Lane, Bengaluru, India",
		currentAddress: "456 University Housing, Bengaluru, India",
		city: "Bengaluru",
		state: "Karnataka",
		pinCode: "560001",
		country: "India",
		mobileNumber: "9876543210",
		alternateNumber: "9876543211",
		panNumber: "ABCDE1234F",
		aadhaarNumber: "123456789012",
		officialEmail: "jane.smith@mahindrauniversity.edu.in",
		personalEmail: "jane.smith.dev@gmail.com",
		linkedinProfile: "https://linkedin.com/in/janesmith-professor",
		documents: [],
	},
	todoAssignments: [],
	createdCohorts: SHARED_COHORTS.map((cohort) => ({
		...cohort,
		is_creator: true,
	})),
	joinedCohorts: [],
};

// Mock dashboard data for Head of Department (HoD)
export const MOCK_HOD_DASHBOARD_DATA = {
	isAllowedCreateCohort: true,
	is_allowed_create_cohort: true,
	isAllowedApproveFaculty: true, // Permissions for administrative overrides

	// Department-wide metrics
	total_faculty: 24,
	total_students: 450,
	department_budget_utilization: "78%",
	pending_approvals: 3,

	user: {
		// Comprehensive Profile Data
		fullName: "Dr. Robert Aris",
		dateOfBirth: "1975-03-22",
		organization: "Mahindra University",
		profile_pic: "https://example.com/profiles/robert-aris.jpg",
		gender: "male",
		employeeId: "HOD-CSE-001",
		department: "Computer Science",
		designation: "Head of Department",
		officeLocation: "Block A, Room 101 (HOD Suite)",
		permanentAddress: "789 Academic Square, Hyderabad, India",
		currentAddress: "12 Faculty Villas, Mahindra Campus, Hyderabad, India",
		city: "Hyderabad",
		state: "Telangana",
		pinCode: "500043",
		country: "India",
		mobileNumber: "9123456780",
		alternateNumber: "9123456781",
		panNumber: "VWXYZ5678G",
		aadhaarNumber: "987654321098",
		officialEmail: "robert.aris@mahindrauniversity.edu.in",
		personalEmail: "r.aris.research@gmail.com",
		linkedinProfile: "https://linkedin.com/in/robert-aris-hod",
		documents: [],
	},

	// Administrative Section
	facultyList: [
		{
			id: "PROF-001",
			name: "Dr. Jane Smith",
			designation: "Associate Professor",
			activeCohorts: 5,
		},
		{
			id: "PROF-012",
			name: "Dr. Alan Turing",
			designation: "Professor",
			activeCohorts: 3,
		},
	],

	todoAssignments: [],

	// High-level view of departmental cohorts
	createdCohorts: SHARED_COHORTS.map((cohort) => ({
		...cohort,
		is_creator: true,
	})),

	joinedCohorts: [],
};

// Mock dashboard data for student
export const MOCK_STUDENT_DASHBOARD_DATA = {
	isAllowedCreateCohort: false,
	is_allowed_create_cohort: false,
	posts: 8,
	cohortCount: 5,
	cohort_count: 5,
	user: {
		name: "John Doe",
		rollNumber: "12113202734",
		organization: "Mahindra University",
	},
	todoAssignments: MOCK_TODO_ASSIGNMENTS,
	createdCohorts: [],
	joinedCohorts: SHARED_COHORTS.map((cohort) => ({
		...cohort,
		is_creator: false,
	})),
};

// Department: Overview
export const MOCK_DEPARTMENT_OVERVIEW = {
	deptName: "Computer Science",
	academicYear: "2025-2026",

	summaryStats: {
		totalCourses: 4,
		totalFaculty: 24,
		totalStudents: {
			count: 450,
			trend: +2.1,
		},
	},

	studentDemographics: [
		{ year: "1st", count: 120, genderRatio: { m: 70, f: 50 } },
		{ year: "2nd", count: 115, genderRatio: { m: 60, f: 55 } },
		{ year: "3rd", count: 108, genderRatio: { m: 58, f: 50 } },
		{ year: "4th", count: 107, genderRatio: { m: 62, f: 45 } },
	],

	researchOutput: {
		totalValueRupee: "1,250,000",
		publicationsThisYear: 18,
		citationsTotal: 450,
		totalActiveGrants: 7,
		pendingProposals: 3,
	},

	placementStats: {
		eligibleStudents: 107,
		placedCount: 85,
		placedPercentage: 79.4,
		averagePackageLpa: 12.5,
		highestPackageLpa: 45.0,
	},

	// Urgent notifications requiring HoD attention
	quickAlerts: [
		{
			id: "ALT-CS-101",
			type: "CRITICAL_ATTENDANCE",
			message:
				"Operating Systems (CS402) dropped below 75% attendance for 3 consecutive classes",
			severity: "high",
			actionRequired: "Review with Course Coordinator",
		},
		{
			id: "ALT-CS-102",
			type: "GRADING_OVERDUE",
			message:
				"Mid-term grading for Advanced Algorithms (CS401) is 48h overdue",
			severity: "medium",
			actionRequired: "Notify Prof. Smith",
		},
		{
			id: "ALT-CS-103",
			type: "ASSET_CONFLICT",
			message: "Lab 4 overlapping booking detected for Apr 5, 2026",
			severity: "low",
			actionRequired: "Reschedule Lab Section B",
		},
	],
};

// Department: Faculty
export const MOCK_DEPARTMENT_FACULTY_DATA = {
    faculty: [
        {
            id: "fac_101",
            name: "Dr. Alan Turing",
            designation: "Professor",
            email: "a.turing@university.edu",
            department: "Computer Science",
			attendancePercentage: 92,
            maxLoadHours: 18,
            currentLoadHours: 3,
            isAvailable: true,
            performance: {
                researchPapers: 12,
                projectsGuided: 5,
                conferencesAttended: 8,
                contributions: ["Curriculum Committee", "AI Ethics Board"],
            },
            coursesHandled: ["CS101", "CS502"],
        },
        {
            id: "fac_102",
            name: "Dr. Jane Smith",
            designation: "Assistant Professor",
            email: "j.smith@university.edu",
            department: "Computer Science",
			attendancePercentage: 88,
            maxLoadHours: 22,
            currentLoadHours: 4,
            isAvailable: true,
            performance: {
                researchPapers: 4,
                projectsGuided: 2,
                conferencesAttended: 3,
                contributions: ["Student Mentorship Program"],
            },
            coursesHandled: ["CS101", "CS202"],
        },
        {
            id: "fac_103",
            name: "Dr. Isaac Newton",
            designation: "Professor",
            email: "i.newton@university.edu",
            department: "Mathematics",
			attendancePercentage: 95,
            maxLoadHours: 24,
            currentLoadHours: 12,
            isAvailable: true,
            performance: {
                researchPapers: 25,
                projectsGuided: 10,
                conferencesAttended: 15,
                contributions: ["Academic Council", "Research Head"],
            },
            coursesHandled: ["MA101", "MATH101"],
        },
        {
            id: "fac_104",
            name: "Prof. Ada Lovelace",
            designation: "Associate Professor",
            email: "a.lovelace@university.edu",
            department: "Computer Science",
            attendancePercentage: 90,
            maxLoadHours: 20,
            currentLoadHours: 6,
            isAvailable: true,
            performance: {
                researchPapers: 8,
                projectsGuided: 7,
                conferencesAttended: 5,
                contributions: ["Coding Club Coordinator"],
            },
            coursesHandled: ["CS201"],
        },
        {
            id: "fac_105",
            name: "Dr. Edgar F. Codd",
            designation: "Professor",
            email: "e.codd@university.edu",
            department: "Computer Science",
			attendancePercentage: 93,
            maxLoadHours: 20,
            currentLoadHours: 6,
            isAvailable: true,
            performance: {
                researchPapers: 15,
                projectsGuided: 4,
                conferencesAttended: 6,
                contributions: ["Database Management Committee"],
            },
            coursesHandled: ["CS301", "IS301"],
        },
    ],
    allocations: [
        {
            id: "ALC_001",
            facultyId: "fac_101",
            courseCode: "CS101",
            courseName: "Introduction to Computer Science",
            type: "Lecture",
            hoursPerWeek: 4,
            section: "CSE-A",
            status: "assigned",
            isSubstitute: false,
            classesTaken: 22,
            classesPlanned: 23,
            schedule: [
                { day: "Monday", startTime: "10:00 AM", endTime: "11:00 AM" },
                { day: "Wednesday", startTime: "9:00 AM", endTime: "10:00 AM" },
                { day: "Saturday", startTime: "2:00 PM", endTime: "3:00 PM" }
            ]
        },
        {
            id: "ALC_002",
            facultyId: "fac_102",
            courseCode: "CS101",
            courseName: "Introduction to Computer Science",
            type: "Lecture",
            hoursPerWeek: 4,
            section: "CSE-B",
            status: "assigned",
            isSubstitute: false,
            classesTaken: 38,
            classesPlanned: 40,
            schedule: [
                { day: "Thursday", startTime: "2:00 PM", endTime: "3:00 PM" }
            ]
        },
        {
            id: "ALC_003",
            facultyId: "fac_104",
            courseCode: "CS201",
            courseName: "Data Structures & Algorithms",
            type: "Lecture",
            hoursPerWeek: 3,
            section: "CSE-A",
            status: "assigned",
            isSubstitute: false,
            classesTaken: 24,
            classesPlanned: 25,
            schedule: [
                { day: "Monday", startTime: "9:00 AM", endTime: "10:00 AM" }
            ]
        },
        {
            id: "ALC_004",
            facultyId: "fac_104",
            courseCode: "CS201",
            courseName: "Data Structures & Algorithms",
            type: "Lecture",
            hoursPerWeek: 3,
            section: "CSE-C",
            status: "assigned",
            isSubstitute: false,
            classesTaken: 24,
            classesPlanned: 25,
            schedule: [
                { day: "Wednesday", startTime: "10:00 AM", endTime: "11:00 AM" }
            ]
        },
        {
            id: "ALC_005",
            facultyId: "fac_103",
            courseCode: "MA101",
            courseName: "Calculus I",
            type: "Lecture",
            hoursPerWeek: 4,
            section: "CSE-A",
            status: "assigned",
            isSubstitute: false,
            classesTaken: 27,
            classesPlanned: 30,
            schedule: [
                { day: "Monday", startTime: "8:00 AM", endTime: "9:00 AM" }
            ]
        },
        {
            id: "ALC_006",
            facultyId: "fac_103",
            courseCode: "MA101",
            courseName: "Calculus I",
            type: "Lecture",
            hoursPerWeek: 4,
            section: "CSE-B",
            status: "assigned",
            isSubstitute: false,
            classesTaken: 28,
            classesPlanned: 30,
            schedule: [
                { day: "Monday", startTime: "8:00 AM", endTime: "9:00 AM" }
            ]
        },
        {
            id: "ALC_007",
            facultyId: "fac_103",
            courseCode: "MATH101",
            courseName: "Calculus I",
            type: "Lecture",
            hoursPerWeek: 4,
            section: "ECE-B",
            status: "assigned",
            isSubstitute: false,
            classesTaken: 55,
            classesPlanned: 60,
            schedule: [
                { day: "Thursday", startTime: "11:00 AM", endTime: "12:00 PM" }
            ]
        },
        {
            id: "ALC_008",
            facultyId: "fac_105",
            courseCode: "CS301",
            courseName: "Database Systems",
            type: "Lecture",
            hoursPerWeek: 3,
            section: "CSE-B",
            status: "assigned",
            isSubstitute: false,
            classesTaken: 22,
            classesPlanned: 22,
            schedule: [
                { day: "Tuesday", startTime: "12:00 PM", endTime: "1:00 PM" }
            ]
        },
        {
            id: "ALC_009",
            facultyId: "fac_105",
            courseCode: "IS301",
            courseName: "Database Systems",
            type: "Lecture",
            hoursPerWeek: 3,
            section: "IT-A",
            status: "assigned",
            isSubstitute: false,
            classesTaken: 22,
            classesPlanned: 22,
            schedule: [
                { day: "Thursday", startTime: "2:00 PM", endTime: "3:00 PM" }
            ]
        },
    ],
	feedback: [
        {
            id: "FB_001",
            facultyId: "fac_101",
            rating: 5,
            comment: "Excellent teaching style and very approachable.",
            date: "2026-04-10"
        },
        {
            id: "FB_002",
            facultyId: "fac_103",
            rating: 4,
            comment: "Very knowledgeable, though assignments are quite challenging.",
            date: "2026-04-12"
        },
        {
            id: "FB_003",
            facultyId: "fac_102",
            rating: 5,
            comment: null, 
            date: "2026-04-14"
        },
        {
            id: "FB_004",
            facultyId: "fac_101",
            rating: 5,
            comment: "Makes complex concepts like AI ethics very easy to understand.",
            date: "2026-04-15"
        },
        {
            id: "FB_005",
            facultyId: "fac_101",
            rating: 4,
            comment: "Great professor, just wish the lab sessions were a bit longer.",
            date: "2026-04-16"
        },
        {
            id: "FB_006",
            facultyId: "fac_102",
            rating: 4,
            comment: "Very helpful during office hours.",
            date: "2026-04-17"
        },
        {
            id: "FB_007",
            facultyId: "fac_102",
            rating: 5,
            comment: "Amazing support for the mentorship program!",
            date: "2026-04-18"
        }
    ],
};

// Detailed assignments for each course
export const MOCK_COURSE_ASSIGNMENTS = {
	1: [
		// Introduction to Computer Science
		{
			id: 100,
			title: "HTML & CSS Fundamentals",
			description:
				"Create a responsive portfolio website using HTML5 and CSS3",
			dueDate: "2026-01-05T23:59:59Z",
			status: "overdue",
			marks: "100",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2025-12-20T12:00:00Z",
			cohortId: 1,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 101,
			title: "Python Programming Assignment",
			description:
				"Write a Python program to implement basic data structures and algorithms",
			dueDate: "2026-01-15",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-01T12:00:00Z",
			cohortId: 1,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 103,
			title: "JavaScript Functions & Arrays",
			description:
				"Complete exercises on array methods, arrow functions, and callbacks",
			dueDate: "2026-01-18T23:59:59Z",
			status: "submitted",
			marks: "50",
			type: "individual",
			submittedAt: "2026-01-08T14:30:00Z",
			submissions: [
				{
					studentId: 1,
					studentName: "John Doe",
					submittedAt: "2026-01-08T14:30:00Z",
				},
			],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-02T09:00:00Z",
			cohortId: 1,
			submissionLink: "https://forms.google.com/your-form-link",
		},
		{
			id: 104,
			title: "Team Database Design Project",
			description:
				"Design and implement a complete database schema for an e-commerce platform with your team",
			dueDate: "2026-01-07T23:59:59Z",
			status: "overdue",
			marks: "150",
			type: "group",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2025-12-28T10:00:00Z",
			cohortId: 1,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 102,
			title: "Object-Oriented Programming Project",
			description:
				"Design and implement a class hierarchy for a real-world system",
			dueDate: "2026-01-22",
			status: "pending",
			marks: "",
			type: "group",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-05T10:00:00Z",
			cohortId: 1,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 105,
			title: "Team Web Development Project",
			description:
				"Build a full-stack web application with your team using React and Node.js. Include authentication, database integration, and responsive design.",
			dueDate: "2026-01-30T23:59:59Z",
			status: "pending",
			marks: "200",
			type: "group",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-10T10:00:00Z",
			cohortId: 1,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
	],
	2: [
		// Data Structures & Algorithms
		{
			id: 201,
			title: "Binary Search Tree Implementation",
			description:
				"Implement a BST with insert, delete, and search operations",
			dueDate: "2026-01-12",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-02T12:00:00Z",
			cohortId: 2,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 202,
			title: "Graph Algorithms Project",
			description: "Implement Dijkstra's and A* pathfinding algorithms",
			dueDate: "2026-01-18",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-03T12:00:00Z",
			cohortId: 2,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 203,
			title: "Algorithm Analysis Report",
			description:
				"Analyze time and space complexity of common sorting algorithms",
			dueDate: "2026-01-25",
			status: "pending",
			marks: "",
			type: "group",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-04T12:00:00Z",
			cohortId: 2,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
	],
	3: [
		// Calculus I
		{
			id: 301,
			title: "Integration Problems",
			description:
				"Solve definite and indefinite integrals using various techniques",
			dueDate: "2026-01-18",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-03T12:00:00Z",
			cohortId: 3,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 302,
			title: "Derivatives and Applications",
			description:
				"Calculate derivatives and apply them to optimization problems",
			dueDate: "2026-01-24",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-06T12:00:00Z",
			cohortId: 3,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
	],
	4: [
		// Database Systems
		{
			id: 401,
			title: "SQL Query Optimization",
			description:
				"Write and optimize complex SQL queries for a given database schema",
			dueDate: "2026-01-20",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-04T12:00:00Z",
			cohortId: 4,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 402,
			title: "Database Design Project",
			description:
				"Design a normalized database schema for an e-commerce system",
			dueDate: "2026-01-26",
			status: "pending",
			marks: "",
			type: "group",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-07T12:00:00Z",
			cohortId: 4,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
		{
			id: 403,
			title: "NoSQL vs SQL Comparison",
			description:
				"Compare MongoDB and PostgreSQL for a specific use case",
			dueDate: "2026-02-02",
			status: "pending",
			marks: "",
			type: "individual",
			submissions: [],
			createdBy: "Prof. Jane Smith",
			createdAt: "2026-01-08T12:00:00Z",
			cohortId: 4,
			submissionLink: "https://forms.google.com/your-form-link",
			submittedAt: "2026-01-08T14:30:00Z",
		},
	],
};

export const MOCK_RESOURCES = {
	1: {
		// Introduction to Computer Science
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Introduction to Programming",
				dateRange: "Jan 15 - Jan 21",
				totalResources: 2,
				resources: [
					{
						id: 1,
						title: "Lecture Slides: Basic Concepts & Setup",
						description:
							"Essential concepts covered in Week 1 lecture",
						type: "slides",
						url: "https://docs.google.com/presentation/d/1example",
						addedAt: "2026-01-15T10:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
					{
						id: 2,
						title: "Environment Setup Tutorial",
						description:
							"Complete guide to setting up development environment",
						type: "video",
						url: "https://youtube.com/watch?v=example",
						addedAt: "2026-01-15T14:30:00Z",
						addedBy: "Prof. Jane Smith",
					},
				],
			},
			{
				id: 2,
				weekNumber: 2,
				title: "Variables, Data Types & Operators",
				dateRange: "Jan 22 - Jan 28",
				totalResources: 3,
				resources: [
					{
						id: 3,
						title: "Week 2 Lecture Notes",
						description:
							"Comprehensive notes on variables and data types",
						type: "document",
						url: "https://docs.google.com/document/d/1example",
						addedAt: "2026-01-22T09:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
					{
						id: 4,
						title: "Practice Problems",
						description: "Set of 20 practice problems for Week 2",
						type: "document",
						url: "https://drive.google.com/file/d/1example",
						addedAt: "2026-01-23T11:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
					{
						id: 5,
						title: "Reference: Python Official Docs",
						description:
							"Official Python documentation on data types",
						type: "link",
						url: "https://docs.python.org/3/library/stdtypes.html",
						addedAt: "2026-01-24T15:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
				],
			},
			{
				id: 3,
				weekNumber: 3,
				title: "Control Structures & Logic",
				dateRange: "Jan 29 - Feb 4",
				totalResources: 0,
				resources: [],
			},
		],
		stats: {
			totalWeeks: 3,
			totalResources: 5,
		},
	},
	2: {
		// Data Structures & Algorithms
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Arrays and Linked Lists",
				dateRange: "Jan 10 - Jan 16",
				totalResources: 2,
				resources: [
					{
						id: 1,
						title: "Array Operations Lecture",
						description:
							"Understanding array operations and complexity",
						type: "slides",
						url: "https://docs.google.com/presentation/d/2example",
						addedAt: "2026-01-10T10:00:00Z",
						addedBy: "Prof. Sarah Williams",
					},
					{
						id: 2,
						title: "Linked List Implementation",
						description: "Step by step linked list coding tutorial",
						type: "video",
						url: "https://youtube.com/watch?v=example2",
						addedAt: "2026-01-11T14:00:00Z",
						addedBy: "Prof. Sarah Williams",
					},
				],
			},
		],
		stats: {
			totalWeeks: 1,
			totalResources: 2,
		},
	},
	3: {
		// Calculus I
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Limits and Continuity",
				dateRange: "Jan 12 - Jan 18",
				totalResources: 3,
				resources: [
					{
						id: 1,
						title: "Limits Lecture Slides",
						description:
							"Introduction to limits and their properties",
						type: "slides",
						url: "https://docs.google.com/presentation/d/3example",
						addedAt: "2026-01-12T09:00:00Z",
						addedBy: "Dr. Michael Brown",
					},
					{
						id: 2,
						title: "Continuity Examples",
						description: "Worked examples of continuous functions",
						type: "document",
						url: "https://docs.google.com/document/d/3example",
						addedAt: "2026-01-13T10:00:00Z",
						addedBy: "Dr. Michael Brown",
					},
					{
						id: 3,
						title: "Practice Problems Set 1",
						description: "Problems on limits and continuity",
						type: "document",
						url: "https://drive.google.com/file/d/3example",
						addedAt: "2026-01-14T11:00:00Z",
						addedBy: "Dr. Michael Brown",
					},
				],
			},
		],
		stats: {
			totalWeeks: 1,
			totalResources: 3,
		},
	},
	4: {
		// Database Systems
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Database Fundamentals",
				dateRange: "Jan 10 - Jan 16",
				totalResources: 2,
				resources: [
					{
						id: 1,
						title: "Introduction to Databases",
						description: "Overview of database concepts and DBMS",
						type: "slides",
						url: "https://docs.google.com/presentation/d/4example",
						addedAt: "2026-01-10T10:00:00Z",
						addedBy: "Dr. Robert Chen",
					},
					{
						id: 2,
						title: "SQL Basics Tutorial",
						description: "Getting started with SQL queries",
						type: "video",
						url: "https://youtube.com/watch?v=example4",
						addedAt: "2026-01-11T14:00:00Z",
						addedBy: "Dr. Robert Chen",
					},
				],
			},
		],
		stats: {
			totalWeeks: 1,
			totalResources: 2,
		},
	},
	102: {
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Introduction to Programming",
				dateRange: "Jan 15 - Jan 21",
				totalResources: 2,
				resources: [
					{
						id: 1,
						title: "Lecture Slides: Basic Concepts & Setup",
						description:
							"Essential concepts covered in Week 1 lecture",
						type: "slides", // slides, video, document, link
						url: "https://docs.google.com/presentation/...",
						addedAt: "2026-01-15T10:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
					{
						id: 2,
						title: "Environment Setup Tutorial",
						description:
							"Complete guide to setting up development environment",
						type: "video",
						url: "https://youtube.com/watch?v=...",
						addedAt: "2026-01-15T14:30:00Z",
						addedBy: "Prof. Jane Smith",
					},
				],
			},
			{
				id: 2,
				weekNumber: 2,
				title: "Variables, Data Types & Operators",
				dateRange: "Jan 22 - Jan 28",
				totalResources: 3,
				resources: [
					{
						id: 3,
						title: "Week 2 Lecture Notes",
						description:
							"Comprehensive notes on variables and data types",
						type: "document",
						url: "https://docs.google.com/document/...",
						addedAt: "2026-01-22T09:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
					{
						id: 4,
						title: "Practice Problems",
						description: "Set of 20 practice problems for Week 2",
						type: "document",
						url: "https://drive.google.com/file/...",
						addedAt: "2026-01-23T11:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
					{
						id: 5,
						title: "Reference: Python Official Docs",
						description:
							"Official Python documentation on data types",
						type: "link",
						url: "https://docs.python.org/3/library/stdtypes.html",
						addedAt: "2026-01-24T15:00:00Z",
						addedBy: "Prof. Jane Smith",
					},
				],
			},
			{
				id: 3,
				weekNumber: 3,
				title: "Control Structures & Logic",
				dateRange: "Jan 29 - Feb 4",
				totalResources: 0,
				resources: [],
			},
		],
		stats: {
			totalWeeks: 3,
			totalResources: 5,
		},
	},
	103: {
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Database Fundamentals",
				dateRange: "Jan 10 - Jan 16",
				totalResources: 2,
				resources: [
					{
						id: 1,
						title: "Introduction to Databases",
						description: "Overview of database concepts",
						type: "slides",
						url: "https://docs.google.com/presentation/...",
						addedAt: "2026-01-10T10:00:00Z",
						addedBy: "Dr. Robert Chen",
					},
					{
						id: 2,
						title: "SQL Basics Tutorial",
						description: "Getting started with SQL queries",
						type: "video",
						url: "https://youtube.com/watch?v=...",
						addedAt: "2026-01-11T14:00:00Z",
						addedBy: "Dr. Robert Chen",
					},
				],
			},
		],
		stats: {
			totalWeeks: 1,
			totalResources: 2,
		},
	},
	104: {
		weeks: [
			{
				id: 1,
				weekNumber: 1,
				title: "Introduction to Algorithms",
				dateRange: "Jan 12 - Jan 18",
				totalResources: 1,
				resources: [
					{
						id: 1,
						title: "Algorithm Analysis Slides",
						description: "Time and space complexity analysis",
						type: "slides",
						url: "https://docs.google.com/presentation/...",
						addedAt: "2026-01-12T09:00:00Z",
						addedBy: "Prof. Sarah Williams",
					},
				],
			},
		],
		stats: {
			totalWeeks: 1,
			totalResources: 1,
		},
	},
};

export const MOCK_COURSE_DETAILS = [
	{
		id: 101,
		title: "React Basics[CS240]",
		description:
			"Learn fundamentals of React including components, state, and props.Deep dive into advanced JS concepts like closures, async/await, event loop, and ES6+ features. Build scalable applications",
		status: "Live",
		organization_name: "Mahindra University",
		createdAt: "2025-06-21T10:00:00Z",
		memberCount: 25,
		groupCount: 5,
		link: "/course/101",
		is_admin: false, // Will be overridden by API call based on userRole
		user_type: 0, // Will be overridden by API call based on userRole
		detail_sections: [
			{
				id: 1,
				title: "Course Overview",
				subsec_description:
					"This course covers React basics including JSX, components, state, props, and lifecycle methods. Deep dive into advanced JS concepts like closures, async/await, event loop, and ES6+ features. Build scalable applications",
			},
			{
				id: 2,
				title: "Syllabus",
				subsec_description:
					"Week 1: JSX & Components\nWeek 2: State & Props\nWeek 3: Lifecycle Methods\nWeek 4: Hooks Introduction",
			},
			{
				id: 3,
				title: "Instructor Info",
				subsec_description:
					"John Doe, Senior React Developer, 10 years of experience in frontend development.",
			},
		],
	},
	{
		id: 102,
		title: "Advanced JavaScript",
		description:
			"Deep dive into advanced JS concepts like closures, async/await, and event loop.",
		status: "Live",
		organization_name: "Mahindra University",
		createdAt: "2025-07-01T09:00:00Z",
		memberCount: 18,
		groupCount: 4,
		link: "/course/102",
		is_admin: false, // Will be overridden by API call based on userRole
		user_type: 0, // Will be overridden by API call based on userRole
		detail_sections: [
			{
				id: 1,
				title: "Course Overview",
				subsec_description:
					"Advanced topics in JavaScript including closures, promises, async/await, and ES6+ features.",
			},
			{
				id: 2,
				title: "Syllabus",
				subsec_description:
					"Week 1: Closures\nWeek 2: Event Loop & Async JS\nWeek 3: Promises & Async/Await\nWeek 4: ES6+ Features",
			},
			{
				id: 3,
				title: "Instructor Info",
				subsec_description:
					"Jane Smith, Senior JS Developer, specialized in modern JavaScript frameworks.",
			},
		],
	},
];

export const MOCK_COURSE_MEMBERS = {
	1: {
		// Introduction to Computer Science
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				isYou: true,
			},
			{
				id: 2,
				name: "Alice Johnson",
				rollNumber: "ST21BTECH11001",
				isYou: false,
			},
			{
				id: 3,
				name: "Charlie Lee",
				rollNumber: "ST21BTECH11003",
				isYou: false,
			},
			{
				id: 4,
				name: "David Kim",
				rollNumber: "ST21BTECH11004",
				isYou: false,
			},
			{
				id: 5,
				name: "Eva Green",
				rollNumber: "ST21BTECH11005",
				isYou: false,
			},
		],
		groups: [
			{
				id: 1,
				name: "Team Alpha",
				members: [1, 4],
				isYouInGroup: true,
			},
			{
				id: 2,
				name: "Team Beta",
				members: [2, 5],
				isYouInGroup: false,
			},
			{
				id: 3,
				name: "Team Gamma",
				members: [3],
				isYouInGroup: false,
			},
		],
	},
	2: {
		// Data Structures & Algorithms
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				isYou: true,
			},
			{
				id: 6,
				name: "Frank Hall",
				rollNumber: "ST21BTECH11006",
				isYou: false,
			},
			{
				id: 7,
				name: "Grace Miller",
				rollNumber: "ST21BTECH11007",
				isYou: false,
			},
			{
				id: 8,
				name: "Hannah Scott",
				rollNumber: "ST21BTECH11008",
				isYou: false,
			},
		],
		groups: [
			{
				id: 1,
				name: "Algorithm Masters",
				members: [6, 1], // Changed: User 6 is now leader, user 1 is member
				isYouInGroup: true,
			},
			{
				id: 2,
				name: "Data Wizards",
				members: [7, 8],
				isYouInGroup: false,
			},
		],
	},
	3: {
		// Calculus I
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				isYou: true,
			},
			{
				id: 10,
				name: "Julia Wang",
				rollNumber: "ST21BTECH11010",
				isYou: false,
			},
			{
				id: 12,
				name: "Lisa Chen",
				rollNumber: "ST21BTECH11012",
				isYou: false,
			},
			{
				id: 13,
				name: "Mike Davis",
				rollNumber: "ST21BTECH11013",
				isYou: false,
			},
			{
				id: 14,
				name: "Nina Patel",
				rollNumber: "ST21BTECH11014",
				isYou: false,
			},
		],
		groups: [
			{
				id: 1,
				name: "Calculus Club",
				members: [1, 10, 12],
				isYouInGroup: true,
			},
			{
				id: 2,
				name: "Math Enthusiasts",
				members: [13, 14],
				isYouInGroup: false,
			},
		],
	},
	4: {
		// Database Systems
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				isYou: true,
			},
			{
				id: 16,
				name: "Priya Sharma",
				rollNumber: "ST21BTECH11016",
				isYou: false,
			},
			{
				id: 17,
				name: "Quinn Lee",
				rollNumber: "ST21BTECH11017",
				isYou: false,
			},
			{
				id: 18,
				name: "Rachel Kim",
				rollNumber: "ST21BTECH11018",
				isYou: false,
			},
		],
		groups: [
			{
				id: 1,
				name: "SQL Squad",
				members: [16],
				isYouInGroup: false,
			},
			{
				id: 2,
				name: "NoSQL Ninjas",
				members: [17, 18],
				isYouInGroup: false,
			},
		],
	},
};

// Schedule & Meeting
export const MOCK_CUSTOM_EVENTS = [
	{
		id: "EVT-001",
		courseName: "Department Faculty Meeting", // Changed from 'title'
		startTime: "10:00 AM", // Changed from ISO to 12h format
		endTime: "11:30 AM", // Changed from ISO to 12h format
		startDate: "2026-04-07", // Date string used for filtering
		endDate: "2026-04-07",
		day: "Tuesday", // Day name used by ScheduleController
		roomNumber: "Conference Room B",
		courseCode: "EVENT", // Triggers the blue UI variant
	},
];
export const MOCK_OFFICE_HOURS = [
	{
		id: 1,
		courseName: "Data Structures",
		slots: [
			{
				day: "Monday",
				startTime: "02:00 PM",
				endTime: "04:00 PM",
			},
			{
				day: "Wednesday",
				startTime: "09:00 AM",
				endTime: "11:00 AM",
			},
		],
	},
	{
		id: 2,
		courseName: "Database Management Systems",
		slots: [
			{
				day: "Tuesday",
				startTime: "01:00 PM",
				endTime: "03:00 PM",
			},
		],
	},
	{
		id: 3,
		courseName: "Software Engineering",
		slots: [
			{
				day: "Thursday",
				startTime: "10:00 AM",
				endTime: "12:00 PM",
			},
			{
				day: "Friday",
				startTime: "04:00 PM",
				endTime: "05:00 PM",
			},
		],
	},
];
export const MOCK_SCHEDULED_MEETINGS = [
	{
		id: "SCH001",
		participantName: "Dr. Robert Chen",
		participantId: "FAC-CS-001",
		participantRole: "Professor",
		type: "Offline",
		category: "Academic",
		startTime: "2026-04-09T09:00:00Z",
		subject: "Research Collaboration Discussion",
		reason: "Initial discussion successful, following up on proposal.",
		rescheduleReason:
			"Urgent faculty meeting called for the original time slot. Moving this to the morning.",
		location: "Department Office 402",
		meetingLink: null,
		status: "rescheduled",
	},
	{
		id: "SCH002",
		participantName: "Alice Johnson",
		participantId: "ST21BTECH11002",
		participantRole: "Student",
		type: "Online",
		category: "Academic",
		subject: "Office Hours: Recursion & DP",
		reason: "Follow up on recursion project.",
		startTime: "2026-04-10T14:30:00Z",
		location: "Virtual Meeting",
		meetingLink: "https://meet.google.com/abc-defg-hij",
		status: "scheduled",
	},
];
export const MOCK_MEETING_REQUESTS = {
	// Outgoing requests sent by the Faculty/User
	outgoing: [
		{
			id: "REQ-PROF001-101",
			participantName: "Dr. Robert Chen",
			participantId: "FAC-CS-001",
			participantRole: "Professor",
			type: "Online",
			category: "Academic",
			subject: "Research Collaboration Discussion",
			requestedTime: "2026-04-18T09:00:00Z",
			reason: "Would like to discuss a potential collaboration on the blockchain research project and explore joint publication opportunities.",
			status: "pending",
			createdAt: "2026-04-05T10:00:00Z",
		},
		{
			id: "REQ-PROF001-102",
			participantName: "Prof. Alan Turing",
			participantId: "FAC-CY-002",
			participantRole: "HoD",
			type: "Offline",
			category: "Academic",
			subject: "Curriculum Review Meeting",
			requestedTime: "2026-04-10T11:00:00Z",
			reason: "Discuss proposed changes to the advanced algorithms syllabus for next semester to align with industry requirements.",
			status: "rejected",
			rejectionReason:
				"Currently unavailable due to ongoing accreditation review. Please reschedule for April.",
			createdAt: "2026-03-01T09:00:00Z",
		},
		{
			id: "REQ-PROF001-103",
			participantName: "Dr. Robert Chen",
			participantId: "FAC-CS-001",
			participantRole: "Professor",
			type: "Offline",
			category: "Academic",
			subject: "Research Collaboration Discussion",
			requestedTime: "2026-04-20T09:00:00Z",
			reason: "Initial discussion successful, following up on proposal.",
			status: "accepted",
			createdAt: "2026-04-05T10:00:00Z",
		},
	],
	// Incoming requests received from students
	incoming: [
		{
			id: "MTG-ST11002-201",
			participantName: "Alice Johnson",
			participantId: "ST21BTECH11002",
			participantRole: "Student",
			type: "Offline",
			category: "Academic",
			subject: "Office Hours: Recursion & DP",
			requestedTime: "2026-04-12T10:00:00Z",
			reason: "Need help understanding recursion and dynamic programming concepts covered in last week's lecture.",
			status: "pending",
			submittedAt: "2026-04-06T09:00:00Z",
		},
		{
			id: "MTG-ST11003-202",
			participantName: "Charlie Lee",
			participantId: "ST21BTECH11003",
			participantRole: "Student",
			type: "Online",
			category: "Academic",
			subject: "Assignment Clarification",
			requestedTime: "2026-04-13T14:00:00Z",
			reason: "Clarification needed on the upcoming assignment requirements for the graph algorithms project.",
			status: "pending",
			submittedAt: "2026-04-06T10:30:00Z",
		},
		{
			id: "MTG-ST11004-203",
			participantName: "David Kim",
			participantId: "ST21BTECH11004",
			participantRole: "Student",
			type: "Offline",
			category: "Academic",
			subject: "Mid-term Performance Review",
			requestedTime: "2026-04-14T11:00:00Z",
			reason: "Would like to discuss my mid-term performance and get guidance on areas to improve before the final exam.",
			status: "pending",
			submittedAt: "2026-04-05T14:00:00Z",
		},
		{
			id: "MTG-ST11002-204",
			participantName: "Alice Johnson",
			participantId: "ST21BTECH11002",
			participantRole: "Student",
			type: "Offline",
			category: "Academic",
			subject: "Office Hours: Recursion & DP",
			requestedTime: "2026-04-21T14:30:00Z",
			reason: "Follow up on recursion project.",
			status: "accepted",
			submittedAt: "2026-04-06T09:00:00Z",
		},
		{
			id: "MTG-ST11001-205",
			participantName: "John Doe",
			participantId: "ST21BTECH11001",
			participantRole: "Student",
			type: "Online",
			category: "Mentoring",
			subject: "Internship & Recommendations",
			requestedTime: "2026-04-25T16:00:00Z",
			reason: "Inquiry regarding summer internship opportunities and recommendation letters.",
			status: "pending",
			submittedAt: "2026-04-24T11:00:00Z",
		},
	],
};

// Session Planning
export const MOCK_COURSE_REFLECTIONS = [
    {
        id: "ref_101",
        classId: 2,
        courseName: "Data Structures & Algorithms",
        courseCode: "CS201",
        batchSection: "CSE-A",
        semester: 3,
        whatWasTaught: "Introduction to Linked Lists and pointer manipulation.",
        needsImprovement: "Visualizing node deletion needs more board work.",
        topicsCarriedForward: "Doubly Linked Lists.",
        personalNotes: "Students asked a lot of questions about memory allocation.",
        visibleToHOD: true,
        date: "2026-03-16T09:00:00.000Z",
        status: "Submitted",
    },
    {
        id: "ref_102",
        classId: 2,
        courseName: "Data Structures & Algorithms",
        courseCode: "CS201",
        batchSection: "CSE-A",
        semester: 3,
        whatWasTaught: "Normalization: 1NF, 2NF, and 3NF with examples.",
        needsImprovement: "",
        topicsCarriedForward: "Boyce-Codd Normal Form (BCNF).",
        personalNotes: "The practical examples from industry helped clarity.",
        visibleToHOD: false,
        date: "2026-03-17T12:00:00.000Z",
        status: "Submitted",
    },
    // --- CSE-A Reflections (Intro to CS) ---
    {
        id: "ref_103",
        classId: 1,
        courseName: "Introduction to Computer Science",
        courseCode: "CS101",
        batchSection: "CSE-A",
        semester: 1,
        whatWasTaught: "Binary arithmetic: Addition and Subtraction using 2's complement.",
        needsImprovement: "Overflow conditions in 2's complement need more practice problems.",
        topicsCarriedForward: "Floating point representation (IEEE 754).",
        personalNotes: "Used a 'circular' number line to explain overflow; seemed to click for most.",
        visibleToHOD: true,
        date: "2026-03-23T10:00:00.000Z",
        status: "Submitted",
    },
    {
        id: "ref_104",
        classId: 1,
        courseName: "Introduction to Computer Science",
        courseCode: "CS101",
        batchSection: "CSE-A",
        semester: 1,
        whatWasTaught: "Introduction to Algorithms: Pseudo-code and Flowcharts.",
        needsImprovement: "Logic for 'While' loops in flowcharts was a bit messy on paper.",
        topicsCarriedForward: "Selection and Iteration control structures.",
        personalNotes: "The class struggled with the 'Diamond' decision symbol logic.",
        visibleToHOD: false,
        date: "2026-03-30T10:00:00.000Z",
        status: "Submitted",
    },
    {
        id: "ref_105",
        classId: 1,
        courseName: "Introduction to Computer Science",
        courseCode: "CS101",
        batchSection: "CSE-A",
        semester: 1,
        whatWasTaught: "Basic Python Syntax: Variables, Data Types, and Input/Output.",
        needsImprovement: "",
        topicsCarriedForward: "Conditional statements (if-else).",
        personalNotes: "First lab session went smoothly. Installation issues were minimal.",
        visibleToHOD: true,
        date: "2026-04-06T10:00:00.000Z",
        status: "Submitted",
    },
    // --- CSE-B Reflections (Intro to CS) ---
    {
        id: "ref_106",
        classId: 1,
        courseName: "Introduction to Computer Science",
        courseCode: "CS101",
        batchSection: "CSE-B",
        semester: 1,
        whatWasTaught: "Memory Hierarchy: Cache, RAM, and Secondary Storage.",
        needsImprovement: "Explain the 'Locality of Reference' concept with better examples.",
        topicsCarriedForward: "Virtual Memory basics.",
        personalNotes: "Students were surprised by the speed difference between L1 cache and HDD.",
        visibleToHOD: true,
        date: "2026-03-26T14:00:00.000Z",
        status: "Submitted",
    },
    {
        id: "ref_107",
        classId: 1,
        courseName: "Introduction to Computer Science",
        courseCode: "CS101",
        batchSection: "CSE-B",
        semester: 1,
        whatWasTaught: "Operating Systems: Role, Functions, and Kernel vs User space.",
        needsImprovement: "Process scheduling algorithms (FCFS vs Round Robin) need a demo.",
        topicsCarriedForward: "File systems and Directory structures.",
        personalNotes: "Group discussion on 'What happens when you press the power button' was very engaging.",
        visibleToHOD: false,
        date: "2026-04-02T14:00:00.000Z",
        status: "Submitted",
    },
    {
        id: "ref_108",
        classId: 1,
        courseName: "Introduction to Computer Science",
        courseCode: "CS101",
        batchSection: "CSE-B",
        semester: 1,
        whatWasTaught: "Networking Fundamentals: IP addresses, DNS, and HTTP.",
        needsImprovement: "The OSI model layers were a bit overwhelming for one session.",
        topicsCarriedForward: "TCP vs UDP protocols.",
        personalNotes: "Used the 'Postal Service' analogy for IP routing; helped visualize the process.",
        visibleToHOD: true,
        date: "2026-04-09T14:00:00.000Z",
        status: "Submitted",
    },
];
export const MOCK_COURSE_DOCUMENTS = {
	1: [
		{
			type: "Course Outline",
			fileName: "outline_cs201.pdf",
			fileLink: "https://example.com/docs/outline_cs201.pdf",
			version: 1,
			uploadDate: "2026-01-10",
			uploadedBy: "Dr. Jane Smith",
			status: "Approved",
			hodComments: null,
		},
		{
			type: "Timeline",
			fileName: "timeline_v1.xlsx",
			fileLink: "https://example.com/docs/timeline_v1.xlsx",
			version: 1,
			uploadDate: "2026-01-12",
			uploadedBy: "Dr. Alan Turing",
			status: "Rejected",
			hodComments: "Please include the holiday schedule for March.",
		},
	],
	2: [
		{
			type: "Course Outline",
			fileName: "outline_cs401.pdf",
			fileLink: "https://example.com/docs/outline_cs401.pdf",
			version: 2,
			uploadDate: "2026-02-03",
			uploadedBy: "Dr. Alan Turing",
			status: "Pending",
			hodComments: null,
		},
		{
			type: "Assessment Plan",
			fileName: "assess_plan.docx",
			fileLink: "https://example.com/docs/assess_plan.docx",
			version: 1,
			uploadDate: "2026-02-05",
			uploadedBy: "Dr. Alan Turing",
			status: "Approved",
			hodComments: null,
		},
	],
};

// Schedule & Meetings, Session Planning
export const MOCK_COURSE_SCHEDULE = [
	{
		id: 1,
		courseName: "Introduction to Computer Science",
		startDate: "2026-01-20",
		endDate: "2026-06-15",
		courseCodes: ["CS101", "EE101", "ME101"],
		courseType: "Theory",
		status: "Ongoing",
		schedule: [
			{
				day: "Monday",
				startTime: "10:00 AM",
				endTime: "11:00 AM",
				courseCode: "CS101",
				roomNumber: "A201",
				buildingName: "Block A",
				batchSection: "CSE-A",
				branch: "CSE",
				semester: 1,
			},
			{
				day: "Wednesday",
				startTime: "9:00 AM",
				endTime: "10:00 AM",
				courseCode: "CS101",
				roomNumber: "A201",
				buildingName: "Block A",
				batchSection: "CSE-A",
				branch: "CSE",
				semester: 1,
			},
			{
				day: "Thursday",
				startTime: "2:00 PM",
				endTime: "3:00 PM",
				courseCode: "CS101",
				roomNumber: "A202",
				buildingName: "Block A",
				batchSection: "CSE-B",
				branch: "CSE",
				semester: 1,
			},
		],
	},
	{
		id: 2,
		courseName: "Data Structures & Algorithms",
		startDate: "2026-01-15",
		endDate: "2026-05-30",
		courseCodes: ["CS201"],
		courseType: "Theory",
		status: "Ongoing",
		schedule: [
			{
				day: "Monday",
				startTime: "9:00 AM",
				endTime: "10:00 AM",
				courseCode: "CS201",
				roomNumber: "B204",
				buildingName: "Block B",
				batchSection: "CSE-A",
				branch: "CSE",
				semester: 2,
			},
			{
				day: "Wednesday",
				startTime: "10:00 AM",
				endTime: "11:00 AM",
				courseCode: "CS201",
				roomNumber: "A101",
				buildingName: "Block A",
				batchSection: "CSE-C",
				branch: "CSE",
				semester: 2,
			},
		],
	},
	{
		id: 3,
		courseName: "Calculus I",
		startDate: "2026-01-18",
		endDate: "2026-05-20",
		courseCodes: ["MA101", "MATH101"],
		courseType: "Theory",
		status: "Ongoing",
		schedule: [
			{
				day: "Monday",
				startTime: "8:00 AM",
				endTime: "9:00 AM",
				courseCode: "MA101",
				roomNumber: "LH-01",
				buildingName: "Lecture Hall",
				batchSection: "CSE-A+B",
				branch: "CSE",
				semester: 1,
			},
			{
				day: "Thursday",
				startTime: "11:00 AM",
				endTime: "12:00 PM",
				courseCode: "MATH101",
				roomNumber: "LH-01",
				buildingName: "Lecture Hall",
				batchSection: "ECE-B",
				branch: "ECE",
				semester: 1,
			},
		],
	},
	{
		id: 4,
		courseName: "Database Systems",
		startDate: "2026-01-20",
		endDate: "2026-06-01",
		courseCodes: ["CS301", "IS301"],
		courseType: "Theory",
		status: "Ongoing",
		schedule: [
			{
				day: "Tuesday",
				startTime: "12:00 PM",
				endTime: "1:00 PM",
				courseCode: "CS301",
				roomNumber: "C101",
				buildingName: "Block C",
				batchSection: "CSE-B",
				branch: "CSE",
				semester: 3,
			},
			{
				day: "Thursday",
				startTime: "2:00 PM",
				endTime: "3:00 PM",
				courseCode: "IS301",
				roomNumber: "D205",
				buildingName: "Block D",
				batchSection: "IT-A",
				branch: "IT",
				semester: 3,
			},
		],
	},
	{
		id: 5,
		courseName: "Operating Systems Lab",
		startDate: "2026-01-10",
		endDate: "2026-06-30",
		courseCodes: ["CS502L"],
		courseType: "Lab",
		status: "Ongoing",
		schedule: [
			{
				day: "Monday",
				startTime: "8:00 AM",
				endTime: "10:00 AM",
				courseCode: "CS502L",
				roomNumber: "Lab 1",
				buildingName: "Lab Block",
				batchSection: "CSE-A",
				branch: "CSE",
				semester: 5,
			},
		],
	},
	{
		id: 6,
		courseName: "Digital Circuits",
		startDate: "2026-01-15",
		endDate: "2026-06-20",
		courseCodes: ["EC501"],
		courseType: "Theory",
		status: "Ongoing",
		schedule: [
			{
				day: "Monday",
				startTime: "1:00 PM",
				endTime: "2:00 PM",
				courseCode: "EC501",
				roomNumber: "E104",
				buildingName: "ECE Block",
				batchSection: "ECE-B",
				branch: "ECE",
				semester: 5,
			},
		],
	},
];

// Library
export const MOCK_LIBRARY_DATA = {
	// Administrative contact information for support
	admins: [
		{
			name: "Librarian",
			email: "library@university.edu",
			phone: "+91 99999 77777",
		},
	],
	// Books currently in the user's possession
	borrowed: [
		{
			id: "BOR001",
			bookTitle: "Introduction to Algorithms",
			author: "Cormen, Leiserson, Rivest & Stein",
			isbn: "978-0-262-03384-8",
			category: "Computer Science",
			borrowedDate: "2026-03-30",
			dueDate: "2026-04-30",
			physicalCopyPickedUp: true,
		},
		{
			id: "BOR002",
			bookTitle: "Clean Code",
			author: "Robert C. Martin",
			isbn: "978-0-13-235088-4",
			category: "Software Engineering",
			borrowedDate: "2026-02-16",
			dueDate: "2026-03-16",
			physicalCopyPickedUp: true,
		},
	],

	// Status of pending, approved, or rejected book requests and extensions
	requests: [
		{
			id: "REQ001",
			bookTitle: "Design Patterns",
			author: "Gang of Four",
			isbn: "978-0-201-63361-0",
			category: "Software Engineering",
			status: "pending",
			requestDate: "2026-02-19",
			durationDays: 30,
			dueDate: null,
		},
		{
			id: "REQ002",
			bookTitle: "The Pragmatic Programmer",
			author: "David Thomas & Andrew Hunt",
			isbn: "978-0-13-595705-9",
			category: "Software Engineering",
			status: "approved",
			requestDate: "2026-03-10",
			approvedDate: "2026-03-11",
			durationDays: 30,
			dueDate: "2026-04-11",
			physicalCopyPickedUp: false,
		},
		{
			id: "REQ003",
			bookTitle: "Operating System Concepts",
			author: "Silberschatz, Galvin & Gagne",
			isbn: "978-1-119-32091-3",
			category: "Computer Science",
			status: "rejected",
			requestDate: "2026-01-28",
			durationDays: 30,
			dueDate: null,
			rejectionReason:
				"All copies are reserved for the semester. Please wait until a copy is available.",
		},
		{
			id: "EXT001",
			bookTitle: "Clean Code",
			author: "Robert C. Martin",
			isbn: "978-0-13-235088-4",
			category: "Software Engineering",
			status: "extension-pending",
			requestDate: "2026-03-15",
			originalBorrowedId: "BOR001",
			additionalDays: 15,
			durationDays: 15,
			dueDate: "2026-04-20",
		},
	],

	// Full library inventory for search and request features
	inventory: [
		{
			id: "BOOK001",
			title: "Computer Networks",
			author: "Andrew S. Tanenbaum",
			isbn: "978-0-13-212695-3",
			category: "Networking",
			availableCopies: 3,
			totalCopies: 5,
		},
		{
			id: "BOOK002",
			title: "Database System Concepts",
			author: "Silberschatz, Korth & Sudarshan",
			isbn: "978-0-07-802215-9",
			category: "Databases",
			availableCopies: 1,
			totalCopies: 4,
		},
		{
			id: "BOOK003",
			title: "Artificial Intelligence: A Modern Approach",
			author: "Stuart Russell & Peter Norvig",
			isbn: "978-0-13-468259-3",
			category: "Artificial Intelligence",
			availableCopies: 2,
			totalCopies: 3,
		},
		{
			id: "BOOK004",
			title: "Structure and Interpretation of Computer Programs",
			author: "Abelson & Sussman",
			isbn: "978-0-26-251087-5",
			category: "Programming Languages",
			availableCopies: 0,
			totalCopies: 2,
		},
		{
			id: "BOOK005",
			title: "Compilers: Principles, Techniques & Tools",
			author: "Aho, Lam, Sethi & Ullman",
			isbn: "978-0-32-148681-3",
			category: "Compilers",
			availableCopies: 4,
			totalCopies: 4,
		},
		{
			id: "BOOK006",
			title: "Software Engineering",
			author: "Ian Sommerville",
			isbn: "978-0-13-394303-0",
			category: "Software Engineering",
			availableCopies: 2,
			totalCopies: 6,
		},
	],
};

// Maintenance Requests
export const MOCK_MAINTENANCE_DATA = {
	/**
	 * Administrative oversight personnel.
	 */
	admins: [
		{
			id: "adm_001",
			name: "Estate Manager",
			role: "University Infrastructure",
			email: "estate.office@university.edu",
			phone: "+91 99999 88888",
			jurisdiction: ["university"],
		},
		{
			id: "adm_002",
			name: "Residential Warden",
			role: "Accommodation Oversight",
			email: "housing.warden@university.edu",
			phone: "+91 99999 77777",
			jurisdiction: ["accommodation"],
		},
	],

	/**
	 * Master registry of technicians.
	 * Requests reference these by 'id'.
	 */
	technicians: [
		{
			id: "tech_01",
			name: "Rajesh Kumar",
			specialty: "Electrical",
			phone: "+91 98765 43210",
		},
		{
			id: "tech_02",
			name: "Suresh Raina",
			specialty: "Plumbing",
			phone: "+91 98765 43211",
		},
		{
			id: "tech_03",
			name: "Amit Singh",
			specialty: "HVAC",
			phone: "+91 98765 43212",
		},
		{
			id: "tech_04",
			name: "Vikram Rathore",
			specialty: "Carpentry",
			phone: "+91 98765 43213",
		},
	],

	issueTypes: [
		{
			key: "Structural",
			label: "Structural",
			components: [
				"Ceiling / Roof",
				"Wall / Partition",
				"Floor / Tiles",
				"Door / Lock",
				"Window / Glass",
				"Staircase / Railing",
				"Other Structural",
			],
		},
		{
			key: "Electrical",
			label: "Electrical",
			components: [
				"Power Outlet / Socket",
				"Light Fixture / Bulb",
				"Circuit Breaker",
				"Wiring / Cabling",
				"UPS / Power Backup",
				"Other Electrical",
			],
		},
		{
			key: "Plumbing",
			label: "Plumbing",
			components: [
				"Tap / Faucet",
				"Toilet / Flush",
				"Sink / Basin",
				"Drain / Sewage",
				"Pipe Leak",
				"Water Heater",
				"Other Plumbing",
			],
		},
		{
			key: "HVAC",
			label: "HVAC / Ventilation",
			components: [
				"Air Conditioner (AC)",
				"Ceiling Fan",
				"Exhaust Fan",
				"Ventilation Duct",
				"Thermostat / Controls",
				"Other HVAC",
			],
		},
		{
			key: "Furniture",
			label: "Furniture",
			components: [
				"Chair / Seat",
				"Desk / Table",
				"Cabinet / Shelf",
				"Whiteboard / Board",
				"Projector Screen",
				"Other Furniture",
			],
		},
		{
			key: "Hardware",
			label: "Hardware",
			components: [
				"Desktop Computer",
				"Laptop",
				"Monitor / Display",
				"Keyboard / Mouse",
				"Printer / Scanner",
				"Lab Equipment",
				"Networking Equipment (Router / Switch)",
				"Server / Rack Equipment",
				"Other Hardware",
			],
		},
		{
			key: "Technical",
			label: "Technical / Software",
			components: [
				"Software Installation / Update",
				"Software License Issue",
				"Operating System",
				"Network / Internet Connectivity",
				"Audio / Speaker System",
				"Projector / Display Output",
				"Smart Board / Interactive Display",
				"CCTV / Security System",
				"Other Technical",
			],
		},
		{
			key: "Other",
			label: "Other",
			components: [
				"General Cleanliness",
				"Pest Control",
				"Safety Hazard",
				"Other",
			],
		},
	],

	requests: [
		{
			id: "REQ001",
			category: "university",
			issueType: "Electrical",
			component: "Light Fixture / Bulb",
			location: "Room 301",
			description: "Flickering lights during lecture.",
			priority: "medium",
			status: "pending",
			createdAt: "2026-03-10T10:00:00Z",
			submittedBy: "Professor",
			adminRemarks: "Checking spare bulb inventory.",
			requiresAction: false,
			assignedTechnicianId: null,
		},
		{
			id: "REQ002",
			category: "accommodation",
			issueType: "HVAC",
			component: "Air Conditioner (AC)",
			location: "Hostel Block C - Room 204",
			description: "AC unit is leaking water inside the room.",
			priority: "high",
			status: "inProgress",
			createdAt: "2026-03-12T14:20:00Z",
			submittedBy: "Student",
			adminRemarks:
				"The technician couldn't spot the leakage. Please contact the technician and explain your issue.",
			requiresAction: true,
			assignedTechnicianId: "tech_03",
		},
		{
			id: "REQ003",
			category: "accommodation",
			issueType: "Plumbing",
			component: "Water Heater",
			location: "Hostel Block C - Room 204",
			description: "Geyser is not heating water.",
			priority: "high",
			status: "solved",
			createdAt: "2026-03-11T07:30:00Z",
			submittedBy: "Student",
			adminRemarks: "Heating element replaced.",
			requiresAction: false,
			assignedTechnicianId: "tech_02",
		},
		{
			id: "REQ004",
			category: "university",
			issueType: "Furniture",
			component: "Chair / Seat",
			location: "Library Second Floor",
			description: "Several swivel chairs have broken wheels.",
			priority: "low",
			status: "viewed",
			createdAt: "2026-03-15T09:00:00Z",
			submittedBy: "Librarian",
			adminRemarks: "Waiting for replacement casters.",
			requiresAction: false,
			assignedTechnicianId: null,
		},
	],
};

// Mentoring
export const MOCK_MENTORING_DATA = [
    {
        studentId: "ST21BTECH11001",
        name: "John Doe",
        department: "Computer Science",
        section: "CSE-A",
        semester: 4,
        emailId: "john.doe@mahindrauniversity.edu.in",
        phoneNumber: "9876543210",
        mentorId: "PROF-001",
        assignmentDate: "2024-08-15",
        academicMetrics: {
            cgpa: 8.0,
            attendance: 88,
            backlogs: 0,
            semesterGrades: [
                { sem: 1, gpa: 7.8 },
                { sem: 2, gpa: 8.0 },
                { sem: 3, gpa: 8.2 },
            ],
            semesterAttendance: [
                { sem: 1, attendance: 95 },
                { sem: 2, attendance: 88 },
                { sem: 3, attendance: 90 },
            ],
            backlogHistory: [],
        },
        lastMeetingDate: "2026-03-15",
        /**
         * Meeting Documentation History:
         * Tracks all past, pending, and scheduled interactions between mentor and student.
         */
        meetingHistory: [
            {
                meetingId: "MTG-ST11001-101",
                date: "2025-11-20",
                status: "Completed",
                hasAttended: true,
                discussionSummary: "Discussed career goals and interest in Machine Learning.",
                actionPlan: {
                    studentTasks: [
                        "Enroll in an online ML certification",
                        "Contribute to one open-source project",
                    ],
                    skillImprovement: [
                        "Python optimization",
                        "Data Visualization",
                    ],
                },
                performanceRatings: {
                    academic: 4,
                    professional: 5,
                    personal: 4,
                },
                overallRemarks: "John is highly motivated. Consistently performs above average.",
            },
            {
                meetingId: "MTG-ST11001-201",
                date: "2026-03-15",
                status: "Pending Documentation",
                hasAttended: null,
                discussionSummary: "",
                actionPlan: { studentTasks: [], skillImprovement: [] },
                performanceRatings: {
                    academic: 0,
                    professional: 0,
                    personal: 0,
                },
                overallRemarks: "",
            },
            {
                meetingId: "MTG-ST11001-205",
                date: "2026-03-30",
                status: "Requested",
                hasAttended: false,
                requestReason: "Inquiry regarding summer internship opportunities and recommendation letters.",
                discussionSummary: null,
                actionPlan: null,
                performanceRatings: null,
                overallRemarks: null,
            },
        ],
    },
    {
        studentId: "ST21BTECH11002",
        name: "Alice Johnson",
        department: "Computer Science",
        section: "CSE-A",
        semester: 4,
        emailId: "alice.j@mahindrauniversity.edu.in",
        phoneNumber: "9876543211",
        mentorId: "PROF-001",
        academicMetrics: {
            cgpa: 6.2,
            attendance: 65,
            backlogs: 2,
            semesterGrades: [
                { sem: 1, gpa: 6.4 },
                { sem: 2, gpa: 6.2 },
                { sem: 3, gpa: 6.6 },
            ],
            semesterAttendance: [
                { sem: 1, attendance: 85 },
                { sem: 2, attendance: 70 },
                { sem: 3, attendance: 60 },
            ],
            backlogHistory: [
                { name: "Discrete Mathematics", code: "CS201", semester: 3 },
                { name: "Data Structures", code: "CS202", semester: 3 },
            ],
        },
        lastMeetingDate: "2026-02-25",
        meetingHistory: [
            {
                meetingId: "MTG-ST11002-301",
                date: "2026-02-25",
                status: "Completed",
                hasAttended: true,
                discussionSummary: "Addressal of declining attendance. Alice cited difficulty managing time.",
                actionPlan: {
                    studentTasks: [
                        "Attend remedial classes for Data Structures",
                    ],
                    skillImprovement: ["Time Management"],
                },
                performanceRatings: {
                    academic: 2,
                    professional: 3,
                    personal: 2,
                },
                overallRemarks: "Critical intervention needed. Recovery schedule mapped.",
            },
            {
                meetingId: "MTG-ST11002-302",
                date: "2026-03-22",
                status: "Missed",
                hasAttended: false,
                discussionSummary: "",
                actionPlan: { studentTasks: [], skillImprovement: [] },
                performanceRatings: {
                    academic: 0,
                    professional: 0,
                    personal: 0,
                },
                overallRemarks: "",
            },
        ],
    },
    {
        studentId: "ST22BTECH12005",
        name: "Robert Smith",
        department: "Mechanical Engineering",
        section: "CSE-B",
        semester: 4,
        emailId: "robert.s@mahindrauniversity.edu.in",
        phoneNumber: "9876543215",
        mentorId: "PROF-001",
        assignmentDate: "2024-08-15",
        academicMetrics: {
            cgpa: 9.2,
            attendance: 94,
            backlogs: 0,
            semesterGrades: [
                { sem: 1, gpa: 9.0 },
                { sem: 2, gpa: 9.3 },
                { sem: 3, gpa: 9.4 },
            ],
            semesterAttendance: [
                { sem: 1, attendance: 98 },
                { sem: 2, attendance: 92 },
                { sem: 3, attendance: 94 },
            ],
            backlogHistory: [],
        },
        lastMeetingDate: "2026-01-10",
        meetingHistory: [
            {
                meetingId: "MTG-ST12005-101",
                date: "2026-01-10",
                status: "Completed",
                hasAttended: true,
                discussionSummary: "Student expressed interest in pursuing a minor in Robotics.",
                actionPlan: {
                    studentTasks: ["Check prerequisites for Robotics minor", "Speak with department head"],
                    skillImprovement: ["MATLAB", "SolidWorks"],
                },
                performanceRatings: {
                    academic: 5,
                    professional: 4,
                    personal: 5,
                },
                overallRemarks: "Exceptional academic performance. Very focused on long-term goals.",
            }
        ],
    },
    {
        studentId: "ST22BTECH13012",
        name: "Samantha Ray",
        department: "Electrical Engineering",
        section: "CSE-C",
        semester: 4,
        emailId: "samantha.r@mahindrauniversity.edu.in",
        phoneNumber: "9876543222",
        mentorId: "PROF-001",
        assignmentDate: "2024-08-15",
        academicMetrics: {
            cgpa: 7.1,
            attendance: 78,
            backlogs: 1,
            semesterGrades: [
                { sem: 1, gpa: 7.5 },
                { sem: 2, gpa: 7.2 },
                { sem: 3, gpa: 6.8 },
            ],
            semesterAttendance: [
                { sem: 1, attendance: 85 },
                { sem: 2, attendance: 80 },
                { sem: 3, attendance: 75 },
            ],
            backlogHistory: [
                { name: "Network Theory", code: "EE201", semester: 3 }
            ],
        },
        lastMeetingDate: "2026-04-05",
        meetingHistory: [
            {
                meetingId: "MTG-ST13012-101",
                date: "2026-04-05",
                status: "Completed",
                hasAttended: true,
                discussionSummary: "Discussed the recent backlog in Network Theory.",
                actionPlan: {
                    studentTasks: ["Apply for re-evaluation/supplementary exam", "Join study group"],
                    skillImprovement: ["Circuit Analysis"],
                },
                performanceRatings: {
                    academic: 3,
                    professional: 3,
                    personal: 4,
                },
                overallRemarks: "Needs to focus more on core technical subjects.",
            }
        ],
    },
];

// Document Request
export const MOCK_DOC_REQUESTS = {
	admins: [
		{
			name: "Registrar Office",
			email: "registrar.office@mahindrauniversity.edu.in",
			phone: "+91 99999 88888",
			role: "Main Registrar Liaison",
		},
		{
			name: "Dean of Research Office",
			email: "research.dean@mahindrauniversity.edu.in",
			phone: "+91 99999 77777",
		},
	],
	studentRequests: [
		{
			id: "REQ-2026-001",
			student: {
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				email: "john.doe@mahindrauniversity.edu.in",
			},
			application: {
				purpose:
					"Graduate admission application for a Master's in Data Science with a focus on Neural Networks and Machine Learning architectures.",
				lorDocument: {
					name: "Draft_LOR_DataScience.pdf",
					url: "/docs/john_lor_draft.pdf",
				},
				supportingDocs: [
					{
						name: "Academic_Transcript.pdf",
						url: "/docs/john_transcript.pdf",
					},
					{
						name: "Resume_John_Doe.pdf",
						url: "/docs/john_resume.pdf",
					},
				],
			},
			status: "Pending",
			requestDate: "2026-03-20",
		},
		{
			id: "REQ-2026-002",
			student: {
				name: "Sarah Jenkins",
				rollNumber: "ST21BTECH11002",
				email: "s.jenkins@mahindrauniversity.edu.in",
			},
			application: {
				purpose:
					"Competitive Summer Research Internship at the Large Hadron Collider to study particle acceleration and high-energy physics instrumentation.",
				lorDocument: {
					name: "Draft_LOR_CERN.docx",
					url: "/docs/sarah_lor_draft.docx",
				},
				supportingDocs: [
					{
						name: "Project_Portfolio.pdf",
						url: "/docs/sarah_projects.pdf",
					},
					{
						name: "Physics_Grades_Summary.pdf",
						url: "/docs/sarah_grades.pdf",
					},
				],
			},
			status: "Pending",
			requestDate: "2026-03-24",
		},
		{
			id: "REQ-2026-003",
			student: {
				name: "Alice Johnson",
				rollNumber: "ST21BTECH11003",
				email: "a.johnson@mahindrauniversity.edu.in",
			},
			application: {
				purpose:
					"General Graduate School Application and Departmental Archives.",
				lorDocument: {
					name: "LOR_AliceJohnson_Draft.docx",
					url: "/docs/alicejohnson_lor.pdf",
				},
				supportingDocs: [
					{
						name: "Undergraduate_Transcript_Final.pdf",
						url: "/docs/alice_johnson_transcript.pdf",
					},
					{
						name: "Statement_of_Purpose.pdf",
						url: "/docs/alice_johnson_sop.pdf",
					},
				],
			},
			status: "Under Review",
			requestDate: "2026-03-18",
		},
		{
			id: "REQ-2026-004",
			student: {
				name: "Elena Rodriguez",
				rollNumber: "ST21BTECH11004",
				email: "e.rodriguez@mahindrauniversity.edu.in",
			},
			application: {
				purpose:
					"Urgent Summer Internship Placement - Research Portfolio review.",
				lorDocument: {
					name: "LOR_ElenaRodriguez_Final.pdf",
					url: "/docs/elenarodriguez_projects.pdf",
				},
				supportingDocs: [
					{
						name: "Research_Portfolio_2026.pdf",
						url: "/docs/elena_rodriguez_portfolio.pdf",
					},
				],
			},
			status: "Under Review",
			requestDate: "2026-03-22",
		},
	],
	processingQueue: [
		{
			lorId: "LOR-PROC-9921",
			studentName: "Alice Johnson",
			rollNumber: "ST21BTECH11003",
			originalRequestId: "REQ-2026-003",
			signedDocument: {
				name: "LOR_AliceJohnson_Draft.docx",
				url: "/docs/alicejohnson_lor.pdf",
			},
			supportingDocs: [
				{
					name: "Undergraduate_Transcript_Final.pdf",
					url: "/docs/alice_johnson_transcript.pdf",
				},
			],
			approvedDocument: null,
			noteToRegistrar:
				"Please apply the departmental seal and scan as a high-resolution PDF.",
			sentDate: "2026-03-22",
			approvedDate: null,
			status: "Pending",
		},
		{
			lorId: "LOR-PROC-9945",
			studentName: "Elena Rodriguez",
			rollNumber: "ST21BTECH11004",
			originalRequestId: "REQ-2026-004",
			signedDocument: {
				name: "LOR_ElenaRodriguez_Final.pdf",
				url: "/docs/elenarodriguez_projects.pdf",
			},
			supportingDocs: null,
			approvedDocument: {
				name: "LOR_ElenaRodriguez_Signed_Stamped.pdf",
				url: "/docs/final/elena_signed.pdf",
			},
			noteToRegistrar: "Urgent: Student needs this by tomorrow evening.",
			sentDate: "2026-03-25",
			approvedDate: "2026-03-26",
			status: "Approved",
		},
	],
};

// Asset Requests
export const MOCK_ASSET_DATA = {
	admins: [
		{
			name: "Admin Office",
			email: "admin@university.edu",
			phone: "+91 99999 88888",
		},
		{
			name: "Lab Coordinator",
			email: "lab-support@university.edu",
			phone: "+91 99999 77777",
		},
	],
	catalog: [
		{
			id: "101",
			name: "Seminar Hall A",
			type: "Seminar Hall",
			status: "Available",
			availability: "Open for booking",
		},
		{
			id: "102",
			name: "Meeting Room 1",
			type: "Class Room",
			status: "In Use",
			availability: "Reserved until 4:00 PM",
		},
		{
			id: "103",
			name: "Meeting Room 2",
			type: "Class Room",
			status: "Available",
			availability: "Open for booking",
		},
		{
			id: "L1",
			name: "Computer Lab 1",
			type: "Lab",
			status: "Available",
			availability: "Open for booking",
		},
		{
			id: "L2",
			name: "Physics Lab",
			type: "Lab",
			status: "In Use",
			availability: "Class in progress",
		},
		{
			id: "P1",
			name: "Projector (Sony)",
			type: "Equipment",
			status: "Available",
			availability: "Ready for pickup",
		},
		{
			id: "K1",
			name: "Laptop Kit (10x)",
			type: "Equipment",
			status: "Available",
			availability: "Ready for pickup",
		},
		{
			id: "H101",
			name: "AC Room",
			type: "Accommodation",
			status: "Available",
			availability: "Available for booking",
		},
		{
			id: "H102",
			name: "Non-AC Room",
			type: "Accommodation",
			status: "Available",
			availability: "Available for booking",
		},
	],
	requests: [
		{
			id: "REQ001",
			assetName: "Seminar Hall A",
			course: "Introduction to Computer Science",
			status: "Approved",
			isArchived: true,
			type: "Room",
			reason: "Guest lecture on Quantum Computing by industry expert.",
			postedAt: "2025-12-10T09:00:00Z",
			date: "2025-12-15",
			startTime: "10:00",
			endTime: "12:00",
			approvalTime: "2025-12-11T14:30:00Z",
			adminComments:
				"Please ensure the AV system is powered down after use.",
		},
		{
			id: "REQ002",
			assetName: "Projector (Sony)",
			course: "Data Structures & Algorithms",
			status: "Pending",
			isArchived: false,
			type: "Equipment",
			reason: "Group project presentation for final semester evaluation.",
			postedAt: "2025-12-14T15:45:00Z",
			date: "2025-12-16",
			startTime: "16:00",
			endTime: "18:00",
			approvalTime: null,
			adminComments: null,
		},
		{
			id: "REQ003",
			assetName: "Computer Lab 1",
			course: "Database Systems",
			status: "Resubmitted",
			isArchived: true,
			type: "Lab",
			reason: "Rescheduling practice session to December 17th as requested.",
			postedAt: "2025-12-15T11:20:00Z",
			date: "2025-12-17",
			startTime: "08:00",
			endTime: "10:00",
			approvalTime: null,
			adminComments: null,
			previousVersion: {
				assetName: "Computer Lab 1",
				type: "Lab",
				reason: "Extra practice session for lab finals.",
				postedAt: "2025-12-12T11:20:00Z",
				date: "2025-12-15",
				startTime: "08:00",
				endTime: "10:00",
				adminComments:
					"The lab is undergoing scheduled maintenance during this time slot. Please choose an alternative date or lab.",
			},
		},
		{
			id: "REQ004",
			assetName: "Physics Lab",
			course: "Applied Physics II",
			status: "Rejected",
			isArchived: false,
			type: "Lab",
			reason: "Weekly lab experiment session.",
			postedAt: "2026-03-01T10:00:00Z",
			date: "2026-03-05",
			startTime: "09:00",
			endTime: "11:00",
			approvalTime: null,
			adminComments:
				"Lab is closed for maintenance on March 2nd. Please select a different day.",
		},
		{
			id: "REQ005",
			assetName: "AC Room",
			course: "N/A",
			status: "Pending",
			isArchived: false,
			type: "Accommodation",
			reason: "Late night study accommodation during exams.",
			postedAt: "2026-03-12T10:00:00Z",
			date: "2026-03-20",
			duration: 10,
			approvalTime: null,
			adminComments: null,
		},
	],
};

// Attendance Management
export const MOCK_ATTENDANCE_DATA = {
	1: {
		students: [
			/**
			 * Computer Science Department
			 */
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				department: "Computer Science",
				section: "CSE-A",
				isYou: true,
			},
			{
				id: 2,
				name: "Alice Johnson",
				rollNumber: "ST21BTECH11002",
				department: "Computer Science",
				section: "CSE-A",
				isYou: false,
			},
			{
				id: 3,
				name: "Charlie Lee",
				rollNumber: "ST21BTECH11003",
				department: "Computer Science",
				section: "CSE-B",
				isYou: false,
			},
			{
				id: 4,
				name: "David Kim",
				rollNumber: "ST21BTECH11004",
				department: "Computer Science",
				section: "CSE-A",
				isYou: false,
			},
			{
				id: 5,
				name: "Eva Green",
				rollNumber: "ST21BTECH11005",
				department: "Computer Science",
				section: "CSE-B",
				isYou: false,
			},
			{
				id: 6,
				name: "Frank Hall",
				rollNumber: "ST21BTECH11006",
				department: "Computer Science",
				section: "CSE-B",
				isYou: false,
			},
			{
				id: 7,
				name: "Grace Miller",
				rollNumber: "ST21BTECH11007",
				department: "Computer Science",
				section: "CSE-A",
				isYou: false,
			},
			{
				id: 8,
				name: "Hannah Scott",
				rollNumber: "ST21BTECH11008",
				department: "Computer Science",
				section: "CSE-B",
				isYou: false,
			},
			{
				id: 9,
				name: "Ian Turner",
				rollNumber: "ST21BTECH11009",
				department: "Computer Science",
				section: "CSE-A",
				isYou: false,
			},
			{
				id: 10,
				name: "Julia Wang",
				rollNumber: "ST21BTECH11010",
				department: "Computer Science",
				section: "CSE-B",
				isYou: false,
			},
			{
				id: 11,
				name: "Kevin Spacey",
				rollNumber: "ST21BTECH11011",
				department: "Computer Science",
				section: "CSE-A",
				isYou: false,
			},
			{
				id: 12,
				name: "Laura Palmer",
				rollNumber: "ST21BTECH11012",
				department: "Computer Science",
				section: "CSE-B",
				isYou: false,
			},

			/**
			 * Electrical Engineering Department
			 */
			{
				id: 13,
				name: "Michael Scott",
				rollNumber: "ST21BTECH12001",
				department: "Electrical Engineering",
				section: "EE-A",
				isYou: false,
			},
			{
				id: 14,
				name: "Pam Beesly",
				rollNumber: "ST21BTECH12002",
				department: "Electrical Engineering",
				section: "EE-A",
				isYou: false,
			},
			{
				id: 15,
				name: "Jim Halpert",
				rollNumber: "ST21BTECH12003",
				department: "Electrical Engineering",
				section: "EE-B",
				isYou: false,
			},
			{
				id: 16,
				name: "Dwight Schrute",
				rollNumber: "ST21BTECH12004",
				department: "Electrical Engineering",
				section: "EE-B",
				isYou: false,
			},

			/**
			 * Mechanical Engineering Department
			 */
			{
				id: 17,
				name: "Tony Stark",
				rollNumber: "ST21BTECH13001",
				department: "Mechanical Engineering",
				section: "ME-A",
				isYou: false,
			},
			{
				id: 18,
				name: "Steve Rogers",
				rollNumber: "ST21BTECH13002",
				department: "Mechanical Engineering",
				section: "ME-A",
				isYou: false,
			},
			{
				id: 19,
				name: "Bruce Banner",
				rollNumber: "ST21BTECH13003",
				department: "Mechanical Engineering",
				section: "ME-B",
				isYou: false,
			},
			{
				id: 20,
				name: "Natasha Romanoff",
				rollNumber: "ST21BTECH13004",
				department: "Mechanical Engineering",
				section: "ME-B",
				isYou: false,
			},
		],
		sectionMetadata: [
			{
				section_name: "CSE-A",
				course_code: "CS101",
				department: "Computer Science",
			},
			{
				section_name: "CSE-B",
				course_code: "CS101",
				department: "Computer Science",
			},
			{
				section_name: "EE-A",
				course_code: "EE101",
				department: "Electrical Engineering",
			},
			{
				section_name: "EE-B",
				course_code: "EE101",
				department: "Electrical Engineering",
			},
			{
				section_name: "ME-A",
				course_code: "ME101",
				department: "Mechanical Engineering",
			},
			{
				section_name: "ME-B",
				course_code: "ME101",
				department: "Mechanical Engineering",
			},
		],
		logs: {
			"CSE-A": {
				"2026-03-25": [1, 2, 4, 7, 9, 11],
				"2026-03-30": [1, 2, 4, 7, 9, 11],
				"2026-04-01": [1, 2, 4, 11],
				"2026-04-06": [1, 2, 7, 9],
				"2026-04-08": [2, 4, 7, 9, 11],
			},
			"CSE-B": {
				"2026-03-19": [3, 5, 6],
				"2026-03-26": [3, 5, 12],
				"2026-04-02": [6, 8, 10],
				"2026-04-09": [3, 5, 6, 8, 10, 12],
			},
			"EE-A": {
				"2026-04-01": [13, 14],
				"2026-04-08": [13],
			},
			"EE-B": {
				"2026-04-01": [15, 16],
				"2026-04-08": [15, 16],
			},
			"ME-A": {
				"2026-04-01": [17, 18],
				"2026-04-08": [17, 18],
			},
			"ME-B": {
				"2026-04-01": [19],
				"2026-04-08": [19, 20],
			},
		},
		finalizedDates: ["2026-02-12"],
	},
	2: {
		// Data Structures & Algorithms
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				department: "Computer Science",
				section: "CSE-A",
				isYou: true,
			},
			{
				id: 6,
				name: "Frank Hall",
				rollNumber: "ST21BTECH11006",
				department: "Electrical Engineering",
				section: "CSE-C",
				isYou: false,
			},
			{
				id: 7,
				name: "Grace Miller",
				rollNumber: "ST21BTECH11007",
				department: "Mechanical Engineering",
				section: "CSE-A",
				isYou: false,
			},
			{
				id: 8,
				name: "Hannah Scott",
				rollNumber: "ST21BTECH11008",
				department: "Mechanical Engineering",
				section: "CSE-C",
				isYou: false,
			},
		],
		logs: {
			"CSE-A": {
				"2026-02-10": [1],
				"2026-02-12": [1, 7],
			},
			"CSE-C": {
				"2026-02-10": [6],
				"2026-02-12": [6, 8],
			},
		},
		finalizedDates: [],
	},
	3: {
		// Calculus I
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				department: "Computer Science",
				section: "CSE-A",
				isYou: true,
			},
			{
				id: 10,
				name: "Julia Wang",
				rollNumber: "ST21BTECH11010",
				department: "Computer Science",
				section: "CSE-B",
				isYou: false,
			},
			{
				id: 12,
				name: "Lisa Chen",
				rollNumber: "ST21BTECH11012",
				department: "Electrical Engineering",
				section: "ECE-B",
				isYou: false,
			},
			{
				id: 13,
				name: "Mike Davis",
				rollNumber: "ST21BTECH11013",
				department: "Electrical Engineering",
				section: "ECE-B",
				isYou: false,
			},
			{
				id: 14,
				name: "Nina Patel",
				rollNumber: "ST21BTECH11014",
				department: "Mechanical Engineering",
				section: "CSE-A",
				isYou: false,
			},
		],
		logs: {
			"CSE-A": { "2026-02-11": [1, 14] },
			"CSE-B": { "2026-02-11": [10] },
			"ECE-B": { "2026-02-11": [12, 13] },
		},
		finalizedDates: [],
	},
	4: {
		// Database Systems
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				department: "Computer Science",
				section: "CSE-B",
				isYou: true,
			},
			{
				id: 16,
				name: "Priya Sharma",
				rollNumber: "ST21BTECH11016",
				department: "Information Technology",
				section: "IT-A",
				isYou: false,
			},
			{
				id: 17,
				name: "Quinn Lee",
				rollNumber: "ST21BTECH11017",
				department: "Computer Science",
				section: "CSE-B",
				isYou: false,
			},
			{
				id: 18,
				name: "Rachel Kim",
				rollNumber: "ST21BTECH11018",
				department: "Information Technology",
				section: "IT-A",
				isYou: false,
			},
		],
		logs: {
			"CSE-B": { "2026-02-12": [1, 17] },
			"IT-A": { "2026-02-12": [18] },
		},
		finalizedDates: [],
	},
};
export const MOCK_PROFESSOR_LOGS = [
	{
		id: "LOG_001",
		date: "2026-03-28",
		checkIn: "08:45 AM",
		checkOut: "04:30 PM",
		location: "Block A - Entrance",
		totalHours: "7h 45m",
	},
	{
		id: "LOG_002",
		date: "2026-03-30",
		checkIn: "09:00 AM",
		checkOut: "05:15 PM",
		location: "Block A - Entrance",
		totalHours: "8h 15m",
	},
	{
		id: "LOG_003",
		date: "2026-03-31",
		checkIn: "08:30 AM",
		checkOut: "04:00 PM",
		location: "Block B - Main",
		totalHours: "7h 30m",
	},
	{
		id: "LOG_004",
		date: "2026-04-01",
		checkIn: "09:15 AM",
		checkOut: "06:00 PM",
		location: "Admin Block",
		totalHours: "8h 45m",
	},
	{
		id: "LOG_005",
		date: "2026-04-02",
		checkIn: "08:50 AM",
		checkOut: "04:50 PM",
		location: "Block A - Entrance",
		totalHours: "8h 00m",
	},
	{
		id: "LOG_006",
		date: "2026-04-03",
		checkIn: "08:55 AM",
		checkOut: "05:00 PM",
		location: "Block A - Entrance",
		totalHours: "8h 05m",
	},
	{
		id: "LOG_007",
		date: "2026-04-04",
		checkIn: "09:10 AM",
		checkOut: "04:30 PM",
		location: "Science Lab",
		totalHours: "7h 20m",
	},
	{
		id: "LOG_008",
		date: "2026-04-06",
		checkIn: "08:30 AM",
		checkOut: "05:30 PM",
		location: "Block B - Main",
		totalHours: "9h 00m",
	},
	{
		id: "LOG_009",
		date: "2026-04-07",
		checkIn: "08:45 AM",
		checkOut: "04:15 PM",
		location: "Block A - Entrance",
		totalHours: "7h 30m",
	},
	{
		id: "LOG_010",
		date: "2026-04-08",
		checkIn: "09:00 AM",
		checkOut: "05:00 PM",
		location: "Admin Block",
		totalHours: "8h 00m",
	},
];

// Finance Management
export const MOCK_FINANCE_DATA = {
	admins: [
		{
			name: "Finance Office",
			email: "finance-claims@university.edu",
			phone: "+91 99999 88888",
		},
		{
			name: "Accounts Payable",
			email: "accounts@university.edu",
			phone: "+91 99999 66666",
		},
		{
			name: "Treasury Department",
			email: "treasury@university.edu",
			phone: "+91 99999 44444",
		},
	],
	expenses: [
		{
			id: "EXP001",
			title: "Office Stationery",
			amount_spent: 200.0,
			status: "Reimbursed",
			isArchived: true,
			date: "2026-01-20",
			category: "Supplies",
			description:
				"Purchase of highlighters, notebooks, and printer ink for the faculty office.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: "2026-01-22T10:30:00Z",
			adminComments:
				"Receipts verified. Reimbursed via standard payroll cycle.",
		},
		{
			id: "EXP002",
			title: "Lab Equipment Repair",
			amount_spent: 800.0,
			status: "Pending",
			isArchived: false,
			date: "2026-02-05",
			category: "Maintenance",
			description:
				"Emergency repair for the centrifuge in Lab 4 following a motor failure.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: null,
			adminComments: "",
		},
		{
			id: "EXP003",
			title: "Conference Registration",
			amount_spent: 350.0,
			status: "Rejected",
			isArchived: false,
			date: "2026-02-10",
			category: "Professional Development",
			description: "Registration fee for the AI Research Conference.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: null,
			adminComments:
				"Invalid receipt format. Please upload the official PDF confirmation.",
		},
	],
	advances: [
		{
			id: "ADV001",
			title: "Research Trip to Delhi",
			amount_requested: 5000.0,
			status: "Approved",
			isArchived: true,
			date: "2026-01-15",
			category: "Travel",
			description:
				"Advance for flight tickets and local conveyance for the upcoming National Science Symposium.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: "2026-01-16T11:20:00Z",
			adminComments:
				"Approved based on department travel budget. Please submit actual bills within 7 days of return.",
		},
		{
			id: "ADV002",
			title: "Consumables for Chemistry Lab",
			amount_requested: 1200.0,
			status: "Pending",
			isArchived: false,
			date: "2026-02-18",
			category: "Lab Supplies",
			description:
				"Urgent purchase of reagents and glass tubes required for ongoing semester projects.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: null,
			adminComments: "",
		},
		{
			id: "ADV003",
			title: "Guest Lecturer Honorarium",
			amount_requested: 2500.0,
			status: "Rejected",
			isArchived: false,
			date: "2026-02-10",
			category: "Events",
			description:
				"Advance payment for guest speaker Dr. Khanna for the departmental seminar.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: null,
			adminComments:
				"Advance honorarium payments are not permitted under the current policy. Please process as an expense reimbursement after the event.",
		},
		{
			id: "ADV004",
			title: "Workshop Supplies",
			amount_requested: 1500.0,
			status: "Resubmitted",
			isArchived: false,
			date: "2026-02-25",
			category: "Events",
			description:
				"Purchase of workshop kits and printed materials for the coding bootcamp.",
			proof_doc_link: "https://drive.google.com/file/...",
			proof_doc_file: null,
			approvalTime: null,
			adminComments: "",
			previousVersion: {
				title: "Workshop Catering",
				amount_requested: 3000.0,
				date: "2026-02-20",
				description:
					"Advance for snacks and lunch for workshop attendees.",
				proof_doc_link: "https://drive.google.com/file/...",
				proof_doc_file: null,
				adminComments:
					"Advance for catering exceeds the per-head limit. Please revise the budget or request reimbursement after the event.",
			},
		},
	],
};

// Exam Duties
export const MOCK_EXAM_DATA = [
	{
		id: "EX001",
		courseName: "Introduction to Computer Science",
		courseCode: "CS 101",
		type: "Final Exam",
		startTime: "2026-03-25T04:00:00Z",
		endTime: "2026-03-25T07:00:00Z",
		hall: "Main Auditorium",
		reportingTime: "2026-03-25T03:30:00Z",
		status: "ASSIGNED",
		isCheckedIn: false,
		rejectionReason: null,
		rejectionApproval: null,
	},
	{
		id: "EX002",
		courseName: "Data Structures & Algorithms",
		courseCode: "CS 202",
		type: "Midterm",
		startTime: "2026-03-23T07:00:00Z",
		endTime: "2026-03-23T10:00:00Z",
		hall: "Exam Hall B",
		reportingTime: "2026-03-23T06:30:00Z",
		status: "ASSIGNED",
		isCheckedIn: false,
		rejectionReason: null,
		rejectionApproval: null,
	},
	{
		id: "EX003",
		courseName: "Operating Systems",
		courseCode: "CS 301",
		type: "Practical",
		startTime: "2026-03-26T09:00:00Z",
		endTime: "2026-03-26T12:00:00Z",
		hall: "Lab 4",
		reportingTime: "2026-03-26T08:30:00Z",
		status: "ASSIGNED",
		isCheckedIn: false,
		rejectionReason: null,
		rejectionApproval: null,
	},
	{
		id: "EX004",
		courseName: "Database Management Systems",
		courseCode: "CS 205",
		type: "Midterm",
		startTime: "2026-03-23T13:00:00Z",
		endTime: "2026-03-23T16:00:00Z",
		hall: "Seminar Room A",
		reportingTime: "2026-03-23T12:30:00Z",
		status: "ASSIGNED",
		isCheckedIn: false,
		rejectionReason: null,
		rejectionApproval: null,
	},
	{
		id: "EX005",
		courseName: "Artificial Intelligence",
		courseCode: "CS 404",
		type: "Final Exam",
		startTime: "2026-03-28T05:00:00Z",
		endTime: "2026-03-28T08:00:00Z",
		hall: "Main Auditorium",
		reportingTime: "2026-03-28T04:30:00Z",
		status: "ASSIGNED",
		isCheckedIn: false,
		rejectionReason: null,
		rejectionApproval: null,
	},
	{
		id: "EX006",
		courseName: "Quantum Physics",
		courseCode: "PH 401",
		type: "Final Exam",
		startTime: "2026-03-30T09:00:00Z",
		endTime: "2026-03-30T12:00:00Z",
		hall: "Physics Lab 1",
		reportingTime: "2026-03-30T08:30:00Z",
		status: "REJECTION_REVIEW",
		isCheckedIn: false,
		rejectionReason: "Medical emergency - doctor appointment",
		rejectionApproval: null,
	},
	{
		id: "EX007",
		courseName: "Ethics in Technology",
		courseCode: "CS 505",
		type: "Midterm",
		startTime: "2026-03-31T14:00:00Z",
		endTime: "2026-03-31T16:00:00Z",
		hall: "Seminar Room B",
		reportingTime: "2026-03-31T13:30:00Z",
		status: "REJECTION_REVOKED",
		isCheckedIn: false,
		rejectionReason: "Conflicting lecture schedule",
		rejectionApproval: {
			exam_department: {
				status: "REVOKED",
				remark: "Schedule conflict resolved.",
			},
			admin: {
				status: "REVOKED",
				remark: "Confirmed: Attend as per original allocation.",
			},
		},
	},
	{
		id: "EX008",
		courseName: "Advanced Algorithms",
		courseCode: "CS 601",
		type: "Final Exam",
		startTime: "2026-04-02T09:00:00Z",
		endTime: "2026-04-02T12:00:00Z",
		hall: "Hall C",
		reportingTime: "2026-04-02T08:30:00Z",
		status: "REJECTION_APPROVED",
		isCheckedIn: false,
		rejectionReason: "Family emergency",
		rejectionApproval: {
			exam_department: {
				status: "APPROVED",
				remark: "Documents verified.",
			},
			admin: { status: "APPROVED", remark: "Duty exemption granted." },
		},
	},
];

// Leave Application
export const MOCK_PROFESSOR_LEAVE_DATA = {
	// Management contacts split into HoD and HR
	managementContacts: [
		{
			name: "Dr. Jane Doe (HoD)",
			email: "jane.smith@university.edu",
			phone: "+91 99999 88888",
		},
		{
			name: "Mr. John Smith (HR)",
			email: "hr@university.edu",
			phone: "+91 99999 77777",
		},
	],
	faculties: [
		{ id: "F001", name: "Dr. Sarah Williams" },
		{ id: "F002", name: "Dr. Robert Chen" },
		{ id: "F003", name: "Dr. Michael Brown" },
		{ id: "F004", name: "Prof. Alan Turing" },
		{ id: "F005", name: "Dr. Grace Hopper" },
	],
	applications: [
		{
			id: "LV001",
			leaveType: "Sick Leave",
			fromDate: "2026-02-19T12:00:00Z",
			toDate: "2026-02-21T12:00:00Z",
			substitutionDetails: {
				courseName: "Introduction to Programming",
				roomNumber: "LH-101",
				timings: {
					startTime: "09:00",
					endTime: "10:30",
				},
				note: "Please ask the students to continue with the 5th program.",
			},
			replacementFaculty: "Dr. Sarah Williams",
			substitutionStatus: "Accepted",
			reason: "Severe viral fever and flu symptoms",
			status: "Approved",
			isArchived: true,
			appliedAt: "2026-02-15T10:00:00Z",
			// Individual status tracking for HoD and HR
			leaveApproval: {
				HoD: { status: "Approved", remark: "Get well soon!" },
				HR: { status: "Approved", remark: "Documents verified." },
			},
			supporting_doc_link: "https://university.edu/docs/LV001_cert.pdf",
			supporting_doc_file: null,
		},
		{
			id: "LV002",
			leaveType: "Academic Leave",
			fromDate: "2026-03-15T12:00:00Z",
			toDate: "2026-03-17T12:00:00Z",
			substitutionDetails: {
				courseName: "Machine Learning (B.Tech)",
				roomNumber: "LAB-202",
				timings: {
					startTime: "11:00",
					endTime: "12:30",
				},
				note: "Please ask the students to continue with the 5th program.",
			},
			reason: "Presenting paper at International Conference on AI",
			replacementFaculty: "Dr. Robert Chen",
			substitutionStatus: "Pending",
			status: "Pending",
			isArchived: false,
			appliedAt: "2026-02-18T14:30:00Z",
			leaveApproval: {
				HoD: { status: "Pending", remark: null },
				HR: { status: "Pending", remark: null },
			},
			supporting_doc_link: "https://university.edu/docs/LV002_invite.pdf",
			supporting_doc_file: null,
		},
		{
			id: "LV003",
			leaveType: "Casual Leave",
			fromDate: "2026-04-10T12:00:00Z",
			toDate: "2026-04-11T12:00:00Z",
			substitutionDetails: {
				courseName: "Introduction to Computer Science",
				roomNumber: "LAB-105",
				timings: {
					startTime: "14:00",
					endTime: "16:00",
				},
				note: "Please ask the students to continue with the 5th program.",
			},
			reason: "Personal family function",
			replacementFaculty: "Dr. Michael Brown",
			substitutionStatus: "Pending",
			status: "Rejected",
			isArchived: false,
			appliedAt: "2026-02-10T09:00:00Z",
			leaveApproval: {
				HoD: {
					status: "Rejected",
					remark: "Casual leave cannot be approved during examination period.",
				},
				HR: {
					status: "Rejected",
					remark: "Please consider changing the date of leave.",
				},
			},
			supporting_doc_link: null,
			supporting_doc_file: null,
		},
		{
			id: "LV004",
			leaveType: "Academic Leave",
			fromDate: "2026-03-20T09:00:00Z",
			toDate: "2026-03-20T09:00:00Z",
			substitutionDetails: {
				courseName: "Software Engineering",
				roomNumber: "LH-304",
				timings: {
					startTime: "10:00",
					endTime: "11:30",
				},
				note: "Please ask the students to continue with the 5th program.",
			},
			reason: "Attending the Board of Studies meeting.",
			replacementFaculty: "Dr. Grace Hopper",
			substitutionStatus: "Pending",
			status: "Resubmitted",
			isArchived: false,
			appliedAt: "2026-03-02T11:00:00Z",
			leaveApproval: {
				HoD: { status: "Pending", remark: null },
				HR: { status: "Pending", remark: null },
			},
			supporting_doc_link: "https://university.edu/docs/LV004_agenda.pdf",
			supporting_doc_file: null,
			previousVersion: {
				leaveType: "Academic Leave",
				fromDate: "2026-03-18T09:00:00Z",
				toDate: "2026-03-18T09:00:00Z",
				reason: "Attending the Board of Studies meeting.",
				appliedAt: "2026-02-28T10:00:00Z",
				replacementFaculty: "Dr. Grace Hopper",
				leaveApproval: {
					HoD: {
						status: "Rejected",
						remark: "The department has a guest lecture scheduled for the 18th.",
					},
					HR: { status: "Pending", remark: null },
				},
			},
		},
	],
	substitutionRequests: [
		{
			id: "SUB001",
			requesterName: "Dr. Robert Chen",
			leaveType: "Casual Leave",
			fromDate: "2026-04-15T08:00:00Z",
			toDate: "2026-04-15T08:00:00Z",
			course: "Data Structures & Algorithms (CS201)",
			roomNumber: "Lab-201",
			timings: {
				startTime: "13:00",
				endTime: "14:30",
			},
			note: "Please ask the students to continue with the 5th program.",
			status: "Pending",
			requestedAt: "2026-03-04T09:30:00Z",
		},
		{
			id: "SUB002",
			requesterName: "Prof. Alan Turing",
			leaveType: "Academic Leave",
			fromDate: "2026-04-12T10:00:00Z",
			toDate: "2026-04-14T17:00:00Z",
			course: "Advanced Theory of Computation (CS402)",
			roomNumber: "LH-402",
			timings: {
				startTime: "10:00",
				endTime: "12:00",
			},
			note: "Please help them with the revision of 3rd module.",
			status: "Accepted",
			requestedAt: "2026-03-01T14:00:00Z",
		},
	],
};
export const MOCK_HOD_LEAVE_DATA = {
	// Management contacts for the HoD to reach out to
	managementContacts: [
		{
			name: "Dr. Alistair Cook (Dean of Academics)",
			email: "dean.academics@university.edu",
			phone: "+91 88888 11111",
		},
		{
			name: "Mr. John Smith (HR Manager)",
			email: "hr@university.edu",
			phone: "+91 99999 77777",
		},
	],
	faculties: [
		{ id: "F001", name: "Dr. Sarah Williams" },
		{ id: "F002", name: "Dr. Robert Chen" },
		{ id: "F003", name: "Dr. Michael Brown" },
		{ id: "F004", name: "Prof. Alan Turing" },
		{ id: "F005", name: "Dr. Grace Hopper" },
	],
	// Personal leave applications filed by the HoD
	applications: [
		{
			id: "HOD_LV001",
			leaveType: "Academic Leave",
			fromDate: "2026-04-10T09:00:00Z",
			toDate: "2026-04-12T17:00:00Z",
			reason: "Charing the National Curriculum Committee Meeting",
			status: "Approved",
			isArchived: true,
			appliedAt: "2026-04-01T10:00:00Z",
			courseName: "Introduction to Programming",
			roomNumber: "LH-101",
			timings: {
				startTime: "09:00",
				endTime: "10:30",
			},
			note: "Please ask the students to continue with the 5th program.",
			replacementFaculty: "Dr. Sarah Williams",
			leaveApproval: {
				Dean: {
					status: "Approved",
					remark: "Important for university representation.",
				},
				HR: { status: "Approved", remark: "Leave balance updated." },
			},
			supporting_doc_link:
				"https://university.edu/docs/committee_invite.pdf",
			supporting_doc_file: null,
		},
		{
			id: "HOD_LV002",
			leaveType: "Casual Leave",
			fromDate: "2026-04-10T12:00:00Z",
			toDate: "2026-04-11T12:00:00Z",
			reason: "Personal family function",
			replacementFaculty: "Dr. Michael Brown",
			// REJECTED BUT NOT ARCHIVED
			status: "Rejected",
			isArchived: false,
			appliedAt: "2026-02-10T09:00:00Z",
			leaveApproval: {
				Dean: {
					status: "Rejected",
					remark: "Casual leave cannot be approved during examination period.",
				},
				HR: {
					status: "Rejected",
					remark: "Please consider changing the date of leave.",
				},
			},
			supporting_doc_link: null,
			supporting_doc_file: null,
		},
		{
			id: "HOD_LV003",
			leaveType: "Academic Leave",
			fromDate: "2026-03-15T12:00:00Z",
			toDate: "2026-03-17T12:00:00Z",
			reason: "Presenting paper at International Conference on AI",
			replacementFaculty: "Dr. Robert Chen",
			// PENDING
			status: "Pending",
			isArchived: false,
			appliedAt: "2026-02-18T14:30:00Z",
			leaveApproval: {
				Dean: { status: "Pending", remark: null },
				HR: { status: "Pending", remark: null },
			},
			supporting_doc_link: "https://university.edu/docs/LV002_invite.pdf",
			supporting_doc_file: null,
		},
		{
			id: "HOD_LV004",
			leaveType: "Academic Leave",
			fromDate: "2026-03-20T09:00:00Z",
			toDate: "2026-03-20T09:00:00Z",
			reason: "Attending the Board of Studies meeting.",
			replacementFaculty: "Dr. Grace Hopper",
			// RESUBMITTED
			status: "Resubmitted",
			isArchived: false,
			appliedAt: "2026-03-02T11:00:00Z",
			leaveApproval: {
				Dean: { status: "Pending", remark: null },
				HR: { status: "Pending", remark: null },
			},
			supporting_doc_link: "https://university.edu/docs/LV004_agenda.pdf",
			supporting_doc_file: null,
			previousVersion: {
				leaveType: "Academic Leave",
				fromDate: "2026-03-18T09:00:00Z",
				toDate: "2026-03-18T09:00:00Z",
				reason: "Attending the Board of Studies meeting.",
				appliedAt: "2026-02-28T10:00:00Z",
				replacementFaculty: "Dr. Grace Hopper",
				leaveApproval: {
					Dean: {
						status: "Rejected",
						remark: "The department has a guest lecture scheduled for the 18th.",
					},
					HR: {
						status: "Please change the date of leave.",
						remark: null,
					},
				},
			},
		},
	],
	// Incoming leave requests from Professors for the HoD to manage
	incomingLeaveRequests: [
		{
			id: "LV-REQ-501",
			professorName: "Dr. Sarah Williams",
			leaveType: "Sick Leave",
			fromDate: "2026-04-05T09:00:00Z",
			toDate: "2026-04-06T09:00:00Z",
			reason: "Severe migraine",
			replacementFaculty: "Dr. Robert Chen",
			substitutionStatus: "Accepted",
			status: "Pending", // Awaiting HoD's action
			isArchived: false,
			appliedAt: "2026-03-28T08:30:00Z",
			supporting_doc_link: null,
		},
		{
			id: "LV-REQ-502",
			professorName: "Dr. Michael Brown",
			leaveType: "Academic Leave",
			fromDate: "2026-03-01T09:00:00Z",
			toDate: "2026-03-03T09:00:00Z",
			reason: "Workshop on Quantum Computing",
			replacementFaculty: "Prof. Alan Turing",
			substitutionStatus: "Accepted",
			status: "Rejected",
			isArchived: true, // Archived because the date has passed or the decision is final
			appliedAt: "2026-02-15T11:00:00Z",
			leaveApproval: {
				HoD: {
					status: "Rejected",
					remark: "Documentation provided was insufficient for academic leave.",
				},
			},
			supporting_doc_link:
				"https://university.edu/docs/invalid_workshop.pdf",
		},
		{
			id: "LV-REQ-503",
			professorName: "Dr. Michael Brown",
			leaveType: "Academic Leave",
			fromDate: "2026-05-15T09:00:00Z",
			toDate: "2026-05-17T17:00:00Z",
			reason: "Resubmitting with official invitation letter for Quantum Computing Workshop",
			replacementFaculty: "Prof. Alan Turing",
			substitutionStatus: "Accepted",
			status: "Resubmitted",
			isArchived: false,
			appliedAt: "2026-03-29T10:00:00Z",
			supporting_doc_link:
				"https://university.edu/docs/official_workshop_invite.pdf",
			leaveApproval: {
				HoD: { status: "Pending", remark: null },
			},
			previousVersion: {
				leaveType: "Academic Leave",
				fromDate: "2026-03-01T09:00:00Z",
				toDate: "2026-03-03T09:00:00Z",
				reason: "Workshop on Quantum Computing",
				appliedAt: "2026-02-15T11:00:00Z",
				replacementFaculty: "Prof. Alan Turing",
				leaveApproval: {
					HoD: {
						status: "Rejected",
						remark: "Documentation provided was insufficient for academic leave.",
					},
					HR: {
						status: "Rejected",
						remark: "Please provide additional documentation as required.",
					},
				},
			},
		},
	],
};

// Payroll
export const MOCK_PAYROLL = {
	history: [
		{
			id: "PAY-JAN-26",
			month: "January 2026",
			amount: 73000,
			status: "Paid",
			paidAt: "2026-02-01T04:00:00Z",
			breakdown: {
				attendance: {
					present: 22,
					absent: 0,
				},
				basic: 40000,
				hra: 20000,
				bonuses: 5000,
				allowances: 15000,
				deductions: {
					tax: 4500,
					pf: 1800,
					insurance: 700,
					absence: 0,
				},
				netPay: 73000,
			},
		},
		{
			id: "PAY-DEC-25",
			month: "December 2025",
			amount: 71200,
			status: "Paid",
			paidAt: "2026-01-01T04:00:00Z",
			breakdown: {
				attendance: {
					present: 20,
					absent: 2,
				},
				basic: 38200,
				hra: 20000,
				bonuses: 5000,
				allowances: 15000,
				deductions: {
					tax: 4500,
					pf: 1800,
					insurance: 700,
					absence: 1800,
				},
				netPay: 71200,
			},
		},
		{
			id: "PAY-NOV-25",
			month: "November 2025",
			amount: 75500,
			status: "Paid",
			paidAt: "2025-12-01T04:00:00Z",
			breakdown: {
				attendance: {
					present: 21,
					absent: 0,
				},
				basic: 42000,
				hra: 20000,
				bonuses: 7000,
				allowances: 14000,
				deductions: {
					tax: 4800,
					pf: 2000,
					insurance: 700,
					absence: 0,
				},
				netPay: 75500,
			},
		},
	],
	currentBreakdown: {
		attendance: {
			present: 18,
			absent: 1,
		},
		basic: 40000,
		hra: 20000,
		bonuses: 5000,
		allowances: 15000,
		deductions: {
			tax: 4500,
			pf: 1800,
			insurance: 700,
			absence: 900,
		},
		netPay: 72100,
	},
};

// Bulletins
export const MOCK_BULLETINS = [
	{
		id: 1,
		title: "Campus-wide Network Maintenance",
		content:
			"The university network will be down for scheduled maintenance this Sunday from 2 AM to 6 AM. This affects both Wi-Fi and Ethernet connections in all hostel blocks.",
		level: "institution",
		priority: "High",
		author: "IT Department",
		createdAt: "2026-02-20T10:00:00Z",
		attachments: [
			{ name: "maintenance_schedule.pdf", url: "#", size: "1.2MB" },
		],
		is_pinned: false,
		faculty_only: false,
	},
	{
		id: 2,
		title: "New Research Grant Opportunities",
		content:
			"The Computer Science department has announced three new research grants for senior students focusing on AI and Sustainability. Application deadline is March 15th.",
		level: "department",
		department: "Computer Science",
		batch: "2025",
		year: "2nd",
		priority: "Normal",
		author: "Dr. Alice Smith",
		createdAt: "2026-03-19T14:30:00Z",
		attachments: [
			{ name: "grant_guidelines.docx", url: "#", size: "450KB" },
		],
		is_pinned: false,
		faculty_only: false,
	},
	{
		id: 3,
		title: "Library Extended Hours",
		content:
			"Starting next week, the central library will remain open until midnight to support students preparing for finals.",
		level: "institution",
		priority: "Normal",
		author: "Chief Librarian",
		createdAt: "2026-02-15T08:00:00Z",
		attachments: [],
		is_pinned: false,
		faculty_only: false,
	},
	{
		id: 4,
		title: "Guest Lecture: Future of Quantum Computing",
		content:
			"The Physics department invites all 3rd and 4th-year students to a guest lecture by Dr. Robert Penner from NASA.",
		level: "department",
		department: "Physics",
		batch: "2024",
		year: "3rd",
		priority: "High",
		author: "HOD Physics",
		createdAt: "2026-02-10T12:00:00Z",
		attachments: [
			{ name: "lecture_invite.pdf", url: "#", size: "2.1MB" },
			{ name: "speaker_bio.txt", url: "#", size: "15KB" },
		],
		is_pinned: false,
		faculty_only: false,
	},
	{
		id: 5,
		title: "Emergency Fire Drill",
		content:
			"A mandatory fire drill will take place tomorrow at 11:30 AM. Please evacuate the building immediately when the alarm sounds.",
		level: "institution",
		priority: "Urgent",
		author: "Campus Safety",
		createdAt: "2026-03-21T11:00:00Z",
		attachments: [{ name: "evacuation_map.jpg", url: "#", size: "3.5MB" }],
		is_pinned: false,
		faculty_only: false,
	},
	{
		id: 6,
		title: "Workshop: UI/UX Trends 2026",
		content:
			"Join us for a hands-on workshop on modern design systems and prototyping using Figma's newest features.",
		level: "department",
		department: "Information Technology",
		batch: "2026",
		year: "1st",
		priority: "Normal",
		author: "IT Club",
		createdAt: "2026-02-18T09:15:00Z",
		attachments: [{ name: "workshop_agenda.pdf", url: "#", size: "500KB" }],
		is_pinned: false,
		faculty_only: false,
	},
	{
		id: 7,
		title: "Faculty Performance Review Cycle",
		content:
			"The annual performance review portal is now open. Please submit your self-appraisals and peer reviews by the end of the month.",
		level: "institution",
		priority: "High",
		author: "Human Resources",
		createdAt: "2026-03-01T09:00:00Z",
		attachments: [{ name: "review_rubric.pdf", url: "#", size: "800KB" }],
		is_pinned: true,
		faculty_only: true,
	},
	{
		id: 8,
		title: "Confidential: Departmental Budget Allocation",
		content:
			"The preliminary budget for the Q3 lab equipment upgrades has been drafted. Please review the allocation for the Robotics wing.",
		level: "department",
		department: "Computer Science",
		batch: "all",
		year: "all",
		priority: "Normal",
		author: "Dean's Office",
		createdAt: "2026-03-05T15:45:00Z",
		attachments: [
			{ name: "budget_draft_q3.xlsx", url: "#", size: "1.5MB" },
		],
		is_pinned: false,
		faculty_only: true,
	},
];

// Research & Publications
export const MOCK_RESEARCH_PROJECTS = [
	{
		id: "RES-001",
		title: "AI-Driven Climate Modeling",
		professorName: "Dr. Jane Smith",
		collaborators: ["Dr. Robert Chen", "Sarah Jenkins"],
		abstract:
			"This project focuses on downscaling global climate models using GANs to provide actionable data for urban planning in coastal regions.",
		status: "Open",
		category: "Computer Science",
		keywords: ["GANs", "Climate Change", "Spatial Downscaling"],
		fundingDetails: null,
		collaborationType: "In-person",
		collaborationInstructions:
			"Weekly syncs in Room 402; must be comfortable with hybrid schedules.",
		link: "https://linkedin.com/in/janesmith-example",
		isOwner: true,
		isMember: true,
		isStarred: true,
		starsCount: 124,
		createdAt: "2026-02-18T09:00:00Z",
		currentMemberCount: 3,
		openRolesCount: 2,
		openRoles: [
			{
				id: 1,
				roleName: "ML Engineer",
				description:
					"Implement and fine-tune GAN architectures for spatial downscaling.",
			},
			{
				id: 2,
				roleName: "Data Analyst",
				description:
					"Process large-scale geospatial NetCDF datasets and visualize climate trends.",
			},
		],
		timeline: [
			{
				id: "evt-1",
				date: "2026-02-15",
				description:
					"Initial GAN architecture finalized and pushed to repository.",
				contributors: ["Dr. Jane Smith", "Sarah Jenkins"],
			},
			{
				id: "evt-2",
				date: "2026-02-24",
				description: "Data collection for coastal regions completed.",
				contributors: ["Dr. Robert Chen"],
			},
		],
		applicants: [
			{
				id: 1,
				userId: "USR-001",
				roleId: 1,
				name: "John Doe",
				role: "ML Engineer",
				designation: "Student",
				appliedDate: "2026-02-13T10:00:00Z",
				status: "Pending",
				resumeUrl: "/resumes/john_doe.pdf",
				linkedinUrl: "https://linkedin.com/in/johndoe",
				justification:
					"I have a background in atmospheric science and PyTorch.",
			},
			{
				id: 2,
				userId: "USR-002",
				roleId: 2,
				name: "Jane Doe",
				role: "Data Analyst",
				designation: "Professor",
				appliedDate: "2026-02-08T10:00:00Z",
				status: "Pending",
				resumeUrl: "/resumes/jane_doe.pdf",
				linkedinUrl: "https://linkedin.com/in/janedoe",
				justification:
					"I have a background in atmospheric science and PyTorch.",
			},
			{
				id: 3,
				userId: "USR-003",
				roleId: 1,
				name: "Alex Rivera",
				role: "ML Engineer",
				designation: "Graduate Student",
				appliedDate: "2026-02-25T14:20:00Z",
				status: "Pending",
				resumeUrl: "/resumes/alex_rivera.pdf",
				linkedinUrl: "https://linkedin.com/in/arivera-ml",
				justification:
					"Specialized in Generative Adversarial Networks during my Master's thesis; eager to apply GANs to environmental datasets.",
			},
			{
				id: 4,
				userId: "USR-004",
				roleId: 2,
				name: "Samantha Kwok",
				role: "Data Analyst",
				designation: "Student",
				appliedDate: "2026-02-26T09:15:00Z",
				status: "Pending",
				resumeUrl: "/resumes/skwok.pdf",
				linkedinUrl: "https://linkedin.com/in/samkwok-data",
				justification:
					"Experienced with NetCDF4 and xarray libraries in Python. I have previously visualized sea-level rise data for a local non-profit.",
			},
			{
				id: 5,
				userId: "USR-005",
				roleId: 1,
				name: "Dr. Marcus Thorne",
				role: "ML Engineer",
				designation: "Postdoctoral Researcher",
				appliedDate: "2026-02-27T11:45:00Z",
				status: "Pending",
				resumeUrl: "/resumes/m_thorne.pdf",
				linkedinUrl: "https://linkedin.com/in/marcusthorne-phd",
				justification:
					"My research focuses on high-resolution weather forecasting. I'm looking to collaborate on urban climate resilience projects.",
			},
			{
				id: 6,
				userId: "USR-006",
				roleId: 2,
				name: "Elena Rodriguez",
				role: "Data Analyst",
				designation: "Student",
				appliedDate: "2026-02-28T16:30:00Z",
				status: "Pending",
				resumeUrl: "/resumes/erodriguez.pdf",
				linkedinUrl: "https://linkedin.com/in/elenarod",
				justification:
					"Strong background in GIS and spatial statistics. I can assist in cleaning and processing the coastal region datasets.",
			},
		],
	},
	{
		id: "RES-002",
		title: "Quantum Cryptography Protocols",
		professorName: "Prof. Alan Turing",
		collaborators: ["Dr. Jane Smith", "Ray Miller"],
		abstract:
			"Evaluating lattice-based and code-based cryptographic primitives against Shor's algorithm simulations.",
		status: "Closed",
		category: "Cybersecurity",
		keywords: ["Quantum", "Lattice-based", "Shor's Algorithm"],
		fundingDetails: "University Internal Funding - $12,000",
		collaborationType: "Remote",
		collaborationInstructions:
			"Communication via Slack and GitHub. Bi-weekly video calls required.",
		link: "https://linkedin.com/in/alanturing-example",
		isOwner: false,
		isMember: true,
		isStarred: false,
		starsCount: 89,
		createdAt: "2025-12-01T14:20:00Z",
		currentMemberCount: 3,
		openRolesCount: 0,
		openRoles: [],
		timeline: [],
		applicants: [],
	},
	{
		id: "RES-003",
		title: "Swarm Robotics for Disaster Response",
		professorName: "Dr. Elena Rodriguez",
		collaborators: ["Marcus Thorne", "Dr. Sarah Jenkins"],
		abstract:
			"Developing decentralized coordination algorithms for drone swarms to perform autonomous search and rescue in GPS-denied environments.",
		status: "Open",
		category: "Robotics",
		keywords: ["Drones", "Swarm Intelligence", "SLAM"],
		fundingDetails: "DHS Innovation Grant - $85,000",
		collaborationType: "On-site (Lab Required)",
		collaborationInstructions:
			"Must be present in the Robotics Lab for hardware testing on Tuesdays/Thursdays.",
		link: "https://linkedin.com/in/elenarodriguez-example",
		isOwner: false,
		isMember: false,
		isStarred: true,
		starsCount: 210,
		createdAt: "2026-01-10T11:30:00Z",
		currentMemberCount: 4,
		openRolesCount: 2,
		openRoles: [
			{
				id: 1,
				roleName: "Firmware Developer",
				description:
					"Optimize C++ control loops for PX4 flight controllers.",
			},
			{
				id: 2,
				roleName: "Computer Vision Lead",
				description: "Implement real-time SLAM using depth cameras.",
			},
		],
		timeline: [],
		applicants: [],
	},
	{
		id: "RES-004",
		title: "Blockchain for Medical Data Privacy",
		professorName: "Dr. Robert Chen",
		collaborators: ["John Doe", "Dr. Jane Smith"],
		abstract:
			"Creating a Layer-2 scaling solution for Ethereum to manage HIPAA-compliant patient records without compromising throughput.",
		status: "Open",
		category: "Cybersecurity",
		keywords: ["Blockchain", "HIPAA", "Ethereum", "Layer-2"],
		fundingDetails: "HealthTech Corp Partnership - $30,000",
		collaborationType: "Remote",
		collaborationInstructions:
			"Fully async workflow using Jira and Discord.",
		link: "https://linkedin.com/in/janesmith-example",
		isOwner: false,
		isMember: true,
		isStarred: false,
		starsCount: 45,
		createdAt: "2026-01-15T16:45:00Z",
		currentMemberCount: 3,
		openRolesCount: 1,
		openRoles: [
			{
				id: 1,
				roleName: "Smart Contract Auditor",
				description: "Formal verification of Solidity contracts.",
			},
		],
		timeline: [],
		applicants: [],
	},
	{
		id: "RES-005",
		title: "Adaptive Edge Computing for Smart Grids",
		professorName: "Dr. Marcus Thorne",
		collaborators: ["Dr. Liu Wei"],
		abstract:
			"Developing reinforcement learning algorithms to optimize energy distribution in localized microgrids using edge devices.",
		status: "Open",
		category: "Electrical Engineering",
		keywords: ["Smart Grid", "Edge Computing", "Reinforcement Learning"],
		fundingDetails: "Department of Energy - $120,000",
		collaborationType: "Hybrid",
		collaborationInstructions:
			"Monthly site visits to the campus substation; bi-weekly Zoom updates.",
		link: "https://linkedin.com/in/marcusthorne-example",
		isOwner: false,
		isMember: false,
		isStarred: false,
		starsCount: 42,
		createdAt: "2026-02-10T11:00:00Z",
		currentMemberCount: 2,
		openRolesCount: 1,
		openRoles: [
			{
				id: 1,
				roleName: "RL Researcher",
				description:
					"Develop and test Q-learning models for load balancing.",
			},
		],
		timeline: [],
		applicants: [],
	},
	{
		id: "RES-006",
		title: "Synthetic Biology for Carbon Sequestration",
		professorName: "Dr. Elizabeth Hopper",
		collaborators: ["Dr. Sarah Jenkins"],
		abstract:
			"Engineering cyanobacteria strains with enhanced carbon fixation pathways for industrial-scale bioreactors.",
		status: "Open",
		category: "Bioengineering",
		keywords: ["Synthetic Biology", "Carbon Capture", "CRISPR"],
		fundingDetails: "Green Earth Foundation - $200,000",
		collaborationType: "On-site (Lab Required)",
		collaborationInstructions:
			"Strict adherence to BSL-2 lab protocols required.",
		link: "https://linkedin.com/in/ehopper-example",
		isOwner: false,
		isMember: false,
		isStarred: false,
		starsCount: 315,
		createdAt: "2026-01-20T10:00:00Z",
		currentMemberCount: 5,
		openRolesCount: 2,
		openRoles: [
			{
				id: 1,
				roleName: "Lab Technician",
				description:
					"Maintain microbial cultures and perform PCR analysis.",
			},
			{
				id: 2,
				roleName: "Bioinformatics Analyst",
				description:
					"Sequence analysis of modified CRISPR target sites.",
			},
		],
		timeline: [],
		applicants: [],
	},
];
export const MOCK_PUBLICATIONS = [
	{
		id: "PUB-001",
		title: "Scalable Neural Networks for Edge Computing",
		professorName: "Dr. Jane Smith",
		coAuthors: ["Kevin Wright", "Dr. Liu Wei"],
		journalDetails: "IEEE Transactions on Computers, Vol 12",
		abstract:
			"We present a novel pruning technique that reduces model size by 40%.",
		doi: "10.1109/TC.2025.123456",
		link: "https://ieeexplore.ieee.org/document/example",
		publishedDate: "2025-11-20",
		createdAt: "2025-10-01T08:00:00Z",
		recordType: "Journal Article",
		status: "Closed",
		category: "Artificial Intelligence",
		keywords: ["Edge AI", "Neural Pruning"],
		fundingDetails: null,
		collaborationType: "Hybrid",
		collaborationInstructions:
			"In-person drafting sessions with remote peer review cycles.",
		isOwner: true,
		isMember: true,
		isStarred: true,
		starsCount: 312,
		documentUrl: "/docs/pubs/edge_computing_paper.pdf",
		currentMemberCount: 3,
		openRolesCount: 0,
		openRoles: [],
		timeline: [],
		applicants: [],
	},
	{
		id: "PUB-002",
		title: "Ethical Implications of Autonomous Defense Systems",
		professorName: "Prof. Alan Turing",
		coAuthors: ["Dr. Jane Smith", "Kyle Reese"],
		journalDetails: "International Conference on AI Ethics (ICAE 2026)",
		abstract:
			"An analysis of accountability frameworks in lethal autonomous weapons systems.",
		doi: "10.1016/j.aieth.2026.007",
		link: "https://conference-archive.org/icae/2026",
		publishedDate: "2026-01-15",
		createdAt: "2025-12-12T10:15:00Z",
		recordType: "Conference Paper",
		status: "Open",
		category: "Ethics",
		keywords: ["AI Ethics", "Defense"],
		fundingDetails: null,
		collaborationType: "Remote",
		collaborationInstructions:
			"Collaborative editing via Google Docs and monthly Zoom brainstorms.",
		isOwner: false,
		isMember: true,
		isStarred: true,
		starsCount: 156,
		documentUrl: "/docs/pubs/ethics_defense_ai.pdf",
		currentMemberCount: 3,
		openRolesCount: 2,
		openRoles: [
			{
				id: 1,
				roleName: "Ethics Consultant",
				description:
					"Review legal frameworks regarding international humanitarian law.",
			},
			{
				id: 2,
				roleName: "Technical Writer",
				description:
					"Format the final manuscript for ICAE 2026 submission guidelines.",
			},
		],
		timeline: [],
		applicants: [],
	},
	{
		id: "PUB-003",
		title: "Neuro-Symbolic Reasoning in Large Language Models",
		professorName: "Dr. Victor Von Neumann",
		coAuthors: ["Dr. Elizabeth Hopper", "Liam Sterling"],
		journalDetails: "Nature Machine Intelligence, Vol 4",
		abstract:
			"Integrating symbolic logic gates into transformer architectures to solve multi-step mathematical reasoning problems.",
		doi: "10.1038/s42256-026-0089",
		link: "https://nature.com/articles/example",
		publishedDate: "2026-02-10",
		createdAt: "2026-01-05T09:00:00Z",
		recordType: "Journal Article",
		status: "Open",
		category: "Artificial Intelligence",
		keywords: ["Neuro-Symbolic", "LLMs", "Logic"],
		fundingDetails: null,
		collaborationType: "Remote",
		collaborationInstructions:
			"High-security data protocols; use the provided VPN for all shared notebook access.",
		isOwner: false,
		isMember: false,
		isStarred: false,
		starsCount: 420,
		documentUrl: "/docs/pubs/neuro_symbolic.pdf",
		currentMemberCount: 2,
		openRolesCount: 1,
		openRoles: [
			{
				id: 1,
				roleName: "Peer Reviewer",
				description:
					"Verify proofs and reproducibility of the algorithms.",
			},
		],
		timeline: [],
		applicants: [],
	},
	{
		id: "PUB-004",
		title: "Analyzing Social Media Echo Chambers in Local Elections",
		professorName: "Dr. Jane Smith",
		coAuthors: ["Sarah Jenkins", "Dr. Alan Turing"],
		journalDetails: "Journal of Computational Social Science",
		abstract:
			"A graph-theory approach to identifying polarization patterns in municipal election discourse on decentralized social platforms.",
		doi: "10.1007/s42001-026-0152",
		link: "https://springer.com/journal/example",
		publishedDate: "2026-03-01",
		createdAt: "2026-02-01T13:00:00Z",
		recordType: "Conference Paper",
		status: "Open",
		category: "Data Science",
		keywords: ["Graph Theory", "Social Analytics", "NLP"],
		fundingDetails: null,
		collaborationType: "In-person",
		collaborationInstructions:
			"Meet at the Social Analytics Lab every Wednesday at 2 PM.",
		isOwner: true,
		isMember: true,
		isStarred: false,
		starsCount: 67,
		documentUrl: "/docs/pubs/echo_chambers_study.pdf",
		currentMemberCount: 4,
		openRolesCount: 2,
		openRoles: [
			{
				id: 1,
				roleName: "Graphic Designer",
				description:
					"Design high-resolution network visualizations for the final manuscript.",
			},
			{
				id: 2,
				roleName: "Translator",
				description:
					"Translate abstract and executive summary into Spanish and French.",
			},
		],
		timeline: [],
		applicants: [
			{
				id: 3,
				roleId: 1,
				name: "Alice Cooper",
				role: "Graphic Designer",
				designation: "Student",
				appliedDate: "2026-02-20T14:30:00Z",
				status: "Pending",
				resumeUrl: "/resumes/alice_c.pdf",
				linkedinUrl: "https://linkedin.com/in/alicecooper",
				justification: "Expert in D3.js and Gephi visualizations.",
			},
		],
	},
	{
		id: "PUB-005",
		title: "Lattice-Based Signature Schemes for Post-Quantum IoT",
		professorName: "Dr. Victor Von Neumann",
		coAuthors: ["Ray Miller", "Dr. Alan Turing"],
		journalDetails: "Journal of Cryptology, Vol 29",
		abstract:
			"A study on reducing the computational overhead of Dilithium-based signatures for resource-constrained devices.",
		doi: "10.1007/s00145-026-0982",
		link: "https://springer.com/journal/cryptology/example",
		publishedDate: "2026-02-28",
		createdAt: "2026-01-15T09:00:00Z",
		recordType: "Journal Article",
		status: "Open",
		category: "Cybersecurity",
		keywords: ["Post-Quantum", "IoT", "Lattice Cryptography"],
		fundingDetails: null,
		collaborationType: "Remote",
		collaborationInstructions:
			"Collaboration via Overleaf and private Git repository.",
		isOwner: false,
		isMember: false,
		isStarred: false,
		starsCount: 88,
		documentUrl: "/docs/pubs/post_quantum_iot.pdf",
		currentMemberCount: 3,
		openRolesCount: 1,
		openRoles: [
			{
				id: 1,
				roleName: "Lead Copyeditor",
				description:
					"Ensure mathematical notation consistency across the final proof.",
			},
		],
		timeline: [],
		applicants: [],
	},
	{
		id: "PUB-006",
		title: "Human-Robot Interaction in Pediatric Care",
		professorName: "Dr. Elena Rodriguez",
		coAuthors: ["Alice Cooper"],
		journalDetails: "ACM Transactions on Human-Robot Interaction",
		abstract:
			"Measuring the psychological impact of social robots on stress levels in pediatric hospital wards.",
		doi: "10.1145/3610921",
		link: "https://dl.acm.org/doi/example",
		publishedDate: "2026-03-10",
		createdAt: "2026-02-05T14:00:00Z",
		recordType: "Conference Paper",
		status: "Open",
		category: "Robotics",
		keywords: ["HRI", "Pediatrics", "Social Robotics"],
		fundingDetails: null,
		collaborationType: "Hybrid",
		collaborationInstructions:
			"Weekly meetings at the Children's Health Center for data review.",
		isOwner: false,
		isMember: false,
		isStarred: true,
		starsCount: 204,
		documentUrl: "/docs/pubs/hri_pediatrics.pdf",
		currentMemberCount: 2,
		openRolesCount: 1,
		openRoles: [
			{
				id: 1,
				roleName: "Statistical Consultant",
				description:
					"Perform ANOVA and regression analysis on patient recovery data.",
			},
		],
		timeline: [],
		applicants: [],
	},
];
export const MOCK_USERS = [
	/* Professors: Faculty members leading research projects and publications */
	{
		id: "PROF-001",
		name: "Dr. Jane Smith",
		isYou: true,
		tag: "Professor",
		department: "Computer Science",
		email: "jane.smith@university.edu",
		linkedinUrl: "https://linkedin.com/in/janesmith-example",
		avatar: "/avatars/jane-smith.jpg",
		bio: "Specializing in AI-driven climate solutions and neural network pruning.",
		skills: ["PyTorch", "Climate Modeling", "Neural Architecture Search"],
		office: "Gates Hall 402",
		publications: 42,
		joinedDate: "2018-08-15",
	},
	{
		id: "PROF-002",
		name: "Prof. Alan Turing",
		isYou: false,
		tag: "Professor",
		department: "Cybersecurity",
		email: "a.turing@university.edu",
		linkedinUrl: "https://linkedin.com/in/alanturing-example",
		avatar: "/avatars/alan-turing.jpg",
		bio: "Focusing on quantum-resistant cryptography and AI ethics.",
		skills: ["Cryptography", "Complexity Theory", "Formal Methods"],
		office: "Enigma Suite 001",
		publications: 128,
		joinedDate: "2015-01-10",
	},
	{
		id: "PROF-003",
		name: "Dr. Robert Chen",
		isYou: false,
		tag: "Professor",
		department: "Computer Science / Blockchain",
		email: "r.chen@university.edu",
		avatar: "/avatars/robert-chen.jpg",
		bio: "Expert in decentralized systems and HIPAA-compliant data management.",
		skills: ["Solidity", "Distributed Systems", "Data Privacy"],
		office: "Tech Plaza 210",
		publications: 35,
		joinedDate: "2020-03-22",
	},
	{
		id: "PROF-004",
		name: "Dr. Elena Rodriguez",
		isYou: false,
		tag: "Professor",
		department: "Robotics",
		email: "e.rodriguez@university.edu",
		avatar: "/avatars/elena-rod.jpg",
		bio: "Lead researcher for the Swarm Intelligence and Disaster Response lab.",
		skills: ["ROS", "Control Systems", "Path Planning"],
		office: "Robotics Wing B-12",
		publications: 56,
		joinedDate: "2017-11-05",
	},

	/* Students: Researchers and applicants within the platform */
	{
		id: "STU-001",
		name: "John Doe",
		isYou: false,
		tag: "Student",
		department: "Data Science",
		email: "john.doe@student.edu",
		linkedinUrl: "https://linkedin.com/in/johndoe",
		resumeUrl: "/resumes/john_doe.pdf",
		bio: "Graduate student with a focus on atmospheric science and PyTorch.",
		skills: ["Python", "SQL", "Pandas", "Scikit-Learn"],
		education: "MS in Data Science",
		gpa: 3.9,
		activeApplications: 2,
	},
	{
		id: "STU-002",
		name: "Sarah Jenkins",
		isYou: false,
		tag: "Student",
		department: "Artificial Intelligence",
		email: "s.jenkins@student.edu",
		avatar: "/avatars/sarah-j.jpg",
		bio: "PhD candidate specializing in GANs and spatial downscaling techniques.",
		skills: ["TensorFlow", "Computer Vision", "Keras"],
		education: "PhD in Artificial Intelligence",
		gpa: 4.0,
		activeApplications: 1,
	},
	{
		id: "STU-003",
		name: "Alice Cooper",
		isYou: false,
		tag: "Student",
		department: "Digital Arts / UI",
		email: "a.cooper@student.edu",
		linkedinUrl: "https://linkedin.com/in/alicecooper",
		resumeUrl: "/resumes/alice_c.pdf",
		bio: "Expert in D3.js and large-scale graph visualizations.",
		skills: ["React", "D3.js", "Figma", "TypeScript"],
		education: "BS in Digital Arts",
		gpa: 3.8,
		activeApplications: 3,
	},
	{
		id: "STU-004",
		name: "Ray Miller",
		isYou: false,
		tag: "Student",
		department: "Mathematics",
		email: "r.miller@student.edu",
		bio: "Undergraduate researcher focused on lattice-based cryptographic primitives.",
		skills: ["Abstract Algebra", "Number Theory", "C++"],
		education: "BS in Mathematics",
		gpa: 3.95,
		activeApplications: 0,
	},
];
export const MOCK_USER_RESEARCH_APPLICATIONS = [
	{
		id: "APP-101",
		researchId: "RES-002",
		title: "Quantum Cryptography Protocols",
		professorName: "Prof. Alan Turing",
		role: "Security Researcher", // User applied for this specific role
		status: "Accepted",
		appliedDate: "2026-02-15T10:00:00Z",
		approvalDate: "2026-02-18T09:30:00Z",
		professorNotes: "Glad to have you as a part of our team!",
		submissionDetails: {
			justification:
				"I am interested in collaborating on lattice-based signatures.",
			resumeUrl: "/resumes/jane_smith_cv.pdf",
			linkedinUrl: "https://linkedin.com/in/janesmith-example",
		},
		meetingDetails: null,
	},
	{
		id: "APP-102",
		researchId: "RES-003",
		title: "CRISPR-Cas9 Gene Silencing in Wheat",
		professorName: "Dr. Rosalind Franklin",
		role: "Lab Technician", // User applied for this specific role
		status: "Meeting Scheduled",
		appliedDate: "2026-01-10T14:30:00Z",
		approvalDate: null,
		submissionDetails: {
			justification:
				"I have extensive experience in molecular sequencing.",
			resumeUrl: "/resumes/user_cv_final.pdf",
			linkedinUrl: "https://linkedin.com/in/currentuser",
		},
		meetingDetails: {
			date: "2026-02-25T09:00:00Z",
			mode: "Offline",
			location: "Biotech Building, Room 402",
			notes: "Please bring a copy of your recent lab certifications.",
		},
	},
	{
		id: "APP-103",
		researchId: "RES-005",
		title: "Adaptive Edge Computing for Smart Grids",
		professorName: "Dr. Marcus Thorne",
		role: "RL Researcher",
		status: "Rejected",
		appliedDate: "2026-02-20T11:00:00Z",
		approvalDate: null,
		professorNotes:
			"While your background is impressive, we are looking for candidates with more direct experience in Q-learning architectures.",
		submissionDetails: {
			justification:
				"I am eager to apply my reinforcement learning knowledge to sustainable energy solutions.",
			resumeUrl: "/resumes/user_cv_v2.pdf",
			linkedinUrl: "https://linkedin.com/in/currentuser",
		},
		meetingDetails: null,
	},
];
export const MOCK_RESEARCH_GRANT_DATA = {
	admins: [
		{
			name: "Research Office",
			email: "grants-admin@university.edu",
			phone: "+91 99999 66666",
		},
		{
			name: "Financial Controller",
			email: "finance-awards@university.edu",
			phone: "+91 99999 55555",
		},
	],
	requests: [
		{
			id: "GRT-101",
			requestId: "REQ-2026-001",
			targetId: "RES-001",
			targetType: "Project",
			title: "National Science Foundation: Climate Tech Grant",
			amount: 50000,
			status: "Pending",
			isArchived: false,
			date: "2026-03-15",
			reason: "Funding required for high-compute GPU instances to train GAN architectures and travel for coastal field data collection.",
			supportingDocs: [
				{
					name: "Project_Proposal.pdf",
					url: "/docs/grants/nsf_proposal.pdf",
				},
				{
					name: "Budget_Breakdown.xlsx",
					url: "/docs/grants/budget_v1.xlsx",
				},
			],
			adminComments: null,
			lastAdminAction: null,
		},
		{
			id: "GRT-102",
			requestId: "REQ-2026-002",
			targetId: "PUB-002",
			targetType: "Publication",
			title: "Open Access Publishing Fund",
			amount: 3500,
			status: "Approved",
			isArchived: true,
			date: "2026-02-10",
			reason: "To cover Article Processing Charges (APC) for Gold Open Access publication in the ICAE 2026 proceedings.",
			supportingDocs: [
				{
					name: "Acceptance_Letter.pdf",
					url: "/docs/grants/icae_acceptance.pdf",
				},
			],
			adminComments:
				"Funding approved based on publication impact score.",
			lastAdminAction: "2026-02-15",
		},
		{
			id: "GRT-103",
			requestId: "REQ-2026-003",
			targetId: "RES-005",
			targetType: "Project",
			title: "Clean Energy Innovation Seed Grant",
			amount: 75000,
			status: "Rejected",
			isArchived: false,
			date: "2026-01-05",
			reason: "Seed funding for microgrid hardware prototypes and edge device deployment in the campus substation.",
			supportingDocs: [
				{
					name: "Technical_Specs.pdf",
					url: "/docs/grants/doe_tech_specs.pdf",
				},
			],
			adminComments:
				"The proposal requires more detailed hardware specifications and a clearer plan for energy scaling.",
			lastAdminAction: "2026-01-20",
		},
		{
			id: "GRT-104",
			requestId: "REQ-2026-004",
			targetId: "PUB-006",
			targetType: "Publication",
			title: "International Travel Grant - HRI 2026",
			amount: 2200,
			status: "Resubmitted",
			isArchived: false,
			date: "2026-04-01",
			/* Resubmission reason explaining the update */
			reason: "Revised application including full travel history and updated publication record as requested by the admin office.",
			supportingDocs: [
				{
					name: "Updated_CV_and_Travel_History.pdf",
					url: "/docs/grants/hri_travel_v2.pdf",
				},
			],
			adminComments: null,
			lastAdminAction: null,
			previousVersion: {
				title: "International Travel Grant - HRI 2026",
				amount: 2200,
				date: "2026-03-25",
				reason: "Travel support for presenting pediatric social robotics findings at the international conference in Seoul.",
				supportingDocs: [],
				adminComments:
					"Reviewing travel history and publication record for eligibility.",
				lastAdminAction: "2026-03-30",
			},
		},
	],
};

// ========================================================
// DEAN MODULE: Industry & External Relations
// ========================================================
export const MOCK_INDUSTRY_RELATIONS_DATA = {
	summary: {
		totalCompanies: 48,
		activeMous: 22,
		internshipPipelines: 15,
		ppoConversionRate: 34.5,
		totalInternships: 312,
		avgStipend: 25000,
		topDomain: "IT / Software",
		repeatRecruiters: 18,
		highestPackageLpa: 52.0,
		avgPackageLpa: 12.8,
		mostRecruitedBranch: "CSE",
		totalAlumniPlaced: 1250,
		alumniInFaang: 85,
	},
	branchStats: [
		{ branch: "CSE", totalPlacements: 145, avgPackageLpa: 16.2, highestPackageLpa: 52.0, internships: 120, ppos: 42, companies: 28, alumniCount: 480, topRecruiter: "Microsoft" },
		{ branch: "ECE", totalPlacements: 68, avgPackageLpa: 11.5, highestPackageLpa: 28.0, internships: 55, ppos: 18, companies: 18, alumniCount: 320, topRecruiter: "Qualcomm" },
		{ branch: "EE", totalPlacements: 42, avgPackageLpa: 10.2, highestPackageLpa: 22.0, internships: 35, ppos: 12, companies: 14, alumniCount: 180, topRecruiter: "Bosch" },
		{ branch: "ME", totalPlacements: 55, avgPackageLpa: 9.8, highestPackageLpa: 18.5, internships: 45, ppos: 15, companies: 16, alumniCount: 150, topRecruiter: "TCS" },
		{ branch: "Civil", totalPlacements: 22, avgPackageLpa: 7.5, highestPackageLpa: 14.0, internships: 18, ppos: 5, companies: 8, alumniCount: 72, topRecruiter: "L&T" },
		{ branch: "Chemical", totalPlacements: 18, avgPackageLpa: 8.0, highestPackageLpa: 15.0, internships: 14, ppos: 4, companies: 6, alumniCount: 48, topRecruiter: "Reliance" },
	],
	yearWiseStats: [
		{ year: "1st Year", totalPlacements: 0,   avgPackageLpa: 0,    highestPackageLpa: 0,    totalOffers: 0,   companiesVisited: 8 },
		{ year: "2nd Year", totalPlacements: 48,  avgPackageLpa: 4.2,  highestPackageLpa: 8.5,  totalOffers: 55,  companiesVisited: 15 },
		{ year: "3rd Year", totalPlacements: 145, avgPackageLpa: 6.8,  highestPackageLpa: 18.0, totalOffers: 168, companiesVisited: 30 },
		{ year: "4th Year", totalPlacements: 379, avgPackageLpa: 12.8, highestPackageLpa: 52.0, totalOffers: 420, companiesVisited: 48 },
	],
	alumniHighlights: [
		{ name: "Aditya Sharma", batch: "2022", branch: "CSE", company: "Google", role: "SDE-II", packageLpa: 45.0 },
		{ name: "Priya Reddy", batch: "2023", branch: "CSE", company: "Microsoft", role: "Software Engineer", packageLpa: 42.0 },
		{ name: "Rahul Menon", batch: "2022", branch: "ECE", company: "Apple", role: "Hardware Engineer", packageLpa: 38.0 },
		{ name: "Sneha Patel", batch: "2024", branch: "CSE", company: "Amazon", role: "SDE-I", packageLpa: 35.0 },
		{ name: "Vikash Kumar", batch: "2023", branch: "ME", company: "Tesla", role: "Mechanical Design Engineer", packageLpa: 28.0 },
		{ name: "Kavya Nair", batch: "2024", branch: "CSE", company: "Goldman Sachs", role: "Quantitative Analyst", packageLpa: 52.0 },
	],
	placementFunnel: {
		eligible: 450,
		applied: 380,
		selected: 280,
		interned: 220,
		ppoReceived: 76,
		placed: 379,
	},
	companies: [
		{ id: "CMP-001", name: "Tata Consultancy Services", domain: "IT", relationship: "Strategic Partner", mouStatus: "Active", internshipsOffered: 45, pposGiven: 18, engagementScore: 92, contactPerson: "Rajesh Kumar", contactEmail: "rajesh.k@tcs.com", lastEngagement: "2026-03-15", since: "2018" },
		{ id: "CMP-002", name: "Infosys", domain: "IT", relationship: "Strategic Partner", mouStatus: "Active", internshipsOffered: 38, pposGiven: 14, engagementScore: 88, contactPerson: "Sneha Reddy", contactEmail: "sneha.r@infosys.com", lastEngagement: "2026-03-20", since: "2019" },
		{ id: "CMP-003", name: "Microsoft India", domain: "IT", relationship: "Premium Partner", mouStatus: "Active", internshipsOffered: 12, pposGiven: 8, engagementScore: 95, contactPerson: "Amit Verma", contactEmail: "amit.v@microsoft.com", lastEngagement: "2026-04-01", since: "2020" },
		{ id: "CMP-004", name: "Goldman Sachs", domain: "Finance", relationship: "Active Recruiter", mouStatus: "Active", internshipsOffered: 8, pposGiven: 5, engagementScore: 85, contactPerson: "Priya Menon", contactEmail: "priya.m@gs.com", lastEngagement: "2026-02-28", since: "2021" },
		{ id: "CMP-005", name: "McKinsey & Company", domain: "Consulting", relationship: "Active Recruiter", mouStatus: "Pending", internshipsOffered: 6, pposGiven: 4, engagementScore: 82, contactPerson: "Karan Shah", contactEmail: "karan.s@mckinsey.com", lastEngagement: "2026-01-15", since: "2022" },
		{ id: "CMP-006", name: "Qualcomm", domain: "Core/Hardware", relationship: "Strategic Partner", mouStatus: "Active", internshipsOffered: 15, pposGiven: 7, engagementScore: 78, contactPerson: "Deepak Joshi", contactEmail: "deepak.j@qualcomm.com", lastEngagement: "2026-03-10", since: "2019" },
		{ id: "CMP-007", name: "DeepMind", domain: "AI/ML", relationship: "Premium Partner", mouStatus: "Active", internshipsOffered: 5, pposGiven: 3, engagementScore: 97, contactPerson: "Sarah Chen", contactEmail: "sarah.c@deepmind.com", lastEngagement: "2026-04-05", since: "2023" },
		{ id: "CMP-008", name: "Wipro", domain: "IT", relationship: "Standard Recruiter", mouStatus: "Expired", internshipsOffered: 30, pposGiven: 8, engagementScore: 65, contactPerson: "Vikram Singh", contactEmail: "vikram.s@wipro.com", lastEngagement: "2025-12-01", since: "2017" },
		{ id: "CMP-009", name: "Bosch India", domain: "Core/Hardware", relationship: "Active Recruiter", mouStatus: "Active", internshipsOffered: 10, pposGiven: 4, engagementScore: 75, contactPerson: "Meera Nair", contactEmail: "meera.n@bosch.com", lastEngagement: "2026-02-15", since: "2020" },
		{ id: "CMP-010", name: "JPMorgan Chase", domain: "Finance", relationship: "Premium Partner", mouStatus: "Active", internshipsOffered: 10, pposGiven: 6, engagementScore: 90, contactPerson: "Arun Patel", contactEmail: "arun.p@jpmc.com", lastEngagement: "2026-03-25", since: "2021" },
		{ id: "CMP-011", name: "Amazon", domain: "IT", relationship: "Premium Partner", mouStatus: "Active", internshipsOffered: 20, pposGiven: 12, engagementScore: 93, contactPerson: "Neha Gupta", contactEmail: "neha.g@amazon.com", lastEngagement: "2026-04-10", since: "2020" },
		{ id: "CMP-012", name: "Deloitte", domain: "Consulting", relationship: "Active Recruiter", mouStatus: "Active", internshipsOffered: 14, pposGiven: 5, engagementScore: 80, contactPerson: "Rohan Das", contactEmail: "rohan.d@deloitte.com", lastEngagement: "2026-03-05", since: "2021" },
	],
	mous: [
		{ id: "MOU-001", companyId: "CMP-001", companyName: "Tata Consultancy Services", type: "Strategic Partnership", startDate: "2024-01-01", endDate: "2027-01-01", status: "Active", scope: "Internships, Campus Hiring, Research Collaboration", renewalPending: false, description: "Long-term strategic partnership covering bulk hiring across all engineering branches, joint research labs, and industry-ready certification programs for students.", rolesLookingFor: ["Software Developer", "Systems Engineer", "Data Analyst", "DevOps Engineer", "Business Analyst"], hiresLastYear: 45, avgPackageOffered: 7.5, hrContact: { name: "Rajesh Kumar", designation: "University Relations Manager", phone: "+91 98765 43210", email: "rajesh.k@tcs.com", linkedIn: "linkedin.com/in/rajesh-kumar-tcs" }, visitHistory: [{ date: "2026-03-15", purpose: "Campus Drive" }, { date: "2025-09-10", purpose: "Pre-Placement Talk" }] },
		{ id: "MOU-002", companyId: "CMP-003", companyName: "Microsoft India", type: "Premium Hiring", startDate: "2024-06-01", endDate: "2026-06-01", status: "Active", scope: "Internships, PPO Pipeline, Guest Lectures", renewalPending: true, description: "Premium hiring partnership focused on high-caliber CSE and ECE students. Includes Microsoft Learn campus ambassador program and hackathon sponsorship.", rolesLookingFor: ["Software Engineer", "Program Manager", "Cloud Solutions Architect", "AI/ML Engineer"], hiresLastYear: 12, avgPackageOffered: 42.0, hrContact: { name: "Amit Verma", designation: "Head of Campus Recruitment - India", phone: "+91 99887 76655", email: "amit.v@microsoft.com", linkedIn: "linkedin.com/in/amit-verma-msft" }, visitHistory: [{ date: "2026-04-01", purpose: "Intern Selection" }, { date: "2025-11-20", purpose: "Hackathon Judge" }] },
		{ id: "MOU-003", companyId: "CMP-007", companyName: "DeepMind", type: "Research Partnership", startDate: "2025-01-01", endDate: "2028-01-01", status: "Active", scope: "AI Research, PhD Internships, Joint Publications", renewalPending: false, description: "Exclusive research partnership for advanced AI/ML research. PhD and Masters students get priority access to research internships at DeepMind London.", rolesLookingFor: ["Research Intern", "ML Engineer Intern", "Research Scientist"], hiresLastYear: 5, avgPackageOffered: 48.0, hrContact: { name: "Sarah Chen", designation: "Research Partnerships Lead", phone: "+44 7700 900123", email: "sarah.c@deepmind.com", linkedIn: "linkedin.com/in/sarah-chen-dm" }, visitHistory: [{ date: "2026-04-05", purpose: "Research Seminar" }] },
		{ id: "MOU-004", companyId: "CMP-008", companyName: "Wipro", type: "Standard Hiring", startDate: "2023-01-01", endDate: "2025-12-31", status: "Expired", scope: "Campus Recruitment", renewalPending: false, description: "Standard campus recruitment MoU for bulk hiring. Primarily focused on entry-level engineering roles across IT services.", rolesLookingFor: ["Project Engineer", "Software Developer", "Testing Engineer"], hiresLastYear: 30, avgPackageOffered: 5.5, hrContact: { name: "Vikram Singh", designation: "Talent Acquisition Lead", phone: "+91 98123 45678", email: "vikram.s@wipro.com", linkedIn: "linkedin.com/in/vikram-singh-wipro" }, visitHistory: [{ date: "2025-12-01", purpose: "Campus Drive" }] },
		{ id: "MOU-005", companyId: "CMP-010", companyName: "JPMorgan Chase", type: "Premium Hiring", startDate: "2025-03-01", endDate: "2027-03-01", status: "Active", scope: "Fintech Internships, Hackathons, PPO", renewalPending: false, description: "Fintech-focused partnership with focused hiring in quantitative roles, technology, and investment banking. Sponsors annual Code for Good hackathon.", rolesLookingFor: ["Quantitative Analyst", "Technology Analyst", "Data Engineer", "Full Stack Developer"], hiresLastYear: 10, avgPackageOffered: 28.0, hrContact: { name: "Arun Patel", designation: "Campus Recruitment VP", phone: "+91 99001 12233", email: "arun.p@jpmc.com", linkedIn: "linkedin.com/in/arun-patel-jpmc" }, visitHistory: [{ date: "2026-03-25", purpose: "Code for Good Hackathon" }, { date: "2025-10-15", purpose: "Pre-Placement Talk" }] },
		{ id: "MOU-006", companyId: "CMP-002", companyName: "Infosys", type: "Strategic Partnership", startDate: "2024-04-01", endDate: "2027-04-01", status: "Active", scope: "Internships, Training Programs, Joint Research", renewalPending: false, description: "Comprehensive partnership covering InStep internship program, Infosys Springboard certifications, and joint research in cloud computing and AI.", rolesLookingFor: ["Systems Engineer", "Digital Specialist", "Power Programmer", "Data Scientist"], hiresLastYear: 38, avgPackageOffered: 9.0, hrContact: { name: "Sneha Reddy", designation: "University Relations Director", phone: "+91 98456 78901", email: "sneha.r@infosys.com", linkedIn: "linkedin.com/in/sneha-reddy-infy" }, visitHistory: [{ date: "2026-03-20", purpose: "InStep Selection" }, { date: "2025-08-15", purpose: "Guest Lecture Series" }] },
	],
	pipelines: [
		{ companyId: "CMP-001", companyName: "TCS", eligible: 120, applied: 95, shortlisted: 60, interned: 45, ppoOffered: 18, placed: 16, domain: "IT", totalRecruitments: 45, avgSalaryLpa: 7.5, maxSalaryLpa: 12.0, rolesOffered: ["Software Developer", "Systems Engineer", "Data Analyst", "DevOps Engineer", "Business Analyst"], rolesFilled: { "Software Developer": 18, "Systems Engineer": 12, "Data Analyst": 8, "DevOps Engineer": 4, "Business Analyst": 3 }, branchWise: { CSE: 22, ECE: 10, EE: 5, ME: 6, Civil: 1, Chemical: 1 }, visitDate: "2026-03-15", selectionProcess: "Online Test → Technical Interview → HR Round" },
		{ companyId: "CMP-002", companyName: "Infosys", eligible: 120, applied: 88, shortlisted: 50, interned: 38, ppoOffered: 14, placed: 12, domain: "IT", totalRecruitments: 38, avgSalaryLpa: 9.0, maxSalaryLpa: 16.5, rolesOffered: ["Systems Engineer", "Digital Specialist", "Power Programmer", "Data Scientist"], rolesFilled: { "Systems Engineer": 15, "Digital Specialist": 10, "Power Programmer": 8, "Data Scientist": 5 }, branchWise: { CSE: 20, ECE: 8, EE: 4, ME: 5, Civil: 1 }, visitDate: "2026-03-20", selectionProcess: "InfyTQ → Interview → HR Discussion" },
		{ companyId: "CMP-003", companyName: "Microsoft", eligible: 80, applied: 65, shortlisted: 20, interned: 12, ppoOffered: 8, placed: 8, domain: "IT", totalRecruitments: 12, avgSalaryLpa: 42.0, maxSalaryLpa: 52.0, rolesOffered: ["Software Engineer", "Program Manager", "Cloud Solutions Architect", "AI/ML Engineer"], rolesFilled: { "Software Engineer": 6, "Program Manager": 2, "AI/ML Engineer": 2 }, branchWise: { CSE: 10, ECE: 2 }, visitDate: "2026-04-01", selectionProcess: "Coding Test → 3 Technical Rounds → Hiring Manager Round" },
		{ companyId: "CMP-004", companyName: "Goldman Sachs", eligible: 60, applied: 45, shortlisted: 15, interned: 8, ppoOffered: 5, placed: 5, domain: "Finance", totalRecruitments: 8, avgSalaryLpa: 28.0, maxSalaryLpa: 35.0, rolesOffered: ["Quantitative Analyst", "Technology Analyst", "Data Engineer", "Risk Analyst"], rolesFilled: { "Technology Analyst": 3, "Quantitative Analyst": 2, "Data Engineer": 2, "Risk Analyst": 1 }, branchWise: { CSE: 5, ECE: 2, ME: 1 }, visitDate: "2026-02-28", selectionProcess: "HackerRank → 2 Tech Rounds → Cultural Fit" },
		{ companyId: "CMP-007", companyName: "DeepMind", eligible: 40, applied: 30, shortlisted: 8, interned: 5, ppoOffered: 3, placed: 3, domain: "AI/ML", totalRecruitments: 5, avgSalaryLpa: 48.0, maxSalaryLpa: 55.0, rolesOffered: ["Research Intern", "ML Engineer Intern", "Research Scientist"], rolesFilled: { "Research Intern": 2, "ML Engineer Intern": 2, "Research Scientist": 1 }, branchWise: { CSE: 4, ECE: 1 }, visitDate: "2026-04-05", selectionProcess: "Research Paper Review → Technical Deep Dive → Team Match" },
		{ companyId: "CMP-011", companyName: "Amazon", eligible: 100, applied: 80, shortlisted: 35, interned: 20, ppoOffered: 12, placed: 11, domain: "IT", totalRecruitments: 20, avgSalaryLpa: 32.0, maxSalaryLpa: 44.0, rolesOffered: ["SDE-I", "SDE-II", "Data Engineer", "Solutions Architect", "Operations Manager"], rolesFilled: { "SDE-I": 10, "Data Engineer": 4, "Solutions Architect": 3, "SDE-II": 2, "Operations Manager": 1 }, branchWise: { CSE: 14, ECE: 3, ME: 2, EE: 1 }, visitDate: "2026-04-10", selectionProcess: "Online Assessment → 2 Coding Rounds → Bar Raiser → Hiring Manager" },
	],
	repeatRecruiters: [
		{ companyId: "CMP-001", companyName: "TCS", yearsRecruiting: 8, totalHires: 156, avgHiresPerYear: 19.5, lastVisit: "2026-03-15", consistency: "High", trend: "Stable" },
		{ companyId: "CMP-002", companyName: "Infosys", yearsRecruiting: 7, totalHires: 120, avgHiresPerYear: 17.1, lastVisit: "2026-03-20", consistency: "High", trend: "Growing" },
		{ companyId: "CMP-003", companyName: "Microsoft", yearsRecruiting: 6, totalHires: 42, avgHiresPerYear: 7.0, lastVisit: "2026-04-01", consistency: "High", trend: "Growing" },
		{ companyId: "CMP-011", companyName: "Amazon", yearsRecruiting: 6, totalHires: 68, avgHiresPerYear: 11.3, lastVisit: "2026-04-10", consistency: "High", trend: "Growing" },
		{ companyId: "CMP-006", companyName: "Qualcomm", yearsRecruiting: 7, totalHires: 48, avgHiresPerYear: 6.9, lastVisit: "2026-03-10", consistency: "Medium", trend: "Stable" },
		{ companyId: "CMP-010", companyName: "JPMorgan Chase", yearsRecruiting: 5, totalHires: 35, avgHiresPerYear: 7.0, lastVisit: "2026-03-25", consistency: "High", trend: "Growing" },
		{ companyId: "CMP-008", companyName: "Wipro", yearsRecruiting: 9, totalHires: 180, avgHiresPerYear: 20.0, lastVisit: "2025-12-01", consistency: "Low", trend: "Declining" },
	],
};

// ========================================================
// DEAN MODULE: Risk & Governance
// ========================================================
export const MOCK_RISK_GOVERNANCE_DATA = {
	summary: {
		operationalHealth: 84.3,
		complianceRate: 91.2,
		activeAlerts: 14,
		totalDepartments: 6,
		totalFaculty: 85,
		totalStudents: 1420,
		policyViolations: 8,
		resolvedThisMonth: 22,
	},
	alerts: [
		{ id: "ALT-001", type: "Academic Integrity", severity: "Critical", department: "CSE", message: "3 students flagged for plagiarism in CS401 mid-term submissions", date: "2026-04-14", status: "Open" },
		{ id: "ALT-002", type: "Attendance Breach", severity: "High", department: "ECE", message: "EC301 dropped below 65% attendance for 2nd consecutive week", date: "2026-04-13", status: "Open" },
		{ id: "ALT-003", type: "Grading Overdue", severity: "High", department: "ME", message: "ME201 mid-term grading is 72 hours overdue (Prof. Singh)", date: "2026-04-12", status: "Under Review" },
		{ id: "ALT-004", type: "Policy Violation", severity: "Medium", department: "CSE", message: "Faculty workload exceeds 24 hrs/week cap for 2 professors", date: "2026-04-11", status: "Open" },
		{ id: "ALT-005", type: "Documentation Gap", severity: "Medium", department: "Civil", message: "Course files for 4 subjects not submitted for semester-end audit", date: "2026-04-10", status: "Under Review" },
		{ id: "ALT-006", type: "Infrastructure Risk", severity: "Low", department: "EE", message: "HV Lab equipment maintenance overdue by 45 days", date: "2026-04-08", status: "Open" },
		{ id: "ALT-007", type: "Faculty Absence", severity: "Medium", department: "Chemical", message: "Dr. Rao missed 6 consecutive sessions without approved leave", date: "2026-04-07", status: "Open" },
	],
	departmentHealth: [
		{ department: "CSE", operationalScore: 88, attendanceCompliance: 84, gradingCompliance: 95, documentationScore: 92, policyAdherence: 90, riskLevel: "Low" },
		{ department: "ECE", operationalScore: 79, attendanceCompliance: 72, gradingCompliance: 88, documentationScore: 85, policyAdherence: 83, riskLevel: "Medium" },
		{ department: "EE", operationalScore: 82, attendanceCompliance: 80, gradingCompliance: 90, documentationScore: 88, policyAdherence: 85, riskLevel: "Low" },
		{ department: "ME", operationalScore: 75, attendanceCompliance: 78, gradingCompliance: 74, documentationScore: 80, policyAdherence: 82, riskLevel: "Medium" },
		{ department: "Civil", operationalScore: 70, attendanceCompliance: 74, gradingCompliance: 82, documentationScore: 65, policyAdherence: 78, riskLevel: "High" },
		{ department: "Chemical", operationalScore: 77, attendanceCompliance: 76, gradingCompliance: 85, documentationScore: 82, policyAdherence: 75, riskLevel: "Medium" },
	],
	policyViolations: [
		{ id: "VIO-001", type: "Academic Integrity", category: "Student", department: "CSE", description: "Plagiarism detected in 3 mid-term reports (CS401)", severity: "Critical", date: "2026-04-14", status: "Open" },
		{ id: "VIO-002", type: "Workload Violation", category: "Faculty", department: "CSE", description: "Prof. A. Kumar assigned 26 hrs/week, exceeding 24-hr cap", severity: "Medium", date: "2026-04-11", status: "Under Review" },
		{ id: "VIO-003", type: "Conduct Violation", category: "Faculty", department: "Chemical", description: "Dr. Rao missed 6 sessions without approved leave", severity: "High", date: "2026-04-07", status: "Open" },
		{ id: "VIO-004", type: "Safety Protocol", category: "Infrastructure", department: "EE", description: "HV Lab equipment maintenance overdue — safety risk", severity: "Medium", date: "2026-04-08", status: "Open" },
		{ id: "VIO-005", type: "Documentation", category: "Administrative", department: "Civil", description: "4 course files not submitted for semester audit", severity: "Medium", date: "2026-04-10", status: "Under Review" },
		{ id: "VIO-006", type: "Grading Delay", category: "Faculty", department: "ME", description: "Prof. Singh delayed ME201 grading by 72+ hours", severity: "High", date: "2026-04-12", status: "Resolved" },
		{ id: "VIO-007", type: "Attendance Policy", category: "Student", department: "ECE", description: "EC301 class average attendance dropped to 62%", severity: "High", date: "2026-04-13", status: "Open" },
		{ id: "VIO-008", type: "Asset Misuse", category: "Administrative", department: "ME", description: "Lab equipment booked for personal project use", severity: "Low", date: "2026-04-06", status: "Resolved" },
	],
	complianceTrends: [
		{ month: "Nov", operationalHealth: 78, policyCompliance: 85, attendanceCompliance: 80 },
		{ month: "Dec", operationalHealth: 81, policyCompliance: 87, attendanceCompliance: 82 },
		{ month: "Jan", operationalHealth: 80, policyCompliance: 88, attendanceCompliance: 81 },
		{ month: "Feb", operationalHealth: 83, policyCompliance: 90, attendanceCompliance: 83 },
		{ month: "Mar", operationalHealth: 85, policyCompliance: 91, attendanceCompliance: 84 },
		{ month: "Apr", operationalHealth: 84, policyCompliance: 91, attendanceCompliance: 83 },
	],
	violationBreakdown: [
		{ type: "Academic Integrity", count: 3, color: "#ef4444" },
		{ type: "Faculty Conduct", count: 2, color: "#f97316" },
		{ type: "Grading Delay", count: 1, color: "#eab308" },
		{ type: "Documentation", count: 1, color: "#3b82f6" },
		{ type: "Safety Protocol", count: 1, color: "#8b5cf6" },
	],
	misReports: [
		{ id: "RPT-001", name: "Monthly Operations Report", description: "Department-wise operational health, compliance scores and KPIs", category: "Operations", format: "PDF" },
		{ id: "RPT-002", name: "Faculty Performance Summary", description: "Attendance, grading timeliness and teaching load compliance", category: "Faculty", format: "Excel" },
		{ id: "RPT-003", name: "Student Compliance Report", description: "Attendance breaches, academic integrity flags and at-risk students", category: "Student", format: "PDF" },
		{ id: "RPT-004", name: "Policy Violations Log", description: "Full audit trail of all violations, resolutions and escalations", category: "Governance", format: "PDF" },
		{ id: "RPT-005", name: "Infrastructure Safety Audit", description: "Lab safety, equipment maintenance, and hazard compliance report", category: "Infrastructure", format: "PDF" },
		{ id: "RPT-006", name: "Academic Integrity Summary", description: "Plagiarism cases, examination violations and outcomes", category: "Academic", format: "Excel" },
	],
};

export const MOCK_ADVANCED_ANALYTICS_DATA = {
	summary: {
		totalFaculty: 85,
		totalStudents: 1420,
		avgFacultyRating: 4.2,
		avgStudentGpa: 7.8,
		overallAttendance: 82.5,
		atRiskStudents: 38,
		researchPapers: 124,
		activeProjects: 32,
		courseSatisfaction: 86,
		placementRate: 84.2,
	},

	// ── FACULTY ANALYTICS ──
	facultyPerformance: [
		{ id: "FAC-001", name: "Dr. Rajesh Kumar", department: "CSE", designation: "Professor", teachingScore: 4.6, researchScore: 92, coursesHandled: 4, publicationsThisYear: 6, citations: 245, hIndex: 14, avgAttendancePct: 94, menteesCount: 12, leavesTaken: 4, workloadHrs: 42, feedbackRating: 4.7, trend: "up" },
		{ id: "FAC-002", name: "Dr. Sneha Patel", department: "CSE", designation: "Associate Professor", teachingScore: 4.8, researchScore: 88, coursesHandled: 3, publicationsThisYear: 4, citations: 180, hIndex: 11, avgAttendancePct: 96, menteesCount: 15, leavesTaken: 2, workloadHrs: 38, feedbackRating: 4.9, trend: "up" },
		{ id: "FAC-003", name: "Dr. Anil Verma", department: "ECE", designation: "Professor", teachingScore: 4.1, researchScore: 95, coursesHandled: 3, publicationsThisYear: 8, citations: 320, hIndex: 18, avgAttendancePct: 88, menteesCount: 10, leavesTaken: 6, workloadHrs: 45, feedbackRating: 4.2, trend: "stable" },
		{ id: "FAC-004", name: "Dr. Meera Nair", department: "EE", designation: "Assistant Professor", teachingScore: 4.4, researchScore: 72, coursesHandled: 5, publicationsThisYear: 2, citations: 65, hIndex: 6, avgAttendancePct: 92, menteesCount: 18, leavesTaken: 3, workloadHrs: 44, feedbackRating: 4.5, trend: "up" },
		{ id: "FAC-005", name: "Dr. Vikram Singh", department: "ME", designation: "Professor", teachingScore: 3.8, researchScore: 80, coursesHandled: 3, publicationsThisYear: 3, citations: 150, hIndex: 10, avgAttendancePct: 85, menteesCount: 8, leavesTaken: 8, workloadHrs: 36, feedbackRating: 3.9, trend: "down" },
		{ id: "FAC-006", name: "Dr. Priya Reddy", department: "CSE", designation: "Associate Professor", teachingScore: 4.5, researchScore: 85, coursesHandled: 4, publicationsThisYear: 5, citations: 200, hIndex: 12, avgAttendancePct: 91, menteesCount: 14, leavesTaken: 3, workloadHrs: 40, feedbackRating: 4.6, trend: "up" },
		{ id: "FAC-007", name: "Dr. Suresh Joshi", department: "Civil", designation: "Assistant Professor", teachingScore: 3.5, researchScore: 60, coursesHandled: 4, publicationsThisYear: 1, citations: 30, hIndex: 4, avgAttendancePct: 80, menteesCount: 20, leavesTaken: 10, workloadHrs: 46, feedbackRating: 3.4, trend: "down" },
		{ id: "FAC-008", name: "Dr. Kavitha Rao", department: "Chemical", designation: "Associate Professor", teachingScore: 4.3, researchScore: 78, coursesHandled: 3, publicationsThisYear: 3, citations: 110, hIndex: 8, avgAttendancePct: 90, menteesCount: 11, leavesTaken: 5, workloadHrs: 39, feedbackRating: 4.4, trend: "stable" },
	],

	facultyByDepartment: [
		{ department: "CSE", count: 22, avgTeachingScore: 4.5, avgResearchScore: 88, avgWorkloadHrs: 40, publications: 42, avgFeedback: 4.6 },
		{ department: "ECE", count: 16, avgTeachingScore: 4.1, avgResearchScore: 82, avgWorkloadHrs: 42, publications: 28, avgFeedback: 4.2 },
		{ department: "EE", count: 12, avgTeachingScore: 4.2, avgResearchScore: 75, avgWorkloadHrs: 41, publications: 18, avgFeedback: 4.3 },
		{ department: "ME", count: 14, avgTeachingScore: 3.9, avgResearchScore: 78, avgWorkloadHrs: 38, publications: 16, avgFeedback: 4.0 },
		{ department: "Civil", count: 10, avgTeachingScore: 3.7, avgResearchScore: 65, avgWorkloadHrs: 43, publications: 10, avgFeedback: 3.6 },
		{ department: "Chemical", count: 11, avgTeachingScore: 4.0, avgResearchScore: 70, avgWorkloadHrs: 39, publications: 10, avgFeedback: 3.9 },
	],

	// ── STUDENT ANALYTICS ──
	studentPerformance: [
		{ id: "ST-001", name: "Aarav Patel", department: "CSE", year: "4th", gpa: 9.2, attendancePct: 92, backlogs: 0, libraryVisits: 45, researchProjects: 2, mentorSatisfaction: 4.8, status: "On Track", riskLevel: "low" },
		{ id: "ST-002", name: "Diya Sharma", department: "CSE", year: "4th", gpa: 8.8, attendancePct: 88, backlogs: 0, libraryVisits: 38, researchProjects: 1, mentorSatisfaction: 4.5, status: "On Track", riskLevel: "low" },
		{ id: "ST-003", name: "Rahul Menon", department: "ECE", year: "3rd", gpa: 6.2, attendancePct: 65, backlogs: 3, libraryVisits: 8, researchProjects: 0, mentorSatisfaction: 3.2, status: "At Risk", riskLevel: "high" },
		{ id: "ST-004", name: "Kavya Nair", department: "CSE", year: "3rd", gpa: 8.5, attendancePct: 90, backlogs: 0, libraryVisits: 42, researchProjects: 1, mentorSatisfaction: 4.6, status: "On Track", riskLevel: "low" },
		{ id: "ST-005", name: "Ishaan Reddy", department: "ECE", year: "4th", gpa: 7.8, attendancePct: 82, backlogs: 1, libraryVisits: 22, researchProjects: 1, mentorSatisfaction: 4.0, status: "Monitor", riskLevel: "medium" },
		{ id: "ST-006", name: "Ananya Singh", department: "EE", year: "2nd", gpa: 5.8, attendancePct: 58, backlogs: 4, libraryVisits: 5, researchProjects: 0, mentorSatisfaction: 2.8, status: "At Risk", riskLevel: "high" },
		{ id: "ST-007", name: "Vivek Kumar", department: "ME", year: "3rd", gpa: 7.2, attendancePct: 78, backlogs: 1, libraryVisits: 15, researchProjects: 0, mentorSatisfaction: 3.8, status: "Monitor", riskLevel: "medium" },
		{ id: "ST-008", name: "Neha Joshi", department: "Civil", year: "4th", gpa: 8.0, attendancePct: 85, backlogs: 0, libraryVisits: 30, researchProjects: 1, mentorSatisfaction: 4.2, status: "On Track", riskLevel: "low" },
		{ id: "ST-009", name: "Arjun Das", department: "CSE", year: "2nd", gpa: 4.5, attendancePct: 50, backlogs: 6, libraryVisits: 2, researchProjects: 0, mentorSatisfaction: 2.5, status: "At Risk", riskLevel: "high" },
		{ id: "ST-010", name: "Pooja Gupta", department: "Chemical", year: "3rd", gpa: 7.5, attendancePct: 80, backlogs: 0, libraryVisits: 20, researchProjects: 0, mentorSatisfaction: 4.0, status: "On Track", riskLevel: "low" },
	],

	studentsByDepartment: [
		{ department: "CSE", totalStudents: 380, avgGpa: 7.9, avgAttendance: 84, atRisk: 12, backlogs: 28, placementRate: 92  },
		{ department: "ECE", totalStudents: 280, avgGpa: 7.5, avgAttendance: 80, atRisk: 8, backlogs: 22, placementRate: 85 },
		{ department: "EE", totalStudents: 200, avgGpa: 7.2, avgAttendance: 78, atRisk: 6, backlogs: 18, placementRate: 80 },
		{ department: "ME", totalStudents: 240, avgGpa: 7.4, avgAttendance: 81, atRisk: 5, backlogs: 15, placementRate: 78 },
		{ department: "Civil", totalStudents: 160, avgGpa: 7.0, avgAttendance: 76, atRisk: 4, backlogs: 12, placementRate: 72 },
		{ department: "Chemical", totalStudents: 160, avgGpa: 7.1, avgAttendance: 77, atRisk: 3, backlogs: 10, placementRate: 75 },
	],

	// ── ENGAGEMENT METRICS ──
	engagementMetrics: {
		libraryUsage: [
			{ month: "Jan", visits: 1200, booksIssued: 340 },
			{ month: "Feb", visits: 1350, booksIssued: 380 },
			{ month: "Mar", visits: 1100, booksIssued: 310 },
			{ month: "Apr", visits: 980, booksIssued: 280 },
		],
		mentoringStats: {
			totalSessions: 480,
			avgSessionsPerStudent: 3.2,
			satisfactionScore: 4.1,
			topConcerns: ["Career Guidance", "Academic Stress", "Internship Help", "Personal Issues"],
			concernDistribution: [38, 28, 22, 12],
		},
		researchParticipation: {
			studentsInResearch: 145,
			facultyWithGrants: 32,
			activeProjects: 48,
			papersPublished: 124,
			conferencesAttended: 67,
		},
		courseCompletion: {
			onTime: 78,
			delayed: 15,
			dropped: 7,
		},
	},

	// ── TRENDS ──
	semesterTrends: [
		{ semester: "Fall 2023", avgGpa: 7.2, avgAttendance: 79, atRiskPct: 8.5, placementPct: 78, facultyRating: 4.0 },
		{ semester: "Spring 2024", avgGpa: 7.4, avgAttendance: 80, atRiskPct: 7.8, placementPct: 80, facultyRating: 4.1 },
		{ semester: "Fall 2024", avgGpa: 7.5, avgAttendance: 81, atRiskPct: 6.2, placementPct: 82, facultyRating: 4.1 },
		{ semester: "Spring 2025", avgGpa: 7.6, avgAttendance: 82, atRiskPct: 5.5, placementPct: 83, facultyRating: 4.2 },
		{ semester: "Fall 2025", avgGpa: 7.8, avgAttendance: 82.5, atRiskPct: 4.8, placementPct: 84.2, facultyRating: 4.2 },
	],

	// ── ATTENDANCE HEATMAP ──
	attendanceHeatmap: {
		departments: ["CSE", "ECE", "EE", "ME", "Civil", "Chemical"],
		years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
		data: [
			[88, 86, 82, 80],
			[85, 82, 78, 76],
			[82, 78, 75, 74],
			[86, 84, 80, 78],
			[80, 76, 73, 71],
			[81, 78, 75, 73],
		],
	},
};

// ========================================================
// DEAN MODULE: Faculty Lifecycle Control
// ========================================================
export const MOCK_FACULTY_LIFECYCLE_DATA = {
	summary: {
		totalFaculty: 85,
		pendingPromotions: 6,
		activeSabbaticals: 3,
		pendingTransfers: 2,
		tenureReviews: 4,
		avgYearsOfService: 8.2,
		retiringSoon: 3,
		newHiresThisYear: 5,
	},
	promotions: [
		{ id: "PROMO-001", facultyId: "FAC-002", name: "Dr. Sneha Patel", department: "CSE", currentDesignation: "Associate Professor", proposedDesignation: "Professor", yearsInRole: 6, teachingScore: 4.8, researchScore: 88, publications: 28, hIndex: 11, recommendedBy: "Dr. Rajesh Kumar (HOD)", status: "Pending", submittedDate: "2026-03-01", reviewDate: "2026-04-20" },
		{ id: "PROMO-002", facultyId: "FAC-004", name: "Dr. Meera Nair", department: "EE", currentDesignation: "Assistant Professor", proposedDesignation: "Associate Professor", yearsInRole: 5, teachingScore: 4.4, researchScore: 72, publications: 14, hIndex: 6, recommendedBy: "Dr. Anand Rao (HOD)", status: "Pending", submittedDate: "2026-02-15", reviewDate: "2026-04-18" },
		{ id: "PROMO-003", facultyId: "FAC-006", name: "Dr. Priya Reddy", department: "CSE", currentDesignation: "Associate Professor", proposedDesignation: "Professor", yearsInRole: 7, teachingScore: 4.5, researchScore: 85, publications: 32, hIndex: 12, recommendedBy: "Dr. Rajesh Kumar (HOD)", status: "Under Review", submittedDate: "2026-01-20", reviewDate: "2026-04-10" },
		{ id: "PROMO-004", facultyId: "FAC-009", name: "Dr. Ramesh Gupta", department: "ME", currentDesignation: "Assistant Professor", proposedDesignation: "Associate Professor", yearsInRole: 4, teachingScore: 4.0, researchScore: 68, publications: 10, hIndex: 5, recommendedBy: "Dr. Vikram Singh (HOD)", status: "Approved", submittedDate: "2025-11-10", reviewDate: "2026-01-15" },
		{ id: "PROMO-005", facultyId: "FAC-010", name: "Dr. Leela Krishnan", department: "ECE", currentDesignation: "Associate Professor", proposedDesignation: "Professor", yearsInRole: 8, teachingScore: 4.3, researchScore: 90, publications: 38, hIndex: 15, recommendedBy: "Dr. Anil Verma (HOD)", status: "Pending", submittedDate: "2026-03-10", reviewDate: "2026-04-25" },
		{ id: "PROMO-006", facultyId: "FAC-011", name: "Dr. Arjun Mehta", department: "Chemical", currentDesignation: "Assistant Professor", proposedDesignation: "Associate Professor", yearsInRole: 5, teachingScore: 4.1, researchScore: 74, publications: 12, hIndex: 7, recommendedBy: "Dr. Kavitha Rao (HOD)", status: "Pending", submittedDate: "2026-03-05", reviewDate: "2026-04-22" },
	],
	sabbaticals: [
		{ id: "SAB-001", facultyId: "FAC-003", name: "Dr. Anil Verma", department: "ECE", designation: "Professor", purpose: "Research at MIT on Quantum Computing", startDate: "2026-07-01", endDate: "2027-01-01", duration: "6 months", status: "Approved", institution: "MIT, USA", fundingSource: "University Grant" },
		{ id: "SAB-002", facultyId: "FAC-012", name: "Dr. Sanjay Iyer", department: "CSE", designation: "Professor", purpose: "AI Research Collaboration with Stanford NLP Group", startDate: "2026-08-01", endDate: "2027-02-01", duration: "6 months", status: "Pending", institution: "Stanford, USA", fundingSource: "Self + Partial University" },
		{ id: "SAB-003", facultyId: "FAC-013", name: "Dr. Nisha Sharma", department: "ME", designation: "Associate Professor", purpose: "Industry Sabbatical at Bosch R&D", startDate: "2026-06-01", endDate: "2026-09-01", duration: "3 months", status: "Active", institution: "Bosch India R&D", fundingSource: "Industry Sponsored" },
	],
	tenureReviews: [
		{ id: "TEN-001", facultyId: "FAC-004", name: "Dr. Meera Nair", department: "EE", joinDate: "2020-07-15", yearsCompleted: 5.7, teachingAvg: 4.4, researchOutput: 14, studentFeedback: 4.5, status: "Due", reviewDate: "2026-05-01" },
		{ id: "TEN-002", facultyId: "FAC-007", name: "Dr. Suresh Joshi", department: "Civil", joinDate: "2019-01-10", yearsCompleted: 7.2, teachingAvg: 3.5, researchOutput: 6, studentFeedback: 3.4, status: "At Risk", reviewDate: "2026-04-30" },
		{ id: "TEN-003", facultyId: "FAC-014", name: "Dr. Pooja Deshpande", department: "ECE", joinDate: "2021-08-01", yearsCompleted: 4.6, teachingAvg: 4.6, researchOutput: 18, studentFeedback: 4.7, status: "Strong", reviewDate: "2026-06-15" },
		{ id: "TEN-004", facultyId: "FAC-015", name: "Dr. Karthik Raman", department: "CSE", joinDate: "2020-01-15", yearsCompleted: 6.2, teachingAvg: 4.2, researchOutput: 22, studentFeedback: 4.3, status: "Due", reviewDate: "2026-05-15" },
	],
	transfers: [
		{ id: "TRF-001", facultyId: "FAC-016", name: "Dr. Anita Bose", fromDept: "EE", toDept: "ECE", reason: "Expertise alignment with IoT research cluster", status: "Pending", requestDate: "2026-03-20", effectiveDate: "2026-07-01" },
		{ id: "TRF-002", facultyId: "FAC-017", name: "Dr. Venkat Rao", fromDept: "ME", toDept: "Civil", reason: "Structural engineering specialization needed", status: "Approved", requestDate: "2026-01-10", effectiveDate: "2026-04-01" },
	],
};

// ========================================================
// DEAN MODULE: Accreditation & Compliance
// ========================================================
export const MOCK_ACCREDITATION_DATA = {
	summary: {
		overallCompliance: 87.5,
		activeAccreditations: 3,
		upcomingAudits: 2,
		criteriaMet: 42,
		criteriaTotal: 48,
		lastAuditDate: "2025-06-15",
		nextAuditDate: "2026-09-01",
		documentationComplete: 92,
	},
	accreditations: [
		{ id: "ACC-001", body: "NBA", fullName: "National Board of Accreditation", programs: ["B.Tech CSE", "B.Tech ECE", "B.Tech ME"], status: "Accredited", validFrom: "2024-01-01", validUntil: "2027-01-01", overallScore: 850, maxScore: 1000, tier: "Tier 1" },
		{ id: "ACC-002", body: "NAAC", fullName: "National Assessment and Accreditation Council", programs: ["All Programs"], status: "Accredited", validFrom: "2023-06-01", validUntil: "2028-06-01", overallScore: 3.45, maxScore: 4.0, tier: "A+" },
		{ id: "ACC-003", body: "ABET", fullName: "Accreditation Board for Engineering and Technology", programs: ["B.Tech CSE"], status: "In Progress", validFrom: null, validUntil: null, overallScore: null, maxScore: null, tier: "Applying" },
	],
	criteria: [
		{ id: "CR-01", framework: "NBA", name: "Vision, Mission & PEOs", weight: 100, score: 92, status: "Met", compliance: 92 },
		{ id: "CR-02", framework: "NBA", name: "Program Curriculum", weight: 150, score: 135, status: "Met", compliance: 90 },
		{ id: "CR-03", framework: "NBA", name: "Course Outcomes", weight: 150, score: 140, status: "Met", compliance: 93 },
		{ id: "CR-04", framework: "NBA", name: "Students' Performance", weight: 100, score: 82, status: "Met", compliance: 82 },
		{ id: "CR-05", framework: "NBA", name: "Faculty Information", weight: 100, score: 88, status: "Met", compliance: 88 },
		{ id: "CR-06", framework: "NBA", name: "Facilities & Support", weight: 100, score: 90, status: "Met", compliance: 90 },
		{ id: "CR-07", framework: "NBA", name: "Continuous Improvement", weight: 100, score: 78, status: "Partial", compliance: 78 },
		{ id: "CR-08", framework: "NBA", name: "First Year Academics", weight: 50, score: 45, status: "Met", compliance: 90 },
		{ id: "CR-09", framework: "NBA", name: "Student Support", weight: 75, score: 52, status: "Partial", compliance: 69 },
		{ id: "CR-10", framework: "NBA", name: "Governance & Transparency", weight: 75, score: 68, status: "Met", compliance: 91 },
	],
	programOutcomes: [
		{ id: "PO-1", description: "Engineering Knowledge", attainmentPct: 88, target: 70, status: "Achieved" },
		{ id: "PO-2", description: "Problem Analysis", attainmentPct: 82, target: 70, status: "Achieved" },
		{ id: "PO-3", description: "Design & Development", attainmentPct: 75, target: 70, status: "Achieved" },
		{ id: "PO-4", description: "Investigation Skills", attainmentPct: 68, target: 70, status: "At Risk" },
		{ id: "PO-5", description: "Modern Tool Usage", attainmentPct: 85, target: 70, status: "Achieved" },
		{ id: "PO-6", description: "Engineer & Society", attainmentPct: 90, target: 70, status: "Achieved" },
		{ id: "PO-7", description: "Environment & Sustainability", attainmentPct: 72, target: 70, status: "Achieved" },
		{ id: "PO-8", description: "Ethics", attainmentPct: 92, target: 70, status: "Achieved" },
		{ id: "PO-9", description: "Teamwork", attainmentPct: 88, target: 70, status: "Achieved" },
		{ id: "PO-10", description: "Communication", attainmentPct: 80, target: 70, status: "Achieved" },
		{ id: "PO-11", description: "Project Management", attainmentPct: 65, target: 70, status: "At Risk" },
		{ id: "PO-12", description: "Lifelong Learning", attainmentPct: 78, target: 70, status: "Achieved" },
	],
	upcomingAudits: [
		{ id: "AUD-001", body: "NBA", type: "Re-accreditation Visit", date: "2026-09-01", programs: ["B.Tech CSE", "B.Tech ECE"], status: "Preparation", daysRemaining: 138, readinessPct: 72 },
		{ id: "AUD-002", body: "NAAC", type: "Mid-cycle Review", date: "2026-11-15", programs: ["All Programs"], status: "Scheduled", daysRemaining: 213, readinessPct: 45 },
	],
	complianceByDepartment: [
		{ department: "CSE", internshipCompliance: 95, outcomeMapping: 92, documentComplete: 96, facultyQualified: 100, overallPct: 96 },
		{ department: "ECE", internshipCompliance: 88, outcomeMapping: 85, documentComplete: 90, facultyQualified: 94, overallPct: 89 },
		{ department: "EE", internshipCompliance: 82, outcomeMapping: 80, documentComplete: 85, facultyQualified: 92, overallPct: 85 },
		{ department: "ME", internshipCompliance: 85, outcomeMapping: 82, documentComplete: 88, facultyQualified: 93, overallPct: 87 },
		{ department: "Civil", internshipCompliance: 78, outcomeMapping: 72, documentComplete: 80, facultyQualified: 90, overallPct: 80 },
		{ department: "Chemical", internshipCompliance: 80, outcomeMapping: 75, documentComplete: 82, facultyQualified: 91, overallPct: 82 },
	],
};

// Dean Dashboard Data
export const MOCK_DEAN_DASHBOARD_DATA = {
	isAllowedCreateCohort: false,
	is_allowed_create_cohort: false,

	user: {
		fullName: "Dr. Priya Sharma",
		dateOfBirth: "1970-08-10",
		organization: "Mahindra University",
		profile_pic: null,
		gender: "female",
		employeeId: "DEAN-001",
		department: "Office of the Dean",
		designation: "Dean of Academics",
		officeLocation: "Admin Block, Room 101",
		permanentAddress: "10 Academic Avenue, Hyderabad, India",
		currentAddress: "Faculty Housing, Mahindra Campus, Hyderabad, India",
		city: "Hyderabad",
		state: "Telangana",
		pinCode: "500043",
		country: "India",
		mobileNumber: "9000000001",
		officialEmail: "dean@mahindrauniversity.edu.in",
		personalEmail: "priya.sharma@gmail.com",
		linkedinProfile: "https://linkedin.com/in/priya-sharma-dean",
		documents: [],
	},

	todoAssignments: [],
	createdCohorts: [],
	joinedCohorts: [],
};
