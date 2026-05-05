// src/pages/Payroll/PayrollController.jsx

import React, { useState, useEffect, useMemo } from "react";
import PayrollUI from "./PayrollUI";
import { payrollService } from "../../api/services/payroll.service";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Controller component for managing payroll data.
 * Updated to ensure history tab starts empty until a month is selected.
 */
const PayrollController = () => {
	const [history, setHistory] = useState([]);
	const [breakdown, setBreakdown] = useState(null);
	const [latestBreakdown, setLatestBreakdown] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [selectedYear, setSelectedYear] = useState(
		new Date().getFullYear().toString(),
	);
	const [selectedMonth, setSelectedMonth] = useState("");
	const [isHistorical, setIsHistorical] = useState(false);

	useEffect(() => {
		fetchInitialData();
		document.title = "Payroll & Salary";
	}, []);

	const fetchInitialData = async () => {
		try {
			setLoading(true);
			setError(null);

			const [historyRes, breakdownRes] = await Promise.all([
				payrollService.getHistory(),
				payrollService.getBreakdown(),
			]);

			if (historyRes.success && breakdownRes.success) {
				setHistory(historyRes.data);
				setBreakdown(breakdownRes.data);
				setLatestBreakdown(breakdownRes.data);
			} else {
				setError("Failed to load payroll data.");
			}
		} catch (err) {
			setError("A connection error occurred while fetching payroll.");
			console.error("Payroll fetch error:", err);
		} finally {
			setLoading(false);
		}
	};

	const availableYears = useMemo(() => {
		const years = history.map((item) => item.month.split(" ").pop());
		return [...new Set(years)].sort((a, b) => b - a);
	}, [history]);

	const filteredMonths = useMemo(() => {
		return history.filter((item) => item.month.includes(selectedYear));
	}, [history, selectedYear]);

	const handleDownloadActive = async () => {
		if (!isHistorical || !breakdown || !selectedMonth) return;

		const item = history.find((h) => h.month === selectedMonth);
		if (!item) return;

		try {
			const doc = new jsPDF();
			const primaryColor = [31, 41, 55]; // Gray-800
			const accentColor = [3, 105, 161]; // Sky-700

			/**
			 * Header & Branding section
			 */
			doc.setFontSize(24);
			doc.setTextColor(...accentColor);
			doc.text("PAYSLIP", 14, 25);

			doc.setFontSize(10);
			doc.setTextColor(100);
			doc.text("Official Salary Statement", 14, 32);

			doc.setFontSize(12);
			doc.setTextColor(...primaryColor);
			doc.text(`Period: ${item.month}`, 140, 25);
			doc.text(`Status: PAID`, 140, 32);

			/**
			 * Attendance Summary Table
			 */
			autoTable(doc, {
				startY: 45,
				head: [["Attendance Summary", "Days"]],
				body: [
					["Days Present", breakdown.attendance?.present || 0],
					["Days Absent (Unpaid)", breakdown.attendance?.absent || 0],
				],
				headStyles: { fillColor: primaryColor },
				theme: "striped",
			});

			/**
			 * Earnings Table section
			 */
			const earningsBody = [
				["Basic Pay", `INR ${breakdown.basic?.toLocaleString()}`],
				["HRA", `INR ${breakdown.hra?.toLocaleString()}`],
				["Bonuses", `INR ${breakdown.bonuses?.toLocaleString()}`],
				["Allowances", `INR ${breakdown.allowances?.toLocaleString()}`],
			];

			autoTable(doc, {
				startY: doc.lastAutoTable.finalY + 10,
				head: [["Earnings", "Amount"]],
				body: earningsBody,
				headStyles: { fillColor: accentColor },
				columnStyles: { 1: { halign: "right" } },
			});

			/**
			 * Deductions Table section
			 */
			const deductionLabels = {
				tax: "Income Tax (TDS)",
				pf: "Provident Fund (EPF)",
				insurance: "Health Insurance",
				absence: "Absence Salary Cut",
			};

			const deductionsBody = Object.entries(breakdown.deductions || {})
				.filter(([_, val]) => val > 0)
				.map(([key, val]) => [
					deductionLabels[key] || key.toUpperCase(),
					`- INR ${val.toLocaleString()}`,
				]);

			autoTable(doc, {
				startY: doc.lastAutoTable.finalY + 10,
				head: [["Deductions", "Amount"]],
				body:
					deductionsBody.length > 0
						? deductionsBody
						: [["No Deductions", "INR 0"]],
				headStyles: { fillColor: [153, 27, 27] }, // Red-800
				columnStyles: { 1: { halign: "right" } },
			});

			/**
			 * Net Pay Summary section
			 */
			const finalY = doc.lastAutoTable.finalY + 15;
			doc.setFillColor(243, 244, 246);
			doc.rect(14, finalY, 182, 20, "F");

			doc.setFontSize(16);
			doc.setFont("helvetica", "bold");
			doc.setTextColor(...primaryColor);
			doc.text("NET TAKE-HOME", 20, finalY + 13);
			doc.text(
				`INR ${breakdown.netPay.toLocaleString()}`,
				150,
				finalY + 13,
			);

			doc.save(`Payslip_${item.month.replace(" ", "_")}.pdf`);
		} catch (err) {
			console.error("Download failed", err);
		}
	};

	const handleYearChange = (year) => {
		setSelectedYear(year);
		setSelectedMonth("");
		setBreakdown(null);
	};

	const handleSelectMonth = (monthName) => {
		if (!monthName) {
			setIsHistorical(true);
			setBreakdown(null);
			setSelectedMonth("");
			return;
		}
		setSelectedMonth(monthName);
		const record = history.find((h) => h.month === monthName);
		if (record?.breakdown) {
			setBreakdown(record.breakdown);
			setIsHistorical(true);
		}
	};

	const handleReturnToCurrent = () => {
		setBreakdown(latestBreakdown);
		setIsHistorical(false);
		setSelectedMonth("");
	};

	const state = {
		history,
		breakdown,
		loading,
		error,
		years: availableYears,
		months: filteredMonths,
		selectedYear,
		selectedMonth,
		isHistorical,
	};

	const actions = {
		setSelectedYear: handleYearChange,
		onRefresh: fetchInitialData,
		onDownload: handleDownloadActive,
		onSelectMonth: handleSelectMonth,
		onReturnToCurrent: handleReturnToCurrent,
	};

	return <PayrollUI state={state} actions={actions} />;
};

export default PayrollController;
