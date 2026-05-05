import React, { useState } from "react";
import { Plus, FileText, AlertCircle, RefreshCw } from "lucide-react";
import AssignmentCard from "./components/AssignmentCard";
import AssignmentFilters from "./components/AssignmentFilters";
import AssignmentDetailsModal from "./modals/AssignmentDetailsModal";
import SubmissionsModal from "./modals/SubmissionsModal";
import CreateAssignmentModal from "./modals/CreateAssignmentModal";
import EditAssignmentModal from "./modals/EditAssignmentModal";
import {
	filterAssignments,
	getMockSubmissions,
} from "./utils/assignmentHelpers";

const ProfessorAssignmentsUI = ({
	assignments,
	loading,
	error,
	totalMembers,
	totalGroups,
	onCreateAssignment,
	onUpdateAssignment,
	onDeleteAssignment,
	onViewSubmissions,
}) => {
	// Modal states
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingAssignment, setEditingAssignment] = useState(null);
	const [selectedAssignment, setSelectedAssignment] = useState(null);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);

	// Filter states
	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");

	// Handlers
	const handleDeleteClick = (assignment) => {
		const assignmentName =
			assignment.name || assignment.title || assignment.assignment_name;
		const confirmDelete = window.confirm(
			`Are you sure you want to delete "${assignmentName}"?\n\nThis action cannot be undone.`,
		);
		if (confirmDelete) {
			onDeleteAssignment(assignment.id);
		}
	};

	const handleEditClick = (assignment) => {
		setEditingAssignment(assignment);
		setShowEditModal(true);
	};

	const handleSeeMore = (assignment) => {
		setSelectedAssignment(assignment);
		setShowDetailsModal(true);
	};

	const handleViewSubmissions = (assignment) => {
		setSelectedAssignment(assignment);
		setShowSubmissionsModal(true);
	};

	// Filter assignments based on search and type
	const filteredAssignments = filterAssignments(
		assignments,
		searchQuery,
		typeFilter,
	);

	// Loading state
	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-gray-400">
				<RefreshCw className="size-12 animate-spin mb-4 text-blue-500" />
				<p className="font-bold text-gray-900 dark:text-white">
					Loading Cohort Assignments
				</p>
				<p className="text-sm">
					Please wait while we sync your cohort assignments...
				</p>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="flex items-center justify-center min-h-[400px] font-sans">
				<div className="text-center">
					<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						{error}
					</p>
					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="px-4 pb-24 md:pb-5 font-sans">
			{/* Header */}
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<FileText className="w-6 h-6" />
						Assignments
					</h1>
				</div>

				{/* Desktop Button - Hidden on mobile */}
				<button
					onClick={() => setShowCreateModal(true)}
					className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
				>
					<Plus className="w-5 h-5" />
					<span>Create Assignment</span>
				</button>
			</div>

			{/* Search and Filter */}
			<AssignmentFilters
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				typeFilter={typeFilter}
				setTypeFilter={setTypeFilter}
			/>

			{/* Assignments Grid */}
			{filteredAssignments.length === 0 ? (
				<div className="text-center py-12">
					<FileText className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
						{assignments.length === 0
							? "No assignments yet"
							: "No assignments found"}
					</h3>
					<p className="text-gray-600 dark:text-gray-400">
						{assignments.length === 0
							? "Create your first assignment to get started"
							: "Try adjusting your search or filters"}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
					{filteredAssignments.map((assignment) => (
						<AssignmentCard
							key={assignment.id}
							assignment={assignment}
							onEditClick={handleEditClick}
							onDeleteClick={handleDeleteClick}
							onSeeMore={handleSeeMore}
							onViewSubmissions={handleViewSubmissions}
						/>
					))}
				</div>
			)}

			{/* Modals */}
			<CreateAssignmentModal
				isOpen={showCreateModal}
				onClose={() => setShowCreateModal(false)}
				onSubmit={async (data) => {
					await onCreateAssignment(data);
					setShowCreateModal(false);
				}}
			/>

			<EditAssignmentModal
				isOpen={showEditModal}
				onClose={() => {
					setShowEditModal(false);
					setEditingAssignment(null);
				}}
				onSubmit={async (id, data) => {
					await onUpdateAssignment(id, data);
					setShowEditModal(false);
					setEditingAssignment(null);
				}}
				assignment={editingAssignment}
			/>

			<AssignmentDetailsModal
				isOpen={showDetailsModal}
				onClose={() => {
					setShowDetailsModal(false);
					setSelectedAssignment(null);
				}}
				assignment={selectedAssignment}
			/>

			<SubmissionsModal
				isOpen={showSubmissionsModal}
				onClose={() => {
					setShowSubmissionsModal(false);
					setSelectedAssignment(null);
				}}
				assignment={selectedAssignment}
				submissions={
					selectedAssignment
						? getMockSubmissions(selectedAssignment)
						: []
				}
				totalMembers={totalMembers}
				totalGroups={totalGroups}
			/>
			{/* Floating Action Button - Mobile Only */}
			<button
				onClick={() => setShowCreateModal(true)}
				className="fixed bottom-20 right-4 sm:hidden bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 px-4 py-3 z-50"
				aria-label="Add Assignment"
			>
				<Plus className="w-5 h-5" strokeWidth={2.5} />
				<span className="font-medium text-sm">Add Assignment</span>
			</button>
		</div>
	);
};

export default ProfessorAssignmentsUI;
