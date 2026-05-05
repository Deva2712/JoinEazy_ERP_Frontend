// src/components/Attendance/AttendanceLogTable.jsx

import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

/**
 * Renders a list of students for a specific date with their attendance status.
 * Includes a summary header showing total, present, and absent counts.
 */
const AttendanceLogTable = ({
	stats,
	filteredStudents,
	presentStudentIds,
}) => {
	return (
		<>
			<div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-700 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
				<div className="p-4 text-center">
					<p className="text-[10px] uppercase font-bold text-gray-400">
						Total
					</p>
					<p className="text-xl font-black text-gray-900 dark:text-white">
						{stats.total}
					</p>
				</div>
				<div className="p-4 text-center">
					<p className="text-[10px] uppercase font-bold text-emerald-500">
						Present
					</p>
					<p className="text-xl font-black text-emerald-600">
						{stats.present}
					</p>
				</div>
				<div className="p-4 text-center">
					<p className="text-[10px] uppercase font-bold text-red-400">
						Absent
					</p>
					<p className="text-xl font-black text-red-500">
						{stats.absent}
					</p>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left">
					<thead>
						<tr className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
							<th className="px-6 py-4">Roll Number</th>
							<th className="px-6 py-4">Student Name</th>
							<th className="px-6 py-4 text-right">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100 dark:divide-gray-700">
						{filteredStudents.map((student) => {
							const isPresent = presentStudentIds.includes(
								student.id,
							);
							return (
								<tr
									key={student.id}
									className="group hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
								>
									<td className="px-6 py-4 text-sm font-mono text-gray-400">
										{student.rollNumber}
									</td>
									<td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
										{student.name}
									</td>
									<td className="px-6 py-4 text-right">
										{isPresent ? (
											<span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
												<CheckCircle className="w-3.5 h-3.5" />{" "}
												PRESENT
											</span>
										) : (
											<span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
												<XCircle className="w-3.5 h-3.5" />{" "}
												ABSENT
											</span>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default AttendanceLogTable;
