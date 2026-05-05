// src/pages/Library/LibraryUI.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import {
	Search,
	X,
	Clock,
	AlertCircle,
	BookMarked,
	ArrowLeft,
	Package,
	RefreshCw,
	Compass,
	Send,
	SlidersHorizontal,
	User,
} from "lucide-react";

import StatSummaryCard from "../../components/common/StatSummaryCard";
import AdminContactSidebar from "../../components/common/AdminContactSidebar";
import BookRequestCard from "./components/BookRequestCard";
import LibraryBookCard from "./components/LibraryBookCard";
import DurationModal from "./components/DurationModal";
import LibraryFilterSidebar from "./components/LibraryFilterSidebar";

/**
 * Configuration for the main navigation tabs.
 */
const TABS = [
	{ key: "borrowed", label: "Borrowed", icon: BookMarked },
	{ key: "browse", label: "Browse", icon: Compass },
	{ key: "my-requests", label: "Requests", icon: Send },
	{ key: "support", label: "Support", icon: User, mobileOnly: true },
];

const LibraryUI = ({
	myRequests = [],
	borrowedBooks = [],
	availableBooks = [],
	admins = [],
	loading = false,
	error = null,
	onRequestBook,
	onCancelRequest,
	onHandleExtendBorrow,
	onRefresh,
	activeTab,
	onTabChange,
	filters,
	setFilters,
	isFilterOpen,
	setIsFilterOpen,
	availableCategories,
	availableAuthors,
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [modalConfig, setModalConfig] = useState({
		isOpen: false,
		type: null,
		data: null,
	});
	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	const handleOpenModal = (data, type) => {
		setModalConfig({ isOpen: true, type, data });
	};

	/**
	 * Filter logic: Applies category, author, and availability criteria to datasets.
	 */
	const applyFilters = (data, isAvailableBook = false) => {
		return data.filter((item) => {
			const matchCategory =
				filters.category === "all" ||
				item.category === filters.category;

			const matchAuthor =
				filters.author === "all" ||
				item.author
					.split(/[&,]/)
					.map((a) => a.trim())
					.includes(filters.author);

			const matchAvailability = isAvailableBook
				? filters.availability === "all" ||
					(filters.availability === "available"
						? item.availableCopies > 0
						: item.availableCopies === 0)
				: true;

			return matchCategory && matchAuthor && matchAvailability;
		});
	};

	const filteredBorrowedBooks = borrowedBooks.filter(
		(book) =>
			book.bookTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.isbn?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const filteredMyRequests = myRequests.filter(
		(request) =>
			request.bookTitle
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			request.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			request.category
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			request.isbn?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const filteredAvailableBooks = applyFilters(availableBooks, true).filter(
		(book) =>
			book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.isbn?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const now = new Date();

	const pendingCount = myRequests.filter(
		(r) => r.status === "pending" || r.status === "extension-pending",
	).length;
	const totalBorrowed = borrowedBooks.length;
	const overdueCount = borrowedBooks.filter(
		(b) => now > new Date(b.dueDate),
	).length;

	return (
		<div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
			<HeaderController />

			<div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 dark:from-green-900 dark:via-green-950 dark:to-emrald-950 text-white">
				<div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/dashboard")}
								className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
							>
								<ArrowLeft className="size-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold tracking-tight">
									Library
								</h1>
								<p className="text-green-50 text-sm mt-0.5">
									Browse, request, and manage your borrowed
									books.
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3 pb-2 md:pb-0">
							<StatSummaryCard
								label="Borrowed"
								value={totalBorrowed.toString()}
								icon={BookMarked}
							/>
							<StatSummaryCard
								label="Overdue"
								value={overdueCount.toString()}
								icon={AlertCircle}
							/>
						</div>
					</div>

					{/* Navigation tabs for switching library views */}
					<div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
						{TABS.map((tab) => {
							const Icon = tab.icon;
							const active = activeTab === tab.key;
							const badge =
								tab.key === "my-requests" && pendingCount > 0
									? pendingCount
									: null;

							return (
								<button
									key={tab.key}
									onClick={() => onTabChange(tab.key)}
									className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap ${
										tab.mobileOnly ? "lg:hidden" : ""
									} ${
										active
											? "bg-gray-50 dark:dark:bg-[#0f1117] text-green-700 dark:text-green-400"
											: "text-white/70 hover:text-white hover:bg-white/10"
									}`}
								>
									<Icon className="w-4 h-4" />
									{tab.label}
									{badge && (
										<span
											className={`inline-flex items-center justify-center text-[10px] font-bold w-[18px] h-[18px] px-1 rounded-full ml-1.5 transition-colors ${
												active
													? "bg-green-600 text-white shadow-sm"
													: "bg-white text-green-700 shadow-sm"
											}`}
										>
											{badge}
										</span>
									)}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
				{error ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
							<AlertCircle className="size-10 text-red-600 dark:text-red-400" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
							Something went wrong
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{error}
						</p>
						<button
							onClick={onRefresh}
							className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
						>
							<RefreshCw className="size-4" />
							Try Again
						</button>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center py-20 text-gray-400">
						<RefreshCw className="size-12 animate-spin mb-4 text-green-600" />
						<p className="font-bold text-gray-900 dark:text-white">
							Loading Library Data
						</p>
						<p className="text-sm">
							Please wait while we fetch your borrowed
							books...
						</p>
					</div>
				) : (
					<>
						{/* Search bar and filtering controls */}
						{activeTab !== "support" && (
							<div className="mb-8 flex items-center gap-3">
								<div className="relative group flex-1">
									<Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
									<input
										type="text"
										placeholder="Search by title, author, or ISBN..."
										value={searchQuery}
										onChange={(e) =>
											setSearchQuery(e.target.value)
										}
										className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm outline-none focus:border-green-500 transition-all"
									/>
									{searchQuery && (
										<button
											onClick={() => setSearchQuery("")}
											className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
										>
											<X className="w-5 h-5" />
										</button>
									)}
								</div>
								{activeTab === "browse" && (
									<button
										onClick={() => setIsFilterOpen(true)}
										className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-sm transition-all hover:border-emerald-500/50 active:scale-95"
									>
										<SlidersHorizontal className="size-5 text-emerald-600" />
										<span className="hidden sm:inline text-gray-900 dark:text-white">
											Filters
										</span>
									</button>
								)}
							</div>
						)}

						{activeTab === "support" ? (
							<div className="lg:hidden max-w-md mx-auto">
								{/* Admin contact section for mobile view */}
								<AdminContactSidebar
									admins={admins}
									themeColor="green"
									isTabbedView={true}
								/>
							</div>
						) : (
							<div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
								<div className="flex-1">
									{activeTab === "borrowed" && (
										<div>
											{filteredBorrowedBooks.length ===
											0 ? (
												<div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
													<BookMarked className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
													<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
														No borrowed books
													</h3>
													<p className="text-gray-600 dark:text-gray-400">
														{searchQuery
															? "No books match your search"
															: "Books you borrow will appear here"}
													</p>
												</div>
											) : (
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
													{filteredBorrowedBooks.map(
														(book) => (
															<LibraryBookCard
																key={book.id}
																book={book}
																status="borrowed"
																onAction={(b) =>
																	handleOpenModal(
																		b,
																		"extend",
																	)
																}
															/>
														),
													)}
												</div>
											)}
										</div>
									)}

									{activeTab === "browse" && (
										<div>
											<div className="mb-8 flex items-center justify-between text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium px-2 gap-2">
												{[
													{
														step: "Browse",
														desc: "Find a book",
													},
													{
														step: "Request",
														desc: "Submit interest",
													},
													{
														step: "Approval",
														desc: "Staff reviews",
													},
													{
														step: "Collect",
														desc: "Pick up item",
													},
												].map((item, idx) => (
													<React.Fragment
														key={item.step}
													>
														<div className="flex flex-col items-center text-center">
															<span className="text-green-700 dark:text-green-400 font-extrabold uppercase tracking-widest whitespace-nowrap">
																{item.step}
															</span>
															<span className="hidden md:block text-xs text-gray-400">
																{item.desc}
															</span>
														</div>
														{idx < 3 && (
															<div className="flex-grow h-[1px] bg-gray-200 dark:bg-gray-700 mx-2" />
														)}
													</React.Fragment>
												))}
											</div>
											{filteredAvailableBooks.length ===
											0 ? (
												<div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
													<Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
													<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
														No books available
													</h3>
													<p className="text-gray-600 dark:text-gray-400">
														{searchQuery
															? "No books match your search"
															: "Check back later for available books"}
													</p>
												</div>
											) : (
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
													{filteredAvailableBooks.map(
														(book) => (
															<LibraryBookCard
																key={book.id}
																book={book}
																status="available"
																onAction={(b) =>
																	handleOpenModal(
																		b,
																		"request",
																	)
																}
															/>
														),
													)}
												</div>
											)}
										</div>
									)}

									{activeTab === "my-requests" && (
										<div className="grid grid-cols-1 gap-4">
											{filteredMyRequests.length === 0 ? (
												<div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
													<Clock className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
													<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
														No requests yet
													</h3>
													<p className="text-gray-600 dark:text-gray-400 mb-4">
														{searchQuery
															? "No requests match your search"
															: "Browse books and submit a request to get started"}
													</p>
													{!searchQuery && (
														<button
															onClick={() =>
																onTabChange(
																	"browse",
																)
															}
															className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors"
														>
															<Package className="w-4 h-4" />
															Browse Books
														</button>
													)}
												</div>
											) : (
												filteredMyRequests.map(
													(request) => (
														<BookRequestCard
															key={request.id}
															request={request}
															onCancelRequest={
																onCancelRequest
															}
														/>
													),
												)
											)}
										</div>
									)}
								</div>

								{/* Admin contact section (desktop only, requests tab only) */}
								{activeTab === "my-requests" && (
									<div className="hidden lg:block lg:w-80 flex-shrink-0">
										<AdminContactSidebar
											admins={admins}
											themeColor="green"
										/>
									</div>
								)}
							</div>
						)}
					</>
				)}
			</main>

			<LibraryFilterSidebar
				isOpen={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				filters={filters}
				setFilters={setFilters}
				availableCategories={availableCategories}
				availableAuthors={availableAuthors}
			/>

			<DurationModal
				isOpen={modalConfig.isOpen}
				title={
					modalConfig.type === "request"
						? "Borrow Book"
						: "Extend Borrowing"
				}
				onClose={() =>
					setModalConfig({ isOpen: false, type: null, data: null })
				}
				onConfirm={(days) => {
					if (modalConfig.type === "request")
						onRequestBook(modalConfig.data.id, days);
					if (modalConfig.type === "extend")
						onHandleExtendBorrow(modalConfig.data.id, days);
					setModalConfig({ isOpen: false, type: null, data: null });
				}}
			/>

			<BottomNavController />
			<FooterController />
		</div>
	);
};

export default LibraryUI;
