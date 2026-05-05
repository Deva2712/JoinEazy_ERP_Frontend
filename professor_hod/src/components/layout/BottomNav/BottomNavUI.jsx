// src/components/layout/BottomNav/BottomNavUI.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Inbox, Bell, User } from "lucide-react";

/**
 * BottomNavUI Component
 * Provides a mobile-optimized navigation bar fixed at the bottom of the screen.
 * Displays navigation icons for Dashboard, Jobs, Notifications, and Profile.
 */
const BottomNavUI = ({ 
  hasUnreadNotifications, 
  hasUnreadJobs,
  handleNotificationClick,
  handleJobTrayClick,
  isAuthenticated,
  profileImage 
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  /**
   * Checks if the provided path matches the current location path
   * to determine the active navigation state.
   */
  const isActive = (path) => currentPath === path;

  /**
   * Returns consistent CSS classes for navigation links and buttons,
   * applying active states based on the current route.
   */
  const getLinkClasses = (path) => 
    `flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-200 ${
      isActive(path) 
        ? "text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10 font-bold" 
        : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white dark:bg-[#0f1117] border-t border-gray-200 dark:border-gray-800 md:hidden z-40">
      <div className="flex justify-around items-center h-full">
        
        {/* Dashboard */}
        <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
          <LayoutDashboard size={20} />
          <span className="text-[10px]">Dashboard</span>
        </Link>

        {/* Job Tray */}
        <button onClick={handleJobTrayClick} className={getLinkClasses()}>
          <div className="relative">
            <Inbox size={20} />
            {hasUnreadJobs && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 border border-white dark:border-[#0f1117] rounded-full animate-pulse" />
            )}
          </div>
          <span className="text-[10px]">Job Tray</span>
        </button>

        {/* Notifications */}
        <button onClick={handleNotificationClick} className={getLinkClasses()}>
          <div className="relative">
            <Bell size={20} />
            {hasUnreadNotifications && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 border border-white dark:border-[#0f1117] rounded-full animate-pulse" />
            )}
          </div>
          <span className="text-[10px]">Notifications</span>
        </button>

        {/* Profile/Settings */}
        <Link to="/settings" className={getLinkClasses('/settings')}>
          <div className={`w-6 h-6 rounded-full border-2 overflow-hidden ${isActive('/settings') ? "border-blue-600 dark:border-blue-400" : "border-gray-300 dark:border-gray-700"}`}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={20} className="w-full h-full p-0.5" />
            )}
          </div>
          <span className="text-[10px]">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavUI;