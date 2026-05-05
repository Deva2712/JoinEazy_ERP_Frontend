// src/pages/Research/ResearchUI.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	BookOpen,
	ArrowLeft,
	Compass,
	Send,
	Microscope,
	RefreshCw,
	AlertTriangle,
	Wallet,
	User, // Added for Support tab icon
} from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import AdminContactSidebar from "../../components/common/AdminContactSidebar"; // Added AdminContactSidebar

import MyProjectsView from "./views/MyProjectsView";
import MyPublicationsView from "./views/MyPublicationsView";
import ExploreResearchView from "./views/ExploreResearchView";
import ApplicationsView from "./views/ApplicationsView";
import GrantsView from "./views/GrantsView";
import ResearchDetailsView from "./views/ResearchDetailsView";
import UserProfileView from "./views/UserProfileView";

import ApplicationModal from "./components/ApplicationModal";
import PostResearchModal from "./components/PostResearchModal";
import RoleManagementModal from "./components/RoleManagementModal";
import TimelineManagementModal from "./components/TimelineManagementModal";
import EditProfileModal from "./components/EditProfileModal";
import GrantRequestModal from "./components/GrantRequestModal";
import ResearchFilterSidebar from "./components/ResearchFilterSidebar";

/**
 * ResearchUI is the primary layout component for the Research module.
 * It manages the switching between different views (Projects, Publications, Explore, Applications)
 * and handles the visibility of various management modals.
 */
