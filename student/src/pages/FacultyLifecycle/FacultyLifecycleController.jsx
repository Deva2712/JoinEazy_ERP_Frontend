// src/pages/FacultyLifecycle/FacultyLifecycleController.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FacultyLifecycleUI from "./FacultyLifecycleUI";
import { facultyLifecycleService } from "../../api/services/facultyLifecycle.service";

const FacultyLifecycleController = ({ userRole }) => {
	const { tab } = useParams();
	const navigate = useNavigate();
	const activeTab = tab || "overview";

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const validTabs = ["overview", "promotions", "sabbaticals", "tenure", "transfers"];

	useEffect(() => { document.title = "Faculty Lifecycle Control"; }, []);

	useEffect(() => {
		if (tab && !validTabs.includes(tab)) {
			navigate("/faculty-lifecycle/overview", { replace: true });
		} else {
			fetchData();
		}
	}, [tab]);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await facultyLifecycleService.getDashboard();
			if (res.success) setData(res.data);
			else setError("Failed to load faculty lifecycle data.");
		} catch (err) {
			setError("A connection error occurred.");
		} finally {
			setLoading(false);
		}
	};

	const handleTabChange = (newTab) => navigate(`/faculty-lifecycle/${newTab}`);

	return (
		<FacultyLifecycleUI
			data={data}
			activeTab={activeTab}
			onTabChange={handleTabChange}
			loading={loading}
			error={error}
			onRefresh={fetchData}
		/>
	);
};

export default FacultyLifecycleController;
