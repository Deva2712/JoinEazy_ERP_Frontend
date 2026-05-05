// src/components/common/CollapsibleSection.jsx

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * A generic container that allows content to be toggled open or closed.
 * Useful for grouping complex data views.
 */
const CollapsibleSection = ({
	title,
	icon,
	children,
	defaultOpen = true,
	noPadding = false,
	forceOpen,
	color,
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	// Effect to handle external triggers to open the section
	useEffect(() => {
		if (forceOpen) {
			setIsOpen(true);
		}
	}, [forceOpen]);

	return (
		<section className="bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-200 dark:border-gray-700/60 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden">
			{/* Header / Trigger */}
			<div className="flex items-center justify-between">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex-1 px-5 py-3 md:px-6 md:py-4 flex items-center justify-between hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all group"
				>
					<div
						className={`flex items-center transition-all duration-300 ${isOpen ? "gap-3.5 md:gap-4" : "gap-3 md:gap-3.5"}`}
					>
						<span
							className={
								isOpen
									? `text-${color}-500 scale-110`
									: "text-gray-400 group-hover:text-gray-600"
							}
						>
							{icon}
						</span>
						<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
							{title}
						</h4>
					</div>

					<div
						className={`p-1.5 rounded-full transition-all duration-300 ${isOpen ? `bg-${color}-50 dark:bg-${color}-900/20 rotate-180` : "bg-gray-100 dark:bg-gray-800"}`}
					>
						<ChevronDown className={`size-4 ${isOpen ? `text-${color}-600 dark:text-${color}-400` : "text-gray-500"}`} />
					</div>
				</button>
			</div>

			{/* Collapsible Content Area */}
			<div
				className={`grid transition-[grid-template-rows] duration-300 ease-out ${
					isOpen
						? "grid-rows-[1fr] opacity-100"
						: "grid-rows-[0fr] opacity-0"
				}`}
			>
				<div className="overflow-hidden">
					<div
						className={`border-t border-gray-100 dark:border-gray-800/80 ${noPadding ? "" : "p-4 md:p-5"}`}
					>
						{children}
					</div>
				</div>
			</div>
		</section>
	);
};

export default CollapsibleSection;
