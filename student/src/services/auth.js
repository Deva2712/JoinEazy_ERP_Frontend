// src/services/auth.js
/**
 * Authentication service for frontend
 */
const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://192.168.1.122:8000/api/v1";

// Mock mode configuration - Set to true to use mock data
const USE_MOCK_AUTH = true;
// Mock user data for testing
const MOCK_USERS = [
	{
		id: 1,
		user_id: 1, // Added for consistency with API
		email: "john@mahindrauniversity.edu.in",
		password: "student123",
		name: "John Doe",
		role: "student",
		username: "johndoe",
		rollNumber: "ST21BTECH11001",
		cohorts: ["CS101"],
	},
	{
		id: 3,
		user_id: 3,
		email: "jinu@mahindrauniversity.edu.in",
		password: "student1234",
		name: "Jinu John",
		role: "student",
		username: "jinujohn",
		rollNumber: "ST21BTECH11002",
		cohorts: ["CS101", "MATH201"],
	},
	{
		id: 2,
		email: "jane@mahindrauniversity.edu.in",
		password: "prof123",
		name: "Dr. Jane Smith",
		role: "professor",
		username: "drsmith",
		employeeId: "PROF-001",
		cohorts: ["CS101", "CS202", "MATH201"],
	},
	{
		id: 4,
		email: "robert.aris@mahindrauniversity.edu.in",
		password: "hod123",
		name: "Dr. Robert Aris",
		role: "hod",
		username: "draris",
		employeeId: "HOD-CSE-001",
		cohorts: ["CS101", "CS202", "MATH201"],
	},
	{
		id: 5,
		user_id: 5,
		email: "dean@mahindrauniversity.edu.in",
		password: "dean123",
		name: "Dr. Priya Sharma",
		role: "dean",
		username: "drdean",
		employeeId: "DEAN-001",
		cohorts: [],
	},
];

// Debug logging
console.log(
	"Auth service - VITE_API_BASE_URL:",
	import.meta.env.VITE_API_BASE_URL,
);
console.log("Auth service - Final API_BASE_URL:", API_BASE_URL);
console.log(
	"Auth service - Mock mode:",
	USE_MOCK_AUTH ? "ENABLED" : "DISABLED",
);

// Helper function to debug cookies
const debugCookies = () => {
	console.log("Current document cookies:", document.cookie);
	const cookies = document.cookie.split(";").reduce((acc, cookie) => {
		const [name, value] = cookie.trim().split("=");
		if (name) acc[name] = value;
		return acc;
	}, {});
	console.log("Parsed cookies:", cookies);
	return cookies;
};

// Use environment-aware API_BASE_URL instead of hardcoded URL
// This respects the VITE_API_BASE_URL environment variable
console.log("Auth service - Using API_BASE_URL:", API_BASE_URL);

// Token refresh functionality
let tokenRefreshIntervalId = null;

// Function to refresh access token
const refreshAccessToken = async () => {
	try {
		console.log("Refreshing access token...");
		const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			console.log("Access token refreshed successfully");
			return true;
		} else {
			console.log(
				"Failed to refresh access token, user needs to login again",
			);
			// Clear the refresh interval if refresh fails
			if (tokenRefreshIntervalId) {
				clearInterval(tokenRefreshIntervalId);
				tokenRefreshIntervalId = null;
			}
			return false;
		}
	} catch (error) {
		console.error("Error refreshing access token:", error);
		// Clear the refresh interval if refresh fails
		if (tokenRefreshIntervalId) {
			clearInterval(tokenRefreshIntervalId);
			tokenRefreshIntervalId = null;
		}
		return false;
	}
};

// Function to setup automatic token refresh
const setupTokenRefresh = () => {
	// Clear any existing interval
	if (tokenRefreshIntervalId) {
		clearInterval(tokenRefreshIntervalId);
	}

	// Set up new interval to refresh token every 5 hours (before 6-hour expiry)
	const tokenRefreshInterval = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
	tokenRefreshIntervalId = setInterval(() => {
		refreshAccessToken();
	}, tokenRefreshInterval);

	console.log("Token refresh interval set up");
};

// Function to clear token refresh
const clearTokenRefresh = () => {
	if (tokenRefreshIntervalId) {
		clearInterval(tokenRefreshIntervalId);
		tokenRefreshIntervalId = null;
		console.log("Token refresh interval cleared");
	}
};

