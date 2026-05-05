// Simple authentication context for coordinating auth state
import { createContext, useContext, useState, useEffect } from "react";
import { checkLoginStatus } from "../services/auth";
import { setClientConfig } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const checkAuth = async (forceRefresh = false) => {
		try {
			console.log("AuthContext - Checking authentication...");
			const result = await checkLoginStatus();
			console.log("AuthContext - Auth result:", result);

			setIsAuthenticated(result.isLoggedIn);
			setUser(result.user || null);
			return result.isLoggedIn;
		} catch (error) {
			console.error("AuthContext - Auth check error:", error);
			setIsAuthenticated(false);
			setUser(null);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const login = async () => {
		// After successful login, verify authentication
		console.log("AuthContext - Login success, verifying auth...");
		await new Promise((resolve) => setTimeout(resolve, 300)); // Small delay
		await checkAuth(true);
	};

	/**
	 *  NOTE: Backend must still validate the user's role using a JWT or Session Cookie.
	 *  Never trust a role string sent from the frontend for actual database permissions.
	 * */

	useEffect(() => {
		if (user?.role) {
			setClientConfig(user.role);
		}
	}, [user]);

	const logout = () => {
		setIsAuthenticated(false);
		setUser(null);
		setClientConfig(null);
	};

	useEffect(() => {
		// Initial auth check
		checkAuth();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				isLoading,
				checkAuth,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
