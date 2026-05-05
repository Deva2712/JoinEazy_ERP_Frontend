import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom"; // Changed from wouter
import { Eye, EyeOff, Loader2, Sparkles, Shield, Mail, Lock, Key, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import logoImage from "@/assets/images/Joineazy final-01.png";
import React from "react"; // Added missing import for React

export default function ResetPasswordUI({
  logo_link,
  privacy_link,
  terms_link,
  guide_link,
  signin_link,
  back_link,
  handleReset,
  handleResend,
  handleVerify,
  handleSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [verifyError, setVerifyError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storedEmail, setStoredEmail] = useState("");
  const [storedOtp, setStoredOtp] = useState("");
  const navigate = useNavigate(); // Changed from useLocation
  const { toast } = useToast();

  // Reset password schema
  const resetSchema = z.object({
    email: z.string().email("Email is invalid"),
  });

  // Verification schema
  const verificationSchema = z.object({
    verificationCode: z.string().min(1, "Verification code is required"),
  });

  // New password schema
  const newPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const verificationForm = useForm({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verificationCode: "",
    },
    mode: "onChange",
  });

  // I have added a separate state for verification code to ensure clean control letss hope 
  const [verificationCode, setVerificationCode] = useState("");

  const newPasswordForm = useForm({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Reset forms when switching steps
  useEffect(() => {
    if (showVerification && !showNewPassword) {
      // When entering verification step, ensure verification form is clean
      setVerificationCode("");
      verificationForm.reset({ verificationCode: "" });
    } else if (showNewPassword) {
      // When entering new password step, ensure password form is clean
      newPasswordForm.reset({ password: "", confirmPassword: "" });
    }
    // Don't reset email form automatically as user should keep their email
  }, [showVerification, showNewPassword, verificationForm, newPasswordForm]);

  const handleLogoClick = () => {
    navigate(logo_link);
  };

  const handleLinkClick = (url) => {
    navigate(url);
  };

  const onResetSubmit = async (data) => {
    setIsLoading(true);
    setResetError(null);

    try {
      const [success, errorMessage] = await handleReset(data);

      if (success) {
        // Move to email verification
        setShowVerification(true);
        setStoredEmail(data.email);
        // Reset verification code state
        setVerificationCode("");
        verificationForm.reset({ verificationCode: "" });
        setVerifyError(null);
      } else {
        // Show error message
        setResetError(errorMessage);
      }
    } catch (error) {
      setResetError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifySubmit = async (data) => {
    setIsVerifying(true);
    setVerifyError(null);

    try {
      // Use the verification code from state
      const codeToVerify = verificationCode || data.verificationCode;
      const [success, errorMessage] = await handleVerify(codeToVerify, storedEmail);

      if (success) {
        // Move to new password
        setShowNewPassword(true);
        setStoredOtp(codeToVerify);
        // Reset password form to ensure clean state
        newPasswordForm.reset({ password: "", confirmPassword: "" });
        setSubmitError(null);
      } else {
        // Show error message
        setVerifyError(errorMessage);
      }
    } catch (error) {
      setVerifyError("An unexpected error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const errorMessage = await handleSubmit(data, storedEmail, storedOtp);

      if (errorMessage) {
        setSubmitError(errorMessage);
      } else {
        // Success - navigate to login
        toast({
          title: "Success",
          description: "Password reset successfully!",
        });
        navigate(signin_link);
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToReset = () => {
    setShowVerification(false);
    setShowNewPassword(false);
    setStoredEmail("");
    setStoredOtp("");
    setVerificationCode("");
    setResetError(null);
    setVerifyError(null);
    setSubmitError(null);
    resetForm.reset({ email: "" });
    verificationForm.reset({ verificationCode: "" });
    newPasswordForm.reset({ password: "", confirmPassword: "" });
  };

  const onResendCode = async () => {
    try {
      await handleResend(storedEmail);
      // Reset verification code state and form
      setVerificationCode("");
      verificationForm.reset({ verificationCode: "" });
      setVerifyError(null);
      toast({
        title: "Code Resent",
        description: "Verification code has been resent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTitle = () => {
    if (showNewPassword) return "Set New Password";
    if (showVerification) return "Verify Your Email";
    return "Reset Your Password";
  };

  const getDescription = () => {
    if (showNewPassword)
      return "Enter your new password that will be used for future logins";
    if (showVerification)
      return "Enter the verification code sent to your email";
    return "Enter your email to receive a password reset link";
  };

  const getIcon = () => {
    if (showNewPassword) return Key;
    if (showVerification) return Mail;
    return Lock;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-[20%] left-[10%] w-32 h-32 border border-purple-300/30 rounded-full animate-float opacity-30" 
           style={{ animationDuration: "8s" }} />
      <div className="absolute top-[30%] right-[15%] w-24 h-24 border border-blue-300/30 rounded-lg rotate-45 animate-float opacity-25" 
           style={{ animationDuration: "10s", animationDelay: "2s" }} />
      <div className="absolute bottom-[25%] left-[20%] w-20 h-20 border border-indigo-300/30 rounded-full animate-float opacity-20" 
           style={{ animationDuration: "12s", animationDelay: "4s" }} />

      {/* Header */}
      <header className="relative z-10 w-full p-2">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={handleLogoClick}
          >
            <div className="relative">
              <img
                src={logoImage}
                alt="Joineazy Logo"
                className="h-32 w-auto transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            <Button
              variant="ghost"
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 transition-all duration-200 font-medium"
              onClick={() => handleLinkClick(privacy_link)}
            >
              Privacy
            </Button>
            <Button
              variant="ghost"
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 transition-all duration-200 font-medium"
              onClick={() => handleLinkClick(terms_link)}
            >
              Terms
            </Button>
            <Button
              variant="ghost"
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 transition-all duration-200 font-medium"
              onClick={() => handleLinkClick(guide_link)}
            >
              Guide
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Feature highlights */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium mb-4">
              {React.createElement(getIcon(), { className: "w-4 h-4" })}
              {showNewPassword ? "Set New Password" : showVerification ? "Verify Email" : "Reset Password"}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {getTitle()}
            </h1>
            <p className="text-slate-600">
              {getDescription()}
            </p>
          </div>

          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              {showNewPassword ? (
                <Form {...newPasswordForm}>
                  <form
                    onSubmit={newPasswordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={newPasswordForm.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold text-sm">
                            New Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your new password"
                                className="pl-12 pr-12 h-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 placeholder:text-slate-400"
                                autoComplete="new-password"
                                autoFocus={showNewPassword}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100/50 rounded-lg transition-colors duration-200"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-slate-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-slate-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={newPasswordForm.control}
                      name="confirmPassword"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold text-sm">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm your new password"
                                className="pl-12 pr-12 h-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 placeholder:text-slate-400"
                                autoComplete="new-password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100/50 rounded-lg transition-colors duration-200"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-slate-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-slate-400" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    {/* Error Message */}
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-600 text-sm text-center">
                          {submitError}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating password...
                        </>
                      ) : (
                        <>
                          <Key className="mr-2 h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-slate-600 text-sm">
                        Remember your password?{" "}
                        <Button
                          type="button"
                          variant="link"
                          className="text-blue-600 hover:text-blue-700 font-semibold p-0 h-auto text-sm"
                          onClick={() => handleLinkClick(signin_link)}
                        >
                          Sign in instead
                        </Button>
                      </p>
                    </div>

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-slate-600 hover:text-slate-800 p-0 h-auto text-sm flex items-center gap-1 mx-auto"
                        onClick={() => {
                          setShowNewPassword(false);
                          setSubmitError(null);
                        }}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Verification
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : showVerification ? (
                <div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (verificationCode.length === 4) {
                        onVerifySubmit({ verificationCode });
                      }
                    }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-slate-700 font-semibold text-sm block mb-2">
                        Verification Code
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                        <Input
                          type="text"
                          placeholder="Enter 4-digit code"
                          value={verificationCode}
                          className="pl-12 pr-4 h-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 placeholder:text-slate-400 w-full text-center text-lg font-mono tracking-widest"
                          onChange={(e) => {
                            // Only allow numbers and limit to 4 digits
                            const filteredValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                            setVerificationCode(filteredValue);
                          }}
                          autoComplete="one-time-code"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={4}
                          autoFocus={showVerification}
                        />
                      </div>
                    </div>

                    {/* Error Message */}
                    {verifyError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-600 text-sm text-center">
                          {verifyError}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      disabled={isVerifying || verificationCode.length !== 4}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Verify Email
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-slate-600 text-sm">
                        Didn't receive a code?{" "}
                        <Button
                          type="button"
                          variant="link"
                          className="text-blue-600 hover:text-blue-700 font-semibold p-0 h-auto text-sm"
                          onClick={onResendCode}
                        >
                          Resend code
                        </Button>
                      </p>
                    </div>

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-slate-600 hover:text-slate-800 p-0 h-auto text-sm flex items-center gap-1 mx-auto"
                        onClick={handleBackToReset}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Reset Password
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <Form {...resetForm}>
                  <form
                    onSubmit={resetForm.handleSubmit(onResetSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={resetForm.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold text-sm">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                className="pl-12 pr-4 h-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 placeholder:text-slate-400"
                                autoFocus={!showVerification && !showNewPassword}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    {/* Error Message */}
                    {resetError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-600 text-sm text-center">
                          {resetError}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending reset link...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Send Reset Link
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-slate-600 text-sm">
                        Remember your password?{" "}
                        <Button
                          type="button"
                          variant="link"
                          className="text-blue-600 hover:text-blue-700 font-semibold p-0 h-auto text-sm"
                          onClick={() => handleLinkClick(signin_link)}
                        >
                          Sign in instead
                        </Button>
                      </p>
                    </div>

                    {/* Security notice */}
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-600 text-xs">
                        <Shield className="w-4 h-4" />
                        <span>By resetting your password, you agree to our Terms of Service and Privacy Policy</span>
                      </div>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}