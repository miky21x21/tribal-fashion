'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tribal-red mx-auto"></div>
          <p className="mt-4 text-tribal-dark text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-tribal-dark mb-4">
              🎉 Welcome to Your Dashboard!
            </h1>
            <p className="text-lg text-tribal-brown">
              You have successfully signed in with {session.provider || 'OAuth'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-tribal-dark mb-4">
                👤 User Information
              </h2>
              <div className="space-y-3 text-tribal-brown">
                <div><strong>Email:</strong> {session.user?.email || 'Not provided'}</div>
                <div><strong>Name:</strong> {session.user?.name || 'Not provided'}</div>
                <div><strong>Provider:</strong> {session.provider || 'Unknown'}</div>
                <div><strong>Access Token:</strong> {session.accessToken ? '✅ Present' : '❌ Not present'}</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-tribal-dark mb-4">
                🔐 Session Details
              </h2>
              <div className="space-y-3 text-tribal-brown">
                <div><strong>Status:</strong> <span className="text-green-600 font-semibold">✅ Authenticated</span></div>
                <div><strong>Strategy:</strong> JWT</div>
                <div><strong>Expires:</strong> {session.expires || 'Unknown'}</div>
              </div>
            </div>
          </div>

          <div className="bg-green-100/20 backdrop-blur-sm rounded-2xl p-6 border border-green-300/30">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              🎯 OAuth Success!
            </h2>
            <p className="text-green-700">
              Your Google OAuth integration is working perfectly! The middleware is recognizing your NextAuth session and allowing access to protected routes.
            </p>
          </div>

          <div className="text-center mt-8 space-y-4">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-tribal-red/90 backdrop-blur-sm text-white py-3 px-8 rounded-xl font-semibold hover:bg-tribal-red-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
            >
              Sign Out
            </button>
            
            <div className="flex justify-center space-x-4">
              <a 
                href="/shop" 
                className="bg-tribal-green/90 backdrop-blur-sm text-white py-2 px-6 rounded-lg font-semibold hover:bg-royal-green/90 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
              >
                Go to Shop
              </a>
              <a 
                href="/profile" 
                className="bg-tribal-blue/90 backdrop-blur-sm text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-600/90 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
              >
                View Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
