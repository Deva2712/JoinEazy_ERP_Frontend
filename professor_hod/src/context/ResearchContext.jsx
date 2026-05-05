// src/context/ResearchContext.jsx

import React, {
	createContext,
	useContext,
	useReducer,
	useMemo,
	useCallback,
} from "react";
import { researchService } from "../api/services/research.service";
import { userService } from "../api/services/user.service";

const ResearchContext = createContext();

/**
 * Initial state for the Research Module.
 * Tracks user-specific projects/publications, global explore data,
 * active UI selections, and search/filter criteria.
 */
const initialState = {
	myProjects: [],
	myPublications: [],
	availableProjects: [],
	availablePublications: [],
	myApplications: [],
	grantRequests: [],
	grantAdmins: [],
	allUsers: [],
	currentUserSettings: null,

	selectedItem: null,
	selectedUser: null,
	previousSelectedItem: null,
	loading: true,
	error: null,

	filters: {
		status: "all",
		sortBy: "newest",
		showProjects: true,
		showPublications: true,
		category: "all",
		collaborationType: "all",
		year: "all",
	},
	personalSearchQuery: "",
	exploreSearchQuery: "",
};

/**
 * Reducer handling state transitions for data fetching,
 * UI navigation between items/users, and real-time list updates.
 */
function reducer(state, action) {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload, loading: false };
		case "SET_INITIAL_DATA":
			return {
				...state,
				...action.payload,
				loading: false,
			};
		case "SET_USER_SETTINGS":
			return { ...state, currentUserSettings: action.payload };
		case "SET_SELECTED_ITEM":
			return {
				...state,
				selectedItem: action.payload,
				selectedUser: null,
			};
		case "SET_SELECTED_USER":
			return {
				...state,
				selectedUser: action.payload,
				selectedItem: null,
				previousSelectedItem:
					action.prevItem || state.previousSelectedItem,
			};
		case "CLEAR_USER":
			return {
				...state,
				selectedUser: null,
				selectedItem: state.previousSelectedItem,
				previousSelectedItem: null,
			};
		case "SET_FILTERS":
			return {
				...state,
				filters: { ...state.filters, ...action.payload },
			};
		case "SET_PERSONAL_SEARCH":
			return { ...state, personalSearchQuery: action.payload };
		case "SET_EXPLORE_SEARCH":
			return { ...state, exploreSearchQuery: action.payload };
		case "UPDATE_PROJECTS":
			return { ...state, ...action.payload };
		case "UPDATE_ITEM_IN_LISTS": {
			const updatedItem = action.payload;

			const updateList = (list) =>
				list.map((item) =>
					item.id === updatedItem.id ? updatedItem : item,
				);

			const updateApps = (apps) =>
				apps.map((app) => {
					if (
						app.researchId === updatedItem.id ||
						app.projectId === updatedItem.id
					) {
						const freshAppData = updatedItem.applicants?.find(
							(a) => String(a.userId) === String(app.userId),
						);
						return freshAppData ? { ...app, ...freshAppData } : app;
					}
					return app;
				});

			return {
				...state,
				myProjects: updateList(state.myProjects),
				availableProjects: updateList(state.availableProjects),
				myPublications: updateList(state.myPublications),
				availablePublications: updateList(state.availablePublications),
				myApplications: updateApps(state.myApplications),
				selectedItem:
					state.selectedItem?.data.id === updatedItem.id
						? { ...state.selectedItem, data: updatedItem }
						: state.selectedItem,
			};
		}

		default:
			return state;
	}
}

