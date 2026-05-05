import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { cohortAPI } from "../../services/api";
import { checkLoginStatus } from "../../services/auth";
import CourseJoinUI from "./CourseJoinUI";

const CourseJoinController = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasJoined, setHasJoined] = useState(false); // Add this to prevent double joining

  const token = searchParams.get("token");
  
  console.log("CourseJoinController - Token:", token);

  useEffect(() => {
    const checkAuthAndJoin = async () => {
      try {
        console.log("Starting auth check...");
        
        if (!token) {
          console.log("No token found, setting error");
          setError("Invalid invitation link");
          setLoading(false);
          return;
        }

        // Clean up stale processing tokens (older than 5 minutes)
        const processingToken = localStorage.getItem("processingInvitationToken");
        const processingTokenTime = localStorage.getItem("processingInvitationTokenTime");
        if (processingToken && processingTokenTime) {
          const timeDiff = Date.now() - parseInt(processingTokenTime);
          if (timeDiff > 5 * 60 * 1000) { // 5 minutes
            console.log("Cleaning up stale processing token");
            localStorage.removeItem("processingInvitationToken");
            localStorage.removeItem("processingInvitationTokenTime");
          }
        }

        // Check if we've already processed this token
        const processedToken = localStorage.getItem("processedInvitationToken");
        const processedTokenTime = localStorage.getItem("processedInvitationTokenTime");
        if (processedToken === token) {
          // Check if the processed token is not too old (24 hours)
          if (processedTokenTime) {
            const timeDiff = Date.now() - parseInt(processedTokenTime);
            if (timeDiff < 24 * 60 * 60 * 1000) { // 24 hours
              console.log("Token already processed recently, redirecting to dashboard");
              navigate("/dashboard");
              return;
            } else {
              // Token is old, remove it and process again
              console.log("Token processed too long ago, removing and processing again");
              localStorage.removeItem("processedInvitationToken");
              localStorage.removeItem("processedInvitationTokenTime");
            }
          } else {
            console.log("Token already processed, redirecting to dashboard");
            navigate("/dashboard");
            return;
          }
        }

        // Check if this token is currently being processed
        const currentProcessingToken = localStorage.getItem("processingInvitationToken");
        if (currentProcessingToken === token) {
          console.log("Token is currently being processed, waiting...");
          return;
        }

        console.log("Checking authentication status...");
        const loginStatus = await checkLoginStatus();
        console.log("Login status result:", loginStatus);
        
        setIsLoggedIn(loginStatus.isLoggedIn);

        if (loginStatus.isLoggedIn) {
          // User is logged in, try to join directly
          console.log("User is logged in, attempting to join course...");
          await joinCourse();
        } else {
          // User is NOT logged in, redirect to login page
          console.log("User is not logged in, redirecting to login...");
          localStorage.setItem("pendingInvitationToken", token);
          localStorage.setItem("pendingInvitationTokenTime", Date.now().toString());
          navigate("/login");
        }
      } catch (error) {
        console.error("Error in checkAuthAndJoin:", error);
        setError("Failed to check authentication status");
        setLoading(false);
      }
    };

    checkAuthAndJoin();
  }, [token]);

  const joinCourse = async () => {
    try {
      // Prevent double joining
      if (hasJoined) {
        console.log("Already joined, redirecting to dashboard");
        navigate("/dashboard");
        return;
      }

      // Check if this token is currently being processed
      const processingToken = localStorage.getItem("processingInvitationToken");
      if (processingToken === token) {
        console.log("Token is currently being processed, skipping...");
        return;
      }

      console.log("joinCourse called");
      setLoading(true);
      setError(null);

      // Mark this token as being processed
      localStorage.setItem("processingInvitationToken", token);
      localStorage.setItem("processingInvitationTokenTime", Date.now().toString());

      const requestData = { token };
      console.log("Joining course with data:", requestData);
      
      const response = await cohortAPI.joinCourseWithInvitation(requestData);
      console.log("Join course response:", response);

      if (response.success) {
        // Mark this token as processed
        localStorage.setItem("processedInvitationToken", token);
        localStorage.setItem("processedInvitationTokenTime", Date.now().toString());
        localStorage.removeItem("processingInvitationToken");
        setHasJoined(true);
        
        // Success! Show success message and redirect
        alert("Successfully joined the course!");
        navigate("/dashboard");
      } else {
        console.log("Join course failed:", response.message);
        localStorage.removeItem("processingInvitationToken");
        setError(response.message || "Failed to join course");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error joining course:", error);
      localStorage.removeItem("processingInvitationToken");
      setError("Failed to join course. Please try again.");
      setLoading(false);
    }
  };

  console.log("Component state:", { loading, error, isLoggedIn, hasJoined });

  return (
    <CourseJoinUI
      loading={loading}
      error={error}
      isLoggedIn={isLoggedIn}
    />
  );
};

export default CourseJoinController;
