// src/components/common/StatSummaryCard.jsx

import React from "react";

/**
 * StatSummaryCard
 * A sleek, glassmorphic card for summary stats.
 * Features a single-row layout with a subtle border and high-contrast text.
 */
const StatSummaryCard = ({ label, value, icon: Icon }) => {
	return (
		<div className="flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg transition-all hover:bg-white/[0.15] px-5 py-4 min-w-[180px] max-w-full gap-6">
			{/* Left Section: Icon and Label with truncation logic */}
			<div className="flex items-center gap-3 text-white/90 min-w-0">
				<Icon size={18} strokeWidth={2.5} className="shrink-0" />
				<span
					className="text-sm font-semibold tracking-tight whitespace-normal leading-tight break-words"
					title={label}
				>
					{label}
				</span>
			</div>

			{/* Right Section: Large Stat Value */}
			<div className="text-3xl font-black text-white leading-none shrink-0">
				{value}
			</div>
		</div>
	);
};

export default StatSummaryCard;
