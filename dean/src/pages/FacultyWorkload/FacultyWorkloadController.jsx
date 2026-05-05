// src/pages/FacultyWorkload/FacultyWorkloadController.jsx

import React, { useState, useEffect } from "react";
import { facultyService } from "../../api/services/faculty.service";
import FacultyWorkloadUI from "./FacultyWorkloadUI";

const FacultyWorkloadController = () => {
	const [faculty, setFaculty] = useState([]);
	const [allocations, setAllocations] = useState([]);
	const [alerts, setAlerts] = useState([]);
	const [allocationTypes, setAllocationTypes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [viewType, setViewType] = useState("grid"); // Added toggle for List/Grid view

	useEffect(() => {
		fetchWorkloadData();
		document.title = "Faculty Workload Allocation";
	}, []);

	const fetchWorkloadData = async () => {
		try {
			setLoading(true);
			const response = await facultyService.getWorkloadData();

			if (response.success) {
				setFaculty(response.data.faculty || []);
				setAllocations(response.data.allocations || []);
				setAlerts(response.data.workloadAlerts || []);
				setAllocationTypes(response.data.allocationTypes || []);
			} else {
				setError("Failed to load workload data.");
			}
		} catch (err) {
			setError("A connection error occurred while fetching faculty data.");
		} finally {
			setLoading(false);
		}
	};

	const handleAllocationSubmit = async (formData) => {
		const isUpdate = !!formData.id;
		try {
			const response = isUpdate
				? await facultyService.updateAllocation(formData.id, formData)
				: await facultyService.createAllocation(formData);

			if (response.success) {
				await fetchWorkloadData();
				setIsModalOpen(false);
			}
		} catch (err) {
			console.error("Allocation error:", err);
			setError("Failed to save allocation.");
		}
	};

	const handleAssignSubstitute = async (allocationId, substituteFacultyId, reason) => {
		try {
			setLoading(true);
			const response = await facultyService.assignSubstitute(allocationId, {
				substituteFacultyId,
				reason
			});

			if (response.success) {
				await fetchWorkloadData();
				return { success: true };
			}
			return { success: false, message: response.message };
		} catch (err) {
			return { success: false, message: "Network error" };
		} finally {
			setLoading(false);
		}
	};

	return (
		<FacultyWorkloadUI
			faculty={faculty}
			allocations={allocations}
			alerts={alerts}
			allocationTypes={allocationTypes}
			loading={loading}
			error={error}
			onRefresh={fetchWorkloadData}
			onSubmit={handleAllocationSubmit}
			onSubstitute={handleAssignSubstitute}
			isModalOpen={isModalOpen}
			setIsModalOpen={setIsModalOpen}
			viewType={viewType}
			setViewType={setViewType}
		/>
	);
};

export default FacultyWorkloadController;