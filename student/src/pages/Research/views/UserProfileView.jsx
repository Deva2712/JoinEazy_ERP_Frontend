// src/pages/Research/views/UserProfileView.jsx

import React from "react";
import {
	MapPin,
	Mail,
	ExternalLink,
	GraduationCap,
	Award,
	Calendar,
	Search,
	University,
	UserPen,
	Globe,
	Microscope,
	BookOpen, // Fixed missing import from your snippet
} from "lucide-react";
import { CompactResearchCard } from "../components/ResearchCard";

/**
 * User Profile view displaying comprehensive researcher details.
 */
const UserProfileView = ({
	user,
	projects = [],
	publications = [],
	onSelectItem,
	onBack,
	onEditProfile,
}) => {
	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center py-12 px-6 bg-white dark:bg-[#1a1d26] rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in duration-500">
				<div className="size-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
					<Search className="size-8 text-gray-400" />
				</div>
				<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
					Researcher Not Found
				</h3>
				<button
					onClick={onBack}
					className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-all"
				>
					Back to Research
				</button>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
			<div className="lg:col-span-3 space-y-6">
				{/* Main Header Card */}
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 md:p-8">
					<div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
						<div className="relative shrink-0">
							<div className="size-24 md:size-28 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 text-5xl font-black overflow-hidden border-2 border-white dark:border-gray-700 shadow-xl">
								<img
									src={user.avatar}
									alt={user.name}
									className="size-full object-cover"
								/>
							</div>
						</div>

						<div className="flex-1 space-y-3 w-full">
							<div className="flex flex-col md:flex-row items-center justify-between gap-4">
								<div className="flex flex-col md:flex-row items-center gap-3">
									<h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
										{user.name}
									</h3>
									<span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-200/50">
										{user.tag}
									</span>
								</div>
								{user.isYou && (
									<button
										onClick={onEditProfile}
										className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-lg dark:shadow-none"
									>
										<UserPen className="size-4" />
										Edit Profile
									</button>
								)}
							</div>
							<div className="flex flex-row flex-wrap gap-6 items-center justify-center md:justify-start">
								<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
									<University className="size-4 text-emerald-500" />
									<span className="text-xs font-semibold uppercase tracking-wider">
										{user.department}
									</span>
								</div>
								{user.education && (
									<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
										<GraduationCap className="size-4 text-emerald-500" />
										<span className="text-xs font-semibold uppercase tracking-wider">
											{user.education}
										</span>
									</div>
								)}
							</div>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg italic">
								{user.bio}
							</p>
						</div>
					</div>
				</div>

				<div className="lg:hidden">
					<ProfileMetadata user={user} />
				</div>

				{/* Projects Section - Transitioned to a vertical list for better focus */}
				<section className="space-y-6">
					<div className="flex items-center justify-between mb-5">
						<div className="flex items-center gap-3">
							<Microscope className="size-5 text-emerald-700" />
							<h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
								Projects & Collaborations
							</h2>
						</div>
					</div>
					{projects.length > 0 ? (
						<div className="bg-gray-50 dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
							{projects.map((project, index) => (
								<div
									key={project.id}
									className={
										index !== 0
											? "border-t border-gray-100 dark:border-gray-700/50"
											: ""
									}
								>
									<CompactResearchCard
										item={project}
										type="project"
										onClick={() =>
											onSelectItem({
												type: "project",
												data: project,
												viewType: project.isOwner
													? "owner"
													: "member",
											})
										}
									/>
								</div>
							))}
						</div>
					) : (
						<EmptyState message="No active projects." />
					)}
				</section>

				{/* Publications Section - Unified styling with Projects */}
				<section className="space-y-6">
					<div className="flex items-center justify-between mb-5">
						<div className="flex items-center gap-3">
							<BookOpen className="size-5 text-emerald-700" />
							<h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
								Paper Publications
							</h2>
						</div>
					</div>

					{publications.length > 0 ? (
						<div className="bg-gray-50 dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
							{publications.map((pub, index) => (
								<div
									key={pub.id}
									className={
										index !== 0
											? "border-t border-gray-100 dark:border-gray-700/50"
											: ""
									}
								>
									<CompactResearchCard
										item={pub}
										type="publication"
										onClick={() =>
											onSelectItem({
												type: "publication",
												data: pub,
												viewType: pub.isOwner
													? "owner"
													: "member",
											})
										}
									/>
								</div>
							))}
						</div>
					) : (
						<EmptyState message="No published works found." />
					)}
				</section>
			</div>

			<aside className="hidden lg:block">
				<ProfileMetadata user={user} />
			</aside>
		</div>
	);
};

/**
 * Reusable Empty State component for research sections
 */
const EmptyState = ({ message }) => (
	<div className="p-12 text-center bg-gray-50/50 dark:bg-[#1a1d26] border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
		<p className="text-sm text-gray-400 italic">{message}</p>
	</div>
);

/**
 * Extracted Sub-component for Metadata
 */
const ProfileMetadata = ({ user }) => (
	<aside className="space-y-4 sticky top-6">
		<div className="bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6 overflow-hidden">
			{/* Contact Info */}
			<div>
				<div className="flex items-center gap-2 text-gray-400 mb-2">
					<Mail className="size-4" />
					<h4 className="text-[10px] font-bold uppercase tracking-widest">
						Email
					</h4>
				</div>
				<a
					href={`mailto:${user.email}`}
					className="font-bold text-md text-gray-900 dark:text-white hover:text-emerald-500 transition-colors block truncate"
					title={user.email}
				>
					{user.email}
				</a>
			</div>

			<div>
				<div className="flex items-center gap-2 text-gray-400 mb-2">
					<MapPin className="size-4" />
					<h4 className="text-[10px] font-bold uppercase tracking-widest">
						Office / Location
					</h4>
				</div>
				<p className="font-bold text-md text-gray-900 dark:text-white">
					{user.office || "Remote Only"}
				</p>
			</div>

			{user.joinedDate && (
				<div>
					<div className="flex items-center gap-2 text-gray-400 mb-2">
						<Calendar className="size-4" />
						<h4 className="text-[10px] font-bold uppercase tracking-widest">
							Member Since
						</h4>
					</div>
					<p className="font-bold text-md text-gray-900 dark:text-white">
						{new Date(user.joinedDate).toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						})}
					</p>
				</div>
			)}

			{/* Skills/Expertise */}
			{user.skills?.length > 0 && (
				<div>
					<div className="flex items-center gap-2 text-gray-400 mb-3">
						<Award className="size-4" />
						<h4 className="text-[10px] font-bold uppercase tracking-widest">
							Technical Expertise
						</h4>
					</div>
					<div className="flex flex-wrap gap-2">
						{user.skills.map((skill) => (
							<span
								key={skill}
								className="text-[11px] px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 font-medium"
							>
								{skill}
							</span>
						))}
					</div>
				</div>
			)}

			{/* Actions */}
			<div className="space-y-3">
				<a
					href={user.linkedinUrl || "#"}
					target="_blank"
					rel="noreferrer"
					className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-3.5 rounded-xl font-black text-xs md:text-sm shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-3 hover:scale-[1.02]"
				>
					LinkedIn <ExternalLink className="size-4" />
				</a>

				{user.portfolio && (
					<a
						href={user.portfolio}
						target="_blank"
						rel="noreferrer"
						className="w-full bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-black text-xs shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-3"
					>
						Portfolio <Globe className="size-4" />
					</a>
				)}
			</div>
		</div>
	</aside>
);

export default UserProfileView;
