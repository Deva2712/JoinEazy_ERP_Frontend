import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CohortMembersProfileUI from "./CohortMembersProfileUI";
import { userService } from "../../../api/services/user.service";

const CohortMembersProfileController = ({ cohortId, profileId, onClose }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) return;

      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching profile data for profileId:", profileId);
        const response = await userService.getUserDetails(`username,email,created_at,profile_image`);
        console.log("Profile API response:", response);
        
        if (response.success) {
          const data = response.data.user;
          console.log("Profile data:", data);
          
          // Transform API data to match UI expectations
          const transformedProfileData = {
            id: profileId,
            name: data.username || "Unknown User",
            username: `@${data.username || "user"}`,
            avatar: data.profile_image || `https://randomuser.me/api/portraits/men/${profileId}.jpg`,
            joinedDate: new Date(data.created_at).toLocaleDateString(),
            description: "Member", // Could be enhanced with role/group info
            stats: {
              posts: 0, // Would need separate API for posts count
              leaderboardPosition: 0, // Would need separate API for leaderboard
            },
          };
          
          setProfileData(transformedProfileData);
        } else {
          console.error("Failed to fetch profile data:", response.error);
          setError(response.error || "Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId]);

  const handleClose = () => {
    setProfileData(null);
    setLoading(true);
    setError(null);
    onClose();
  };

  if (!profileData && !loading && !error) return null;

  return (
    <CohortMembersProfileUI
      isOpen={true}
      onClose={handleClose}
      profileData={profileData}
      loading={loading}
      error={error}
    />
  );
};

export default CohortMembersProfileController;
