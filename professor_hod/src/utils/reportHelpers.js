// src/utils/reportHelpers.js

/**
 * Utility to handle PDF generation for department audits (DepartmentOverview).
 */
export const downloadAuditReport = async (data) => {
	if (!data) return;

	try {
		// Dynamic import to keep the initial bundle small
		const { jsPDF } = await import("jspdf");
		const { default: autoTable } = await import("jspdf-autotable");

		const doc = new jsPDF();
		const primaryColor = [76, 29, 149];
		const secondaryColor = [31, 41, 55];

		doc.setFillColor(...primaryColor);
		doc.rect(0, 0, 210, 40, "F");

		doc.setFontSize(22);
		doc.setTextColor(255, 255, 255);
		doc.setFont("helvetica", "bold");
		doc.text("DEPARTMENT AUDIT REPORT", 14, 22);

		doc.setFontSize(10);
		doc.setFont("helvetica", "normal");
		doc.text(
			`${data.deptName || "Academic"} Department | AY ${
				data.academicYear || "Not Available"
			}`,
			14,
			30,
		);

		doc.setTextColor(255, 255, 255);
		doc.text(`Generated: ${new Date().toLocaleString()}`, 140, 30);

		doc.setTextColor(...secondaryColor);
		doc.setFontSize(14);
		doc.text("Executive Summary", 14, 50);

		autoTable(doc, {
			startY: 55,
			head: [["Metric", "Value", "Context"]],
			body: [
				[
					"Total Enrollment",
					data.summaryStats?.totalStudents?.count || 0,
					`${
						data.summaryStats?.totalStudents?.trend || 0
					}% vs last year`,
				],
				[
					"Faculty Strength",
					data.summaryStats?.totalFaculty || 0,
					"Full-time equivalent",
				],
				[
					"Active Courses",
					data.summaryStats?.totalCourses || 0,
					"Current Semester",
				],
			],
			headStyles: { fillColor: primaryColor },
			theme: "striped",
		});

		doc.text("Placement Analytics", 14, doc.lastAutoTable.finalY + 15);

		autoTable(doc, {
			startY: doc.lastAutoTable.finalY + 20,
			head: [["Placement Metric", "Data Point"]],
			body: [
				[
					"Placement Rate",
					`${data.placementStats?.placedPercentage || 0}%`,
				],
				[
					"Total Placed",
					`${data.placementStats?.placedCount || 0} of ${
						data.placementStats?.eligibleStudents || 0
					} eligible`,
				],
				[
					"Average Package",
					`INR ${data.placementStats?.averagePackageLpa || 0} LPA`,
				],
				[
					"Highest Package",
					`INR ${data.placementStats?.highestPackageLpa || 0} LPA`,
				],
			],
			headStyles: { fillColor: [124, 58, 237] },
			columnStyles: { 0: { fontStyle: "bold", width: 60 } },
		});

		doc.text("Research & Innovation", 14, doc.lastAutoTable.finalY + 15);

		autoTable(doc, {
			startY: doc.lastAutoTable.finalY + 20,
			head: [["Research Category", "Metric"]],
			body: [
				[
					"Total Funding",
					`INR ${data.researchOutput?.totalValueRupee || "0"}`,
				],
				["Active Grants", data.researchOutput?.totalActiveGrants || 0],
				[
					"Publications (YTD)",
					data.researchOutput?.publicationsThisYear || 0,
				],
				["Total Citations", data.researchOutput?.citationsTotal || 0],
				[
					"Pending Proposals",
					data.researchOutput?.pendingProposals || 0,
				],
			],
			headStyles: { fillColor: [5, 150, 105] },
		});

		doc.addPage();
		doc.text("Cohort Distribution", 14, 20);

		const cohortRows =
			data.studentDemographics?.map((d) => [
				`${d.year} Year`,
				d.count,
				`M: ${d.genderRatio.m} / F: ${d.genderRatio.f}`,
			]) || [];

		autoTable(doc, {
			startY: 25,
			head: [
				["Academic Year", "Student Count", "Gender Distribution (M/F)"],
			],
			body: cohortRows,
			headStyles: { fillColor: secondaryColor },
		});

		const pageCount = doc.internal.getNumberOfPages();
		for (let i = 1; i <= pageCount; i++) {
			doc.setPage(i);
			doc.setFontSize(8);
			doc.setTextColor(150);
			doc.text(
				`Confidential - ${data.deptName} Internal Audit - Page ${i} of ${pageCount}`,
				14,
				285,
			);
		}

		doc.save(
			`${data.deptName}_Department_Audit_${new Date().toLocaleDateString("en-US", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit"
			})}.pdf`,
		);
	} catch (err) {
		console.error("PDF Generation failed", err);
	}
};

/**
 * Utility to handle PDF generation for employee payslips (Payroll).
 */
