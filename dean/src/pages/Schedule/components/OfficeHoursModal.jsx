import React, { useState, useEffect, useMemo } from "react";
import {
	X,
	Plus,
	Trash2,
	Clock,
	Calendar,
	BookOpen,
	ChevronDown,
	MessageCircleQuestion,
} from "lucide-react";
import { WEEK_DAYS_FULL } from "../utils";

const OfficeHoursModal = ({
	isOpen,
	onClose,
	existingHours = [],
	editingHour,
	onSave,
	schedule,
	courses = [],
}) => {
	const [courseName, setCourseName] = useState("");
	const [slots, setSlots] = useState([]);
	const [editingId, setEditingId] = useState(null);

	const [currentSlot, setCurrentSlot] = useState({
		day: "Monday",
		startTime: "10:00",
		endTime: "11:00",
	});

	/**
	 * Filters the course list to exclude those that already have office hours assigned.
	 * If we are editing an existing entry, that specific course is allowed back into the list.
	 */
	const filteredCourses = useMemo(() => {
		const existingCourseNames = existingHours.map(h => h.courseName);
		return courses.filter(course => 
			!existingCourseNames.includes(course.courseName) || 
			(editingHour && course.courseName === editingHour.courseName)
		);
	}, [courses, existingHours, editingHour]);

	useEffect(() => {
		if (isOpen) {
			if (editingHour) {
				setCourseName(editingHour.courseName || "");
				setSlots(editingHour.slots || []);
				setEditingId(editingHour.id ?? null);
			} else {
				setCourseName(filteredCourses.length > 0 ? filteredCourses[0].courseName : "");
				setSlots([]);
				setEditingId(null);
			}
		}
	}, [isOpen, editingHour, filteredCourses]);

	if (!isOpen) return null;

	const formatTimeTo12H = (timeStr) => {
		if (!timeStr) return "";
		const [hours, minutes] = timeStr.split(":");
		let h = parseInt(hours, 10);
		const ampm = h >= 12 ? "PM" : "AM";
		h = h % 12 || 12;
		return `${h}:${minutes} ${ampm}`;
	};

	const addSlot = () => {
		const formattedSlot = {
			...currentSlot,
			id: Date.now(),
			startTime: formatTimeTo12H(currentSlot.startTime),
			endTime: formatTimeTo12H(currentSlot.endTime),
		};
		setSlots([...slots, formattedSlot]);
	};

	const removeSlot = (index) => {
		setSlots(slots.filter((_, i) => i !== index));
	};

	const handleSave = () => {
		if (!courseName) return;

		const updatedCourse = {
			id: editingId ?? Date.now(),
			courseName,
			slots: slots,
		};

		const currentExisting = existingHours || [];
		let finalOfficeHours;

		if (editingId) {
			finalOfficeHours = currentExisting.map((c) =>
				c.id === editingId ? updatedCourse : c,
			);
		} else {
			finalOfficeHours = [...currentExisting, updatedCourse];
		}

		onSave({
			officeHours: finalOfficeHours,
			timetable: schedule?.timetable || [],
		});
		onClose();
	};

	const isEditing = editingId !== null;

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				{/* Modal Header */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/30">
							<MessageCircleQuestion className="size-5" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							{isEditing
								? "Edit Office Hours"
								: "Add Office Hours"}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				<div className="p-6 overflow-y-auto">
					<div className="space-y-6">
						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<BookOpen className="size-3" /> Select Course
							</label>
							<div className="relative group">
								<select
									value={courseName}
									onChange={(e) =>
										setCourseName(e.target.value)
									}
									className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all appearance-none"
								>
									{filteredCourses.length > 0 ? (
										filteredCourses.map((course) => (
											<option
												key={course.id}
												value={course.courseName}
											>
												{course.courseName}{" "}
												{course.courseCodes?.length > 0
													? `(${course.courseCodes.join(", ")})`
													: ""}
											</option>
										))
									) : (
										<option value="">
											All courses have office hours configured
										</option>
									)}
								</select>
								<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
							</div>
						</div>

						{/* Timing Slot Configuration Section */}
						<div className="pt-4 border-t border-gray-100 dark:border-gray-700">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
								<Calendar className="size-3" /> Add Timing Slots
							</label>

							<div className="grid grid-cols-3 gap-2 mb-4">
								{WEEK_DAYS_FULL.map((day) => (
									<button
										key={day}
										onClick={() =>
											setCurrentSlot({
												...currentSlot,
												day,
											})
										}
										className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
											currentSlot.day === day
												? "bg-rose-600 text-white shadow-md shadow-rose-200 dark:shadow-none"
												: "bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
										}`}
									>
										{day.slice(0, 3)}
									</button>
								))}
							</div>

							<div className="flex items-end gap-3 mb-6">
								<div className="flex-1 space-y-2">
									<label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
										From
									</label>
									<input
										type="time"
										value={currentSlot.startTime}
										onChange={(e) =>
											setCurrentSlot({
												...currentSlot,
												startTime: e.target.value,
											})
										}
										className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
									/>
								</div>
								<div className="flex-1 space-y-2">
									<label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
										To
									</label>
									<input
										type="time"
										value={currentSlot.endTime}
										onChange={(e) =>
											setCurrentSlot({
												...currentSlot,
												endTime: e.target.value,
											})
										}
										className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
									/>
								</div>
								<button
									onClick={addSlot}
									className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors border border-rose-100 dark:border-rose-800/50"
								>
									<Plus className="size-5" />
								</button>
							</div>

							<div className="space-y-2">
								{slots.map((slot, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl animate-in fade-in slide-in-from-top-1"
									>
										<div className="flex items-center gap-3">
											<div className="p-1.5 rounded-lg bg-white dark:bg-[#1a1d26] border border-gray-100 dark:border-gray-700">
												<Clock className="size-3.5 text-rose-500" />
											</div>
											<div className="text-sm">
												<span className="font-bold text-gray-900 dark:text-white mr-2">
													{slot.day}
												</span>
												<span className="text-gray-500 dark:text-gray-400 font-medium">
													{slot.startTime} —{" "}
													{slot.endTime}
												</span>
											</div>
										</div>
										<button
											onClick={() => removeSlot(index)}
											className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-2 rounded-xl transition-colors"
										>
											<Trash2 className="size-4" />
										</button>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-[#1a1d26]/50">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 h-12 font-bold bg-white dark:bg-[#1a1d26] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={slots.length === 0 || !courseName}
						className="flex-1 h-12 font-bold text-white bg-rose-600 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-rose-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isEditing ? "Update Timings" : "Add Timings"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default OfficeHoursModal;