// Initiate registration (Step 1)
export const initiateRegistration = async (email) => {
	try {
		const response = await fetch(`${API_BASE_URL}/auth/register/initiate`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		const data = await response.json();

		if (response.ok) {
			return {
				success: true,
				message: data.message || "OTP sent to your email",
			};
		} else {
			return {
				success: false,
				error: data.message || "Registration initiation failed",
			};
		}
	} catch (error) {
		console.error("Registration initiation error:", error);
		return { success: false, error: "Network error. Please try again." };
	}
};

// Complete registration (Step 2)
export const completeRegistration = async (email, password, otp) => {
	try {
		const response = await fetch(`${API_BASE_URL}/auth/register/complete`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password, otp }),
		});

		const data = await response.json();

		if (response.ok) {
			return { success: true, data };
		} else {
			return {
				success: false,
				error: data.message || "Registration completion failed",
			};
		}
	} catch (error) {
		console.error("Registration completion error:", error);
		return { success: false, error: "Network error. Please try again." };
	}
};

// Initiate password reset (Step 1)
export const initiatePasswordReset = async (email) => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/auth/password/reset/initiate`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			},
		);

		const data = await response.json();

		if (response.ok) {
			return {
				success: true,
				message: data.message || "Reset OTP sent to your email",
			};
		} else {
			return {
				success: false,
				error: data.message || "Password reset request failed",
			};
		}
	} catch (error) {
		console.error("Password reset request error:", error);
		return { success: false, error: "Network error. Please try again." };
	}
};

// Verify OTP for password reset
export const verifyPasswordResetOTP = async (email, otp) => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/auth/password/reset/verify`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, otp }),
			},
		);

		const data = await response.json();

		if (response.ok) {
			return {
				success: true,
				message: data.message || "OTP verified successfully",
			};
		} else {
			return {
				success: false,
				error: data.message || "OTP verification failed",
			};
		}
	} catch (error) {
		console.error("OTP verification error:", error);
		return { success: false, error: "Network error. Please try again." };
	}
};

