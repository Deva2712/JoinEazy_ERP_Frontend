// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import ModalWithBackground from "./components/layout/ModalWithBackground";

import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import {
	NotificationProvider,
	useNotifications,
} from "./context/NotificationContext.jsx";
import { JobTrayProvider, useJobs } from "./context/JobTrayContext.jsx";
import { AttendanceProvider } from "./context/AttendanceContext.jsx";
import { ResearchProvider } from "./context/ResearchContext.jsx";
import { DepartmentProvider } from "./context/DepartmentContext.jsx";

import LandingPage from "./pages/landing-components/Landing.jsx";
import LoginController from "./pages/Login/LoginController.jsx";
import SignupController from "./pages/Signup/SignupController.jsx";
import ResetPasswordController from "./pages/ResetPassword/ResetPasswordController.jsx";
import GuideController from "./components/layout/Guide/GuideController";
import SettingsController from "./pages/Settings/SettingsController";
import CourseJoinController from "./pages/CourseJoin/CourseJoinController";

import DashboardController from "./pages/Dashboard/DashboardController";
import MyCoursesController from "./pages/MyCourses/MyCoursesController.jsx";
import CohortController from "./pages/Cohort/CohortController";
import DepartmentController from "./pages/Department/DepartmentController.jsx";
import ScheduleController from "./pages/Schedule/ScheduleController.jsx";
import LibraryController from "./pages/Library/LibraryController.jsx";
import SessionPlanningController from "./pages/SessionPlanning/SessionPlanningController.jsx";
import MaintenanceController from "./pages/Maintenance/MaintenanceController.jsx";
import AttendanceManagementController from "./pages/AttendanceMangement/AttendanceManagementController.jsx";
import LeaveApplicationController from "./pages/LeaveApplication/LeaveApplicationController.jsx";
import ExamDutiesController from "./pages/ExamDuties/ExamDutiesController.jsx";
import PayrollController from "./pages/Payroll/PayrollController.jsx";
import AssetRequestController from "./pages/AssetRequest/AssetRequestController.jsx";
import FinanceManagementController from "./pages/FinanceMangement/FinanceManagementController.jsx";
import BulletinsController from "./pages/Bulletins/BulletinsController.jsx";
import ResearchController from "./pages/Research/ResearchController.jsx";
import MentoringController from "./pages/Mentoring/MentoringController.jsx";
import DocumentRequestController from "./pages/DocumentRequest/DocumentRequestController.jsx";

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<ThemeProvider>
					<AuthProvider>
						<NotificationProvider>
							<JobTrayProvider>
								<Toaster />
								<AppContent />
							</JobTrayProvider>
						</NotificationProvider>
					</AuthProvider>
				</ThemeProvider>
			</TooltipProvider>
		</QueryClientProvider>
	);
}

