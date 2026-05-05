// src/pages/Research/views/GrantsView.jsx

import React from "react";
import { Wallet, Plus } from "lucide-react";
import AdminContactSidebar from "../../../components/common/AdminContactSidebar";
import GrantRequestCard from "../components/GrantRequestCard";

/**
 * GrantsView displays the list of funding requests and provides
 * access to the creation modal.
 */
const GrantsView = ({ requests = [], admins = [], onPostNew, onEdit, collections, onViewResearch }) => {
	return (
		<div className="flex flex-col lg:flex-row gap-8">
			<div className="flex-grow">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
						<h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
							Research Grants & Funding
						</h3>

					<button
						onClick={onPostNew}
						className="flex items-center gap-2 justify-center bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
					>
						<Plus className="size-4" />
						Apply for Grant
					</button>
				</div>

				{/* GRANTS LIST */}
				{requests.length > 0 ? (
					<div className="grid grid-cols-1 gap-4">
						{requests.map((req) => (
							<GrantRequestCard
								key={req.id}
								req={req}
								onEdit={onEdit}
								collections={collections}
								onViewResearch={onViewResearch}
							/>
						))}
					</div>
				) : (
					<div className="py-20 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-[#1a1d26] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
						<div className="size-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
							<Wallet className="size-8 text-gray-300 dark:text-gray-600" />
						</div>
						<h2 className="text-lg font-bold text-gray-900 dark:text-white">
							No grant requests found
						</h2>
						<p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
							You haven't submitted any funding requests yet. Use
							the button above to start an application.
						</p>
					</div>
				)}
			</div>

			<div className="hidden lg:block w-80 shrink-0">
				<AdminContactSidebar
					admins={admins}
					themeColor="emerald"
					title="Funding Support"
					description="Contact research office for financial guidance."
				/>
			</div>
		</div>
	);
};

export default GrantsView;
