// src/api/services/curriculumGovernance.service.js

import { apiCall } from "../client";

/**
 * Service for Curriculum Governance Engine — sits ABOVE HOD course tracking.
 * Handles curriculum approval workflows, PO mapping, CO alignment tracking,
 * and accreditation compliance mapping. Does NOT store attendance or assignments;
 * only outcome-level attainment data is consumed.
 */
export const curriculumGovernanceService = {
	/**
	 * Fetches the full curriculum governance dashboard: summary KPIs, approval
	 * workflows, PO mapping matrix, CO alignment, and accreditation sync data.
	 */
	getDashboard: () => apiCall("/curriculum-governance/dashboard"),

	/**
	 * Advances or rejects a curriculum change workflow at the current stage.
	 */
	advanceWorkflow: (workflowId, action, remarks) =>
		apiCall(`/curriculum-governance/workflows/${workflowId}/advance`, {
			method: "POST",
			body: JSON.stringify({ action, remarks }),
		}),
};
