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

	/**
	 * Scans the last session's active tasks and marks any that weren't
	 * completed as 'missed' in the history.
	 */
	const processMissedTasks = () => {
		const lastRecord = JSON.parse(
			localStorage.getItem("lastActiveTasks") || "null",
		);
		const history = JSON.parse(localStorage.getItem("taskHistory") || "[]");
		const todayStr = new Date().toDateString();

		if (lastRecord && lastRecord.date !== todayStr) {
			const missed = lastRecord.tasks.filter(
				(task) => !history.some((h) => h.id === task.id),
			);

			if (missed.length > 0) {
				const missedEntries = missed.map((t) => ({
					...t,
					historyDate: lastRecord.date,
					status: "missed",
					completedAt: new Date().toISOString(),
				}));

				const updatedHistory = [...missedEntries, ...history];
				localStorage.setItem(
					"taskHistory",
					JSON.stringify(updatedHistory),
				);
			}
		}
	};

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
				const todayStr = today.toDateString();
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

				// Logic to identify classes scheduled for the current day
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
							id: `class-${slot.id || (slot.courseName + slot.startTime + slot.day).replace(/\s+/g, "")}`,
							title: `${slot.courseName} • ${!slot.roomNumber.includes("Lab") ? "Room" : ""} ${slot.roomNumber}`,
							date: "Today",
							time: slot.startTime,
							completed: false,
							type: "class",
						}));
				}

				// Logic to identify meetings scheduled for today
				const rawMeetings = [
					...(data.upcomingMeetings || []),
					...(scheduleResponse.data?.scheduledMeetings || []),
				];

				const meetingTasks = rawMeetings
					.filter(
						(m, index, self) =>
							new Date(
								m.dateTime || m.startTime,
							).toDateString() === todayStr &&
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

				// Logic to identify assignments due
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

				// Logic to identify substitution requests for today
				let substitutionTasks = [];
				const subData = leaveResponse.data || leaveResponse;
				if (subData && subData.substitutionRequests) {
					substitutionTasks = subData.substitutionRequests
						.filter((sub) => {
							const isAccepted = sub.status === "Accepted";
							const isToday =
								new Date(sub.fromDate).toDateString() ===
								todayStr;
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

				const allFetchedTasks = [
					...timetableTasks,
					...meetingTasks,
					...assignmentTasks,
					...substitutionTasks,
				];

				// Filter tasks against history to prevent completed items from reappearing on refresh.
				const history = JSON.parse(
					localStorage.getItem("taskHistory") || "[]",
				);
				const completedTodayIds = history
					.filter(
						(entry) =>
							entry.historyDate === todayStr &&
							entry.status === "completed",
					)
					.map((entry) => entry.id);

				const activeTasks = allFetchedTasks.filter(
					(task) => !completedTodayIds.includes(task.id),
				);

				setTasks(activeTasks);

				localStorage.setItem(
					"lastActiveTasks",
					JSON.stringify({
						date: todayStr,
						tasks: activeTasks,
					}),
				);
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
		processMissedTasks();
		fetchDashboardData();
		document.title = "Dashboard - Joineazy";
	}, []);

	/**
	 * Records task completion in localStorage.
	 */
	const updateTaskHistory = (task, status) => {
		const history = JSON.parse(localStorage.getItem("taskHistory") || "[]");
		const today = new Date().toDateString();

		const newEntry = {
			...task,
			historyDate: today,
			status: status,
			completedAt: new Date().toISOString(),
		};

		const updatedHistory = [newEntry, ...history];
		localStorage.setItem("taskHistory", JSON.stringify(updatedHistory));
	};

	const handleToggleTask = (taskId) => {
		setTasks((prev) => {
			const taskToMove = prev.find((t) => t.id === taskId);
			if (taskToMove && !taskToMove.completed) {
				updateTaskHistory(taskToMove, "completed");
			}
			return prev.filter((t) => t.id !== taskId);
		});
	};

	/**
	 * Renders UI based on userRole.
	 * HODs and Professors share the ProfessorDashboardUI.
	 */
	const isStaff = userRole === "professor" || userRole === "hod";

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
