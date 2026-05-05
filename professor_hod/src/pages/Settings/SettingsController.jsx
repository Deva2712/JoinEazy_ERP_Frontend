import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../../api/services/user.service";
import { changePassword, logoutUser } from "../../services/auth";
import SettingsUI from "./SettingsUI";

const SettingsController = () => {
	const { view } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [profileImageUrl, setProfileImageUrl] = useState(
		"https://via.placeholder.com/150",
	);
	const [profileData, setProfileData] = useState({
		fullName: "",
		dateOfBirth: "",
		gender: "",
		employeeId: "",
		department: "",
		designation: "",
		officeLocation: "",
		permanentAddress: "",
		currentAddress: "",
		city: "",
		state: "",
		pinCode: "",
		country: "",
		mobileNumber: "",
		alternateNumber: "",
		officialEmail: "",
		personalEmail: "",
		linkedinProfile: "",
		panNumber: "",
		aadhaarNumber: "",
		documents: [],
	});

	const [additionalLinks] = useState([
		{ id: "privacy-policy", label: "Privacy Policy", path: "/privacy" },
		{
			id: "terms-conditions",
			label: "Terms and Conditions",
			path: "/terms",
		},
		{ id: "about-us", label: "About Us", path: "/about" },
		{
			id: "feedback",
			label: "Feedback / Feature Request",
			path: "/feedback",
		},
	]);

	const currentView = view || "list";
	const setCurrentView = (newView) => {
        if (newView === "list") navigate("/settings");
        else navigate(`/settings/${newView}`);
    };

	useEffect(() => {
		fetchUserData();
		document.title = "Settings";
	}, []);

	const fetchUserData = async () => {
		try {
			setLoading(true);
			const response = await userService.getDashboardOverview();
			if (response.success && response.data) {
				const userData = response.data.user || response.data;
				setProfileData((prev) => ({ ...prev, ...userData }));
				if (userData.profile_pic) {
					setProfileImageUrl(
						userData.profile_pic.startsWith("http")
							? userData.profile_pic
							: `http://192.168.31.50:8000/uploads/${userData.profile_pic}`,
					);
				}
			} else {
				setError("Failed to load user data.");
			}
		} catch (err) {
			setError("A connection error occurred.");
		} finally {
			setLoading(false);
		}
	};

	const handleLogoutClick = async () => {
		try {
			await logoutUser();
			localStorage.clear();
			sessionStorage.clear();
			navigate("/login");
		} catch (error) {
			console.error("Error during logout:", error);
			navigate("/login");
		}
	};

	const handleImageUpload = async (file) => {
		if (file && file.type.startsWith("image/")) {
			setProfileImageUrl(URL.createObjectURL(file));
			setProfileData((prev) => ({ ...prev, profilePic: file }));
			return await handleProfileSave();
		}
		return { success: false, message: "Invalid image file" };
	};

	const handleProfileSave = async () => {
		setLoading(true);
		try {
			const response = await userService.updateUserSettings(profileData);
			return response.success
				? "Profile updated successfully"
				: response.error || "Failed";
		} catch (err) {
			return "Failed to update profile.";
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordSave = async (current, newPass, confirm) => {
		if (newPass !== confirm) return "Passwords do not match";
		if (newPass.length < 7)
			return "Password must be at least 7 characters long";
		try {
			const response = await changePassword(current, newPass);
			return response.success
				? "Password updated successfully!"
				: response.error;
		} catch (err) {
			return "Failed to update password.";
		}
	};

	const handleBugReportSubmit = async (bugReport) => {
		const formData = new FormData();
		formData.append("description", bugReport.description);
		bugReport.screenshots.forEach((file, index) =>
			formData.append(`screenshot_${index}`, file),
		);
		try {
			const response = await userService.submitBugReport(formData);
			return response.success
				? { success: true }
				: { success: false, message: "Submission failed" };
		} catch (err) {
			return { success: false, message: "Error submitting report" };
		}
	};

	return (
		<SettingsUI
			currentView={currentView}
			profileData={profileData}
			setProfileData={setProfileData}
			handleLogoutClick={handleLogoutClick}
			handleProfileSave={handleProfileSave}
			handlePasswordSave={handlePasswordSave}
			handleBugReportSubmit={handleBugReportSubmit}
			handleImageUpload={handleImageUpload}
			additionalLinks={additionalLinks}
			loading={loading}
			error={error}
			onRefresh={fetchUserData}
		/>
	);
};

export default SettingsController;
