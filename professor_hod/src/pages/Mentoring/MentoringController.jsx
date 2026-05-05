// src/pages/Mentoring/MentoringController.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "../../context/JobTrayContext";
import { mentoringService } from "../../api/services/mentoring.service";
import { downloadMentoringReport } from "../../utils/reportHelpers";
import MentoringUI from "./MentoringUI";

const MentoringController = () => {
	const [mentees, setMentees] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	
	const { tab, studentId } = useParams();
	const navigate = useNavigate();
	const { refreshJobs } = useJobs();

	// Defaults to 'all-students' if no tab is provided in URL
	const activeTab = tab || "all-students";

	const [filters, setFilters] = useState({
		riskLevel: "all",
		attendance: "all",
		hasBacklogs: false,
		department: "all",
		semester: "all",
		cgpaRange: "all",
		missedMeetings: false,
		requestedMeetings: false,
	});

	/**
	 * Logic to determine student risk status based on academic performance
	 */
	const calculateRisk = (mentee) => {
		const flags = [];
		const metrics = mentee.academicMetrics || {};
		const attendance = metrics.attendance || 0;
		const cgpa = metrics.cgpa || 0;
		const backlogs = metrics.backlogs || 0;

		if (attendance < 75) flags.push(`Attendance Concern: ${attendance}%`);
		if (cgpa < 6.5) flags.push(`Low CGPA: ${cgpa}`);
		if (backlogs > 0) flags.push(`${backlogs} Active Backlog(s)`);

		const level = flags.length > 0 ? "At Risk" : "No Risk";
		return { level, flags };
	};

	useEffect(() => {
		fetchMentoringData(true);
		document.title = "Student Mentoring";
	}, []);

	const fetchMentoringData = async (showLoadingUI = false) => {
		if (showLoadingUI) setLoading(true);
		setError(null);
		try {
			const response = await mentoringService.getAssignedMentees();
			const menteeList = response.data || [];

			const processedMentees = menteeList.map((mentee) => {
				const riskInfo = calculateRisk(mentee);
				return {
					...mentee,
					riskLevel: riskInfo.level,
					riskFlags: riskInfo.flags,
					performance: mentee.academicMetrics || {},
					behavior: mentee.behavioralLogs || {
						participationLevel: "N/A",
						activityHistory: [],
					},
				};
			});

			setMentees(processedMentees);
		} catch (err) {
			setError("Failed to load mentoring data.");
		} finally {
			if (showLoadingUI) setLoading(false);
		}
	};

	const handleToggleAttendance = async (meetingId, hasAttended) => {
		try {
			await Promise.all([
				refreshJobs(),
				mentoringService.updateMeetingAttendance(meetingId, {
					hasAttended,
				}),
				fetchMentoringData(false),
			]);
			return true;
		} catch (err) {
			setError("Failed to update attendance status.");
			return false;
		}
	};

	const handleSaveMeetingRecord = async (meetingId, formData) => {
		try {
			await Promise.all([
				refreshJobs(),
				mentoringService.submitMeetingNotes(meetingId, {
					summary: formData.discussionSummary,
					actionPlan: formData.actionPlan,
					performanceRatings: formData.performanceRatings,
					overallRemarks: formData.overallRemarks,
				}),
				fetchMentoringData(false),
			]);
			return true;
		} catch (err) {
			setError("Failed to save meeting record.");
			return false;
		}
	};

	/**
	 * Memoized list of mentees filtered by search, tabs, and sidebar filters
	 */
	const filteredMentees = useMemo(() => {
		return mentees.filter((m) => {
			const isRequested = (m.meetingHistory || []).some(
				(mtg) => mtg.status === "Requested",
			);
			if (activeTab === "meeting-requests" && !isRequested) return false;

			const query = searchQuery.toLowerCase();
			const matchesSearch =
				!query ||
				m.name?.toLowerCase().includes(query) ||
				String(m.studentId).includes(query) ||
				m.department?.toLowerCase().includes(query);

			if (!matchesSearch) return false;

			const matchesRisk =
				filters.riskLevel === "all" ||
				m.riskLevel === filters.riskLevel;
			const matchesDept =
				filters.department === "all" ||
				m.department === filters.department;
			const matchesSem =
				filters.semester === "all" ||
				String(m.semester) === String(filters.semester);
			const matchesBacklogs =
				!filters.hasBacklogs || m.performance?.backlogs > 0;

			const matchesAttendance =
				filters.attendance === "all" ||
				(filters.attendance === "borderline" &&
					m.performance?.attendance >= 75 &&
					m.performance?.attendance <= 80) ||
				(filters.attendance === "low" &&
					m.performance?.attendance < 75);

			const matchesCGPA =
				filters.cgpaRange === "all" ||
				(filters.cgpaRange === "warning" &&
					m.performance?.cgpa >= 5.0 &&
					m.performance?.cgpa <= 6.5) ||
				(filters.cgpaRange === "critical" && m.performance?.cgpa < 5.0);

			const matchesMeetings =
				!filters.missedMeetings ||
				(() => {
					const lastRelevantMeeting = [...(m.meetingHistory || [])]
						.reverse()
						.find((mtg) => mtg.status !== "Requested");

					return lastRelevantMeeting?.hasAttended === false;
				})();

			return (
				matchesRisk &&
				matchesDept &&
				matchesSem &&
				matchesAttendance &&
				matchesCGPA &&
				matchesBacklogs &&
				matchesMeetings
			);
		});
	}, [mentees, searchQuery, filters, activeTab]);

	/**
	 * Generates a PDF report for a specific student
	 */
	const handleDownloadReport = (mentee) => {
		downloadMentoringReport(mentee);
	};

	/**
	 * Core Logic Fix: Compare IDs as strings to ensure URL params match data
	 */
	const selectedMentee = useMemo(() => {
		if (!studentId) return null;
		return mentees.find((m) => String(m.studentId) === String(studentId));
	}, [mentees, studentId]);

	return (
		<MentoringUI
			allMentees={mentees}
			displayMentees={filteredMentees}
			filters={filters}
			setFilters={setFilters}
			loading={loading}
			error={error}
			selectedMentee={selectedMentee}
			searchQuery={searchQuery}
			onSearchChange={setSearchQuery}
			activeTab={activeTab}
			onTabChange={(newTab) => navigate(`/mentoring/${newTab}`)}
			onViewMentee={(id) => navigate(`/mentoring/${activeTab}/${id}`)}
			onBackToList={() => navigate(`/mentoring/${activeTab}`)}
			onRefresh={() => fetchMentoringData(true)}
			onDownloadReport={handleDownloadReport}
			onToggleAttendance={handleToggleAttendance}
			onSaveMeetingRecord={handleSaveMeetingRecord}
		/>
	);
};

export default MentoringController;