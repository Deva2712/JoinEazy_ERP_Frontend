// src/pages/SessionPlanning/SessionPlanningController.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sessionService } from "../../api/services/session.service";
import SessionPlanningUI from "./SessionPlanningUI";

/**
 * Controller component for Session Planning.
 * Handles data orchestration for today's class schedule, document management,
 * and historical reflection logs.
 */
const SessionPlanningController = () => {
	const [schedules, setSchedules] = useState([]);
	const [todaysClasses, setTodaysClasses] = useState([]);
	const [uploadedDocs, setUploadedDocs] = useState({});
	const [reflections, setReflections] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { tab } = useParams();
	const navigate = useNavigate();
	const activeTab = tab || "today";

	/**
	 * Synchronizes all planning data.
	 * Fetches schedules and reflections in parallel, then performs
	 * date-based sorting on reflections and filters schedules for the current day.
	 */
	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const [schedulesRes, reflectionsRes] = await Promise.all([
				sessionService.getSchedules(),
				sessionService.getReflections(),
			]);

			if (!schedulesRes.success) {
				throw new Error("Failed to load schedule data.");
			}

			const loadedSchedules = Array.isArray(schedulesRes.data)
				? schedulesRes.data
				: [];
			setSchedules(loadedSchedules);

			if (reflectionsRes?.success && Array.isArray(reflectionsRes.data)) {
				const sortedReflections = [...reflectionsRes.data].sort(
					(a, b) => new Date(b.date) - new Date(a.date),
				);
				setReflections(sortedReflections);
			} else {
				setReflections([]);
			}

			const days = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];
			const todayName = days[new Date().getDay()];

			// Filter for today's classes from non-archived courses
			const filteredToday = loadedSchedules
				.filter((course) => course.status !== "Completed")
				.flatMap((course) =>
					(course.schedule || [])
						.filter((session) => session.day === todayName)
						.map((session) => ({
							...session,
							courseName: course.courseName,
							courseType: course.courseType,
							id: course.id,
						})),
				);
			setTodaysClasses(filteredToday);

			const docResults = await Promise.all(
				loadedSchedules.map((s) => sessionService.getDocuments(s.id)),
			);
			const docsMap = {};
			loadedSchedules.forEach((s, i) => {
				if (docResults[i]?.success) docsMap[s.id] = docResults[i].data;
			});
			setUploadedDocs(docsMap);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
		document.title = "Session Planning";
	}, [fetchData]);

	/**
	 * Persists a new or updated reflection to the database.
	 */
	const handleSaveReflection = async (data) => {
		try {
			const res = await sessionService.saveReflection(data);
			if (res.success) {
				await fetchData();
				return true;
			}
			return false;
		} catch (err) {
			return false;
		}
	};

	/**
	 * Uploads files associated with a specific course.
	 * Updates the local document state to reflect changes without a full reload.
	 */
	const handleUploadDocuments = async (courseId, filesMap) => {
		// filesMap expected: { [docType]: FileObject }
		const payload = {
			docs: Object.keys(filesMap),
			fileNames: Object.keys(filesMap).reduce((acc, key) => {
				acc[key] = filesMap[key].name;
				return acc;
			}, {}),
		};

		const res = await sessionService.uploadDocuments(courseId, payload);
		if (res.success) {
			setUploadedDocs((prev) => ({ ...prev, [courseId]: res.data }));
			return true;
		}
		return false;
	};

	// Filter courses and documents to exclude archived ones for Documents and History views
	const nonArchivedCourses = schedules
		.filter((s) => s.status !== "Archived")
		.map((s) => ({
			id: s.id,
			courseName: s.courseName,
			courseCodes: s.courseCodes,
			status: s.status,
		}));

	const filteredDocs = Object.keys(uploadedDocs).reduce((acc, courseId) => {
		const course = schedules.find(
			(s) => s.id.toString() === courseId.toString(),
		);
		if (course && course.status !== "Archived") {
			acc[courseId] = uploadedDocs[courseId];
		}
		return acc;
	}, {});

	return (
		<SessionPlanningUI
			schedules={schedules}
			todaysClasses={todaysClasses}
			reflections={reflections}
			courses={nonArchivedCourses}
			uploadedDocsByCourse={filteredDocs}
			loading={loading}
			error={error}
			activeTab={activeTab}
			onTabChange={(newTab) => navigate(`/session-planning/${newTab}`)}
			onSaveReflection={handleSaveReflection}
			onUploadDocuments={handleUploadDocuments}
		/>
	);
};

export default SessionPlanningController;
