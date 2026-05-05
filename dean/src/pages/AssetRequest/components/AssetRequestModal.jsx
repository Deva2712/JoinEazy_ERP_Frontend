// src/pages/AssetRequest/components/AssetRequestModal.jsx

import React, { useState, useEffect } from "react";
import {
	X,
	BookOpen,
	Calendar,
	Clock,
	MessageSquare,
	AlertCircle,
	Package,
	ChevronDown,
} from "lucide-react";

const AssetRequestModal = ({
	isOpen,
	onClose,
	assets = [],
	cohorts = [],
	initialData = null,
	onSubmit,
}) => {
	const initialState = {
		id: initialData?.id || null,
		type: initialData?.type || "Class Room",
		assetId: initialData?.assetId || "",
		course: initialData?.course || "",
		date: initialData?.date || "", // Normalized date field
		startTime: initialData?.startTime || "",
		endTime: initialData?.endTime || "",
		duration: initialData?.duration || "",
		reason: initialData?.reason || "",
	};

	const [formData, setFormData] = useState(initialState);
	const [errors, setErrors] = useState({});

	const today = new Date().toISOString().split("T")[0];

	useEffect(() => {
		if (!isOpen) {
			setFormData(initialState);
			setErrors({});
		}
	}, [isOpen, initialData]);

	const availableAssets = assets.filter(
		(r) =>
			r.type === formData.type &&
			(r.status === "Available" || r.id === formData.assetId),
	);

	const validate = () => {
    const newErrors = {};
    if (!formData.assetId) newErrors.assetId = "Required";
    if (!formData.date) newErrors.date = "Required";

    if (formData.type === "Accommodation") {
        // Ensure at least one duration field has a positive value
        const total = (parseInt(formData.duration_years) || 0) +
                      (parseInt(formData.duration_months) || 0) +
                      (parseInt(formData.duration_weeks) || 0) +
                      (parseInt(formData.duration_days) || 0);
        
        if (total <= 0) {
            newErrors.duration = "Specify a duration greater than 0";
        }
    } else {
        if (!formData.startTime || !formData.endTime || formData.endTime <= formData.startTime) {
            newErrors.time = "Invalid time range.";
        }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let dataToSend = { ...formData };

    if (dataToSend.type === "Accommodation") {
        const y = parseInt(dataToSend.duration_years) || 0;
        const m = parseInt(dataToSend.duration_months) || 0;
        const w = parseInt(dataToSend.duration_weeks) || 0;
        const d = parseInt(dataToSend.duration_days) || 0;

        // Calculate total days as a pure integer
        dataToSend.duration = (y * 365) + (m * 30) + (w * 7) + d;
        
        // Remove temporary UI fields
        delete dataToSend.duration_years;
        delete dataToSend.duration_months;
        delete dataToSend.duration_weeks;
        delete dataToSend.duration_days;
    }

    onSubmit(dataToSend);
};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
			...(name === "type" ? { assetId: "" } : {}),
		}));
		if (errors[name] || name === "startTime" || name === "endTime") {
			setErrors((prev) => ({ ...prev, [name]: null, time: null }));
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/30">
							<Package className="size-5" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							{formData.id
								? "Edit Asset Request"
								: "New Asset Request"}
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
					<form
						id="asset-request-form"
						onSubmit={handleSubmit}
						className="space-y-6"
					>
						{formData.id && (
							<div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl">
								<AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
								<p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
									Please address the admin's comments before
									resubmitting.
								</p>
							</div>
						)}

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
									Asset Type{" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="relative group">
									<select
										name="type"
										value={formData.type}
										onChange={handleChange}
										required
										className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all appearance-none"
									>
										<option value="Class Room">
											Class Room
										</option>
										<option value="Lab">Laboratory</option>
										<option value="Seminar Hall">
											Seminar Hall
										</option>
										<option value="Equipment">
											Equipment
										</option>
										<option value="Accommodation">
											Accommodation
										</option>
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
								</div>
							</div>

							<div className="space-y-2">
								<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
									Select Asset{" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="relative group">
									<select
										name="assetId"
										value={formData.assetId}
										onChange={handleChange}
										required
										disabled={availableAssets.length === 0}
										className={`w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border ${errors.assetId ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all appearance-none ${availableAssets.length === 0 ? "opacity-60 cursor-not-allowed" : ""}`}
									>
										<option value="">
											{availableAssets.length === 0
												? "None Available"
												: `Choose ${formData.type}`}
										</option>
										{availableAssets.map((res) => (
											<option key={res.id} value={res.id}>
												{res.name}
											</option>
										))}
									</select>
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
								</div>
							</div>
						</div>

						{formData.type !== "Accommodation" && (
							<div className="space-y-2">
								<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
									<BookOpen className="size-3" /> Associated
									Course
								</label>
								<select
									name="course"
									value={formData.course}
									onChange={handleChange}
									className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all appearance-none"
								>
									<option value="">
										Select Course (Optional)
									</option>
									{cohorts.map((c) => (
										<option
											key={c.id}
											value={c.cohort_name}
										>
											{c.cohort_name}
										</option>
									))}
								</select>
							</div>
						)}

						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<Calendar className="size-3" />{" "}
								{formData.type === "Accommodation"
									? "Check-in Date"
									: "Booking Date"}
								<span className="text-red-500">*</span>
							</label>
							<input
								name="date"
								type="date"
								min={today}
								value={formData.date}
								onChange={handleChange}
								className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
								required
							/>
						</div>

						{formData.type === "Accommodation" ? (
							<div className="space-y-2">
								<label className="text-xs font-bold uppercase tracking-widest text-gray-400">
									Duration{" "}
									<span className="text-red-500">*</span>
								</label>
								<div className="grid grid-cols-4 gap-2">
									{["years", "months", "weeks", "days"].map(
										(unit) => (
											<div key={unit}>
												<input
													type="number"
													min="0"
													placeholder={
														unit
															.charAt(0)
															.toUpperCase() +
														unit.slice(1)
													}
													value={
														formData[
															`duration_${unit}`
														] || ""
													}
													onChange={(e) =>
														setFormData({
															...formData,
															[`duration_${unit}`]:
																e.target.value,
														})
													}
													className="w-full h-11 px-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-center text-sm focus:ring-2 focus:ring-teal-500 outline-none"
												/>
												<span className="text-[10px] text-gray-400 block text-center mt-1 uppercase">
													{unit}
												</span>
											</div>
										),
									)}
								</div>
							</div>
						) : (
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
										<Clock className="size-3" /> From{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										name="startTime"
										type="time"
										value={formData.startTime}
										onChange={handleChange}
										required
										className="w-full h-11 px-4 text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none"
									/>
								</div>
								<div className="space-y-2">
									<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
										<Clock className="size-3" /> To{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										name="endTime"
										type="time"
										value={formData.endTime}
										onChange={handleChange}
										required
										className="w-full h-11 px-4 text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none"
									/>
								</div>
								{errors.time && (
									<p className="col-span-2 text-xs text-red-500">
										{errors.time}
									</p>
								)}
							</div>
						)}

						<div className="space-y-2">
							<label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
								<MessageSquare className="size-3" />{" "}
								{formData.type === "Accommodation"
									? "Reason for Stay"
									: "Reason for Request"}{" "}
								<span className="text-red-500">*</span>
							</label>
							<textarea
								name="reason"
								value={formData.reason}
								onChange={handleChange}
								placeholder="Please explain why you need this asset..."
								className={`w-full min-h-[100px] px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${errors.reason ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none`}
								required
							/>
							{errors.reason && (
								<p className="mt-1 text-xs text-red-500">
									{errors.reason}
								</p>
							)}
						</div>
					</form>
				</div>

				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-gray-800/50">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 h-12 font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						form="asset-request-form"
						className="flex-1 h-12 font-bold text-white bg-teal-600 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-teal-700 transition-all active:scale-[0.98]"
					>
						{formData.id ? "Update Request" : "Submit Request"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AssetRequestModal;
