// src/pages/ResearchStrategy/ResearchStrategyController.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResearchStrategyUI from "./ResearchStrategyUI";

/* ─── Mock data ─── */
const MOCK_DATA = {
	summary: {
		totalClusters: 6,
		activeCrossProjects: 11,
		totalFunding: "₹4.8 Cr",
		totalPublications: 142,
		avgCitationScore: 18.4,
		hIndexAvg: 14,
		grantUtilization: 76,
	},
	clusters: [
		{
			id: "cl1", name: "AI & Machine Learning Hub", leadDept: "CSE",
			members: ["CSE", "Mathematics", "Psychology"], faculty: 14,
			activeProjects: 4, fundsAllocated: 12000000, fundsUsed: 9200000,
			publications: 32, citations: 480, status: "Active",
			journals: ["IEEE Transactions", "Nature ML", "JMLR"],
		},
		{
			id: "cl2", name: "Quantum Computing Research", leadDept: "Physics",
			members: ["Physics", "CSE", "Mathematics"], faculty: 8,
			activeProjects: 2, fundsAllocated: 8000000, fundsUsed: 5100000,
			publications: 14, citations: 210, status: "Active",
			journals: ["Physical Review Letters", "npj Quantum Information"],
		},
		{
			id: "cl3", name: "Sustainable Engineering", leadDept: "Civil",
			members: ["Civil", "Mech", "Chemical"], faculty: 11,
			activeProjects: 3, fundsAllocated: 6500000, fundsUsed: 4800000,
			publications: 28, citations: 310, status: "Active",
			journals: ["Sustainable Energy", "Renewable & Sustainable Energy Reviews"],
		},
		{
			id: "cl4", name: "Biomedical Innovation Lab", leadDept: "Biotech",
			members: ["Biotech", "Chemistry", "ECE"], faculty: 9,
			activeProjects: 2, fundsAllocated: 9000000, fundsUsed: 6200000,
			publications: 21, citations: 390, status: "Active",
			journals: ["Biomaterials", "Nature Biomedical Engineering"],
		},
		{
			id: "cl5", name: "FinTech & Policy Research", leadDept: "Management",
			members: ["Management", "CSE", "Economics"], faculty: 6,
			activeProjects: 1, fundsAllocated: 3000000, fundsUsed: 1800000,
			publications: 9, citations: 88, status: "Forming",
			journals: ["Journal of Finance", "Financial Innovation"],
		},
		{
			id: "cl6", name: "Smart Cities & IoT", leadDept: "ECE",
			members: ["ECE", "CSE", "Civil", "Management"], faculty: 12,
			activeProjects: 3, fundsAllocated: 7500000, fundsUsed: 5400000,
			publications: 38, citations: 520, status: "Active",
			journals: ["IEEE IoT Journal", "Smart Cities"],
		},
	],
	crossProjects: [
		{ id: "cp1", title: "AI-Driven Drug Discovery", depts: ["Biotech", "CSE", "Chemistry"], pi: "Dr. Meera Joshi", coPI: "Dr. Anand K.", funding: 3500000, status: "Active", startDate: "2025-06-01", endDate: "2027-05-31", progress: 42 },
		{ id: "cp2", title: "Quantum-Safe Cryptography Protocol", depts: ["CSE", "Mathematics", "Physics"], pi: "Dr. Vikram Nair", coPI: "Dr. Sunita Rao", funding: 2800000, status: "Active", startDate: "2025-09-01", endDate: "2027-08-31", progress: 28 },
		{ id: "cp3", title: "Smart Grid Energy Optimization", depts: ["ECE", "Civil", "Mathematics"], pi: "Dr. Kavitha Nair", coPI: "Dr. Ravi Kumar", funding: 4200000, status: "Active", startDate: "2025-01-01", endDate: "2026-12-31", progress: 65 },
		{ id: "cp4", title: "FinTech Fraud Detection via ML", depts: ["Management", "CSE"], pi: "Prof. Shalini Menon", coPI: "Dr. Anand K.", funding: 1500000, status: "Active", startDate: "2026-01-01", endDate: "2027-06-30", progress: 18 },
		{ id: "cp5", title: "Urban Water Quality Monitoring IoT", depts: ["Civil", "ECE", "Chemistry"], pi: "Dr. Suresh Babu", coPI: "Dr. Kavitha Nair", funding: 2200000, status: "Active", startDate: "2025-11-01", endDate: "2027-04-30", progress: 35 },
	],
	grantStrategy: [
		{ id: "gs1", agency: "DST (Dept. of Science & Technology)", type: "SERB Core Research", amount: 8500000, cluster: "AI & ML Hub", status: "Awarded", year: 2025, dueDate: "2028-03-31" },
		{ id: "gs2", agency: "CSIR", type: "Extramural Research", amount: 4200000, cluster: "Biomedical Lab", status: "Awarded", year: 2025, dueDate: "2027-09-30" },
		{ id: "gs3", agency: "DBT", type: "Biotechnology Grant", amount: 6000000, cluster: "Biomedical Lab", status: "Under Review", year: 2026, dueDate: null },
		{ id: "gs4", agency: "MeitY", type: "Digital India R&D", amount: 5500000, cluster: "Smart Cities IoT", status: "Proposed", year: 2026, dueDate: null },
		{ id: "gs5", agency: "ISRO SAC", type: "Space Technology Application", amount: 3800000, cluster: "Quantum Computing", status: "Under Review", year: 2026, dueDate: null },
		{ id: "gs6", agency: "World Bank", type: "HEd Innovation", amount: 12000000, cluster: "Sustainable Eng.", status: "Proposed", year: 2026, dueDate: null },
	],
	publicationAnalytics: {
		byYear: [
			{ year: 2022, count: 98, citations: 820 },
			{ year: 2023, count: 118, citations: 1120 },
			{ year: 2024, count: 135, citations: 1480 },
			{ year: 2025, count: 142, citations: 1998 },
		],
		byDept: [
			{ dept: "CSE", publications: 48, citations: 780, hIndex: 18 },
			{ dept: "ECE", publications: 32, citations: 490, hIndex: 14 },
			{ dept: "Biotech", publications: 21, citations: 390, hIndex: 12 },
			{ dept: "Civil", publications: 18, citations: 280, hIndex: 10 },
			{ dept: "Physics", publications: 14, citations: 210, hIndex: 13 },
			{ dept: "Mathematics", publications: 9, citations: 140, hIndex: 9 },
		],
		topJournals: [
			{ name: "IEEE Transactions on Neural Networks", impact: 10.4, papers: 8 },
			{ name: "Nature Machine Intelligence", impact: 25.9, papers: 3 },
			{ name: "Renewable & Sustainable Energy Reviews", impact: 16.8, papers: 6 },
			{ name: "npj Quantum Information", impact: 9.9, papers: 4 },
			{ name: "Biomaterials", impact: 14.0, papers: 5 },
		],
	},
};

const VALID_TABS = ["overview", "clusters", "cross-projects", "grants", "publications"];

const ResearchStrategyController = ({ userRole }) => {
	const { tab } = useParams();
	const navigate = useNavigate();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState(VALID_TABS.includes(tab) ? tab : "overview");

	useEffect(() => { document.title = "Research Strategy & Intelligence"; fetchData(); }, []);
	useEffect(() => { setActiveTab(VALID_TABS.includes(tab) ? tab : "overview"); }, [tab]);

	const fetchData = async () => {
		try {
			setLoading(true); setError(null);
			await new Promise((r) => setTimeout(r, 600));
			setData(MOCK_DATA);
		} catch (err) {
			setError("Failed to load research strategy data.");
		} finally { setLoading(false); }
	};

	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
		navigate(`/research-strategy/${tabId}`, { replace: true });
	};

	return (
		<ResearchStrategyUI
			data={data} loading={loading} error={error}
			activeTab={activeTab} onTabChange={handleTabChange} onRefresh={fetchData}
		/>
	);
};

export default ResearchStrategyController;
