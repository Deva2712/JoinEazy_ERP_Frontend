// src/pages/MyCourses/MyCoursesController.jsx

import React, { useState, useEffect } from "react";
import { userService } from "../../api/services/user.service";
import { courseService } from "../../api/services/course.service";
import MyCoursesUI from "./MyCoursesUI";

const MyCoursesController = ({ userRole }) => {
	const [cohorts, setCohorts] = useState([]);
	const [archivedCohorts, setArchivedCohorts] = useState([]);
	const [statsData, setStatsData] = useState({
		activeCourses: 0,
		totalStudents: 0,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const normaliseCohort = (c, index) => ({
		...c,
		id: c.id ?? `demo-${index}`,
		title: c.cohort_name || c.title || "Untitled Course",
		courseCodes: c.course_codes || (c.courseCode ? [c.courseCode] : []),
		studentCount: c.member_count ?? c.memberCount ?? c.students ?? 0,
		assignmentCount: c.total_assignments ?? c.totalAssignments ?? 0,
		startDate: c.start_date || c.startDate || null,
		endDate: c.end_date || c.endDate || null,
		status: c.status || c.visibility || "Live",
	});

	const fetchAllData = async () => {
		try {
			setLoading(true);
			const [overview, archived] = await Promise.all([
				userService.getDashboardOverview(),
				courseService.getArchivedCourses(),
			]);

			if (overview.success) {
				const data = overview.data;

				const combined = [
					...(data.createdCohorts || []),
					...(data.joinedCohorts || []),
				];
				const formatted = combined.map(normaliseCohort);

				setCohorts(formatted);
				setStatsData({
					activeCourses: formatted.filter(
						(c) => !["Archived", "inactive"].includes(c.status),
					).length,
					totalStudents: formatted.reduce(
						(sum, c) => sum + (c.studentCount || 0),
						0,
					),
				});
			}

			if (archived.success) {
				setArchivedCohorts((archived.data || []).map(normaliseCohort));
			}
		} catch (err) {
			setError("Failed to load courses data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllData();
		document.title = "My Courses";
	}, []);

	return (
		<>
			<MyCoursesUI
				cohorts={cohorts}
				archivedCohorts={archivedCohorts}
				statsData={statsData}
				loading={loading}
				error={error}
				onRefresh={fetchAllData}
				userRole={userRole}
			/>
		</>
	);
};

export default MyCoursesController;
