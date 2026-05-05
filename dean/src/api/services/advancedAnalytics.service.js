// src/api/services/advancedAnalytics.service.js

import { apiCall } from "../client";

/**
 * Service for advanced analytics dashboards including internship heatmaps,
 * company engagement scoring, student employability index, and placement funnel.
 */
export const advancedAnalyticsService = {
	/**
	 * Fetches the full analytics dashboard with KPIs and summary data.
	 */
	getDashboard: () => apiCall("/advanced-analytics/dashboard"),

	/**
	 * Retrieves internship heatmap data (department × year matrix).
	 */
	getHeatmap: () => apiCall("/advanced-analytics/heatmap"),

	/**
	 * Fetches company engagement scores and rankings.
	 */
	getEngagement: () => apiCall("/advanced-analytics/engagement"),

	/**
	 * Retrieves student employability index scores.
	 */
	getEmployability: () => apiCall("/advanced-analytics/employability"),

	/**
	 * Fetches the placement funnel data (Eligible → Applied → Selected → Intern → PPO → Placed).
	 */
	getPlacementFunnel: () => apiCall("/advanced-analytics/placement-funnel"),
};
