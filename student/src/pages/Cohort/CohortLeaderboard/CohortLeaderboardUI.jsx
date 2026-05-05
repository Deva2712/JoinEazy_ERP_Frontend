import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const CohortLeaderboardUI = ({
  cohortId,
  cohortData,
  member_type,
  memberType,
  range,
  leaderboardData,
  handleMemberTypeChange,
  handleRange,
  getMedalType,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const memberTypeOptions = ["Group", "Individual"];
  const rangeOptions = ["This month", "All Time"];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMemberTypeSelect = (option) => {
    handleMemberTypeChange(option);
    setIsDropdownOpen(false);
  };

  const renderMedalIcon = (medalType, rank) => {
    if (medalType === "gold") {
      return (
        <div
          className="flex items-center justify-center rounded-full text-white font-bold text-sm"
          style={{
            width: "26px",
            height: "26px",
            backgroundColor: "#fad946",
            color: "#9e7b2b",
          }}
        >
          {rank}
        </div>
      );
    } else if (medalType === "silver") {
      return (
        <div
          className="flex items-center justify-center rounded-full text-white font-bold text-sm"
          style={{
            width: "26px",
            height: "26px",
            backgroundColor: "#d1dceb",
            color: "#7b869e",
          }}
        >
          {rank}
        </div>
      );
    } else if (medalType === "bronze") {
      return (
        <div
          className="flex items-center justify-center rounded-full text-white font-bold text-sm"
          style={{
            width: "26px",
            height: "26px",
            backgroundColor: "#d9a068",
            color: "#8a5f3a",
          }}
        >
          {rank}
        </div>
      );
    } else {
      return (
        <div
          className="flex items-center justify-center font-bold text-sm"
          style={{
            width: "26px",
            height: "26px",
            color: "#374151",
          }}
        >
          {rank}
        </div>
      );
    }
  };

  return (
    <div className="pb-[92px] py-5 sm:px-4 sm:py-6 sm:pb-7">
      {/* Button Row */}
      <div className="flex items-center gap-x-3.5 sm:gap-x-4 px-4 sm:px-0 mb-5 sm:mb-6">
        {/* Member Type Dropdown - Only show if member_type is 1 */}
        {member_type === 1 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleDropdownToggle}
              className="flex items-center justify-center gap-2 font-medium bg-white transition-all duration-200"
              style={{
                height: "38px",
                borderRadius: "9999px",
                border: "1px solid #D3D6DA",
                paddingLeft: "16px",
                paddingRight: "16px",
                color: "rgb(55, 65, 81)",
                fontSize: "14px",
              }}
            >
              <span>{memberType}</span>
              <ChevronDown
                size={16}
                style={{
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-1 bg-white shadow-lg z-10"
                style={{
                  borderRadius: "8px",
                  border: "1px solid #D3D6DA",
                  minWidth: "140px",
                }}
              >
                {memberTypeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleMemberTypeSelect(option)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 font-medium transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                    style={{
                      fontSize: "15px",
                      color: memberType === option ? "#000" : "#666",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="w-full flex items-center gap-x-3.5 sm:gap-x-4 overflow-x-auto">
          {/* Range Buttons */}
          {rangeOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleRange(option)}
              className="flex items-center justify-center bg-white font-medium whitespace-nowrap transition-all duration-200"
              style={{
                height: "38px",
                borderRadius: "9999px",
                border:
                  range === option ? "1px solid #D3D6DA" : "1px solid #D3D6DA",
                paddingLeft: "16px",
                paddingRight: "16px",
                fontSize: "14px",
                color: range === option ? "#275DF5" : "rgb(55, 65, 81)",
              }}
            >
              {option}
            </button>
          ))}

          <Link
            to="/how-points-work"
            className="sm:ml-auto flex items-center justify-center bg-white font-medium whitespace-nowrap transition-all duration-200"
            style={{
              height: "38px",
              borderRadius: "9999px",
              border: "1px solid #D3D6DA",
              paddingLeft: "16px",
              paddingRight: "16px",
              fontSize: "14px",
              color: "rgb(55, 65, 81)",
              textDecoration: "none",
            }}
          >
            How points work?
          </Link>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="px-4 sm:px-0">
        {/* Main Leaderboard Table (all items except the last one) */}
        {leaderboardData.length > 1 && (
          <div
            className="bg-white rounded-[20px] overflow-hidden mb-5 sm:mb-6"
            style={{ border: "1px solid #D3D6DA" }}
          >
            {/* Main Leaderboard List */}
            <div className="divide-y">
              {leaderboardData.slice(0, -1).map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center px-4 py-3.5 sm:px-6 sm:py-4 gap-x-3 sm:gap-x-4"
                  style={{
                    borderTop: "0px",
                    borderBottom:
                      index === leaderboardData.slice(0, -1).length - 1
                        ? "0px"
                        : "1px solid #D3D6DA",
                  }}
                >
                  {/* Rank/Medal */}
                  <div className="flex-shrink-0">
                    {renderMedalIcon(getMedalType(user.rank), user.rank)}
                  </div>


                  {/* User Info */}
                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium text-gray-900 text-[15px] sm:text-base line-clamp-1">
                      {user.name}
                    </h4>
                    <p className="text-gray-700 text-sm line-clamp-1 mt-[-1px]">
                      {user.description}
                    </p>
                  </div>

                  {/* Points */}
                  <div className="ml-auto flex-shrink-0">
                    <span
                      className="font-bold text-sm sm:text-[15px]"
                      style={{ color: "#275DF5" }}
                    >
                      {user.points.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Item as Separate Table */}
        {leaderboardData.length > 0 && (
          <div
            className="bg-white rounded-[18px] overflow-hidden"
            style={{ border: "1px solid #D3D6DA" }}
          >
            {/* Last Item */}
            <div className="divide-y">
              {(() => {
                const lastUser = leaderboardData[leaderboardData.length - 1];
                return (
                  <div
                    key={lastUser.id}
                    className="flex items-center px-4 py-3.5 sm:px-6 sm:py-4 gap-x-3 sm:gap-x-4"
                    style={{
                      borderTop: "0px",
                      borderBottom: "0px",
                    }}
                  >
                    {/* Rank/Medal */}
                    <div className="flex-shrink-0">
                      {renderMedalIcon(
                        getMedalType(lastUser.rank),
                        lastUser.rank,
                      )}
                    </div>

                    {/* Profile Image - Only show for Individual member type */}
                    {memberType === "Individual" && (
                      <div className="flex-shrink-0">
                        <div className="rounded-full w-9 h-9 sm:w-10 sm:h-10 overflow-hidden">
                          <img
                            src={lastUser.profileImage}
                            alt={lastUser.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* User Info */}
                    <div className="flex-grow min-w-0">
                      <h4 className="font-medium text-gray-900 text-[15px] sm:text-base line-clamp-1">
                        {lastUser.name}
                      </h4>
                      <p className="text-gray-700 text-sm line-clamp-1 mt-[-1px]">
                        {lastUser.description}
                      </p>
                    </div>

                    {/* Points */}
                    <div className="flex-shrink-0 ml-auto">
                      <span
                        className="font-bold text-sm sm:text-[15px]"
                        style={{ color: "#275DF5" }}
                      >
                        {lastUser.points.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CohortLeaderboardUI;
