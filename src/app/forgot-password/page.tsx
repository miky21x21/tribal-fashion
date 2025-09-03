'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ForgotPasswordState {
  email: string;
  isLoading: boolean;
  error: string;
  success: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [state, setState] = useState<ForgotPasswordState>({
    email: '',
    isLoading: false,
    error: '',
    success: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(state.email)) {
      setState(prev => ({ ...prev, error: 'Please enter a valid email address' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: state.email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setState(prev => ({ 
          ...prev, 
          success: data.message || 'Password reset email sent successfully!',
          isLoading: false 
        }));
        
        // In development, show the reset link
        if (data.resetLink) {
          setState(prev => ({ 
            ...prev, 
            success: `${prev.success} Check the console for the reset link.`
          }));
        }
      } else {
        setState(prev => ({ 
          ...prev, 
          error: data.message || 'Failed to send password reset email',
          isLoading: false 
        }));
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'An error occurred. Please try again.',
        isLoading: false 
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-tribal-dark mb-2">
            Forgot Password
          </h2>
          <p className="text-tribal-brown text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {state.error}
          </div>
        )}

        {/* Success Message */}
        {state.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            {state.success}
          </div>
        )}

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <input
            type="email"
            value={state.email}
            onChange={(e) => setState(prev => ({ ...prev, email: e.target.value, error: '' }))}
            onKeyPress={handleKeyPress}
            placeholder="Email"
            className="w-full border border-tribal-brown/30 bg-white/80 backdrop-blur-sm text-tribal-dark py-3 px-4 rounded-xl text-sm font-medium placeholder-tribal-brown placeholder-opacity-60 focus:outline-none focus:border-tribal-red focus:ring-2 focus:ring-tribal-red/20 transition-all duration-300"
            required
          />
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={state.isLoading}
            className="w-full bg-tribal-red text-white py-3 px-4 rounded-xl text-sm font-medium hover:bg-tribal-red-accent focus:outline-none focus:ring-2 focus:ring-tribal-red focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-tribal-red hover:text-tribal-red-accent underline transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