const AppContent = () => {
	const { refreshJobs } = useJobs();
	const { refreshNotifications } = useNotifications();
	const { user } = useAuth();

	/**
	 * Retrieves user role from AuthContext or localStorage fallback.
	 */
	const userRole = useMemo(() => {
		return user?.role || localStorage.getItem("userRole") || "professor";
	}, [user]);

	useEffect(() => {
		/**
		 * Initial data fetch for the application's global indicators.
		 */
		const initializeAppData = async () => {
			await Promise.all([refreshJobs(), refreshNotifications()]);
		};

		initializeAppData();
	}, [refreshJobs, refreshNotifications]);

	return (
		<BrowserRouter
			future={{
				v7_startTransition: true,
				v7_relativeSplatPath: true,
			}}
		>
			<Routes>
				{/* Authentication Routes */}
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<LoginController />} />
				<Route path="/signup" element={<SignupController />} />
				<Route
					path="/reset-password"
					element={<ResetPasswordController />}
				/>

				{/* Dashboard Route */}
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<DashboardController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* My Courses Route */}
				<Route
					path="/my-courses"
					element={
						<ProtectedRoute>
							<MyCoursesController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* Schedule & Meetings Route */}
				<Route
					path="/schedule/:tab?"
					element={
						<ProtectedRoute>
							<ScheduleController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* Attendance Management Routes */}
				<Route
					path="/attendance-management"
					element={
						<AttendanceProvider>
							<ProtectedRoute>
								<AttendanceManagementController
									userRole={userRole}
								/>
							</ProtectedRoute>
						</AttendanceProvider>
					}
				>
					{/* Handles:
						1. /attendance-management/:tab
						2. /attendance-management/mark/:courseId/:tab?
					*/}
					<Route
						path=":tab?"
						element={
							<AttendanceManagementController
								userRole={userRole}
							/>
						}
					/>
					<Route
						path="mark/:courseId/:tab?"
						element={
							<AttendanceManagementController
								userRole={userRole}
							/>
						}
					/>
				</Route>

				{/* Session Planning Route */}
				<Route
					path="/session-planning/:tab?"
					element={
						<ProtectedRoute allowedRoles={["hod", "professor"]}>
							<SessionPlanningController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* Bulletins Route */}
				<Route
					path="/bulletins/:tab?"
					element={
						<ProtectedRoute>
							<BulletinsController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* Exam Duties Route */}
				<Route
					path="/exam-duties"
					element={
						<ProtectedRoute allowedRoles={["hod", "professor"]}>
							<ExamDutiesController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* Leave Application Route */}
				<Route
					path="/leave-applications/:tab?"
					element={
						<ProtectedRoute allowedRoles={["hod", "professor"]}>
							<LeaveApplicationController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* Library Module Route */}
				<Route
					path="/library/:tab?"
					element={
						<ProtectedRoute>
							<LibraryController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* Research & Publications Routes */}
				<Route
					path="/research-publications"
					element={
						<ResearchProvider>
							<ProtectedRoute>
								<ResearchController userRole={userRole} />
							</ProtectedRoute>
						</ResearchProvider>
					}
				>
					{/* Handles:
						1. /research-publications/:tab
						2. /research-publications/:tab/project/:projectId
						3. /research-publications/:tab/publication/:pubId
						4. /research-publications/:tab/user/:userId
					*/}
					<Route path=":tab?">
						<Route
							path="project/:projectId"
							element={<ResearchController userRole={userRole} />}
						/>
						<Route
							path="publication/:pubId"
							element={<ResearchController userRole={userRole} />}
						/>
						<Route
							path="user/:userId"
							element={<ResearchController userRole={userRole} />}
						/>
						<Route
							index
							element={<ResearchController userRole={userRole} />}
						/>
					</Route>
				</Route>

				{/* Mentoring Module Route */}
				<Route
					path="/mentoring"
					element={
						<ProtectedRoute>
							<MentoringController userRole={userRole} />
						</ProtectedRoute>
					}
				>
					{/* Handles:
						1. /mentoring/:tab
						2. /mentoring/:tab/:studentId 
					*/}
					<Route
						path=":tab?/:studentId?"
						element={<MentoringController userRole={userRole} />}
					/>
				</Route>

				{/* Document Request Routes */}
				<Route
					path="/document-requests/:tab?"
					element={
						<ProtectedRoute>
							<DocumentRequestController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* Asset Request Route */}
				<Route
					path="/asset-requests"
					element={
						<ProtectedRoute allowedRoles={["hod", "professor"]}>
							<AssetRequestController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* Maintenance Requests Route */}
				<Route
					path="/maintenance/:tab?"
					element={
						<ProtectedRoute allowedRoles={["hod", "professor"]}>
							<MaintenanceController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* Finance Management Routes */}
				<Route
					path="/finance-management/:tab?"
					element={
						<ProtectedRoute allowedRoles={["hod", "professor"]}>
							<FinanceManagementController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* Payroll Route */}
				<Route
					path="/payroll"
					element={
						<ProtectedRoute allowedRoles={["hod", "professor"]}>
							<PayrollController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* Department Management Route (HOD Only) */}
				<Route
					path="/department/:tab?"
					element={
						<DepartmentProvider>
							<ProtectedRoute allowedRoles={["hod"]}>
								<DepartmentController userRole={userRole} />
							</ProtectedRoute>
						</DepartmentProvider>
					}
				/>

				{/* Cohort routes */}
				<Route
					path="/c/:cohortId/:tab?"
					element={
						<AttendanceProvider>
							<ProtectedRoute>
								<CohortController userRole={userRole} />
							</ProtectedRoute>
						</AttendanceProvider>
					}
				/>
				<Route
					path="/c/:cohortId/join"
					element={<CourseJoinController userRole={userRole} />}
				/>

				{/* Settings Page */}
				<Route
					path="/settings/:view?"
					element={
						<ProtectedRoute>
							<SettingsController userRole={userRole} />
						</ProtectedRoute>
					}
				/>

				{/* Modal & UI Overlay Routes */}
				<Route
					path="/create"
					element={
						<ModalWithBackground
							modalType="create"
							onClose={() => {
								window.history.length > 1
									? window.history.back()
									: (window.location.href = "/dashboard");
							}}
						/>
					}
				/>
				<Route
					path="/guide"
					element={
						<ProtectedRoute>
							<GuideController userRole={userRole} />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
