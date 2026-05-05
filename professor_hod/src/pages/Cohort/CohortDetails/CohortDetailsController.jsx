import React, { useState, useEffect } from "react";
import DetailsUI from "./CohortDetailsUI";
import { courseService } from "../../../api/services/course.service";
import { cohortService } from "../../../api/services/cohort.service";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

const DetailsController = ({ cohortId, cohortData, isStaff }) => {
	const [detailsData, setDetailsData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [refreshKey, setRefreshKey] = useState(0);
	const [apiData, setApiData] = useState(null);
	const navigate = useNavigate();

	// Fetch cohort details from API
	const fetchDetailsData = async () => {
		try {
			setLoading(true);
			setError(null);

			console.log("Fetching course details for cohortId:", cohortId);
			const response = await courseService.getCourseDetails(cohortId);
			console.log("Course details API response:", response);

			if (response.success) {
				const data = response.data; // No need for nested .data access anymore
				console.log("Actual course details data:", data);

				// Store the API data for fallback use
				setApiData(data);

				// Format date to match API mock data (M/D/YYYY format)
				const createdRaw =
					data.created_at ||
					data.createdAt ||
					data.created_on ||
					data.createdDate;
				let createdText = "Unknown";

				if (createdRaw) {
					try {
						const date = new Date(createdRaw);
						if (!isNaN(date)) {
							// Format as M/D/YYYY to match API mock data
							createdText = date.toLocaleDateString("en-US", {
								month: "numeric",
								day: "numeric",
								year: "numeric",
							});
						}
					} catch (e) {
						console.error("Error parsing date:", e);
					}
				}

				// Extract member count from API data (use member_count or default to 0)
				const memberCount = Number(
					data.member_count ??
						data.memberCount ??
						data.participant_count ??
						0,
				);

				// Extract organization name from API data
				const organizationName =
					data.organization_name ||
					data.organizationName ||
					"Mahindra University";

				// Create quick details to match API mock data format exactly
				const baseQuickDetails = [
					{
						id: 1,
						icon: "Calendar",
						text: `Created: ${createdText}`,
					},
					{
						id: 2,
						icon: "Building2",
						text: `Organization: ${organizationName}`,
					},
					{
						id: 3,
						icon: "Users",
						text: `Total Members: ${memberCount}`,
					},
					{
						id: 4,
						icon: "Badge",
						text: `Status: ${data.visibility || data.status || "Active"}`,
					},
				];

				// Removed groups/members summary per request

				// Add Share button only for professors
				if (isStaff) {
					baseQuickDetails.push({
						id: 7,
						icon: "Share2",
						text: "Share this Page",
						isShareable: true,
					});
				}

				// Transform API data to match UI expectations
				const savedSections = Array.isArray(data.detail_sections)
					? data.detail_sections
					: [];

				// Map saved sections
				const savedMapped = savedSections.map((section) => ({
					id: section.id,
					title: section.title,
					content: section.subsec_description || "",
				}));

				// Always use saved sections only; do not auto-add defaults
				const containers = savedMapped;

				const transformedData = {
					containers,
					quickDetails: baseQuickDetails,
				};

				console.log("Transformed data:", transformedData);
				setDetailsData(transformedData);
			} else {
				// Check if the error is due to authentication
				if (
					response.status === 401 ||
					response.message?.includes("unauthorized")
				) {
					console.log("Authentication error, redirecting to login");
					navigate("/login", {
						state: {
							from: `/c/${cohortId}`,
							message: "Please log in to view this course",
						},
					});
					return;
				}

				setError(response.error || "Failed to fetch details");
				// Fallback to empty containers if API fails
				setDetailsData({
					containers: [],
					quickDetails: [
						{
							id: 1,
							icon: "Calendar",
							text: "Created 21st June 2025",
						},
						{
							id: 2,
							icon: "Clock",
							text: "Last updated 2 days ago",
						},
					],
				});
			}
		} catch (error) {
			console.error("Error fetching details:", error);

			// Check if the error is due to authentication
			if (
				error.status === 401 ||
				error.message?.includes("unauthorized")
			) {
				console.log(
					"Authentication error in catch block, redirecting to login",
				);
				navigate("/login", {
					state: {
						from: `/c/${cohortId}`,
						message: "Please log in to view this course",
					},
				});
				return;
			}

			setError("Failed to load details");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (cohortId) {
			fetchDetailsData();
		}
	}, [cohortId, refreshKey]);

	const handleSubSectionSave = async ({ id, title, content }) => {
		try {
			console.log("Saving section with ID:", id, "Title:", title);
			console.log("Current containers:", detailsData?.containers);

			// Check if this is a default card (hardcoded IDs 1, 2, 3) and hasn't been saved yet
			const isDefaultCard = [1, 2, 3].includes(id);

			if (isDefaultCard) {
				console.log("Creating new section for default card");
				// For default cards, create a new section instead of updating
				const response = await cohortService.addDetailSection(
					cohortId,
					{
						title: title.trim(),
						subsec_description: content.trim(),
					},
				);

				console.log("Add section response:", response);

				if (response.success) {
					// Update local state with new ID
					const newId =
						response.data.id ||
						response.data.data?.id ||
						Date.now();
					console.log("New section created with ID:", newId);

					setDetailsData((prevData) => ({
						...prevData,
						containers: prevData.containers.map((container) =>
							container.id === id
								? { ...container, id: newId, title, content }
								: container,
						),
					}));

					return null; // Success
				} else {
					return response.error || "Failed to create section";
				}
			} else {
				console.log("Updating existing section with ID:", id);
				// For existing sections (including previously saved default cards), update them
				const response = await cohortService.editDetailSection(
					cohortId,
					id,
					{
						title,
						subsec_description: content,
					},
				);

				console.log("Edit section response:", response);

				if (response.success) {
					// Update local state
					setDetailsData((prevData) => ({
						...prevData,
						containers: prevData.containers.map((container) =>
							container.id === id
								? { ...container, title, content }
								: container,
						),
					}));
					return null; // Success
				} else {
					console.error("Edit section failed:", response.error);
					// If edit fails, try creating a new section instead
					console.log("Trying to create new section instead");
					const createResponse = await cohortService.addDetailSection(
						cohortId,
						{
							title: title.trim(),
							subsec_description: content.trim(),
						},
					);

					if (createResponse.success) {
						const newId =
							createResponse.data.id ||
							createResponse.data.data?.id ||
							Date.now();
						console.log("Created new section with ID:", newId);

						setDetailsData((prevData) => ({
							...prevData,
							containers: prevData.containers.map((container) =>
								container.id === id
									? {
											...container,
											id: newId,
											title,
											content,
										}
									: container,
							),
						}));

						return null; // Success
					} else {
						return createResponse.error || "Failed to save section";
					}
				}
			}
		} catch (error) {
			console.error("Error saving section:", error);
			return "Failed to save section";
		}
	};

	const handleSubSectionCreate = async ({ title, content }) => {
		try {
			// Validation
			if (!title.trim()) {
				return "Title is required";
			}
			if (!content.trim()) {
				return "Content is required";
			}

			const response = await cohortService.addDetailSection(cohortId, {
				title: title.trim(),
				subsec_description: content.trim(),
			});

			if (response.success) {
				// Add to local state
				const newContainer = {
					id:
						response.data.id ||
						response.data.data?.id ||
						Date.now(),
					title: title.trim(),
					content: content.trim(),
				};

				setDetailsData((prevData) => ({
					...prevData,
					containers: [...prevData.containers, newContainer],
				}));

				return null; // Success
			} else {
				return response.error || "Failed to create section";
			}
		} catch (error) {
			console.error("Error creating section:", error);
			return "Failed to create section";
		}
	};

	const handleSubSectionDelete = async (sectionId) => {
		try {
			console.log("Deleting section with ID:", sectionId);

			// Check if this is a default card (hardcoded IDs 1, 2, 3)
			const isDefaultCard = [1, 2, 3].includes(sectionId);

			if (isDefaultCard) {
				// For default cards, just remove from local state
				setDetailsData((prevData) => ({
					...prevData,
					containers: prevData.containers.filter(
						(container) => container.id !== sectionId,
					),
				}));
				return null; // Success
			} else {
				// For saved sections, call the API
				const response = await cohortService.deleteDetailSection(
					cohortId,
					sectionId,
				);

				if (response.success) {
					// Remove from local state
					setDetailsData((prevData) => ({
						...prevData,
						containers: prevData.containers.filter(
							(container) => container.id !== sectionId,
						),
					}));

					return null; // Success
				} else {
					return response.error || "Failed to delete section";
				}
			}
		} catch (error) {
			console.error("Error deleting section:", error);
			return "Failed to delete section";
		}
	};

	const handleRefresh = () => {
		setRefreshKey((prev) => prev + 1);
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-gray-400">
				<RefreshCw className="size-12 animate-spin mb-4 text-blue-500" />
				<p className="font-bold text-gray-900 dark:text-white">
					Loading Cohort Details
				</p>
				<p className="text-sm">
					Please wait while we sync your cohort details...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6">
				<div className="text-center">
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						Failed to load details
					</h3>
					<p className="text-gray-600 mb-4">{error}</p>
					<button
						onClick={fetchDetailsData}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<DetailsUI
			cohortId={cohortId}
			cohortData={cohortData}
			detailsData={detailsData}
			isStaff={isStaff}
			handleSubSectionSave={handleSubSectionSave}
			handleSubSectionCreate={handleSubSectionCreate}
			handleSubSectionDelete={handleSubSectionDelete}
			quickDetails={detailsData?.quickDetails}
		/>
	);
};

export default DetailsController;
