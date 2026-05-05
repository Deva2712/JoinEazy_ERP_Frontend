// src/api/services/riskGovernance.service.js

import { apiCall } from "../client";

/**
 * Service for internship risk management, fake certificate detection,
 * company blacklisting, and minimum internship standards enforcement.
 */
export const riskGovernanceService = {
	/**
	 * Fetches the risk & governance dashboard with alerts and summary stats.
	 */
	getDashboard: () => apiCall("/risk-governance/dashboard"),

	/**
	 * Retrieves all flagged internships with severity levels.
	 */
	getFlaggedInternships: () => apiCall("/risk-governance/flagged"),

	/**
	 * Toggles the blacklist status of a company.
	 */
	blacklistCompany: (id) =>
		apiCall(`/risk-governance/companies/${id}/blacklist`, {
			method: "POST",
		}),

	/**
	 * Approves a company for future internship partnerships.
	 */
	approveCompany: (id) =>
		apiCall(`/risk-governance/companies/${id}/approve`, {
			method: "POST",
		}),

	/**
	 * Fetches the current minimum internship standards configuration.
	 */
	getStandards: () => apiCall("/risk-governance/standards"),

	/**
	 * Updates the minimum internship standards.
	 */
	updateStandards: (data) =>
		apiCall("/risk-governance/standards", {
			method: "PUT",
			body: JSON.stringify(data),
		}),

	/**
	 * Fetches company review list with approval/blacklist status.
	 */
	getCompanyReviews: () => apiCall("/risk-governance/company-reviews"),
};
