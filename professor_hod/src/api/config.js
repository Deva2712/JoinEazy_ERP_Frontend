// src/api/config.js

/**
 * API service for all backend calls
 * Uses environment variable if available, otherwise defaults to local network IP
 */
export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://192.168.1.122:8000/api/v1";

/**
 * Mock mode configuration
 * Set to true to use local mock data instead of making network requests
 */
export const USE_MOCK_API = true;
