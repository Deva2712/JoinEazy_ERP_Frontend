// src/pages/Department/DepartmentPlacements/CompanyDetailsView.jsx

import React, { useMemo, useState } from "react";
import {
	ArrowLeft,
	PieChart,
	BriefcaseBusiness,
} from "lucide-react";
import { useDepartment } from "../../../context/DepartmentContext";
import CompanyRecordCard from "./components/CompanyRecordCard";
import CompanyDetailsSidebar from "./components/CompanyDetailsSidebar";
import JobOpeningModal from "./components/JobOpeningModal";

const CompanyDetailsView = ({ onBack }) => {
	const { state } = useDepartment();
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedOpening, setSelectedOpening] = useState(null);
    const [activeCompanyName, setActiveCompanyName] = useState("");

	const companies = state.placementCompanies || [];

	const filteredCompanies = useMemo(() => {
		return companies.filter((company) => {
			const matchesStatus =
				statusFilter === "all" ||
				company.status.toLowerCase() === statusFilter.toLowerCase();

			return matchesStatus;
		});
	}, [companies, statusFilter]);

	const tier1Count = companies.filter((c) => c.tier === "Tier 1").length;
	const sectors = [...new Set(companies.map((c) => c.sector))];

	const handleOpeningClick = (opening, companyName) => {
        setSelectedOpening(opening);
        setActiveCompanyName(companyName);
    };

	return (
		<div className="relative pb-24 lg:pb-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
			{/* Navigation Header */}
			<div className="flex items-center justify-between pb-4">
				<button
					onClick={onBack}
					className="inline-flex items-center gap-2.5 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 font-bold transition-all group rounded-full"
				>
					<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-violet-200 dark:group-hover:border-violet-800 group-hover:shadow-sm transition-all">
						<ArrowLeft className="size-4" />
					</div>
					<span className="text-xs uppercase tracking-widest">
						Return
					</span>
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<div className="lg:col-span-3 space-y-8">
					{/* Header Stats Overview */}
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 md:p-6 flex flex-col md:flex-row items-center md:justify-between">
						<div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
							<div className="size-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/10 text-violet-600 dark:text-violet-400 shadow-inner">
								<BriefcaseBusiness className="size-10" />
							</div>
							<div className="flex flex-col items-center md:items-start text-center md:text-left">
								<h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
									Recruiting Companies
								</h3>
								<span className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2">
									Department Overview
								</span>
							</div>
						</div>
						<div className="flex flex-col items-center md:items-end gap-1 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700">
							<span className="text-3xl font-black text-violet-600 dark:text-violet-400">
								{companies.length}
							</span>
							<span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
								Total Partners
							</span>
						</div>
					</div>

					<div className="lg:hidden">
						<CompanyDetailsSidebar
							companies={companies}
							tier1Count={tier1Count}
							sectors={sectors}
						/>
					</div>

					{/* Records Section */}
					<div className="space-y-4">
						<div className="flex items-center justify-between gap-4 mb-4 px-1">
							<div className="flex items-center gap-3.5 md:gap-4">
								<span className="text-violet-500 scale-110">
									<PieChart className="size-4 text-violet-500" />
								</span>
								<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
									Company Records
								</h4>
							</div>

							{/* Status Filter */}
							<div className="flex items-center gap-2">
								<label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
									Status:
								</label>
								<select
									value={statusFilter}
									onChange={(e) =>
										setStatusFilter(e.target.value)
									}
									className="text-xs font-bold bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
								>
									<option value="all">All Status</option>
									<option value="active">Active</option>
									<option value="inactive">Inactive</option>
								</select>
							</div>
						</div>

						{/* Record Cards */}
						<div className="grid grid-cols-1 gap-4">
							{filteredCompanies.length > 0 ? (
								filteredCompanies.map((company) => (
									<CompanyRecordCard
										key={company.companyId || company.name}
										company={company}
										onOpeningClick={(opening) => handleOpeningClick(opening, company.name)}
									/>
								))
							) : (
								<div className="text-center py-16 bg-gray-50/50 dark:bg-gray-800/20 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-500 text-sm italic">
									No companies match your current filters.
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Desktop Sidebar */}
				<aside className="space-y-6 hidden lg:block lg:sticky lg:top-8 h-fit">
					<CompanyDetailsSidebar
						companies={companies}
						tier1Count={tier1Count}
						sectors={sectors}
					/>
				</aside>
			</div>

			<JobOpeningModal 
                isOpen={!!selectedOpening}
                onClose={() => setSelectedOpening(null)}
                opening={selectedOpening}
                companyName={activeCompanyName}
            />
		</div>
	);
};

export default CompanyDetailsView;
