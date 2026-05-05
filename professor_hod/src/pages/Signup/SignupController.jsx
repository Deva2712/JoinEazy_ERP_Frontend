import SignupUI from './SignupUI';
import { initiateRegistration, completeRegistration } from '../../services/auth.js';
import { useEffect } from 'react';

export default function SignupController() {
  // Configuration object with all UI links and settings
  const config = {
    logo_link: "/",
    privacy_link: "/privacy",
    terms_link: "/terms", 
    guide_link: "/guide",
    signin_link: "/login",
    back_link: "/signup"
  };

  useEffect(() => {
    document.title = "Sign up";
  }, []);

  // Business logic handler for signup
  const handleSignup = async (formData) => {
    try {
      // Enforce institutional email domain on signup as well
      const allowedDomain = "@mahindrauniversity.edu.in";
      if (!formData.email || !formData.email.toLowerCase().endsWith(allowedDomain)) {
        return [false, `Please use your institutional email ending with ${allowedDomain}`];
      }
      // Call the API to initiate registration
      const result = await initiateRegistration(formData.email);
      
      if (result.success) {
        // Success case - proceed to email verification
        return [true, null];
      } else {
        // Error case - display error message
        return [false, result.error || "Registration failed. Please try again."];
      }
    } catch (error) {
      console.error('Signup error:', error);
      return [false, "Network error. Please try again."];
    }
  };

  // Business logic handler for resending verification code
  const handleResend = async (email) => {
    try {
      // Call the API to resend verification code
      const result = await initiateRegistration(email);
      // Returns nothing as specified by the UI component
    } catch (error) {
      console.error('Resend verification code error:', error);
      // UI doesn't expect a return value, so we just log the error
    }
  };

  // Business logic handler for email confirmation
  const handleConfirm = async (verificationCode, email, password) => {
    try {
      // Call the API to complete registration
      const result = await completeRegistration(email, password, verificationCode);
      
      if (result.success) {
        // Success case - return null (no error)
        return null;
      } else {
        // Error case - return error message
        return result.error || "Verification failed. Please try again.";
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      return "Network error. Please try again.";
    }
  };

  return (
    <SignupUI 
      {...config}
      handleSignup={handleSignup}
      handleResend={handleResend}
      handleConfirm={handleConfirm}
    />
  );
}