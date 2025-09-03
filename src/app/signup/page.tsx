"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SignUpFormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  isLoading: boolean;
  error: string;
  success: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const [state, setState] = useState<SignUpFormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    isLoading: false,
    error: "",
    success: "",
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    if (!state.firstName.trim()) {
      setState(prev => ({ ...prev, error: "First name is required" }));
      return false;
    }
    if (!state.lastName.trim()) {
      setState(prev => ({ ...prev, error: "Last name is required" }));
      return false;
    }
    if (!validateEmail(state.email)) {
      setState(prev => ({ ...prev, error: "Please enter a valid email address" }));
      return false;
    }
    if (state.password.length < 6) {
      setState(prev => ({ ...prev, error: "Password must be at least 6 characters long" }));
      return false;
    }
    if (state.password !== state.confirmPassword) {
      setState(prev => ({ ...prev, error: "Passwords do not match" }));
      return false;
    }
    if (!state.agreeToTerms) {
      setState(prev => ({ ...prev, error: "Please agree to the terms and conditions" }));
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setState(prev => ({ ...prev, isLoading: true, error: "" }));
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.email,
          password: state.password
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          success: "Account created successfully! Redirecting to login..."
        }));
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: data.message || 'Failed to create account'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Network error. Please try again.'
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSignUp(e as any);
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
          <h1 className="text-5xl font-tribal text-tribal-dark mb-3 tracking-widest">Sign Up</h1>
          <p className="text-sm text-tribal-brown opacity-80 font-medium">Join the tribal fashion community</p>
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

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-4 relative z-10">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={state.firstName}
              onChange={(e) => setState(prev => ({ ...prev, firstName: e.target.value, error: "" }))}
              onKeyPress={handleKeyPress}
              placeholder="First Name"
              className="border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
              required
            />
            <input
              type="text"
              value={state.lastName}
              onChange={(e) => setState(prev => ({ ...prev, lastName: e.target.value, error: "" }))}
              onKeyPress={handleKeyPress}
              placeholder="Last Name"
              className="border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
              required
            />
          </div>
          
          {/* Email Input */}
          <input
            type="email"
            value={state.email}
            onChange={(e) => setState(prev => ({ ...prev, email: e.target.value, error: "" }))}
            onKeyPress={handleKeyPress}
            placeholder="Email"
            className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
            required
          />
          
          {/* Password Input */}
          <input
            type="password"
            value={state.password}
            onChange={(e) => setState(prev => ({ ...prev, password: e.target.value, error: "" }))}
            onKeyPress={handleKeyPress}
            placeholder="Password (min. 6 characters)"
            className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
            required
          />
          
          {/* Confirm Password Input */}
          <input
            type="password"
            value={state.confirmPassword}
            onChange={(e) => setState(prev => ({ ...prev, confirmPassword: e.target.value, error: "" }))}
            onKeyPress={handleKeyPress}
            placeholder="Confirm Password"
            className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
            required
          />
          
          {/* Terms Agreement */}
          <label className="flex items-start space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.agreeToTerms}
              onChange={(e) => setState(prev => ({ ...prev, agreeToTerms: e.target.checked, error: "" }))}
              className="w-4 h-4 text-tribal-red bg-white/80 backdrop-blur-sm border border-tribal-brown/30 rounded-md focus:ring-tribal-red focus:ring-2 transition-all duration-300 mt-0.5"
              required
            />
            <span className="text-sm text-tribal-brown">
              I agree to the{" "}
              <Link href="/terms" className="text-tribal-red underline hover:text-tribal-red-accent">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-tribal-red underline hover:text-tribal-red-accent">
                Privacy Policy
              </Link>
            </span>
          </label>
          
          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={state.isLoading}
            className="w-full bg-red-600/90 backdrop-blur-sm text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-red-700/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center border border-white/20"
          >
            {state.isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Create Account"
            )}
          </button>
          
          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-tribal-brown opacity-80">
              Already have an account?{" "}
              <Link href="/login" className="text-tribal-red underline hover:text-tribal-red-accent font-medium transition-colors px-2 py-1 rounded-lg hover:bg-white/10 backdrop-blur-sm">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}