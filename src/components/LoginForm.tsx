"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
  showForgotPassword: boolean;
  resetEmail: string;
  isLoginLoading: boolean;
  isGoogleLoading: boolean;
  isAppleLoading: boolean;
  isForgotPasswordLoading: boolean;
  error: string;
  success: string;
  showProfileCompletion: boolean;
  firstName: string;
  lastName: string;
  profileEmail: string;
}

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  profileComplete: boolean;
}

interface LoginFormProps {
  onLogin?: (token: string, user: User) => void;
  onProfileComplete?: (userData: User) => void;
}

export default function LoginForm({ onLogin, onProfileComplete }: LoginFormProps) {
  const [state, setState] = useState<LoginFormState>({
    email: "",
    password: "",
    rememberMe: false,
    showForgotPassword: false,
    resetEmail: "",
    isLoginLoading: false,
    isGoogleLoading: false,
    isAppleLoading: false,
    isForgotPasswordLoading: false,
    error: "",
    success: "",
    showProfileCompletion: false,
    firstName: "",
    lastName: "",
    profileEmail: "",
  });

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      setState(prev => ({
        ...prev,
        email: savedEmail,
        rememberMe: true
      }));
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setState(prev => ({
      ...prev,
      email,
      error: ""
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setState(prev => ({
      ...prev,
      password,
      error: ""
    }));
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      rememberMe: e.target.checked
    }));
  };

  const handleEmailLogin = async () => {
    if (!validateEmail(state.email) || !state.password) {
      setState(prev => ({
        ...prev,
        error: "Please enter a valid email and password"
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoginLoading: true, error: "" }));
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: state.email,
          password: state.password
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Handle remember me functionality
        if (state.rememberMe) {
          localStorage.setItem('rememberEmail', state.email);
        } else {
          localStorage.removeItem('rememberEmail');
        }
        
        setState(prev => ({ ...prev, isLoginLoading: false }));
        onLogin?.(data.data.token, data.data.user);
      } else {
        setState(prev => ({
          ...prev,
          isLoginLoading: false,
          error: data.message || 'Invalid email or password'
        }));
      }
    } catch {
      setState(prev => ({
        ...prev,
        isLoginLoading: false,
        error: 'Network error. Please try again.'
      }));
    }
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(state.resetEmail)) {
      setState(prev => ({
        ...prev,
        error: "Please enter a valid email address"
      }));
      return;
    }

    setState(prev => ({ ...prev, isForgotPasswordLoading: true, error: "", success: "" }));
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: state.resetEmail
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          isForgotPasswordLoading: false,
          success: "Password reset link sent to your email",
          showForgotPassword: false,
          resetEmail: ""
        }));
      } else {
        setState(prev => ({
          ...prev,
          isForgotPasswordLoading: false,
          error: data.message || 'Failed to send reset email'
        }));
      }
    } catch {
      setState(prev => ({
        ...prev,
        isForgotPasswordLoading: false,
        error: 'Network error. Please try again.'
      }));
    }
  };

  const handleGoogleLogin = async () => {
    setState(prev => ({ ...prev, isGoogleLoading: true, error: "" }));
    
    try {
      // Redirect to Google OAuth or integrate with Google OAuth library
      window.location.href = '/api/auth/google';
    } catch {
      setState(prev => ({
        ...prev,
        isGoogleLoading: false,
        error: 'Google login failed. Please try again.'
      }));
    }
  };

  const handleAppleLogin = async () => {
    setState(prev => ({ ...prev, isAppleLoading: true, error: "" }));
    
    try {
      // This would integrate with Apple Sign In
      // For now, simulate the process
      setState(prev => ({ ...prev, isAppleLoading: false, error: "Apple Sign In integration pending" }));
    } catch {
      setState(prev => ({
        ...prev,
        isAppleLoading: false,
        error: 'Apple login failed. Please try again.'
      }));
    }
  };

  const handleProfileComplete = async () => {
    if (!state.firstName.trim() || !state.lastName.trim()) {
      setState(prev => ({ ...prev, error: "First name and last name are required" }));
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.profileEmail
        })
      });

      const data = await response.json();
      
      if (data.success) {
        onProfileComplete?.(data.data.user);
      } else {
        setState(prev => ({ ...prev, error: data.message || 'Failed to update profile' }));
      }
    } catch {
      setState(prev => ({ ...prev, error: 'Network error. Please try again.' }));
    }
  };

  const toggleForgotPassword = () => {
    setState(prev => ({
      ...prev,
      showForgotPassword: !prev.showForgotPassword,
      error: "",
      success: "",
      resetEmail: ""
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (state.showForgotPassword) {
        handleForgotPassword();
      } else {
        handleEmailLogin();
      }
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8 relative overflow-hidden max-w-md mx-auto">
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
      
      {/* Welcome Section */}
      <div className="relative text-center mb-8">
        {/* Welcome Text */}
        <h1 className="text-7xl font-kiner text-tribal-dark font-bold mb-3 uppercase tracking-widest">Welcome</h1>
        <p className="text-sm text-tribal-brown opacity-80 font-medium">Please enter your details</p>
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

      {/* Profile Completion Form */}
      {state.showProfileCompletion && (
        <div className="space-y-4 relative z-10">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-tribal-dark">Complete Your Profile</h3>
            <p className="text-sm text-tribal-brown opacity-80">Help us personalize your experience</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={state.firstName}
              onChange={(e) => setState(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="First Name"
              className="border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
            />
            <input
              type="text"
              value={state.lastName}
              onChange={(e) => setState(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Last Name"
              className="border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
            />
          </div>
          
          <input
            type="email"
            value={state.profileEmail}
            onChange={(e) => setState(prev => ({ ...prev, profileEmail: e.target.value }))}
            placeholder="Email (optional)"
            className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
          />
          
          <button
            onClick={handleProfileComplete}
            className="w-full bg-tribal-green/90 backdrop-blur-sm text-tribal-cream py-3 px-4 rounded-xl font-bold text-sm hover:bg-royal-green/90 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* Main Login Form */}
      {!state.showProfileCompletion && (
        <div className="space-y-4 relative z-10">
          
          {/* Forgot Password Form */}
          {state.showForgotPassword ? (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-tribal-dark">Reset Password</h3>
                <p className="text-sm text-tribal-brown opacity-80">Enter your email to receive reset instructions</p>
              </div>
              
              <input
                type="email"
                value={state.resetEmail}
                onChange={(e) => setState(prev => ({ ...prev, resetEmail: e.target.value, error: "" }))}
                onKeyPress={handleKeyPress}
                placeholder="Email address"
                className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
              />
              
              <button
                onClick={handleForgotPassword}
                disabled={state.isForgotPasswordLoading}
                className="w-full bg-tribal-red/90 backdrop-blur-sm text-tribal-cream py-3 px-4 rounded-xl font-bold text-sm hover:bg-tribal-red-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center border border-white/20"
              >
                {state.isForgotPasswordLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-tribal-cream"></div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
              
              <button
                onClick={toggleForgotPassword}
                className="w-full text-tribal-brown text-sm underline hover:text-tribal-red transition-colors py-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            /* Email/Password Login Form */
            <div className="space-y-4">
              
              {/* Email Input */}
              <input
                type="email"
                value={state.email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                placeholder="Email"
                className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
              />
              
              {/* Password Input */}
              <input
                type="password"
                value={state.password}
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
                placeholder="Password"
                className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
              />
              
              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.rememberMe}
                    onChange={handleRememberMeChange}
                    className="w-4 h-4 text-tribal-red bg-white/80 backdrop-blur-sm border border-tribal-brown/30 rounded-md focus:ring-tribal-red focus:ring-2 transition-all duration-300"
                  />
                  <span className="text-sm text-tribal-brown">Remember me</span>
                </label>
                
                <button
                  onClick={toggleForgotPassword}
                  className="text-sm text-tribal-red underline hover:text-tribal-red-accent transition-colors px-2 py-1 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                >
                  Forgot password?
                </button>
              </div>
              
              {/* Sign In Button */}
              <button
                onClick={handleEmailLogin}
                disabled={state.isLoginLoading}
                className="w-full bg-red-600/90 backdrop-blur-sm text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-red-700/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center border border-white/20"
              >
                {state.isLoginLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Sign In"
                )}
              </button>
              
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-tribal-brown opacity-30"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-tribal-cream/80 backdrop-blur-sm text-tribal-brown font-medium rounded-lg">or</span>
                </div>
              </div>
              
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={state.isGoogleLoading}
                className="w-full bg-white/90 backdrop-blur-sm border border-gray-300/50 text-gray-700 py-3 px-4 rounded-xl font-semibold text-sm hover:bg-gray-50/90 hover:border-gray-400/50 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                {state.isGoogleLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>

              {/* Apple Sign In Button */}
              <button
                onClick={handleAppleLogin}
                disabled={state.isAppleLoading}
                className="w-full bg-black/90 backdrop-blur-sm text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-gray-800/90 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 border border-white/10"
              >
                {state.isAppleLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span>Sign in with Apple ID</span>
                  </>
                )}
              </button>
              
              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-tribal-brown opacity-80">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-tribal-red underline hover:text-tribal-red-accent font-medium transition-colors">
                    Sign up for free!
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Decorative tribal elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 border-4 border-tribal-red transform rotate-45 opacity-30"></div>
      <div className="absolute -top-4 -right-4 w-8 h-8 border-4 border-tribal-red transform rotate-45 opacity-30"></div>
      <div className="absolute -bottom-4 -left-4 w-8 h-8 border-4 border-tribal-red transform rotate-45 opacity-30"></div>
      <div className="absolute -bottom-4 -right-4 w-8 h-8 border-4 border-tribal-red transform rotate-45 opacity-30"></div>
    </div>
  );
}