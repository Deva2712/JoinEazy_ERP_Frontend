import React from "react";
import { Search, QrCodeIcon, Settings, User, Check, X } from "lucide-react";

const AttendanceMarkingTable = ({
	state,
	actions,
	filteredStudents,
	setIsSettingsOpen,
	navigate,
}) => {
	return (
		<div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden">
			{/* Search and Action Bar */}
			<div className="p-4 md:p-6 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/20 dark:to-transparent border-b border-gray-100 dark:border-gray-800">
				<div className="flex flex-col lg:flex-row items-center gap-6">
					<div className="relative flex-1 w-full">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="text"
							placeholder="Search name or roll number..."
							className="pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl text-sm w-full outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
							value={state.searchQuery}
							onChange={(e) =>
								actions.setSearchQuery(e.target.value)
							}
							disabled={state.hasSubmitted}
						/>
					</div>
					{!state.hasSubmitted && (
					<div className="flex items-center gap-3 w-full lg:w-auto">
						<button
							onClick={() =>
								navigate(
									`/attendance-management/mark/${state.selectedCourse.id}/qr`,
								)
							}
							className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-purple-600 text-white px-6 py-3 rounded-xl uppercase font-black text-xs tracking-wider hover:bg-purple-700 transition-all shadow-md shadow-purple-500/20 active:scale-95"
						>
							<QrCodeIcon className="size-5" />
							<span>Generate QR</span>
						</button>
						<button
							onClick={() => setIsSettingsOpen(true)}
							className="p-3 text-gray-500 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800"
						>
							<Settings className="size-5" />
						</button>
					</div>
					)}
				</div>
			</div>

			{/* Attendance Status Summary Counters */}
			<div className="px-5 py-4 bg-gray-50/30 dark:bg-gray-800/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
				<div className="flex items-center justify-around md:justify-start md:gap-8">
					<div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
						<span className="text-lg md:text-sm font-black text-emerald-600 dark:text-emerald-500">
							{state.presentIds.length}
						</span>
						<span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
							Present
						</span>
					</div>
					<div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
						<span className="text-lg md:text-sm font-black text-rose-600 dark:text-rose-500">
							{state.absentIds.length}
						</span>
						<span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
							Absent
						</span>
					</div>
					<div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
						<span className="text-lg md:text-sm font-black text-gray-500">
							{filteredStudents.length -
								(state.presentIds.length +
									state.absentIds.length)}
						</span>
						<span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
							Pending
						</span>
					</div>
				</div>

				{!state.hasSubmitted && (
					<div className="flex items-center justify-center gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100 dark:border-gray-700">
						<label className="flex items-center gap-2 cursor-pointer group">
							<input
								type="radio"
								name="markAll"
								className="size-4 accent-green-600"
								checked={
									filteredStudents.length > 0 &&
									state.presentIds.length ===
										filteredStudents.length
								}
								onChange={() =>
									actions.markAll(
										"present",
										filteredStudents.map((s) => s.id),
									)
								}
							/>
							<span className="text-xs font-bold text-gray-500 uppercase group-hover:text-green-600 transition-colors">
								Mark All Present
							</span>
						</label>

						<label className="flex items-center gap-2 cursor-pointer group">
							<input
								type="radio"
								name="markAll"
								className="size-4 accent-red-600"
								checked={
									filteredStudents.length > 0 &&
									state.absentIds.length ===
										filteredStudents.length
								}
								onChange={() =>
									actions.markAll(
										"absent",
										filteredStudents.map((s) => s.id),
									)
								}
							/>
							<span className="text-xs font-bold text-gray-500 uppercase group-hover:text-rose-600 transition-colors">
								Mark All Absent
							</span>
						</label>
					</div>
				)}
			</div>

			{/* Student List Rows */}
			<div className="divide-y divide-gray-50 dark:divide-gray-800">
				{filteredStudents.map((student) => {
					const isPresent = state.presentIds.includes(student.id);
					const isAbsent = state.absentIds.includes(student.id);

					return (
						<div
							key={student.id}
							className={`group grid grid-cols-1 md:grid-cols-12 items-center px-4 md:px-8 py-4 transition-all duration-200 ${
								isPresent
									? "bg-emerald-50/30 dark:bg-emerald-500/5"
									: isAbsent
										? "bg-rose-50/30 dark:bg-rose-500/5"
										: "hover:bg-gray-50 dark:hover:bg-gray-900/40"
							}`}
						>
							<div className="hidden md:block col-span-2 font-mono text-sm font-bold text-gray-400">
								{student.rollNumber}
							</div>
							<div className="col-span-1 md:col-span-6 flex items-center gap-4">
								<div
									className={`md:hidden size-12 rounded-2xl flex items-center justify-center transition-all ${
										isPresent
											? "bg-emerald-100 text-emerald-600"
											: isAbsent
												? "bg-rose-100 text-rose-600"
												: "bg-gray-100 dark:bg-gray-800 text-gray-400"
									}`}
								>
									<User className="size-6" />
								</div>
								<div className="flex flex-col min-w-0">
									<span className="font-bold text-gray-900 dark:text-white truncate">
										{student.name}
									</span>
									<span className="md:hidden font-mono text-xs font-bold text-gray-400">
										{student.rollNumber}
									</span>
								</div>
							</div>
							<div className="col-span-1 md:col-span-4 mt-4 md:mt-0 flex items-center justify-end gap-3">
								<button
									onClick={() =>
										actions.markPresent(student.id)
									}
									disabled={
										state.hasSubmitted ||
										state.markingLoading ||
										state.submitLoading
									}
									className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
										isPresent
											? "bg-emerald-600 text-white border-emerald-600"
											: "bg-white dark:bg-gray-900 text-gray-400 border-gray-200 dark:border-gray-800 hover:text-emerald-500"
									} disabled:opacity-40`}
								>
									<Check className="size-4" />
									<span
										className={
											isPresent
												? "block"
												: "hidden md:block"
										}
									>
										Present
									</span>
								</button>
								<button
									onClick={() =>
										actions.markAbsent(student.id)
									}
									disabled={
										state.hasSubmitted ||
										state.markingLoading ||
										state.submitLoading
									}
									className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
										isAbsent
											? "bg-rose-600 text-white border-rose-600"
											: "bg-white dark:bg-gray-900 text-gray-400 border-gray-200 dark:border-gray-800 hover:text-rose-500"
									} disabled:opacity-40`}
								>
									<X className="size-4" />
									<span
										className={
											isAbsent
												? "block"
												: "hidden md:block"
										}
									>
										Absent
									</span>
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default AttendanceMarkingTable;