export const ResearchProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	/**
	 * Core ranking algorithm for the 'Relevance' sort option.
	 * Weights title matches, role matches, and recency.
	 */
	const calculateRelevance = useCallback((item, query, activeCategory) => {
		let score = 0;
		const searchLower = (query || "").toLowerCase();

		if (query) {
			if (item.title.toLowerCase().includes(searchLower)) score += 50;

			if (item.category?.toLowerCase().includes(searchLower)) score += 40;

			if (
				item.openRoles?.some((role) =>
					(role.roleName || role.title || "")
						.toLowerCase()
						.includes(searchLower),
				)
			) {
				score += 45;
			}

			const text =
				`${item.description} ${item.abstract || ""}`.toLowerCase();
			if (text.includes(searchLower)) score += 20;
		}

		if (activeCategory !== "all" && item.category === activeCategory) {
			score += 30;
		}

		const ageInDays =
			(new Date() - new Date(item.createdAt || item.publishedDate)) /
			(1000 * 3600 * 24);
		score += Math.max(0, 20 - ageInDays / 30);

		score += (item.starsCount || 0) * 2;

		return score;
	}, []);

	/**
	 * Filters and sorts research items based on current sidebar filters
	 * and search bar input. Supports multi-faceted search (roles, keywords, authors).
	 */
	const processItems = useCallback(
		(items, query, currentFilters) => {
			const lowerQuery = (query || "").toLowerCase();

			let result = items.filter((item) => {
				const matchesStatus =
					currentFilters.status === "all" ||
					item.status === currentFilters.status;

				const matchesCategory =
					currentFilters.category === "all" ||
					item.category === currentFilters.category;

				const matchesCollab =
					currentFilters.collaborationType === "all" ||
					item.collaborationType === currentFilters.collaborationType;

				const matchesSearch =
					!query ||
					item.title?.toLowerCase().includes(lowerQuery) ||
					item.professorName?.toLowerCase().includes(lowerQuery) ||
					item.abstract?.toLowerCase().includes(lowerQuery) ||
					item.category?.toLowerCase().includes(lowerQuery) ||
					item.openRoles?.some((role) =>
						(role.roleName || role.title || "")
							.toLowerCase()
							.includes(lowerQuery),
					) ||
					item.keywords?.some((k) =>
						k.toLowerCase().includes(lowerQuery),
					);

				const matchesYear =
					currentFilters.year === "all" ||
					(item.createdAt &&
						new Date(item.createdAt).getFullYear().toString() ===
							currentFilters.year) ||
					(item.publishedDate &&
						new Date(item.publishedDate)
							.getFullYear()
							.toString() === currentFilters.year);

				return (
					matchesStatus &&
					matchesCategory &&
					matchesCollab &&
					matchesSearch &&
					matchesYear
				);
			});

			return result
				.map((item) => {
					if (!query) return { ...item, currentMatch: null };

					const matchedRole = item.openRoles?.find((r) =>
						(r.roleName || r.title || "")
							.toLowerCase()
							.includes(lowerQuery),
					);

					return {
						...item,
						currentMatch: matchedRole
							? matchedRole.roleName || matchedRole.title
							: null,
					};
				})
				.sort((a, b) => {
					if (currentFilters.sortBy === "stars") {
						return (b.starsCount || 0) - (a.starsCount || 0);
					}

					if (currentFilters.sortBy === "newest") {
						return (
							new Date(b.createdAt || b.publishedDate) -
							new Date(a.createdAt || a.publishedDate)
						);
					}

					if (currentFilters.sortBy === "relevance") {
						const scoreA = calculateRelevance(
							a,
							query,
							currentFilters.category,
						);
						const scoreB = calculateRelevance(
							b,
							query,
							currentFilters.category,
						);

						if (scoreB === scoreA) {
							return (
								new Date(b.createdAt || b.publishedDate) -
								new Date(a.createdAt || a.publishedDate)
							);
						}
						return scoreB - scoreA;
					}

					return 0;
				});
		},
		[calculateRelevance],
	);

	/**
	 * ACTIONS: Logic for API interaction and state synchronization.
	 */

	const onRefresh = async () => {
		dispatch({ type: "SET_LOADING", payload: true });
		try {
			const [dashboardRes, settingsRes] = await Promise.all([
				researchService.getResearchDashboard(),
				userService.getDashboardOverview(),
			]);

			if (dashboardRes.success) {
				// Differentiate between applications sent by the user and those received as an owner
				const sentApps = (dashboardRes.data.myApplications || []).map(
					(app) => ({ ...app, isSentApplication: true }),
				);

				const receivedApps = (dashboardRes.data.myProjects || [])
					.filter((proj) => proj.isOwner && proj.applicants)
					.flatMap((proj) =>
						proj.applicants.map((applicant) => ({
							...applicant,
							projectTitle: proj.title,
							projectId: proj.id,
							isSentApplication: false,
						})),
					);

				dispatch({
					type: "SET_INITIAL_DATA",
					payload: {
						availableProjects: dashboardRes.data.availableProjects,
						myProjects: dashboardRes.data.myProjects,
						availablePublications:
							dashboardRes.data.availablePublications,
						myPublications: dashboardRes.data.myPublications,
						myApplications: [...sentApps, ...receivedApps],
						grantRequests: dashboardRes.data.grantRequests || [],
						grantAdmins: dashboardRes.data.admins || [],
						allUsers: dashboardRes.data.researchers || [],
						currentUserSettings: settingsRes.success
							? settingsRes.data.user || settingsRes.data
							: null,
					},
				});
			}
		} catch (err) {
			console.error("Failed to refresh research data", err);
			dispatch({
				type: "SET_ERROR",
				payload: "Failed to load research data",
			});
		}
	};

	const onStar = async (id) => {
		try {
			const res = await researchService.toggleStar(id);
			if (res.success) {
				if (state.selectedItem && state.selectedItem.data.id === id) {
					const updated = res.data;
					dispatch({
						type: "SET_SELECTED_ITEM",
						payload: { ...state.selectedItem, data: updated },
					});
				}
			}
		} catch (err) {
			console.error("Star toggle failed", err);
		}
	};

	const onApply = async (itemId, formData, itemType = "Project") => {
		try {
			const res = await researchService.newApplication(itemId, {
				...formData,
				itemType,
			});
			if (res.success) onRefresh();
		} catch (err) {
			console.error("Application failed", err);
		}
	};

	const onApplicationAction = async (applicationId, status, feedback) => {
		try {
			const res = await researchService.updateApplicationStatus(
				applicationId,
				status,
				{ feedback },
			);

			if (res.success) {
				dispatch({ type: "UPDATE_ITEM_IN_LISTS", payload: res.data });
				await onRefresh();
			}
		} catch (err) {
			console.error("Application action failed", err);
			dispatch({
				type: "SET_ERROR",
				payload: "Failed to update application status.",
			});
		}
	};

	const onCreateResearch = async (formData) => {
		try {
			const res = await researchService.createResearch(formData);
			if (res.success) onRefresh();
		} catch (err) {
			console.error(err);
		}
	};

	const onUpdateResearch = async (formData) => {
		try {
			const res = await researchService.updateResearch(
				formData.id,
				formData,
			);
			if (res.success) {
				dispatch({ type: "UPDATE_ITEM_IN_LISTS", payload: res.data });
				onRefresh(true);
			}
		} catch (err) {
			console.error("Update failed:", err);
		}
	};

	const onCreateRole = async (researchId, roleData) => {
		try {
			const res = await researchService.createRole(researchId, roleData);
			if (res.success) onRefresh();
		} catch (err) {
			console.error(err);
		}
	};

	const onUpdateRole = async (researchId, roleId, roleData) => {
		try {
			const res = await researchService.updateRole(
				researchId,
				roleId,
				roleData,
			);
			if (res.success) onRefresh();
		} catch (err) {
			console.error(err);
		}
	};

	const onDeleteRole = async (researchId, roleId) => {
		try {
			const res = await researchService.deleteRole(researchId, roleId);
			if (res.success) onRefresh();
		} catch (err) {
			console.error(err);
		}
	};

	const onAddTimelineEvent = async (researchId, eventData) => {
		try {
			const res = await researchService.addTimelineEvent(
				researchId,
				eventData,
			);
			if (res.success) onRefresh();
		} catch (err) {
			console.error(err);
		}
	};

	const onUpdateTimelineEvent = async (researchId, eventId, eventData) => {
		try {
			const res = await researchService.updateTimelineEvent(
				researchId,
				eventId,
				eventData,
			);
			if (res.success) onRefresh();
		} catch (err) {
			console.error(err);
		}
	};

	const onDeleteTimelineEvent = async (researchId, eventId) => {
		try {
			const res = await researchService.deleteTimelineEvent(
				researchId,
				eventId,
			);
			if (res.success) onRefresh();
		} catch (err) {
			console.error(err);
		}
	};

	const onCreateGrantRequest = async (grantData) => {
		try {
			const myItems = [...state.myProjects, ...state.myPublications];
			const targetItem = myItems.find(
				(item) => item.id === grantData.targetId,
			);

			if (!targetItem || !targetItem.isOwner) {
				dispatch({
					type: "SET_ERROR",
					payload:
						"Unauthorized: Only the primary owner can request grants for this item.",
				});
				return { success: false, message: "Ownership required." };
			}

			const res = await researchService.createGrantRequest(grantData);
			if (res.success) {
				await onRefresh();
			}
			return res;
		} catch (err) {
			console.error("Grant request creation failed:", err);
			dispatch({
				type: "SET_ERROR",
				payload: "Failed to submit grant request.",
			});
		}
	};

	const onUpdateGrantRequest = async (grantId, grantData) => {
		try {
			const res = await researchService.resubmitGrantRequest(
				grantId,
				grantData,
			);
			if (res.success) {
				await onRefresh();
			}
			return res;
		} catch (err) {
			console.error("Grant resubmission failed:", err);
			dispatch({
				type: "SET_ERROR",
				payload: "Failed to resubmit grant request.",
			});
		}
	};

	const onUpdateUser = async (userData) => {
		try {
			const res = await researchService.updateUserProfile(
				userData.id,
				userData,
			);
			if (res.success) onRefresh();
		} catch (err) {
			console.error(err);
		}
	};

	/**
	 * DERIVED DATA: Memoized computations for UI-specific data views.
	 */

	/**
	 * Returns project and publication lists for the "My Workspace" view,
	 * applying local personal search queries and active filters.
	 */
	const filteredWorkLists = useMemo(() => {
		return {
			myProjects: processItems(
				state.myProjects,
				state.personalSearchQuery,
				state.filters,
			),
			myPublications: processItems(
				state.myPublications,
				state.personalSearchQuery,
				state.filters,
			),
			availableProjects: processItems(
				[...state.availableProjects, ...state.myProjects],
				state.exploreSearchQuery,
				state.filters,
			),
			availablePublications: processItems(
				[...state.availablePublications, ...state.myPublications],
				state.exploreSearchQuery,
				state.filters,
			),
		};
	}, [state, processItems]);

	/**
	 * Manages the visible application tracking lists.
	 * Handles visibility logic for accepted/rejected states.
	 */
	const applicationLists = useMemo(() => {
		const { myApplications, personalSearchQuery } = state;
		const now = new Date();
		const gracePeriod = 2000;

		const getFiltered = (viewType) => {
			return myApplications
				.filter((app) => {
					const status = app.status?.toLowerCase();
					const updatedDate = new Date(
						app.updatedAt || app.appliedDate || 0,
					);

					if (status === "rejected") return false;

					if (status === "accepted") {
						if (now - updatedDate > gracePeriod) return false;
					}

					const isSent = app.isSentApplication;
					const matchesView = viewType === "sent" ? isSent : !isSent;
					if (!matchesView) return false;

					const matchesSearch =
						!personalSearchQuery ||
						app.projectTitle
							?.toLowerCase()
							.includes(personalSearchQuery.toLowerCase()) ||
						app.professorName
							?.toLowerCase()
							.includes(personalSearchQuery.toLowerCase()) ||
						app.name
							?.toLowerCase()
							.includes(personalSearchQuery.toLowerCase()) ||
						app.role
							?.toLowerCase()
							.includes(personalSearchQuery.toLowerCase());

					return matchesSearch;
				})
				.sort((a, b) => {
					const statusA = a.status?.toLowerCase();
					const statusB = b.status?.toLowerCase();
					const priorityStatus = "meeting scheduled";
					if (
						statusA === priorityStatus &&
						statusB !== priorityStatus
					)
						return -1;
					if (
						statusA !== priorityStatus &&
						statusB === priorityStatus
					)
						return 1;
					return (
						new Date(b.appliedDate || 0) -
						new Date(a.appliedDate || 0)
					);
				});
		};

		return {
			received: getFiltered("received"),
			sent: getFiltered("sent"),
		};
	}, [state.myApplications, state.personalSearchQuery]);

	/**
	 * Processes data for the "Explore" Feed.
	 * Returns sorted results for popular, newest, and search results.
	 */
	const exploreData = useMemo(() => {
		const query = state.exploreSearchQuery.toLowerCase();

		const combinedItems = [];
		if (state.filters.showProjects) {
			const allProjs = [...state.availableProjects, ...state.myProjects];
			combinedItems.push(
				...allProjs.map((p) => ({ ...p, itemType: "project" })),
			);
		}
		if (state.filters.showPublications) {
			const allPubs = [
				...state.availablePublications,
				...state.myPublications,
			];
			combinedItems.push(
				...allPubs.map((p) => ({ ...p, itemType: "publication" })),
			);
		}

		const uniqueRawItems = Array.from(
			new Map(combinedItems.map((item) => [item.id, item])).values(),
		);

		const uniqueItems = processItems(
			uniqueRawItems,
			state.exploreSearchQuery,
			state.filters,
		);

		const popular = [...uniqueItems].sort(
			(a, b) => (b.starsCount || 0) - (a.starsCount || 0),
		);
		const newest = [...uniqueItems].sort(
			(a, b) =>
				new Date(b.createdAt || b.publishedDate) -
				new Date(a.createdAt || a.publishedDate),
		);

		const searchResults = !state.exploreSearchQuery ? [] : uniqueItems;

		const filteredContributors = !state.exploreSearchQuery
			? []
			: state.allUsers.filter(
					(u) =>
						u.name?.toLowerCase().includes(query) ||
						u.department?.toLowerCase().includes(query),
				);

		return { popular, newest, searchResults, filteredContributors };
	}, [
		state.availableProjects,
		state.availablePublications,
		state.myProjects,
		state.myPublications,
		state.filters,
		state.exploreSearchQuery,
		state.allUsers,
		processItems,
	]);

	/**
	 * Filters projects and publications for the "User Profile" view,
	 * ensuring items where the user is an owner or collaborator are shown.
	 */
	const userPortfolio = useMemo(() => {
		if (!state.selectedUser) return { projects: [], publications: [] };
		const u = state.selectedUser;

		const projects = [
			...state.myProjects,
			...state.availableProjects,
		].filter(
			(p) =>
				p.ownerId === u.id ||
				p.professorName === u.name ||
				p.isOwner === true ||
				p.collaborators?.includes(u.name),
		);

		const publications = [
			...state.myPublications,
			...state.availablePublications,
		].filter(
			(pub) =>
				pub.authorId === u.id ||
				pub.professorName === u.name ||
				pub.isOwner === true ||
				pub.coAuthors?.includes(u.name),
		);

		return {
			projects: Array.from(
				new Map(projects.map((i) => [i.id, i])).values(),
			),
			publications: Array.from(
				new Map(publications.map((i) => [i.id, i])).values(),
			),
		};
	}, [
		state.selectedUser,
		state.myProjects,
		state.availableProjects,
		state.myPublications,
		state.availablePublications,
	]);

	const value = useMemo(
		() => ({
			state,
			filteredWorkLists,
			applicationLists,
			exploreData,
			userPortfolio,
			actions: {
				onRefresh,
				onStar,
				onApply,
				onApplicationAction,
				onCreateResearch,
				onUpdateResearch,
				onCreateRole,
				onUpdateRole,
				onDeleteRole,
				onAddTimelineEvent,
				onUpdateTimelineEvent,
				onDeleteTimelineEvent,
				onCreateGrantRequest,
				onUpdateGrantRequest,
				onUpdateUser,
				setFilters: (f) => {
					const nextFilters =
						typeof f === "function" ? f(state.filters) : f;
					dispatch({ type: "SET_FILTERS", payload: nextFilters });
				},
				onPersonalSearchChange: (q) =>
					dispatch({ type: "SET_PERSONAL_SEARCH", payload: q }),
				onExploreSearchChange: (q) =>
					dispatch({ type: "SET_EXPLORE_SEARCH", payload: q }),
				setSelectedItem: (item) =>
					dispatch({ type: "SET_SELECTED_ITEM", payload: item }),
				onViewUser: (user, prevItem) =>
					dispatch({
						type: "SET_SELECTED_USER",
						payload: user,
						prevItem,
					}),
				onClearUser: () => dispatch({ type: "CLEAR_USER" }),
			},
		}),
		[state, filteredWorkLists, exploreData, userPortfolio],
	);

	return (
		<ResearchContext.Provider value={value}>
			{children}
		</ResearchContext.Provider>
	);
};

export const useResearch = () => {
	const context = useContext(ResearchContext);
	if (!context)
		throw new Error("useResearch must be used within a ResearchProvider");
	return context;
};
