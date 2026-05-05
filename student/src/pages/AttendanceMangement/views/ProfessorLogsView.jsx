// src/pages/AttendanceManagement/views/ProfessorLogsView

import React, { useMemo } from "react";
import {
	Clock,
	History,
	CalendarDays,
	Calendar,
	ChevronRight,
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
}) => {
	const navigate = useNavigate();

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

				let current = new Date(startStr + "T00:00:00");
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
			{/* Left Sidebar: Calendar and Quick Actions */}
			<aside className="lg:col-span-1 space-y-4">
				<MiniCalendar
					viewOnly={true}
					onMonthChange={onMonthChange}
					customMarkers={logMarkers}
					disbaleFuture={true}
				/>

				<button
					onClick={() => navigate("/leave-application")}
					className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl transition-all group"
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
					<ChevronRight className="size-4 text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform" />
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

				{/* Mobile Card Layout */}
				<div className="grid grid-cols-1 gap-4 md:hidden">
					{combinedLogs.length > 0 ? (
						combinedLogs.map((log) => (
							<div
								key={log.id}
								className="bg-white dark:bg-[#1a1d26] p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden"
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
									<div className="space-y-1">
										<div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">
											<Clock className="size-3" />{" "}
											{log.type === "leave"
												? "Duty"
												: "Check Out"}
										</div>
										<span className="text-sm font-bold text-gray-700 dark:text-gray-200">
											{log.type === "leave"
												? "N/A"
												: log.checkOut}
										</span>
									</div>
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

				{/* Desktop Table Layout */}
				<div className="hidden md:block bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-400 text-[10px] uppercase tracking-widest font-bold border-b border-gray-100 dark:border-gray-700">
									<th className="px-6 py-4">Date</th>
									<th className="px-6 py-4 text-center">
										Status / Check In
									</th>
									<th className="px-6 py-4 text-right">
										Check Out
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 dark:divide-gray-700">
								{combinedLogs.length > 0 ? (
									combinedLogs.map((log) => (
										<tr
											key={log.id}
											className="hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-colors"
										>
											<td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
												{formatDate(log.date)}
											</td>
											<td className="px-6 py-4 text-center">
												{log.type === "leave" ? (
													<span className="text-orange-600 dark:text-orange-400 inline-flex items-center gap-2">
														<Calendar className="size-3" />
														{log.leaveType}
													</span>
												) : (
													<span className="text-gray-600 dark:text-gray-400 inline-flex items-center gap-2 font-medium">
														<Clock className="size-3 text-gray-500" />
														{log.checkIn}
													</span>
												)}
											</td>
											<td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
												{log.type === "leave" ? (
													"N/A"
												) : (
													<span className="inline-flex items-center gap-2 font-medium">
														<Clock className="size-3 text-gray-400" />
														{log.checkOut}
													</span>
												)}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan="3"
											className="px-6 py-20 text-center"
										>
											<History className="size-10 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
											<p className="text-gray-400 font-medium">
												No records found.
											</p>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfessorLogsView;
