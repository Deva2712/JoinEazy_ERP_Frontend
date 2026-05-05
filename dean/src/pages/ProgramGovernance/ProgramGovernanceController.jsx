// src/pages/ProgramGovernance/ProgramGovernanceController.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProgramGovernanceUI from "./ProgramGovernanceUI";
import { programGovernanceService } from "../../api/services/programGovernance.service";

/* ─── Mock data (replaces backend until API is live) ─── */
const MOCK_DATA = {
	summary: {
		totalPrograms: 18,
		activeProposals: 4,
		approvedThisYear: 3,
		discontinuedPrograms: 1,
		avgIntakeFill: 87,
	},
	programs: [
		{ id: "p1", name: "B.Tech Computer Science & Engineering", degree: "B.Tech", dept: "CSE", status: "Active", year: 2019, intakeCapacity: 120, enrolled: 112, placementRate: 94, passRate: 91 },
		{ id: "p2", name: "B.Tech Electronics & Communication", degree: "B.Tech", dept: "ECE", status: "Active", year: 2019, intakeCapacity: 60, enrolled: 54, placementRate: 88, passRate: 89 },
		{ id: "p3", name: "M.Tech Artificial Intelligence", degree: "M.Tech", dept: "CSE", status: "Active", year: 2021, intakeCapacity: 30, enrolled: 28, placementRate: 97, passRate: 95 },
		{ id: "p4", name: "MBA Technology Management", degree: "MBA", dept: "Management", status: "Active", year: 2020, intakeCapacity: 60, enrolled: 49, placementRate: 82, passRate: 87 },
		{ id: "p5", name: "B.Tech Civil Engineering", degree: "B.Tech", dept: "Civil", status: "Active", year: 2019, intakeCapacity: 60, enrolled: 45, placementRate: 72, passRate: 85 },
		{ id: "p6", name: "B.Sc Data Science", degree: "B.Sc", dept: "Mathematics", status: "Launching", year: 2026, intakeCapacity: 40, enrolled: 0, placementRate: null, passRate: null },
		{ id: "p7", name: "Ph.D Machine Learning", degree: "Ph.D", dept: "CSE", status: "Active", year: 2018, intakeCapacity: 10, enrolled: 9, placementRate: 100, passRate: 100 },
		{ id: "p8", name: "B.Tech Mechanical Engineering", degree: "B.Tech", dept: "Mech", status: "Discontinued", year: 2019, intakeCapacity: 60, enrolled: 0, placementRate: 68, passRate: 80 },
	],
	proposals: [
		{ id: "pr1", title: "M.Tech Cybersecurity", proposedBy: "Dr. Ramesh Iyer", dept: "CSE", stage: "Review", submittedDate: "2026-02-14", reviewDate: "2026-04-20", interdisciplinary: false, depts: ["CSE"] },
		{ id: "pr2", title: "B.Tech Biomedical Engineering", proposedBy: "Dr. Sunita Rao", dept: "Biotech", stage: "Proposal", submittedDate: "2026-03-10", reviewDate: null, interdisciplinary: false, depts: ["Biotech"] },
		{ id: "pr3", title: "M.Sc Quantum Computing", proposedBy: "Prof. Vikram Nair", dept: "Physics", stage: "Approval", submittedDate: "2026-01-22", reviewDate: "2026-03-15", interdisciplinary: true, depts: ["Physics", "CSE", "Mathematics"] },
		{ id: "pr4", title: "MBA Healthcare Administration", proposedBy: "Dr. Priya Menon", dept: "Management", stage: "Launch", submittedDate: "2025-11-01", reviewDate: "2026-01-10", interdisciplinary: false, depts: ["Management"] },
	],
	intakeData: [
		{ program: "B.Tech CSE", capacity: 120, enrolled: 112, fillPct: 93, trend: "+3%" },
		{ program: "B.Tech ECE", capacity: 60, enrolled: 54, fillPct: 90, trend: "+2%" },
		{ program: "M.Tech AI", capacity: 30, enrolled: 28, fillPct: 93, trend: "+5%" },
		{ program: "MBA Tech Mgmt", capacity: 60, enrolled: 49, fillPct: 82, trend: "-4%" },
		{ program: "B.Tech Civil", capacity: 60, enrolled: 45, fillPct: 75, trend: "-8%" },
		{ program: "Ph.D ML", capacity: 10, enrolled: 9, fillPct: 90, trend: "0%" },
	],
	interdisciplinaryPrograms: [
		{ id: "id1", name: "M.Sc Quantum Computing", leadDept: "Physics", partnerDepts: ["CSE", "Mathematics"], students: 0, status: "Approval", proposalId: "pr3" },
		{ id: "id2", name: "B.Tech AI & Cognitive Science", leadDept: "CSE", partnerDepts: ["Psychology", "Philosophy"], students: 24, status: "Active" },
		{ id: "id3", name: "M.Tech Smart Systems", leadDept: "ECE", partnerDepts: ["CSE", "Mech"], students: 18, status: "Active" },
	],
	insights: {
		demandTrends: [
			{ program: "M.Tech AI", applications: 312, seats: 30, ratio: 10.4, trend: "↑" },
			{ program: "B.Tech CSE", applications: 890, seats: 120, ratio: 7.4, trend: "↑" },
			{ program: "M.Sc Cybersecurity (Proposed)", applications: 270, seats: 30, ratio: 9.0, trend: "↑" },
			{ program: "MBA Tech Mgmt", applications: 188, seats: 60, ratio: 3.1, trend: "↓" },
			{ program: "B.Tech Civil", applications: 140, seats: 60, ratio: 2.3, trend: "↓" },
		],
		enrollmentGaps: [
			{ program: "B.Tech Civil", capacity: 60, enrolled: 45, gap: 15, gapPct: 25 },
			{ program: "MBA Tech Mgmt", capacity: 60, enrolled: 49, gap: 11, gapPct: 18 },
			{ program: "B.Tech ECE", capacity: 60, enrolled: 54, gap: 6, gapPct: 10 },
		],
		successRates: [
			{ program: "M.Tech AI", placement: 97, passRate: 95, score: 96 },
			{ program: "Ph.D ML", placement: 100, passRate: 100, score: 100 },
			{ program: "B.Tech CSE", placement: 94, passRate: 91, score: 92 },
			{ program: "B.Tech ECE", placement: 88, passRate: 89, score: 88 },
			{ program: "MBA Tech Mgmt", placement: 82, passRate: 87, score: 84 },
			{ program: "B.Tech Civil", placement: 72, passRate: 85, score: 78 },
		],
	},
};

const VALID_TABS = ["overview", "lifecycle", "intake", "interdisciplinary", "insights"];

const ProgramGovernanceController = ({ userRole }) => {
	const { tab } = useParams();
	const navigate = useNavigate();

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState(
		VALID_TABS.includes(tab) ? tab : "overview"
	);

	useEffect(() => {
		document.title = "Academic Program Governance";
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
			setError("Failed to load program governance data.");
			console.error("ProgramGovernance fetch error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
		navigate(`/program-governance/${tabId}`, { replace: true });
	};

	return (
		<ProgramGovernanceUI
			data={data}
			loading={loading}
			error={error}
			activeTab={activeTab}
			onTabChange={handleTabChange}
			onRefresh={fetchData}
		/>
	);
};

export default ProgramGovernanceController;
