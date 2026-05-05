// src/pages/LeaveApplication/LeaveApplicationController.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { leaveService } from "../../api/services/leave.service";
import { userService } from "../../api/services/user.service";
import { useJobs } from "../../context/JobTrayContext";
import { useNotifications } from "../../context/NotificationContext";
import LeaveApplicationUI from "./LeaveApplicationUI";

const LeaveApplicationController = ({ userRole }) => {
	const [applications, setApplications] = useState([]);
	const [substitutionRequests, setSubstitutionRequests] = useState([]);
	const [incomingRequests, setIncomingRequests] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [faculties, setFaculties] = useState([]);
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { tab } = useParams();
	const navigate = useNavigate();
	const { refreshJobs } = useJobs();
	const { refreshNotifications } = useNotifications();

	const activeTab = tab || "my-leaves";

	useEffect(() => {
		fetchApplications();
		document.title = "Leave Applications";
	}, [userRole]);

	const fetchApplications = async () => {
		setLoading(true);
		setError(null);
		try {
			const requests = [
				leaveService.getApplications(),
				userService.getDashboardOverview(),
			];

			if (userRole === "hod") {
				requests.push(leaveService.getIncomingRequests());
			}

			const [appResponse, userResponse, incomingResponse] =
				await Promise.all(requests);

			const data = appResponse.data || appResponse;

			if (data) {
				const fetchedApps = (data.applications || []).map((app) => ({
					...app,
					substitutionDetails: app.substitutionDetails || {
						courseName: app.courseName || "",
						roomNumber: app.roomNumber || "",
						timings: app.timings || { startTime: "", endTime: "" },
						note: app.note || "",
					},
					substitutionStatus: app.substitutionStatus || "Pending",
					leaveApproval: app.leaveApproval || {
						HoD: { status: "Pending", remark: null },
						HR: { status: "Pending", remark: null },
					},
				}));

				const sortedApps = [...fetchedApps].sort(
					(a, b) => new Date(b.appliedAt) - new Date(a.appliedAt),
				);

				setApplications(sortedApps);
				setSubstitutionRequests(data.substitutionRequests || []);
				setAdmins(data.managementContacts || []);
				setFaculties(data.faculties || []);

				if (incomingResponse) {
					setIncomingRequests(
						incomingResponse.data || incomingResponse,
					);
				}

				if (userResponse.success) {
					const userCohorts = [
						...(userResponse.data.createdCohorts || []),
						...(userResponse.data.joinedCohorts || []),
					].map((cohort) => ({
						id: cohort.id || cohort._id,
						name:
							cohort.cohort_name ||
							cohort.name ||
							"Untitled Course",
					}));
					setCourses(userCohorts);
				}
			}
		} catch (error) {
			setError("Failed to fetch leaves");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (formData) => {
		setLoading(true);
		try {
			const currentApp = applications.find((a) => a.id === formData.id);
			const isResubmission = currentApp?.status === "Rejected";

			let payload = {
				...formData,
				status: "Pending",
				leaveApproval:
					userRole === "hod"
						? {
								Dean: { status: "Pending", remark: null },
								HR: { status: "Pending", remark: null },
							}
						: {
								HoD: { status: "Pending", remark: null },
								HR: { status: "Pending", remark: null },
							},
			};

			if (isResubmission) {
				payload = {
					...payload,
					status: "Resubmitted",
					previousVersion: { ...currentApp },
				};
			}

			const response = formData.id
				? await leaveService.updateApplication(formData.id, payload)
				: await leaveService.createApplication({
						...payload,
						appliedAt: new Date().toISOString(),
					});

			if (response) {
				setIsModalOpen(false);
				await fetchApplications();
				await refreshJobs();
			}
		} catch (error) {
			console.error("Submission error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubstitutionResponse = async (id, action) => {
		try {
			const response = await leaveService.respondToSubstitution(
				id,
				action,
			);
			if (response.success) {
				await Promise.all([
					fetchApplications(),
					refreshJobs(),
					refreshNotifications(),
				]);
			}
		} catch (error) {
			console.error("Substitution error:", error);
		}
	};

	/**
	 * Processes HoD/Admin decisions on faculty leave requests.
	 * Passes the archiving preference to support resubmission workflows.
	 */
	const handleFacultyResponse = async (id, responseData) => {
		setLoading(true);
		try {
			const { status, remark, isArchived } = responseData;

			const response = await leaveService.updateApproval(
				id,
				userRole.toUpperCase(),
				status,
				remark,
				isArchived, // Correctly passing the archive flag from the UI
			);

			if (response.success) {
				await fetchApplications();
				await refreshJobs();
				await refreshNotifications();
			}
		} catch (error) {
			console.error("Faculty response error:", error);
			setError("Failed to process faculty request");
		} finally {
			setLoading(false);
		}
	};

	const handleTabChange = (newTab) => {
		navigate(`/leave-applications/${newTab}`);
	};

	return (
		<LeaveApplicationUI
			userRole={userRole}
			applications={applications}
			substitutionRequests={substitutionRequests}
			incomingRequests={incomingRequests}
			admins={admins}
			faculties={faculties}
			courses={courses}
			loading={loading}
			error={error}
			isModalOpen={isModalOpen}
			setIsModalOpen={setIsModalOpen}
			onRefresh={fetchApplications}
			onSubmit={handleSubmit}
			onRespondToSubstitution={handleSubstitutionResponse}
			onRespondToFaculty={handleFacultyResponse}
			activeTab={activeTab}
			onTabChange={handleTabChange}
		/>
	);
};

export default LeaveApplicationController;
