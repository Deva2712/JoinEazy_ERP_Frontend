// src/pages/Schedule/components/ImportScheduleModal.jsx

import React, { useState } from "react";
import { 
	Upload,
	Info, 
	X,
    Import, 
} from "lucide-react";

const ImportScheduleModal = ({ isOpen, onClose, onImport }) => {
	const [file, setFile] = useState(null);

	if (!isOpen) return null;

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleImport = async () => {
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const text = e.target.result;
				const lines = text.split("\n");
				const timetable = [];

				// Default dates if not provided in CSV to satisfy ScheduleController filters
				const defaultStart = "2026-01-10";
				const defaultEnd = "2026-06-30";

				// Skip header row (index 0)
				for (let i = 1; i < lines.length; i++) {
					const line = lines[i].trim();
					if (!line) continue;

					const [
						courseName,
						courseCode,
						day,
						startTime,
						endTime,
						roomNumber,
						batchSection,
					] = line.split(",").map((s) => s.trim());

					if (courseName && day && startTime) {
						timetable.push({
							id: `idx-${Date.now()}-${i}`,
							courseName: courseName,
							courseCode: courseCode || "N/A",
							day: day,
							startTime: startTime,
							endTime: endTime,
							roomNumber: roomNumber || "TBD",
							batchSection: batchSection || "All",
							startDate: defaultStart,
							endDate: defaultEnd,
							status: "Ongoing",
						});
					}
				}

				if (timetable.length === 0) {
					alert("No valid entries found. Please check your CSV format.");
					return;
				}

				onImport(timetable);
				setFile(null);
				onClose();
			} catch (error) {
				console.error("Import error:", error);
				alert("Error parsing CSV. Please ensure columns are comma-separated.");
			}
		};
		reader.readAsText(file);
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				
				{/* Modal Header */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/30">
							<Import className="size-5" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Import Schedule
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				{/* Modal Body */}
				<div className="p-6 overflow-y-auto">
					<div className="space-y-6">
						
						{/* Documentation Section */}
						<div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
							<div className="flex gap-3 items-start text-blue-800 dark:text-blue-300 mb-3">
								<Info className="size-5 shrink-0 mt-0.5" />
								<div className="space-y-1">
									<p className="text-sm font-bold uppercase tracking-wider">Required Structure</p>
									<p className="text-xs opacity-80 font-medium">
										Ensure your CSV headers follow this exact order:
									</p>
								</div>
							</div>
							
							{/* Technical Table structure for CSV Mapping */}
							<div className="overflow-x-auto rounded-xl border border-blue-200 dark:border-blue-800 bg-white/50 dark:bg-black/20">
								<table className="w-full text-[10px] font-mono text-gray-700 dark:text-gray-300">
									<thead>
										<tr className="bg-blue-100/50 dark:bg-blue-900/40">
											<th className="border-r border-b border-blue-200 dark:border-blue-800 p-1.5">Course</th>
											<th className="border-r border-b border-blue-200 dark:border-blue-800 p-1.5">Code</th>
											<th className="border-r border-b border-blue-200 dark:border-blue-800 p-1.5">Day</th>
											<th className="border-r border-b border-blue-200 dark:border-blue-800 p-1.5">Start</th>
											<th className="border-r border-b border-blue-200 dark:border-blue-800 p-1.5">End</th>
											<th className="border-r border-b border-blue-200 dark:border-blue-800 p-1.5">Room</th>
											<th className="border-b border-blue-200 dark:border-blue-800 p-1.5">Sec</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className="p-1.5 italic text-gray-400 text-center" colSpan="7">
												Example: Data Structures, CS301, Monday, 9:00 AM...
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						{/* File Upload Interaction */}
						<div className="space-y-2">
							<label className="text-xs font-bold uppercase tracking-widest text-gray-400">
								Upload CSV File
							</label>
							
							<input
								type="file"
								accept=".csv"
								onChange={handleFileChange}
								className="hidden"
								id="csv-upload"
							/>
							<label 
								htmlFor="csv-upload" 
								className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 group
									${file 
										? "border-rose-500 bg-rose-50/30 dark:bg-rose-900/10" 
										: "border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-500 bg-gray-50 dark:bg-gray-900"
									}`}
							>
								<div className={`p-4 rounded-full mb-3 transition-colors ${file ? "bg-rose-100 dark:bg-rose-900/50 text-rose-600" : "bg-white dark:bg-gray-800 text-gray-400 group-hover:text-rose-500"}`}>
									<Upload className="size-6" />
								</div>
								<p className="text-sm font-bold text-gray-700 dark:text-gray-200">
									{file ? file.name : "Select your timetable CSV"}
								</p>
								<p className="text-xs text-gray-400 mt-1">Maximum size: 5MB</p>
							</label>
						</div>
					</div>
				</div>

				{/* Modal Footer */}
				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-[#1a1d26]/50">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 h-12 font-bold bg-white dark:bg-[#1a1d26] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={handleImport}
						disabled={!file}
						className="flex-1 h-12 font-bold text-white bg-rose-600 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-rose-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-rose-200 dark:shadow-none"
					>
						Import Schedule
					</button>
				</div>
			</div>
		</div>
	);
};

export default ImportScheduleModal;