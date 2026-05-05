// src/api/services/industryRelations.service.js

import { apiCall } from "../client";

/**
 * Service for managing industry partnerships, company relationships,
 * MoU tracking, internship pipelines, and repeat recruiter analysis.
 */
export const industryRelationsService = {
	/**
	 * Fetches the full industry relations dashboard including companies, MoUs, and pipeline stats.
	 */
	getDashboard: () => apiCall("/industry-relations/dashboard"),

	/**
	 * Retrieves the list of all partner companies with relationship status.
	 */
	getCompanies: () => apiCall("/industry-relations/companies"),

	/**
	 * Adds a new company to the partner network.
	 */
	addCompany: (data) =>
		apiCall("/industry-relations/companies", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	/**
	 * Updates an existing company's details or relationship status.
	 */
	updateCompany: (id, data) =>
		apiCall(`/industry-relations/companies/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),

	/**
	 * Retrieves all active and expired MoUs.
	 */
	getMous: () => apiCall("/industry-relations/mous"),

	/**
	 * Fetches internship pipeline data per company.
	 */
	getPipelines: () => apiCall("/industry-relations/pipelines"),

	/**
	 * Fetches repeat recruiter analysis data.
	 */
	getRepeatRecruiters: () => apiCall("/industry-relations/repeat-recruiters"),
};
