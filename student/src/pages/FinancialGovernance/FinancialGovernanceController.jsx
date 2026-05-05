// src/pages/FinancialGovernance/FinancialGovernanceController.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FinancialGovernanceUI from "./FinancialGovernanceUI";

/* ─── Mock data ─── */
const MOCK_DATA = {
	summary: {
		totalBudget: "₹28.5 Cr",
		allocated: "₹22.1 Cr",
		utilized: "₹16.8 Cr",
		researchFunds: "₹6.2 Cr",
		scholarshipsDisbursed: "₹1.8 Cr",
		pendingApprovals: 5,
		utilizationPct: 76,
	},
	budgets: [
		{ dept: "CSE", allocated: 45000000, utilized: 38200000, remaining: 6800000, utilizationPct: 85, roi: 92, costPerStudent: 42000, trend: "+4%" },
		{ dept: "ECE", allocated: 32000000, utilized: 25600000, remaining: 6400000, utilizationPct: 80, roi: 84, costPerStudent: 38000, trend: "+2%" },
		{ dept: "Mech", allocated: 28000000, utilized: 19600000, remaining: 8400000, utilizationPct: 70, roi: 74, costPerStudent: 35000, trend: "-3%" },
		{ dept: "Civil", allocated: 22000000, utilized: 14300000, remaining: 7700000, utilizationPct: 65, roi: 68, costPerStudent: 32000, trend: "-6%" },
		{ dept: "Management", allocated: 18000000, utilized: 14400000, remaining: 3600000, utilizationPct: 80, roi: 88, costPerStudent: 48000, trend: "+5%" },
		{ dept: "Biotech", allocated: 20000000, utilized: 16000000, remaining: 4000000, utilizationPct: 80, roi: 79, costPerStudent: 55000, trend: "+1%" },
		{ dept: "Mathematics", allocated: 10000000, utilized: 7000000, remaining: 3000000, utilizationPct: 70, roi: 71, costPerStudent: 28000, trend: "0%" },
		{ dept: "Physics", allocated: 12000000, utilized: 8400000, remaining: 3600000, utilizationPct: 70, roi: 76, costPerStudent: 31000, trend: "+2%" },
	],
	researchFunds: [
		{ id: "rf1", cluster: "AI & ML Hub", totalAllocated: 12000000, utilized: 9200000, utilizationPct: 77, grants: ["DST-SERB: ₹85L", "Internal: ₹35L"], status: "On Track" },
		{ id: "rf2", cluster: "Biomedical Lab", totalAllocated: 9000000, utilized: 6200000, utilizationPct: 69, grants: ["CSIR: ₹42L", "DBT (pending): ₹60L"], status: "On Track" },
		{ id: "rf3", cluster: "Smart Cities IoT", totalAllocated: 7500000, utilized: 5400000, utilizationPct: 72, grants: ["MeitY (proposed): ₹55L"], status: "On Track" },
		{ id: "rf4", cluster: "Quantum Computing", totalAllocated: 8000000, utilized: 5100000, utilizationPct: 64, grants: ["ISRO SAC (review): ₹38L"], status: "Under-Utilized" },
		{ id: "rf5", cluster: "Sustainable Eng.", totalAllocated: 6500000, utilized: 4800000, utilizationPct: 74, grants: ["World Bank (proposed): ₹1.2Cr"], status: "On Track" },
	],
	infrastructure: [
		{ id: "inf1", project: "AI Research Computing Cluster (GPU Farm)", dept: "CSE", cost: 15000000, approved: 12000000, status: "Approved", completion: 60, category: "Computing" },
		{ id: "inf2", project: "Quantum Physics Lab Renovation", dept: "Physics", cost: 8000000, approved: 0, status: "Pending", completion: 0, category: "Lab" },
		{ id: "inf3", project: "Smart Building Automation — Block B", dept: "Facilities", cost: 5500000, approved: 5500000, status: "Approved", completion: 85, category: "Infrastructure" },
		{ id: "inf4", project: "BioTech Research Lab Expansion", dept: "Biotech", cost: 12000000, approved: 12000000, status: "Approved", completion: 30, category: "Lab" },
		{ id: "inf5", project: "EV Charging + Solar Microgrid", dept: "Civil", cost: 6000000, approved: 0, status: "Under Review", completion: 0, category: "Green" },
		{ id: "inf6", project: "Innovation & Incubation Centre", dept: "Management", cost: 20000000, approved: 18000000, status: "Approved", completion: 15, category: "Infrastructure" },
	],
	scholarships: [
		{ id: "sch1", name: "Merit Excellence Scholarship", category: "Merit", students: 24, disbursed: 4800000, status: "Active", criteria: "CGPA ≥ 9.0", cycle: "AY 2025-26" },
		{ id: "sch2", name: "Need-Based Financial Aid", category: "Need", students: 38, disbursed: 6080000, status: "Active", criteria: "Annual income < ₹3L", cycle: "AY 2025-26" },
		{ id: "sch3", name: "Research Scholarship (Ph.D)", category: "Research", students: 12, disbursed: 7200000, status: "Active", criteria: "Ph.D enrolled, SCI publications", cycle: "AY 2025-26" },
		{ id: "sch4", name: "SC/ST Govt. Aid", category: "Government", students: 51, disbursed: 5100000, status: "Active", criteria: "SC/ST category", cycle: "AY 2025-26" },
		{ id: "sch5", name: "Sports Achievement Award", category: "Achievement", students: 8, disbursed: 800000, status: "Active", criteria: "National/State level sports", cycle: "AY 2025-26" },
		{ id: "sch6", name: "Industry Sponsored — TCS Scholar", category: "Industry", students: 5, disbursed: 1500000, status: "Pending Approval", criteria: "CSE/ECE, GPA ≥ 8.5", cycle: "AY 2026-27" },
	],
	insights: {
		roiByDept: [
			{ dept: "CSE", roi: 92, costPerStudent: 42000, placementRate: 94 },
			{ dept: "Management", roi: 88, costPerStudent: 48000, placementRate: 82 },
			{ dept: "ECE", roi: 84, costPerStudent: 38000, placementRate: 88 },
			{ dept: "Biotech", roi: 79, costPerStudent: 55000, placementRate: 71 },
			{ dept: "Physics", roi: 76, costPerStudent: 31000, placementRate: 68 },
			{ dept: "Mech", roi: 74, costPerStudent: 35000, placementRate: 72 },
			{ dept: "Mathematics", roi: 71, costPerStudent: 28000, placementRate: 65 },
			{ dept: "Civil", roi: 68, costPerStudent: 32000, placementRate: 72 },
		],
		budgetVsOutcome: [
			{ year: "2022-23", budget: 210000000, revenue: 280000000, efficiency: 133 },
			{ year: "2023-24", budget: 235000000, revenue: 320000000, efficiency: 136 },
			{ year: "2024-25", budget: 258000000, revenue: 365000000, efficiency: 141 },
			{ year: "2025-26", budget: 285000000, revenue: 410000000, efficiency: 144 },
		],
	},
};

const VALID_TABS = ["overview", "budgets", "research-funds", "infrastructure", "scholarships"];

const FinancialGovernanceController = ({ userRole }) => {
	const { tab } = useParams();
	const navigate = useNavigate();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState(VALID_TABS.includes(tab) ? tab : "overview");

	useEffect(() => { document.title = "School Financial Governance"; fetchData(); }, []);
	useEffect(() => { setActiveTab(VALID_TABS.includes(tab) ? tab : "overview"); }, [tab]);

	const fetchData = async () => {
		try {
			setLoading(true); setError(null);
			await new Promise((r) => setTimeout(r, 600));
			setData(MOCK_DATA);
		} catch (err) {
			setError("Failed to load financial governance data.");
		} finally { setLoading(false); }
	};

	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
		navigate(`/financial-governance/${tabId}`, { replace: true });
	};

	return (
		<FinancialGovernanceUI
			data={data} loading={loading} error={error}
			activeTab={activeTab} onTabChange={handleTabChange} onRefresh={fetchData}
		/>
	);
};

export default FinancialGovernanceController;
