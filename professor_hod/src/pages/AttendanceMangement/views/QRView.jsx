// src/components/Attendance/QRView.jsx

import React from "react";
import { Clock, ShieldAlert, Link2Off, ArrowLeft } from "lucide-react";

/**
 * Full-page QR display for classroom attendance.
 */
const QRView = ({ qrToken, timeLeft, onClose }) => {
	return (
		<div className="fixed inset-0 z-[100] bg-white dark:bg-[#0f1117] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-300">
			{/* Left Panel: Info & Controls */}
			<div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-center border-r border-gray-100 dark:border-gray-800">
				<div className="space-y-6">
					<button
						onClick={onClose}
						className="inline-flex items-center gap-2.5 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-bold transition-all group rounded-full"
					>
						<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-purple-200 dark:group-hover:border-purple-800 group-hover:shadow-sm transition-all">
							<ArrowLeft className="size-4" />
						</div>
						<span className="text-xs uppercase tracking-widest">
							Return
						</span>
					</button>

					<div>
						<h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
							Mark Your Attendance
						</h1>
						<p className="text-gray-500 dark:text-gray-400 text-lg">
							Scan the QR code to automatically mark today's
							attendance.
						</p>
					</div>

					{/* Timer Section */}
					<div
						className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-colors ${
							timeLeft < 10
								? "border-red-500 bg-red-50 dark:bg-red-900/10"
								: "border-purple-500 bg-purple-50 dark:bg-purple-900/10"
						}`}
					>
						<span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
							Time Remaining
						</span>
						<div className="flex items-center gap-3">
							<Clock
								className={`size-8 ${timeLeft < 10 ? "text-red-500 animate-bounce" : "text-purple-600"}`}
							/>
							<span
								className={`text-6xl font-mono font-black ${timeLeft < 10 ? "text-red-600" : "text-purple-700 dark:text-purple-400"}`}
							>
								{timeLeft}s
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Right Panel: Large QR Code */}
			<div className="flex-1 bg-white dark:bg-[#1a1d26] flex items-center justify-center p-8 md:p-20 relative">
				<div className="w-full h-full max-w-4xl flex items-center justify-center">
					{qrToken ? (
						<div className="relative w-full aspect-square max-h-full">
							<img
								src={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${qrToken}`}
								alt="Attendance QR"
								className={`w-full h-full object-contain transition-opacity duration-500 ${timeLeft <= 0 ? "opacity-10 grayscale" : "opacity-100"}`}
							/>
							{timeLeft <= 0 && (
								<div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl">
									<ShieldAlert className="size-32 text-red-500 mb-4" />
									<span className="text-5xl font-black text-red-600 uppercase tracking-tighter">
										Expired
									</span>
								</div>
							)}
						</div>
					) : (
						<div className="flex flex-col items-center gap-4">
							<Link2Off className="size-24 text-gray-200" />
							<p className="text-gray-400 font-bold">
								No Active Token
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default QRView;
