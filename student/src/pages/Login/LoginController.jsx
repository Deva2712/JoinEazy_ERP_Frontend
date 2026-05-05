import LoginUI from './LoginUI';
import { loginUser } from '../../services/auth.js';
import { courseService } from "../../api/services/course.service";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginController() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: updateAuthState } = useAuth();
  const from = location.state?.from || "/dashboard";
  const message = location.state?.message;
  const invitationToken = location.state?.invitationToken;
  // Dummy configuration values for integration
  const config = {
    privacy_link: "/privacy",
    terms_link: "/terms", 
    guide_link: "/guide",
    signup_link: "/signup",
    forgot_password_link: "/reset-password",
    logo_link: "/"
  };

  // Real login handler - returns error string or null for success
  const handleLogin = async (formData) => {
    // Validation
    if (!formData.email || !formData.password) {
      return "Please fill in all fields";
    }
    
    if (!formData.email.includes('@')) {
      return "Please enter a valid email address";
    }
    
    // Enforce institutional email domain
    const allowedDomain = "@mahindrauniversity.edu.in";
    if (!formData.email.toLowerCase().endsWith(allowedDomain)) {
      return `Please use your institutional email ending with ${allowedDomain}`;
    }
    
    try {
      // Call the real authentication service
      const result = await loginUser(formData.email, formData.password);
      
      if (result.success) {
        // Do not redirect here; allow onLoginSuccess to handle pending invitations and navigation
        return null; // No error
      } else {
        return result.error || "Login failed. Please check your credentials and try again";
      }
    } catch (error) {
      return "Network error. Please try again.";
    }
  };

  const handleLoginSuccess = async (userData) => {
    console.log("handleLoginSuccess called with userData:", userData);
    
    // Add a small delay to ensure cookies are properly set
    console.log("Waiting for cookies to be set...");
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Verify authentication before proceeding
    const authCheck = await import('../../services/auth.js').then(module => module.checkLoginStatus());
    console.log("Post-login auth verification:", authCheck);
    
    if (!authCheck.isLoggedIn) {
      console.warn("Authentication verification failed after login, retrying...");
      await new Promise(resolve => setTimeout(resolve, 500));
      const retryAuthCheck = await import('../../services/auth.js').then(module => module.checkLoginStatus());
      console.log("Retry auth verification:", retryAuthCheck);
      
      if (!retryAuthCheck.isLoggedIn) {
        console.error("Authentication failed to verify after login");
        alert("Login completed but authentication verification failed. Please try logging in again.");
        return;
      }
    }
    
    // Check if we've already processed an invitation to prevent duplicates
    const processedToken = localStorage.getItem("processedInvitationToken");
    
    // Priority 1: Check for pendingInvitationToken (from CourseJoinController)
    const pendingInvitationToken = localStorage.getItem("pendingInvitationToken");
    if (pendingInvitationToken && processedToken !== pendingInvitationToken) {
      console.log("Processing pendingInvitationToken:", pendingInvitationToken);
      localStorage.removeItem("pendingInvitationToken");
      localStorage.removeItem("pendingInvitationTokenTime");
      
      try {
        const response = await courseService.joinCourseWithInvitation({ token: pendingInvitationToken });
        if (response.success) {
          // Mark this token as processed
          localStorage.setItem("processedInvitationToken", pendingInvitationToken);
          localStorage.setItem("processedInvitationTokenTime", Date.now().toString());
          alert("Successfully joined the course!");
          navigate("/dashboard");
          return;
        } else {
          alert("Failed to join course: " + response.message);
        }
      } catch (error) {
        console.error("Error joining course after login:", error);
        alert("Failed to join course after login");
      }
    } else if (pendingInvitationToken) {
      // Token already processed, just remove it
      console.log("Token already processed, removing pendingInvitationToken");
      localStorage.removeItem("pendingInvitationToken");
      localStorage.removeItem("pendingInvitationTokenTime");
    }
    
    // Priority 2: Check for invitationToken from route state
    if (invitationToken && processedToken !== invitationToken) {
      console.log("Processing invitationToken from route:", invitationToken);
      try {
        const result = await courseService.joinWithInvitation(invitationToken);
        
        if (result.success) {
          // Mark this token as processed
          localStorage.setItem("processedInvitationToken", invitationToken);
          localStorage.setItem("processedInvitationTokenTime", Date.now().toString());
          alert(`Welcome! You have been successfully added to ${result.cohortName}`);
          navigate(`/c/${result.cohortId}`);
          return;
        } else {
          console.error("Failed to join course:", result.message);
        }
      } catch (error) {
        console.error("Error joining course:", error);
      }
    }
    
    // Priority 3: Check for pendingInvitation (legacy)
    const pendingInvitation = localStorage.getItem("pendingInvitation");
    if (pendingInvitation && processedToken !== pendingInvitation) {
      console.log("Processing pendingInvitation:", pendingInvitation);
      localStorage.removeItem("pendingInvitation");
      const invitation = JSON.parse(pendingInvitation);
      
      try {
        const response = await courseService.joinCourseWithInvitation({
          token: invitation.token,
          email: userData.email
        });
        
        if (response.success) {
          // Mark this token as processed
          localStorage.setItem("processedInvitationToken", invitation.token);
          localStorage.setItem("processedInvitationTokenTime", Date.now().toString());
          alert(`Successfully joined the course!`);
          navigate(`/c/${response.cohortId}`);
          return;
        } else {
          alert("Failed to join course: " + response.message);
        }
      } catch (error) {
        console.error("Error joining course:", error);
        alert("Failed to join course after login");
      }
    }
    
    // Update auth context
    await updateAuthState();
    
    // If no invitation to process, navigate to original destination
    console.log("No invitation to process, navigating to:", from);
    navigate(from);
  };

  useEffect(() => {
    document.title = "Sign in";
  }, []);

  return (
    <LoginUI 
      privacy_link={config.privacy_link}
      terms_link={config.terms_link}
      guide_link={config.guide_link}
      signup_link={config.signup_link}
      forgot_password_link={config.forgot_password_link}
      logo_link={config.logo_link}
      handleLogin={handleLogin}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}