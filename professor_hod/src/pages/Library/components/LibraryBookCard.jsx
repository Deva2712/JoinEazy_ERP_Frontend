// src/pages/Library/components/LibraryBookCard.jsx

import React from "react";
import { Tag, Hash, CalendarClock, AlertCircle, Hourglass } from "lucide-react";

/**
 * MetadataTag component
 * Renders a small, colored pill/tag used to display categories or labels.
 */
const MetadataTag = ({ icon: Icon, label, variant = "gray" }) => {
	const variants = {
		gray: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
		blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50",
	};
	return (
		<span
			className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${variants[variant]}`}
		>
			{Icon && <Icon className="size-3" />}
			{label}
		</span>
	);
};

/**
 * LibraryBookCard Component
 * Unified card component to display book information, availability, and borrowing status.
 * Handles different UI states: 'available', 'borrowed' (includes progress),
 * 'awaiting_pickup', and 'overdue'.
 */
const LibraryBookCard = ({ book, status, onAction }) => {
	const isOverdue =
		status === "borrowed" && new Date() > new Date(book.dueDate);
	const isAwaitingPickup =
		status === "borrowed" && !book.physicalCopyPickedUp;

	const formatDate = (dateStr) =>
		new Date(dateStr).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	// Calculate the duration from borrowed to due date as a percentage
	const calculateProgress = () => {
		const start = new Date(book.borrowedDate).getTime();
		const end = new Date(book.dueDate).getTime();
		const now = new Date().getTime();

		if (isOverdue || now >= end) return 100;
		if (now <= start) return 0;

		const total = end - start;
		const elapsed = now - start;
		return Math.round((elapsed / total) * 100);
	};

	return (
		<div className="bg-white dark:bg-[#1a1d26] rounded-2xl p-6 border border-gray-200/60 dark:border-gray-800 hover:shadow-2xl hover:shadow-gray-500/5 hover:-translate-y-1 transition-all flex flex-col gap-4">
			{/* Header Section: Displays Category tag and ISBN */}
			<div className="flex justify-between items-center gap-2">
				<MetadataTag icon={Tag} label={book.category || "General"} />
				<div className="flex items-center gap-1 text-gray-400 text-[10px] font-medium">
					<Hash className="size-3" />
					<span>{book.isbn}</span>
				</div>
			</div>

			{/* Info Section: Displays Book Title and Author name */}
			<div>
				<h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
					{book.title || book.bookTitle}
				</h3>
				<p className="text-sm text-gray-500 dark:text-gray-400 truncate">
					by {book.author}
				</p>
			</div>

			{/* Status/Progress Section: Displays availability counter or borrowed progress bar */}
			<div className="space-y-3">
				{status === "available" ? (
					<div
						className={`w-full text-center px-4 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border ${book.availableCopies > 0 ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50" : "bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50"}`}
					>
						{book.availableCopies > 0
							? `${book.availableCopies} Available`
							: "Out of Stock"}
					</div>
				) : (
					<div className="space-y-1">
						<div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
							<span>{formatDate(book.borrowedDate)}</span>
							<span
								className={
									isOverdue
										? "text-red-500"
										: "text-gray-900 dark:text-white"
								}
							>
								{formatDate(book.dueDate)}
							</span>
						</div>
						<div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
							<div
								className={`h-full ${isOverdue ? "bg-red-500" : isAwaitingPickup ? "bg-amber-500" : "bg-green-500"}`}
								style={{ width: `${calculateProgress()}%` }}
							/>
						</div>
					</div>
				)}

				{/* Action Section: Renders appropriate buttons based on the book status */}
				{status === "available" ? (
					<button
						onClick={() => onAction(book)}
						disabled={book.availableCopies === 0}
						className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${book.availableCopies === 0 ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
					>
						{book.availableCopies === 0
							? "Unavailable"
							: "Request to Borrow"}
					</button>
				) : isAwaitingPickup ? (
					<div className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50">
						<Hourglass className="size-4" /> Awaiting Pickup
					</div>
				) : isOverdue ? (
					<div className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700/50">
						<AlertCircle className="size-4" /> Overdue
					</div>
				) : (
					<button
						onClick={() => onAction(book)}
						className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gray-900 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900"
					>
						<CalendarClock className="size-4" /> Extend Duration
					</button>
				)}
			</div>
		</div>
	);
};

export default LibraryBookCard;