// Complete password reset (Step 3)
export const completePasswordReset = async (email, otp, newPassword) => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/auth/password/reset/complete`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, otp, newPassword }),
			},
		);

		const data = await response.json();

		if (response.ok) {
			return {
				success: true,
				message: data.message || "Password reset successful",
			};
		} else {
			return {
				success: false,
				error: data.message || "Password reset failed",
			};
		}
	} catch (error) {
		console.error("Password reset error:", error);
		return { success: false, error: "Network error. Please try again." };
	}
};

// Change password while logged in
export const changePassword = async (currentPassword, newPassword) => {
	try {
		const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			// Ensure your backend endpoint enforces checking 'currentPassword'
			body: JSON.stringify({ currentPassword, newPassword }),
		});

		const data = await response.json();
		return response.ok
			? { success: true, message: "Password changed successfully" }
			: {
					success: false,
					error: data.message || "Failed to change password",
				};
	} catch (error) {
		return { success: false, error: "Network error. Please try again." };
	}
};

// Login user
export const loginUser = async (email, password) => {
	// Mock authentication mode
	if (USE_MOCK_AUTH) {
		console.log("Using mock authentication");

		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Find matching user
		const user = MOCK_USERS.find(
			(u) => u.email === email && u.password === password,
		);

		if (user) {
			// Clear any existing user data first to prevent conflicts
			localStorage.removeItem("authUser");
			localStorage.removeItem("userEmail");
			localStorage.removeItem("userName");
			localStorage.removeItem("userRole");

			// Create user data without password
			const userData = {
				id: user.id,
				user_id: user.id, // Added for consistency
				email: user.email,
				name: user.name,
				role: user.role,
				username: user.username,
				rollNumber: user.rollNumber,
				cohorts: user.cohorts,
				isLoggedIn: true,
				loginTime: new Date().toISOString(),
			};

			// Store in localStorage
			localStorage.setItem("authUser", JSON.stringify(userData));
			localStorage.setItem("isAuthenticated", "true");
			localStorage.setItem("userEmail", user.email);
			localStorage.setItem("userName", user.name);
			localStorage.setItem("userRole", user.role);

			console.log("Mock login successful:", userData);
			console.log("Data stored in localStorage");

			return {
				success: true,
				data: userData,
				message: "Login successful",
			};
		} else {
			console.log("Mock login failed: Invalid credentials");
			return {
				success: false,
				error: "Invalid email or password",
			};
		}
	}

	// Real API authentication
	try {
		const loginURL = `${API_BASE_URL}/auth/login`;
		console.log("Login attempt - calling URL:", loginURL);

		const response = await fetch(loginURL, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();
		console.log("Login response:", data);
		console.log("Login response status:", response.status);

		if (response.ok) {
			console.log("Login successful, checking cookie status...");
			console.log("Cookies after login:", debugCookies());

			// Store user data in localStorage
			if (data.user) {
				localStorage.setItem("authUser", JSON.stringify(data.user));
				localStorage.setItem("isAuthenticated", "true");
				localStorage.setItem("userEmail", data.user.email);
				localStorage.setItem("userName", data.user.name);
				if (data.user.role) {
					localStorage.setItem("userRole", data.user.role);
				}
			}

			// Setup automatic token refresh after successful login
			setupTokenRefresh();

			// Verify authentication works by making a status call
			const verifyAuth = async () => {
				try {
					console.log("Verifying authentication after login...");
					const statusCheck = await checkLoginStatus();
					console.log("Post-login verification result:", statusCheck);
					return statusCheck.isLoggedIn;
				} catch (error) {
					console.error("Post-login verification error:", error);
					return false;
				}
			};

			// Wait a bit and then verify
			setTimeout(async () => {
				const isVerified = await verifyAuth();
				if (!isVerified) {
					console.warn(
						"Login successful but verification failed - cookies may not be working properly",
					);
				} else {
					console.log(
						"Login and verification successful - authentication is working",
					);
				}
			}, 200);

			return { success: true, data };
		} else {
			console.error("Login failed:", response.status, data.message);
			return { success: false, error: data.message || "Login failed" };
		}
	} catch (error) {
		console.error("Login error:", error);
		return { success: false, error: "Network error. Please try again." };
	}
};

// Check login status
export const checkLoginStatus = async () => {
	// Mock authentication mode
	if (USE_MOCK_AUTH) {
		const authUser = localStorage.getItem("authUser");
		const isAuthenticated = localStorage.getItem("isAuthenticated");

		if (authUser && isAuthenticated === "true") {
			try {
				const user = JSON.parse(authUser);
				console.log("Mock login status: Authenticated", user);
				return { isLoggedIn: true, user };
			} catch (error) {
				console.error("Error parsing stored user data:", error);
				localStorage.removeItem("authUser");
				localStorage.removeItem("isAuthenticated");
				return { isLoggedIn: false };
			}
		}

		console.log("Mock login status: Not authenticated");
		return { isLoggedIn: false };
	}

	// Real API check
	try {
		console.log("Checking login status...");
		console.log("Cookies before status check:", debugCookies());

		const response = await fetch(`${API_BASE_URL}/auth/status`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		console.log("Login status response:", response.status);

		if (response.ok) {
			// Status 200 means user is logged in
			const data = await response.json();
			console.log("Login status successful:", data);

			// Store user data in localStorage
			if (data.user) {
				localStorage.setItem("authUser", JSON.stringify(data.user));
				localStorage.setItem("isAuthenticated", "true");
			}

			// Setup token refresh if user is logged in
			setupTokenRefresh();
			return { isLoggedIn: true, user: data.user };
		} else {
			// Status 401 means user is not logged in
			console.log("Login status failed - user not authenticated");
			const errorData = await response
				.json()
				.catch(() => ({ message: "Unknown error" }));
			console.log("Login status error data:", errorData);

			// Clear localStorage
			localStorage.removeItem("authUser");
			localStorage.removeItem("isAuthenticated");
			localStorage.removeItem("userEmail");
			localStorage.removeItem("userName");
			localStorage.removeItem("userRole");

			clearTokenRefresh();
			return { isLoggedIn: false };
		}
	} catch (error) {
		console.error("Error checking login status:", error);
		clearTokenRefresh();
		return { isLoggedIn: false };
	}
};

// Logout user
export const logoutUser = async () => {
	// Clear localStorage for both mock and real auth
	localStorage.removeItem("authUser");
	localStorage.removeItem("isAuthenticated");
	localStorage.removeItem("userEmail");
	localStorage.removeItem("userName");
	localStorage.removeItem("userRole");
	localStorage.removeItem("processedInvitationToken");
	localStorage.removeItem("processedInvitationTokenTime");
	localStorage.removeItem("pendingInvitationToken");
	localStorage.removeItem("pendingInvitationTokenTime");
	localStorage.removeItem("pendingInvitation");

	console.log("Cleared all auth data from localStorage");

	// Mock authentication mode
	if (USE_MOCK_AUTH) {
		console.log("Mock logout successful");
		clearTokenRefresh();
		return { success: true };
	}

	// Real API logout
	try {
		// Clear token refresh interval
		clearTokenRefresh();

		const response = await fetch(`${API_BASE_URL}/auth/logout`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			return { success: true };
		} else {
			return { success: false, error: "Logout failed" };
		}
	} catch (error) {
		console.error("Logout error:", error);
		return { success: false, error: "Network error. Please try again." };
	}
};

// Export refresh token functions and debug utilities
export {
	refreshAccessToken,
	setupTokenRefresh,
	clearTokenRefresh,
	debugCookies,
};
