// src/components/layout/Header/HeaderUI.jsx

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
	Bell,
	User,
	Menu,
	X,
	BookOpen,
	MessageCircle,
	Moon,
	Sun,
	LayoutDashboard,
	Inbox,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import logoLight from "@/assets/images/Joineazy final-light.png";
import logoDark from "@/assets/images/Joineazy final-dark.png";

/**
 * HeaderUI Component
 * Renders the top navigation bar, logo, theme toggler, and authentication-based controls.
 * Includes a mobile-responsive menu for navigation.
 */
const HeaderUI = ({
	dashboardLink,
	guideLink,
	feedback_link,
	hasUnreadNotifications,
	hasUnreadJobs, 
	handleNotificationClick,
	handleJobTrayClick,
	handleProfileClick,
	profile_image,
	isProfileOpen,
}) => {
	const location = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { toggleTheme, isDark } = useTheme();
	const { isAuthenticated } = useAuth();

	/**
	 * Generates standardized class names for navigation links, 
	 * applying active styles based on route comparison.
	 */
	const getLinkClassName = (linkPath) => {
		const isActive = linkPath ? location.pathname === linkPath : false;
		return `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
			isActive
				? "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 font-bold"
				: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
		}`;
	};

	return (
		<header className="sticky top-0 z-50 w-full bg-gray-50 dark:bg-[#0f1117] border-b border-gray-200 dark:border-gray-800">
			<div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
				{/* Logo Section */}
				<Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
					<img src={isDark ? logoDark : logoLight} alt="Logo" className="h-6 w-auto" />
				</Link>

				{/* Desktop Navigation Section */}
				{isAuthenticated && (
					<nav className="hidden lg:flex items-center gap-1">
						<Link to={dashboardLink} className={getLinkClassName(dashboardLink)}>
							<LayoutDashboard className="size-4" /> 
							<span>Dashboard</span>
						</Link>
						<Link to={guideLink} className={getLinkClassName(guideLink)}>
							<BookOpen className="size-4" /> 
							<span>Guide</span>
						</Link>
						
						<div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1" />

						<button onClick={handleJobTrayClick} className={getLinkClassName()}>
							<div className="relative">
								<Inbox className="size-4" />
								{hasUnreadJobs && (
									<span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-[#0f1117] rounded-full animate-pulse" />
								)}
							</div>
							<span>Job Tray</span>
						</button>

						<button onClick={handleNotificationClick} className={getLinkClassName()}>
							<div className="relative">
								<Bell className="size-4" />
								{hasUnreadNotifications && (
									<span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-[#0f1117] rounded-full animate-pulse" />
								)}
							</div>
							<span>Notifications</span>
						</button>
					</nav>
				)}

				{/* Right Utilities Section (Theme, Auth, Mobile Menu Toggle) */}
				<div className="flex items-center gap-2 lg:gap-4">
					{isAuthenticated && (
						<a
							href={feedback_link}
							target="_blank"
							rel="noopener noreferrer"
							className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
						>
							<MessageCircle className="size-4" /> Feedback
						</a>
					)}
					
					<button
						onClick={toggleTheme}
						className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
					>
						{isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
					</button>

					{isAuthenticated ? (
						<button
							onClick={handleProfileClick}
							className={`hidden lg:block w-9 h-9 rounded-full border overflow-hidden transition-all ${
								isProfileOpen 
									? "border-blue-700 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20" 
									: "border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-blue-500"
							}`}
						>
							{profile_image ? (
								<img src={profile_image} alt="Profile" className="w-full h-full object-cover" />
							) : (
								<User className={`size-full p-1.5 ${isProfileOpen ? "text-blue-500" : "text-gray-400"}`} />
							)}
						</button>
					) : (
						<Link to="/login" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all">Login</Link>
					)}

					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
					>
						{mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
					</button>
				</div>
			</div>

			{/* Mobile Navigation Dropdown Section */}
			{isAuthenticated && mobileMenuOpen && (
				<div className="lg:hidden absolute top-16 left-0 w-full bg-white dark:bg-[#0f1117] border-b border-gray-200 dark:border-gray-800 shadow-xl animate-in slide-in-from-top-2">
					<nav className="flex flex-col p-4 gap-1">
						<Link 
							to={guideLink} 
							onClick={() => setMobileMenuOpen(false)} 
							className={getLinkClassName(guideLink)}
						>
							<BookOpen className="size-4" /> 
							<span>Guide</span>
						</Link>

						<a 
							href={feedback_link} 
							target="_blank" 
							rel="noopener noreferrer" 
							className={getLinkClassName()}
						>
							<MessageCircle className="size-4" /> 
							<span>Feedback</span>
						</a>
					</nav>
				</div>
			)}
		</header>
	);
};

export default HeaderUI;