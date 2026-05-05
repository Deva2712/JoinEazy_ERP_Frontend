// src/pages/AttendanceManagement/views/ProfessorLogsView

import React, { useMemo } from "react";
import {
	Clock,
	History,
	CalendarDays,
	Calendar,
	ChevronRight,
	ArrowUpRight,
	ArrowDownLeft,
	ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MiniCalendar from "../../../components/common/MiniCalendar";

const ProfessorLogsView = ({
	logs,
	formatDate,
	activeMonth,
	onMonthChange,
	profLogs,
	leaveApplications,
	onSelectLeave,
}) => {
	const navigate = useNavigate();

	/**
	 * Logic to generate markers for the MiniCalendar
	 * Highlights attendance dates in purple and approved leave dates in orange
	 */
	const logMarkers = useMemo(() => {
		const markers = [];

		profLogs.forEach((log) => {
			markers.push({
				date: log.date.split("T")[0],
				className:
					"bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100",
				dotColor: "bg-purple-400",
			});
		});

		leaveApplications
			.filter((app) => app.status === "Approved")
			.forEach((app) => {
				const startStr = app.fromDate.split("T")[0];
				const endStr = app.toDate.split("T")[0];

				let current = new Date(startStr.replace(/-/g, "/"));
				const end = new Date(endStr + "T00:00:00");

				while (current <= end) {
					const dateStr = current.toISOString().split("T")[0];

					if (!markers.find((m) => m.date === dateStr)) {
						markers.push({
							date: dateStr,
							className:
								"bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100",
							dotColor: "bg-orange-400",
						});
					}

					current.setDate(current.getDate() + 1);
				}
			});

		return markers;
	}, [profLogs, leaveApplications]);

	/**
	 * Logic to merge attendance logs and approved leave applications into a single timeline
	 */
	const combinedLogs = useMemo(() => {
		const merged = [...logs.map((log) => ({ ...log, type: "attendance" }))];

		leaveApplications
			.filter((app) => app.status === "Approved")
			.forEach((app) => {
				const start = new Date(
					app.fromDate.split("T")[0] + "T00:00:00",
				);
				const end = new Date(app.toDate.split("T")[0] + "T00:00:00");

				let current = new Date(start);
				while (current <= end) {
					if (
						current.getMonth() === activeMonth.getMonth() &&
						current.getFullYear() === activeMonth.getFullYear()
					) {
						const dateStr = current.toISOString().split("T")[0];

						if (
							!merged.find(
								(l) => l.date.split("T")[0] === dateStr,
							)
						) {
							merged.push({
								id: `leave-${app.id}-${dateStr}`,
								date: dateStr,
								fromDate: app.fromDate,
								toDate: app.toDate,
								reason: app.reason,
								type: "leave",
								leaveType: app.leaveType,
								status: "On Leave",
							});
						}
					}
					current.setDate(current.getDate() + 1);
				}
			});

		return merged.sort((a, b) => new Date(b.date) - new Date(a.date));
	}, [logs, leaveApplications, activeMonth]);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
			{/* Left Sidebar: Calendar and Navigation */}
			<aside className="lg:col-span-1 space-y-4">
				<MiniCalendar
					viewOnly={true}
					onMonthChange={onMonthChange}
					customMarkers={logMarkers}
					disbaleFuture={true}
				/>

				<button
					onClick={() => navigate("/leave-applications")}
					className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl transition-all hover:shadow-md active:scale-[0.98] group"
				>
					<div className="flex items-center gap-3">
						<div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
							<CalendarDays className="size-5" />
						</div>
						<div className="text-left">
							<p className="text-sm font-bold text-gray-900 dark:text-white">
								Leave Requests
							</p>
							<p className="text-xs text-gray-500">
								Apply or view status
							</p>
						</div>
					</div>
					<ChevronRight className="size-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
				</button>
			</aside>

			{/* Main Content: Attendance and Leave Records */}
			<div className="lg:col-span-2 space-y-4">
				<div className="flex justify-between items-center px-1">
					<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
						Logs for{" "}
						{activeMonth.toLocaleDateString("en-US", {
							month: "long",
							year: "numeric",
						})}
					</h3>
					<span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 rounded-full text-[10px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-widest">
						{combinedLogs.length} Records
					</span>
				</div>

				{/* Mobile: Activity Cards */}
				<div className="grid grid-cols-1 gap-4 md:hidden">
					{combinedLogs.length > 0 ? (
						combinedLogs.map((log) => (
							<div
								key={log.id}
								onClick={() =>
									log.type === "leave" && onSelectLeave(log)
								}
								className={`bg-white dark:bg-[#1a1d26] p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden ${log.type === "leave" ? "cursor-pointer" : ""}`}
							>
								<div
									className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold rounded-bl-xl uppercase ${
										log.type === "leave"
											? "bg-orange-100 dark:bg-orange-900/50 text-orange-600"
											: "bg-purple-100 dark:bg-purple-900/50 text-purple-600"
									}`}
								>
									{log.type === "leave"
										? "On Leave"
										: "Present"}
								</div>

								<div className="flex items-center gap-3 mb-4">
									<div
										className={`p-2 rounded-lg ${
											log.type === "leave"
												? "bg-orange-50 dark:bg-orange-900/30"
												: "bg-purple-50 dark:bg-purple-900/30"
										}`}
									>
										<Calendar
											className={`size-5 ${log.type === "leave" ? "text-orange-600" : "text-purple-600"}`}
										/>
									</div>
									<div className="font-bold text-gray-900 dark:text-white">
										{formatDate(log.date)}
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
									<div className="flex flex-col space-y-1">
										<div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">
											<Clock className="size-3" />{" "}
											{log.type === "leave"
												? "Status"
												: "Check In"}
										</div>
										<span
											className={`text-sm font-bold ${log.type === "leave" ? "text-orange-600" : "text-gray-700 dark:text-gray-200"}`}
										>
											{log.type === "leave"
												? log.leaveType
												: log.checkIn}
										</span>
									</div>
									{log.type === "leave" ? (
										<div className="flex items-center justify-end gap-1.5 text-xs font-bold text-gray-400 group-hover:text-orange-500 transition-colors">
											View Details{" "}
											<ExternalLink className="size-3" />
										</div>
									) : (
										<div className="space-y-1">
											<div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">
												<Clock className="size-3" />{" "}
												Check Out
											</div>
											<span className="text-sm font-bold text-gray-700 dark:text-gray-200">
												{log.checkOut}
											</span>
										</div>
									)}
								</div>
							</div>
						))
					) : (
						<div className="py-20 text-center bg-white dark:bg-[#1a1d26] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
							<History className="size-10 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
							<p className="text-gray-400 font-medium">
								No records found.
							</p>
						</div>
					)}
				</div>

				{/* Desktop: Structured Log Table */}
				<div className="hidden md:block bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
					<table className="w-full">
						<thead>
							<tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-700">
								<th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
									Date
								</th>
								<th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
									Entry / Status
								</th>
								<th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
									Exit / Action
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{combinedLogs.length > 0 ? (
								combinedLogs.map((log) => (
									<tr
										key={log.id}
										onClick={() =>
											log.type === "leave" &&
											onSelectLeave(log)
										}
										className={`group hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all ${log.type === "leave" ? "cursor-pointer" : ""}`}
									>
										<td className="px-6 py-4">
											<div className="font-bold text-gray-900 dark:text-white">
												{formatDate(log.date)}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center justify-center gap-3">
												{log.type === "leave" ? (
													<span className="text-sm font-semibold text-orange-500">
														{log.leaveType}
													</span>
												) : (
													<div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
														<ArrowUpRight className="size-3.5" />
														{log.checkIn}
													</div>
												)}
											</div>
										</td>
										<td className="px-6 py-4 text-right">
											{log.type === "leave" ? (
												<div className="flex items-center justify-end gap-1.5 text-xs font-bold text-gray-400 group-hover:text-orange-500 transition-colors">
													View Details{" "}
													<ExternalLink className="size-3" />
												</div>
											) : (
												<div className="flex items-center justify-end gap-2 text-sm font-semibold text-gray-400">
													{log.checkOut}
													<ArrowDownLeft className="size-3.5" />
												</div>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan="4"
										className="px-6 py-20 text-center"
									>
										<History className="size-10 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
										<p className="text-gray-400 font-medium">
											No records for this month.
										</p>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ProfessorLogsView;
