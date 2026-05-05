// src/pages/Research/views/ResearchDetailsView.jsx

import React, { useState } from "react";
import {
	User,
	Tag,
	Wallet,
	Laptop,
	Calendar,
	ExternalLink,
	ChevronRight,
	Pencil,
	Plus,
	HistoryIcon,
	Clock,
	Briefcase,
	Star,
	BookOpen,
	Globe,
	Trash2,
} from "lucide-react";

/**
 * Unified view for Research Projects and Publications.
 */
const ResearchDetailsView = ({
	type,
	data,
	onApply,
	onEdit,
	onStar,
	onCreateRole,
	onUpdateRole,
	onDeleteRole,
	onAddTimeline,
	onDeleteTimeline,
	onEditTimeline,
	onViewUser,
}) => {
	const isProject = type === "project";
	const hasRoles = data.openRoles?.length > 0;
	// Create a sorted copy of the timeline: Latest date first
	const sortedTimeline = data.timeline
		? [...data.timeline].sort((a, b) => new Date(b.date) - new Date(a.date))
		: [];
	const hasTimeline = sortedTimeline.length > 0;

	return (
		<div className="relative">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
				<div className="lg:col-span-3 space-y-6">
					{/* Main Detail Card */}
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 md:p-8">
						<div className="flex flex-wrap items-center justify-between gap-3 mb-4">
							<div className="flex flex-wrap items-center gap-2">
								<span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-black uppercase tracking-wider">
									<Tag className="size-3" />
									{data.category || "General"}
								</span>

								<span
									className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${
										data.status === "Open"
											? "bg-emerald-100 dark:bg-blue-900/40 text-emerald-700 dark:text-emerald-300"
											: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
									}`}
								>
									{data.status === "Open"
										? `${data.openRoles?.length || 0} Openings`
										: "Closed"}
								</span>
							</div>

							<button
								onClick={(e) => {
									e.stopPropagation();
									onStar?.(data.id);
								}}
								className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border shadow-sm transition-all active:scale-90 font-bold text-xs group ${
									data.isStarred
										? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/40 dark:border-amber-700/50 shadow-amber-200/20"
										: "bg-white border-gray-100 text-gray-400 hover:text-gray-600 dark:bg-[#1a1d26] dark:border-gray-700 dark:text-gray-500"
								}`}
							>
								<Star
									className={`size-4 transition-transform ${
										data.isStarred
											? "fill-amber-500 scale-110"
											: "group-hover:rotate-12"
									}`}
								/>
								<span>{data.starsCount || 0}</span>
							</button>
						</div>

						<h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
							{data.title}
						</h3>

						<div className="text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium mb-6 text-sm md:text-base">
							{isProject ? (
								<button
									onClick={() =>
										onViewUser?.(data.professorName)
									}
									className="flex items-center gap-2 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all group"
								>
									<User className="size-4 shrink-0 group-hover:scale-110 transition-transform" />
									<span className="hover:underline decoration-2 underline-offset-4">
										{data.professorName}
									</span>
								</button>
							) : (
								<div className="flex items-center gap-2">
									<BookOpen className="size-4 shrink-0" />{" "}
									<span className="line-clamp-1">
										{data.journalDetails}
									</span>
								</div>
							)}
						</div>

						<div className="space-y-6">
							<section>
								<h4 className="text-[10px] md:text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">
									{isProject
										? "Collaboration Team"
										: "Authors"}
								</h4>
								{isProject ? (
									<div className="flex flex-wrap gap-2">
										{data.collaborators?.map((person) => (
											<button
												key={person}
												onClick={() =>
													onViewUser?.(person)
												}
												className="text-xs md:text-sm px-3 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-full text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-emerald-500 transition-all"
											>
												{person}
											</button>
										))}
									</div>
								) : (
									<p className="text-gray-700 dark:text-gray-300 italic text-base md:text-lg">
										<span
											className="cursor-pointer hover:text-emerald-700"
											onClick={() =>
												onViewUser?.(data.professorName)
											}
										>
											{data.professorName}
										</span>
										{data.coAuthors?.length > 0 && (
											<>
												{", "}
												{data.coAuthors.map(
													(author, i) => (
														<React.Fragment
															key={author}
														>
															<span
																className="cursor-pointer hover:text-emerald-700"
																onClick={() =>
																	onViewUser?.(
																		author,
																	)
																}
															>
																{author}
															</span>
															{i <
															data.coAuthors
																.length -
																1
																? ", "
																: ""}
														</React.Fragment>
													),
												)}
											</>
										)}
									</p>
								)}
							</section>

							<section>
								<h4 className="text-[10px] md:text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">
									Abstract
								</h4>
								<p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
									{data.abstract}
								</p>
							</section>
						</div>
					</div>
					{/* Metadata - Moves below abstract on mobile */}
					<div className="lg:hidden bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
						<MetadataContent data={data} isProject={isProject} />
					</div>
					{/* Role management interface for project owners and applicants */}
					{(hasRoles || data.isOwner) && data.status === "Open" && (
						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 md:p-6">
							<div className="flex justify-between items-center mb-4">
								<div className="flex items-center gap-2">
									<Briefcase className="size-4 text-emerald-700 dark:text-emerald-500" />
									<h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
										Open Roles
									</h4>
								</div>
								{data.isOwner && hasRoles && (
									<button
										onClick={() => onCreateRole(data.id)}
										className="flex items-center gap-2 px-3 py-2 md:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-95"
									>
										<Plus className="size-4" />
										<span className="text-sm font-bold">
											Create
										</span>
									</button>
								)}
							</div>

							{hasRoles ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{data.openRoles?.map((role, idx) => (
										<div
											key={idx}
											className="group relative p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors"
										>
											{data.isOwner && (
												<div className="absolute top-2 right-2 flex gap-1 z-10">
													<button
														onClick={(e) => {
															e.stopPropagation();
															if (
																window.confirm(
																	"Are you sure you want to delete this role?",
																)
															) {
																onDeleteRole(
																	data.id,
																	role.id,
																);
															}
														}}
														aria-label="Delete role"
														className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 lg:opacity-0 lg:group-hover:opacity-100 rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all active:scale-90"
													>
														<Trash2 className="size-3.5" />
													</button>
													<button
														onClick={() =>
															onUpdateRole(
																data.id,
																role.id,
															)
														}
														aria-label="Edit role"
														className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 lg:opacity-0 lg:group-hover:opacity-100 rounded-lg hover:bg-emerald-600 hover:text-white dark:hover:text-white transition-all active:scale-90"
													>
														<Pencil className="size-3.5" />
													</button>
												</div>
											)}
											<h5 className="font-bold text-gray-900 dark:text-white text-md mb-1 pr-10">
												{role.roleName}
											</h5>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												{role.description}
											</p>
										</div>
									))}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
									<Briefcase className="size-8 text-gray-300 mb-3" />
									<p className="text-gray-500 text-sm mb-4">
										No roles created yet
									</p>
									<button
										onClick={() => onCreateRole(data.id)}
										className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold active:scale-95"
									>
										<Plus className="size-4" /> Add First
										Role
									</button>
								</div>
							)}
						</div>
					)}

					{/* Event tracking timeline for project/paper progress */}
					{(hasTimeline || data.isOwner) && (
						<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 md:p-6">
							<div className="flex justify-between items-center mb-6">
								<div className="flex items-center gap-2">
									<HistoryIcon className="size-4 text-emerald-700 dark:text-emerald-500" />
									<h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
										{isProject
											? "Project Timeline"
											: "Publication Timeline"}
									</h4>
								</div>
								{data.isOwner && hasTimeline && (
									<button
										onClick={onAddTimeline}
										className="flex items-center gap-2 px-3 py-2 md:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-600 text-white shadow-md transition-all active:scale-95"
									>
										<Plus className="size-4" />
										<span className="text-sm font-bold">
											Add
										</span>
									</button>
								)}
							</div>

							{hasTimeline ? (
								<div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 md:before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-gray-200 before:to-transparent">
									{sortedTimeline.map((event, idx) => (
										<div
											key={event.id || idx}
											className="relative flex items-start gap-4 md:gap-6 group"
										>
											<div className="absolute left-0 mt-1.5 size-8 md:size-10 rounded-full border-4 border-white dark:border-gray-800 bg-emerald-500 flex items-center justify-center shadow-sm z-10">
												<Clock className="size-3 md:size-4 text-white" />
											</div>
											<div className="ml-10 md:ml-12 pt-1 w-full bg-transparent rounded-xl transition-colors">
												<div className="flex items-center justify-between">
													<time className="text-sm font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-tighter">
														{new Date(
															event.date,
														).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
																year: "numeric",
															},
														)}
													</time>
													{data.isOwner && (
														<div className="flex gap-2">
															<button
																onClick={() => {
																	if (
																		window.confirm(
																			"Are you sure you want to delete this event?",
																		)
																	) {
																		onDeleteTimeline(
																			data.id,
																			event.id,
																		);
																	}
																}}
																aria-label="Delete event"
																className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 lg:opacity-0 lg:group-hover:opacity-100 rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all active:scale-90"
															>
																<Trash2 className="size-3.5" />
															</button>
															<button
																onClick={() =>
																	onEditTimeline(
																		event,
																	)
																}
																aria-label="Edit event"
																className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 lg:opacity-0 lg:group-hover:opacity-100 rounded-lg hover:bg-emerald-600 hover:text-white dark:hover:text-white transition-all active:scale-90"
															>
																<Pencil className="size-3.5" />
															</button>
														</div>
													)}
												</div>
												<p className="text-base text-gray-700 dark:text-gray-200 font-medium mt-1">
													{event.description}
												</p>
												<div className="flex flex-wrap gap-2 mt-2">
													{event.contributors?.map(
														(c) => (
															<button
																key={c}
																onClick={() =>
																	onViewUser?.(
																		c,
																	)
																}
																className="text-xs md:text-sm px-2.5 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-full text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-emerald-500 transition-all"
															>
																{c}
															</button>
														),
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
									<HistoryIcon className="size-8 text-gray-300 mb-3" />
									<p className="text-gray-500 text-sm mb-4">
										No timeline events added yet
									</p>
									<button
										onClick={onAddTimeline}
										className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold active:scale-95"
									>
										<Plus className="size-4" /> Add Event
									</button>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Desktop Sidebar */}
				<aside className="hidden lg:block space-y-4">
					<div className="bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
						<MetadataContent data={data} isProject={isProject} />
						<div className="space-y-3">
							<ActionButtons
								data={data}
								isProject={isProject}
								onEdit={onEdit}
								onApply={onApply}
							/>
						</div>
					</div>
				</aside>
			</div>

			{/* Sticky Action Bar - Positioned above BottomNavUI */}
			<div className="lg:hidden fixed bottom-[72px] left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
				<div className="flex gap-3 max-w-2xl mx-auto">
					<ActionButtons
						data={data}
						isProject={isProject}
						onEdit={onEdit}
						onApply={onApply}
					/>
				</div>
			</div>
		</div>
	);
};

const MetadataContent = ({ data, isProject }) => (
	<>
		{!isProject && (
			<div>
				<div className="flex items-center gap-2 text-gray-400 mb-2">
					<Globe className="size-4" />
					<h4 className="text-[10px] font-black uppercase tracking-widest">
						Digital Object ID
					</h4>
				</div>
				<p className="font-mono text-xs md:text-sm break-all text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
					{data.doi}
				</p>
			</div>
		)}

		<div>
			<div className="flex items-center gap-2 text-gray-400 mb-2">
				<Wallet className="size-4" />
				<h4 className="text-[10px] font-black uppercase tracking-widest">
					Funding Details
				</h4>
			</div>
			<p className="font-bold text-sm md:text-md text-gray-900 dark:text-white">
				{data.fundingDetails || "Not Specified"}
			</p>
		</div>

		{data.status === "Open" && (
			<div>
				<div className="flex items-center gap-2 text-gray-400 mb-2">
					<Laptop className="size-4" />
					<h4 className="text-[10px] font-black uppercase tracking-widest">
						Collaboration Mode
					</h4>
				</div>
				<p className="font-bold text-sm md:text-md text-gray-900 dark:text-white">
					{data.collaborationType || "Not Specified"}
				</p>
			</div>
		)}

		<div>
			<div className="flex items-center gap-2 text-gray-400 mb-2">
				<Calendar className="size-4" />
				<h4 className="text-[10px] font-black uppercase tracking-widest">
					{isProject ? "Posted On" : "Published Date"}
				</h4>
			</div>
			<p className="font-bold text-sm md:text-md text-gray-900 dark:text-white">
				{new Date(
					isProject ? data.createdAt : data.publishedDate,
				).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})}
			</p>
		</div>

		{data.keywords?.length > 0 && (
			<div>
				<h4 className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">
					Keywords
				</h4>
				<div className="flex flex-wrap gap-2">
					{data.keywords.map((tag) => (
						<span
							key={tag}
							className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
						>
							{tag}
						</span>
					))}
				</div>
			</div>
		)}
	</>
);

const ActionButtons = ({ data, isProject, onEdit, onApply }) => (
	<>
		<a
			href={data.link}
			target="_blank"
			rel="noreferrer"
			className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-3.5 rounded-xl font-black text-xs md:text-sm shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-3 hover:scale-[1.02]"
		>
			{isProject ? "Visit Link" : "View Paper"}{" "}
			<ExternalLink className="size-4" />
		</a>

		{data.isOwner ? (
			<button
				onClick={onEdit}
				className="w-full bg-emerald-600 hover:bg-emerald-800 text-white px-6 py-3.5 rounded-xl font-black text-xs md:text-sm shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-3 hover:scale-[1.02]"
			>
				Edit Details <Pencil className="size-4" />
			</button>
		) : (
			!data.isMember &&
			data.status === "Open" && (
				<button
					onClick={() => onApply(data.id)}
					className="w-full bg-emerald-600 hover:bg-emerald-800 text-white px-6 py-3.5 rounded-xl font-black text-xs md:text-sm shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-3 hover:scale-[1.02]"
				>
					Apply <ChevronRight className="size-4" />
				</button>
			)
		)}
	</>
);

export default ResearchDetailsView;
