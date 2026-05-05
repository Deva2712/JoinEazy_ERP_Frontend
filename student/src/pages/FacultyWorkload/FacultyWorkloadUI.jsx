// src/pages/FacultyWorkload/FacultyWorkloadUI.jsx

import React, { useState } from "react";
import { 
    Users, BookOpen, AlertTriangle, Plus, 
    RefreshCw, ArrowLeft, LayoutGrid, List,
    UserPlus, Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import HeaderController from "../../components/layout/Header/HeaderController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import AllocationModal from "./components/AllocationModal";

const FacultyWorkloadUI = ({
	faculty = [],
	allocations = [],
	alerts = [],
	allocationTypes = [],
	loading,
	error,
	onRefresh,
	onSubmit,
	onSubstitute,
	isModalOpen,
	setIsModalOpen,
	viewType,
	setViewType
}) => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("all-faculty");

	const overloadCount = alerts.filter(a => a.type === "OVERLOAD_DETECTED").length;
	const totalHours = allocations.reduce((sum, acc) => sum + acc.hoursPerWeek, 0);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
			<HeaderController />

			<div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-800 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-8 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
						<div className="flex items-center gap-4">
							<button onClick={() => navigate(-1)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Workload Management</h1>
								<p className="text-indigo-100 text-sm">HOD Dashboard for Faculty Allocation & Monitoring.</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<StatSummaryCard label="Total Assigned" value={`${totalHours} Hrs`} icon={BookOpen} />
							<StatSummaryCard label="Overload Alerts" value={overloadCount.toString()} icon={AlertTriangle} />
						</div>
					</div>

					<div className="flex gap-1 overflow-x-auto">
						{[
							{ key: "all-faculty", label: "Faculty Load", icon: Users },
							{ key: "allocations", label: "All Assignments", icon: Clock },
							{ key: "alerts", label: "Action Required", icon: AlertTriangle },
						].map((tab) => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-t-2xl transition-all ${
									activeTab === tab.key 
                                    ? "bg-gray-50 dark:bg-[#0f1117] text-indigo-700 dark:text-indigo-400" 
                                    : "text-white/70 hover:bg-white/10"
								}`}
							>
								<tab.icon className="size-4" />
								{tab.label}
							</button>
						))}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-8">
				{loading ? (
					<div className="flex flex-col items-center py-20 text-gray-400">
						<RefreshCw className="size-10 animate-spin text-indigo-500 mb-4" />
						<p className="font-bold">Updating Load Calculations...</p>
					</div>
				) : (
					<>
						<div className="flex items-center justify-between mb-8">
							<h3 className="text-xl font-bold text-gray-900 dark:text-white">
								{activeTab === "all-faculty" ? "Departmental Faculty Status" : 
								 activeTab === "allocations" ? "Teaching Assignments" : "Priority Alerts"}
							</h3>
							<div className="flex gap-3">
								<button 
									onClick={() => setIsModalOpen(true)}
									className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-transform active:scale-95"
								>
									<Plus className="size-4" />
									Assign Workload
								</button>
							</div>
						</div>

						{activeTab === "all-faculty" && (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{faculty.map(f => (
									<FacultyCard key={f.id} faculty={f} />
								))}
							</div>
						)}

						{activeTab === "allocations" && (
							<div className="bg-white dark:bg-[#1a1d26] rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
								<table className="w-full text-left">
									<thead className="bg-gray-50 dark:bg-[#242833] text-gray-400 text-[10px] uppercase font-bold">
										<tr>
											<th className="px-6 py-4">Course</th>
											<th className="px-6 py-4">Faculty</th>
											<th className="px-6 py-4">Type</th>
											<th className="px-6 py-4 text-center">Hours</th>
											<th className="px-6 py-4">Status</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-50 dark:divide-gray-800">
										{allocations.map(alc => (
											<tr key={alc.id} className="text-sm">
												<td className="px-6 py-4">
													<div className="font-bold dark:text-white">{alc.courseCode}</div>
													<div className="text-xs text-gray-400">{alc.courseName}</div>
												</td>
												<td className="px-6 py-4 font-medium dark:text-gray-300">
													{faculty.find(f => f.id === alc.facultyId)?.name || "Unassigned"}
												</td>
												<td className="px-6 py-4">
													<span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-[10px] font-bold uppercase">
														{alc.type}
													</span>
												</td>
												<td className="px-6 py-4 text-center font-bold text-indigo-500">{alc.hoursPerWeek}</td>
												<td className="px-6 py-4">
													{alc.isSubstitute ? (
														<span className="text-orange-500 font-bold flex items-center gap-1">
															<UserPlus className="size-3" /> Substitute
														</span>
													) : (
														<span className="text-green-500 font-bold">Regular</span>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}

						{activeTab === "alerts" && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{alerts.map(alert => (
									<div key={alert.id} className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-6 rounded-2xl flex gap-4 items-start">
										<div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-xl">
											<AlertTriangle className="size-6 text-red-600" />
										</div>
										<div className="flex-1">
											<p className="font-bold text-red-900 dark:text-red-200">{alert.message}</p>
											<p className="text-xs text-red-700/70 mt-1">Requires immediate HOD intervention.</p>
											<div className="flex gap-3 mt-4">
												<button className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold">Reassign</button>
												<button className="bg-white dark:bg-[#1a1d26] border border-red-200 dark:border-red-900/50 text-red-600 px-4 py-2 rounded-lg text-xs font-bold">Dismiss</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</main>

			{isModalOpen && (
				<AllocationModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					faculty={faculty}
					types={allocationTypes}
					onSubmit={onSubmit}
				/>
			)}
		</div>
	);
};

// Internal Component for Faculty Cards to keep clean
const FacultyCard = ({ faculty: f }) => {
	const isOverload = f.currentLoadHours > f.maxLoadHours;
	const progressPercent = Math.min((f.currentLoadHours / f.maxLoadHours) * 100, 100);

	return (
		<div className="bg-white dark:bg-[#1a1d26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
			<div className="flex justify-between items-start mb-4">
				<div className="flex items-center gap-3">
					<div className={`size-10 rounded-xl flex items-center justify-center font-bold ${isOverload ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
						{f.name.split(' ').map(n => n[0]).join('')}
					</div>
					<div>
						<h4 className="font-bold text-gray-900 dark:text-white text-sm">{f.name}</h4>
						<p className="text-[10px] text-gray-500 uppercase tracking-wider">{f.designation}</p>
					</div>
				</div>
				<span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${isOverload ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-100 text-green-600'}`}>
					{isOverload ? 'Overload' : 'Optimal'}
				</span>
			</div>
			
			<div className="space-y-2 mt-6">
				<div className="flex justify-between text-[11px] font-bold">
					<span className="text-gray-400">Resource Utilization</span>
					<span className={isOverload ? 'text-red-500' : 'text-indigo-500'}>
						{f.currentLoadHours} / {f.maxLoadHours} Hrs
					</span>
				</div>
				<div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
					<div 
						className={`h-full transition-all duration-700 ease-out ${isOverload ? 'bg-red-500' : 'bg-indigo-500'}`}
						style={{ width: `${progressPercent}%` }}
					/>
				</div>
			</div>
		</div>
	);
};

export default FacultyWorkloadUI;