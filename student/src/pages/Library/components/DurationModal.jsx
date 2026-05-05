import React, { useState } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";

const DurationModal = ({ isOpen, onClose, onConfirm, title }) => {
	// Expanded duration options
	const [days, setDays] = useState(15);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
				{/* Header matching AssetRequestModal */}
				<div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30">
							<Calendar className="size-5" />
						</div>
						<h3 className="text-lg font-bold text-gray-900 dark:text-white">
							{title}
						</h3>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
					>
						<X className="size-5 text-gray-500" />
					</button>
				</div>

				{/* Body */}
				<div className="p-6 space-y-2">
					<label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
						Select Duration
					</label>
					<div className="relative group">
						<select
							value={days}
							onChange={(e) => setDays(Number(e.target.value))}
							className="w-full h-11 pl-4 pr-11 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all appearance-none cursor-pointer"
						>
							<option value={7}>7 Days</option>
							<option value={15}>15 Days</option>
							<option value={30}>30 Days</option>
							<option value={60}>60 Days</option>
							<option value={90}>90 Days</option>
						</select>
						<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
					</div>
				</div>

				{/* Footer matching AssetRequestModal */}
				<div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-gray-800/50">
					<button
						onClick={onClose}
						className="flex-1 h-12 font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={() => {
							onConfirm(days);
							onClose();
						}}
						className="flex-1 h-12 font-bold text-white bg-green-600 rounded-xl shadow-lg hover:bg-green-700 transition-all active:scale-[0.98]"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};

export default DurationModal;
