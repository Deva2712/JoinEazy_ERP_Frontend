import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom"; // Changed from wouter
import { Eye, EyeOff, Loader2, Sparkles, Shield, UserPlus, Mail, Lock } from "lucide-react";
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

export default function SignupUI({
  logo_link,
  privacy_link,
  terms_link,
  guide_link,
  signin_link,
  back_link,
  handleSignup,
  handleResend,
  handleConfirm,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [confirmError, setConfirmError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate(); // Changed from useLocation
  const { toast } = useToast();

  // Create signup schema with custom password validation
  const signupSchema = z.object({
    email: z
      .string()
      .email("Email is invalid")
      .refine((val) => val.toLowerCase().endsWith("@mahindrauniversity.edu.in"), {
        message: "Use your @mahindrauniversity.edu.in email",
      }),
    password: z.string().min(7, "Password must be atleast 7 characters"),
  });

  // Verification schema
  const verificationSchema = z.object({
    verificationCode: z.string().length(4, "Enter the 4-digit code sent to your email"),
  });

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const verificationForm = useForm({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  const handleLogoClick = () => {
    navigate(logo_link);
  };

  const handleLinkClick = (url) => {
    navigate(url);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSignupError(null);

    try {
      const [success, errorMessage] = await handleSignup(data);

      if (success) {
        // Move to email verification
        setShowVerification(true);
      } else {
        // Show error message
        setSignupError(errorMessage);
      }
    } catch (error) {
      setSignupError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onVerify = async (data) => {
    setIsConfirming(true);
    setConfirmError(null);

    try {
      const email = signupForm.getValues("email");
      const password = signupForm.getValues("password");
      const errorMessage = await handleConfirm(
        data.verificationCode,
        email,
        password
      );

      if (errorMessage) {
        setConfirmError(errorMessage);
      } else {
        toast({
          title: "Success",
          description: "Email verified successfully!",
        });
        navigate(signin_link);
      }
    } catch (error) {
      setConfirmError("An unexpected error occurred. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  const onResendCode = async () => {
    try {
      await handleResend();
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
              <UserPlus className="w-4 h-4" />
              {showVerification ? "Verify Email" : "Join JoinEazy"}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {showVerification ? "Confirm Your Email" : "Create Your Account"}
            </h1>
            <p className="text-slate-600">
              {showVerification 
                ? "Enter the verification code sent to your email"
                : "Start your journey with seamless team collaboration"
              }
            </p>
          </div>

          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              {!showVerification ? (
                <Form {...signupForm}>
                  <form
                    onSubmit={signupForm.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={signupForm.control}
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
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold text-sm">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                className="pl-12 pr-12 h-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 placeholder:text-slate-400"
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
                    {signupError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-600 text-sm text-center">
                          {signupError}
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
                          Creating account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Create Account
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-slate-600 text-sm">
                        Already have an account?{" "}
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

                    {/* Terms and Conditions */}
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                      <p className="text-slate-600 text-xs text-center leading-relaxed">
                        By creating an account, you agree to our{" "}
                        <Button
                          type="button"
                          variant="link"
                          className="text-blue-600 hover:text-blue-700 p-0 h-auto text-xs font-medium"
                          onClick={() => handleLinkClick(terms_link)}
                        >
                          Terms of Service
                        </Button>{" "}
                        and{" "}
                        <Button
                          type="button"
                          variant="link"
                          className="text-blue-600 hover:text-blue-700 p-0 h-auto text-xs font-medium"
                          onClick={() => handleLinkClick(privacy_link)}
                        >
                          Privacy Policy
                        </Button>
                      </p>
                    </div>
                  </form>
                </Form>
              ) : (
                <Form {...verificationForm}>
                  <form
                    onSubmit={verificationForm.handleSubmit(onVerify)}
                    className="space-y-6"
                  >
                    <FormField
                      control={verificationForm.control}
                      name="verificationCode"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold text-sm">
                            Verification Code
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                              <input
                                type="text"
                                placeholder="Enter 4-digit code"
                                value={verificationForm.watch("verificationCode") || ""}
                                className="pl-12 pr-4 h-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 placeholder:text-slate-400 w-full text-center text-lg font-mono tracking-widest"
                                onChange={(e) => {
                                  const filteredValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                                  verificationForm.setValue("verificationCode", filteredValue);
                                }}
                                autoComplete="off"
                                maxLength={4}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    {/* Error Message */}
                    {confirmError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-600 text-sm text-center">
                          {confirmError}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      disabled={isConfirming}
                    >
                      {isConfirming ? (
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
                        className="text-slate-600 hover:text-slate-800 p-0 h-auto text-sm"
                        onClick={() => handleLinkClick(back_link)}
                      >
                        ← Back to Sign up
                      </Button>
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
