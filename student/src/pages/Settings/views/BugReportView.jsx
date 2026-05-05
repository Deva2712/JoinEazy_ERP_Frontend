import React, { useState, useEffect } from "react";
import { Camera, Bug, ArrowLeft, Send, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BugReportView = ({
	bugReport,
	setBugReport,
	handleFileUpload,
	onSaveBugReport,
	loading,
}) => {
	const navigate = useNavigate();
	const [isSent, setIsSent] = useState(false);

	useEffect(() => {
		if (isSent) {
			const timer = setTimeout(() => setIsSent(false), 3000);
			return () => clearTimeout(timer);
		}
	}, [isSent]);

	const handleSend = async () => {
		await onSaveBugReport();
		setIsSent(true);
	};

	const cardClass =
		"bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 md:p-8 transition-all";
	const sectionHeaderClass =
		"flex items-center gap-2 text-amber-600 mb-6 uppercase tracking-[0.2em] text-[10px] md:text-xs font-black";
	const inputClass =
		"w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f1117] text-gray-900 dark:text-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-sm";
	const labelClass =
		"block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase";

	// Reusable button component logic
	const ActionButton = ({ className }) => (
		<button
			onClick={handleSend}
			disabled={loading || isSent || !bugReport.description}
			className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all ${className} ${
				isSent
					? "bg-green-600 text-white"
					: "bg-amber-500 hover:bg-amber-600 text-white"
			} disabled:opacity-50`}
		>
			{isSent ? <Check className="size-4" /> : <Send className="size-4" />}
			{isSent ? "Sent!" : loading ? "Submitting..." : "Submit Report"}
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
						Bug Report
					</h1>
				</div>
				{/* Desktop Button: Hidden on mobile */}
				<ActionButton className="hidden md:flex" />
			</div>

			<section className={cardClass}>
				<div className={sectionHeaderClass}>
					<Bug className="size-4" /> Report a Bug
				</div>

				<div>
					<label className={labelClass}>Bug Description *</label>
					<textarea
						className={`${inputClass} resize-y leading-relaxed`}
						rows={9}
						value={bugReport.description}
						onChange={(e) =>
							setBugReport((p) => ({
								...p,
								description: e.target.value,
							}))
						}
						placeholder={
							"Steps to reproduce:\n1. Go to…\n2. Click on…\n3. See error\n\nExpected: …\nActual: …"
						}
					/>
				</div>

				<div className="mt-6">
					<label className={labelClass}>Screenshots (optional)</label>
					<label className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-amber-400 transition-all gap-2 bg-gray-50 dark:bg-[#0f1117]">
						<Camera className="w-6 h-6 text-amber-600" />
						<span className="text-sm font-bold text-gray-600 dark:text-gray-400 text-center px-4">
							{bugReport.screenshots?.length > 0
								? `${bugReport.screenshots.length} file(s) selected`
								: "Click to upload images"}
						</span>
						<input
							type="file"
							multiple
							accept="image/*"
							onChange={(e) => handleFileUpload(e, "screenshots")}
							className="hidden"
						/>
					</label>
				</div>
			</section>

			{/* Mobile Button: Full width, visible only on mobile */}
			<div className="md:hidden">
				<ActionButton className="w-full" />
			</div>
		</div>
	);
};

export default BugReportView;