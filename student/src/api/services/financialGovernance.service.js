// src/api/services/financialGovernance.service.js

import { apiCall } from "../client";

/**
 * Service for School Financial Governance System.
 * Dean-level macro financial control: budget allocation, research fund
 * distribution, infrastructure investment, and scholarship approvals.
 * Aggregates data from HOD expenditure and research funding modules.
 */
export const financialGovernanceService = {
	getDashboard: () => apiCall("/financial-governance/dashboard"),
	approveBudget: (deptId, amount) =>
		apiCall(`/financial-governance/budgets/${deptId}/approve`, {
			method: "POST",
			body: JSON.stringify({ amount }),
		}),
	approveScholarship: (scholarshipId, action) =>
		apiCall(`/financial-governance/scholarships/${scholarshipId}/review`, {
			method: "POST",
			body: JSON.stringify({ action }),
		}),
};
