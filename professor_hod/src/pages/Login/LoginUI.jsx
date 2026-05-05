import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom"; // Changed from wouter
import { Eye, EyeOff, Mail, Lock, Loader2, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@/assets/images/Joineazy final-01.png";
import { z } from "zod";
import { useLocation } from "react-router-dom";

const loginSchema = z.object({
  email: z
    .string()
    .email("Email is invalid")
    .refine((val) => val.toLowerCase().endsWith("@mahindrauniversity.edu.in"), {
      message: "Use your @mahindrauniversity.edu.in email",
    }),
  password: z.string().min(1, "Password cannot be empty"),
  rememberMe: z.boolean().optional(),
});

export default function LoginUI({
  privacy_link,
  terms_link,
  guide_link,
  signup_link,
  forgot_password_link,
  logo_link,
  handleLogin,
  onLoginSuccess, // added
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Changed from useLocation
  const { toast } = useToast();
  const location = useLocation();
  const message = location.state?.message;

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const errorMessage = await handleLogin(data);
      if (errorMessage) {
        setLoginError(errorMessage);
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        // Call controller hook to process invitation tokens and navigate
        if (onLoginSuccess) {
          await onLoginSuccess({ email: data.email });
        }
      }
    } catch (error) {
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate(logo_link);
  };

  const handleLinkClick = (url) => {
    navigate(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

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
              <Sparkles className="w-4 h-4" />
              Welcome Back
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Sign in to JoinEazy
            </h1>
            <p className="text-slate-600">
              Continue your journey with seamless team collaboration
            </p>
          </div>

          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Show redirect message if present */}
                  {message && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-blue-800 text-sm text-center">{message}</p>
                    </div>
                  )}

                  <FormField
                    control={loginForm.control}
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
                              onChange={(e) => {
                                const lowerValue = e.target.value.toLowerCase();
                                e.target.value = lowerValue;
                                field.onChange(lowerValue);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
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
                              placeholder="Enter your password"
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

                  <div className="flex items-center justify-between">
                    <FormField
                      control={loginForm.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500 data-[state=checked]:border-0"
                            />
                          </FormControl>
                          <Label className="text-slate-600 text-sm font-medium">
                            Keep me signed in
                          </Label>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="link"
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm p-0 h-auto"
                      onClick={() => handleLinkClick(forgot_password_link)}
                    >
                      Forgot Password?
                    </Button>
                  </div>

                  {/* Error Message */}
                  {loginError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-600 text-sm text-center">
                        {loginError}
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
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-slate-600 text-sm">
                  Don't have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="text-blue-600 hover:text-blue-700 font-semibold p-0 h-auto text-sm"
                    onClick={() => handleLinkClick(signup_link)}
                  >
                    Sign up now
                  </Button>
                </p>
              </div>

              {/* Security notice */}
              <div className="mt-6 p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  <Shield className="w-4 h-4" />
                  <span>This site is protected by reCAPTCHA and Google's Privacy Policy</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CSS animations moved to global styles or use Tailwind's built-in animations */}
    </div>
  );
}
