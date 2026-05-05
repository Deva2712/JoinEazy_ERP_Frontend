// src/pages/FacultyWorkload/components/AllocationModal.jsx

import React, { useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";

const AllocationModal = ({ isOpen, onClose, faculty = [], types = [], onSubmit }) => {
	const [formData, setFormData] = useState({
		facultyId: "",
		courseCode: "",
		courseName: "",
		type: "Lecture",
		hoursPerWeek: 4,
		section: "",
	});

	if (!isOpen) return null;

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
				{/* Modal Header */}
				<div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
					<div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">Assign Workload</h2>
						<p className="text-xs text-gray-500 mt-0.5">Allocate teaching hours to a faculty member.</p>
					</div>
					<button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{/* Faculty Selection */}
					<div className="space-y-1.5">
						<label className="text-xs font-bold text-gray-500 uppercase ml-1">Faculty Member</label>
						<select 
							name="facultyId"
							required
							value={formData.facultyId}
							onChange={handleInputChange}
							className="w-full bg-gray-50 dark:bg-[#242833] border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
						>
							<option value="">Select Faculty</option>
							{faculty.map(f => (
								<option key={f.id} value={f.id}>{f.name} ({f.designation})</option>
							))}
						</select>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label className="text-xs font-bold text-gray-500 uppercase ml-1">Course Code</label>
							<input 
								name="courseCode"
								placeholder="e.g. CS301"
								required
								className="w-full bg-gray-50 dark:bg-[#242833] border-none rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
								onChange={handleInputChange}
							/>
						</div>
						<div className="space-y-1.5">
							<label className="text-xs font-bold text-gray-500 uppercase ml-1">Section</label>
							<input 
								name="section"
								placeholder="e.g. A or B1"
								className="w-full bg-gray-50 dark:bg-[#242833] border-none rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
								onChange={handleInputChange}
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-bold text-gray-500 uppercase ml-1">Course Name</label>
						<input 
							name="courseName"
							placeholder="e.g. Algorithms & Complexity"
							required
							className="w-full bg-gray-50 dark:bg-[#242833] border-none rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
							onChange={handleInputChange}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label className="text-xs font-bold text-gray-500 uppercase ml-1">Type</label>
							<select 
								name="type"
								className="w-full bg-gray-50 dark:bg-[#242833] border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
								onChange={handleInputChange}
							>
								{types.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
							</select>
						</div>
						<div className="space-y-1.5">
							<label className="text-xs font-bold text-gray-500 uppercase ml-1">Hours / Week</label>
							<input 
								type="number"
								name="hoursPerWeek"
								min="1"
								value={formData.hoursPerWeek}
								className="w-full bg-gray-50 dark:bg-[#242833] border-none rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
								onChange={handleInputChange}
							/>
						</div>
					</div>

					{/* Form Footer */}
					<div className="pt-4 flex gap-3">
						<button 
							type="button"
							onClick={onClose}
							className="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-colors"
						>
							Cancel
						</button>
						<button 
							type="submit"
							className="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
						>
							<Save className="size-4" />
							Confirm Allocation
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AllocationModal;