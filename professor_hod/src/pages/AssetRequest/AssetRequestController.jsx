// src/pages/AssetRequest/AssetRequestController.jsx

import React, { useState, useEffect } from "react";
import { assetService } from "../../api/services/asset.service";
import { userService } from "../../api/services/user.service";
import { useJobs } from "../../context/JobTrayContext";
import { useNotifications } from "../../context/NotificationContext";
import AssetRequestUI from "./AssetRequestUI";

/**
 * Controller for Asset Requests.
 * Manages state for requests, admins, assets, and cohorts.
 */
const AssetRequestController = () => {
	const [requests, setRequests] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [assets, setAssets] = useState([]);
	const [cohorts, setCohorts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { refreshJobs } = useJobs();
	const { refreshNotifications } = useNotifications();

	useEffect(() => {
		fetchInitialData();
		document.title = "Asset Requests";
	}, []);

	/**
	 * Fetches initial data from the API including assets, user dashboard, and existing requests.
	 */
	const fetchInitialData = async () => {
		try {
			setLoading(true);
			const [userRes, assetRes, reqRes] = await Promise.all([
				userService.getDashboardOverview(),
				assetService.getAssets(),
				assetService.getRequests(),
			]);

			if (userRes.success && assetRes.success && reqRes.success) {
				setRequests(reqRes.data.requests || []);
				setAdmins(reqRes.data.admins || []);
				setAssets(assetRes.data);
				setCohorts([
					...(userRes.data.createdCohorts || []),
					...(userRes.data.joinedCohorts || []),
				]);
			} else {
				setError("Failed to load data.");
			}
		} catch (err) {
			setError("A connection error occurred.");
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Handles the submission of asset requests.
	 * Delegating optimistic logic to the API handler allows for a cleaner state update here.
	 */
	const handleSubmit = async (formData) => {
		const isUpdate = !!formData.id;
		setIsModalOpen(false);

		try {
			// The API handles ID generation, status assignment, and mock data persistence
			const response = isUpdate
				? await assetService.updateRequest(formData.id, formData)
				: await assetService.createRequest(formData);

			if (response.success) {
				// Refresh all related contexts and local request state
				const reqRes = await assetService.getRequests();
				await Promise.all([refreshJobs(), refreshNotifications()]);

				if (reqRes.success) {
					setRequests(reqRes.data.requests || []);
				}
			}
		} catch (err) {
			console.error("Submission error:", err);
			// Re-sync with server state on failure
			fetchInitialData();
		}
	};

	return (
		<AssetRequestUI
			requests={requests}
			admins={admins}
			assets={assets}
			cohorts={cohorts}
			loading={loading}
			error={error}
			onRefresh={fetchInitialData}
			onSubmit={handleSubmit}
			isModalOpen={isModalOpen}
			setIsModalOpen={setIsModalOpen}
		/>
	);
};

export default AssetRequestController;
