// src/pages/AdvancedAnalytics/AdvancedAnalyticsController.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdvancedAnalyticsUI from "./AdvancedAnalyticsUI";
import { advancedAnalyticsService } from "../../api/services/advancedAnalytics.service";

const AdvancedAnalyticsController = ({ userRole }) => {
	const { tab } = useParams();
	const navigate = useNavigate();
	const activeTab = tab || "overview";

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const requiredTabs = [
		"overview",
		"students",
		"engagement",
		"trends",
	];

	useEffect(() => {
		document.title = "Advanced Analytics Engine";
	}, []);

	useEffect(() => {
		if (tab && !requiredTabs.includes(tab)) {
			navigate("/advanced-analytics/overview", { replace: true });
		} else {
			fetchData();
		}
	}, [tab]);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await advancedAnalyticsService.getDashboard();
			if (res.success) {
				setData(res.data);
			} else {
				setError("Failed to load analytics data.");
			}
		} catch (err) {
			setError("A connection error occurred.");
			console.error("Analytics fetch error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleTabChange = (newTab) => {
		navigate(`/advanced-analytics/${newTab}`);
	};

	return (
		<AdvancedAnalyticsUI
			data={data}
			activeTab={activeTab}
			onTabChange={handleTabChange}
			userRole={userRole}
			loading={loading}
			error={error}
			onRefresh={fetchData}
		/>
	);
};

export default AdvancedAnalyticsController;