export const downloadPayslip = async (item, breakdown) => {
    if (!item || !breakdown) return;

    try {
        const { jsPDF } = await import("jspdf");
        const { default: autoTable } = await import("jspdf-autotable");

        const doc = new jsPDF();
        const primaryColor = [37, 99, 235]; // Blue-600
        const secondaryColor = [31, 41, 55]; // Gray-800

        // --- Header Section ---
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 40, "F");

        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("SALARY PAYSLIP", 14, 22);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(
            `Statement for ${item.month} ${item.year || ""}`,
            14,
            30,
        );

        doc.setTextColor(255, 255, 255);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 140, 30);

        // --- Employee Information Summary ---
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(14);
        doc.text("Earnings Breakdown", 14, 50);

        autoTable(doc, {
            startY: 55,
            head: [["Earnings Description", "Amount (INR)"]],
            body: Object.entries(breakdown.earnings).map(([key, value]) => [
                key.replace(/([A-Z])/g, " $1").toUpperCase(),
                value.toLocaleString(),
            ]),
            headStyles: { fillColor: primaryColor },
            theme: "striped",
        });

        doc.text("Deductions & Tax", 14, doc.lastAutoTable.finalY + 15);

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: [["Deduction Description", "Amount (INR)"]],
            body: Object.entries(breakdown.deductions).map(([key, value]) => [
                key.replace(/([A-Z])/g, " $1").toUpperCase(),
                value.toLocaleString(),
            ]),
            headStyles: { fillColor: [220, 38, 38] }, // Red-600
            columnStyles: { 0: { fontStyle: "bold" } },
        });

        // --- Final Net Pay Summary ---
        const finalY = doc.lastAutoTable.finalY + 15;
        doc.setFillColor(243, 244, 246);
        doc.rect(14, finalY, 182, 25, "F");

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primaryColor);
        doc.text("NET TAKE-HOME", 24, finalY + 16);
        doc.text(
            `INR ${breakdown.netPay.toLocaleString()}`, 
            140, 
            finalY + 16
        );

        // --- Footer with Page Numbering ---
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Confidential - Payroll Department - Page ${i} of ${pageCount}`,
                14,
                285,
            );
        }

        doc.save(`Payslip_${item.month.replace(" ", "_")}_${item.year}.pdf`);
    } catch (err) {
        console.error("Payroll PDF Generation failed", err);
    }
};

/**
 * Utility to handle PDF generation for student mentoring reports (Mentoring).
 */
export const downloadMentoringReport = async (mentee) => {
	if (!mentee) return;
	
	try {
		const { jsPDF } = await import("jspdf");
		const { default: autoTable } = await import("jspdf-autotable");

		const doc = new jsPDF();
		const sky700 = [3, 105, 161];
		const indigo600 = [79, 70, 229];

		// --- Header Section ---
		doc.setFontSize(22);
		doc.setTextColor(...sky700);
		doc.text("Comprehensive Mentoring Report", 14, 20);

		doc.setFontSize(10);
		doc.setTextColor(100);
		doc.text(`Report ID: RPT-${mentee.studentId}-${Date.now()}`, 14, 26);
		doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 31);

		// --- Student Profile Table ---
		autoTable(doc, {
			startY: 40,
			head: [["Student Profile", "Information"]],
			body: [
				["Full Name", mentee.name],
				["Student ID", mentee.studentId],
				["Email", mentee.emailId || "N/A"],
				["Department", mentee.department],
				["Current Semester", mentee.semester],
			],
			headStyles: { fillColor: sky700 },
		});

		// --- Academic Metrics Table ---
		autoTable(doc, {
			startY: doc.lastAutoTable.finalY + 10,
			head: [["Metric", "Value", "Status/Details"]],
			body: [
				[
					"CGPA",
					mentee.academicMetrics?.cgpa || "N/A",
					mentee.academicMetrics?.performanceTrend || "N/A",
				],
				[
					"Overall Attendance",
					`${mentee.academicMetrics?.attendance || 0}%`,
					"Total Presence",
				],
				[
					"Active Backlogs",
					mentee.academicMetrics?.backlogs || 0,
					mentee.academicMetrics?.backlogHistory
						?.map((b) => b.name)
						.join(", ") || "None",
				],
				[
					"Risk Status",
					mentee.riskLevel,
					(mentee.riskFlags || []).join(" | ") || "No Flags",
				],
			],
			headStyles: { fillColor: indigo600 },
		});

		doc.save(`Mentoring_Detailed_Report_${mentee.studentId}.pdf`);
	} catch (err) {
		console.error("Mentoring PDF Generation failed", err);
	}
};

/**
 * Utility to handle CSV generation for cohort attendance reports (CohortAttendance).
 */
export const exportAttendanceCSV = (reportData, dateRange, selectedSection) => {
	if (!reportData || !dateRange) return;

	const allDates = [...dateRange].reverse();
	
	// --- Header Row ---
	const headers = [
		"Roll Number",
		"Name",
		"Section",
		...allDates,
		"Total Present",
		"Percentage",
	].join(",");

	// --- Data Rows ---
	const rows = reportData
		.filter((s) => selectedSection === "All" || s.section === selectedSection)
		.map((s) => {
			const dailyRow = allDates.map((date) => {
				if (s.dailyStatus[date] === true) return "P";
				if (s.dailyStatus[date] === false) return "A";
				return "-";
			});
			
			return [
				s.rollNumber,
				s.name,
				s.section,
				...dailyRow,
				s.daysPresent,
				`${s.percentage}%`,
			].join(",");
		});

	const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
	
	// --- Trigger Download ---
	const link = document.createElement("a");
	link.setAttribute("href", encodeURI(csvContent));
	link.setAttribute("download", `Attendance_Report_${selectedSection}.csv`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
