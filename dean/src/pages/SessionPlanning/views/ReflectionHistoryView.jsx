// src/pages/SessionPlanning/views/ReflectionHistoryView.jsx

import React, { useState, useEffect } from "react";
import {
	BookOpen,
	ChevronDown,
	Calendar,
	ArrowRight,
	MessageSquare,
	Pencil,
	Users, // Added for section icon
} from "lucide-react";

/**
 * Utility to format dates into a readable string.
 */
const formatDate = (iso) => {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

/**
 * Utility to format dates into the weekday name.
 */
const formatDay = (iso) => {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("en-US", { weekday: "long" });
};

/**
 * Note Editor Component.
 * Unified logic for both desktop and mobile layouts.
 */
const NoteEditor = ({
	refItem,
	editingId,
	editValue,
	setEditValue,
	onStart,
	onSave,
	onCancel,
	isMobile,
}) => {
	const isEditing = editingId === refItem.id;

	if (isEditing) {
		return (
			<div className="flex flex-col gap-2">
				<textarea
					autoFocus
					value={editValue}
					onChange={(e) => setEditValue(e.target.value)}
					className="w-full text-sm p-3 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none resize-none shadow-inner"
					rows={3}
				/>
				<div className="flex gap-2">
					<button
						onClick={() => onSave(refItem.id)}
						className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase rounded-lg transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
					>
						Save
					</button>
					<button
						onClick={onCancel}
						className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-black uppercase rounded-lg transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="group/note relative">
			{isMobile && (
				<div className="flex items-center gap-2 mb-2">
					<MessageSquare className="size-3 text-gray-400" />
					<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
						Personal Notes
					</h4>
				</div>
			)}

			<div className="relative">
				<button
					onClick={onStart}
					className="absolute -right-2 -top-2 p-2 rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-indigo-500 shadow-sm transition-all z-10"
					title="Edit Note"
				>
					<Pencil className="size-3" />
				</button>

				<div
					onClick={onStart}
					className="p-3 rounded-xl border border-dashed border-indigo-200/50 dark:border-indigo-500/20 bg-gray-50/30 dark:bg-gray-800/20 cursor-pointer hover:border-indigo-400 transition-all"
				>
					<p
						className={`text-sm italic leading-relaxed ${refItem.personalNotes ? "text-gray-500 dark:text-gray-400" : "text-gray-300 dark:text-gray-600"}`}
					>
						{refItem.personalNotes ||
							"Click to add personal notes..."}
					</p>
				</div>
			</div>
		</div>
	);
};

/**
 * Centered empty state UI.
 */
const EmptyState = () => {
	return (
		<div className="py-20 flex flex-col items-center gap-3 w-full">
			<BookOpen className="w-10 h-10 text-gray-200 dark:text-gray-800" />
			<p className="text-sm font-bold text-gray-400">
				No reflections found for this course.
			</p>
		</div>
	);
};

const ReflectionHistoryView = ({ courses = [], reflections = [] }) => {
	const [selectedCourseId, setSelectedCourseId] = useState(
		courses[0]?.id || "",
	);
	const [filteredReflections, setFilteredReflections] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [editValue, setEditValue] = useState("");

	useEffect(() => {
		if (Array.isArray(reflections)) {
			const filtered = reflections.filter(
				(r) => r.classId === selectedCourseId,
			);
			setFilteredReflections(filtered);
		} else {
			setFilteredReflections([]);
		}
	}, [selectedCourseId, reflections]);

	const handleEditStart = (ref) => {
		setEditingId(ref.id);
		setEditValue(ref.personalNotes || "");
	};

	const handleEditSave = (refId) => {
		setFilteredReflections((prev) =>
			prev.map((r) =>
				r.id === refId ? { ...r, personalNotes: editValue } : r,
			),
		);
		setEditingId(null);
	};

	const activeCourses = courses.filter(
		(course) => course.status !== "Completed",
	);
	const selectedCourse = courses.find((c) => c.id === selectedCourseId);

	return (
		<div className="max-w-7xl mx-auto pb-24">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
				<div className="space-y-1">
					<h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
						Reflection Logs
					</h3>
					<span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
						{selectedCourse?.courseName || "Select a course"}
					</span>
				</div>

				{activeCourses.length > 0 && (
					<div className="relative group min-w-[300px]">
						<select
							value={selectedCourseId}
							onChange={(e) =>
								setSelectedCourseId(e.target.value)
							}
							className="w-full pl-4 pr-10 py-3 text-sm font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white outline-none appearance-none shadow-sm hover:border-indigo-500/50 transition-all cursor-pointer"
						>
							{activeCourses.map((c) => (
								<option key={c.id} value={c.id}>
									{c.courseName} ({c.courseCodes?.join(" / ")}
									)
								</option>
							))}
						</select>
						<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-hover:text-indigo-500 transition-all" />
					</div>
				)}
			</div>

			{/* Main Content Area */}
			<div className="bg-transparent md:bg-white md:dark:bg-gray-900 md:rounded-3xl md:border md:border-gray-200 md:dark:border-gray-800 overflow-hidden md:shadow-sm">
				<div className="overflow-x-auto">
					{/* Desktop Table View */}
					<table className="hidden md:table w-full text-left border-separate border-spacing-0">
						<thead>
							<tr className="bg-gray-50/50 dark:bg-gray-800/50">
								{[
									"Date",
									"Section", // Added Section header
									"Content & Progress",
									"Improvements",
									"Personal Notes",
								].map((h) => (
									<th
										key={h}
										className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{filteredReflections.length === 0 ? (
								<tr>
									<td colSpan="5">
										<EmptyState />
									</td>
								</tr>
							) : (
								filteredReflections.map((ref) => (
									<tr
										key={ref.id}
										className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors"
									>
										<td className="px-6 py-6 align-top whitespace-nowrap">
											<div className="flex flex-col">
												<span className="text-sm font-bold text-gray-900 dark:text-white">
													{formatDate(ref.date)}
												</span>
												<span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
													{formatDay(ref.date)}
												</span>
											</div>
										</td>
										{/* Section Column */}
										<td className="px-6 py-6 align-top whitespace-nowrap">
											<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 w-fit">
												<Users className="size-3 text-gray-500 dark:text-gray-400" />
												<span className="text-xs font-black text-gray-600 dark:text-gray-300">
													{ref.batchSection}
												</span>
											</div>
										</td>
										<td className="px-6 py-6 align-top max-w-sm">
											<div className="space-y-3">
												<p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
													{ref.whatWasTaught}
												</p>
												{ref.topicsCarriedForward && (
													<div className="flex items-start gap-2 text-[11px] font-bold text-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 w-fit px-2 py-1 rounded-md">
														<ArrowRight className="size-3 mt-0.5" />
														<span>
															Next:{" "}
															{
																ref.topicsCarriedForward
															}
														</span>
													</div>
												)}
											</div>
										</td>
										<td className="px-6 py-6 align-top max-w-xs">
											<p
												className={`text-sm leading-relaxed ${ref.needsImprovement ? "text-gray-600 dark:text-gray-400" : "text-gray-300 dark:text-gray-700 italic"}`}
											>
												{ref.needsImprovement ||
													"No issues noted"}
											</p>
										</td>
										<td className="px-6 py-6 align-top min-w-[300px]">
											<NoteEditor
												refItem={ref}
												editingId={editingId}
												editValue={editValue}
												setEditValue={setEditValue}
												onStart={() =>
													handleEditStart(ref)
												}
												onSave={handleEditSave}
												onCancel={() =>
													setEditingId(null)
												}
												isMobile={false}
											/>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>

					{/* Mobile Card View */}
					<div className="md:hidden space-y-4">
						{filteredReflections.length === 0 ? (
							<div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800">
								<EmptyState />
							</div>
						) : (
							filteredReflections.map((ref) => (
								<div
									key={ref.id}
									className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4 shadow-sm active:scale-[0.99] transition-transform"
								>
									<div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-3">
										<div className="flex items-center gap-2">
											<Calendar className="size-4 text-indigo-500" />
											<div className="flex flex-col">
												<span className="text-sm font-bold text-gray-900 dark:text-white">
													{formatDate(ref.date)}
												</span>
												<span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
													{formatDay(ref.date)}
												</span>
											</div>
										</div>
										{/* Section Badge for Mobile */}
										<div className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
											<span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">
												{ref.batchSection}
											</span>
										</div>
									</div>

									<div className="space-y-1">
										<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
											What was taught
										</h4>
										<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
											{ref.whatWasTaught}
										</p>
										{ref.topicsCarriedForward && (
											<div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500/80 bg-indigo-50/50 dark:bg-indigo-500/10 w-fit px-2 py-1 mt-2 rounded-md">
												<ArrowRight className="size-3" />
												<span>
													Next:{" "}
													{ref.topicsCarriedForward}
												</span>
											</div>
										)}
									</div>

									<div className="space-y-1">
										<h4 className="text-[10px] font-black text-orange-500 uppercase tracking-wider">
											Needs Improvement
										</h4>
										<p
											className={`text-sm leading-relaxed ${ref.needsImprovement ? "text-gray-600 dark:text-gray-400" : "text-gray-300 dark:text-gray-700 italic"}`}
										>
											{ref.needsImprovement ||
												"No issues noted"}
										</p>
									</div>

									<div className="pt-2">
										<NoteEditor
											refItem={ref}
											editingId={editingId}
											editValue={editValue}
											setEditValue={setEditValue}
											onStart={() => handleEditStart(ref)}
											onSave={handleEditSave}
											onCancel={() => setEditingId(null)}
											isMobile={true}
										/>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReflectionHistoryView;
