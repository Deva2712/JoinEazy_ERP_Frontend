// src/api/services/document.service.js

import { apiCall } from "../client";

/**
 * Service for official document requests and registrar workflows.
 */
export const docRequestService = {
	/**
	 * Fetches the queue of all document requests (filtered by user role).
	 */
	getDocRequests: () => apiCall("/documents/all"),

	/**
	 * Allows faculty to update the status of a request (e.g., 'Under Review').
	 */
	respondToStudentRequest: (requestId, status, reason = null) =>
		apiCall(`/documents/status/${requestId}`, {
			method: "POST",
			body: JSON.stringify({ status, reason }),
		}),

	/**
	 * Submits signed document and supporting evidence to the Registrar.
	 */
	submitToRegistrar: (submissionData) =>
		apiCall("/documents/registrar/process", {
			method: "POST",
			body: JSON.stringify(submissionData),
		}),

	/**
	 * Registrar action: Uploads the final stamped/official version of a document.
	 */
	registrarUploadApproved: (lorId, approvedDocument) =>
		apiCall(`/documents/registrar/upload/${lorId}`, {
			method: "POST",
			body: JSON.stringify({ approvedDocument }),
		}),

	/**
	 * Finalizes the workflow by dispatching the official document to the student.
	 */
	dispatchToStudent: (lorId) =>
		apiCall(`/documents/registrar/send/${lorId}`, {
			method: "POST",
			body: JSON.stringify({ sentToStudent: true }),
		}),
};
