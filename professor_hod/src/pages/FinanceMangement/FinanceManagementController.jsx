// src/pages/FinanceMangement/FinanceManagementController.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { financeService } from "../../api/services/finance.service";
import { useJobs } from "../../context/JobTrayContext";
import { useNotifications } from "../../context/NotificationContext";
import FinanceManagementUI from "./FinanceManagementUI";

const FinanceManagementController = () => {
	const { tab } = useParams();
	const navigate = useNavigate();

	const [expenses, setExpenses] = useState([]);
	const [advances, setAdvances] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { refreshJobs } = useJobs();
	const { refreshNotifications } = useNotifications();

	const [filters, setFilters] = useState({
		search: "",
		year: "all",
		month: "",
		type: "all",
	});

	const activeTab = tab || "expenses";

	useEffect(() => {
		fetchData();
		document.title = "Finance Management";
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			/**
			 * Fetches combined finance data from the unified endpoint.
			 */
			const [expRes, advRes] = await Promise.all([
				financeService.getRecords("expenses"),
				financeService.getRecords("advances"),
			]);

			if (expRes.success) {
				setExpenses(expRes.data.expenses || []);
				// Set admins from the unified mock structure
				if (expRes.data.admins) setAdmins(expRes.data.admins);
			}

			if (advRes.success) {
				setAdvances(advRes.data.advances || []);
			}
		} catch (err) {
			setError("Unable to sync financial records. Please try again later.");
			console.error("Fetch error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateRequest = async (formData) => {
		const isUpdate = !!formData.id;
		const typeKey = formData.type?.toLowerCase().includes("advance") ? "advances" : "expenses";

		try {
			setLoading(true);
			
			// Map field for backend consistency
			const payload = {
				...formData,
				[typeKey === "advances" ? "amount_requested" : "amount_spent"]: formData.amount
			};

			const response = isUpdate 
				? await financeService.updateRecord(typeKey, formData.id, payload)
				: await financeService.createRecord(typeKey, payload);

			if (response.success) {
				await Promise.all([refreshJobs(), refreshNotifications(), fetchData()]);
			}
		} catch (err) {
			console.error("Submission error:", err);
			fetchData(); 
		} finally {
			setLoading(false);
		}
	};

	const handleTabChange = (newTab) => {
		navigate(`/finance-management/${newTab}`);
	};

	const filterByStatus = (items, isHistory) => {
		return items.filter((item) => {
			const isPendingOrResubmitted = item.status === "Pending" || item.status === "Resubmitted";
			const isRejected = item.status === "Rejected";
			const needsAction = isPendingOrResubmitted || (isRejected && !item.isArchived);

			return isHistory ? !needsAction : needsAction;
		});
	};

	const filteredHistory = useMemo(() => {
		let results =
			filters.type === "all"
				? [...expenses, ...advances]
				: filters.type === "expenses"
					? [...expenses]
					: [...advances];

		if (filters.search) {
			const query = filters.search.toLowerCase().trim();
			results = results.filter(
				(item) =>
					item.title?.toLowerCase().includes(query) ||
					item.category?.toLowerCase().includes(query) ||
					item.description?.toLowerCase().includes(query),
			);
		}

		return results.filter((item) => {
			const date = new Date(item.createdAt || item.date);
			const itemYear = date.getFullYear().toString();
			const itemMonth = date.toLocaleString("default", { month: "long" });

			return (filters.year === "all" || itemYear === filters.year) &&
				   (filters.month === "" || itemMonth === filters.month);
		});
	}, [expenses, advances, filters]);

	return (
		<FinanceManagementUI
			expenses={filterByStatus(expenses, activeTab === "history")}
			advances={filterByStatus(advances, activeTab === "history")}
			filteredHistory={filteredHistory}
			admins={admins}
			loading={loading}
			error={error}
			activeTab={activeTab}
			onTabChange={handleTabChange}
			onRefresh={fetchData}
			onSubmit={handleCreateRequest}
			allExpenses={expenses}
			allAdvances={advances}
			filters={filters}
			setFilters={setFilters}
		/>
	);
};

export default FinanceManagementController;