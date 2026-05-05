import React from "react";
import { useNavigate } from "react-router-dom";
import GuideBottomNavUI from "./GuideBottomNavUI";

const GuideBottomNavController = ({ onExpandGuideClick }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  return (
    <GuideBottomNavUI
      onDashboardClick={handleDashboardClick}
      onExpandGuideClick={onExpandGuideClick}
    />
  );
};

export default GuideBottomNavController;