// src/components/common/CollapsibleSection.jsx

import React, { useState } from "react";
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
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<section className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
			{/* Header / Trigger */}
			<div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800/50">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex-1 p-5 md:p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
				>
					<div className="flex items-center gap-3">
						{icon}
						<h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
							{title}
						</h4>
					</div>
					{isOpen ? (
						<ChevronUp className="size-4 text-gray-400" />
					) : (
						<ChevronDown className="size-4 text-gray-400" />
					)}
				</button>
			</div>

			{/* Collapsible Content Area */}
			{isOpen && (
				<div className={noPadding ? "" : "p-5 md:p-6"}>{children}</div>
			)}
		</section>
	);
};

export default CollapsibleSection;
