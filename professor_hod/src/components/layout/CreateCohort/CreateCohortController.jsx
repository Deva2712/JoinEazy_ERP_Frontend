import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CreateCohortUI from "./CreateCohortUI";
import { courseService } from "../../../api/services/course.service";

const createCourseSchema = z
	.object({
		name: z.string().min(1, "Name cannot be empty"),
		startDate: z.string().min(1, "Start date is required"),
		endDate: z.string().min(1, "End date is required"),
		url: z
			.string()
			.optional()
			.refine((val) => {
				if (!val || val.trim() === "") return true;
				return z.string().url().safeParse(val).success;
			}, "Please enter a valid URL"),
	})
	.refine(
		(data) => {
			// Validate that end date is after start date
			if (data.startDate && data.endDate) {
				return new Date(data.endDate) > new Date(data.startDate);
			}
			return true;
		},
		{
			message: "End date must be after start date",
			path: ["endDate"],
		},
	);

const CreateCourseController = ({
	isOpen: propIsOpen,
	onClose: propOnClose,
}) => {
	const location = useLocation();
	const navigate = useNavigate();
	const [internalIsOpen, setInternalIsOpen] = useState(false);
	const [creationError, setCreationError] = useState(null);
	const [isCreating, setIsCreating] = useState(false);

	const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;

	// Add form initialization after isOpen declaration
	const createForm = useForm({
		resolver: zodResolver(createCourseSchema),
		defaultValues: {
			name: "",
			startDate: "",
			endDate: "",
			url: "",
		},
		mode: "onBlur",
	});

	// Handle route-based modal rendering
	useEffect(() => {
		console.log(
			"Route-based modal effect - pathname:",
			location.pathname,
			"propIsOpen:",
			propIsOpen,
		);
		if (propIsOpen === undefined && location.pathname === "/create") {
			console.log("Setting internal modal to open");
			setInternalIsOpen(true);
		}
	}, [location.pathname, propIsOpen]);

	// Prevent body scroll when modal is open on route-based usage
	useEffect(() => {
		if (propIsOpen === true) {
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = "unset";
			};
		}
	}, [propIsOpen]);

	const handleClose = () => {
		console.log(
			"handleClose called - propOnClose:",
			!!propOnClose,
			"pathname:",
			location.pathname,
		);
		if (propOnClose) {
			console.log("Calling propOnClose");
			propOnClose();
		} else {
			console.log("Setting internal modal to closed");
			setInternalIsOpen(false);
			// If we're on the /create route, go back to previous page
			if (location.pathname === "/create") {
				if (window.history.length > 1) {
					console.log("Navigating back");
					navigate(-1); // Go back to previous page
				} else {
					console.log("Navigating to dashboard (fallback)");
					navigate("/dashboard"); // Default fallback
				}
			} else {
				console.log("Navigating to dashboard");
				navigate("/dashboard"); // Default fallback
			}
		}
	};

	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	};

	const handleCreation = async (data) => {
		// Prevent double submission
		if (isCreating) {
			console.log(
				"Creation already in progress, ignoring duplicate submission",
			);
			return "Creation already in progress";
		}

		setCreationError(null);
		setIsCreating(true);

		try {
			// Prepare course data to match backend expectations
			const courseData = {
				cohort_name: data.name,
				cohort_description: "", // Remove description as requested
				start_date: data.startDate, // Add start date
				end_date: data.endDate, // Add end date
				external_url:
					data.url && data.url.trim() !== "" ? data.url : null,
				cohort_type: "group", // default
			};

			console.log("Creating course with data:", courseData);

			// Call the API to create the course
			const response = await courseService.createCourse(courseData);

			console.log("Course creation response:", response);

			if (response.success) {
				console.log("Course created successfully:", response.data);
				// Return null to indicate success (no error message)
				return null;
			} else {
				console.error("Course creation failed:", response.error);
				return response.error || "Failed to create course";
			}
		} catch (error) {
			console.error("Error creating course:", error);
			return "An unexpected error occurred. Please try again.";
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<CreateCohortUI
			isOpen={isOpen}
			onClose={handleClose}
			onOverlayClick={handleOverlayClick}
			createForm={createForm}
			onCreation={handleCreation}
			creationError={creationError}
			setCreationError={setCreationError}
			selectedSections={[]}
			onSectionToggle={() => {}}
			isCreating={isCreating}
		/>
	);
};

export default CreateCourseController;
