// src/components/common/AdminContactSidebar.jsx

import React from "react";
import { User, Mail, Phone, User2 } from "lucide-react";

const AdminContactSidebar = ({
	admins = [],
	themeColor = "blue",
	isTabbedView = false,
}) => {
	const colorMap = {
		blue: {
			text: "text-blue-600 dark:text-blue-400",
			bg: "bg-blue-50 dark:bg-blue-500/10",
		},
		teal: {
			text: "text-teal-600 dark:text-teal-400",
			bg: "bg-teal-50 dark:bg-teal-500/10",
		},
		fuchsia: {
			text: "text-fuchsia-600 dark:text-fuchsia-400",
			bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10",
		},
		emerald: {
			text: "text-emerald-600 dark:text-emerald-400",
			bg: "bg-emerald-50 dark:bg-emerald-500/10",
		},
		green: {
			text: "text-green-600 dark:text-green-400",
			bg: "bg-green-50 dark:bg-green-500/10",
		},
		yellow: {
			text: "text-yellow-600 dark:text-yellow-400",
			bg: "bg-yellow-50 dark:bg-yellow-500/10",
		},
		amber: {
			text: "text-amber-600 dark:text-amber-400",
			bg: "bg-amber-50 dark:bg-amber-500/10",
		},
		orange: {
			text: "text-orange-600 dark:text-orange-400",
			bg: "bg-orange-50 dark:bg-orange-500/10",
		},
	};

	const colors = colorMap[themeColor] || colorMap.blue;

	return (
		<aside
			className={`${isTabbedView ? "w-full" : "w-full lg:w-80 flex-shrink-0"}`}
		>
			<div className={`${isTabbedView ? "" : "sticky top-8"} space-y-6`}>
				<div
					className={`bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200/60 dark:border-gray-800 p-6 space-y-4 ${isTabbedView ? "" : "shadow-sm"}`}
				>
					{/* Header Section: Title and Subtext */}
					<div className="flex items-center justify-between">
						<h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 flex items-center gap-3">
							<span className={`p-2 rounded-lg ${colors.bg}`}>
								<User2 className={`size-3.5 ${colors.text}`} />
							</span>
							Support Team
						</h4>
					</div>

					<p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
						Need help? Our administrators are here to guide you
						through your submissions.
					</p>

					{/* Admin Contacts List */}
					{admins.length > 0 ? (
						<div
							className={`grid grid-cols-1 ${isTabbedView ? "sm:grid-cols-2" : "lg:grid-cols-1"} gap-5`}
						>
							{admins.map((admin, idx) => (
								<div
									key={idx}
									className="group relative bg-gray-50 dark:bg-[#0f1117] border border-gray-100 dark:border-gray-800/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/20 dark:hover:shadow-none hover:-translate-y-0.5"
								>
									<div className="flex flex-col gap-4">
										<p className="font-bold text-gray-900 dark:text-white text-base tracking-tight">
											{admin.name}
										</p>

										<div className="space-y-3">
											<a
												href={`mailto:${admin.email}`}
												title={admin.email}
												className="flex items-center gap-2.5 text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors group/link"
											>
												<div className="flex-shrink-0 size-7 rounded-full bg-white dark:bg-gray-800/50 flex items-center justify-center transition-colors border border-gray-200 dark:border-gray-600">
													<Mail className="size-3" />
												</div>
												<span className="truncate">
													{admin.email}
												</span>
											</a>

											<a
												href={`tel:${admin.phone}`}
												title={admin.phone}
												className="flex items-center gap-2.5 text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors group/link"
											>
												<div className="flex-shrink-0 size-7 rounded-full bg-white dark:bg-gray-800/50 flex items-center justify-center transition-colors border border-gray-200 dark:border-gray-600">
													<Phone className="size-3" />
												</div>
												{admin.phone}
											</a>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						/* Empty State UI */
						<div className="text-center py-10 bg-gray-50/50 dark:bg-[#0f1117] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
							<div className="size-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
								<User className="size-6 text-gray-300 dark:text-gray-600" />
							</div>
							<p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-widest">
								No contacts assigned
							</p>
						</div>
					)}
				</div>
			</div>
		</aside>
	);
};

export default AdminContactSidebar;
