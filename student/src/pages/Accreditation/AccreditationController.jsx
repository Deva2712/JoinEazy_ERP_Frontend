// src/pages/Accreditation/AccreditationController.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AccreditationUI from "./AccreditationUI";
import { accreditationService } from "../../api/services/accreditation.service";

const AccreditationController = ({ userRole }) => {
	const { tab } = useParams();
	const navigate = useNavigate();
	const activeTab = tab || "overview";

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const validTabs = ["overview", "criteria", "outcomes", "audits", "departments"];

	useEffect(() => { document.title = "Accreditation & Compliance"; }, []);

	useEffect(() => {
		if (tab && !validTabs.includes(tab)) {
			navigate("/accreditation/overview", { replace: true });
		} else {
			fetchData();
		}
	}, [tab]);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await accreditationService.getDashboard();
			if (res.success) setData(res.data);
			else setError("Failed to load accreditation data.");
		} catch (err) {
			setError("A connection error occurred.");
		} finally {
			setLoading(false);
		}
	};

	const handleTabChange = (newTab) => navigate(`/accreditation/${newTab}`);

	return (
		<AccreditationUI
			data={data}
			activeTab={activeTab}
			onTabChange={handleTabChange}
			loading={loading}
			error={error}
			onRefresh={fetchData}
		/>
	);
};

export default AccreditationController;
