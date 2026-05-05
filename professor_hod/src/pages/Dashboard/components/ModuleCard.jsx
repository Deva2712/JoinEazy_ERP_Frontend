// src\pages\Dashboard\components\ModuleCard.jsx

import React from "react";
import { ChevronRight } from "lucide-react";

/**
 * ModuleCard Component
 * Renders a stylized navigation card for the Professor Dashboard.
 * Includes a gradient icon, labels, and hover animations.
 */
const ModuleCard = ({
	label,
	sublabel,
	gradient,
	textColor,
	icon: Icon,
	onClick,
}) => {
	return (
		<div
			onClick={onClick}
			className="group relative flex flex-col justify-between bg-white dark:bg-[#1a1d26] rounded-2xl p-5 md:p-6 border border-gray-100 dark:border-gray-800/50 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/40 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
		>
			{/* Decorative background element */}
			<div
				className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-full`}
			/>

			{/* Top Right Navigation Indicator */}
			<div className="absolute top-4 right-4 z-20">
				<div
					className={`${textColor} p-1.5 rounded-full bg-white dark:bg-[#1a1d26] group-hover:translate-x-1 transition-transform duration-300`}
				>
					<ChevronRight className="size-5 stroke-[3px]" />
				</div>
			</div>

			{/* Header Section: Icon, Label and Sub-label */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
				<div
					className={`flex-shrink-0 bg-gradient-to-br ${gradient} p-3 rounded-xl shadow-md shadow-inherit/20 group-hover:scale-105 transition-transform duration-300`}
				>
					<Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
				</div>
				<div className="space-y-1">
					<h3 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-200 leading-tight pr-6">
						{label}
					</h3>
					<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
						{sublabel}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ModuleCard;
