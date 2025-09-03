"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

interface LoginFormState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string;
  success: string;
  shouldRedirect: boolean;
  rememberMe: boolean;
}

export default function LoginForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [state, setState] = useState<LoginFormState>({
    email: "",
    password: "",
    isLoading: false,
    error: "",
    success: "",
    shouldRedirect: false,
    rememberMe: false,
  });

  // Handle navigation when authenticated
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/profile");
    }
  }, [status, session, router]);

  // Handle redirect after successful login
  useEffect(() => {
    if (state.shouldRedirect) {
      const timer = setTimeout(() => {
        router.push("/profile");
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [state.shouldRedirect, router]);

  // Load saved credentials on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem('tribal-fashion-credentials');
    if (savedCredentials) {
      try {
        const { email, password, rememberMe } = JSON.parse(savedCredentials);
        if (rememberMe) {
          setState(prev => ({ ...prev, email, password, rememberMe }));
        }
      } catch (error) {
        console.error('Error loading saved credentials:', error);
        // Clear corrupted data
        localStorage.removeItem('tribal-fashion-credentials');
      }
    }
  }, []);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tribal-red"></div>
      </div>
    );
  }

  // Don't render form if already authenticated
  if (status === "authenticated" && session) {
    return null;
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): string | null => {
    if (!validateEmail(state.email)) {
      return "Please enter a valid email address";
    }
    if (!state.password) {
      return "Password is required";
    }
    return null;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form and get error message
    const validationError = validateForm();
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: "" }));

    try {
      const result = await signIn("credentials", {
        email: state.email,
        password: state.password,
        redirect: false,
      });

      if (result?.error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Invalid email or password"
        }));
      } else {
        // Save credentials if "Remember Me" is checked
        if (state.rememberMe) {
          const credentials = {
            email: state.email,
            password: state.password,
            rememberMe: true
          };
          localStorage.setItem('tribal-fashion-credentials', JSON.stringify(credentials));
        } else {
          // Clear saved credentials if "Remember Me" is unchecked
          localStorage.removeItem('tribal-fashion-credentials');
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          success: "Login successful! Redirecting...",
          shouldRedirect: true
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Login failed. Please try again."
      }));
    }
  };

  const handleGoogleLogin = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: "" }));
    
    try {
      const result = await signIn("google", { callbackUrl: "/profile" });
      if (result?.error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Google login failed. Please try again."
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Google login failed. Please try again."
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEmailLogin(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light flex items-center justify-center px-4 py-8">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8 relative overflow-hidden max-w-md w-full">
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
        
        {/* Welcome Section */}
        <div className="relative text-center mb-8">
          {/* Welcome Text */}
          <h1 className="text-5xl font-tribal text-tribal-dark mb-3 tracking-widest">Welcome</h1>
          <p className="text-sm text-tribal-brown opacity-80 font-medium">Sign in to your Kinir account</p>
        </div>

        {/* Error and Success Messages */}
        {state.error && (
          <div className="mb-4 p-3 bg-red-100/80 backdrop-blur-sm border border-red-400/50 text-red-700 rounded-xl text-sm">
            {state.error}
          </div>
        )}
        
        {state.success && (
          <div className="mb-4 p-3 bg-green-100/80 backdrop-blur-sm border border-green-400/50 text-green-700 rounded-xl text-sm">
            {state.success}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4 relative z-10">
          {/* Email Input */}
          <input
            type="email"
            value={state.email}
            onChange={(e) => {
              if (state.error) {
                setState(prev => ({ ...prev, email: e.target.value, error: "" }));
              } else {
                setState(prev => ({ ...prev, email: e.target.value }));
              }
              
              // If user manually types and has saved credentials, uncheck "Remember Me"
              if (state.rememberMe && e.target.value !== state.email) {
                setState(prev => ({ ...prev, rememberMe: false }));
                localStorage.removeItem('tribal-fashion-credentials');
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="Email"
            className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
            required
          />
          
          {/* Password Input */}
          <input
            type="password"
            value={state.password}
            onChange={(e) => {
              if (state.error) {
                setState(prev => ({ ...prev, password: e.target.value, error: "" }));
              } else {
                setState(prev => ({ ...prev, password: e.target.value }));
              }
              
              // If user manually types and has saved credentials, uncheck "Remember Me"
              if (state.rememberMe && e.target.value !== state.password) {
                setState(prev => ({ ...prev, rememberMe: false }));
                localStorage.removeItem('tribal-fashion-credentials');
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="Password"
            className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
            required
          />
          
          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={state.rememberMe}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setState(prev => ({ ...prev, rememberMe: isChecked }));
                  
                  // If unchecking, clear saved credentials immediately
                  if (!isChecked) {
                    localStorage.removeItem('tribal-fashion-credentials');
                  }
                }}
                className="w-4 h-4 text-tribal-red bg-white/80 border-tribal-brown/30 rounded focus:ring-tribal-red focus:ring-2 focus:ring-offset-0 transition-all duration-300"
              />
              <span className="text-sm text-tribal-brown font-medium">Remember Me</span>
            </label>
            
            {/* Forgot Password Link */}
            <Link href="/forgot-password" className="text-sm text-tribal-red hover:text-tribal-red-accent underline transition-colors">
              Forgot Password?
            </Link>
          </div>
          
          {/* Sign In Button */}
          <button
            type="submit"
            disabled={state.isLoading}
            className="w-full bg-red-600/90 backdrop-blur-sm text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-red-700/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center border border-white/20"
          >
            {state.isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative z-10 my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/20 backdrop-blur-sm text-tribal-brown">or</span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={state.isLoading}
          className="w-full bg-white/90 backdrop-blur-sm text-gray-700 py-3 px-4 rounded-xl font-semibold text-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center border border-gray-300/50 space-x-3"
        >
          <Image src="/google.svg" alt="Google" width={20} height={20} />
          <span>Continue with Google</span>
        </button>
        
        {/* Sign Up Link */}
        <div className="text-center mt-6 relative z-10">
          <p className="text-sm text-tribal-brown opacity-80">
            Don't have an account?{" "}
            <Link href="/signup" className="text-tribal-red underline hover:text-tribal-red-accent font-medium transition-colors px-2 py-1 rounded-lg hover:bg-white/10 backdrop-blur-sm">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}