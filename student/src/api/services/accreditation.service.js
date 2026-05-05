// src/api/services/accreditation.service.js

import { apiCall } from "../client";

/**
 * Service for managing accreditation tracking, NBA/NAAC compliance,
 * program outcome attainment, and audit readiness.
 */
export const accreditationService = {
	/**
	 * Fetches the full accreditation dashboard including summary, criteria, POs, audits, and dept compliance.
	 */
	getDashboard: () => apiCall("/accreditation/dashboard"),
};
