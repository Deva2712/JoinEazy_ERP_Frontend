import React from "react";
import { Home, Menu } from "lucide-react";

const GuideBottomNavUI = ({ onDashboardClick, onExpandGuideClick }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden"
      style={{
        borderTopColor: "#D3D6DA",
        padding: "16px",
        zIndex: 9999,
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex justify-around items-center h-full">
        {/* Dashboard Button */}
        <button
          onClick={onDashboardClick}
          className="flex items-center justify-center gap-2 transition-colors flex-1 py-2 active:scale-95"
        >
          <Home
            size={20}
            strokeWidth={2}
            className="text-gray-900"
          />
          <span className="text-sm font-medium text-gray-900">
            Dashboard
          </span>
        </button>

        {/* Divider */}
        <div 
          className="h-8 w-px"
          style={{ backgroundColor: "#D3D6DA" }}
        />

        {/* Expand Guide Button */}
        <button
          onClick={onExpandGuideClick}
          className="flex items-center justify-center gap-2 transition-colors flex-1 py-2 active:scale-95"
        >
          <Menu
            size={20}
            strokeWidth={2}
            className="text-gray-900"
          />
          <span className="text-sm font-medium text-gray-900">
            Expand Guide
          </span>
        </button>
      </div>
    </nav>
  );
};

export default GuideBottomNavUI;