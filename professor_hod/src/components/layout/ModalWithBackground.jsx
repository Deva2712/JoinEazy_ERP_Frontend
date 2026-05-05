import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardPage from "@/pages/Dashboard/DashboardController";
import SettingsController from "@/pages/Settings/SettingsController";
import NotificationsController from "@/components/layout/Notifications/NotificationsController";
import CreateCohortController from "@/components/layout/CreateCohort/CreateCohortController";
import GuideController from "@/components/layout/Guide/GuideController";


const ModalWithBackground = ({ modalType, onClose }) => {
  const location = useLocation();
  const [backgroundComponent, setBackgroundComponent] = useState(null);

  useEffect(() => {
    // Get the previous page from browser history or referrer
    const getPreviousPage = () => {
      // Try to get from navigation state first
      if (location.state?.from) {
        return location.state.from;
      }

      // Try to get from referrer
      const referrer = document.referrer;
      if (referrer) {
        const url = new URL(referrer);
        const pathname = url.pathname;

        // Map known paths to their components
        if (pathname === "/dashboard") {
          return "dashboard";
        }
      }

      // Default fallback
      return "dashboard";
    };

    const previousPage = getPreviousPage();

    // Load the appropriate background component
    switch (previousPage) {
      case "dashboard":
        setBackgroundComponent(() => DashboardPage);
        break;
      // Add more cases for future pages
      // case "newpage":
      //   setBackgroundComponent(() => NewPageComponent);
      //   break;
      // case "newpage2":
      //   setBackgroundComponent(() => NewPage2Component);
      //   break;
      default:
        setBackgroundComponent(() => DashboardPage);
    }
  }, [location]);

  const BackgroundComponent = backgroundComponent;

  if (!BackgroundComponent) {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Render the background page */}
      <BackgroundComponent />

      {/* Render the modal overlay */}
      {modalType === "settings" && (
        <SettingsController isOpen={true} onClose={onClose} />
      )}
      {modalType === "notifications" && (
        <NotificationsController isOpen={true} onClose={onClose} />
      )}
      {modalType === "create" && (
        <CreateCohortController isOpen={true} onClose={onClose} />
      )}
      {modalType === "guide" && (
        <GuideController isOpen={true} onClose={onClose} />
      )}

    </div>
  );
};

export default ModalWithBackground;
