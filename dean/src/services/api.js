/**
 * api.js
 * * NOTE: The actions previously defined in this file are now handled by
 * client.js and the various service modules located in src/api.
 * config.js: Configuration constants (API_BASE_URL, USE_MOCK_API)
 * client.js: Generic helper function (apiCall)
 * mocks.js: Mock data store
 * services: API calls (e.g., user.service.js replaces userAPI)
 */

// API service for all backend calls
const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://192.168.1.122:8000/api/v1";

// Mock mode configuration - should match auth.js
const USE_MOCK_API = true;

// Remove hardcoded fallback - use import.meta.env.VITE_API_BASE_URL or API_BASE_URL
console.log('API service - Using API_BASE_URL:', API_BASE_URL);

const SHARED_COHORTS = [
	{
		id: 1,
		cohort_name: "Introduction to Computer Science",
		course_codes: ["CS101", "EE101", "ME101"], // Supports multiple cross-listed codes
		cohort_description:
			"Comprehensive introduction to computer science fundamentals.",
		status: "Live",
		visibility: "Active",
		member_count: 10,
		group_count: 3,
		assignment_count: 6,
		start_date: "2026-01-20T00:00:00Z",
		end_date: "2026-06-15T00:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		is_creator: false,
	},
	{
		id: 2,
		cohort_name: "Data Structures & Algorithms",
		course_codes: ["CS201"],
		cohort_description: "Master essential data structures and algorithms.",
		status: "Live",
		visibility: "Active",
		member_count: 4,
		group_count: 2,
		start_date: "2026-01-15T00:00:00Z",
		end_date: "2026-05-30T00:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		is_creator: false,
	},
	{
		id: 3,
		cohort_name: "Calculus I",
		course_codes: ["MA101", "MATH101"],
		cohort_description: "Limits, derivatives, integrals, and applications.",
		status: "Live",
		visibility: "Active",
		member_count: 5,
		group_count: 2,
		start_date: "2026-01-18T00:00:00Z",
		end_date: "2026-05-20T00:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		is_creator: false,
	},
	{
		id: 4,
		cohort_name: "Database Systems",
		course_codes: ["CS301", "IS301"],
		cohort_description: "Relational databases, SQL, and database design.",
		status: "Live",
		visibility: "Active",
		member_count: 4,
		group_count: 2,
		start_date: "2026-01-20T00:00:00Z",
		end_date: "2026-06-01T00:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		is_creator: false,
	},
];

const DEPARTMENT_MAPPING = {
	"Computer Science": "CS",
	"Electrical Engineering": "EE",
	"Mechanical Engineering": "ME",
	"Information Systems": "IS",
};

