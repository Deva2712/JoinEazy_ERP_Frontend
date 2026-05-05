// src/components/layout/Header/HeaderController.jsx

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderUI from "./HeaderUI";
import NotificationsController from "../Notifications/NotificationsController";
import JobTrayController from "../JobTray/JobTrayController";
import { useNotifications } from "../../../context/NotificationContext";
import { useJobs } from "../../../context/JobTrayContext";

/**
 * Controller for the application Header.
 * Coordinates modal visibility and state propagation to HeaderUI.
 */
const HeaderController = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isJobTrayOpen, setIsJobTrayOpen] = useState(false);
  
  const { hasUnreadNotifications } = useNotifications();
  const { hasUnreadJobs } = useJobs();

  const dashboardLink = "/dashboard";
  const guideLink = "/guide";
  const feedback_link = "https://forms.gle/9LLVds3Y3jq4gAiQ7";

  // Check if the current path matches the profile/settings path
  const isProfileOpen = location.pathname === "/settings";

  const handleProfileClick = () => navigate("/settings");
  const handleNotificationClick = () => setIsNotificationsOpen(true);
  const handleCloseNotifications = () => setIsNotificationsOpen(false);
  const handleJobTrayClick = () => setIsJobTrayOpen(true);
  const handleCloseJobTray = () => setIsJobTrayOpen(false);

  return (
    <>
      <HeaderUI
        dashboardLink={dashboardLink}
        guideLink={guideLink}
        feedback_link={feedback_link}
        hasUnreadNotifications={hasUnreadNotifications}
        hasUnreadJobs={hasUnreadJobs}
        handleNotificationClick={handleNotificationClick}
        handleJobTrayClick={handleJobTrayClick}
        handleProfileClick={handleProfileClick}
        profile_image={null}
        isProfileOpen={isProfileOpen}
      />
      
      <NotificationsController
        isOpen={isNotificationsOpen}
        onClose={handleCloseNotifications}
      />

      <JobTrayController
        isOpen={isJobTrayOpen}
        onClose={handleCloseJobTray}
      />
    </>
  );
};

export default HeaderController;