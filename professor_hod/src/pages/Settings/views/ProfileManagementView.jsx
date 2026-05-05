import React, { useState, useEffect } from "react";
import {
	Paperclip,
	FileText,
	User,
	Phone,
	ShieldCheck,
	ArrowLeft,
	Save,
	Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileManagementView = ({
	profileData,
	setProfileData,
	handleFileUpload,
	onSaveProfile,
	loading,
}) => {
	const navigate = useNavigate();
	const [errors, setErrors] = useState({});
	const [isSaved, setIsSaved] = useState(false);

	useEffect(() => {
		if (isSaved) {
			const timer = setTimeout(() => setIsSaved(false), 3000);
			return () => clearTimeout(timer);
		}
	}, [isSaved]);

	const stripNonNumeric = (val) => (val || "").replace(/\D/g, "");
	const formatPhoneNumber = (val) => {
		const digits = stripNonNumeric(val).slice(0, 10);
		return digits.length > 5
			? `${digits.slice(0, 5)} ${digits.slice(5)}`
			: digits;
	};
	const formatAadhaar = (val) => {
		const digits = stripNonNumeric(val).slice(0, 12);
		return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
	};

	const validate = () => {
		let newErrors = {};
		if (!profileData.fullName?.trim()) newErrors.fullName = "Required";
		if (stripNonNumeric(profileData.mobileNumber).length !== 10)
			newErrors.mobileNumber = "Enter 10-digit number";
		if (
			profileData.panNumber &&
			!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
				profileData.panNumber.toUpperCase(),
			)
		)
			newErrors.panNumber = "Invalid PAN format";
		if (stripNonNumeric(profileData.aadhaarNumber).length !== 12)
			newErrors.aadhaarNumber = "Aadhaar must be 12 digits";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = async () => {
		if (validate()) {
			await onSaveProfile();
			setIsSaved(true);
		}
	};

	const cardClass =
		"bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 md:p-8 transition-all";
	const sectionHeaderClass =
		"flex items-center gap-2 text-blue-600 mb-6 uppercase tracking-[0.2em] text-[10px] md:text-xs font-black";
	const inputClass = (field) =>
		`w-full px-4 py-3 rounded-xl border ${errors[field] ? "border-red-500" : "border-gray-300 dark:border-gray-700"} bg-white dark:bg-[#0f1117] text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm`;
	const labelClass =
		"block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase";
	const errorClass = "text-red-500 text-[10px] mt-1 font-medium";

	return (
		<div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate("/settings")}
						className="flex items-center justify-center size-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d26] hover:bg-gray-50 transition-all"
					>
						<ArrowLeft className="size-4 text-gray-600" />
					</button>
					<h1 className="text-xl font-bold text-gray-900 dark:text-white">
						Profile Management
					</h1>
				</div>
				<button
					onClick={handleSave}
					disabled={loading || isSaved}
					className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all ${isSaved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"} disabled:bg-gray-400`}
				>
					{isSaved ? <Check className="size-4" /> : <Save className="size-4" />}
					{isSaved ? "Saved!" : loading ? "Saving..." : "Save Changes"}
				</button>
			</div>

			<section className={cardClass}>
				<div className={sectionHeaderClass}>
					<User className="size-4" /> Personal Information
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label className={labelClass}>Full Name</label>
						<input className={inputClass("fullName")} value={profileData.fullName} onChange={(e) => setProfileData((p) => ({ ...p, fullName: e.target.value }))} />
						{errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
					</div>
					<div>
						<label className={labelClass}>Date of Birth</label>
						<input className={inputClass("dateOfBirth")} type="date" value={profileData.dateOfBirth} onChange={(e) => setProfileData((p) => ({ ...p, dateOfBirth: e.target.value }))} />
					</div>
					<div>
						<label className={labelClass}>Gender</label>
						<select className={inputClass("gender")} value={profileData.gender} onChange={(e) => setProfileData((p) => ({ ...p, gender: e.target.value }))}>
							<option value="">Select gender</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="other">Other</option>
						</select>
					</div>
					<div>
						<label className={labelClass}>Employee ID</label>
						<input className={inputClass("employeeId")} value={profileData.employeeId} onChange={(e) => setProfileData((p) => ({ ...p, employeeId: e.target.value }))} />
					</div>
					<div>
						<label className={labelClass}>Department</label>
						<input className={inputClass("department")} value={profileData.department} onChange={(e) => setProfileData((p) => ({ ...p, department: e.target.value }))} />
					</div>
					<div>
						<label className={labelClass}>Designation</label>
						<input className={inputClass("designation")} value={profileData.designation} onChange={(e) => setProfileData((p) => ({ ...p, designation: e.target.value }))} />
					</div>
					<div className="md:col-span-2">
						<label className={labelClass}>Office Location</label>
						<input className={inputClass("officeLocation")} value={profileData.officeLocation} onChange={(e) => setProfileData((p) => ({ ...p, officeLocation: e.target.value }))} />
					</div>
				</div>
			</section>

			<section className={cardClass}>
				<div className={sectionHeaderClass}>
					<Phone className="size-4" /> Contact Information
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label className={labelClass}>Mobile Number</label>
						<input className={inputClass("mobileNumber")} value={formatPhoneNumber(profileData.mobileNumber)} onChange={(e) => setProfileData((p) => ({ ...p, mobileNumber: stripNonNumeric(e.target.value) }))} />
						{errors.mobileNumber && <p className={errorClass}>{errors.mobileNumber}</p>}
					</div>
					<div>
						<label className={labelClass}>Alternate Number</label>
						<input className={inputClass("alternateNumber")} value={formatPhoneNumber(profileData.alternateNumber)} onChange={(e) => setProfileData((p) => ({ ...p, alternateNumber: stripNonNumeric(e.target.value) }))} />
					</div>
					<div>
						<label className={labelClass}>Official Email</label>
						<input className={inputClass("officialEmail")} type="email" value={profileData.officialEmail} onChange={(e) => setProfileData((p) => ({ ...p, officialEmail: e.target.value }))} />
					</div>
					<div>
						<label className={labelClass}>Personal Email</label>
						<input className={inputClass("personalEmail")} type="email" value={profileData.personalEmail} onChange={(e) => setProfileData((p) => ({ ...p, personalEmail: e.target.value }))} />
					</div>
				</div>
			</section>

			<section className={cardClass}>
				<div className={sectionHeaderClass}>
					<ShieldCheck className="size-4" /> Identity & Documents
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label className={labelClass}>LinkedIn Profile</label>
						<input className={inputClass("linkedinProfile")} type="url" value={profileData.linkedinProfile} onChange={(e) => setProfileData((p) => ({ ...p, linkedinProfile: e.target.value }))} />
					</div>
					<div>
						<label className={labelClass}>PAN Number</label>
						<input className={inputClass("panNumber")} value={profileData.panNumber} onChange={(e) => setProfileData((p) => ({ ...p, panNumber: e.target.value.toUpperCase() }))} maxLength={10} />
						{errors.panNumber && <p className={errorClass}>{errors.panNumber}</p>}
					</div>
					<div className="md:col-span-2">
						<label className={labelClass}>Aadhaar Number</label>
						<input className={inputClass("aadhaarNumber")} value={formatAadhaar(profileData.aadhaarNumber)} onChange={(e) => setProfileData((p) => ({ ...p, aadhaarNumber: stripNonNumeric(e.target.value) }))} maxLength={14} />
						{errors.aadhaarNumber && <p className={errorClass}>{errors.aadhaarNumber}</p>}
					</div>
					<div className="md:col-span-2">
						<label className={labelClass}>Supporting Documents</label>
						<label className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-blue-400 transition-all gap-2 bg-gray-50 dark:bg-[#0f1117]">
							<Paperclip className="w-6 h-6 text-blue-600" />
							<span className="text-sm font-bold text-gray-600 dark:text-gray-400">
								{profileData.documents.length > 0 ? `${profileData.documents.length} file(s) attached` : "Click to upload documents"}
							</span>
							<input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, "documents")} className="hidden" />
						</label>
						{profileData.documents.length > 0 && (
							<div className="mt-4 space-y-2">
								{profileData.documents.map((doc, i) => (
									<div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#0f1117] px-4 py-3 rounded-xl">
										<FileText className="w-4 h-4" />
										<span className="flex-1 truncate">{doc.name}</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

export default ProfileManagementView;