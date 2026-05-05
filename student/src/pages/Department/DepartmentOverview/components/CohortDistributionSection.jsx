// src/pages/Department/components/CohortDistributionSection.jsx

import React from "react";
import { TrendingUp } from "lucide-react";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";

/**
 * Renders a list of progress bars showing student gender distribution across different academic years.
 */
const CohortDistributionSection = ({ data }) => (
	<CollapsibleSection
		title="Cohort Distribution"
		icon={<TrendingUp className="size-4 text-violet-500" />}
	>
		<div className="space-y-4">
			{/* Academic Year Row Iteration */}
			{data.map((year, i) => (
				<div key={i} className="space-y-2">
					<div className="flex justify-between items-center">
						<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
							{year.year} Year
						</span>
						<span className="text-xs font-semibold text-gray-900 dark:text-white">
							{year.count} Students
						</span>
					</div>

					{/* Stacked Bar Chart: Represents Female vs Male ratio */}
					<div className="h-3.5 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex">
						{/* Female Segment */}
						<div
							className="bg-violet-600 border-white/10"
							style={{
								width: `${(year.genderRatio.f / year.count) * 100}%`,
							}}
						/>
						{/* Male Segment */}
						<div
							className="bg-violet-200 dark:bg-violet-500/30"
							style={{
								width: `${(year.genderRatio.m / year.count) * 100}%`,
							}}
						/>
					</div>
				</div>
			))}

			{/* Chart Legend */}
			<div className="flex justify-center gap-8 pt-2">
				<div className="flex items-center gap-2.5">
					<div className="size-2.5 rounded-full bg-violet-600 border-white/10" />
					<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
						Female
					</span>
				</div>
				<div className="flex items-center gap-2.5">
					<div className="size-2.5 rounded-full bg-violet-200 dark:bg-violet-500/30 border-white/10" />
					<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
						Male
					</span>
				</div>
			</div>
		</div>
	</CollapsibleSection>
);

export default CohortDistributionSection;
