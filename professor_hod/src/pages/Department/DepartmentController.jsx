// src/pages/Department/DepartmentController.jsx

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDepartment } from "../../context/DepartmentContext";
import DepartmentUI from "./DepartmentUI";

const DepartmentController = ({ userRole }) => {
	const { tab } = useParams();
	const navigate = useNavigate();
	const { state, actions } = useDepartment();

	const { syncTabContext } = actions;
	const activeTab = tab || "overview";

	const requiredTabs = [
		"overview",
		"courses",
		"faculty",
		"students",
		"placements",
		"research",
	];

	useEffect(() => {
		document.title = `Department Management`;
	}, []);

	/**
	 * Single point of synchronization.
	 * When the 'tab' URL parameter changes, we validate it and
	 * tell the context to sync data for that specific view.
	 */
	useEffect(() => {
		if (tab && !requiredTabs.includes(tab)) {
			navigate(`/department/overview`, { replace: true });
		} else {
			syncTabContext(activeTab);
		}
	}, [tab, activeTab, navigate, syncTabContext]);

	const handleTabChange = (newTab) => {
		navigate(`/department/${newTab}`);
	};

	return (
		<DepartmentUI
			deptData={state.deptData}
			activeTab={activeTab}
			onTabChange={handleTabChange}
			userRole={userRole}
			loading={state.loading}
			error={state.error}
			onRefresh={() => syncTabContext(activeTab)}
		/>
	);
};

export default DepartmentController;
