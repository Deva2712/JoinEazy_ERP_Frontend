// src/api/services/programGovernance.service.js

import { apiCall } from "../client";

/**
 * Service for Academic Program Governance — degree program lifecycle,
 * intake capacity control, interdisciplinary programs, and demand insights.
 * This is a Dean-level module distinct from HOD course management.
 */
export const programGovernanceService = {
	/**
	 * Fetches the full program governance dashboard: summary KPIs, program
	 * list, proposals pipeline, intake data, interdisciplinary programs, insights.
	 */
	getDashboard: () => apiCall("/program-governance/dashboard"),

	/**
	 * Submits a recommendation action on a proposal (approve / request revision / reject).
	 */
	reviewProposal: (proposalId, action, remarks) =>
		apiCall(`/program-governance/proposals/${proposalId}/review`, {
			method: "POST",
			body: JSON.stringify({ action, remarks }),
		}),
};
