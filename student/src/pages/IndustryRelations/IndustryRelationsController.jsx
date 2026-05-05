// src/pages/IndustryRelations/IndustryRelationsController.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IndustryRelationsUI from "./IndustryRelationsUI";
import { industryRelationsService } from "../../api/services/industryRelations.service";

const IndustryRelationsController = ({ userRole }) => {
	const { tab } = useParams();
	const navigate = useNavigate();
	const activeTab = tab || "overview";

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const requiredTabs = [
		"overview",
		"companies",
		"mous",
		"pipelines",
		"history",
	];

	useEffect(() => {
		document.title = "Industry & External Relations";
	}, []);

	useEffect(() => {
		if (tab && !requiredTabs.includes(tab)) {
			navigate("/industry-relations/overview", { replace: true });
		} else {
			fetchData();
		}
	}, [tab]);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await industryRelationsService.getDashboard();
			if (res.success) {
				setData(res.data);
			} else {
				setError("Failed to load industry relations data.");
			}
		} catch (err) {
			setError("A connection error occurred.");
			console.error("Industry relations fetch error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleTabChange = (newTab) => {
		navigate(`/industry-relations/${newTab}`);
	};

	return (
		<IndustryRelationsUI
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

export default IndustryRelationsController;
