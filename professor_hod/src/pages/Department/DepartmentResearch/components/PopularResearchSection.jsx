// src/pages/Department/DepartmentResearch/components/PopularResearchSection.jsx

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
	Microscope,
	BookOpen,
	ChevronLeft,
	ChevronRight,
	Star,
} from "lucide-react";
import CollapsibleSection from "../../../../components/common/CollapsibleSection";

/**
 * Individual card displaying research details.
 * Features a truncated team list and a chevron indicator for better UI clarity.
 */
const PopularResearchCard = ({ item, type }) => {
	const team = type === "project" ? item.collaborators : item.coAuthors;

	const detailId = type === "publication" ? item.url || item.id : item.id;
	const detailUrl = `/research-publications/explore/${type}/${detailId}`;

	return (
		<Link
			to={detailUrl}
			className="flex items-start gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-900/50 shadow-sm hover:shadow-md hover:border-violet-200 dark:hover:border-violet-900/50 transition-all duration-300 group"
		>
			{/* Leading Category Icon */}
			<div className="hidden sm:flex p-2.5 rounded-xl bg-violet-100 dark:bg-violet-800/50 text-violet-600 dark:text-violet-400 transition-colors">
				{type === "project" ? (
					<Microscope className="size-5" />
				) : (
					<BookOpen className="size-5" />
				)}
			</div>

			{/* Main Content: Title and Truncated Team */}
			<div className="flex-1 min-w-0">
				<h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">
					{item.title}
				</h4>
				<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
					{item.professorName}
					{team?.length > 0 && `, ${team.join(", ")}`}
				</p>
			</div>

			{/* Right-aligned Chevron to indicate the card is clickable */}
			<div className="text-gray-300 dark:text-gray-600 group-hover:text-violet-500 transition-colors">
				<ChevronRight className="size-5" />
			</div>
		</Link>
	);
};

/**
 * Section container for high-impact research, handling pagination and data filtering.
 */
const PopularResearchSection = ({ projects = [], publications = [] }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 4;

	const popularFundedWorks = useMemo(() => {
		return [
			...projects
				.filter((p) => p.starsCount > 100 && p.fundingDetails)
				.map((p) => ({ ...p, type: "project" })),
			...publications
				.filter((p) => p.starsCount > 100 && p.fundingDetails)
				.map((p) => ({ ...p, type: "publication" })),
		].sort((a, b) => b.starsCount - a.starsCount);
	}, [projects, publications]);

	const totalPages = Math.ceil(popularFundedWorks.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentItems = popularFundedWorks.slice(
		startIndex,
		startIndex + itemsPerPage,
	);

	if (popularFundedWorks.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-sm text-gray-400">
					No high-impact funded work found.
				</p>
			</div>
		);
	}

	return (
		<CollapsibleSection
			title="Popular Funded Research"
			icon={<Star className="size-4 text-amber-500" />}
			color="amber"
		>
			<div className="space-y-4">
				<div className="space-y-4">
					{currentItems.map((item) => (
						<PopularResearchCard
							key={item.id}
							item={item}
							type={item.type}
						/>
					))}
				</div>

				{/* Footer Pagination Controls */}
				{totalPages > 1 && (
					<div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
						<p className="text-xs text-gray-500">
							Page {currentPage} of {totalPages}
						</p>
						<div className="flex gap-2">
							<button
								onClick={() =>
									setCurrentPage((p) => Math.max(1, p - 1))
								}
								disabled={currentPage === 1}
								className="p-1.5 rounded-full border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
							>
								<ChevronLeft className="size-4" />
							</button>
							<button
								onClick={() =>
									setCurrentPage((p) =>
										Math.min(totalPages, p + 1),
									)
								}
								disabled={currentPage === totalPages}
								className="p-1.5 rounded-full border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
							>
								<ChevronRight className="size-4" />
							</button>
						</div>
					</div>
				)}
			</div>
		</CollapsibleSection>
	);
};

export default PopularResearchSection;
