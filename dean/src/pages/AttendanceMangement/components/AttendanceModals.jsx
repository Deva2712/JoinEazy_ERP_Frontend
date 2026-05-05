// src/pages/AttendanceManagement/components/AttendanceModals.jsx

import React from "react";
import { X, Settings, CheckCircle, Archive } from "lucide-react";

/**
 * Modal for draft save confirmation.
 */
export const SaveSuccessModal = ({ isOpen, onClose, deadline }) => {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
				<div className="border-b border-gray-100 dark:border-gray-700 flex items-center justify-between pb-4 mb-4">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
							<Archive className="w-5 h-5 text-purple-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Attendance Saved
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>
				<div className="space-y-4">
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
						Your attendance log is safe. You have time until <span className="font-bold">{deadline}</span> to finalize this log.
					</p>
				</div>
				<button
					onClick={onClose}
					className="w-full mt-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-lg"
				>
					Got it
				</button>
			</div>
		</div>
	);
};

/**
 * Modal for QR code configuration settings.
 */
export const QRSettingsModal = ({ isOpen, onClose, timeout, setTimeout }) => {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
				<div className="border-b border-gray-100 dark:border-gray-700 flex items-center justify-between pb-4 mb-4">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
							<Settings className="w-5 h-5 text-purple-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							QR Configuration
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>
				<div className="space-y-4">
					<div>
						<label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
							Timer Duration (seconds)
						</label>
						<div className="flex items-center gap-3">
							<input
								type="range"
								min="10"
								max="300"
								step="10"
								value={timeout}
								onChange={(e) => setTimeout(parseInt(e.target.value))}
								className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
							/>
							<span className="font-mono font-bold text-purple-600 w-12 text-right">
								{timeout}s
							</span>
						</div>
					</div>
					<p className="text-sm text-gray-500 leading-relaxed">
						Students who haven't scanned the code by the end of this duration will be automatically marked as absent.
					</p>
				</div>
				<button
					onClick={onClose}
					className="w-full mt-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-lg"
				>
					Save Settings
				</button>
			</div>
		</div>
	);
};

/**
 * Modal for final submission confirmation.
 */
export const ConfirmSubmitModal = ({ isOpen, onClose, studentCount, onConfirm }) => {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-[#1a1d26] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Submission?</h3>
					<button onClick={onClose}><X className="size-5 text-gray-400" /></button>
				</div>
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					Attendance <span className="font-bold">cannot be edited</span> after submission. Are you sure you want to proceed?
				</p>
				<div className="flex gap-3">
					<button onClick={onClose} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold">Cancel</button>
					<button onClick={onConfirm} className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700">Confirm</button>
				</div>
			</div>
		</div>
	);
};