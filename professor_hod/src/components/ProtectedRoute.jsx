// src/components/ProtectedRoute.jsx

import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
	const location = useLocation();
	const { isAuthenticated, isLoading, user, checkAuth } = useAuth();

	useEffect(() => {
		if (isAuthenticated === null) {
			checkAuth();
		}
	}, [isAuthenticated, checkAuth]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				Loading...
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<Navigate to="/login" state={{ from: location.pathname }} replace />
		);
	}

	// If allowedRoles is provided, check if user.role is one of the permitted roles
	if (allowedRoles && !allowedRoles.includes(user?.role)) {
		// Redirect to dashboard if they don't have permission
		return <Navigate to="/dashboard" replace />;
	}

	return children;
};

export default ProtectedRoute;
