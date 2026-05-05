// src/api/services/researchStrategy.service.js

import { apiCall } from "../client";

/**
 * Service for Research Strategy & Intelligence System.
 * Dean-level module that builds strategy above HOD project tracking.
 * Covers research clusters, cross-dept projects, grant allocation,
 * publication analytics, and impact intelligence.
 */
export const researchStrategyService = {
	getDashboard: () => apiCall("/research-strategy/dashboard"),
	createCluster: (data) =>
		apiCall("/research-strategy/clusters", { method: "POST", body: JSON.stringify(data) }),
	allocateGrant: (clusterId, amount) =>
		apiCall(`/research-strategy/clusters/${clusterId}/grant`, {
			method: "POST",
			body: JSON.stringify({ amount }),
		}),
};
