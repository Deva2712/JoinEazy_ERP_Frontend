// src/pages/Maintenance/MaintenanceUI.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "../../context/JobTrayContext";
import { useNotifications } from "../../context/NotificationContext";
import { maintenanceService } from "../../api/services/maintenance.service";
import MaintenanceUI from "./MaintenanceUI";

/**
 * MaintenanceController
 * * Acts as the logical container for the Maintenance module.
 * Responsibilities include:
 * - Orchestrating API calls for fetching and creating maintenance requests.
 * - Managing global state for requests, technicians, admins, and issue types.
 * - Handling URL-based tab navigation.
 */
const MaintenanceController = () => {
	const [requests, setRequests] = useState([]);
	const [technicians, setTechnicians] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [issueTypes, setIssueTypes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { tab } = useParams();
	const navigate = useNavigate();
	const { refreshJobs } = useJobs();
	const { refreshNotifications } = useNotifications();

	/**
	 * activeTab determines which view to display (university, accommodation, history, or support).
	 * It defaults to 'university' if no tab parameter is present in the URL.
	 */
	const activeTab = tab || "university";

	const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
	const userProfile = {
		name: authUser.name || "Professor",
		id: authUser.id || authUser.user_id || 1,
	};

	/**
	 * Fetches all maintenance related data including requests,
	 * technicians, admins, and valid issue types from the backend.
	 */
	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await maintenanceService.getMyRequests();

			if (response.success && response.data) {
				setRequests(response.data.requests || []);
				setTechnicians(response.data.technicians || []);
				setAdmins(response.data.admins || []);
				setIssueTypes(response.data.issueTypes || []);
			} else {
				setError(response.message || "Failed to load maintenance data");
			}
		} catch (err) {
			setError("Failed to load maintenance data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
		document.title = "Maintenance";
	}, []);

	/**
	 * Handles the submission of a new maintenance request.
	 * Enriches form data with user identification and timestamps before sending to API.
	 * Refetches data upon successful submission to ensure the UI is synchronized.
	 */
	const handleSubmitRequest = async (formData) => {
		try {
			const payload = {
				...formData,
				submittedBy: userProfile.name,
				submittedByUserId: userProfile.id,
				status: "pending",
				createdAt: new Date().toISOString(),
			};

			const response = await maintenanceService.createRequest(payload);
			if (response.success) {
				await Promise.all([fetchData(), refreshJobs(), refreshNotifications()]);
				return true;
			}
			return false;
		} catch (err) {
			return false;
		}
	};

	/**
	 * Updates the URL route when a user switches tabs in the UI.
	 */
	const handleTabChange = (newTab) => {
		navigate(`/maintenance/${newTab}`);
	};

	return (
		<MaintenanceUI
			requests={requests}
			technicians={technicians}
			admins={admins}
			issueTypes={issueTypes}
			loading={loading}
			error={error}
			onSubmitRequest={handleSubmitRequest}
			onRefresh={fetchData}
			activeTab={activeTab}
			onTabChange={handleTabChange}
		/>
	);
};

export default MaintenanceController;