const MOCK_TODO_ASSIGNMENTS = [
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

// Mock dashboard data for professor
const MOCK_PROFESSOR_DASHBOARD_DATA = {
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
const MOCK_HOD_DASHBOARD_DATA = {
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
const MOCK_STUDENT_DASHBOARD_DATA = {
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

const MOCK_ARCHIVED_COURSES = [
	{
		id: 105,
		cohort_name: "Introduction to Python",
		course_codes: ["CS101"],
		cohort_description:
			"Comprehensive introduction to Python programming covering basics, data structures, OOP, and file handling. Perfect for beginners looking to start their programming journey.",
		status: "Archived",
		visibility: "Archived",
		member_count: 42,
		group_count: 8,
		start_date: "2025-01-15T00:00:00Z",
		end_date: "2025-05-15T00:00:00Z",
		created_at: "2025-01-01T08:00:00Z",
		is_creator: false, // Indicates if the current user is the course creator
	},
	{
		id: 106,
		cohort_name: "Web Development",
		course_codes: ["CS205"],
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
	},
	{
		id: 107,
		cohort_name: "Computer Networks",
		course_codes: ["CS560"],
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
	},
	{
		id: 108,
		cohort_name: "Machine Learning Basics",
		course_codes: ["CS740"],
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
	},
	{
		id: 109,
		cohort_name: "Operating Systems",
		course_codes: ["CS450"],
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
	},
];

// Detailed assignments for each course
const MOCK_COURSE_ASSIGNMENTS = {
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

const MOCK_RESOURCES = {
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

const MOCK_COURSE_DETAILS = [
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

const MOCK_COURSE_MEMBERS = {
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
const MOCK_OFFICE_HOURS = [
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
const MOCK_SCHEDULED_MEETINGS = [
	{
		id: "SCH001",
		participantName: "Dr. Robert Chen",
		participantRole: "Professor",
		type: "Offline",
		startTime: "2026-03-20T09:00:00Z",
		subject: "Research Collaboration Discussion",
		reason: "Initial discussion successful, following up on proposal.",
		location: "Department Office 402",
		meetingLink: null,
		status: "scheduled",
	},
	{
		id: "SCH002",
		participantName: "Alice Johnson",
		participantRole: "Student",
		type: "Online",
		subject: "Office Hours: Recursion & DP",
		reason: "Follow up on recursion project.",
		startTime: "2026-03-21T14:30:00Z",
		location: "Virtual Meeting",
		meetingLink: "https://meet.google.com/abc-defg-hij",
		status: "scheduled",
	},
];
const MOCK_MEETING_REQUESTS = {
	// Outgoing requests sent by the Faculty/User
	outgoing: [
		{
			id: "REQ-PROF001-101",
			participantName: "Dr. Robert Chen",
			participantDepartment: "Computer Science",
			participantRole: "Professor",
			type: "Online",
			category: "Academic", // Regular collaboration
			subject: "Research Collaboration Discussion",
			requestedTime: "2026-03-18T09:00:00Z",
			reason: "Would like to discuss a potential collaboration on the blockchain research project and explore joint publication opportunities.",
			status: "pending",
			createdAt: "2026-03-05T10:00:00Z",
		},
		{
			id: "REQ-PROF001-102",
			participantName: "Prof. Alan Turing",
			participantDepartment: "Cybersecurity",
			participantRole: "HOD",
			type: "Offline",
			category: "Academic",
			subject: "Curriculum Review Meeting",
			requestedTime: "2026-03-10T11:00:00Z",
			reason: "Discuss proposed changes to the advanced algorithms syllabus for next semester to align with industry requirements.",
			status: "rejected",
			rejectionReason:
				"Currently unavailable due to ongoing accreditation review. Please reschedule for April.",
			createdAt: "2026-03-01T09:00:00Z",
		},
		{
			id: "REQ-PROF001-103",
			participantName: "Dr. Robert Chen",
			participantDepartment: "Computer Science",
			participantRole: "Professor",
			type: "Offline",
			category: "Academic",
			subject: "Research Collaboration Discussion",
			requestedTime: "2026-03-20T09:00:00Z",
			reason: "Initial discussion successful, following up on proposal.",
			status: "accepted",
			createdAt: "2026-03-05T10:00:00Z",
		},
	],
	// Incoming requests received from students
	incoming: [
		{
			id: "MTG-ST11002-201",
			participantName: "Alice Johnson",
			participantId: "ST21BTECH11002",
			participantDepartment: "Computer Science",
			participantRole: "Student",
			type: "Offline",
			category: "Academic",
			subject: "Office Hours: Recursion & DP",
			requestedTime: "2026-03-12T10:00:00Z",
			reason: "Need help understanding recursion and dynamic programming concepts covered in last week's lecture.",
			status: "pending",
			submittedAt: "2026-03-06T09:00:00Z",
		},
		{
			id: "MTG-ST11003-202",
			participantName: "Charlie Lee",
			participantId: "ST21BTECH11003",
			participantDepartment: "Computer Science",
			participantRole: "Student",
			type: "Online",
			category: "Academic",
			subject: "Assignment Clarification",
			requestedTime: "2026-03-13T14:00:00Z",
			reason: "Clarification needed on the upcoming assignment requirements for the graph algorithms project.",
			status: "pending",
			submittedAt: "2026-03-06T10:30:00Z",
		},
		{
			id: "MTG-ST11004-203",
			participantName: "David Kim",
			participantId: "ST21BTECH11004",
			participantDepartment: "Computer Science",
			participantRole: "Student",
			type: "Offline",
			category: "Academic",
			subject: "Mid-term Performance Review",
			requestedTime: "2026-03-14T11:00:00Z",
			reason: "Would like to discuss my mid-term performance and get guidance on areas to improve before the final exam.",
			status: "pending",
			submittedAt: "2026-03-05T14:00:00Z",
		},
		{
			id: "MTG-ST11002-204",
			participantName: "Alice Johnson",
			participantId: "ST21BTECH11002",
			participantDepartment: "Computer Science",
			participantRole: "Student",
			type: "Offline",
			category: "Academic",
			subject: "Office Hours: Recursion & DP",
			requestedTime: "2026-03-21T14:30:00Z",
			reason: "Follow up on recursion project.",
			status: "accepted",
			submittedAt: "2026-03-06T09:00:00Z",
		},
		{
			id: "MTG-ST11001-205",
			participantName: "John Doe",
			participantId: "ST21BTECH11001",
			participantDepartment: "Computer Science",
			participantRole: "Student",
			type: "Online",
			category: "Mentoring", // Professional/Career guidance session
			subject: "Internship & Recommendations",
			requestedTime: "2026-03-25T16:00:00Z",
			reason: "Inquiry regarding summer internship opportunities and recommendation letters.",
			status: "pending",
			submittedAt: "2026-03-24T11:00:00Z",
		},
	],
};

// Session Planning
const MOCK_REFLECTIONS = [
	{
		id: "ref_101",
		classId: "SEC001", // Data Structures
		courseName: "Data Structures",
		batchSection: "CSE-A",
		semester: 3,
		whatWasTaught: "Introduction to Linked Lists and pointer manipulation.",
		needsImprovement: "Visualizing node deletion needs more board work.",
		topicsCarriedForward: "Doubly Linked Lists.",
		personalNotes:
			"Students asked a lot of questions about memory allocation.",
		visibleToHOD: true,
		date: "2026-03-16T09:00:00.000Z",
		status: "Submitted",
	},
	{
		id: "ref_102",
		classId: "SEC001", // Data Structures
		courseName: "Data Structures",
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
];
const MOCK_COURSE_DOCUMENTS = {
	SEC001: {
		courseOutline: {
			version: 1,
			uploadDate: "2026-01-10",
			hodApproved: true,
			status: "Approved",
			hodComments: "Verified and Approved.",
			fileName: "outline_cs201.pdf",
			fileLink: "https://example.com/docs/outline_cs201.pdf",
		},
		timeline: {
			version: 1,
			uploadDate: "2026-01-12",
			hodApproved: false,
			status: "Rejected",
			hodComments: "Please include the holiday schedule for March.",
			fileName: "timeline_v1.xlsx",
			fileLink: "https://example.com/docs/timeline_v1.xlsx",
		},
	},
	SEC002: {
		courseOutline: {
			version: 2,
			uploadDate: "2026-02-03",
			hodApproved: false,
			status: "Pending",
			hodComments: "",
			fileName: "outline_cs401.pdf",
			fileLink: "https://example.com/docs/outline_cs401.pdf",
		},
		assessmentPlan: {
			version: 1,
			uploadDate: "2026-02-05",
			hodApproved: true,
			status: "Approved",
			hodComments: "Alignment looks good.",
			fileName: "assess_plan.docx",
			fileLink: "https://example.com/docs/assess_plan.docx",
		},
	},
};

// Schedule & Meetings, Session Planning
const MOCK_COURSE_SCHEDULE = [
	{
		id: "SEC001",
		courseName: "Data Structures",
		startDate: "2026-01-10",
		endDate: "2026-06-30",
		courseCodes: ["CS301", "IT301"],
		courseType: "Theory",
		status: "Ongoing",
		schedule: [
			{
				day: "Monday",
				startTime: "9:00 AM",
				endTime: "10:00 AM",
				courseCode: "CS301",
				roomNumber: "B204",
				buildingName: "Block B",
				batchSection: "CSE-A",
				branch: "CSE",
				semester: 3,
			},
			{
				day: "Monday",
				startTime: "11:00 AM",
				endTime: "12:00 PM",
				courseCode: "CS301",
				roomNumber: "B205",
				buildingName: "Block B",
				batchSection: "CSE-B",
				branch: "CSE",
				semester: 3,
			},
			{
				day: "Wednesday",
				startTime: "10:00 AM",
				endTime: "11:00 AM",
				courseCode: "CS301",
				roomNumber: "A101",
				buildingName: "Block A",
				batchSection: "CSE-C",
				branch: "CSE",
				semester: 3,
			},
			{
				day: "Friday",
				startTime: "9:00 AM",
				endTime: "10:00 AM",
				courseCode: "IT301",
				roomNumber: "C302",
				buildingName: "Block C",
				batchSection: "IT-A",
				branch: "IT",
				semester: 3,
			},
		],
	},
	{
		id: "SEC002",
		courseName: "Database Management Systems",
		startDate: "2026-01-15",
		endDate: "2026-06-20",
		courseCodes: ["CS505", "IT505"],
		courseType: "Theory",
		status: "Ongoing",
		schedule: [
			{
				day: "Tuesday",
				startTime: "12:00 PM",
				endTime: "1:00 PM",
				courseCode: "CS505",
				roomNumber: "C101",
				buildingName: "Block C",
				batchSection: "CSE-B",
				branch: "CSE",
				semester: 5,
			},
			{
				day: "Thursday",
				startTime: "2:00 PM",
				endTime: "3:00 PM",
				courseCode: "IT505",
				roomNumber: "D205",
				buildingName: "Block D",
				batchSection: "IT-A",
				branch: "IT",
				semester: 5,
			},
			{
				day: "Thursday",
				startTime: "4:00 PM",
				endTime: "5:00 PM",
				courseCode: "IT505",
				roomNumber: "D206",
				buildingName: "Block D",
				batchSection: "IT-B",
				branch: "IT",
				semester: 5,
			},
		],
	},
	{
		id: "SEC003",
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
			{
				day: "Monday",
				startTime: "10:00 AM",
				endTime: "12:00 PM",
				courseCode: "CS502L",
				roomNumber: "Lab 2",
				buildingName: "Lab Block",
				batchSection: "CSE-B",
				branch: "CSE",
				semester: 5,
			},
			{
				day: "Friday",
				startTime: "2:00 PM",
				endTime: "4:00 PM",
				courseCode: "CS502L",
				roomNumber: "Lab 3",
				buildingName: "Lab Block",
				batchSection: "CSE-C",
				branch: "CSE",
				semester: 5,
			},
		],
	},
	{
		id: "SEC004",
		courseName: "Software Engineering",
		startDate: "2026-01-20",
		endDate: "2026-06-15",
		courseCodes: ["CS701"],
		courseType: "Seminar",
		status: "Ongoing",
		schedule: [
			{
				day: "Wednesday",
				startTime: "9:00 AM",
				endTime: "10:30 AM",
				courseCode: "CS701",
				roomNumber: "SEM-02",
				buildingName: "Admin Block",
				batchSection: "CSE-A",
				branch: "CSE",
				semester: 7,
			},
			{
				day: "Friday",
				startTime: "10:30 AM",
				endTime: "12:00 PM",
				courseCode: "CS701",
				roomNumber: "SEM-01",
				buildingName: "Admin Block",
				batchSection: "ECE-A",
				branch: "ECE",
				semester: 7,
			},
		],
	},
	{
		id: "SEC005",
		courseName: "Engineering Mathematics",
		startDate: "2026-01-10",
		endDate: "2026-06-30",
		courseCodes: ["CS301", "IT301", "EC301"],
		courseType: "Theory",
		status: "Ongoing",
		schedule: [
			{
				day: "Monday",
				startTime: "8:00 AM",
				endTime: "9:00 AM",
				courseCode: "CS301",
				roomNumber: "LH-01",
				buildingName: "Lecture Hall",
				batchSection: "CSE-A+B",
				branch: "CSE",
				semester: 3,
			},
			{
				day: "Monday",
				startTime: "3:00 PM",
				endTime: "4:00 PM",
				courseCode: "CS301",
				roomNumber: "LH-02",
				buildingName: "Lecture Hall",
				batchSection: "ECE-A",
				branch: "ECE",
				semester: 3,
			},
			{
				day: "Tuesday",
				startTime: "9:00 AM",
				endTime: "10:00 AM",
				courseCode: "IT301",
				roomNumber: "LH-02",
				buildingName: "Lecture Hall",
				batchSection: "IT-A+B",
				branch: "IT",
				semester: 3,
			},
			{
				day: "Thursday",
				startTime: "11:00 AM",
				endTime: "12:00 PM",
				courseCode: "EC301",
				roomNumber: "LH-01",
				buildingName: "Lecture Hall",
				batchSection: "ECE-B",
				branch: "ECE",
				semester: 3,
			},
		],
	},
	{
		id: "SEC006",
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
			{
				day: "Wednesday",
				startTime: "3:00 PM",
				endTime: "4:00 PM",
				courseCode: "EC501",
				roomNumber: "E201",
				buildingName: "ECE Block",
				batchSection: "ECE-A",
				branch: "ECE",
				semester: 5,
			},
			{
				day: "Wednesday",
				startTime: "4:00 PM",
				endTime: "5:00 PM",
				courseCode: "EC501",
				roomNumber: "E202",
				buildingName: "ECE Block",
				batchSection: "ECE-C",
				branch: "ECE",
				semester: 5,
			},
			{
				day: "Friday",
				startTime: "2:00 PM",
				endTime: "3:00 PM",
				courseCode: "EC501",
				roomNumber: "B102",
				buildingName: "Block B",
				batchSection: "ECE-D",
				branch: "ECE",
				semester: 5,
			},
		],
	},
	{
		id: "SEC007",
		courseName: "Introduction to Programming",
		startDate: "2025-07-01",
		endDate: "2025-12-15",
		courseCodes: ["CS101"],
		courseType: "Theory",
		status: "Completed",
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
];

// Library
const MOCK_LIBRARY_DATA = {
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
			borrowedDate: "2026-03-01",
			dueDate: "2026-03-30",
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
const MOCK_MAINTENANCE_DATA = {
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
const MOCK_MENTORING_DATA = [
	{
		studentId: "ST21BTECH11001",
		name: "John Doe",
		department: "Computer Science",
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
				discussionSummary:
					"Discussed career goals and interest in Machine Learning.",
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
				overallRemarks:
					"John is highly motivated. Consistently performs above average.",
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
				requestReason:
					"Inquiry regarding summer internship opportunities and recommendation letters.",
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
				discussionSummary:
					"Addressal of declining attendance. Alice cited difficulty managing time.",
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
				overallRemarks:
					"Critical intervention needed. Recovery schedule mapped.",
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
				supportingDocs: [],
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
				supportingDocs: [],
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
			signedDocument: {
				name: "LOR_AliceJohnson_Draft.docx",
				url: "/docs/alicejohnson_lor.pdf",
			},
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
			signedDocument: {
				name: "LOR_ElenaRodriguez_Final.pdf",
				url: "/docs/elenarodriguez_projects.pdf",
			},
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
const MOCK_ASSETS_LIST = [
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
];
const MOCK_ASSET_REQUESTS = {
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
			startTime: "04:00",
			endTime: "06:00",
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
const MOCK_ATTENDANCE_DATA = {
	1: {
		// Introduction to Computer Science
		students: [
			{
				id: 1,
				name: "John Doe",
				rollNumber: "ST21BTECH11001",
				department: "Computer Science",
				isYou: true,
			},
			{
				id: 2,
				name: "Alice Johnson",
				rollNumber: "ST21BTECH11002",
				department: "Computer Science",
				isYou: false,
			},
			{
				id: 3,
				name: "Charlie Lee",
				rollNumber: "ST21BTECH11003",
				department: "Computer Science",
				isYou: false,
			},
			{
				id: 4,
				name: "David Kim",
				rollNumber: "ST21BTECH11004",
				department: "Electrical Engineering",
				isYou: false,
			},
			{
				id: 5,
				name: "Eva Green",
				rollNumber: "ST21BTECH11005",
				department: "Electrical Engineering",
				isYou: false,
			},
			{
				id: 6,
				name: "Frank Hall",
				rollNumber: "ST21BTECH11006",
				department: "Electrical Engineering",
				isYou: false,
			},
			{
				id: 7,
				name: "Grace Miller",
				rollNumber: "ST21BTECH11007",
				department: "Mechanical Engineering",
				isYou: false,
			},
			{
				id: 8,
				name: "Hannah Scott",
				rollNumber: "ST21BTECH11008",
				department: "Mechanical Engineering",
				isYou: false,
			},
			{
				id: 9,
				name: "Ian Turner",
				rollNumber: "ST21BTECH11009",
				department: "Mechanical Engineering",
				isYou: false,
			},
			{
				id: 10,
				name: "Julia Wang",
				rollNumber: "ST21BTECH11010",
				department: "Computer Science",
				isYou: false,
			},
		],
		logs: {
			"2026-02-12": [1, 2, 4],
			"2026-02-13": [1, 3, 4, 5],
			"2026-02-14": [1, 2, 3, 4, 5],
		},
		finalizedDates: [],
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
		logs: {
			"2026-02-10": [1, 6],
			"2026-02-12": [1, 6, 7, 8],
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
		logs: {
			"2026-02-11": [1, 10, 12, 13, 14],
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
		logs: {
			"2026-02-12": [1, 17, 18],
		},
		finalizedDates: [],
	},
};
const MOCK_PROFESSOR_LOGS = [
	{
		id: "LOG_001",
		date: "2026-01-28",
		checkIn: "08:45 AM",
		checkOut: "04:30 PM",
		location: "Block A - Entrance",
		totalHours: "7h 45m",
	},
	{
		id: "LOG_002",
		date: "2026-01-29",
		checkIn: "09:00 AM",
		checkOut: "05:15 PM",
		location: "Block A - Entrance",
		totalHours: "8h 15m",
	},
	{
		id: "LOG_003",
		date: "2026-01-30",
		checkIn: "08:30 AM",
		checkOut: "04:00 PM",
		location: "Block B - Main",
		totalHours: "7h 30m",
	},
	{
		id: "LOG_004",
		date: "2026-01-31",
		checkIn: "09:15 AM",
		checkOut: "06:00 PM",
		location: "Admin Block",
		totalHours: "8h 45m",
	},
	{
		id: "LOG_005",
		date: "2026-02-12",
		checkIn: "08:50 AM",
		checkOut: "04:50 PM",
		location: "Block A - Entrance",
		totalHours: "8h 00m",
	},
	{
		id: "LOG_006",
		date: "2026-02-13",
		checkIn: "08:55 AM",
		checkOut: "05:00 PM",
		location: "Block A - Entrance",
		totalHours: "8h 05m",
	},
	{
		id: "LOG_007",
		date: "2026-02-14",
		checkIn: "09:10 AM",
		checkOut: "04:30 PM",
		location: "Science Lab",
		totalHours: "7h 20m",
	},
	{
		id: "LOG_008",
		date: "2026-02-15",
		checkIn: "08:30 AM",
		checkOut: "05:30 PM",
		location: "Block B - Main",
		totalHours: "9h 00m",
	},
	{
		id: "LOG_009",
		date: "2026-02-16",
		checkIn: "08:45 AM",
		checkOut: "04:15 PM",
		location: "Block A - Entrance",
		totalHours: "7h 30m",
	},
	{
		id: "LOG_010",
		date: "2026-02-17",
		checkIn: "09:00 AM",
		checkOut: "05:00 PM",
		location: "Admin Block",
		totalHours: "8h 00m",
	},
];

// Finance Management
const MOCK_EXPENSES = {
	financeAdmins: [
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
				"Invalid receipt format. Please upload the official PDF confirmation instead of a screenshot.",
		},
	],
};
const MOCK_ADVANCES = {
	advanceAdmins: [
		{
			name: "Finance Office",
			email: "finance-claims@university.edu",
			phone: "+91 99999 88888",
		},
		{
			name: "Treasury Department",
			email: "treasury@university.edu",
			phone: "+91 99999 44444",
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
const MOCK_EXAM_DATA = [
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
			hod: {
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
			hod: { status: "APPROVED", remark: "Duty exemption granted." },
		},
	},
];

// Leave Application
const MOCK_LEAVE_APPLICATIONS = {
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
			courseName: "Introduction to Programming",
			roomNumber: "LH-101",
			timings: {
				startTime: "09:00",
				endTime: "10:30",
			},
			note: "Please ask the students to continue with the 5th program.",
			reason: "Severe viral fever and flu symptoms",
			replacementFaculty: "Dr. Sarah Williams",
			substitutionStatus: "Accepted",
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
			courseName: "Machine Learning (B.Tech)",
			roomNumber: "LAB-202",
			timings: {
				startTime: "11:00",
				endTime: "12:30",
			},
			note: "Please ask the students to continue with the 5th program.",
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
			courseName: "Introduction to Computer Science",
			roomNumber: "LAB-105",
			timings: {
				startTime: "14:00",
				endTime: "16:00",
			},
			note: "Please ask the students to continue with the 5th program.",
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
			courseName: "Software Engineering",
			roomNumber: "LH-304",
			timings: {
				startTime: "10:00",
				endTime: "11:30",
			},
			note: "Please ask the students to continue with the 5th program.",
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

// Payroll
const MOCK_PAYROLL = {
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
const MOCK_BULLETINS = [
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
	},
	{
		id: 2,
		title: "New Research Grant Opportunities",
		content:
			"The Computer Science department has announced three new research grants for senior students focusing on AI and Sustainability. Application deadline is March 15th.",
		level: "department",
		department: "Computer Science",
		priority: "Normal",
		author: "Dr. Alice Smith",
		createdAt: "2026-02-19T14:30:00Z",
		attachments: [
			{ name: "grant_guidelines.docx", url: "#", size: "450KB" },
		],
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
	},
	{
		id: 4,
		title: "Guest Lecture: Future of Quantum Computing",
		content:
			"The Physics department invites all 3rd and 4th-year students to a guest lecture by Dr. Robert Penner from NASA.",
		level: "department",
		department: "Physics",
		priority: "High",
		author: "HOD Physics",
		createdAt: "2026-02-10T12:00:00Z",
		attachments: [
			{ name: "lecture_invite.pdf", url: "#", size: "2.1MB" },
			{ name: "speaker_bio.txt", url: "#", size: "15KB" },
		],
	},
	{
		id: 5,
		title: "Emergency Fire Drill",
		content:
			"A mandatory fire drill will take place tomorrow at 11:30 AM. Please evacuate the building immediately when the alarm sounds.",
		level: "institution",
		priority: "Urgent",
		author: "Campus Safety",
		createdAt: "2026-02-21T11:00:00Z",
		attachments: [{ name: "evacuation_map.jpg", url: "#", size: "3.5MB" }],
	},
	{
		id: 6,
		title: "Workshop: UI/UX Trends 2026",
		content:
			"Join us for a hands-on workshop on modern design systems and prototyping using Figma's newest features.",
		level: "department",
		department: "Information Technology",
		priority: "Normal",
		author: "IT Club",
		createdAt: "2026-02-18T09:15:00Z",
		attachments: [{ name: "workshop_agenda.pdf", url: "#", size: "500KB" }],
	},
];

// Research & Publications
const MOCK_RESEARCH_PROJECTS = [
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
		fundingDetails: "NSF Grant #4452 - $50,000",
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
const MOCK_PUBLICATIONS = [
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
const MOCK_USERS = [
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
const MOCK_USER_RESEARCH_APPLICATIONS = [
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

// Use IPv4 address for network access
// Removed hardcoded FINAL_API_BASE_URL - now using environment-aware API_BASE_URL

// Generic API call helper
const apiCall = async (endpoint, options = {}) => {
	// Mock API responses
	if (USE_MOCK_API) {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 300));

		// --- USER / SETTINGS ---
		if (endpoint.match(/^\/user\//)) {
			const method = options?.method || "GET";
			const userRole = localStorage.getItem("userRole") || "professor";
			const targetData =
				userRole === "hod"
					? MOCK_HOD_DASHBOARD_DATA
					: userRole === "professor"
						? MOCK_PROFESSOR_DASHBOARD_DATA
						: MOCK_STUDENT_DASHBOARD_DATA;

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
					MOCK_PROFESSOR_DASHBOARD_DATA.user.name.toLowerCase() ===
						username.toLowerCase() ||
					MOCK_STUDENT_DASHBOARD_DATA.user.name.toLowerCase() ===
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
				data: MOCK_ARCHIVED_COURSES,
			};
		}
		// Handle CHECK AND ARCHIVE EXPIRED courses
		if (endpoint === "/cohort/check-expired" && options.method === "POST") {
			console.log("🕐 [MOCK API] Checking for expired courses...");

			const now = new Date();
			let archivedCount = 0;

			// Check in SHARED_COHORTS
			SHARED_COHORTS.forEach((cohort) => {
				if (cohort.end_date && cohort.status !== "Archived") {
					const endDate = new Date(cohort.end_date);
					if (endDate < now) {
						console.log(
							`📦 [MOCK API] Auto-archiving expired course: ${cohort.cohort_name}`,
						);
						cohort.status = "Archived";
						cohort.visibility = "Archived";

						// Move to archived courses
						MOCK_ARCHIVED_COURSES.push({ ...cohort });
						archivedCount++;
					}
				}
			});

			// Check in dashboard data
			const userRole = localStorage.getItem("userRole");
			const dashboardData =
				userRole === "professor"
					? MOCK_PROFESSOR_DASHBOARD_DATA
					: MOCK_STUDENT_DASHBOARD_DATA;

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
				MOCK_ARCHIVED_COURSES.push({ ...cohort });
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
				MOCK_ARCHIVED_COURSES.push({ ...cohort });
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
			const courseInShared = SHARED_COHORTS.find(
				(c) => c.id === courseId,
			);
			if (courseInShared) {
				courseInShared.status = "Archived";
				courseInShared.visibility = "Archived";
			}

			// Move from active to archived in dashboard data
			const userRole = localStorage.getItem("userRole");
			const dashboardData =
				userRole === "professor"
					? MOCK_PROFESSOR_DASHBOARD_DATA
					: MOCK_STUDENT_DASHBOARD_DATA;

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
				MOCK_ARCHIVED_COURSES.push(archivedCourse);

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
				MOCK_ARCHIVED_COURSES.push(archivedCourse);

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
			const userRole = localStorage.getItem("userRole");
			const isAdmin = userRole === "professor";

			// Get current user ID to check group membership
			const authUserStr = localStorage.getItem("authUser");
			const authUser = authUserStr ? JSON.parse(authUserStr) : null;
			const currentUserId = authUser?.id || 1;

			const courseDetails = MOCK_COURSE_DETAILS.find(
				(c) => c.id === courseId,
			);
			if (courseDetails) {
				// Calculate assignment stats from MOCK_COURSE_ASSIGNMENTS
				const courseAssignments =
					MOCK_COURSE_ASSIGNMENTS[courseId] || [];
				const totalAssignments = courseAssignments.length;
				const memberCount = courseDetails.memberCount || 45;
				const groupCount = courseDetails.groupCount || 0;

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
					const courseMemberData = MOCK_COURSE_MEMBERS[courseId];
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
						...courseDetails,
						is_admin: isAdmin,
						user_type: isAdmin ? 1 : 0,
						pending_assignments: pendingAssignments,
						completed_assignments: completedAssignments,
						total_assignments: totalAssignments,
						group_name: groupName,
						is_group_leader: isGroupLeader,
					},
				};
			}

			// Map course IDs from dashboard mock data
			const currentDashboardData =
				userRole === "professor"
					? MOCK_PROFESSOR_DASHBOARD_DATA
					: MOCK_STUDENT_DASHBOARD_DATA;

			const dashboardCourse = [
				...currentDashboardData.createdCohorts,
				...currentDashboardData.joinedCohorts,
			].find((c) => c.id === courseId);

			if (dashboardCourse) {
				// Calculate assignment stats from MOCK_COURSE_ASSIGNMENTS
				const courseAssignments =
					MOCK_COURSE_ASSIGNMENTS[courseId] || [];
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
					const courseMemberData = MOCK_COURSE_MEMBERS[courseId];
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
			const courseAssignments = MOCK_COURSE_ASSIGNMENTS[courseId] || [];
			const totalAssignments = courseAssignments.length;
			// Get actual counts from MOCK_COURSE_MEMBERS or use defaults
			const courseMembers = MOCK_COURSE_MEMBERS[courseId];
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
				const courseMemberData = MOCK_COURSE_MEMBERS[courseId];
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

			const courseMemberData = MOCK_COURSE_MEMBERS[courseId];
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
		if (endpoint.match(/^\/cohort\/(\d+)\/assignments$/)) {
			const courseId = parseInt(
				endpoint.match(/^\/cohort\/(\d+)\/assignments$/)[1],
			);

			const courseAssignments = MOCK_COURSE_ASSIGNMENTS[courseId];
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
			if (!MOCK_COURSE_ASSIGNMENTS[courseId]) {
				MOCK_COURSE_ASSIGNMENTS[courseId] = [];
			}

			// Add to mock data
			MOCK_COURSE_ASSIGNMENTS[courseId].push(newAssignment);

			console.log(
				"✅ [MOCK API] Assignment created successfully:",
				newAssignment,
			);
			console.log(
				"📦 [MOCK API] Total assignments now:",
				MOCK_COURSE_ASSIGNMENTS[courseId].length,
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

			const courseAssignments = MOCK_COURSE_ASSIGNMENTS[courseId];
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

			const courseAssignments = MOCK_COURSE_ASSIGNMENTS[courseId];
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
			const courseMemberData = MOCK_COURSE_MEMBERS[cohortId];
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
			for (const courseId in MOCK_COURSE_MEMBERS) {
				const courseMemberData = MOCK_COURSE_MEMBERS[courseId];
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
			const resourcesData = MOCK_RESOURCES[cohortId] || {
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
			if (MOCK_RESOURCES[cohortId]) {
				const week = MOCK_RESOURCES[cohortId].weeks.find(
					(w) => w.id === weekId,
				);
				if (week) {
					week.resources.push(newResource);
					week.totalResources = week.resources.length;
					MOCK_RESOURCES[cohortId].stats.totalResources++;
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
			if (MOCK_RESOURCES[cohortId]) {
				for (const week of MOCK_RESOURCES[cohortId].weeks) {
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
			if (MOCK_RESOURCES[cohortId]) {
				for (const week of MOCK_RESOURCES[cohortId].weeks) {
					const resourceIndex = week.resources.findIndex(
						(r) => r.id === resourceId,
					);
					if (resourceIndex !== -1) {
						week.resources.splice(resourceIndex, 1);
						week.totalResources = week.resources.length;
						MOCK_RESOURCES[cohortId].stats.totalResources--;
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
			if (MOCK_RESOURCES[cohortId]) {
				MOCK_RESOURCES[cohortId].weeks.push(newWeek);
				MOCK_RESOURCES[cohortId].stats.totalWeeks++;
			} else {
				MOCK_RESOURCES[cohortId] = {
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
			if (MOCK_RESOURCES[cohortId]) {
				const weekIndex = MOCK_RESOURCES[cohortId].weeks.findIndex(
					(w) => w.id === weekId,
				);
				if (weekIndex !== -1) {
					MOCK_RESOURCES[cohortId].weeks[weekIndex] = {
						...MOCK_RESOURCES[cohortId].weeks[weekIndex],
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
			if (MOCK_RESOURCES[cohortId]) {
				const weekIndex = MOCK_RESOURCES[cohortId].weeks.findIndex(
					(w) => w.id === weekId,
				);
				if (weekIndex !== -1) {
					const deletedWeek =
						MOCK_RESOURCES[cohortId].weeks[weekIndex];
					MOCK_RESOURCES[cohortId].weeks.splice(weekIndex, 1);
					MOCK_RESOURCES[cohortId].stats.totalWeeks--;
					MOCK_RESOURCES[cohortId].stats.totalResources -=
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
				MOCK_INCOMING_MEETING_REQUESTS.unshift(newRequest);
				return { success: true, data: newRequest };
			}

			return {
				success: true,
				data: MOCK_INCOMING_MEETING_REQUESTS.filter(
					(r) => r.studentId === userId,
				),
			};
		}

		// --- JOB TRAY AGGREGATION ---
		if (endpoint.match(/^\/job-tray$/)) {
			const jobs = [];

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
			const assetRequests = MOCK_ASSET_REQUESTS?.requests || [];
			assetRequests.forEach((req) => {
				if (req.status === "Rejected" && !req.isArchived) {
					jobs.push({
						id: `asset-${req.id}`,
						title: `Asset request for ${req.assetName} requires your action.`,
						type: "ASSET_REQUEST",
						status: "Action Required",
						link: "/asset-requests",
						statusNote: req.adminComments,
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 2. FINANCE: Filter Action Required Claims/Requests
			const expenses = MOCK_EXPENSES?.expenses || [];
			const advances = MOCK_ADVANCES?.advances || [];

			// A. Handle Rejected Expense Claims
			expenses.forEach((item) => {
				if (item.status === "Rejected" && !item.isArchived) {
					jobs.push({
						id: `exp-${item.id}`,
						title: `Expense claim for ${item.title} requires your action.`,
						type: "FINANCE_EXPENSE",
						status: "Action Required",
						link: "/finance-management/expenses",
						statusNote: item.adminComments,
						createdAt: new Date().toISOString(),
					});
				}
			});

			// B. Handle Rejected Advance Requests
			advances.forEach((item) => {
				if (item.status === "Rejected" && !item.isArchived) {
					jobs.push({
						id: `adv-${item.id}`,
						title: `Advance request for ${item.title} requires your action.`,
						type: "FINANCE_ADVANCE",
						status: "Action Required",
						link: "/finance-management/advances",
						statusNote: item.adminComments,
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 3. LEAVE APPLICATIONS: Filter Action Required Apps and Pending Substitutions
			const leaveApps = MOCK_LEAVE_APPLICATIONS.applications || [];
			const subRequests =
				MOCK_LEAVE_APPLICATIONS.substitutionRequests || [];

			// A. Handle Rejected Leave Applications
			leaveApps.forEach((app) => {
				if (app.status === "Rejected" && !app.isArchived) {
					// Collect remarks only if they are associated with a "Rejected" status
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
						// Consolidated status note
						statusNote:
							remarks.join(" | ") || "Application rejected.",
						createdAt: new Date().toISOString(),
					});
				}
			});

			// B. Handle Pending Substitution Requests
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
						// Concatenated date and timings for clarity
						statusNote: `${sub.course} | ${formatTime(sub.timings.startTime)} - ${formatTime(sub.timings.endTime)}`,
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 4. EXAM DUTIES: Filter Rejection Revoked Duties
			const exams = MOCK_EXAM_DATA || [];

			exams.forEach((exam) => {
				if (exam.status === "REJECTION_REVOKED") {
					// Consolidate remarks from both authorities
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
						createdAt: new Date().toISOString(),
					});
				}
			});

			// 5. LIBRARY: Filter Overdue Books
			const borrowedBooks = MOCK_LIBRARY_DATA.borrowed || [];

			borrowedBooks.forEach((book) => {
				const isOverdue = new Date() > new Date(book.dueDate);
				if (isOverdue) {
					jobs.push({
						id: `lib-overdue-${book.id}`,
						title: `Return Overdue: ${book.bookTitle} by ${book.author}`,
						type: "LIBRARY_OVERDUE",
						status: "Action Required",
						link: "/library/borrowed",
						// Use the overdue status note to show the due date
						statusNote: `Book was due on ${formatDate(book.dueDate)}`,
						createdAt: new Date().toISOString(), // Stamp for sorting
					});
				}
			});

			// 6. MAINTENANCE: Filter Action Required Requests
			const maintenanceRequests = MOCK_MAINTENANCE_DATA?.requests || [];

			maintenanceRequests.forEach((req) => {
				const categoryTab = req.category || "university";
				// Filter for rejected requests that haven't been archived/resolved by the user
				if (req.requiresAction) {
					jobs.push({
						id: `maint-${req.id}`,
						title: `Maintenance request for ${req.issueType} at ${req.location} requires your action.`,
						type: "MAINTENANCE_REQUEST",
						status: "Action Required",
						link: `/maintenance/${categoryTab}`,
						statusNote:
							req.adminRemarks || "Contact the maintenance team.",
						createdAt: req.updatedAt || new Date().toISOString(),
					});
				}
			});

			// 7. SESSION PLANNING: Filter Rejected Document Uploads
			const courseSchedule = MOCK_COURSE_SCHEDULE || [];
			const courseDocs = MOCK_COURSE_DOCUMENTS || {};

			// Fallback for doc types if not defined globally
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
							createdAt: new Date().toISOString(),
						});
					}
				});
			});

			// 8. MENTORING: Filter meetings requiring attendance or documentation
			const mentoringData = MOCK_MENTORING_DATA || [];

			mentoringData.forEach((mentee) => {
				const meetings = mentee.meetingHistory || [];

				meetings.forEach((meeting) => {
					// A. Handle meetings needing Documentation
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
							createdAt: meeting.date, // Use meeting date for chronological sorting
						});
					}

					// B. Handle meetings needing attendance marking
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

			// Sort by date
			jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

			return {
				success: true,
				data: jobs,
			};
		}

		// --- NOTIFICATIONS AGGREGATION ---
		if (endpoint.match(/^\/notifications$/)) {
			const notifications = [];

			// 1. ASSETS: Notify when a request is Approved or Assigned
			const assetRequests = MOCK_ASSET_REQUESTS?.requests || [];
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

			// 2. FINANCE: Notify on Reimbursements or Advance Approvals
			const expenses = MOCK_EXPENSES?.expenses || [];
			const advances = MOCK_ADVANCES?.advances || [];

			expenses.forEach((item) => {
				if (item.status === "Reimbursed") {
					notifications.push({
						id: `notif-exp-${item.id}`,
						title: `Expense Approved`,
						message: `Expense claim for ${item.title} has been processed.`,
						type: "FINANCE_EXPENSE",
						link: "/finance-management/expenses",
						createdAt:
							item.approvalTime || new Date().toISOString(),
					});
				}
			});

			advances.forEach((item) => {
				if (item.status === "Approved") {
					notifications.push({
						id: `notif-exp-${item.id}`,
						title: `Advance Approved`,
						message: `Advance request for ${item.title} has been processed.`,
						type: "FINANCE_ADVANCE",
						link: "/finance-management/advances",
						createdAt:
							item.approvalTime || new Date().toISOString(),
					});
				}
			});

			// 3. LEAVE: Notify when Leave is fully Approved
			const leaveApps = MOCK_LEAVE_APPLICATIONS.applications || [];
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
			const exams = MOCK_EXAM_DATA || [];
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
			const maintenanceRequests = MOCK_MAINTENANCE_DATA?.requests || [];
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
			const libraryRequests = MOCK_LIBRARY_DATA?.requests || [];
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
			const incomingRequests = MOCK_MEETING_REQUESTS?.incoming || [];
			const outgoingRequests = MOCK_MEETING_REQUESTS?.outgoing || [];

			// Combine both to check for status updates
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

			// 8. RESEARCH & PUBLICATIONS: Application Status Updates
			const researchApps = MOCK_USER_RESEARCH_APPLICATIONS || [];
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
			[...MOCK_RESEARCH_PROJECTS, ...MOCK_PUBLICATIONS]
				.filter((p) => p.isOwner)
				.forEach((project) => {
					project.applicants
						?.filter((a) => a.status === "Pending")
						.forEach((applicant) => {
							notifications.push({
								id: `notif-res-new-app-${applicant.id}`,
								title: "New Project Applicant",
								message: `${applicant.name} applied for the ${applicant.role} role in "${project.title}".`,
								type: "RESEARCH_OWNER",
								link: "/research-publications/my-applications",
								createdAt: applicant.appliedDate,
							});
						});
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

		// --- LIBRARY ---
		if (endpoint.match(/^\/library\/.+/)) {
			const method = options?.method || "GET";

			// GET: Dashboard data
			if (endpoint.match(/^\/library\/dashboard$/) && method === "GET") {
				return {
					success: true,
					data: {
						admins: MOCK_LIBRARY_DATA.admins,
						requests: MOCK_LIBRARY_DATA.requests.filter(
							(r) => r.status !== "approved",
						),
						// Aggregate borrowed books from both explicit records and approved requests
						borrowed: [
							...MOCK_LIBRARY_DATA.borrowed,
							...MOCK_LIBRARY_DATA.requests
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
						inventory: MOCK_LIBRARY_DATA.inventory,
					},
				};
			}

			// POST: Request Book
			if (endpoint.match(/^\/library\/request$/) && method === "POST") {
				const { bookId, durationDays } = JSON.parse(options.body);
				const book = MOCK_LIBRARY_DATA.inventory.find(
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
					MOCK_LIBRARY_DATA.requests.unshift(newRequest);
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
				const index = MOCK_LIBRARY_DATA.requests.findIndex(
					(r) => r.id === id,
				);
				if (index !== -1) {
					MOCK_LIBRARY_DATA.requests.splice(index, 1);
					return { success: true, message: "Cancelled" };
				}
			}

			// POST: Create Extension Request
			if (endpoint.match(/^\/library\/extend$/) && method === "POST") {
				const { bookId, additionalDays } = JSON.parse(options.body);

				const book =
					MOCK_LIBRARY_DATA.borrowed.find((b) => b.id === bookId) ||
					MOCK_LIBRARY_DATA.requests.find(
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

					MOCK_LIBRARY_DATA.requests.unshift(extensionRequest);

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

				const borrowedBook = MOCK_LIBRARY_DATA.borrowed.find(
					(b) => b.id === bookId,
				);

				if (borrowedBook) {
					const currentDueDate = new Date(borrowedBook.dueDate);
					currentDueDate.setDate(
						currentDueDate.getDate() + parseInt(additionalDays),
					);
					const newDate = currentDueDate.toISOString().split("T")[0];
					borrowedBook.dueDate = newDate;

					const requestIndex = MOCK_LIBRARY_DATA.requests.findIndex(
						(r) => r.id === requestId,
					);
					if (requestIndex !== -1) {
						MOCK_LIBRARY_DATA.requests.splice(requestIndex, 1);
					}

					return { success: true, newDueDate: newDate };
				}
				return {
					success: false,
					message: "Could not process extension approval",
				};
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
						requests: MOCK_MAINTENANCE_DATA.requests,
						technicians: MOCK_MAINTENANCE_DATA.technicians || [],
						admins: MOCK_MAINTENANCE_DATA.admins || [],
						issueTypes: MOCK_MAINTENANCE_DATA.issueTypes || [],
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
				const nextIdNumber = MOCK_MAINTENANCE_DATA.requests.length + 1;
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

				MOCK_MAINTENANCE_DATA.requests.unshift(fullRequest);
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

				const req = MOCK_MAINTENANCE_DATA.requests.find(
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

		// --- SESSION PLANNING ---
		if (endpoint.match(/^\/sessions\/.+/)) {
			const method = options?.method || "GET";

			// GET Schedules
			if (endpoint.match(/^\/sessions\/schedules$/) && method === "GET") {
				return { success: true, data: MOCK_COURSE_SCHEDULE };
			}

			// GET Today's Classes
			if (endpoint.match(/^\/sessions\/today$/) && method === "GET") {
				const todays = [];
				MOCK_COURSE_SCHEDULE.filter(
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
				const section = MOCK_COURSE_SCHEDULE.find((s) => s.id === id);
				if (section) section.status = "Completed";
				return { success: true, data: section };
			}

			// GET Reflections
			if (
				endpoint.match(/^\/sessions\/reflections/) &&
				method === "GET"
			) {
				return { success: true, data: MOCK_REFLECTIONS };
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
				MOCK_REFLECTIONS.unshift(newRef);

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
						data: MOCK_COURSE_DOCUMENTS[courseId] || {},
					};
				}

				if (method === "POST") {
					// Initialize course entry if it doesn't exist
					if (!MOCK_COURSE_DOCUMENTS[courseId]) {
						MOCK_COURSE_DOCUMENTS[courseId] = {};
					}

					const body = JSON.parse(options.body);
					const uploadedKeys = isBulk ? body.docs : [body.docType];

					// Update each document's metadata to "Pending"
					uploadedKeys.forEach((docType) => {
						const currentDoc =
							MOCK_COURSE_DOCUMENTS[courseId][docType] || {};

						MOCK_COURSE_DOCUMENTS[courseId][docType] = {
							fileName:
								body.fileNames?.[docType] ||
								`updated_${docType}.pdf`,
							fileLink: "#",
							version: (currentDoc.version || 0) + 1,
							uploadDate: new Date().toISOString(),
							hodApproved: null, // Reset to Pending
							hodComments: null, // Clear previous rejections
						};
					});

					return {
						success: true,
						data: MOCK_COURSE_DOCUMENTS[courseId],
					};
				}
			}
		}

		// --- SCHEDULE & MEETINGS ---
		if (endpoint === "/professor/schedule") {
			const userRole = localStorage.getItem("userRole");
			const dashboardData =
				userRole === "professor"
					? MOCK_PROFESSOR_DASHBOARD_DATA
					: MOCK_STUDENT_DASHBOARD_DATA;

			return {
				success: true,
				data: {
					scheduledMeetings: MOCK_SCHEDULED_MEETINGS,

					// Filters only for items that need an action from the user
					meetingRequests: MOCK_MEETING_REQUESTS.incoming.filter(
						(r) => r.status === "pending",
					),

					outgoingRequests: MOCK_MEETING_REQUESTS.outgoing,

					schedule: {
						officeHours: MOCK_OFFICE_HOURS,
						// Maps course schedule data for the timetable UI
						timetable: MOCK_COURSE_SCHEDULE.flatMap((course) =>
							course.schedule.map((session) => ({
								...session,
								courseName: course.courseName,
								courseId: course.id,
								courseType: course.courseType,
								startDate: course.startDate,
								endDate: course.endDate,
							})),
						),
					},
				},
			};
		}
		if (
			endpoint.match(
				/^\/professor\/meetings\/\d+\/(accept|reject|reschedule)$/,
			)
		) {
			const parts = endpoint.split("/");
			const requestId = parseInt(parts[3]);
			const action = parts[4];
			const body = options.body ? JSON.parse(options.body) : {};

			const request = MOCK_MEETING_REQUESTS.incoming.find(
				(r) => r.id === requestId,
			);

			if (request) {
				if (action === "accept") {
					request.status = "accepted";
					// Add location details from the UI form
					request.location = body.location || "Office/Online";
				}

				if (action === "reject") {
					request.status = "rejected";
				}

				// Return statement: Confirms the status change so the UI can refresh the schedule
				return {
					success: true,
					data: { message: `Meeting ${action}ed successfully` },
				};
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
				return { data: MOCK_MENTORING_DATA };
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
					MOCK_MENTORING_DATA.forEach((s) => {
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
					let targetStudent = MOCK_MENTORING_DATA.find((s) => {
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
				return { data: MOCK_DOC_REQUESTS };
			}

			// POST: Respond to the student request
			if (
				endpoint.match(/^\/documents\/status\/[\w-]+$/) &&
				method === "POST"
			) {
				try {
					const requestId = endpoint.split("/").pop();
					const { status, reason } = JSON.parse(options.body);

					const request = MOCK_DOC_REQUESTS.studentRequests.find(
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
					const { lorFile, registrarNote, studentInfo } = JSON.parse(
						options.body,
					);

					// Find the full original request to extract all student data
					const originalReq = MOCK_DOC_REQUESTS.studentRequests.find(
						(r) => r.id === studentInfo.requestId,
					);

					if (!originalReq)
						throw new Error("Original request not found");

					const newQueueItem = {
						lorId: `LOR-PROC-${Math.floor(1000 + Math.random() * 9000)}`,
						studentName: originalReq.student.name,
						rollNumber: originalReq.student.rollNumber,
						// Carry over all student request data except the original draft lorDocument
						studentData: {
							email: originalReq.student.email,
							purpose: originalReq.application.purpose,
							supportingDocs:
								originalReq.application.supportingDocs,
						},
						signedDocument: {
							name: lorFile.name || "Signed_Document.pdf",
							url: "/docs/uploads/signed_temp.pdf",
						},
						approvedDocument: null,
						noteToRegistrar: registrarNote,
						sentDate: new Date().toISOString().split("T")[0],
						status: "Pending",
						originalRequestId: studentInfo.requestId,
					};

					MOCK_DOC_REQUESTS.processingQueue.push(newQueueItem);

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
				const flow = MOCK_DOC_REQUESTS.processingQueue.find(
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
				const flow = MOCK_DOC_REQUESTS.processingQueue.find(
					(f) => f.lorId === lorId,
				);

				if (flow) {
					// 1. Update the status in the Processing Queue
					flow.status = "Dispatched";
					flow.sentToStudentDate = new Date()
						.toISOString()
						.split("T")[0];

					// 2. Find the corresponding student request to update its state
					const originalReq = MOCK_DOC_REQUESTS.studentRequests.find(
						(r) =>
							r.student.rollNumber === flow.rollNumber &&
							r.status === "Under Review",
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
		if (endpoint.match(/^\/assets\/(list|requests)$/)) {
			const type = endpoint.split("/").pop();
			return {
				success: true,
				data: type === "list" ? MOCK_ASSETS_LIST : MOCK_ASSET_REQUESTS,
			};
		}

		// --- ATTENDANCE MANAGEMENT ---
		// GET: Fetch attendance logs for a specific cohort
		if (endpoint.match(/^\/attendance\/logs\/\d+$/)) {
			const cohortId = endpoint.match(/\/attendance\/logs\/(\d+)$/)[1];
			const today = new Date().toISOString().split("T")[0];

			const rawData = MOCK_ATTENDANCE_DATA[cohortId] || {
				students: [],
				logs: {},
				finalizedDates: [],
			};

			const isFinalToday = rawData.finalizedDates?.includes(today);

			return {
				status: "success",
				data: { ...rawData, isFinal: isFinalToday },
				departmentMapping: DEPARTMENT_MAPPING,
			};
		}
		// POST: Save attendance for a specific course
		if (
			endpoint.match(/^\/courses\/\d+\/attendance$/) &&
			options.method === "POST"
		) {
			try {
				if (!options.body) throw new Error("Missing request body");
				const courseId = endpoint.match(
					/\/courses\/(\d+)\/attendance/,
				)[1];
				const bodyData = JSON.parse(options.body);
				const today = bodyData.date;

				if (!MOCK_ATTENDANCE_DATA[courseId]) {
					MOCK_ATTENDANCE_DATA[courseId] = {
						students: [],
						logs: {},
						finalizedDates: [],
					};
				}

				MOCK_ATTENDANCE_DATA[courseId].logs[today] =
					bodyData.studentIds;

				if (
					!MOCK_ATTENDANCE_DATA[courseId].finalizedDates.includes(
						today,
					)
				) {
					MOCK_ATTENDANCE_DATA[courseId].finalizedDates.push(today);
				}

				return {
					status: "success",
					data: {
						...MOCK_ATTENDANCE_DATA[courseId],
						isFinal: true,
						message: "Attendance saved",
					},
				};
			} catch (err) {
				return {
					success: false,
					message: "Invalid JSON or missing body: " + err.message,
				};
			}
		}
		if (endpoint.match(/^\/professor\/logs$/)) {
			return { success: true, data: MOCK_PROFESSOR_LOGS || [] };
		}

		// --- FINANCE MANAGEMENT ---
		if (endpoint.match(/^\/expenses\/list$/)) {
			return { success: true, data: { expenses: MOCK_EXPENSES } };
		}
		if (endpoint.match(/^\/advances\/list$/)) {
			return { success: true, data: { advances: MOCK_ADVANCES } };
		}

		// --- EXAM DUTIES ---
		if (endpoint.match(/^\/exams\//)) {
			const method = options?.method || "GET";

			// GET: Fetch all assigned exam duties
			if (endpoint.match(/^\/exams\/duties$/) && method === "GET") {
				return { success: true, data: MOCK_EXAM_DATA || [] };
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
					const duty = MOCK_EXAM_DATA.find((d) => d.id === id);

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

			// GET: Fetch all leave applications and substitution requests
			if (
				endpoint.match(/^\/leaves\/applications$/) &&
				method === "GET"
			) {
				return { data: MOCK_LEAVE_APPLICATIONS };
			}

			// POST: Submit a new leave application
			if (endpoint.match(/^\/leaves\/apply$/) && method === "POST") {
				try {
					if (!options.body) throw new Error("Missing request body");
					const newLeave = JSON.parse(options.body);

					MOCK_LEAVE_APPLICATIONS.applications.push({
						...newLeave,
						id: `LV${Date.now()}`,
						status: "Pending",
						leaveApproval: {
							HoD: { status: "Pending", remark: null },
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

			// POST: Update an existing leave application
			if (
				endpoint.match(/^\/leaves\/update\/[\w-]+$/) &&
				method === "POST"
			) {
				try {
					if (!options.body) throw new Error("Missing request body");
					const leaveId = endpoint.split("/").pop();
					const updatedData = JSON.parse(options.body);

					const index =
						MOCK_LEAVE_APPLICATIONS.applications.findIndex(
							(a) => a.id === leaveId,
						);

					if (index !== -1) {
						MOCK_LEAVE_APPLICATIONS.applications[index] = {
							...MOCK_LEAVE_APPLICATIONS.applications[index],
							...updatedData,
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

			// POST: Process leave approval by HoD or HR
			if (
				endpoint.match(/^\/leaves\/approve\/[\w-]+$/) &&
				method === "POST"
			) {
				try {
					if (!options.body) throw new Error("Missing request body");
					const leaveId = endpoint.split("/").pop();
					const { role, action, remark } = JSON.parse(options.body);

					const app = MOCK_LEAVE_APPLICATIONS.applications.find(
						(a) => a.id === leaveId,
					);
					if (app && app.leaveApproval[role]) {
						app.leaveApproval[role].status = action;
						app.leaveApproval[role].remark = remark || null;
						return {
							success: true,
							message: `${role} status updated to ${action}.`,
						};
					}
					return {
						success: false,
						message: "Application or role not found.",
					};
				} catch (err) {
					return { success: false, message: "Error: " + err.message };
				}
			}

			// POST: Process substitution requests
			if (
				endpoint.match(/^\/leaves\/substitutions\/[\w-]+$/) &&
				method === "POST"
			) {
				try {
					if (!options.body) throw new Error("Missing request body");
					const subId = endpoint.split("/").pop();
					const { action } = JSON.parse(options.body);

					const subReq =
						MOCK_LEAVE_APPLICATIONS.substitutionRequests.find(
							(s) => s.id === subId,
						);
					if (subReq) {
						subReq.status = action;
						subReq.leaveApproval.HoD.status = action;

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

		// --- PAYROLL ---
		if (endpoint.match(/^\/payroll\//)) {
			const method = options?.method || "GET";

			// GET: Fetch payroll transaction history
			if (endpoint.match(/^\/payroll\/history$/) && method === "GET") {
				return { success: true, data: MOCK_PAYROLL.history };
			}

			// GET: Fetch current month's salary breakdown
			if (endpoint.match(/^\/payroll\/breakdown$/) && method === "GET") {
				return { success: true, data: MOCK_PAYROLL.currentBreakdown };
			}
		}

		// --- BULLETINS ---
		if (endpoint.match(/^\/bulletins(\?.*)?$/)) {
			if (options.method === "GET" || !options.method) {
				const url = new URL(endpoint, "http://localhost");
				const level = url.searchParams.get("level");
				const courseId = url.searchParams.get("courseId");
				const priority = url.searchParams.get("priority");

				let filtered = [...MOCK_BULLETINS];

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

			if (options.method === "POST") {
				try {
					const body = JSON.parse(options.body || "{}");
					const newBulletin = {
						id: Date.now(),
						...body,
						createdAt: new Date().toISOString(),
						priority: body.priority || "Normal",
						attachments: body.attachments || [],
					};
					MOCK_BULLETINS.unshift(newBulletin);
					return { success: true, data: newBulletin };
				} catch (err) {
					return {
						success: false,
						message: "Bulletin creation failed",
					};
				}
			}
		}

		// --- RESEARCH & PUBLICATIONS ---
		if (endpoint.match(/^\/research\//)) {
			const method = options?.method || "GET";
			const parts = endpoint.split("/");

			// GET: Consolidates projects and publications for the Research Dashboard
			if (
				endpoint.match(/^\/research\/dashboard-sync$/) &&
				method === "GET"
			) {
				return {
					success: true,
					data: {
						availableProjects: MOCK_RESEARCH_PROJECTS.filter(
							(p) => !p.isOwner && !p.isMember,
						),
						myProjects: MOCK_RESEARCH_PROJECTS.filter(
							(p) => p.isOwner || p.isMember,
						),
						myApplications: MOCK_USER_RESEARCH_APPLICATIONS,
						otherPublications: MOCK_PUBLICATIONS.filter(
							(p) => !p.isOwner && !p.isMember,
						),
						myPublications: MOCK_PUBLICATIONS.filter(
							(p) => p.isOwner || p.isMember,
						),
					},
				};
			}

			// POST: Handles application submission to a specific research item
			if (
				endpoint.match(/^\/research\/apply\/[\w-]+$/) &&
				method === "POST"
			) {
				const id = parts.pop();
				const body = JSON.parse(options.body);
				const itemType = body.itemType;

				const targetArray =
					itemType === "Project"
						? MOCK_RESEARCH_PROJECTS
						: MOCK_PUBLICATIONS;
				const item = targetArray.find((i) => i.id === id);

				if (item) {
					if (!item.applicants) item.applicants = [];
					item.applicants.push({
						id: `app-${Math.random().toString(36).substr(2, 9)}`,
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
				endpoint.match(/^\/research\/applications\/[\w-]+\/[\w\s]+$/) &&
				method === "POST"
			) {
				const action = decodeURIComponent(parts.pop());
				const appId = parts.pop();
				let details = {};

				try {
					details = options?.body ? JSON.parse(options.body) : {};
				} catch (e) {}

				[...MOCK_RESEARCH_PROJECTS, ...MOCK_PUBLICATIONS].forEach(
					(item) => {
						const applicant = item.applicants?.find(
							(a) => a.id === appId,
						);

						if (applicant) {
							if (action === "Accepted") {
								// Auto-reject other applicants for this same role
								item.applicants.forEach((otherApp) => {
									if (
										otherApp.id !== appId &&
										otherApp.roleId === applicant.roleId &&
										otherApp.status === "Pending"
									) {
										otherApp.status = "Rejected";
										otherApp.professorNotes =
											"Position has been filled by another applicant.";
									}
								});

								// Remove this specific user's OTHER pending applications for THIS role elsewhere
								[
									...MOCK_RESEARCH_PROJECTS,
									...MOCK_PUBLICATIONS,
								].forEach((otherItem) => {
									if (
										otherItem.id !== item.id &&
										otherItem.applicants
									) {
										otherItem.applicants =
											otherItem.applicants.filter(
												(a) =>
													!(
														a.userId ===
															applicant.userId &&
														a.roleId ===
															applicant.roleId &&
														a.status === "Pending"
													),
											);
									}
								});

								applicant.approvalDate =
									details.approvalDate ||
									new Date().toISOString();
								applicant.professorNotes = details.feedback;

								const memberName = applicant.name;
								if (item.type === "publication") {
									if (!item.coAuthors) item.coAuthors = [];
									if (!item.coAuthors.includes(memberName))
										item.coAuthors.push(memberName);
								} else {
									if (!item.collaborators)
										item.collaborators = [];
									if (
										!item.collaborators.includes(memberName)
									)
										item.collaborators.push(memberName);
								}

								item.currentMemberCount =
									(item.currentMemberCount || 0) + 1;

								if (item.openRoles) {
									item.openRoles = item.openRoles.filter(
										(r) => r.id !== applicant.roleId,
									);
									item.openRolesCount = item.openRoles.length;
								}
							}

							applicant.status = action;
							if (action === "Meeting Scheduled") {
								applicant.meetingDetails = details;
							} else if (action === "Rejected") {
								applicant.professorNotes = details.feedback;
							}
						}
					},
				);

				return {
					success: true,
					message: `Application ${action} updated, others cleaned up.`,
				};
			}

			// POST: Create new project or publication
			if (endpoint.match(/^\/research\/create$/) && method === "POST") {
				const body = JSON.parse(options.body);
				const newEntry = {
					id: `res-${Math.random().toString(36).substr(2, 9)}`,
					...body,
					isOwner: true,
					isMember: true,
					status:
						body.status ||
						(body.type === "Project" ? "Open" : "Published"),
					date: new Date().toLocaleDateString("en-GB", {
						day: "numeric",
						month: "short",
						year: "numeric",
					}),
					applicants: [],
				};

				if (body.type === "Project") {
					MOCK_RESEARCH_PROJECTS.unshift(newEntry);
				} else {
					MOCK_PUBLICATIONS.unshift(newEntry);
				}
				return { success: true, data: newEntry };
			}

			// ROLES: Manage research roles
			if (endpoint.match(/^\/research\/[\w-]+\/roles/)) {
				const researchId = parts[2];
				const action = parts[4];
				const roleId = parseInt(parts[parts.length - 1]);
				const target = [
					...MOCK_RESEARCH_PROJECTS,
					...MOCK_PUBLICATIONS,
				].find((item) => item.id === researchId);

				if (!target)
					return {
						success: false,
						message: "Research item not found",
					};
				if (!target.openRoles) target.openRoles = [];

				if (method === "DELETE" && action === "delete") {
					target.openRoles = target.openRoles.filter(
						(r) => r.id !== roleId,
					);
					return {
						success: true,
						message: "Role deleted successfully",
					};
				}

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
					...MOCK_RESEARCH_PROJECTS,
					...MOCK_PUBLICATIONS,
				].find((i) => i.id === researchId);

				if (!targetItem)
					return {
						success: false,
						message: "Research item not found",
					};
				if (!targetItem.timeline) targetItem.timeline = [];

				if (method === "DELETE" && eventId) {
					targetItem.timeline = targetItem.timeline.filter(
						(e) => e.id !== eventId,
					);
					return { success: true, message: "Timeline event deleted" };
				}

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

			// USERS: Profile and User listings
			if (endpoint.match(/^\/research\/users$/) && method === "GET") {
				return { success: true, data: MOCK_USERS };
			}

			if (
				endpoint.match(/^\/research\/users\/profile\/[\w-]+$/) &&
				method === "GET"
			) {
				const userId = parts.pop();
				const user = MOCK_USERS.find((u) => u.id === userId);
				if (user) {
					// Hydrate associations with full project/publication objects for the Profile UI
					const hydrated = user.associations.map((assoc) => {
						const source =
							assoc.type === "Project"
								? MOCK_RESEARCH_PROJECTS
								: MOCK_PUBLICATIONS;
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

			if (
				endpoint.match(
					/^\/research\/users\/profile\/update\/[\w-]+$/,
				) &&
				method === "POST"
			) {
				try {
					const userId = parts.pop();
					const body = JSON.parse(options.body);
					const idx = MOCK_USERS.findIndex((u) => u.id === userId);
					if (idx !== -1) {
						MOCK_USERS[idx] = {
							...MOCK_USERS[idx],
							...body,
							updatedAt: new Date().toISOString(),
						};
						return { success: true, data: MOCK_USERS[idx] };
					}
				} catch (err) {
					return {
						success: false,
						message: "Update failed: " + err.message,
					};
				}
			}
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

// User/Profile APIs
export const userAPI = {
	// Get user dashboard overview
	getDashboardOverview: () => apiCall("/user/dashboard-overview"),

	// Get user details
	getUserDetails: (fields) => apiCall(`/user/details?fields=${fields}`),

	// Update user settings
	updateUserSettings: (settings) =>
		apiCall("/user/settings", {
			method: "PUT",
			body: JSON.stringify(settings),
		}),

	// Check username availability
	checkUsername: (username) =>
		apiCall(`/user/check-username?username=${username}`),

	// Submit a bug report
	submitBugReport: (formData) =>
		apiCall("/user/bug-report", {
			method: "POST",
			body: formData, // FormData is sent without JSON.stringify
		}),
};

// Course/Cohort APIs
export const courseAPI = {
	// Get course metadata by slug
	getCourseMetadata: (slug) => apiCall(`/cohort/slug/${slug}`),

	// Get course details
	getCourseDetails: (courseId) => apiCall(`/cohort/${courseId}/details`),

	// Get archived courses
	getArchivedCourses: () => apiCall("/cohort/archived"),

	// Get course members - update to get all members without pagination set the limit to 2k
	getCourseMembers: (courseId) =>
		apiCall(`/cohort/${courseId}/members?limit=2000&page=1`),

	// Get group details
	getGroupDetails: (groupId, cohortId = null) => {
		const url = cohortId
			? `/cohort/${cohortId}/group/${groupId}/details`
			: `/cohort/group/${groupId}/details`;
		return apiCall(url);
	},

	// Create course
	createCourse: (courseData) =>
		apiCall("/cohort/create", {
			method: "POST",
			body: JSON.stringify(courseData),
		}),

	// Update course
	updateCourse: (courseId, courseData) =>
		apiCall(`/cohort/edit/${courseId}`, {
			method: "PATCH",
			body: JSON.stringify(courseData),
		}),

	// Delete course
	deleteCourse: (courseId) =>
		apiCall(`/cohort/${courseId}`, {
			method: "DELETE",
		}),

	// Add detail section
	addDetailSection: (courseId, sectionData) =>
		apiCall(`/cohort/${courseId}/details/add`, {
			method: "POST",
			body: JSON.stringify(sectionData),
		}),

	// Edit detail section
	editDetailSection: (courseId, detailId, sectionData) =>
		apiCall(`/cohort/${courseId}/details/${detailId}/edit`, {
			method: "PATCH",
			body: JSON.stringify(sectionData),
		}),

	// Delete detail section
	deleteDetailSection: (courseId, detailId) =>
		apiCall(`/cohort/${courseId}/details/${detailId}`, {
			method: "DELETE",
		}),

	// Create group
	createGroup: (courseId, groupData) =>
		apiCall(`/cohort/${courseId}/group/create`, {
			method: "POST",
			body: JSON.stringify(groupData),
		}),

	// Update group
	updateGroup: (cohortId, groupId, groupData) =>
		apiCall(`/cohort/${cohortId}/group/${groupId}/edit`, {
			method: "PUT",
			body: JSON.stringify(groupData),
		}),

	// Delete group
	deleteGroup: (cohortId, groupId) =>
		apiCall(`/cohort/${cohortId}/group/${groupId}/delete`, {
			method: "DELETE",
		}),

	// Invite member to group
	inviteGroupMember: (courseId, groupId, inviteData) =>
		apiCall(`/cohort/${courseId}/group/${groupId}/invite`, {
			method: "POST",
			body: JSON.stringify(inviteData),
		}),

	// Accept group invite
	acceptGroupInvite: (token) =>
		apiCall("/cohort/group/accept-invite", {
			method: "POST",
			body: JSON.stringify({ token }),
		}),

	// Remove member from group
	removeGroupMember: (groupId, memberId) =>
		apiCall(`/cohort/group/${groupId}/remove-member`, {
			method: "DELETE",
			body: JSON.stringify({ targetUserId: memberId }),
		}),

	// Upload course participants (Excel file)
	uploadParticipants: async (courseId, file) => {
		try {
			const formData = new FormData();
			formData.append("file", file);

			const resp = await fetch(
				`${API_BASE_URL}/cohort/${courseId}/invite`,
				{
					method: "POST",
					credentials: "include",
					body: formData,
				},
			);

			const contentType = resp.headers.get("content-type") || "";
			const isJson = contentType.includes("application/json");
			const body = isJson ? await resp.json().catch(() => ({})) : {};

			if (!resp.ok) {
				return {
					success: false,
					message: body.message || `HTTP ${resp.status}`,
				};
			}

			return { success: true, data: body };
		} catch (e) {
			return {
				success: false,
				message: "Network error. Please try again.",
			};
		}
	},

	// Upload course projects (Excel file)
	uploadProjects: async (courseId, file) => {
		try {
			const formData = new FormData();
			formData.append("file", file);

			const resp = await fetch(
				`${API_BASE_URL}/cohort/${courseId}/projects/upload`,
				{
					method: "POST",
					credentials: "include",
					body: formData,
				},
			);

			const contentType = resp.headers.get("content-type") || "";
			const isJson = contentType.includes("application/json");
			const body = isJson ? await resp.json().catch(() => ({})) : {};

			if (!resp.ok) {
				return {
					success: false,
					message: body.message || `HTTP ${resp.status}`,
				};
			}

			return { success: true, data: body };
		} catch (e) {
			return {
				success: false,
				message: "Network error. Please try again.",
			};
		}
	},

	// Submit assignment
	submitAssignment: (courseId, submissionData, files = []) => {
		const formData = new FormData();
		formData.append("submission_title", submissionData.submission_title);
		formData.append(
			"submission_description",
			submissionData.submission_description,
		);
		if (submissionData.submission_url) {
			formData.append("submission_url", submissionData.submission_url);
		}

		files.forEach((file) => {
			formData.append("files", file);
		});

		return fetch(`${API_BASE_URL}/cohort/${courseId}/submission`, {
			method: "POST",
			credentials: "include",
			body: formData,
		});
	},

	// Get student submission
	getSubmission: (courseId) => apiCall(`/cohort/${courseId}/submission`),

	// Update submission
	updateSubmission: (courseId, submissionData, files = []) => {
		const formData = new FormData();
		formData.append("submission_title", submissionData.submission_title);
		formData.append(
			"submission_description",
			submissionData.submission_description,
		);
		if (submissionData.submission_url) {
			formData.append("submission_url", submissionData.submission_url);
		}

		files.forEach((file) => {
			formData.append("files", file);
		});

		return fetch(`${API_BASE_URL}/cohort/${courseId}/submission`, {
			method: "PUT",
			credentials: "include",
			body: formData,
		});
	},

	// Delete/unsubmit assignment
	deleteSubmission: (courseId) =>
		apiCall(`/cohort/${courseId}/submission`, {
			method: "DELETE",
		}),

	// Get available members for group (FIXED)
	getAvailableMembers: (cohortId, groupId) =>
		apiCall(`/cohort/${cohortId}/available-members/${groupId}`),

	// Add members to group (FIXED)
	addMembersToGroup: (groupId, memberUserIds) =>
		apiCall(`/cohort/group/${groupId}/add-members`, {
			method: "POST",
			body: JSON.stringify({ memberUserIds }),
		}),

	joinCourseWithInvitation: async (data) => {
		try {
			const response = await apiCall("/cohort/join-with-invitation", {
				method: "POST",
				body: JSON.stringify(data),
			});
			return response;
		} catch (error) {
			return {
				success: false,
				message: error.error || "Failed to join course",
			};
		}
	},

	getCourseByInvitation: async (token) => {
		try {
			const response = await apiCall(
				`/cohort/invitation-info?token=${token}`,
			);
			return response;
		} catch (error) {
			return {
				success: false,
				message: error.error || "Failed to get course info",
			};
		}
	},

	generateInvitationLink: async (cohortId) => {
		try {
			const response = await apiCall(
				`/cohort/${cohortId}/invitation-link`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			return response;
		} catch (error) {
			return {
				success: false,
				message: error.error || "Failed to generate invitation link",
			};
		}
	},

	// Remove course participant (creator only)
	removeCourseParticipant: (cohortId, targetUserId) =>
		apiCall(`/cohort/${cohortId}/participants/remove`, {
			method: "DELETE",
			body: JSON.stringify({ targetUserId }),
		}),

	// Assignment Management APIs
	// Get all assignments for a cohort
	getAssignments: (cohortId) => apiCall(`/cohort/${cohortId}/assignments`),

	// Create a new assignment
	createAssignment: (cohortId, assignmentData) =>
		apiCall(`/cohort/${cohortId}/assignments`, {
			method: "POST",
			body: JSON.stringify(assignmentData),
		}),

	// Update an existing assignment
	updateAssignment: (cohortId, assignmentId, assignmentData) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}`, {
			method: "PUT",
			body: JSON.stringify(assignmentData),
		}),

	// Delete an assignment
	deleteAssignment: (cohortId, assignmentId) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}`, {
			method: "DELETE",
		}),

	// Assignment Submission APIs

	// Mark assignment as submitted
	markAssignmentSubmitted: (cohortId, assignmentId) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}/submit`, {
			method: "POST",
		}),

	// Get user's submission status for assignments
	getSubmissionStatus: (cohortId, assignmentIds = null) => {
		const url = `/cohort/${cohortId}/assignments/submissions/status`;
		const queryParams = assignmentIds
			? `?assignmentIds=${assignmentIds.join(",")}`
			: "";
		return apiCall(`${url}${queryParams}`);
	},

	// Get all submissions for a specific assignment (for professors)
	getAssignmentSubmissions: (cohortId, assignmentId) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}/submissions`),

	// Remove assignment submission (unmark as submitted)
	unmarkAssignmentSubmitted: (cohortId, assignmentId) =>
		apiCall(`/cohort/${cohortId}/assignments/${assignmentId}/submit`, {
			method: "DELETE",
		}),

	// Grade individual assignment
	gradeAssignment: (
		cohortId,
		assignmentId,
		studentId,
		marksAwarded,
		comments = "",
	) =>
		apiCall(`/cohort/assignments/${assignmentId}/grade`, {
			method: "POST",
			body: JSON.stringify({
				studentId,
				cohortId,
				marksAwarded,
				comments,
			}),
		}),

	// Grade group assignment via leader
	gradeGroupAssignment: (
		cohortId,
		assignmentId,
		leaderId,
		marksAwarded,
		comments = "",
	) =>
		apiCall(`/cohort/assignments/${assignmentId}/grade-group`, {
			method: "POST",
			body: JSON.stringify({
				leaderId,
				cohortId,
				marksAwarded,
				comments,
			}),
		}),

	// Get grades for a cohort
	getGrades: (cohortId, assignmentIds = null) => {
		const url = `/cohort/cohorts/${cohortId}/grades`;
		const queryParams = assignmentIds
			? `?assignmentIds=${assignmentIds.join(",")}`
			: "";
		return apiCall(`${url}${queryParams}`);
	},

	// Get materials for a cohort
	getMaterials: (cohortId) => apiCall(`/cohort/${cohortId}/materials`),

	// Create a new material
	createMaterial: (cohortId, materialData) =>
		apiCall(`/cohort/${cohortId}/materials`, {
			method: "POST",
			body: JSON.stringify(materialData),
		}),

	// Update a material
	updateMaterial: (cohortId, materialId, materialData) =>
		apiCall(`/cohort/${cohortId}/materials/${materialId}`, {
			method: "PUT",
			body: JSON.stringify(materialData),
		}),

	// Delete a material
	deleteMaterial: (cohortId, materialId) =>
		apiCall(`/cohort/${cohortId}/materials/${materialId}`, {
			method: "DELETE",
		}),

	// Resources Management APIs
	// Get all resources for a cohort
	getResources: (cohortId) => apiCall(`/cohort/${cohortId}/resources`),

	// Create a new week
	createWeek: (cohortId, weekData) =>
		apiCall(`/cohort/${cohortId}/resources/week`, {
			method: "POST",
			body: JSON.stringify(weekData),
		}),

	// Update a week
	updateWeek: (cohortId, weekId, weekData) =>
		apiCall(`/cohort/${cohortId}/resources/week/${weekId}`, {
			method: "PUT",
			body: JSON.stringify(weekData),
		}),

	// Delete a week
	deleteWeek: (cohortId, weekId) =>
		apiCall(`/cohort/${cohortId}/resources/week/${weekId}`, {
			method: "DELETE",
		}),

	// Create a new resource
	createResource: (cohortId, weekId, resourceData) =>
		apiCall(`/cohort/${cohortId}/resources/week/${weekId}`, {
			method: "POST",
			body: JSON.stringify(resourceData),
		}),

	// Update a resource
	updateResource: (cohortId, resourceId, resourceData) =>
		apiCall(`/cohort/${cohortId}/resources/${resourceId}`, {
			method: "PUT",
			body: JSON.stringify(resourceData),
		}),

	// Delete a resource
	deleteResource: (cohortId, resourceId) =>
		apiCall(`/cohort/${cohortId}/resources/${resourceId}`, {
			method: "DELETE",
		}),
	// Archive course
	archiveCourse: (courseId) =>
		apiCall(`/cohort/${courseId}/archive`, {
			method: "POST",
		}),

	// Check and auto-archive expired courses
	checkAndArchiveExpiredCourses: () =>
		apiCall("/cohort/check-expired", {
			method: "POST",
		}),
};

// Keep the old cohortAPI for backward compatibility
export const cohortAPI = {
	...courseAPI,

	// Delete course (alias for courseAPI.deleteCourse)
	deleteCourse: (courseId) => courseAPI.deleteCourse(courseId),

	// Leaderboard APIs
	getLeaderboard: (cohortId) => apiCall(`/cohort/${cohortId}/leaderboard`),
	getIndividualLeaderboard: (cohortId) =>
		apiCall(`/cohort/${cohortId}/leaderboard/individuals`),
	getGroupLeaderboard: (cohortId) =>
		apiCall(`/cohort/${cohortId}/leaderboard/groups`),

	// Board/Posts APIs
	getBoardPosts: (cohortId) => apiCall(`/cohort/${cohortId}/posts`),
	createPost: (cohortId, postData) =>
		apiCall(`/cohort/${cohortId}/posts`, {
			method: "POST",
			body: JSON.stringify(postData),
		}),
	updatePost: (cohortId, postId, postData) =>
		apiCall(`/cohort/${cohortId}/posts/${postId}`, {
			method: "PUT",
			body: JSON.stringify(postData),
		}),
	deletePost: (cohortId, postId) =>
		apiCall(`/cohort/${cohortId}/posts/${postId}`, {
			method: "DELETE",
		}),
	likePost: (cohortId, postId) =>
		apiCall(`/cohort/${cohortId}/posts/${postId}/like`, {
			method: "POST",
		}),

	// Events APIs
	getEvents: (cohortId) => apiCall(`/cohort/${cohortId}/events`),
	createEvent: (cohortId, eventData) =>
		apiCall(`/cohort/${cohortId}/events`, {
			method: "POST",
			body: JSON.stringify(eventData),
		}),
	updateEvent: (cohortId, eventId, eventData) =>
		apiCall(`/cohort/${cohortId}/events/${eventId}`, {
			method: "PUT",
			body: JSON.stringify(eventData),
		}),
	deleteEvent: (cohortId, eventId) =>
		apiCall(`/cohort/${cohortId}/events/${eventId}`, {
			method: "DELETE",
		}),

	// Notes APIs
	getNotes: (cohortId) => apiCall(`/cohort/${cohortId}/notes`),
	createNote: (cohortId, noteData) =>
		apiCall(`/cohort/${cohortId}/notes`, {
			method: "POST",
			body: JSON.stringify(noteData),
		}),
	updateNote: (cohortId, noteId, noteData) =>
		apiCall(`/cohort/${cohortId}/notes/${noteId}`, {
			method: "PUT",
			body: JSON.stringify(noteData),
		}),
	deleteNote: (cohortId, noteId) =>
		apiCall(`/cohort/${cohortId}/notes/${noteId}`, {
			method: "DELETE",
		}),

	generateInvitationLink: async (cohortId) => {
		// Delegate to courseAPI to ensure consistent base URL usage
		return courseAPI.generateInvitationLink(cohortId);
	},

	joinWithInvitation: async (token, email = null) => {
		try {
			const response = await fetch(
				`/api/v1/cohort/join-with-invitation`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token, email }),
				},
			);

			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ message: "Unknown error" }));
				return {
					success: false,
					message: errorData.message || `HTTP ${response.status}`,
				};
			}

			const data = await response.json();
			return { success: true, data };
		} catch (error) {
			return {
				success: false,
				message: "Failed to join course",
			};
		}
	},

	getInvitationStatus: async (cohortId, email) => {
		try {
			const response = await apiCall(
				`/cohort/${cohortId}/invitation-status?email=${email}`,
			);
			return response;
		} catch (error) {
			return {
				success: false,
				message: error.error || "Failed to get invitation status",
			};
		}
	},
};

// Notifications APIs
export const notificationsAPI = {
	// Fetches all informational updates and status changes
	getNotifications: () => apiCall("/notifications"),
	// Placeholder for marking items as read
	markAsRead: (id) =>
		apiCall(`/notifications/${id}/read`, { method: "POST" }),
};

// Job Tray APIs
export const jobTrayAPI = {
	// Fetches the aggregated pending actions from the server
	getPendingJobs: () => apiCall("/job-tray"),
};

// Upload APIs
export const uploadAPI = {
	// Upload file (general purpose)
	uploadFile: (file, type) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", type);

		return fetch(`${API_BASE_URL}/upload/file`, {
			method: "POST",
			credentials: "include",
			body: formData,
		});
	},

	uploadProfilePicture: (file) => {
		if (USE_MOCK_API) {
			return Promise.resolve({
				ok: true,
				json: async () => ({ path: `avatars/mock_${file.name}` }),
			});
		}
		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", "0");
		return fetch(`${API_BASE_URL}/upload/file`, {
			method: "POST",
			credentials: "include",
			body: formData,
		});
	},
};

// Devkit APIs (for development/testing)
export const devkitAPI = {
	// Get devkit data
	getDevkitData: () => apiCall("/devkit"),

	// Create test data
	createTestData: (data) =>
		apiCall("/devkit/create-test-data", {
			method: "POST",
			body: JSON.stringify(data),
		}),
};

// Announcements APIs
export const announcementsAPI = {
	// Get all announcements for a cohort
	getAnnouncements: async (cohortId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const authUser = JSON.parse(
						localStorage.getItem("authUser") || "{}",
					);
					const userId = authUser.id || authUser.user_id || 1;

					const allData = getAnnouncementsFromStorage();

					// Only add default announcement if cohort doesn't exist in storage yet (first time)
					// Don't overwrite if it's just an empty array (user might have deleted all)
					if (!allData.hasOwnProperty(cohortId)) {
						allData[cohortId] = [
							createDefaultAnnouncement(cohortId),
						];
						saveAnnouncementsToStorage(allData);
					}

					// Auto-archive announcements older than 2 days on each fetch
					const announcements = allData[cohortId] || [];
					const now = new Date();
					const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);
					let hasChanges = false;

					announcements.forEach((announcement) => {
						const createdDate = new Date(announcement.created_at);
						if (
							createdDate < twoDaysAgo &&
							!announcement.is_archived
						) {
							announcement.is_archived = true;
							announcement.is_pinned = false; // Unpin archived announcements
							hasChanges = true;
						}

						// Set upvoted_by_current_user flag for each reply
						if (announcement.replies) {
							announcement.replies.forEach((reply) => {
								if (!reply.upvoted_by_user_ids) {
									reply.upvoted_by_user_ids = [];
								}
								reply.upvoted_by_current_user =
									reply.upvoted_by_user_ids.includes(userId);
								reply.upvotes =
									reply.upvoted_by_user_ids.length;
							});
						}
					});

					// Save if any announcements were archived
					if (hasChanges) {
						saveAnnouncementsToStorage(allData);
					}

					resolve({
						success: true,
						data: allData[cohortId] || [],
					});
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements`);
	},

	// Create new announcement (Professor only)
	createAnnouncement: async (cohortId, announcementData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();

					if (!allData[cohortId]) {
						allData[cohortId] = [];
					}

					const now = new Date();
					const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);

					// Auto-archive announcements older than 2 days and unpin them
					allData[cohortId].forEach((announcement) => {
						const createdDate = new Date(announcement.created_at);
						if (
							createdDate < twoDaysAgo &&
							!announcement.is_archived
						) {
							announcement.is_archived = true;
							announcement.is_pinned = false; // Unpin archived announcements
						}
					});

					// Create new announcement - always pinned by default
					const newAnnouncement = {
						id: Date.now(),
						...announcementData,
						author_name: "Prof. Jane Smith",
						author_id: 1,
						created_at: now.toISOString(),
						updated_at: now.toISOString(),
						is_pinned: true, // All new announcements are pinned
						is_archived: false,
						expiry_date: null,
						view_count: 0,
						replies_count: 0,
						replies: [],
					};

					// Add new announcement to the beginning of the array
					allData[cohortId] = [newAnnouncement, ...allData[cohortId]];
					saveAnnouncementsToStorage(allData);

					resolve({
						success: true,
						data: newAnnouncement,
					});
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements`, {
			method: "POST",
			body: JSON.stringify(announcementData),
		});
	},

	// Update announcement (Professor only)
	updateAnnouncement: async (cohortId, announcementId, announcementData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const index = announcements.findIndex(
						(a) => a.id === announcementId,
					);
					if (index !== -1) {
						announcements[index] = {
							...announcements[index],
							...announcementData,
							updated_at: new Date().toISOString(),
						};
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: announcements[index],
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements/${announcementId}`, {
			method: "PUT",
			body: JSON.stringify(announcementData),
		});
	},

	// Delete announcement (Professor only)
	deleteAnnouncement: async (cohortId, announcementId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const index = announcements.findIndex(
						(a) => a.id === announcementId,
					);
					if (index !== -1) {
						announcements.splice(index, 1);
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							message: "Announcement deleted successfully",
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(`/cohort/${cohortId}/announcements/${announcementId}`, {
			method: "DELETE",
		});
	},

	// Pin/Unpin announcement (Professor only)
	togglePinAnnouncement: async (cohortId, announcementId, isPinned) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement) {
						// If pinning this announcement, unpin all others
						if (isPinned) {
							announcements.forEach((a) => {
								if (a.id !== announcementId) {
									a.is_pinned = false;
								}
							});
						}
						announcement.is_pinned = isPinned;
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: announcement,
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/pin`,
			{
				method: "PATCH",
				body: JSON.stringify({ is_pinned: isPinned }),
			},
		);
	},

	// Archive announcement (Professor only)
	archiveAnnouncement: async (cohortId, announcementId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement) {
						announcement.is_archived = true;
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: announcement,
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/archive`,
			{
				method: "PATCH",
			},
		);
	},

	// Add reply to announcement thread
	addReply: async (cohortId, announcementId, replyData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement) {
						const newReply = {
							id: Date.now(),
							...replyData,
							created_at: new Date().toISOString(),
							updated_at: new Date().toISOString(),
							upvotes: 0,
							upvoted_by_user_ids: [], // Track who upvoted this reply
							upvoted_by_current_user: false,
							is_official: replyData.is_official || false,
						};
						if (!announcement.replies) {
							announcement.replies = [];
						}
						announcement.replies.push(newReply);
						announcement.replies_count =
							announcement.replies.length;
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: newReply,
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies`,
			{
				method: "POST",
				body: JSON.stringify(replyData),
			},
		);
	},

	// Update reply
	updateReply: async (cohortId, announcementId, replyId, replyData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement && announcement.replies) {
						const reply = announcement.replies.find(
							(r) => r.id === replyId,
						);
						if (reply) {
							Object.assign(reply, replyData, {
								updated_at: new Date().toISOString(),
							});
							saveAnnouncementsToStorage(allData);
							resolve({
								success: true,
								data: reply,
							});
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies/${replyId}`,
			{
				method: "PUT",
				body: JSON.stringify(replyData),
			},
		);
	},

	// Delete reply
	deleteReply: async (cohortId, announcementId, replyId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement && announcement.replies) {
						const index = announcement.replies.findIndex(
							(r) => r.id === replyId,
						);
						if (index !== -1) {
							announcement.replies.splice(index, 1);
							announcement.replies_count =
								announcement.replies.length;
							saveAnnouncementsToStorage(allData);
							resolve({
								success: true,
								message: "Reply deleted successfully",
							});
							return;
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies/${replyId}`,
			{
				method: "DELETE",
			},
		);
	},

	// Upvote a reply/question
	upvoteReply: async (cohortId, announcementId, replyId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const authUser = JSON.parse(
						localStorage.getItem("authUser") || "{}",
					);
					const userId = authUser.id || authUser.user_id || 1;

					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement && announcement.replies) {
						const reply = announcement.replies.find(
							(r) => r.id === replyId,
						);
						if (reply) {
							// Initialize upvoted_by_user_ids array if it doesn't exist
							if (!reply.upvoted_by_user_ids) {
								reply.upvoted_by_user_ids = [];
							}

							const userIndex =
								reply.upvoted_by_user_ids.indexOf(userId);

							// Toggle upvote
							if (userIndex > -1) {
								// User already upvoted, remove upvote
								reply.upvoted_by_user_ids.splice(userIndex, 1);
							} else {
								// User hasn't upvoted, add upvote
								reply.upvoted_by_user_ids.push(userId);
							}

							// Update upvote count and current user status
							reply.upvotes = reply.upvoted_by_user_ids.length;
							reply.upvoted_by_current_user =
								reply.upvoted_by_user_ids.includes(userId);

							saveAnnouncementsToStorage(allData);
							resolve({
								success: true,
								data: reply,
							});
							return;
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/replies/${replyId}/upvote`,
			{
				method: "POST",
			},
		);
	},

	// Lock/Unlock thread (Professor only)
	toggleLockThread: async (cohortId, announcementId, isLocked) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getAnnouncementsFromStorage();
					const announcements = allData[cohortId] || [];
					const announcement = announcements.find(
						(a) => a.id === announcementId,
					);
					if (announcement) {
						announcement.is_locked = isLocked;
						saveAnnouncementsToStorage(allData);
						resolve({
							success: true,
							data: announcement,
						});
					} else {
						resolve({
							success: false,
							message: "Announcement not found",
						});
					}
				}, 300);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/announcements/${announcementId}/lock`,
			{
				method: "PATCH",
				body: JSON.stringify({ is_locked: isLocked }),
			},
		);
	},
};

// LocalStorage helpers for announcements
const ANNOUNCEMENTS_STORAGE_KEY = "funkey_announcements";

const loadAnnouncementsFromStorage = () => {
	try {
		const stored = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
		const parsed = stored ? JSON.parse(stored) : null;
		return parsed;
	} catch (error) {
		console.error("❌ Error loading announcements from storage:", error);
		return null;
	}
};

const saveAnnouncementsToStorage = (announcements) => {
	try {
		localStorage.setItem(
			ANNOUNCEMENTS_STORAGE_KEY,
			JSON.stringify(announcements),
		);
	} catch (error) {
		console.error("❌ Error saving announcements to storage:", error);
	}
};

// Default announcement template for all courses
const createDefaultAnnouncement = (cohortId, courseName = "this course") => ({
	id: Date.now() + cohortId,
	title: "Welcome to the Course!",
	content: `Welcome to ${courseName}! This is your course announcement board. Your instructor will post important updates, assignment deadlines, exam schedules, and other course-related information here. Make sure to check regularly for new announcements.`,
	tags: ["General"],
	priority: null,
	is_pinned: true,
	is_archived: false,
	is_locked: false,
	expiry_date: null,
	author_name: "Course Instructor",
	author_id: 1,
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
	view_count: 0,
	replies_count: 0,
	replies: [],
});

// General Chat APIs
export const generalChatAPI = {
	// Get all chat messages for a cohort
	getMessages: async (cohortId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getChatMessagesFromStorage();

					// Initialize with empty array if first time
					if (!allData.hasOwnProperty(cohortId)) {
						allData[cohortId] = [];
						saveChatMessagesToStorage(allData);
					}

					resolve({
						success: true,
						data: allData[cohortId] || [],
					});
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/chat`);
	},

	// Send a chat message
	sendMessage: async (cohortId, messageData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getChatMessagesFromStorage();

					const newMessage = {
						id: Date.now(),
						...messageData,
						created_at: new Date().toISOString(),
					};

					if (!allData[cohortId]) {
						allData[cohortId] = [];
					}
					allData[cohortId].push(newMessage);
					saveChatMessagesToStorage(allData);

					resolve({
						success: true,
						data: newMessage,
					});
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/chat`, {
			method: "POST",
			body: JSON.stringify(messageData),
		});
	},

	// Delete a chat message (optional - for professors/message owners)
	deleteMessage: async (cohortId, messageId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getChatMessagesFromStorage();
					const messages = allData[cohortId] || [];
					const index = messages.findIndex((m) => m.id === messageId);

					if (index !== -1) {
						messages.splice(index, 1);
						saveChatMessagesToStorage(allData);
						resolve({
							success: true,
							message: "Message deleted successfully",
						});
					} else {
						resolve({
							success: false,
							message: "Message not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/chat/${messageId}`, {
			method: "DELETE",
		});
	},
};

// Student Discussions APIs
export const studentDiscussionsAPI = {
	// Get all discussions for a cohort
	getDiscussions: async (cohortId, userId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();

					if (!allData.hasOwnProperty(cohortId)) {
						allData[cohortId] = [];
						saveDiscussionsToStorage(allData);
					}

					const discussions = allData[cohortId] || [];
					let needsSave = false;

					// Auto-archive discussions older than 2 days
					const twoDaysAgo = new Date();
					twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

					discussions.forEach((discussion) => {
						const createdDate = new Date(discussion.created_at);
						if (
							createdDate < twoDaysAgo &&
							!discussion.is_archived
						) {
							discussion.is_archived = true;
							needsSave = true;
						}
					});

					// Migrate old data and set liked_by_current_user flag for each discussion and reply based on userId
					discussions.forEach((discussion) => {
						// Migrate old format to new format
						if (!discussion.liked_by_user_ids) {
							discussion.liked_by_user_ids = [];
							// If there was an old liked_by_current_user flag set to true, we can't know which user it was
							// so we'll just start fresh
							discussion.likes_count = 0;
							needsSave = true;
						}

						// Ensure likes_count matches the array length
						discussion.likes_count =
							discussion.liked_by_user_ids.length;
						discussion.liked_by_current_user =
							discussion.liked_by_user_ids.includes(userId);

						// Also migrate and set for replies
						if (discussion.replies) {
							discussion.replies.forEach((reply) => {
								if (!reply.liked_by_user_ids) {
									reply.liked_by_user_ids = [];
									reply.likes_count = 0;
									needsSave = true;
								}

								// Ensure likes_count matches the array length
								reply.likes_count =
									reply.liked_by_user_ids.length;
								reply.liked_by_current_user =
									reply.liked_by_user_ids.includes(userId);
							});
						}
					});

					// Save if we migrated any data
					if (needsSave) {
						saveDiscussionsToStorage(allData);
					}

					resolve({
						success: true,
						data: discussions,
					});
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions`);
	},

	// Create a new discussion
	createDiscussion: async (cohortId, discussionData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();

					const newDiscussion = {
						id: Date.now(),
						...discussionData,
						created_at: new Date().toISOString(),
						likes_count: 0,
						liked_by_user_ids: [], // Track who liked this discussion
						liked_by_current_user: false,
						replies: [],
					};

					if (!allData[cohortId]) {
						allData[cohortId] = [];
					}
					allData[cohortId].unshift(newDiscussion);
					saveDiscussionsToStorage(allData);

					resolve({
						success: true,
						data: newDiscussion,
					});
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions`, {
			method: "POST",
			body: JSON.stringify(discussionData),
		});
	},

	// Delete a discussion (owner only)
	deleteDiscussion: async (cohortId, discussionId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const index = discussions.findIndex(
						(d) => d.id === discussionId,
					);

					if (index !== -1) {
						discussions.splice(index, 1);
						saveDiscussionsToStorage(allData);
						resolve({
							success: true,
							message: "Discussion deleted successfully",
						});
					} else {
						resolve({
							success: false,
							message: "Discussion not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions/${discussionId}`, {
			method: "DELETE",
		});
	},

	// Edit a discussion (owner only)
	editDiscussion: async (cohortId, discussionId, updatedData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const discussion = discussions.find(
						(d) => d.id === discussionId,
					);

					if (discussion) {
						// Update the discussion fields
						discussion.title =
							updatedData.title || discussion.title;
						discussion.content =
							updatedData.content || discussion.content;
						discussion.edited_at = new Date().toISOString();

						saveDiscussionsToStorage(allData);
						resolve({
							success: true,
							data: discussion,
							message: "Discussion updated successfully",
						});
					} else {
						resolve({
							success: false,
							message: "Discussion not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions/${discussionId}`, {
			method: "PUT",
			body: JSON.stringify(updatedData),
		});
	},

	// Like a discussion
	likeDiscussion: async (cohortId, discussionId, userId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const discussion = discussions.find(
						(d) => d.id === discussionId,
					);

					if (discussion) {
						// Initialize liked_by_user_ids array if it doesn't exist
						if (!discussion.liked_by_user_ids) {
							discussion.liked_by_user_ids = [];
						}

						const userIndex =
							discussion.liked_by_user_ids.indexOf(userId);

						if (userIndex > -1) {
							// User already liked it, so unlike it
							discussion.liked_by_user_ids.splice(userIndex, 1);
						} else {
							// User hasn't liked it yet, so add their like
							discussion.liked_by_user_ids.push(userId);
						}

						// Update the count based on unique user IDs
						discussion.likes_count =
							discussion.liked_by_user_ids.length;
						discussion.liked_by_current_user =
							discussion.liked_by_user_ids.includes(userId);

						saveDiscussionsToStorage(allData);
						resolve({
							success: true,
							data: discussion,
						});
					} else {
						resolve({
							success: false,
							message: "Discussion not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(`/cohort/${cohortId}/discussions/${discussionId}/like`, {
			method: "POST",
		});
	},

	// Add reply to discussion
	addReply: async (cohortId, discussionId, replyData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const discussion = discussions.find(
						(d) => d.id === discussionId,
					);

					if (discussion) {
						const newReply = {
							id: Date.now(),
							...replyData,
							created_at: new Date().toISOString(),
							likes_count: 0,
							liked_by_user_ids: [], // Track who liked this reply
							liked_by_current_user: false,
						};

						if (!discussion.replies) {
							discussion.replies = [];
						}
						discussion.replies.push(newReply);
						saveDiscussionsToStorage(allData);

						resolve({
							success: true,
							data: newReply,
						});
					} else {
						resolve({
							success: false,
							message: "Discussion not found",
						});
					}
				}, 200);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/discussions/${discussionId}/replies`,
			{
				method: "POST",
				body: JSON.stringify(replyData),
			},
		);
	},

	// Delete reply (owner only)
	deleteReply: async (cohortId, discussionId, replyId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const discussion = discussions.find(
						(d) => d.id === discussionId,
					);

					if (discussion && discussion.replies) {
						const index = discussion.replies.findIndex(
							(r) => r.id === replyId,
						);
						if (index !== -1) {
							discussion.replies.splice(index, 1);
							saveDiscussionsToStorage(allData);
							resolve({
								success: true,
								message: "Reply deleted successfully",
							});
							return;
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 200);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/discussions/${discussionId}/replies/${replyId}`,
			{
				method: "DELETE",
			},
		);
	},

	// Edit reply (owner only)
	editReply: async (cohortId, discussionId, replyId, updatedData) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const discussion = discussions.find(
						(d) => d.id === discussionId,
					);

					if (discussion && discussion.replies) {
						const reply = discussion.replies.find(
							(r) => r.id === replyId,
						);
						if (reply) {
							// Update the reply content
							reply.content =
								updatedData.content || reply.content;
							reply.edited_at = new Date().toISOString();

							saveDiscussionsToStorage(allData);
							resolve({
								success: true,
								data: reply,
								message: "Reply updated successfully",
							});
							return;
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 200);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/discussions/${discussionId}/replies/${replyId}`,
			{
				method: "PUT",
				body: JSON.stringify(updatedData),
			},
		);
	},

	// Like a reply
	likeReply: async (cohortId, discussionId, replyId, userId) => {
		if (USE_MOCK_API) {
			return new Promise((resolve) => {
				setTimeout(() => {
					const allData = getDiscussionsFromStorage();
					const discussions = allData[cohortId] || [];
					const discussion = discussions.find(
						(d) => d.id === discussionId,
					);

					if (discussion && discussion.replies) {
						const reply = discussion.replies.find(
							(r) => r.id === replyId,
						);
						if (reply) {
							// Initialize liked_by_user_ids array if it doesn't exist
							if (!reply.liked_by_user_ids) {
								reply.liked_by_user_ids = [];
							}

							const userIndex =
								reply.liked_by_user_ids.indexOf(userId);

							if (userIndex > -1) {
								// User already liked it, so unlike it
								reply.liked_by_user_ids.splice(userIndex, 1);
							} else {
								// User hasn't liked it yet, so add their like
								reply.liked_by_user_ids.push(userId);
							}

							// Update the count based on unique user IDs
							reply.likes_count = reply.liked_by_user_ids.length;
							reply.liked_by_current_user =
								reply.liked_by_user_ids.includes(userId);

							saveDiscussionsToStorage(allData);
							resolve({
								success: true,
								data: reply,
							});
							return;
						}
					}
					resolve({
						success: false,
						message: "Reply not found",
					});
				}, 200);
			});
		}
		return apiCall(
			`/cohort/${cohortId}/discussions/${discussionId}/replies/${replyId}/like`,
			{
				method: "POST",
			},
		);
	},
};

// LocalStorage helpers for chat
const CHAT_STORAGE_KEY = "funkey_general_chat";

const loadChatMessagesFromStorage = () => {
	try {
		const stored = localStorage.getItem(CHAT_STORAGE_KEY);
		const parsed = stored ? JSON.parse(stored) : null;
		return parsed;
	} catch (error) {
		console.error("❌ Error loading chat messages from storage:", error);
		return null;
	}
};

const saveChatMessagesToStorage = (messages) => {
	try {
		localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
	} catch (error) {
		console.error("❌ Error saving chat messages to storage:", error);
	}
};

const getChatMessagesFromStorage = () => {
	const stored = loadChatMessagesFromStorage();
	if (stored) return stored;

	// First time - initialize with empty object
	const initial = {};
	saveChatMessagesToStorage(initial);
	return initial;
};

// LocalStorage helpers for discussions
const DISCUSSIONS_STORAGE_KEY = "funkey_student_discussions";

const loadDiscussionsFromStorage = () => {
	try {
		const stored = localStorage.getItem(DISCUSSIONS_STORAGE_KEY);
		const parsed = stored ? JSON.parse(stored) : null;
		return parsed;
	} catch (error) {
		console.error("❌ Error loading discussions from storage:", error);
		return null;
	}
};

const saveDiscussionsToStorage = (discussions) => {
	try {
		localStorage.setItem(
			DISCUSSIONS_STORAGE_KEY,
			JSON.stringify(discussions),
		);
	} catch (error) {
		console.error("❌ Error saving discussions to storage:", error);
	}
};

const getDiscussionsFromStorage = () => {
	const stored = loadDiscussionsFromStorage();
	if (stored) return stored;

	// First time - initialize with empty object
	const initial = {};
	saveDiscussionsToStorage(initial);
	return initial;
};

// Helper to get current announcements from storage (always fresh)
const getAnnouncementsFromStorage = () => {
	const stored = loadAnnouncementsFromStorage();
	if (stored) return stored;

	// First time - initialize with empty object (cohorts added on first access)
	const initial = {};
	saveAnnouncementsToStorage(initial);
	return initial;
};

export const studentMeetingsAPI = {
	// Get all meeting requests for a specific cohort
	getMeetingRequests: (cohortId) =>
		apiCall(`/cohort/${cohortId}/student/meeting-requests`),

	// Get accepted meetings for a specific cohort
	getAcceptedMeetings: (cohortId) =>
		apiCall(`/cohort/${cohortId}/student/meetings`),

	// Create a new meeting request for a professor
	createMeetingRequest: (cohortId, meetingData) =>
		apiCall(`/cohort/${cohortId}/student/meeting-requests`, {
			method: "POST",
			body: JSON.stringify(meetingData),
		}),

	// Cancel a pending meeting request
	cancelMeetingRequest: (cohortId, requestId) =>
		apiCall(`/cohort/${cohortId}/student/meeting-requests/${requestId}`, {
			method: "DELETE",
		}),
};

// Schedule & Meetings APIs
export const scheduleAPI = {
	// Get professor's schedule, meetings, and pending requests
	getScheduleOverview: () => apiCall("/professor/schedule"),

	// Update office hours and weekly timetable
	updateSchedule: (scheduleData) =>
		apiCall("/professor/schedule", {
			method: "PUT",
			body: JSON.stringify(scheduleData),
		}),

	// Create a new meeting/event directly from the schedule view
	createMeeting: (meetingData) =>
		apiCall("/professor/meetings", {
			method: "POST",
			body: JSON.stringify(meetingData),
		}),

	// Accept a meeting request with venue/link details
	acceptMeetingRequest: (requestId, details) =>
		apiCall(`/professor/meetings/${requestId}/accept`, {
			method: "POST",
			body: JSON.stringify(details),
		}),

	// Reject a meeting request with a reason
	rejectMeetingRequest: (requestId, reason) =>
		apiCall(`/professor/meetings/${requestId}/reject`, {
			method: "POST",
			body: JSON.stringify({ reason }),
		}),

	// Propose a new time for a meeting request
	rescheduleMeetingRequest: (requestId, newDateTime) =>
		apiCall(`/professor/meetings/${requestId}/reschedule`, {
			method: "POST",
			body: JSON.stringify({ newDateTime }),
		}),
};

// Library APIs
export const libraryAPI = {
	// Retrieves library dashboard data
	getLibraryDashboard: () => apiCall("/library/dashboard"),

	// Requests a book from the library
	requestBook: (bookId, durationDays) =>
		apiCall("/library/request", {
			method: "POST",
			body: JSON.stringify({ bookId, durationDays }),
		}),

	// Cancels an existing request
	cancelRequest: (requestId) =>
		apiCall(`/library/requests/${requestId}`, { method: "DELETE" }),

	// Initiates a return process for a borrowed book
	returnBook: (bookId) =>
		apiCall("/library/return", {
			method: "POST",
			body: JSON.stringify({ bookId }),
		}),

	// Extends the due date of a borrowed book
	requestExtension: (bookId, additionalDays) =>
		apiCall("/library/extend", {
			method: "POST",
			body: JSON.stringify({ bookId, additionalDays }),
		}),

	// Add to your existing libraryAPI object
	approveExtension: (requestId, bookId, additionalDays) =>
		apiCall("/library/approve-extension", {
			method: "POST",
			body: JSON.stringify({ requestId, bookId, additionalDays }),
		}),
};

// Maintenance Requests APIs
export const maintenanceAPI = {
	// Retrieves all maintenance requests
	getMyRequests: () => apiCall("/maintenance/my-requests", { method: "GET" }),

	// Submits a new maintenance request
	createRequest: (requestData) =>
		apiCall("/maintenance/requests", {
			method: "POST",
			body: JSON.stringify(requestData),
		}),

	// Updates the status of an existing maintenance request
	updateStatus: (requestId, statusData) =>
		apiCall(`/maintenance/requests/${requestId}/status`, {
			method: "PATCH",
			body: JSON.stringify(statusData),
		}),
};

// Session Planning APIs
export const sessionPlanningAPI = {
	// Fetches all course schedules for the user
	getSchedules: () => apiCall("/sessions/schedules"),

	// Fetches classes scheduled specifically for the current day
	getTodaysClasses: () => apiCall("/sessions/today"),

	// Submits teacher reflections for a specific session
	saveReflection: (data) =>
		apiCall("/sessions/reflections", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// Retrieves reflections, optionally filtered by section
	getReflections: (sectionId) =>
		apiCall(
			`/sessions/reflections${sectionId ? `?sectionId=${sectionId}` : ""}`,
		),

	// Retrieves uploaded documents (Syllabus, Lesson Plans, etc.) for a course
	getDocuments: (courseId) => apiCall(`/sessions/documents/${courseId}`),

	// Upload documents for a course
	uploadDocuments: (courseId, filesMap) => {
		// Extract names to pass to mock handler
		const fileNames = {};
		Object.keys(filesMap).forEach((key) => {
			fileNames[key] = filesMap[key].name;
		});

		return apiCall(`/sessions/documents/${courseId}/bulk`, {
			method: "POST",
			body: JSON.stringify({
				courseId,
				docs: Object.keys(filesMap),
				fileNames: fileNames, // Added for mock realism
			}),
		});
	},
};

// Mentoring APIs
export const mentoringAPI = {
	// Fetches students assigned to the logged-in mentor
	getAssignedMentees: () => apiCall("/mentoring/mentor/students"),

	// Mark the student's attendance for a meeting
	updateMeetingAttendance: (id, attendanceData) =>
		apiCall(`/mentoring/meetings/attendance/${id}`, {
			method: "POST",
			body: JSON.stringify(attendanceData),
		}),

	// Finalizes the meeting with discussion summary, action items, and evaluation
	submitMeetingNotes: (id, feedbackData) =>
		apiCall(`/mentoring/meetings/complete/${id}`, {
			method: "POST",
			body: JSON.stringify(feedbackData),
		}),
};

// Document Request APIs
export const documentRequestAPI = {
	// Fetches all student requests, processing queue items, and admin contacts
	getDocRequests: () => apiCall("/documents/all"),

	// Responds to the student request - "Rejected" (with reason) or "Under Review"
	respondToStudentRequest: (requestId, status, reason = null) =>
		apiCall(`/documents/status/${requestId}`, {
			method: "POST",
			body: JSON.stringify({ status, reason }),
		}),

	// Uploads the signed LOR to the Registrar
	// submissionData includes: { lorFile, registrarNote, studentInfo: { requestId } }
	submitToRegistrar: (submissionData) =>
		apiCall("/documents/registrar/process", {
			method: "POST",
			body: JSON.stringify(submissionData),
		}),

	// Registrar-only action to upload the stamped/approved version
	registrarUploadApproved: (lorId, approvedDocument) =>
		apiCall(`/documents/registrar/upload/${lorId}`, {
			method: "POST",
			body: JSON.stringify({ approvedDocument }),
		}),

	// Sends the Registrar-approved doc to the student
	dispatchToStudent: (lorId) =>
		apiCall(`/documents/registrar/send/${lorId}`, {
			method: "POST",
			body: JSON.stringify({ sentToStudent: true }),
		}),
};

// Asset Requests APIs
export const assetAPI = {
	// Retrieves the list of all campus assets
	getAssets: () => apiCall("/assets/list"),

	// Retrieves booking requests associated with the user
	getRequests: () => apiCall("/assets/requests"),

	// Creates a new asset booking request
	createRequest: (requestData) =>
		apiCall("/assets/requests", {
			method: "POST",
			body: JSON.stringify(requestData),
		}),

	// Updates an existing asset booking request
	updateRequest: (requestId, requestData) =>
		apiCall(`/assets/requests/${requestId}`, {
			method: "PUT",
			body: JSON.stringify(requestData),
		}),
};

// Attendance APIs
export const attendanceAPI = {
	// Fetches attendance logs for the professor
	getProfessorLogs: () => apiCall("/professor/logs"),

	// Fetches attendance logs for a specific cohort.
	getAttendanceLogs: (cohortId) => apiCall(`/attendance/logs/${cohortId}`),

	// Marks attendance for a specific course.
	markAttendance: (courseId, data) =>
		apiCall(`/courses/${courseId}/attendance`, {
			method: "POST",
			body: JSON.stringify(data),
		}),
};

// Expenses APIs
export const expensesAPI = {
	// Retrieves the list of all expenses
	getExpenses: () => apiCall("/expenses/list"),

	// Submits a new expense report
	createExpense: (expenseData) =>
		apiCall("/expenses/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(expenseData),
		}),

	// Updates an existing expense record.
	updateExpense: (expenseId, expenseData) =>
		apiCall(`/expenses/${expenseId}/update`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(expenseData),
		}),

	// Deletes a specific expense record
	deleteExpense: (expenseId) =>
		apiCall(`/expenses/${expenseId}`, {
			method: "DELETE",
		}),
};

// Advances APIs
export const advancesAPI = {
	// Retrieves the list of all advances
	getAdvances: () => apiCall("/advances/list"),

	// Submits a new advance request
	createAdvance: (advanceData) =>
		apiCall("/advances/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(advanceData),
		}),

	// Updates an existing advance request.
	updateAdvance: (advanceId, advanceData) =>
		apiCall(`/advances/${advanceId}/update`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(advanceData),
		}),

	// Deletes a specific advance request
	deleteAdvance: (advanceId) =>
		apiCall(`/advances/${advanceId}`, {
			method: "DELETE",
		}),
};

// Exam APIs
export const examAPI = {
	// Fetches the complete exam schedule for the user
	getDuties: () => apiCall("/exams/duties"),

	// Handles check-in or rejection status
	updateDutyStatus: (id, payload) =>
		apiCall("/exams/duty/status", {
			method: "POST",
			body: { id, ...payload },
		}),
};

// Leave Management APIs
export const leaveAPI = {
	// Retrieves the user's leave balance and history
	getApplications: () => apiCall("/leaves/applications"),

	// Submits a new leave application with structured timing data
	createApplication: (data) =>
		apiCall("/leaves/apply", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// Updates an existing leave application (used for resubmission or editing)
	updateApplication: (id, data) =>
		apiCall(`/leaves/update/${id}`, {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// Updates approval status by HoD or HR
	updateApproval: (id, role, action, remark = null) =>
		apiCall(`/leaves/approve/${id}`, {
			method: "POST",
			body: JSON.stringify({ role, action, remark }),
		}),

	// Responds to an incoming substitution request
	respondToSubstitution: (id, action) =>
		apiCall(`/leaves/substitutions/${id}`, {
			method: "POST",
			body: JSON.stringify({ action }),
		}),
};

// Payroll APIs
export const payrollAPI = {
	// Retrieves payroll history and details for the user
	getHistory: () => apiCall("/payroll/history"),

	// Retrieves the breakdown of the current month's salary
	getBreakdown: () => apiCall("/payroll/breakdown"),

	// Updated to accept the full item object for PDF generation
	downloadPayslip: (item) => apiCall(`/payroll/download/${item.id}`),
};

// Bulletin APIs
export const bulletinAPI = {
	// Fetches bulletins based on level (institution, department, course)
	getBulletins: (params = {}) => {
		const query = new URLSearchParams(params).toString();
		return apiCall(`/bulletins${query ? `?${query}` : ""}`);
	},

	// Creates a new bulletin with priority and attachment support
	createBulletin: (data) =>
		apiCall("/bulletins", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// Deletes a specific bulletin
	deleteBulletin: (bulletinId) =>
		apiCall(`/bulletins/${bulletinId}`, {
			method: "DELETE",
		}),
};

// Research & Publications APIs
export const researchAPI = {
	// Aggregates all research data (projects, publications, and applications) into one response
	getResearchDashboard: () => apiCall("/research/dashboard-sync"),

	// Handles creation of new research entries
	createResearch: (data) =>
		apiCall("/research/create", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// Handles updates to existing research entries
	updateResearch: (id, data) =>
		apiCall(`/research/update/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),

	// API calls for managing specific roles within a research item.
	createRole: (researchId, roleData) =>
		apiCall(`/research/${researchId}/roles/create`, {
			method: "POST",
			body: JSON.stringify(roleData),
		}),

	updateRole: (researchId, roleIndex, roleData) =>
		apiCall(`/research/${researchId}/roles/update/${roleIndex}`, {
			method: "PUT",
			body: JSON.stringify(roleData),
		}),

	// Deletes an open role
	deleteRole: (researchId, roleId) =>
		apiCall(`/research/${researchId}/roles/delete/${roleId}`, {
			method: "DELETE",
		}),

	// Timeline management for tracking project milestones and contributions chronologically
	getTimeline: (researchId) => apiCall(`/research/timeline/${researchId}`),

	addTimelineEvent: (researchId, eventData) =>
		apiCall(`/research/timeline/${researchId}`, {
			method: "POST",
			body: JSON.stringify(eventData),
		}),

	// Deletes a timeline event
	deleteTimelineEvent: (researchId, eventId) =>
		apiCall(`/research/timeline/${researchId}/${eventId}`, {
			method: "DELETE",
		}),

	// Updates an existing milestone in the timeline
	updateTimelineEvent: (researchId, eventId, eventData) =>
		apiCall(`/research/timeline/${researchId}/${eventId}`, {
			method: "PUT",
			body: JSON.stringify(eventData),
		}),

	// Request joining another project/publication
	newApplication: (id, data) =>
		apiCall(`/research/apply/${id}`, {
			method: "POST",
			body: JSON.stringify(data),
		}),

	// Handles application status changes
	handleApplication: (applicationId, action, details) =>
		apiCall(`/research/applications/${applicationId}/${action}`, {
			method: "POST",
			body: JSON.stringify(details),
		}),

	updateApplicationStatus: (applicationId, action, details) =>
		apiCall(`/research/applications/${applicationId}/${action}`, {
			method: "POST",
			body: JSON.stringify(details),
		}),

	// Toggles the starred status of a research project or publication.
	toggleStar: (id) =>
		apiCall(`/research/star/${id}`, {
			method: "POST",
		}),

	// Fetches user profiles to display contributors, applicants, and professors.
	getUsers: () => apiCall("/research/users"),

	getUserById: (userId) => apiCall(`/research/users/${userId}`),

	getUserProfile: (userId) => apiCall(`/research/users/profile/${userId}`),

	// Updates a user's profile information (bio, skills, and social URLs).
	updateUserProfile: (userId, profileData) =>
		apiCall(`/research/users/profile/update/${userId}`, {
			method: "PUT",
			body: JSON.stringify(profileData),
		}),
};

export default {
	userAPI,
	courseAPI,
	cohortAPI,
	notificationsAPI,
	uploadAPI,
	devkitAPI,
	announcementsAPI,
	generalChatAPI,
	studentDiscussionsAPI,
	scheduleAPI,
	studentMeetingsAPI,
	sessionPlanningAPI,
	libraryAPI,
	maintenanceAPI,
	mentoringAPI,
	documentRequestAPI,
	assetAPI,
	attendanceAPI,
	expensesAPI,
	advancesAPI,
	examAPI,
	leaveAPI,
	payrollAPI,
	bulletinAPI,
	researchAPI,
};
