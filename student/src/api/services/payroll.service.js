// src/api/services/payroll.service.js

import { apiCall } from "../client";

/**
 * Service for employee payroll and compensation management.
 */
export const payrollService = {
	/**
	 * Retrieves a comprehensive history of past salary payments and tax cycles.
	 */
	getHistory: () => apiCall("/payroll/history"),

	/**
	 * Fetches the detailed breakdown of earnings and deductions for the current cycle.
	 */
	getBreakdown: () => apiCall("/payroll/breakdown"),

	/**
	 * Triggers the generation or retrieval of a PDF payslip for a specific period.
	 * @param {Object} item - The payroll record object containing the unique ID.
	 */
	downloadPayslip: (item) => apiCall(`/payroll/download/${item.id}`),
};
