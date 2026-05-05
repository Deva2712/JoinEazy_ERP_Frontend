// src/pages/Cohort/CohortController.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CohortUI from "./CohortUI";
import CohortSettingsController from "./CohortSettings/CohortSettingsController";
import { courseService } from "../../api/services/course.service";
import { RefreshCw } from "lucide-react";

const CohortController = ({ userRole }) => {
	const { cohortId, tab } = useParams();
	const navigate = useNavigate();
	const [cohortData, setCohortData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("details");
	const [isCohortSettingsOpen, setIsCohortSettingsOpen] = useState(false);

	const handleCohortSettingsClick = () => setIsCohortSettingsOpen(true);
	const handleCohortSettingsClose = () => {
		setIsCohortSettingsOpen(false);
		window.location.reload();
	};

	const requiredTabs = [
		"details",
		"members",
		"attendance",
		"assignments",
		"resources",
		"announcements",
		"my-meetings",
		"meetings-requested",
	];

	useEffect(() => {
		if (tab && requiredTabs.includes(tab)) {
			setActiveTab(tab);
		} else {
			setActiveTab("details");
			if (!tab) {
				navigate(`/c/${cohortId}/details`, { replace: true });
			}
		}
	}, [tab, cohortId, navigate]);

	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
		navigate(`/c/${cohortId}/${tabId}`, { replace: true });
	};

	/**
	 * Maps the raw API response to the full cohort data structure
	 * required by the UI and child controllers.
	 */
	useEffect(() => {
		const fetchCohortData = async () => {
			try {
				const response = await courseService.getCourseDetails(cohortId);

				if (response.success) {
					const data = response.data;

					setCohortData({
						id: cohortId,
						name: data.cohort_name || "Untitled Course",
						title: data.cohort_name || "Untitled Course",
						course_codes: data.course_codes || [],
						batch: data.batch || "N/A",
						semester: data.semester || null,
						year: data.year || "N/A",
						description:
							data.cohort_description ||
							"No description available",
						status: data.status || "Live",
						visibility: data.visibility || "Active",
						member_count: data.member_count || 0,
						group_count: data.group_count || 0,
						start_date: data.start_date || data.created_at,
						end_date: data.end_date || null,
						created_at: data.created_at,
						credits: data.credits || 0,
						faculty: data.faculty || [],
						sections: data.sections || [],

						// Additional helper flags/meta
						is_creator: data.is_creator || false,
						is_admin: data.is_admin || false,
						instructor:
							data.instructor ||
							(data.faculty ? data.faculty[0] : "Professor"),
						breadcrumb: data.organization || "N/A",

						// Profile/UI specific
						profileImage:
							"https://randomuser.me/api/portraits/men/52.jpg",
						profileName: data.is_admin
							? "Created by You"
							: "Course",
					});
				} else {
					setCohortData({
						id: cohortId,
						title: "Untitled Course",
						is_admin: false,
					});
				}
				setLoading(false);
			} catch (error) {
				console.error("Error fetching cohort data:", error);
				setLoading(false);
			}
		};

		if (cohortId) fetchCohortData();
	}, [cohortId]);

	useEffect(() => {
		if (cohortData?.title) {
			document.title = `${cohortData.title} - Joineazy`;
		}
	}, [cohortData]);

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center py-20 text-gray-400">
				<RefreshCw className="size-12 animate-spin mb-4 text-blue-500" />
				<p className="font-bold text-gray-900 dark:text-white">
					Loading Cohort Data
				</p>
				<p className="text-sm">
					Please wait while we sync your cohort data...
				</p>
			</div>
		);
	}

	return (
		<>
			{/* Main UI Entry Point */}
			<CohortUI
				cohortId={cohortId}
				cohortData={cohortData}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				requiredTabs={requiredTabs}
				onTabChange={handleTabChange}
				handleCohortSettingsClick={handleCohortSettingsClick}
				userRole={userRole}
			/>
			{/* Settings Management */}
			<CohortSettingsController
				isOpen={isCohortSettingsOpen}
				onClose={handleCohortSettingsClose}
				cohortData={cohortData}
			/>
		</>
	);
};

export default CohortController;
