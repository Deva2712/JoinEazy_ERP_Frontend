import React, { useState, useEffect } from "react";
import { Check, ShieldAlert, ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SecurityView = ({
	password,
	setPassword,
	confirmPassword,
	setConfirmPassword,
	errors,
	setErrors,
	onSavePassword,
	loading,
}) => {
	const navigate = useNavigate();
	const [isUpdated, setIsUpdated] = useState(false);

	useEffect(() => {
		if (isUpdated) {
			const timer = setTimeout(() => setIsUpdated(false), 3000);
			return () => clearTimeout(timer);
		}
	}, [isUpdated]);

	const handleSave = async () => {
		await onSavePassword();
		setIsUpdated(true);
	};

	const cardClass =
		"bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 md:p-8 transition-all";
	const sectionHeaderClass =
		"flex items-center gap-2 text-rose-600 mb-6 uppercase tracking-[0.2em] text-[10px] md:text-xs font-black";
	const inputClass =
		"w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f1117] text-gray-900 dark:text-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-sm";
	const labelClass =
		"block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase";

	const validatePassword = (v) =>
		v.length < 7 ? "Password cannot be less than 7 characters" : "";
	const validateConfirmPassword = (v) =>
		v !== password ? "Passwords do not match" : "";

	const reqs = [
		{ met: password.length >= 7, label: "At least 7 characters" },
		{ met: /[A-Z]/.test(password), label: "Contains uppercase letter" },
		{ met: /[0-9]/.test(password), label: "Contains a number" },
	];

	const ActionButton = ({ className }) => (
		<button
			onClick={handleSave}
			disabled={loading || isUpdated || errors.password || errors.confirmPassword || !password}
			className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all ${className} ${
				isUpdated
					? "bg-green-600 text-white"
					: "bg-rose-600 hover:bg-rose-700 text-white"
			} disabled:opacity-50`}
		>
			{isUpdated ? <Check className="size-4" /> : <Save className="size-4" />}
			{isUpdated ? "Updated!" : loading ? "Updating..." : "Update Password"}
		</button>
	);

	return (
		<div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center justify-center size-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d26] hover:bg-gray-50 transition-all"
					>
						<ArrowLeft className="size-4 text-gray-600" />
					</button>
					<h1 className="text-xl font-bold text-gray-900 dark:text-white">
						Security
					</h1>
				</div>
				{/* Desktop Button */}
				<ActionButton className="hidden md:flex" />
			</div>

			<section className={cardClass}>
				<div className={sectionHeaderClass}>
					<ShieldAlert className="size-4" /> Change Password
				</div>
                <div className="space-y-4">
					<div>
						<label className={labelClass}>New Password</label>
						<input
							className={inputClass}
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onBlur={() =>
								setErrors((p) => ({
									...p,
									password: validatePassword(password),
								}))
							}
						/>
						{errors.password && (
							<p className="text-red-500 text-[10px] mt-1 font-medium">
								{errors.password}
							</p>
						)}
					</div>
					<div>
						<label className={labelClass}>Confirm Password</label>
						<input
							className={inputClass}
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							onBlur={() =>
								setErrors((p) => ({
									...p,
									confirmPassword: validateConfirmPassword(confirmPassword),
								}))
							}
						/>
						{errors.confirmPassword && (
							<p className="text-red-500 text-[10px] mt-1 font-medium">
								{errors.confirmPassword}
							</p>
						)}
					</div>

					<div className="bg-gray-50 dark:bg-[#0f1117] rounded-xl p-4 space-y-2.5">
						{reqs.map((r, i) => (
							<div key={i} className="flex items-center gap-3">
								<div
									className={`w-5 h-5 rounded-full flex items-center justify-center ${
										r.met ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
									}`}
								>
									{r.met && <Check className="w-3 h-3 text-white" />}
								</div>
								<span
									className={`text-sm ${
										r.met ? "text-emerald-600" : "text-gray-500 dark:text-gray-400"
									}`}
								>
									{r.label}
								</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Mobile Button */}
			<div className="md:hidden">
				<ActionButton className="w-full" />
			</div>
		</div>
	);
};

export default SecurityView;