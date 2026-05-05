import ResetPasswordUI from './ResetPasswordUI';
import { initiatePasswordReset, verifyPasswordResetOTP, completePasswordReset } from '../../services/auth.js';

export default function ResetPasswordController() {
  // Configuration object with all UI links and settings
  const config = {
    logo_link: "/",
    privacy_link: "/privacy",
    terms_link: "/terms", 
    guide_link: "/guide",
    signin_link: "/login",
    back_link: "/signup"
  };

  // Business logic handler for reset password
  const handleReset = async (formData) => {
    try {
      // Call the API to initiate password reset
      const result = await initiatePasswordReset(formData.email);
      
      if (result.success) {
        // Success case - proceed to email verification
        return [true, null];
      } else {
        // Error case - display error message
        return [false, result.error || "Password reset request failed. Please try again."];
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      return [false, "Network error. Please try again."];
    }
  };

  // Business logic handler for resending verification code
  const handleResend = async (email) => {
    try {
      // Call the API to resend verification code
      const result = await initiatePasswordReset(email);
      // Returns nothing as specified by the UI component
    } catch (error) {
      console.error('Resend verification code error:', error);
      // UI doesn't expect a return value, so we just log the error
    }
  };

  // Business logic handler for email verification
  const handleVerify = async (verificationCode, email) => {
    try {
      // Call the API to verify the OTP
      const result = await verifyPasswordResetOTP(email, verificationCode);
      
      if (result.success) {
        // Success case - proceed to new password
        return [true, null];
      } else {
        // Error case - display error message
        return [false, result.error || "Invalid verification code. Please check and try again."];
      }
    } catch (error) {
      console.error('Verification error:', error);
      return [false, "Network error. Please try again."];
    }
  };

  // Business logic handler for new password submission
  const handleSubmit = async (passwordData, email, otp) => {
    try {
      // Basic validation
      if (passwordData.password !== passwordData.confirmPassword) {
        return "Passwords do not match. Please try again.";
      }
      
      if (passwordData.password.length < 8) {
        return "Password must be at least 8 characters long.";
      }
      
      // Call the API to complete the password reset
      const result = await completePasswordReset(email, otp, passwordData.password);
      
      if (result.success) {
        // Success case - return null (no error)
        return null;
      } else {
        // Error case - return error message
        return result.error || "Password reset failed. Please try again.";
      }
    } catch (error) {
      console.error('Password reset error:', error);
      return "Network error. Please try again.";
    }
  };

  return (
    <ResetPasswordUI 
      {...config}
      handleReset={handleReset}
      handleResend={handleResend}
      handleVerify={handleVerify}
      handleSubmit={handleSubmit}
    />
  );
}