// src/pages/Dashboard/DashboardController.jsx

import React, { useState, useEffect } from "react";
import { userService } from "../../api/services/user.service";
import { scheduleService } from "../../api/services/schedule.service";
import { leaveService } from "../../api/services/leave.service";
import StudentDashboardUI from "./StudentDashboardUI";
import ProfessorDashboardUI from "./ProfessorDashboardUI";

const DashboardController = ({ userRole }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [tasks, setTasks] = useState([]);
	const [userProfile, setUserProfile] = useState({
		name: "Demo User",
		rollNumber: "N/A",
		organization: "Mahindra University",
	});

	const fetchDashboardData = async () => {
		try {
			setLoading(true);
			setError(null);

			const [dashResponse, scheduleResponse, leaveResponse] =
				await Promise.all([
					userService.getDashboardOverview(),
					scheduleService.getScheduleOverview(),
					leaveService.getApplications(),
				]);

			if (dashResponse.success) {
				const { data } = dashResponse;

				setUserProfile({
					fullName: data.user?.fullName || "Demo User",
					employeeId: data.user?.employeeId || "N/A",
					organization:
						data.user?.organization || "Mahindra University",
				});

				const today = new Date();
				const todayISO = today.toISOString().split("T")[0];
				const days = [
					"Sunday",
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
				];
				const todayName = days[today.getDay()];

				/**
				 * 1. Process Timetable (Classes)
				 * Filters for classes occurring today within valid start/end dates.
				 */
				let timetableTasks = [];
				if (
					scheduleResponse.success &&
					scheduleResponse.data.schedule?.timetable
				) {
					timetableTasks = scheduleResponse.data.schedule.timetable
						.filter((slot) => {
							const startDate = slot.startDate || "1970-01-01";
							const endDate = slot.endDate || "9999-12-31";
							return (
								slot.day === todayName &&
								todayISO >= startDate &&
								todayISO <= endDate
							);
						})
						.map((slot) => ({
							id: `class-${slot.id || Math.random()}`,
							title: `${slot.courseName} • ${!slot.roomNumber.includes("Lab") ? "Room" : ""} ${slot.roomNumber}`,
							date: "Today",
							time: slot.startTime,
							completed: false,
							type: "class",
						}));
				}

				/**
				 * 2. Process Meetings
				 * Deduplicates and filters for meetings scheduled for the current day.
				 */
				const rawMeetings = [
					...(data.upcomingMeetings || []),
					...(scheduleResponse.data?.scheduledMeetings || []),
				];

				const meetingTasks = rawMeetings
					.filter(
						(m, index, self) =>
							new Date(
								m.dateTime || m.startTime,
							).toDateString() === today.toDateString() &&
							self.findIndex((t) => t.id === m.id) === index,
					)
					.map((m) => ({
						id: `meeting-${m.id}`,
						title: `Meeting with ${m.participantName}`,
						date: "Today",
						time: new Date(
							m.dateTime || m.startTime,
						).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						}),
						completed: false,
						type: "meeting",
					}));

				/**
				 * 3. Process Assignments
				 * Formats upcoming reviews or grading tasks.
				 */
				const assignmentTasks = (data.todoAssignments || []).map(
					(a) => ({
						id: `assignment-${a.id}`,
						title: `Grade: ${a.title}`,
						date: new Date(a.dueDate).toLocaleDateString(),
						time: "Due",
						completed: false,
						type: "assignment",
					}),
				);

				/**
				 * 4. Process Accepted Substitution Requests
				 * Filters for substitution classes that were accepted for today.
				 */
				let substitutionTasks = [];
				const subData = leaveResponse.data || leaveResponse;
				if (subData && subData.substitutionRequests) {
					substitutionTasks = subData.substitutionRequests
						.filter((sub) => {
							const isAccepted = sub.status === "Accepted";
							const isToday =
								new Date(sub.fromDate).toDateString() ===
								today.toDateString();
							return isAccepted && isToday;
						})
						.map((sub) => ({
							id: `sub-${sub.id}`,
							title: `Covering: ${sub.courseName || "Class"} for ${sub.requesterName}`,
							date: "Today",
							time: sub.timings?.startTime || "Scheduled",
							completed: false,
							type: "substitution",
						}));
				}

				setTasks([
					...timetableTasks,
					...meetingTasks,
					...assignmentTasks,
					...substitutionTasks,
				]);
			} else {
				setError(dashResponse.error || "Failed to fetch data");
			}
		} catch (err) {
			console.error("Dashboard Load Error:", err);
			setError("Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboardData();
		document.title = "Dashboard - Joineazy";
	}, []);

	const handleToggleTask = (taskId) => {
		setTasks((prev) =>
			prev.map((t) =>
				t.id === taskId ? { ...t, completed: !t.completed } : t,
			),
		);
	};

	/**
	 * Renders UI based on userRole.
	 * HODs and Professors share the ProfessorDashboardUI.
	 */
	const isStaff = userRole === "professor" || userRole === "hod" || userRole === "dean";

	/* UI Return Logic */
	return isStaff ? (
		<ProfessorDashboardUI
			loading={loading}
			error={error}
			onRetry={fetchDashboardData}
			userProfile={userProfile}
			userRole={userRole}
			tasks={tasks}
			onToggleTask={handleToggleTask}
		/>
	) : (
		<StudentDashboardUI
			loading={loading}
			error={error}
			onRetry={fetchDashboardData}
			userProfile={userProfile}
		/>
	);
};

export default DashboardController;
