// src/pages/CurriculumGovernance/CurriculumGovernanceController.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CurriculumGovernanceUI from "./CurriculumGovernanceUI";
import { curriculumGovernanceService } from "../../api/services/curriculumGovernance.service";

/* ─── Mock data (replaces backend until API is live) ─── */
const MOCK_DATA = {
	summary: {
		pendingApprovals: 7,
		approvedThisYear: 24,
		totalPOs: 12,
		mappedCOs: 89,
		avgCOAttainment: 73,
		compliancePct: 86,
	},
	workflows: [
		{ id: "wf1", title: "Add Elective: Deep Learning (CSE)", type: "New Elective", submittedBy: "Dr. Anand Krishnan", dept: "CSE", stage: "Dean Review", daysInStage: 3, submittedDate: "2026-04-10" },
		{ id: "wf2", title: "Revise Core: Engineering Mathematics III", type: "Curriculum Revision", submittedBy: "Prof. Lakshmi Devi", dept: "Mathematics", stage: "Board Approval", daysInStage: 12, submittedDate: "2026-03-28" },
		{ id: "wf3", title: "Remove Outdated Lab: Analog Electronics Lab", type: "Course Removal", submittedBy: "Dr. Suresh Babu", dept: "ECE", stage: "HOD Review", daysInStage: 1, submittedDate: "2026-04-15" },
		{ id: "wf4", title: "New Program Core: Cloud Computing", type: "New Core", submittedBy: "Dr. Meera Joshi", dept: "CSE", stage: "Academic Council", daysInStage: 5, submittedDate: "2026-04-08" },
		{ id: "wf5", title: "Restructure MBA Term 3", type: "Curriculum Revision", submittedBy: "Prof. Ravi Kumar", dept: "Management", stage: "Dean Review", daysInStage: 7, submittedDate: "2026-04-06" },
		{ id: "wf6", title: "Add Lab: IoT & Embedded Systems", type: "New Lab", submittedBy: "Dr. Kavitha Nair", dept: "ECE", stage: "HOD Review", daysInStage: 2, submittedDate: "2026-04-14" },
		{ id: "wf7", title: "Introduce Skill Elective: UX Design", type: "New Elective", submittedBy: "Prof. Shalini Menon", dept: "CSE", stage: "Approved", daysInStage: 0, submittedDate: "2026-03-15" },
	],
	poMapping: [
		{ poId: "PO1", description: "Engineering Knowledge", linkedCOs: [
			{ courseCode: "CS301", courseName: "Data Structures", contribution: "High" },
			{ courseCode: "CS401", courseName: "Algorithms", contribution: "High" },
			{ courseCode: "MA201", courseName: "Discrete Mathematics", contribution: "Medium" },
		]},
		{ poId: "PO2", description: "Problem Analysis", linkedCOs: [
			{ courseCode: "CS401", courseName: "Algorithms", contribution: "High" },
			{ courseCode: "CS501", courseName: "Machine Learning", contribution: "High" },
			{ courseCode: "EC301", courseName: "Signals & Systems", contribution: "Medium" },
		]},
		{ poId: "PO3", description: "Design / Development of Solutions", linkedCOs: [
			{ courseCode: "CS601", courseName: "Software Engineering", contribution: "High" },
			{ courseCode: "CS502", courseName: "Web Technologies", contribution: "Medium" },
			{ courseCode: "EC401", courseName: "VLSI Design", contribution: "High" },
		]},
		{ poId: "PO4", description: "Modern Tool Usage", linkedCOs: [
			{ courseCode: "CS502", courseName: "Web Technologies", contribution: "High" },
			{ courseCode: "CS503", courseName: "Cloud Computing", contribution: "High" },
			{ courseCode: "CS601", courseName: "Software Engineering", contribution: "Medium" },
		]},
		{ poId: "PO5", description: "Engineer & Society", linkedCOs: [
			{ courseCode: "HS301", courseName: "Professional Ethics", contribution: "High" },
			{ courseCode: "HS302", courseName: "Environmental Science", contribution: "Medium" },
		]},
		{ poId: "PO6", description: "Environment & Sustainability", linkedCOs: [
			{ courseCode: "HS302", courseName: "Environmental Science", contribution: "High" },
			{ courseCode: "EC302", courseName: "Green Electronics", contribution: "Medium" },
		]},
	],
	coAlignment: [
		{ courseCode: "CS301", courseName: "Data Structures", dept: "CSE", cos: [
			{ id: "CO1", description: "Implement fundamental data structures", attainmentPct: 82, target: 70 },
			{ id: "CO2", description: "Analyze time & space complexity", attainmentPct: 78, target: 70 },
			{ id: "CO3", description: "Apply structures to real problems", attainmentPct: 65, target: 70 },
		]},
		{ courseCode: "CS401", courseName: "Algorithms", dept: "CSE", cos: [
			{ id: "CO1", description: "Design efficient algorithms", attainmentPct: 74, target: 70 },
			{ id: "CO2", description: "Prove algorithm correctness", attainmentPct: 60, target: 70 },
			{ id: "CO3", description: "Apply graph & dynamic algorithms", attainmentPct: 71, target: 70 },
		]},
		{ courseCode: "CS501", courseName: "Machine Learning", dept: "CSE", cos: [
			{ id: "CO1", description: "Apply supervised learning models", attainmentPct: 88, target: 75 },
			{ id: "CO2", description: "Evaluate model performance metrics", attainmentPct: 85, target: 75 },
			{ id: "CO3", description: "Implement unsupervised clustering", attainmentPct: 76, target: 75 },
		]},
		{ courseCode: "EC301", courseName: "Signals & Systems", dept: "ECE", cos: [
			{ id: "CO1", description: "Analyze continuous-time signals", attainmentPct: 68, target: 70 },
			{ id: "CO2", description: "Apply Fourier & Laplace transforms", attainmentPct: 62, target: 70 },
		]},
		{ courseCode: "CS601", courseName: "Software Engineering", dept: "CSE", cos: [
			{ id: "CO1", description: "Apply SDLC methodologies", attainmentPct: 91, target: 75 },
			{ id: "CO2", description: "Write SRS & design documents", attainmentPct: 80, target: 75 },
			{ id: "CO3", description: "Conduct project testing & review", attainmentPct: 77, target: 75 },
		]},
	],
	accreditationSync: [
		{ framework: "NBA", criteria: "Program Specific Criteria (PSC)", linkedPOs: ["PO1", "PO2", "PO3"], coveragePct: 91, status: "Met" },
		{ framework: "NBA", criteria: "Program Outcomes & Course Outcomes", linkedPOs: ["PO1", "PO2", "PO3", "PO4", "PO5", "PO6"], coveragePct: 86, status: "Met" },
		{ framework: "NAAC", criteria: "Curriculum Design & Development (3.1)", linkedPOs: ["PO1", "PO2", "PO3", "PO4"], coveragePct: 78, status: "Partial" },
		{ framework: "NAAC", criteria: "Teaching-Learning Process (3.2)", linkedPOs: ["PO2", "PO3", "PO4"], coveragePct: 83, status: "Met" },
		{ framework: "ABET", criteria: "Student Outcomes (SO)", linkedPOs: ["PO1", "PO2", "PO3", "PO5", "PO6"], coveragePct: 72, status: "Partial" },
		{ framework: "ABET", criteria: "Continuous Improvement", linkedPOs: ["PO1", "PO2", "PO4"], coveragePct: 65, status: "At Risk" },
	],
};

const VALID_TABS = ["overview", "workflows", "po-mapping", "co-alignment", "compliance"];

const CurriculumGovernanceController = ({ userRole }) => {
	const { tab } = useParams();
	const navigate = useNavigate();

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState(
		VALID_TABS.includes(tab) ? tab : "overview"
	);

	useEffect(() => {
		document.title = "Curriculum Governance Engine";
		fetchData();
	}, []);

	useEffect(() => {
		const validated = VALID_TABS.includes(tab) ? tab : "overview";
		setActiveTab(validated);
	}, [tab]);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			// Use mock data — swap for real API when ready
			await new Promise((r) => setTimeout(r, 600));
			setData(MOCK_DATA);
		} catch (err) {
			setError("Failed to load curriculum governance data.");
			console.error("CurriculumGovernance fetch error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
		navigate(`/curriculum-governance/${tabId}`, { replace: true });
	};

	return (
		<CurriculumGovernanceUI
			data={data}
			loading={loading}
			error={error}
			activeTab={activeTab}
			onTabChange={handleTabChange}
			onRefresh={fetchData}
		/>
	);
};

export default CurriculumGovernanceController;
