import React from "react";
import { X, Calendar, BarChart3, Trophy } from "lucide-react";

const CohortMembersProfileUI = ({ profileData, loading, onClose }) => {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6">
          <div className="flex items-center justify-center h-40">
            <div className="text-lg text-gray-600">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-[20px] w-full max-w-md mx-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Profile Not Found</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          <p className="text-gray-600 text-center">
            This profile could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header with close button */}
        <div className="flex items-center justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Profile Image and Basic Info */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-1.5">
              {profileData.name}
            </h2>

            <p className="text-gray-600 text-base">{profileData.username}</p>

            {/* Member Since */}
            <div className="flex items-center justify-center gap-1.5 text-gray-600 text-base my-2">
              <Calendar size={17} className="mb-0.5" />
              <span>Member since {profileData.joinedDate}</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-base">{profileData.description}</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Posts Stats */}
            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1">
                {profileData.stats.posts}
              </div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>

            {/* Leaderboard Position */}
            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy size={20} className="text-yellow-600" />
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1">
                {profileData.stats.leaderboardPosition}
              </div>
              <div className="text-sm text-gray-600">Leaderboard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohortMembersProfileUI;