const ResearchUI = ({ collections, viewState, handlers }) => {
	const { filtered, raw, explore, applications, grants, userPortfolio } =
		collections;
	const {
		loading,
		error,
		viewMode,
		selectedItem,
		selectedUser,
		personalSearchQuery,
		exploreSearchQuery,
		filters,
	} = viewState;
	const {
		onRefresh,
		onTabChange,
		onApply,
		onStar,
		setSelectedItem,
		setFilters,
		onPersonalSearchChange,
		onExploreSearchChange,
		onCreateResearch,
		onUpdateResearch,
		onCreateRole,
		onUpdateRole,
		onDeleteRole,
		onAddTimelineEvent,
		onUpdateTimelineEvent,
		onDeleteTimelineEvent,
		onViewUser,
		onClearUser,
		onUpdateUser,
		onApplicationAction,
		onCreateGrantRequest,
		onUpdateGrantRequest,
	} = handlers;

	const [createType, setCreateType] = useState("Project");
	const [editData, setEditData] = useState(null);
	const [activeResearchId, setActiveResearchId] = useState(null);
	const [editingRole, setEditingRole] = useState(null);
	const [editingEvent, setEditingEvent] = useState(null);

	const [activeOverlay, setActiveOverlay] = useState(null);

	/**
	 * Ensures the window scrolls to the top whenever the user drills into
	 * a specific item, user profile, or changes the main view tab.
	 */
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [selectedItem, selectedUser, viewMode]);

	const closeModal = () => {
		setActiveOverlay(null);
		setEditingRole(null);
		setEditingEvent(null);
		setEditData(null);
	};

	const handleOpenCreateResearchModal = (type) => {
		setEditData(null);
		setCreateType(type);
		setActiveOverlay("post");
	};

	const handleOpenEditResearchModal = (item, type) => {
		setEditData(item);
		setCreateType(type);
		setActiveOverlay("post");
	};

	const handleOpenRoleModal = (researchId, role = null) => {
		setActiveResearchId(researchId);
		setEditingRole(role);
		setActiveOverlay("role");
	};

	/**
	 * Dispatches role creation or update logic based on whether an
	 * existing role is currently being edited.
	 */
	const handleRoleSubmit = (formData) => {
		if (editingRole && editingRole.id) {
			onUpdateRole(activeResearchId, editingRole.id, formData);
		} else {
			onCreateRole(activeResearchId, formData);
		}
		closeModal();
	};

	/**
	 * Dispatches timeline event creation or update logic for a specific research project.
	 */
	const handleTimelineSubmit = (formData) => {
		if (editingEvent) {
			onUpdateTimelineEvent(
				selectedItem.data.id,
				editingEvent.id,
				formData,
			);
		} else {
			onAddTimelineEvent(selectedItem.data.id, formData);
		}
		closeModal();
	};

	const handleOpenTimelineModal = (event = null) => {
		setEditingEvent(event);
		setActiveOverlay("timeline");
	};

	const handleEditGrant = (grant) => {
		setEditData(grant);
		setActiveOverlay("grant-modal");
	};

	/**
	 * Aggregates unique names from lead professors and collaborators
	 * to provide a list of potential contributors for timeline events.
	 */
	const getPotentialContributors = () => {
		if (!selectedItem?.data) return [];
		const item = selectedItem.data;
		const mainLead = item.professorName ? [item.professorName] : [];
		const others = item.collaborators || item.coAuthors || [];
		return [...new Set([...mainLead, ...others])];
	};

	const navigate = useNavigate();

	const statsData = [
		{
			label: "My Projects",
			value: raw.myProjects.length.toString(),
			icon: Microscope,
		},
		{
			label: "My Publications",
			value: raw.myPublications.length.toString(),
			icon: BookOpen,
		},
	];

	/**
	 * Navigation tabs configuration. Includes a mobile-only Support tab
	 * to show the AdminContactSidebar.
	 */
	const tabs = [
		{ key: "my-projects", label: "My Projects", icon: Microscope },
		{ key: "my-publications", label: "My Publications", icon: BookOpen },
		{ key: "explore", label: "Explore", icon: Compass },
		{ key: "grants", label: "Grants", icon: Wallet },
		{ key: "support", label: "Support", icon: User, mobileOnly: true },
		{ key: "my-applications", label: "Applications", icon: Send },
	];

	/**
	 * Derives a list of all unique categories used across projects and publications
	 * for use in the filtering sidebar.
	 */
	const availableCategories = React.useMemo(() => {
		const allItems = [...raw.projects, ...raw.publications];
		return [...new Set(allItems.map((item) => item.category))]
			.filter(Boolean)
			.sort();
	}, [raw.projects, raw.publications]);

	/**
	 * Derives a list of all unique years based on creation or publication dates
	 * to allow users to filter research by time period.
	 */
	const availableYears = React.useMemo(() => {
		const allItems = [...raw.projects, ...raw.publications];
		const years = allItems.map((item) => {
			const date = item.createdAt || item.publishedDate;
			return date ? new Date(date).getFullYear().toString() : null;
		});
		return [...new Set(years.filter(Boolean))].sort((a, b) => b - a);
	}, [raw.projects, raw.publications]);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 font-sans">
			<HeaderController />

			{/* HEADER SECTION */}
			<div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-800 dark:from-emerald-900 dark:via-emerald-950 dark:to-teal-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/dashboard")}
								className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
							>
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">
									Research & Publications
								</h1>
								<p className="text-white/70 text-sm mt-0.5">
									Manage your research work and explore
									literature.
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3 pb-2 md:pb-0">
							{statsData.map((stat, index) => (
								<StatSummaryCard
									key={index}
									label={stat.label}
									value={stat.value}
									icon={stat.icon}
								/>
							))}
						</div>
					</div>

					{/* NAVIGATION TABS */}
					<div className="flex items-center gap-1 overflow-x-auto scrollbar-hide no-scrollbar">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							const isActive = viewMode === tab.key;
							let badgeCount = 0;

							// Count for Grants tab
							if (tab.key === "grants") {
								badgeCount = grants.requests.length;
							}

							// Count for Applications tab
							if (tab.key === "my-applications") {
								badgeCount = applications.received?.length || 0;
							}

							return (
								<button
									key={tab.key}
									onClick={() => onTabChange(tab.key)}
									className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
										tab.mobileOnly ? "lg:hidden" : ""
									} ${
										isActive
											? "bg-gray-50 dark:bg-[#0f1117] text-emerald-700 dark:text-emerald-400"
											: "text-white/70 hover:text-white hover:bg-white/10"
									}`}
								>
									<Icon className="w-4 h-4" />
									{tab.label}
									{badgeCount > 0 && (
										<span
											className={`inline-flex items-center justify-center text-[10px] font-bold w-[18px] h-[18px] rounded-full ml-1.5 ${
												isActive
													? "bg-emerald-600 text-white"
													: "bg-white text-emerald-700"
											}`}
										>
											{badgeCount}
										</span>
									)}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-6 w-full pb-24 md:pb-12">
				{/* ERROR STATE */}
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertTriangle className="size-10 text-red-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{error}
						</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" />
							Try Again
						</button>
					</div>
				) : loading ? (
					/* LOADING STATE */
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-emerald-600" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Research Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your research projects
							and publications...
						</p>
					</div>
				) : selectedUser ? (
					/* USER PROFILE VIEW: Displayed when clicking on a researcher's name */
					<>
						<button
							onClick={onClearUser}
							className="inline-flex items-center gap-2.5 py-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition-all group rounded-full"
						>
							<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-emerald-200 dark:group-hover:border-emerald-800 group-hover:shadow-sm transition-all">
								<ArrowLeft className="size-4" />
							</div>
							<span className="text-xs uppercase tracking-widest">
								Return
							</span>
						</button>
						<UserProfileView
							user={selectedUser}
							projects={userPortfolio.projects}
							publications={userPortfolio.publications}
							onSelectItem={setSelectedItem}
							onStar={onStar}
							onEditProfile={() => setActiveOverlay("profile")}
							onBack={onClearUser}
						/>
					</>
				) : selectedItem ? (
					/* RESEARCH DETAILS VIEW: Detailed view for a single project or publication */
					<>
						<button
							onClick={() => setSelectedItem(null)}
							className="inline-flex items-center gap-2.5 py-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition-all group rounded-full"
						>
							<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-emerald-200 dark:group-hover:border-emerald-800 group-hover:shadow-sm transition-all">
								<ArrowLeft className="size-4" />
							</div>
							<span className="text-xs uppercase tracking-widest">
								Return
							</span>
						</button>

						<ResearchDetailsView
							type={selectedItem.type}
							data={selectedItem.data}
							onApply={() => setActiveOverlay("apply")}
							onStar={onStar}
							onViewUser={onViewUser}
							onEdit={() =>
								handleOpenEditResearchModal(
									selectedItem.data,
									selectedItem.type === "project"
										? "Project"
										: "Publication",
								)
							}
							onCreateRole={(id) => handleOpenRoleModal(id)}
							onUpdateRole={(id, roleId) => {
								const role = selectedItem.data.openRoles?.find(
									(r) => r.id === roleId,
								);
								handleOpenRoleModal(id, role);
							}}
							onDeleteRole={onDeleteRole}
							onAddTimeline={() => handleOpenTimelineModal()}
							onEditTimeline={(event) =>
								handleOpenTimelineModal(event)
							}
							onDeleteTimeline={onDeleteTimelineEvent}
						/>
					</>
				) : (
					/* MAIN DASHBOARD VIEWS: Conditional rendering based on the active tab (viewMode) */
					<div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div
							className={`flex-grow ${viewMode === "support" ? "block lg:hidden" : "block"}`}
						>
							{viewMode === "support" ? (
								/* MOBILE SUPPORT TAB */
								<AdminContactSidebar
									admins={grants.admins}
									themeColor="emerald"
									isTabbedView={true}
								/>
							) : (
								<div className="transition-all duration-300">
									{viewMode === "my-projects" && (
										<MyProjectsView
											myProjects={filtered.myProjects}
											onSelectItem={setSelectedItem}
											searchQuery={personalSearchQuery}
											onSearchChange={
												onPersonalSearchChange
											}
											onPostNew={() =>
												handleOpenCreateResearchModal(
													"Project",
												)
											}
											onOpenFilters={() =>
												setActiveOverlay("filter")
											}
										/>
									)}
									{viewMode === "my-publications" && (
										<MyPublicationsView
											myPublications={
												filtered.myPublications
											}
											onSelectItem={setSelectedItem}
											searchQuery={personalSearchQuery}
											onSearchChange={
												onPersonalSearchChange
											}
											onPostNew={() =>
												handleOpenCreateResearchModal(
													"Publication",
												)
											}
											onOpenFilters={() =>
												setActiveOverlay("filter")
											}
										/>
									)}
									{viewMode === "explore" && (
										<ExploreResearchView
											exploreData={explore}
											availableProjects={
												filtered.availableProjects
											}
											availablePublications={
												filtered.availablePublications
											}
											onSelectItem={setSelectedItem}
											onViewUser={onViewUser}
											searchQuery={exploreSearchQuery}
											onSearchChange={
												onExploreSearchChange
											}
											onOpenFilters={() =>
												setActiveOverlay("filter")
											}
										/>
									)}
									{viewMode === "my-applications" && (
										<ApplicationsView
											applicationLists={applications}
											searchQuery={personalSearchQuery}
											onSearchChange={
												onPersonalSearchChange
											}
											onApplicationAction={
												onApplicationAction
											}
											onViewUser={onViewUser}
										/>
									)}
									{viewMode === "grants" && (
										<GrantsView
											requests={grants.requests}
											admins={grants.admins}
											collections={collections}
											onViewResearch={setSelectedItem}
											onPostNew={() =>
												setActiveOverlay("grant-modal")
											}
											onEdit={handleEditGrant}
										/>
									)}
								</div>
							)}
						</div>
					</div>
				)}
			</main>

			{/* MODAL OVERLAYS: Managed by the activeOverlay state */}

			<ApplicationModal
				isOpen={activeOverlay === "apply"}
				type={
					selectedItem?.type === "project" ? "Project" : "Publication"
				}
				data={selectedItem?.data}
				onClose={closeModal}
				onSubmit={(formData) =>
					onApply(
						selectedItem?.data?.id,
						formData,
						selectedItem?.type === "project"
							? "Project"
							: "Publication",
					)
				}
			/>

			<PostResearchModal
				isOpen={activeOverlay === "post"}
				type={createType}
				initialData={editData}
				allUsers={viewState.allUsers}
				onClose={closeModal}
				onSubmit={editData ? onUpdateResearch : onCreateResearch}
			/>

			<RoleManagementModal
				isOpen={activeOverlay === "role"}
				initialData={editingRole}
				onClose={closeModal}
				onSubmit={handleRoleSubmit}
			/>

			<TimelineManagementModal
				isOpen={activeOverlay === "timeline"}
				initialData={editingEvent}
				onClose={closeModal}
				onSubmit={handleTimelineSubmit}
				availableContributors={getPotentialContributors()}
			/>

			<EditProfileModal
				isOpen={activeOverlay === "profile"}
				user={selectedUser}
				onClose={closeModal}
				onSubmit={onUpdateUser}
			/>

			<GrantRequestModal
				isOpen={activeOverlay === "grant-modal"}
				onClose={closeModal}
				initialData={editData}
				collections={collections}
				onSubmit={(formData) => {
					if (formData.id) {
						onUpdateGrantRequest(formData);
					} else {
						onCreateGrantRequest(formData);
					}
					closeModal();
				}}
			/>

			<ResearchFilterSidebar
				filters={filters}
				setFilters={setFilters}
				showTypeFilters={viewMode === "explore"}
				counts={{
					projects: filtered.availableProjects.length,
					publications: filtered.availablePublications.length,
				}}
				availableCategories={availableCategories}
				availableYears={availableYears}
				isOpen={activeOverlay === "filter"}
				onClose={closeModal}
			/>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default ResearchUI;
