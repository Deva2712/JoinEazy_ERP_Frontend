// src/pages/Research/ResearchController.jsx

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResearch } from "../../context/ResearchContext";
import ResearchUI from "./ResearchUI";

/**
 * ResearchController
 * Acts as the logic layer that bridges the URL state (via React Router)
 * with the ResearchContext state. It handles initial data fetching
 * and deep-linking to specific projects, publications, or user profiles.
 */
const ResearchController = () => {
	const { tab, projectId, pubId, userId } = useParams();
	const navigate = useNavigate();

	const {
		state,
		filteredWorkLists,
		applicationLists,
		exploreData,
		userPortfolio,
		actions,
	} = useResearch();

	// Defaults to "my-projects" if no tab is specified in the URL
	const viewMode = tab || "my-projects";

	/**
	 * Initial Load: Sets the document title and triggers
	 * the global data refresh from the API.
	 */
	useEffect(() => {
		document.title = "Research & Publications";
		actions.onRefresh();
	}, []);

	/**
	 * URL Synchronization:
	 * Monitors URL parameters to set the "SelectedItem" (Project/Pub)
	 * or "SelectedUser" in the global state. This allows for
	 * direct bookmarking and browser back/forward navigation.
	 */
	useEffect(() => {
		if (state.loading || state.allUsers.length === 0) return;

		// Handle User Profile deep-linking
		if (userId) {
			const user = state.allUsers.find((u) => u.id === userId);
			if (user) actions.onViewUser(user);
			return;
		}

		const id = projectId || pubId;
		if (!id) {
			actions.setSelectedItem(null);
			return;
		}

		// Handle Project deep-linking
		if (projectId) {
			const proj = [...state.myProjects, ...state.availableProjects].find(
				(p) => p.id === projectId,
			);
			if (proj) {
				actions.setSelectedItem({
					type: "project",
					data: proj,
					viewType: proj.isOwner ? "professor" : "student",
				});
			}
		}
		// Handle Publication deep-linking
		else if (pubId) {
			const pub = [
				...state.myPublications,
				...state.availablePublications,
			].find((p) => p.id === pubId || p.url === pubId);
			if (pub)
				actions.setSelectedItem({ type: "publication", data: pub });
		}
	}, [projectId, pubId, userId, state.loading, state.allUsers]);

	return (
		<ResearchUI
			/**
			 * Grouped research data sets derived from Context
			 */
			collections={{
				filtered: filteredWorkLists,
				raw: {
					projects: state.availableProjects,
					publications: state.availablePublications,
					myProjects: state.myProjects,
					myPublications: state.myPublications,
				},
				explore: exploreData,
				applications: applicationLists,
				grants: {
					requests: state.grantRequests,
					admins: state.grantAdmins,
				},
				userPortfolio,
			}}
			/**
			 * Consolidated UI and navigation state
			 */
			viewState={{
				...state,
				viewMode,
			}}
			/**
			 * Event handlers that wrap Context actions with Navigation logic
			 */
			handlers={{
				...actions,
				onTabChange: (newTab) => {
					actions.onClearUser();
					navigate(`/research-publications/${newTab}`);
				},
				onViewUser: (idOrName) => {
					const user = state.allUsers.find(
						(u) => u.id === idOrName || u.name === idOrName,
					);
					if (user) {
						navigate(
							`/research-publications/${viewMode}/user/${user.id}`,
						);
					}
				},
				setSelectedItem: (item) => {
					if (!item) navigate(`/research-publications/${viewMode}`);
					else {
						const id =
							item.type === "publication"
								? item.data.url || item.data.id
								: item.data.id;
						navigate(
							`/research-publications/${viewMode}/${item.type}/${id}`,
						);
					}
				},
			}}
		/>
	);
};

export default ResearchController;
