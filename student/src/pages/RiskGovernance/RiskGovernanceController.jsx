// src/pages/RiskGovernance/RiskGovernanceController.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RiskGovernanceUI from "./RiskGovernanceUI";
import { riskGovernanceService } from "../../api/services/riskGovernance.service";

const RiskGovernanceController = ({ userRole }) => {
	const navigate = useNavigate();

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [generatingReport, setGeneratingReport] = useState(null);

	useEffect(() => {
		document.title = "Risk & Governance";
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await riskGovernanceService.getDashboard();
			if (res.success) {
				setData(res.data);
			} else {
				setError("Failed to load risk & governance data.");
			}
		} catch (err) {
			setError("A connection error occurred.");
			console.error("Risk governance fetch error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleGenerateReport = async (reportId) => {
		setGeneratingReport(reportId);
		// Simulate report generation delay
		await new Promise((resolve) => setTimeout(resolve, 1800));
		setGeneratingReport(null);
	};

	return (
		<RiskGovernanceUI
			data={data}
			loading={loading}
			error={error}
			onRefresh={fetchData}
			generatingReport={generatingReport}
			onGenerateReport={handleGenerateReport}
		/>
	);
};

export default RiskGovernanceController;
