// src/pages/Department/DepartmentCourses/components/DepartmentCourseCard.jsx

import React from "react";
import { Users, ChevronRight } from "lucide-react";

const DepartmentCourseCard = ({ course, onClick }) => {
	const isArchived = course.status === "Archived";

	return (
		<div
			onClick={onClick}
			className={`group bg-white dark:bg-[#1a1d26] p-5 rounded-2xl border flex flex-col h-full gap-4 transition-all duration-300 cursor-pointer active:scale-95 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1 ${
				isArchived
					? "grayscale-[100%] opacity-80 hover:grayscale-0 hover:opacity-100"
					: "border-gray-200/60 dark:border-gray-800 hover:border-violet-500/30"
			}`}
		>
			{/* Course Identity Header - Top section containing Code and Semester */}
			<div className="flex items-center justify-between">
				<span className="px-3 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-100 dark:border-violet-800">
					{course.course_code}
				</span>
				<span className="px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
					Semester {course.semester}
				</span>
			</div>

			<h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-violet-600 transition-colors leading-tight truncate">
				{course.cohort_name}
			</h3>

			{/* Faculty Footer Info */}
			<div className="flex items-center justify-between group/footer">
				<div className="flex items-center gap-3 overflow-hidden">
					<div className="shrink-0 size-8 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 flex items-center justify-center border border-violet-100 dark:border-violet-800">
						<Users className="size-4" />
					</div>
					<div className="flex flex-col overflow-hidden">
						<span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
							Faculty
						</span>
						<span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
							{course.faculty.join(", ")}
						</span>
					</div>
				</div>
				<ChevronRight className="size-4 text-gray-300 dark:text-gray-600 group-hover:text-violet-500 transform group-hover:translate-x-1 transition-all" />
			</div>
		</div>
	);
};

export default DepartmentCourseCard;
