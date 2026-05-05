// src/pages/DocumentRequest/DocumentRequestController.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { docRequestService } from "../../api/services/docRequest.service";
import DocumentRequestUI from "./DocumentRequestUI";

/**
 * Controller component for managing Document Request workflows.
 * Handles data fetching, state management for requests, and API communication
 * for student requests, processing queues, and administrative actions.
 */
const DocumentRequestController = () => {
	const [studentRequests, setStudentRequests] = useState([]);
	const [processingQueue, setProcessingQueue] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { tab } = useParams();
	const navigate = useNavigate();
	const activeTab = tab || "active-requests";

	useEffect(() => {
		fetchData();
		document.title = "Document Requests";
	}, []);

	/**
	 * Synchronizes local state with the server.
	 * Filters out rejected requests and prioritizes pending items for the UI.
	 */
	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await docRequestService.getDocRequests();

			if (response.data) {
				const filteredRequests = (response.data.studentRequests || [])
					.filter((req) => req.status !== "Rejected")
					.sort((a, b) => (a.status === "Pending" ? -1 : 1));

				setStudentRequests(filteredRequests);
				setProcessingQueue(response.data.processingQueue || []);
				setAdmins(response.data.admins || []);
			}
		} catch (err) {
			setError("Failed to synchronize document records.");
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Updates the initial status (Approved/Denied) of a student's request.
	 */
	const handleInitialResponse = async (requestId, status, reason) => {
		try {
			const response = await docRequestService.respondToStudentRequest(
				requestId,
				status,
				reason,
			);
			if (response.success) await fetchData();
		} catch (err) {
			console.error("Initial response failed", err);
		}
	};

	/**
	 * Submits minimal student identification and signed docs to the Registrar.
	 */
	const handleRegistrarSubmission = async (submissionData) => {
		setLoading(true);
		try {
			const payload = {
				signedDocument: submissionData.signedDocument,
				supportingDocs: submissionData.supportingDocs || [],
				registrarNote: submissionData.registrarNote,
				studentInfo: {
					requestId: submissionData.studentInfo.requestId,
				},
			};

			const response = await docRequestService.submitToRegistrar(payload);
			if (response.success) {
				setIsModalOpen(false);
				await fetchData();
			}
		} catch (err) {
			console.error("Registrar submission failed", err);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Finalizes the workflow by dispatching the completed document to the student.
	 */
	const handleFinalDispatch = async (lorId) => {
		try {
			const response = await docRequestService.dispatchToStudent(lorId);
			if (response.success) await fetchData();
		} catch (err) {
			console.error("Dispatch error", err);
		}
	};

	/**
	 * Manages URL-based navigation between different request views.
	 */
	const handleTabChange = (newTab) => {
		navigate(`/document-requests/${newTab}`);
	};

	// Requests currently with the Registrar and not dispatched
	const activeQueue = processingQueue.filter(
		(item) => item.status !== "Dispatched",
	);

	// Currently pending or approved student items
	const activeRequests = studentRequests.filter(
		(item) => item.status !== "Dispatched",
	);

	// Completed and dispatched documents
	const historyRequests = studentRequests.filter(
		(item) => item.status === "Dispatched",
	);

	return (
		<DocumentRequestUI
			activeRequests={activeRequests}
			processingQueue={activeQueue}
			historyRequests={historyRequests}
			admins={admins}
			loading={loading}
			error={error}
			isModalOpen={isModalOpen}
			setIsModalOpen={setIsModalOpen}
			onRefresh={fetchData}
			onSubmit={handleRegistrarSubmission}
			onRespond={handleInitialResponse}
			onSendToStudent={handleFinalDispatch}
			activeTab={activeTab}
			onTabChange={handleTabChange}
		/>
	);
};

export default DocumentRequestController;
